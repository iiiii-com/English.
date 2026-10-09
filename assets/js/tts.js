/* ============================================================
   tts.js —— 语音合成引擎（独立模块）
   ------------------------------------------------------------
   问题背景：很多Windows / 安卓机系统里**没有英语语音包**。
   实测典型配置只有 3 个中文语音（Microsoft Huihui / Kangkang / Yaoyao），
   englishVoices = 0。此时用系统TTS 读英文单词，要么没声音，
   要么被中文引擎念成奇怪的发音—— 这就是「点了发音听不到」的真正原因。

   本模块采用三层策略，逐级降级，保证任何设备上都能发音：

     第1 层  本机英语语音      —— 系统装了英语语音包时使用。完全离线，最快。
     第 2 层  云端发音          —— 本机无英语语音时，把文本发给词典服务取音频。
              仅在用户明确允许「云端发音」后启用，且界面会告知数据流向。
     第 3 层  提示引导          —— 两者都不可用时，给出可操作的解决步骤。

   另有若干浏览器级缺陷需处理：
     1. Chrome 竞态：cancel() 后同帧 speak() 会被引擎丢弃（完全没声音），
        必须延后一拍再 speak。
     2. getVoices() 首次返回空数组，列表是异步就绪的。
     3. Chrome 长句约 15 秒后自动暂停，需 resume() 保活。
     4. 连续朗读若逐句 speak()，每句都会 cancel() 打断前一句 → 改为队列。
     5. iOS / 部分安卓 WebView 需要用户手势解锁音频上下文。

   对外接口：window.TTS
   ============================================================ */
(function (global) {
  'use strict';

  var synth = global.speechSynthesis || null;
  var Utterance = global.SpeechSynthesisUtterance || null;

  /* ---------------- 状态 ---------------- */
  var voices = [];
  var voicesReady = false;
  var unlocked = false;
  var speakingCount = 0;
  var lastError = '';
  var unlockBound = false;
  var keepAliveTimer = null;
  var warnShown = {};
  var queue = [];
  var queueRunning = false;
  var queueToken = 0;
  var inited = false;

  var activeAudio = null;      // 当前播放的云端音频
  var nativeToken = 0;         // 原生朗读令牌，用于作废在途回调
  var nativeRetry = 0;         // 引擎未就绪时的重试次数（最多 3 次）
  var nativeConsentAsked = false; // 是否已就云端发音征求过同意

  /* ---------------- 用户偏好（localStorage） ----------------
     cloud 模式取值：
       'auto'    有本机英语语音就用本机，否则用云端（默认）
       'local'   只用本机，不用云端
       'cloud'   优先云端（本机英语语音存在时也用云端，音色更自然）
     allowCloud 必须为 true 才允许联网取音频。 */
  var PREF_KEY = 'eng_tts_pref_v1';

  function loadPref() {
    var d = { cloud: 'auto', allowCloud: false };
    try {
      var raw = global.localStorage && global.localStorage.getItem(PREF_KEY);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && o.cloud) d.cloud = o.cloud;
        if (o && o.allowCloud === true) d.allowCloud = true;
      }
    } catch (e) { /* 隐私模式下读不到，用默认值 */ }
    return d;
  }
  var pref = loadPref();

  function savePref() {
    try {
      global.localStorage && global.localStorage.setItem(PREF_KEY, JSON.stringify(pref));
    } catch (e) { /* 忽略 */ }
  }

  /* ---------------- 提示 ---------------- */
  function toast(msg, type) {
    if (global.UI && global.UI.toast) global.UI.toast(msg, { ms: 3600, type: type || 'warn' });
  }
  function onceToast(key, msg, type) {
    if (warnShown[key]) return;
    warnShown[key] = true;
    toast(msg, type);
  }

  /* ---------------- 原生桥接（Android App）----------------
     关键：Android WebView **不实现 Web Speech API**。
     speechSynthesis 对象存在，但 getVoices() 恒返回空数组、speak() 静默失败。
     所以 App 内必须走原生 TextToSpeech，由 Java 层暴露的桥接对象提供。

     网页侧探测 window.AndroidTTS（Java 注入），有它就优先用原生发音。 */
  function nativeTTS() {
    var n = global.AndroidTTS;
    return (n && typeof n.speak === 'function') ? n : null;
  }

  function hasNative() {
    return !!nativeTTS();
  }

  /** 原生引擎是否已就绪（有可用的英语 TTS） */
  var nativeReady = false;
  function refreshNative() {
    var n = nativeTTS();
    if (!n) { nativeReady = false; return false; }
    try {
      // isReady() 是同步方法；引擎初始化是异步的，由 Java 侧回调标记
      nativeReady = (typeof n.isReady === 'function') ? !!n.isReady() : true;
    } catch (e) { nativeReady = false; }
    return nativeReady;
  }

  /* ---------------- 能力检测 ---------------- */
  function supported() {
    // 原生桥接优先：有它就不依赖 Web Speech API
    if (hasNative()) return true;
    return !!(synth && Utterance);
  }

  /**
   * 本机英语语音是否真正可用。
   *
   * 注意：不能只看 speechSynthesis 对象是否存在 —— Android WebView 里
   * 它存在但 getVoices() 恒为空，此时必须视为「不可用」，
   * 否则会走进「以为能用、实际静默失败」的死路。
   */
  function hasEnglishVoice() {
    if (hasNative()) return refreshNative();
    if (!synth || !Utterance) return false;
    refreshVoices();
    return englishVoices().length > 0;
  }


  /* ---------------- 语音列表 ---------------- */
  function refreshVoices() {
    if (!synth) return [];
    var list = [];
    try { list = synth.getVoices() || []; } catch (e) { list = []; }
    if (list.length) {
      voices = list;
      voicesReady = true;
    }
    return voices;
  }

  function initVoices() {
    if (!synth) return;
    refreshVoices();
    try {
      synth.addEventListener('voiceschanged', refreshVoices);
    } catch (e) {
      try { synth.onvoiceschanged = refreshVoices; } catch (e2) { /* 旧浏览器 */ }
    }
    var tries = 0;
    var timer = setInterval(function () {
      refreshVoices();
      if (voicesReady || ++tries >= 12) clearInterval(timer);
    }, 250);
  }

  /** 英语语音列表（判定能否用本机读英语） */
  function englishVoices() {
    refreshVoices();
    return voices.filter(function (v) { return v && /^en([-_]|$)/i.test(v.lang || ''); });
  }

  function scoreVoice(v) {
    var s = 0;
    var lang = (v.lang || '').replace('_', '-');
    if (/^en-US/i.test(lang)) s += 100;
    else if (/^en-GB/i.test(lang)) s += 90;
    else if (/^en/i.test(lang)) s += 70;
    if (v.localService) s += 25;
    if (v.default) s += 8;
    if (/(Google|Samantha|Microsoft|Ava|Natural|Elevate|Serena|Karen|Moira|Zira|David)/i.test(v.name)) s += 12;
    return s;
  }

  /** 选出最佳英语语音；没有则返回 null */
  function pickVoice(lang) {
    var en = englishVoices();
    if (!en.length) return null;
    var want = (lang || 'en-US').replace('_', '-');
    var st = global.Store && global.Store.state;
    var saved = st && st.settings && st.settings.ttsVoice;

    if (saved) {
      for (var i = 0; i < en.length; i++) if (en[i].name === saved) return en[i];
    }
    var exact = en.filter(function (v) {
      return v.lang.replace('_', '-').toLowerCase() === want.toLowerCase();
    });
    var pool = exact.length ? exact : en;
    var best = null, bestScore = -1;
    pool.forEach(function (v) {
      var sc = scoreVoice(v);
      if (sc > bestScore) { bestScore = sc; best = v; }
    });
    return best;
  }

  /* ============================================================
     代理发音（首选路径）
     ------------------------------------------------------------
     这是整套发音体系里最可靠的一条路，优先级高于本机语音。

     为什么不直接用「云端发音」那套（Youdao 词典接口）：
       1. 它只覆盖单词与常见短语，整句直接返回 500。
          实测 "thank you" 是 200，"I am writing to confirm" 是 500——
          而口语模块的核心内容恰恰是整句。
       2. 音色只有一种，没有英音/美音/快慢区分。

     代理服务（tools/tts-server.js）基于 Edge Neural TTS：
       - 整句、任意长度都能合成
       - 12 种英/美/澳音色
       - 支持变速（慢速朗读必需）
       - 磁盘 + 内存二级缓存，重复内容 5ms 返回

     前端在这里只负责「问代理要 URL 并播放」，
     合成、缓存、限流都在服务端，避免每个标签页各合成一次。
     ============================================================ */

  var PROXY_BASE = '';
  var proxyAudio = null;          // 当前播放的 proxy Audio
  var proxyInFlight = null;       // 进行中的合成请求（用于去重）
  var proxyUnavailable = false;   // 服务不可达后的熔断标记

  /** 代理服务是否已配置。未配置时不进入这条路径。 */
  function proxyConfigured() {
    if (!PROXY_BASE) return false;
    try {
      if (global.Store && global.Store.state && global.Store.state.settings
          && global.Store.state.settings.ttsProxy === false) return false;
    } catch (e) { /* 忽略 */ }
    return true;
  }

  /** 代理是否已熔断（连续失败后短暂禁用，避免每次朗读都白等超时） */
  function proxyAlive() {
    if (proxyUnavailable) {
      // 5 秒后允许再试一次——可能是服务刚好重启
      if (Date.now() - (global.__ttsProxyFailAt || 0) > 5000) {
        proxyUnavailable = false;
      } else {
        return false;
      }
    }
    return proxyConfigured();
  }

  function markProxyFail() {
    proxyUnavailable = true;
    global.__ttsProxyFailAt = Date.now();
  }

  function stopProxy() {
    if (proxyAudio) {
      try { proxyAudio.pause(); } catch (e) { /* 忽略 */ }
      try { proxyAudio.src = ''; } catch (e) { /* 忽略 */ }
      proxyAudio = null;
    }
  }

  /**
   * 走代理发音。
   * @returns {Promise<boolean>} 是否成功出声。失败时调用方应继续尝试下一条路径。
   */
  function speakProxy(text, rate, o) {
    if (!proxyAlive()) return Promise.resolve(false);

    var t = String(text || '').trim();
    if (!t) return Promise.resolve(false);
    if (t.length > 600) t = t.slice(0, 600);

    // rate 是 0.1~3 的倍数，转成 prosody 百分比
    var pct = Math.round((Number(rate) || 1) * 100 - 100);
    if (pct > 90) pct = 90;
    if (pct < -70) pct = -70;
    var voice = (o && o.voice) || defaultProxyVoice();

    var url = PROXY_BASE
      + '/tts?text=' + encodeURIComponent(t)
      + '&voice=' + encodeURIComponent(voice)
      + '&rate=' + encodeURIComponent((pct >= 0 ? '+' : '') + pct + '%');

    stopProxy();
    try { if (synth) synth.cancel(); } catch (e) { /* 忽略 */ }
    stopCloud();
    stopKeepAlive();

    return new Promise(function (resolve) {
      var a = new Audio();
      proxyAudio = a;
      a.preload = 'auto';
      a.volume = o && o.volume != null ? o.volume : 1;

      var settled = false;
      function done(ok) {
        if (settled) return;
        settled = true;
        if (proxyAudio === a) proxyAudio = null;
        resolve(ok);
      }

      a.onplaying = function () {
        if (o && o.onstart) { try { o.onstart(a); } catch (e) { /* 忽略 */ } }
        startKeepAlive();
      };
      a.onended = function () {
        stopKeepAlive();
        done(true);
        if (o && o.onend) { try { o.onend(a); } catch (e) { /* 忽略 */ } }
      };
      a.onerror = function () {
        stopKeepAlive();
        markProxyFail();
        done(false);
        if (o && o.onerror) { try { o.onerror('proxy-error'); } catch (e) { /* 忽略 */ } }
      };

      a.src = url;
      var p = a.play();
      if (p && p.catch) {
        p.catch(function () {
          // 浏览器拦截自动播放：不算服务故障，让用户再点一次即可
          stopKeepAlive();
          done(false);
          if (o && o.onerror) { try { o.onerror('play-blocked'); } catch (e) { /* 忽略 */ } }
        });
      }
      // 兜底：8 秒还没开始播就判定失败，交回调用方走下一条路径
      setTimeout(function () { if (!settled) { stopKeepAlive(); done(false); } }, 8000);
    });
  }

  function defaultProxyVoice() {
    try {
      var st = global.Store && global.Store.state;
      var v = st && st.settings && st.settings.ttsVoice;
      if (v) return v;
    } catch (e) { /* 忽略 */ }
    return 'en-US-AriaNeural';
  }

  /* ---------------- 云端发音（兜底路径） ----------------
     词典服务直接返回 mp3，省去客户端解码与 TTS 参数差异。
     局限：只覆盖单词与短语，整句会 500 —— 所以排在代理之后。 */
  var audioCache = {};        // text -> objectURL
  var AUDIO_CACHE_MAX = 120;

  /** 取云端音频地址；失败返回 null */
  function cloudAudioUrl(text) {
    var t = String(text || '').trim();
    if (!t) return null;
    // 词典接口只覆盖单词与常见短语，长句截断处理
    if (t.length > 120) t = t.slice(0, 120);
    return 'https://dict.youdao.com/dictvoice?audio='
      + encodeURIComponent(t) + '&type=1';
  }

  function stopCloud() {
    stopProxy();
    if (activeAudio) {
      try { activeAudio.pause(); } catch (e) { /* 忽略 */ }
      try {
        // 释放之前缓存的 objectURL，避免内存泄漏
        for (var k in audioCache) {
          try { URL.revokeObjectURL(audioCache[k]); } catch (e) { /* 忽略 */ }
        }
      } catch (e) { /* 忽略 */ }
      audioCache = {};
      activeAudio = null;
    }
  }

  /** 播放云端音频 */
  function speakCloud(text, opts) {
    var o = opts || {};
    var url = cloudAudioUrl(text);
    if (!url) return null;

    stopCloud();
    try {
      stopKeepAlive();
    } catch (e) { /* 忽略 */ }

    var a = new Audio();
    activeAudio = a;
    a.preload = 'auto';
    a.volume = 1;

    var settled = false;
    function finish() {
      if (settled) return;
      settled = true;
      speakingCount = Math.max(0, speakingCount - 1);
      if (activeAudio === a) activeAudio = null;
    }

    a.onplaying = function () {
      if (o.onstart) o.onstart(a);
      startKeepAlive();
    };
    a.onended = function () {
      finish();
      stopKeepAlive();
      if (o.onend) o.onend(a);
    };
    a.onerror = function () {
      finish();
      stopKeepAlive();
      lastError = 'cloud-unavailable';
      if (o.onerror) o.onerror('cloud-unavailable');
    };

    a.src = url;
    var p = a.play();
    if (p && p.catch) {
      p.catch(function () {
        finish();
        stopKeepAlive();
        // 自动播放策略拦截：需要一次用户手势
        lastError = 'cloud-blocked';
        if (o.onerror) o.onerror('cloud-blocked');
        onceToast('cloudblock', '浏览器拦截了自动播放，请再点一次发音按钮。', 'error');
      });
    }
    return a;
  }

  /* ---------------- Chrome 长句保活 ---------------- */
  function startKeepAlive() {
    stopKeepAlive();
    keepAliveTimer = setInterval(function () {
      if (!synth) return;
      try {
        if (synth.speaking && !synth.paused) synth.resume();
        if (!synth.speaking && !synth.pending && !activeAudio) stopKeepAlive();
      } catch (e) { /* 忽略 */ }
    }, 6000);
  }
  function stopKeepAlive() {
    if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
  }

  /* ---------------- 音频解锁 ---------------- */
  function bindUnlock() {
    if (unlockBound || !supported()) return;
    unlockBound = true;
    var once = function () {
      unlocked = true;
      try { if (synth) synth.resume(); } catch (e) { /* 忽略 */ }
      document.removeEventListener('pointerdown', once, true);
      document.removeEventListener('keydown', once, true);
      document.removeEventListener('touchstart', once, true);
    };
    document.addEventListener('pointerdown', once, true);
    document.addEventListener('keydown', once, true);
    document.addEventListener('touchstart', once, true);
  }

  /* ---------------- 当前该走哪一层 ---------------- */
  /**
   * @returns {'local'|'cloud'|'none'}
   */
  function resolveMode() {
    /* ---- Android App：原生引擎优先 ----
       必须排在代理之前。App 内置原生 TextToSpeech，能读整句、零延迟、
       离线可用；而代理在手机上通常没在跑，若让代理优先，
       每次点发音都要白等 8 秒超时才回落到原生——体验明显变差。*/
    if (hasNative()) {
      if (refreshNative()) return 'native';
      // 原生引擎还没就绪或不可用 → 先试代理，再退云端
      if (proxyAlive() && pref.cloud !== 'cloud') return 'proxy';
      if (pref.cloud === 'local') return 'none';
      if (pref.allowCloud) return 'cloud';
      return 'none';
    }

    /* ---- 浏览器：代理优先 ----
       这一段必须在本机语音判断之前。
       旧逻辑只看「设备有没有英语语音」，在没有语音包的机器上返回 none，
       结果是走不到代理、只会弹一个「要不要用云端」的同意框——
       这正是「点了发音没反应」的真实成因：
       不是浏览器不支持，而是决策层根本没考虑代理这条路。*/
    if (proxyAlive() && pref.cloud !== 'cloud' && pref.cloud !== 'local') return 'proxy';

    // 浏览器：必须确认真的有英语语音，不能只看 speechSynthesis 对象存在。
    // Android WebView 里它存在但 getVoices() 恒为空，会造成「以为能用、实际静默失败」。
    var hasLocal = hasEnglishVoice();
    if (pref.cloud === 'local') return hasLocal ? 'local' : 'none';
    if (pref.cloud === 'cloud' && pref.allowCloud) return 'cloud';
    // auto
    if (hasLocal) return 'local';
    if (pref.allowCloud) return 'cloud';
    return 'none';
  }

  /** 首次需要发音但无本机英语语音时，询问用户是否启用云端发音 */
  function promptCloudConsent(text, rate, handlers) {
    if (global.UI && global.UI.sheet) {
      global.UI.sheet('需要启用云端发音', function (box) {
        var p = document.createElement('p');
        p.className = 'sheet-text';
        p.textContent = '你的设备没有安装英语语音包，本机无法朗读英文。';
        box.appendChild(p);
        var d = document.createElement('p');
        d.className = 'sheet-detail';
        d.textContent = '可以改用云端发音：把要朗读的内容发给在线词典服务换取音频。'
          + '这样发音始终正常，但需要联网，且朗读的文本会发送给该服务。';
        box.appendChild(d);
        var row = document.createElement('div');
        row.className = 'btn-row';
        var no = document.createElement('button');
        no.className = 'btn ghost';
        no.textContent = '暂不';
        var yes = document.createElement('button');
        yes.className = 'btn';
        yes.textContent = '启用云端发音';
        row.appendChild(no); row.appendChild(yes);
        box.appendChild(row);
        no.onclick = function () {
          global.UI.closeAllSheets();
          showNoVoiceGuide();
        };
        yes.onclick = function () {
          global.UI.closeAllSheets();
          setPref({ allowCloud: true });
          // 注意：speak(text, opts) 只接受两个参数，
          // 早期写成 speak(text, rate, handlers) 会把回调对象丢掉，导致高亮状态卡死
          var merged = {};
          for (var k in handlers) { if (Object.prototype.hasOwnProperty.call(handlers, k)) merged[k] = handlers[k]; }
          merged.rate = rate;
          speak(text, merged);
        };
      }, { size: 'sm' });
      return;
    }
    showNoVoiceGuide();
  }

  /* ---------------- 原生引擎朗读（Android App）---------------- */
  /**
   * 接收 Java 侧回调。这是 NativeTTS.java 用 evaluateJavascript 调用的入口，
   * 必须在 window 上全局可见（不能是模块内的私有函数）。
   */
  global.__nativeTtsFire = function (fn, payload) {
    var cbs = global.__nativeTtsCbs;
    if (!cbs) return;
    try {
      if (fn === 'onstart' && cbs.onstart) cbs.onstart();
      else if (fn === 'onend' && cbs.onend) cbs.onend();
      else if (fn === 'onerror' && cbs.onerror) cbs.onerror(payload);
    } catch (e) { /* 回调里的异常不能影响引擎 */ }
  };

  /**
   * 通过 Java 桥接调用 Android 系统 TextToSpeech。
   * Java 侧通过 evaluateJavascript 回调 onstart / onend / onerror，
   * 因此这里把回调挂到 window.__nativeTtsCbs 上，由 Java 主动调用。
   */
  function speakNative(text, rate, o) {
    var n = nativeTTS();
    if (!n) return null;

    stopCloud();
    try { if (synth) synth.cancel(); } catch (e) { /* 忽略 */ }
    stopKeepAlive();

    var token = ++nativeToken;
    window.__nativeTtsToken = token;

    // 注册回调，供 Java 侧调用
    window.__nativeTtsCbs = {
      onstart: function () {
        if (token !== nativeToken) return;
        nativeRetry = 0;   // 引擎已正常工作，重置重试计数
        lastError = '';
        if (o.onstart) o.onstart({ native: true });
      },
      onend: function () {
        if (token !== nativeToken) return;
        stopKeepAlive();
        speakingCount = Math.max(0, speakingCount - 1);
        global.__nativeTtsCbs = null;
        if (o.onend) o.onend({ native: true });
      },
      onerror: function (code) {
        if (token !== nativeToken) return;
        global.__nativeTtsCbs = null;
        stopKeepAlive();
        speakingCount = Math.max(0, speakingCount - 1);
        lastError = String(code || 'native-error');
        // 引擎尚未初始化完成：稍后自动重试一次
        if (code === 'tts-not-ready' && nativeRetry < 3) {
          nativeRetry++;
          global.setTimeout(function () {
            refreshNative();
            if (nativeReady) speakNative(text, rate, o);
            else failNativeToCloud(text, rate, o);
          }, 700);
          return;
        }
        failNativeToCloud(text, rate, o);
      }
    };

    try {
      // rate: Web Speech 用 0.1~2，Android 用 0.5~2，做一次映射
      n.speak(text, Math.max(0.5, Math.min(2, rate)), token);
    } catch (e) {
      lastError = 'native-throw';
      if (o.onerror) o.onerror(lastError);
      return null;
    }
    speakingCount++;
    startKeepAlive();
    // 返回一个句柄，兼容旧调用方
    return { native: true, text: text };
  }

  /** 原生朗读失败后的统一退路：能用云端就用云端，否则给可操作提示 */
  function failNativeToCloud(text, rate, o) {
    if (o && o.onerror) o.onerror(lastError);
    if (pref.allowCloud) {
      speakCloud(text, {
        onstart: o && o.onstart, onend: o && o.onend, onerror: o && o.onerror
      });
    } else {
      // 没授权云端时，首次询问而不是静默失败
      if (!nativeConsentAsked) {
        nativeConsentAsked = true;
        promptCloudConsent(text, rate, o || {});
      } else {
        onceToast('nativefail',
          '系统语音引擎无法朗读英文，可在「发音设置」里启用云端发音。', 'warn');
      }
    }
  }

  function stopNative() {
    var n = nativeTTS();
    nativeToken++;   // 作废所有在途回调
    window.__nativeTtsCbs = null;
    try { if (n && typeof n.stop === 'function') n.stop(); } catch (e) { /* 忽略 */ }
  }

  /* ---------------- 核心朗读 ---------------- */
  /**
   * 朗读文本
   * @param {string} text
   * @param {number|object} opts 速度或配置 {rate,lang,onstart,onend,onerror}
   */
  function speak(text, opts) {
    if (text == null) return null;
    var str = String(text).trim();
    if (!str) return null;

    if (!supported()) {
      // supported() 只看浏览器的 speechSynthesis 对象。
      // 但代理发音用的是 <audio> 播放，完全不需要 speechSynthesis——
      // 所以代理可用时不能在这里早退，否则正好把最可靠的那条路堵死。
      if (!(proxyAlive() && pref.cloud !== 'cloud')) {
        onceToast('nosupport', '当前浏览器不支持语音朗读。', 'error');
        return null;
      }
    }

    var o = (typeof opts === 'number') ? { rate: opts }
          : (typeof opts === 'string') ? { lang: opts }
          : (opts || {});

    var rate = o.rate;
    if (rate == null) {
      var st = global.Store && global.Store.state;
      rate = (st && st.settings && st.settings.ttsRate) || 0.9;
    }
    rate = Math.max(0.1, Math.min(3, Number(rate) || 0.9));

    var mode = resolveMode();

    if (mode === 'none') {
      // 没有英语语音，又没允许云端 → 询问一次
      promptCloudConsent(str, rate, o);
      return null;
    }

    if (mode === 'native') {
      return speakNative(str, rate, o);
    }

    /* ---- 代理发音（最可靠，整句也能读）----
       放在本机语音之前：代理的音色与可用性由服务端保证，
       不受操作系统是否装了英语语音包影响。
       失败会静默落回本机语音，两条路径都不会静默失败。 */
    if (mode === 'proxy') {
      speakingCount++;
      // 已向用户提示过的代理故障标记，避免每次朗读都弹窗
      var toldProxyFail = false;
      speakProxy(str, rate, o).then(function (ok) {
        if (ok) return;
        speakingCount = Math.max(0, speakingCount - 1);
        var h2 = speakLocal(str, rate, o);
        /* 三条路径全断时必须出声提示。
           speakLocal 在没有英语语音的设备上会静默返回 null——
           如果这里不接住，用户只会觉得「点了完全没反应」，
           而不会知道该去开服务还是去装语音包。
           只提示一次：连续点击时反复弹窗比不出声更糟。*/
        if (!h2 && !toldProxyFail && !hasEnglishVoice()) {
          toldProxyFail = true;
          if (global.UI && global.UI.sheet) showNoVoiceGuide();
          else if (global.UI && global.UI.toast) {
            global.UI.toast('发音暂不可用：在线服务未启动，且设备没有英语语音包', 'warn');
          }
        }
      });
      // 立刻返回一个可 stop 的句柄，避免调用方 await
      return {
        stop: function () { stopProxy(); },
        engine: 'proxy'
      };
    }

    if (mode === 'cloud') {
      return speakCloud(str, {
        onstart: o.onstart,
        onend: o.onend,
        onerror: o.onerror
      });
    }

    /* ---- 本机英语语音（最后兜底） ---- */
    speakLocal(str, rate, o);
  }

  /**
   * 用操作系统自带的英语语音朗读。
   * 抽成独立函数是因为代理路径失败后要回落到这里，
   * 两条路径共用同一份实现才不会行为分叉。
   */
  function speakLocal(str, rate, o) {
    if (!Utterance || !synth) return null;
    try { synth.cancel(); } catch (e) { /* 忽略 */ }
    stopCloud();
    stopKeepAlive();

    var u = new Utterance(str);
    u.rate = rate;
    u.pitch = o.pitch == null ? 1 : o.pitch;
    u.volume = o.volume == null ? 1 : o.volume;
    u.lang = o.lang || 'en-US';

    var v = pickVoice(o.lang);
    if (v) { u.voice = v; u.lang = v.lang || u.lang; }

    speakingCount++;
    startKeepAlive();

    var settled = false;
    function finish() {
      if (settled) return;
      settled = true;
      speakingCount = Math.max(0, speakingCount - 1);
      if (synth && (!synth.speaking && !synth.pending)) stopKeepAlive();
    }

    u.onstart = function () { if (o.onstart) o.onstart(u); };
    u.onend = function () { finish(); if (o.onend) o.onend(u); };
    u.onerror = function (ev) {
      var code = (ev && ev.error) || 'unknown';
      lastError = code;
      finish();
      if (code === 'interrupted' || code === 'canceled') return;
      if (code === 'not-allowed') {
        onceToast('notallowed', '浏览器拦截了自动播放，请再点一次发音按钮。', 'error');
      } else if (code === 'network') {
        onceToast('netvoice', '在线语音不可用，请检查网络。', 'warn');
      } else if (code !== 'synthesis-failed') {
        onceToast('voiceerr', '朗读失败（' + code + '），请在系统设置中安装英语语音包。', 'error');
      }
      if (o.onerror) o.onerror(code);
    };

    // 关键：Chrome 中 cancel() 与 speak() 同帧调用会静默失败
    setTimeout(function () {
      if (!synth) return;
      try { synth.resume(); } catch (e) { /* 忽略 */ }
      try {
        synth.speak(u);
      } catch (e) {
        finish();
        onceToast('throw', '朗读失败：' + (e && e.message ? e.message : '未知错误'), 'error');
      }
    }, 60);

    return u;
  }

  function slow(text, opts) {
    var o = (typeof opts === 'object' && opts) || {};
    o.rate = o.rate || 0.55;
    return speak(text, o);
  }

  function stop() {
    queueToken++;
    queue = [];
    queueRunning = false;
    stopKeepAlive();
    stopCloud();
    stopNative();
    if (!synth) return;
    try { synth.cancel(); } catch (e) { /* 忽略 */ }
  }

  /* ---------------- 连续朗读队列 ---------------- */
  function speakSequence(items, opts) {
    // 与 speak() 同一个道理：代理不依赖 speechSynthesis，不能因为 supported() 为假就整条队列不播
    if (!supported() && !proxyAlive()) { speak(''); return; }
    var list = (items || []).map(function (it) {
      return (typeof it === 'string') ? { text: it } : (it || {});
    }).filter(function (it) { return it.text && String(it.text).trim(); });
    if (!list.length) return;

    stop();
    var myToken = ++queueToken;
    queue = list;
    var idx = 0;
    var o = opts || {};

    function next() {
      if (myToken !== queueToken) return;
      if (idx >= queue.length) {
        queueRunning = false;
        if (o.onend) o.onend();
        return;
      }
      var item = queue[idx];
      if (o.onprogress) o.onprogress(idx, item);
      var r = speak(item.text, {
        rate: item.rate, lang: item.lang || o.lang,
        onend: function () {
          var gap = item.gap == null ? 320 : item.gap;
          idx++;
          setTimeout(next, gap);
        }
      });
      if (!r) { idx++; setTimeout(next, 80); }
    }
    queueRunning = true;
    next();
  }

  function isSpeaking() {
    if (activeAudio && !activeAudio.paused) return true;
    // 代理播放走 <audio>，不走 speechSynthesis。
    // 不判断它的话，连续朗读队列会在代理路径上每一句都误判为「已结束」而中断。
    if (proxyAudio && !proxyAudio.paused && !proxyAudio.ended) return true;
    if (queueRunning) return true;
    // 原生朗读：由 Java 侧回调 onend，网页侧用 speakingCount 近似跟踪
    if (nativeToken > 0 && speakingCount > 0 && !activeAudio) {
      if (!synth || (!synth.speaking && !synth.pending)) return speakingCount > 0;
    }
    if (!synth) return false;
    return !!(synth.speaking || synth.pending);
  }

  /* ---------------- 无语音时的引导 ---------------- */
  function showNoVoiceGuide() {
    if (global.UI && global.UI.sheet) {
      global.UI.sheet('如何解决发音问题', function (box) {
        var wrap = document.createElement('div');
        wrap.style.cssText = 'font-size:13.5px;line-height:1.85;color:var(--text-2)';

        function sec(title, body) {
          var t = document.createElement('div');
          t.style.cssText = 'font-weight:600;color:var(--text);margin:14px 0 4px';
          t.textContent = title;
          var d = document.createElement('div');
          d.textContent = body;
          wrap.appendChild(t); wrap.appendChild(d);
        }

        /* 顺序按「解决成本」排，不按技术分类排。
           在线发音只需启动一个小服务、不用装任何东西、且整句都能读，
           所以它排在最前面；装语音包要进系统设置、耗时几分钟，排在后面。 */
        sec('① 开启在线发音（推荐）',
          '项目里自带一个发音服务，启动它就能读任何单词和整句，'
          + '不需要在系统里装任何东西。在项目目录执行：'
          + 'node tools/tts-server.js'
          + '（Windows 可双击 tools 目录下的「启动发音服务.bat」）'
          + '启动后到「发音设置」页点「重新检测」即可。');

        sec('② 启用云端发音', '需要联网，朗读的文本会发送给在线词典服务。'
          + '好处是不用启动任何服务，代价是整句支持不好。'
          + '在下方「发音设置」里可以随时开关。');

        sec('③ 安装英语语音包（完全离线）', '装好后无需联网、无需服务，语速最快。');

        sec('Windows 电脑', '设置 → 时间和语言 → 语言和区域 → 添加英语(United States)，'
          + '然后点该语言右侧的「⋮」→ 语言选项 → 勾选「语音」→ 下载语音包。'
          + '完成后重启浏览器即可。');

        sec('安卓手机', '设置 → 系统 → 语言和输入法 → 文字转语音输出 → 选择 Google 文字转语音'
          + '→ 语言 → 安装英语语音包。');

        sec('iPhone', '设置 → 辅助功能 → 朗读内容 → 声音 → 英语 (United States) → 下载。'
          + '部分系统版本需在 设置 → 辅助功能 → 朗读内容 中启用。');

        sec('纯离线需求', '在本页下方「发音设置」里只勾选本机语音；'
          + '但这需要系统已安装英语语音包，否则无法发音。');

        box.appendChild(wrap);
      }, { size: 'lg' });
    } else {
      toast('系统缺少英语语音包，请到系统设置中添加，或在发音设置中启用云端发音。', 'error');
    }
  }

  /* ---------------- 偏好设置 ---------------- */
  function setPref(patch) {
    if (patch.cloud) pref.cloud = patch.cloud;
    if (typeof patch.allowCloud === 'boolean') pref.allowCloud = patch.allowCloud;
    savePref();
    return pref;
  }
  function getPref() { return { cloud: pref.cloud, allowCloud: pref.allowCloud }; }

  /* ---------------- 诊断 ---------------- */
  function diagnose() {
    refreshVoices();
    refreshNative();
    var en = englishVoices();
    var v = pickVoice();
    var mode = resolveMode();
    var native = hasNative();
    var env;
    if (mode === 'native') env = 'native-ok';
    else if (mode === 'proxy') env = 'proxy';
    else if (!supported()) env = 'unsupported';
    else if (mode === 'local') env = 'ok';
    else if (mode === 'cloud') env = 'cloud';
    else env = 'no-en-voice';

    return {
      env: env,
      mode: mode,
      // hasNative：是否运行在 Android 原生外壳内（决定走哪条发音链路）
      hasNative: native,
      nativeReady: nativeReady,
      isApp: native,
      supported: supported(),
      unlocked: unlocked,
      totalVoices: voices.length,
      englishVoices: en.length,
      picked: v ? v.name + ' (' + v.lang + ')' : '无',
      allVoiceNames: voices.map(function (x) { return x.name + ' [' + x.lang + ']'; }),
      cloudAllowed: pref.allowCloud,
      cloudPref: pref.cloud,
      proxyOn: proxyAlive(),
      proxyBase: PROXY_BASE,
      speaking: isSpeaking(),
      lastError: lastError,
      queueRunning: queueRunning
    };
  }

  /* ---------------- 对外 ---------------- */
  global.TTS = {
    init: function () {
      if (inited) return;
      inited = true;
      initVoices();
      bindUnlock();
      // Android App：主动触发原生引擎初始化，
      // 否则第一次发音时引擎还没就绪，会误判为不可用。
      if (hasNative()) {
        try {
          var n = nativeTTS();
          if (n && typeof n.prepare === 'function') n.prepare();
        } catch (e) { /* 忽略 */ }
      }
      // 语音列表可能晚于页面加载才就绪，就绪后重新评估
      // 注意：浏览器返回的 setInterval 是数字 ID，不能挂自定义属性，用局部计数
      if (hasNative()) { clearInterval(iv); return; }
      var tries = 0;
      var iv = setInterval(function () {
        if (hasNative()) { clearInterval(iv); return; }
        refreshVoices();
        if (englishVoices().length || ++tries >= 20) clearInterval(iv);
      }, 300);
    },
    speak: speak,
    slow: slow,
    stop: stop,
    speakSequence: speakSequence,
    isSpeaking: isSpeaking,
    supported: supported,
    diagnose: diagnose,
    pickVoice: pickVoice,
    englishVoices: englishVoices,
    refreshVoices: refreshVoices,
    getPref: getPref,
    setPref: setPref,
    showNoVoiceGuide: showNoVoiceGuide,
    // 原生桥接相关
    hasNative: hasNative,
    nativeReady: function () { refreshNative(); return nativeReady; },
    hasEnglishVoice: hasEnglishVoice,
    // ---- 代理发音 ----
    setProxy: function (base) {
      PROXY_BASE = String(base || '').replace(/\/+$/, '');
      proxyUnavailable = false;
    },
    getProxy: function () { return PROXY_BASE; },
    proxyAlive: proxyAlive,
    proxyVoices: function () {
      if (!PROXY_BASE) return Promise.resolve([]);
      return fetch(PROXY_BASE + '/voices')
        .then(function (r) { return r.json(); })
        .then(function (j) { return (j && j.voices) || []; })
        .catch(function () { return []; });
    },
    /** 预热：提前合成，让浏览器侧缓存住音频，避免首次点击有合成延迟 */
    warmup: function (texts) {
      if (!proxyAlive()) return;
      (texts || []).slice(0, 8).forEach(function (t) {
        var img = new Image();
        img.src = PROXY_BASE + '/tts?text=' + encodeURIComponent(t)
          + '&voice=' + encodeURIComponent(defaultProxyVoice()) + '&rate=-10%';
      });
    }
  };
})(window);