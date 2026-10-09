/* ============================================================
   ui.js —— 统一 UI 组件与反馈
   职责：
     1. 通用 DOM 构造（h / frag / clear）
     2. 反馈：toast（分级）/ confirm / undo
     3. 状态占位：loading（骨架屏）/ empty（空状态）/ error（错误态）
     4. 弹层：sheet（底部抽屉 + 遮罩，含焦点管理与 Esc 关闭）
     5. 可访问性：焦点陷阱、aria 属性、Esc 键盘支持
   所有视图共用本模块，避免各视图重复实现与风格漂移。
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------------- DOM 构造 ---------------- */
  function h(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt !== undefined && txt !== null) n.textContent = txt;
    return n;
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); return node; }

  /** 转义后插入 HTML —— 所有用户可控内容必须走这里，防止 XSS */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------------- Toast ---------------- */
  var toastEl = null, toastTimer = null;
  var TOAST_ICON = { info: 'ℹ️', success: '✓', warn: '⚠️', error: '✕' };

  /**
   * @param {string} msg 文本
   * @param {number|object} ms 时长(ms)，或 {ms, type}
   */
  function toast(msg, ms, type) {
    var opt = (typeof ms === 'object' && ms !== null) ? ms : { ms: ms, type: type };
    var dur = opt.ms || 2200;
    var kind = opt.type || 'info';
    if (!toastEl) {
      toastEl = h('div', 'toast');
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastEl);
    }
    clear(toastEl);
    toastEl.className = 'toast type-' + kind;
    var icon = h('span', 'toast-ico', TOAST_ICON[kind] || '');
    toastEl.appendChild(icon);
    toastEl.appendChild(h('span', 'toast-msg', msg));
    // 强制重排以重启动画
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, dur);
  }

  /** 带撤销的操作反馈：3 秒内可反悔 */
  function toastUndo(msg, onUndo) {
    if (!toastEl) { toast(msg, { ms: 3000 }); }
    clear(toastEl);
    toastEl.className = 'toast type-undo show';
    toastEl.appendChild(h('span', 'toast-msg', msg));
    var btn = h('button', 'toast-undo', '撤销');
    btn.onclick = function () {
      clearTimeout(toastTimer);
      toastEl.classList.remove('show');
      try { onUndo && onUndo(); } catch (e) { console.error(e); }
    };
    toastEl.appendChild(btn);
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 4000);
  }

  /* ---------------- 确认弹层 ---------------- */
  /**
   * @returns {Promise<boolean>}
   */
  function confirm(opts) {
    var o = typeof opts === 'string' ? { text: opts } : (opts || {});
    return new Promise(function (resolve) {
      var mask = h('div', 'sheet-mask');
      var box = h('div', 'sheet sheet-sm');
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.appendChild(h('h3', null, o.title || '确认操作'));
      if (o.text) box.appendChild(h('p', 'sheet-text', o.text));
      if (o.detail) box.appendChild(h('p', 'sheet-detail', o.detail));
      var row = h('div', 'btn-row');
      row.style.justifyContent = 'flex-end';
      var cancel = h('button', 'btn ghost', o.cancelText || '取消');
      cancel.onclick = function () { close(false); };
      var ok = h('button', 'btn' + (o.danger ? ' danger' : ''), o.okText || '确定');
      ok.onclick = function () { close(true); };
      row.appendChild(cancel); row.appendChild(ok);
      box.appendChild(row);
      mask.appendChild(box);
      mask.addEventListener('click', function (e) { if (e.target === mask) close(false); });
      var onKey = function (e) { if (e.key === 'Escape') close(false); };
      document.addEventListener('keydown', onKey);
      function close(v) {
        document.removeEventListener('keydown', onKey);
        mask.remove();
        resolve(v);
      }
      document.body.appendChild(mask);
      setTimeout(function () { ok.focus(); }, 30);
    });
  }

  /* ---------------- 弹层 Sheet ---------------- */
  var openSheets = [];

  function sheet(title, build, opts) {
    var o = opts || {};
    var mask = h('div', 'sheet-mask');
    var box = h('div', 'sheet' + (o.size === 'sm' ? ' sheet-sm' : o.size === 'lg' ? ' sheet-lg' : ''));
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', title || '对话框');
    if (title) box.appendChild(h('h3', null, title));
    var prevFocus = document.activeElement;
    try { build(box); }
    catch (e) {
      console.error('[ui] sheet 内容构建失败', e);
      box.appendChild(errorState('内容加载失败', e.message, function () { mask.remove(); }));
    }
    mask.appendChild(box);
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    function onKey(e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') trapFocus(e, box);
    }
    document.addEventListener('keydown', onKey);
    function close() {
      document.removeEventListener('keydown', onKey);
      mask.remove();
      openSheets = openSheets.filter(function (s) { return s !== api; });
      if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e) { /* 元素可能已移除 */ }
    }
    var api = { close: close, el: box, mask: mask };
    openSheets.push(api);
    document.body.appendChild(mask);
    setTimeout(function () {
      var f = box.querySelector('input,select,textarea,button');
      if (f) f.focus();
    }, 30);
    return api;
  }

  function closeAllSheets() {
    openSheets.slice().forEach(function (s) { try { s.close(); } catch (e) { /* 忽略 */ } });
    openSheets = [];
  }

  /** 焦点陷阱：Tab 键在弹层内循环 */
  function trapFocus(e, box) {
    var f = $$('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', box)
      .filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ---------------- 状态占位 ---------------- */
  /** 骨架屏：内容加载中 */
  function loadingState(lines, opts) {
    var o = opts || {};
    var box = h('div', 'state-box state-loading');
    box.setAttribute('role', 'status');
    box.setAttribute('aria-busy', 'true');
    box.setAttribute('aria-label', o.label || '加载中');
    var n = Math.max(1, Math.min(lines || 4, 10));
    for (var i = 0; i < n; i++) {
      var row = h('div', 'skeleton');
      row.style.width = (100 - Math.random() * 40) + '%';
      row.style.animationDelay = (i * 90) + 'ms';
      box.appendChild(row);
    }
    box.appendChild(h('div', 'sr-only', o.label || '加载中…'));
    return box;
  }

  /** 空状态：给出原因 + 可选行动 */
  function emptyState(title, opts) {
    var o = typeof opts === 'string' ? { hint: opts } : (opts || {});
    var box = h('div', 'state-box state-empty');
    box.appendChild(h('div', 'state-ico', o.icon || '📭'));
    box.appendChild(h('div', 'state-title', title || '暂无数据'));
    if (o.hint) box.appendChild(h('div', 'state-hint', o.hint));
    if (o.actionText && typeof o.onAction === 'function') {
      var b = h('button', 'btn soft sm', o.actionText);
      b.onclick = o.onAction;
      var w = h('div');
      w.style.marginTop = '12px';
      w.appendChild(b);
      box.appendChild(w);
    }
    return box;
  }

  /** 错误态：给出原因 + 重试 */
  function errorState(title, detail, onRetry) {
    var box = h('div', 'state-box state-error');
    box.setAttribute('role', 'alert');
    box.appendChild(h('div', 'state-ico', '⚠️'));
    box.appendChild(h('div', 'state-title', title || '出错了'));
    if (detail) box.appendChild(h('div', 'state-hint', detail));
    if (typeof onRetry === 'function') {
      var b = h('button', 'btn sm', '重试');
      b.onclick = onRetry;
      var w = h('div');
      w.style.marginTop = '12px';
      w.appendChild(b);
      box.appendChild(w);
    }
    return box;
  }

  /** 存储降级横幅 */
  function degradedBanner(getRuntime) {
    var rt = getRuntime();
    if (!rt || !rt.degraded) return null;
    var box = h('div', 'degraded-banner');
    box.setAttribute('role', 'alert');
    box.appendChild(h('span', 'db-ico', '⚠️'));
    var txt = h('div');
    txt.style.flex = '1';
    txt.appendChild(h('b', null, '进度未能保存'));
    txt.appendChild(h('div', 'db-msg', rt.lastError || '浏览器存储不可用（可能处于隐私模式）'));
    var b = h('button', 'db-btn', '导出备份');
    b.onclick = function () { global.Store.exportFile && global.Store.exportFile(); };
    box.appendChild(txt);
    box.appendChild(b);
    return box;
  }

  global.UI = {
    h: h, $: $, $$: $$, clear: clear, esc: esc,
    toast: toast, toastUndo: toastUndo, confirm: confirm,
    sheet: sheet, closeAllSheets: closeAllSheets,
    loadingState: loadingState, emptyState: emptyState, errorState: errorState,
    degradedBanner: degradedBanner
  };
})(window);