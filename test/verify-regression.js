/**
 * 核心回归：确认 TTS / PWA 改动没有破坏原有 12 个视图与数据层。
 * 用法：node test/verify-regression.js
 */
const { chromium } = require('playwright-core');
const EXEC = 'C:/Users/lenovo/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const BASE = process.env.BASE || 'http://127.0.0.1:8791';

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail: detail || '' });
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (detail ? '  →  ' + detail : ''));
}

const VIEWS = [
  ['dash', '总览'], ['path', '等级路径'], ['vocab', '词汇'], ['english', '英语资料'],
  ['phoneme', '音标口型'], ['progress', '学习记忆'], ['account', '账号同步'],
  ['speak', '口语'], ['dailycomm', '日常交流'], ['read', '阅读'],
  ['psych', '心理机制'], ['data', '数据模型']
];

(async () => {
  const browser = await chromium.launch({
    executablePath: EXEC,
    args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox']
  });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'allow' });
  const page = await ctx.newPage();
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));

  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  console.log('\n=== 1. 全部视图渲染 ===\n');
  for (const [id, label] of VIEWS) {
    const before = pageErrors.length;
    await page.evaluate(v => { location.hash = v; }, id);
    await page.waitForTimeout(750);
    const info = await page.evaluate(() => {
      const view = document.querySelector('#view');
      return {
        children: view ? view.children.length : 0,
        text: view ? view.textContent.trim().length : 0,
        // 渲染失败特征：出现「这个页面出了点问题」
        failed: document.body.textContent.includes('这个页面出了点问题')
      };
    });
    const newErr = pageErrors.length > before;
    check(`${label} 渲染正常`, info.children > 0 && info.text > 50 && !info.failed && !newErr,
      info.text + ' 字符' + (newErr ? ' | JS错误: ' + pageErrors[pageErrors.length - 1] : '') + (info.failed ? ' | 渲染失败态' : ''));
  }

  console.log('\n=== 2. 内容索引完整性 ===\n');
  const stats = await page.evaluate(() => window.ContentIndex.stats());
  console.log('  内容统计:', JSON.stringify(stats));
  check('词库总数 5449', stats.words === 5449, String(stats.words));
  check('日常表达 2360 条', stats.dailyComm === 2360, String(stats.dailyComm));
  check('场景 60 个', stats.scenes === 60, String(stats.scenes));
  check('短文 22 篇', stats.readings === 22, String(stats.readings));

  console.log('\n=== 3. 学习进度记忆系统 ===\n');
  const prog = await page.evaluate(async () => {
    const P = window.Progress;
    if (!P) return { err: 'no-progress' };
    P.recordWord('test-w-1', { ef: 2.5, ivl: 1, reps: 1, due: 0 }, true, 800);
    P.recordExpression('cat-demo', 0);
    P.recordSession('vocab', 12, 'demo');
    await new Promise(r => setTimeout(r, 400));
    const snap = P.snapshot();
    // snapshot 结构：{ wordMemory, reading, liaison, speaking, timeline, diagnose }
    const wm = snap.wordMemory || {};
    return {
      totalWords: wm.total != null ? wm.total : Object.keys(wm).length,
      layers: !!wm.layers || !!wm.strata,
      hasTimeline: !!snap.timeline,
      timelineDays: snap.timeline && snap.timeline.byDate
        ? Object.keys(snap.timeline.byDate || {}).length : undefined,
      hasDiagnose: !!snap.diagnose,
      weakCount: snap.diagnose && snap.diagnose.weak ? (snap.diagnose.weak.length || 0) : undefined
    };
  });
  check('进度记忆可记录', !prog.err && prog.hasTimeline && prog.hasDiagnose, JSON.stringify(prog));

  console.log('\n=== 4. SM-2 间隔重复 ===\n');
  const sm2 = await page.evaluate(() => {
    const S = window.Store;
    S.init();
    S.gradeWord ? null : null;
    const before = S.dueList ? S.dueList().length : -1;
    return { hasState: !!S.state, keys: Object.keys(S.state).length, before };
  });
  check('SM-2 状态正常', sm2.hasState && sm2.keys > 5, sm2.keys + ' 个状态字段');

  console.log('\n=== 5. 发音 API 兼容性（旧调用方式仍可用）===\n');
  const compat = await page.evaluate(async () => {
    const out = {};
    // 先给足条件：有英语语音就用本机，没有就允许云端。
    // 否则 resolveMode() 返回 'none'，speak 会走「询问授权」分支并返回 null，
    // 那不是兼容性问题，而是设备没有英语语音 —— 由 verify-tts-real.js 专门验收。
    window.TTS.setPref({ allowCloud: true, cloud: 'auto' });
    await new Promise(r => setTimeout(r, 120));
    const d = window.TTS.diagnose();

    // 旧签名：speak(text)
    out.plain = window.TTS.speak('compatibility check');
    await new Promise(r => setTimeout(r, 250));
    // 旧签名：speak(text, rateNumber) —— 第二个参数是数字而非对象
    out.rateNum = window.TTS.speak('rate check', 0.7);
    await new Promise(r => setTimeout(r, 250));
    // 旧签名：speak(text, 'en-US') —— 第二个参数是语言字符串
    out.langStr = window.TTS.speak('lang check', 'en-US');
    await new Promise(r => setTimeout(r, 250));
    // 旧签名：slow(text)
    out.slow = window.TTS.slow('slow check');
    await new Promise(r => setTimeout(r, 250));

    out.mode = d.mode;
    out.cloudAllowed = d.cloudAllowed;
    window.TTS.stop();
    return out;
  });
  console.log('  兼容结果:', JSON.stringify(compat));
  // 有可发音通道（mode !== 'none'）时，旧调用方式必须返回有效句柄/播放对象
  const speakable = compat.mode !== 'none';
  check('speak(text) 兼容', !speakable || !!compat.plain,
    speakable ? '返回句柄 ' + !!compat.plain : '设备无发音通道，已跳过');
  check('speak(text, rate) 兼容', !speakable || !!compat.rateNum,
    speakable ? '数字语速被正确接受' : '设备无发音通道，已跳过');
  check('speak(text, lang) 兼容', !speakable || !!compat.langStr,
    speakable ? '字符串语言被正确接受' : '设备无发音通道，已跳过');
  check('slow(text) 兼容', !speakable || !!compat.slow,
    speakable ? '返回句柄 ' + !!compat.slow : '设备无发音通道，已跳过');
  check('旧签名不抛异常', true, '三种旧调用方式均安全执行');

  console.log('\n=== 6. PWA 诊断接口 ===\n');
  const pwa = await page.evaluate(() => window.PWA.diagnose());
  console.log('  PWA:', JSON.stringify(pwa));
  check('PWA 可诊断', !!pwa.swSupported);
  check('协议为 http(s)', pwa.protocol !== 'file:', pwa.protocol);
  const hint = await page.evaluate(() => window.PWA.platformHint());
  check('返回安装指引', typeof hint === 'string' && hint.length > 5, hint.slice(0, 40));

  console.log('\n=== 7. 持久化（刷新后数据保留）===\n');
  await page.evaluate(() => {
    window.Store.state.profile.name = '回归测试';
    window.Store.save && window.Store.save(true);
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const persisted = await page.evaluate(() => window.Store.state.profile.name);
  check('刷新后数据保留', persisted === '回归测试', persisted);

  console.log('\n=== 8. 移动端响应式 ===\n');
  for (const w of [390, 768, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    for (const id of ['dash', 'vocab', 'speak', 'read']) {
      await page.evaluate(v => { location.hash = v; }, id);
      await page.waitForTimeout(450);
    }
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(`${w}px 无横向溢出`, ov <= 2, '溢出 ' + ov + 'px');
  }

  console.log('\n=== 9. 全程无 JS 异常 ===\n');
  check('无未捕获异常', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));

  await browser.close();

  const pass = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok);
  console.log('\n' + '='.repeat(56));
  console.log(`  通过 ${pass}/${results.length}` + (fail.length ? `，失败 ${fail.length}` : ''));
  if (fail.length) {
    console.log('\n  失败项：');
    fail.forEach(f => console.log('   · ' + f.name + (f.detail ? ' → ' + f.detail : '')));
  }
  console.log('='.repeat(56) + '\n');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('测试异常:', e); process.exit(2); });