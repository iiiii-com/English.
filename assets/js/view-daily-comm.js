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
    [['browse', '分类浏览'], ['dialog', '对话示例'], ['drill', '场景演练'], ['random', '随机抽句']].forEach(function (t) {
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
      else if (cur === 'dialog') renderDialogs();
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

    /* ---------- 跟读评测（单条表达） ----------
       复用 ui.canRecognize / ui.scoreSpeech，与场景视图同一套评分口径。
       这里刻意只做「单句跟读」而不是整段——日常表达本来就是一句一句
       往外蹦的，单句反馈比整段更可执行。*/
    function attachShadow(row, target) {
      if (!ui.canRecognize()) return null;
      var btn = h('button', 'mini-btn rec', '🎤');
      btn.title = '跟读评测';
      btn.style.flexShrink = '0';
      var fb = h('div', 'feedback score-fb');
      fb.style.cssText = 'display:none;margin-top:6px';
      row.appendChild(fb);

      var rec = null, t0 = 0, got = '';
      btn.onclick = function () {
        if (btn.classList.contains('on')) {
          if (rec) { try { rec.stop(); } catch (e) { } }
          return;
        }
        var R = global.SpeechRecognition || global.webkitSpeechRecognition;
        rec = new R();
        rec.lang = 'en-US';
        rec.interimResults = true;
        rec.maxAlternatives = 3;
        rec.continuous = false;
        btn.classList.add('on');
        btn.textContent = '⏹';
        t0 = Date.now(); got = '';
        fb.style.display = 'block';
        fb.className = 'feedback info score-fb';
        fb.innerHTML = '<span style="font-size:12.5px">🎙 正在听…请朗读这句</span>';
        rec.onresult = function (e) {
          got = '';
          for (var i = e.resultIndex; i < e.results.length; i++) got += e.results[i][0].transcript;
          if (got) fb.innerHTML = '<span style="font-size:12.5px">识别中：' + got + '</span>';
        };
        rec.onerror = function (e) {
          reset();
          ui.toast('识别失败：' + (e.error === 'not-allowed' ? '请允许麦克风权限' : e.error));
        };
        rec.onend = function () {
          reset();
          var dur = (Date.now() - t0) / 1000;
          if (!got) { fb.className = 'feedback no score-fb'; fb.innerHTML = '没有识别到声音，请重试。'; return; }
          var best = null;
          try {
            for (var k = 0; k < rec.results.length; k++) {
              var r = rec.results[k];
              for (var a = 0; a < r.length; a++) {
                var sc = ui.scoreSpeech(target, r[a].transcript, r[a].confidence || .7, dur);
                if (sc.score > (best ? best.score : 0)) best = sc;
              }
            }
          } catch (e) { }
          if (!best) { fb.className = 'feedback no score-fb'; fb.innerHTML = '识别失败，请重试。'; return; }
          showShadowScore(fb, target, best);
        };
        try { rec.start(); } catch (e) { reset(); ui.toast('无法启动录音'); }
      };
      function reset() {
        btn.classList.remove('on');
        btn.textContent = '🎤';
      }
      row._shadowBtn = btn;
      row._shadowFb = fb;
      return btn;
    }

    function showShadowScore(fb, target, res) {
      var tone = res.score >= 85 ? '很接近了' : res.score >= 70 ? '不错' : '再来一次';
      fb.className = 'feedback ' + (res.score >= 80 ? 'ok' : res.score >= 60 ? 'info' : 'no') + ' score-fb';
      fb.innerHTML = '<b>' + res.score + ' 分</b> · ' + tone +
        ' — 词准确率 <b>' + res.wordAcc + '%</b> · 语速 <b>' + res.wpm + ' WPM</b>' +
        (res.missed.length ? '<br>未识别到：<b style="color:#a83238">' + res.missed.join(' / ') + '</b>' : '<br>全部单词都已识别 ✓') +
        (res.extra.length ? '<br>多识别到：<span style="opacity:.75">' + res.extra.join(' / ') + '</span>' : '') +
        '<br><span style="opacity:.8;font-size:11.5px">评分 = 词准确率×60% + 语速得分×15% + 识别置信度×25%。识别受噪音与口音影响，当参考而非判决。</span>';
      if (global.Progress) global.Progress.recordAnswer(res.score >= 70);
    }

    function rowEl(r) {
      var row = h('div', 'dc-row');
      row.style.cssText = 'padding:8px 0;border-bottom:1px solid var(--surface-2)';
      var top = h('div');
      top.style.cssText = 'display:flex;align-items:center;gap:8px;flex-wrap:wrap';
      var sp = h('button', 'mini-btn', '🔊');
      sp.style.flexShrink = '0';
      sp.title = '朗读';
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
      var shadowBtn = attachShadow(row, r.en);
      if (shadowBtn) top.appendChild(shadowBtn);
      row.appendChild(top);
      var cn = h('div', null, r.cn);
      cn.style.cssText = 'font-size:13px;color:var(--text-2);margin-top:1px';
      row.appendChild(cn);

      // 深层搭配/辨析（若词库里有）
      var deep = global.VocabDeepAny ? global.VocabDeepAny.get(r.en) : null;
      if (deep && deep.coll && deep.coll.length) {
        var cb = h('div', 'dc-coll');
        cb.style.cssText = 'font-size:12px;color:var(--text-2);margin-top:4px;padding:6px 9px;background:var(--surface-2);border-radius:7px;line-height:1.6';
        cb.innerHTML = '<b style="color:var(--text-3)">固定搭配</b> ' + esc(deep.coll[0]) +
          (deep.coll[1] ? ' <span style="opacity:.8">— ' + esc(deep.coll[1]) + '</span>' : '');
        row.appendChild(cb);
      }
      // 这条表达出现在哪段对话里 → 可点击跳转。
      // 与上面的 deep 判断无关：日常表达多是整句，词库里查不到，
      // 但对话层用 key 收录了它们，两套数据源要各走各的。
      var dlgHit = global.CommDialogs ? global.CommDialogs.findByExpression(r.en) : [];
      if (dlgHit.length) {
        var jb = h('button', 'mini-btn ghost', '💬 在对话中');
        jb.style.cssText = 'margin-top:5px;font-size:11.5px';
        jb.title = dlgHit[0].titleCn || dlgHit[0].title;
        jb.onclick = function () { openDialog(dlgHit[0].id); };
        row.appendChild(jb);
      }
      return row;
    }
    function esc(s) {
      return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
      });
    }

    /* ---------- 对话示例 ----------
       把孤立的表达放回真实轮替里：谁在说、什么场合、整段怎么走。*/
    var dlgOpen = null;
    function openDialog(id) {
      var d = global.CommDialogs ? global.CommDialogs.byId(id) : null;
      if (!d) return;
      cur = 'dialog';
      ui.$$('#dcTabs button').forEach(function (x) { x.classList.remove('on'); });
      var btn = ui.$('#dcTabs button[data-dc="dialog"]');
      if (btn) btn.classList.add('on');
      renderDialogs(d.id);
      setTimeout(function () {
        var el = ui.$('#dlg_' + d.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 60);
    }

    function renderDialogs(focusId) {
      var CD = global.CommDialogs;
      if (!CD) return;
      var list = CD.all();

      // 顶部说明
      var intro = h('div', 'card');
      intro.style.cssText = 'background:linear-gradient(140deg,#f2f9ff,#fff 60%)';
      var ih = h('div', 'card-head');
      ih.appendChild(h('h3', null, '为什么孤立背表达不够用？'));
      intro.appendChild(ih);
      var ip = h('div');
      ip.style.cssText = 'font-size:13.5px;line-height:1.85;color:var(--text-2)';
      ip.innerHTML = '左边 ' + all.length + ' 条表达是「话轮」——真实对话的最小单位。' +
        '但话轮必须<b>成串</b>才有用：对方说完 A，你需要 1 秒内调出 B。' +
        '这个能力只能靠「看完整对话 + 听完整对话」建立。<br>' +
        '下面 ' + list.length + ' 段对话把高频表达放回真实语境，' +
        '每段都标注了<b>使用场景</b>与<b>语域提醒</b>——' +
        '同一句中文，在 R1 邮件和 R3 朋友聊天里要用不同的英文。';
      intro.appendChild(ip);
      body.appendChild(intro);

      list.forEach(function (d) {
        body.appendChild(dialogCard(d, focusId === d.id));
      });
    }

    function dialogCard(d, focus) {
      var card = h('div', 'card');
      card.id = 'dlg_' + d.id;
      if (focus) {
        card.style.borderColor = 'var(--primary)';
        card.style.boxShadow = '0 0 0 3px var(--primary-soft)';
      }
      var hd = h('div', 'card-head');
      var left = h('div');
      var meta = h('div', 'sub');
      meta.style.cssText = 'display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin-top:2px';
      var catTag = h('span', 'tag', d.cat);
      catTag.style.cssText = 'background:#eef2ff;color:#4f7cff';
      meta.appendChild(catTag);
      var rTag = h('span', 'tag', d.r);
      rTag.style.cssText = 'background:' + (RCOLOR[d.r] || '#888') + '18;color:' + (RCOLOR[d.r] || '#888');
      meta.appendChild(rTag);
      meta.appendChild(h('span', 'sub', (d.lines || []).length + ' 句 · ' + d.id));
      left.appendChild(h('h3', null, d.titleCn));
      left.appendChild(h('div', 'sub', d.title));
      left.appendChild(meta);
      hd.appendChild(left);
      card.appendChild(hd);

      // 使用场景
      if (d.scene) {
        var sc = h('div', 'dc-scene');
        sc.innerHTML = '<b>什么时候用</b>：' + esc(d.scene);
        card.appendChild(sc);
      }

      // 对话正文
      var box = h('div', 'dc-dialog');
      var cnOn = true;
      var stats = { n: 0, sum: 0 };
      // 统计条先建好，逐句跟读回调要用它的 refresh
      var st2 = h('div', 'sub');
      st2.style.cssText = 'margin-top:6px;font-size:11.5px;color:var(--text-3)';
      var refreshStats = function () {
        st2.textContent = stats.n ? '本段跟读 ' + stats.n + ' 次 · 平均 ' + Math.round(stats.sum / stats.n) + ' 分' : '';
      };

      (d.lines || []).forEach(function (ln, i) {
        var row = h('div', 'dc-turn ' + (ln.who === 'A' ? 'is-a' : 'is-b'));
        var who = h('div', 'dc-who', ln.who);
        var col = h('div', 'dc-col');

        var enWrap = h('div', 'dc-en');
        var sp = h('button', 'mini-btn', '🔊');
        sp.style.flexShrink = '0';
        sp.title = '朗读这句';
        sp.onclick = function () { ui.tts.speak(ln.en); };
        enWrap.appendChild(sp);
        var enT = h('span', null, ln.en);
        enT.style.cssText = 'font-size:14.5px;flex:1;cursor:pointer;line-height:1.55';
        enT.title = '点击朗读';
        enT.onclick = function () { ui.tts.speak(ln.en); };
        enWrap.appendChild(enT);
        col.appendChild(enWrap);

        var cnT = h('div', 'dc-cn', ln.cn);
        col.appendChild(cnT);

        // 重点表达：标注 + 搭配 + 划词取词
        if (ln.key) {
          var kb = h('div', 'dc-key');
          var kTag = h('button', 'mini-btn ghost', '⭐ ' + ln.key);
          kTag.style.fontSize = '11.5px';
          kTag.title = '查看这个表达的讲解';
          kTag.onclick = function (e) {
            e.stopPropagation();
            if (global.Lookup) global.Lookup.show(ln.key);
          };
          kb.appendChild(kTag);
          var deep = global.VocabDeepAny ? global.VocabDeepAny.get(ln.key) : null;
          if (deep && deep.coll && deep.coll.length) {
            var cnote = h('span', 'dc-keynote');
            cnote.textContent = '固定搭配：' + deep.coll[0] + (deep.coll[1] ? '（' + deep.coll[1] + '）' : '');
            kb.appendChild(cnote);
          }
          col.appendChild(kb);
        }

        // 跟读评测
        var fbHost = h('div');
        col.appendChild(fbHost);
        attachShadowTurn(col, ln.en, fbHost, stats, refreshStats);

        row.appendChild(who);
        row.appendChild(col);
        box.appendChild(row);
      });
      card.appendChild(box);

      // 语域提醒
      if (d.note) {
        var nt = h('div', 'dc-note');
        nt.innerHTML = '<b>语域提醒</b>：' + esc(d.note);
        card.appendChild(nt);
      }

      // 操作行
      var act = h('div', 'btn-row');
      act.style.marginTop = '13px';
      var playAll = h('button', 'btn soft', '▶ 连续朗读全段');
      playAll.onclick = function () {
        if (!ui.tts.speakSequence) { ui.toast('朗读队列不可用'); return; }
        ui.tts.speakSequence((d.lines || []).map(function (l) { return { text: l.en }; }), {
          onprogress: function (i) {
            var rows = ui.$$('.dc-turn', box);
            rows.forEach(function (x) { x.style.background = ''; });
            if (rows[i]) rows[i].style.background = 'var(--primary-soft)';
          },
          onend: function () {
            ui.$$('.dc-turn', box).forEach(function (x) { x.style.background = ''; });
          }
        });
      };
      act.appendChild(playAll);

      var tg = h('button', 'btn ghost', '隐藏中文');
      tg.onclick = function () {
        cnOn = !cnOn;
        ui.$$('.dc-cn', box).forEach(function (x) { x.style.display = cnOn ? '' : 'none'; });
        tg.textContent = cnOn ? '隐藏中文' : '显示中文';
      };
      act.appendChild(tg);

      var st = h('span', 'sub');
      st.style.cssText = 'margin-left:auto;align-self:center;font-size:12px';
      card.appendChild(act);
      card.appendChild(st2);
      refreshStats();

      return card;
    }

    /* 对话里单句的跟读评测（与分类浏览共用 attachShadow 的评分口径） */
    function attachShadowTurn(col, target, fbHost, stats, refresh) {
      if (!ui.canRecognize()) return;
      var btn = h('button', 'mini-btn rec', '🎤 跟读');
      btn.style.marginTop = '6px';
      fbHost.appendChild(btn);
      var rec = null, t0 = 0, got = '';
      function reset() { btn.classList.remove('on'); btn.textContent = '🎤 跟读'; }
      btn.onclick = function () {
        if (btn.classList.contains('on')) {
          if (rec) { try { rec.stop(); } catch (e) { } }
          return;
        }
        var R = global.SpeechRecognition || global.webkitSpeechRecognition;
        rec = new R();
        rec.lang = 'en-US';
        rec.interimResults = true;
        rec.maxAlternatives = 3;
        rec.continuous = false;
        btn.classList.add('on');
        btn.textContent = '⏹ 停止';
        t0 = Date.now(); got = '';
        fbHost.innerHTML = '';
        fbHost.appendChild(btn);
        var tip = h('div', 'feedback info');
        tip.style.cssText = 'margin-top:6px';
        tip.innerHTML = '<span style="font-size:12.5px">🎙 正在听…请朗读这句</span>';
        fbHost.appendChild(tip);
        rec.onresult = function (e) {
          got = '';
          for (var i = e.resultIndex; i < e.results.length; i++) got += e.results[i][0].transcript;
          if (got) tip.innerHTML = '<span style="font-size:12.5px">识别中：' + got + '</span>';
        };
        rec.onerror = function (e) {
          reset();
          ui.toast('识别失败：' + (e.error === 'not-allowed' ? '请允许麦克风权限' : e.error));
        };
        rec.onend = function () {
          reset();
          var dur = (Date.now() - t0) / 1000;
          var fb = h('div', 'feedback');
          fb.style.marginTop = '6px';
          fbHost.innerHTML = '';
          fbHost.appendChild(btn);
          fbHost.appendChild(fb);
          if (!got) { fb.className = 'feedback no'; fb.innerHTML = '没有识别到声音，请重试。'; return; }
          var best = null;
          try {
            for (var k = 0; k < rec.results.length; k++) {
              var r = rec.results[k];
              for (var a = 0; a < r.length; a++) {
                var sc = ui.scoreSpeech(target, r[a].transcript, r[a].confidence || .7, dur);
                if (sc.score > (best ? best.score : 0)) best = sc;
              }
            }
          } catch (e) { }
          if (!best) { fb.className = 'feedback no'; fb.innerHTML = '识别失败，请重试。'; return; }
          showShadowScore(fb, target, best);
          if (stats) { stats.n++; stats.sum += best.score; if (refresh) refresh(); }
        };
        try { rec.start(); } catch (e) { reset(); ui.toast('无法启动录音'); }
      };
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