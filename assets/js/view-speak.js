/* ============================================================
   view-speak.js —— 口语模块
   场景对话跟读 / 发音训练 / 流利度曲线
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, C = global.Charts, SC = global.SpeakingContent;
  var DAILY_SCENES = global.SlangContent ? global.SlangContent.DAILY_SCENES : [];
  var ui = global.ui, h = ui.h;

  /** 全部场景：统一从 ContentIndex 取（自动包含新增数据源） */
  function allScenes() { return global.ContentIndex.scenes(); }
  function scenesOfLevel(lv) { return global.ContentIndex.scenesByLevel(lv); }

  /* ============================================================
     A. 场景对话 + 跟读反馈
     ============================================================ */
  function sceneView(root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '口语场景'));
    head.appendChild(h('p', null, '每个场景标注了发音要点（重音、连读、常见误读）。点击 🎤 录音，系统会与原句逐词比对并给出反馈。'));
    root.appendChild(head);

    // 能力提示
    if (!ui.canRecognize()) {
      var warn = h('div', 'card');
      warn.style.cssText = 'background:var(--warn-soft);border-color:#f7dfae';
      var wt = h('div');
      wt.style.cssText = 'font-size:13px;color:#8a6a1a;line-height:1.75';
      wt.innerHTML = '<b>当前浏览器不支持语音识别</b>，跟读评分功能不可用。<br>' +
        'Chrome / Edge 桌面版支持 Web Speech API；Safari 与 Firefox 支持不完整。你仍可使用「听音—对照—自查」模式学习。';
      warn.appendChild(wt);
      root.appendChild(warn);
    }

    var lv = ui.currentLevel();
    var sel = h('div', 'card');
    var seg = h('div', 'segment');
    seg.id = 'lvSeg';   // 独立 id，避免与标签页的 .segment 选择器混淆
    ['L1', 'L2', 'L3', 'L4'].forEach(function (id) {
      var b = h('button', id === lv ? 'on' : null, id + ' ' + global.PathContent.levelById(id).name);
      b.onclick = function () {
        if (!S.state.unlocked[id]) { ui.toast('完成上一阶段后解锁 ' + id); return; }
        curLv = id; ui.$('#sceneList').innerHTML = ''; renderList();
        $$('.segment button', seg).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      };
      seg.appendChild(b);
    });
    sel.appendChild(seg);
    root.appendChild(sel);

    var listBox = h('div');
    listBox.id = 'sceneList';
    listBox.style.marginTop = '16px';
    root.appendChild(listBox);
    var curLv = lv;

    function renderList() {
      // 三处来源合并：原场景 + 俚语模块的日常场景 + 第二批扩充场景，按 id 去重
      var scenes = scenesOfLevel(curLv);
      if (!scenes.length) {
        listBox.appendChild(emptyBox('暂无该阶段场景'));
        return;
      }
      var seen = {};
      scenes = scenes.filter(function (s) {
        if (seen[s.id]) return false;
        seen[s.id] = 1; return true;
      });
      scenes.forEach(function (sc) { listBox.appendChild(sceneCard(sc)); });
    }
    renderList();
  }
  var curLv = null;

  function emptyBox(txt) {
    var e = h('div', 'card');
    var es = h('div', 'empty-state');
    es.appendChild(h('div', 'e-txt', txt));
    e.appendChild(es);
    return e;
  }

  function sceneCard(sc) {
    var card = h('div', 'card');
    var hd = h('div', 'card-head');
    var l = h('div');
    var t = h('h3', null, sc.titleCn);
    l.appendChild(t);
    var sub = h('div', 'sub', sc.title + ' · ' + sc.lines.length + ' 句 · 约 ' + sc.minutes + ' 分钟');
    l.appendChild(sub);
    hd.appendChild(l);
    hd.appendChild(h('span', 'tag ' + sc.lv.toLowerCase(), sc.lv));
    card.appendChild(hd);

    // 目标与挑战
    var goal = h('div');
    goal.style.cssText = 'padding:10px 12px;background:var(--primary-soft);border-radius:9px;font-size:12.5px;color:#34529f;line-height:1.7;margin-bottom:14px';
    goal.innerHTML = '<b>本场景目标</b>：' + sc.goal + '<br><b>挑战任务</b>：' + sc.challenge;
    card.appendChild(goal);

    // 对话
    var box = h('div');
    var scoreState = { total: 0, count: 0, avg: 0, perLine: [] };
    sc.lines.forEach(function (ln, i) {
      var row = h('div', 'dialog-line');
      row.appendChild(h('div', 'd-who ' + (ln.who === 'A' ? 'a' : 'b'), ln.who));
      var body = h('div', 'd-body');
      var en = h('div', 'd-en', ln.en);
      en.onclick = function () { ui.tts.speak(ln.en); };
      en.style.cursor = 'pointer';
      en.title = '点击朗读';
      body.appendChild(en);
      body.appendChild(h('div', 'd-cn', ln.cn));
      if (ln.focus) body.appendChild(h('div', 'd-focus', '🔊 ' + ln.focus));

      var tools = h('div', 'd-tools');
      var sp = h('button', 'mini-btn', '🔊 朗读');
      sp.onclick = function () { ui.tts.speak(ln.en); };
      tools.appendChild(sp);
      var sl = h('button', 'mini-btn', '🐢 慢速');
      sl.onclick = function () { ui.tts.slow(ln.en); };
      tools.appendChild(sl);

      var recBtn = null, rec = null, recStart = 0;
      if (ui.canRecognize()) {
        recBtn = h('button', 'mini-btn rec', '🎤 跟读');
        tools.appendChild(recBtn);
        recBtn.onclick = function () {
          if (recBtn.classList.contains('on')) {
            if (rec) { try { rec.stop(); } catch (e) { } }
            return;
          }
          var R = global.SpeechRecognition || global.webkitSpeechRecognition;
          rec = new R();
          rec.lang = 'en-US';
          rec.interimResults = true;
          rec.maxAlternatives = 3;
          rec.continuous = false;
          recBtn.classList.add('on');
          recBtn.textContent = '⏹ 停止';
          recStart = Date.now();
          var got = '';
          rec.onresult = function (e) {
            got = '';
            for (var i = e.resultIndex; i < e.results.length; i++) got += e.results[i][0].transcript;
            ui.$('#recHint_' + i, row).textContent = got ? '识别中：' + got : '';
          };
          rec.onerror = function (e) {
            recBtn.classList.remove('on'); recBtn.textContent = '🎤 跟读';
            ui.toast('识别失败：' + (e.error === 'not-allowed' ? '请允许麦克风权限' : e.error));
          };
          rec.onend = function () {
            recBtn.classList.remove('on'); recBtn.textContent = '🎤 跟读';
            var dur = (Date.now() - recStart) / 1000;
            if (!got) { ui.$('#recHint_' + i, row).textContent = '没有识别到声音，请重试'; return; }
            var conf = 0.75;
            try {
              for (var k = 0; k < rec.results.length; k++) {
                var r = rec.results[k];
                for (var a = 0; a < r.length; a++) {
                  var alt = r[a].transcript;
                  var sc2 = ui.scoreSpeech(ln.en, alt, r[a].confidence || .7, dur);
                  if (sc2.score > (lastRes[i] ? lastRes[i].score : 0)) lastRes[i] = Object.assign({ alt: alt }, sc2);
                }
              }
            } catch (e) { }
            var best = lastRes[i];
            if (!best) { ui.$('#recHint_' + i, row).textContent = '识别失败'; return; }
            showScore(row, i, ln, best, sc, scoreState);
          };
          try { rec.start(); } catch (e) { ui.toast('无法启动录音'); }
        };
      }
      row.appendChild(body);
      row.appendChild(tools);
      // 提示区
      var hint = h('div');
      hint.id = 'recHint_' + i;
      hint.style.cssText = 'font-size:12px;color:var(--text-3);margin-top:5px';
      body.appendChild(hint);
      box.appendChild(row);
    });

    var lastRes = sc.lines.map(function () { return null; });
    card.appendChild(box);

    // 整段朗读 + 完成按钮
    var act = h('div', 'btn-row');
    act.style.marginTop = '14px';
    var all = h('button', 'btn soft', '▶ 连续朗读全段');
    all.onclick = function () {
      speechSynthesis.cancel();
      sc.lines.forEach(function (l, i) {
        var u = ui.tts.speak(l.en);
        if (u) u.onend = function () { if (i < sc.lines.length - 1) setTimeout(function () { ui.tts.speak(sc.lines[i + 1].en); }, 420); };
      });
    };
    act.appendChild(all);
    var done = h('button', 'btn', '✓ 完成本场景');
    done.onclick = function () {
      var st = S.state;
      S.addSpeaking({ scene: sc.id, lv: sc.lv, score: scoreState.avg || 65, minutes: sc.minutes, date: S.today() });
      // 自动写入进度记忆：逐句发音记录 + 学习时段
      if (global.Progress) {
        scoreState.perLine.forEach(function (pl, i) {
          if (pl && pl.score != null) global.Progress.recordSpeaking(sc.id, pl.idx, pl.score);
        });
        global.Progress.recordSession('speak', Math.min(30, sc.minutes || 5), sc.id);
      }
      ui.toast('口语记录已保存（平均 ' + Math.round(scoreState.avg) + ' 分）');
      var got = S.checkBadges();
      got.forEach(function (bd, i) { setTimeout(function () { ui.toast(bd.icon + ' ' + bd.name, 3000); }, 500 + i * 500); });
      done.textContent = '✓ 已完成 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
      done.disabled = true;
      global.App.checkUnlockNow && global.App.checkUnlockNow();
    };
    act.appendChild(done);
    card.appendChild(act);

    var stat = h('div');
    stat.style.cssText = 'margin-top:12px;display:flex;gap:16px;font-size:12.5px;color:var(--text-3)';
    card.appendChild(stat);
    function refreshStat() {
      stat.innerHTML = '<span>已跟读 <b style="color:var(--text)">' + scoreState.count + '</b> 句</span>' +
        '<span>平均得分 <b style="color:var(--primary)">' + (scoreState.count ? Math.round(scoreState.avg) : '—') + '</b></span>';
    }
    refreshStat();
    card.refreshStat = refreshStat;
    return card;
  }

  function showScore(row, i, ln, res, sc, state) {
    // 清理旧的反馈
    var old = row.querySelector('.score-fb');
    if (old) old.remove();
    var fb = h('div', 'feedback ' + (res.score >= 80 ? 'ok' : res.score >= 60 ? 'info' : 'no'));
    fb.classList.add('score-fb');
    var tone = res.score >= 85 ? '很接近了' : res.score >= 70 ? '不错' : '再试一次';
    fb.innerHTML =
      '<b>' + res.score + ' 分</b> · ' + tone + ' — 词准确率 <b>' + res.wordAcc + '%</b> · 语速 <b>' + res.wpm + ' WPM</b>' +
      (res.missed.length ? ' · 识别置信度 ' + res.conf + '%' : '') +
      (res.missed.length ? '<br>未识别到：<b style="color:#a83238">' + res.missed.join(' / ') + '</b>' : '<br>全部单词都已识别 ✓') +
      (res.extra.length ? '<br>多识别到：<span style="opacity:.75">' + res.extra.join(' / ') + '</span>' : '') +
      '<br><span style="opacity:.8;font-size:12px">评分 = 词准确率×60% + 语速得分×15% + 识别置信度×25%。识别可能受环境噪音与口音影响，把它当参考而非判决。</span>';
    row.querySelector('.d-body').appendChild(fb);
    state.count++;
    state.total += res.score;
    state.avg = state.total / state.count;
    // 记录逐句明细，供进度记忆系统使用
    if (!state.perLine) state.perLine = [];
    state.perLine[i] = { idx: i, score: res.score, conf: res.conf || 0 };
    if (row.closest('.card').refreshStat) row.closest('.card').refreshStat();
  }

  /* ============================================================
     B. 发音训练
     ============================================================ */
  function phoneticsView(root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '发音训练'));
    head.appendChild(h('p', null, '先解决"听不出、读不准"的音，再谈流利。以下音标针对中文母语者最容易出错的音整理。'));
    root.appendChild(head);

    // 连读规则
    var c1 = h('div', 'card');
    var hd = h('div', 'card-head');
    hd.appendChild(h('h3', null, '连读与弱读规则'));
    hd.appendChild(h('span', 'sub', '听不懂往往不是词不认识，是没听出词的连接'));
    c1.appendChild(hd);
    var grid = h('div', 'grid g2');
    SC.CONNECTIVES.forEach(function (c) {
      var it = h('div');
      it.style.cssText = 'padding:10px 12px;border:1px solid var(--border);border-radius:9px';
      var r = h('div');
      r.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:3px';
      r.appendChild(h('b', null, c.rule));
      r.appendChild(h('span', 'tag grey', c.level));
      it.appendChild(r);
      it.appendChild(h('div', null, c.desc));
      it.lastChild.style.cssText = 'font-size:12.5px;color:var(--text-2)';
      var ex = h('div', null, '▸ ' + c.ex);
      ex.style.cssText = 'font-size:12.5px;color:var(--primary-dark);margin-top:4px;font-style:italic';
      it.appendChild(ex);
      grid.appendChild(it);
    });
    c1.appendChild(grid);
    root.appendChild(c1);

    // 音标卡
    var c2 = h('div', 'card');
    c2.style.marginTop = '16px';
    c2.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '易错音标'));
    c2.lastChild.appendChild(h('span', 'sub', '点击单词可听标准发音'));
    var g2 = h('div', 'grid g2');
    SC.SOUNDS.forEach(function (s) {
      var card = h('div');
      card.style.cssText = 'padding:13px;border:1px solid var(--border);border-radius:10px';
      var top = h('div');
      top.style.cssText = 'display:flex;align-items:baseline;gap:9px;margin-bottom:6px';
      top.appendChild(h('b', null, s.sym));
      top.firstChild.style.cssText = 'font-size:17px;color:var(--primary-dark);font-family:var(--mono)';
      top.appendChild(h('span', null, s.name));
      top.lastChild.style.cssText = 'font-size:12.5px;color:var(--text-3)';
      card.appendChild(top);
      var words = h('div');
      words.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:7px';
      s.words.forEach(function (w) {
        var b = h('button', 'mini-btn', w);
        b.onclick = function () { ui.tts.speak(w); };
        words.appendChild(b);
      });
      card.appendChild(words);
      var tp = h('div', null, '✓ ' + s.tip);
      tp.style.cssText = 'font-size:12.5px;color:#14684a;line-height:1.65';
      card.appendChild(tp);
      var pt = h('div', null, '✗ ' + s.pitfall);
      pt.style.cssText = 'font-size:12.5px;color:#a83238;line-height:1.65;margin-top:4px';
      card.appendChild(pt);
      g2.appendChild(card);
    });
    c2.appendChild(g2);
    root.appendChild(c2);

    // 句子重读训练
    var c3 = h('div', 'card');
    c3.style.marginTop = '16px';
    c3.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '句子重读练习'));
    c3.lastChild.appendChild(h('span', 'sub', '实词重读 + 功能词弱读 = 自然语流'));
    var demos = [
      { text: 'I want to go to the store today.', stress: 'I want to GO to the STORE toDAY' },
      { text: 'Could you please help me with this?', stress: 'COULD you PLEASE HELP me with THIS' },
      { text: 'She has been working here for five years.', stress: 'SHE has been WORKing HERE for FIVE YEARS' },
      { text: 'I don\'t think we should do that now.', stress: 'I don\'t THINK we SHOULD do THAT NOW' }
    ];
    demos.forEach(function (d) {
      var row = h('div');
      row.style.cssText = 'padding:11px 13px;border:1px solid var(--border);border-radius:9px;margin-bottom:9px';
      var t = h('div', null, d.text);
      t.style.cssText = 'font-size:15px;font-weight:500;cursor:pointer';
      t.title = '点击朗读';
      t.onclick = function () { ui.tts.speak(d.text); };
      row.appendChild(t);
      var s = h('div', null, '重音模式：' + d.stress);
      s.style.cssText = 'font-size:12px;color:var(--text-3);margin-top:3px;font-family:var(--mono)';
      row.appendChild(s);
      c3.appendChild(row);
    });
    var note = h('div');
    note.style.cssText = 'margin-top:10px;padding:11px 13px;background:var(--primary-soft);border-radius:9px;font-size:12.5px;color:#34529f;line-height:1.75';
    note.innerHTML = '<b>大脑原理</b>：英语是重音节拍语言（stress-timed），每个音节并非等长。' +
      '听者依靠重音位置切分语义单元——这就是为什么你读得"很慢但每个词都清楚"反而比读得快更难懂：' +
      '缺少重音等于没有边界，听者无法判断词组在哪里断开。<b>慢而准 &gt; 快而含混。</b>';
    c3.appendChild(note);
    root.appendChild(c3);
  }

  /* ============================================================
     C. 流利度分析
     ============================================================ */
  function statsView(root) {
    var st = S.state;
    var sp = S.speakingStats();
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '口语能力分析'));
    head.appendChild(h('p', null, '基于你真实的跟读记录，未练习过的维度显示为 0 而非估算值。'));
    root.appendChild(head);

    var g = h('div', 'grid g4');
    [
      { l: '跟读次数', v: sp.count, u: '次' },
      { l: '平均得分', v: Math.round(sp.avg), u: '分' },
      { l: '最佳得分', v: Math.max.apply(null, st.speaking.map(function (x) { return x.score || 0; }).concat([0])), u: '分' },
      { l: '口语时长', v: Math.round(st.speaking.reduce(function (a, x) { return a + (x.minutes || 0); }, 0)), u: '分钟' }
    ].forEach(function (s) {
      var c = h('div', 'stat accent-primary');
      c.appendChild(h('div', 'lbl', s.l));
      var v = h('div', 'val', String(s.v));
      v.appendChild(h('small', null, s.u));
      c.appendChild(v);
      g.appendChild(c);
    });
    root.appendChild(g);

    var c1 = h('div', 'card');
    c1.style.marginTop = '16px';
    c1.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '流利度变化'));
    c1.lastChild.appendChild(h('span', 'sub', '每次跟读得分'));
    var box = h('div', 'chart-box');
    c1.appendChild(box);
    var data = st.speaking.slice(-40).map(function (x, i) {
      return { name: (x.scene || '场景') + ' · ' + (x.date || ''), y: x.score };
    });
    if (data.length >= 2) {
      C.line(box, {
        height: 210, yMax: 100,
        series: [{ name: '跟读得分', data: data, color: C.PALETTE[0] }],
        xLabel: function (i) { return '#' + (i + 1); },
        yFormat: function (v) { return v; },
        tipFormat: function (v) { return v + ' 分'; },
        legend: false
      });
    } else {
      var e = h('div', 'empty-state');
      e.appendChild(h('div', 'e-ico', '🎤'));
      e.appendChild(h('div', 'e-txt', '至少完成 2 次跟读后显示曲线'));
      box.appendChild(e);
    }
    root.appendChild(c1);

    // 训练量 vs 效果
    var c2 = h('div', 'card');
    c2.style.marginTop = '16px';
    c2.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '口语提升所需训练量'));
    c2.lastChild.appendChild(h('span', 'sub', '参考研究数据，非个人预测'));
    var b2 = h('div', 'chart-box');
    c2.appendChild(b2);
    C.line(b2, {
      height: 200,
      series: [{
        name: '口语流利度（相对值）',
        data: [
          { name: '0 小时', y: 5 }, { name: '50 小时', y: 25 }, { name: '100 小时', y: 42 },
          { name: '200 小时', y: 58 }, { name: '350 小时', y: 71 }, { name: '500 小时', y: 80 },
          { name: '700 小时', y: 86 }
        ], color: C.PALETTE[2]
      }],
      xLabel: function (i) { return [0, 50, 100, 200, 350, 500, 700][i] + 'h'; },
      yFormat: function (v) { return v; },
      tipFormat: function (v) { return '流利度约 ' + v + ' / 100'; },
      legend: false
    });
    var mine = Math.round(st.speaking.reduce(function (a, x) { return a + (x.minutes || 0); }, 0) / 60 * 10) / 10;
    var n2 = h('div');
    n2.style.cssText = 'margin-top:12px;padding:12px 14px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.75';
    n2.innerHTML = '<b>你已累计口语输出 ' + mine + ' 小时。</b>参考 Fluent Forever 与刻意练习的共识：口语达到"能应付日常对话"约需 <b>200-300 小时</b>的高质量输出练习（含反馈），' +
      '"接近流利"约需 500-700 小时。<br><b>关键区别</b>：输出练习（speaking practice）的时间不能被被动输入（听力阅读）替代——' +
      '语言产出能力只在实际产出时建立。这就是为什么本站把"跟读评分"作为强制步骤，而非可选。';
    c2.appendChild(n2);
    root.appendChild(c2);

    // 按场景统计
    if (st.speaking.length) {
      var c3 = h('div', 'card');
      c3.style.marginTop = '16px';
      c3.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '各场景表现'));
      c3.lastChild.appendChild(h('span', 'sub', '找出最薄弱场景'));
      var tbl = h('table', 'tbl');
      var thead = h('thead');
      var tr = h('tr');
      ['场景', '阶段', '次数', '平均分'].forEach(function (t) { tr.appendChild(h('th', null, t)); });
      thead.appendChild(tr);
      tbl.appendChild(thead);
      var tb = h('tbody');
      var byScene = {};
      st.speaking.forEach(function (x) {
        if (!byScene[x.scene]) byScene[x.scene] = { n: 0, sum: 0, lv: x.lv };
        byScene[x.scene].n++; byScene[x.scene].sum += x.score || 0;
      });
      Object.keys(byScene).forEach(function (k) {
        var v = byScene[k];
        var row = h('tr');
        var sc = allScenes().filter(function (s) { return s.id === k; })[0];
        row.appendChild(h('td', null, sc ? sc.titleCn : k));
        var lvt = h('td');
        var tag = h('span', 'tag ' + String(v.lv || 'L1').toLowerCase(), v.lv);
        lvt.appendChild(tag);
        row.appendChild(lvt);
        row.appendChild(h('td', null, v.n));
        var avg = Math.round(v.sum / v.n);
        var at = h('td', null, avg + ' 分');
        at.style.color = avg < 70 ? 'var(--danger)' : 'var(--success)';
        at.style.fontWeight = '700';
        row.appendChild(at);
        tb.appendChild(row);
      });
      tbl.appendChild(tb);
      c3.appendChild(tbl);
      root.appendChild(c3);
    }
  }

  /* ============================================================
     D. 日常口语与俚语
     ============================================================ */
  function slangView(root) {
    var SL = global.SlangContent;
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '日常口语与俚语'));
    head.appendChild(h('p', null,
      '共 ' + SL.PHRASES.reduce(function (a, g) { return a + g.items.length; }, 0) + ' 条日常表达 · ' +
      SL.slangCount() + ' 个俚语 · ' + SL.IDIOMS.length + ' 个习语 · ' +
      SL.FAKE_ENGLISH.length + ' 个中国学生高频错误。核心是学「什么场合能用」，而不只是词义。'));
    root.appendChild(head);

    /* 语域说明 */
    var c0 = h('div', 'card');
    c0.style.background = 'linear-gradient(140deg,#fff8f0,#fff 60%)';
    var h0 = h('div', 'card-head');
    h0.appendChild(h('h3', null, '先搞懂：什么是「语域」'));
    h0.appendChild(h('span', 'sub', '这是本模块最重要的概念'));
    c0.appendChild(h0);
    var why = h('div');
    why.style.cssText = 'font-size:13.5px;line-height:1.85;color:var(--text-2)';
    why.innerHTML = SL.REGISTER_GUIDE.why + '<br><br><b style="color:var(--text)">' + SL.REGISTER_GUIDE.rule + '</b>';
    c0.appendChild(why);

    // 语域阶梯
    var ladder = h('div');
    ladder.style.marginTop = '14px';
    ladder.style.cssText = 'display:grid;gap:8px;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))';
    Object.keys(SL.R).forEach(function (k) {
      var r = SL.R[k];
      var it = h('div');
      it.style.cssText = 'padding:11px 13px;border-radius:10px;border:1px solid ' + r.color + '44;background:' + r.color + '0d';
      var t = h('div');
      t.innerHTML = '<b style="color:' + r.color + ';font-size:14px">' + k + ' ' + r.label + '</b>';
      it.appendChild(t);
      var d = h('div', null, r.desc);
      d.style.cssText = 'font-size:11.5px;color:var(--text-3);margin-top:3px;line-height:1.55';
      it.appendChild(d);
      ladder.appendChild(it);
    });
    c0.appendChild(ladder);
    var lg = h('div');
    lg.style.cssText = 'margin-top:12px;padding:11px 13px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.8';
    lg.innerHTML = '<b>学习顺序</b>：' + SL.REGISTER_GUIDE.ladder;
    c0.appendChild(lg);
    root.appendChild(c0);

    var seg = h('div', 'segment');
    seg.id = 'slangTabs';
    seg.style.cssText = 'margin:18px 0 16px';
    var curSlang = 'phrase';
    [['phrase', '日常表达'], ['slang', '俚语'], ['idiom', '习语'], ['register', '语域速查'], ['fake', '避坑指南']]
      .forEach(function (t) {
        var b = h('button', t[0] === curSlang ? 'on' : null, t[1]);
        b.dataset.s = t[0];
        b.onclick = function () {
          curSlang = t[0];
          $$('#slangTabs button').forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          renderSlangBody();
        };
        seg.appendChild(b);
      });
    root.appendChild(seg);
    var bodyBox = h('div');
    bodyBox.id = 'slangBody';
    root.appendChild(bodyBox);

    function renderSlangBody() {
      bodyBox.innerHTML = '';
      if (curSlang === 'phrase') bodyBox.appendChild(phraseSection());
      else if (curSlang === 'slang') bodyBox.appendChild(slangSection());
      else if (curSlang === 'idiom') bodyBox.appendChild(idiomSection());
      else if (curSlang === 'register') bodyBox.appendChild(registerSection());
      else bodyBox.appendChild(fakeSection());
    }
    renderSlangBody();

    function phraseSection() {
      var wrap = h('div');
      SL.PHRASES.forEach(function (g) {
        var card = h('div', 'card');
        var ch = h('div', 'card-head');
        ch.appendChild(h('h3', null, g.cat));
        ch.appendChild(h('span', 'sub', g.items.length + ' 条'));
        card.appendChild(ch);
        g.items.forEach(function (x) { card.appendChild(phraseRow(x)); });
        wrap.appendChild(card);
      });
      return wrap;
    }

    function phraseRow(x) {
      var row = h('div');
      row.style.cssText = 'padding:11px 0;border-bottom:1px solid var(--surface-2)';
      var top = h('div');
      top.style.cssText = 'display:flex;align-items:flex-start;gap:9px;flex-wrap:wrap';
      var sp = h('button', 'mini-btn', '🔊');
      sp.style.cssText = 'flex-shrink:0;width:26px;text-align:center';
      sp.onclick = function () { ui.tts.speak(x.en); };
      top.appendChild(sp);
      var en = h('div', null, x.en);
      en.style.cssText = 'font-size:15px;font-weight:600;letter-spacing:-.01em;flex:1;min-width:180px;cursor:pointer';
      en.onclick = function () { ui.tts.speak(x.en); };
      en.title = '点击朗读';
      top.appendChild(en);
      top.appendChild(rTag(x.r));
      row.appendChild(top);
      var cn = h('div', null, x.cn);
      cn.style.cssText = 'font-size:13.5px;color:var(--text-2);margin-top:2px';
      row.appendChild(cn);
      if (x.note) {
        var nt = h('div', null, x.note);
        nt.style.cssText = 'font-size:12px;color:var(--text-3);margin-top:3px;line-height:1.65';
        row.appendChild(nt);
      }
      return row;
    }

    function rTag(r) {
      var cfg = SL.R[r] || SL.R.R2;
      var t = h('span', 'tag', r + ' ' + cfg.label);
      t.style.cssText = 'background:' + cfg.color + '18;color:' + cfg.color + ';flex-shrink:0';
      t.title = cfg.desc;
      return t;
    }

    function slangSection() {
      var wrap = h('div');
      SL.SLANG.forEach(function (g) {
        var card = h('div', 'card');
        var ch = h('div', 'card-head');
        ch.appendChild(h('h3', null, g.cat));
        ch.appendChild(h('span', 'sub', g.items.length + ' 个'));
        card.appendChild(ch);
        var grid = h('div', 'grid g2');
        g.items.forEach(function (x) {
          var it = h('div');
          it.style.cssText = 'padding:12px;border:1px solid var(--border);border-radius:10px';
          var top = h('div');
          top.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px';
          var sp = h('button', 'mini-btn', '🔊');
          sp.style.cssText = 'flex-shrink:0';
          sp.onclick = function () { ui.tts.speak(x.w); };
          top.appendChild(sp);
          var w = h('b', null, x.w);
          w.style.cssText = 'font-size:16px;letter-spacing:-.01em';
          top.appendChild(w);
          top.appendChild(rTag(x.r));
          it.appendChild(top);
          var cn = h('div', null, x.cn);
          cn.style.cssText = 'font-size:13.5px;color:var(--text-2)';
          it.appendChild(cn);
          if (x.formal) {
            var f = h('div');
            f.style.cssText = 'font-size:12px;margin-top:4px;color:#14684a';
            f.innerHTML = '正式场合用：<b>' + x.formal + '</b>';
            it.appendChild(f);
          }
          if (x.ex) {
            var ex = h('div', null, '“' + x.ex + '”');
            ex.style.cssText = 'font-size:12.5px;color:var(--primary-dark);font-style:italic;margin-top:4px;cursor:pointer';
            ex.onclick = function () { ui.tts.speak(x.ex); };
            it.appendChild(ex);
          }
          if (x.tip) {
            var tp = h('div', null, x.tip);
            tp.style.cssText = 'font-size:11.5px;color:var(--text-3);margin-top:4px;line-height:1.6';
            it.appendChild(tp);
          }
          grid.appendChild(it);
        });
        card.appendChild(grid);
        wrap.appendChild(card);
      });
      return wrap;
    }

    function idiomSection() {
      var card = h('div', 'card');
      var ch = h('div', 'card-head');
      ch.appendChild(h('h3', null, '英语习语'));
      ch.appendChild(h('span', 'sub', SL.IDIOMS.length + ' 个 · 母语者日常高频'));
      card.appendChild(ch);
      var note = h('div');
      note.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.8;background:var(--surface-2);padding:11px 13px;border-radius:9px;margin-bottom:6px';
      note.innerHTML = '<b>习语为什么重要？</b>母语者日常对话中约 <b>15% 的词来自习语</b>。' +
        '听不懂 "piece of cake" 就像中文母语者听"这事儿小菜一碟"却不知道在说什么。' +
        '每条都给了<b>字面来源</b>——记住故事比死记意思有效得多。';
      card.appendChild(note);
      var grid = h('div', 'grid g2');
      SL.IDIOMS.forEach(function (x) {
        var it = h('div');
        it.style.cssText = 'padding:12px;border:1px solid var(--border);border-radius:10px';
        var top = h('div');
        top.style.cssText = 'display:flex;align-items:center;gap:8px';
        var sp = h('button', 'mini-btn', '🔊');
        sp.style.flexShrink = '0';
        sp.onclick = function () { ui.tts.speak(x.ex); };
        top.appendChild(sp);
        var e = h('b', null, x.en);
        e.style.cssText = 'font-size:15.5px;letter-spacing:-.01em';
        top.appendChild(e);
        it.appendChild(top);
        var cn = h('div', null, x.cn);
        cn.style.cssText = 'font-size:13.5px;color:var(--text-2);margin-top:2px';
        it.appendChild(cn);
        var st = h('div', null, '📖 ' + x.story);
        st.style.cssText = 'font-size:11.5px;color:var(--text-3);margin-top:4px;line-height:1.6';
        it.appendChild(st);
        var ex = h('div', null, '“' + x.ex + '”');
        ex.style.cssText = 'font-size:12.5px;color:var(--primary-dark);font-style:italic;margin-top:5px;cursor:pointer';
        ex.onclick = function () { ui.tts.speak(x.ex); };
        it.appendChild(ex);
        grid.appendChild(it);
      });
      card.appendChild(grid);
      return card;
    }

    function registerSection() {
      var card = h('div', 'card');
      var ch = h('div', 'card-head');
      ch.appendChild(h('h3', null, '语域速查表'));
      ch.appendChild(h('span', 'sub', '同一个意思的 4 种说法'));
      card.appendChild(ch);
      var note = h('div');
      note.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.8;background:var(--surface-2);padding:11px 13px;border-radius:9px;margin-bottom:12px';
      note.innerHTML = '<b>怎么用这张表？</b>说之前先想：对方是谁、什么场合。' +
        '面试说 excellent，朋友聚会说 awesome，同事群里说 fire。' +
        '用高一级正式词不会出错，用低一级俚语才会出错。';
      card.appendChild(note);
      var tbl = h('table', 'tbl');
      var thead = h('thead');
      var tr = h('tr');
      ['意思', 'R1 正式', 'R2 中性', 'R3 随意', 'R4 俚语', '备注'].forEach(function (t) {
        tr.appendChild(h('th', null, t));
      });
      thead.appendChild(tr);
      tbl.appendChild(thead);
      var tb = h('tbody');
      SL.REGISTER_TABLE.forEach(function (r) {
        var row = h('tr');
        row.appendChild(h('td', null, r.meaning));
        row.firstChild.style.fontWeight = '700';
        [r.R1, r.R2, r.R3, r.R4].forEach(function (v, i) {
          var td = h('td', null, v);
          td.style.fontSize = '12.5px';
          td.style.color = ['#4f7cff', '#22b07d', '#f0a020', '#e2585f'][i];
          row.appendChild(td);
        });
        var nt = h('td', null, r.note || '');
        nt.style.cssText = 'font-size:11.5px;color:var(--text-3);max-width:200px';
        row.appendChild(nt);
        tb.appendChild(row);
      });
      tbl.appendChild(tb);
      card.appendChild(tbl);
      return card;
    }

    function fakeSection() {
      var card = h('div', 'card');
      var ch = h('div', 'card-head');
      ch.appendChild(h('h3', null, '中国学生高频错误避坑'));
      ch.appendChild(h('span', 'sub', SL.FAKE_ENGLISH.length + ' 个 · 含「假英语」'));
      card.appendChild(ch);
      var note = h('div');
      note.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.85;background:var(--danger-soft);padding:12px 14px;border-radius:9px;margin-bottom:14px;color:#a83238';
      note.innerHTML = '<b>为什么会有「假英语」？</b>多数是把中文的语法结构直译成英文。' +
        '中文是「虽然…但是」「我很喜欢」，英语的连接词和副词位置完全不同。' +
        '这些错误中国人自己听得懂，但母语者一听就知道是"照着语法规则拼出来的"，' +
        '这比语法错误更影响听力理解——<b>母语者会在心里停顿、重新解析，而不是自动理解</b>。';
      card.appendChild(note);
      SL.FAKE_ENGLISH.forEach(function (x) {
        var row = h('div');
        row.style.cssText = 'padding:12px 0;border-bottom:1px solid var(--surface-2)';
        var w = h('div');
        w.style.cssText = 'font-size:14.5px;color:#a83238;text-decoration:line-through;text-decoration-color:#e8a0a4';
        w.textContent = '✗ ' + x.wrong;
        row.appendChild(w);
        var r = h('div', null, '✓ ' + x.right);
        r.style.cssText = 'font-size:14.5px;color:#14684a;font-weight:600;margin-top:3px';
        row.appendChild(r);
        var why = h('div', null, x.why);
        why.style.cssText = 'font-size:12.5px;color:var(--text-2);margin-top:4px;line-height:1.7;background:var(--surface-2);padding:8px 11px;border-radius:8px';
        row.appendChild(why);
        var sp = h('button', 'mini-btn', '🔊 朗读正确说法');
        sp.style.marginTop = '6px';
        sp.onclick = function () { ui.tts.speak(x.right.replace(/^[✓]\s*/, '')); };
        row.appendChild(sp);
        card.appendChild(row);
      });
      return card;
    }
  }

  /* 组装 */
  var TABS = [
    { id: 'scene', label: '场景对话', fn: sceneView, desc: '按场景练习，每个句子都标注发音要点' },
    { id: 'slang', label: '日常口语与俚语', fn: slangView, desc: '日常表达、俚语、习语与语域规则' },
    { id: 'sound', label: '发音训练', fn: phoneticsView, desc: '易错音标、连读规则、重音训练' },
    { id: 'stats', label: '流利度分析', fn: statsView, desc: '基于真实记录的进步曲线' }
  ];
  var curTab = 'scene';
  function renderSpeak() {
    var box = document.getElementById('speakBody');
    if (!box) return;
    box.innerHTML = '';
    var t = TABS.find(function (x) { return x.id === curTab; }) || TABS[0];
    t.fn(box);
  }
  function switchTab(id) {
    $$('#speakTabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.t === id); });
    var d = document.getElementById('speakDesc');
    var t = TABS.find(function (x) { return x.id === id; });
    if (d && t) d.textContent = t.desc;
    renderSpeak();
  }

  V.speak = function (root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '口语模块'));
    var sub = h('p');
    sub.id = 'speakDesc';
    sub.textContent = TABS[0].desc;
    head.appendChild(sub);
    root.appendChild(head);
    var seg = h('div', 'segment');
    seg.id = 'speakTabs';
    seg.style.marginBottom = '16px';
    TABS.forEach(function (t) {
      var b = h('button', t.id === curTab ? 'on' : null, t.label);
      b.dataset.t = t.id;
      b.onclick = function () { curTab = t.id; switchTab(t.id); };
      seg.appendChild(b);
    });
    root.appendChild(seg);
    var body = h('div');
    body.id = 'speakBody';
    root.appendChild(body);
    renderSpeak();
  };
})(window);