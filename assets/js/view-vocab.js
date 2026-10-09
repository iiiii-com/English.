/* ============================================================
   view-vocab.js —— 词汇模块
   四个学习区：今日复习队列 / 新词学习 / 自测测验 / 精讲核心词
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, C = global.Charts, VC = global.VocabContent;
  var ui = global.ui, h = ui.h;

  /** 全部词库：生活库 L1-L4 + 已加载的高考库 L5-L6（id 段已隔离） */
  function allWords() {
    var base = (global.VOCAB_DATA && global.VOCAB_DATA.words) || [];
    var out = [];
    if (global.GAOKAO_L5) out = out.concat(global.GAOKAO_L5.words);
    if (global.GAOKAO_L6) out = out.concat(global.GAOKAO_L6.words);
    return base.concat(out);
  }
  /** 词库统计信息（取自 meta，含未加载等级，不受懒加载影响） */
  function allMeta() {
    var m = (global.VOCAB_DATA && global.VOCAB_DATA.meta) || { byLevel: {}, themes: {}, total: 0 };
    var g = (global.GAOKAO_META && global.GAOKAO_META.meta)
      || (global.GAOKAO_DATA && global.GAOKAO_DATA.meta)
      || { byLevel: {}, themes: {}, total: 0 };
    var byLevel = Object.assign({}, m.byLevel, g.byLevel);
    var themes = {};
    Object.keys(m.themes || {}).forEach(function (k) { themes[k] = m.themes[k]; });
    Object.keys(g.themes || {}).forEach(function (k) {
      themes[k] = g.themes[k];   // 高考库主题独立命名，不与原库冲突
    });
    return { total: (m.total || 0) + (g.total || 0), byLevel: byLevel, themes: themes };
  }
  var LEVELS_ALL = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6'];

  function wordById(id) {
    var all = allWords();
    for (var i = 0; i < all.length; i++) if (all[i].id === +id) return all[i];
    return null;
  }

  /* ============================================================
     A. 今日复习（间隔重复主循环）
     ============================================================ */
  /* ============================================================
     全库浏览 —— 5449 词全部开放，无需解锁
     与「学新词」的区别：这里不按推荐路径组织，而是像字典一样查阅。
     ============================================================ */
  function browseView(root) {
    var note = h('div', 'card');
    note.style.cssText = 'background:linear-gradient(140deg,#f0f5ff,#fff 60%)';
    var nh = h('div', 'card-head');
    nh.appendChild(h('h3', null, '全库浏览'));
    nh.appendChild(h('span', 'tag l1', '全部开放'));
    note.appendChild(nh);
    var nt = h('div');
    nt.style.cssText = 'font-size:13px;line-height:1.85;color:var(--text-2)';
    nt.innerHTML = '<b>全部 5449 词已开放</b>，任何等级都能随时查阅、学习、自测。' +
      '「等级路径」是<b>推荐的学习顺序</b>（先易后难，效率更高），不是权限限制。<br>' +
      '用法上建议：<b>查词</b>用这里的搜索；<b>系统学习</b>走「学新词」，' +
      '因为 SM-2 间隔重复对「按序、少量、高频复习」的效果最好。';
    note.appendChild(nt);
    root.appendChild(note);

    var box = h('div');
    box.id = 'browseBox';
    box.style.marginTop = '16px';
    root.appendChild(box);

    // 词库可能分片（L5/L6 懒加载），先统计已加载部分
    function loaded() { return allWords(); }

    var sBox = h('div', 'card');
    var sh = h('div', 'card-head');
    sh.appendChild(h('h3', null, '查找单词'));
    sBox.appendChild(sh);

    var input = h('input', 'input');
    input.type = 'search';
    input.placeholder = '输入英文或中文，例如 water / 水 / aban';
    input.style.cssText = 'width:100%;padding:11px 14px;border:1px solid var(--border);border-radius:9px;font-size:14px;margin-bottom:12px';
    sBox.appendChild(input);

    var filters = h('div', 'segment');
    filters.style.marginBottom = '12px';
    sBox.appendChild(filters);

    var listBox = h('div');
    sBox.appendChild(listBox);
    box.appendChild(sBox);

    var state = { q: '', lv: 'ALL', theme: 'ALL', status: 'ALL', page: 0 };
    var PAGE = 120;

    var FILTERS = [
      {
        k: 'lv', opts: [['ALL', '全部等级']].concat(LEVELS_ALL.map(function (id) {
          return [id, id + ' ' + global.PathContent.levelById(id).name];
        }))
      },
      { k: 'status', opts: [['ALL', '全部状态'], ['new', '未学'], ['learning', '学习中'], ['mature', '已掌握']] }
    ];
    var filterBtns = {};

    FILTERS.forEach(function (f) {
      f.opts.forEach(function (o) {
        var b = h('button', o[0] === state[f.k] ? 'on' : null, o[1]);
        b.type = 'button';
        b.dataset.k = f.k; b.dataset.v = o[0];
        b.onclick = function () {
          state[f.k] = o[0];
          state.page = 0;
          ui.$$('button', filters).forEach(function (x) { x.classList.remove('on'); });
          b.classList.add('on');
          if (f.k === 'lv') { rebuildTheme(); }
          // L5/L6 词库按需加载（约 415KB）
          if (f.k === 'lv' && (o[0] === 'L5' || o[0] === 'L6')) {
            var label = b.textContent;
            b.disabled = true;
            b.textContent = o[1] + ' 加载中…';
            S.ensureLevel(o[0]).then(function () {
              b.disabled = false;
              b.textContent = label;
              renderList();
            });
            return;
          }
          renderList();
        };
        filterBtns[f.k + ':' + o[0]] = b;
        filters.appendChild(b);
      });
    });

    var themeSel = h('select', 'input');
    themeSel.style.cssText = 'max-width:190px;margin-left:12px';
    filters.appendChild(themeSel);

    function rebuildTheme() {
      themeSel.innerHTML = '';
      var lvs = state.lv === 'ALL' ? LEVELS_ALL : [state.lv];
      var names = {};
      lvs.forEach(function (lv) {
        VC.themesOf(lv).forEach(function (t) { names[t] = (names[t] || 0) + 1; });
      });
      ['ALL'].concat(Object.keys(names).sort()).forEach(function (t) {
        var o = h('option', null, t === 'ALL' ? '全部主题' : t);
        o.value = t;
        themeSel.appendChild(o);
      });
      state.theme = 'ALL';
    }
    rebuildTheme();
    themeSel.onchange = function () { state.theme = themeSel.value; state.page = 0; renderList(); };

    input.oninput = function () { state.q = input.value.trim(); state.page = 0; renderList(); };

    function currentList() {
      var pool = loaded();
      if (state.lv !== 'ALL') pool = pool.filter(function (w) { return w.lv === state.lv; });
      if (state.theme !== 'ALL') pool = pool.filter(function (w) { return w.th === state.theme; });
      if (state.status !== 'ALL') {
        pool = pool.filter(function (w) {
          var c = S.state.words[w.id];
          if (!c) return state.status === 'new';
          if (state.status === 'learning') return c.ivl < 21;
          if (state.status === 'mature') return c.ivl >= 21;
          return true;
        });
      }
      if (state.q) {
        var lower = state.q.toLowerCase();
        pool = pool.filter(function (w) {
          return (w.w && w.w.toLowerCase().indexOf(lower) >= 0)
            || (w.cn && String(w.cn).toLowerCase().indexOf(lower) >= 0);
        });
        pool.sort(function (a, b) {
          var aw = a.w.toLowerCase(), bw = b.w.toLowerCase();
          var sa = aw === lower ? 0 : aw.indexOf(lower) === 0 ? 1 : 2;
          var sb = bw === lower ? 0 : bw.indexOf(lower) === 0 ? 1 : 2;
          return sa !== sb ? sa - sb : aw.length - bw.length;
        });
      }
      return pool;
    }

    function renderList() {
      global.UI.clear(listBox);
      var list = currentList();

      var total = S.vocabTotalCount();
      var info = h('div');
      info.style.cssText = 'font-size:13px;color:var(--text-2);margin-bottom:12px';
      var loadedCount = loaded().length;
      var tail = loadedCount < total
        ? '（另有 ' + (total - loadedCount) + ' 词在 L5/L6 分片中，用上方等级筛选可加载）'
        : '';
      info.textContent = '当前显示 ' + list.length + ' 个词 · 全库共 ' + total + ' 词' + tail;
      listBox.appendChild(info);

      if (!list.length) {
        var e = h('div', 'empty-state');
        e.appendChild(h('div', 'e-ico', '🔍'));
        e.appendChild(h('div', 'e-txt', state.q
          ? '没有找到匹配的词。换个关键词试试。'
          : '该筛选条件下没有词。试试放宽条件。'));
        listBox.appendChild(e);
        return;
      }

      var pages = Math.max(1, Math.ceil(list.length / PAGE));
      if (state.page >= pages) state.page = pages - 1;
      var slice = list.slice(state.page * PAGE, (state.page + 1) * PAGE);

      var tbl = h('table', 'tbl stackable');
      var thead = h('thead');
      var tr = h('tr');
      var LABELS = ['单词', '音标', '释义', '等级', '主题', '状态', ''];
      LABELS.forEach(function (x) {
        tr.appendChild(h('th', null, x));
      });
      thead.appendChild(tr);
      tbl.appendChild(thead);
      var tb = h('tbody');

      slice.forEach(function (w) {
        var r = h('tr');
        // data-label 让窄屏下每个单元格能显示对应表头
        r.setAttribute('data-w', w.w);
        var c0 = h('td');
        c0.setAttribute('data-label', LABELS[0]);
        var bw = h('b', null, w.w);
        bw.style.cursor = 'pointer';
        bw.onclick = function () { ui.tts.speak(w.w); };
        c0.appendChild(bw);
        var sp = h('button', 'mini-btn', '🔊');
        sp.style.marginLeft = '6px';
        sp.onclick = function () { ui.tts.speak(w.w); };
        c0.appendChild(sp);
        r.appendChild(c0);

        var c1 = h('td', null, w.ipa || '—');
        c1.setAttribute('data-label', LABELS[1]);
        c1.style.cssText = 'font-family:var(--mono);font-size:12px;color:var(--primary-dark)';
        r.appendChild(c1);

        var c2 = h('td', null, w.cn || '—');
        c2.setAttribute('data-label', LABELS[2]);
        r.appendChild(c2);

        var c3 = h('td', null, w.lv);
        c3.setAttribute('data-label', LABELS[3]);
        c3.style.cssText = 'font-size:11.5px;font-weight:700;color:' +
          (w.lv === 'L1' ? '#22b07d' : w.lv === 'L2' ? '#4f7cff' : w.lv === 'L3' ? '#f0a020' :
            w.lv === 'L4' ? '#e2585f' : w.lv === 'L5' ? '#8b5cf6' : '#ec4899');
        r.appendChild(c3);

        var c4 = h('td', null, w.th || '—');
        c4.setAttribute('data-label', LABELS[4]);
        c4.style.cssText = 'font-size:11.5px;color:var(--text-3);max-width:130px';
        r.appendChild(c4);

        var c5 = h('td');
        c5.setAttribute('data-label', LABELS[5]);
        var card = S.state.words[w.id];
        var tag = h('span', null, card ? (card.ivl >= 21 ? '已掌握' : '学习中') : '未学');
        tag.style.cssText = 'font-size:11px;font-weight:700;color:' +
          (!card ? 'var(--text-3)' : card.ivl >= 21 ? '#17805a' : '#b8790f');
        c5.appendChild(tag);
        r.appendChild(c5);

        var c6 = h('td');
        c6.setAttribute('data-label', '');
        var add = h('button', 'mini-btn', card ? '已在队列' : '加入学习');
        add.disabled = !!card;
        if (!card) {
          add.onclick = function () {
            S.initNewWord(w.id);
            S.save(true);
            ui.toast('已加入：' + w.w);
            renderList();
          };
        }
        c6.appendChild(add);
        r.appendChild(c6);

        tb.appendChild(r);
      });
      tbl.appendChild(tb);
      listBox.appendChild(tbl);

      // 分页
      var pg = h('div');
      pg.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:10px;margin-top:14px;flex-wrap:wrap';
      var prev = h('button', 'btn sm ghost', '← 上一页');
      var info2 = h('span', null, '第 ' + (state.page + 1) + ' / ' + pages + ' 页');
      info2.style.cssText = 'font-size:12.5px;color:var(--text-3)';
      var next = h('button', 'btn sm ghost', '下一页 →');
      prev.disabled = state.page === 0;
      next.disabled = state.page === pages - 1;
      prev.onclick = function () { state.page--; renderList(); window.scrollTo(0, listBox.offsetTop - 80); };
      next.onclick = function () { state.page++; renderList(); window.scrollTo(0, listBox.offsetTop - 80); };
      pg.appendChild(prev); pg.appendChild(info2); pg.appendChild(next);
      listBox.appendChild(pg);
    }

    renderList();
  }

  function reviewView(root) {
    var due = S.dueReviews(S.state.settings.dailyReviewCap);
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '今日复习'));
    var totalDue = S.dueReviews().length;
    head.appendChild(h('p', null,
      '共 ' + totalDue + ' 个词到期，已按"最该复习"排序（逾期最久、难度因子最低优先）。' +
      '记忆科学原理：提取练习（test）本身产生长期巩固，反复阅读则停留在短期记忆（Karpicke & Roediger, 2008）。'));
    root.appendChild(head);

    if (!due.length) {
      var e = h('div', 'card');
      e.appendChild(global.UI.emptyState('当前没有到期的复习词', {
        icon: '🎉',
        hint: '这说明你之前的学习都按时完成了。间隔重复算法会在词的记忆即将衰退时（i+1 临界点）安排下次复习，所以「没有到期」是正常且健康的状态。',
        actionText: '去学新词',
        onAction: function () { switchTab('new'); }
      }));
      root.appendChild(e);
      return;
    }

    var card = h('div', 'card');
    var stage = h('div');
    card.appendChild(stage);
    root.appendChild(card);

    var idx = 0, rightCount = 0;
    var sessionStats = [];
    var sessionStart = Date.now();   // 用于记录单题用时

    function renderQ() {
      stage.innerHTML = '';
      if (idx >= due.length) { renderDone(); return; }
      sessionStart = Date.now();     // 每次进入新题重置单题计时
      var item = due[idx];
      var w = wordById(item.id);
      if (!w) { idx++; return renderQ(); }

      // 进度
      var head2 = h('div', 'card-head');
      var prog = h('div');
      prog.style.cssText = 'flex:1';
      var top = h('div');
      top.style.cssText = 'display:flex;justify-content:space-between;font-size:12.5px;color:var(--text-3);margin-bottom:6px';
      top.appendChild(h('span', null, '进度 ' + (idx + 1) + ' / ' + due.length));
      top.appendChild(h('span', null, '本轮正确 ' + rightCount));
      prog.appendChild(top);
      var bar = h('div', 'bar');
      var fill = h('i');
      fill.style.width = (idx / due.length * 100) + '%';
      bar.appendChild(fill);
      prog.appendChild(bar);
      head2.appendChild(prog);
      var card2 = wordById(item.id);
      var q = h('span', 'tag grey', (card2.lv || '') + ' · ' + w.th);
      head2.appendChild(q);
      stage.appendChild(head2);

      // 词卡（先遮住释义）
      var ws = h('div', 'wordstage');
      var wc = h('div', 'wordcard');
      var wrow = h('div');
      wrow.style.cssText = 'display:flex;align-items:center;gap:12px';
      var sb = h('button', 'speak-btn', '🔊');
      sb.title = '朗读（点击慢速再点一次放慢）';
      sb.onclick = function () {
        if (sb.classList.contains('playing')) { speechSynthesis.cancel(); sb.classList.remove('playing'); }
        else { ui.tts.speak(w.w); sb.classList.add('playing'); }
      };
      wrow.appendChild(sb);
      var wtxt = h('div');
      wtxt.appendChild(h('div', 'w-word', w.w));
      // 音标 + 口型
      if (w.ipa) {
        var ipaRow = h('div', 'w-ipa');
        var ipaTxt = h('span', null, w.ipa);
        ipaTxt.style.cursor = 'pointer';
        ipaTxt.title = '点击查看该音标的舌位与口型';
        ipaTxt.onclick = function (e) { e.stopPropagation(); showIpaDetail(w.ipa, w.w); };
        ipaRow.appendChild(ipaTxt);
        // 音素可点击
        var PL = global.PhonemeLib;
        if (PL) {
          var phs = PL.splitPhonemes(w.ipa);
          if (phs.length > 1) {
            var chips = h('span');
            chips.style.cssText = 'display:flex;gap:4px;flex-wrap:wrap;margin-top:5px';
            phs.forEach(function (sym) {
              var info = PL.lookup(sym);
              if (!info) return;
              var chip = h('span', null, info.ipa);
              chip.style.cssText = 'font-size:10.5px;padding:1px 6px;border-radius:5px;cursor:pointer;' +
                'background:' + (info.kind === 'vowel' ? '#eef2ff' : '#e8f7f0') + ';color:' +
                (info.kind === 'vowel' ? '#3b62d9' : '#17805a');
              chip.onclick = function (e) { e.stopPropagation(); showIpaDetail(w.ipa, w.w, sym); };
              chips.appendChild(chip);
            });
            ipaRow.appendChild(chips);
          }
        }
        wtxt.appendChild(ipaRow);
      }
      wrow.appendChild(wtxt);
      wc.appendChild(wrow);

      // 释义（模糊遮罩）
      var cnWrap = h('div', 'w-hide');
      cnWrap.style.cursor = 'pointer';
      cnWrap.title = '点击揭示释义';
      cnWrap.appendChild(h('div', 'w-cn', w.cn));
      if (w.p) cnWrap.appendChild(h('div', 'w-pos', VC ? posCn(w.p) : w.p));
      cnWrap.onclick = function () { cnWrap.classList.toggle('w-hide'); };
      wc.appendChild(cnWrap);

      if (w.ex) wc.appendChild(h('div', 'w-ex', w.ex));
      // 复习元信息
      var meta = h('div');
      meta.style.cssText = 'font-size:11.5px;color:var(--text-3);margin-top:4px';
      meta.textContent = '第 ' + (item.reps + 1) + ' 次复习 · 间隔 ' + (item.overdue > 0 ? '已逾期 ' + item.overdue + ' 天' : '今天到期') + ' · 难度因子 ' + item.ef.toFixed(2);
      wc.appendChild(meta);
      ws.appendChild(wc);
      stage.appendChild(ws);

      var hint = h('div');
      hint.style.cssText = 'text-align:center;font-size:12.5px;color:var(--text-3);margin-bottom:12px';
      hint.textContent = '先在心里回忆释义 → 点击卡片揭示 → 再评估你的记忆强度';
      stage.appendChild(hint);

      // 评分按钮
      var gradeWrap = h('div');
      gradeWrap.style.cssText = 'display:grid;grid-template-columns:repeat(5,1fr);gap:8px';
      VC.SCIENCE.grades.forEach(function (g) {
        var b = h('button');
        b.style.cssText = 'padding:11px 4px;border-radius:9px;border:1.5px solid ' + g.color +
          ';background:var(--surface);font-size:12px;font-weight:600;color:var(--text);transition:all .14s';
        b.innerHTML = '<div style="font-size:12.5px;font-weight:700;color:' + g.color + '">' + g.label + '</div>' +
          '<div style="font-size:10.5px;color:var(--text-3);margin-top:2px">' + g.hint + '</div>';
        b.onmouseenter = function () { b.style.background = g.color + '14'; };
        b.onmouseleave = function () { b.style.background = 'var(--surface)'; };
        b.onclick = function () { submit(g.q); };
        gradeWrap.appendChild(b);
      });
      stage.appendChild(gradeWrap);

      // 上次复习预测
      var predict = h('div');
      predict.style.cssText = 'margin-top:12px;padding:10px 12px;background:var(--surface-2);border-radius:9px;font-size:12px;color:var(--text-2)';
      var ef = item.ef, reps = item.reps;
      var nextIv = reps === 0 ? 1 : (reps === 1 ? 3 : Math.round((item.reps + 1 > 1 ? Math.max(3, item.overdue || 1) * ef : 3)));
      predict.innerHTML = '📅 <b>记忆预测</b>：若本次评为"答对"，下次间隔约 <b>' + Math.max(1, Math.round(Math.max(3, (reps + 1) * ef))) + ' 天</b>；' +
        '评为"完全忘记"则明天重来。SM-2 会依据你的表现自动调整难度因子（当前 ' + ef.toFixed(2) + '）。';
      stage.appendChild(predict);

      function submit(q) {
        var nc = S.applyReview(item.id, q);
        // 自动写入进度记忆系统
        if (global.Progress) {
          global.Progress.recordWord(item.id, nc, q, sessionStart ? Date.now() - sessionStart : 0);
          global.Progress.recordSession('vocab', 0.5, String(item.id));
        }
        sessionStats.push({ q: q, w: w });
        if (q >= 3) rightCount++;
        // 即时反馈
        var fb = h('div', 'feedback ' + (q >= 3 ? 'ok' : 'no'));
        var days = nc.ivl;
        fb.innerHTML = q >= 3
          ? '✓ 记住啦。<b>' + w.w + '</b> 将于 <b>' + days + ' 天后</b>再次出现（间隔 ' + nc.ivl + ' 天，难度因子 ' + nc.ef.toFixed(2) + '）。<br>' +
          '<span style="opacity:.85">' + (q === 4 ? '秒答说明已达到长期记忆标准，间隔会大幅拉长。' : '下次会间隔更久再考你。') + '</span>'
          : '✗ 没关系。<b>' + w.w + '</b> = ' + w.cn + '。<b>明天会再来考你一次</b>——遗忘后的间隔重置是刻意设计，不是惩罚。';
        stage.appendChild(fb);
        // 更新该词卡
        var wrow2 = stage.querySelector('.w-word');
        if (wrow2) wrow2.textContent = w.w + ' = ' + w.cn;
        var cn = stage.querySelector('.w-cn');
        if (cn) cn.parentNode.classList.remove('w-hide');
        $$('.card .bar > i', stage).forEach(function (f) { });
        fill.style.width = ((idx + 1) / due.length * 100) + '%';
        setTimeout(function () { idx++; renderQ(); }, q >= 3 ? 950 : 1900);
      }
    }

    function renderDone() {
      stage.innerHTML = '';
      var e = h('div', 'empty-state');
      e.appendChild(h('div', 'e-ico', rightCount / Math.max(1, due.length) > .8 ? '🎉' : '💪'));
      e.appendChild(h('div', 'e-txt', '本轮复习完成：' + due.length + ' 个词，正确率 ' +
        Math.round(rightCount / Math.max(1, due.length) * 100) + '%'));
      stage.appendChild(e);

      // 记忆稳定性分析
      var stats = h('div');
      stats.style.marginTop = '18px';
      var v = S.vocabStats();
      stats.innerHTML =
        '<div class="grid g3">' +
        '<div class="stat"><div class="lbl">成熟词（间隔≥21天）</div><div class="val">' + v.mature + '<small>词</small></div></div>' +
        '<div class="stat"><div class="lbl">学习中</div><div class="val">' + v.learning + '<small>词</small></div></div>' +
        '<div class="stat"><div class="lbl">累计接触</div><div class="val">' + v.seenTotal + '<small>词</small></div></div>' +
        '</div>';
      stage.appendChild(stats);

      var science = h('div');
      science.style.cssText = 'margin-top:14px;padding:12px 14px;background:var(--primary-soft);border-radius:9px;font-size:12.5px;color:#34529f;line-height:1.75';
      science.innerHTML = '<b>为什么重复 3 次以上才叫"记住"？</b><br>' +
        '提取练习的效果随提取次数累积：第 1 次提取约 40% 正确，第 2 次 56%，第 3 次 72%，一周后仍达 80%（Karpicke & Roediger, 2008）。' +
        '而反复阅读组 4 次之后仍停在 40%。所以本站把"掌握"定义为<b>间隔 ≥21 天且无遗忘记录</b>，而不是"看过"。';
      stage.appendChild(science);

      var row = h('div', 'btn-row');
      row.style.justifyContent = 'center';
      row.style.marginTop = '18px';
      var b1 = h('button', 'btn', '学新词');
      b1.onclick = function () { switchTab('new'); };
      var b2 = h('button', 'btn ghost', '去自测');
      b2.onclick = function () { switchTab('quiz'); };
      row.appendChild(b1); row.appendChild(b2);
      stage.appendChild(row);

      var got = S.checkBadges();
      got.forEach(function (bd, i) { setTimeout(function () { ui.toast(bd.icon + ' 获得徽章：' + bd.name, 3200); }, 500 + i * 600); });
      ui.maybeSurprise(0.4);
    }

    renderQ();
  }

  function posCn(p) {
    return { n: '名词', v: '动词', adj: '形容词', adv: '副词', pron: '代词', prep: '介词', conj: '连词', num: '数词', phr: '短语', interj: '感叹词' }[p] || p;
  }

  /* ---------- 音标 + 舌位口型 弹层（词卡与词表共用） ---------- */
  function showIpaDetail(ipa, word, focusSym) {
    var PL = global.PhonemeLib;
    if (!PL) return;
    ui.openSheet((word ? word + '  ' : '') + ipa, function (sheet) {
      // 整体读音
      if (word) {
        var top = h('div');
        top.style.cssText = 'text-align:center;padding:14px;background:var(--surface-2);border-radius:11px;margin-bottom:14px';
        var b1 = h('button', 'btn sm', '🔊 正常语速');
        b1.onclick = function () { ui.tts.speak(word); };
        var b2 = h('button', 'btn sm ghost', '🐢 慢速');
        b2.onclick = function () { ui.tts.slow(word); };
        b2.style.marginLeft = '8px';
        top.appendChild(b1); top.appendChild(b2);
        sheet.appendChild(top);
      }

      // 拆音素
      var phs = PL.splitPhonemes(ipa);
      if (phs.length) {
        var lbl = h('div', null, '音素分解（点击查看舌位与口型）');
        lbl.style.cssText = 'font-size:11.5px;font-weight:700;color:#8b93a7;margin-bottom:8px';
        sheet.appendChild(lbl);
        var row = h('div');
        row.style.cssText = 'display:flex;gap:7px;flex-wrap:wrap';
        phs.forEach(function (sym) {
          var info = PL.lookup(sym);
          if (!info) {
            var unk = h('span', null, sym);
            unk.style.cssText = 'font-family:var(--mono);font-size:14px;padding:5px 10px;border-radius:8px;background:#f3f4f6;color:#9ca3af';
            row.appendChild(unk);
            return;
          }
          var isV = info.kind === 'vowel';
          var b = h('button');
          var hl = focusSym && sym === focusSym;
          b.style.cssText = 'padding:7px 13px;border-radius:9px;font-size:15px;font-family:var(--mono);font-weight:700;' +
            'background:' + (hl ? (isV ? '#eef2ff' : '#e8f7f0') : '#fbfcfd') + ';' +
            'color:' + (isV ? '#3b62d9' : '#17805a') + ';' +
            'border:1.5px solid ' + (hl ? (isV ? '#4f7cff' : '#22b07d') : 'var(--border)') + ';cursor:pointer';
          b.textContent = info.ipa;
          b.title = info.name;
          b.onclick = function () { showOne(sheet, sym); };
          row.appendChild(b);
        });
        sheet.appendChild(row);
      }

      // 默认展示第一个或指定音素
      showOne(sheet, focusSym || (phs.filter(function (s) { return PL.lookup(s); })[0] || phs[0]));
    });
  }

  /** 在 sheet 内渲染单个音素详情 */
  function showOne(sheet, sym) {
    // 移除旧详情
    var old = sheet.querySelector('#__phDetail');
    if (old) old.remove();
    var PL = global.PhonemeLib;
    var c = PL.lookup(sym);
    var box = h('div');
    box.id = '__phDetail';
    if (!c) {
      box.style.cssText = 'margin-top:16px;padding:12px;background:var(--surface-2);border-radius:9px;font-size:13px;color:var(--text-3)';
      box.textContent = '该音素暂无详解（可能是不常见的符号）';
      sheet.appendChild(box);
      return;
    }
    var isVowel = c.kind === 'vowel';
    box.style.cssText = 'margin-top:16px;padding:15px;border-radius:12px;border:1px solid var(--border);background:var(--surface-2)';

    function blk(k, v, color) {
      var d = h('div');
      d.style.marginTop = '9px';
      var kk = h('div', null, k);
      kk.style.cssText = 'font-size:11px;font-weight:700;color:' + (color || '#a6adbd') + ';letter-spacing:.04em';
      d.appendChild(kk);
      var vv = h('div', null, v);
      vv.style.cssText = 'font-size:13.5px;line-height:1.8;color:var(--text);margin-top:2px';
      d.appendChild(vv);
      box.appendChild(d);
    }

    var head = h('div');
    head.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:4px';
    var big = h('b', null, c.ipa);
    big.style.cssText = 'font-size:24px;font-family:var(--mono);color:' + (isVowel ? '#3b62d9' : '#17805a');
    head.appendChild(big);
    head.appendChild(h('b', null, c.name));
    var tg = h('span', 'tag grey', c.type);
    tg.style.marginLeft = 'auto';
    head.appendChild(tg);
    box.appendChild(head);

    if (isVowel && c.x !== undefined) {
      blk('舌位坐标', '前后 ' + c.x + '/100　·　高低 ' + c.y + '/100' +
        (c.x2 !== undefined ? '　→　滑动至 ' + c.x2 + '/' + c.y2 : ''), '#4f7cff');
    }
    blk('👄 口型', c.mouth, '#e2585f');
    blk('👅 舌位', c.tongue, '#22b07d');
    blk('发音要领', c.how, '#f0a020');
    blk('⚠️ 中国学习者常见错', c.pitfall, '#e2585f');
    if (c.contrast) blk('易混对比', c.contrast, '#8a6d1a');

    sheet.appendChild(box);
  }

  /* ============================================================
     B. 新词学习（微习惯）
     ============================================================ */
  function newView(root) {
    var lv = ui.currentLevel();
    var head = h('page-head-placeholder');
    // L5/L6 词库按需加载：先渲染骨架，等词库到位再填内容
    if (lv === 'L5' || lv === 'L6') {
      head = h('div', 'page-head');
      head.appendChild(h('h1', null, '学习新词'));
      var tip = h('p', null, '正在加载 ' + lv + ' 词库（约 415KB，仅首次需要）…');
      root.appendChild(head);
      root.appendChild(global.UI.loadingState(5, { label: '加载词库' }));
      S.ensureLevel(lv).then(function () {
        global.UI.clear(root);
        newView(root);
      });
      return;
    }
    head = h('div', 'page-head');
    head.appendChild(h('h1', null, '学习新词'));
    head.appendChild(h('p', null, '新词先"过眼"，明天起进入间隔重复队列。今天只看一遍是对的——真正的记忆发生在明天的提取。'));
    root.appendChild(head);

    var pool = allWords().filter(function (w) { return w.lv === lv && !S.state.words[w.id]; });
    var lvl = global.PathContent.levelById(lv);
    // 关键：筛选用的等级必须与选中态一致，否则 pool 永远为空
    levelOverride = lv;

    var ctrl = h('div', 'card');
    var row = h('div');
    row.style.cssText = 'display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:14px';
    var seg = h('div', 'segment');
    LEVELS_ALL.forEach(function (id) {
      var locked = !S.state.unlocked[id];
      var b = h('button', id === lv ? 'on' : null,
        id + ' ' + global.PathContent.levelById(id).name + (locked ? ' 🔒' : ''));
      if (locked) b.classList.add('locked');
      b.title = locked ? '未在推荐路径内，但词表仍可自由学习' : '';
      b.onclick = function () {
        // 词库全量开放：所有等级的词表都可随时查看与学习。
        // 锁定只表示「不推荐在这个阶段学」——路径是建议顺序，不是权限。
        // L5/L6 首次进入需先加载对应词库（约 415KB），加载后再渲染
        levelOverride = id;
        $$('.segment button', seg).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        if (id === 'L5' || id === 'L6') {
          b.disabled = true;
          b.textContent = id + ' 加载中…';
          S.ensureLevel(id).then(function () {
            b.disabled = false;
            b.textContent = id + ' ' + global.PathContent.levelById(id).name + (locked ? ' 🔒' : '');
            syncThemeOptions();
            render();
          });
          return;
        }
        syncThemeOptions();
        render();
      };
      seg.appendChild(b);
    });
    row.appendChild(seg);

    /* ---- 全库搜索：不受等级限制，任何时候都能查任意词 ---- */
    var searchWrap = h('div');
    searchWrap.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px';
    var searchIn = h('input', 'input');
    searchIn.type = 'search';
    searchIn.placeholder = '搜索全部 5449 词（支持英文 / 中文 / 模糊匹配）';
    searchIn.style.cssText = 'flex:1;min-width:220px;padding:9px 13px;border:1px solid var(--border);border-radius:9px;font-size:13.5px';
    var searchBtn = h('button', 'btn sm', '搜索');
    searchBtn.type = 'button';
    searchWrap.appendChild(searchIn);
    searchWrap.appendChild(searchBtn);
    row.appendChild(searchWrap);

    var resultBox = h('div');
    root.appendChild(resultBox);

    function doSearch() {
      global.UI.clear(resultBox);
      var q = searchIn.value.trim();
      if (!q) return;
      var pool = allWords();
      var lower = q.toLowerCase();
      var hits = pool.filter(function (w) {
        return (w.w && w.w.toLowerCase().indexOf(lower) >= 0)
          || (w.cn && String(w.cn).toLowerCase().indexOf(lower) >= 0);
      });
      // 按精确匹配 → 前缀匹配 → 包含匹配排序
      hits.sort(function (a, b) {
        var aw = a.w.toLowerCase(), bw = b.w.toLowerCase();
        var sa = aw === lower ? 0 : aw.indexOf(lower) === 0 ? 1 : 2;
        var sb = bw === lower ? 0 : bw.indexOf(lower) === 0 ? 1 : 2;
        return sa !== sb ? sa - sb : aw.length - bw.length;
      });
      var total = hits.length;
      hits = hits.slice(0, 60);

      var head = h('div');
      head.style.cssText = 'font-size:13px;color:var(--text-2);margin-bottom:10px';
      head.textContent = '找到 ' + total + ' 个匹配' + (total > 60 ? '（仅显示前 60）' : '');
      resultBox.appendChild(head);

      if (!hits.length) {
        var e = h('div', 'empty-state');
        e.appendChild(h('div', 'e-ico', '🔍'));
        e.appendChild(h('div', 'e-txt', '没有找到匹配的词。试试更短的关键词。'));
        resultBox.appendChild(e);
        return;
      }

      var g = h('div', 'grid');
      g.style.gridTemplateColumns = 'repeat(auto-fill,minmax(190px,1fr))';
      hits.forEach(function (w) {
        var card = h('div');
        card.style.cssText = 'padding:11px 13px;border:1px solid var(--border);border-radius:10px;background:var(--surface)';
        var top = h('div');
        top.style.cssText = 'display:flex;align-items:baseline;gap:7px;flex-wrap:wrap';
        var bw = h('b', null, w.w);
        bw.style.cssText = 'font-size:15px;cursor:pointer';
        bw.onclick = function () { ui.tts.speak(w.w); };
        top.appendChild(bw);
        var sp = h('button', 'mini-btn', '🔊');
        sp.style.fontSize = '11px';
        sp.onclick = function (e) { e.stopPropagation(); ui.tts.speak(w.w); };
        top.appendChild(sp);
        var lvTag = h('span', 'tag grey', w.lv);
        lvTag.style.fontSize = '10px';
        top.appendChild(lvTag);
        if (S.state.words[w.id]) {
          var seen = h('span', null, '已学');
          seen.style.cssText = 'font-size:10px;color:#17805a;font-weight:700';
          top.appendChild(seen);
        }
        card.appendChild(top);
        if (w.ipa) {
          var ip = h('div', null, w.ipa);
          ip.style.cssText = 'font-family:var(--mono);font-size:12px;color:var(--primary-dark);margin-top:3px';
          card.appendChild(ip);
        }
        if (w.cn) {
          var cn = h('div', null, w.cn);
          cn.style.cssText = 'font-size:12.5px;color:var(--text-2);margin-top:2px';
          card.appendChild(cn);
        }
        g.appendChild(card);
      });
      resultBox.appendChild(g);
    }

    searchBtn.onclick = doSearch;
    searchIn.onkeydown = function (e) { if (e.key === 'Enter') doSearch(); };

    var themeSel = h('select', 'input');
    themeSel.style.cssText = 'max-width:200px';
    /** 按当前等级重建主题下拉项（切等级时主题集合会变） */
    function syncThemeOptions() {
      themeSel.innerHTML = '';
      ['ALL'].concat(VC.themesOf(levelOverride)).forEach(function (t) {
        var o = h('option', null, t === 'ALL' ? '全部主题' : t);
        o.value = t;
        themeSel.appendChild(o);
      });
    }
    syncThemeOptions();
    row.appendChild(themeSel);

    var cntIn = h('input', 'input');
    cntIn.type = 'number'; cntIn.value = S.state.settings.dailyNew; cntIn.min = 1; cntIn.max = 999;
    cntIn.style.cssText = 'width:80px';
    row.appendChild(cntIn);
    var cntLbl = h('span', null, '个/次');
    cntLbl.style.cssText = 'font-size:13px;color:var(--text-3)';
    row.appendChild(cntLbl);

    // 快捷预设：默认 12 个（符合 Krashen 每日新词上限），也可直接看全量词表
    var presets = h('div', 'segment');
    [{ v: 12, t: '每日12' }, { v: 30, t: '浏览30' }, { v: 100, t: '浏览100' }, { v: 9999, t: '全部' }].forEach(function (p) {
      var b = h('button', p.v === S.state.settings.dailyNew ? 'on' : null, p.t);
      b.onclick = function () {
        cntIn.value = p.v;
        $$('.segment button', presets).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        render();
      };
      presets.appendChild(b);
    });
    row.appendChild(presets);
    var hint = h('div');
    hint.style.cssText = 'font-size:11.5px;color:var(--text-3);width:100%;margin-top:-4px';
    hint.textContent = '「每日12」是推荐学习量；「全部」用于通览词表，浏览器卡顿时用小数字。';
    row.appendChild(hint);

    ctrl.appendChild(row);
    root.appendChild(ctrl);

    var listBox = h('div', 'card');
    root.appendChild(listBox);

    function render() {
      var pool2 = allWords().filter(function (w) {
        return w.lv === levelOverride && !S.state.words[w.id]
          && (themeSel.value === 'ALL' || w.th === themeSel.value);
      });
      listBox.innerHTML = '';
      var ch = h('div', 'card-head');
      ch.appendChild(h('h3', null, '待学词表（' + pool2.length + ' 个）'));
      var info = h('span', 'sub', global.PathContent.levelById(levelOverride).dailyPlan);
      ch.appendChild(info);
      listBox.appendChild(ch);

      if (!pool2.length) {
        var e = h('div', 'empty-state');
        e.appendChild(h('div', 'e-ico', '🎯'));
        e.appendChild(h('div', 'e-txt', '该等级的新词已全部学过。可以切换其他等级或主题。'));
        listBox.appendChild(e);
        return;
      }

      // 上限 600：再大浏览器会卡死，超过则提示用筛选
      var want = +cntIn.value || 12;
      var CAP = 600;
      var picked = pool2.slice(0, Math.min(CAP, want));
      if (pool2.length > CAP && want >= CAP) {
        var cap = h('div');
        cap.style.cssText = 'padding:9px 13px;background:var(--warn-soft);border-radius:9px;font-size:12.5px;color:#8a6a1a;margin-bottom:10px';
        cap.textContent = '为避免浏览器卡顿，单次最多显示 ' + CAP + ' 个。本级还有 ' +
          (pool2.length - CAP) + ' 个未显示——可切换主题缩小范围，或用左侧数量框调小。';
        listBox.appendChild(cap);
      }
      var grid = h('div', 'grid');
      grid.style.gridTemplateColumns = 'repeat(auto-fill,minmax(168px,1fr))';
      picked.forEach(function (w) {
        var it = h('div');
        it.style.cssText = 'padding:11px 13px;border:1px solid var(--border);border-radius:10px;background:var(--surface)';
        var r1 = h('div');
        r1.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:6px';
        var wb = h('b', null, w.w);
        wb.style.cssText = 'font-size:15.5px;letter-spacing:-.01em';
        r1.appendChild(wb);
        var sp = h('button', 'mini-btn', '🔊');
        sp.onclick = function (e) { e.stopPropagation(); ui.tts.speak(w.w); };
        r1.appendChild(sp);
        it.appendChild(r1);
        var cn = h('div', null, w.cn);
        cn.style.cssText = 'font-size:13px;color:var(--text-2);margin-top:2px';
        it.appendChild(cn);
        // 高考词库带音标，直接显示（原词库经回填后也有）
        if (w.ipa) {
          var ipa = h('div', null, w.ipa);
          ipa.style.cssText = 'font-size:11px;color:var(--primary-dark);font-family:var(--mono);margin-top:1px;cursor:pointer';
          ipa.title = '点击查看舌位与口型';
          ipa.onclick = function (e) { e.stopPropagation(); showIpaDetail(w.ipa, w.w); };
          it.appendChild(ipa);
        }
        var meta = h('div');
        meta.style.cssText = 'font-size:11px;color:var(--text-3);margin-top:3px;display:flex;gap:5px;flex-wrap:wrap';
        var t1 = h('span', 'tag grey', w.th);
        meta.appendChild(t1);
        if (w.ex) {
          var ex = h('span');
          // 高考库 ex 存的是词形变化（d:/p:/i:），原词库存的是搭配
          var isForm = /^[dip3rt0]:/.test(w.ex);
          ex.textContent = isForm
            ? '词形：' + w.ex.split('/').map(function (x) { return x.split(':')[1]; }).filter(Boolean).join('/')
            : w.ex;
          ex.style.cssText = 'color:var(--text-3);font-size:10.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%';
          ex.title = w.ex;
          meta.appendChild(ex);
        }
        it.appendChild(meta);
        grid.appendChild(it);
      });
      listBox.appendChild(grid);

      var act = h('div', 'btn-row');
      act.style.marginTop = '16px';
      var b = h('button', 'btn lg', '加入今日复习队列（' + picked.length + ' 词）');
      b.onclick = function () {
        picked.forEach(function (w) { S.initNewWord(w.id); });
        var d = S.dayStat();
        d.newWords += picked.length;
        S.addMinutes(Math.ceil(picked.length * 0.5));
        S.save();
        ui.toast('已加入 ' + picked.length + ' 个词，明天开始复习');
        render();
        var got = S.checkBadges();
        got.forEach(function (bd, i) { setTimeout(function () { ui.toast(bd.icon + ' ' + bd.name, 3000); }, 600 + i * 500); });
      };
      act.appendChild(b);
      listBox.appendChild(act);

      var note = h('div');
      note.style.cssText = 'margin-top:14px;padding:11px 13px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.7';
      note.innerHTML = '<b>新词量的科学边界</b>：一次性记 20 个以上新词，7 天后平均遗忘率超 80%。' +
        'Krashen 的输入假说建议每日新词 10-15 个，配合次日提取复习，才能形成长期记忆。' +
        '本站默认每日 12 个新词 + 全部到期复习，是效率与遗忘曲线平衡的结果。';
      listBox.appendChild(note);
    }

    render();
    themeSel.onchange = render;
    cntIn.oninput = function () { clearTimeout(cntIn._t); cntIn._t = setTimeout(render, 400); };
  }
  /** 模块级：当前选中的等级。切标签页时重置为学习者实际所在等级，
      避免上一次操作残留导致「词表 0 个」或显示错等级 */
  var levelOverride = null;

  /* ============================================================
     C. 自测测验（提取练习）
     ============================================================ */
  function quizView(root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '词汇自测'));
    head.appendChild(h('p', null, '四选一，题目从当前已学词 + 同级词中动态生成，保证 85% 可解 + 15% 挑战（i+1 原则）。'));
    root.appendChild(head);

    var cfg = h('div', 'card');
    var row = h('div');
    row.style.cssText = 'display:flex;gap:12px;align-items:center;flex-wrap:wrap';
    var seg = h('div', 'segment');
    var lvSel = 'L1';
    ['ALL'].concat(LEVELS_ALL).forEach(function (id) {
      var b = h('button', id === 'ALL' ? 'on' : null, id === 'ALL' ? '全部' : id);
      b.onclick = function () {
        lvSel = id;
        $$('.segment button', seg).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
      };
      seg.appendChild(b);
    });
    row.appendChild(seg);
    var cnt = h('input', 'input');
    cnt.type = 'number'; cnt.value = 10; cnt.min = 4; cnt.max = 30; cnt.style.width = '70px';
    row.appendChild(cnt); row.appendChild(h('span', null, '题'));
    var start = h('button', 'btn', '开始测验');
    start.onclick = begin;
    row.appendChild(start);
    cfg.appendChild(row);
    root.appendChild(cfg);

    var quizBox = h('div');
    root.appendChild(quizBox);
    if (!quizBox.dataset.started) {
      var e = h('div', 'card');
      var es = h('div', 'empty-state');
      es.appendChild(h('div', 'e-ico', '📝'));
      es.appendChild(h('div', 'e-txt', '选择范围和题量后点击"开始测验"'));
      e.appendChild(es);
      quizBox.appendChild(e);
    }

    function begin() {
      quizBox.innerHTML = '';
      quizBox.dataset.started = '1';
      var qs = VC.buildQuiz(lvSel, 'ALL', Math.min(+cnt.value || 10, 30));
      var qi = 0, right = 0, wrongs = [];
      renderQ();

      function renderQ() {
        quizBox.innerHTML = '';
        if (qi >= qs.length) return finish();
        var q = qs[qi];
        var card = h('div', 'card');
        var hd = h('div', 'card-head');
        var p = h('div'); p.style.flex = '1';
        var top = h('div');
        top.style.cssText = 'display:flex;justify-content:space-between;font-size:12.5px;color:var(--text-3);margin-bottom:6px';
        top.appendChild(h('span', null, '第 ' + (qi + 1) + ' / ' + qs.length + ' 题'));
        top.appendChild(h('span', null, '正确 ' + right));
        p.appendChild(top);
        var bar = h('div', 'bar');
        var fi = h('i'); fi.style.width = (qi / qs.length * 100) + '%';
        bar.appendChild(fi); p.appendChild(bar);
        hd.appendChild(p);
        var tag = h('span', 'tag grey', q.mode === 'cn2en' ? '中译英' : q.mode === 'en2cn' ? '英译中' : q.mode === 'cloze' ? '句子填空' : '听音辨义');
        hd.appendChild(tag);
        card.appendChild(hd);

        // 题干
        var prompt = h('div');
        prompt.style.cssText = 'font-size:26px;font-weight:700;text-align:center;padding:20px 0;letter-spacing:-.01em';
        if (q.mode === 'listen') {
          var sp = h('button', 'speak-btn');
          sp.style.cssText = 'width:52px;height:52px;font-size:22px;margin:0 auto 8px';
          sp.textContent = '🔊';
          sp.onclick = function () { ui.tts.speak(q.word.w); };
          prompt.appendChild(sp);
          prompt.appendChild(h('div', null, '点击听音，选出正确释义'));
          prompt.lastChild.style.cssText = 'font-size:13px;color:var(--text-3);font-weight:400';
        } else if (q.mode === 'cloze' && q.hint) {
          prompt.appendChild(h('div', null, q.prompt));
          prompt.lastChild.style.cssText = 'font-size:19px;font-weight:500;line-height:1.6';
        } else {
          prompt.appendChild(h('div', null, q.prompt));
          if (q.mode === 'cn2en') {
            prompt.lastChild.style.fontSize = '24px';
          }
        }
        card.appendChild(prompt);

        var opts = h('div', 'opts');
        var answered = false;
        q.options.forEach(function (o, oi) {
          var b = h('button', 'opt');
          b.appendChild(h('div', 'k', 'ABCD'[oi]));
          b.appendChild(h('div', null, o.text));
          b.onclick = function () {
            if (answered) return;
            answered = true;
            var ok = o.ok;
            if (ok) right++;
            else wrongs.push(q.word);
            $$('.opt', opts).forEach(function (x) { x.classList.add('locked'); });
            b.classList.add(ok ? 'ok' : 'no');
            if (!ok) {
              $$('.opt', opts).forEach(function (x, xi) { if (q.options[xi].ok) x.classList.add('ok'); });
            }
            S.recordAnswer(ok);
            var fb = h('div', 'feedback ' + (ok ? 'ok' : 'no'));
            fb.innerHTML = ok
              ? '✓ 正确。<b>' + q.word.w + '</b> = ' + q.word.cn + (q.word.ex ? '<br><span style="opacity:.85">搭配：' + q.word.ex + '</span>' : '')
              : '✗ 正确答案：<b>' + (q.mode === 'en2cn' ? q.word.cn : q.word.w) + '</b><br><b>' + q.word.w + '</b> = ' + q.word.cn +
              (q.word.ex ? '<br><span style="opacity:.85">搭配：' + q.word.ex + '</span>' : '') +
              '<br><span style="opacity:.85">这个词已加入高优先级复习队列。</span>';
            // 错的词提升复习优先级（降低 ef）
            var c = S.getCard(q.word.id) || S.initNewWord(q.word.id);
            c.ef = Math.max(1.3, c.ef - 0.25);
            c.due = S.today();
            S.save();
            card.appendChild(fb);
            var nx = h('button', 'btn');
            nx.style.marginTop = '12px';
            nx.textContent = qi === qs.length - 1 ? '查看结果 →' : '下一题 →';
            nx.onclick = function () { qi++; renderQ(); };
            card.appendChild(nx);
            if (ok) {
              var sp2 = h('button', 'mini-btn', '🔊 朗读');
              sp2.style.marginLeft = '8px';
              sp2.onclick = function () { ui.tts.speak(q.word.w); };
              nx.parentNode.appendChild(sp2);
            }
          };
          opts.appendChild(b);
        });
        card.appendChild(opts);
        quizBox.appendChild(card);
      }

      function finish() {
        quizBox.innerHTML = '';
        var card = h('div', 'card');
        var pct = Math.round(right / qs.length * 100);
        var es = h('div', 'empty-state');
        es.appendChild(h('div', 'e-ico', pct >= 85 ? '🎉' : pct >= 70 ? '👍' : '📖'));
        es.appendChild(h('div', 'e-txt', '正确率 ' + pct + '%（' + right + '/' + qs.length + '）'));
        card.appendChild(es);

        if (wrongs.length) {
          var wh = h('div');
          wh.style.cssText = 'margin-top:16px';
          wh.appendChild(h('h4', null, '需要加强的词'));
          wh.lastChild.style.cssText = 'font-size:14px;margin:0 0 10px;font-weight:700';
          var g = h('div', 'grid');
          g.style.gridTemplateColumns = 'repeat(auto-fill,minmax(160px,1fr))';
          wrongs.forEach(function (w) {
            var it = h('div');
            it.style.cssText = 'padding:10px 12px;border:1px solid var(--danger-soft);background:var(--danger-soft);border-radius:9px';
            it.innerHTML = '<b>' + w.w + '</b> <span style="color:var(--text-2)">' + w.cn + '</span>' +
              (w.ex ? '<div style="font-size:11.5px;color:var(--text-3);margin-top:2px">' + w.ex + '</div>' : '');
            g.appendChild(it);
          });
          wh.appendChild(g);
          card.appendChild(wh);
        }

        // 难度建议（i+1 动态调整）
        var sug = h('div');
        sug.style.cssText = 'margin-top:16px;padding:13px 15px;border-radius:10px;font-size:13px;line-height:1.75';
        if (pct >= 85) {
          sug.style.background = 'var(--success-soft)'; sug.style.color = '#14684a';
          sug.innerHTML = '✓ 难度合适。当前水平处于 <b>i+1</b> 最优区间——大部分题可解、少数题需要思考。继续当前难度，' +
            '<b>不要为了轻松而降难度</b>（太简单会触发无聊，无聊同样会中断学习）。';
        } else if (pct >= 70) {
          sug.style.background = 'var(--primary-soft)'; sug.style.color = '#34529f';
          sug.innerHTML = '⚠ 难度略高。根据 <b>Krashen 输入假说</b>，可理解输入应约为 i+1（85% 可解）。' +
            '建议下一轮选择更低的等级范围，或先完成一批到期复习。';
        } else {
          sug.style.background = 'var(--warn-soft)'; sug.style.color = '#8a6a1a';
          sug.innerHTML = '⚠ 正确率低于 70%，建议<b>降一级难度</b>。这不是失败，是自我决定论中的"胜任感"维护——' +
            '持续挫败会消耗胜任需求，直接导致放弃。降难度是为了能重新体验"我能做到"。';
        }
        card.appendChild(sug);

        var row = h('div', 'btn-row');
        row.style.justifyContent = 'center';
        row.style.marginTop = '16px';
        var again = h('button', 'btn', '再测一轮');
        again.onclick = begin;
        row.appendChild(again);
        card.appendChild(row);
        quizBox.appendChild(card);

        var got = S.checkBadges();
        got.forEach(function (bd, i) { setTimeout(function () { ui.toast(bd.icon + ' ' + bd.name, 3000); }, 500 + i * 500); });
        S.addMinutes(Math.ceil(qs.length * 0.4));
      }
    }
  }

  /* ============================================================
     D. 核心词精讲
     ============================================================ */
  function coreView(root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '核心词精讲'));
    head.appendChild(h('p', null, '这 ' + VC.CORE.length + ' 个词是英语最高频的功能核心。零基础优先掌握它们，性价比远高于背冷僻词。'));
    root.appendChild(head);

    var grid = h('div', 'grid g2');
    VC.CORE.forEach(function (c) {
      var card = h('div', 'card');
      var top = h('div');
      top.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:8px';
      var left = h('div');
      var wr = h('div');
      wr.style.cssText = 'display:flex;align-items:center;gap:9px';
      var wb = h('b', null, c.w);
      wb.style.cssText = 'font-size:21px;letter-spacing:-.02em';
      wr.appendChild(wb);
      var sb = h('button', 'speak-btn');
      sb.style.cssText = 'width:30px;height:30px;font-size:13px';
      sb.textContent = '🔊';
      sb.onclick = function () { ui.tts.speak(c.w); };
      wr.appendChild(sb);
      left.appendChild(wr);
      var ipa = h('div', null, c.ipa + ' · ' + c.pos + ' · ' + c.cn);
      ipa.style.cssText = 'font-size:13px;color:var(--text-2);margin-top:2px';
      left.appendChild(ipa);
      top.appendChild(left);
      card.appendChild(top);

      if (c.tip) {
        var tp = h('div', null, '💡 ' + c.tip);
        tp.style.cssText = 'font-size:12.5px;color:var(--text-2);background:var(--warn-soft);padding:8px 11px;border-radius:8px;line-height:1.65;margin-bottom:9px';
        card.appendChild(tp);
      }
      if (c.forms) {
        var fw = h('div');
        fw.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:9px';
        c.forms.forEach(function (f) {
          var t = h('span', 'tag grey', f[0] + ' — ' + f[1]);
          fw.appendChild(t);
        });
        card.appendChild(fw);
      }
      c.ex.forEach(function (e) {
        var row = h('div');
        row.style.cssText = 'padding:6px 0;border-bottom:1px dashed var(--border);display:flex;gap:8px;align-items:flex-start';
        var eb = h('div');
        eb.style.cssText = 'flex:1;font-size:13.5px';
        eb.appendChild(h('div', null, e[0]));
        eb.firstChild.style.fontWeight = '500';
        eb.appendChild(h('div', null, e[1]));
        eb.lastChild.style.cssText = 'font-size:12px;color:var(--text-3)';
        row.appendChild(eb);
        var sp = h('button', 'mini-btn', '🔊');
        sp.onclick = function () { ui.tts.speak(e[0]); };
        row.appendChild(sp);
        card.appendChild(row);
      });
      if (c.confuse) {
        var cf = h('div', null, '⚠️ ' + c.confuse);
        cf.style.cssText = 'margin-top:9px;font-size:12.5px;color:#a83238;background:var(--danger-soft);padding:8px 11px;border-radius:8px;line-height:1.65';
        card.appendChild(cf);
      }
      grid.appendChild(card);
    });
    root.appendChild(grid);

    // 词族与学习科学
    var sci = h('div', 'card');
    sci.style.marginTop = '16px';
    sci.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '记忆科学：SM-2 间隔重复参数'));
    sci.lastChild.appendChild(h('span', 'sub', 'SuperMemo 2 · Piotr Woźniak 1987'));
    var box = h('div', 'chart-box');
    sci.appendChild(box);
    var grades = VC.SCIENCE.grades;
    C.bar(box, {
      height: 200,
      data: grades.map(function (g) { return { label: g.label, value: g.days === 0 ? 1 : g.days, color: g.color, tip: g.label + ' → ' + (g.days === 0 ? '明天重来' : g.days + ' 天后') }; }),
      yMax: 5,
      onClick: null
    });
    var note = h('div');
    note.style.cssText = 'margin-top:12px;font-size:12.5px;color:var(--text-2);line-height:1.75;background:var(--surface-2);padding:12px 14px;border-radius:9px';
    note.innerHTML = '<b>参数说明</b>：难度因子 EF 初值 2.5，每次答对 +0.1（上限 3.2），答错 −0.20（下限 1.3）。' +
      '间隔计算：第 1 次复习 1 天，第 2 次 3 天，此后 IVL × EF。' +
      '<b>为什么"勉强想起"要惩罚？</b>——评分 2 视为失败并重置间隔，因为提取时的高努力程度意味着记忆强度不足；若给长间隔，下次遇到时反而会真忘，形成"过度学习错觉"。';
    sci.appendChild(note);

    // 提取 vs 重复阅读对比
    var c2 = h('div', 'card');
    c2.style.marginTop = '16px';
    c2.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '提取练习 vs 反复阅读'));
    c2.lastChild.appendChild(h('span', 'sub', 'Karpicke & Roediger 2008 · 学习者的错觉'));
    var b2 = h('div', 'chart-box');
    c2.appendChild(b2);
    var ret = VC.SCIENCE.retrieval;
    C.line(b2, {
      height: 210, yMax: 100,
      series: [
        { name: '提取练习组', data: ret.map(function (r) { return { name: r.label, y: r.extract }; }), color: C.PALETTE[1] },
        { name: '重复阅读组', data: ret.map(function (r) { return { name: r.label, y: r.reread }; }), color: C.PALETTE[3], fill: false }
      ],
      xLabel: function (i) { return ret[i].label; },
      yFormat: function (v) { return v + '%'; },
      tipFormat: function (v) { return v + '% 正确率'; }
    });
    var n2 = h('div');
    n2.style.cssText = 'margin-top:12px;font-size:12.5px;color:var(--text-2);line-height:1.75;background:var(--surface-2);padding:12px 14px;border-radius:9px';
    n2.innerHTML = '<b>关键结论</b>：重复阅读 4 次正确率仍停在 40%，因为重读只带来"熟悉感"（fluency），大脑把熟悉误认为记忆。' +
      '提取练习组 4 次后达 80%。<b>这就是本站所有卡片都以"强制回忆"呈现的原因</b>——不提供选项提示，逼你先从记忆里取出来。' +
      '你觉得"眼熟"的那一刻，正是记忆强度最虚弱的时刻。';
    c2.appendChild(n2);
    root.appendChild(c2);
  }

  /* ============================================================
     组装
     ============================================================ */
  var TABS = [
    { id: 'review', label: '今日复习', fn: reviewView, desc: '按 SM-2 队列提取复习' },
    { id: 'new', label: '学新词', fn: newView, desc: '分等级分主题的词表' },
    { id: 'browse', label: '全库浏览', fn: browseView, desc: '5449 词全部开放，随时查阅' },
    { id: 'quiz', label: '自测', fn: quizView, desc: '动态生成测验' },
    { id: 'core', label: '核心词精讲', fn: coreView, desc: '高频功能词详解' }
  ];
  function switchTab(id) {
    var el = document.getElementById('vocabTabs');
    if (el) $$('button', el).forEach(function (b) { b.classList.toggle('on', b.dataset.t === id); });
    var desc = document.getElementById('vocabDesc');
    var t = TABS.find(function (x) { return x.id === id; });
    if (desc && t) desc.textContent = t.desc;
    renderVocab();
  }
  var curTab = 'review';
  function renderVocab() {
    var box = document.getElementById('vocabBody');
    if (!box) return;
    box.innerHTML = '';
    // 每次进入词汇模块时重置等级为学习者当前所在等级
    levelOverride = ui.currentLevel();
    var t = TABS.find(function (x) { return x.id === curTab; }) || TABS[0];
    t.fn(box);
  }

  V.vocab = function (root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '词汇模块'));
    var sub = h('p');
    sub.id = 'vocabDesc';
    sub.textContent = TABS[0].desc;
    head.appendChild(sub);
    root.appendChild(head);

    var seg = h('div', 'segment');
    seg.id = 'vocabTabs';
    seg.style.marginBottom = '16px';
    TABS.forEach(function (t) {
      var b = h('button', t.id === curTab ? 'on' : null, t.label);
      b.dataset.t = t.id;
      b.onclick = function () { curTab = t.id; switchTab(t.id); };
      seg.appendChild(b);
    });
    root.appendChild(seg);

    var body = h('div');
    body.id = 'vocabBody';
    root.appendChild(body);
    renderVocab();
  };

  global.VocabView = { switchTab: switchTab, wordById: wordById, posCn: posCn, showIpaDetail: showIpaDetail };
})(window);