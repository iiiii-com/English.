/* ============================================================
   view-path.js —— 等级路径视图
   四阶段时间轴 / 当前定位 / 解锁条件 / 知识图谱 / 主题掌握
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, C = global.Charts, P = global.PathContent;
  var ui = global.ui, h = ui.h;

  V.path = function (root) {
    var st = S.state, v = S.vocabStats(), stk = S.streak();
    var curLv = ui.currentLevel();

    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '等级路径'));
    head.appendChild(h('p', null, '从零基础到精通的完整闭环。四个等级贯穿词汇、口语、阅读三个模块——同一套分级标准，不用在三个地方学三套体系。'));
    root.appendChild(head);

    /* ---------- 当前定位卡 ---------- */
    var loc = h('div', 'card');
    loc.style.cssText = 'background:linear-gradient(140deg,#f0f5ff,#fff 60%)';
    var L = P.levelById(curLv);
    var row = h('div');
    row.style.cssText = 'display:flex;gap:22px;align-items:center;flex-wrap:wrap';
    var rw = h('div');
    C.ring(rw, { value: v.seenTotal, max: L.vocabTarget, size: 116, stroke: 10, color: L.color, label: v.seenTotal, sub: '主动词 / ' + L.vocabTarget });
    row.appendChild(rw);
    var info = h('div');
    info.style.cssText = 'flex:1;min-width:220px';
    var t1 = h('div');
    t1.innerHTML = '<span class="tag ' + curLv.toLowerCase() + '" style="font-size:12px">当前阶段</span> ' +
      '<b style="font-size:19px;margin-left:5px">' + L.name + ' · ' + L.en + '</b>';
    info.appendChild(t1);
    var sub = h('div', null, L.months + ' · 目标：' + L.goal);
    sub.style.cssText = 'font-size:13.5px;color:var(--text-2);margin-top:5px;line-height:1.7';
    info.appendChild(sub);

    var mv = ui.estimateAbilities(L);
    var gaps = mv.slice().sort(function (a, b) { return a.value - b.value; });
    var weakest = gaps[0], strongest = gaps[gaps.length - 1];
    var an = h('div');
    an.style.cssText = 'margin-top:10px;padding:10px 12px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.7';
    an.innerHTML = '<b>你的能力分布</b>（基于真实行为数据）：最强 <b>' + strongest.name + '（' + strongest.value + '）</b>，' +
      '最弱 <b>' + weakest.name + '（' + weakest.value + '）</b>。<br>' +
      '<b>建议</b>：把每日任务向"' + weakest.name + '"倾斜 30%。' +
      '自我决定论指出，均衡发展不如针对短板——短板决定你的实际可用水平。';
    info.appendChild(an);
    row.appendChild(info);
    loc.appendChild(row);
    root.appendChild(loc);

    /* ---------- 四阶段时间轴 ---------- */
    var tlCard = h('div', 'card');
    tlCard.style.marginTop = '16px';
    tlCard.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '四阶段完整路径'));
    tlCard.lastChild.appendChild(h('span', 'sub', '点击任一阶段查看详情'));
    var tl = h('div', 'timeline');
    P.LEVELS.forEach(function (lv) {
      var unlocked = st.unlocked[lv.id];
      var isCur = lv.id === curLv;
      var idx = P.LEVELS.indexOf(lv);
      var curIdx = P.LEVELS.indexOf(L);
      var done = idx < curIdx;
      var it = h('div', 'tl-item' + (isCur ? ' current' : '') + (done ? ' done' : ''));
      var hd = h('div');
      hd.style.cssText = 'display:flex;align-items:center;gap:10px;cursor:pointer;flex-wrap:wrap';
      var tg = h('span', 'tag ' + lv.id.toLowerCase(), lv.id + ' ' + lv.name);
      hd.appendChild(tg);
      hd.appendChild(h('b', null, lv.goal));
      hd.lastChild.style.cssText = 'font-size:13.5px;font-weight:600';
      hd.appendChild(h('span', null, lv.months));
      hd.lastChild.style.cssText = 'font-size:11.5px;color:var(--text-3)';
      var lockTxt = h('span');
      lockTxt.style.cssText = 'font-size:11.5px;color:' + (unlocked ? 'var(--success)' : 'var(--text-3)') + ';margin-left:auto';
      lockTxt.textContent = done ? '✓ 已通过' : (unlocked ? '● 进行中' : '🔒 未解锁');
      hd.appendChild(lockTxt);
      it.appendChild(hd);

      var detail = h('div');
      detail.style.cssText = 'margin-top:9px;padding:14px 16px;background:var(--surface-2);border-radius:11px;display:none';
      it.appendChild(detail);
      buildDetail(detail, lv, unlocked);
      hd.onclick = function () {
        var open = detail.style.display === 'none';
        detail.style.display = open ? 'block' : 'none';
      };
      if (isCur) detail.style.display = 'block';
      tl.appendChild(it);
    });
    tlCard.appendChild(tl);
    root.appendChild(tlCard);

    /* ---------- 词汇量预测曲线 ---------- */
    var fc = h('div', 'card');
    fc.style.marginTop = '16px';
    fc.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '词汇量增长预测'));
    fc.lastChild.appendChild(h('span', 'sub', '基于你的真实日均速度，非固定模板'));
    var fbox = h('div', 'chart-box');
    fc.appendChild(fbox);

    var days = Math.max(1, S.daysBetween(st.createdAt, S.today()) + 1);
    var perDay = v.seenTotal / days;
    var hist = [];
    for (var i = 0; i < Math.min(days, 60); i++) {
      var d = new Date();
      d.setDate(d.getDate() - (Math.min(days, 60) - 1 - i));
      hist.push({ name: ui.fmtDate(d), y: v.seenTotal - (days - 1 - i) * perDay });
    }
    hist = hist.map(function (p, i) { return { name: p.name, y: Math.round(Math.max(0, p.y - perDay)) }; });
    var proj = [];
    var cum = v.seenTotal;
    for (var j = 1; j <= 12; j++) {
      var dd = new Date();
      dd.setDate(dd.getDate() + j * 30);
      cum += perDay * 30;
      proj.push({ name: (j) + '月后', y: Math.round(cum) });
    }
    C.line(fbox, {
      height: 235,
      series: [
        { name: '实际词汇量', data: hist, color: C.PALETTE[0] },
        { name: '按当前速度预测', data: hist.length ? [hist[hist.length - 1]].concat(proj) : proj, color: C.PALETTE[3], fill: false }
      ],
      xLabel: function (i) { return i < hist.length ? hist[i].name : proj[i - hist.length] ? proj[i - hist.length].name : ''; },
      yFormat: function (x) { return Math.round(x); },
      tipFormat: function (x) { return Math.round(x) + ' 词'; }
    });
    var fn = h('div');
    fn.style.cssText = 'margin-top:12px;padding:12px 14px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.8';
    var monthTarget = Math.round(perDay * 30);
    fn.innerHTML = '<b>你的当前速度</b>：日均 ' + perDay.toFixed(1) + ' 词 → 月均约 <b>' + monthTarget + ' 词</b>。' +
      '按此速度，达到 1500 词约需 <b>' + Math.ceil((1500 - v.seenTotal) / Math.max(1, perDay)) + ' 天</b>，' +
      '达到 3000 词约需 ' + Math.ceil((3000 - v.seenTotal) / Math.max(1, perDay)) + ' 天。<br>' +
      '<b>参考基准</b>：零基础成年学习者达到"能应付日常对话"（约 1000-1500 活跃词）通常需 <b>400-600 小时</b>高质量学习；' +
      '母语者约需 4,200 小时（Hamada & Kondo, 2013）。<br>' +
      '<b>提高速度的唯一方法是提高提取效率</b>，不是延长学习时间——把每日复习控制在 20 分钟内，超时说明新词量设置过高。';
    fc.appendChild(fn);
    root.appendChild(fc);

    /* ---------- 知识图谱 ---------- */
    var kg = h('div', 'card');
    kg.style.marginTop = '16px';
    kg.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '词汇知识图谱'));
    kg.lastChild.appendChild(h('span', 'sub', '节点大小 = 已掌握词数，连线 = 主题间的语义关联'));
    var kbox = h('div', 'chart-box');
    kg.appendChild(kbox);

    // 按主题聚合已学词
    var themeStat = {};
    S.vocabAll().forEach(function (w) {
      var c = S.getCard(w.id);
      var mastered = c && c.ivl >= 21;
      var learned = !!c;
      var k = w.lv + '|' + w.th;
      if (!themeStat[k]) themeStat[k] = { id: k, label: w.th, lv: w.lv, weight: 0, total: 0, learned: 0 };
      themeStat[k].total++;
      if (learned) themeStat[k].learned++;
      if (mastered) themeStat[k].weight++;
    });
    var nodes = Object.keys(themeStat).map(function (k) {
      var t = themeStat[k];
      return {
        id: k, label: t.label, lv: t.lv, weight: t.weight || t.learned * 0.4,
        tip: '<b>' + t.label + '</b>（' + t.lv + '）<br>已学 ' + t.learned + ' / ' + t.total + ' 词<br>' +
          '成熟词 ' + t.weight + ' 个'
      };
    }).filter(function (n) { return n.weight > 0; });

    if (nodes.length < 2) {
      var e = h('div', 'empty-state');
      e.appendChild(h('div', 'e-ico', '🕸️'));
      e.appendChild(h('div', 'e-txt', '学习至少 2 个主题后显示知识图谱'));
      kbox.appendChild(e);
    } else {
      // 同等级内相邻主题连线 + 跨等级同名主题连线
      var links = [];
      var byLv = {};
      nodes.forEach(function (n) { (byLv[n.lv] = byLv[n.lv] || []).push(n); });
      Object.keys(byLv).forEach(function (lv) {
        var arr = byLv[lv];
        for (var i = 0; i < arr.length - 1; i++) links.push({ s: arr[i].id, t: arr[i + 1].id, w: 1 });
      });
      Object.keys(byLv).forEach(function (lv) {
        (byLv[lv] || []).forEach(function (n) {
          Object.keys(byLv).forEach(function (lv2) {
            if (lv2 === lv) return;
            (byLv[lv2] || []).forEach(function (m) {
              if (m.label === n.label) links.push({ s: n.id, t: m.id, w: 2 });
            });
          });
        });
      });
      C.graph(kbox, nodes, links, {
        height: Math.min(600, Math.max(360, 150 + nodes.length * 20)),
        onNode: function (n) {
          ui.openSheet(n.label + ' · ' + n.lv, function (sheet) {
            var t = themeStat[n.id];
            var p = h('div');
            p.innerHTML = '<p style="font-size:13.5px;line-height:1.8;color:var(--text-2)">' +
              '该主题共 <b>' + t.total + '</b> 个词，你已接触 <b>' + t.learned + '</b> 个，其中成熟词（间隔 ≥21 天）<b>' + t.weight + '</b> 个。</p>';
            sheet.appendChild(p);
            var bar = h('div', 'bar lg');
            var fi = h('i');
            fi.style.width = Math.min(100, (t.learned / t.total) * 100) + '%';
            bar.appendChild(fi);
            sheet.appendChild(bar);
            var b = h('button', 'btn');
            b.style.marginTop = '16px';
            b.textContent = '去学习该主题';
            b.onclick = function () {
              document.querySelector('.sheet-mask').remove();
              location.hash = 'vocab';
              global.VocabView.switchTab('new');
            };
            sheet.appendChild(b);
          });
        }
      });
      var lgd = h('div', 'chart-legend');
      global.PathContent.LEVELS.forEach(function (lv, i) {
        var it = h('span', 'lg-item');
        var dot = h('i');
        dot.style.background = ['#22b07d', '#4f7cff', '#f0a020', '#e2585f'][i];
        it.appendChild(dot);
        it.appendChild(h('span', null, lv + ' ' + P.levelById(lv).name));
        lgd.appendChild(it);
      });
      kbox.appendChild(lgd);
    }
    root.appendChild(kg);

    /* ---------- 主题掌握表 ---------- */
    var tb = h('div', 'card');
    tb.style.marginTop = '16px';
    tb.appendChild(h('div', 'card-head')).appendChild(h('h3', null, '主题掌握明细'));
    var metaAll = S.vocabMeta();
    var themeTotal = Object.keys(metaAll.themes || {}).reduce(function (a, k) {
      return a + Object.keys(metaAll.themes[k]).length;
    }, 0);
    tb.lastChild.appendChild(h('span', 'sub', '共 ' + themeTotal + ' 个主题'));
    var tbl = h('table', 'tbl');
    var th = h('thead');
    var tr = h('tr');
    ['等级', '主题', '词数', '已学', '成熟', '掌握度'].forEach(function (x) { tr.appendChild(h('th', null, x)); });
    th.appendChild(tr);
    tbl.appendChild(th);
    var tbody = h('tbody');
    global.PathContent.LEVELS.forEach(function (lv) {
      var th2 = S.vocabMeta().themes[lv] || {};
      Object.keys(th2).forEach(function (theme) {
        var total = th2[theme];
        var learned = 0, mature = 0;
        S.vocabAll().forEach(function (w) {
          if (w.lv !== lv || w.th !== theme) return;
          var c = S.getCard(w.id);
          if (c) { learned++; if (c.ivl >= 21) mature++; }
        });
        var row = h('tr');
        var c0 = h('td');
        c0.appendChild(h('span', 'tag ' + lv.toLowerCase(), lv));
        row.appendChild(c0);
        row.appendChild(h('td', null, theme));
        row.appendChild(h('td', null, total));
        row.appendChild(h('td', null, learned));
        row.appendChild(h('td', null, mature));
        var c5 = h('td');
        var bar = h('div', 'bar sm lv' + lv.slice(1));
        bar.style.minWidth = '70px';
        var fi = h('i');
        fi.style.width = Math.min(100, (mature / total) * 100) + '%';
        bar.appendChild(fi);
        c5.appendChild(bar);
        c5.appendChild(h('span', null, Math.round(mature / total * 100) + '%'));
        c5.lastChild.style.cssText = 'font-size:11px;color:var(--text-3);margin-left:6px';
        row.appendChild(c5);
        tbody.appendChild(row);
      });
    });
    tbl.appendChild(tbody);
    tb.appendChild(tbl);
    root.appendChild(tb);
  };

  function buildDetail(box, lv, unlocked) {
    box.innerHTML = '';
    var grid = h('div', 'grid g2');
    var left = h('div');
    var d1 = h('div');
    d1.innerHTML = '<div style="font-size:12px;color:var(--text-3);font-weight:700;margin-bottom:5px">阶段目标</div>' +
      '<div style="font-size:13.5px;line-height:1.75">' + lv.goal + '</div>';
    left.appendChild(d1);
    var d2 = h('div');
    d2.style.marginTop = '11px';
    d2.innerHTML = '<div style="font-size:12px;color:var(--text-3);font-weight:700;margin-bottom:5px">建议节奏</div>' +
      '<div style="font-size:13.5px;line-height:1.75">' + lv.dailyPlan + '</div>';
    left.appendChild(d2);
    var d3 = h('div');
    d3.style.marginTop = '11px';
    d3.innerHTML = '<div style="font-size:12px;color:var(--text-3);font-weight:700;margin-bottom:5px">现实预期</div>' +
      '<div style="font-size:13.5px;line-height:1.75;color:var(--text-2)">' + lv.reality + '</div>';
    left.appendChild(d3);
    grid.appendChild(left);

    var right = h('div');
    right.appendChild(h('div', null, '能力指标（满分 100）'));
    right.lastChild.style.cssText = 'font-size:12px;color:var(--text-3);font-weight:700;margin-bottom:7px';
    var mv = ui.estimateAbilities(lv);
    lv.dimensions.forEach(function (d) {
      var mine = (mv.filter(function (x) { return x.name === d.name; })[0] || { value: 0 }).value;
      var row = h('div');
      row.style.marginBottom = '8px';
      var r = h('div');
      r.style.cssText = 'display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px';
      r.appendChild(h('span', null, d.name));
      var val = h('span', null, '你 ' + mine + ' / 目标 ' + d.target);
      val.style.color = mine >= d.target ? 'var(--success)' : 'var(--text-3)';
      r.appendChild(val);
      row.appendChild(r);
      var bar = h('div', 'bar sm lv' + lv.id.slice(1));
      var fi = h('i');
      fi.style.width = Math.min(100, (mine / d.target) * 100) + '%';
      bar.appendChild(fi);
      row.appendChild(bar);
      var ds = h('div', null, d.desc);
      ds.style.cssText = 'font-size:11px;color:var(--text-3);margin-top:2px';
      row.appendChild(ds);
      right.appendChild(row);
    });
    grid.appendChild(right);
    box.appendChild(grid);

    // 里程碑 + 解锁条件（L4 为终点阶段，无通关条件）
    var bot = h('div');
    bot.style.marginTop = '14px;padding-top:13px;border-top:1px solid var(--border)';
    var v = S.vocabStats(), stk = S.streak();
    var readN = Object.keys(S.state.reading).length;
    var acc = Math.round(S.accuracy('total', 'right') * 100);

    if (!lv.unlock) {
      // 终点阶段：改为展示掌握度自评
      bot.appendChild(h('div', null, '精通阶段掌握度自评'));
      bot.lastChild.style.cssText = 'font-size:12px;color:var(--text-3);font-weight:700;margin-bottom:7px';
      var mg4 = h('div');
      mg4.style.cssText = 'display:flex;gap:9px;flex-wrap:wrap';
      var self4 = [
        { t: '主动词汇 ' + lv.vocabTarget + ' 词', c: v.seenTotal, g: lv.vocabTarget },
        { t: '正确率 ≥ 80%', c: acc, g: 80 },
        { t: '完成 4 篇 L4 长文', c: readN, g: 4 }
      ];
      self4.forEach(function (m) {
        var ok = m.c >= m.g;
        mg4.appendChild(h('span', 'tag ' + (ok ? 'l1' : 'grey'), (ok ? '✓ ' : '○ ') + m.t + '（' + m.c + '/' + m.g + '）'));
      });
      bot.appendChild(mg4);
      var tip4 = h('div');
      tip4.style.cssText = 'margin-top:9px;font-size:12px;color:var(--text-3);line-height:1.7';
      tip4.textContent = '🏁 这是最后一级，没有下一阶段可解锁。此后请以「真实使用」为标准：' +
        '能否在不看字幕的情况下读完一本原版书、能否在会议中表达反对意见。';
      bot.appendChild(tip4);
      box.appendChild(bot);
      return;
    }

    var ms = [
      { t: '主动词汇 ' + lv.vocabTarget + ' 词', c: v.seenTotal, g: lv.vocabTarget },
      { t: '正确率 ≥ ' + lv.unlock.accuracy + '%', c: acc, g: lv.unlock.accuracy },
      { t: '连续打卡 ' + lv.unlock.streak + ' 天', c: stk.current, g: lv.unlock.streak },
      { t: '口语跟读 ' + lv.unlock.speaking + ' 次', c: S.state.speaking.length, g: lv.unlock.speaking },
      { t: '读完 3 篇短文', c: readN, g: 3 }
    ];
    var mg = h('div');
    mg.style.cssText = 'display:flex;gap:9px;flex-wrap:wrap';
    ms.forEach(function (m) {
      var ok = m.c >= m.g;
      var tg = h('span', 'tag ' + (ok ? 'l1' : 'grey'), (ok ? '✓ ' : '○ ') + m.t + '（' + m.c + '/' + m.g + '）');
      mg.appendChild(tg);
    });
    bot.appendChild(h('div', null, '通关条件'));
    bot.lastChild.style.cssText = 'font-size:12px;color:var(--text-3);font-weight:700;margin-bottom:7px';
    bot.appendChild(mg);
    if (!unlocked) {
      var lock = h('div');
      lock.style.cssText = 'margin-top:9px;font-size:12px;color:var(--text-3)';
      lock.innerHTML = '🔒 本阶段尚未解锁 —— 需先完成上一阶段的全部通关条件。解锁后可自由切换难度。';
      bot.appendChild(lock);
    }
    box.appendChild(bot);
  }
})(window);