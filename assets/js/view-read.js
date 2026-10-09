/* ============================================================
   view-read.js —— 阅读模块
   分级短文 + 逐句点读 + 生词标记 + 理解题 + 阅读能力模型
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, C = global.Charts, RC = global.ReadingContent;
  var ui = global.ui, h = ui.h;

  /* ============================================================
     A. 阅读器
     ============================================================ */
  function readerView(root) {
    var lv = ui.currentLevel();
    var articles = RC.byLevel(lv);
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '分级阅读'));
    head.appendChild(h('p', null, '短文难度与词汇模块共用同一套 L1-L4 分级。橙点标记的是你词库里还没有的词——点击可查释义。'));
    root.appendChild(head);

    if (!articles.length) { root.appendChild(emptyBox('该阶段暂无短文')); return; }

    // 选择
    var sel = h('div', 'card');
    var seg = h('div', 'segment');
    seg.id = 'lvSeg';
    ['L1', 'L2', 'L3', 'L4'].forEach(function (id) {
      var b = h('button', id === lv ? 'on' : null, id + ' ' + global.PathContent.levelById(id).name);
      b.onclick = function () {
        if (!S.state.unlocked[id]) { ui.toast('完成上一阶段后解锁 ' + id); return; }
        curLv = id; ui.$('#readBody').innerHTML = ''; renderList();
        $$('.segment button', seg).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      };
      seg.appendChild(b);
    });
    sel.appendChild(seg);
    root.appendChild(sel);

    var body = h('div');
    body.id = 'readBody';
    body.style.marginTop = '16px';
    root.appendChild(body);
    var curLv = lv;

    function renderList() {
      var arts = RC.byLevel(curLv);
      var grid = h('div', 'grid g2');
      arts.forEach(function (a) {
        var card = h('div', 'card');
        card.style.cursor = 'pointer';
        card.onclick = function () { openArticle(a); };
        var top = h('div');
        top.style.cssText = 'display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px';
        var l = h('div');
        l.appendChild(h('h3', null, a.titleCn));
        l.lastChild.style.cssText = 'font-size:16px;margin:0';
        var en = h('div', null, a.title);
        en.style.cssText = 'font-size:12.5px;color:var(--text-3);margin-top:1px';
        l.appendChild(en);
        top.appendChild(l);
        top.appendChild(h('span', 'tag ' + a.lv.toLowerCase(), a.lv));
        card.appendChild(top);
        var meta = h('div');
        meta.style.cssText = 'display:flex;gap:12px;font-size:12px;color:var(--text-3);flex-wrap:wrap';
        meta.innerHTML = '<span>📖 ' + a.words + ' 词</span><span>⏱ ' + a.minutes + ' 分钟</span>' +
          '<span>❓ ' + a.questions.length + ' 题</span><span>' + a.topic + '</span>';
        card.appendChild(meta);

        var st = S.state.reading[a.id];
        var prog = h('div');
        prog.style.marginTop = '10px';
        var bar = h('div', 'bar sm');
        var fi = h('i');
        var pct = st ? Math.round(st.best * 100) : 0;
        fi.style.width = pct + '%';
        fi.style.background = pct >= 75 ? 'var(--success)' : 'var(--primary)';
        bar.appendChild(fi);
        prog.appendChild(bar);
        var t = h('div', null, st ? '最佳正确率 ' + pct + '% · 已完成 ' + st.done + ' 次' : '未阅读');
        t.style.cssText = 'font-size:11.5px;color:var(--text-3);margin-top:4px';
        prog.appendChild(t);
        card.appendChild(prog);
        grid.appendChild(card);
      });
      body.appendChild(grid);
    }
    renderList();

    /* ---------- 文章阅读器 ---------- */
    function openArticle(a) {
      var pool = global.VOCAB_DATA.words.filter(function (w) { return ['L1', 'L2', 'L3'].indexOf(w.lv) <= ['L1', 'L2', 'L3'].indexOf(a.lv); });
      var mask = h('div', 'sheet-mask');
      mask.style.alignItems = 'flex-start';
      mask.style.padding = '0';
      var sheet = h('div', 'sheet');
      sheet.style.maxWidth = '820px';
      sheet.style.maxHeight = '100vh';
      sheet.style.height = '100vh';
      sheet.style.borderRadius = '0';
      sheet.style.padding = '0';

      // 顶栏
      var bar = h('div');
      bar.style.cssText = 'position:sticky;top:0;background:var(--surface);border-bottom:1px solid var(--border);padding:13px 22px;display:flex;align-items:center;justify-content:space-between;gap:12px;z-index:10';
      var left = h('div');
      left.appendChild(h('b', null, a.titleCn));
      left.lastChild.style.fontSize = '15px';
      var sub = h('div', null, a.title + ' · ' + a.words + ' 词 · ' + a.minutes + ' 分钟');
      sub.style.cssText = 'font-size:11.5px;color:var(--text-3)';
      left.appendChild(sub);
      bar.appendChild(left);
      var btns = h('div');
      btns.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap';
      var markBtn = h('button', 'mini-btn', '✏️ 标记生词模式');
      markBtn.onclick = function () {
        markMode = !markMode;
        markBtn.textContent = markMode ? '✓ 生词标记中' : '✏️ 标记生词模式';
        markBtn.classList.toggle('rec', markMode);
        ui.toast(markMode ? '点击文中单词可标记为生词' : '已退出标记模式');
      };
      btns.appendChild(markBtn);
      var fullBtn = h('button', 'mini-btn', '📄 英译模式');
      fullBtn.onclick = function () {
        hideCn = !hideCn;
        fullBtn.textContent = hideCn ? '📄 显示对照' : '📄 英译模式';
        ui.$('#cnBox', sheet).style.display = hideCn ? 'none' : 'block';
      };
      btns.appendChild(fullBtn);
      var closeBtn = h('button', 'mini-btn', '✕');
      closeBtn.onclick = function () { mask.remove(); };
      btns.appendChild(closeBtn);
      bar.appendChild(btns);
      sheet.appendChild(bar);

      var content = h('div');
      content.style.padding = '26px 30px 60px';
      var art = h('div', 'article');
      art.appendChild(h('h2', null, a.title));
      art.appendChild(h('div', 'meta', a.topic + ' · ' + a.words + ' words · 难度 ' + a.level));

      // 正文（逐句 + 单词可点）
      var paras = a.text.split('\n\n');
      var markMode = false, hideCn = false;
      paras.forEach(function (p, pi) {
        var wrap = h('div', 'para');
        wrap.appendChild(h('span', 'para-no', 'P' + (pi + 1)));
        // 把句子拆开
        var sentences = p.match(/[^.!?]+[.!?]*/g) || [p];
        sentences.forEach(function (s) {
          var sp = h('span');
          sp.style.cursor = 'pointer';
          // 拆词
          s.split(/(\s+)/).forEach(function (tok) {
            if (!tok.trim()) { sp.appendChild(document.createTextNode(tok)); return; }
            var bare = tok.replace(/[^A-Za-z']/g, '');
            var w = global.VocabContent.findWord(bare);
            var marks = (S.state.marks && S.state.marks[bare.toLowerCase()]);
            var cls = 'w' + (marks ? ' unknown' : (w ? ' known' : ''));
            var ts = h('span', cls, tok);
            if (w && S.state.words[w.id]) ts.style.color = '';
            sp.appendChild(ts);
            ts.onclick = function (e) {
              e.stopPropagation();
              if (markMode) {
                S.state.marks = S.state.marks || {};
                if (S.state.marks[bare.toLowerCase()]) delete S.state.marks[bare.toLowerCase()];
                else S.state.marks[bare.toLowerCase()] = { date: S.today(), article: a.id };
                S.save();
                ts.classList.toggle('unknown', !!S.state.marks[bare.toLowerCase()]);
                return;
              }
              showWordPopup(bare, ts);
            };
          });
          sp.onclick = function () { ui.tts.speak(s); };
          wrap.appendChild(sp);
          wrap.appendChild(document.createTextNode(' '));
        });
        art.appendChild(wrap);
      });
      content.appendChild(art);

      // 中文对照
      var cnBox = h('div');
      cnBox.id = 'cnBox';
      cnBox.style.cssText = 'margin-top:16px;padding:16px 18px;background:var(--surface-2);border-radius:11px;font-size:13.5px;line-height:1.85;color:var(--text-2)';
      cnBox.innerHTML = '<b>中文对照</b>：' + a.titleCn + '（本篇无逐句译文，' +
        '建议先独立理解，做完题后再看提示。中文对照仅显示标题与导读。）';
      content.appendChild(cnBox);

      // 词汇覆盖检测
      var cov = RC.coverage(a.text, pool);
      var covBox = h('div');
      covBox.style.cssText = 'margin-top:14px;padding:13px 15px;border-radius:10px;font-size:12.5px;line-height:1.7';
      var okCov = cov >= .82;
      covBox.style.background = okCov ? 'var(--success-soft)' : 'var(--warn-soft)';
      covBox.style.color = okCov ? '#14684a' : '#8a6a1a';
      covBox.innerHTML = '<b>词汇覆盖率检测</b>：本篇 ' + Math.round(cov * 100) + '% 的词汇已在 ≤' + a.lv +
        ' 词表内。' + (okCov
          ? '符合 Krashen 输入假说的 i+1 区间（建议 85% 以上可解），难度设置合理。'
          : '覆盖率偏低，可能超出当前水平。建议先巩固词汇再读，或改读低一级短文。');
      content.appendChild(covBox);

      // 题目
      var qCard = h('div', 'card');
      qCard.style.marginTop = '20px';
      var qh = h('div', 'card-head');
      qh.appendChild(h('h3', null, '理解题（' + a.questions.length + ' 题）'));
      qh.appendChild(h('span', 'sub', '含细节 / 推理 / 主旨 / 词义 / 态度'));
      qCard.appendChild(qh);
      content.appendChild(qCard);

      var answered = 0, rightCount = 0;
      var readStart = Date.now();     // 阅读计时起点，用于记录答题用时
      a.questions.forEach(function (q, qi) {
        var qb = h('div');
        qb.style.cssText = 'padding:14px 0;border-bottom:1px solid var(--surface-2)';
        var qt = h('div');
        qt.style.cssText = 'display:flex;gap:9px;align-items:flex-start;margin-bottom:9px';
        var num = h('span', 'tag grey', (qi + 1) + '. ' + q.type);
        num.style.flexShrink = '0';
        qt.appendChild(num);
        qt.appendChild(h('span', null, q.q));
        qt.lastChild.style.cssText = 'font-size:14.5px;font-weight:500;line-height:1.6';
        qb.appendChild(qt);

        var opts = h('div', 'opts');
        var done = false;
        q.options.forEach(function (o, oi) {
          var b = h('button', 'opt');
          b.appendChild(h('div', 'k', 'ABCD'[oi]));
          b.appendChild(h('div', null, o.text));
          b.onclick = function () {
            if (done) return;
            done = true; answered++;
            var ok = oi === q.answer;
            if (ok) rightCount++;
            $$('.opt', opts).forEach(function (x) { x.classList.add('locked'); });
            b.classList.add(ok ? 'ok' : 'no');
            if (!ok) $$('.opt', opts)[q.answer].classList.add('ok');
            S.recordAnswer(ok);
            // 自动写入进度记忆：逐题对错 + 题型弱项统计
            if (global.Progress) {
              global.Progress.recordReading(a.id, qi, ok, Date.now() - readStart);
              if (!ok && q.type) global.Progress.recordQuestionType(q.type);
            }
            var fb = h('div', 'feedback ' + (ok ? 'ok' : 'no'));
            fb.innerHTML = (ok ? '✓ 正确。' : '✗ 正确答案：' + 'ABCD'[q.answer] + '.') + '<br>' + q.why;
            qb.appendChild(fb);
            if (answered === a.questions.length) finish();
          };
          opts.appendChild(b);
        });
        qb.appendChild(opts);
        qCard.appendChild(qb);
      });

      function finish() {
        var pct = Math.round(rightCount / a.questions.length * 100);
        var fb = h('div', 'feedback info');
        fb.style.marginTop = '14px';
        fb.innerHTML = '<b>本篇完成：' + rightCount + '/' + a.questions.length + '（' + pct + '%）</b><br>' +
          (pct >= 80 ? '理解良好。可以进入同阶段下一篇，或升级到 ' + (global.PathContent.nextLevel(a.lv) ? global.PathContent.nextLevel(a.lv).name : '下一阶段') + '。'
            : pct >= 60 ? '基本理解。建议重读一遍，重点看错题的解析——推理题错得多说明跳读过多。'
              : '建议降一级阅读。<b>阅读理解是词汇的检验</b>：读不懂通常不是理解力问题，而是词不认识。');
        qCard.appendChild(fb);
        S.addReading(a.id, rightCount, a.questions.length, a.minutes);
        if (global.Progress) {
          global.Progress.recordSession('read', Math.min(40, a.minutes || 8), a.id);
        }
        var got = S.checkBadges();
        got.forEach(function (bd, i) { setTimeout(function () { ui.toast(bd.icon + ' ' + bd.name, 3000); }, 400 + i * 500); });
        ui.maybeSurprise(0.3);
        renderList();
      }

      sheet.appendChild(content);
      mask.appendChild(sheet);
      mask.onclick = function (e) { if (e.target === mask) mask.remove(); };
      document.body.appendChild(mask);
    }

    function showWordPopup(word, anchor) {
      document.querySelectorAll('.word-pop').forEach(function (n) { n.remove(); });
      var w = global.VocabContent.findWord(word);
      var pop = h('div', 'word-pop');
      pop.style.cssText = 'position:absolute;z-index:3000;background:#1f2430;color:#fff;padding:11px 14px;border-radius:10px;' +
        'font-size:13px;box-shadow:0 8px 28px rgba(0,0,0,.28);max-width:270px;line-height:1.65';
      var r = anchor.getBoundingClientRect();
      document.body.appendChild(pop);
      var pw = pop.offsetWidth, ph = pop.offsetHeight;
      pop.style.left = Math.max(8, Math.min(window.innerWidth - pw - 8, r.left + r.width / 2 - pw / 2)) + 'px';
      pop.style.top = (r.top - ph - 8 < 8 ? r.bottom + 8 : r.top - ph - 8) + 'px';
      var card = w ? S.getCard(w.id) : null;
      pop.innerHTML = '<b style="font-size:15px">' + word + '</b>' +
        (w ? ' <span style="opacity:.6;font-size:11px">' + (w.lv || '') + '</span>' : '') +
        (w ? '<div style="margin-top:4px">' + w.cn + (w.p ? ' <span style="opacity:.55;font-size:11px">' + global.VocabView.posCn(w.p) + '</span>' : '') + '</div>' : '<div style="opacity:.6;margin-top:4px">不在词库中</div>') +
        (w && w.ex ? '<div style="opacity:.65;font-size:11.5px;margin-top:4px">' + w.ex + '</div>' : '') +
        (card ? '<div style="opacity:.6;font-size:11px;margin-top:5px">已学 · 间隔 ' + card.ivl + ' 天</div>' : '') +
        '<div style="margin-top:8px"><button id="wp_spk" style="background:#4f7cff;color:#fff;border:none;padding:4px 11px;border-radius:6px;font-size:11.5px;cursor:pointer">🔊 朗读</button></div>';
      document.getElementById('wp_spk').onclick = function () { ui.tts.speak(word); };
      setTimeout(function () {
        document.addEventListener('click', function h2(e) {
          if (!pop.contains(e.target)) { pop.remove(); document.removeEventListener('click', h2); }
        });
      }, 10);
    }
  }

  function emptyBox(txt) {
    var e = h('div', 'card');
    var es = h('div', 'empty-state');
    es.appendChild(h('div', 'e-txt', txt));
    e.appendChild(es);
    return e;
  }

  /* ============================================================
     B. 阅读能力模型
     ============================================================ */
  function modelView(root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '阅读能力模型'));
    head.appendChild(h('p', null, '词汇量是阅读速度的地基，但理解力还取决于是否强制提取。下图对照了"你的实际表现"与"公开研究中的模型曲线"。'));
    root.appendChild(head);

    var v = S.vocabStats();
    var readRecs = S.state.reading;
    var readDone = Object.keys(readRecs).length;
    var readAvg = readDone ? Object.keys(readRecs).reduce(function (a, k) { return a + readRecs[k].best; }, 0) / readDone : 0;

    var g = h('div', 'grid g4');
    [
      { l: '已读短文', v: readDone, u: '篇' },
      { l: '平均正确率', v: Math.round(readAvg * 100), u: '%' },
      { l: '主动词汇量', v: v.seenTotal, u: '词' },
      { l: '当前阅读等级', v: ui.currentLevel(), u: '' }
    ].forEach(function (s) {
      var c = h('div', 'stat accent-success');
      c.appendChild(h('div', 'lbl', s.l));
      var vv = h('div', 'val', String(s.v));
      if (s.u) vv.appendChild(h('small', null, s.u));
      c.appendChild(vv);
      g.appendChild(c);
    });
    root.appendChild(g);

    // 词汇量 vs 阅读能力
    var c1 = h('div', 'card');
    c1.style.marginTop = '16px';
    c1.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '词汇量 → 阅读速度与理解力'));
    c1.lastChild.appendChild(h('span', 'sub', '模型数据（Nation 词汇量假说框架）'));
    var b1 = h('div', 'chart-box');
    c1.appendChild(b1);
    var P = RC.READING_POWER;
    C.line(b1, {
      height: 250,
      series: [
        { name: '阅读速度 WPM', data: P.map(function (p) { return { name: p.vocab + '词', y: p.speed }; }), color: C.PALETTE[0] },
        { name: '理解力 %', data: P.map(function (p) { return { name: p.vocab + '词', y: p.comprehension }; }), color: C.PALETTE[1], fill: false },
        { name: '你当前水平', data: [{ name: '你', y: null }], color: C.PALETTE[3], fill: false }
      ],
      xLabel: function (i) { return P[i].vocab; },
      yFormat: function (val) { return val; },
      tipFormat: function (val) { return val; },
      legend: true
    });
    var note = h('div');
    note.style.cssText = 'margin-top:12px;padding:12px 14px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.8';
    note.innerHTML = '<b>关键关系</b>：词汇量每翻一倍，阅读速度提升约 <b>10-15%</b>（阅读的"解码能力"也随之提升，因为不再需要逐词拼读）。' +
      '但理解力的增长<b>慢于</b>速度——因为理解还依赖句法分析、推理与背景知识。<br>' +
      '<b>这解释了为什么"看得懂但读得慢"</b>：词汇是速度的地基，语法结构决定理解的上限。<br>' +
      '你现在 <b>' + v.seenTotal + ' 词</b>，模型对应的阅读速度约 <b>' +
      (P.reduce(function (best, p) { return v.seenTotal >= p.vocab ? p : best; }, P[0]).speed) + ' WPM</b>。' +
      '注意这是"能读懂"的模型值，不是你的实测值——完成上面 3 篇文章的自测题才是真实反馈。';
    c1.appendChild(note);
    root.appendChild(c1);

    // 阅读 vs 提取
    var c2 = h('div', 'card');
    c2.style.marginTop = '16px';
    c2.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '为什么"读完就忘"：熟悉感 ≠ 理解'));
    c2.lastChild.appendChild(h('span', 'sub', '提取练习 vs 重复阅读'));
    var b2 = h('div', 'chart-box');
    c2.appendChild(b2);
    var ret = global.VocabContent.SCIENCE.retrieval;
    C.bar(b2, {
      height: 210,
      data: ret.map(function (r, i) { return { label: r.label, value: r.extract, color: C.PALETTE[1], tip: '提取练习 ' + r.extract + '%' }; })
        .concat(ret.map(function (r, i) { return { label: '', value: r.reread, color: C.PALETTE[3], tip: '重复阅读 ' + r.reread + '%' }; })),
      yMax: 100,
      unit: '%'
    });
    var n2 = h('div');
    n2.style.cssText = 'margin-top:12px;padding:12px 14px;background:var(--warn-soft);border-radius:9px;font-size:12.5px;color:#8a6a1a;line-height:1.8';
    n2.innerHTML = '<b>所以本站每篇短文都强制配理解题</b>。只读不答，阅读只会带来"我看过了"的错觉（fluency），' +
      '一周后正确率停在 40%。做完题再读，正确率可达 80%——<b>测试本身就是学习</b>。';
    c2.appendChild(n2);
    root.appendChild(c2);

    // 分级说明
    var c3 = h('div', 'card');
    c3.style.marginTop = '16px';
    c3.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '分级标准'));
    c3.lastChild.appendChild(h('span', 'sub', '四模块共用同一套等级'));
    var tbl = h('table', 'tbl');
    var th = h('thead');
    var tr = h('tr');
    ['等级', '文章数', '词数区间', '句子结构', '目标能力'].forEach(function (t) { tr.appendChild(h('th', null, t)); });
    th.appendChild(tr);
    tbl.appendChild(th);
    var tb = h('tbody');
    var desc = {
      L1: ['96-104', '极简单句为主，几乎无从句', '看懂生活类短文'],
      L2: ['198-226', '简单复合句，常见连词', '看懂邮件与短新闻'],
      L3: ['296-318', '复杂句+抽象名词化表达', '看懂论述与专业文章'],
      L4: ['386-412', '长难句、多层嵌套与学术词汇', '读原版书籍与论文']
    };
    ['L1', 'L2', 'L3', 'L4'].forEach(function (id) {
      var arts = RC.byLevel(id);
      var row = h('tr');
      var c0 = h('td');
      var tg = h('span', 'tag ' + id.toLowerCase(), id + ' ' + global.PathContent.levelById(id).name);
      c0.appendChild(tg);
      row.appendChild(c0);
      row.appendChild(h('td', null, arts.length + ' 篇'));
      row.appendChild(h('td', null, desc[id][0]));
      row.appendChild(h('td', null, desc[id][1]));
      row.appendChild(h('td', null, desc[id][2]));
      tb.appendChild(row);
    });
    tbl.appendChild(tb);
    c3.appendChild(tbl);
    root.appendChild(c3);
  }

  /* 组装 */
  var TABS = [
    { id: 'read', label: '短文阅读', fn: readerView, desc: '分级短文，点词查义，配理解题' },
    { id: 'model', label: '能力模型', fn: modelView, desc: '词汇量与阅读能力的关系曲线' }
  ];
  var curTab = 'read';
  function renderRead() {
    var box = document.getElementById('readBody2');
    if (!box) return;
    box.innerHTML = '';
    var t = TABS.find(function (x) { return x.id === curTab; }) || TABS[0];
    t.fn(box);
  }
  function switchTab(id) {
    $$('#readTabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.t === id); });
    var d = document.getElementById('readDesc');
    var t = TABS.find(function (x) { return x.id === id; });
    if (d && t) d.textContent = t.desc;
    renderRead();
  }

  V.read = function (root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '阅读模块'));
    var sub = h('p');
    sub.id = 'readDesc';
    sub.textContent = TABS[0].desc;
    head.appendChild(sub);
    root.appendChild(head);
    var seg = h('div', 'segment');
    seg.id = 'readTabs';
    seg.style.marginBottom = '16px';
    TABS.forEach(function (t) {
      var b = h('button', t.id === curTab ? 'on' : null, t.label);
      b.dataset.t = t.id;
      b.onclick = function () { curTab = t.id; switchTab(t.id); };
      seg.appendChild(b);
    });
    root.appendChild(seg);
    var body = h('div');
    body.id = 'readBody2';
    root.appendChild(body);
    renderRead();
  };
})(window);