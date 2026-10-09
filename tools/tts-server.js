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
         → { ok: true, voices: [可用英文音色] }
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
const RATE_LIMIT = 240;         // 每分钟最多请求数
const MAX_BODY = 1 * 1024 * 1024;

/* 允许的英美音色。挑的都是 Natural 系列（神经语音），
   不用 Standard —— 后者是旧式拼接音，学习者听着刺耳。*/
const VOICES = {
  'en-US-AriaNeural': { lang: 'en-US', gender: 'Female', label: 'Aria（美音·女）' },
  'en-US-GuyNeural': { lang: 'en-US', gender: 'Male', label: 'Guy（美音·男）' },
  'en-US-JennyNeural': { lang: 'en-US', gender: 'Female', label: 'Jenny（美音·女·讲解）' },
  'en-US-ChristopherNeural': { lang: 'en-US', gender: 'Male', label: 'Christopher（美音·男）' },
  'en-GB-SoniaNeural': { lang: 'en-GB', gender: 'Female', label: 'Sonia（英音·女）' },
  'en-GB-RyanNeural': { lang: 'en-GB', gender: 'Male', label: 'Ryan（英音·男）' },
  'en-GB-LibbyNeural': { lang: 'en-GB', gender: 'Female', label: 'Libby（英音·女）' },
  'en-AU-NatashaNeural': { lang: 'en-AU', gender: 'Female', label: 'Natasha（澳音·女）' },
  'en-US-JaneNeural': { lang: 'en-US', gender: 'Female', label: 'Jane（美音·女）' },
  'en-US-EricNeural': { lang: 'en-US', gender: 'Male', label: 'Eric（美音·男）' },
  'en-US-MichelleNeural': { lang: 'en-US', gender: 'Female', label: 'Michelle（美音·女）' },
  'en-US-EvanNeural': { lang: 'en-US', gender: 'Male', label: 'Evan（美音·男）' }
};
const DEFAULT_VOICE = 'en-US-AriaNeural';

/* ---------- 磁盘缓存 ---------- */
if (!fs.existsSync(CACHE_DIR)) {
  try { fs.mkdirSync(CACHE_DIR, { recursive: true }); } catch (e) { /* 只读文件系统则退化为纯内存 */ }
}
const memCache = new Map();   // key -> Buffer

function cacheKey(text, voice, rate) {
  return crypto.createHash('sha1')
    .update(voice + '|' + rate + '|' + text)
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
     2) toStream —— 语速可能不生效，但至少能出声 */
const ttsByVoice = new Map();

async function getTTS(voice) {
  if (!MsEdgeTTS) throw new Error('msedge-tts 未安装：请在 tools/ 下执行 npm install msedge-tts');
  if (!ttsByVoice.has(voice)) {
    const t = new MsEdgeTTS();
    await t.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    ttsByVoice.set(voice, t);
  }
  return ttsByVoice.get(voice);
}

async function synthRobust(text, voice, rate) {
  const t = await getTTS(voice);
  const pct = (String(rate || '+0%').match(/[+-]?\d+/) || ['0'])[0];
  const signed = (pct[0] === '+' || pct[0] === '-') ? pct : '+' + pct;
  const v = VOICES[voice] || VOICES[DEFAULT_VOICE];

  try {
    const ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="'
      + v.lang + '"><voice name="' + voice + '"><prosody rate="' + signed + '%">'
      + esc(text) + '</prosody></voice></speak>';
    const { audioStream } = await t.rawToStream(ssml);
    const chunks = [];
    for await (const c of audioStream) chunks.push(c);
    const buf = Buffer.concat(chunks);
    if (buf.length > 200) return buf;
  } catch (e) { /* 落到下一级 */ }

  const { audioStream } = await t.toStream(text);
  const chunks = [];
  for await (const c of audioStream) chunks.push(c);
  return Buffer.concat(chunks);
}

/* ---------- HTTP ---------- */
function cors(res, origin) {
  // 允许任意来源：这个服务只返回公开的发音音频，无鉴权、无用户数据。
  // 但如果带了 Origin 就回显，便于带 Cookie 的部署场景。
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');
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
    const voices = Object.keys(VOICES).map(k => ({
      id: k, label: VOICES[k].label,
      lang: VOICES[k].lang, gender: VOICES[k].gender
    }));
    return json(res, 200, { ok: true, voices, default: DEFAULT_VOICE }, origin);
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

server.listen(PORT, () => {
  console.log('[tts] 发音代理已启动  http://127.0.0.1:' + PORT);
  console.log('[tts] 依赖：' + (MsEdgeTTS ? 'msedge-tts ✓' : 'msedge-tts ✗（请在 tools/ 下 npm install）'));
  console.log('[tts] 缓存目录：' + CACHE_DIR);
  console.log('[tts] 音色数：' + Object.keys(VOICES).length + '  限流：' + RATE_LIMIT + '/分钟');
});
