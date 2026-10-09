/* ============================================================
   view-poetry.js —— 英文诗歌与名句（审美拓展阶段）
   ------------------------------------------------------------
   设计意图：
     前面三个阶段解决「会记、会用」，但语言最终要抵达审美。
     诗歌提供的是语言的**密度**——同样的表达，压缩到最短仍承载完整感受。

   两个入口：
     诗歌（四级递进）—— 从四行儿歌到狄金森，具备完整赏析与朗读提示
     名句（按主题）—— 短句、易背诵，适合写作与日常引用

   语言功能设计：
     · 整首朗读 / 逐行朗读，支持慢速与连续朗读
     · 逐词点击查释义（复用全站划词取词）
     · 译文可折叠：先自己译，再对照，这是学诗最有效的顺序
     · 朗读提示按诗给出重音与断句建议，直接指导跟读
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, P = global.PoetryIndex;
  var ui = global.ui, h = ui.h;

  /* ---------------- 朗读按钮组 ---------------- */
  function readBar(getText, opts) {
    opts = opts || {};
    var bar = h('div', 'read-bar');

    var bAll = h('button', 'primary sm', '▶ 整首朗读');
    bAll.onclick = function () {
      var t = getText();
      if (!t) return;
      ui.tts.speak(t);
      bAll.textContent = '⏸ 停止';
      setTimeout(function () {
        bAll.textContent = '▶ 整首朗读';
      }, Math.min(20000, t.length * 120));
    };

    var bSlow = h('button', 'soft sm', '🐢 慢速跟读');
    bSlow.onclick = function () { ui.tts.slow(getText()); };

    var bStop = h('button', 'ghost sm', '■ 停止');
    bStop.onclick = function () { ui.tts.stop(); };

    bar.appendChild(bAll);
    bar.appendChild(bSlow);
    bar.appendChild(bStop);
    return bar;
  }

  /* ---------------- 诗行：原文 + 对照译文 ---------------- */
  function poemLines(p, showCn) {
    var box = h('div', 'poem-lines');
    var cnBox = h('div', 'poem-cn');

    var cnVisible = showCn !== false;

    p.text.forEach(function (line, i) {
      // 空行是诗节分隔，不渲染内容但保留间距
      if (!line.trim()) {
        box.appendChild(h('div', 'poem-gap'));
        if (p.cn && p.cn[i]) cnBox.appendChild(h('div', 'poem-gap'));
        return;
      }
      var l = h('div', 'poem-line');
      l.dataset.idx = String(i);
      l.appendChild(h('span', 'ln', line));
      // 每行可单独点击朗读，便于逐句跟读
      l.onclick = function () { ui.tts.speak(line); };
      l.title = '点击朗读这一行';
      box.appendChild(l);

      if (p.cn && p.cn[i]) {
        var c = h('div', 'poem-cn-line', p.cn[i]);
        c.style.display = cnVisible ? '' : 'none';
        cnBox.appendChild(c);
      }
    });

    /* 返回值必须是 { box, cnBox } —— 调用方按这两个键取，
       早前这里返回的是 DOM 元素，导致有译文的诗（占绝大多数）整页崩掉。*/
    var wrap = h('div', 'poem-lines-wrap');
    wrap.appendChild(box);

    if (!cnBox.children.length) return { box: wrap, cnBox: null };

    wrap.appendChild(cnBox);
    return { box: wrap, cnBox: cnBox };
  }

  /* ---------------- 诗歌卡片 ---------------- */
  function poemCard(p) {
    var card = h('div', 'card poem-card');

    /* 头部 */
    var head = h('div', 'card-head poem-head');
    var hl = h('div', 'poem-title-wrap');
    hl.appendChild(h('h3', 'poem-title', p.title));
    hl.appendChild(h('div', 'poem-sub', p.titleCn + ' · ' + p.poetCn
      + '（' + p.poet + '）'));
    head.appendChild(hl);

    var tags = h('div', 'poem-tags');
    tags.appendChild(h('span', 'tag lv-' + p.lv.toLowerCase(), p.lv));
    tags.appendChild(h('span', 'tag grey', p.form));
    tags.appendChild(h('span', 'tag grey', p.minutes + ' 分钟'));
    head.appendChild(tags);
    card.appendChild(head);

    /* 背景知识 */
    if (p.context) {
      var ctx = h('div', 'poem-context');
      ctx.appendChild(h('span', 'ctx-label', '背景'));
      ctx.appendChild(h('span', 'ctx-text', p.context));
      card.appendChild(ctx);
    }

    /* 朗读控制 */
    card.appendChild(readBar(function () { return P.readText(p.id); }));

    /* 原文 + 译文 */
    var linesBox = poemLines(p, true);
    card.appendChild(linesBox.box);
    if (linesBox.cnBox) card.appendChild(linesBox.cnBox);

    /* 译文开关 */
    if (linesBox.cnBox) {
      var tg = h('button', 'ghost sm toggle-cn', '隐藏译文（先自己译）');
      tg.onclick = function () {
        var hide = tg.dataset.on !== '1';
        tg.dataset.on = hide ? '1' : '';
        Array.prototype.forEach.call(linesBox.cnBox.children, function (c) {
          if (c.classList.contains('poem-gap')) return;
          c.style.display = hide ? 'none' : '';
        });
        tg.textContent = hide ? '显示译文' : '隐藏译文（先自己译）';
      };
      card.appendChild(tg);
    }

    /* 意象清单 */
    if (p.images && p.images.length) {
      var ih = h('div', 'poem-sec-head');
      ih.appendChild(h('span', null, '意象'));
      card.appendChild(ih);
      var iw = h('div', 'poimgs');
      p.images.forEach(function (im) {
        iw.appendChild(h('span', 'poimg', im));
      });
      card.appendChild(iw);
    }

    /* 语言赏析 */
    if (p.analysis) {
      var ah = h('div', 'poem-sec-head');
      ah.appendChild(h('span', null, '语言赏析'));
      card.appendChild(ah);
      var ab = h('div', 'poem-analysis');
      ab.innerHTML = renderEmphasis(p.analysis);
      card.appendChild(ab);
    }

    /* 修辞手法 */
    if (p.devices && p.devices.length) {
      var dh = h('div', 'poem-sec-head');
      dh.appendChild(h('span', null, '修辞手法'));
      card.appendChild(dh);
      var dw = h('div', 'poimgs');
      p.devices.forEach(function (dv) { dw.appendChild(h('span', 'tag blue', dv)); });
      card.appendChild(dw);
    }

    /* 值得记的词 */
    if (p.words && p.words.length) {
      var wh = h('div', 'poem-sec-head');
      wh.appendChild(h('span', null, '值得记的词'));
      wh.appendChild(h('span', 'count', '点词可听发音'));
      card.appendChild(wh);

      var wl = h('div', 'poem-words');
      p.words.forEach(function (pair) {
        var w = pair[0], cn = pair[1] || '';
        var item = h('div', 'poem-word');
        var top = h('div', 'pw-top');
        top.appendChild(h('b', null, w));
        top.appendChild(speakMini(w));
        item.appendChild(top);
        if (cn) item.appendChild(h('div', 'pw-cn', cn));
        // 点击进入全站划词取词逻辑，能看到该词的词根与详细讲解
        item.onclick = function () { global.Lookup && global.Lookup.show(w); };
        item.title = '查看「' + w + '」的详细讲解';
        wl.appendChild(item);
      });
      card.appendChild(wl);
    }

    /* 朗读提示 */
    if (p.tips) {
      var th = h('div', 'poem-sec-head');
      th.appendChild(h('span', null, '朗读提示'));
      card.appendChild(th);
      var tb = h('div', 'poem-tips');
      tb.textContent = p.tips;
      card.appendChild(tb);
    }

    return card;
  }

  function speakMini(text) {
    var b = h('button', 'chip-speak', '🔊');
    b.title = '朗读 ' + text;
    b.onclick = function (e) {
      e.stopPropagation();
      ui.tts.speak(text);
    };
    return b;
  }

  /**
   * 把赏析文本里的 **加粗** 与 `代码` 渲染成样式。
   * 数据里用 **…** 标重点，避免直接塞 HTML 造成注入风险。
   */
  function renderEmphasis(text) {
    var esc = String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return esc
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  /* ---------------- 名句卡片 ---------------- */
  function quoteCard(q) {
    var card = h('div', 'card quote-card');

    var q1 = h('div', 'quote-en', q.text);
    card.appendChild(q1);

    var readRow = h('div', 'quote-read');
    readRow.appendChild(speakMini(q.text));
    var bSlow = h('button', 'ghost sm', '🐢 慢速');
    bSlow.onclick = function () { ui.tts.slow(q.text); };
    readRow.appendChild(bSlow);
    card.appendChild(readRow);

    var q2 = h('div', 'quote-cn', q.cn);
    card.appendChild(q2);

    var meta = h('div', 'quote-meta');
    meta.appendChild(h('span', 'quote-author', q.authorCn));
    meta.appendChild(h('span', 'quote-from', q.from));
    card.appendChild(meta);

    if (q.tags && q.tags.length) {
      var tw = h('div', 'poimgs');
      q.tags.forEach(function (t) { tw.appendChild(h('span', 'tag grey', '#' + t)); });
      card.appendChild(tw);
    }

    if (q.analysis) {
      var ah = h('div', 'poem-sec-head');
      ah.appendChild(h('span', null, '赏析'));
      card.appendChild(ah);
      var ab = h('div', 'poem-analysis');
      ab.innerHTML = renderEmphasis(q.analysis);
      card.appendChild(ab);
    }

    return card;
  }

  /* ============================================================
     主视图
     ============================================================ */
  V.poetry = function (root) {
    var st = P.stats();
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '英文诗歌与名句'));
    head.appendChild(h('p', null,
      st.poems + ' 首短诗 + ' + st.quotes + ' 条名句，共 ' + st.words + ' 个英文词。'
      + '每首配译文、意象清单、语言赏析与朗读提示 —— '
      + '先自己译，再对照，是学诗最有效的顺序。'));
    root.appendChild(head);

    var body = h('div');
    root.appendChild(body);

    var tab = h('div', 'segment');
    tab.id = 'poTabs';
    tab.style.marginBottom = '16px';
    var cur = 'poem';

    function paint() {
      body.innerHTML = '';

      if (cur === 'poem') {
        ['L1', 'L2', 'L3', 'L4'].forEach(function (lv) {
          var list = P.byLevel(lv);
          if (!list.length) return;
          var sec = h('div', 'level-sec');
          var lh = h('div', 'field-head');
          var desc = {
            L1: '入门 · 短诗，词汇简单，适合整首背诵',
            L2: '基础 · 经典短诗，有明确意象',
            L3: '进阶 · 名家名篇，需一点背景知识',
            L4: '精通 · 难句与典故，适合精读'
          }[lv];
          lh.appendChild(h('h3', null, lv + ' · ' + list.length + ' 首'));
          lh.appendChild(h('span', 'level-desc', desc));
          sec.appendChild(lh);
          list.forEach(function (p) { sec.appendChild(poemCard(p)); });
          body.appendChild(sec);
        });
        return;
      }

      if (cur === 'quote') {
        var d = h('div', 'root-detail');
        d.textContent = '名句按主题排列，短、易背诵、可直接用于写作与日常表达。'
          + '注意：部分名句的出处存在误传，赏析里已标明。';
        body.appendChild(d);

        var byTag = P.quotesByTag();
        var tags = Object.keys(byTag);
        var filter = h('div', 'quote-filter');
        var curTag = null;

        function paintQuotes() {
          var list = document.getElementById('poQuoteList');
          if (!list) return;
          list.innerHTML = '';
          var src = curTag ? byTag[curTag] : P.quotes();
          src.forEach(function (q) { list.appendChild(quoteCard(q)); });
        }

        tags.forEach(function (t) {
          var b = h('button', 'chip chip-btn', '#' + t);
          b.onclick = function () {
            curTag = curTag === t ? null : t;
            ui.$$('#poTabs .quote-filter .chip-btn').forEach(function (x) {
              x.classList.remove('on');
            });
            if (curTag) b.classList.add('on');
            paintQuotes();
          };
          filter.appendChild(b);
        });
        body.appendChild(filter);

        var list2 = h('div');
        list2.id = 'poQuoteList';
        body.appendChild(list2);
        paintQuotes();
        return;
      }

      if (cur === 'write') {
        var d3 = h('div', 'root-detail');
        d3.textContent = '把赏析里的手法变成可练的技能。'
          + '下面每一项都可以点开看示范句，再用同一手法造自己的句子。';
        body.appendChild(d3);

        var drills = [
          {
            t: '倒装：把动作提前',
            d: '正常语序是 A + 动词 + B。倒装是把动词或补语提到前面，'
              + '制造强调或诗意。',
            ex: ['正常：Our hearts it severed.（不自然）',
                 '诗中：It severed our hearts.（把 it 提前，强调"分离"本身才是施动者）',
                 '现代例：Never had I seen such a thing.（我从没见过这样的事）'],
            tip: '否定词提前要配合助动词倒装：Never had I / Not only was he / Seldom does it happen。'
          },
          {
            t: '递进重复：同一个词反复出现',
            d: '重复的分量不在次数，而在语义是否升级。'
              + '第一次是叙述，第二次是强调，第三次常常是失控。',
            ex: ['Hope is the thing with feathers / And sings the tune… / And never stops - at all -',
                 '（Dickinson 用三次否定把"永不停歇"推到极限）',
                 '现代例：We are all… we are all… we are all in this together.'],
            tip: '检查方法：读出声，如果重复中没有任何推进，就是啰嗦。'
          },
          {
            t: '破折号停顿：让思绪断一下',
            d: '标准英语几乎不用破折号打断句子，但狄金森式的破折号能制造"呼吸"。',
            ex: ['Hope is the thing with feathers - That perches in the soul - / And sings the tune without the words - / And never stops - at all -',
                 '（三个破折号各停顿一次，让意象一个个落地；"without the words"先给结论再解释）',
                 '现代例：The data tells one story - the people tell another - and both are true -'],
            tip: '中文读者常忽略破折号，朗读时必须明显停顿，否则会失去节奏。'
          },
          {
            t: '矛盾修辞：把反义词放一起',
            d: '英语诗常用"dark and bright"这类看似矛盾的组合，'
              + '逼读者接受一种并存的状态。',
            ex: ['And all that\'s best of dark and bright / Meet in her aspect and her eyes;',
                 'Whose woods these are I think I know.（语气平静但内容沉重）',
                 'She Walks in Beauty：dark and bright 同时指夜色与发色，两种相反的东西并存'],
            tip: '自己写时先想清楚"我要并存的两种状态是什么"，再去找反义词。'
          },
          {
            t: '头韵：让声音先于意义抵达',
            d: '把相同或相近的辅音放在词首，读起来像有节奏的鼓点。'
              + '这是英语诗最省力也最容易被忽略的音效层。',
            ex: ['She Walks in Beauty：She / Walks / in / Beauty 四个 s 和 w 的轻音开头',
                 'Stopping by Woods：Stopping / by / Woods 三重 s/z/w 的收束音',
                 '现代例：Peter Piper picked a peck of pickled peppers.'],
            tip: '朗读检验法：念到头韵那一行，如果嘴巴动作变得明显，说明节奏出来了。'
          },
          {
            t: '通感：让感觉互相渗透',
            d: '把听觉写成视觉、把温度写成味道，英语诗里叫 synesthesia。'
              + '抽象与具体混在一起，反而更能传达情绪。',
            ex: ['And miles to go before I sleep, / And miles to go before I sleep.（视觉距离被读成心理距离）',
                 'If —：And the mountains rise / And the rivers go / Where they have always gone（听觉的水声接管了视野）',
                 'She Walks in Beauty：把视觉的美写成可听见的和谐。'],
            tip: '自己写时先确定"我想让 A 感觉像 B 感觉"，然后只写 A，不要解释。'
          },
          {
            t: '末行重复：从陈述变成说服',
            d: '同一句话重复两次。第一次是事实，第二次是态度。',
            ex: ['And miles to go before I sleep, / And miles to go before I sleep.',
                 '（弗罗斯特用重复暴露叙述者的自我说服）',
                 'Invictus：I am the master of my fate, / I am the captain of my soul.（从陈述升格为宣言）'],
            tip: '检验法：把末行重复删掉，如果语义无损，说明它不该重复。'
          }
        ];

        drills.forEach(function (d) {
          var c = h('div', 'card drill-card');
          var hd = h('div', 'card-head');
          hd.appendChild(h('h3', null, d.t));
          c.appendChild(hd);
          c.appendChild(h('div', 'root-detail', d.d));

          var eh = h('div', 'poem-sec-head');
          eh.appendChild(h('span', null, '示范'));
          c.appendChild(eh);
          var el = h('div', 'drill-ex');
          d.ex.forEach(function (line) { el.appendChild(h('div', 'drill-line', line)); });
          c.appendChild(el);

          var tip = h('div', 'root-tip');
          tip.appendChild(h('span', 'tip-icon', '💡'));
          tip.appendChild(h('span', 'tip-text', d.tip));
          c.appendChild(tip);

          // 朗读示范。示范数组里混有中文赏析（放在圆括号里），朗读时必须剔除，
          // 否则 TTS 会去读中括号内容，或被中文引擎读错。
          var rb = readBar(function () {
            return d.ex.filter(function (line) {
              return !/^\s*[（(]/.test(line);
            }).join(' ');
          });
          c.appendChild(rb);

          body.appendChild(c);
        });
        return;
      }
    }

    [['poem', '诗歌'], ['quote', '名句'], ['write', '写作手法']].forEach(function (t) {
      var b = h('button', t[0] === cur ? 'on' : null, t[1]);
      b.dataset.po = t[0];
      b.onclick = function () {
        cur = t[0];
        ui.$$('#poTabs button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        paint();
      };
      tab.appendChild(b);
    });
    root.appendChild(tab);

    paint();
  };

  global.Views = V;
})(window);
