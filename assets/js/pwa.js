/* ============================================================
   pwa.js —— App 形态管理
   ------------------------------------------------------------
   职责：
     1. 注册 Service Worker（离线可用）
     2. 捕获 beforeinstallprompt，提供「安装 App」按钮
     3. 已安装 / 不支持时给出正确的引导文案
     4. 新版本就绪时提示刷新

   暴露：window.PWA
   ============================================================ */
(function (global) {
  'use strict';

  var deferredPrompt = null;
  var swReg = null;

  /** 是否运行在 Android 原生外壳内（APK） */
  function isNativeShell() {
    return /EngLearnAndroid/i.test(global.navigator.userAgent)
      || (global.AndroidBridge && typeof global.AndroidBridge.getPlatform === 'function');
  }

  /** 是否以独立窗口（已安装）方式运行 */
  function isStandalone() {
    return (global.matchMedia && global.matchMedia('(display-mode: standalone)').matches)
      || global.navigator.standalone === true;
  }

  function isIOS() {
    return /iphone|ipad|ipod/i.test(global.navigator.userAgent);
  }

  function platformHint() {
    if (isIOS()) return '点击浏览器的「分享」按钮，选择「添加到主屏幕」';
    if (/android/i.test(global.navigator.userAgent)) return '点击浏览器右上角菜单，选择「安装应用」或「添加到主屏幕」';
    return '点击地址栏右侧的安装图标，或浏览器菜单里的「安装」';
  }

  /** 应用是否可安装（已有安装事件，或已是独立窗口） */
  function canInstall() {
    return !!deferredPrompt || isStandalone();
  }

  /** 触发安装；返回 Promise<结果字符串> */
  function promptInstall() {
    if (isStandalone()) return Promise.resolve('already');
    if (!deferredPrompt) {
      // 平台不支持自动弹窗，给出手动步骤
      if (global.UI && global.UI.sheet) {
        global.UI.sheet('安装为 App', function (box) {
          var p = document.createElement('p');
          p.className = 'sheet-text';
          p.textContent = '把这个学习系统装到桌面或手机主屏幕，可以离线打开，启动更快。';
          box.appendChild(p);
          var tip = document.createElement('p');
          tip.className = 'sheet-detail';
          tip.textContent = '操作步骤：' + platformHint() + '。';
          box.appendChild(tip);
          var note = document.createElement('p');
          note.className = 'sheet-detail';
          note.textContent = '提示：iOS 必须用 Safari 打开才能添加到主屏幕。';
          box.appendChild(note);
        });
      }
      return Promise.resolve('manual');
    }
    deferredPrompt.prompt();
    var choice = deferredPrompt.userChoice;
    deferredPrompt = null;
    syncInstallBtn();
    return Promise.resolve(choice && choice.result ? 'accepted' : 'dismissed');
  }

  function syncInstallBtn() {
    var btn = document.getElementById('installBtn');
    if (!btn) return;
    if (isStandalone()) { btn.hidden = true; return; }
    // 有 deferred 事件才亮按钮；否则保持隐藏，避免给出无效入口
    btn.hidden = !deferredPrompt;
  }

  /** 注册 Service Worker */
  function registerSW() {
    if (!('serviceWorker' in global.navigator)) return;
    // file:// 协议不支持 SW，静默跳过
    if (location.protocol === 'file:') return;
    // 原生外壳内资源已随包分发，不需要 SW 缓存层；
    // 反而可能缓存住旧版本资源，导致更新不及时。
    if (isNativeShell()) return;

    global.navigator.serviceWorker.register('sw.js').then(function (reg) {
      swReg = reg;
      // 有新版本等待激活时，提示刷新
      reg.addEventListener('updatefound', function () {
        var nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', function () {
          if (nw.state === 'installed' && global.navigator.serviceWorker.controller) {
            if (global.UI && global.UI.toastUndo) {
              global.UI.toastUndo('应用有新版本', function () {
                nw.postMessage({ type: 'SKIP_WAITING' });
                setTimeout(function () { location.reload(); }, 200);
              });
            }
          }
        });
      });
    }).catch(function (e) {
      console.warn('[pwa] Service Worker 注册失败（不影响在线使用）', e);
    });
  }

  function init() {
    // 原生外壳：不需要安装引导，也不注册 SW
    if (isNativeShell()) {
      var btn0 = document.getElementById('installBtn');
      if (btn0) btn0.hidden = true;
      return;
    }

    global.addEventListener('beforeinstallprompt', function (e) {
      e.preventDefault();
      deferredPrompt = e;
      syncInstallBtn();
    });

    global.addEventListener('appinstalled', function () {
      deferredPrompt = null;
      syncInstallBtn();
      if (global.UI && global.UI.toast) {
        global.UI.toast('已安装到桌面，之后可离线打开 ✓', { ms: 3000, type: 'success' });
      }
    });

    // 已安装时同步一次按钮状态
    syncInstallBtn();

    var btn = document.getElementById('installBtn');
    if (btn) btn.addEventListener('click', promptInstall);

    registerSW();

    // 每次回到前台检查更新
    global.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && swReg) {
        swReg.update().catch(function () { });
      }
    });
  }

  global.PWA = {
    init: init,
    promptInstall: promptInstall,
    canInstall: canInstall,
    isStandalone: isStandalone,
    isNativeShell: isNativeShell,
    platformHint: platformHint,
    diagnose: function () {
      return {
        nativeShell: isNativeShell(),
        standalone: isStandalone(),
        hasPrompt: !!deferredPrompt,
        swSupported: 'serviceWorker' in global.navigator,
        swControlled: !!(global.navigator.serviceWorker && global.navigator.serviceWorker.controller),
        protocol: location.protocol
      };
    }
  };
})(window);