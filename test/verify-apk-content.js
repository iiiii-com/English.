/**
 * 验证 APK 内确实装进了修复后的发音代码。
 * 关键：不能只看 APK 生成成功 —— 必须解包确认 tts.js 是新版（三层降级）。
 */
const fs = require('fs');

const APK = process.argv[2] || 'android/app-release.apk';
const buf = fs.readFileSync(APK);

// ---- 解析 zip 中央目录 ----
const MAX = 0xffff;
let eocd = -1;
for (let i = buf.length - 22; i >= Math.max(0, buf.length - 22 - MAX); i--) {
  if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
}
if (eocd < 0) { console.error('不是有效的 zip/apk'); process.exit(1); }

const count = buf.readUInt16LE(eocd + 10);
let off = buf.readUInt32LE(eocd + 16);
const entries = [];
for (let i = 0; i < count; i++) {
  if (buf.readUInt32LE(off) !== 0x02014b50) break;
  const method = buf.readUInt16LE(off + 10);
  const compSize = buf.readUInt32LE(off + 20);
  const nameLen = buf.readUInt16LE(off + 28);
  const extraLen = buf.readUInt16LE(off + 30);
  const commentLen = buf.readUInt16LE(off + 32);
  const localOff = buf.readUInt32LE(off + 42);
  const name = buf.slice(off + 46, off + 46 + nameLen).toString('utf8');
  entries.push({ name, method, compSize, localOff });
  off += 46 + nameLen + extraLen + commentLen;
}

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok });
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (detail ? '  →  ' + detail : ''));
}

console.log('\n=== APK 基本信息 ===\n');
console.log('  文件：' + APK);
console.log('  大小：' + buf.length.toLocaleString() + ' 字节');
console.log('  条目：' + entries.length);
check('zip 结构可解析', entries.length > 100, entries.length + ' 个文件');

const names = entries.map(e => e.name);

// v2 签名：中央目录前 16 字节是 magic
const cdOff = entries.length ? entries[0].localOff : 0;
let cdOffset = -1;
for (let i = buf.length - 22; i >= 0; i--) {
  if (buf.readUInt32LE(i) === 0x06054b50) { cdOffset = buf.readUInt32LE(i + 16); break; }
}
const magic = buf.slice(cdOffset - 16, cdOffset).toString('ascii');
check('v2 签名有效', magic === 'APK Sig Block 42', JSON.stringify(magic));

console.log('\n=== 发音修复是否打进包 ===\n');
// 必须包含新的发音设置视图
check('包含 view-tts.js（发音设置页）',
  names.includes('assets/web/assets/js/view-tts.js'));
check('包含 tts.js（发音引擎）',
  names.includes('assets/web/assets/js/tts.js'));
check('包含 pwa.js', names.includes('assets/web/assets/js/pwa.js'));
check('不包含 sw.js（APK 内不需要）', !names.includes('assets/web/sw.js'));
// 类代码在 classes.dex 里（R8 优化后不再以独立 .class 存在）
check('包含 classes.dex（原生外壳字节码）', names.includes('classes.dex'));
check('包含 AndroidManifest.xml', names.includes('AndroidManifest.xml'));
check('包含 resources.arsc', names.includes('resources.arsc'));
check('无 native 库（纯 Java 外壳，不应带 .so）', !names.some(n => /lib\/.*\.so$/.test(n)));

// 关键：解包 tts.js 看是不是新版（三层降级逻辑）
const ttsEntry = entries.find(e => e.name === 'assets/web/assets/js/tts.js');
let ttsSrc = '';
if (ttsEntry) {
  const lo = ttsEntry.localOff;
  const nl = buf.readUInt16LE(lo + 26);
  const el = buf.readUInt16LE(lo + 28);
  const dataOff = lo + 30 + nl + el;
  const raw = buf.slice(dataOff, dataOff + ttsEntry.compSize);
  ttsSrc = ttsEntry.method === 0 ? raw.toString('utf8')
    : require('zlib').inflateRawSync(raw).toString('utf8');
}
console.log('  tts.js 解出 ' + ttsSrc.length + ' 字符');
check('新版：含三层降级 resolveMode', /function resolveMode/.test(ttsSrc));
check('新版：含云端发音 dictvoice', /dict\.youdao\.com\/dictvoice/.test(ttsSrc));
check('新版：含授权同意逻辑', /promptCloudConsent/.test(ttsSrc));
check('新版：含 diagnose 诊断接口', /englishVoices/.test(ttsSrc));
check('新版：已移除旧的定时器自定义属性 bug', !/_n\s*>=\s*20/.test(ttsSrc));
check('新版：init 有幂等保护', /var inited = false/.test(ttsSrc));
// 旧版特征：pickVoice 遇到没有英语语音时仍会返回中文语音
check('新版：pickVoice 过滤非英语语音', /en-US|en-GB|lang\.slice\(0, *2\) *===? *'en'/i.test(ttsSrc));

const vt = entries.find(e => e.name === 'assets/web/assets/js/view-tts.js');
let vtSrc = '';
if (vt) {
  const lo = vt.localOff;
  const nl = buf.readUInt16LE(lo + 26);
  const el = buf.readUInt16LE(lo + 28);
  const dataOff = lo + 30 + nl + el;
  const raw = buf.slice(dataOff, dataOff + vt.compSize);
  vtSrc = vt.method === 0 ? raw.toString('utf8')
    : require('zlib').inflateRawSync(raw).toString('utf8');
}
check('发音设置页含语音包安装指引',
  /Windows 电脑/.test(vtSrc) && /安卓手机/.test(vtSrc));
check('发音设置页如实显示英语语音数量', /英语语音/.test(vtSrc));

// index.html 必须引用 view-tts.js
const ih = entries.find(e => e.name === 'assets/web/index.html');
let ihSrc = '';
if (ih) {
  const lo = ih.localOff;
  const nl = buf.readUInt16LE(lo + 26);
  const el = buf.readUInt16LE(lo + 28);
  const dataOff = lo + 30 + nl + el;
  const raw = buf.slice(dataOff, dataOff + ih.compSize);
  ihSrc = ih.method === 0 ? raw.toString('utf8')
    : require('zlib').inflateRawSync(raw).toString('utf8');
}
check('index.html 已引入 view-tts.js', /view-tts\.js/.test(ihSrc));
check('index.html 已引入 tts.js', /tts\.js/.test(ihSrc));

console.log('\n=== 原生语音桥接（App 内发声的唯一通路）===\n');
// WebView 不实现 Web Speech API，必须确认原生桥接相关代码都在包里
check('tts.js 探测原生桥接 AndroidTTS', /AndroidTTS/.test(ttsSrc));
check('tts.js 有 speakNative 原生朗读', /function speakNative/.test(ttsSrc));
check('tts.js 注册 __nativeTtsFire 回调入口', /__nativeTtsFire/.test(ttsSrc));
check('tts.js 的 resolveMode 优先走原生', /hasNative\(\)[\s\S]{0,200}return 'native'/.test(ttsSrc));
check('tts.js 不再把 WebView 语音误判为可用',
  /function hasEnglishVoice/.test(ttsSrc) && /getVoices\(\)/.test(ttsSrc));
check('原生失败自动退到云端', /failNativeToCloud/.test(ttsSrc));
check('设置页有 App 专属说明', /不提供网页语音接口/.test(vtSrc));

// dex 里必须包含 NativeTTS 类与 TextToSpeech 引用
function readEntry(e) {
  if (!e) return '';
  const lo = e.localOff;
  const nl = buf.readUInt16LE(lo + 26);
  const el = buf.readUInt16LE(lo + 28);
  const dataOff = lo + 30 + nl + el;
  const raw = buf.slice(dataOff, dataOff + e.compSize);
  return e.method === 0 ? raw.toString('utf8')
    : require('zlib').inflateRawSync(raw).toString('utf8');
}
const dexSrc = readEntry(entries.find(e => e.name === 'classes.dex'));
check('dex 内含 NativeTTS 类', /NativeTTS/.test(dexSrc));
check('dex 内引用系统 TextToSpeech', /TextToSpeech|UtteranceProgressListener|Voice/.test(dexSrc));
check('dex 内注册 AndroidTTS 桥接名', /AndroidTTS/.test(dexSrc));
check('dex 内含英语语言设置', /en-US|\\u0065\\u006e-US|Locale/.test(dexSrc));

const pass = results.filter(r => r.ok).length;
const fail = results.filter(r => !r.ok);
console.log('\n' + '='.repeat(56));
console.log(`  通过 ${pass}/${results.length}` + (fail.length ? `，失败 ${fail.length}` : ''));
fail.forEach(f => console.log('   · ' + f.name));
console.log('='.repeat(56) + '\n');
process.exit(fail.length ? 1 : 0);
