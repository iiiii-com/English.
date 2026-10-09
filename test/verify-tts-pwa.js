/**
 * 验收测试：发音修复 + PWA App 形态
 * 用法：node test/verify-tts-pwa.js
 */
const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

const BASE = process.env.BASE || 'http://127.0.0.1:8791';
const EXEC = 'C:/Users/lenovo/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe';

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail: detail || '' });
  console.log((ok ? '  PASS  ' : '  FAIL  ') + name + (detail ? '  →  ' + detail : ''));
}

(async () => {
  const browser = await chromium.launch({
    executablePath: EXEC,
    args: ['--autoplay-policy=no-user-gesture-required', '--no-sandbox']
  });
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    serviceWorkers: 'allow'
  });
  const page = await ctx.newPage();

  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });

  console.log('\n=== 1. 页面加载与模块就绪 ===\n');
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  check('无未捕获页面异常', pageErrors.length === 0, pageErrors.slice(0, 3).join(' | '));
  check('TTS 模块已加载', await page.evaluate(() => !!window.TTS));
  check('PWA 模块已加载', await page.evaluate(() => !!window.PWA));
  check('UI 模块已加载', await page.evaluate(() => !!window.UI));

  console.log('\n=== 2. 发音引擎能力诊断 ===\n');
  const diag = await page.evaluate(() => window.TTS.diagnose());
  console.log('  诊断结果:', JSON.stringify(diag));
  check('speechSynthesis 可用', diag.supported === true);
  check('诊断可用性判定', diag.usable === true);
  // CI/无头环境可能没装英语语音包，此时退回浏览器默认语音仍应可读，
  // 因此只在「有语音列表却选不出英语语音」时判失败。
  if (diag.totalVoices > 0) {
    check('英语语音可选或已降级', diag.englishVoices > 0 || diag.env === 'lang-fallback',
      diag.englishVoices + ' 个 / ' + diag.env);
  } else {
    console.log('  NOTE  该环境未安装任何系统语音包，跳过语音列表检查');
  }

  console.log('\n=== 3. 实际朗读（验证 start/end 事件真实触发）===\n');
  const spoken = await page.evaluate(async () => {
    return await new Promise(resolve => {
      const events = [];
      const u = new SpeechSynthesisUtterance('hello world');
      u.lang = 'en-US';
      u.onstart = () => events.push('start');
      u.onend = () => { events.push('end'); resolve({ events, ok: events.includes('start') }); };
      u.onerror = (e) => { events.push('error:' + (e.error || '?')); resolve({ events, ok: false }); };
      window.speechSynthesis.cancel();
      setTimeout(() => window.speechSynthesis.speak(u), 80);
      setTimeout(() => resolve({ events, ok: false, timeout: true }), 6000);
    });
  });
  console.log('  朗读事件:', JSON.stringify(spoken.events));
  check('朗读真实触发（start 事件）', spoken.ok === true);

  console.log('\n=== 4. 通过模块 API 朗读单词 ===\n');
  const viaModule = await page.evaluate(async () => {
    return await new Promise(resolve => {
      let started = false, ended = false;
      window.TTS.speak('vocabulary practice', {
        onstart: () => { started = true; },
        onend: () => { ended = true; resolve({ started, ended }); }
      });
      setTimeout(() => resolve({ started, ended, timeout: true }), 6000);
    });
  });
  check('TTS.speak 模块接口可发声', viaModule.started === true, JSON.stringify(viaModule));

  console.log('\n=== 5. 连续朗读队列（旧实现只有最后一句发声）===\n');
  const seq = await page.evaluate(async () => {
    return await new Promise(resolve => {
      const heard = [];
      const items = ['first line', 'second line', 'third line'];
      window.TTS.speakSequence(items, {
        onprogress: (i) => heard.push(i),
        onend: () => resolve({ heard })
      });
      setTimeout(() => resolve({ heard, timeout: true }), 12000);
    });
  });
  console.log('  队列推进:', JSON.stringify(seq.heard));
  check('连续朗读覆盖全部句子', seq.heard && seq.heard.length === 3, (seq.heard || []).length + '/3');

  console.log('\n=== 6. 点击真实发音按钮 ===\n');
  await page.evaluate(() => { location.hash = 'vocab'; });
  await page.waitForTimeout(900);
  // 默认 tab 是「今日复习」（空态）；切到「学新词」进入词表页
  await page.evaluate(() => {
    const seg = document.getElementById('vocabTabs');
    const btn = seg && Array.from(seg.querySelectorAll('button')).find(x => x.dataset.t === 'new');
    if (btn) btn.click();
  });
  await page.waitForTimeout(1200);

  // 全库搜索（学新词页自带），验证搜索后出现的发音按钮
  const searchWorks = await page.evaluate(async () => {
    const input = document.querySelector('input[type=search]');
    if (!input) return { ok: false, reason: 'no-search-input' };
    input.value = 'apple';
    const btns = Array.from(document.querySelectorAll('button')).filter(b => b.textContent === '搜索');
    if (!btns.length) return { ok: false, reason: 'no-search-btn' };
    btns[0].click();
    await new Promise(r => setTimeout(r, 400));
    return { ok: true, text: document.body.textContent.slice(0, 80) };
  });
  check('全库搜索可用', searchWorks.ok === true, searchWorks.reason || '');

  const btnCount = await page.locator('.speak-btn, .mini-btn').count();
  check('学词页存在发音按钮', btnCount > 0, btnCount + ' 个');
  if (btnCount > 0) {
    const clicked = await page.evaluate(async () => {
      // 词表页的发音按钮是 .mini-btn（🔊），词卡页才是 .speak-btn
      const btn = document.querySelector('.mini-btn') || document.querySelector('.speak-btn');
      if (!btn) return { err: 'no-button' };
      btn.click();
      await new Promise(r => setTimeout(r, 600));
      return { playing: btn.classList.contains('playing'), speaking: window.TTS.isSpeaking() };
    });
    check('点击后进入播放状态', clicked.playing === true || clicked.speaking === true, JSON.stringify(clicked));
  }

  console.log('\n=== 7. 口语页连续朗读按钮 ===\n');
  await page.evaluate(() => { location.hash = 'speak'; });
  await page.waitForTimeout(900);
  const speakBtns = await page.locator('button:has-text("连续朗读全段")').count();
  check('口语页存在连续朗读按钮', speakBtns > 0, speakBtns + ' 个');

  console.log('\n=== 8. PWA 清单与图标 ===\n');
  const manifest = await page.evaluate(async () => {
    const href = document.querySelector('link[rel=manifest]')?.getAttribute('href');
    if (!href) return { href: null };
    const res = await fetch(href);
    return { href, ok: res.ok, json: await res.json() };
  });
  check('manifest 链接存在', !!manifest.href, manifest.href || '缺失');
  check('manifest 可加载', manifest.ok === true);
  if (manifest.json) {
    const m = manifest.json;
    check('display 为 standalone', m.display === 'standalone', m.display);
    check('配置了 192/512 图标', (m.icons || []).length >= 3, (m.icons || []).length + ' 个');
    check('含 maskable 图标', (m.icons || []).some(i => i.purpose === 'maskable'));
    check('配置了应用快捷方式', (m.shortcuts || []).length > 0, (m.shortcuts || []).length + ' 个');
    check('name 正确', !!m.name, m.name);
  }
  // 图标真实可访问
  for (const u of ['assets/icons/icon-192.png', 'assets/icons/icon-512.png', 'assets/icons/icon-maskable-512.png', 'assets/icons/apple-touch-icon.png']) {
    const r = await page.request.get(BASE + '/' + u);
    check('图标可访问 ' + u.split('/').pop(), r.ok(), 'HTTP ' + r.status());
  }

  console.log('\n=== 9. Service Worker 注册 ===\n');
  await page.waitForTimeout(2500);
  const sw = await page.evaluate(async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    return {
      supported: 'serviceWorker' in navigator,
      has: !!reg,
      scope: reg ? reg.scope : null,
      state: reg && reg.active ? reg.active.state : null
    };
  });
  console.log('  SW:', JSON.stringify(sw));
  check('SW 已注册', sw.has === true);
  check('SW 已激活', sw.state === 'activated' || sw.state === 'activating', sw.state || '无');

  console.log('\n=== 10. 缓存内容抽查 ===\n');
  const cacheInfo = await page.evaluate(async () => {
    const keys = await caches.keys();
    let total = 0;
    const per = {};
    for (const k of keys) {
      const c = await caches.open(k);
      const reqs = await c.keys();
      per[k] = reqs.length;
      total += reqs.length;
    }
    return { keys, per, total };
  });
  console.log('  缓存:', JSON.stringify(cacheInfo));
  check('已建立缓存', cacheInfo.total > 0, cacheInfo.total + ' 条');

  console.log('\n=== 11. 离线可用性 ===\n');
  // 关闭网络后重新加载
  await ctx.setOffline(true);
  let offlineOK = false, offlineErr = '';
  try {
    await page.reload({ waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2000);
    offlineOK = await page.evaluate(() => !!window.Store && !!window.TTS && !!window.App);
    const hasContent = await page.evaluate(() => document.querySelector('#view')?.children.length > 0);
    check('离线仍能打开并渲染', offlineOK && hasContent);
    const offlineWords = await page.evaluate(() =>
      (window.Store && window.Store.state && window.Store.state.words)
        ? Object.keys(window.Store.state.words).length : -1);
    check('离线可读本地学习数据', offlineWords >= 0, offlineWords + ' 条词汇记录');
  } catch (e) {
    offlineErr = e.message;
    check('离线仍能打开并渲染', false, e.message);
  }
  await ctx.setOffline(false);

  console.log('\n=== 12. 移动端视口 + 独立窗口样式 ===\n');
  await ctx.setOffline(false);
  const mob = await ctx.newPage();
  await mob.setViewportSize({ width: 390, height: 844 });
  await mob.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await mob.waitForTimeout(1200);
  const overflow = await mob.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check('390px 无横向溢出', overflow <= 2, '溢出 ' + overflow + 'px');
  const ttsMob = await mob.evaluate(() => window.TTS.diagnose());
  check('移动端发音可用', ttsMob.supported === true, ttsMob.picked);
  await mob.close();

  console.log('\n=== 13. 控制台错误 ===\n');
  const realErrors = consoleErrors.filter(e => !/favicon|net::ERR_INTERNET_DISCONNECTED|Failed to load resource/i.test(e));
  check('无控制台错误', realErrors.length === 0, realErrors.slice(0, 3).join(' | '));

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