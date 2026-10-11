/**
 * 四阶段学习链 + 新增模块（词根词缀 / 诗歌名句 / 划词取词）验收
 */
const { chromium } = require('playwright-core');
const EXEC = 'C:/Users/lenovo/AppData/Local/ms-playwright/chromium-1243/chrome-win64/chrome.exe';
const BASE = process.env.BASE || 'http://127.0.0.1:8792';

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
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));

  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);

  console.log('\n=== 1. 四阶段导航结构 ===\n');
  const nav = await page.evaluate(() => {
    const groups = Array.from(document.querySelectorAll('.nav .nav-group')).map(g => g.textContent.trim());
    const btns = Array.from(document.querySelectorAll('.nav button')).map(b => b.dataset.v);
    return { groups, btns, total: btns.length };
  });
  console.log('  分组:', JSON.stringify(nav.groups));
  console.log('  模块:', nav.btns.join(' → '));
  check('导航按四阶段分组', nav.groups.length === 5, nav.groups.length + ' 组（4 阶段 + 工具）');
  check('第一阶段是认知输入', nav.groups[0].indexOf('I 认知输入') === 0, nav.groups[0]);
  check('第二阶段是理解解析', nav.groups[1].indexOf('II 理解解析') === 0, nav.groups[1]);
  check('第三阶段是场景运用', nav.groups[2].indexOf('III 场景运用') === 0, nav.groups[2]);
  check('第四阶段是审美拓展', nav.groups[3].indexOf('IV 审美拓展') === 0, nav.groups[3]);
  check('词根词缀在理解解析阶段', nav.btns.indexOf('roots') > nav.btns.indexOf('vocab')
    && nav.btns.indexOf('roots') < nav.btns.indexOf('speak'), '排在词汇之后、口语之前');
  check('诗歌在审美拓展阶段', nav.btns.indexOf('poetry') > nav.btns.indexOf('read'));
  check('新增两个模块已注册', nav.btns.indexOf('roots') >= 0 && nav.btns.indexOf('poetry') >= 0);
  check('顶栏显示当前阶段', await page.evaluate(() => {
    const s = document.getElementById('stageBar');
    return s && /I · 认知输入/.test(s.textContent);
  }));

  console.log('\n=== 2. 词根词缀模块 ===\n');
  await page.evaluate(() => { location.hash = 'roots'; });
  await page.waitForTimeout(1200);
  const roots = await page.evaluate(() => {
    const v = document.getElementById('view');
    const t = v.textContent;
    return {
      chars: t.length,
      failed: document.body.textContent.includes('这个页面出了点问题'),
      rootCards: v.querySelectorAll('.root-card').length,
      bigRoots: v.querySelectorAll('.root-text').length,
      fields: v.querySelectorAll('.field-sec').length,
      demo: v.querySelectorAll('.root-demo').length,
      tips: v.querySelectorAll('.root-tip').length,
      hasOrigin: /拉丁语|希腊语/.test(t),
      // 拆解式实际写法是「pro-（向前）+ spect（看）」，带全角括号释义
      hasBreak: /[a-z]+-\s*（[^）]+）\s*\+/.test(t) && v.querySelectorAll('.break-val').length >= 28,
      speakBtns: v.querySelectorAll('.mini-speak').length
    };
  });
  console.log('  词根页:', JSON.stringify(roots));
  check('词根页渲染正常', roots.chars > 800 && !roots.failed, roots.chars + ' 字符');
  check('按语义场分组', roots.fields >= 8, roots.fields + ' 个语义场');
  check('展示词根大字与含义', roots.bigRoots >= 20, roots.bigRoots + ' 个词根');
  check('有拆解示范', roots.demo >= 15, roots.demo + ' 个');
  check('标注语种来源', roots.hasOrigin === true);
  check('展示构词拆解式', roots.hasBreak === true);
  check('每词可点击发音', roots.speakBtns >= 40, roots.speakBtns + ' 个发音按钮');
  check('有记忆策略提示', roots.tips >= 15, roots.tips + ' 条');

  // 词缀标签
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('#view .segment button'))
      .find(x => x.textContent.trim() === '词缀');
    if (b) b.click();
  });
  await page.waitForTimeout(800);
  const aff = await page.evaluate(() => {
    const v = document.getElementById('view');
    return {
      cards: v.querySelectorAll('.root-card').length,
      words: v.querySelectorAll('.affix-words .chip').length,
      text: v.textContent
    };
  });
  check('词缀页可切换', aff.cards >= 15, aff.cards + ' 个词缀');
  check('词缀给出例词', aff.words >= 60, aff.words + ' 个例词');
  check('词缀含否定类', /不；相反|不；无/.test(aff.text));

  // 反查
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('#view .segment button'))
      .find(x => x.textContent.trim() === '反查');
    if (b) b.click();
  });
  await page.waitForTimeout(600);
  const lk = await page.evaluate(async () => {
    const i = document.querySelector('.lookup-input');
    i.value = 'inspect';
    const btn = Array.from(document.querySelectorAll('#view button'))
      .find(x => x.textContent.trim() === '查询');
    btn.click();
    await new Promise(r => setTimeout(r, 400));
    const out = document.querySelector('.lookup-out');
    return { text: out ? out.textContent : '', hasItem: !!out.querySelector('.lookup-row-item') };
  });
  check('反查面板可用', lk.hasItem === true);
  check('inspect 查到 spect 词根', /spect/.test(lk.text), lk.text.replace(/\s+/g, ' ').slice(0, 46));

  console.log('\n=== 3. 诗歌与名句模块 ===\n');
  await page.evaluate(() => { location.hash = 'poetry'; });
  await page.waitForTimeout(1200);
  const po = await page.evaluate(() => {
    const v = document.getElementById('view');
    const t = v.textContent;
    return {
      chars: t.length,
      failed: document.body.textContent.includes('这个页面出了点问题'),
      cards: v.querySelectorAll('.poem-card').length,
      levels: v.querySelectorAll('.level-sec').length,
      analyses: v.querySelectorAll('.poem-analysis').length,
      words: v.querySelectorAll('.poem-word').length,
      images: v.querySelectorAll('.poimg').length,
      tips: v.querySelectorAll('.poem-tips').length,
      hasCn: /我们|当你|黑夜|希望/.test(t),
      hasAnalysis: /语言赏析/.test(t),
      hasDevice: /破折号|通感|递进重复|重复/.test(t),
      readBtns: v.querySelectorAll('.read-bar').length
    };
  });
  console.log('  诗歌页:', JSON.stringify(po));
  check('诗歌页渲染正常', po.chars > 800 && !po.failed, po.chars + ' 字符');
  check('四级分层展示', po.levels === 4, po.levels + ' 级');
  check('诗卡片数量充足', po.cards >= 14, po.cards + ' 首');
  check('每首都有语言赏析', po.analyses >= 14, po.analyses + ' 条');
  check('列出值得记的词', po.words >= 40, po.words + ' 个');
  check('标注意象', po.images >= 25, po.images + ' 个意象');
  check('提供朗读提示', po.tips >= 14, po.tips + ' 条');
  check('含译文', po.hasCn === true);
  check('含修辞手法标注', po.hasDevice === true);
  check('有朗读控制', po.readBtns >= 14, po.readBtns + ' 组');

  // 译文折叠
  const tg = await page.evaluate(async () => {
    const b = document.querySelector('.toggle-cn');
    if (!b) return { ok: false };
    b.click();
    await new Promise(r => setTimeout(r, 200));
    const hidden = document.querySelector('.poem-cn-line').style.display === 'none';
    return { ok: true, hidden: hidden, label: b.textContent };
  });
  check('译文可折叠（先自译）', tg.ok && tg.hidden === true, tg.label);

  // 名句
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('#view .segment button'))
      .find(x => x.textContent.trim() === '名句');
    if (b) b.click();
  });
  await page.waitForTimeout(700);
  const qt = await page.evaluate(() => {
    const v = document.getElementById('view');
    return { cards: v.querySelectorAll('.quote-card').length, chips: v.querySelectorAll('.quote-filter .chip').length };
  });
  check('名句页可用', qt.cards >= 6, qt.cards + ' 条名句');
  check('名句按主题筛选', qt.chips >= 8, qt.chips + ' 个主题');

  // 写作手法
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('#view .segment button'))
      .find(x => x.textContent.trim() === '写作手法');
    if (b) b.click();
  });
  await page.waitForTimeout(600);
  const wr = await page.evaluate(() => ({
    drills: document.querySelectorAll('.drill-card').length,
    lines: document.querySelectorAll('.drill-line').length
  }));
  check('写作手法练习可用', wr.drills >= 5, wr.drills + ' 组练习');
  check('每组有示范句', wr.lines >= 21, wr.lines + ' 句示范');

  console.log('\n=== 4. 划词取词 ===\n');
  const lookup = await page.evaluate(async () => {
    // 直接调 API 验证核心能力
    window.Lookup.show('inspect');
    await new Promise(r => setTimeout(r, 500));
    const sheet = document.querySelector('.sheet');
    const t = sheet ? sheet.textContent : '';
    return {
      opened: !!sheet,
      hasWord: /inspect/i.test(t),
      hasIpa: /\/.*\//.test(t),
      hasCn: /检查|观察/.test(t),
      hasRoot: /词根来路/.test(t),
      hasSpect: /spect/.test(t),
      hasFamily: /同源词/.test(t),
      hasActions: /词汇模块|词根词缀/.test(t),
      hasRead: /朗读/.test(t)
    };
  });
  console.log('  划词结果:', JSON.stringify(lookup));
  check('划词弹层打开', lookup.opened === true);
  check('显示目标词', lookup.hasWord === true);
  check('显示音标', lookup.hasIpa === true);
  check('显示中文释义', lookup.hasCn === true);
  check('显示词根来路', lookup.hasRoot === true);
  check('标出 spect', lookup.hasSpect === true);
  check('提供同源词链式查询', lookup.hasFamily === true);
  check('提供发音按钮', lookup.hasRead === true);
  check('可跳转到详细模块', lookup.hasActions === true);
  await page.evaluate(() => window.UI.closeAllSheets());

  // 虚词处理
  const stop = await page.evaluate(async () => {
    window.Lookup.show('the');
    await new Promise(r => setTimeout(r, 300));
    const sheet = document.querySelector('.sheet');
    const toast = document.body.textContent.indexOf('虚词') >= 0;
    return { opened: !!sheet, toast: toast };
  });
  check('虚词不弹详细讲解', stop.opened === false);
  await page.evaluate(() => window.UI.closeAllSheets());

  console.log('\n=== 5. 模块衔接 ===\n');
  // 划词 → 词汇模块跳转（含 focusWord 落点）
  const jump = await page.evaluate(async () => {
    window.UI.closeAllSheets();
    window.Lookup.show('educate');
    // 首次查不到时会拉 L5/L6 分片（各约 400KB），按钮是异步补上的
    await new Promise(r => setTimeout(r, 2500));
    const btn = Array.from(document.querySelectorAll('.sheet button'))
      .find(x => /词汇模块/.test(x.textContent));
    if (!btn) return { ok: false, hash: location.hash };
    btn.click();
    await new Promise(r => setTimeout(r, 2500));
    return {
      ok: true,
      hash: location.hash,
      pending: window.__pendingWord,
      viewLen: document.getElementById('view').textContent.length,
      onVocab: document.body.getAttribute('data-view') === 'vocab'
        || !!document.getElementById('vocabBody'),
      hit: !!document.querySelector('.lk-hit'),
      searchVal: (document.querySelector('#vocabBody input[type="search"]') || {}).value || ''
    };
  });
  // location.hash 自带 '#' 前缀，所以要从 index 1 开始比
  check('划词可跳转到词汇讲解', jump.ok && jump.hash.indexOf('vocab') === 1, jump.hash);
  check('跳转时携带目标词', jump.pending === 'educate', 'pending=' + jump.pending);
  check('跳转后页面正常渲染', jump.viewLen > 300, jump.viewLen + ' 字符');
  check('已定位到词汇模块', jump.onVocab === true, 'vocabBody=' + jump.onVocab);
  // focusWord 现在不走浏览器搜索框（那只能搜已加载分片），
  // 而是直接定位词条并高亮，所以断言 .lk-hit 落点
  check('已定位并高亮目标词条', jump.hit === true, 'lk-hit=' + jump.hit);

  // 对话示例 tab（日常交流 · 场景运用阶段）
  const dlg = await page.evaluate(async () => {
    location.hash = 'dailycomm';
    await new Promise(r => setTimeout(r, 1200));
    const btn = Array.from(document.querySelectorAll('#dcTabs button'))
      .find(x => x.dataset.dc === 'dialog');
    if (!btn) return { ok: false };
    btn.click();
    await new Promise(r => setTimeout(r, 600));
    return {
      ok: true,
      cards: document.querySelectorAll('#dcBody .card[id^="dlg_"]').length,
      turns: document.querySelectorAll('.dc-turn').length,
      scenes: document.querySelectorAll('.dc-scene').length,
      notes: document.querySelectorAll('.dc-note').length,
      keys: document.querySelectorAll('.dc-key').length,
      stat: window.CommDialogs ? window.CommDialogs.stats().dialogs : 0
    };
  });
  check('对话示例数据已挂载', dlg.ok && dlg.stat >= 15, dlg.stat + ' 段');
  check('对话卡片全部渲染', dlg.ok && dlg.cards === dlg.stat, dlg.cards + '/' + dlg.stat);
  check('对话轮次渲染完整', dlg.ok && dlg.turns > 80, dlg.turns + ' 句');
  check('每段标注使用场景', dlg.ok && dlg.scenes === dlg.stat, dlg.scenes + '/' + dlg.stat);
  check('每段标注语域提醒', dlg.ok && dlg.notes === dlg.stat, dlg.notes + '/' + dlg.stat);
  check('重点表达已标出', dlg.ok && dlg.keys >= 30, dlg.keys + ' 处');

  // 表达 → 对话 的反向跳转
  const back = await page.evaluate(async () => {
    location.hash = 'dailycomm';
    await new Promise(r => setTimeout(r, 1200));
    const b = Array.from(document.querySelectorAll('#dcTabs button'))
      .find(x => x.dataset.dc === 'browse');
    b.click();
    await new Promise(r => setTimeout(r, 500));
    const jb = Array.from(document.querySelectorAll('button'))
      .find(x => /在对话中/.test(x.textContent));
    if (!jb) return { found: false };
    jb.click();
    await new Promise(r => setTimeout(r, 700));
    return {
      found: true,
      tab: (document.querySelector('#dcTabs button.on') || {}).textContent,
      cards: document.querySelectorAll('#dcBody .card[id^="dlg_"]').length
    };
  });
  check('表达可反查到所在对话', back.found === true, '找到跳转按钮');
  check('跳转后切到对话示例', back.tab === '对话示例', back.tab);
  check('跳转后对话列表渲染', back.cards > 0, back.cards + ' 段');

  // 跟读评测入口（依赖浏览器语音识别，Playwright 无此能力时按降级断言）
  const sh = await page.evaluate(() => {
    const canRec = !!(window.ui && window.ui.canRecognize && window.ui.canRecognize());
    const turns = document.querySelectorAll('.dc-turn').length;
    const recBtns = document.querySelectorAll('.dc-turn .mini-btn.rec').length;
    return { canRec, turns, recBtns };
  });
  check('跟读评测入口按能力显隐', sh.canRec ? sh.recBtns === sh.turns : sh.recBtns === 0,
    'canRecognize=' + sh.canRec + ' 按钮=' + sh.recBtns);

  console.log('\n=== 6. 响应式 ===\n');

  /* 导航在不同断点下的行为是不同的，不能用一套断言套两个场景：
       窄屏（<1100px）15 个项目必然放不下 → 横向滚动
       宽屏（≥1100px）改成换行 → 全部可见，不滚动
     原来只有一条「导航可横向滚动」，在宽屏下靠「放不下」侥幸通过；
     改成换行后它就失效了。这里按断点分别断言各自应有的行为。 */

  const navD = await page.evaluate(() => {   // 当前是 1440px 宽屏
    const nav = document.getElementById('nav');
    const bt = document.querySelector('.brand-text');
    const cs = getComputedStyle(nav);
    const rail = document.querySelector('.nav-rail');
    return {
      brand: bt ? bt.textContent.trim() : '',
      brandVisible: bt ? getComputedStyle(bt).display !== 'none' : false,
      clientW: nav.clientWidth,
      scrollW: nav.scrollWidth,
      minW: cs.minWidth,
      overflowX: cs.overflowX,
      flexWrap: cs.flexWrap,
      maskNone: getComputedStyle(rail).maskImage === 'none',
      btns: nav.querySelectorAll('button').length,
      groups: nav.querySelectorAll('.nav-group').length
    };
  });
  check('站名为 Lumen', navD.brand === 'Lumen', navD.brand);
  check('桌面端站名可见', navD.brandVisible === true, 'brand-text display');
  check('导航 min-width 已解绑', navD.minW === '0px', navD.minW);
  check('导航按钮与分组齐全', navD.btns === 15 && navD.groups === 5,
    navD.btns + ' 按钮 / ' + navD.groups + ' 分组');
  // 宽屏换行：全部项目一次可见，不该再有横向滚动
  check('宽屏导航换行显示（全部可见，无需滚动）',
    navD.flexWrap === 'wrap' && navD.scrollW <= navD.clientW + 2,
    navD.scrollW + ' ≤ ' + navD.clientW + ' (wrap=' + navD.flexWrap + ')');
  check('宽屏取消两侧渐隐', navD.maskNone === true);

  // 首项必须完整可见，不能被推出视野
  const firstBtn = await page.evaluate(() => {
    const nav = document.getElementById('nav');
    const nl = nav.getBoundingClientRect();
    const b = nav.querySelector('button');
    const bl = b.getBoundingClientRect();
    return { navL: nl.left, btnL: bl.left, btnR: bl.right, navR: nl.right, text: b.textContent.trim() };
  });
  check('导航首个按钮完整可见',
    firstBtn.btnL >= firstBtn.navL - 2 && firstBtn.btnR <= firstBtn.navR + 2,
    firstBtn.text + ' [' + Math.round(firstBtn.btnL) + '→' + Math.round(firstBtn.btnR)
    + '] in [' + Math.round(firstBtn.navL) + '→' + Math.round(firstBtn.navR) + ']');

  // hidden 属性兜底：带 hidden 的按钮不应被 CSS 的 display 覆盖
  const hid = await page.evaluate(() => {
    const b = document.getElementById('installBtn');
    return { hidden: b.hasAttribute('hidden'), w: b.getBoundingClientRect().width };
  });
  check('hidden 元素正确隐藏', !hid.hidden || hid.w === 0, 'width=' + hid.w);
  for (const w of [390, 768, 1440]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(400);
    const ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(w + 'px 无横向溢出', ov <= 0, '溢出 ' + ov + 'px');
  }
  // 移动端下两个新模块也要正常
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => { location.hash = 'roots'; });
  await page.waitForTimeout(800);
  const mRoots = await page.evaluate(() => document.getElementById('view').textContent.length);
  check('移动端词根页正常', mRoots > 600, mRoots + ' 字符');
  await page.evaluate(() => { location.hash = 'poetry'; });
  await page.waitForTimeout(800);
  const mPo = await page.evaluate(() => document.getElementById('view').textContent.length);
  check('移动端诗歌页正常', mPo > 600, mPo + ' 字符');

  console.log('\n=== 7. 发音链路 ===\n');
  /* 这一节验证的是「点了发音能不能真的出声」。
     历史 bug 的教训：决策层 resolveMode 只看设备有没有英语语音，
     在没有语音包的机器上直接返回 none，代理路径根本没机会执行——
     表面上所有代码都在，实际一条也走不通。
     所以断言直接落到 mode 决策结果和音频真实播放上。 */
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(BASE + '/index.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const ttsCfg = await page.evaluate(() => ({
    base: window.TTS && window.TTS.getProxy(),
    alive: !!(window.TTS && window.TTS.proxyAlive && window.TTS.proxyAlive()),
    hasSetProxy: typeof (window.TTS || {}).setProxy === 'function',
    hasVoices: typeof (window.TTS || {}).proxyVoices === 'function',
    hasWarmup: typeof (window.TTS || {}).warmup === 'function'
  }));
  check('代理接口已导出', ttsCfg.hasSetProxy && ttsCfg.hasVoices && ttsCfg.hasWarmup,
    'setProxy/proxyVoices/warmup');
  check('代理地址已配置', !!ttsCfg.base, ttsCfg.base || '(空)');
  check('代理已连接', ttsCfg.alive === true, ttsCfg.alive ? 'alive' : '未连接');

  const mode = await page.evaluate(() => {
    const d = window.TTS.diagnose();
    return { env: d.env, mode: d.mode, en: d.englishVoices, total: d.totalVoices, proxy: d.proxyOn };
  });
  check('决策层选中代理', mode.mode === 'proxy' || mode.env === 'proxy',
    'mode=' + mode.mode + ' env=' + mode.env + ' 本机英语语音=' + mode.en);
  check('代理优先级高于本机',
    mode.en === 0 ? mode.mode === 'proxy' : true,
    '本机英语语音 ' + mode.en + '/' + mode.total + ' 个');

  // 真实播放：整句（口语模块的核心内容），这是最容易被卡住的一类
  const play = await page.evaluate(() => new Promise(resolve => {
    const log = { made: false, playing: false, ended: false, errored: false, speakingSeen: false };
    const Orig = window.Audio;
    window.Audio = function () {
      const a = new Orig();
      log.made = true;
      a.addEventListener('playing', () => {
        log.playing = true;
        log.speakingSeen = window.TTS.isSpeaking();
      });
      a.addEventListener('ended', () => { log.ended = true; });
      a.addEventListener('error', () => { log.errored = true; });
      const op = a.play.bind(a);
      a.play = function () {
        const p = op();
        if (p && p.catch) p.catch(() => { log.errored = true; });
        return p;
      };
      return a;
    };
    window.Audio.prototype = Orig.prototype;
    window.TTS.speak("I don't expect to have this ready by Friday, but I'll send you a draft tomorrow.");
    setTimeout(() => resolve(log), 9000);
  }));
  check('整句取到音频', play.made && !play.errored, 'played=' + play.playing);
  check('音频真实开始播放', play.playing === true, 'playing=' + play.playing);
  check('音频播放至结束', play.ended === true, 'ended=' + play.ended);
  check('播放中 isSpeaking 正确', play.speakingSeen === true, 'isSpeaking=' + play.speakingSeen);

  // 发音设置页的代理卡
  await page.goto(BASE + '/index.html#tttsettings', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);
  const ttsUI = await page.evaluate(() => {
    const c = Array.from(document.querySelectorAll('.card'))
      .find(x => (x.textContent || '').indexOf('在线发音（推荐）') >= 0);
    if (!c) return { found: false };
    const st = Array.from(document.querySelectorAll('.card'))
      .find(x => (x.textContent || '').indexOf('当前设备状态') >= 0);
    return {
      found: true,
      tag: (c.querySelector('.tag') || {}).textContent || '',
      voiceBtns: Array.from(c.querySelectorAll('button'))
        .filter(b => /（[^）]*音/.test(b.textContent)).length,
      hasSentenceTest: (c.textContent || '').indexOf('试听整句') >= 0,
      stateTag: (st && st.querySelector('.tag') || {}).textContent || '',
      stateHasOnlineRow: st ? (st.textContent || '').indexOf('在线发音服务') >= 0 : false
    };
  });
  check('代理卡已渲染', ttsUI.found === true, ttsUI.tag);
  check('代理状态显示可用', /可用/.test(ttsUI.tag || ''), ttsUI.tag);
  check('音色可选', ttsUI.voiceBtns >= 10, ttsUI.voiceBtns + ' 个音色');
  check('整句试听按钮存在', ttsUI.hasSentenceTest === true);
  check('状态卡新增在线发音行', ttsUI.stateHasOnlineRow === true);
  check('状态卡标签为在线可用', /在线发音/.test(ttsUI.stateTag || ''), ttsUI.stateTag);

  /* ---------- 音质 ---------- */
  console.log('\n=== 7b. 音质 ===\n');
  // 服务端实测结论：采样率被锁在 24kHz，48kbps 会被砍高频导致发闷，
  // 必须用 96kbps。48kHz 系列服务端直接拒绝（no turn.end）。
  const qa = await page.evaluate(async () => {
    const base = window.TTS.getProxy();
    const j = await fetch(base + '/voices').then(r => r.json()).catch(() => null);
    const r = await fetch(base + '/tts?text=' + encodeURIComponent('Mr. Smith is a Dr. from the U.S.')
      + '&voice=en-US-AriaNeural&rate=0%25').catch(() => null);
    return {
      format: j && j.format,
      voices: (j && j.voices) || [],
      bytes: r ? (await r.arrayBuffer()).byteLength : 0
    };
  });
  check('音频格式为 96kbps', /96kbitrate/.test(qa.format || ''), qa.format);
  check('未使用不可用的 48kHz 格式', !/48khz/.test(qa.format || ''), qa.format);
  check('缩写与符号已展开朗读', qa.bytes > 10000, qa.bytes + ' 字节');

  // 失效音色必须已从列表剔除：en-US-JaneNeural / en-US-EvanNeural
  // 这两个实测会静默失败（服务端关闭连接且不报错）
  const ids = qa.voices.map(v => v.id);
  check('已剔除静默失败的音色',
    ids.indexOf('en-US-JaneNeural') < 0 && ids.indexOf('en-US-EvanNeural') < 0,
    ids.length + ' 个音色');
  check('每个音色都有用途说明',
    qa.voices.every(v => !!v.desc), qa.voices.filter(v => !v.desc).length + ' 个缺说明');
  check('标注了跟读推荐音色',
    qa.voices.filter(v => v.recommended).length >= 3,
    qa.voices.filter(v => v.recommended).map(v => v.name).join('/'));

  // 缓存必须按音频格式分键，否则换音质后旧音频会被继续返回。
  // 注意别假设第一次一定是 MISS：磁盘缓存是持久的，上一轮跑过同样文本时
  // 第一次就会 HIT。真正要断言的是「第二次一定 HIT」。
  const cacheOK = await page.evaluate(async () => {
    const base = window.TTS.getProxy();
    const u = '?text=' + encodeURIComponent('cache probe ' + Date.now())
      + '&voice=en-US-AriaNeural&rate=0%25';
    const first = await fetch(base + '/tts' + u, { cache: 'no-store' });
    const h1 = first.headers.get('X-Cache');
    await first.arrayBuffer();
    const second = await fetch(base + '/tts' + u, { cache: 'no-store' });
    const h2 = second.headers.get('X-Cache');
    await second.arrayBuffer();
    return { first: h1, second: h2 };
  });
  check('首次请求成功返回音频',
    cacheOK.first === 'MISS' || cacheOK.first === 'HIT', cacheOK.first);
  check('同文本二次命中缓存', cacheOK.second === 'HIT',
    cacheOK.first + ' → ' + cacheOK.second);

  /* ---------- 抗限流 ----------
     Edge TTS 对短时间内的密集请求会直接断连（ECONNRESET / no turn.end）。
     服务端必须有退避重试，否则用户感知是「发音时好时坏、偶尔直接没声音」。
     连续发几个不同文本，任何一次失败都会暴露这个问题。 */
  const burst = await page.evaluate(async () => {
    const base = window.TTS.getProxy();
    const out = [];
    for (let i = 0; i < 4; i++) {
      try {
        const r = await fetch(base + '/tts?text=' + encodeURIComponent('burst probe ' + Date.now() + ' ' + i)
          + '&voice=en-US-AriaNeural&rate=0%25', { cache: 'no-store' });
        const b = await r.arrayBuffer();
        out.push({ status: r.status, bytes: b.byteLength });
      } catch (e) {
        out.push({ status: 0, bytes: 0, err: e.message });
      }
    }
    return out;
  });
  check('连续快速请求全部成功',
    burst.every(r => r.status === 200 && r.bytes > 200),
    burst.map(r => r.status + '/' + r.bytes).join(' '));

  /* ---------- 打开方式的兼容性 ----------
     真实 bug：resolveTTSProxy 曾对 file:// 返回空串（为 App 内防白等超时），
     但 file:// 也意味着用户在电脑上双击 index.html，
     结果代理地址为空 → 完全连不上。这是把两种场景混为一谈。 */
  const opened = await page.evaluate(() => ({
    base: window.TTS.getProxy(),
    reachable: window.TTS.proxyReachable(),
    // 注意：这两个 typeof 必须留在 evaluate 内部。
    // 放到外面会跑在 Node 环境里，window 未定义。
    hasProbe: typeof window.TTS.probeProxy === 'function',
    hasReachable: typeof window.TTS.proxyReachable === 'function'
  }));
  check('http 打开时已探测到服务可达',
    opened.reachable === true, 'reachable=' + opened.reachable);
  check('连通性探测接口已导出',
    opened.hasProbe && opened.hasReachable,
    'probeProxy=' + opened.hasProbe + ' proxyReachable=' + opened.hasReachable);

  // file:// 场景：必须仍配置代理地址，否则双击打开就完全用不了。
  // 用项目真实路径，不从 BASE 反推——BASE 带端口，
  // 简单 replace('http://','') 会得到 127.0.0.1:8792 这种非法 file URL。
  const PROJ = require('path').resolve(__dirname, '..').replace(/\\/g, '/');
  const p2 = await browser.newPage();
  await p2.goto('file:///' + PROJ + '/index.html',
    { waitUntil: 'domcontentloaded' });
  await p2.waitForTimeout(3000);
  const f = await p2.evaluate(() => ({
    base: window.TTS.getProxy(),
    reachable: window.TTS.proxyReachable()
  }));
  check('file:// 打开时也能连上服务',
    !!f.base && f.reachable === true, f.base + ' → ' + f.reachable);
  await p2.close();

  /* ---------- 7c. 移动端可达性 ---------- */
  console.log('\n=== 7c. 移动端可达性 ===\n');

  /* 窄屏导航必须仍然是横向滚动。
     宽屏改成换行是刻意的，但窄屏下 15 个项目永远放不下，
     换行会把顶栏撑到四五行高，反而更糟。 */
  const pNav = await browser.newPage();
  await pNav.setViewportSize({ width: 390, height: 844 });
  await pNav.goto(BASE, { waitUntil: 'domcontentloaded' });
  await pNav.waitForTimeout(1200);
  const navNarrow = await pNav.evaluate(() => {
    const nav = document.getElementById('nav');
    const cs = getComputedStyle(nav);
    const rail = document.querySelector('.nav-rail');
    const nl = nav.getBoundingClientRect();
    const b = nav.querySelector('button');
    const bl = b.getBoundingClientRect();
    return {
      clientW: nav.clientWidth,
      scrollW: nav.scrollWidth,
      overflowX: cs.overflowX,
      flexWrap: cs.flexWrap,
      maskOn: getComputedStyle(rail).maskImage !== 'none',
      navL: nl.left, navR: nl.right, btnL: bl.left, btnR: bl.right,
      hasH: rail.getBoundingClientRect().height
    };
  });
  check('窄屏导航拿到的宽度足够', navNarrow.clientW >= 360, navNarrow.clientW + 'px');
  check('窄屏导航保持横向滚动（不放不下时换行会撑爆顶栏）',
    navNarrow.flexWrap === 'nowrap' && navNarrow.overflowX === 'auto'
    && navNarrow.scrollW > navNarrow.clientW,
    navNarrow.flexWrap + '/' + navNarrow.overflowX + ' '
    + navNarrow.scrollW + '>' + navNarrow.clientW);
  check('窄屏保留两侧渐隐（提示可横向滚动）', navNarrow.maskOn === true);
  check('窄屏导航不换行（顶栏高度可控）',
    navNarrow.hasH < 90, navNarrow.hasH.toFixed(0) + 'px');
  await pNav.close();

  // 关键点：Node 的 server.listen(PORT) 默认只绑 127.0.0.1，
  // 手机即使和电脑同一 WiFi 也连不上。必须显式绑 0.0.0.0。
  const SERVER = require('path').resolve(__dirname, '..', 'tools', 'tts-server.js');
  const src = require('fs').readFileSync(SERVER, 'utf8');
  check('服务端监听 0.0.0.0（否则手机连不上）',
    /listen\(\s*PORT\s*,\s*['"]0\.0\.0\.0['"]/.test(src),
    (src.match(/server\.listen\([^)]*\)/) || ['未找到 listen 调用'])[0]);
  check('启动时打印局域网地址', /lanAddresses/.test(src) && /手机访问/.test(src));

  // 实际拿一个非回环地址探测，证明监听确实生效
  const os = require('os');
  let lan = null;
  for (const name of Object.keys(os.networkInterfaces())) {
    for (const n of os.networkInterfaces()[name] || []) {
      const v4 = n.family === 'IPv4' || n.family === 4;
      if (v4 && n.address && !n.internal && !n.address.startsWith('169.254.')) {
        lan = n.address; break;
      }
    }
    if (lan) break;
  }
  let lanOk = false, lanDetail = '未检测到局域网地址，跳过';
  if (lan) {
    lanDetail = lan + ' 未监听或不可达';
    try {
      const r = await fetch('http://' + lan + ':8788/health', {
        signal: AbortSignal.timeout(5000), cache: 'no-store'
      });
      const j = await r.json();
      lanOk = r.status === 200 && !!(j && j.ok);
      lanDetail = 'http://' + lan + ':8788 → ' + r.status;
    } catch (e) { lanDetail = lan + ' → ' + (e.code || e.message); }
  }
  check('局域网地址可访问 /health', lanOk, lanDetail);

  // 设置页必须给出可编辑的地址输入框，否则手机上没法改成局域网地址
  const p3 = await browser.newPage();
  await p3.setViewportSize({ width: 390, height: 844 });
  await p3.goto(BASE + '#tttsettings', { waitUntil: 'domcontentloaded' });
  await p3.waitForTimeout(1500);
  const m = await p3.evaluate(() => {
    const inp = document.querySelector('input[type=url]');
    return {
      hasInput: !!inp,
      fontSize: inp ? parseFloat(getComputedStyle(inp).fontSize) : 0,
      text: document.body.innerText
    };
  });
  check('服务地址是可编辑输入框（手机上才能改）', m.hasInput);
  // iOS 聚焦时字号 <16px 会强制放大整个页面
  check('地址输入框字号 ≥16px（避免 iOS 聚焦缩放）', m.fontSize >= 16, m.fontSize + 'px');
  check('已提示手机需用局域网地址', /127\.0\.0\.1.*手机|手机.*127\.0\.0\.1|WiFi/i.test(m.text));
  await p3.close();

  /* ---------- 7d. 离线音频包（不依赖任何网络） ---------- */
  console.log('\n=== 7d. 离线音频包（免网络兜底） ===\n');

  const p4 = await browser.newPage();
  await p4.goto(BASE, { waitUntil: 'domcontentloaded' });
  await p4.waitForTimeout(800);

  const pk = await p4.evaluate(() => {
    const T = window.TTS;
    return {
      hasPack: !!(window.AUDIO_PACK && window.AUDIO_PACK.words),
      count: (T.packInfo && T.packInfo().count) || 0,
      // 取一个包内词和一个包外词，验证查询逻辑双向正确
      inUrl: T.packUrl('one'),
      outUrl: T.packUrl('zzz-not-a-real-word-xyz'),
      hasIn: T.packHas('one'),
      hasOut: T.packHas('zzz-not-a-real-word-xyz'),
      caseInsensitive: T.packHas('ONE')
    };
  });
  check('离线包清单已加载', pk.hasPack);
  check('离线包收录了高频词', pk.count >= 600, pk.count + ' 词');
  check('包内词能解析出音频地址', !!pk.inUrl && /assets\/audio\/words\/\w+\.mp3$/.test(pk.inUrl), pk.inUrl);
  check('包外词返回 null（交回降级链）', pk.outUrl === null && pk.hasOut === false);
  check('查词不区分大小写', pk.caseInsensitive === true);

  // 关键验证：把代理地址改成必然连不通的端口，
  // 模拟「手机连不上电脑上服务」，此时包内词仍必须能真实播放。
  const played = await p4.evaluate(async () => {
    const T = window.TTS;
    T.setProxy('http://127.0.0.1:9');   // 9 端口是 discard，必然连不上
    T.stop();
    await new Promise(r => setTimeout(r, 300));
    return await new Promise(resolve => {
      let started = false, ended = false, err = '';
      const t = setTimeout(() => resolve({ started, ended, err: err || 'timeout' }), 9000);
      const h = T.speak('one', {
        onstart: () => { started = true; },
        onend: () => { ended = true; clearTimeout(t); resolve({ started, ended, err }); },
        onerror: (e) => { err = e; clearTimeout(t); resolve({ started, ended, err }); }
      });
      return h;
    });
  });
  check('代理连不通时，离线包仍能真实播放',
    played.started && played.ended, JSON.stringify(played));

  // 音频文件本身必须真的存在且是合法 mp3
  const audioOk = await p4.evaluate(async () => {
    const T = window.TTS;
    const url = T.packUrl('one');
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) return 'HTTP ' + r.status;
      const b = await r.blob();
      // mp3 文件头：ID3 标签或 0xFFEx 帧同步
      const head = new Uint8Array(await b.slice(0, 3).arrayBuffer());
      const isID3 = head[0] === 0x49 && head[1] === 0x44 && head[2] === 0x33;
      const isFrame = head[0] === 0xFF && (head[1] & 0xE0) === 0xE0;
      return (isID3 || isFrame) ? b.size + ' 字节 mp3' : '不是 mp3';
    } catch (e) { return 'ERR ' + e.message; }
  });
  check('音频文件是合法 mp3', /字节 mp3$/.test(audioOk), audioOk);

  // 恢复代理地址，避免影响后续测试
  await p4.evaluate(() => { window.TTS.setProxy('http://127.0.0.1:8788'); });
  await p4.close();

  /* ---------- 7e. 设计令牌与无障碍 ---------- */
  console.log('\n=== 7e. 设计令牌与无障碍 ===\n');

  const CSS = require('fs').readFileSync(
    require('path').resolve(__dirname, '..', 'assets', 'css', 'style.css'), 'utf8');

  /* 对比度校验：把令牌值算出来，而不是相信注释里写的「已通过」。 */
  function lum(hex) {
    const m = hex.replace('#', '').match(/../g).map(h => {
      let c = parseInt(h, 16) / 255;
      c = c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      return c;
    });
    return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2];
  }
  function ratio(a, b) {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }
  function tok(name) {
    const m = CSS.match(new RegExp('--' + name + ':\\s*(#[0-9a-fA-F]{6})'));
    return m ? m[1] : null;
  }

  const W = tok('on-primary') || '#ffffff';
  const SURF = tok('surface') || '#ffffff';
  const BG = tok('bg') || '#f6f7f9';

  /* 弱化文字必须同时在白色卡片与灰色底上达标——
     只按白色校验会漏掉 4.25 这种在页面底色上不达标的值。 */
  const contrastPairs = [
    ['正文 text / 卡片', tok('text'), SURF],
    ['正文 text / 页面底', tok('text'), BG],
    ['次要 text-2 / 卡片', tok('text-2'), SURF],
    ['弱化 text-3 / 卡片', tok('text-3'), SURF],
    ['弱化 text-3 / 页面底', tok('text-3'), BG],
    ['链接 primary / 卡片', tok('primary'), SURF],
    ['白字 / primary', W, tok('primary')],
    ['白字 / success', W, tok('success')],
    ['白字 / danger', W, tok('danger')],
    ['ink / primary-soft', tok('primary-ink'), tok('primary-soft')],
    ['ink / success-soft', tok('success-ink'), tok('success-soft')],
    ['ink / warn-soft', tok('warn-ink'), tok('warn-soft')],
    ['ink / danger-soft', tok('danger-ink'), tok('danger-soft')]
  ];
  const badContrast = [];
  contrastPairs.forEach(([name, fg, bg]) => {
    if (!fg || !bg) { badContrast.push(name + '(令牌缺失)'); return; }
    const r = ratio(fg, bg);
    if (r < 4.5) badContrast.push(name + '=' + r.toFixed(2));
  });
  check('全部前景/背景组合通过 WCAG AA (4.5:1)',
    badContrast.length === 0, badContrast.join(' '));

  /* 自引用变量：--x: var(--x) 会让整组色值静默失效 */
  const selfRefs = [];
  const reSelf = /(--[\w-]+):\s*var\((--[\w-]+)\)/g;
  let mS;
  while ((mS = reSelf.exec(CSS))) {
    if (mS[1] === mS[2]) selfRefs.push(mS[1]);
  }
  check('没有自引用变量（--x: var(--x) 会静默失效）',
    selfRefs.length === 0, selfRefs.join(' '));

  /* 未定义变量：引用了但没定义，浏览器会丢弃整条声明 */
  const defined = new Set();
  const reDef = /(--[\w-]+)\s*:/g;
  let mD;
  while ((mD = reDef.exec(CSS))) defined.add(mD[1]);
  const used = new Set();
  const reUse = /var\((--[\w-]+)/g;
  let mU;
  while ((mU = reUse.exec(CSS))) used.add(mU[1]);
  const undef = [...used].filter(v => !defined.has(v));
  check('没有未定义变量', undef.length === 0, undef.join(' '));

  /* 组件层不该再有硬编码色值（:root 之外） */
  const bodyCss = CSS.slice(CSS.indexOf('\n}', CSS.indexOf(':root {')));
  const hardColors = {};
  const reHard = /#[0-9a-fA-F]{3,8}\b/g;
  let mH;
  while ((mH = reHard.exec(bodyCss))) {
    if (!['#000', '#fff', '#ffffff', '#000000'].includes(mH[0])) {
      hardColors[mH[0]] = (hardColors[mH[0]] || 0) + 1;
    }
  }
  check('组件层无硬编码色值', Object.keys(hardColors).length === 0,
    Object.entries(hardColors).map(([c, n]) => c + '×' + n).join(' '));

  /* 字体统一：不允许组件里直接写 Georgia */
  check('字体统一走令牌（无硬编码 Georgia）',
    !/font-family:\s*['"]Georgia/.test(CSS),
    (CSS.match(/font-family:\s*['"]Georgia/g) || []).length + ' 处残留');

  /* 动效规范 */
  const allTransition = (CSS.match(/transition:\s*all/g) || []).length;
  check('无 transition: all（含 width/height 会触发重排）',
    allTransition === 0, allTransition + ' 处');
  check('支持 prefers-reduced-motion',
    /@media \(prefers-reduced-motion: reduce\)/.test(CSS));
  check('尊重 prefers-contrast: more',
    /@media \(prefers-contrast: more\)/.test(CSS));

  /* 触控目标：移动端不小于 44px */
  check('移动端触控目标 ≥44px', /--touch:\s*44px/.test(CSS));
  check('提供跳过导航链接', /\.skip-link/.test(CSS));
  const html = require('fs').readFileSync(
    require('path').resolve(__dirname, '..', 'index.html'), 'utf8');
  check('页面已接入跳过导航', /class="skip-link"/.test(html));
  check('主内容区可接收焦点', /id="view"[^>]*tabindex="-1"/.test(html));

  /* ---------- 7f. 发音质量 ---------- */
  console.log('\n=== 7f. 发音质量（文本预处理） ===\n');

  const prep = require(require('path').resolve(__dirname, '..', 'tools', 'tts-prep.js'));
  /* 用 RegExp 构造而不是 /.../ 字面量：
     'kilometers per hour' 这类含斜杠的正则写成字面量会被 / 提前截断。 */
  function R(src) { return new RegExp(src); }
  const cases = [
    ['千分位数字不再逐字符拼读', '约需 4,200 小时',
      R('four thousand two hundred'), R('four comma')],
    ['百分号读作 percent', '正确率 70%',
      R('seventy percent'), null],
    ['比较符号不再丢失', '得分 ≥ 85',
      R('at least'), null],
    ['时刻读作 half past', '会议在 7:30',
      R('half past seven'), R('colon')],
    ['年份用英语习惯读法', '出版于 1995 年',
      R('nineteen ninety-five'), R('one thousand nine hundred')],
    ['区间读作 to', '需要 8-12 周',
      R('eight to twelve'), R('dash')],
    ['复合单位不被斜杠拆开', '限速 60km/h',
      R('sixty kilometers per hour'), R('slash')],
    ['小数逐位读', '价格 42.5',
      R('forty-two point five'), null],
    ['金额按整体读', '价格 $3.50',
      R('three dollars fifty cents'), R('point')],
    ['缩写展开', 'Prof. Smith',
      R('Professor Smith'), null],
    ['箭头符号', 'A → B',
      R('A to B'), null],
    /* 不变的句子直接给期望字符串：全等比较比正则更严格，
       任何多余空格或符号改动都会被这条抓住。 */
    ['普通英文句不被破坏', 'Could you walk me through the process?',
      'Could you walk me through the process?', null],
    ['连字符词不被拆', 'That is a well-known fact in academia.',
      'That is a well-known fact in academia.', null],
    ['缩写后的句号不残留', 'The report was written by Dr. Chen.',
      'The report was written by Doctor Chen.', null]
  ];

  cases.forEach(([name, input, want, forbid]) => {
    const out = prep.prepText(input);
    /* 期望值可以用正则或字符串。字符串走全等比较——
       对「不该被破坏」这类用例，全等比正则更严格也更易读。 */
    const okWant = want instanceof RegExp ? want.test(out) : out === want;
    const okForbid = forbid ? (forbid instanceof RegExp ? !forbid.test(out) : out !== forbid) : true;
    check('prepText · ' + name, okWant && okForbid, out);
  });

  /* 服务端必须使用共享规则，不能再各写一份 */
  const srvSrc = require('fs').readFileSync(
    require('path').resolve(__dirname, '..', 'tools', 'tts-server.js'), 'utf8');
  check('服务端引用共享预处理模块',
    /require\(['"]\.\/tts-prep\.js['"]\)/.test(srvSrc));
  const preSrc = require('fs').readFileSync(
    require('path').resolve(__dirname, '..', 'tools', 'pregen-audio.js'), 'utf8');
  check('离线包生成器引用同一模块（两条路径读法一致）',
    /require\(['"]\.\/tts-prep\.js['"]\)/.test(preSrc));

  /* pitch 必须进缓存键，否则换语调会拿到旧音频 */
  check('缓存键包含 pitch', /cacheKey[\s\S]{0,220}pitch/.test(srvSrc));
  check('服务端支持 pitch 参数',
    /searchParams\.get\(['"]pitch['"]\)/.test(srvSrc));
  // volume 在服务端会直接关闭连接，SSML 里不能出现
  check('SSML 不含 volume（服务端会拒绝该属性）',
    !/prosody[^>]*volume=/.test(srvSrc));

  /* pitch 端到端：不同音高必须是不同的缓存条目。
     注意不能假设首次请求一定 MISS——磁盘缓存是持久的，
     前面几轮测试可能已经把同一段文本合成了。 */
  const base2 = BASE.replace(/:\d+$/, '') + ':8788';
  if (base2.includes('8788')) {
    /* 带随机后缀，保证这一轮是全新内容 */
    const t2 = 'Cache probe ' + Math.random().toString(36).slice(2, 8) + ' one more time.';
    const q = 'voice=en-US-AriaNeural&text=' + encodeURIComponent(t2) + '&rate=' + encodeURIComponent('+0%');
    const r1 = await fetch(base2 + '/tts?' + q).catch(() => null);
    await new Promise(r => setTimeout(r, 1200));
    const r2 = await fetch(base2 + '/tts?' + q + '&pitch=3').catch(() => null);
    await new Promise(r => setTimeout(r, 800));
    const r3 = await fetch(base2 + '/tts?' + q + '&pitch=3').catch(() => null);
    await new Promise(r => setTimeout(r, 800));
    const r4 = await fetch(base2 + '/tts?' + q).catch(() => null);
    const c1 = r1 && r1.headers.get('x-cache');
    const c2 = r2 && r2.headers.get('x-cache');
    const c3 = r3 && r3.headers.get('x-cache');
    const c4 = r4 && r4.headers.get('x-cache');
    check('不同音高各自缓存（第一次 MISS、第二次 HIT）',
      c1 === 'MISS' && c2 === 'MISS' && c3 === 'HIT',
      [c1, c2, c3].join(' → '));
    // 关键：加了 pitch 之后，原音的缓存不能被覆盖
    check('加音高不污染原音缓存',
      c4 === 'HIT' && c4 !== 'MISS', c4);
  }

  console.log('\n=== 8. 无 JS 异常 ===\n');
  check('无未捕获异常', errs.length === 0, errs.slice(0, 3).join(' | '));

  await browser.close();
  const pass = results.filter(r => r.ok).length;
  const fail = results.filter(r => !r.ok);
  console.log('\n' + '='.repeat(58));
  console.log(`  通过 ${pass}/${results.length}` + (fail.length ? `，失败 ${fail.length}` : ''));
  if (fail.length) {
    console.log('\n  失败项：');
    fail.forEach(f => console.log('   · ' + f.name + (f.detail ? ' → ' + f.detail : '')));
  }
  console.log('='.repeat(58) + '\n');
  process.exit(fail.length ? 1 : 0);
})().catch(e => { console.error('测试异常:', e); process.exit(2); });
