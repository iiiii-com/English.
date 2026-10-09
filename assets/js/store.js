/* ============================================================
   store.js —— 全局状态 / 本地持久化 / 间隔重复算法(SM-2)
   无任何外部依赖。数据存在 localStorage，换设备不同步。

   存储契约：
     - 所有日期均为「本地时区的 YYYY-MM-DD」，不使用 toISOString()
       （toISOString 返回 UTC，东八区凌晨 0-8 点会算成前一天，
        导致连续打卡与复习到期日整体偏移一天）
     - 读取时做结构校验与字段补全；损坏时降级为默认状态并保留原始副本
     - 写入失败（配额/隐私模式）时标记 degraded 状态，由 UI 提示用户导出
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'eng_atlas_v1';
  var BACKUP_KEY = 'eng_atlas_v1_corrupt';
  var SCHEMA_VERSION = 2;

  /* ---------- 日期工具（本地时区） ---------- */
  /** 本地时区 YYYY-MM-DD。不用 toISOString —— 那会转成 UTC 导致跨时区错日 */
  function today() {
    var d = new Date();
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  /** n 天前的本地日期字符串（n 为负表示未来） */
  function daysAgoISO(n) {
    var d = new Date();
    d.setHours(12, 0, 0, 0);          // 置正午，规避夏令时切换导致的跳日
    d.setDate(d.getDate() - (n || 0));
    return today2(d);
  }
  function today2(d) {
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  /** 校验日期字符串格式 */
  function isValidDate(s) {
    return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
  }
  /** 解析 'YYYY-MM-DD' 为本地时间 Date（避开 new Date(str) 的 UTC 解析） */
  function parseDate(s) {
    if (!isValidDate(s)) return null;
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2], 12, 0, 0, 0);
  }

  function defaultState() {
    return {
      version: SCHEMA_VERSION,
      createdAt: today(),
      lastOpenDate: today(),     // 用于检测「跨天」，在首页提示
      /* 学习者画像 */
      profile: { name: '', dailyMinutes: 20, startedLevel: 'L1' },
      /* 词汇学习状态： wordId -> {ef, ivl, reps, lapses, due, last, seen, right} */
      words: {},
      /* 每日统计： 'YYYY-MM-DD' -> {minutes, newWords, reviews, right, total, readMin, speakMin} */
      daily: {},
      /* 口语练习记录 */
      speaking: [],
      /* 阅读记录 */
      reading: {},
      /* 阅读中标记的生词 */
      marks: {},
      /* 徽章 */
      badges: {},
      /* 承诺装置 */
      commitment: { goal: 1500, start: today(), stake: 0, log: [] },
      /* 设置 */
      settings: { ttsRate: 0.9, ttsVoice: '', showPhonetic: true, dailyNew: 12, dailyReviewCap: 60 },
      /* 已解锁等级 */
      unlocked: { L1: true, L2: false, L3: false, L4: false, L5: false, L6: false },
      /* 惊喜卡（可变奖励） */
      surprise: { lastIndex: -1, seen: [] },
      /* 今日微任务完成情况 */
      microDone: {},
      /* 运行时标记（不参与业务逻辑，仅供 UI 提示） */
      _runtime: { storageDegraded: false, lastError: '' }
    };
  }

  var state = null;
  var runtime = { degraded: false, lastError: '' };

  /* ---------- 结构校验与修复 ---------- */
  /**
   * 把任意输入规整为合法 state。
   * 原则：宁可丢弃损坏字段也不要整体回退（用户会丢失全部进度）。
   */
  function normalize(s) {
    var base = defaultState();
    if (!s || typeof s !== 'object') return base;

    // 逐字段补全，类型不符则用默认值
    base.profile = Object.assign(base.profile, typeof s.profile === 'object' ? s.profile : {});
    base.profile.dailyMinutes = clampNum(base.profile.dailyMinutes, 5, 240, 20);
    base.profile.name = String(base.profile.name || '').slice(0, 24);

    base.settings = Object.assign(base.settings, typeof s.settings === 'object' ? s.settings : {});
    base.settings.ttsRate = clampNum(base.settings.ttsRate, 0.5, 1.5, 0.9);
    base.settings.dailyNew = Math.round(clampNum(base.settings.dailyNew, 1, 60, 12));
    base.settings.dailyReviewCap = Math.round(clampNum(base.settings.dailyReviewCap, 10, 300, 60));

    if (isValidDate(s.createdAt)) base.createdAt = s.createdAt;
    if (isValidDate(s.lastOpenDate)) base.lastOpenDate = s.lastOpenDate;

    // 词卡：逐条校验，丢弃结构非法的项
    base.words = {};
    if (s.words && typeof s.words === 'object') {
      Object.keys(s.words).forEach(function (id) {
        var c = s.words[id];
        // 仅丢弃结构完全非法的项（null / 非对象）；
        // 字段级损坏由 clampNum + isValidDate 逐字段修复，不整条丢弃，
        // 否则一次脏数据会连带丢失该词的学习进度。
        if (!c || typeof c !== 'object' || Array.isArray(c)) return;
        base.words[id] = {
          ef: clampNum(c.ef, 1.3, 3.2, 2.5),
          ivl: Math.round(clampNum(c.ivl, 0, 365, 0)),
          reps: Math.round(clampNum(c.reps, 0, 999, 0)),
          lapses: Math.round(clampNum(c.lapses, 0, 999, 0)),
          due: isValidDate(c.due) ? c.due : today(),
          last: isValidDate(c.last) ? c.last : '',
          seen: Math.round(clampNum(c.seen, 0, 99999, 0)),
          right: Math.round(clampNum(c.right, 0, 99999, 0))
        };
      });
    }

    // 每日统计：丢弃非法日期键，数值字段归零
    base.daily = {};
    if (s.daily && typeof s.daily === 'object') {
      Object.keys(s.daily).forEach(function (d) {
        if (!isValidDate(d)) return;
        var v = s.daily[d];
        if (!v || typeof v !== 'object') return;
        base.daily[d] = {
          minutes: Math.round(clampNum(v.minutes, 0, 1440, 0)),
          newWords: Math.round(clampNum(v.newWords, 0, 999, 0)),
          reviews: Math.round(clampNum(v.reviews, 0, 9999, 0)),
          right: Math.round(clampNum(v.right, 0, 9999, 0)),
          total: Math.round(clampNum(v.total, 0, 9999, 0)),
          readMin: Math.round(clampNum(v.readMin, 0, 1440, 0)),
          speakMin: Math.round(clampNum(v.speakMin, 0, 1440, 0))
        };
      });
    }

    // 数组类字段：长度上限，防止被构造的超大数组拖垮页面
    base.speaking = Array.isArray(s.speaking) ? s.speaking.slice(-500).filter(function (r) {
      return r && typeof r === 'object';
    }) : [];
    base.commitment = Object.assign(base.commitment, typeof s.commitment === 'object' ? s.commitment : {});
    base.commitment.goal = Math.round(clampNum(base.commitment.goal, 50, 99999, 1500));
    base.commitment.log = Array.isArray(base.commitment.log) ? base.commitment.log.slice(-100) : [];

    base.reading = (s.reading && typeof s.reading === 'object') ? s.reading : {};
    base.badges = (s.badges && typeof s.badges === 'object') ? s.badges : {};
    base.marks = (s.marks && typeof s.marks === 'object') ? s.marks : {};
    base.unlocked = Object.assign(base.unlocked, typeof s.unlocked === 'object' ? s.unlocked : {});
    base.surprise = Object.assign(base.surprise, typeof s.surprise === 'object' ? s.surprise : {});
    base.surprise.seen = Array.isArray(base.surprise.seen) ? base.surprise.seen.slice(-100) : [];
    base.microDone = (s.microDone && typeof s.microDone === 'object') ? s.microDone : {};

    base.version = SCHEMA_VERSION;
    return base;
  }

  function clampNum(v, min, max, dflt) {
    var n = typeof v === 'number' ? v : parseFloat(v);
    if (!isFinite(n)) return dflt;
    return Math.min(max, Math.max(min, n));
  }

  function load() {
    var raw = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {
      // 隐私模式 / 禁用存储：可用内存态运行，但必须提示用户
      runtime.degraded = true;
      runtime.lastError = '无法访问本地存储：' + (e && e.name === 'SecurityError' ? '浏览器隐私模式' : '存储被拒绝');
      console.warn('[store] localStorage 不可用，进入降级模式', e);
      return defaultState();
    }
    if (!raw) return defaultState();
    try {
      return normalize(JSON.parse(raw));
    } catch (e) {
      console.warn('[store] 数据解析失败，已备份并重置', e);
      // 保留损坏数据，便于用户导出排查，避免静默丢失
      try { localStorage.setItem(BACKUP_KEY, raw); } catch (_) { /* 备份失败也要继续 */ }
      runtime.lastError = '本地数据格式异常，已重置并备份原始数据';
      return defaultState();
    }
  }

  /* ---------- 写入 ----------
     去抖 + 串行化：多次 save() 不会交叉写，避免 last-write-wins 丢数据 */
  var saveTimer = null;
  var writing = false;          // 是否有写入进行中
  var pendingSave = false;      // 写入期间是否有新写入请求

  function doWrite() {
    if (writing) { pendingSave = true; return; }
    writing = true;
    var payload;
    try { payload = JSON.stringify(state); }
    catch (e) {
      writing = false;
      runtime.lastError = '数据序列化失败：' + e.message;
      console.error('[store] 序列化失败', e);
      return;
    }
    try {
      localStorage.setItem(KEY, payload);
      runtime.degraded = false;
      // 已登录时安排一次云端同步（防抖由 Cloud 内部处理）
      if (global.Cloud && global.Cloud.isSignedIn && global.Cloud.isSignedIn()) {
        global.Cloud.scheduleSync();
      }
    } catch (e) {
      // 配额溢出：裁剪历史数据后重试一次
      if (isQuotaError(e) && trimOldData()) {
        try { localStorage.setItem(KEY, JSON.stringify(state)); }
        catch (e2) { markDegraded(e2); }
      } else {
        markDegraded(e);
      }
    }
    writing = false;
    if (pendingSave) { pendingSave = false; doWrite(); }
  }

  function isQuotaError(e) {
    return e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22);
  }
  function markDegraded(e) {
    runtime.degraded = true;
    runtime.lastError = '保存失败（存储空间已满或被禁用），本次进度仅保存在内存中';
    console.error('[store] 保存失败', e);
    if (global.ui && global.ui.toast) {
      global.ui.toast('⚠️ 进度未能保存，请导出备份后清理浏览器数据', 6000);
    }
  }
  /** 裁剪最旧的历史统计，释放空间。返回是否成功裁剪 */
  function trimOldData() {
    var dailyKeys = Object.keys(state.daily).sort();
    if (dailyKeys.length > 120) {
      // 只保留最近 120 天
      dailyKeys.slice(0, dailyKeys.length - 120).forEach(function (k) { delete state.daily[k]; });
    }
    if (state.speaking.length > 120) state.speaking = state.speaking.slice(-120);
    if (state.commitment.log.length > 30) state.commitment.log = state.commitment.log.slice(-30);
    return true;
  }

  function save(immediate) {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    if (immediate) doWrite();
    else saveTimer = setTimeout(function () { saveTimer = null; doWrite(); }, 300);
  }

  /** 页面卸载前强制落盘，避免防抖窗口内丢数据 */
  function flush() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; doWrite(); }
    else if (state) doWrite();
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', flush);
    window.addEventListener('pagehide', flush);
    // 多标签页同步：另一个标签写数据后，本标签重载
    window.addEventListener('storage', function (e) {
      if (e.key === KEY) { state = load(); }
    });
  }

  /* ---------- 每日统计访问器 ---------- */
  var DAY_FIELDS = ['minutes', 'newWords', 'reviews', 'right', 'total', 'readMin', 'speakMin'];
  function dayStat(date) {
    var d = isValidDate(date) ? date : today();
    if (!state.daily[d]) {
      var init = {};
      DAY_FIELDS.forEach(function (k) { init[k] = 0; });
      state.daily[d] = init;
    }
    var s = state.daily[d];
    // 补齐可能缺失/类型错误的字段
    DAY_FIELDS.forEach(function (k) {
      if (typeof s[k] !== 'number' || !isFinite(s[k])) s[k] = 0;
    });
    return s;
  }

  /** 累加时长。mins 做上限保护，避免传入 NaN/Infinity 污染统计 */
  function addMinutes(mins, kind) {
    var m = Number(mins);
    if (!isFinite(m) || m <= 0) return;
    m = Math.min(m, 240);                       // 单次最多计 4 小时
    var s = dayStat();
    s.minutes += m;
    if (kind === 'read') s.readMin += m;
    if (kind === 'speak') s.speakMin += m;
    // 上限：单日不超过 16 小时（防刷/防溢出）
    if (s.minutes > 960) s.minutes = 960;
    save();
  }

  function recordAnswer(correct) {
    var s = dayStat();
    s.total += 1;
    if (correct) s.right += 1;
    if (s.total > 9999) { s.total = 9999; s.right = Math.min(s.right, 9999); }
    save();
  }

  /* ============================================================
     SM-2 间隔重复算法（SuperMemo 2，Piotr Woźniak 1987）
     每个词维护：EF 难度因子 / IVL 当前间隔天数 / 重复次数 / 遗忘次数
     评分 q: 0=完全忘记 1=错误 2=勉强 3=正确 4=秒答
     ============================================================ */
  var MIN_EF = 1.3;
  var EASE_START = 2.5;

  function newCard() {
    return { ef: EASE_START, ivl: 0, reps: 0, lapses: 0, due: today(), last: '', seen: 0, right: 0 };
  }

  /**
   * 计算一次复习后的新卡片状态（纯函数，不写入）
   * @param {object} card 旧卡片状态
   * @param {number} q 评分 0~4
   * @returns {object} 新状态 + 是否需要重学
   */
  function reviewSM2(card, q) {
    var c = Object.assign({}, card || newCard());
    q = Math.max(0, Math.min(4, q));

    if (q < 3) {
      // 遗忘：间隔重置为 1 天（次日再来），难度因子下调
      c.lapses += 1;
      c.reps = 0;
      c.ivl = 1;
      c.ef = Math.max(MIN_EF, c.ef - 0.20);
    } else {
      c.reps += 1;
      if (c.reps === 1) c.ivl = 1;
      else if (c.reps === 2) c.ivl = 3;
      else c.ivl = Math.round(c.ivl * c.ef);
      // 上限保护：间隔不超过 180 天
      if (c.ivl > 180) c.ivl = 180;
      // 难度因子随表现微调
      c.ef = Math.max(MIN_EF, c.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
      if (c.ef > 3.2) c.ef = 3.2;
    }
    c.seen += 1;
    if (q >= 3) c.right += 1;
    c.last = today();
    c.due = daysAgoISO(-c.ivl); // ivl 天之后
    return c;
  }

  /* ---------- 词卡查询 ---------- */
  function getCard(id) { return state.words[id] || null; }

  function applyReview(id, q) {
    var old = state.words[id] || newCard();
    var nc = reviewSM2(old, q);
    state.words[id] = nc;
    var s = dayStat();
    s.reviews += 1;
    recordAnswer(q >= 3);
    save();
    return nc;
  }

  /** 今日到期的复习卡 id 列表（按逾期天数排序，最该复习的在前） */
  function dueReviews(cap) {
    var t = today();
    var arr = [];
    Object.keys(state.words).forEach(function (id) {
      var c = state.words[id];
      if (!c) return;
      if (c.last === t) return;         // 今天已经答过一次的，不再重复
      if (!isValidDate(c.due)) return;  // 脏数据跳过
      if (c.due <= t) {
        arr.push({ id: id, due: c.due, overdue: daysBetween(c.due, t), ef: c.ef, reps: c.reps });
      }
    });
    arr.sort(function (a, b) { return b.overdue - a.overdue || a.ef - b.ef; });
    return cap ? arr.slice(0, Math.max(0, cap)) : arr;
  }

  /** 计算两个 'YYYY-MM-DD' 之间的天数差（b - a）。用本地时区解析，避开 UTC 偏移 */
  function daysBetween(a, b) {
    var da = parseDate(a), db = parseDate(b);
    if (!da || !db) return 0;
    return Math.round((db - da) / 86400000);
  }

  /** 新词选择：按等级取未学过的词。
   L5/L6 首次调用会触发懒加载，返回 Promise。 */
  function pickNewWords(level, n) {
    if (level === 'L5' || level === 'L6') {
      return wordsOfLevel(level).then(function (list) {
        var pool = list.filter(function (w) { return !state.words[w.id]; });
        return pool.slice(0, n).map(function (w) { return w.id; });
      });
    }
    var all = vocabAll();
    var pool = all.filter(function (w) {
      return w.lv === level && !state.words[w.id];
    });
    return Promise.resolve(pool.slice(0, n).map(function (w) { return w.id; }));
  }

  function initNewWord(id) {
    if (!state.words[id]) {
      var c = newCard();
      c.ivl = 0;
      c.due = today();
      state.words[id] = c;
    }
    return state.words[id];
  }

  /* ---------- 词汇量统计 ---------- */
  /* ============================================================
     词库聚合：原有 L1-L4 词库 + 高考 L5-L6 词库
     高考库 id 从 100000 起，与原库 id 段隔离，可安全合并
     ============================================================ */
/* ---------- 词库聚合 + 懒加载 ---------- */
  /* ============================================================
     词库：生活库 L1-L4（常驻 182KB）+ 高考库 L5-L6（懒加载）

     高考库原为 828KB 单文件，首屏全量加载导致 6.4s 打开时间。
     现拆为 meta(1KB) + L5(413KB) + L6(415KB)：
     首屏只加载 meta，进入该等级时才动态注入 script。

     id 分段：生活库 1-99999，高考库 100000-103992，可安全合并。
     ============================================================ */
  var gkLoaded = {};        // { L5: true, L6: true }
  var gkLoading = {};       // 并发去重：同等级的多个请求共享一个 Promise

  /** 注入脚本并等待完成 */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('加载失败：' + src)); };
      document.head.appendChild(s);
    });
  }

  /**
   * 按需加载某等级的高考词库
   * @param {string} lv 'L5' 或 'L6'
   * @returns {Promise<string[]>} 加载到的词条 id
   */
  function ensureLevel(lv) {
    if (lv !== 'L5' && lv !== 'L6') return Promise.resolve([]);
    if (gkLoaded[lv]) {
      var m0 = global['GAOKAO_' + lv];
      return Promise.resolve(m0 ? m0.words.map(function (w) { return w.id; }) : []);
    }
    if (gkLoading[lv]) return gkLoading[lv];

    var meta = global.GAOKAO_META && global.GAOKAO_META.meta;
    var path = meta && meta.lazy && meta.lazy[lv];
    if (!path || typeof document === 'undefined') {
      // 懒加载配置缺失（如 file:// 直接打开）：降级，不阻塞功能
      gkLoaded[lv] = true;
      return Promise.resolve([]);
    }

    gkLoading[lv] = loadScript(path).then(function () {
      gkLoaded[lv] = true;
      delete gkLoading[lv];
      var m = global['GAOKAO_' + lv];
      if (!m) throw new Error(lv + ' 词库已加载但全局变量缺失');
      return m.words.map(function (w) { return w.id; });
    }).catch(function (e) {
      delete gkLoading[lv];
      console.warn('[store] ' + lv + ' 词库加载失败：' + e.message);
      return [];
    });
    return gkLoading[lv];
  }

  /** 高考库已加载部分的词条 */
  function gkWords() {
    var out = [];
    if (global.GAOKAO_L5) out = out.concat(global.GAOKAO_L5.words);
    if (global.GAOKAO_L6) out = out.concat(global.GAOKAO_L6.words);
    // 兼容未拆分的老结构
    if (!out.length && global.GAOKAO_DATA && global.GAOKAO_DATA.words) {
      out = global.GAOKAO_DATA.words;
    }
    return out;
  }

  /** 已加载的词库（不含未加载等级） */
  function vocabAll() {
    var base = (global.VOCAB_DATA && global.VOCAB_DATA.words) || [];
    return base.concat(gkWords());
  }

  /** 当前等级的词条（对 L5/L6 触发懒加载） */
  function wordsOfLevel(lv) {
    if (lv === 'L5' || lv === 'L6') {
      return ensureLevel(lv).then(function () {
        var m = global['GAOKAO_' + lv];
        return m ? m.words : [];
      });
    }
    var base = (global.VOCAB_DATA && global.VOCAB_DATA.words) || [];
    return Promise.resolve(base.filter(function (w) { return w.lv === lv; }));
  }

  /** 词库总词数（含未加载等级，取自 meta） */
  function vocabTotalCount() {
    var base = (global.VOCAB_DATA && global.VOCAB_DATA.meta && global.VOCAB_DATA.meta.total) || 0;
    var g = (global.GAOKAO_META && global.GAOKAO_META.meta && global.GAOKAO_META.meta.total) || 0;
    return base + g;
  }

  function vocabMeta() {
    var m = (global.VOCAB_DATA && global.VOCAB_DATA.meta) || { total: 0, byLevel: {}, themes: {} };
    var g = (global.GAOKAO_META && global.GAOKAO_META.meta)
      || (global.GAOKAO_DATA && global.GAOKAO_DATA.meta)
      || { total: 0, byLevel: {}, themes: {} };
    var byLevel = {}, themes = {};
    Object.keys(m.byLevel || {}).forEach(function (k) { byLevel[k] = m.byLevel[k]; });
    Object.keys(g.byLevel || {}).forEach(function (k) { byLevel[k] = (byLevel[k] || 0) + g.byLevel[k]; });
    Object.keys(m.themes || {}).forEach(function (k) { themes[k] = m.themes[k]; });
    Object.keys(g.themes || {}).forEach(function (k) { themes[k] = (themes[k] || 0) + g.themes[k]; });
    return { total: (m.total || 0) + (g.total || 0), byLevel: byLevel, themes: themes };
  }


  function vocabStats() {
    var map = {};
    vocabAll().forEach(function (w) { map[w.id] = w; });
    var seenCount = { L1: 0, L2: 0, L3: 0, L4: 0, L5: 0, L6: 0 };
    var mastered = { L1: 0, L2: 0, L3: 0, L4: 0, L5: 0, L6: 0 };
    var mature = 0; // ivl>=21 视为长期记忆
    var learning = 0; // 开始学但未成熟
    // 遍历已学词卡，按 id 找回所属等级
    Object.keys(state.words).forEach(function (id) {
      var c = state.words[id];
      var w = map[id];
      if (!w) return;
      seenCount[w.lv] += 1;
      if (c.ivl >= 21) { mature += 1; mastered[w.lv] += 1; }
      else if (c.seen > 0) learning += 1;
    });
    return {
      seen: seenCount,
      seenTotal: seenCount.L1 + seenCount.L2 + seenCount.L3 + seenCount.L4 + seenCount.L5 + seenCount.L6,
      mature: mature,
      learning: learning,
      mastered: mastered,
      masteredTotal: mastered.L1 + mastered.L2 + mastered.L3 + mastered.L4 + mastered.L5 + mastered.L6,
    };
  }

  /* ---------- 连续打卡 ----------
     语义：今天未学不算「断」（今天还有机会），从昨天起算；
     若今天已学，则从今天起算。 */
  function streak() {
    var t = today();
    var todayStat = state.daily[t];
    var hasToday = !!todayStat && todayStat.total > 0;
    var n = 0;
    var cursor = hasToday ? 0 : -1;    // 0=今天，-1=昨天
    for (var guard = 0; guard < 3660; guard++) {
      var key = daysAgoISO(cursor);
      var s = state.daily[key];
      if (s && s.total > 0) { n += 1; cursor -= 1; }
      else break;
    }
    return { current: n, todayDone: hasToday };
  }

  /** 最近 N 天序列（含今天），用于热力图/折线图 */
  function series(n, field) {
    n = Math.max(1, Math.min(400, n || 30));
    var out = [];
    for (var i = n - 1; i >= 0; i--) {
      var key = daysAgoISO(i);
      var s = state.daily[key];
      out.push({ date: key, value: s ? (s[field] || 0) : 0 });
    }
    return out;
  }

  function accuracy(fieldTotal, fieldRight) {
    var t = 0, r = 0;
    Object.keys(state.daily).forEach(function (k) {
      var s = state.daily[k];
      t += s[fieldTotal] || 0;
      r += s[fieldRight] || 0;
    });
    return t ? r / t : 0;
  }

  function totalMinutes() {
    var m = 0;
    Object.keys(state.daily).forEach(function (k) { m += state.daily[k].minutes || 0; });
    return m;
  }

  /* ---------- 口语统计 ---------- */
  function speakingStats() {
    var arr = state.speaking.slice(-60);
    var scored = arr.filter(function (x) { return typeof x.score === 'number'; });
    var avg = scored.length ? scored.reduce(function (a, b) { return a + b.score; }, 0) / scored.length : 0;
    return { count: arr.length, avg: avg, recent: scored.slice(-10).map(function (x) { return x.score; }) };
  }

  function addSpeaking(rec) {
    state.speaking.push(rec);
    if (state.speaking.length > 500) state.speaking = state.speaking.slice(-500);
    var s = dayStat();
    s.speakMin += (rec.minutes || 2);
    s.minutes += (rec.minutes || 2);
    save();
  }

  /* ---------- 阅读统计 ---------- */
  function addReading(articleId, right, total, minutes) {
    var r = state.reading[articleId] || { best: 0, done: 0 };
    r.done += 1;
    r.best = Math.max(r.best, right / total);
    state.reading[articleId] = r;
    var s = dayStat();
    s.readMin += minutes || 0;
    s.minutes += minutes || 0;
    s.right += right; s.total += total;
    save();
    return r;
  }

  /* ---------- 徽章 ----------
     阈值与「掌握」定义保持一致：掌握 = 间隔 ≥21 天（mature） */
  function matureCount(s) { return vocabStatsOf(s).mature; }
  function vocabStatsOf(s) {
    var n = 0;
    Object.keys(s.words).forEach(function (k) { if (s.words[k] && s.words[k].ivl >= 21) n++; });
    return { mature: n };
  }

  var BADGE_DEFS = [
    /* 起步 */
    { id: 'first_step', name: '第一步', desc: '完成第一次单词复习', icon: '🌱', check: function (s) { return Object.keys(s.words).length >= 1; } },
    { id: 'ten_words', name: '小试牛刀', desc: '学过 10 个单词', icon: '🔤', check: function (s) { return Object.keys(s.words).length >= 10; } },
    { id: 'fifty_words', name: '积少成多', desc: '学过 50 个单词', icon: '📚', check: function (s) { return Object.keys(s.words).length >= 50; } },
    { id: 'hundred_words', name: '百词斩', desc: '学过 100 个单词', icon: '💯', check: function (s) { return Object.keys(s.words).length >= 100; } },
    { id: 'three_hundred', name: '三百词', desc: '学过 300 个单词', icon: '📖', check: function (s) { return Object.keys(s.words).length >= 300; } },
    /* 连续打卡 */
    { id: 'three_days', name: '连续三天', desc: '连续打卡 3 天', icon: '🔥', check: function () { return streak().current >= 3; } },
    { id: 'seven_days', name: '一周不断', desc: '连续打卡 7 天', icon: '🏅', check: function () { return streak().current >= 7; } },
    { id: 'thirty_days', name: '习惯成型', desc: '连续打卡 30 天', icon: '👑', check: function () { return streak().current >= 30; } },
    { id: 'hundred_days', name: '百日筑基', desc: '连续打卡 100 天', icon: '🏛️', check: function () { return streak().current >= 100; } },
    /* 口语 */
    { id: 'first_speak', name: '开口第一句', desc: '完成一次跟读', icon: '🎤', check: function (s) { return s.speaking.length >= 1; } },
    { id: 'ten_speak', name: '磨磨嘴皮', desc: '完成 10 次跟读', icon: '🗣️', check: function (s) { return s.speaking.length >= 10; } },
    { id: 'good_pron', name: '字正腔圆', desc: '单次跟读得分 ≥90', icon: '🎙️', check: function (s) { return s.speaking.some(function (x) { return (x.score || 0) >= 90; }); } },
    /* 阅读 */
    { id: 'first_read', name: '读第一篇', desc: '读完一篇短文', icon: '📕', check: function (s) { return Object.keys(s.reading).length >= 1; } },
    { id: 'ten_read', name: '十篇读关', desc: '读完 10 篇短文', icon: '📚', check: function (s) { return Object.keys(s.reading).length >= 10; } },
    { id: 'perfect_read', name: '满分阅读', desc: '某篇短文正确率 100%', icon: '💯', check: function (s) { return Object.keys(s.reading).some(function (k) { return s.reading[k].best >= 1; }); } },
    /* 记忆（真正的掌握） */
    { id: 'first_mature', name: '第一枚钉子', desc: '有 1 个词进入长期记忆', icon: '🧠', check: function (s) { return matureCount(s) >= 1; } },
    { id: 'fifty_mature', name: '根深蒂固', desc: '50 个词进入长期记忆', icon: '🌳', check: function (s) { return matureCount(s) >= 50; } },
    { id: 'two_hundred_mature', name: '厚积薄发', desc: '200 个词进入长期记忆', icon: '🏔️', check: function (s) { return matureCount(s) >= 200; } },
    /* 阶段解锁 */
    { id: 'l2_unlock', name: '基础达成', desc: '解锁 L2 基础级', icon: '🚪', check: function (s) { return !!s.unlocked.L2; } },
    { id: 'l3_unlock', name: '进阶达成', desc: '解锁 L3 进阶级', icon: '🧗', check: function (s) { return !!s.unlocked.L3; } },
    { id: 'l4_unlock', name: '精通达成', desc: '解锁 L4 精通级', icon: '🎓', check: function (s) { return !!s.unlocked.L4; } },
    { id: 'l5_unlock', name: '高中达成', desc: '解锁 L5 高中级', icon: '📕', check: function (s) { return !!s.unlocked.L5; } },
    { id: 'l6_unlock', name: '高考达成', desc: '解锁 L6 高考拓展', icon: '🏆', check: function (s) { return !!s.unlocked.L6; } },
    /* 时长 */
    { id: 'ten_hours', name: '十小时主义', desc: '累计学习 600 分钟', icon: '⏳', check: function () { return totalMinutes() >= 600; } },
    { id: 'hundred_hours', name: '百小时达成', desc: '累计学习 6000 分钟', icon: '⌛', check: function () { return totalMinutes() >= 6000; } },
    /* 特殊 */
    { id: 'perfect_day', name: '完美一天', desc: '单日正确率 100%（≥10 题）', icon: '🎯', check: function () { var d = dayStat(); return d.total >= 10 && d.right === d.total; } },
    { id: 'early_bird', name: '早起的鸟', desc: '在 6-9 点学习过', icon: '🌅', check: function (s) { return !!s.earlyBird; } },
    { id: 'night_owl', name: '深夜灯塔', desc: '在 23 点后学习过', icon: '🌙', check: function (s) { return !!s.nightOwl; } },
    { id: 'comeback', name: '浪子回头', desc: '中断后重新开始学习', icon: '🔄', check: function (s) { return !!s.comeback; } }
  ];

  function checkBadges() {
    var got = [];
    BADGE_DEFS.forEach(function (b) {
      if (!state.badges[b.id] && b.check(state)) {
        state.badges[b.id] = { at: new Date().toISOString() };
        got.push(b);
      }
    });
    if (got.length) save();
    return got;
  }

  /* ---------- 初始化 / 导出 ---------- */
  function init() {
    // 为纯中文释义的词条补上英文释义（源词库对 98% 的词只给中文，
    // 学习者查词时看不到英文含义，无法建立「英文→英文」的直接联系）
    if (global.WordEnDefs) {
      try {
        var pool = (global.VOCAB_DATA && global.VOCAB_DATA.words) || [];
        if (global.GAOKAO_L5) pool = pool.concat(global.GAOKAO_L5.words);
        if (global.GAOKAO_L6) pool = pool.concat(global.GAOKAO_L6.words);
        if (pool.length) global.WordEnDefs.apply(pool);
      } catch (e) {
        console.warn('[store] 英文释义补充失败', e);
      }
    }

    state = load();

    // 跨天处理：清空「今日微任务」并更新打开日
    var t = today();
    var prevDate = state.lastOpenDate;
    if (prevDate !== t) {
      state.microDone = {};
      state.lastOpenDate = t;
      save();
    }

    // 早起 / 深夜标记
    var hr = new Date().getHours();
    var dirty = false;
    if (hr >= 6 && hr < 9 && !state.earlyBird) { state.earlyBird = true; dirty = true; }
    if (hr >= 23 && !state.nightOwl) { state.nightOwl = true; dirty = true; }

    // 中断后回归：上次打开距今 ≥2 天且今天已开始学习
    if (isValidDate(prevDate)) {
      var gap = daysBetween(prevDate, t);
      if (gap >= 2 && state.daily[t] && state.daily[t].total > 0 && !state.comeback) {
        state.comeback = true; dirty = true;
      }
    }
    if (dirty) save();
    return state;
  }

  /** 校验导入的数据是否像本应用的备份 */
  function validateImport(json) {
    var s;
    try { s = JSON.parse(json); }
    catch (e) { throw new Error('不是有效的 JSON 文件'); }
    if (!s || typeof s !== 'object' || Array.isArray(s)) throw new Error('数据格式错误：应为对象');
    // 至少要命中几个本应用特有的字段，避免导入任意 JSON
    var known = ['words', 'daily', 'speaking', 'badges', 'commitment', 'version', 'unlocked'];
    var hit = known.filter(function (k) { return k in s; }).length;
    if (hit < 2) throw new Error('这不像是本应用的备份文件（缺少关键字段）');
    return s;
  }

  global.Store = {
    init: init,
    get state() { return state; },
    /** 运行时状态：存储是否降级、最后一次错误 */
    get runtime() { return { degraded: runtime.degraded, lastError: runtime.lastError }; },
    save: save,
    flush: flush,
    today: today,
    daysAgoISO: daysAgoISO,
    parseDate: parseDate,
    isValidDate: isValidDate,
    dayStat: dayStat,
    addMinutes: addMinutes,
    recordAnswer: recordAnswer,
    // SM-2 间隔重复
    reviewSM2: reviewSM2,
    newCard: newCard,
    applyReview: applyReview,
    getCard: getCard,
    initNewWord: initNewWord,
    dueReviews: dueReviews,
    pickNewWords: pickNewWords,
    // 词库聚合
    vocabAll: vocabAll,
    wordsOfLevel: wordsOfLevel,
    ensureLevel: ensureLevel,
    vocabTotalCount: vocabTotalCount,
    vocabMeta: vocabMeta,
    vocabStats: vocabStats,
    // 统计
    streak: streak,
    series: series,
    accuracy: accuracy,
    totalMinutes: totalMinutes,
    speakingStats: speakingStats,
    addSpeaking: addSpeaking,
    addReading: addReading,
    checkBadges: checkBadges,
    BADGE_DEFS: BADGE_DEFS,
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* 无痕模式下忽略 */ }
      state = defaultState();
      return state;
    },
    exportData: function () {
      return JSON.stringify(Object.assign({ _exportedAt: new Date().toISOString(), _app: 'eng-atlas' }, state), null, 2);
    },
    /** 触发浏览器下载备份。Safari 不支持 download 属性，降级为打开新窗口 */
    exportFile: function () {
      var data = global.Store.exportData();
      var name = 'english-learning-backup-' + today() + '.json';
      try {
        var blob = new Blob([data], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
        return true;
      } catch (e) {
        global.open('data:application/json;charset=utf-8,' + encodeURIComponent(data), '_blank');
        return false;
      }
    },
    importData: function (json) {
      var raw = validateImport(json);
      // 导入前先备份当前数据，避免误操作丢失进度
      try { localStorage.setItem(BACKUP_KEY, JSON.stringify(state)); } catch (e) { /* 忽略 */ }
      state = normalize(raw);
      state.lastOpenDate = today();
      save(true);
      return state;
    },
    daysBetween: daysBetween
  };
})(window);