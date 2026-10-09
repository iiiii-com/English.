/* ============================================================
   view-tts.js —— 发音设置
   职责：
     1. 如实展示设备的语音情况（本机有哪些语音、能不能读英语）
     2. 让用户在「本机 / 云端 / 自动」之间选择
     3. 提供安装英语语音包的操作指引
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, T = global.TTS, ui = global.ui, h = ui.h, S = global.Store;

  /* 把用户输入的地址安全地插进 innerHTML */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  V.tttsettings = function (root) {
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, '发音设置'));
    head.appendChild(h('p', null,
      '发音是否正常，取决于设备上有没有英语语音包。' +
      '这里会如实告诉你当前状态，并让你选择用本机发音还是云端发音。'));
    root.appendChild(head);

    var body = h('div');
    root.appendChild(body);
    render();

    function render() {
      ui.clear(body);
      var d = T.diagnose();

      /* ---------- 状态卡 ---------- */
      var card = h('div', 'card');
      var ch = h('div', 'card-head');
      ch.appendChild(h('h3', null, '当前设备状态'));

      var tag = h('span', 'tag');
      /* 判定顺序刻意把代理放在最前面。
         旧逻辑只看设备语音，缺语音包就报「缺少英语语音包」，
         这在有代理可用时会误导用户去装根本不需要的语音包。 */
      if (T.proxyAlive && T.proxyAlive()) {
        tag.className = 'tag green';
        tag.textContent = '在线发音可用';
      } else if (d.env === 'native-ok') {
        tag.className = 'tag green';
        tag.textContent = 'App 原生发音可用';
        onceOK();
      } else if (d.env === 'ok') {
        tag.className = 'tag green';
        tag.textContent = '本机发音可用';
        onceOK();
      } else if (d.env === 'cloud') {
        tag.className = 'tag';
        tag.textContent = '云端发音';
      } else if (d.env === 'pack') {
        // 离线包可用：不是「不可用」，是「只有收录的词能读」
        tag.className = 'tag green';
        tag.textContent = '离线词库可用';
        onceOK();
      } else if (d.env === 'no-en-voice') {
        tag.className = 'tag warn';
        tag.textContent = '缺少英语语音包';
      } else {
        tag.className = 'tag grey';
        tag.textContent = '不支持';
      }
      ch.appendChild(tag);
      card.appendChild(ch);

      var rows = [
        ['运行环境', d.hasNative ? 'Android App' : '浏览器'],
        ['浏览器支持语音合成', d.supported ? '是' : '否'],
        ['离线词库（免网络）', (T.packInfo && T.packInfo().count)
          ? T.packInfo().count + ' 个词已内置' : '未内置'],
        ['在线发音服务', (T.proxyAlive && T.proxyAlive()) ? '已连接' : '未连接'],
        ['系统语音总数', d.totalVoices + ' 个'],
        ['其中英语语音', d.englishVoices > 0 ? d.englishVoices + ' 个' : '0 个（无法读英文）'],
        ['当前使用', (T.proxyAlive && T.proxyAlive())
          ? '在线发音（自带音色，整句可读）'
          : (T.packInfo && T.packInfo().count) ? '离线词库 ' + T.packInfo().count + ' 词（长句需连服务）'
          : d.env === 'native-ok' ? 'App 原生语音引擎'
          : d.env === 'ok' ? '本机：' + d.picked
          : d.env === 'cloud' ? '云端发音' : '暂不可用']
      ];
      var tb = h('div', 'info-list');
      rows.forEach(function (r) {
        var row = h('div');
        row.style.cssText = 'display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--border);font-size:13.5px';
        row.appendChild(h('span', null, r[0]));
        var v = h('span');
        v.style.cssText = 'font-weight:600;text-align:right;max-width:60%';
        v.textContent = r[1];
        if (r[0] === '其中英语语音' && d.englishVoices === 0) {
          v.style.color = '#b8790f';
        }
        row.appendChild(v);
        tb.appendChild(row);
      });
      card.appendChild(tb);
      body.appendChild(card);

      /* ---------- 代理发音 ----------
         这是整页优先级最高的一块，放在最前面。
         理由很直接：本机语音依赖操作系统装了英语语音包，
         而代理发音是自带音色的，任何设备、任何整句都能读出来。
         用户来这个页面多半就是因为点了没声音，
         让他先看到「代理可用」比先看到「你缺语音包」更解决问题。*/
      renderProxyCard(body);

      /* ---------- App 内专属说明 ----------
         Android WebView 不实现 Web Speech API，网页看到的「语音总数」恒为 0，
         直接展示会让用户误以为坏了。必须说清 App 走的是另一条链路。 */
      if (d.hasNative) {
        var note = h('div', 'card');
        var nh = h('div', 'card-head');
        nh.appendChild(h('h3', null, '为什么这里显示 0 个语音'));
        note.appendChild(nh);
        var nd = h('div');
        nd.style.cssText = 'font-size:13px;color:var(--text-2);line-height:1.85';
        nd.textContent = 'Android 的 App 内置浏览器不提供网页语音接口，'
          + '所以上面显示的语音数量是 0，这属于正常现象，不代表 App 坏了。'
          + 'App 会直接调用手机自带的语音引擎来朗读英文，不经过网页接口。'
          + '如果这里显示「App 原生发音可用」，点任意单词就能听到声音。';
        note.appendChild(nd);
        body.appendChild(note);
      }

      /* ---------- 语音列表 ---------- */
      if (d.totalVoices > 0) {
        var vc = h('div', 'card');
        var vh = h('div', 'card-head');
        vh.appendChild(h('h3', null, '设备上的语音'));
        vc.appendChild(vh);
        var note = h('div');
        note.style.cssText = 'font-size:12.5px;color:var(--text-3);margin-bottom:10px;line-height:1.7';
        note.textContent = d.englishVoices === 0
          ? '这些都不是英语语音，无法正确朗读英文单词。这就是「点了发音没反应」或「发音奇怪」的原因。'
          : '其中英语语音可用于朗读。';
        vc.appendChild(note);
        d.allVoiceNames.forEach(function (n) {
          var it = h('div');
          it.style.cssText = 'padding:6px 0;font-size:13px;color:var(--text-2);border-bottom:1px solid var(--border)';
          it.textContent = n;
          if (n.indexOf('[en') >= 0) it.style.color = '#1a7f4b';
          vc.appendChild(it);
        });
        body.appendChild(vc);
      }

      /* ---------- 发音方式选择 ---------- */
      var pc = h('div', 'card');
      var ph = h('div', 'card-head');
      ph.appendChild(h('h3', null, '发音方式'));
      pc.appendChild(ph);

      var pref = T.getPref();

      var seg = h('div', 'segment');
      seg.style.marginBottom = '14px';
      [['auto', '自动'], ['local', '只用本机'], ['cloud', '只用云端']].forEach(function (o) {
        var b = h('button', pref.cloud === o[0] ? 'on' : null, o[1]);
        b.type = 'button';
        b.dataset.v = o[0];
        b.onclick = function () {
          if (o[0] === 'cloud' && !pref.allowCloud) {
            // 选云端要先征得同意，明确告知数据流向
            global.UI.sheet('启用云端发音？', function (box) {
              var p1 = h('p', 'sheet-text',
                '云端发音会把要朗读的文本发送给在线词典服务，换取音频。');
              var p2 = h('p', 'sheet-detail',
                '好处是任何设备都能正常发音，不需要安装任何语音包。' +
                '代价是需要联网，且朗读内容会发送给该服务——'
                + '如果你在学敏感句子，请改用「自动」或「只用本机」。');
              var row = h('div', 'btn-row');
              var no = h('button', 'btn ghost', '不用');
              var yes = h('button', 'btn', '我同意，启用');
              no.onclick = function () { global.UI.closeAllSheets(); };
              yes.onclick = function () {
                global.UI.closeAllSheets();
                T.setPref({ allowCloud: true, cloud: 'cloud' });
                render();
              };
              row.appendChild(no); row.appendChild(yes);
              box.appendChild(p1); box.appendChild(p2); box.appendChild(row);
            }, { size: 'sm' });
            return;
          }
          T.setPref({ cloud: o[0] });
          render();
        };
        seg.appendChild(b);
      });
      pc.appendChild(seg);

      var explain = h('div');
      explain.style.cssText = 'font-size:13px;color:var(--text-2);line-height:1.8;background:var(--surface-2);padding:12px 14px;border-radius:10px';
      explain.textContent =
        pref.cloud === 'local'
          ? '只用本机：完全离线、单词不外发。但设备必须已安装英语语音包，否则无法发音。'
          : pref.cloud === 'cloud'
            ? '只用云端：发音始终正常，但需要联网，且每次朗读都会把文本发送给词典服务。'
            : '自动：有本机英语语音就用本机（更快更准），没有则用云端兜底。推荐。';
      pc.appendChild(explain);

      // 本机英语语音缺失时，允许单独开关云端
      if (d.englishVoices === 0) {
        var row2 = h('div');
        row2.style.cssText = 'display:flex;align-items:center;gap:10px;margin-top:14px;flex-wrap:wrap';
        var cb = h('label');
        cb.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:13.5px;cursor:pointer';
        var input = h('input');
        input.type = 'checkbox';
        input.checked = !!pref.allowCloud;
        input.onchange = function () {
          T.setPref({ allowCloud: input.checked });
          render();
        };
        cb.appendChild(input);
        cb.appendChild(h('span', null, '允许使用云端发音'));
        row2.appendChild(cb);
        pc.appendChild(row2);
      }
      body.appendChild(pc);

      /* ---------- 语速 ---------- */
      var rc = h('div', 'card');
      var rh = h('div', 'card-head');
      rh.appendChild(h('h3', null, '语速'));
      rc.appendChild(rh);

      var rate = (S.state.settings.ttsRate) || 0.9;
      var slider = h('input');
      slider.type = 'range';
      slider.min = '0.5'; slider.max = '1.5'; slider.step = '0.05';
      slider.value = String(rate);
      slider.style.cssText = 'width:100%;margin:6px 0';
      var val = h('div');
      val.style.cssText = 'font-size:13px;color:var(--text-2)';
      function rateText(r) {
        if (r < 0.7) return r.toFixed(2) + '× · 很慢，适合初次学习';
        if (r < 0.95) return r.toFixed(2) + '× · 偏慢，适合跟读';
        if (r < 1.15) return r.toFixed(2) + '× · 常速（推荐）';
        return r.toFixed(2) + '× · 偏快';
      }
      val.textContent = rateText(rate);
      slider.oninput = function () {
        val.textContent = rateText(parseFloat(slider.value));
      };
      slider.onchange = function () {
        S.state.settings.ttsRate = parseFloat(slider.value);
        if (S.save) S.save();
        ui.toast('语速已保存');
      };
      rc.appendChild(slider);
      rc.appendChild(val);

      var testRow = h('div', 'btn-row');
      testRow.style.marginTop = '12px';
      var t1 = h('button', 'btn soft', '🔊 试听');
      t1.onclick = function () { T.speak('The quick brown fox jumps over the lazy dog.'); };
      var t2 = h('button', 'btn', '🔊 单词测试');
      t2.onclick = function () { T.speak('vocabulary'); };
      testRow.appendChild(t1); testRow.appendChild(t2);
      rc.appendChild(testRow);
      body.appendChild(rc);

      /* ---------- 语音包安装指引 ---------- */
      if (d.englishVoices === 0) {
        var gc = h('div', 'card');
        var gh = h('div', 'card-head');
        gh.appendChild(h('h3', null, '安装英语语音包'));
        var gt = h('span', 'tag grey', '推荐');
        gh.appendChild(gt);
        gc.appendChild(gh);

        var intro = h('p');
        intro.style.cssText = 'font-size:13.5px;color:var(--text-2);line-height:1.8;margin:0 0 12px';
        intro.textContent = '装上英语语音包后，发音就能完全离线使用，速度更快、也更准确。';
        gc.appendChild(intro);

        var steps = [
          ['Windows 电脑', [
            '按 Win 键打开设置，搜索「语言」',
            '进入「时间和语言」→「语言和区域」',
            '点「添加语言」，搜索并安装 English (United States)',
            '在已安装语言 English 右侧点「⋮」→「语言选项」',
            '在「语音」区域点击「下载」，安装语音包',
            '安装完成后关闭并重新打开浏览器'
          ]],
          ['安卓手机', [
            '设置 → 系统 → 语言和输入法',
            '找到「文字转语音输出」，选择 Google 文字转语音',
            '点语言列表里的英语，下载语音数据',
            '部分机型还需在「引擎」里把默认引擎设为 Google'
          ]],
          ['iPhone / iPad', [
            '设置 → 辅助功能 → 朗读内容',
            '点「声音」→「英语 (United States)」',
            '下载语音包（需要约数百 MB 空间）',
            '在「朗读内容」里选择英语语音'
          ]]
        ];

        steps.forEach(function (s) {
          var t = h('div');
          t.style.cssText = 'font-weight:600;font-size:13.5px;margin:14px 0 6px';
          t.textContent = s[0];
          gc.appendChild(t);
          var ol = h('ol');
          ol.style.cssText = 'margin:0;padding-left:20px;font-size:13px;line-height:1.9;color:var(--text-2)';
          s[1].forEach(function (line) {
            var li = h('li');
            li.textContent = line;
            ol.appendChild(li);
          });
          gc.appendChild(ol);
        });

        var refreshBtn = h('button', 'btn soft', '我装好了，重新检测');
        refreshBtn.style.marginTop = '16px';
        refreshBtn.onclick = function () {
          T.refreshVoices();
          render();
          ui.toast(T.englishVoices().length > 0
            ? '检测到 ' + T.englishVoices().length + ' 个英语语音，发音已可用'
            : '仍未检测到英语语音包', T.englishVoices().length > 0 ? 'success' : 'warn');
        };
        gc.appendChild(refreshBtn);
        body.appendChild(gc);
      }
    }
  };

  /* ============================================================
     代理发音卡片
     ------------------------------------------------------------
     三块内容：能不能连上 / 用哪个音色 / 立刻试听。
     「能不能连上」放在最前面且带明确的失败说明——
     用户分不清「服务没启动」和「我的设备有问题」，
     这里必须把两者区分开写清楚，否则会来回试错。
     ============================================================ */
  function renderProxyCard(body) {
    var base = (typeof T.getProxy === 'function' && T.getProxy()) || '';
    var card = h('div', 'card');
    var ch = h('div', 'card-head');
    ch.appendChild(h('h3', null, '在线发音（推荐）'));
    var tag = h('span', 'tag', '检测中…');
    tag.className = 'tag grey';
    ch.appendChild(tag);
    card.appendChild(ch);

    if (!base) {
      var off = h('div');
      off.style.cssText = 'font-size:13px;color:var(--text-2);line-height:1.8';
      off.textContent = '当前未启用在线发音，将只使用设备自带的语音。'
        + '如果设备没装英语语音包，就会出现「点了没声音」。';
      card.appendChild(off);
      body.appendChild(card);
      return;
    }

    var intro = h('div');
    intro.style.cssText = 'font-size:13px;color:var(--text-2);line-height:1.8;margin-bottom:12px';
    intro.textContent = '在线发音自带英音、美音、澳音，无需设备安装任何语音包，'
      + '单词和整句都能读，是最稳定的一条路径。';
    card.appendChild(intro);

    /* --- 服务地址：必须可编辑 ---
       手机上 127.0.0.1 指向手机自己，必须改成电脑的局域网地址才能连上。
       这里给的是输入框而不是只读文本：用户没有别的办法知道该填什么，
       而电脑上能跑通不代表手机上也能。 */
    var addrWrap = h('div');
    addrWrap.style.marginBottom = '12px';
    var addrLab = h('div');
    addrLab.style.cssText = 'font-size:12.5px;color:var(--text-3);margin-bottom:5px';
    addrLab.textContent = '服务地址';
    addrWrap.appendChild(addrLab);

    var addrRow = h('div');
    addrRow.style.cssText = 'display:flex;gap:6px;align-items:stretch';

    var addrIn = document.createElement('input');
    addrIn.type = 'url';
    addrIn.value = base;
    addrIn.placeholder = 'http://192.168.1.5:8788';
    addrIn.setAttribute('inputmode', 'url');
    addrIn.setAttribute('autocapitalize', 'off');
    addrIn.setAttribute('autocomplete', 'off');
    addrIn.setAttribute('spellcheck', 'false');
    // font-size 必须 ≥16px，否则 iOS 聚焦时会强制放大整个页面
    addrIn.style.cssText = 'flex:1;min-width:0;padding:9px 11px;font-size:16px;'
      + 'border:1px solid var(--border);border-radius:9px;background:var(--surface-2);color:var(--text)';
    addrRow.appendChild(addrIn);

    var addrSave = h('button', 'btn soft', '保存');
    addrSave.type = 'button';
    addrSave.style.cssText = 'flex-shrink:0;padding:0 14px;font-size:13px';
    addrRow.appendChild(addrSave);
    addrWrap.appendChild(addrRow);

    var mobileHint = h('div');
    mobileHint.style.cssText = 'font-size:12px;color:var(--text-3);margin-top:7px;line-height:1.7';
    mobileHint.innerHTML = '手机请把地址改成电脑上启动服务时显示的<「手机访问」</b>地址（形如 <code>http://192.168.x.x:8788</code>）。'
      + '手机与电脑必须连同一个 WiFi。<b>若本机地址是 127.0.0.1，手机连不上</b>——它指向手机自己。';
    addrWrap.appendChild(mobileHint);
    card.appendChild(addrWrap);

    function saveAddr() {
      var v = String(addrIn.value || '').trim().replace(/\/+$/, '');
      try {
        if (v) localStorage.setItem('lumen.ttsProxy', v);
        else localStorage.removeItem('lumen.ttsProxy');
      } catch (e) { /* 忽略 */ }
      if (T.setProxy) T.setProxy(v);
      ui.toast('地址已保存，正在检测…');
      render();
    }
    addrSave.onclick = saveAddr;
    addrIn.onkeydown = function (e) {
      if (e.key === 'Enter') { e.preventDefault(); saveAddr(); }
    };

    /* --- 状态行 --- */
    var state = h('div');
    state.style.cssText = 'display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px';
    var dot = h('span');
    dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:#c8ccd4;flex-shrink:0';
    var stateTxt = h('span', null, '正在连接…');
    stateTxt.style.cssText = 'font-size:13.5px;color:var(--text-2)';
    var reBtn = h('button', 'btn soft', '重新检测');
    reBtn.style.cssText = 'padding:5px 12px;font-size:12.5px';
    reBtn.onclick = function () { ping(); };
    state.appendChild(dot);
    state.appendChild(stateTxt);
    state.appendChild(reBtn);
    card.appendChild(state);

    /* --- 音色选择（连上后才显示） --- */
    var voiceBox = h('div');
    voiceBox.style.display = 'none';
    card.appendChild(voiceBox);

    function setState(kind, text) {
      dot.style.background = kind === 'ok' ? '#1a7f4b' : kind === 'bad' ? '#c8503c' : '#c8ccd4';
      stateTxt.textContent = text;
      stateTxt.style.color = kind === 'bad' ? '#c8503c' : 'var(--text-2)';
    }

    function ping() {
      setState('wait', '正在连接…');
      tag.className = 'tag grey';
      tag.textContent = '检测中…';
      fetch(base + '/health')
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (!j || !j.ok) throw new Error('bad');
          var dep = j.dep === false;
          setState('ok', '已连接，代理可用');
          tag.className = 'tag green';
          tag.textContent = dep ? '已连接（依赖缺失）' : '可用';
          buildVoices();
        })
        .catch(function () {
          /* 区分「服务没启动」与「地址不对/被拦」——手机上最常见的是后者 */
          var onPhone = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
          var isLocalHost = /^(https?:\/\/)?(127\.0\.0\.1|localhost|\[?::1\]?)(:|\/|$)/i
            .test(base) || !/^https?:\/\//i.test(base);
          setState('bad', isLocalHost
            ? '连不上——服务未启动'
            : '连不上——地址不可达');
          tag.className = 'tag warn';
          tag.textContent = '未连接';
          var help = h('div');
          help.style.cssText = 'font-size:12.5px;color:var(--text-2);line-height:1.9;'
            + 'background:var(--surface-2);padding:12px 14px;border-radius:10px;margin-top:12px';
          var CODE = 'font-size:12px;background:var(--surface-3);padding:2px 6px;border-radius:4px';
          if (isLocalHost) {
            help.innerHTML = '在线发音服务没在运行。它是一个独立的小服务，需要单独启动：'
              + '<br><code style="' + CODE + '">node tools/tts-server.js</code>'
              + '<br>启动后点右上角「重新检测」。'
              + '<br>如果网站部署在服务器上，把这个服务挂在域名下，'
              + '并把地址填成 <code style="' + CODE + '">/tts</code> 即可。';
          } else if (onPhone) {
            help.innerHTML = '你填的是局域网地址（<code style="' + CODE + '">'
              + esc(base) + '</code>），但连不上。按顺序排查：'
              + '<br><b>1. 确认电脑上的服务已启动</b>，且窗口里显示了「手机访问」那一行。'
              + '<br><b>2. 确认地址一致</b>：把这里改成电脑上显示的地址，不要留 <code style="'
              + CODE + '">127.0.0.1</code>——在手机上它指的是手机自己。'
              + '<br><b>3. 确认同一 WiFi</b>：手机和电脑必须连同一个路由器，'
              + '数据流量走WiFi 时不要用蜂窝网。'
              + '<br><b>4. 放行防火墙</b>：Windows 首次运行 Node 会弹窗，必须勾选'
              + '「专用网络」允许；若已错过，进「Windows 防火墙 → 允许应用通过防火墙」，'
              + '把 Node.js 勾上。'
              + '<br><b>5. 关掉 VPN / 代理软件</b>，它们会接管流量导致本地地址打不开。';
          } else {
            help.innerHTML = '地址 <code style="' + CODE + '">' + esc(base)
              + '</code> 连不上。可能是服务没启动，也可能是网络不通：'
              + '<br><b>1.</b> 先在电脑上确认服务已启动：'
              + '<br><code style="' + CODE + '">node tools/tts-server.js</code>'
              + '<br><b>2.</b> 若地址在局域网内，确认本机与目标机器在同一 WiFi，且防火墙已放行。'
              + '<br><b>3.</b> 若网站部署在服务器上，把这个服务挂在域名下，'
              + '并把地址填成 <code style="' + CODE + '">/tts</code> 即可。';
          }
          if (!voiceBox.dataset.tip) {
            voiceBox.dataset.tip = '1';
            var tipWrap = h('div');
            tipWrap.appendChild(help);
            voiceBox.appendChild(tipWrap);
            voiceBox.style.display = '';
          }
        });
    }

    function buildVoices() {
      T.proxyVoices().then(function (list) {
        if (!list || !list.length) return;
        ui.clear(voiceBox);
        var cur = '';
        try {
          var st = global.Store && global.Store.state;
          cur = (st && st.settings && st.settings.ttsVoice) || '';
        } catch (e) { /* 忽略 */ }
        var activeId = cur || 'en-US-AriaNeural';

        var lab = h('div');
        lab.style.cssText = 'font-size:12.5px;color:var(--text-3);margin-bottom:4px';
        lab.textContent = '选择音色';
        voiceBox.appendChild(lab);

        var tip = h('div');
        tip.style.cssText = 'font-size:12.5px;color:var(--text-3);margin-bottom:12px;line-height:1.7';
        tip.textContent = '不确定就选「跟读首选」里的——这类音色咬字清楚、语速偏慢，'
          + '适合一句一句对照着学。「自然童声」最接近真人，但连读多，初学阶段反而不易听清。';
        voiceBox.appendChild(tip);

        /* 按用途分组，而不是把十几项平铺成一样的格子。
           平铺的结果是用户只能靠名字猜——而音色名（Aria/Jenny/Sonia）
           对学习者没有任何信息量。 */
        var GROUPS = [
          { role: 'recommend', title: '跟读首选', hint: '咬字清晰、语速适中，最适合逐句对照学习' },
          { role: 'natural', title: '自然童声', hint: '最接近真人演讲，听感最好；连读较多' },
          { role: 'normal', title: '其他音色', hint: '' }
        ];

        GROUPS.forEach(function (g) {
          var items = list.filter(function (v) { return (v.role || 'normal') === g.role; });
          if (!items.length) return;

          var gt = h('div');
          gt.style.cssText = 'display:flex;align-items:baseline;gap:8px;margin:14px 0 8px';
          var gtn = h('span');
          gtn.style.cssText = 'font-size:13px;font-weight:600;color:var(--text)';
          gtn.textContent = g.title;
          gt.appendChild(gtn);
          if (g.hint) {
            var gth = h('span');
            gth.style.cssText = 'font-size:11.5px;color:var(--text-3)';
            gth.textContent = g.hint;
            gt.appendChild(gth);
          }
          voiceBox.appendChild(gt);

          var grid = h('div');
          grid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:8px';

          items.forEach(function (v) {
            var id = v.id || v.name;
            var on = activeId === id;
            var b = h('button');
            b.type = 'button';
            b.style.cssText = 'text-align:left;padding:10px 12px;border-radius:10px;cursor:pointer;'
              + 'border:1px solid ' + (on ? 'var(--accent,#4f7cff)' : 'var(--border)')
              + ';background:' + (on ? 'var(--accent-soft,#eef2ff)' : 'var(--surface-2)')
              + ';color:' + (on ? 'var(--accent,#4f7cff)' : 'var(--text)') + ';transition:border-color .15s,background .15s';
            if (on) b.style.fontWeight = '600';

            var top = h('div');
            top.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:13px';
            top.textContent = v.label || v.name;
            if (on) {
              var tick = h('span', null, '✓');
              tick.style.cssText = 'font-size:11px;margin-left:auto';
              top.appendChild(tick);
            }
            b.appendChild(top);

            if (v.desc) {
              var d = h('div');
              d.style.cssText = 'font-size:11.5px;color:var(--text-3);margin-top:2px;line-height:1.5';
              d.textContent = v.desc;
              b.appendChild(d);
            }

            b.onclick = function () {
              try {
                global.Store.state.settings.ttsVoice = id;
                if (global.Store.save) global.Store.save();
              } catch (e) { /* 忽略 */ }
              buildVoices();
              ui.toast('已切换到' + (v.label || v.name));
              // 立刻用新音色读一句，让用户直接听出差别
              T.speak('Could you walk me through the process one more time?');
            };
            grid.appendChild(b);
          });
          voiceBox.appendChild(grid);
        });

        /* --- 整句试听：整句是口语模块的核心，试听必须用整句 --- */
        var tr = h('div', 'btn-row');
        tr.style.marginTop = '14px';
        var s1 = h('button', 'btn', '🔊 试听整句');
        s1.onclick = function () {
          T.speak("I don't expect to have this ready by Friday, but I'll send you a draft tomorrow.");
        };
        var s2 = h('button', 'btn soft', '🔊 慢速跟读');
        s2.onclick = function () {
          T.speak('Could you walk me through the process one more time?', { rate: 0.65 });
        };
        tr.appendChild(s1); tr.appendChild(s2);
        voiceBox.appendChild(tr);

        voiceBox.style.display = '';
      });
    }

    body.appendChild(card);
    ping();
  }

  var okHinted = false;
  function onceOK() {
    if (okHinted) return;
    okHinted = true;
  }

  global.Views = V;
})(window);