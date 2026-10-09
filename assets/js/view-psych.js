/* ============================================================
   view-psych.js —— 行为心理机制视图 + 数据模型说明
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, C = global.Charts, P = global.PathContent;
  var ui = global.ui, h = ui.h;

  /* ============================================================
     A. 心理机制库
     ============================================================ */
  V.psych = function (root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '行为心理机制'));
    head.appendChild(h('p', null, '每一条机制都在回答同一个问题：为什么大多数学习者不是不会，而是坚持不下来。' +
      '每张卡片给出「现象 → 机制 → 大脑原理 → 本站实现」，大脑原理解释来自具体的神经科学或行为学研究，不是口号。'));
    root.appendChild(head);

    /* ---------- 三系统模型 ---------- */
    var c0 = h('div', 'card');
    c0.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '前提：人不是靠意志力学习的'));
    c0.lastChild.appendChild(h('span', 'sub', '三套神经系统同时工作'));
    var grid = h('div', 'grid g3');
    [
      {
        n: '随意系统', i: '🛋️', c: '#8b5cf6',
        d: '想做就做的部分。短视频能轻松拉起你，因为它的启动成本极低。',
        s: '对策：不是对抗它，而是把你的学习行为也降到荒谬的低（1 个词也算达标）。'
      },
      {
        n: '边缘系统', i: '⚡', c: '#e2585f',
        d: '情绪反应，比思考更快。羞耻、焦虑、被打断会瞬间终止正在进行的任何事。',
        s: '对策：把每日任务量定在"有点无聊"而非"有点痛苦"；永远不让用户欠债。'
      },
      {
        n: '前额叶皮层', i: '🧠', c: '#4f7cff',
        d: '执行控制与专注。每天只有 3-5 小时优质容量，用完即枯竭。',
        s: '对策：把最重要的事放在精力峰值时段；高强度任务限定在上午。'
      }
    ].forEach(function (x) {
      var it = h('div');
      it.style.cssText = 'padding:14px;border:1px solid var(--border);border-radius:11px;background:' + x.c + '08';
      var t = h('div');
      t.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:6px';
      t.appendChild(h('span', null, x.i));
      t.lastChild.style.fontSize = '17px';
      t.appendChild(h('b', null, x.n));
      t.lastChild.style.color = x.c;
      it.appendChild(t);
      it.appendChild(h('div', null, x.d));
      it.lastChild.style.cssText = 'font-size:13px;line-height:1.7;color:var(--text-2)';
      var s = h('div', null, x.s);
      s.style.cssText = 'font-size:12.5px;line-height:1.7;color:var(--text);margin-top:7px;padding-top:7px;border-top:1px dashed var(--border)';
      it.appendChild(s);
      grid.appendChild(it);
    });
    c0.appendChild(grid);
    root.appendChild(c0);

    /* ---------- 机制卡 ---------- */
    var cats = {};
    P.MECHANISMS.forEach(function (m) {
      if (!cats[m.category]) cats[m.category] = [];
      cats[m.category].push(m);
    });

    Object.keys(cats).forEach(function (cat) {
      var sec = h('div');
      sec.style.marginTop = '22px';
      var hd = h('div', 'card-head');
      hd.appendChild(h('h3', null, cat + '类机制'));
      hd.appendChild(h('span', 'sub', cats[cat].length + ' 条'));
      sec.appendChild(hd);
      var g = h('div', 'grid g2');
      cats[cat].forEach(function (m) { g.appendChild(mechCard(m)); });
      sec.appendChild(g);
      root.appendChild(sec);
    });

    /* ---------- 机制效果仪表 ---------- */
    var c2 = h('div', 'card');
    c2.style.marginTop = '22px';
    c2.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '你的机制运行状况'));
    c2.lastChild.appendChild(h('span', 'sub', '基于真实行为数据评估'));
    var g2 = h('div', 'grid g2');
    var st = S.state, stk = S.streak();

    // 触发提示运行状况
    var box1 = h('div');
    box1.appendChild(h('div', null, '① 连续打卡（损失厌恶核心指标）'));
    box1.lastChild.style.cssText = 'font-size:13px;font-weight:700;margin-bottom:8px';
    var rw = h('div');
    rw.style.cssText = 'display:flex;gap:20px;align-items:center;flex-wrap:wrap';
    var r = h('div');
    rw.appendChild(r);
    C.ring(r, { value: stk.current, max: 30, size: 96, stroke: 9, color: stk.current >= 7 ? '#22b07d' : '#f0a020', label: stk.current, sub: '连续天' });
    var tx = h('div');
    tx.style.cssText = 'flex:1;min-width:180px;font-size:12.5px;color:var(--text-2);line-height:1.75';
    tx.innerHTML = '最长连续 ' + maxStreak() + ' 天。<br>' +
      (stk.current >= 7
        ? '<b style="color:var(--success)">习惯已初步成型</b>（约 21-66 天可完全自动化，Lally et al. 2010）。'
        : stk.current >= 3 ? '正在建立中。研究显示习惯自动化平均需 <b>66 天</b>（中位数），每天重复同一动作。'
          : '<b>当前是中断高风险期</b>。前 21 天是习惯崩溃概率最高的窗口。');
    rw.appendChild(tx);
    box1.appendChild(rw);
    g2.appendChild(box1);

    // 提取练习量
    var box2 = h('div');
    box2.appendChild(h('div', null, '② 提取练习强度'));
    box2.lastChild.style.cssText = 'font-size:13px;font-weight:700;margin-bottom:8px';
    var totalReviews = 0;
    Object.keys(st.daily).forEach(function (k) { totalReviews += st.daily[k].reviews || 0; });
    var totalNew = 0;
    Object.keys(st.daily).forEach(function (k) { totalNew += st.daily[k].newWords || 0; });
    var b2 = h('div', 'chart-box');
    box2.appendChild(b2);
    C.bar(b2, {
      height: 130,
      data: [
        { label: '累计提取次数', value: totalReviews, color: C.PALETTE[0], tip: totalReviews + ' 次提取' },
        { label: '新学词数', value: totalNew, color: C.PALETTE[2], tip: totalNew + ' 词' },
        { label: '成熟词', value: S.vocabStats().mature, color: C.PALETTE[1], tip: S.vocabStats().mature + ' 词' }
      ],
      emptyText: '暂无数据'
    });
    var ratio = totalNew ? Math.round(totalReviews / totalNew * 10) / 10 : 0;
    var n2 = h('div');
    n2.style.cssText = 'font-size:12px;color:var(--text-2);margin-top:8px;line-height:1.7';
    n2.innerHTML = '提取/新词比 = <b>' + ratio + '</b>。健康区间是 <b>3-8:1</b>——' +
      '每学 1 个新词需 3-8 次分散提取才能进入长期记忆。' +
      (ratio > 8 ? '<br><span style="color:var(--danger)">当前偏高，说明新词速度超过了你实际能消化的量——这会导致复习堆积直到放弃。</span>'
        : ratio < 3 && totalNew > 5 ? '<br><span style="color:var(--warn)">当前偏低，说明复习不足——遗忘曲线会拉平掌握的时间成本。</span>'
          : '<br><span style="color:var(--success)">处于健康区间。</span>');
    box2.appendChild(n2);
    g2.appendChild(box2);
    c2.appendChild(g2);
    root.appendChild(c2);

    /* ---------- 微习惯阶梯 ---------- */
    var c3 = h('div', 'card');
    c3.style.marginTop = '16px';
    c3.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '微习惯阶梯'));
    c3.lastChild.appendChild(h('span', 'sub', '永远有比昨天更小的一步'));
    var tg = h('div', 'grid');
    tg.style.gridTemplateColumns = 'repeat(auto-fit,minmax(160px,1fr))';
    P.MICRO_LADDER.forEach(function (m) {
      var it = h('div');
      it.style.cssText = 'padding:13px;border:1px solid var(--border);border-radius:11px;position:relative;overflow:hidden';
      it.style.borderTop = '3px solid ' + m.color;
      var t = h('div');
      t.innerHTML = '<b style="font-size:15px">' + m.label + '</b> <span style="font-size:12px;color:var(--text-3)">' + m.min + ' 分钟</span>';
      it.appendChild(t);
      var ul = h('div');
      ul.style.marginTop = '7px';
      m.tasks.forEach(function (x) {
        var d = h('div', null, '· ' + x);
        d.style.cssText = 'font-size:12px;color:var(--text-2);line-height:1.7';
        ul.appendChild(d);
      });
      it.appendChild(ul);
      tg.appendChild(it);
    });
    c3.appendChild(tg);
    var c3n = h('div');
    c3n.style.cssText = 'margin-top:12px;padding:12px 14px;background:var(--primary-soft);border-radius:9px;font-size:12.5px;color:#34529f;line-height:1.8';
    c3n.innerHTML = '<b>为什么要做阶梯？</b>BJ Fogg 行为模型认为行为发生需要 B = 动机 × 能力 × 提示，' +
      '三者任一接近 0，行为就不发生。<b>能力是乘数</b>——当任务难度超过当前能力，启动阻力不是线性增加而是指数上升。' +
      '提供阶梯的目的，是让你在任何状态下都能找到"不会失败的那一档"。<br>' +
      '<b>关键原则</b>：宁可连续做 2 个月极简，也不要做 3 天标准然后归零。' +
      '损失厌恶告诉你：中断的成本远大于降低标准的成本。';
    c3.appendChild(c3n);
    root.appendChild(c3);

    /* ---------- 惊喜卡预览 ---------- */
    var c4 = h('div', 'card');
    c4.style.marginTop = '16px';
    c4.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '可变奖励池'));
    c4.lastChild.appendChild(h('span', 'sub', '每次完成一轮复习有 25% 概率掉落'));
    var b4 = h('div', 'btn-row');
    P.SURPRISES.slice(0, 4).forEach(function (s) {
      var b = h('button', 'btn ghost sm', '🎁 抽一张看看');
      b.onclick = function () { ui.showSurprise(s); };
      b4.appendChild(b);
    });
    c4.appendChild(b4);
    var n4 = h('div');
    n4.style.cssText = 'margin-top:12px;font-size:12.5px;color:var(--text-2);line-height:1.8';
    n4.innerHTML = '<b>为什么奖励要"随机"？</b>固定比率强化（如"每天得 10 分"）产生的多巴胺效率会快速衰减——' +
      '因为大脑准确预测了结果，预测误差趋近于零，多巴胺不再释放（Schultz 预测误差理论）。' +
      '可变比率强化（赌场老虎机原理）让每次结果不可预测，误差信号持续存在，因此能维持长期动机。<br>' +
      '<b>但奖励里刻意不含分数与排行</b>——分数会扭曲学习动机，让人刷分而非学习。' +
      '所以池子里放的是知识、技巧、休息券和鼓励。';
    c4.appendChild(n4);
    root.appendChild(c4);
  };

  function mechCard(m) {
    var card = h('div', 'mech');
    var top = h('div', 'mech-top');
    top.appendChild(h('div', 'mech-ico', m.icon));
    var l = h('div');
    l.appendChild(h('div', 'mech-name', m.name));
    l.appendChild(h('div', 'mech-cat', m.category + '类机制'));
    top.appendChild(l);
    var tag = h('span', 'tag grey', m.metric);
    tag.style.marginLeft = 'auto';
    top.appendChild(tag);
    card.appendChild(top);

    function sec(k, v, cls) {
      var s = h('div', 'mech-sec');
      s.appendChild(h('div', 'k', k));
      s.appendChild(h('div', 'v' + (cls ? ' ' + cls : ''), v));
      card.appendChild(s);
    }
    sec('现象', m.phenomenon);
    sec('行为机制', m.principle);
    sec('🧠 大脑奖赏原理', m.brain, 'brain');

    var impl = h('div', 'mech-sec');
    impl.appendChild(h('div', 'k', '本站如何实现'));
    var ul = h('ul');
    m.implementation.forEach(function (x) { ul.appendChild(h('li', null, x)); });
    impl.appendChild(ul);
    card.appendChild(impl);

    card.appendChild(h('div', 'mech-sci', '依据：' + m.science));
    return card;
  }

  function maxStreak() {
    var d = S.state.daily, keys = Object.keys(d).filter(function (k) { return d[k].total > 0; }).sort();
    if (!keys.length) return 0;
    var best = 1, cur = 1;
    for (var i = 1; i < keys.length; i++) {
      if (S.daysBetween(keys[i - 1], keys[i]) === 1) { cur++; best = Math.max(best, cur); }
      else cur = 1;
    }
    return best;
  }

  /* ============================================================
     B. 数据模型说明页
     ============================================================ */
  V.data = function (root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '数据模型与页面结构'));
    head.appendChild(h('p', null, '全部数据存在浏览器 localStorage，不上传服务器。下方是完整的数据结构说明与导出/导入工具。'));
    root.appendChild(head);

    /* 页面结构 */
    var c1 = h('div', 'card');
    c1.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '页面结构'));
    c1.lastChild.appendChild(h('span', 'sub', '单页应用 · 7 个视图 · 零后端'));
    var tree = h('pre');
    tree.style.cssText = 'font-family:var(--mono);font-size:12px;line-height:1.85;background:var(--surface-2);padding:16px 18px;border-radius:10px;overflow-x:auto;color:var(--text-2);margin:0';
    tree.textContent =
      '英语学习网站/\n' +
      '├─ index.html                 入口（单页应用，hash 路由）\n' +
      '├─ assets/\n' +
      '│  ├─ css/style.css           设计系统（CSS 变量 + 响应式）\n' +
      '│  └─ js/\n' +
      '│     ├─ store.js              状态管理 / localStorage / SM-2 算法\n' +
      '│     ├─ charts.js             零依赖 SVG 图表引擎（6 种图表）\n' +
      '│     ├─ app.js                路由 + 首页看板 + 语音/评分工具\n' +
      '│     ├─ view-vocab.js         词汇视图（复习/新词/自测/精讲）\n' +
      '│     ├─ view-speak.js         口语视图（场景/发音/分析）\n' +
      '│     ├─ view-read.js          阅读视图（短文/能力模型）\n' +
      '│     ├─ view-path.js          等级路径视图\n' +
      '│     ├─ view-psych.js         心理机制 + 数据模型视图\n' +
      '│     └─ data/\n' +
      '│        ├─ words.js               1456 词 L1-L4（自动生成自 TSV）\n' +
      '│        ├─ words-gaokao.js        3993 词 L5-L6（ECDICT）\n' +
      '│        ├─ content-index.js       ★ 统一内容索引（新增只改一处）\n' +
      '│        ├─ content-vocab.js       核心词精讲 + 出题器 + SM-2 参数\n' +
      '│        ├─ content-reading.js/2.js 22 篇短文 + 155 道理解题\n' +
      '│        ├─ content-speaking.js + content-scene-l4.js  36 个场景\n' +
      '│        ├─ content-daily-comm.js ~ 5.js   2000 条表达 / 87 类\n' +
      '│        ├─ content-phonemes.js + -detail.js  44 音素 + 英美对照\n' +
      '│        ├─ content-topic-words.js 12 主题 256 词\n' +
      '│        ├─ content-liaison.js/2.js 5 类连读 + 219 例句\n' +
      '│        └─ content-path.js        六级路径 + 10 条心理机制\n' +
      '│  ├─ progress.js               ★ 自动进度记忆系统\n' +
      '│  ├─ ui.js                    统一 UI 组件\n' +
      '│  └─ store.js                 状态 / localStorage / SM-2\n' +
      '└─ 数据/\n' +
      '   └─ 词汇表_种子词_M1-M12.tsv   源词表（唯一数据源）';
    c1.appendChild(tree);
    root.appendChild(c1);

    /* 数据模型 */
    var c2 = h('div', 'card');
    c2.style.marginTop = '16px';
    c2.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '数据模型'));
    c2.lastChild.appendChild(h('span', 'sub', 'localStorage key: eng_atlas_v1'));
    var tbl = h('table', 'tbl');
    var th = h('thead');
    var tr = h('tr');
    ['字段', '类型', '说明'].forEach(function (x) { tr.appendChild(h('th', null, x)); });
    th.appendChild(tr);
    tbl.appendChild(th);
    var tb = h('tbody');
    [
      ['words: {id: Card}', 'object', '每个词一张卡片'],
      ['  .ef', 'number', '难度因子 E-Factor，初值 2.5，范围 1.3–3.2。越大表示越容易记得，下次间隔越长'],
      ['  .ivl', 'number', '当前间隔天数。0=新词，1=明天复习，≥21 视为长期记忆'],
      ['  .reps', 'number', '连续答对次数，决定下次间隔公式（1→1天，2→3天，之后 ivl×ef）'],
      ['  .lapses', 'number', '遗忘次数。每次遗忘下调 ef 0.20'],
      ['  .due', 'string', '下次复习日期 YYYY-MM-DD'],
      ['  .seen / .right', 'number', '累计出现次数 / 累计答对次数'],
      ['daily: {date: DayStat}', 'object', '每日统计，key 为日期'],
      ['  .minutes', 'number', '当日学习分钟数（手动打卡累计）'],
      ['  .newWords', 'number', '当日新学词数'],
      ['  .reviews', 'number', '当日复习次数'],
      ['  .right / .total', 'number', '当日答对数 / 答题总数'],
      ['  .readMin / .speakMin', 'number', '阅读 / 口语时长'],
      ['speaking: Speaking[]', 'array', '口语跟读记录，最多保留 500 条'],
      ['  .scene / .lv', 'string', '场景 id / 等级'],
      ['  .score', 'number', '综合评分 0-100'],
      ['reading: {articleId: R}', 'object', '阅读记录'],
      ['  .best', 'number', '历史最佳正确率'],
      ['  .done', 'number', '完成次数'],
      ['badges: {id: ts}', 'object', '已获得徽章与时间戳'],
      ['commitment', 'object', '目标承诺装置：goal 目标词数 / start 起始日 / log 调整日志'],
      ['unlocked: {L1-L4}', 'object', '各等级解锁状态'],
      ['marks: {word: ts}', 'object', '阅读时标记的生词'],
      ['microDone: {taskId}', 'object', '今日任务完成状态（按天覆盖）'],
      ['settings', 'object', '语音语速、音色、每日新词数上限'],
      ['VOCAB_DATA.words', 'array', '静态词库：{id, w 单词, p 词性, cn 释义, ex 搭配, th 主题, m 月份, lv 等级}']
    ].forEach(function (r) {
      var tr2 = h('tr');
      tr2.appendChild(h('td', null, r[0]));
      tr2.firstChild.style.fontFamily = 'var(--mono)';
      tr2.firstChild.style.fontSize = '11.5px';
      tr2.appendChild(h('td', null, r[1]));
      tr2.appendChild(h('td', null, r[2]));
      tb.appendChild(tr2);
    });
    tbl.appendChild(tb);
    c2.appendChild(tbl);
    root.appendChild(c2);

    /* SM-2 说明 */
    var c3 = h('div', 'card');
    c3.style.marginTop = '16px';
    c3.appendChild(h('div', 'card-head')).appendChild(h('h3', null, 'SM-2 算法参数'));
    c3.lastChild.appendChild(h('span', 'sub', 'SuperMemo 2 · Piotr Woźniak 1987'));
    var code = h('pre');
    code.style.cssText = 'font-family:var(--mono);font-size:12px;line-height:1.9;background:#1f2430;color:#c8d0e0;padding:18px 20px;border-radius:10px;overflow-x:auto;margin:0';
    code.textContent =
      'function review(card, q)  // q = 0~4 评分\n' +
      '  if q < 3:                      // 遗忘\n' +
      '    lapses += 1\n' +
      '    reps = 0\n' +
      '    ivl = 1                       // 明天重来\n' +
      '    ef = max(1.3, ef - 0.20)      // 难度下调\n' +
      '  else:\n' +
      '    reps += 1\n' +
      '    if   reps == 1: ivl = 1\n' +
      '    elif reps == 2: ivl = 3\n' +
      '    else:            ivl = min(180, round(ivl * ef))\n' +
      '    ef = ef + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))\n' +
      '    ef = clamp(ef, 1.3, 3.2)\n' +
      '  due = today() + ivl days';
    c3.appendChild(code);
    var n3 = h('div');
    n3.style.cssText = 'margin-top:12px;font-size:12.5px;color:var(--text-2);line-height:1.8;background:var(--surface-2);padding:12px 14px;border-radius:9px';
    n3.innerHTML = '<b>为什么选 SM-2 而不是 FSRS？</b>SM-2 只需 4 个参数、可解释性强、状态可导出，' +
      '适合自建系统；FSRS 使用 17+ 参数做贝叶斯优化，长期准确率更高（约 +5% 复习量节省），但需要大量复习历史才能训练出好的参数。' +
      '<b>如果你有 1000+ 次复习记录</b>，可以在 store.js 的 reviewSM2 中替换为 FSRS。' +
      '本站的升级点已隔离在单一函数里，不影响其他模块。';
    c3.appendChild(n3);
    root.appendChild(c3);

    /* 跟读评分算法 */
    var c4 = h('div', 'card');
    c4.style.marginTop = '16px';
    c4.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '跟读评分算法'));
    c4.lastChild.appendChild(h('span', 'sub', '纯前端 · Web Speech API'));
    var n4 = h('div');
    n4.style.cssText = 'font-size:13px;color:var(--text-2);line-height:1.85';
    n4.innerHTML =
      '<b>步骤</b><br>' +
      '1. <b>归一化</b>：去标点、小写、按空格分词<br>' +
      '2. <b>词级匹配</b>：用最长公共子序列（LCS）动态规划计算目标句与识别结果的对齐，' +
      '得到"匹配词 / 漏读词 / 多读词"三组<br>' +
      '3. <b>词准确率</b> = 匹配词数 ÷ 目标词数<br>' +
      '4. <b>语速得分</b>：与理想 140 WPM 的偏差换算，容差 ±45 WPM<br>' +
      '5. <b>识别置信度</b>：取 ASR 返回的 confidence，取多个候选中的最高分<br>' +
      '<b>综合得分 = 词准确率×60% + 语速得分×15% + 置信度×25%</b><br>' +
      '<b>容错规则</b>：若漏读词全部是功能词（a/the/to/of…），每个扣 3 分而非全额扣除——' +
      '母语者也会吞掉这些词，不应因此惩罚。<br><br>' +
      '<b style="color:var(--danger)">已知局限</b>：浏览器识别受噪音、口音影响明显，' +
      'Chrome 的识别结果不能替代人工评估。本评分只适合做"趋势跟踪"（看自己的分数是否在涨），' +
      '不适合作为绝对水平判定。发音准确度请以音标卡 + 母语者反馈为准。';
    c4.appendChild(n4);
    root.appendChild(c4);

    /* 数据工具 */
    var c5 = h('div', 'card');
    c5.style.marginTop = '16px';
    c5.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '我的学习数据'));
    c5.lastChild.appendChild(h('span', 'sub', '导出 / 导入 / 重置'));
    var st = S.state;
    var stats = h('div', 'grid g4');
    [
      { l: '累计学习天数', v: Object.keys(st.daily).filter(function (k) { return st.daily[k].total > 0; }).length, u: '天' },
      { l: '累计分钟', v: S.totalMinutes(), u: '分钟' },
      { l: '词卡数量', v: Object.keys(st.words).length, u: '张' },
      { l: '存储占用', v: (JSON.stringify(st).length / 1024).toFixed(1), u: 'KB' }
    ].forEach(function (s) {
      var c = h('div', 'stat');
      c.appendChild(h('div', 'lbl', s.l));
      var vv = h('div', 'val', String(s.v));
      vv.appendChild(h('small', null, s.u));
      c.appendChild(vv);
      stats.appendChild(c);
    });
    c5.appendChild(stats);

    var row = h('div', 'btn-row');
    row.style.marginTop = '16px';
    var exp = h('button', 'btn', '⬇ 导出 JSON');
    exp.onclick = function () {
      var blob = new Blob([S.exportData()], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'english-learning-data-' + S.today() + '.json';
      a.click();
      ui.toast('已导出');
    };
    var imp = h('button', 'btn ghost', '⬆ 导入 JSON');
    imp.onclick = function () {
      var inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = '.json';
      inp.onchange = function () {
        var f = inp.files[0];
        if (!f) return;
        var fr = new FileReader();
        fr.onload = function () {
          try {
            S.importData(fr.result);
            ui.toast('导入成功');
            global.App.render();
          } catch (e) { ui.toast('导入失败：' + e.message); }
        };
        fr.readAsText(f);
      };
      inp.click();
    };
    var rst = h('button', 'btn ghost', '⚠ 重置所有数据');
    rst.onclick = function () {
      ui.openSheet('确认重置？', function (sheet) {
        var p = h('p');
        p.style.cssText = 'font-size:13.5px;line-height:1.8;color:var(--text-2)';
        p.innerHTML = '这会删除<b>全部学习记录</b>：词卡进度、打卡连续天数、口语与阅读记录、徽章、承诺目标。<br><br>' +
          '此操作不可撤销。建议先「导出 JSON」备份。';
        sheet.appendChild(p);
        var row2 = h('div', 'btn-row');
        row2.style.marginTop = '16px';
        var cancel = h('button', 'btn ghost', '取消');
        cancel.onclick = function () { document.querySelector('.sheet-mask').remove(); };
        var okb = h('button', 'btn', '确认重置');
        okb.style.background = 'var(--danger)';
        okb.onclick = function () {
          S.reset(); S.init();
          document.querySelector('.sheet-mask').remove();
          ui.toast('已重置');
          global.App.render();
        };
        row2.appendChild(cancel); row2.appendChild(okb);
        sheet.appendChild(row2);
      });
    };
    row.appendChild(exp); row.appendChild(imp); row.appendChild(rst);
    c5.appendChild(row);

    var note = h('div');
    note.style.cssText = 'margin-top:14px;padding:12px 14px;background:var(--warn-soft);border-radius:9px;font-size:12.5px;color:#8a6a1a;line-height:1.8';
    note.innerHTML = '<b>隐私说明</b>：所有数据仅保存在本机浏览器。清除浏览器数据、换浏览器或使用无痕模式都会丢失记录。' +
      '建议定期导出 JSON 备份。';
    c5.appendChild(note);
    root.appendChild(c5);

    /* 内容总览（来自统一索引，反映真实内容量） */
    if (global.ContentIndex) {
      var st = global.ContentIndex.stats();
      var cc = h('div', 'card');
      cc.style.marginTop = '16px';
      var ch2 = h('div', 'card-head');
      ch2.appendChild(h('h3', null, '内容总览'));
      ch2.appendChild(h('span', 'sub', '由统一索引实时统计，非硬编码数字'));
      cc.appendChild(ch2);

      // 分级与规则分布转中文可读
      var LV_CN = { L1: '入门', L2: '基础', L3: '进阶', L4: '精通', L5: '高中', L6: '高考拓展' };
      var RULE_CN = { liaison: '连读', elision: '失去爆破', reduction: '弱读', incomplete: '不完全发音', stress: '意群重音' };
      function fmtLevels(o) {
        return Object.keys(o).map(function (k) { return (LV_CN[k] || k) + ' ' + o[k]; }).join(' / ');
      }
      function fmtRules(o) {
        return Object.keys(o).map(function (k) { return (RULE_CN[k] || k) + ' ' + o[k]; }).join(' / ');
      }

      var rows = [
        ['词库总量', st.words, '含音标 ' + st.wordsWithIpa + ' 个'],
        ['主题词汇', st.topicWords, '12 个生活主题，每主题 34-45 词'],
        ['日常交流表达', st.dailyComm, st.dailyCommCats + ' 类 · 正式 ' +
          (st.dailyCommByReg.R1 || 0) + ' / 中性 ' + (st.dailyCommByReg.R2 || 0) +
          ' / 随意 ' + (st.dailyCommByReg.R3 || 0)],
        ['场景对话', st.scenes, st.sceneLines + ' 句 · ' + fmtLevels(st.scenesByLevel)],
        ['连读规则', st.liaisonRules, '类（连读/失去爆破/弱读/不完全发音/意群重音）'],
        ['连读例句', st.liaisonExamples, '句 · ' + fmtRules(st.liaisonByRule)],
        ['分级短文', st.readings, '篇 · ' + st.readingQuestions + ' 道理解题'],
        ['国际音标', st.phonemes, '个（20 元音 + 24 辅音），每个含例词与最小对立对'],
        ['辅音音组合', st.clusters, '组'],
        ['英美发音对照', st.rpGaGroups, '组（音素/词汇/整句）'],
        ['核心词精讲', (global.VocabContent ? global.VocabContent.CORE.length : 0), '词 · 含用法要点与易混辨析']
      ];
      var tb2 = h('table', 'tbl');
      var th2 = h('thead'); var tr2 = h('tr');
      ['内容类型', '数量', '明细'].forEach(function (x) { tr2.appendChild(h('th', null, x)); });
      th2.appendChild(tr2); tb2.appendChild(th2);
      var body2 = h('tbody');
      rows.forEach(function (r) {
        var row = h('tr');
        var c0 = h('td', null, r[0]); c0.style.fontWeight = '600';
        row.appendChild(c0);
        var c1 = h('td', null, String(r[1]));
        c1.style.cssText = 'color:var(--primary);font-weight:700';
        row.appendChild(c1);
        var c2 = h('td', null, r[2]);
        c2.style.cssText = 'font-size:12px;color:var(--text-3)';
        row.appendChild(c2);
        body2.appendChild(row);
      });
      tb2.appendChild(body2);
      cc.appendChild(tb2);

      var cn = h('div');
      cn.style.cssText = 'margin-top:12px;padding:11px 13px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.8';
      cn.innerHTML = '<b>统一索引的意义</b>：所有内容通过 <code>ContentIndex</code> 访问。' +
        '新增一个数据文件只需在索引里注册一行，各视图自动纳入——' +
        '这解决了此前"新增内容要改多个视图、极易遗漏"的问题。';
      cc.appendChild(cn);
      root.appendChild(cc);
    }

    /* 进度记忆系统的数据结构 */
    if (global.Progress && global.Progress.data) {
      var pd = global.Progress.data;
      var pc = h('div', 'card');
      pc.style.marginTop = '16px';
      var pch = h('div', 'card-head');
      pch.appendChild(h('h3', null, '进度记忆数据结构'));
      pch.appendChild(h('span', 'sub', 'localStorage key: eng_atlas_progress_v1'));
      pc.appendChild(pch);

      var pdesc = [
        ['words', '对象', '每词掌握度：首次/最近日期、SM-2 间隔、作答历史（保留最近 12 次）、累计尝试与正确数、平均用时'],
        ['speaking', '对象', '逐句发音：sceneId:lineIdx → 最佳得分、尝试次数、历史（保留 10 次）、ASR 置信度'],
        ['expressions', '对象', '日常表达暴露次数：catKey:idx → 看过几次，用于统计实际接触量'],
        ['liaison', '对象', '连读例句跟读记录：最佳得分与尝试次数'],
        ['reading', '对象', '阅读轨迹：每篇的逐题对错、最佳正确率、答题用时'],
        ['timeline', '数组', '学习时间线：每次学习的时刻、时段、模块、时长（上限 200 条）'],
        ['weak', '对象', '弱项累积：易错音素次数、薄弱题型次数、模块投入时长']
      ];
      var ptb = h('table', 'tbl');
      var pth = h('thead'); var ptr = h('tr');
      ['字段', '类型', '说明'].forEach(function (x) { ptr.appendChild(h('th', null, x)); });
      pth.appendChild(ptr); ptb.appendChild(pth);
      var pbody = h('tbody');
      pdesc.forEach(function (r) {
        var row = h('tr');
        var c0 = h('td');
        var b = h('code', null, r[0]);
        b.style.cssText = 'font-size:12px;color:var(--primary-dark)';
        c0.appendChild(b);
        row.appendChild(c0);
        row.appendChild(h('td', null, r[1]));
        var c2 = h('td', null, r[2]);
        c2.style.cssText = 'font-size:12px;color:var(--text-2);line-height:1.6';
        row.appendChild(c2);
        pbody.appendChild(row);
      });
      ptb.appendChild(pbody);
      pc.appendChild(ptb);

      // 当前记录数
      var counts = [
        ['词汇记录', Object.keys(pd.words).length],
        ['发音记录', Object.keys(pd.speaking).length],
        ['表达记录', Object.keys(pd.expressions).length],
        ['连读记录', Object.keys(pd.liaison).length],
        ['阅读轨迹', Object.keys(pd.reading).length],
        ['时间线', pd.timeline.length]
      ];
      var cg = h('div');
      cg.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap;margin-top:14px';
      counts.forEach(function (c) {
        var it = h('div');
        it.style.cssText = 'padding:9px 13px;border:1px solid var(--border);border-radius:9px;background:var(--surface-2)';
        var n = h('b', null, String(c[1]));
        n.style.cssText = 'font-size:16px;display:block';
        it.appendChild(n);
        var l = h('span', null, c[0]);
        l.style.cssText = 'font-size:11px;color:var(--text-3)';
        it.appendChild(l);
        cg.appendChild(it);
      });
      pc.appendChild(cg);

      var pn = h('div');
      pn.style.cssText = 'margin-top:12px;padding:11px 13px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.8';
      pn.innerHTML = '<b>自动记录，零手动操作</b>：所有数据在复习、跟读、阅读、展开表达时自动写入。' +
        '为防止无限增长，历史明细采用环形截断（词汇 12 次、发音 10 次、时间线 200 条），' +
        '但<b>汇总数据永久保留</b>——压缩只删明细，不影响任何累计统计。';
      pc.appendChild(pn);
      root.appendChild(pc);
    }
  };
})(window);