#!/usr/bin/env node
/* ============================================================
   pregen-audio.js —— 预生成离线音频包
   ------------------------------------------------------------
   为什么需要这个脚本：

   在线发音代理（tts-server.js）音质最好，但要求「手机能连到电脑上
   跑着的服务」。这条链在真实网络里很脆弱：

     · Windows 防火墙拦截 8788 端口（最常见）
     · 路由器开了 AP 隔离 / 访客网络
     · 公司与校园网禁止设备互访
     · 手机走蜂窝数据而非 WiFi

   一旦连不上，手机上通常也没有英语语音包（WebView 不实现
   Web Speech API，浏览器则常常缺英语包），结果就是「点了没声音」。

   所以给最高频的词做一份**预生成音频**直接打进安装包：
   不需要电脑、不需要网络、不需要任何服务。

   体积控制（实测）：
     96kbps 平均 21.2KB/词 → L1+L2 共 616 词约 12.7MB
     若全量 1456 词则约 30MB，APK 会过大，故只取 L1/L2。

   用法：
     node tools/pregen-audio.js            # 只补缺失的（默认）
     node tools/pregen-audio.js --force    # 全部重生成
     node tools/pregen-audio.js --limit 50 # 只生成 50 个，调试用
   ============================================================ */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'assets', 'audio', 'words');
const CACHE_DIR = path.join(__dirname, '.tts-cache');
const MANIFEST = path.join(ROOT, 'assets', 'audio', 'manifest.js');

/* 与 tts-server.js 保持一致：采样率被服务端锁在 24kHz，
   96kbps 是可用上限，48kHz 全系列直接被关闭连接。 */
const AUDIO_FORMAT = 'audio-24khz-96kbitrate-mono-mp3';
const VOICE = 'en-US-AriaNeural';

/* 只覆盖 L1 + L2 —— 学习优先级最高，且体积可接受 */
const LEVELS = ['L1', 'L2'];

const argv = process.argv.slice(2);
const FORCE = argv.includes('--force');
const LIMIT = (() => {
  const i = argv.indexOf('--limit');
  return i > -1 ? parseInt(argv[i + 1], 10) : 0;
})();

/* ---------- 读取词汇数据 ---------- */
function loadWords() {
  const dataDir = path.join(ROOT, 'assets', 'js', 'data');
  const g = {};
  const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.js'));
  // 数据文件都是 `window.X = {...}` 形式，用 vm 在隔离上下文里求值，
  // 直接 eval 会污染当前作用域，也拿不到 window。
  const vm = require('vm');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  for (const f of files) {
    const src = fs.readFileSync(path.join(dataDir, f), 'utf8');
    try { vm.runInContext(src, sandbox, { timeout: 5000 }); } catch (e) { /* 单文件失败不影响其他 */ }
  }
  const V = sandbox.window.VOCAB_DATA;
  if (!V || !Array.isArray(V.words)) {
    throw new Error('读不到 VOCAB_DATA.words，请确认 assets/js/data/words.js 存在');
  }
  return V.words.filter(w => w && w.lv && LEVELS.indexOf(w.lv) > -1 && w.w);
}

/* ---------- 文件名 ----------
   不能直接用词本身做文件名：
     · 'a-b' 与 'a_b' 在某些文件系统上会撞车
     · 撇号 ' 在 URL 里必须转义，容易出错
   统一用 sha1 前 12 位，映射关系写进 manifest，前端按同一算法查。 */
const crypto = require('crypto');
function fileKey(text) {
  return crypto.createHash('sha1')
    .update(VOICE + '|' + text)
    .digest('hex')
    .slice(0, 12);
}

/* ---------- 主流程 ---------- */
async function main() {
  /* msedge-tts 导出的是 { MsEdgeTTS }，不是构造函数本身 */
  const msedge = require('msedge-tts');
  const MsEdgeTTS = msedge.MsEdgeTTS;
  if (!MsEdgeTTS) throw new Error('msedge-tts 未安装：请在 tools/ 下执行 npm install msedge-tts');

  const all = loadWords();
  const targets = LIMIT ? all.slice(0, LIMIT) : all;

  console.log('');
  console.log('[pregen] 离线音频包生成');
  console.log('  词表：' + LEVELS.join(' + ') + ' 共 ' + all.length + ' 词'
    + (LIMIT ? '（本次只做 ' + LIMIT + ' 个）' : ''));
  console.log('  音色：' + VOICE);
  console.log('  格式：' + AUDIO_FORMAT);
  console.log('  输出：' + OUT_DIR);
  console.log('');

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  /* 复用已建立的连接，避免同一批词被合成两次。
     setMetadata 是异步的且每个新连接都得调一次，
     漏掉会直接抛 "Speech synthesis not configured yet"。 */
  let tts = null;
  let ttsReady = null;
  async function getTTS() {
    if (ttsReady) {
      try { return await ttsReady; } catch (e) { /* 断了则重建 */ }
    }
    ttsReady = (async () => {
      tts = new MsEdgeTTS();
      await tts.setMetadata(VOICE, AUDIO_FORMAT);
      return tts;
    })();
    return ttsReady;
  }

  function connBrokenReset() { tts = null; ttsReady = null; }

  async function synth(text) {
    const esc = s => String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" '
      + 'xml:lang="en-US"><voice name="' + VOICE + '">'
      + '<prosody rate="+0%">' + esc(text) + '</prosody></voice></speak>';

    const attempt = async () => {
      const e = await getTTS();
      const { audioStream } = await e.rawToStream(ssml);
      const chunks = [];
      for await (const c of audioStream) chunks.push(c);
      return Buffer.concat(chunks);
    };

    /* 上游限流较严，密集请求会 ECONNRESET / 提前关流。
       这里用与 tts-server.js 相同的退避策略。 */
    let lastErr = null;
    for (let i = 1; i <= 3; i++) {
      try {
        const buf = await attempt();
        if (buf && buf.length > 200) return buf;
        lastErr = new Error('empty audio');
      } catch (err) {
        lastErr = err;
        const s = String(err && err.message || err);
        if (!/ECONNRESET|Stream closed|turn\.end|socket hang up|ETIMEDOUT|429|503/i.test(s)) throw err;
      }
      connBrokenReset();
      if (i < 3) await new Promise(r => setTimeout(r, 800 * Math.pow(2, i - 1) + Math.floor(Math.random() * 300)));
    }
    throw lastErr || new Error('synthesis failed');
  }

  /* 调 tts-server.js 的内部算法保持一致（缩写展开等） */
  const ABBR = [
    [/\bMr\./g, 'Mister'], [/\bMrs\./g, 'Missus'], [/\bMs\./g, 'Miss'],
    [/\bDr\./g, 'Doctor'], [/\bProf\./g, 'Professor'],
    [/\bSt\./g, 'Saint'], [/\bvs\.?\b/g, 'versus'],
    [/\be\.g\./gi, 'for example'], [/\bi\.e\./gi, 'that is'],
    [/\betc\./gi, 'et cetera'], [/\bapprox\./gi, 'approximately'],
    [/\bNo\./g, 'number']
  ];
  function prepText(text) {
    let s = String(text || '').replace(/[''`]/g, "'");
    for (const [re, to] of ABBR) s = s.replace(re, to);
    s = s.replace(/&/g, ' and ').replace(/%/g, ' percent ')
         .replace(/\+/g, ' plus ').replace(/=/g, ' equals ')
         .replace(/@/g, ' at ').replace(/\$/g, ' dollars ')
         .replace(/~/g, ' to ');
    return s.replace(/\s+/g, ' ').trim();
  }

  const manifest = { format: AUDIO_FORMAT, voice: VOICE, levels: LEVELS, words: {}, count: 0 };
  let made = 0, skip = 0, fail = 0, bytes = 0;
  const failures = [];

  for (let i = 0; i < targets.length; i++) {
    const w = targets[i];
    const key = fileKey(w.w);
    const file = path.join(OUT_DIR, key + '.mp3');

    let ok = fs.existsSync(file) && fs.statSync(file).size > 200;
    if (ok && !FORCE) {
      manifest.words[w.w] = key;
      skip++; bytes += fs.statSync(file).size;
      continue;
    }
    if (ok && FORCE) ok = false;

    if (!ok) {
      try {
        const buf = await synth(prepText(w.w));
        fs.writeFileSync(file, buf);
        bytes += buf.length;
        made++;
      } catch (e) {
        fail++; failures.push(w.w + ' (' + (e.message || e) + ')');
        if (fail > 12) {
          console.log('  失败过多，中止。');
          break;
        }
        continue;
      }
    }
    manifest.words[w.w] = key;

    if ((i + 1) % 10 === 0 || i === targets.length - 1) {
      const pct = ((i + 1) / targets.length * 100).toFixed(0);
      console.log('  [' + pct + '%] ' + (i + 1) + '/' + targets.length
        + '  新建 ' + made + ' 复用 ' + skip + ' 失败 ' + fail
        + '  共 ' + (bytes / 1024 / 1024).toFixed(1) + 'MB');
    }
  }

  /* 断点续跑：把已有文件并进 manifest，
     否则中途 Ctrl+C 会导致之前生成好的词查不到。 */
  for (const w of all) {
    if (manifest.words[w.w]) continue;
    const k = fileKey(w.w);
    const f = path.join(OUT_DIR, k + '.mp3');
    if (fs.existsSync(f) && fs.statSync(f).size > 200) {
      manifest.words[w.w] = k;
      if (LIMIT) { skip++; bytes += fs.statSync(f).size; }
    }
  }
  manifest.count = Object.keys(manifest.words).length;

  fs.writeFileSync(MANIFEST,
    '/* 自动生成，勿手改。重新生成：node tools/pregen-audio.js */\n'
    + 'window.AUDIO_PACK = ' + JSON.stringify(manifest) + ';\n');

  console.log('');
  console.log('  完成：清单 ' + manifest.count + ' 词'
    + '（新建 ' + made + '，复用 ' + skip + '，失败 ' + fail + '）');
  console.log('  音频体积：' + (bytes / 1024 / 1024).toFixed(1) + 'MB');
  console.log('  清单文件：' + path.relative(ROOT, MANIFEST));
  if (failures.length) {
    console.log('');
    console.log('  失败明细（前 12 条）：');
    failures.slice(0, 12).forEach(f => console.log('    · ' + f));
    console.log('  重跑本脚本即可只补这些缺失的。');
  }
  console.log('');
}

main().catch(e => {
  console.error('[pregen] 失败：' + (e && e.message || e));
  process.exit(1);
});
