/* ============================================================
   view-daily-comm.js —— 日常交流沟通学习视图
   2000+ 条按沟通功能分类的表达库
   特点：不走孤立记忆，而是「场景演练」——按功能分组，选一组开始对话演练
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, C = global.Charts;
  var ui = global.ui, h = ui.h;

  function allData() { return global.ContentIndex.dailyComm(); }
  function cats() { return global.ContentIndex.dailyCommCats(); }
  function rowsOf(catId) { return global.ContentIndex.dailyCommByCat(catId); }
  var RCOLOR = { R1: '#4f7cff', R2: '#22b07d', R3: '#f0a020', R4: '#e2585f' };

  V.dailycomm = function (root) {
    var all = allData(), cl = cats();
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '日常交流 2000'));
    head.appendChild(h('p', null, cl.length + ' 类沟通功能 · ' + all.length + ' 条可直接开口的表达。' +
      '这些是「按功能组织的完整话轮」——不是单词，而是你在真实对话中会说的整句。'));
    root.appendChild(head);

    var tab = h('div', 'segment');
    tab.id = 'dcTabs';
    tab.style.marginBottom = '16px';
    var cur = 'browse';
    [['browse', '分类浏览'], ['drill', '场景演练'], ['random', '随机抽句']].forEach(function (t) {
      var b = h('button', t[0] === cur ? 'on' : null, t[1]);
      b.dataset.dc = t[0];
      b.onclick = function () {
        cur = t[0];
        ui.$$('#dcTabs button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        render();
      };
      tab.appendChild(b);
    });
    root.appendChild(tab);
    var body = h('div');
    body.id = 'dcBody';
    root.appendChild(body);

    function render() {
      body.innerHTML = '';
      if (cur === 'browse') renderBrowse();
      else if (cur === 'drill') renderDrill();
      else renderRandom();
    }
    render();

    /* ---------- 分类浏览 ---------- */
    function renderBrowse() {
      // 语域说明
      var intro = h('div', 'card');
      intro.style.cssText = 'background:linear-gradient(140deg,#f2f9ff,#fff 60%)';
      intro.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '为什么按「功能」而不是按「词性」学？'));
      intro.lastChild.appendChild(h('span', 'sub', '这是日常沟通的正确组织方式'));
      var p = h('div');
      p.style.cssText = 'font-size:13.5px;line-height:1.85;color:var(--text-2)';
      p.innerHTML = '学「委婉不同意」这个功能时，你需要的是一整组可以直接说出口的句子：' +
        '<b>I see it a little differently.</b> / <b>That may be true, but…</b> / <b>I\'d look at it differently.</b>。' +
        '这些是「话轮」（turn）——真实对话的最小单位。背单词学不到话轮，' +
        '所以学了「agree」这个标签却依然在会议上说不出话。<br>' +
        '<b>语域标记</b>：每条都标了使用场合。<span style="color:' + RCOLOR.R1 + '">R1 正式</span>（邮件/面试/汇报）、' +
        '<span style="color:' + RCOLOR.R2 + '">R2 中性</span>（日常通用）、' +
        '<span style="color:' + RCOLOR.R3 + '">R3 随意</span>（朋友同事）、' +
        '<span style="color:' + RCOLOR.R4 + '">R4 俚语</span>（同龄人/网络）。' +
        '用高一级正式词不会错，用低一级俚语才会错。';
      intro.appendChild(p);
      body.appendChild(intro);

      // 分类网格
      cl.forEach(function (c) {
        var rows = rowsOf(c.key);
        var card = h('div', 'card');
        var hd = h('div', 'card-head');
        var l = h('div');
        l.appendChild(h('h3', null, c.name));
        l.appendChild(h('div', 'sub', rows.length + ' 条 · ' + c.key));
        hd.appendChild(l);
        var btn = h('button', 'btn sm soft', '展开');
        btn.onclick = function () { toggle(c.key, card, btn); };
        hd.appendChild(btn);
        card.appendChild(hd);
        card.dataset.key = c.key;
        // 默认显示前 6 条预览
        var box = h('div');
        rows.slice(0, 6).forEach(function (r) { box.appendChild(rowEl(r)); });
        if (rows.length > 6) {
          var more = h('div', 'sub', '还有 ' + (rows.length - 6) + ' 条，点击展开查看全部');
          more.style.marginTop = '6px';
          box.appendChild(more);
        }
        card.appendChild(box);
        body.appendChild(card);
      });
    }

    function toggle(key, card, btn) {
      var box = card.querySelector('div:last-child');
      var rows = rowsOf(key);
      if (box.dataset.full) {
        box.innerHTML = '';
        rows.slice(0, 6).forEach(function (r) { box.appendChild(rowEl(r)); });
        if (rows.length > 6) box.appendChild(h('div', 'sub', '还有 ' + (rows.length - 6) + ' 条，点击展开查看全部'));
        box.dataset.full = '';
        btn.textContent = '展开';
      } else {
        box.innerHTML = '';
        rows.forEach(function (r, i) {
          // 自动记录暴露次数（学习者看过这条表达）
          if (global.Progress) global.Progress.recordExpression(key, i);
          box.appendChild(rowEl(r));
        });
        box.dataset.full = '1';
        btn.textContent = '收起';
        // 记录一次学习行为
        if (global.Progress) global.Progress.recordSession('comm', 1, key);
      }
    }

    function rowEl(r) {
      var row = h('div');
      row.style.cssText = 'padding:8px 0;border-bottom:1px solid var(--surface-2)';
      var top = h('div');
      top.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap';
      var sp = h('button', 'mini-btn', '🔊');
      sp.style.flexShrink = '0';
      sp.onclick = function () { ui.tts.speak(r.en); };
      top.appendChild(sp);
      var en = h('span', null, r.en);
      en.style.cssText = 'font-size:14.5px;font-weight:500;flex:1;min-width:180px;cursor:pointer';
      en.onclick = function () { ui.tts.speak(r.en); };
      en.title = '点击朗读';
      top.appendChild(en);
      var tag = h('span', 'tag', r.r);
      tag.style.cssText = 'background:' + RCOLOR[r.r] + '18;color:' + RCOLOR[r.r];
      top.appendChild(tag);
      row.appendChild(top);
      var cn = h('div', null, r.cn);
      cn.style.cssText = 'font-size:13px;color:var(--text-2);margin-top:1px';
      row.appendChild(cn);
      return row;
    }

    /* ---------- 场景演练 ---------- */
    function renderDrill() {
      var card = h('div', 'card');
      var hd = h('div', 'card-head');
      hd.appendChild(h('h3', null, '场景演练：配对应答'));
      hd.appendChild(h('span', 'sub', '给一个情境，选出该说什么'));
      card.appendChild(hd);

      var note = h('div');
      note.style.cssText = 'font-size:12.5px;color:var(--text-2);background:var(--surface-2);padding:11px 13px;border-radius:9px;line-height:1.75;margin-bottom:14px';
      note.innerHTML = '<b>为什么是演练而不是背诵？</b>孤立记忆的提取练习有效（SM-2 就是基于这一点），' +
        '但日常沟通需要的是<b>情境触发</b>：对方说出某句话，你 1 秒内能调出对应回应。' +
        '这个能力只能通过反复演练建立，不能靠背单词表。';
      card.appendChild(note);

      var state = { q: 0, right: 0, scene: null, opts: [], picked: -1 };
      var quizBox = h('div');
      card.appendChild(quizBox);
      body.appendChild(card);

      function nextQ() {
        var cat = cl[Math.floor(Math.random() * cl.length)];
        var rows = rowsOf(cat.key);
        var q = rows[Math.floor(Math.random() * rows.length)];
        // 干扰项：优先同分类，不足时跨分类补足，保证始终 4 个选项
        var others = rows.filter(function (r) { return r.en !== q.en; });
        var pool = others.length >= 3 ? others : all.filter(function (r) { return r.en !== q.en; });
        var distract = [];
        var guard = 0;
        while (distract.length < 3 && pool.length && guard < 200) {
          var cand = pool[Math.floor(Math.random() * pool.length)];
          if (cand.en !== q.en && !distract.some(function (d) { return d.en === cand.en; })) distract.push(cand);
          guard++;
        }
        state.scene = cat; state.q = q; state.opts = distract.concat([q]).sort(function () { return Math.random() - .5; });
        state.picked = -1;
        renderQ();
      }

      function renderQ() {
        quizBox.innerHTML = '';
        var q = state.q, sc = state.scene;
        var ctx = h('div');
        ctx.style.cssText = 'padding:12px 14px;background:var(--primary-soft);border-radius:10px;margin-bottom:12px';
        ctx.innerHTML = '<div style="font-size:12px;color:var(--primary-dark);font-weight:700;margin-bottom:4px">' + sc.name + '</div>' +
          '<div style="font-size:14.5px;color:var(--text);line-height:1.6"><b>情境</b>：听到下面这句，你会怎么回应？<br>' +
          '<span style="color:var(--text-2);font-size:13.5px">（正确答案属于「' + sc.name + '」类表达）</span></div>';
        quizBox.appendChild(ctx);

        // 角色扮演卡：随机抽一条作为「你听到的话」
        var promptCard = h('div');
        promptCard.style.cssText = 'padding:14px 16px;border:1.5px solid var(--border);border-radius:11px;margin-bottom:12px;text-align:center;background:var(--surface)';
        var speaker = h('div', null, '对方说：');
        speaker.style.cssText = 'font-size:12px;color:var(--text-3)';
        promptCard.appendChild(speaker);
        var line = h('div', null, 'Hmm, I\'m not sure about that.');
        // 用一条同类的"对方的话"，若无则用通用
        var counterpart = pickCounterpart(q, sc);
        line.textContent = counterpart;
        line.style.cssText = 'font-size:19px;font-weight:600;margin-top:6px;cursor:pointer';
        line.title = '点击朗读';
        line.onclick = function () { ui.tts.speak(counterpart); };
        promptCard.appendChild(line);
        var sp = h('button', 'speak-btn', '🔊');
        sp.style.cssText = 'width:36px;height:36px;font-size:15px;margin:8px auto 0';
        sp.onclick = function () { ui.tts.speak(counterpart); };
        promptCard.appendChild(sp);
        quizBox.appendChild(promptCard);

        var opts = h('div', 'opts');
        state.opts.forEach(function (o, oi) {
          var b = h('button', 'opt');
          b.appendChild(h('div', 'k', 'ABCD'[oi]));
          b.appendChild(h('div', null, o.en));
          b.onclick = function () {
            if (state.picked >= 0) return;
            state.picked = oi;
            var ok = o.en === q.en;
            if (ok) state.right++;
            ui.$$('.opt', opts).forEach(function (x) { x.classList.add('locked'); });
            b.classList.add(ok ? 'ok' : 'no');
            if (!ok) {
              state.opts.forEach(function (oo, xx) { if (oo.en === q.en) ui.$$('.opt', opts)[xx].classList.add('ok'); });
            }
            S.recordAnswer(ok);
            var fb = h('div', 'feedback ' + (ok ? 'ok' : 'no'));
            fb.innerHTML = (ok ? '✓ 正确。' : '✓ 正确答案：') +
              '<b>' + q.en + '</b><br><span style="opacity:.85">' + q.cn + '</span>';
            quizBox.appendChild(fb);
            var nx = h('button', 'btn');
            nx.style.marginTop = '10px';
            nx.textContent = '下一题 →';
            nx.onclick = nextQ;
            quizBox.appendChild(nx);
          };
          opts.appendChild(b);
        });
        quizBox.appendChild(opts);
      }

      function pickCounterpart(q, sc) {
        // 同类的另一条作为"对方的话"（模拟对话轮替）
        var rows = rowsOf(sc.key).filter(function (r) { return r.en !== q.en; });
        return rows.length ? rows[Math.floor(Math.random() * rows.length)].en : 'How about it?';
      }

      var startBtn = h('button', 'btn lg', '开始演练');
      startBtn.onclick = function () { startBtn.remove(); nextQ(); };
      quizBox.appendChild(startBtn);
    }

    /* ---------- 随机抽句 ---------- */
    function renderRandom() {
      var card = h('div', 'card');
      var hd = h('div', 'card-head');
      hd.appendChild(h('h3', null, '随机抽句 · 闪卡模式'));
      hd.appendChild(h('span', 'sub', '快速过一遍，找薄弱项'));
      card.appendChild(hd);

      var box = h('div');
      card.appendChild(box);
      body.appendChild(card);

      var cur = null;
      function draw() {
        cur = all[Math.floor(Math.random() * all.length)];
        box.innerHTML = '';
        var inner = h('div');
        inner.style.cssText = 'text-align:center;padding:24px 12px';
        var cat = h('div', null, cur.cat);
        cat.style.cssText = 'font-size:12px;color:var(--text-3);font-weight:700;letter-spacing:.05em';
        inner.appendChild(cat);
        var en = h('div', null, cur.en);
        en.style.cssText = 'font-size:26px;font-weight:700;margin:12px 0;letter-spacing:-.02em;line-height:1.35;cursor:pointer';
        en.title = '点击朗读';
        en.onclick = function () { ui.tts.speak(cur.en); };
        inner.appendChild(en);
        var sp = h('button', 'speak-btn', '🔊');
        sp.onclick = function () { ui.tts.speak(cur.en); };
        inner.appendChild(sp);
        var cn = h('div', null, cur.cn);
        cn.style.cssText = 'font-size:17px;color:var(--text-2);margin-top:14px';
        cn.className = 'w-hide';
        cn.style.cursor = 'pointer';
        cn.onclick = function () { cn.classList.toggle('w-hide'); };
        inner.appendChild(cn);
        var hint = h('div', null, '点击中文揭示');
        hint.style.cssText = 'font-size:11.5px;color:var(--text-3);margin-top:6px';
        inner.appendChild(hint);
        box.appendChild(inner);
      }
      draw();

      var row = h('div', 'btn-row');
      row.style.justifyContent = 'center';
      var again = h('button', 'btn', '换一句');
      again.onclick = draw;
      row.appendChild(again);
      var speak = h('button', 'btn ghost', '🔊 朗读');
      speak.onclick = function () { ui.tts.speak(cur.en); };
      row.appendChild(speak);
      box.appendChild(row);
    }
  };
})(window);