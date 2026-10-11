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
    // 音标/搭配/易混辨析的补全已在数据层（content-vocab-deep1/2/3.js）做完，
    // 并且它们包装了 Store.ensureLevel，所以分片懒加载后也会自动补齐。
    // 这里不再重复处理——多一处就多一个不同步的隐患。
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
    /* 走令牌而非硬编码色值：#f0f5ff 是上一轮废弃的配色，
       且与卡片白底对比仅 1.03，属于「看起来有、实际读不出」的颜色。 */
    note.style.cssText = 'background:linear-gradient(140deg, var(--primary-soft), var(--surface) 60%)';
    var nh = h('div', 'card-head');
    nh.appendChild(h('h3', null, '全库浏览'));
    nh.appendChild(h('span', 'tag l1', '全部开放'));
    note.appendChild(nh);
    var nt = h('div');
    nt.style.cssText = 'font-size:var(--fs-base);line-height:1.85;color:var(--text-2)';
    /* 词数取自 meta，不写死。加词后文案会自动跟上，
       写死的数字会在下一次扩充词库时变成假信息。 */
    var totalWords = (allMeta().total || 0).toLocaleString('en-US');
    nt.innerHTML = '<b>全部 ' + totalWords + ' 词已开放</b>，任何等级都能随时查阅、学习、自测。' +
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

    var state = { q: '', lv: 'ALL', theme: 'ALL', status: 'ALL',
                  band: 'ALL', exam: 'ALL', sort: 'DEFAULT', page: 0 };

    /* 消费「四六级视图」传来的预置筛选。
       必须在这里消费而不是在调用处改 state——
       browseView 每次进入都重建 state，调用时改不到这一份。 */
    var presetExam = null;
    if (pendingBrowse && pendingBrowse.exam) {
      state.exam = pendingBrowse.exam;
      state.sort = 'PRIORITY';   // 按考纲进来，自然该按优先级排
      presetExam = pendingBrowse.exam;
      pendingBrowse = null;
    }
    var PAGE = 120;

    var FILTERS = [
      {
        k: 'lv', opts: [['ALL', '全部等级']].concat(LEVELS_ALL.map(function (id) {
          return [id, id + ' ' + global.PathContent.levelById(id).name];
        }))
      },
      { k: 'status', opts: [['ALL', '全部状态'], ['new', '未学'], ['learning', '学习中'], ['mature', '已掌握']] }
    ];

    /* 词频分档筛选。分档来自 ECDICT 的 frq 排名，与「等级」是
       两个正交维度：等级=难度/阶段，词频=常用度。
       两者都要，因为「L1 里也有低频词」「L6 里也有极高频词」。 */
    var VF = global.VocabFreq;
    var bandFilter = null;
    if (VF && VF.bands.length) {
      bandFilter = {
        k: 'band',
        opts: [['ALL', '全部词频']].concat(VF.bands.map(function (b) {
          return [b.id, b.name];
        }))
      };
    }

    /* 考试体系筛选。四六级是「包含关系」而非难度递增，
       独立成筛选项才能真正做到「按考纲背词」。 */
    var examFilter = null;
    if (VF && VF.exams().length) {
      examFilter = {
        k: 'exam',
        opts: [['ALL', '全部考纲']].concat(VF.exams().map(function (e) {
          return [e.id, e.name + ' ' + e.count];
        }))
      };
    }

    var sortFilter = {
      k: 'sort',
      opts: [['DEFAULT', '默认排序'], ['FREQ', '按词频'], ['PRIORITY', '按学习优先级']]
    };

    var ALL_FILTERS = FILTERS.concat(
      bandFilter ? [bandFilter] : [],
      examFilter ? [examFilter] : [],
      [sortFilter]
    );
    var filterBtns = {};

    ALL_FILTERS.forEach(function (f) {
      f.opts.forEach(function (o) {
        var b = h('button', o[0] === state[f.k] ? 'on' : null, o[1]);
        b.type = 'button';
        b.dataset.k = f.k; b.dataset.v = o[0];
        b.onclick = function () {
          state[f.k] = o[0];
          state.page = 0;
          ui.$$('button', filters).forEach(function (x) {
            if (x.dataset.k === f.k) x.classList.remove('on');
          });
          b.classList.add('on');
          if (f.k === 'lv') { rebuildTheme(); }
          /* L5/L6 分片按需加载（约 415KB）。
             选词频或考纲筛选时也要保证分片已加载——
             否则 cet4/cet6 的词分布在 L5/L6 里，筛出来会是空的。 */
          var needShards = (f.k === 'lv' && (o[0] === 'L5' || o[0] === 'L6'))
            || ((f.k === 'band' || f.k === 'exam' || f.k === 'sort') && o[0] !== 'ALL'
                && o[0] !== 'DEFAULT');
          if (needShards) { loadShards(b, f, o); return; }
          renderList();
        };
        filterBtns[f.k + ':' + o[0]] = b;
        filters.appendChild(b);
      });
    });

    /** 加载 L5/L6 分片，期间按钮显示进度 */
    function loadShards(btn, f, o) {
      var label = btn.textContent;
      btn.disabled = true;
      btn.textContent = o[1] + ' 加载中…';
      Promise.all([S.ensureLevel('L5'), S.ensureLevel('L6')])
        .then(function () {
          btn.disabled = false;
          btn.textContent = label;
          renderList();
        })
        .catch(function () {
          btn.disabled = false;
          btn.textContent = label;
          ui.toast('词库分片加载失败，请检查网络后重试', { type: 'error' });
        });
    }

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

    /* 预置了考纲筛选时必须先加载分片，否则列表会是空的——
       cet4/cet6 的词分布在 L5/L6 分片里，没加载就一条都筛不出来。
       这是「点了按钮却什么都没发生」的典型原因。 */
    if (presetExam) {
      var loading = h('div');
      loading.style.cssText = 'padding:var(--sp-3) var(--sp-4);background:var(--primary-soft);'
        + 'border-radius:var(--radius-sm);font-size:var(--fs-base);color:var(--primary-ink);margin-bottom:var(--sp-3)';
      loading.textContent = '正在加载「' + presetExam.toUpperCase() + '」词库…';
      listBox.appendChild(loading);
      Promise.all([S.ensureLevel('L5'), S.ensureLevel('L6')])
        .then(function () {
          ui.clear(listBox);
          var ex = VF && VF.exam(presetExam);
          ui.toast(ex ? ('已按「' + ex.name + '」筛选，并按高频优先排序')
                      : ('已按「' + presetExam + '」筛选'));
          renderList();
        })
        .catch(function () {
          ui.clear(listBox);
          ui.toast('词库加载失败，请检查网络后重试', { type: 'error' });
          renderList();
        });
      return;
    }

    function currentList() {
      var pool = loaded();
      if (state.lv !== 'ALL') pool = pool.filter(function (w) { return w.lv === state.lv; });
      if (state.theme !== 'ALL') pool = pool.filter(function (w) { return w.th === state.theme; });

      /* 词频与考纲筛选。两者都必须遍历全池，
         因为 cet4/cet6 词是按 L5/L6 分布的，不是某个独立集合。 */
      if (state.band !== 'ALL' && VF) {
        pool = pool.filter(function (w) { return VF.bandOf(w.w) === state.band; });
      }
      if (state.exam !== 'ALL' && VF) {
        pool = pool.filter(function (w) {
          return String(w.tag || '').split(/\s+/).indexOf(state.exam) > -1;
        });
      }

      if (state.status !== 'ALL') {
        pool = pool.filter(function (w) {
          var c = S.state.words[w.id];
          if (!c) return state.status === 'new';
          if (state.status === 'learning') return c.ivl < 21;
          if (state.status === 'mature') return c.ivl >= 21;
          return true;
        });
      }

      /* 搜索与显式排序互斥：用户主动搜了词，
         意图明确是「找这个词」而非「看这个序列」，此时不该重排。 */
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
        return pool;
      }

      if (state.sort === 'FREQ' && VF) {
        pool = pool.slice().sort(function (a, b) {
          var fa = VF.frqOf(a), fb = VF.frqOf(b);
          /* 无词频数据（99999）一律排最后。
             若按数值直接升序，新词会与最高频词并列在最前，明显错误。 */
          var ua = typeof fa !== 'number' || fa >= 99999;
          var ub = typeof fb !== 'number' || fb >= 99999;
          if (ua !== ub) return ua ? 1 : -1;
          if (ua && ub) return String(a.w).localeCompare(String(b.w));
          return fa - fb;
        });
      } else if (state.sort === 'PRIORITY' && VF) {
        pool = VF.sortByPriority(pool, state.exam === 'ALL' ? null : state.exam);
      }
      return pool;
    }

    function renderList() {
      global.UI.clear(listBox);
      var list = currentList();

      var total = S.vocabTotalCount();
      var info = h('div');
      info.style.cssText = 'font-size:var(--fs-base);color:var(--text-2);margin-bottom:12px';
      var loadedCount = loaded().length;
      /* 未加载时给出可执行的指引，而不是只报一个数字。
         注意措辞：考纲/词频筛选也需要分片，所以别把提示限定为「用等级筛选」。 */
      var tail = loadedCount < total
        ? '（另有 ' + (total - loadedCount).toLocaleString('en-US')
          + ' 词在分片中未加载，选「等级」「考纲」或「词频」筛选项会自动加载）'
        : '';
      info.textContent = '当前显示 ' + list.length + ' 个词 · 全库共 '
        + total.toLocaleString('en-US') + ' 词' + tail;
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
      /* 多一列「词频」：这是本轮新增的核心维度。
         单独成列而不是塞进「等级」列，因为两者含义不同——
         等级=难度阶段，词频=常用度，用户需要分别比较。 */
      var LABELS = ['单词', '音标', '释义', '等级', '词频', '考纲', '主题', '状态', ''];
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
        c1.style.cssText = 'font-family:var(--mono);font-size:var(--fs-xs);color:var(--primary-dark)';
        r.appendChild(c1);

        var c2 = h('td', null, w.cn || '—');
        c2.setAttribute('data-label', LABELS[2]);
        r.appendChild(c2);

        var c3 = h('td', null, w.lv);
        c3.setAttribute('data-label', LABELS[3]);
        /* 等级色走令牌，不再硬编码。
           旧写法用的还是上一轮废弃的配色（对比度 2.15~3.71，不达标）。 */
        c3.style.cssText = 'font-size:var(--fs-xs);font-weight:700;color:var(--lv-' +
          String(w.lv || '').toLowerCase() + ', var(--text-2))';
        r.appendChild(c3);

        /* 词频档位：带标签，鼠标悬停说明该档含义 */
        var cF = h('td');
        cF.setAttribute('data-label', LABELS[4]);
        if (VF) {
          var bid = VF.bandOf(w.w);
          var bi = VF.bandInfo(bid);
          var bt = h('span', 'tag ' + VF.bandTag(bid), bi ? bi.name : bid);
          bt.title = bi ? bi.desc : '';
          cF.appendChild(bt);
        }
        r.appendChild(cF);

        /* 考纲标签：只显示主要体系，全部标签会挤爆单元格 */
        var cE = h('td');
        cE.setAttribute('data-label', LABELS[5]);
        if (VF) {
          var es = VF.examsOfWord(w).slice(0, 2);
          es.forEach(function (e) {
            var et = h('span', 'tag grey', e.name);
            et.style.marginRight = '3px';
            et.title = e.full;
            cE.appendChild(et);
          });
          var all = VF.examsOfWord(w);
          if (all.length > 2) {
            var more = h('span', 'tag grey', '+' + (all.length - 2));
            more.title = all.slice(2).map(function (e) { return e.name; }).join(' ');
            cE.appendChild(more);
          }
        }
        r.appendChild(cE);

        var c4 = h('td', null, w.th || '—');
        c4.setAttribute('data-label', LABELS[6]);
        c4.style.cssText = 'font-size:var(--fs-xs);color:var(--text-3);max-width:130px';
        r.appendChild(c4);

        var c5 = h('td');
        c5.setAttribute('data-label', LABELS[7]);
        var card = S.state.words[w.id];
        var tag = h('span', null, card ? (card.ivl >= 21 ? '已掌握' : '学习中') : '未学');
        tag.style.cssText = 'font-size:var(--fs-xs);font-weight:700;color:' +
          (!card ? 'var(--text-3)' : card.ivl >= 21 ? 'var(--success-ink)' : 'var(--warn-ink)');
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
        if (sb.classList.contains('playing')) { ui.tts.stop(); sb.classList.remove('playing'); return; }
        ui.tts.speak(w.w, {
          onend: function () { sb.classList.remove('playing'); },
          onerror: function () { sb.classList.remove('playing'); }
        });
        sb.classList.add('playing');
        // 兜底：引擎异常时不要让按钮永久卡在播放态
        setTimeout(function () { if (!ui.tts.isSpeaking()) sb.classList.remove('playing'); }, 8000);
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
      if (c.coll) {
        var clb = h('div', 'vocab-coll');
        var clMain = h('div', 'vocab-coll-main');
        clMain.appendChild(h('span', 'cl-label', '搭配'));
        var clbEn = h('b', null, c.coll[0]);
        clbEn.style.cursor = 'pointer';
        clbEn.onclick = function () { ui.tts.speak(c.coll[0]); };
        clMain.appendChild(clbEn);
        var clSp = h('span', 'chip-speak', '🔊');
        clSp.onclick = function () { ui.tts.speak(c.coll[0]); };
        clMain.appendChild(clSp);
        clb.appendChild(clMain);
        if (c.coll[1]) {
          var clNote = h('div', 'vocab-coll-note');
          clNote.textContent = c.coll[1];
          if (c.coll[2]) clNote.appendChild(h('span', 'tag grey', c.coll[2]));
          clb.appendChild(clNote);
        }
        card.appendChild(clb);
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
  /* ============================================================
     四六级 —— 按考纲组织词表
     ------------------------------------------------------------
     为什么单独做一个视图，而不是只在筛选栏加两个选项：

     筛选栏解决的是「我要找某个词」，而四六级真正要回答的问题是
     「这个考试要背哪些词、先背哪些」。前者是一次查询，
     后者是长期学习计划，信息密度完全不同。

     并且要如实告诉用户一个反直觉的事实：四级考纲并非六级考纲的
     等比缩小版——实测四级 2052 词里有 1802 词六级也要，
     真正只属于四级的只有 250 词。
     「背完四级再背六级」的线性预期会误导学习者，
     让他们以为六级只是四级的加法。
     ============================================================ */
  function cetView(root) {
    var VFm = global.VocabFreq;
    var box = h('div');
    root.appendChild(box);

    if (!VFm || !VFm.exams().length) {
      var e = h('div', 'empty-state');
      e.appendChild(h('div', 'e-ico', '📊'));
      e.appendChild(h('div', 'e-txt', '词频索引未加载。执行 node tools/build-freq-index.js 生成。'));
      box.appendChild(e);
      return;
    }

    /* ---- 概览：各考纲规模 ---- */
    var ov = h('div', 'card');
    var oh = h('div', 'card-head');
    oh.appendChild(h('h3', null, '考纲总览'));
    oh.appendChild(h('span', 'tag blue', '按使用频率分层'));
    ov.appendChild(oh);

    /* 用既有的 .grid.g4——项目里没有 .stat-grid 这个类，
       写成不存在的类名会让卡片退化成块级竖排。 */
    var og = h('div', 'grid g4');
    VFm.exams().forEach(function (e2) {
      var c = h('div', 'stat');
      c.appendChild(h('div', 'lbl', e2.name));
      var v = h('div', 'val', String(e2.count));
      var s = h('small', null, '词');
      v.appendChild(s);
      c.appendChild(v);
      /* 独占词才是「这个考试特有」的部分。
         对考研/托福这类已被别的考纲覆盖大半的体系，独占数很小，
         这是真实情况，不该用「核心词」这类说法把它包装得很大。 */
      c.appendChild(h('div', 'delta', '本考纲独有 ' + e2.exclusive + ' 词'));
      og.appendChild(c);
    });
    ov.appendChild(og);
    box.appendChild(ov);

    /* ---- 四六级关系：把反直觉的事实讲清楚 ---- */
    var ins = VFm.cetInsight();
    if (ins) {
      var ic = h('div', 'card');
      var ih = h('div', 'card-head');
      ih.appendChild(h('h3', null, '四级与六级的关系'));
      var ig = h('span', 'tag l3', '必读');
      ih.appendChild(ig);
      ic.appendChild(ih);

      var ib = h('div');
      ib.style.cssText = 'font-size:var(--fs-base);line-height:1.85;color:var(--text-2)';
      ib.innerHTML = '常见的误解是「四级是六级的缩小版，背完四级接着背六级就行」。'
        + '实测数据不支持这个预期：'
        + '<div style="display:flex;gap:18px;flex-wrap:wrap;margin:12px 0">'
        + '<div style="flex:1;min-width:180px">'
        + '<div style="font-size:var(--fs-xs);color:var(--text-3)">四级考纲</div>'
        + '<div style="font-size:var(--fs-2xl);font-weight:750;color:var(--l2-ink)">'
        + ins.cet4 + ' <small style="font-size:var(--fs-base);color:var(--text-3)">词</small></div>'
        + '</div>'
        + '<div style="flex:1;min-width:180px">'
        + '<div style="font-size:var(--fs-xs);color:var(--text-3)">其中六级也要</div>'
        + '<div style="font-size:var(--fs-2xl);font-weight:750;color:var(--text-2)">'
        + ins.both + ' <small style="font-size:var(--fs-base);color:var(--text-3)">词（'
        + ins.overlapPct + '%）</small></div>'
        + '</div>'
        + '<div style="flex:1;min-width:180px">'
        + '<div style="font-size:var(--fs-xs);color:var(--text-3)">四级独有</div>'
        + '<div style="font-size:var(--fs-2xl);font-weight:750;color:var(--l2)">'
        + ins.cet4Only + ' <small style="font-size:var(--fs-base);color:var(--text-3)">词</small></div>'
        + '</div>'
        + '<div style="flex:1;min-width:180px">'
        + '<div style="font-size:var(--fs-xs);color:var(--text-3)">六级独有</div>'
        + '<div style="font-size:var(--fs-2xl);font-weight:750;color:var(--l5)">'
        + ins.cet6Only + ' <small style="font-size:var(--fs-base);color:var(--text-3)">词</small></div>'
        + '</div>'
        + '</div>'
        + '<b>结论</b>：六级真正的增量是那 <b>' + ins.cet6Only + ' 词</b>，'
        + '而不是把四级再背一遍。备考六级时，四级已覆盖的 '
        + ins.both + ' 词只需维持复习，把精力放在独有词上更高效。'
        + '<br><br>所以下面默认按<b>「考试内 + 高频优先」</b>排序——'
        + '这是真正决定背诵顺序的规则。';
      ic.appendChild(ib);
      box.appendChild(ic);
    }

    /* ---- 考纲详情：选一个体系看它的词频分层 ---- */
    var sel = h('div', 'card');
    var sh = h('div', 'card-head');
    sh.appendChild(h('h3', null, '按考纲查看'));
    sel.appendChild(sh);

    var seg = h('div', 'segment');
    seg.style.marginBottom = 'var(--sp-4)';
    sel.appendChild(seg);

    var detail = h('div');
    sel.appendChild(detail);
    box.appendChild(sel);

    var cur = 'cet4';
    seg.id = 'cetSeg';
    VFm.exams().forEach(function (e2) {
      var b = h('button', e2.id === cur ? 'on' : null, e2.name);
      b.type = 'button';
      b.dataset.e = e2.id;
      b.onclick = function () {
        cur = e2.id;
        $$('button', seg).forEach(function (x) { x.classList.toggle('on', x.dataset.e === cur); });
        renderDetail();
      };
      seg.appendChild(b);
    });

    function renderDetail() {
      ui.clear(detail);
      var ex = VFm.exam(cur);
      var pr = VFm.priorityOf(cur);
      if (!ex) return;

      var info = h('div');
      info.style.cssText = 'font-size:var(--fs-base);color:var(--text-2);margin-bottom:var(--sp-4);line-height:1.8';
      info.textContent = ex.full + '（' + ex.name + '）共 ' + ex.count + ' 词，其中本考纲独有 '
        + ex.exclusive + ' 词。下方按使用频率分层：';
      detail.appendChild(info);

      if (pr) {
        var bars = h('div');
        bars.style.cssText = 'display:flex;flex-direction:column;gap:var(--sp-2);margin-bottom:var(--sp-5)';
        /* 只画有词的四档。F5「无数据」占一大块，画出来会挤掉真正有意义的分布，
           所以单独用一行文字说明。 */
        var rows = [
          ['F1', '极高频', pr.core, '必须滚熟'],
          ['F2', '高频', pr.high, '读写都要认'],
          ['F3', '中频', pr.mid, '认识即可'],
          ['F4', '低频', pr.low, '见过就够']
        ];
        var max = Math.max(pr.core, pr.high, pr.mid, pr.low, 1);
        rows.forEach(function (rw) {
          var line = h('div');
          line.style.cssText = 'display:flex;align-items:center;gap:var(--sp-3)';
          var lab = h('span', null, rw[1]);
          lab.style.cssText = 'width:64px;font-size:var(--fs-sm);font-weight:600;flex-shrink:0';
          line.appendChild(lab);
          var track = h('div');
          track.style.cssText = 'flex:1;height:10px;background:var(--surface-3);border-radius:999px;overflow:hidden';
          var fill = h('i');
          fill.style.cssText = 'display:block;height:100%;width:' + (rw[2] / max * 100)
            + '%;background:var(--' + VFm.bandTag(rw[0]) + ');border-radius:999px;'
            + 'transition:width var(--dur-slow) var(--ease-out)';
          track.appendChild(fill);
          line.appendChild(track);
          var num = h('span', null, rw[2] + ' 词');
          num.style.cssText = 'width:82px;text-align:right;font-size:var(--fs-sm);'
            + 'font-weight:600;color:var(--text-2);flex-shrink:0';
          line.appendChild(num);
          var hint = h('span', null, rw[3]);
          hint.style.cssText = 'width:76px;font-size:var(--fs-xs);color:var(--text-3);flex-shrink:0';
          line.appendChild(hint);
          bars.appendChild(line);
        });
        detail.appendChild(bars);

        var tail = h('div');
        tail.style.cssText = 'font-size:var(--fs-sm);color:var(--text-3);margin-bottom:var(--sp-4)';
        tail.textContent = '另有 ' + pr.low + ' 词属于低频或无词频记录，按需查阅即可。';
        detail.appendChild(tail);
      }

      var go = h('button', 'btn', '在「全库浏览」中打开该考纲的词表');
      go.type = 'button';
      go.onclick = function () {
        /* 必须真的预置筛选，否则 toast 说的「筛选已设为 CET-4」就是假承诺。
           browseView 的 state 是它的局部变量，
           所以走 hash 传参，由 browseView 初始化时读取。 */
        location.hash = 'vocab';
        curTab = 'browse';
        pendingBrowse = { exam: cur };
        switchTab('browse');
      };
      detail.appendChild(go);
    }

    renderDetail();
  }

  /* 四六级视图 → 全库浏览的预置筛选。
     跨视图传参只能用模块级变量：
     browseView 每次进入都重建自己的 state，没有对外接口可写。 */
  var pendingBrowse = null;

  var TABS = [
    { id: 'review', label: '今日复习', fn: reviewView, desc: '按 SM-2 队列提取复习' },
    { id: 'new', label: '学新词', fn: newView, desc: '分等级分主题的词表' },
    { id: 'browse', label: '全库浏览', fn: browseView, desc: '全库开放，按等级/考纲/词频查阅' },
    { id: 'cet', label: '四六级', fn: cetView, desc: '按考纲背词，看清四级与六级的真实关系' },
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

  /* ============================================================
     把 VocabDeep 的深层讲解并入 CORE 词表
     ------------------------------------------------------------
     VocabDeep（搭配 / 易混辨析）是为高频短语准备的，
     CORE 里有一部分就是短语（look into / end up / used to…）。
     这里做一次性合并：只补空缺，不覆盖 CORE 自带的内容。
     ============================================================ */
  (function mergeDeep() {
    if (!global.VocabDeepAny || !VC.CORE) return;
    VC.CORE.forEach(function (c) {
      var d = global.VocabDeepAny.get(c.w);
      if (!d) return;
      if (d.ipa && !c.ipa) c.ipa = d.ipa;
      if (d.coll && !c.coll) c.coll = d.coll;
      if (d.confuse && !c.confuse) c.confuse = d.confuse;
    });
  })();

  global.VocabView = { switchTab: switchTab, wordById: wordById, posCn: posCn, showIpaDetail: showIpaDetail, focusWord: focusWord };

  /* ============================================================
     focusWord(w) —— 「划词取词 → 完整讲解」的落点
     ------------------------------------------------------------
     划词弹层里的「在词汇模块查看完整讲解」会带一个词跳过来。
     这里切到全库浏览，定位到该词条目并高亮滚动，
     这样「查一下 → 看讲解」才是真的接上，而不是只换个页面。

     词条很多时逐页查找会翻不到，所以先用词表建立索引，
     找到所在分组后再切，否则只在当前 DOM 里 find。
     ============================================================ */
  function focusWord(w) {
    w = String(w || '').trim().toLowerCase();
    if (!w) return false;

    // 视图可能还没渲染完（hashchange 里 render 是同步的，但调用方会延迟调用）
    var body = document.getElementById('vocabBody');
    if (!body) return false;

    // 目标词可能不在当前 tab，切到 browse（体量最大、最可能收录）
    curTab = 'browse';
    switchTab('browse');

    body = document.getElementById('vocabBody');
    if (!body) return false;

    // 1) 先看当前已渲染的 DOM 里有没有
    var hit = findEntry(body, w);
    if (hit) { mark(hit, w); return true; }

    // 2) DOM 里没有：直接查词库。
    //    不走浏览器的搜索框——它只搜「已加载」的部分，
    //    高考词（L5/L6 分片）会搜不到，等于把用户引到一个空列表。
    var entry = lookupInPools(w);
    if (!entry) {
      ui.toast('词汇库里暂时没有「' + w + '」的详细条目', { ms: 2600, type: 'info' });
      return false;
    }
    renderEntryCard(body, entry, w);
    return true;
  }

  /** 在已加载的词库分片里精确查词 */
  function lookupInPools(w) {
    var pools = [
      (global.VOCAB_DATA && global.VOCAB_DATA.words) || [],
      (global.GAOKAO_L5 && global.GAOKAO_L5.words) || [],
      (global.GAOKAO_L6 && global.GAOKAO_L6.words) || []
    ];
    for (var i = 0; i < pools.length; i++) {
      for (var j = 0; j < pools[i].length; j++) {
        if (String(pools[i][j].w || '').toLowerCase() === w) return pools[i][j];
      }
    }
    return null;
  }

  /** 词库里查到但当前列表没渲染出来时，单独插一张详情卡 */
  function renderEntryCard(body, entry, w) {
    var card = h('div', 'card');
    card.appendChild(h('div', 'poem-sec-head', '从划词取词直接跳转'));
    var top = h('div', 'lk-head');
    top.appendChild(h('span', 'lk-w', entry.w || w));
    if (entry.ipa) top.appendChild(h('span', 'lk-ipa', entry.ipa));
    var pos = entry.pos || entry.p;
    if (pos) top.appendChild(h('span', 'tag', pos));
    var sp = h('span', 'chip-speak', '🔊');
    sp.onclick = function () { ui.tts.speak(entry.w || w); };
    top.appendChild(sp);
    card.appendChild(top);
    if (entry.cn) card.appendChild(h('div', 'lk-cn', entry.cn));
    if (entry.en) card.appendChild(h('div', 'lk-en', entry.en));
    if (entry.tip) {
      var tip = h('div', 'lk-tip');
      tip.appendChild(h('span', 'tip-icon', '💡'));
      tip.appendChild(h('span', 'tip-text', entry.tip));
      card.appendChild(tip);
    }
    var ex = normEx(entry.ex);
    ex.forEach(function (pair) {
      var row = h('div', 'lk-ex');
      var t = h('div', 'lk-ex-top');
      t.appendChild(h('span', 'lk-ex-en', pair[0]));
      var s2 = h('span', 'chip-speak', '🔊');
      s2.onclick = function () { ui.tts.speak(pair[0]); };
      t.appendChild(s2);
      row.appendChild(t);
      if (pair[1]) row.appendChild(h('div', 'lk-ex-cn', pair[1]));
      card.appendChild(row);
    });
    // 插到列表最前面，并高亮
    body.insertBefore(card, body.firstChild);
    card.classList.add('lk-hit');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ui.toast('已定位到「' + (entry.w || w) + '」', { ms: 1800, type: 'info' });
  }

  function normEx(raw) {
    var out = [];
    if (!raw) return out;
    (Array.isArray(raw) ? raw : [raw]).forEach(function (it) {
      if (Array.isArray(it)) { if (it.length) out.push([String(it[0] || ''), String(it[1] || '')]); return; }
      var s = String(it || '').trim();
      if (!s) return;
      var m = /^(.+?)\s*[|｜：:]\s*(.+)$/.exec(s);
      if (m) out.push([m[1].trim(), m[2].trim()]);
      else out.push([s, '']);
    });
    return out.filter(function (p) { return p[0]; });
  }

  function mark(node, w) {
    if (!node) return;
    var card = node.closest ? (node.closest('.card, .entry, .w-card, li, tr') || node) : node;
    if (card.classList) {
      card.classList.remove('lk-hit');
      void card.offsetWidth;   // 强制重排，让重复点击也能重播动画
      card.classList.add('lk-hit');
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    ui.toast('已在全库浏览中定位「' + w + '」', { ms: 1800, type: 'info' });
  }


  function findEntry(scope, w) {
    var nodes = scope.querySelectorAll('[data-w]');
    for (var i = 0; i < nodes.length; i++) {
      if (String(nodes[i].dataset.w || '').toLowerCase() === w) return nodes[i];
    }
    // 没有 data-w 标记时退回文本匹配
    var all = scope.querySelectorAll('b, strong, h3, h4, .en, .w');
    for (var j = 0; j < all.length; j++) {
      if (String(all[j].textContent || '').trim().toLowerCase() === w) return all[j];
    }
    return null;
  }
})(window);