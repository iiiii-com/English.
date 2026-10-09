/* ============================================================
   tts.js —— 语音合成引擎（独立模块）
   ------------------------------------------------------------
   为什么单独抽出：旧实现在 app.js 里，且存在多个浏览器级缺陷，
   导致「点了发音按钮听不到声音」。本模块集中处理这些问题：

   1. Chrome 竞态：speechSynthesis.cancel() 之后立刻 speak() 会被
      引擎丢弃（表现为完全没声音）。必须延后一拍再 speak。
   2. getVoices() 首次调用返回空数组，语音列表是异步就绪的。
      旧代码把 onvoiceschanged 挂成空函数，永远拿不到列表。
   3. Chrome 长时间朗读会在约 15 秒后自动暂停，需要 resume() 保活。
   4. 连续朗读时每句都调用 cancel()，导致只有最后一句发声。
      本模块改为真正的队列。
   5. 部分浏览器（iOS / 部分安卓 WebView）需要一次用户手势来
      解锁音频上下文，否则后续 speak 静默失败。
   6. 无可用语音 / 被策略拦截时，必须给出可操作的提示，
      而不是「点了没反应」。

   对外接口：window.TTS
   ============================================================ */
(function (global) {
  'use strict';

  var synth = global.speechSynthesis || null;
  var Utterance = global.SpeechSynthesisUtterance || null;

  /* ---------------- 状态 ---------------- */
  var voices = [];              // 语音列表缓存
  var voicesReady = false;      // 列表是否已就绪（收到过非空列表）
  var unlocked = false;         // 是否已完成音频解锁
  var speakingCount = 0;        // 当前进行中的朗读数（诊断用）
  var lastError = '';           // 最近一次错误码（诊断用）
  var unlockBound = false;      // 手势监听是否已绑定
  var keepAliveTimer = null;    // Chrome 15 秒保活定时器
  var warnShown = {};           // 同类提示只弹一次，避免刷屏
  var queue = [];               // 连续朗读队列
  var queueRunning = false;
  var queueToken = 0;           // 打断令牌，用于放弃旧队列

  function toast(msg, type) {
    if (global.UI && global.UI.toast) global.UI.toast(msg, { ms: 3200, type: type || 'warn' });
  }
  function onceToast(key, msg, type) {
    if (warnShown[key]) return;
    warnShown[key] = true;
    toast(msg, type);
  }

  /* ---------------- 能力检测 ---------------- */
  function supported() {
    return !!(synth && Utterance);
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
    // 语音列表异步就绪：监听变化事件，并做几轮兜底轮询
    try {
      synth.addEventListener('voiceschanged', refreshVoices);
    } catch (e) {
      try { synth.onvoiceschanged = refreshVoices; } catch (e2) { /* 老浏览器 */ }
    }
    // 某些浏览器不触发事件，只轮询几次
    var tries = 0;
    var timer = setInterval(function () {
      refreshVoices();
      if (voicesReady || ++tries >= 12) clearInterval(timer);
    }, 250);
  }

  /** 语音评分：优先英语本地语音，其次任意英语 */
  function scoreVoice(v) {
    var s = 0;
    var lang = (v.lang || '').replace('_', '-');
    if (/^en-US/i.test(lang)) s += 100;
    else if (/^en-GB/i.test(lang)) s += 90;
    else if (/^en/i.test(lang)) s += 70;
    if (v.localService) s += 25;                       // 本地语音更快更稳
    if (v.default) s += 8;
    if (/(Google|Samantha|Microsoft|Ava|Natural|Elevate|Serena|Karen|Moira)/i.test(v.name)) s += 12;
    return s;
  }

  /** 选出最佳英语语音 */
  function pickVoice(lang) {
    refreshVoices();
    var want = (lang || 'en-US').replace('_', '-');
    var i, v;

    // 1) 用户指定过语音
    var st = global.Store && global.Store.state;
    var saved = st && st.settings && st.settings.ttsVoice;
    if (saved) {
      for (i = 0; i < voices.length; i++) if (voices[i].name === saved) return voices[i];
    }

    // 2) 语言完全匹配的英语语音里取最高分
    var best = null, bestScore = -1;
    for (i = 0; i < voices.length; i++) {
      v = voices[i];
      if (!v || !v.lang) continue;
      var vl = v.lang.replace('_', '-');
      if (vl.toLowerCase() === want.toLowerCase()) {
        var sc = scoreVoice(v);
        if (sc > bestScore) { bestScore = sc; best = v; }
      }
    }
    if (best) return best;

    // 3) 任意英语语音
    best = null; bestScore = -1;
    for (i = 0; i < voices.length; i++) {
      v = voices[i];
      if (v && /^en/i.test(v.lang || '')) {
        var s2 = scoreVoice(v);
        if (s2 > bestScore) { bestScore = s2; best = v; }
      }
    }
    return best;
  }

  function englishVoices() {
    refreshVoices();
    return voices.filter(function (v) { return v && /^en/i.test(v.lang || ''); });
  }

  /* ---------------- Chrome 长句保活 ----------------
     Chrome 在持续朗读约 15 秒后会自行暂停，定时 resume() 可续上。 */
  function startKeepAlive(u) {
    stopKeepAlive();
    keepAliveTimer = setInterval(function () {
      if (!synth) return;
      try {
        if (synth.speaking && !synth.paused) synth.resume();
        // 目标已经结束就不再保活
        if (!synth.speaking && !synth.pending) stopKeepAlive();
      } catch (e) { /* 忽略 */ }
    }, 6000);
    if (u) u.__ka = true;
  }
  function stopKeepAlive() {
    if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
  }

  /* ---------------- 音频解锁 ----------------
     iOS / 部分安卓浏览器要求先在用户手势中触发一次音频。
     注意：解锁状态只是「优化提示」，不能作为可用性判据——
     多数桌面浏览器本来就不需要解锁也能发声。 */
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

  /* ---------------- 核心朗读 ---------------- */
  /**
   * 朗读一段文本
   * @param {string} text
   * @param {object|string|number} [opts] 速度数值，或 {rate,lang,onstart,onend,onerror,gap}
   * @returns {SpeechSynthesisUtterance|null}
   */
  function speak(text, opts) {
    if (text == null) return null;
    var str = String(text).trim();
    if (!str) return null;

    if (!supported()) {
      onceToast('nosupport',
        '当前浏览器不支持语音朗读，请改用 Chrome / Edge / Safari，或把本页「添加到主屏幕」后再试。', 'error');
      return null;
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

    var lang = o.lang || 'en-US';

    // 打断当前朗读（注意：cancel 后必须延后一拍再 speak）
    try { synth.cancel(); } catch (e) { /* 忽略 */ }
    stopKeepAlive();

    var u = new Utterance(str);
    u.rate = rate;
    u.pitch = o.pitch == null ? 1 : o.pitch;
    u.volume = o.volume == null ? 1 : o.volume;
    u.lang = lang;

    var v = pickVoice(lang);
    if (v) { u.voice = v; u.lang = v.lang || lang; }

    speakingCount++;
    startKeepAlive();

    var settled = false;
    function finish() {
      if (settled) return;
      settled = true;
      speakingCount = Math.max(0, speakingCount - 1);
      if (!synth || (!synth.speaking && !synth.pending)) stopKeepAlive();
    }

    u.onstart = function () { if (o.onstart) o.onstart(u); };
    u.onend = function () {
      finish();
      if (o.onend) o.onend(u);
    };
    u.onerror = function (ev) {
      var code = (ev && ev.error) || 'unknown';
      lastError = code;
      finish();
      // interrupted / canceled 是我们主动打断的，不算错误
      if (code === 'interrupted' || code === 'canceled') return;
      if (code === 'not-allowed') {
        onceToast('notallowed', '浏览器拦截了自动播放，请再点一次发音按钮，或在地址栏右侧允许「声音」。', 'error');
      } else if (code === 'voice-unavailable' || code === 'synthesis-unavailable' || code === 'voice-not-found') {
        onceToast('novoice', '系统缺少英语语音包。请在系统设置里安装英语语音（Windows：设置 → 时间和语言 → 语音；手机：系统 → 语言 → 文字转语音）。', 'error');
      } else if (code === 'network') {
        onceToast('netvoice', '在线语音不可用（可能需要联网），已尝试切换本地语音。', 'warn');
      } else if (code === 'language-unavailable' || code === 'text-too-long') {
        onceToast('lang', '朗读失败：当前设备缺少对应的英语语音包。', 'error');
      } else if (o.onerror) o.onerror(code);
    };

    // 关键：Chrome 中 cancel() 与 speak() 同帧调用会导致静默失败，
    // 必须让出一个任务队列再发音。
    setTimeout(function () {
      if (!synth) return;
      try {
        synth.resume();
      } catch (e) { /* 忽略 */ }
      try {
        synth.speak(u);
      } catch (e) {
        lastError = 'throw';
        finish();
        onceToast('throw', '朗读失败：' + (e && e.message ? e.message : '未知错误'), 'error');
      }
    }, 60);

    // 若引擎完全没有响应（例如被系统禁用），给出明确提示
    setTimeout(function () {
      if (settled) return;
      if (synth && (synth.speaking || synth.pending)) return;
      finish();
      onceToast('silent', '朗读没有响应。可能是浏览器暂停了标签页、系统缺少英语语音包，或页面被静音。试着再次点击，或用 Chrome / Edge 打开。', 'error');
    }, 1600);

    return u;
  }

  /** 慢速朗读 */
  function slow(text, opts) {
    var o = (typeof opts === 'object' && opts) || {};
    o.rate = o.rate || 0.55;
    return speak(text, o);
  }

  /** 停止一切朗读并清空队列 */
  function stop() {
    queueToken++;
    queue = [];
    queueRunning = false;
    stopKeepAlive();
    if (!synth) return;
    try { synth.cancel(); } catch (e) { /* 忽略 */ }
  }

  /* ---------------- 连续朗读队列 ---------------- */
  /**
   * 顺序朗读多段文本
   * @param {Array<string|{text:string,rate?:number,lang?:string,gap?:number}>} items
   * @param {object} [opts] {onprogress,onend,lang}
   */
  function speakSequence(items, opts) {
    if (!supported()) { speak(''); return; }
    var list = (items || []).map(function (it) {
      return (typeof it === 'string') ? { text: it } : (it || {});
    }).filter(function (it) { return it.text && String(it.text).trim(); });
    if (!list.length) return;

    stop();                         // 抢占：终止上一次连续朗读
    var myToken = ++queueToken;
    queue = list;
    var idx = 0;
    var o = opts || {};

    function next() {
      if (myToken !== queueToken) return;      // 已被新的朗读抢占
      if (idx >= queue.length) {
        queueRunning = false;
        if (o.onend) o.onend();
        return;
      }
      var item = queue[idx];
      if (o.onprogress) o.onprogress(idx, item);
      var u = speak(item.text, {
        rate: item.rate, lang: item.lang || o.lang,
        onend: function () {
          var gap = item.gap == null ? 320 : item.gap;
          idx++;
          setTimeout(next, gap);
        }
      });
      // speak 被取消（例如不支持）时不会触发 onend，这里兜底推进
      if (!u) { idx++; setTimeout(next, 60); }
    }
    queueRunning = true;
    next();
  }

  function isSpeaking() {
    if (!synth) return false;
    return !!(synth.speaking || synth.pending);
  }

  /* ---------------- 诊断 ---------------- */
  /**
   * env 取值：
   *   unsupported        浏览器完全没有 speechSynthesis
   *   no-voice-list      语音列表为空（系统可能未装任何语音包）
   *   lang-fallback      没有英语语音包，但会退回浏览器默认语音朗读
   *   no-en-voice        同上，且默认语音可能语种不符
   *   ok                 已选中英语语音
   */
  function diagnose() {
    refreshVoices();
    var en = englishVoices();
    var picked = pickVoice();
    var env;
    if (!supported()) env = 'unsupported';
    else if (voices.length === 0) env = 'no-voice-list';
    else if (en.length === 0) env = 'lang-fallback';
    else if (!picked) env = 'no-en-voice';
    else env = 'ok';
    return {
      env: env,
      supported: supported(),
      unlocked: unlocked,
      voicesReady: voicesReady,
      totalVoices: voices.length,
      englishVoices: en.length,
      picked: picked ? picked.name + ' (' + picked.lang + ')' : '无（退回浏览器默认语音）',
      speaking: isSpeaking(),
      lastError: lastError,
      queueRunning: queueRunning,
      /* 只要引擎能接受朗读就算可用，不强求系统装有英语语音包 */
      usable: supported()
    };
  }

  /* ---------------- 对外 ---------------- */
  global.TTS = {
    init: function () {
      initVoices();
      bindUnlock();
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
    refreshVoices: refreshVoices
  };
})(window);