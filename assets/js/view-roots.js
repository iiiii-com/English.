/* ============================================================
   view-roots.js —— 词根词缀视图（理解解析阶段的核心）
   ------------------------------------------------------------
   设计意图：
     单词记不住，多半是因为只记了「翻译」没记「来路」。
     本视图把散落的单词按词根串成词族，让记忆从「孤立」变成「成串」。

   三个入口：
     词根（按语义场分组）—— 看懂一个词根如何统领一串词
     词缀（按功能分组）—— 掌握可推导的构词规律
     检索（输入任意词反查来路）—— 即「划词取词」的兜底入口

   语言功能设计：
     · 单词与词根均可点击发音（走统一 TTS，App 内自动走原生引擎）
     · 同源词点击后展开该词的详细讲解，不必跳转
     · 提供「遮住释义」自测模式，把回忆成本还给学生
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, R = global.RootIndex;
  var ui = global.ui, h = ui.h;

  /* ---------------- 发音按钮（统一走 TTS，自动适配网站/App） ---------------- */
  function speakBtn(text, cls) {
    var b = h('button', cls || 'mini-speak', '🔊');
    b.title = '朗读：' + text;
    b.setAttribute('aria-label', '朗读 ' + text);
    b.onclick = function (e) {
      e.stopPropagation();   // 避免触发展开卡片
      ui.tts.speak(text);
    };
    return b;
  }

  /* ---------------- 词族条目（可展开） ---------------- */
  function familyRow(item, onWord) {
    var w = typeof item === 'string' ? item : item.w;
    var cn = typeof item === 'string' ? '' : (item.cn || '');
    var note = typeof item === 'string' ? '' : (item.note || '');

    var row = h('div', 'fam-row');
    var main = h('div', 'fam-main');

    var left = h('div', 'fam-left');
    var nw = h('span', 'fam-w', w);
    left.appendChild(nw);
    if (cn) left.appendChild(h('span', 'fam-cn', cn));
    main.appendChild(left);

    var right = h('div', 'fam-right');
    if (note) {
      right.appendChild(h('span', 'fam-note', note));
    }
    right.appendChild(speakBtn(w));
    main.appendChild(right);

    row.appendChild(main);

    // 点击释义区 → 跳到该词的详细讲解
    if (onWord) {
      main.style.cursor = 'pointer';
      main.onclick = function () { onWord(w); };
      main.title = '查看 ' + w + ' 的详细讲解';
    }
    return row;
  }

  /* ---------------- 词根卡片 ---------------- */
  function rootCard(r, onWord) {
    var card = h('div', 'card root-card');

    /* 头部：词根 + 含义 + 标签 */
    var head = h('div', 'card-head root-head');
    var hl = h('div', 'root-head-left');

    var big = h('div', 'root-big');
    big.appendChild(h('span', 'root-text', r.root));
    big.appendChild(h('span', 'root-gloss', r.gloss));
    hl.appendChild(big);

    var meta = h('div', 'root-meta');
    meta.appendChild(h('span', 'tag', r.type));
    meta.appendChild(h('span', 'tag grey', r.from));
    if (r.field) meta.appendChild(h('span', 'tag blue', r.field));
    hl.appendChild(meta);
    head.appendChild(hl);
    card.appendChild(head);

    /* 详细来源说明 */
    if (r.detail) {
      var dt = h('div', 'root-detail', r.detail);
      card.appendChild(dt);
    }

    /* 拆解示范 */
    if (r.demo) {
      var demo = h('div', 'root-demo');
      var dh = h('div', 'root-demo-head');
      dh.appendChild(h('span', null, '拆解示范'));
      demo.appendChild(dh);

      var dw = h('div', 'demo-word');
      dw.appendChild(h('b', null, r.demo.w));
      dw.appendChild(speakBtn(r.demo.w));
      dw.appendChild(h('span', 'demo-ipa', r.demo.ipa || ''));
      dw.appendChild(h('span', 'demo-pos', r.demo.pos || ''));
      demo.appendChild(dw);

      if (r.demo.break) {
        var br = h('div', 'demo-break');
        br.appendChild(h('span', 'break-label', '构词拆解'));
        br.appendChild(h('span', 'break-val', r.demo.break));
        demo.appendChild(br);
      }
      if (r.demo.note) {
        demo.appendChild(h('div', 'demo-note', r.demo.note));
      }
      card.appendChild(demo);
    }

    /* 同源词族 */
    if (r.family && r.family.length) {
      var fh = h('div', 'root-sec-head');
      fh.appendChild(h('span', null, '同源词族'));
      fh.appendChild(h('span', 'count', r.family.length + ' 个'));
      card.appendChild(fh);

      var list = h('div', 'fam-list');
      r.family.forEach(function (item) {
        list.appendChild(familyRow(item, onWord));
      });
      card.appendChild(list);
    }

    /* 记忆策略 */
    if (r.tip) {
      var tip = h('div', 'root-tip');
      tip.appendChild(h('span', 'tip-icon', '💡'));
      tip.appendChild(h('span', 'tip-text', r.tip));
      card.appendChild(tip);
    }

    /* 全部朗读 */
    var allBtn = h('button', 'soft sm', '🔊 连读整个词族');
    allBtn.onclick = function () {
      var words = [r.root].concat((r.family || []).map(function (x) {
        return typeof x === 'string' ? x : x.w;
      }));
      ui.tts.speakSequence(words.map(function (x) { return { text: x }; }), {
        onprogress: function (i) { /* 逐词高亮可后续扩展 */ }
      });
    };
    card.appendChild(allBtn);

    return card;
  }

  /* ---------------- 词缀卡片 ---------------- */
  function affixCard(a, onWord) {
    var card = h('div', 'card root-card');

    var head = h('div', 'card-head root-head');
    var hl = h('div', 'root-head-left');
    var big = h('div', 'root-big');
    big.appendChild(h('span', 'root-text', a.affix));
    big.appendChild(h('span', 'root-gloss', a.gloss));
    hl.appendChild(big);
    var meta = h('div', 'root-meta');
    meta.appendChild(h('span', 'tag', a.type));
    meta.appendChild(h('span', 'tag grey', a.from));
    hl.appendChild(meta);
    head.appendChild(hl);
    card.appendChild(head);

    if (a.note) card.appendChild(h('div', 'root-detail', a.note));

    if (a.words && a.words.length) {
      var fh = h('div', 'root-sec-head');
      fh.appendChild(h('span', null, '例词'));
      fh.appendChild(h('span', 'count', a.words.length + ' 个'));
      card.appendChild(fh);

      var wrap = h('div', 'affix-words');
      a.words.forEach(function (w) {
        var chip = h('button', 'chip');
        chip.appendChild(h('span', null, w));
        chip.appendChild(speakBtn(w, 'chip-speak'));
        chip.onclick = function () { ui.tts.speak(w); };
        wrap.appendChild(chip);
      });
      card.appendChild(wrap);
    }

    if (a.tip) {
      var tip = h('div', 'root-tip');
      tip.appendChild(h('span', 'tip-icon', '💡'));
      tip.appendChild(h('span', 'tip-text', a.tip));
      card.appendChild(tip);
    }
    return card;
  }

  /* ---------------- 反查：输入任意词 ---------------- */
  function lookupPanel() {
    var card = h('div', 'card lookup-card');
    var ch = h('div', 'card-head');
    ch.appendChild(h('h3', null, '查一个词的来路'));
    card.appendChild(ch);

    var d = h('div', 'root-detail');
    d.textContent = '输入任意英语单词，查出它包含哪些词根词缀。'
      + '这是「划词取词」的兜底入口 —— 在页面里选中单词时会自动调同样的逻辑。';
    card.appendChild(d);

    var row = h('div', 'lookup-row');
    var input = h('input', 'lookup-input');
    input.type = 'text';
    input.placeholder = '例如 inspect / impossible / portable';
    input.setAttribute('aria-label', '输入要查询的单词');
    var btn = h('button', 'primary sm', '查询');
    var out = h('div', 'lookup-out');

    function doLookup() {
      var w = input.value.trim();
      out.innerHTML = '';
      if (!w) return;
      var hits = R.lookup(w);
      if (!hits.length) {
        var none = h('div', 'lookup-none');
        none.textContent = '「' + w + '」没有匹配到词根词缀。'
          + '可能是专有名词、缩写，或不在这批高频词根范围内。';
        out.appendChild(none);
        return;
      }
      var head = h('div', 'lookup-hits');
      head.textContent = '「' + w + '」命中 ' + hits.length + ' 个：';
      out.appendChild(head);

      hits.forEach(function (x) {
        var key = x.root || x.affix;
        var row2 = h('div', 'lookup-row-item');
        var l = h('div');
        l.appendChild(h('b', null, key));
        l.appendChild(h('span', 'lookup-gloss', x.gloss));
        row2.appendChild(l);
        var rgt = h('div', 'lookup-from');
        rgt.appendChild(h('span', 'tag grey', x.from));
        row2.appendChild(rgt);
        out.appendChild(row2);

        if (x.tip) {
          var t = h('div', 'lookup-tip', x.tip);
          out.appendChild(t);
        }
      });
    }

    btn.onclick = doLookup;
    input.onkeydown = function (e) { if (e.key === 'Enter') doLookup(); };

    row.appendChild(input);
    row.appendChild(btn);
    card.appendChild(row);
    card.appendChild(out);

    return card;
  }

  /* ============================================================
     主视图
     ============================================================ */
  V.roots = function (root) {
    var st = R.stats();
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '词根词缀'));
    head.appendChild(h('p', null,
      st.roots + ' 个高频词根 + ' + st.affixes + ' 个常用词缀，'
      + '覆盖 ' + (st.familyWords + st.affixWords) + ' 个同源词。'
      + '每个词根都标注语种来源与语义场 —— 记住一个词根，就能推断一串词的意思。'));
    root.appendChild(head);

    var body = h('div');
    root.appendChild(body);

    /* ---- 标签页 ---- */
    var tab = h('div', 'segment');
    tab.id = 'rtTabs';
    tab.style.marginBottom = '16px';
    var cur = 'root';

    function paint() {
      body.innerHTML = '';

      if (cur === 'lookup') {
        body.appendChild(lookupPanel());
        return;
      }

      if (cur === 'root') {
        var fields = R.byField();
        var keys = Object.keys(fields);
        var d = h('div', 'root-detail');
        d.textContent = '词根按语义场排列。同一语义场的词根放在一起，'
          + '能看出英语如何用不同的"根"表达相近的概念 —— '
          + '这是词根记忆最有效的组织方式。';
        body.appendChild(d);

        keys.forEach(function (k) {
          var sec = h('div', 'field-sec');
          var fh = h('div', 'field-head');
          fh.appendChild(h('h3', null, k));
          fh.appendChild(h('span', 'count', fields[k].length + ' 个词根'));
          sec.appendChild(fh);
          fields[k].forEach(function (r) { sec.appendChild(rootCard(r, goWord)); });
          body.appendChild(sec);
        });
        return;
      }

      if (cur === 'affix') {
        var d2 = h('div', 'root-detail');
        d2.textContent = '词缀是可推导的构词规律。'
          + '掌握否定、程度、方向三类高频前缀，加上 -able / -ous / -ly 等后缀，'
          + '就能拆解大量陌生词的结构。';
        body.appendChild(d2);

        R.affixes().forEach(function (a) { body.appendChild(affixCard(a, goWord)); });
        return;
      }
    }

    [['root', '词根'], ['affix', '词缀'], ['lookup', '反查']].forEach(function (t) {
      var b = h('button', t[0] === cur ? 'on' : null, t[1]);
      b.dataset.rt = t[0];
      b.onclick = function () {
        cur = t[0];
        ui.$$('#rtTabs button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        paint();
      };
      tab.appendChild(b);
    });
    root.appendChild(tab);

    /** 跳到单词详情页并高亮该词 */
    function goWord(w) {
      location.hash = 'vocab?w=' + encodeURIComponent(w);
      // 若在 App 内，vocab 视图会读取 hash 参数定位
      global.__pendingWord = w;
    }

    paint();
  };

  global.Views = V;
})(window);
