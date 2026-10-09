/* ============================================================
   sw.js —— Service Worker（离线可用 + 安装为 App）
   ------------------------------------------------------------
   缓存策略分三类：
     1. 应用外壳（HTML/CSS/JS）：stale-while-revalidate
        离线秒开，同时后台悄悄更新。
     2. 词库分片（l5/l6，约 400KB each）：cache-first
        体积大且不变，缓存后不再打扰网络。
     3. 云服务 SDK 与其它跨域请求：network-only
        云同步必须实时，不能给用户过期数据。

   升级流程：SW 文件本身变更 → 浏览器安装新 SW → skipWaiting
   → 清理旧版本缓存 → 通知页面刷新。
   ============================================================ */
'use strict';

var VERSION = 'eng-learn-v1.0.4';
var SHELL_CACHE = 'shell-' + VERSION;
var ASSET_CACHE = 'assets-' + VERSION;
var RUNTIME_CACHE = 'runtime-' + VERSION;

var KEEP = [SHELL_CACHE, ASSET_CACHE, RUNTIME_CACHE];

/* 应用外壳：首屏必需 */
var SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/style.css',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/js/tts.js',
  './assets/js/ui.js',
  './assets/js/store.js',
  './assets/js/progress.js',
  './assets/js/app.js',
  './assets/js/charts.js',
  './assets/js/cloud.js',
  './assets/js/view-vocab.js',
  './assets/js/view-speak.js',
  './assets/js/view-read.js',
  './assets/js/view-daily-comm.js',
  './assets/js/view-phoneme.js',
  './assets/js/view-english.js',
  './assets/js/view-progress.js',
  './assets/js/view-account.js',
  './assets/js/view-path.js',
  './assets/js/view-psych.js',
  './assets/js/data/words.js',
  './assets/js/data/words-gaokao-meta.js',
  './assets/js/data/word-en-defs.js',
  './assets/js/data/content-index.js'
];

/* 大体积词库分片，按需缓存，不进首屏外壳 */
var BIG_ASSETS = [
  './assets/js/data/words-gaokao-l5.js',
  './assets/js/data/words-gaokao-l6.js'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(SHELL_CACHE).then(function (cache) {
      // 逐个添加：任何单个失败不应让整个安装失败
      return Promise.all(SHELL.map(function (url) {
        return cache.add(new Request(url, { cache: 'reload' })).catch(function () { });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (KEEP.indexOf(k) === -1) return caches.delete(k);
      }));
    }).then(function () {
      return self.clients.claim();
    }).then(function () {
      // 通知页面：有新版本，可选提示刷新
      return self.clients.matchAll({ type: 'window' }).then(function (list) {
        list.forEach(function (c) {
          c.postMessage({ type: 'SW_ACTIVATED', version: VERSION });
        });
      });
    })
  );
});

self.addEventListener('message', function (e) {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

function isBigAsset(url) {
  return /words-gaokao-l[56]\.js$/.test(url);
}

function isShellAsset(url) {
  return /\.(css|js)$/.test(url) || /index\.html$/.test(url) || url === './';
}

/** stale-while-revalidate：先给缓存，后台更新 */
function swr(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      var network = fetch(request).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          cache.put(request, res.clone());
        }
        return res;
      }).catch(function () {
        return cached;                       // 断网时用缓存兜底
      });
      return cached || network;
    });
  });
}

/** cache-first：命中即返回，永不打扰网络 */
function cacheFirst(request, cacheName) {
  return caches.open(cacheName).then(function (cache) {
    return cache.match(request).then(function (cached) {
      if (cached) return cached;
      return fetch(request).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          cache.put(request, res.clone());
        }
        return res;
      });
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;

  // 只处理 GET；POST/PUT（云同步）必须直连
  if (req.method !== 'GET') return;

  var url;
  try { url = new URL(req.url); } catch (err) { return; }

  // 跨域（云 SDK、CDN）不缓存，保证云服务实时性
  if (url.origin !== self.location.origin) return;

  // 导航请求：网络优先，失败回落到缓存的首页（保证离线可打开 App）
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(RUNTIME_CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (r) {
          return r || caches.match('./index.html') || caches.match('./');
        });
      })
    );
    return;
  }

  if (isBigAsset(url.pathname)) {
    e.respondWith(cacheFirst(req, ASSET_CACHE));
    return;
  }

  if (isShellAsset(url.pathname)) {
    e.respondWith(swr(req, SHELL_CACHE));
    return;
  }

  // 其余同源资源（图标、数据）：缓存优先
  e.respondWith(
    caches.match(req).then(function (r) {
      return r || fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === 'basic') {
          var copy = res.clone();
          caches.open(RUNTIME_CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});