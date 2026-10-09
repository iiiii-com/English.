/* ============================================================
   view-progress.js —— 学习记忆中心
   展示 Progress 模块记录的细粒度学习数据：
     - 记忆画像（词汇掌握分层）
     - 作息规律（高峰时段）
     - 学习热力图
     - 各模块进度
     - 弱项诊断与建议
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, P = global.Progress,
      ui = global.ui, h = ui.h, $ = ui.$, $$ = ui.$$;

  var STAGE_COLOR = ['#e2e6ec', '#94a3b8', '#4f7cff', '#22b07d', '#17805a'];
  var MODULE_NAME = {
    vocab: '词汇', speak: '口语', read: '阅读',
    comm: '日常交流', psych: '心理机制', path: '路径', other: '其他'
  };

  /** 概览数字卡 */
  function statCard(label, value, unit, hint) {
    var c = h('div');
    c.style.cssText = 'padding:14px;border:1px solid var(--border);border-radius:11px;background:var(--surface)';
    var l = h('div', null, label);
    l.style.cssText = 'font-size:11.5px;color:var(--text-3);font-weight:600';
    c.appendChild(l);
    var v = h('div');
    v.style.cssText = 'display:flex;align-items:baseline;gap:4px;margin-top:3px';
    var num = h('b', null, String(value));
    num.style.cssText = 'font-size:23px;letter-spacing:-.02em';
    v.appendChild(num);
    if (unit) {
      var u = h('span', null, unit);
      u.style.cssText = 'font-size:12px;color:var(--text-3)';
      v.appendChild(u);
    }
    c.appendChild(v);
    if (hint) {
      var hh = h('div', null, hint);
      hh.style.cssText = 'font-size:11px;color:var(--text-3);margin-top:2px';
      c.appendChild(hh);
    }
    return c;
  }

  V.progress = function (root) {
    if (!P) {
      root.appendChild(ui.errorState('进度系统未初始化', '请刷新页面重试'));
      return;
    }

    var wm = P.wordMemory();
    var rp = P.readingProgress();
    var lp = P.liaisonProgress();
    var tp = P.timeProfile();
    var diag = P.diagnose();

    /* ---------- 页头 ---------- */
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '学习记忆中心'));
    head.appendChild(h('p', null,
      '系统自动记录你的每一次学习行为，无需手动记录。已追踪 ' + tp.sessions + ' 次学习行为、' +
      P.activeDays() + ' 个活跃日。'));
    root.appendChild(head);

    /* ---------- 概览卡 ---------- */
    var ov = h('div', 'card');
    var ovh = h('div', 'card-head');
    ovh.appendChild(h('h3', null, '记忆总览'));
    ovh.appendChild(h('span', 'sub', '词汇 · 阅读 · 口语 · 连读'));
    ov.appendChild(ovh);

    var grid = h('div', 'grid g4');
    grid.appendChild(statCard('已学词汇', wm.learned, '/ ' + wm.total,
      Math.round(wm.coverage * 100) + '% 覆盖'));
    grid.appendChild(statCard('长期记忆', wm.mature, '词',
      '间隔 ≥21 天'));
    grid.appendChild(statCard('连续打卡', S.streak().current, '天',
      S.streak().todayDone ? '今天已学' : '今天未学'));
    grid.appendChild(statCard('累计时长', Math.round(S.totalMinutes() / 60), '小时',
      tp.totalMinutes + ' 分钟（细粒度）'));
    ov.appendChild(grid);
    root.appendChild(ov);

    /* ---------- 词汇记忆分层 ---------- */
    var wc = h('div', 'card');
    wc.style.marginTop = '16px';
    var wch = h('div', 'card-head');
    wch.appendChild(h('h3', null, '词汇记忆分层'));
    wch.appendChild(h('span', 'sub', '依据 SM-2 间隔天数判定，不是「看过」而是「记住」'));
    wc.appendChild(wch);

    var names = wm.stageName;
    var bar = h('div');
    bar.style.cssText = 'display:flex;height:34px;border-radius:9px;overflow:hidden;margin:14px 0 10px';
    var maxV = Math.max.apply(null, wm.stage.slice(1)) || 1;
    wm.stage.forEach(function (v, i) {
      if (i === 0) return;   // 未学不占条
      var seg = h('div');
      seg.style.cssText = 'flex:' + Math.max(0.06, v / maxV) + ';background:' + STAGE_COLOR[i] +
        ';display:flex;align-items:center;justify-content:center;color:#fff;font-size:11.5px;font-weight:700;' +
        'min-width:0;overflow:hidden;white-space:nowrap';
      seg.textContent = v > 0 ? v : '';
      seg.title = names[i] + '：' + v + ' 词';
      bar.appendChild(seg);
    });
    wc.appendChild(bar);

    var lg = h('div');
    lg.style.cssText = 'display:flex;gap:16px;flex-wrap:wrap;font-size:12.5px;color:var(--text-2)';
    wm.stage.forEach(function (v, i) {
      if (i === 0) return;
      var it = h('span');
      it.style.cssText = 'display:flex;align-items:center;gap:5px';
      var dot = h('i');
      dot.style.cssText = 'width:9px;height:9px;border-radius:3px;background:' + STAGE_COLOR[i] + ';display:inline-block';
      it.appendChild(dot);
      it.appendChild(document.createTextNode(names[i] + ' ' + v));
      lg.appendChild(it);
    });
    wc.appendChild(lg);

    var exp = h('div');
    exp.style.cssText = 'margin-top:12px;padding:11px 13px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.8';
    exp.innerHTML = '<b>怎么理解这些分层？</b>' +
      '「长期记忆」指该词的 SM-2 间隔已达 21 天以上且无遗忘记录——' +
      '依据艾宾浩斯遗忘曲线，这是真正不再需要主动复习的部分。<br>' +
      '「未学」的 ' + wm.untouched + ' 个词不是问题，词库 5449 词按 12 词/天的节奏需要约 1 年半，' +
      '关键是<b>已学的部分记得牢</b>而非盲目扩大数量。';
    wc.appendChild(exp);
    root.appendChild(wc);

    /* ---------- 诊断报告 ---------- */
    var dc = h('div', 'card');
    dc.style.marginTop = '16px';
    var dch = h('div', 'card-head');
    dch.appendChild(h('h3', null, '弱项诊断'));
    dch.appendChild(h('span', 'sub', diag.length + ' 条 · 每条都可溯源到具体记录'));
    dc.appendChild(dch);

    if (!diag.length) {
      dc.appendChild(ui.emptyState('暂无诊断数据', {
        icon: '📊',
        hint: '完成一些复习、跟读和阅读后，系统会基于你的实际错误给出针对性建议。所有诊断都能追溯到具体的作答记录，不做黑箱判断。'
      }));
    } else {
      diag.forEach(function (d) {
        var it = h('div');
        var bg = d.level === 'warn' ? '#fff5f5' : (d.level === 'good' ? '#f0fbf5' : 'var(--surface-2)');
        var bar2 = d.level === 'warn' ? '#e2585f' : (d.level === 'good' ? '#22b07d' : '#94a3b8');
        it.style.cssText = 'padding:13px 14px;background:' + bg + ';border-left:3px solid ' + bar2 +
          ';border-radius:9px;margin-bottom:9px';
        var t = h('div', null, d.title);
        t.style.cssText = 'font-size:13.5px;font-weight:700;color:' + (d.level === 'warn' ? '#a83238' : 'var(--text)');
        it.appendChild(t);
        var dt = h('div', null, d.detail);
        dt.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.75;margin-top:3px';
        it.appendChild(dt);
        if (d.action) {
          var ac = h('div', null, '→ ' + d.action);
          ac.style.cssText = 'font-size:12.5px;color:var(--primary);margin-top:6px;font-weight:600';
          it.appendChild(ac);
        }
        dc.appendChild(it);
      });
    }
    root.appendChild(dc);

    /* ---------- 作息画像 ---------- */
    if (tp.sessions > 0) {
      var tp1 = h('div', 'card');
      tp1.style.marginTop = '16px';
      var tph = h('div', 'card-head');
      tph.appendChild(h('h3', null, '你的学习作息'));
      tph.appendChild(h('span', 'sub',
        tp.peakSlot ? '高峰时段：' + tp.peakSlot + '（累计 ' + tp.peakMinutes + ' 分钟）' : ''));
      tp1.appendChild(tph);

      var slots = ['早晨', '中午', '下午', '晚上', '深夜', '凌晨'];
      var maxM = Math.max.apply(null, slots.map(function (s) { return tp.slots[s] || 0; })) || 1;
      var sh = h('div');
      sh.style.cssText = 'display:flex;align-items:flex-end;gap:10px;height:110px;margin:14px 0 6px;padding:0 4px';
      slots.forEach(function (s) {
        var v = tp.slots[s] || 0;
        var col = h('div');
        col.style.cssText = 'flex:1;display:flex;flex-direction:column;align-items:center;gap:5px';
        // 固定高度容器，保证零数据时也能对齐基线
        var numWrap = h('div');
        numWrap.style.cssText = 'height:16px;display:flex;align-items:flex-end';
        var num = h('div', null, v ? v + '′' : '');
        num.style.cssText = 'font-size:11px;color:var(--text-3);line-height:1';
        numWrap.appendChild(num);
        col.appendChild(numWrap);
        var bar3 = h('div');
        var pct = v / maxM;
        bar3.style.cssText = 'width:100%;height:' + Math.max(3, pct * 72) + 'px;border-radius:5px 5px 0 0;' +
          'background:' + (s === tp.peakSlot && v > 0 ? 'var(--primary)' : '#d8dde5');
        col.appendChild(bar3);
        var lbl = h('div', null, s);
        lbl.style.cssText = 'font-size:11.5px;color:var(--text-3)';
        col.appendChild(lbl);
        sh.appendChild(col);
      });
      tp1.appendChild(sh);

      // 星期分布
      var wd = ['一', '二', '三', '四', '五', '六', '日'];
      var maxD = Math.max.apply(null, wd.map(function (d) { return tp.days[d] || 0; })) || 1;
      var dr = h('div');
      dr.style.cssText = 'display:flex;gap:6px;margin-top:12px;flex-wrap:wrap';
      wd.forEach(function (d) {
        var v = tp.days[d] || 0;
        var chip = h('span', null, '周' + d + ' ' + v);
        chip.style.cssText = 'font-size:11.5px;padding:3px 9px;border-radius:6px;' +
          'background:' + (d === tp.peakDay ? 'var(--primary-soft)' : 'var(--surface-2)') +
          ';color:' + (d === tp.peakDay ? 'var(--primary)' : 'var(--text-3)') +
          ';border:1px solid ' + (d === tp.peakDay ? 'var(--primary)' : 'var(--border)');
        dr.appendChild(chip);
      });
      tp1.appendChild(dr);

      var tip = h('div');
      tip.style.cssText = 'margin-top:12px;padding:11px 13px;background:var(--surface-2);border-radius:9px;font-size:12.5px;color:var(--text-2);line-height:1.8';
      tip.innerHTML = '<b>记忆衰退与时段</b>：艾宾浩斯曲线显示，早晨 20 分钟的复习效率约为深夜的 1.5–2 倍，' +
        '因为经过一夜睡眠后，记忆已完成部分巩固。系统会持续记录你的时段偏好，' +
        '如果你的高峰与「睡前 2 小时」重合，试试把新词学习挪到早上，复习仍放在睡前。';
      tp1.appendChild(tip);
      root.appendChild(tp1);
    }

    /* ---------- 学习热力图 ---------- */
    var hm = P.heatmap(119);
    if (hm.some(function (d) { return d.minutes > 0; })) {
      var hc = h('div', 'card');
      hc.style.marginTop = '16px';
      var hh = h('div', 'card-head');
      hh.appendChild(h('h3', null, '学习热力图'));
      hh.appendChild(h('span', 'sub', '最近 17 周 · 深色代表投入更多'));
      hc.appendChild(hh);
      var grid2 = h('div');
      // 17 列 × 7 行 = 119 天；单元格需小而紧凑，否则占满整屏
      grid2.style.cssText = 'display:grid;grid-template-columns:repeat(17,1fr);' +
        'gap:3px;margin-top:14px;max-width:520px';
      var maxMin = Math.max.apply(null, hm.map(function (d) { return d.minutes; })) || 1;
      hm.forEach(function (d) {
        var cell = h('div');
        var lvl = d.minutes === 0 ? 0 : Math.ceil(d.minutes / maxMin * 4);
        cell.style.cssText = 'aspect-ratio:1;border-radius:2px;background:' +
          ['#f0f2f5', '#dbe7f5', '#a9c6ea', '#6f9fdc', '#3b6fc4'][lvl] +
          ';max-height:22px';
        cell.title = d.date + '：' + d.minutes + ' 分钟';
        grid2.appendChild(cell);
      });
      hc.appendChild(grid2);

      var lg2 = h('div');
      lg2.style.cssText = 'display:flex;align-items:center;gap:5px;margin-top:12px;font-size:11.5px;color:var(--text-3)';
      lg2.appendChild(document.createTextNode('少'));
      ['#f0f2f5', '#dbe7f5', '#a9c6ea', '#6f9fdc', '#3b6fc4'].forEach(function (c) {
        var s2 = h('i');
        s2.style.cssText = 'width:12px;height:12px;border-radius:2px;background:' + c + ';display:inline-block';
        lg2.appendChild(s2);
      });
      lg2.appendChild(document.createTextNode('多'));
      hc.appendChild(lg2);
      root.appendChild(hc);
    }

    /* ---------- 各模块进度 ---------- */
    var mc = h('div', 'card');
    mc.style.marginTop = '16px';
    var mch = h('div', 'card-head');
    mch.appendChild(h('h3', null, '模块进度'));
    mch.appendChild(h('span', 'sub', '细粒度记录，非粗略计数'));
    mc.appendChild(mch);

    var mrows = [
      { name: '词汇', cur: wm.learned, total: wm.total, hint: wm.mature + ' 个已长期记忆' },
      { name: '阅读', cur: rp.doneQ, total: rp.totalQ, hint: rp.finished + '/' + rp.total + ' 篇完成' },
      { name: '连读例句', cur: lp.done, total: lp.total, hint: lp.pct ? Math.round(lp.pct * 100) + '% 已跟读' : '未开始' },
      { name: '口语', cur: P.data.speaking ? Object.keys(P.data.speaking).length : 0, total: null, hint: '平均 ' + P.snapshot().speaking.avgBest + ' 分' }
    ];
    mrows.forEach(function (r) {
      var it = h('div');
      it.style.cssText = 'padding:12px 0;border-bottom:1px solid var(--surface-2)';
      var top = h('div');
      top.style.cssText = 'display:flex;align-items:center;gap:10px;margin-bottom:6px';
      var nm = h('b', null, r.name);
      nm.style.cssText = 'font-size:13.5px;min-width:76px';
      top.appendChild(nm);
      var pct = r.total ? r.cur / r.total : 0;
      var barW = h('div');
      barW.style.cssText = 'flex:1;height:8px;background:var(--surface-2);border-radius:5px;overflow:hidden';
      var fill = h('div');
      fill.style.cssText = 'height:100%;width:' + (r.total ? Math.min(100, pct * 100) : 0) + '%;' +
        'background:linear-gradient(90deg,#4f7cff,#22b07d);border-radius:5px;transition:width .5s';
      barW.appendChild(fill);
      top.appendChild(barW);
      var num = h('span', null, r.total ? r.cur + ' / ' + r.total : r.cur);
      num.style.cssText = 'font-size:12px;color:var(--text-3);min-width:80px;text-align:right';
      top.appendChild(num);
      it.appendChild(top);
      var hint = h('div', null, r.hint);
      hint.style.cssText = 'font-size:11.5px;color:var(--text-3);margin-left:86px';
      it.appendChild(hint);
      mc.appendChild(it);
    });
    root.appendChild(mc);

    /* ---------- 数据管理 ---------- */
    var sc = h('div', 'card');
    sc.style.marginTop = '16px';
    var sch = h('div', 'card-head');
    sch.appendChild(h('h3', null, '记忆数据'));
    sch.appendChild(h('span', 'sub', '所有数据仅存本机'));
    sc.appendChild(sch);

    var size = 0;
    try { size = JSON.stringify(P.data).length; } catch (e) { /* 序列化失败忽略 */ }
    var info = h('div');
    info.style.cssText = 'font-size:12.5px;color:var(--text-3);margin-bottom:12px;line-height:1.8';
    info.textContent = '当前记忆数据约 ' + (size / 1024).toFixed(1) + ' KB。' +
      '包含 ' + Object.keys(P.data.words).length + ' 条词汇记录、' +
      Object.keys(P.data.speaking).length + ' 条发音记录、' +
      Object.keys(P.data.reading).length + ' 篇阅读轨迹、' +
      P.data.timeline.length + ' 条时间线记录。';
    sc.appendChild(info);

    var row = h('div', 'btn-row');
    var b1 = h('button', 'btn sm', '导出学习报告');
    b1.onclick = function () {
      try {
        var blob = new Blob([JSON.stringify(P.snapshot(), null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'learning-report-' + S.today() + '.json';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        ui.toast('学习报告已导出');
      } catch (e) {
        ui.toast('导出失败：' + e.message, { type: 'error' });
      }
    };
    var b2 = h('button', 'btn sm ghost', '压缩历史数据');
    b2.onclick = function () {
      P.compress();
      P.save();
      ui.toast('已压缩历史明细（汇总数据保留）', { type: 'success' });
      setTimeout(function () { V.progress(document.getElementById('view').firstChild); }, 500);
    };
    var b3 = h('button', 'btn sm ghost danger', '清空记忆数据');
    b3.onclick = function () {
      ui.confirm({
        title: '清空学习记忆？',
        text: '这会删除全部词汇掌握记录、发音记录、阅读轨迹与时间线。',
        detail: '不影响 SM-2 复习队列与学习统计，但记忆画像将从零开始。建议先导出学习报告。',
        okText: '确认清空', danger: true
      }).then(function (ok) {
        if (!ok) return;
        P.reset();
        ui.toast('记忆数据已清空', { type: 'success' });
        setTimeout(function () { V.progress(document.getElementById('view').firstChild); }, 500);
      });
    };
    row.appendChild(b1); row.appendChild(b2); row.appendChild(b3);
    sc.appendChild(row);
    root.appendChild(sc);
  };
})(window);