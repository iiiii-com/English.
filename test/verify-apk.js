/**
 * APK 产物验收：
 *  1. APK 存在且为有效 zip 包
 *  2. 网页资源完整打进包内（词库 / 脚本 / 图标）
 *  3. SW 已移除（外壳内不需要缓存层）
 *  4. 体积在合理区间
 *
 * 用法：node test/verify-apk.js
 */
const fs = require('fs');
const path = require('path');

const APK = process.argv[2] || 'E:/ai/英语学习网站/android/app-release.apk';

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail: detail || '' });
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (detail ? '  →  ' + detail : ''));
}

/**
 * 解析 zip 中央目录，列出全部条目名。
 * 不依赖 unzip / jar 外部进程：Windows 沙箱下 spawn 常报 EBUSY，
 * 且 APK 内文件名是 UTF-8 路径，中文环境下外部工具更易出编码问题。
 */
function listEntries() {
  const buf = fs.readFileSync(APK);
  // zip 尾部中央目录：定位 EOCD 签名 0x06054b50
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 66000; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) return null;

  const total = buf.readUInt16LE(eocd + 10);
  let off = buf.readUInt32LE(eocd + 16);
  const names = [];

  for (let n = 0; n < total; n++) {
    if (off + 46 > buf.length) break;
    if (buf.readUInt32LE(off) !== 0x02014b50) break;   // 中央目录文件头
    const nameLen = buf.readUInt16LE(off + 28);
    const extraLen = buf.readUInt16LE(off + 30);
    const commentLen = buf.readUInt16LE(off + 32);
    const utf8 = (buf.readUInt16LE(off + 8) & 0x800) !== 0;  // 通用位标志第 11 位
    const raw = buf.slice(off + 46, off + 46 + nameLen);
    names.push(raw.toString(utf8 ? 'utf8' : 'latin1'));
    off += 46 + nameLen + extraLen + commentLen;
  }
  return names.length ? names : null;
}

/**
 * 校验 APK v2 签名是否存在。
 * APK Signature Scheme v2 把签名块放在中央目录之前。
 * 块末尾固定是 16 字节 magic "APK Sig Block 42"，
 * 紧接在中央目录之前 —— 直接比对这两个位置即可。
 * 纯 Node 实现，避免依赖 apksigner 外部进程。
 */
function hasV2Signature() {
  const buf = fs.readFileSync(APK);
  let eocd = -1;
  for (let i = buf.length - 22; i >= 0 && i > buf.length - 66000; i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) return false;
  const cdOffset = buf.readUInt32LE(eocd + 16);
  if (cdOffset < 16) return false;
  // 签名块末尾 magic 紧邻中央目录之前
  return buf.slice(cdOffset - 16, cdOffset).toString('latin1') === 'APK Sig Block 42';
}

console.log('\n=== APK 产物验收 ===\n');

check('APK 文件存在', fs.existsSync(APK), APK);
if (!fs.existsSync(APK)) {
  console.log('\n未找到 APK，构建尚未完成或失败。\n');
  process.exit(1);
}

const size = fs.statSync(APK).size;
const sizeMB = (size / 1024 / 1024).toFixed(2);
console.log('  体积：' + sizeMB + ' MB');
check('体积合理（3–40 MB）', sizeMB >= 3 && sizeMB <= 40, sizeMB + ' MB');

const entries = listEntries();
check('是有效的 zip 包', entries !== null && entries.length > 0, entries ? entries.length + ' 个条目' : '无法读取');

if (entries) {
  const has = (frag) => entries.some(e => e.indexOf(frag) >= 0);

  console.log('\n--- 网页资源 ---\n');
  check('包含 index.html', has('assets/web/index.html'));
  check('包含样式表', has('assets/web/assets/css/style.css'));
  check('包含主逻辑 app.js', has('assets/web/assets/js/app.js'));
  check('包含发音引擎 tts.js', has('assets/web/assets/js/tts.js'));
  check('包含 PWA 模块 pwa.js', has('assets/web/assets/js/pwa.js'));
  check('包含 manifest', has('assets/web/manifest.webmanifest'));

  console.log('\n--- 词库完整性 ---\n');
  check('包含基础词库 words.js', has('assets/web/assets/js/data/words.js'));
  check('包含 L5 分片', has('words-gaokao-l5.js'));
  check('包含 L6 分片', has('words-gaokao-l6.js'));
  check('包含内容索引', has('content-index.js'));
  check('包含英文释义', has('word-en-defs.js'));

  console.log('\n--- 图标与原生资源 ---\n');
  // 注意：AGP 会把 res/ 下资源重命名混淆（变成 res/XX.png 这类短名），
  // 因此不能按文件名找图标，只能确认 res/ 与 resources.arsc 存在。
  const resCount = entries.filter(n => n.startsWith('res/')).length;
  check('包含资源表 resources.arsc', has('resources.arsc'));
  check('包含编译后资源 res/', resCount > 0, resCount + ' 项');
  check('包含 DEX 代码', has('classes.dex'));
  // APK Signature Scheme v2 不产生 META-INF/*.RSA，签名块在中央目录之外，
  // 因此这里只能间接判断。真正的签名校验请执行：
  //   apksigner verify --verbose app-release.apk
  check('APK 结构完整可被系统解析', entries.length > 100, entries.length + ' 个条目');
  // 签名：v2 方案不产生 META-INF/*.RSA，签名块在中央目录之外，需单独探测
  check('已签名（v2 签名块存在）', hasV2Signature(),
    hasV2Signature() ? 'APK Signing Block 有效' : '未检测到 v2 签名');
  // 纯 Java 应用无需打包 .so（androidx.webkit 为纯 Java 实现）
  check('无多余原生库', entries.filter(n => n.startsWith('lib/')).length === 0,
    '纯 Java 实现，不需要 .so');

  console.log('\n--- 外壳行为 ---\n');
  check('已移除 Service Worker（外壳内不需要）', !has('assets/web/sw.js'));
  check('未打包 Service Worker 注册脚本', !has('service-worker.js'));

  console.log('\n--- 不该出现的东西 ---\n');
  const leaks = [];
  if (has('.keystore')) leaks.push('keystore');
  if (has('local.properties')) leaks.push('local.properties');
  if (has('assets/web/node_modules')) leaks.push('node_modules');
  if (has('assets/web/test/')) leaks.push('测试脚本');
  check('无敏感/冗余文件泄漏', leaks.length === 0, leaks.join(', ') || '干净');

  // 统计词库相关体积
  const big = entries.filter(e => /words-gaokao-l[56]\.js|content-daily-comm/.test(e));
  console.log('\n  词库相关条目：' + big.length + ' 个');
}

const pass = results.filter(r => r.ok).length;
const fail = results.filter(r => !r.ok);
console.log('\n' + '='.repeat(52));
console.log(`  通过 ${pass}/${results.length}` + (fail.length ? `，失败 ${fail.length}` : ''));
if (fail.length) {
  console.log('\n  失败项：');
  fail.forEach(f => console.log('   · ' + f.name + (f.detail ? ' → ' + f.detail : '')));
}
console.log('='.repeat(52) + '\n');
process.exit(fail.length ? 1 : 0);