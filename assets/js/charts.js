/* ============================================================
   charts.js —— 零依赖可视化引擎（纯 SVG + Canvas）
   提供：折线图 / 面积图 / 柱状图 / 热力图 / 进度环 / 雷达图 / 知识图谱
   所有图表响应式：宽度自适应容器，高度由参数指定。
   ============================================================ */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var uid = 0;

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function h(tag, cls, txt, parent) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined && txt !== null) n.textContent = txt;
    if (parent) parent.appendChild(n);
    return n;
  }
  function nice(max) {
    if (max <= 0) return 1;
    var exp = Math.floor(Math.log10(max));
    var f = max / Math.pow(10, exp);
    var nf = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
    return nf * Math.pow(10, exp);
  }
  function tooltip() {
    var d = document.getElementById('__chart_tip');
    if (!d) {
      d = document.createElement('div');
      d.id = '__chart_tip';
      d.style.cssText = 'position:fixed;z-index:9999;pointer-events:none;background:#1f2430;color:#fff;' +
        'font-size:12px;line-height:1.6;padding:6px 10px;border-radius:8px;opacity:0;transition:opacity .12s;' +
        'box-shadow:0 4px 16px rgba(0,0,0,.22);max-width:240px';
      document.body.appendChild(d);
    }
    return d;
  }
  function showTip(evt, html) {
    var d = tooltip();
    d.innerHTML = html;
    d.style.opacity = '1';
    var x = evt.clientX + 14, y = evt.clientY - 10;
    var r = d.getBoundingClientRect();
    if (x + r.width > window.innerWidth - 8) x = evt.clientX - r.width - 14;
    if (y + r.height > window.innerHeight - 8) y = window.innerHeight - r.height - 8;
    d.style.left = x + 'px'; d.style.top = y + 'px';
  }
  function hideTip() { var d = document.getElementById('__chart_tip'); if (d) d.style.opacity = '0'; }

  var PALETTE = ['#4f7cff', '#22b07d', '#f0a020', '#e2585f', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];
  var GRID = '#e8ebf0';
  var AXIS_TXT = '#8b93a7';

  /* =========================================================
     1) 折线 / 面积图（多条序列）
     opts: {series:[{name,data:[{x,y}],color,fill}], height, xLabel(x), yLabel(y), yMax, curve}
     ========================================================= */
  function lineChart(container, opts) {
    container.innerHTML = '';
    var H = opts.height || 220, PL = 44, PR = 14, PT = 14, PB = 26;
    var W = container.clientWidth || 600;
    if (W < 40) { W = 320; }
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H, class: 'chart-svg' }, container);
    var series = opts.series || [];
    var allY = [];
    series.forEach(function (s) { s.data.forEach(function (d) { if (d.y != null) allY.push(d.y); }); });
    // 全部为 0 / null 时显示空状态，而不是画出一张误导性的空图
    var hasData = allY.some(function (y) { return y > 0; });
    if (!hasData) {
      empty(svg, W, H, opts.emptyText || '暂无数据，完成一次学习后这里会出现曲线');
      return svg;
    }
    var yMax = opts.yMax != null ? opts.yMax : nice(Math.max.apply(null, allY.concat([1])));
    var n = Math.max.apply(null, series.map(function (s) { return s.data.length; }).concat([1]));
    var iw = W - PL - PR, ih = H - PT - PB;
    var X = function (i) { return PL + (n <= 1 ? iw / 2 : (i / (n - 1)) * iw); };
    var Y = function (v) { return PT + ih - (v / yMax) * ih; };

    // 网格 + Y 轴刻度
    for (var g = 0; g <= 4; g++) {
      var yv = (yMax / 4) * g;
      var yy = Y(yv);
      el('line', { x1: PL, y1: yy, x2: W - PR, y2: yy, stroke: GRID, 'stroke-width': 1 }, svg);
      el('text', { x: PL - 8, y: yy + 4, 'text-anchor': 'end', fill: AXIS_TXT, 'font-size': 10 }, svg)
        .textContent = opts.yFormat ? opts.yFormat(yv) : (Math.round(yv * 10) / 10);
    }
    // X 轴标签（最多 6 个）
    var step = Math.max(1, Math.ceil(n / 6));
    for (var i = 0; i < n; i += step) {
      el('text', { x: X(i), y: H - 8, 'text-anchor': 'middle', fill: AXIS_TXT, 'font-size': 10 }, svg)
        .textContent = opts.xLabel ? opts.xLabel(i) : (i + 1);
    }

    series.forEach(function (s, si) {
      var color = s.color || PALETTE[si % PALETTE.length];
      var pts = [];
      s.data.forEach(function (d, i) { if (d.y != null) pts.push([X(i), Y(d.y)]); });
      if (!pts.length) return;
      var defs = el('defs', {}, svg);
      var gid = 'g' + (uid++);
      if (s.fill !== false) {
        var lg = el('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
        el('stop', { offset: '0%', 'stop-color': color, 'stop-opacity': .28 }, lg);
        el('stop', { offset: '100%', 'stop-color': color, 'stop-opacity': 0 }, lg);
        var area = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L')
          + 'L' + pts[pts.length - 1][0].toFixed(1) + ',' + (PT + ih) + 'L' + pts[0][0].toFixed(1) + ',' + (PT + ih) + 'Z';
        el('path', { d: area, fill: 'url(#' + gid + ')' }, svg);
      }
      var dPath = 'M' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L');
      var path = el('path', {
        d: dPath, fill: 'none', stroke: color, 'stroke-width': 2.2,
        'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      }, svg);
      // 出现动画
      try {
        var len = path.getTotalLength();
        path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        path.style.transition = 'stroke-dashoffset .7s cubic-bezier(.4,0,.2,1)';
        requestAnimationFrame(function () { path.style.strokeDashoffset = 0; });
      } catch (e) { /* 老浏览器忽略 */ }

      // 悬停点
      s.data.forEach(function (d, i) {
        if (d.y == null) return;
        var c = el('circle', {
          cx: X(i), cy: Y(d.y), r: 3.5, fill: '#fff', stroke: color, 'stroke-width': 2,
          opacity: .0, class: 'pt'
        }, svg);
        c.style.transition = 'opacity .15s';
        c.style.cursor = 'pointer';
        var hit = el('circle', { cx: X(i), cy: Y(d.y), r: 12, fill: 'transparent' }, svg);
        hit.addEventListener('mouseenter', function () { c.setAttribute('opacity', 1); });
        hit.addEventListener('mouseleave', function () { c.setAttribute('opacity', 0); hideTip(); });
        hit.addEventListener('mousemove', function (e) {
          showTip(e, '<b>' + (d.name || (opts.xLabel ? opts.xLabel(i) : i + 1)) + '</b><br>' +
            s.name + '：' + (opts.tipFormat ? opts.tipFormat(d.y) : d.y));
        });
      });
    });

    if (opts.legend !== false && series.length > 1) legend(container, series);
    return svg;
  }

  function legend(container, series) {
    var lg = h('div', 'chart-legend', null, container);
    series.forEach(function (s, i) {
      var it = h('span', 'lg-item', null, lg);
      var dot = h('i', null, null, it);
      dot.style.background = s.color || PALETTE[i % PALETTE.length];
      h('span', null, s.name, it);
    });
  }

  /* =========================================================
     2) 柱状图 opts:{data:[{label,value,color}],height,yMax,onClick}
     ========================================================= */
  function barChart(container, opts) {
    container.innerHTML = '';
    var data = opts.data || [];
    var H = opts.height || 200, PL = 38, PR = 10, PT = 12, PB = 30;
    var W = container.clientWidth || 600;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H }, container);
    if (!data.length) { empty(svg, W, H, opts.emptyText || '暂无数据'); return svg; }
    var yMax = opts.yMax != null ? opts.yMax : nice(Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1])));
    var iw = W - PL - PR, ih = H - PT - PB;
    for (var g = 0; g <= 4; g++) {
      var yy = PT + ih - (g / 4) * ih;
      el('line', { x1: PL, y1: yy, x2: W - PR, y2: yy, stroke: GRID }, svg);
      el('text', { x: PL - 6, y: yy + 4, 'text-anchor': 'end', fill: AXIS_TXT, 'font-size': 10 }, svg)
        .textContent = Math.round(yMax / 4 * g);
    }
    var bw = iw / data.length;
    data.forEach(function (d, i) {
      var bh = (d.value / yMax) * ih;
      var x = PL + i * bw + bw * 0.18;
      var w = bw * 0.64;
      var r = el('rect', {
        x: x, y: PT + ih - bh, width: w, height: Math.max(1, bh),
        fill: d.color || PALETTE[i % PALETTE.length], rx: Math.min(4, w / 2)
      }, svg);
      r.style.transformOrigin = 'bottom';
      r.style.transform = 'scaleY(0)';
      r.style.transition = 'transform .45s cubic-bezier(.34,1.2,.64,1) ' + (i * 22) + 'ms';
      requestAnimationFrame(function () { r.style.transform = 'scaleY(1)'; });
      r.style.cursor = 'pointer';
      r.addEventListener('mousemove', function (e) {
        showTip(e, '<b>' + d.label + '</b><br>' + (d.tip || (d.value + (opts.unit || ''))));
      });
      r.addEventListener('mouseleave', hideTip);
      if (opts.onClick) r.addEventListener('click', function () { opts.onClick(d, i); });
      if (data.length <= 16 || i % Math.ceil(data.length / 12) === 0) {
        el('text', { x: PL + i * bw + bw / 2, y: H - 10, 'text-anchor': 'middle', fill: AXIS_TXT, 'font-size': 10 }, svg)
          .textContent = d.label;
      }
    });
    return svg;
  }

  /* =========================================================
     3) 热力图（GitHub 风格）opts:{data:[{date,value}],weeks,cell,onClick}
     ========================================================= */
  function heatmap(container, opts) {
    container.innerHTML = '';
    var data = opts.data || [];
    var cell = opts.cell || 13, gap = 3, PW = 20;
    var weeks = opts.weeks || data.length;
    var W = weeks * (cell + gap) + PW + 6;
    var H = 7 * (cell + gap) + 22;
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H, style: 'min-width:' + Math.min(W, 620) + 'px' }, container);
    ['周一', '周三', '周五'].forEach(function (t, i) {
      el('text', { x: 2, y: 14 + (i * 2 + 1) * (cell + gap) - 1, fill: AXIS_TXT, 'font-size': 9 }, svg).textContent = t;
    });
    var max = Math.max.apply(null, data.map(function (d) { return d.value; }).concat([1]));
    data.forEach(function (d, i) {
      var wi = Math.floor(i / 7), di = i % 7;
      var ratio = max ? d.value / max : 0;
      var color = d.value === 0 ? '#f0f2f5'
        : ratio < .25 ? '#cfe3ff' : ratio < .5 ? '#8fbaff' : ratio < .75 ? '#5b8def' : ratio < 1 ? '#2f63d6' : '#1b47a8';
      var r = el('rect', {
        x: PW + wi * (cell + gap), y: di * (cell + gap), width: cell, height: cell,
        rx: 3, fill: color, class: 'hm-cell'
      }, svg);
      r.style.cursor = 'pointer';
      r.style.opacity = 0;
      r.style.transition = 'opacity .3s ' + Math.min(400, i * 4) + 'ms';
      requestAnimationFrame(function () { r.style.opacity = 1; });
      r.addEventListener('mousemove', function (e) {
        showTip(e, '<b>' + d.date + '</b><br>' + (opts.tip || (d.value + ' 分钟')) + (d.tip2 || ''));
      });
      r.addEventListener('mouseleave', hideTip);
      if (opts.onClick) r.addEventListener('click', function () { opts.onClick(d); });
    });
    // 月度刻度
    var last = -1;
    data.forEach(function (d, i) {
      var m = d.date.slice(0, 7);
      if (m !== last) {
        last = m;
        var wi = Math.floor(i / 7);
        el('text', { x: PW + wi * (cell + gap), y: H - 4, fill: AXIS_TXT, 'font-size': 9 }, svg)
          .textContent = (+m.slice(5)) + '月';
      }
    });
    return svg;
  }

  /* =========================================================
     4) 进度环 opts:{value,max,label,sub,color,size}
     ========================================================= */
  function ring(container, opts) {
    container.innerHTML = '';
    var size = opts.size || 120, sw = opts.stroke || 10;
    var r = (size - sw) / 2, c = 2 * Math.PI * r;
    var v = Math.max(0, Math.min(1, (opts.value || 0) / (opts.max || 1)));
    var wrap = h('div', 'ring-wrap', null, container);
    wrap.style.width = size + 'px'; wrap.style.height = size + 'px';
    var svg = el('svg', { viewBox: '0 0 ' + size + ' ' + size, width: size, height: size }, wrap);
    el('circle', { cx: size / 2, cy: size / 2, r: r, fill: 'none', stroke: '#eef0f4', 'stroke-width': sw }, svg);
    var arc = el('circle', {
      cx: size / 2, cy: size / 2, r: r, fill: 'none', stroke: opts.color || '#4f7cff',
      'stroke-width': sw, 'stroke-linecap': 'round',
      'stroke-dasharray': c, 'stroke-dashoffset': c,
      transform: 'rotate(-90 ' + (size / 2) + ' ' + (size / 2) + ')'
    }, svg);
    arc.style.transition = 'stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)';
    requestAnimationFrame(function () { arc.setAttribute('stroke-dashoffset', c * (1 - v)); });
    var t1 = h('div', 'ring-val', opts.label != null ? opts.label : Math.round(v * 100) + '%', wrap);
    if (opts.sub) h('div', 'ring-sub', opts.sub, wrap);
    return wrap;
  }

  /* =========================================================
     5) 雷达图 opts:{axes:[{name,value,max}],size,color,compare:[...]}
     ========================================================= */
  function radar(container, opts) {
    container.innerHTML = '';
    var axes = opts.axes || [];
    var size = opts.size || 260, cx = size / 2, cy = size / 2;
    var R = size / 2 - 40;
    var n = axes.length;
    if (!n) { empty(el('svg', { viewBox: '0 0 ' + size + ' ' + size, width: size }, container), size, size, '暂无数据'); return; }
    var svg = el('svg', { viewBox: '0 0 ' + size + ' ' + size, width: '100%', height: size, style: 'max-width:' + size + 'px' }, container);
    // 网格环
    for (var g = 1; g <= 4; g++) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / n;
        pts.push((cx + Math.cos(a) * R * g / 4) + ',' + (cy + Math.sin(a) * R * g / 4));
      }
      el('polygon', { points: pts.join(' '), fill: 'none', stroke: GRID, 'stroke-width': 1 }, svg);
    }
    for (var i2 = 0; i2 < n; i2++) {
      var a2 = -Math.PI / 2 + i2 * 2 * Math.PI / n;
      el('line', { x1: cx, y1: cy, x2: cx + Math.cos(a2) * R, y2: cy + Math.sin(a2) * R, stroke: GRID }, svg);
      var lx = cx + Math.cos(a2) * (R + 22), ly = cy + Math.sin(a2) * (R + 18);
      var anchor = Math.abs(Math.cos(a2)) < .3 ? 'middle' : (Math.cos(a2) > 0 ? 'start' : 'end');
      var t = el('text', { x: lx, y: ly + 4, 'text-anchor': anchor, fill: '#5b6376', 'font-size': 11 }, svg);
      t.textContent = axes[i2].name;
    }
    function drawPoly(data, color, fillOpacity, animate) {
      var pts = [];
      data.forEach(function (d, i) {
        var a = -Math.PI / 2 + i * 2 * Math.PI / n;
        var rr = R * Math.max(0, Math.min(1, d.value / (d.max || 100)));
        pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
      });
      var poly = el('polygon', {
        points: pts.map(function (p) { return p.join(','); }).join(' '),
        fill: color, 'fill-opacity': fillOpacity, stroke: color, 'stroke-width': 2, 'stroke-linejoin': 'round'
      }, svg);
      poly.style.transformOrigin = cx + 'px ' + cy + 'px';
      if (animate) {
        poly.style.transform = 'scale(0.2)'; poly.style.opacity = 0;
        poly.style.transition = 'transform .6s cubic-bezier(.34,1.2,.64,1), opacity .4s';
        requestAnimationFrame(function () { poly.style.transform = 'scale(1)'; poly.style.opacity = 1; });
      }
      return pts;
    }
    if (opts.compare) {
      drawPoly(opts.compare, opts.compareColor || '#c8cedb', .12, false);
    }
    drawPoly(axes, opts.color || '#4f7cff', .22, true);
    return svg;
  }

  /* =========================================================
     6) 知识图谱 —— 力导向布局（简化 spring 模型）
     nodes:[{id,label,level,weight}], links:[{s,t,w}]
     ========================================================= */
  function knowledgeGraph(container, nodes, links, opts) {
    opts = opts || {};
    container.innerHTML = '';
    var W = container.clientWidth || 600;
    if (W < 40) W = 320;
    // 高度随节点数增长，保证不拥挤
    var H = opts.height || Math.min(560, Math.max(340, 140 + nodes.length * 18));
    var cx = W / 2, cy = H / 2;

    // 初始位置：同等级靠拢，不同等级分居四角，避免完全随机导致的初始重叠
    var groups = {};
    nodes.forEach(function (n) {
      if (!groups[n.level]) groups[n.level] = [];
      groups[n.level].push(n);
    });
    var keys = Object.keys(groups);
    var minH = opts.height || Math.max(340, 120 + nodes.length * 16);
    var quadrant = [[0.28, 0.30], [0.72, 0.30], [0.28, 0.70], [0.72, 0.70]];
    keys.forEach(function (k, gi) {
      var g = groups[k];
      var q = quadrant[gi % 4];
      g.forEach(function (n, i) {
        var a = (i / g.length) * Math.PI * 2;
        var rr = 30 + Math.random() * 26;
        n.x = W * q[0] + Math.cos(a) * rr;
        n.y = H * q[1] + Math.sin(a) * rr * 0.8;
        n.vx = 0; n.vy = 0;
      });
    });

    // 力导向迭代（离线预跑，动画由渲染负责）
    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });
    var ITER = 300;
    // 节点数决定斥力强度，避免节点堆叠成一团
    var REP = 14000 + nodes.length * 900;
    for (var it = 0; it < ITER; it++) {
      var k = 1 - it / ITER;
      // 斥力
      for (var a = 0; a < nodes.length; a++) {
        for (var b = a + 1; b < nodes.length; b++) {
          var A = nodes[a], B = nodes[b];
          var dx = B.x - A.x, dy = B.y - A.y;
          var d2 = dx * dx + dy * dy || 0.01;
          var d = Math.sqrt(d2);
          var rep = REP / d2;
          var fx = dx / d * rep, fy = dy / d * rep;
          A.vx -= fx; A.vy -= fy; B.vx += fx; B.vy += fy;
        }
      }
      // 引力（弹簧）——仅连接相邻节点，弱化避免聚团
      links.forEach(function (l) {
        var A = byId[l.s], B = byId[l.t];
        if (!A || !B) return;
        var dx = B.x - A.x, dy = B.y - A.y;
        var d = Math.sqrt(dx * dx + dy * dy) || .01;
        var f = (d - 130) * 0.016;
        var fx = dx / d * f, fy = dy / d * f;
        A.vx += fx; A.vy += fy; B.vx -= fx; B.vy -= fy;
      });
      // 向心力 + 阻尼
      nodes.forEach(function (n) {
        n.vx += (cx - n.x) * 0.004;
        n.vy += (cy - n.y) * 0.004;
        n.x += n.vx * 0.6 * k; n.y += n.vy * 0.6 * k;
        n.vx *= 0.84; n.vy *= 0.84;
        n.x = Math.max(34, Math.min(W - 34, n.x));
        n.y = Math.max(28, Math.min(H - 28, n.y));
      });
    }

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: '100%', height: H, class: 'kg-svg' }, container);
    var gLinks = el('g', {}, svg);
    var gNodes = el('g', {}, svg);
    var linkEls = [];
    links.forEach(function (l) {
      var A = byId[l.s], B = byId[l.t];
      if (!A || !B) return;
      var ln = el('line', { x1: A.x, y1: A.y, x2: B.x, y2: B.y, stroke: '#c9d2e3', 'stroke-width': Math.min(2.4, .6 + (l.w || 1) * .4) }, gLinks);
      ln.style.opacity = 0;
      linkEls.push(ln);
    });
    var levelColor = { L1: '#22b07d', L2: '#4f7cff', L3: '#f0a020', L4: '#e2585f' };
    var nodeEls = [];
    nodes.forEach(function (n, i) {
      var g = el('g', { class: 'kg-node' }, gNodes);
      g.style.cursor = 'pointer';
      var c = el('circle', {
        cx: n.x, cy: n.y, r: 8 + Math.min(10, (n.weight || 1) * 1.4),
        fill: levelColor[n.level] || '#8b93a7', 'fill-opacity': .16,
        stroke: levelColor[n.level] || '#8b93a7', 'stroke-width': 2
      }, g);
      var label = el('text', {
        x: n.x, y: n.y - (14 + Math.min(10, (n.weight || 1) * 1.4)),
        'text-anchor': 'middle', fill: '#3d4557', 'font-size': 11.5, 'font-weight': 600
      }, g);
      label.textContent = n.label;
      g.style.opacity = 0;
      g.addEventListener('mousemove', function (e) {
        c.setAttribute('fill-opacity', .34);
        showTip(e, '<b>' + n.label + '</b><br>' + (n.tip || ('掌握 ' + (n.weight || 0) + ' 词')));
      });
      g.addEventListener('mouseleave', function () { c.setAttribute('fill-opacity', .16); hideTip(); });
      if (opts.onNode) g.addEventListener('click', function () { opts.onNode(n); });
      nodeEls.push({ g: g, delay: Math.min(700, i * 22) });
    });
    requestAnimationFrame(function () {
      linkEls.forEach(function (l) { l.style.transition = 'opacity .5s'; l.style.opacity = .75; });
      nodeEls.forEach(function (n) {
        n.g.style.transition = 'opacity .4s ' + n.delay + 'ms';
        n.g.style.opacity = 1;
      });
    });
    return svg;
  }

  function empty(svg, W, H, text) {
    var t = el('text', { x: W / 2, y: H / 2, 'text-anchor': 'middle', fill: '#a6adbd', 'font-size': 13 }, svg);
    t.textContent = text;
  }

  global.Charts = {
    line: lineChart,
    bar: barChart,
    heatmap: heatmap,
    ring: ring,
    radar: radar,
    graph: knowledgeGraph,
    PALETTE: PALETTE,
    showTip: showTip,
    hideTip: hideTip
  };
})(window);