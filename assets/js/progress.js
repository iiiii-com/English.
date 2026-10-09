/* ============================================================
   progress.js —— 自动进度记忆系统
   目标：学习者不主动记录，系统自动记住「学过什么、掌握到什么程度、
   在什么时间学得最多、哪里薄弱」，并据此安排复习。

   记录粒度（比 store.js 的每日统计更细）：
     1. 词汇掌握度   每词一条时间线（每次作答的间隔/评分/用时）
     2. 句子发音     每句跟读记录（得分/尝试次数/日期）
     3. 阅读轨迹     每篇答题明细（逐题对错/用时）
     4. 表达掌握     日常交流每条表达的暴露次数与自评
     5. 连读例句     跟读记录
     6. 学习时间线   每次学习的时段/时长/模块，形成个人作息画像
     7. 弱项诊断     自动统计错误集中的音素/题型/时段

   设计原则：
     - 零手动操作：所有记录在用户行为发生时自动写入
     - 有界增长：环形缓冲 + 定期压缩，防止 localStorage 无限膨胀
     - 可解释：每条诊断都能溯源到具体记录，不做黑箱判断
   ============================================================ */
(function (global) {
  'use strict';

  /* progress.js 在 store.js 之后加载，但模块顶层的 S / ContentIndex / PhonemeLib
     可能尚未赋值（store 的 IIFE 只在 init() 时创建实例化导出）。
     因此统一用惰性取值，避免加载期依赖。 */
  function store() { return global.Store; }
  function today() { return global.Store.today(); }
  function daysBetween(a, b) { return global.Store.daysBetween(a, b); }
  function index() { return global.ContentIndex; }

  var KEY = 'eng_atlas_progress_v1';
  var MAX_WORD_HISTORY = 12;    // 每词保留的最近 N 次作答记录
  var MAX_SPEAK_RECORDS = 400;   // 全局跟读记录上限
  var MAX_READ_RECORDS = 300;    // 全局阅读答题记录上限
  var MAX_TIMELINE = 200;        // 学习时间线上限

  /* ============================================================
     存储层
     ============================================================ */
  var data = null;
  var saveTimer = null;
  var runtime = { degraded: false };

  function defaultData() {
    return {
      version: 1,
      createdAt: today(),
      /* 词汇掌握度： wordId -> { first, last, level, history[], totalTries, totalRight, avgMs } */
      words: {},
      /* 句子发音： sceneId+':'+lineIdx -> { best, tries, lastDate, history[] } */
      speaking: {},
      /* 表达掌握： catKey+':'+idx -> { seen, rated } */
      expressions: {},
      /* 连读例句： index -> { best, tries } */
      liaison: {},
      /* 阅读轨迹： articleId -> { done, best, lastDate, answers: {qIndex: 0|1} } */
      reading: {},
      /* 学习时间线： [{ ts, date, time, module, minutes }] */
      timeline: [],
      /* 弱项诊断缓存 */
      weak: { phonemes: {}, questionTypes: {}, timeSlots: {}, modules: {} }
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultData();
      var d = JSON.parse(raw);
      var base = defaultData();
      // 逐字段补全
      Object.keys(base).forEach(function (k) {
        if (d[k] === undefined || d[k] === null) d[k] = base[k];
      });
      return d;
    } catch (e) {
      console.warn('[progress] 读取失败，重置', e);
      return defaultData();
    }
  }

  function save() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveTimer = null;
      try { localStorage.setItem(KEY, JSON.stringify(data)); }
      catch (e) {
        runtime.degraded = true;
        console.warn('[progress] 保存失败', e);
        compress();
        try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) { /* 放弃 */ }
      }
    }, 400);
  }

  /** 压缩：环形截断，防止存储无限增长 */
  function compress() {
    Object.keys(data.words).forEach(function (id) {
      var w = data.words[id];
      if (w.history && w.history.length > MAX_WORD_HISTORY) {
        w.history = w.history.slice(-MAX_WORD_HISTORY);
      }
      // 极久未练的词只留汇总，不留明细
      if (w.last && daysBetween(w.last, today()) > 180) {
        w.history = [];
      }
    });
    var sk = Object.keys(data.speaking);
    if (sk.length > 200) {
      // 按 lastDate 淘汰最久未练的 100 条
      sk.sort(function (a, b) { return (data.speaking[a].lastDate || '') < (data.speaking[b].lastDate || '') ? -1 : 1; });
      sk.slice(0, 100).forEach(function (k) { delete data.speaking[k]; });
    }
    if (data.timeline.length > MAX_TIMELINE) data.timeline = data.timeline.slice(-MAX_TIMELINE);
  }

  /* ============================================================
     词汇掌握度
     ============================================================ */
  /**
   * 记录一次词汇作答
   * @param {number} wordId
   * @param {object} card SM-2 卡片（applyReview 后）
   * @param {number} q 评分 0-4
   * @param {number} ms 用时（毫秒），可选
   */
  function recordWord(wordId, card, q, ms) {
    ensure();
    var t = today();
    var w = data.words[wordId];
    if (!w) {
      w = data.words[wordId] = {
        first: t, last: t, level: 0, history: [],
        totalTries: 0, totalRight: 0, avgMs: 0, lapses: 0
      };
    }
    w.last = t;
    w.level = card ? card.ivl : (w.level || 0);
    w.totalTries += 1;
    if (q >= 3) w.totalRight += 1; else w.lapses += 1;
    if (ms > 0 && ms < 60000) {
      w.avgMs = w.avgMs ? Math.round(w.avgMs * 0.7 + ms * 0.3) : ms;
    }
    w.history.push({
      d: t, q: q, ivl: card ? card.ivl : 0, ms: ms || 0
    });
    if (w.history.length > MAX_WORD_HISTORY) w.history = w.history.slice(-MAX_WORD_HISTORY);
    save();
    return w;
  }

  /** 掌握度分层：0未学 1初识 2熟悉 3掌握 4长期记忆 */
  function wordStage(wordId) {
    ensure();
    var w = data.words[wordId];
    if (!w) return 0;
    var ivl = w.level || 0;
    if (ivl >= 21) return 4;
    if (ivl >= 7) return 3;
    if (ivl >= 2) return 2;
    if (ivl >= 1 || w.totalTries > 0) return 1;
    return 0;
  }
  var STAGE_NAME = ['未学', '初识', '熟悉', '掌握', '长期记忆'];

  /** 词汇整体记忆画像 */
  function wordMemory() {
    ensure();
    // 词库总数取自 meta（含未加载的 L5/L6），避免懒加载导致「覆盖 100%」的错觉
    var total = (global.Store && global.Store.vocabTotalCount)
      ? global.Store.vocabTotalCount()
      : (global.ContentIndex ? global.ContentIndex.allWords().length : 0);
    var st = [0, 0, 0, 0, 0];
    Object.keys(data.words).forEach(function (id) { st[wordStage(id)]++; });
    var learned = st[1] + st[2] + st[3] + st[4];
    return {
      total: total, learned: learned,
      untouched: Math.max(0, total - learned),
      stage: st, stageName: STAGE_NAME,
      mature: st[4],
      coverage: total ? learned / total : 0
    };
  }

  /* ============================================================
     句子发音记忆
     ============================================================ */
  /**
   * @param {string} sceneId
   * @param {number} lineIdx
   * @param {number} score 0-100
   * @param {number} [asrConf] 语音识别置信度
   */
  function recordSpeaking(sceneId, lineIdx, score, asrConf) {
    ensure();
    var k = sceneId + ':' + lineIdx;
    var r = data.speaking[k];
    if (!r) {
      r = data.speaking[k] = { best: 0, tries: 0, lastDate: '', firstDate: today(), history: [] };
    }
    r.best = Math.max(r.best, score || 0);
    r.tries += 1;
    r.lastDate = today();
    r.history.push({ d: today(), s: score || 0, c: asrConf || 0 });
    if (r.history.length > 10) r.history = r.history.slice(-10);
    // 更新场景级进度
    save();
    return r;
  }

  /** 某场景的掌握情况 */
  function sceneProgress(sceneId, lineCount) {
    ensure();
    var done = 0, total = 0;
    for (var i = 0; i < lineCount; i++) {
      total += 1;
      if (data.speaking[sceneId + ':' + i]) done += 1;
    }
    return { done: done, total: total, pct: total ? done / total : 0 };
  }

  /* ============================================================
     表达掌握记忆（日常交流）
     ============================================================ */
  function recordExpression(catKey, idx) {
    ensure();
    var k = catKey + ':' + idx;
    var e = data.expressions[k];
    if (!e) e = data.expressions[k] = { seen: 0, first: today(), last: today() };
    e.seen += 1;
    e.last = today();
    save();
  }

  /* ============================================================
     连读例句记忆
     ============================================================ */
  function recordLiaison(idx, score) {
    ensure();
    var r = data.liaison[idx];
    if (!r) r = data.liaison[idx] = { best: 0, tries: 0, lastDate: '' };
    r.best = Math.max(r.best, score || 0);
    r.tries += 1;
    r.lastDate = today();
    save();
  }
  function liaisonProgress() {
    ensure();
    var total = global.ContentIndex ? global.ContentIndex.liaisonExamples().length : 0;
    var done = Object.keys(data.liaison).length;
    return { done: done, total: total, pct: total ? done / total : 0 };
  }

  /* ============================================================
     阅读轨迹
     ============================================================ */
  /**
   * @param {string} artId
   * @param {number} qIndex
   * @param {boolean} correct
   * @param {number} ms
   */
  function recordReading(artId, qIndex, correct, ms) {
    ensure();
    var r = data.reading[artId];
    if (!r) {
      r = data.reading[artId] = { done: 0, best: 0, lastDate: '', answers: {}, totalQ: 0 };
    }
    var key = String(qIndex);
    if (r.answers[key] !== undefined) return r;   // 同题不重复记
    r.answers[key] = correct ? 1 : 0;
    r.done = Object.keys(r.answers).length;
    var right = 0;
    Object.keys(r.answers).forEach(function (k) { right += r.answers[k]; });
    r.best = Math.max(r.best, r.done ? right / r.done : 0);
    r.lastDate = today();
    if (ms > 0) r.lastMs = ms;
    save();
    return r;
  }

  /** 阅读整体进度 */
  function readingProgress() {
    ensure();
    var arts = global.ContentIndex ? global.ContentIndex.readings() : [];
    var started = 0, finished = 0, totalQ = 0, doneQ = 0;
    arts.forEach(function (a) {
      var r = data.reading[a.id];
      totalQ += (a.questions || []).length;
      if (r) {
        started += 1;
        doneQ += Object.keys(r.answers).length;
        var nq = (a.questions || []).length;
        if (r.done >= nq) finished += 1;
      }
    });
    return {
      total: arts.length, started: started, finished: finished,
      totalQ: totalQ, doneQ: doneQ,
      pct: totalQ ? doneQ / totalQ : 0
    };
  }

  /* ============================================================
     学习时间线与作息画像
     ============================================================ */
  /**
   * @param {string} module 模块 id
   * @param {number} minutes 本次时长
   * @param {string} [detail] 细节（词/句/篇 id）
   */
  function recordSession(module, minutes, detail) {
    ensure();
    var now = new Date();
    data.timeline.push({
      ts: now.getTime(),
      date: today(),
      hour: now.getHours(),
      module: module,
      minutes: Math.max(1, Math.round(minutes || 1)),
      detail: detail || ''
    });
    if (data.timeline.length > MAX_TIMELINE) data.timeline = data.timeline.slice(-MAX_TIMELINE);
    data.weak.modules[module] = (data.weak.modules[module] || 0) + (minutes || 1);
    save();
  }

  /** 作息画像：学习高峰时段 */
  function timeProfile() {
    ensure();
    var slots = {};       // 时段 → 分钟数
    var days = {};        // 星期 → 次数
    var WD = ['日', '一', '二', '三', '四', '五', '六'];
    data.timeline.forEach(function (t) {
      var slot = slotOf(t.hour);
      slots[slot] = (slots[slot] || 0) + t.minutes;
      var wd = WD[new Date(t.ts).getDay()];
      days[wd] = (days[wd] || 0) + 1;
    });
    // 找出高峰
    var best = '', bestVal = 0;
    Object.keys(slots).forEach(function (s) { if (slots[s] > bestVal) { bestVal = slots[s]; best = s; } });
    var bestDay = '', bestDayVal = 0;
    Object.keys(days).forEach(function (d) { if (days[d] > bestDayVal) { bestDayVal = days[d]; bestDay = d; } });
    return {
      slots: slots, days: days,
      peakSlot: best, peakMinutes: bestVal,
      peakDay: bestDay,
      sessions: data.timeline.length,
      totalMinutes: data.timeline.reduce(function (n, t) { return n + t.minutes; }, 0)
    };
  }
  function slotOf(hour) {
    if (hour < 6) return '凌晨';
    if (hour < 11) return '早晨';
    if (hour < 14) return '中午';
    if (hour < 18) return '下午';
    if (hour < 22) return '晚上';
    return '深夜';
  }

  /** 学习热力图：最近 N 天 */
  function heatmap(days) {
    ensure();
    days = days || 119;
    var map = {};
    data.timeline.forEach(function (t) {
      map[t.date] = (map[t.date] || 0) + t.minutes;
    });
    var out = [];
    for (var i = days - 1; i >= 0; i--) {
      var d = global.Store.daysAgoISO(i);
      out.push({ date: d, minutes: map[d] || 0, i: days - 1 - i });
    }
    return out;
  }

  /* ============================================================
     弱项诊断
     ============================================================ */
  /** 记录某个音素的出错（用于音标诊断） */
  function recordPhonemeError(sym) {
    ensure();
    data.weak.phonemes[sym] = (data.weak.phonemes[sym] || 0) + 1;
    save();
  }
  /** 记录某题型出错 */
  function recordQuestionType(type) {
    ensure();
    data.weak.questionTypes[type] = (data.weak.questionTypes[type] || 0) + 1;
    save();
  }

  /** 生成诊断报告：全部可溯源到具体记录 */
  function diagnose() {
    ensure();
    var out = [];
    var tp = timeProfile();
    var wm = wordMemory();
    var rp = readingProgress();
    var lp = liaisonProgress();

    // 1. 高频错误音素
    var ph = Object.keys(data.weak.phonemes)
      .filter(function (k) { return data.weak.phonemes[k] >= 2; })
      .sort(function (a, b) { return data.weak.phonemes[b] - data.weak.phonemes[a]; })
      .slice(0, 5);
    if (ph.length) {
      out.push({
        level: 'warn', kind: 'phoneme',
        title: '易错音素集中',
        detail: '这些音素被标记出错的次数最多：' + ph.map(function (k) {
          var info = global.PhonemeLib ? global.PhonemeLib.lookup(k) : null;
          return (info ? info.ipa : k) + '(' + data.weak.phonemes[k] + '次)';
        }).join('、'),
        action: '前往「英语资料 → 音标发音」针对性练习'
      });
    }

    // 2. 阅读弱题型
    var qt = Object.keys(data.weak.questionTypes)
      .sort(function (a, b) { return data.weak.questionTypes[b] - data.weak.questionTypes[a]; })
      .slice(0, 3);
    if (qt.length) {
      out.push({
        level: 'warn', kind: 'question',
        title: '阅读题型薄弱',
        detail: '出错最多的题型：' + qt.map(function (t) {
          return t + '(' + data.weak.questionTypes[t] + '次)';
        }).join('、'),
        action: '加强该题型的专项练习'
      });
    }

    // 3. 记忆覆盖
    if (wm.total && wm.coverage < 0.15) {
      out.push({
        level: 'info', kind: 'coverage',
        title: '词汇覆盖面还很窄',
        detail: '只接触了 ' + wm.learned + '/' + wm.total + ' 个词（' +
          Math.round(wm.coverage * 100) + '%）。当前等级 ' +
          '已学 ' + wm.stage[3] + ' 掌握 / ' + wm.stage[4] + ' 长期记忆。',
        action: '每日新词建议 12-20 个，重质量不重数量'
      });
    }

    // 4. 学习节奏
    if (tp.sessions >= 7) {
      var inactive = 0;
      for (var i = 1; i <= 3; i++) {
        if (!heatmap(4)[3 - i + 1] || heatmap(4)[3 - i + 1].minutes === 0) inactive++;
      }
      if (inactive >= 2) {
        out.push({
          level: 'warn', kind: 'streak',
          title: '学习节奏中断',
          detail: '最近 3 天中有 ' + inactive + ' 天没有学习记录。',
          action: '先恢复每天 10 分钟的最低节奏'
        });
      }
    }

    // 5. 作息建议（正向）
    if (tp.peakSlot && tp.peakMinutes >= 30) {
      out.push({
        level: 'good', kind: 'rhythm',
        title: '你的高效时段是「' + tp.peakSlot + '」',
        detail: '累计 ' + tp.peakMinutes + ' 分钟集中在这个时段' +
          (tp.peakDay ? '，最常学的是周' + tp.peakDay : '') + '。',
        action: '把难点内容安排在这个时段'
      });
    }

    // 6. 模块投入分布
    var mods = Object.keys(data.weak.modules).sort(function (a, b) {
      return data.weak.modules[b] - data.weak.modules[a];
    });
    if (mods.length >= 3) {
      var totalM = mods.reduce(function (n, m) { return n + data.weak.modules[m]; }, 0);
      var least = mods[mods.length - 1];
      var leastPct = Math.round(data.weak.modules[least] / totalM * 100);
      if (leastPct < 12) {
        out.push({
          level: 'info', kind: 'balance',
          title: '模块投入不均衡',
          detail: '「' + least + '」仅占 ' + leastPct + '%（' +
            mods.slice(0, 3).map(function (m) {
              return m + ' ' + Math.round(data.weak.modules[m] / totalM * 100) + '%';
            }).join(' / ') + '）',
          action: '英语是听说读写综合能力，短板会拖累整体'
        });
      }
    }

    return out;
  }

  /* ============================================================
     快照与恢复
     ============================================================ */
  /** 导出可读的学习报告（JSON） */
  function snapshot() {
    ensure();
    return {
      generatedAt: new Date().toISOString(),
      wordMemory: wordMemory(),
      reading: readingProgress(),
      liaison: liaisonProgress(),
      speaking: {
        records: Object.keys(data.speaking).length,
        avgBest: avgSpeakingScore()
      },
      timeline: timeProfile(),
      diagnose: diagnose()
    };
  }

  function avgSpeakingScore() {
    var ks = Object.keys(data.speaking);
    if (!ks.length) return 0;
    var sum = 0;
    ks.forEach(function (k) { sum += data.speaking[k].best || 0; });
    return Math.round(sum / ks.length);
  }

  /** 连续学习天数（基于时间线，含跨天判断） */
  function activeDays() {
    ensure();
    var days = {};
    data.timeline.forEach(function (t) { days[t.date] = 1; });
    return Object.keys(days).length;
  }

  /* ============================================================
     初始化
     ============================================================ */
  function init() {
    if (!data) data = load();
    return data;
  }
  /** 惰性初始化：任何记录接口调用前确保 data 就绪。
      这样即使 app.init 尚未执行，也不会抛 null 错误。 */
  function ensure() {
    if (!data) init();
    return data;
  }

  global.Progress = {
    init: init,
    get data() { return data; },
    get runtime() { return runtime; },
    save: save,
    compress: compress,
    // 记录
    recordWord: recordWord,
    recordSpeaking: recordSpeaking,
    recordExpression: recordExpression,
    recordLiaison: recordLiaison,
    recordReading: recordReading,
    recordSession: recordSession,
    recordPhonemeError: recordPhonemeError,
    recordQuestionType: recordQuestionType,
    // 查询
    wordStage: wordStage,
    wordMemory: wordMemory,
    sceneProgress: sceneProgress,
    liaisonProgress: liaisonProgress,
    readingProgress: readingProgress,
    timeProfile: timeProfile,
    heatmap: heatmap,
    slotOf: slotOf,
    // 报告
    diagnose: diagnose,
    snapshot: snapshot,
    activeDays: activeDays,
    STAGE_NAME: STAGE_NAME,
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) { /* 无痕模式 */ }
      data = defaultData();
    }
  };
})(window);