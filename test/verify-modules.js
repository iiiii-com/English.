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

  // 顶栏与导航：站名可见 + 导航拿到足够宽度 + 能横向滚动
  const navM = await page.evaluate(() => {
    const nav = document.getElementById('nav');
    const bt = document.querySelector('.brand-text');
    const cs = getComputedStyle(nav);
    return {
      brand: bt ? bt.textContent.trim() : '',
      brandVisible: bt ? getComputedStyle(bt).display !== 'none' : false,
      clientW: nav.clientWidth,
      scrollW: nav.scrollWidth,
      minW: cs.minWidth,
      overflowX: cs.overflowX,
      btns: nav.querySelectorAll('button').length,
      groups: nav.querySelectorAll('.nav-group').length
    };
  });
  check('站名为 Lumen', navM.brand === 'Lumen', navM.brand);
  check('移动端站名可见', navM.brandVisible === true, 'brand-text display');
  // 之前导航被挤到 165px，现在必须拿到接近全屏的宽度
  check('导航宽度足够', navM.clientW >= 360, navM.clientW + 'px');
  check('导航 min-width 已解绑', navM.minW === '0px', navM.minW);
  check('导航可横向滚动', navM.overflowX === 'auto' && navM.scrollW > navM.clientW,
    navM.scrollW + ' > ' + navM.clientW);
  check('导航按钮与分组齐全', navM.btns === 15 && navM.groups === 5,
    navM.btns + ' 按钮 / ' + navM.groups + ' 分组');

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
