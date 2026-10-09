/* ============================================================
   tts-server.js —— 发音代理服务
   ------------------------------------------------------------
   为什么需要它：

   浏览器里能用的免费发音方案只有 Web Speech API，
   但它有三个绕不过去的问题：
     1. 语音来自操作系统。Windows 有、macOS 有、部分安卓没有，
        无头/精简版系统上 getVoices() 返回空 → 完全静默。
     2. 音色因设备而异，无法保证学习者听到的是标准音。
     3. 无法录音、无法离线、无法缓存。

   而直接调 Edge TTS（微软的免费神经语音）有三个障碍：
     1. 合成端点需要动态生成的 Sec-MS-GEC 令牌，只能在服务端算。
     2. 响应没有 CORS 头，浏览器直连会被拦。
     3. 音频不缓存的话，每次点「朗读」都要重新合成，延迟高且
        反复打同一个上游。

   所以本服务做三件事：算令牌、加 CORS、加磁盘缓存。
   上游：Edge Neural TTS（免费、无需密钥、英美音色齐全）。

   用法：
     node tts-server.js                # 监听 8788
     PORT=9000 node tts-server.js      # 换端口
     node tts-server.js --port 8788    # 同上

   接口：
     GET /tts?text=...&voice=en-US-AriaNeural&rate=+0%
         → audio/mpeg（命中缓存时带 X-Cache: HIT）

     GET /health
         → { ok: true, cached: n }

     GET /voices
         → { ok: true, voices: [可用英文音色（含用途说明与推荐标记）], format }

   音质（实测结论，改动前务必先读）：
     · 采样率被服务端锁在 24kHz，audio-48khz-* 全系列会让服务端直接断连
     · 码率可用 48kbps（真实 80k，音质发闷）与 96kbps（真实 160k，当前采用）
     · SSML 必须极简：<break>、<mstts:express-as>、prosody 置于 voice 外层都会被拒
     · 上游对密集请求会 ECONNRESET，已加退避重试
     · en-US-JaneNeural、en-US-EvanNeural 实测不可用，不要加回VOICES
   ============================================================ */

'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

/* ---------- 可选依赖：msedge-tts ---------- */
let MsEdgeTTS = null;
let OUTPUT_FORMAT = null;
try {
  const mod = require('msedge-tts');
  MsEdgeTTS = mod.MsEdgeTTS;
  OUTPUT_FORMAT = mod.OUTPUT_FORMAT;
} catch (e) {
  // 依赖缺失时服务仍可启动，但 /tts 会返回明确错误而不是崩溃
}

/* ---------- 配置 ---------- */
function argPort() {
  const i = process.argv.indexOf('--port');
  if (i > -1 && process.argv[i + 1]) return parseInt(process.argv[i + 1], 10);
  if (process.env.PORT) return parseInt(process.env.PORT, 10);
  return 8788;
}
const PORT = argPort();
const CACHE_DIR = path.join(__dirname, '.tts-cache');
const CACHE_MAX = 800;          // 内存索引上限（磁盘不受限）
const MAX_TEXT = 600;           // 单次合成的字符上限

/* ---------- 音频格式 ----------
   默认 48kbps 是「能出声就够」的选择，对学习场景明显不够：
   高频泛音被砍掉，齿音和摩擦音发糊，元音听起来发闷。

   实测结论（服务端限制）：
     - audio-24khz-48kbitrate-mono-mp3 → 真实码率 80kbps
     - audio-24khz-96kbitrate-mono-mp3 → 真实码率 160kbps，可用
     - audio-48khz-* 系列         → 服务端直接关闭连接，全部不可用
   即采样率被锁在 24kHz，只能靠码率翻倍来提升。96k 是可用范围内的上限。

   这个常量必须定义在 cacheKey 之前：缓存键要用它当版本号。*/
const AUDIO_FORMAT = 'audio-24khz-96kbitrate-mono-mp3';
const RATE_LIMIT = 240;         // 每分钟最多请求数
const MAX_BODY = 1 * 1024 * 1024;

/* 允许的英美音色。挑的都是 Natural 系列（神经语音），
   不用 Standard —— 后者是旧式拼接音，学习者听着刺耳。*/
const VOICES = {
  /* 排序即设置页的展示顺序，不按字母排。
     顺序原则：把「最适合学英语」的音色放最前——这类音色咬字清晰、
     语速偏慢、不会连读到听不清；不推荐的自然音色往后放。
     每条都标了 role，前端据此显示用途说明。*/
  'en-US-AriaNeural': {
    lang: 'en-US', gender: 'Female', recommended: true,
    label: 'Aria', region: '美音', regionEn: 'US',
    desc: '自然清晰，最适合跟读', role: 'recommend'
  },
  'en-GB-SoniaNeural': {
    lang: 'en-GB', gender: 'Female', recommended: true,
    label: 'Sonia', region: '英音', regionEn: 'UK',
    desc: '英音标准，适合英式发音学习', role: 'recommend'
  },
  'en-US-JennyNeural': {
    lang: 'en-US', gender: 'Female', recommended: true,
    label: 'Jenny', region: '美音', regionEn: 'US',
    desc: '讲解风格，语速适中偏慢', role: 'recommend'
  },
  'en-US-GuyNeural': {
    lang: 'en-US', gender: 'Male', recommended: true,
    label: 'Guy', region: '美音', regionEn: 'US',
    desc: '男声美音，清晰稳定', role: 'recommend'
  },
  'en-GB-RyanNeural': {
    lang: 'en-GB', gender: 'Male',
    label: 'Ryan', region: '英音', regionEn: 'UK',
    desc: '英音男声', role: 'normal'
  },
  'en-US-ChristopherNeural': {
    lang: 'en-US', gender: 'Male',
    label: 'Christopher', region: '美音', regionEn: 'US',
    desc: '男声美音，音色偏低沉', role: 'normal'
  },
  'en-GB-LibbyNeural': {
    lang: 'en-GB', gender: 'Female',
    label: 'Libby', region: '英音', regionEn: 'UK',
    desc: '英音女声', role: 'normal'
  },
  'en-AU-NatashaNeural': {
    lang: 'en-AU', gender: 'Female',
    label: 'Natasha', region: '澳音', regionEn: 'AU',
    desc: '澳音女声', role: 'normal'
  },
  'en-US-MichelleNeural': {
    lang: 'en-US', gender: 'Female',
    label: 'Michelle', region: '美音', regionEn: 'US',
    desc: '美音女声', role: 'normal'
  },
  'en-US-EricNeural': {
    lang: 'en-US', gender: 'Male',
    label: 'Eric', region: '美音', regionEn: 'US',
    desc: '美音男声', role: 'normal'
  },
  /* Multilingual 系列：音质最自然，但语速偏快、连读较重，
     更适合「自然听力」而非「逐词跟读」，故放在末尾。*/
  'en-US-AvaMultilingualNeural': {
    lang: 'en-US', gender: 'Female',
    label: 'Ava', region: '美音', regionEn: 'US',
    desc: '最自然，接近真人；连读偏多', role: 'natural'
  },
  'en-US-EmmaMultilingualNeural': {
    lang: 'en-US', gender: 'Female',
    label: 'Emma', region: '美音', regionEn: 'US',
    desc: '自然流畅，语调丰富', role: 'natural'
  },
  'en-US-AndrewMultilingualNeural': {
    lang: 'en-US', gender: 'Male',
    label: 'Andrew', region: '美音', regionEn: 'US',
    desc: '自然男声，接近真人', role: 'natural'
  }
  /* 实测不可用、不要列进设置页：
     en-US-JaneNeural、en-US-EvanNeural
     合成时服务端直接关闭连接（no turn.end），前端会表现为静默失败。 */
};
const DEFAULT_VOICE = 'en-US-AriaNeural';

/* ---------- 磁盘缓存 ---------- */
if (!fs.existsSync(CACHE_DIR)) {
  try { fs.mkdirSync(CACHE_DIR, { recursive: true }); } catch (e) { /* 只读文件系统则退化为纯内存 */ }
}
const memCache = new Map();   // key -> Buffer

function cacheKey(text, voice, rate) {
  /* 键里必须带上 AUDIO_FORMAT 的版本号。
     换音质后如果不改键，磁盘里旧格式的音频会继续被命中返回——
     用户会以为改动没生效，而实际上是缓存没失效。
     用 AUDIO_FORMAT 本身当版本，改格式即自动换缓存，无需手工清目录。 */
  return crypto.createHash('sha1')
    .update(AUDIO_FORMAT + '|' + voice + '|' + rate + '|' + text)
    .digest('hex');
}
function cachePath(key) {
  return path.join(CACHE_DIR, key + '.mp3');
}
function cacheGet(key) {
  if (memCache.has(key)) return memCache.get(key);
  try {
    const p = cachePath(key);
    if (fs.existsSync(p)) {
      const buf = fs.readFileSync(p);
      memCache.set(key, buf);
      return buf;
    }
  } catch (e) { /* 忽略 */ }
  return null;
}
function cachePut(key, buf) {
  memCache.set(key, buf);
  // 内存满了就丢最旧的（Map 保持插入序）
  while (memCache.size > CACHE_MAX) {
    const first = memCache.keys().next().value;
    memCache.delete(first);
  }
  try { fs.writeFileSync(cachePath(key), buf); } catch (e) { /* 忽略 */ }
}

/* ---------- 限流（滑动窗口） ---------- */
const hits = [];
function rateOK() {
  const now = Date.now();
  while (hits.length && now - hits[0] > 60000) hits.shift();
  if (hits.length >= RATE_LIMIT) return false;
  hits.push(now);
  return true;
}

/* ---------- SSML 转义 ---------- */
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/* ---------- 合成 ----------
   每个音色缓存一个 MsEdgeTTS 实例（它内部持有 WebSocket 连接，
   重复 new 会反复握手，这是延迟的主要来源）。

   两级降级：
     1) raw SSML + <prosody rate> —— 语速真正生效（慢速朗读依赖这个）
     2) toStream —— 语速可能不生效，但至少能出声

   SSML 结构必须保持极简。这一点是踩坑得来的：
   服务端只接受 <speak><voice><prosody> 这一条路径，
   任何额外标签都会让它直接关闭连接（no turn.end received），而且不报错：
     <break time="300ms"/>                → 失败
     <mstts:express-as style="...">       → 失败
     <prosody> 放在 <voice> 外层           → 失败
   所以停顿只能靠「切分成多句、分段合成、客户端拼接」来实现，
   不能靠 SSML 标签。 */
const ttsByVoice = new Map();

async function getTTS(voice) {
  if (!MsEdgeTTS) throw new Error('msedge-tts 未安装：请在 tools/ 下执行 npm install msedge-tts');
  if (!ttsByVoice.has(voice)) {
    const t = new MsEdgeTTS();
    await t.setMetadata(voice, AUDIO_FORMAT);
    ttsByVoice.set(voice, t);
  }
  return ttsByVoice.get(voice);
}

/* ---------- 朗读文本预处理 ----------
   音质差有一半不是音频本身的问题，是「文本没被正确朗读」。
   学习内容里的缩写、符号、特殊符号若原样送进 TTS，
   会被读成字母名或干脆跳过——用户听到的是错的读音，
   自然觉得「音质差」。

   这一层只改「怎么读」，不改「读什么」：不新增信息、不丢信息。*/
function prepText(text) {
  let s = String(text || '');

  // 撇号：' 是它/ they're 之分，’ 是所有格/复数。送进 TTS 前统一掉，
  // 让它按上下文自己判断，而不是被原样读成一个奇怪的字符
  s = s.replace(/[''`]/g, "'");

  // 常见缩写展开。TTS 对缩写常直接念字母名，展开后才读得对
  const ABBR = [
    [/\bMr\./g, 'Mister'], [/\bMrs\./g, 'Missus'], [/\bMs\./g, 'Miss'],
    [/\bDr\./g, 'Doctor'], [/\bProf\./g, 'Professor'],
    [/\bSt\./g, 'Saint'], [/\bvs\.?\b/g, 'versus'],
    [/\be\.g\./gi, 'for example'], [/\bi\.e\./gi, 'that is'],
    [/\betc\./gi, 'et cetera'], [/\bapprox\./gi, 'approximately'],
    [/\bNo\./g, 'number']
  ];
  for (const [re, to] of ABBR) s = s.replace(re, to);

  // 符号读法：只处理确实影响朗读的，保留句号逗号（它们影响断句）
  s = s.replace(/&/g, ' and ')
       .replace(/%/g, ' percent ')
       .replace(/\+/g, ' plus ')
       .replace(/=/g, ' equals ')
       .replace(/@/g, ' at ')
       .replace(/\$/g, ' dollars ')
       .replace(/~/g, ' to ');

  // 归一化空白。多个空格会让某些引擎插入不必要的短停顿
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* 上游限流时是否值得重试。
   ECONNRESET / Stream closed / turn.end 这类是上游主动断连，
   等一下重连通常就能成功；而参数错误重试多少次都没用。*/
function isTransient(e) {
  const s = String((e && e.message) || e || '');
  return /ECONNRESET|Stream closed|turn\.end|socket hang up|ETIMEDOUT|429|503/i.test(s);
}

/* 上游断连的退避重试。
   这一层是必要的：Edge TTS 对短时间内的密集请求会直接断连，
   实测连续请求几次后就稳定出现 ECONNRESET。
   不重试的话，用户感知是「发音时好时坏、偶尔直接没声音」——
   比音质问题更让人放弃使用。

   onFail 用于在重试前丢弃可能已失效的缓存连接。 */
async function withRetry(fn, onFail, max) {
  const tries = max || 3;
  let lastErr;
  for (let i = 1; i <= tries; i++) {
    try {
      const r = await fn();
      if (r && r.length > 200) return r;
      lastErr = new Error('empty audio');
    } catch (e) {
      lastErr = e;
      if (!isTransient(e)) throw e;   // 参数类错误退避也救不回来
    }
    if (i < tries) {
      // 800 / 1600 / 3200 ms，抖动避免整点撞上上游节流窗口
      const wait = 800 * Math.pow(2, i - 1) + Math.floor(Math.random() * 300);
      await sleep(wait);
      if (onFail) { try { onFail(); } catch (e2) { /* 忽略 */ } }
    }
  }
  throw lastErr || new Error('synthesis failed');
}

async function synthRobust(text, voice, rate) {
  const pct = (String(rate || '+0%').match(/[+-]?\d+/) || ['0'])[0];
  const signed = (pct[0] === '+' || pct[0] === '-') ? pct : '+' + pct;
  const v = VOICES[voice] || VOICES[DEFAULT_VOICE];
  const spoken = prepText(text);
  // 丢弃该音色的缓存连接，强制下次重建
  const dropConn = () => ttsByVoice.delete(voice);

  // 第 1 级：raw SSML + <prosody rate>，语速真正生效（慢速朗读依赖这个）
  try {
    const buf = await withRetry(async () => {
      const t = await getTTS(voice);
      const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="'
        + v.lang + '"><voice name="' + voice + '"><prosody rate="' + signed + '%">'
        + esc(spoken) + '</prosody></voice></speak>';
      const { audioStream } = await t.rawToStream(ssml);
      const chunks = [];
      for await (const c of audioStream) chunks.push(c);
      return Buffer.concat(chunks);
    }, dropConn);
    if (buf) return buf;
  } catch (e) { /* 落到第 2 级 */ }

  // 第 2 级：toStream，语速可能不生效，但至少能出声
  return withRetry(async () => {
    const t = await getTTS(voice);
    const { audioStream } = await t.toStream(spoken);
    const chunks = [];
    for await (const c of audioStream) chunks.push(c);
    return Buffer.concat(chunks);
  }, dropConn);
}

/* ---------- HTTP ---------- */
function cors(res, origin) {
  // 允许任意来源：这个服务只返回公开的发音音频，无鉴权、无用户数据。
  // 但如果带了 Origin 就回显，便于带 Cookie 的部署场景。
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
  /* 跨域下 JS 读不到非 CORS 安全响应头，
     少了这一行前端就看不到 X-Cache，无法判断是否命中缓存。 */
  res.setHeader('Access-Control-Expose-Headers', 'X-Cache, Content-Type, Content-Length');
}

function json(res, code, obj, origin) {
  cors(res, origin);
  const body = Buffer.from(JSON.stringify(obj), 'utf8');
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '';
  const u = new URL(req.url, 'http://localhost');

  if (req.method === 'OPTIONS') { cors(res, origin); res.writeHead(204); return res.end(); }

  // 健康检查
  if (u.pathname === '/health') {
    return json(res, 200, {
      ok: true,
      dep: !!MsEdgeTTS,
      cached: memCache.size,
      cacheDir: fs.existsSync(CACHE_DIR) ? 'disk+mem' : 'mem'
    }, origin);
  }

  // 音色列表
  if (u.pathname === '/voices') {
    // 前端要按「英音/美音/澳音」分组，并区分推荐与自然音色，
    // 所以这里把展示所需的全部字段都给足，前端不再自己拼字符串。
    const voices = Object.keys(VOICES).map(k => ({
      id: k,
      name: VOICES[k].label,
      label: VOICES[k].label + '（' + VOICES[k].region + '·'
        + (VOICES[k].gender === 'Female' ? '女' : '男') + '）',
      desc: VOICES[k].desc,
      role: VOICES[k].role,
      recommended: !!VOICES[k].recommended,
      region: VOICES[k].region,
      regionEn: VOICES[k].regionEn,
      lang: VOICES[k].lang,
      gender: VOICES[k].gender
    }));
    return json(res, 200, {
      ok: true, voices, default: DEFAULT_VOICE,
      format: AUDIO_FORMAT
    }, origin);
  }

  if (u.pathname !== '/tts') return json(res, 404, { ok: false, error: 'not found' }, origin);

  if (!rateOK()) return json(res, 429, { ok: false, error: 'rate limited' }, origin);
  if (!MsEdgeTTS) {
    return json(res, 503, { ok: false, error: 'msedge-tts not installed' }, origin);
  }

  const text = (u.searchParams.get('text') || '').trim();
  const voice = u.searchParams.get('voice') || DEFAULT_VOICE;
  const rate = u.searchParams.get('rate') || '+0%';

  if (!text) return json(res, 400, { ok: false, error: 'text required' }, origin);
  if (text.length > MAX_TEXT) {
    return json(res, 400, { ok: false, error: 'text too long (' + text.length + '/' + MAX_TEXT + ')' }, origin);
  }
  if (!VOICES[voice]) {
    return json(res, 400, { ok: false, error: 'unknown voice: ' + voice }, origin);
  }

  const key = cacheKey(text, voice, rate);
  const hit = cacheGet(key);
  if (hit) {
    cors(res, origin);
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': hit.length,
      'X-Cache': 'HIT'
    });
    return res.end(hit);
  }

  try {
    const buf = await synthRobust(text, voice, rate);
    if (!buf || buf.length < 200) {
      return json(res, 502, { ok: false, error: 'empty audio from upstream' }, origin);
    }
    cachePut(key, buf);
    cors(res, origin);
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': buf.length,
      'X-Cache': 'MISS',
      'Cache-Control': 'public, max-age=86400'
    });
    res.end(buf);
  } catch (e) {
    json(res, 502, { ok: false, error: e && e.message ? e.message : 'upstream failed' }, origin);
  }
});

/* 列出本机可供手机访问的局域网地址。
   手机不能用 127.0.0.1 —— 那个地址在手机上指向手机自己，不是这台电脑。 */
function lanAddresses() {
  const nets = require('os').networkInterfaces();
  const out = [];
  for (const name of Object.keys(nets)) {
    for (const n of nets[name] || []) {
      // 只取 IPv4，且排除回环与虚拟网卡常见的 169.254 段
      if (n.family !== 'IPv4' && n.family !== 4) continue;
      if (!n.address || n.internal) continue;
      if (n.address.startsWith('169.254.')) continue;
      out.push({ name, address: n.address });
    }
  }
  return out;
}

server.listen(PORT, '0.0.0.0', () => {
  /* 必须绑 0.0.0.0 而不是默认的 127.0.0.1。
     不指定 host 时 Node 只绑回环，手机就算和电脑在同一个 WiFi 下也连不上，
     表现为「电脑上好好的，手机上就是没声音」——
     这是最容易被误判成 App 坏了的情况。
     这里只返回公开的发音音频、无鉴权无用户数据，局域网可访问风险可控。*/
  console.log('');
  console.log('[tts] 发音代理已启动');
  console.log('');
  console.log('     本机访问：http://127.0.0.1:' + PORT);
  const lan = lanAddresses();
  if (lan.length) {
    console.log('     手机访问（需与电脑同一 WiFi）：');
    lan.forEach(n => console.log('       http://' + n.address + ':' + PORT + '   (' + n.name + ')'));
  } else {
    console.log('     手机访问：未检测到局域网地址，请检查是否已连接 WiFi');
  }
  console.log('');
  console.log('[tts] 在手机浏览器打开网站后，进「发音设置」把服务地址填成上面的局域网地址。');
  console.log('[tts] 若连不上，多半是电脑防火墙拦截了 ' + PORT + ' 端口，需要放行。');
  console.log('');
  console.log('[tts] 依赖：' + (MsEdgeTTS ? 'msedge-tts ✓' : 'msedge-tts ✗（请在 tools/ 下 npm install）'));
  console.log('[tts] 缓存目录：' + CACHE_DIR);
  console.log('[tts] 音色数：' + Object.keys(VOICES).length + '  限流：' + RATE_LIMIT + '/分钟');
});
