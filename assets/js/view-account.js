/* ============================================================
   view-account.js —— 账号与云同步
   未登录：完整功能可用（本地模式），提供登录入口
   已登录：显示账号信息、同步状态、手动同步与数据管理
   ============================================================ */
(function (global) {
  'use strict';
  var V = global.Views, S = global.Store, P = global.Progress,
      C = global.Cloud, ui = global.ui, h = ui.h;

  var sending = false;      // 验证码请求进行中
  var countdown = 0;       // 重发倒计时秒数
  var countdownTimer = null;

  V.account = function (root) {
    var inApp = global.PWA && global.PWA.isNativeShell && global.PWA.isNativeShell();
    var head = h('div', 'page-head');
    head.appendChild(h('h1', null, inApp ? '账号与云同步（App 版）' : '账号与云同步'));
    head.appendChild(h('p', null,
      inApp
        ? 'App 版全部内容已随安装包内置，断网也能完整使用。学习记录默认存在本机；' +
          '如果你想在多台设备间同步进度，可以再登录云端。不登录也完全能用。'
        : '学习数据默认存在本机浏览器。登录后可自动备份到云端，换设备时进度不丢。' +
          '不登录也完全能用——只是数据换设备不会自动同步。'));
    root.appendChild(head);

    // App 版额外说明：离线能力与数据存放位置
    if (inApp) {
      var note = h('div', 'card');
      note.style.cssText = 'margin-bottom:16px;border-left:3px solid var(--primary)';
      var nh = h('div');
      nh.appendChild(h('h3', null, '关于离线使用'));
      nh.appendChild(h('p', null,
        '· 5449 词库、全部场景口语与分级阅读都已内置，安装后无需联网即可学习\n' +
        '· 学习进度保存在手机本地，卸载应用会一并清除，重要数据建议登录云端备份\n' +
        '· 发音使用手机自带的语音合成，若没有声音请在系统设置里安装英语语音包'));
      nh.lastChild.style.whiteSpace = 'pre-line';
      nh.lastChild.style.cssText = 'font-size:13px;line-height:1.7;color:var(--text-2);white-space:pre-line';
      note.appendChild(nh);
      root.appendChild(note);
    }

    var body = h('div');
    root.appendChild(body);

    render();

    function render() {
      ui.clear(body);
      if (C.isSignedIn()) renderSignedIn(body);
      else renderSignedOut(body);
    }
  };

  /* ============================================================
     未登录
     ============================================================ */
  function renderSignedOut(root) {
    var card = h('div', 'card');
    var ch = h('div', 'card-head');
    ch.appendChild(h('h3', null, '登录 / 注册'));
    ch.appendChild(h('span', 'tag grey', '可选'));
    card.appendChild(ch);

    var tabs = h('div', 'segment');
    tabs.style.marginBottom = '16px';
    var mode = 'register';   // register | login
    [['register', '注册新账号'], ['login', '已有账号登录']].forEach(function (t) {
      var b = h('button', t[0] === mode ? 'on' : null, t[1]);
      b.type = 'button';
      b.dataset.m = t[0];
      b.onclick = function () {
        mode = t[0];
        ui.$$('button', tabs).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        drawForm();
      };
      tabs.appendChild(b);
    });
    card.appendChild(tabs);

    var formBox = h('div');
    card.appendChild(formBox);
    root.appendChild(card);

    var info = h('div', 'card');
    info.style.marginTop = '16px';
    var ih = h('div', 'card-head');
    ih.appendChild(h('h3', null, '云端会保存什么'));
    info.appendChild(ih);
    var list = h('div');
    list.style.cssText = 'font-size:13px;line-height:2;color:var(--text-2)';
    list.innerHTML =
      '<div>✓ SM-2 词卡状态（每词的间隔、难度因子、下次复习日）</div>' +
      '<div>✓ 每日学习统计（时长、复习量、正确率、连续天数）</div>' +
      '<div>✓ 口语跟读记录、阅读答题轨迹、徽章与设置</div>' +
      '<div>✓ 自动进度记忆系统的细粒度数据（逐词掌握度、学习时间线、弱项诊断）</div>' +
      '<div style="margin-top:8px;color:var(--text-3)">' +
      '数据与账号绑定，其他登录用户无法读取。不上传任何个人隐私信息。</div>';
    info.appendChild(list);
    root.appendChild(info);

    function drawForm() {
      ui.clear(formBox);
      var email = h('input');
      email.type = 'email'; email.placeholder = '邮箱地址';
      email.className = 'inp';
      email.style.cssText = 'width:100%;padding:11px 13px;border:1px solid var(--border);border-radius:9px;font-size:14px;margin-bottom:10px';

      var code = h('input');
      code.type = 'text'; code.placeholder = '6 位验证码';
      code.className = 'inp';
      code.inputMode = 'numeric';
      code.style.cssText = 'flex:1;padding:11px 13px;border:1px solid var(--border);border-radius:9px;font-size:14px';

      var codeRow = h('div');
      codeRow.style.cssText = 'display:flex;gap:10px;margin-bottom:10px';
      codeRow.appendChild(code);

      var sendBtn = h('button', 'btn ghost', '获取验证码');
      sendBtn.type = 'button';
      sendBtn.style.whiteSpace = 'nowrap';
      codeRow.appendChild(sendBtn);
      formBox.appendChild(email);
      formBox.appendChild(codeRow);

      // 密码框：注册必填，登录模式改为直接用密码登录
      var pwd = h('input');
      pwd.type = 'password';
      pwd.className = 'inp';
      pwd.style.cssText = 'width:100%;padding:11px 13px;border:1px solid var(--border);border-radius:9px;font-size:14px;margin-bottom:14px';

      if (mode === 'register') {
        pwd.placeholder = '设置密码（至少 6 位）';
        formBox.appendChild(pwd);
      } else {
        pwd.placeholder = '密码';
        formBox.appendChild(pwd);
      }

      var msg = h('div');
      msg.style.cssText = 'font-size:12.5px;margin-bottom:10px;min-height:18px';
      formBox.appendChild(msg);

      var submit = h('button', 'btn lg', mode === 'register' ? '注册并登录' : '登录');
      submit.type = 'button';
      submit.style.width = '100%';
      formBox.appendChild(submit);

      function setMsg(text, type) {
        msg.textContent = text || '';
        msg.style.color = type === 'err' ? '#a83238' : (type === 'ok' ? '#17805a' : 'var(--text-3)');
      }

      // 获取验证码
      sendBtn.onclick = function () {
        if (sending) return;
        var v = email.value.trim();
        if (!/.+@.+\..+/.test(v)) { setMsg('请输入正确的邮箱地址', 'err'); return; }
        sending = true;
        sendBtn.disabled = true;
        sendBtn.textContent = '发送中…';
        setMsg('', null);
        C.sendCode(v)
          .then(function (r) {
            sending = false;
            startCountdown(60);
            setMsg(r.isExistingUser
              ? '验证码已发送，验证后即可登录'
              : '验证码已发送，请设置密码完成注册', 'ok');
          })
          .catch(function (e) {
            sending = false;
            sendBtn.disabled = false;
            sendBtn.textContent = '获取验证码';
            setMsg(e.message || '发送失败，请稍后重试', 'err');
          });
      };

      // 提交
      submit.onclick = function () {
        var v = email.value.trim();
        var c = code.value.trim();
        var pw = pwd.value;
        setMsg('', null);

        if (mode === 'login') {
          // 登录模式：直接用密码
          if (!v || !pw) { setMsg('请输入邮箱和密码', 'err'); return; }
          submit.disabled = true;
          submit.textContent = '登录中…';
          C.signInWithPassword(v, pw)
            .then(function () { onSignedIn('登录成功'); })
            .catch(function (e) {
              submit.disabled = false;
              submit.textContent = '登录';
              setMsg(e.message || '登录失败，请检查邮箱和密码', 'err');
            });
          return;
        }

        // 注册模式：验证码 + 密码
        // 校验顺序：先确认已为当前邮箱发码，再查码，最后才查密码——
        // 否则用户没发码就被告知「密码太短」，会困惑该改哪个
        var pre = C.checkBeforeSubmit(v);
        if (!pre.ok) { setMsg(pre.message, 'err'); return; }
        if (!c) { setMsg('请输入验证码', 'err'); return; }
        if (pre.needPassword && (!pw || pw.length < 6)) { setMsg('新账号需要设置密码（至少 6 位）', 'err'); return; }
        submit.disabled = true;
        submit.textContent = '注册中…';
        C.submitCode(v, c, pw)
          .then(function () { onSignedIn('注册成功，已开始同步'); })
          .catch(function (e) {
            submit.disabled = false;
            submit.textContent = '注册并登录';
            setMsg(e.message || '注册失败，请重试', 'err');
          });
      };

      email.oninput = function () { if (msg.style.color === '#a83238') setMsg('', null); };
    }

    drawForm();
  }

  function startCountdown(sec) {
    countdown = sec;
    clearInterval(countdownTimer);
    countdownTimer = setInterval(function () {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countdownTimer);
        countdownTimer = null;
        ui.$$('button', root).forEach(function (b) {
          if (b.textContent.match(/^\d+ 秒后重发$/)) { b.disabled = false; b.textContent = '重新获取'; }
        });
        return;
      }
      ui.$$('button', root).forEach(function (b) {
        if (b.textContent.match(/秒后重发$/) || b.textContent.match(/^\d+ 秒后重发$/)) {
          b.disabled = true;
          b.textContent = countdown + ' 秒后重发';
        }
      });
    }, 1000);
  }

  /* ============================================================
     已登录
     ============================================================ */
  function renderSignedIn(root) {
    var u = C.currentUser() || {};
    var st = C.status;

    var card = h('div', 'card');
    var ch = h('div', 'card-head');
    ch.appendChild(h('h3', null, '已登录'));
    var tag = h('span', 'tag l1', '云端已连接');
    ch.appendChild(tag);
    card.appendChild(ch);

    var info = h('div');
    info.style.cssText = 'display:flex;align-items:center;gap:14px;flex-wrap:wrap';
    var avatar = h('div', null, (u.email || u.name || '?').slice(0, 1).toUpperCase());
    avatar.style.cssText = 'width:46px;height:46px;border-radius:50%;background:var(--primary);color:#fff;' +
      'display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:700;flex-shrink:0';
    info.appendChild(avatar);
    var meta = h('div');
    meta.style.flex = '1';
    var nameEl = h('b', null, u.name || u.email || '已登录用户');
    nameEl.style.fontSize = '15px';
    meta.appendChild(nameEl);
    if (u.email) {
      var em = h('div', null, u.email);
      em.style.cssText = 'font-size:12.5px;color:var(--text-3);margin-top:2px';
      meta.appendChild(em);
    }
    info.appendChild(meta);
    card.appendChild(info);

    // 同步状态
    var syncRow = h('div');
    syncRow.style.cssText = 'margin-top:16px;padding:12px 14px;background:var(--surface-2);border-radius:10px;' +
      'display:flex;align-items:center;gap:12px;flex-wrap:wrap';
    var dot = h('i');
    var online = st.online !== false;
    dot.style.cssText = 'width:9px;height:9px;border-radius:50%;flex-shrink:0;background:' +
      (online ? '#22b07d' : '#e2585f');
    syncRow.appendChild(dot);
    var txt = h('div');
    txt.style.cssText = 'font-size:12.5px;color:var(--text-2);flex:1;min-width:180px';
    if (!online) {
      txt.textContent = '当前离线。数据仍保存在本机，联网后会自动补传。';
    } else if (st.syncing) {
      txt.textContent = '正在同步…';
    } else if (st.lastSyncAt) {
      txt.textContent = '上次同步：' + new Date(st.lastSyncAt).toLocaleTimeString('zh-CN');
    } else {
      txt.textContent = '已连接，尚未同步';
    }
    syncRow.appendChild(txt);

    var syncBtn = h('button', 'btn sm', '立即同步');
    syncBtn.onclick = function () {
      syncBtn.disabled = true;
      syncBtn.textContent = '同步中…';
      C.syncAll().then(function (r) {
        syncBtn.disabled = false;
        syncBtn.textContent = '立即同步';
        if (r.pushed) {
          ui.toast('同步完成', { type: 'success' });
          if (r.pulled) ui.toast('已从云端恢复更新的数据', { type: 'success' });
        } else {
          ui.toast('同步失败：' + (C.status.lastError || '未知原因'), { type: 'error' });
        }
        global.App.render();
      });
    };
    syncRow.appendChild(syncBtn);
    card.appendChild(syncRow);
    root.appendChild(card);

    // 云端数据概况
    var stats = h('div', 'card');
    stats.style.marginTop = '16px';
    var sh = h('div', 'card-head');
    sh.appendChild(h('h3', null, '将要同步的数据'));
    stats.appendChild(sh);
    var grid = h('div', 'grid g3');
    [
      ['SM-2 词卡', Object.keys(S.state.words).length + ' 个'],
      ['每日统计', Object.keys(S.state.daily).length + ' 天'],
      ['发音记录', P && P.data ? Object.keys(P.data.speaking).length + ' 句' : '0 句'],
      ['阅读轨迹', P && P.data ? Object.keys(P.data.reading).length + ' 篇' : '0 篇'],
      ['徽章', Object.keys(S.state.badges).length + ' 枚'],
      ['时间线', P && P.data ? P.data.timeline.length + ' 条' : '0 条']
    ].forEach(function (x) {
      var c = h('div');
      c.style.cssText = 'padding:13px;border:1px solid var(--border);border-radius:11px';
      var l = h('div', null, x[0]);
      l.style.cssText = 'font-size:11.5px;color:var(--text-3);font-weight:600';
      c.appendChild(l);
      var v = h('div', null, x[1]);
      v.style.cssText = 'font-size:17px;font-weight:700;margin-top:3px';
      c.appendChild(v);
      grid.appendChild(c);
    });
    stats.appendChild(grid);
    root.appendChild(stats);

    // 数据管理
    var dm = h('div', 'card');
    dm.style.marginTop = '16px';
    var dh = h('div', 'card-head');
    dh.appendChild(h('h3', null, '数据管理'));
    dm.appendChild(dh);

    var row1 = h('div', 'btn-row');
    var exp = h('button', 'btn sm', '导出本机数据（JSON）');
    exp.onclick = function () { S.exportFile(); };
    var imp = h('button', 'btn sm ghost', '从 JSON 导入');
    imp.onclick = function () {
      var inp = h('input');
      inp.type = 'file'; inp.accept = '.json,application/json';
      inp.onchange = function () {
        var f = inp.files[0];
        if (!f) return;
        var fr = new FileReader();
        fr.onload = function () {
          try {
            S.importData(fr.result);
            ui.toast('导入成功', { type: 'success' });
            C.scheduleSync(500);
            global.App.render();
          } catch (e) {
            ui.toast('导入失败：' + e.message, { type: 'error' });
          }
        };
        fr.readAsText(f);
      };
      inp.click();
    };
    row1.appendChild(exp); row1.appendChild(imp);
    dm.appendChild(row1);

    var row2 = h('div', 'btn-row');
    row2.style.marginTop = '10px';
    var clr = h('button', 'btn sm ghost danger', '删除云端数据');
    clr.onclick = function () {
      ui.confirm({
        title: '删除云端数据？',
        text: '将删除云端保存的学习进度与记忆数据。',
        detail: '本机数据不受影响。此操作不可撤销——下次同步会重新上传本机数据。',
        okText: '确认删除', danger: true
      }).then(function (ok) {
        if (!ok) return;
        C.clearCloud()
          .then(function (n) {
            ui.toast('已删除云端 ' + n + ' 条记录', { type: 'success' });
            global.App.render();
          })
          .catch(function (e) { ui.toast('删除失败：' + e.message, { type: 'error' }); });
      });
    };
    var out = h('button', 'btn sm ghost', '退出登录');
    out.onclick = function () {
      ui.confirm({
        title: '退出登录？',
        text: '退出后本机数据保留，但不再自动同步。',
        okText: '退出'
      }).then(function (ok) {
        if (!ok) return;
        C.signOut().then(function () {
          ui.toast('已退出登录');
          global.App.render();
        });
      });
    };
    row2.appendChild(clr); row2.appendChild(out);
    dm.appendChild(row2);

    var warn = h('div');
    warn.style.cssText = 'margin-top:12px;padding:11px 13px;background:var(--warn-soft);border-radius:9px;font-size:12.5px;color:#8a6a1a;line-height:1.75';
    warn.textContent = '数据仅保存在本机浏览器与你的云端账号。清除浏览器数据不会影响云端备份，' +
      '但如果从未登录过且清除了浏览器数据，学习进度将无法找回——建议至少登录一次并导出备份。';
    dm.appendChild(warn);
    root.appendChild(dm);
  }

  function onSignedIn(msg) {
    ui.toast(msg || '登录成功', { type: 'success' });
    C.startAutoSync();
    setTimeout(function () { global.App.render(); }, 400);
  }
})(window);