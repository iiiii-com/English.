/* ============================================================
   view-phoneme.js —— 音标与口型视图
   元音舌位图 + 辅音发音部位表 + 音标详解弹层
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, C = global.Charts, PL = global.PhonemeLib;
  var ui = global.ui, h = ui.h;

  /* 舌位图配色 */
  var VCOLOR = {
    '长元音': '#4f7cff', '短元音': '#22b07d', '双元音': '#f0a020', '弱读 schwa': '#94a3b8'
  };

  /* 标签偏移：修正重叠（dx, dy, 对齐） */
  var LABEL_FIX = {
    'iː': [0, -13, 'middle'], 'ɪ': [13, 3, 'start'], 'e': [11, 5, 'start'],
    'æ': [-6, 19, 'middle'], 'ɑː': [0, 21, 'middle'], 'ɒ': [13, 9, 'start'],
    'ɔː': [13, 7, 'start'], 'ʊ': [11, -5, 'start'], 'uː': [0, 21, 'middle'],
    'ʌ': [15, 7, 'start'], 'ɜː': [0, 21, 'middle'], 'ə': [-13, 9, 'end'],
    // 三个前高双元音终点几乎重合，标签沿不同角度散开
    'eɪ': [10, 20, 'start'], 'aɪ': [10, 6, 'start'], 'ɔɪ': [12, -8, 'start'],
    // 后高双元音同理
    'əʊ': [10, 22, 'start'], 'aʊ': [12, 5, 'start'],
    'ɪə': [0, 21, 'middle'], 'eə': [13, 9, 'start'], 'ʊə': [13, 11, 'start']
  };

  V.phoneme = function (root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '音标与口型'));
    head.appendChild(h('p', null,
      PL.vowelCount + ' 个元音 + ' + PL.consonantCount + ' 个辅音，每个都标注舌位、口型、发音要领，' +
      '以及中国学习者最容易踩的坑。点任意音标查看详解。'));
    root.appendChild(head);

    var tab = h('div', 'segment');
    tab.id = 'phTabs';
    tab.style.marginBottom = '16px';
    var cur = 'vowel';
    [['vowel', '元音舌位图'], ['consonant', '辅音发音表'], ['common', '易错音专题']].forEach(function (t) {
      var b = h('button', t[0] === cur ? 'on' : null, t[1]);
      b.dataset.ph = t[0];
      b.onclick = function () {
        cur = t[0];
        ui.$$('#phTabs button').forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        render();
      };
      tab.appendChild(b);
    });
    root.appendChild(tab);
    var body = h('div');
    body.id = 'phBody';
    root.appendChild(body);

    function render() {
      body.innerHTML = '';
      if (cur === 'vowel') body.appendChild(vowelChart());
      else if (cur === 'consonant') body.appendChild(consonantTable());
      else body.appendChild(commonHard());
    }
    render();

    /* ---------- 元音舌位图 ---------- */
    function vowelChart() {
      var wrap = h('div');
      var card = h('div', 'card');
      var hd = h('div', 'card-head');
      hd.appendChild(h('h3', null, '元音舌位图（美式）'));
      hd.appendChild(h('span', 'sub', '横轴=舌位前后，纵轴=舌位高低；箭头起点是主元音'));
      card.appendChild(hd);

      var box = h('div', 'chart-box');
      box.style.cssText = 'position:relative';
      card.appendChild(box);

      // 说明
      var note = h('div');
      note.style.cssText = 'margin-top:12px;padding:12px 14px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.8';
      note.innerHTML = '<b>怎么读这张图？</b>每个圆点代表一个元音在口腔里的位置。' +
        '左上角是舌位最前最高（/iː/），右下角是舌位最后最低（/ɑː/）。' +
        '双元音用箭头表示滑动方向——<b>起点是主要元音，终点要滑到位</b>。' +
        '<b>斜线内是 IPA 符号，点击看详解。</b>';
      card.appendChild(note);
      wrap.appendChild(card);

      // 渲染 SVG
      setTimeout(function () {
        drawVowelSVG(box);
      }, 30);

      // 图例
      var lg = h('div', 'chart-legend');
      Object.keys(VCOLOR).forEach(function (k) {
        var it = h('span', 'lg-item');
        var dot = h('i');
        dot.style.background = VCOLOR[k];
        it.appendChild(dot);
        it.appendChild(h('span', null, k));
        lg.appendChild(it);
      });
      card.appendChild(lg);
      return wrap;
    }

    function drawVowelSVG(container) {
      var W = container.clientWidth || 600;
      if (W < 40) W = 340;
      var H = Math.max(360, Math.min(460, W * 0.62));
      var PLm = 54, PRm = 26, PTm = 26, PBm = 42;
      var iw = W - PLm - PRm, ih = H - PTm - PBm;
      // 口腔示意：左上=前高，右下=后低
      var X = function (v) { return PLm + (v / 100) * iw; };
      var Y = function (v) { return PTm + ((100 - v) / 100) * ih; };

      var NS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', H);
      container.innerHTML = '';
      container.appendChild(svg);
      function el(t, a, p) {
        var n = document.createElementNS(NS, t);
        if (a) for (var k in a) n.setAttribute(k, a[k]);
        (p || svg).appendChild(n); return n;
      }

      // 网格
      for (var g = 0; g <= 4; g++) {
        el('line', { x1: X(g * 25), y1: PTm, x2: X(g * 25), y2: PTm + ih, stroke: '#e8ebf0' });
        el('line', { x1: PLm, y1: Y(g * 25), x2: PLm + iw, y2: Y(g * 25), stroke: '#e8ebf0' });
      }
      // 象限提示
      el('text', { x: X(6), y: Y(97), fill: '#b8bfcc', 'font-size': 10 }, svg).textContent = '前 · 高';
      el('text', { x: X(94), y: Y(97), fill: '#b8bfcc', 'font-size': 10, 'text-anchor': 'end' }, svg).textContent = '后 · 高';
      el('text', { x: X(6), y: Y(6), fill: '#b8bfcc', 'font-size': 10 }, svg).textContent = '前 · 低';
      el('text', { x: X(94), y: Y(6), fill: '#b8bfcc', 'font-size': 10, 'text-anchor': 'end' }, svg).textContent = '后 · 低';
      // 坐标轴标签
      el('text', { x: PLm + iw / 2, y: H - 10, 'text-anchor': 'middle', fill: '#9299ab', 'font-size': 11 }, svg).textContent = '← 舌位前（靠上齿龈）　舌位后（靠软腭） →';
      el('text', { x: 12, y: PTm + ih / 2, fill: '#9299ab', 'font-size': 11, transform: 'rotate(-90 12 ' + (PTm + ih / 2) + ')', 'text-anchor': 'middle' }, svg).textContent = '舌位高（闭） ↕ 舌位低（开）';

      // 口腔轮廓示意（右上角小图）
      var ox = W - 108, oy = 26, ow = 92, oh = 76;
      el('path', {
        d: 'M' + (ox + 6) + ',' + (oy + 8) + ' Q' + (ox + ow - 10) + ',' + (oy + oh - 26) + ' ' + (ox + 16) + ',' + (oy + oh - 4),
        fill: '#fdf3f3', stroke: '#e8c4c4', 'stroke-width': 1
      }, svg);
      el('text', { x: ox + ow / 2, y: oy + oh + 2, 'text-anchor': 'middle', fill: '#b8a0a0', 'font-size': 9 }, svg).textContent = '口腔侧面示意';

      // 双元音箭头（用二次贝塞尔曲线，减少交叉）
      Object.keys(PL.VOWELS).forEach(function (sym) {
        var v = PL.VOWELS[sym];
        if (v.x2 === undefined) return;
        var x1 = X(v.x), y1 = Y(v.y), x2 = X(v.x2), y2 = Y(v.y2);
        // 控制点向外偏移，弧线更自然
        var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        var dx = x2 - x1, dy = y2 - y1;
        var len = Math.sqrt(dx * dx + dy * dy) || 1;
        var cx2 = mx - dy / len * 16, cy2 = my + dx / len * 16;
        el('path', {
          d: 'M' + x1 + ',' + y1 + ' Q' + cx2 + ',' + cy2 + ' ' + x2 + ',' + y2,
          fill: 'none', stroke: VCOLOR[v.type] || '#f0a020',
          'stroke-width': 2, 'marker-end': 'url(#arrow)', opacity: .6
        }, svg);
      });
      var defs = el('defs', {});
      var mk = el('marker', { id: 'arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 5, markerHeight: 5, orient: 'auto-start-reverse' }, defs);
      el('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: '#f0a020' }, mk);

      // 单元音圆点
      Object.keys(PL.VOWELS).forEach(function (sym) {
        var v = PL.VOWELS[sym];
        if (v.x2 !== undefined) return;
        var cx = X(v.x), cy = Y(v.y);
        var c = el('circle', {
          cx: cx, cy: cy, r: 6, fill: (VCOLOR[v.type] || '#888'),
          'fill-opacity': .85, stroke: '#fff', 'stroke-width': 1.6, class: 'ph-dot'
        }, svg);
        c.style.cursor = 'pointer';
        c.style.transition = 'r .15s';
        c.addEventListener('mouseenter', function () { c.setAttribute('r', 8.5); });
        c.addEventListener('mouseleave', function () { c.setAttribute('r', 6); });
        c.addEventListener('click', function () { showDetail(sym); });
        // 标签带偏移，避免重叠
        var fx = LABEL_FIX[sym] || [0, -11, 'middle'];
        var t = el('text', {
          x: cx + fx[0], y: cy + fx[1], 'text-anchor': fx[2], fill: '#3d4557',
          'font-size': 11.5, 'font-weight': 600
        }, svg);
        t.textContent = v.ipa;
        t.style.cursor = 'pointer';
        t.addEventListener('click', function () { showDetail(sym); });
      });

      // 双元音：起点小空心点 + 箭头 + 终点实心点，标签放终点附近带偏移
      Object.keys(PL.VOWELS).forEach(function (sym) {
        var v = PL.VOWELS[sym];
        if (v.x2 === undefined) return;
        var x1 = X(v.x), y1 = Y(v.y), x2 = X(v.x2), y2 = Y(v.y2);
        // 起点：空心圈
        el('circle', {
          cx: x1, cy: y1, r: 3.5, fill: '#fff', stroke: VCOLOR[v.type] || '#f0a020',
          'stroke-width': 1.8, opacity: .7
        }, svg);
        // 终点：实心
        el('circle', {
          cx: x2, cy: y2, r: 5, fill: VCOLOR[v.type] || '#f0a020', 'fill-opacity': .9,
          stroke: '#fff', 'stroke-width': 1.4, style: 'cursor:pointer'
        }, svg).addEventListener('click', function () { showDetail(sym); });
        var fx = LABEL_FIX[sym] || [0, -10, 'middle'];
        var t = el('text', {
          x: x2 + fx[0], y: y2 + fx[1], 'text-anchor': fx[2], fill: '#b8790f',
          'font-size': 11.5, 'font-weight': 600, style: 'cursor:pointer'
        }, svg);
        t.textContent = v.ipa;
        t.addEventListener('click', function () { showDetail(sym); });
      });
    }

    /* ---------- 辅音表 ---------- */
    function consonantTable() {
      var wrap = h('div');
      var card = h('div', 'card');
      var hd = h('div', 'card-head');
      hd.appendChild(h('h3', null, '辅音发音部位表'));
      hd.appendChild(h('span', 'sub', '按发音方式分组 · 点击查看详解'));
      card.appendChild(hd);

      var groups = {
        '爆破音·清': { name: '爆破音（清）', desc: '气流被完全阻断后爆发。英语中不送气——这是与汉语拼音最大的区别', color: '#4f7cff' },
        '爆破音·浊': { name: '爆破音（浊）', desc: '位置与对应清音相同，但声带必须振动', color: '#22b07d' },
        '摩擦音·清': { name: '摩擦音（清）', desc: '气流从窄缝摩擦而出，声带不振动', color: '#8b5cf6' },
        '摩擦音·浊': { name: '摩擦音（浊）', desc: '位置与对应清音相同，但声带振动', color: '#ec4899' },
        '破擦音·清': { name: '破擦音', desc: '先阻断再摩擦，是爆破音与摩擦音的结合', color: '#f0a020' },
        '破擦音·浊': { name: '破擦音（浊）', desc: '声带振动版本的破擦音', color: '#e2585f' },
        '鼻音': { name: '鼻音', desc: '气流从鼻腔通过，口腔完全阻塞', color: '#06b6d4' },
        '舌侧音': { name: '舌侧音', desc: '舌尖阻塞，气流从舌两侧流出', color: '#84cc16' },
        '近音': { name: '近音', desc: '舌位不完全阻塞，口腔有一定空间', color: '#14b8a6' },
        '半元音': { name: '半元音', desc: '像元音一样发音，但起快速滑向后面的音', color: '#a855f7' }
      };

      Object.keys(groups).forEach(function (gk) {
        var items = Object.keys(PL.CONSONANTS).filter(function (s) {
          return PL.CONSONANTS[s].type === gk;
        });
        if (!items.length) return;
        var g = groups[gk];
        var sec = h('div');
        sec.style.marginBottom = '18px';
        var sh = h('div');
        sh.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:9px';
        var bar = h('span');
        bar.style.cssText = 'width:3px;height:15px;background:' + g.color + ';border-radius:2px';
        sh.appendChild(bar);
        var nm = h('b', null, g.name + '（' + items.join(' ') + '）');
        nm.style.fontSize = '13.5px';
        sh.appendChild(nm);
        sec.appendChild(sh);
        var ds = h('div', null, g.desc);
        ds.style.cssText = 'font-size:12px;color:var(--text-3);margin-bottom:8px;padding-left:11px';
        sec.appendChild(ds);

        var grid = h('div', 'grid');
        grid.style.gridTemplateColumns = 'repeat(auto-fill,minmax(230px,1fr))';
        items.forEach(function (sym) {
          var c = PL.CONSONANTS[sym];
          var it = h('div');
          it.style.cssText = 'padding:12px 14px;border:1px solid ' + g.color + '33;border-radius:10px;background:' + g.color + '08;cursor:pointer';
          it.onclick = function () { showDetail(sym); };
          var top = h('div');
          top.style.cssText = 'display:flex;align-items:center;gap:9px;margin-bottom:4px';
          var sy = h('b', null, c.ipa);
          sy.style.cssText = 'font-size:17px;font-family:var(--mono);color:' + g.color;
          top.appendChild(sy);
          var nm2 = h('span', null, c.name);
          nm2.style.cssText = 'font-size:12.5px;color:var(--text-2)';
          top.appendChild(nm2);
          var pl2 = h('span', 'tag grey', c.place);
          pl2.style.marginLeft = 'auto';
          top.appendChild(pl2);
          it.appendChild(top);
          var mw = h('div', null, '👄 ' + c.mouth);
          mw.style.cssText = 'font-size:12px;color:var(--text-2);line-height:1.6';
          it.appendChild(mw);
          grid.appendChild(it);
        });
        sec.appendChild(grid);
        wrap.appendChild(sec);
      });
      return wrap;
    }

    /* ---------- 易错音专题 ---------- */
    function commonHard() {
      var wrap = h('div');
      var card = h('div', 'card');
      card.style.cssText = 'background:linear-gradient(140deg,#fff5f5,#fff 60%)';
      card.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '中国学习者最容易错的 8 个音'));
      card.lastChild.appendChild(h('span', 'sub', '按错误率排序'));
      var p = h('div');
      p.style.cssText = 'font-size:13.5px;line-height:1.85;color:var(--text-2);margin-bottom:14px';
      p.innerHTML = '音标教学最大的问题不是「记不住符号」，而是「符号记住了但口型舌位不对」。' +
        '下面 8 个是实测中错率最高的，每一个都给了<strong>可执行的检验方法</strong>——' +
        '不是「注意发音」这种废话。';
      card.appendChild(p);

      var hard = ['θ', 'ð', 'v', 'r', 'l', 'iː', 'æ', 'ŋ'];
      var grid = h('div', 'grid g2');
      hard.forEach(function (sym) {
        var c = PL.lookup(sym);
        if (!c) return;
        var it = h('div');
        it.style.cssText = 'padding:14px;border:1px solid #f5c6c9;border-radius:11px;background:#fff';
        var top = h('div');
        top.style.cssText = 'display:flex;align-items:center;gap:9px;margin-bottom:6px';
        var sy = h('b', null, c.ipa);
        sy.style.cssText = 'font-size:19px;font-family:var(--mono);color:#c23b42';
        top.appendChild(sy);
        top.appendChild(h('b', null, c.name));
        var pw = h('span', 'tag', '★' );
        pw.style.cssText = 'background:#fdeced;color:#c23b42;margin-left:auto';
        top.appendChild(pw);
        it.appendChild(top);

        function row(k, v, color) {
          var d = h('div');
          d.style.cssText = 'margin-top:6px';
          var kk = h('div', null, k);
          kk.style.cssText = 'font-size:11px;color:' + (color || '#b8bfcc') + ';font-weight:700';
          d.appendChild(kk);
          var vv = h('div', null, v);
          vv.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.7;margin-top:1px';
          d.appendChild(vv);
          it.appendChild(d);
        }
        row('舌位', c.tongue);
        row('口型', '👄 ' + c.mouth);
        row('要领', c.how, '#c23b42');
        row('常见错', c.pitfall);
        if (c.contrast) row('易混对比', c.contrast, '#8a6d1a');
        it.onclick = function () { showDetail(sym); };
        it.style.cursor = 'pointer';
        grid.appendChild(it);
      });
      card.appendChild(grid);
      wrap.appendChild(card);

      // 自检方法
      var c2 = h('div', 'card');
      c2.style.marginTop = '16px';
      c2.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '三个不用老师也能做的自检方法'));
      c2.lastChild.appendChild(h('span', 'sub', '对镜子 + 手势'));
      var tips = [
        { i: '🪞', t: '照镜子看舌位', d: '发 /θ/ /ð/ 时如果镜子里看不到舌尖，说明你读成了 /s/ 或 /z/。' +
            '发 /l/ 时舌尖必须顶住上齿龈。发 /r/ 时舌尖应卷起但<b>不碰到</b>上腭——碰到了就是中式卷舌。' },
        { i: '✋', t: '手摸喉咙查清浊', d: '发 /b/ /d/ /ɡ/ /v/ /z/ /ð/ 时手放喉咙必须感到震动；' +
            '发 /p/ /t/ /k/ /f/ /s/ /θ/ 时不能感到震动。' +
            '这一条能立刻解决 80% 的「清浊不分」问题。' },
        { i: '🧧', t: '纸条测送气', d: '拿一张纸放在嘴前：发 /p/ /t/ /k/ 时纸应<b>几乎不动</b>（英语不送气）；' +
            '如果你习惯性地吹动纸面，说明读成了汉语拼音的送气音。' +
            '对比：英语 ship 前的 /ʃ/ 才有明显气流。' }
      ];
      tips.forEach(function (t) {
        var it = h('div');
        it.style.cssText = 'padding:13px 0;border-bottom:1px solid var(--surface-2);display:flex;gap:12px';
        var ico = h('div', null, t.i);
        ico.style.cssText = 'font-size:22px;flex-shrink:0;width:34px;text-align:center';
        it.appendChild(ico);
        var bd = h('div');
        var t1 = h('b', null, t.t);
        t1.style.fontSize = '13.5px';
        bd.appendChild(t1);
        var t2 = h('div', null, t.d);
        t2.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.8;margin-top:3px';
        bd.appendChild(t2);
        it.appendChild(bd);
        c2.appendChild(it);
      });
      wrap.appendChild(c2);
      return wrap;
    }

    /* ---------- 音标详解弹层 ---------- */
    function showDetail(sym) {
      var c = PL.lookup(sym);
      if (!c) return;
      ui.openSheet(c.ipa + ' ' + c.name, function (sheet) {
        var isVowel = c.kind === 'vowel';
        var color = isVowel ? (VCOLOR[c.type] || '#4f7cff') : '#4f7cff';

        // 朗读示范
        var demo = h('div');
        demo.style.cssText = 'text-align:center;padding:18px;background:' + color + '0d;border-radius:12px;margin-bottom:16px';
        var big = h('div', null, c.ipa);
        big.style.cssText = 'font-size:38px;font-family:var(--mono);font-weight:700;color:' + color;
        demo.appendChild(big);
        var pairs = {
          'iː': ['see', 'eat'], 'ɪ': ['sit', 'build'], 'e': ['bed', 'said'], 'æ': ['cat', 'bad'],
          'ɑː': ['hot', 'father'], 'ɒ': ['hot', 'dog'], 'ɔː': ['law', 'thought'], 'ʊ': ['book', 'good'],
          'uː': ['food', 'blue'], 'ʌ': ['cup', 'love'], 'ɜː': ['bird', 'work'], 'ə': ['about', 'banana'],
          'eɪ': ['day', 'make'], 'aɪ': ['time', 'my'], 'ɔɪ': ['boy', 'noise'], 'əʊ': ['go', 'no'],
          'aʊ': ['now', 'how'], 'ɪə': ['here', 'near'], 'eə': ['hair', 'care'], 'ʊə': ['tour', 'poor'],
          'θ': ['think', 'three'], 'ð': ['this', 'that'], 'r': ['red', 'around'], 'l': ['like', 'feel'],
          'v': ['very', 'love'], 'n': ['no', 'ten'], 'ŋ': ['sing', 'long'], 'f': ['fine', 'life'],
          's': ['see', 'bus'], 'z': ['zoo', 'is'], 'ʃ': ['she', 'nation'], 'ʒ': ['vision', 'measure'],
          'tʃ': ['chair', 'watch'], 'dʒ': ['judge', 'age'], 'h': ['hat', 'behind'], 'm': ['man', 'sum'],
          'w': ['we', 'quick'], 'j': ['yes', 'year'], 'p': ['pen', 'stop'], 'b': ['bed', 'job'],
          't': ['ten', 'water'], 'd': ['do', 'ready'], 'k': ['cat', 'school'], 'g': ['go', 'big']
        };
        var p = pairs[sym] || pairs[sym.replace(/:/g, 'ː')];
        if (p) {
          var row = h('div');
          row.style.cssText = 'display:flex;gap:10px;justify-content:center;margin-top:12px;flex-wrap:wrap';
          p.forEach(function (w) {
            var b = h('button', 'btn soft sm', '🔊 ' + w);
            b.onclick = function () { ui.tts.speak(w); };
            row.appendChild(b);
          });
          demo.appendChild(row);
          var hint = h('div', null, '点单词听发音，对比是否达到这个音');
          hint.style.cssText = 'font-size:11.5px;color:var(--text-3);margin-top:8px';
          demo.appendChild(hint);
        }
        sheet.appendChild(demo);

        function blk(k, v, cls) {
          var d = h('div');
          d.style.marginTop = '13px';
          var kk = h('div', null, k);
          kk.style.cssText = 'font-size:11.5px;font-weight:700;color:' + (cls || '#b8bfcc') + ';letter-spacing:.04em;margin-bottom:4px';
          d.appendChild(kk);
          var vv = h('div', null, v);
          vv.style.cssText = 'font-size:14px;line-height:1.85;color:var(--text)';
          d.appendChild(vv);
          sheet.appendChild(d);
        }

        blk('类型', c.type + '　·　' + (isVowel ? '元音' : '辅音' + (c.place ? '　·　' + c.place : '')));
        if (isVowel && c.x !== undefined) {
          blk('舌位坐标', '前后 ' + c.x + ' / 100　·　高低 ' + c.y + ' / 100' +
            (c.x2 !== undefined ? '　→　滑动至 ' + c.x2 + ' / ' + c.y2 : ''), '#4f7cff');
        }
        blk('👄 口型', c.mouth, '#e2585f');
        blk('舌位', c.tongue, '#22b07d');
        blk('发音要领', c.how, '#f0a020');
        blk('⚠️ 中国学习者常见错', c.pitfall, '#e2585f');
        if (c.contrast) blk('易混对比', c.contrast, '#8a6d1a');

        // 该音在词库中的出现
        var stat = (function () {
          try {
            var all = S.vocabAll(), n = 0, samples = [];
            all.forEach(function (w) {
              if (!w.ipa) return;
              if (w.ipa.indexOf(sym) >= 0 || w.ipa.indexOf(sym.replace(/:/g, 'ː')) >= 0) {
                n++;
                if (samples.length < 6) samples.push(w.w);
              }
            });
            return { n: n, samples: samples };
          } catch (e) { return null; }
        })();
        if (stat && stat.n) {
          var st = h('div');
          st.style.marginTop = '14px;padding:11px 13px;background:var(--surface-2);border-radius:9px';
          st.innerHTML = '<b style="font-size:12px;color:#5b6376">在你的词库中</b><br>' +
            '<span style="font-size:13px">共 <b>' + stat.n + '</b> 个词含这个音素</span>' +
            (stat.samples.length ? '<br><span style="font-size:12.5px;color:var(--text-2)">例：' + stat.samples.join(' / ') + '</span>' : '');
          sheet.appendChild(st);
        }
      });
    }
  };
})(window);