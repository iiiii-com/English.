/* ============================================================
   view-english.js —— 英语学习资料页（统一入口）
   四个子模块：
     1. 音标发音   音素独立示范 + 音组合 + 英美对照
     2. 主题词汇   12 主题分类词表
     3. 连读规则   5 大规则 + 219 例句
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, ui = global.ui, h = ui.h;
  var PL = global.PhonemeLib, PD = global.PhonemeDetail,
      TW = global.TopicWords, LC = global.LiaisonContent, LC2 = global.LiaisonContent2;

  var RCOLOR = { R1: '#4f7cff', R2: '#22b07d', R3: '#f0a020', R4: '#e2585f' };
  var VCOLOR = { '长元音': '#4f7cff', '短元音': '#22b07d', '双元音': '#f0a020', '弱读 schwa': '#94a3b8' };

  function allExamples() { return global.ContentIndex.liaisonExamples(); }
  function allScenes() { return global.ContentIndex.scenes(); }

  V.english = function (root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '英语学习资料'));
    head.appendChild(h('p', null,
      '音标独立示范（44 音素 + 220 例词）· 主题词汇（12 主题 ' + TW.countAll() + ' 词）· ' +
      '连读规则（5 类 ' + allExamples().length + ' 例句）· 英美发音对照'));
    root.appendChild(head);

    var tab = h('div', 'segment');
    tab.id = 'enTabs';
    tab.style.marginBottom = '16px';
    var cur = 'phoneme';
    [['phoneme', '音标发音'], ['topic', '主题词汇'], ['liaison', '连读规则'], ['rpga', '英美对照']]
      .forEach(function (t) {
        var b = h('button', t[0] === cur ? 'on' : null, t[1]);
        b.dataset.en = t[0];
        b.onclick = function () {
          cur = t[0];
          ui.$$('#enTabs button').forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          render();
        };
        tab.appendChild(b);
      });
    root.appendChild(tab);

    var body = h('div');
    body.id = 'enBody';
    root.appendChild(body);

    function render() {
      global.UI.clear(body);
      if (cur === 'phoneme') renderPhoneme(body);
      else if (cur === 'topic') renderTopic(body);
      else if (cur === 'liaison') renderLiaison(body);
      else renderRpGa(body);
    }
    render();
  };

  /* ============================================================
     1. 音标发音
     ============================================================ */
  function renderPhoneme(root) {
    var sub = h('div', 'segment');
    sub.id = 'phSub';
    sub.style.marginBottom = '16px';
    var cur = 'demo';
    [['demo', '独立示范'], ['cluster', '音组合'], ['guide', '发音要领']]
      .forEach(function (t) {
        var b = h('button', t[0] === cur ? 'on' : null, t[1]);
        b.dataset.sub = t[0];
        b.onclick = function () {
          cur = t[0];
          ui.$$('#phSub button').forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          renderSub();
        };
        sub.appendChild(b);
      });
    root.appendChild(sub);
    var box = h('div');
    box.id = 'phSubBox';
    root.appendChild(box);

    function renderSub() {
      global.UI.clear(box);
      if (cur === 'demo') renderDemo(box);
      else if (cur === 'cluster') renderCluster(box);
      else renderGuide(box);
    }
    renderSub();
  }

  function renderDemo(root) {
    // 元音
    var vCard = h('div', 'card');
    var vh = h('div', 'card-head');
    vh.appendChild(h('h3', null, '元音独立发音示范（20 个）'));
    vh.appendChild(h('span', 'sub', '每个音素含例词组 + 最小对立对，可点击朗读'));
    vCard.appendChild(vh);
    var vg = h('div', 'grid g2');
    Object.keys(PL.VOWELS).forEach(function (sym) {
      vg.appendChild(phonemeCard(sym, PL.VOWELS[sym], true));
    });
    vCard.appendChild(vg);
    root.appendChild(vCard);

    // 辅音
    var cCard = h('div', 'card');
    cCard.style.marginTop = '16px';
    var ch = h('div', 'card-head');
    ch.appendChild(h('h3', null, '辅音独立发音示范（24 个）'));
    ch.appendChild(h('span', 'sub', '重点关注中国学习者的 8 个易错音'));
    cCard.appendChild(ch);
    var cg = h('div', 'grid g2');
    Object.keys(PL.CONSONANTS).forEach(function (sym) {
      cg.appendChild(phonemeCard(sym, PL.CONSONANTS[sym], false));
    });
    cCard.appendChild(cg);
    root.appendChild(cCard);
  }

  function phonemeCard(sym, info, isVowel) {
    var demo = PD && PD.DEMO[sym];
    var card = h('div');
    card.style.cssText = 'padding:14px;border:1px solid var(--border);border-radius:12px;background:var(--surface)';

    var top = h('div');
    top.style.cssText = 'display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:8px';
    var sy = h('b', null, info.ipa);
    sy.style.cssText = 'font-size:22px;font-family:var(--mono);color:' + (isVowel ? VCOLOR[info.type] : '#17805a');
    top.appendChild(sy);
    top.appendChild(h('b', null, info.name));
    var tg = h('span', 'tag grey', info.type);
    tg.style.marginLeft = 'auto';
    top.appendChild(tg);
    card.appendChild(top);

    // 例词组（独立发音示范）
    if (demo && demo.words && demo.words.length) {
      var wl = h('div', null, '例词');
      wl.style.cssText = 'font-size:11px;font-weight:700;color:#a6adbd;margin:6px 0 3px';
      card.appendChild(wl);
      var wr = h('div');
      wr.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px';
      demo.words.forEach(function (w) {
        var b = h('button', 'mini-btn', '🔊 ' + w);
        b.onclick = function () { ui.tts.speak(w); };
        wr.appendChild(b);
      });
      card.appendChild(wr);
    }

    // 最小对立对
    if (demo && demo.pair) {
      var pl = h('div', null, '最小对立对');
      pl.style.cssText = 'font-size:11px;font-weight:700;color:#a6adbd;margin:6px 0 3px';
      card.appendChild(pl);
      var pr = h('div');
      pr.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;align-items:center;font-size:12.5px';
      [demo.pair.aw, demo.pair.bw].forEach(function (t) {
        var sp = h('span', null, t);
        sp.style.cssText = 'font-family:var(--mono);color:#17805a;background:#e8f7f0;padding:3px 8px;border-radius:6px';
        pr.appendChild(sp);
      });
      card.appendChild(pr);
    }

    // 补充要领
    if (demo && demo.tip) {
      var tp = h('div');
      tp.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.7;margin-top:6px';
      tp.textContent = '💡 ' + demo.tip;
      card.appendChild(tp);
    }

    // 英美差异
    if (demo && demo.ga) {
      var ga = h('div');
      ga.style.cssText = 'font-size:12.5px;color:#b8790f;background:#fff5e5;padding:7px 10px;border-radius:8px;margin-top:6px;line-height:1.65';
      ga.textContent = '英美差异：' + demo.ga;
      card.appendChild(ga);
    }
    return card;
  }

  function renderCluster(root) {
    var card = h('div', 'card');
    var hd = h('div', 'card-head');
    hd.appendChild(h('h3', null, '辅音音组合（' + PD.CLUSTERS.length + ' 组）'));
    hd.appendChild(h('span', 'sub', '这些组合有固定读法，不能拆开拼'));
    card.appendChild(hd);
    var note = h('div');
    note.style.cssText = 'font-size:12.5px;color:var(--text-2);background:var(--surface-2);padding:12px 14px;border-radius:9px;line-height:1.8;margin-bottom:14px';
    note.innerHTML = '<b>为什么音组合要单独学？</b>英语的辅音丛可以有 2-3 个辅音连在一起（/str/ /tʃ/ /ks/），' +
      '但汉语没有这种结构。中国学生常见的错误是<b>把每个辅音都发足</b>，结果听起来像「拼读」而不是「说话」。' +
      '正确做法是把整组当作一个音，一口气发完。';
    card.appendChild(note);

    var grid = h('div', 'grid g2');
    PD.CLUSTERS.forEach(function (c) {
      var it = h('div');
      it.style.cssText = 'padding:13px;border:1px solid var(--border);border-radius:10px';
      var top = h('div');
      top.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:5px';
      var sy = h('b', null, c.ipa);
      sy.style.cssText = 'font-size:19px;font-family:var(--mono);color:#4f7cff';
      top.appendChild(sy);
      var ex = h('button', 'mini-btn', '🔊 ' + c.ex);
      ex.onclick = function () { ui.tts.speak(c.ex); };
      top.appendChild(ex);
      top.appendChild(h('span', 'tag grey', c.cn));
      it.appendChild(top);
      var nt = h('div', null, c.note);
      nt.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.65';
      it.appendChild(nt);
      var tp = h('div', null, '⚠️ ' + c.trap);
      tp.style.cssText = 'font-size:12px;color:#a83238;margin-top:4px;line-height:1.6';
      it.appendChild(tp);
      grid.appendChild(it);
    });
    card.appendChild(grid);
    root.appendChild(card);
  }

  function renderGuide(root) {
    // 音标要领速查
    var card = h('div', 'card');
    var hd = h('div', 'card-head');
    hd.appendChild(h('h3', null, '发音要领速查'));
    hd.appendChild(h('span', 'sub', '元音舌位 + 辅音口型'));
    card.appendChild(hd);

    ['元音', '辅音'].forEach(function (grp) {
      var items = grp === '元音'
        ? Object.keys(PL.VOWELS).map(function (k) { return { k: k, v: PL.VOWELS[k] }; })
        : Object.keys(PL.CONSONANTS).map(function (k) { return { k: k, v: PL.CONSONANTS[k] }; });
      var sub = h('div');
      sub.style.marginTop = '14px';
      sub.appendChild(h('div', null, grp + '（' + items.length + '）'));
      sub.lastChild.style.cssText = 'font-size:12px;font-weight:700;color:#a6adbd;margin-bottom:8px';
      var tbl = h('table', 'tbl');
      var thead = h('thead');
      var tr = h('tr');
      ['音标', '口型 / 舌位', '发音要领', '常见错误'].forEach(function (t) { tr.appendChild(h('th', null, t)); });
      thead.appendChild(tr);
      tbl.appendChild(thead);
      var tb = h('tbody');
      items.forEach(function (x) {
        var r = h('tr');
        var c0 = h('td');
        var b = h('b', null, x.v.ipa);
        b.style.cssText = 'font-family:var(--mono);color:' + (grp === '元音' ? VCOLOR[x.v.type] : '#17805a');
        c0.appendChild(b);
        r.appendChild(c0);
        r.appendChild(h('td', null, grp === '元音' ? x.v.tongue : x.v.mouth));
        r.appendChild(h('td', null, x.v.how));
        var p = h('td', null, x.v.pitfall);
        p.style.color = '#a83238';
        p.style.fontSize = '12px';
        r.appendChild(p);
        tb.appendChild(r);
      });
      tbl.appendChild(tb);
      sub.appendChild(tbl);
      card.appendChild(sub);
    });
    root.appendChild(card);
  }

  /* ============================================================
     2. 主题词汇
     ============================================================ */
  function renderTopic(root) {
    var intro = h('div', 'card');
    var ih = h('div', 'card-head');
    ih.appendChild(h('h3', null, '主题词汇（12 主题 · ' + TW.countAll() + ' 词）'));
    ih.appendChild(h('span', 'sub', '每词含音标、词性、常用搭配'));
    intro.appendChild(ih);
    var note = h('div');
    note.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.85';
    note.innerHTML = '<b>为什么按主题记单词？</b>孤立背单词时大脑只建立「词↔义」的单点连接，' +
      '使用时需要现场搜索。按主题成组记忆时，同一场景的词会互相激活，' +
      '回忆时是「想场景→想起词」而非「想中文→找词」，快得多也牢得多。<br>' +
      '<b>用法</b>：先看中文说场景，再看英文词，检验自己能否脱口而出。';
    intro.appendChild(note);
    root.appendChild(intro);

    TW.keys().forEach(function (k) {
      var t = TW.TOPICS[k];
      var card = h('div', 'card');
      var hd = h('div', 'card-head');
      var l = h('div');
      l.style.cssText = 'display:flex;align-items:center;gap:8px';
      var ico = h('span', null, t.icon);
      ico.style.fontSize = '17px';
      l.appendChild(ico);
      var nm = h('h3', null, t.name);
      nm.style.margin = '0';
      l.appendChild(nm);
      hd.appendChild(l);
      hd.appendChild(h('span', 'sub', t.words.length + ' 词 · ' + t.desc));
      card.appendChild(hd);

      // 分页：单主题最多 27 词，超过 15 词分页展示
      var PAGE = 15;
      var page = 0;
      var total = Math.max(1, Math.ceil(t.words.length / PAGE));
      var holder = h('div');
      card.appendChild(holder);

      function drawWords() {
        global.UI.clear(holder);
        var slice = t.words.slice(page * PAGE, (page + 1) * PAGE);
        var tbl = h('table', 'tbl');
        var thead = h('thead');
        var tr = h('tr');
        ['单词', '音标', '词性', '释义', '常用搭配'].forEach(function (x) { tr.appendChild(h('th', null, x)); });
        thead.appendChild(tr);
        tbl.appendChild(thead);
        var tb = h('tbody');
        slice.forEach(function (w) {
          var r = h('tr');
          var c0 = h('td');
          var bw = h('b', null, w.w);
          bw.style.cursor = 'pointer';
          bw.title = '点击朗读';
          bw.onclick = function () { ui.tts.speak(w.w); };
          c0.appendChild(bw);
          r.appendChild(c0);
          var c1 = h('td', null, w.i);
          c1.style.cssText = 'font-family:var(--mono);font-size:12px;color:var(--primary-dark)';
          r.appendChild(c1);
          r.appendChild(h('td', null, w.p));
          r.appendChild(h('td', null, w.c));
          var c4 = h('td', null, w.u);
          c4.style.color = 'var(--text-3)';
          c4.style.fontSize = '12px';
          if (w.rp) c4.innerHTML = w.u + '<br><span style="color:#b8790f">英式：' + w.rp + '</span>';
          r.appendChild(c4);
          tb.appendChild(r);
        });
        tbl.appendChild(tb);
        holder.appendChild(tbl);

        if (total > 1) {
          var pg = h('div');
          pg.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:10px;margin-top:12px;padding-top:12px;border-top:1px solid var(--surface-2)';
          var pv = h('button', 'btn sm ghost', '← 上一页');
          var inf = h('span', null, t.words.length + ' 词 · 第 ' + (page + 1) + '/' + total + ' 页');
          inf.style.cssText = 'font-size:12.5px;color:var(--text-3)';
          var nx = h('button', 'btn sm ghost', '下一页 →');
          pv.disabled = page === 0; nx.disabled = page === total - 1;
          pv.style.opacity = page === 0 ? .4 : 1;
          nx.style.opacity = page === total - 1 ? .4 : 1;
          pv.onclick = function () { if (page > 0) { page--; drawWords(); } };
          nx.onclick = function () { if (page < total - 1) { page++; drawWords(); } };
          pg.appendChild(pv); pg.appendChild(inf); pg.appendChild(nx);
          holder.appendChild(pg);
        }
      }
      drawWords();
      root.appendChild(card);
    });
  }

  /* ============================================================
     3. 连读规则
     ============================================================ */
  function renderLiaison(root) {
    // 规则详解
    LC.RULES.forEach(function (r) {
      var card = h('div', 'card');
      var hd = h('div', 'card-head');
      var l = h('div');
      l.style.cssText = 'display:flex;align-items:center;gap:9px';
      var ico = h('span', null, r.icon);
      ico.style.fontSize = '18px';
      l.appendChild(ico);
      var nm = h('h3', null, r.name);
      nm.style.margin = '0';
      l.appendChild(nm);
      hd.appendChild(l);
      hd.appendChild(h('span', 'tag grey', r.level));
      card.appendChild(hd);

      var what = h('div');
      what.style.cssText = 'font-size:13.5px;line-height:1.85;color:var(--text)';
      what.textContent = r.what;
      card.appendChild(what);
      var why = h('div');
      why.style.cssText = 'font-size:12.5px;line-height:1.8;color:var(--text-2);background:var(--surface-2);padding:10px 13px;border-radius:9px;margin-top:9px';
      why.innerHTML = '<b>为什么</b>：' + r.why;
      card.appendChild(why);

      var tg = h('div');
      tg.style.cssText = 'font-size:12px;font-weight:700;color:#a6adbd;margin:13px 0 7px';
      tg.textContent = '细分规则（' + r.rules.length + ' 条）';
      card.appendChild(tg);

      var tbl = h('table', 'tbl');
      var thead = h('thead');
      var tr = h('tr');
      ['规则', '说明', '例句', '要点'].forEach(function (x) { tr.appendChild(h('th', null, x)); });
      thead.appendChild(tr);
      tbl.appendChild(thead);
      var tb = h('tbody');
      r.rules.forEach(function (x) {
        var row = h('tr');
        var c0 = h('td');
        var nm2 = h('b', null, x.name);
        c0.appendChild(nm2);
        if (x.mark && x.mark.length <= 3) {
          var mk = h('span', null, ' ' + x.mark);
          mk.style.cssText = 'font-family:var(--mono);color:#e2585f;margin-left:4px';
          c0.appendChild(mk);
        }
        row.appendChild(c0);
        row.appendChild(h('td', null, x.desc));
        var c2 = h('td', null, x.eg || '—');
        c2.style.cssText = 'font-family:var(--mono);font-size:12px;color:#17805a';
        if (x.eg) {
          var sp = h('button', 'mini-btn', '🔊');
          sp.style.marginRight = '5px';
          sp.onclick = function () { ui.tts.speak(x.eg.replace(/‿/g, ' ').replace(/\//g, '')); };
          c2.innerHTML = '';
          c2.appendChild(sp);
          c2.appendChild(document.createTextNode(x.eg));
        }
        row.appendChild(c2);
        var c3 = h('td', null, x.tip || '—');
        c3.style.cssText = 'font-size:12px;color:var(--text-3)';
        row.appendChild(c3);
        tb.appendChild(row);
      });
      tbl.appendChild(tb);
      card.appendChild(tbl);

      var err = h('div');
      err.style.cssText = 'margin-top:11px;padding:9px 12px;background:var(--danger-soft);border-radius:8px;font-size:12.5px;color:#a83238;line-height:1.65';
      err.textContent = '⚠️ ' + r.common_error;
      card.appendChild(err);
      root.appendChild(card);
    });

    // 例句库
    var exCard = h('div', 'card');
    exCard.style.marginTop = '16px';
    var eh = h('div', 'card-head');
    eh.appendChild(h('h3', null, '连读例句库（' + allExamples().length + ' 句）'));
    var subSeg = h('div', 'segment');
    subSeg.id = 'exFilter';
    var fcur = 'all';
    var counts = {};
    allExamples().forEach(function (e) { counts[e.rule] = (counts[e.rule] || 0) + 1; });
    [['all', '全部 ' + allExamples().length]].concat(
      LC.RULES.map(function (r) { return [r.id, r.name.replace(/（.*/, '') + ' ' + (counts[r.id] || 0)]; })
    ).forEach(function (t) {
      var b = h('button', t[0] === 'all' ? 'on' : null, t[1]);
      b.dataset.f = t[0];
      b.onclick = function () {
        fcur = t[0];
        ui.$$('#exFilter button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        renderEx();
      };
      subSeg.appendChild(b);
    });
    eh.appendChild(subSeg);
    exCard.appendChild(eh);
    var exBox = h('div');
    exCard.appendChild(exBox);
    root.appendChild(exCard);

    function renderEx() {
      global.UI.clear(exBox);
      var list = allExamples().filter(function (e) { return fcur === 'all' || e.rule === fcur; });

      // 分页：219 句一次性渲染会产生 20+ 屏页面，影响可用性
      var PAGE = 20;
      var page = 0;
      var total = Math.max(1, Math.ceil(list.length / PAGE));
      var pager = h('div');
      pager.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:10px;padding:12px 0 4px;flex-wrap:wrap';
      var info = h('span');
      info.style.cssText = 'font-size:12.5px;color:var(--text-3)';
      var prev = h('button', 'btn sm ghost', '← 上一页');
      var next = h('button', 'btn sm ghost', '下一页 →');
      var jump = h('div');
      jump.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;justify-content:center;margin-top:8px;width:100%';
      pager.appendChild(prev);
      pager.appendChild(info);
      pager.appendChild(next);
      exBox.appendChild(pager);
      exBox.appendChild(jump);

      function draw() {
        var slice = list.slice(page * PAGE, (page + 1) * PAGE);
        slice.forEach(function (e) {
          var r = LC.RULES.filter(function (x) { return x.id === e.rule; })[0];
          var it = h('div');
          it.style.cssText = 'padding:12px 0;border-bottom:1px solid var(--surface-2)';
          var top = h('div');
          top.style.cssText = 'display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-bottom:4px';
          var sp = h('button', 'speak-btn', '🔊');
          sp.style.cssText = 'width:30px;height:30px;font-size:13px;flex-shrink:0';
          sp.onclick = function () { ui.tts.speak(e.en); };
          top.appendChild(sp);
          var en = h('b', null, e.mark);
          en.style.cssText = 'font-size:15.5px;letter-spacing:-.01em;flex:1;min-width:200px';
          en.title = '‿ 为连读点';
          top.appendChild(en);
          if (r) {
            var tg = h('span', 'tag grey', r.icon + ' ' + r.name.replace(/（.*/, ''));
            top.appendChild(tg);
          }
          it.appendChild(top);
          var cn = h('div', null, e.cn);
          cn.style.cssText = 'font-size:13px;color:var(--text-2)';
          it.appendChild(cn);
          var cmp = h('div');
          cmp.style.cssText = 'font-size:12px;color:var(--text-3);margin-top:4px;display:flex;gap:14px;flex-wrap:wrap';
          cmp.innerHTML = '<span>逐字读：' + e.before + '</span><span style="color:#17805a">连读后：' + e.after + '</span>';
          it.appendChild(cmp);
          exBox.appendChild(it);
        });
        // 页码状态
        global.UI.clear(info);
        info.textContent = list.length + ' 句 · 第 ' + (page + 1) + '/' + total + ' 页';
        prev.disabled = page === 0;
        next.disabled = page === total - 1;
        prev.style.opacity = page === 0 ? .4 : 1;
        next.style.opacity = page === total - 1 ? .4 : 1;

        // 页码按钮
        global.UI.clear(jump);
        for (var i = 0; i < total; i++) {
          (function (idx) {
            var pb = h('button', 'mini-btn' + (idx === page ? ' on' : ''), String(idx + 1));
            pb.style.minWidth = '30px';
            pb.style.background = idx === page ? 'var(--primary)' : '';
            pb.style.color = idx === page ? '#fff' : '';
            pb.style.borderColor = idx === page ? 'var(--primary)' : '';
            pb.onclick = function () {
              page = idx;
              // 重绘列表（保留 pager 与 jump 两个节点）
              Array.prototype.slice.call(exBox.children).forEach(function (n, k) {
                if (k > 1) n.remove();
              });
              draw();
              exBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
            };
            jump.appendChild(pb);
          })(i);
        }
      }

      prev.onclick = function () {
        if (page > 0) {
          page--;
          Array.prototype.slice.call(exBox.children).forEach(function (n, k) { if (k > 1) n.remove(); });
          draw();
        }
      };
      next.onclick = function () {
        if (page < total - 1) {
          page++;
          Array.prototype.slice.call(exBox.children).forEach(function (n, k) { if (k > 1) n.remove(); });
          draw();
        }
      };
      draw();
    }
    renderEx();

    // 专项练习
    var dCard = h('div', 'card');
    dCard.style.marginTop = '16px';
    var dh = h('div', 'card-head');
    dh.appendChild(h('h3', null, '专项练习'));
    dh.appendChild(h('span', 'sub', '按规则分组，逐组突破'));
    dCard.appendChild(dh);
    LC.DRILLS.forEach(function (d) {
      var it = h('div');
      it.style.cssText = 'padding:12px 0;border-bottom:1px solid var(--surface-2)';
      var t = h('b', null, d.title);
      t.style.fontSize = '13.5px';
      it.appendChild(t);
      var dd = h('div', null, d.desc);
      dd.style.cssText = 'font-size:12px;color:var(--text-3);margin:2px 0 6px';
      it.appendChild(dd);
      var row = h('div');
      row.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap';
      d.items.forEach(function (x) {
        var b = h('button', 'mini-btn', '🔊 ' + x);
        b.onclick = function () { ui.tts.speak(x); };
        row.appendChild(b);
      });
      it.appendChild(row);
      dCard.appendChild(it);
    });
    root.appendChild(dCard);
  }

  /* ============================================================
     4. 英美发音对照
     ============================================================ */
  function renderRpGa(root) {
    // 选择建议
    var g = PD.RP_GA.guide;
    var gc = h('div', 'card');
    gc.style.cssText = 'background:linear-gradient(140deg,#f0f5ff,#fff 60%)';
    var gh = h('div', 'card-head');
    gh.appendChild(h('h3', null, '选哪个口音？'));
    gh.appendChild(h('span', 'sub', '两者都对，关键是保持一致'));
    gc.appendChild(gh);
    var gl = h('div');
    gl.style.cssText = 'font-size:13.5px;line-height:1.9;color:var(--text-2)';
    gl.innerHTML = '<b style="color:var(--text)">结论</b>：' + g.advice + '<br><br>' +
      '<b style="color:#4f7cff">英式（RP）</b>：' + g.rpWhy + '<br><br>' +
      '<b style="color:#e2585f">美式（GA）</b>：' + g.gaWhy + '<br><br>' +
      '<b style="color:var(--text)">核心原则</b>：' + g.tip;
    gc.appendChild(gl);
    root.appendChild(gc);

    // 音素对照
    var p1 = h('div', 'card');
    p1.style.marginTop = '16px';
    var p1h = h('div', 'card-head');
    p1h.appendChild(h('h3', null, '音素差异对照'));
    p1h.appendChild(h('span', 'sub', PD.RP_GA.phonemes.length + ' 组'));
    p1.appendChild(p1h);
    p1.appendChild(rpGaTable(['音素', '英式 RP', '美式 GA', '差异', '例词', '说明'],
      PD.RP_GA.phonemes.map(function (x) { return [x.item, x.rp, x.ga, x.cn, x.ex.join(' / '), x.note || '—']; })));
    root.appendChild(p1);

    // 词汇对照
    var p2 = h('div', 'card');
    p2.style.marginTop = '16px';
    var p2h = h('div', 'card-head');
    p2h.appendChild(h('h3', null, '词汇差异对照'));
    p2h.appendChild(h('span', 'sub', PD.RP_GA.words.length + ' 组'));
    p2.appendChild(p2h);
    p2.appendChild(rpGaTable(['英式（RP）', '美式（GA）', '差异', '备注'],
      PD.RP_GA.words.map(function (x) { return [x.rp, x.ga, x.cn, x.note || '—']; })));
    root.appendChild(p2);

    // 句子语感
    var p3 = h('div', 'card');
    p3.style.marginTop = '16px';
    var p3h = h('div', 'card-head');
    p3h.appendChild(h('h3', null, '整句语感对照'));
    p3h.appendChild(h('span', 'sub', PD.RP_GA.sentences.length + ' 句 · 可直接听'));
    p3.appendChild(p3h);
    PD.RP_GA.sentences.forEach(function (s) {
      var it = h('div');
      it.style.cssText = 'padding:13px 0;border-bottom:1px solid var(--surface-2)';
      var top = h('div');
      top.style.cssText = 'display:flex;align-items:center;gap:9px;margin-bottom:5px';
      var sp = h('button', 'speak-btn', '🔊');
      sp.style.cssText = 'width:30px;height:30px;font-size:13px;flex-shrink:0';
      sp.onclick = function () { ui.tts.speak(s.en); };
      top.appendChild(sp);
      var en = h('b', null, s.en);
      en.style.cssText = 'font-size:15px;flex:1';
      top.appendChild(en);
      top.appendChild(h('span', 'tag grey', s.cn));
      it.appendChild(top);
      var g1 = h('div');
      g1.style.cssText = 'font-size:13px;color:#4f7cff;line-height:1.7;margin-left:39px';
      g1.textContent = '英式：' + s.rp;
      it.appendChild(g1);
      var g2 = h('div');
      g2.style.cssText = 'font-size:13px;color:#e2585f;line-height:1.7;margin-left:39px';
      g2.textContent = '美式：' + s.ga;
      it.appendChild(g2);
      var nt = h('div');
      nt.style.cssText = 'font-size:12px;color:var(--text-3);margin:4px 0 0 39px;line-height:1.65';
      nt.textContent = '💡 ' + s.note;
      it.appendChild(nt);
      p3.appendChild(it);
    });
    root.appendChild(p3);
  }

  function rpGaTable(headers, rows) {
    var tbl = h('table', 'tbl');
    var thead = h('thead');
    var tr = h('tr');
    headers.forEach(function (x) { tr.appendChild(h('th', null, x)); });
    thead.appendChild(tr);
    tbl.appendChild(thead);
    var tb = h('tbody');
    rows.forEach(function (r) {
      var row = h('tr');
      r.forEach(function (c, i) {
        var td = h('td', null, c);
        if (i === 1) { td.style.cssText = 'color:#4f7cff;font-family:var(--mono);font-size:12px'; }
        if (i === 2) { td.style.cssText = 'color:#e2585f;font-family:var(--mono);font-size:12px'; }
        row.appendChild(td);
      });
      tb.appendChild(row);
    });
    tbl.appendChild(tb);
    return tbl;
  }
})(window);