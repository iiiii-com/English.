/* ============================================================
   app.js —— 路由 + 首页看板 + 通用 UI
   ============================================================ */
(function (global) {
  'use strict';

  var S = global.Store, C = global.Charts, P = global.PathContent;
  var views = {};
  var current = 'dash';
  /* 注册表必须在模块加载期就绪，供后续 view-*.js 挂载 */
  global.Views = views;

  /* ---------------- 通用工具 ---------------- */
  function h(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined && txt !== null) n.textContent = txt;
    return n;
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  /* DOM 与反馈统一走 UI 模块，避免各视图重复实现 */
  function h(tag, cls, txt) { return global.UI.h(tag, cls, txt); }
  function $(sel, root) { return global.UI.$(sel, root); }
  function $$(sel, root) { return global.UI.$$(sel, root); }
  function toast(msg, ms, type) { return global.UI.toast(msg, ms, type); }

  /* 日期格式化：用 Store 的本地时区日期，避免 new Date(str) 的 UTC 偏移 */
  function fmtDate(d) {
    var dt = (typeof d === 'string' && global.Store.parseDate(d)) || d;
    if (!dt || isNaN(dt)) return '';
    return (dt.getMonth() + 1) + '/' + dt.getDate();
  }
  function fmtDateFull(d) {
    var dt = (typeof d === 'string' && global.Store.parseDate(d)) || d;
    if (!dt || isNaN(dt)) return '';
    return dt.getFullYear() + '年' + (dt.getMonth() + 1) + '月' + dt.getDate() + '日';
  }

  /* 语音合成：统一走 tts.js 引擎，这里只做薄委托，保持 ui.tts 接口不变 */
  var tts = {
    speak: function (text, opts) { return global.TTS.speak(text, opts); },
    slow: function (text, opts) { return global.TTS.slow(text, opts); },
    stop: function () { global.TTS.stop(); },
    speakSequence: function (items, opts) { return global.TTS.speakSequence(items, opts); },
    isSpeaking: function () { return global.TTS.isSpeaking(); },
    diagnose: function () { return global.TTS.diagnose(); },
    supported: function () { return global.TTS.supported(); }
  };

  /* ---------------- 语音识别 ---------------- */
  var SR = global.SpeechRecognition || global.webkitSpeechRecognition;
  function canRecognize() { return !!SR; }

  /**
   * 跟读评分算法
   * 1) 归一化文本（去标点、小写）
   * 2) 词级比对 → 词准确率 (基于编辑距离的词匹配)
   * 3) 语速比对 → 与目标 WPM 的偏差
   * 4) 置信度 → 浏览器给出的 ASR 置信度
   * 综合得分 = 准确率*0.6 + 语速得分*0.15 + 置信度*0.25
   */
  function scoreSpeech(target, said, confidence, durationSec) {
    var norm = function (s) {
      return String(s || '').toLowerCase().replace(/[^a-z0-9'\s]/g, ' ').split(/\s+/).filter(Boolean);
    };
    var t = norm(target), s = norm(said);
    if (!t.length) return { score: 0, wordAcc: 0, rateScore: 0, conf: 0, matched: [], missed: [], extra: [], wpm: 0 };

    // 词级 LCS 匹配
    var n = t.length, m = s.length;
    var dp = [];
    for (var i = 0; i <= n; i++) { dp.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) {
      for (var j = m - 1; j >= 0; j--) {
        dp[i][j] = t[i] === s[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    // 回溯匹配
    var matched = [], missed = [], extra = [];
    i = 0; j = 0;
    while (i < n && j < m) {
      if (t[i] === s[j]) { matched.push(t[i]); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) { missed.push(t[i]); i++; }
      else { extra.push(s[j]); j++; }
    }
    while (i < n) { missed.push(t[i++]); }
    while (j < m) { extra.push(s[j++]); }

    var wordAcc = t.length ? matched.length / t.length : 0;
    var wpm = durationSec ? (s.length / durationSec) * 60 : 0;
    // 理想语速 140 WPM，允许区间 90-180
    var rateScore = 1;
    if (wpm > 0) {
      var dev = Math.abs(wpm - 140) / 140;
      rateScore = Math.max(0, 1 - dev * 1.6);
    } else rateScore = .5;
    var conf = typeof confidence === 'number' ? Math.max(0, Math.min(1, confidence)) : .7;

    var score = Math.round((wordAcc * 0.6 + rateScore * 0.15 + conf * 0.25) * 100);
    // 连接词与功能词宽容：单个功能词错误只扣一半
    var softWords = ['a', 'an', 'the', 'to', 'of', 'in', 'is', 'are', 'and', 'that', 'it', 'you'];
    if (missed.length && missed.every(function (x) { return softWords.indexOf(x) >= 0; })) {
      score = Math.min(100, score + Math.round(missed.length * 3));
    }
    return {
      score: score, wordAcc: Math.round(wordAcc * 100), rateScore: Math.round(rateScore * 100),
      conf: Math.round(conf * 100), matched: matched, missed: missed, extra: extra,
      wpm: Math.round(wpm)
    };
  }

  /* ---------------- 惊喜卡 ---------------- */
  function maybeSurprise(probability) {
    if (Math.random() > (probability == null ? .25 : probability)) return;
    var pool = P.SURPRISES.filter(function (x, i) { return i !== S.state.surprise.lastIndex; });
    var item = pool[Math.floor(Math.random() * pool.length)];
    S.state.surprise.lastIndex = P.SURPRISES.indexOf(item);
    showSurprise(item);
  }
  function showSurprise(item) {
    var mask = h('div', 'surprise-overlay');
    var card = h('div', 'surprise-card');
    var icons = { fact: '💡', tip: '🧠', rest: '☕', encourage: '🔥', challenge: '🎯' };
    var ico = h('div', 's-ico', icons[item.type] || '✨');
    card.appendChild(ico);
    card.appendChild(h('div', 's-title', item.title));
    card.appendChild(h('div', 's-text', item.text));
    var btn = h('button', 'btn s-close', '收下');
    btn.onclick = function () { document.body.removeChild(mask); };
    card.appendChild(btn);
    mask.appendChild(card);
    mask.onclick = function (e) { if (e.target === mask) document.body.removeChild(mask); };
    document.body.appendChild(mask);
  }

  /* ---------------- 等级状态 ---------------- */
  function currentLevel() {
    var st = S.state;
    if (st.unlocked.L4) return 'L4';
    if (st.unlocked.L3) return 'L3';
    if (st.unlocked.L2) return 'L2';
    return 'L1';
  }

  /**
   * 检查是否满足下一级解锁条件。
   * 数据驱动：从 LEVELS 推导链式关系，避免硬编码等级列表导致漏级。
   * 条件全部达标才解锁；不达标时返回未达标的项，供 UI 展示。
   */
  function checkUnlock() {
    var st = S.state, v = S.vocabStats(), stk = S.streak();
    var acc = S.accuracy('total', 'right') * 100;
    var got = [];

    P.LEVELS.forEach(function (lv, i) {
      if (!lv.unlock) return;                     // 终点级无解锁条件
      var next = P.LEVELS[i + 1];
      if (!next) return;
      if (!st.unlocked[lv.id] || st.unlocked[next.id]) return;

      var cond = [
        { label: '掌握 ' + lv.unlock.vocab + ' 词', cur: v.seenTotal, need: lv.unlock.vocab, unit: '词' },
        { label: '总正确率 ' + lv.unlock.accuracy + '%', cur: Math.round(acc), need: lv.unlock.accuracy, unit: '%' },
        { label: '连续打卡 ' + lv.unlock.streak + ' 天', cur: stk.current, need: lv.unlock.streak, unit: '天' }
      ];
      var allOk = cond.every(function (c) { return c.cur >= c.need; });
      if (allOk) {
        st.unlocked[next.id] = true;
        got.push(next.id);
      }
    });

    if (got.length) {
      S.save(true);
      got.forEach(function (lv) {
        var L = P.levelById(lv);
        toast('🎉 解锁「' + L.name + '」阶段：' + L.goal, 4200);
        var bad = S.checkBadges();
        setTimeout(function () {
          bad.forEach(function (b) { toast(b.icon + ' 获得徽章：' + b.name, 3200); });
        }, 900);
      });
    }
    return got;
  }

  /** 返回当前等级的未达标条件（用于首页提示「还差什么」） */
  function pendingUnlockConditions() {
    var st = S.state, v = S.vocabStats(), stk = S.streak();
    var acc = Math.round(S.accuracy('total', 'right') * 100);
    var idx = P.LEVELS.findIndex(function (l) { return l.id === currentLevel(); });
    var lv = P.LEVELS[idx], next = P.LEVELS[idx + 1];
    if (!lv || !lv.unlock || !next) return null;
    return [
      { label: '掌握 ' + lv.unlock.vocab + ' 词', cur: v.seenTotal, need: lv.unlock.vocab, done: v.seenTotal >= lv.unlock.vocab },
      { label: '正确率 ' + lv.unlock.accuracy + '%', cur: acc, need: lv.unlock.accuracy, done: acc >= lv.unlock.accuracy },
      { label: '连续 ' + lv.unlock.streak + ' 天', cur: stk.current, need: lv.unlock.streak, done: stk.current >= lv.unlock.streak }
    ];
  }

  /* ============================================================
     首页看板
     ============================================================ */
  views.dash = function (root) {
    var st = S.state;
    var v = S.vocabStats();
    var stk = S.streak();
    var today = S.dayStat();
    var lv = currentLevel();
    var L = P.levelById(lv);
    var isWeekend = [0, 6].indexOf(new Date().getDay()) >= 0;

    /* ---- 顶部问候 ---- */
    var greet = new Date().getHours() < 11 ? '早上好' : (new Date().getHours() < 18 ? '下午好' : '晚上好');
    var name = st.profile.name ? '，' + st.profile.name : '';
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, greet + name));
    var sub = h('p');
    if (stk.todayDone) sub.textContent = '今天已完成 ' + Math.round(today.minutes) + ' 分钟，连续 ' + stk.current + ' 天。' + nextLine();
    else sub.textContent = '今天还没开始。从一个词开始也算达标。';
    head.appendChild(sub);
    root.appendChild(head);

    /* ---- 发音状态提示 ----
       只在「本机没有英语语音」且「代理确实连不上」时出现。
       两个条件都满足才是真的发不出声；只满足一条时（比如本机装了语音包）
       提示就是噪音。
       放在总览页是因为这是用户来的第一页，让他在这里就知道怎么解决，
       而不是点十几次发音才发现没声音。 */
    function renderTTSBanner() {
      var old = root.querySelector('.tts-banner');
      if (old) old.parentNode.removeChild(old);

      if (!global.TTS) return;
      // 本机有英语语音就不必打扰——它本身就是一条可用的路径
      if (global.TTS.hasEnglishVoice && global.TTS.hasEnglishVoice()) return;
      // 离线包已内置时也不必打扰：高频词本来就能读，
      // 这时还提示「无法发音」是虚假告警，比不提示更糟。
      if (global.TTS.packInfo && global.TTS.packInfo().count) return;
      if (!global.TTS.proxyReachable || global.TTS.proxyReachable() !== false) return;

      var warn = h('div', 'tts-banner');
      warn.innerHTML = '<span class="tb-ico" aria-hidden="true">🔇</span>'
        + '<span class="tb-body">'
        + '<b>目前无法发音</b>'
        + '在线发音服务没有运行，且这台设备没有英语语音包。'
        + '双击项目里的 <code>tools/启动发音服务.bat</code> 即可，'
        + '或在该目录下执行 <code>node tools/tts-server.js</code>。'
        + '</span>';
      var wa = h('button', 'btn soft tb-btn', '去设置');
      wa.type = 'button';
      wa.onclick = function () { location.hash = 'tttsettings'; };
      warn.appendChild(wa);
      // 插在标题之后、品牌注脚之前
      var anchor = root.querySelector('.brand-sig');
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(warn, anchor);
      else root.appendChild(warn);
    }

    // 探测是异步的，所以先渲染内容再补提示条，避免用户看到它"闪一下"
    setTimeout(renderTTSBanner, 0);

    /* 品牌注脚：拉丁词源 + 同源词。
       放在这里而不是设置页，是因为词根模块本身就是站内内容——
       站名和词根互为呼应，是最省力的品牌表达。 */
    var sig = h('div', 'brand-sig');
    sig.innerHTML = '<span class="bs-word">Lumen</span>' +
      '<span class="bs-note">拉丁语 <i>lumen</i>，光。同源词 illuminate · luminous · luminance。</span>';
    root.appendChild(sig);

    /* ---- 统计卡 ---- */
    var g = h('div', 'grid g4');
    g.appendChild(statCard('主动词汇量', v.seenTotal, '词', 'mature 成熟 ' + v.mature + ' · learning 学习中 ' + v.learning, 'accent-primary'));
    g.appendChild(statCard('累计学习时长', Math.round(S.totalMinutes() / 60 * 10) / 10, '小时', '今日 ' + Math.round(today.minutes) + ' 分钟', 'accent-success'));
    g.appendChild(statCard('总正确率', Math.round(S.accuracy('total', 'right') * 100), '%', '基于 ' + Object.keys(st.daily).length + ' 天记录', 'accent-warn'));
    g.appendChild(statCard('口语流利度', Math.round(S.speakingStats().avg), '分', '跟读 ' + st.speaking.length + ' 次', 'accent-danger'));
    root.appendChild(g);

    /* ---- 今日任务 + 阶段进度 ---- */
    var grid2 = h('div', 'grid g-1-2');
    grid2.style.marginTop = '16px';

    /* 左：今日任务卡 */
    var taskCard = h('div', 'card');
    var th = h('div', 'card-head');
    var thl = h('div');
    thl.appendChild(h('h3', null, '今日任务'));
    var stkInfo = S.streak();
    thl.appendChild(h('div', 'sub', 'L' + L.id.slice(1) + ' ' + L.name + ' · 连续 ' + stkInfo.current + ' 天'));
    th.appendChild(thl);
    var modeSeg = h('div', 'segment');
    var stdBtn = h('button', 'on', '标准');
    var minBtn = h('button', null, '极简');
    modeSeg.appendChild(stdBtn); modeSeg.appendChild(minBtn);
    th.appendChild(modeSeg);
    taskCard.appendChild(th);

    var tasks = P.dailyTasks(lv, isWeekend);
    var micro = h('div');
    micro.style.cssText = 'margin-bottom:12px;padding:10px 12px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2)';
    micro.innerHTML = '<b>微习惯阶梯</b>：做不到标准任务时，点「极简」只做 1 个词也算达标。<br>理由：任务难度超过当前能力时启动阻力指数上升，多巴胺对"值得去做"的编码随之下降。';
    taskCard.appendChild(micro);

    var listWrap = h('div');
    var showStandard = true;
    function renderTasks() {
      listWrap.innerHTML = '';
      var arr = showStandard ? tasks : [{ id: 'tiny', text: '复习 3 个到期词', min: 2, kind: 'review' }];
      arr.forEach(function (t) {
        var done = st.microDone[t.id];
        var el = h('div', 'task' + (done ? ' done' : ''));
        var ck = h('div', 't-check', '✓');
        var body = h('div', 't-body');
        body.appendChild(h('div', 't-text', t.text));
        body.appendChild(h('div', 't-meta', kindLabel(t.kind)));
        el.appendChild(ck); el.appendChild(body);
        el.appendChild(h('div', 't-min', t.min + '′'));
        ck.style.cursor = 'pointer';
        ck.onclick = function () {
          var wasDone = !!st.microDone[t.id];
          st.microDone[t.id] = !wasDone;
          if (!wasDone) {
            S.addMinutes(t.min);
            // 提供撤销：打卡是破坏性操作，误点不应造成数据污染
            global.UI.toastUndo('已打卡「' + t.text + '」+' + t.min + '分钟', function () {
              st.microDone[t.id] = false;
              var d = S.dayStat();
              d.minutes = Math.max(0, d.minutes - t.min);
              S.save(true);
              renderTasks();
            });
            maybeSurprise(0.18);
            var got = S.checkBadges();
            got.forEach(function (b) { setTimeout(function () { toast(b.icon + ' 获得徽章：' + b.name, 3000); }, 400); });
            checkUnlock();
          } else {
            var d = S.dayStat();
            d.minutes = Math.max(0, d.minutes - t.min);
            S.save(true);
          }
          renderTasks(); renderHead();
        };
        listWrap.appendChild(el);
      });
    }
    function renderHead() {
      var totalMin = tasks.reduce(function (a, b) { return a + b.min; }, 0);
      S.dayStat().minutes = S.dayStat().minutes; // no-op
      var doneCount = tasks.filter(function (t) { return st.microDone[t.id]; }).length;
      prog.textContent = doneCount + '/' + tasks.length + ' · 约 ' + totalMin + ' 分钟';
    }
    stdBtn.onclick = function () {
      stdBtn.classList.add('on'); minBtn.classList.remove('on'); showStandard = true; renderTasks();
    };
    minBtn.onclick = function () {
      minBtn.classList.add('on'); stdBtn.classList.remove('on'); showStandard = false; renderTasks();
      toast('极简模式：完成 1 个词即算今天达标');
    };
    var prog = h('div', 'sub');
    prog.style.fontSize = '12px';
    th.appendChild(prog);
    taskCard.appendChild(listWrap);
    renderTasks();
    grid2.appendChild(taskCard);

    /* 右：阶段进度 + 下一个任务 */
    var progCard = h('div', 'card');
    var ph = h('div', 'card-head');
    ph.appendChild(h('h3', null, '我的阶段'));
    ph.appendChild(h('span', 'tag l' + lv.slice(1), L.name));
    progCard.appendChild(ph);

    progCard.appendChild(ringRow(v.seenTotal, L.vocabTarget, L));
    progCard.appendChild(h('div', 'card-head')).style.marginTop = '6px';
    var ml2 = P.nextLevel(lv);
    progCard.lastChild.appendChild(h('h3', null, ml2 ? '下一个里程碑' : '精通阶段掌握度'));
    progCard.lastChild.appendChild(h('span', 'sub', ml2 ? '完成后解锁「' + ml2.name + '」阶段' : '已到达最后一级'));

    var ml = ml2;
    var readCount = Object.keys(st.reading).length;
    var ms = [
      { text: '主动词汇达 ' + L.vocabTarget + ' 词', cur: v.seenTotal, goal: L.vocabTarget, done: v.seenTotal >= L.vocabTarget },
      { text: '累计正确率 ≥ ' + (L.unlock ? L.unlock.accuracy : 80) + '%', cur: Math.round(S.accuracy('total', 'right') * 100), goal: L.unlock ? L.unlock.accuracy : 80, done: S.accuracy('total', 'right') * 100 >= (L.unlock ? L.unlock.accuracy : 80) },
      { text: '连续打卡 ' + (L.unlock ? L.unlock.streak : 60) + ' 天', cur: stk.current, goal: L.unlock ? L.unlock.streak : 60, done: stk.current >= (L.unlock ? L.unlock.streak : 60) },
      { text: '完成 ' + (L.unlock ? L.unlock.speaking : 60) + ' 次跟读', cur: st.speaking.length, goal: L.unlock ? L.unlock.speaking : 60, done: st.speaking.length >= (L.unlock ? L.unlock.speaking : 60) },
      { text: '读完 3 篇本级短文', cur: readCount, goal: 3, done: readCount >= 3 }
    ];
    ms.forEach(function (m) {
      var el = h('div');
      el.style.cssText = 'padding:8px 0;border-bottom:1px solid var(--surface-2)';
      var row = h('div');
      row.style.cssText = 'display:flex;justify-content:space-between;font-size:13px;margin-bottom:5px';
      row.appendChild(h('span', null, (m.done ? '✓ ' : '○ ') + m.text));
      var r = h('span', null, m.cur + ' / ' + m.goal);
      r.style.cssText = 'color:' + (m.done ? 'var(--success)' : 'var(--text-3)') + ';font-weight:600';
      row.appendChild(r);
      el.appendChild(row);
      var bar = h('div', 'bar sm');
      var fill = h('i');
      fill.style.width = Math.min(100, (m.cur / m.goal) * 100) + '%';
      fill.style.background = m.done ? 'var(--success)' : 'var(--primary)';
      bar.appendChild(fill);
      el.appendChild(bar);
      progCard.appendChild(el);
    });

    /* 损失厌恶式提醒（中性措辞） */
    if (ml) {
      var warn = h('div');
      warn.style.cssText = 'margin-top:14px;padding:11px 13px;background:var(--warn-soft);border:1px solid #f7dfae;border-radius:9px;font-size:12.5px;color:#8a6a1a;line-height:1.65';
      var days = S.daysBetween(st.createdAt, S.today());
      var perDay = days > 0 ? v.seenTotal / days : v.seenTotal;
      var projected = Math.round((ml.vocabTarget - v.seenTotal) / Math.max(1, perDay));
      warn.innerHTML = '<b>进度提示</b>：按当前日均 ' + perDay.toFixed(1) + ' 词的速度，达到「' + ml.name + '」目标还需约 ' + projected + ' 天。<br>' +
        '<span style="opacity:.75">连续记录一旦中断，之前建立的学习惯性会一并清零——这是连续打卡的真正成本。</span>';
      progCard.appendChild(warn);
    }
    grid2.appendChild(progCard);
    root.appendChild(grid2);

    /* ---- 记忆画像（来自自动进度记忆系统，有数据才显示） ---- */
    if (global.Progress) {
      try {
        var memCard = h('div', 'card');
        memCard.style.marginTop = '16px';
        var mh = h('div', 'card-head');
        var mTitle = h('h3', null, '记忆画像');
        mh.appendChild(mTitle);
        var memMore = h('button', 'mini-btn', '查看完整记忆中心 →');
        memMore.onclick = function () { current = 'progress'; location.hash = 'progress'; render(); };
        mh.appendChild(memMore);
        memCard.appendChild(mh);

        var wm = global.Progress.wordMemory();
        var mg = h('div', 'grid g4');
        [['已学词汇', wm.learned, '/ ' + wm.total, '覆盖 ' + Math.round(wm.coverage * 100) + '%'],
         ['长期记忆', wm.mature, '词', '间隔 ≥21 天'],
         ['活跃天数', global.Progress.activeDays(), '天', '有学习记录'],
         ['累计时长', Math.round(global.Progress.timeProfile().totalMinutes / 60), '小时', '细粒度记录']
        ].forEach(function (x) {
          var c = h('div');
          c.style.cssText = 'padding:13px;border:1px solid var(--border);border-radius:11px';
          var l = h('div', null, x[0]);
          l.style.cssText = 'font-size:11.5px;color:var(--text-3);font-weight:600';
          c.appendChild(l);
          var v = h('div');
          v.style.cssText = 'display:flex;align-items:baseline;gap:4px;margin-top:3px';
          var n = h('b', null, String(x[1]));
          n.style.cssText = 'font-size:21px;letter-spacing:-.02em';
          v.appendChild(n);
          var u = h('span', null, x[2]);
          u.style.cssText = 'font-size:11.5px;color:var(--text-3)';
          v.appendChild(u);
          c.appendChild(v);
          var hh = h('div', null, x[3]);
          hh.style.cssText = 'font-size:11px;color:var(--text-3);margin-top:2px';
          c.appendChild(hh);
          mg.appendChild(c);
        });
        memCard.appendChild(mg);

        // 有诊断时展示第一条
        var diag = global.Progress.diagnose();
        if (diag.length) {
          var d0 = diag[0];
          var dbg = h('div');
          var isWarn = d0.level === 'warn';
          dbg.style.cssText = 'margin-top:12px;padding:11px 13px;border-radius:9px;font-size:12.5px;line-height:1.75;' +
            'background:' + (isWarn ? '#fff5f5' : 'var(--surface-2)') +
            ';color:' + (isWarn ? '#a83238' : 'var(--text-2)');
          dbg.innerHTML = '<b>' + d0.title + '</b>：' + d0.detail;
          memCard.appendChild(dbg);
        }
        root.appendChild(memCard);
      } catch (e) {
        console.warn('[dash] 记忆画像渲染失败', e);
      }
    }

    /* ---- 图表区 ---- */
    var charts = h('div', 'grid g2');
    charts.style.marginTop = '16px';

    // 词汇量增长
    var c1 = h('div', 'card');
    var c1h = h('div', 'card-head');
    c1h.appendChild(h('h3', null, '词汇量增长'));
    var seg = h('div', 'segment');
    var w30 = h('button', 'on', '30 天'); var w90 = h('button', null, '90 天');
    seg.appendChild(w30); seg.appendChild(w90);
    c1h.appendChild(seg);
    c1.appendChild(c1h);
    var c1box = h('div', 'chart-box');
    c1.appendChild(c1box);
    charts.appendChild(c1);

    function drawVocab(days) {
      // 真实累计曲线：由每日 newWords 前向累加，不用任何反推
      var daily = S.series(days, 'newWords');
      var totalSeen = v.seenTotal;
      // 最后一天的累计值应等于当前实际词量，倒推起点使其对齐真实数据
      var sumNew = daily.reduce(function (a, d) { return a + d.value; }, 0);
      var base = Math.max(0, totalSeen - sumNew);
      var acc2 = base;
      var arr = daily.map(function (d, i) {
        acc2 += d.value;
        return { name: d.date, y: acc2 };
      });
      C.line(c1box, {
        height: 210,
        series: [{ name: '累计接触词数', data: arr, color: C.PALETTE[0] }],
        xLabel: function (i) { return fmtDate(arr[i].name); },
        yFormat: function (val) { return Math.round(val); },
        tipFormat: function (val) { return Math.round(val) + ' 词'; },
        emptyText: '最近 ' + days + ' 天还没有学习记录',
        legend: false
      });
    }
    drawVocab(30);
    w30.onclick = function () { w30.classList.add('on'); w90.classList.remove('on'); drawVocab(30); };
    w90.onclick = function () { w90.classList.add('on'); w30.classList.remove('on'); drawVocab(90); };

    // 学习热力图
    var c2 = h('div', 'card');
    var c2h = h('div', 'card-head');
    c2h.appendChild(h('h3', null, '学习热力图'));
    c2h.appendChild(h('span', 'sub', '颜色越深，当天学得越多'));
    c2.appendChild(c2h);
    var c2box = h('div', 'chart-box');
    c2.appendChild(c2box);
    charts.appendChild(c2);
    C.heatmap(c2box, {
      data: S.series(119, 'minutes'),
      weeks: 17,
      cell: 12,
      tip: function (d) { return d.value + ' 分钟'; },
      tip2: function (d) {
        var s = S.state.daily[d.date];
        return s ? '<br>复习 ' + s.reviews + ' 次 · 答对 ' + s.right + '/' + s.total : '';
      }
    });

    root.appendChild(charts);

    /* ---- 正确率 + 口语 + 雷达 ---- */
    var charts2 = h('div', 'grid g2');
    charts2.style.marginTop = '16px';

    var c3 = h('div', 'card');
    var c3h = h('div', 'card-head');
    c3h.appendChild(h('h3', null, '近 14 天正确率与学习量'));
    c3h.appendChild(h('span', 'sub', '正确率低于 70% 建议降难度'));
    c3.appendChild(c3h);
    var c3box = h('div', 'chart-box');
    c3.appendChild(c3box);
    charts2.appendChild(c3);
    var accData = S.series(14, 'total').map(function (d) {
      var s = S.state.daily[d.date];
      return { name: fmtDate(d.date), y: s && s.total ? Math.round(s.right / s.total * 100) : null };
    });
    var minData = S.series(14, 'minutes').map(function (d, i) { return { name: fmtDate(d.date), y: d.value }; });
    C.line(c3box, {
      height: 205, yMax: 100,
      series: [
        { name: '正确率 %', data: accData, color: C.PALETTE[1], fill: false },
        { name: '学习分钟', data: minData, color: C.PALETTE[3], fill: false }
      ],
      xLabel: function (i) { return fmtDate(accData[i].name); },
      yFormat: function (v) { return Math.round(v); },
      tipFormat: function (y) { return y; }
    });

    var c4 = h('div', 'card');
    var c4h = h('div', 'card-head');
    c4h.appendChild(h('h3', null, '能力雷达'));
    c4h.appendChild(h('span', 'sub', '基于你的真实行为数据估算'));
    c4.appendChild(c4h);
    var c4box = h('div', 'chart-box');
    c4.appendChild(c4box);
    charts2.appendChild(c4);
    C.radar(c4box, {
      size: 250,
      axes: estimateAbilities(L),
      compare: P.levelById(lv).dimensions.map(function (d) { return { name: d.name, value: d.target, max: 100 }; }),
      color: C.PALETTE[0], compareColor: '#d7dce6'
    });
    root.appendChild(charts2);

    /* ---- 徽章 ---- */
    var bc = h('div', 'card');
    bc.style.marginTop = '16px';
    var bh = h('div', 'card-head');
    bh.appendChild(h('h3', null, '成就徽章'));
    var gotN = Object.keys(st.badges).length;
    bh.appendChild(h('span', 'sub', gotN + ' / ' + S.BADGE_DEFS.length + ' 已获得'));
    bc.appendChild(bh);
    var bg = h('div', 'grid badge-grid');
    bg.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px';
    S.BADGE_DEFS.forEach(function (b) {
      var got = !!st.badges[b.id];
      var it = h('div', 'badge-item' + (got ? '' : ' locked'));
      it.appendChild(h('div', 'b-ico', b.icon));
      it.appendChild(h('div', 'b-name', b.name));
      it.appendChild(h('div', 'b-desc', b.desc));
      if (got) it.title = '获得于 ' + new Date(st.badges[b.id].at).toLocaleDateString('zh-CN');
      bg.appendChild(it);
    });
    bc.appendChild(bg);
    root.appendChild(bc);

    /* ---- 损失厌恶 / 承诺装置 ---- */
    var cc = h('div', 'grid g2');
    cc.style.marginTop = '16px';
    cc.appendChild(commitmentCard());
    cc.appendChild(lossCard(v, ml));
    root.appendChild(cc);
  };

  function kindLabel(kind) {
    return { review: '间隔重复 · 提取练习', new: '新词学习', speak: '口语输出', read: '阅读输入', extra: '错题复盘' }[kind] || '';
  }

  function statCard(label, val, unit, delta, accent) {
    var c = h('div', 'stat ' + (accent || ''));
    c.appendChild(h('div', 'lbl', label));
    var v = h('div', 'val', String(val));
    if (unit) { var s = h('small', null, unit); v.appendChild(s); }
    c.appendChild(v);
    if (delta) c.appendChild(h('div', 'delta', delta));
    return c;
  }

  function ringRow(seen, target, L) {
    var wrap = h('div');
    wrap.style.cssText = 'display:flex;align-items:center;gap:18px;flex-wrap:wrap';
    var rw = h('div');
    wrap.appendChild(rw);
    C.ring(rw, { value: seen, max: target, size: 104, stroke: 9, color: L.color, label: Math.round(seen / target * 100) + '%', sub: seen + '/' + target });
    var info = h('div');
    info.style.flex = '1';
    info.style.minWidth = '160px';
    var goalLine = h('div');
    goalLine.style.cssText = 'font-size:13px;line-height:1.7;color:var(--text-2)';
    goalLine.innerHTML = '<b style="color:var(--text)">目标</b>：' + L.goal + '<br>' +
      '<b style="color:var(--text)">建议</b>：' + L.dailyPlan;
    info.appendChild(goalLine);
    var bars = h('div');
    bars.style.marginTop = '12px';
    var vs = S.vocabStats();
    var metaAll = S.vocabMeta();
    ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].forEach(function (lv) {
      var pool = metaAll.byLevel[lv] || 1;
      var row = h('div');
      row.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:11.5px';
      var tag = h('span', 'tag ' + lv.toLowerCase(), lv);
      tag.style.cssText = 'width:30px;justify-content:center;padding:1px 0';
      row.appendChild(tag);
      var bar = h('div', 'bar sm lv' + lv.slice(1));
      bar.style.flex = '1';
      var fill = h('i');
      fill.style.width = Math.min(100, (vs.seen[lv] / pool) * 100) + '%';
      bar.appendChild(fill);
      row.appendChild(bar);
      var num = h('span', null, vs.seen[lv] + '/' + pool);
      num.style.cssText = 'color:var(--text-3);width:56px;text-align:right;flex-shrink:0';
      row.appendChild(num);
      bars.appendChild(row);
    });
    info.appendChild(bars);
    wrap.appendChild(info);
    return wrap;
  }

  /** 基于真实行为数据估算当前能力分（0-100），不做无依据的编造 */
  function estimateAbilities(L) {
    var v = S.vocabStats();
    var sp = S.speakingStats();
    var acc = S.accuracy('total', 'right') * 100;
    var readRight = 0, readTotal = 0;
    Object.keys(S.state.reading).forEach(function (k) { });
    var readDone = Object.keys(S.state.reading).length;
    var vocabScore = Math.min(100, Math.round(v.seenTotal / L.vocabTarget * 70 + (acc || 0) * 0.3));
    var speakScore = sp.count ? Math.round(sp.avg * 0.7 + Math.min(30, sp.count * 1.5)) : 0;
    var readScore = readDone ? Math.round(Math.min(100, Object.keys(S.state.reading).reduce(function (a, k) {
      return a + S.state.reading[k].best;
    }, 0) / readDone * 100)) : 0;
    var writingScore = Math.min(100, Math.round(S.totalMinutes() / 60 * 12));
    var listeningScore = Math.round(Math.min(100, vocabScore * 0.7 + acc * 0.3));
    var grammarScore = Math.round(Math.min(100, acc * 0.8 + v.mature * 0.4));
    return [
      { name: '听力理解', value: listeningScore, max: 100 },
      { name: '口语流利', value: speakScore, max: 100 },
      { name: '阅读速度', value: readScore, max: 100 },
      { name: '书面表达', value: writingScore, max: 100 },
      { name: '语法准确', value: grammarScore, max: 100 },
      { name: '词汇广度', value: vocabScore, max: 100 }
    ];
  }

  function commitmentCard() {
    var st = S.state, c = h('div', 'card');
    c.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '目标承诺装置'));
    var days = S.daysBetween(st.commitment.start, S.today()) + 1;
    var elapsed = Math.max(1, days);
    var pct = Math.min(100, st.commitment.goal / elapsed);
    var body = h('div');
    body.innerHTML = '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px">' +
      '<span>目标：<b>' + st.commitment.goal + ' 词</b> · 日均需 ' + Math.ceil(st.commitment.goal / elapsed) + ' 词</span>' +
      '<span style="color:var(--text-3)">已学 ' + S.vocabStats().seenTotal + ' 词</span></div>';
    var bar = h('div', 'bar lg');
    var fill = h('i');
    fill.style.width = Math.min(100, (S.vocabStats().seenTotal / st.commitment.goal) * 100) + '%';
    fill.style.background = S.vocabStats().seenTotal / elapsed >= st.commitment.goal / elapsed ? 'var(--success)' : 'var(--primary)';
    bar.appendChild(fill);
    body.appendChild(bar);
    body.appendChild(h('div', 'field'));
    body.lastChild.style.cssText = 'margin:14px 0';
    var note = h('div');
    note.style.cssText = 'font-size:12.5px;color:var(--text-2);background:var(--surface-2);padding:11px 13px;border-radius:9px;line-height:1.7';
    note.innerHTML = '<b>大脑原理</b>：目标太模糊不会产生行为。有效承诺需三要素——具体可量化、公开可见、违背有代价。' +
      '自我决定论表明，完全外部强制的目标会削弱动机，但"你自己签下的承诺"被大脑归因为自主选择，内驱力得以保留。';
    body.appendChild(note);
    c.appendChild(body);

    var row = h('div', 'btn-row');
    row.style.marginTop = '14px';
    var setB = h('button', 'btn ghost sm', '调整目标');
    setB.onclick = function () {
      openSheet('设定目标与承诺', function (sheet) {
        var f1 = h('div', 'field');
        f1.appendChild(h('label', null, '目标词汇量'));
        var i1 = h('input', 'input');
        i1.type = 'number'; i1.value = st.commitment.goal;
        f1.appendChild(i1);
        f1.appendChild(h('div', 'hint', '零基础一年建议 1500-2000 词。设定后全程可见进度偏差。'));
        sheet.appendChild(f1);
        var f2 = h('div', 'field');
        f2.appendChild(h('label', null, '每日投入分钟数'));
        var i2 = h('input', 'input');
        i2.type = 'number'; i2.value = st.profile.dailyMinutes;
        f2.appendChild(i2);
        f2.appendChild(h('div', 'hint', '20 分钟/天 × 300 天 ≈ 100 小时，足以达到"能应付日常"；每周 30 小时 × 48 周 ≈ 1440 小时可接近精通。'));
        sheet.appendChild(f2);
        var save = h('button', 'btn', '保存承诺');
        save.onclick = function () {
          st.commitment.goal = Math.max(50, +i1.value || 1500);
          st.profile.dailyMinutes = Math.max(5, +i2.value || 20);
          st.commitment.log.push({ date: S.today(), goal: st.commitment.goal });
          S.save();
          document.querySelector('.sheet-mask').remove();
          toast('承诺已更新');
          render();
        };
        sheet.appendChild(save);
      });
    };
    var abn = h('button', 'btn ghost sm', '自主放弃 20%');
    abn.onclick = function () {
      openSheet('主动降低目标', function (sheet) {
        var p = h('p');
        p.style.cssText = 'font-size:13.5px;line-height:1.8;color:var(--text-2)';
        p.innerHTML = '如果你下周必须减量，<b>由你自己决定减什么</b>——这个动作不算失败，是自主感投资。<br><br>' +
          '<b>大脑原理</b>：自我决定论指出，当行为被体验为"自主选择"而非"被强加"，内驱力显著增强。' +
          '允许自主放弃（autonomous disengagement）能降低中途彻底放弃率——因为曲线从"降速"变成了"换挡"。';
        sheet.appendChild(p);
        var reduce = h('button', 'btn', '目标下调 20% 并记录');
        reduce.style.marginTop = '14px';
        reduce.onclick = function () {
          st.commitment.goal = Math.round(st.commitment.goal * 0.8);
          st.commitment.log.push({ date: S.today(), goal: st.commitment.goal, voluntary: true });
          S.save();
          document.querySelector('.sheet-mask').remove();
          toast('目标已调整为 ' + st.commitment.goal + ' 词，这是你的自主决定');
          render();
        };
        sheet.appendChild(reduce);
      });
    };
    row.appendChild(setB); row.appendChild(abn);
    c.appendChild(row);
    return c;
  }

  function lossCard(v, ml) {
    var c = h('div', 'card');
    c.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '遗忘曲线对照'));
    c.appendChild(h('span', 'sub', '为什么必须用间隔重复'));
    var box = h('div', 'chart-box');
    box.style.marginTop = '8px';
    c.appendChild(box);
    var sci = global.VocabContent.SCIENCE;
    C.line(box, {
      height: 190, yMax: 100,
      series: [{ name: '记忆保留率 %', data: sci.forgetting.map(function (f) { return { name: f.t, y: Math.round(f.r * 100) }; }), color: C.PALETTE[4] }],
      xLabel: function (i) { return sci.forgetting[i].t; },
      yFormat: function (x) { return x + '%'; },
      tipFormat: function (x) { return x + '% 记忆仍保留'; },
      legend: false
    });
    var note = h('div');
    note.style.cssText = 'margin-top:12px;padding:11px 13px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.7';
    note.innerHTML = '<b>艾宾浩斯原始数据</b>：无复习时，24 小时后记忆保留约 33%，一个月后约 21%。' +
      '本应用的 SM-2 算法会在你即将遗忘的临界点（i+1）安排复习，把这条衰减曲线强行拉平。<br>' +
      '<b>你的统计</b>：成熟词（间隔 ≥21 天）<b>' + v.mature + '</b> 个 · 学习中 ' + v.learning + ' 个。' +
      '成熟词才计入"真正掌握"。';
    c.appendChild(note);
    return c;
  }

  function openSheet(title, build, opts) {
    return global.UI.sheet(title, build, opts);
  }

  /* 共享工具箱：必须在模块加载期暴露，供 view-*.js 在 IIFE 顶层取用 */
  global.ui = {
    h: h, $: $, $$: $$, esc: global.UI.esc,
    clear: global.UI.clear,
    toast: global.UI.toast, toastUndo: global.UI.toastUndo, confirm: global.UI.confirm,
    loadingState: global.UI.loadingState, emptyState: global.UI.emptyState,
    errorState: global.UI.errorState, degradedBanner: global.UI.degradedBanner,
    tts: tts, scoreSpeech: scoreSpeech, canRecognize: canRecognize,
    openSheet: openSheet, showSurprise: showSurprise, maybeSurprise: maybeSurprise,
    currentLevel: currentLevel, fmtDate: fmtDate, fmtDateFull: fmtDateFull,
    estimateAbilities: estimateAbilities, checkUnlock: checkUnlock,
    pendingUnlockConditions: pendingUnlockConditions,
    cloud: global.Cloud
  };
  /* 视图模块常直接用 $$ / $，此处挂到全局供其使用 */
  global.$ = $;
  global.$$ = $$;
  global.render = function () { render(); };

  function nextLine() {
    var lv = currentLevel(), L = P.levelById(lv);
    var ms = L.milestones.filter(function (m) { return !m.done; });
    var n = P.nextLevel(lv);
    if (n) return '下一步：完成「' + L.name + '」阶段的里程碑，解锁「' + n.name + '」。';
    return '你已走到最后一级，继续深耕。';
  }

  /* ============================================================
     路由
     ============================================================ */
  function render() {
    var wrap = $('#view');
    if (!wrap) return;
    global.UI.clear(wrap);
    var root = h('div', 'view');
    wrap.appendChild(root);

    // 存储降级提示（置顶，最优先告知）
    var banner = global.UI.degradedBanner(function () { return S.runtime; });
    if (banner) wrap.insertBefore(banner, root);

    var fn = views[current] || views.dash;
    if (typeof fn !== 'function') {
      renderFailure(root, new Error('未找到视图：' + current));
    } else {
      try {
        fn(root);
      } catch (e) {
        console.error('[app] 渲染失败', current, e);
        renderFailure(root, e);
      }
    }

    // 激活导航
    $$('.nav button').forEach(function (b) {
      var on = b.dataset.v === current;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    var curStage = stageOf(current);
    if (curStage) {
      var nav = $('#nav');
      if (nav) nav.setAttribute('data-stage', curStage.num);
      // 阶段标题同步到页面顶部，让用户始终知道自己在哪一阶段
      var stageBar = $('#stageBar');
      if (stageBar) {
        stageBar.textContent = curStage.num + ' · ' + curStage.name;
        stageBar.title = curStage.desc;
      }
    }
    // 选中项滚入视野：横向滚动导航在移动端能露出 3-4 项，
    // 切到靠后的页面时若不滚动，用户会完全看不到自己在哪
    scrollNavToActive();
    var chip = $('#streakChip');
    if (chip) {
      var stk = S.streak();
      chip.textContent = '🔥 ' + stk.current;
      chip.classList.toggle('zero', stk.current === 0);
      chip.title = stk.current > 0 ? '已连续打卡 ' + stk.current + ' 天' : '今天还没有学习记录';
    }
    if (global.innerWidth < 760) global.scrollTo(0, 0);
  }

  /* ============================================================
     导航结构：按「认知输入 → 理解解析 → 场景运用 → 审美拓展」四阶段组织

     这样排序的理由是语言习得的真实顺序：
       认知输入 —— 先见过、知道有这么个东西（词汇、发音、资料）
       理解解析 —— 再搞懂它为什么长这样、能怎么推（词根、音标、原理）
       场景运用 —— 然后用出去，在真实语境里活起来（口语、日常、阅读）
       审美拓展 —— 最后抵达审美，语言的密度与余韵（诗歌、名句）

     每个阶段内的模块层级统一：
       stage 阶段名（罗马数字 + 中文）
       group 分组标签（导航第二行）
     ============================================================ */

  /** 把当前选中项滚进可视区。只在真需要时动，避免整条导航反复重置位置 */
  function scrollNavToActive() {
    var nav = $('#nav');
    if (!nav) return;
    var on = nav.querySelector('button.on');
    if (!on) return;
    // 已经完整可见就不动
    var nl = nav.getBoundingClientRect();
    var ol = on.getBoundingClientRect();
    var pad = 24;
    if (ol.left >= nl.left + pad && ol.right <= nl.right - pad) return;
    nav.scrollTo({
      left: on.offsetLeft - (nav.clientWidth - on.offsetWidth) / 2,
      behavior: 'smooth'
    });
  }
  var STAGES = [
    { id: 's1', num: 'I', name: '认知输入', desc: '先见过，知道有这么个东西' },
    { id: 's2', num: 'II', name: '理解解析', desc: '搞懂为什么，怎么推' },
    { id: 's3', num: 'III', name: '场景运用', desc: '用出去，在语境里活起来' },
    { id: 's4', num: 'IV', name: '审美拓展', desc: '抵达语言的密度与余韵' }
  ];

  var NAV = [
    /* ---- I 认知输入 ---- */
    { id: 'dash', label: '总览', group: 'I 认知输入' },
    { id: 'path', label: '等级路径', group: 'I 认知输入' },
    { id: 'vocab', label: '词汇', group: 'I 认知输入' },
    { id: 'english', label: '英语资料', group: 'I 认知输入' },

    /* ---- II 理解解析 ---- */
    { id: 'roots', label: '词根词缀', group: 'II 理解解析' },
    { id: 'phoneme', label: '音标口型', group: 'II 理解解析' },
    { id: 'psych', label: '心理机制', group: 'II 理解解析' },
    { id: 'progress', label: '学习记忆', group: 'II 理解解析' },

    /* ---- III 场景运用 ---- */
    { id: 'speak', label: '口语', group: 'III 场景运用' },
    { id: 'dailycomm', label: '日常交流', group: 'III 场景运用' },
    { id: 'read', label: '阅读', group: 'III 场景运用' },

    /* ---- IV 审美拓展 ---- */
    { id: 'poetry', label: '诗歌名句', group: 'IV 审美拓展' },

    /* ---- 工具与设置（不参与四阶段） ---- */
    { id: 'tttsettings', label: '发音设置', group: '工具' },
    { id: 'account', label: '账号同步', group: '工具' },
    { id: 'data', label: '数据模型', group: '工具' }
  ];

  /** 供其他模块引用：当前处于第几阶段 */
  function stageOf(viewId) {
    var n = NAV.filter(function (x) { return x.id === viewId; })[0];
    if (!n) return null;
    var g = n.group;
    for (var i = 0; i < STAGES.length; i++) {
      if (g.indexOf(STAGES[i].num) === 0) return STAGES[i];
    }
    return null;
  }


  /**
   * 构建导航：按阶段插入分组标题，让四阶段结构在视觉上直接可读。
   * 不分组的话 15 个按钮平铺，用户看不出学习路径。
   */
  function buildNav() {
    var nav = $('#nav');
    var lastGroup = null;

    NAV.forEach(function (n) {
      if (n.group !== lastGroup) {
        lastGroup = n.group;
        var g = h('span', 'nav-group', n.group);
        g.dataset.g = n.group;
        nav.appendChild(g);
      }
      var b = h('button', null, n.label);
      b.dataset.v = n.id;
      b.setAttribute('aria-label', n.label);
      b.onclick = function () { current = n.id; location.hash = n.id; render(); };
      nav.appendChild(b);
    });

    // 标记当前阶段，方便样式上突出
    var cur = stageOf(current);
    if (cur) nav.setAttribute('data-stage', cur.num);
  }

  /* ---------- 全局错误边界 ----------
     任何未捕获异常都不能白屏：显示可重试的错误态并保留已加载状态 */
  window.addEventListener('error', function (e) {
    console.error('[app] 未捕获异常', e.error || e.message);
  });
  window.addEventListener('unhandledrejection', function (e) {
    console.error('[app] 未处理的 Promise 拒绝', e.reason);
  });

  /** 渲染失败时的兜底 UI */
  function renderFailure(root, err) {
    var box = global.UI.errorState(
      '这个页面出了点问题',
      (err && err.message) || '未知错误',
      function () { render(); }
    );
    root.appendChild(box);
    var tip = h('div', null, '如果反复出错，可在「数据模型 → 导出 JSON」备份后重置数据。');
    tip.style.cssText = 'text-align:center;font-size:12px;color:var(--text-3);margin-top:10px';
    root.appendChild(tip);
  }

  /* 代理发音地址解析。
     优先级：
       1. 用户手填的（localStorage.lumen.ttsProxy，填 'off' 可关闭）
       2. 与页面同源的非本机地址 → 假设 /tts 是代理挂载点（正式部署走这条）
       3. 其余一律 127.0.0.1:8788（本地开发、file:// 直接打开、App 内）

     第3 条曾经给 App 内（file://）返回空串，想法是「手机上不会跑这个服务，
     配上地址会白等超时」。但 file:// 不只出现在 App 内——
     用户在电脑上双击 index.html 也是这个协议，于是「连不上」。
     这是把两种场景混为一谈。
     代价其实可控：App 内原生 TTS 优先级高于代理（见 tts.js resolveMode），
     代理只在原生未就绪时才会被问到，此时再连不上也就是一次快速失败，
     不影响 App 的正常使用。 */
  function resolveTTSProxy() {
    var custom = '';
    try { custom = String(localStorage.getItem('lumen.ttsProxy') || '').trim(); } catch (e) {}
    if (custom === 'off') return '';
    if (custom) return custom;
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      if (location.hostname !== '127.0.0.1' && location.hostname !== 'localhost') {
        return location.origin + '/tts';
      }
    }
    return 'http://127.0.0.1:8788';
  }

  function init() {
    if (global.__booted) return;
    global.__booted = true;
    S.init();
    if (global.Progress) global.Progress.init();
    if (global.TTS) {
      // 必须在 init 之前配置：init 会做一次语音可用性评估，
      // 顺序反了会导致首屏显示"无英语语音"的错误提示。
      try { global.TTS.setProxy(resolveTTSProxy()); } catch (e) {}
      global.TTS.init();
      /* 主动探一次服务连通性。
         「已配置」和「连得上」是两件事——地址写对了但服务没启动时，
         页面看起来一切正常，点发音却毫无反应，必须先探清楚再决定要不要提示。*/
      try {
        if (global.TTS.probeProxy) {
          global.TTS.probeProxy().then(function (ok) {
            // 探测结果会影响总览页的提示条，此时首屏可能已渲染完
            if (!ok && current === 'dash') render();
          });
        }
      } catch (e) {}
    }
    if (global.PWA) global.PWA.init();
    buildNav();
    window.addEventListener('hashchange', function () {
      var raw = location.hash.slice(1);
      // hash 可能带参数：vocab?w=inspect
      var id = raw.split('?')[0];
      if (id && views[id] && id !== current) {
        current = id;
        render();
      }
      // 无论是否切了视图都要处理参数：
      // 切了视图时参数要等新视图渲染完才能落点（focusWord 依赖 vocabBody）
      applyHashParam(raw);
    });
    var initRaw = location.hash.slice(1);
    var initId = initRaw.split('?')[0];
    if (initId && views[initId]) current = initId;

    // 云服务：初始化并在已有会话时开启自动同步。
    // SDK 未加载（离线或 CDN 不可达）时静默跳过，应用继续以本地模式运行。
    if (global.Cloud) {
      global.Cloud.init()
        .then(function () { if (global.Cloud.isSignedIn()) global.Cloud.startAutoSync(); })
        .catch(function (e) { console.warn('[app] 云服务初始化异常', e); });
    }

    // 其他视图模块已通过 global.Views 自行注册
    render();
    applyHashParam(initRaw);
  }

  /* 消费 hash 上的参数：vocab?w=inspect
     划词取词弹层里的「在词汇模块查看完整讲解」会带这个词跳过来，
     这里在渲染完成后定位到该词并高亮，把「查一下」和「看讲解」接上。 */
  function applyHashParam(raw) {
    var m = /[?&]w=([^&]+)/.exec(raw || '');
    if (!m) return;
    var w = decodeURIComponent(m[1] || '');
    if (!w) return;
    // 渲染是同步的，但视图切换 / 词库分片可能还没就绪，做有限次重试
    var tries = 0;
    function attempt() {
      if (global.VocabView && typeof global.VocabView.focusWord === 'function') {
        global.VocabView.focusWord(w);
        return;
      }
      if (++tries < 20) setTimeout(attempt, 60);
    }
    setTimeout(attempt, 80);
  }

  global.App = { init: init, render: render, views: views, checkUnlockNow: checkUnlock };

  window.addEventListener('DOMContentLoaded', function () { init(); });
})(window);