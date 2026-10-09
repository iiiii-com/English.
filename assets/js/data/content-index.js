/* ============================================================
   content-index.js —— 统一内容索引（单一数据源）
   目的：消除各视图里散落的硬编码聚合逻辑。

   原来各视图自行拼数据源，导致：
     - view-speak.js 手动列 4 个场景源，漏一个就少一批内容
     - view-daily-comm.js 手动列 5 个表达源
     - 新增数据文件必须同时改多个视图，极易遗漏
   现在统一在这里注册，各视图只问索引要数据。

   用法：
     var idx = global.ContentIndex;
     idx.dailyComm()        // 全部日常交流表达（含分类）
     idx.dailyCommByCat()   // 分类列表
     idx.scenes()           // 全部场景对话（去重）
     idx.liaisonExamples()  // 全部连读例句
     idx.readings()         // 全部短文
     idx.stats()            // 全站内容统计
   ============================================================ */
(function (global) {
  'use strict';

  /** 数据源注册表 —— 新增内容只需在这里加一行 */
  var SOURCES = {
    dailyComm: [
      { key: 'DailyComm', label: '基础功能表达' },
      { key: 'DailyComm2', label: '场景功能表达' },
      { key: 'DailyComm3', label: '高频功能表达' },
      { key: 'DailyComm4', label: '生活场景表达' },
      { key: 'DailyComm5', label: '日常综合表达' },
      { key: 'DailyComm6', label: '生活细节与书面沟通' }
    ],
    scenes: [
      { key: 'SpeakingContent', label: '基础场景' },
      { key: 'SlangContent', prop: 'DAILY_SCENES', label: '俚语场景' },
      { key: 'DailySceneContent', label: '生活场景' },
      { key: 'SceneL4', label: 'L4 高阶场景' },
      { key: 'SceneExpansion', label: '生活服务与社交场景' }
    ],
    liaison: [
      { key: 'LiaisonContent', label: '连读规则与例句（第一批）' },
      { key: 'LiaisonContent2', label: '连读例句（第二批）' }
    ],
    reading: [
      { key: 'ReadingContent', label: '分级短文（含第二批）' },
      { key: 'ReadingContent2', label: '分级短文（第二批）', skip: true }  // 已由 merged() 合并，避免重复
    ]
  };

  /* ---------- 通用聚合 ---------- */

  /** 取某个模块下的所有条目（各模块 flat() 结构略有差异，此处归一化） */
  function collectModules(kind, mapper) {
    var out = [];
    (SOURCES[kind] || []).forEach(function (s) {
      if (s.skip) return;
      var m = global[s.key];
      if (!m) { console.warn('[ContentIndex] 数据源缺失：' + s.key); return; }
      var items;
      if (kind === 'scenes') {
        // 场景模块结构不同：SCENES 或 DAILY_SCENES
        var arr = m[s.prop] || m.SCENES || m.SCENE_LIST || [];
        items = arr.map(function (x) { return mapper(x, s); });
      } else if (kind === 'liaison') {
        items = (m.EXAMPLES || []).map(function (x) { return mapper(x, s); });
      } else if (kind === 'reading') {
        // ReadingContent 自带 merged()（已合并第二批），优先用它
        var list = typeof m.merged === 'function' ? m.merged() : (m.ARTICLES || []);
        items = list.map(function (x) { return mapper(x, s); });
      } else {
        if (typeof m.flat === 'function') {
          items = m.flat().map(function (x) { return mapper(x, s); });
        }
      }
      out = out.concat(items || []);
    });
    return out;
  }

  /* ---------- 日常交流 ---------- */
  function dailyComm() {
    return collectModules('dailyComm', function (x, s) {
      return { en: x.en, cn: x.cn, r: x.r, cat: x.cat, catKey: x.key, src: s.label };
    });
  }
  function dailyCommCats() {
    var seen = {}, out = [];
    (SOURCES.dailyComm || []).forEach(function (s) {
      var m = global[s.key];
      if (!m) return;
      m.catKeys().forEach(function (k) {
        var id = s.key + '.' + k;
        if (seen[id]) return;
        seen[id] = 1;
        // key 保留裸名（兼容既有视图），id 为全局唯一标识（含模块前缀）
        out.push({ id: id, key: k, name: m.CATS[k], src: s.label, module: s.key });
      });
    });
    return out;
  }
  function dailyCommByCat(catId) {
    // 兼容两种入参：裸 key（'thanks'）或全局 id（'DailyComm3.help_reply'）
    var dot = String(catId).indexOf('.');
    var modKey = dot > 0 ? catId.slice(0, dot) : null;
    var key = dot > 0 ? catId.slice(dot + 1) : catId;
    var m = modKey ? global[modKey] : global.DailyComm;
    if (m && m.DATA[key]) {
      return m.DATA[key].map(function (r) {
        return { en: r[0], cn: r[1], r: r[2], cat: m.CATS[key], catKey: key, src: modKey };
      });
    }
    // 裸 key 时遍历所有模块找第一个命中
    for (var i = 0; i < SOURCES.dailyComm.length; i++) {
      var mod = global[SOURCES.dailyComm[i].key];
      if (mod && mod.DATA[key]) {
        return mod.DATA[key].map(function (r) {
          return { en: r[0], cn: r[1], r: r[2], cat: mod.CATS[key], catKey: key, src: SOURCES.dailyComm[i].key };
        });
      }
    }
    return [];
  }

  /* ---------- 场景对话 ---------- */
  function scenes() {
    var seen = {};
    return collectModules('scenes', function (x, s) {
      return Object.assign({ _src: s.label }, x);
    }).filter(function (x) {
      if (!x || !x.id) return false;
      if (seen[x.id]) return false;
      seen[x.id] = 1;
      return true;
    });
  }
  function scenesByLevel(lv) {
    return scenes().filter(function (s) { return s.lv === lv; });
  }

  /* ---------- 连读 ---------- */
  function liaisonExamples() {
    return collectModules('liaison', function (x, s) {
      return Object.assign({ _src: s.label }, x);
    });
  }
  function liaisonRules() {
    return global.LiaisonContent ? global.LiaisonContent.RULES : [];
  }
  function liaisonDrills() {
    return global.LiaisonContent ? global.LiaisonContent.DRILLS : [];
  }

  /* ---------- 阅读 ---------- */
  function readings() {
    var seen = {};
    return collectModules('reading', function (x, s) {
      return Object.assign({ _src: s.label }, x);
    }).filter(function (x) {
      if (!x || !x.id) return false;
      if (seen[x.id]) return false;
      seen[x.id] = 1;
      return true;
    });
  }

  /* ---------- 词汇 ---------- */
  function allWords() {
    // 只返回已加载的词库（L5/L6 未加载时为空，属正常懒加载行为）
    var base = (global.VOCAB_DATA && global.VOCAB_DATA.words) || [];
    var gk = [];
    if (global.GAOKAO_L5) gk = gk.concat(global.GAOKAO_L5.words);
    if (global.GAOKAO_L6) gk = gk.concat(global.GAOKAO_L6.words);
    // 兼容未拆分的老结构
    if (!gk.length && global.GAOKAO_DATA && global.GAOKAO_DATA.words) {
      gk = global.GAOKAO_DATA.words;
    }
    return base.concat(gk);
  }
  /** 词库总数（含未加载等级，取自 meta） */
  function allWordCount() {
    if (global.Store && global.Store.vocabTotalCount) return global.Store.vocabTotalCount();
    return allWords().length;
  }
  function topicWords() {
    return global.TopicWords ? global.TopicWords.flat() : [];
  }

  /* ---------- 音标 ---------- */
  function phonemes() {
    var P = global.PhonemeLib;
    if (!P) return [];
    var out = [];
    Object.keys(P.VOWELS).forEach(function (k) {
      out.push(Object.assign({ sym: k }, P.VOWELS[k], { kind: 'vowel' }));
    });
    Object.keys(P.CONSONANTS).forEach(function (k) {
      out.push(Object.assign({ sym: k }, P.CONSONANTS[k], { kind: 'consonant' }));
    });
    return out;
  }
  function phonemeDemo(sym) {
    var D = global.PhonemeDetail;
    return (D && D.DEMO[sym]) || null;
  }

  /* ---------- 全站统计 ---------- */
  function stats() {
    var dc = dailyComm(), sc = scenes(), lz = liaisonExamples(), rd = readings();
    var byRule = {};
    lz.forEach(function (e) { byRule[e.rule] = (byRule[e.rule] || 0) + 1; });
    var scByLv = {};
    sc.forEach(function (s) { scByLv[s.lv] = (scByLv[s.lv] || 0) + 1; });
    var dcByReg = {};
    dc.forEach(function (x) { dcByReg[x.r] = (dcByReg[x.r] || 0) + 1; });
    var qCount = rd.reduce(function (n, a) { return n + ((a.questions || []).length); }, 0);
    var lineCount = sc.reduce(function (n, s) { return n + ((s.lines || []).length); }, 0);
    return {
      words: allWordCount(),
      wordsLoaded: allWords().length,
      wordsWithIpa: allWords().filter(function (w) { return !!w.ipa; }).length,
      topicWords: topicWords().length,
      dailyComm: dc.length,
      dailyCommCats: dailyCommCats().length,
      dailyCommByReg: dcByReg,
      scenes: sc.length,
      sceneLines: lineCount,
      scenesByLevel: scByLv,
      liaisonRules: liaisonRules().length,
      liaisonExamples: lz.length,
      liaisonByRule: byRule,
      readings: rd.length,
      readingQuestions: qCount,
      phonemes: phonemes().length,
      clusters: (global.PhonemeDetail ? global.PhonemeDetail.CLUSTERS.length : 0),
      rpGaGroups: (global.PhonemeDetail
        ? global.PhonemeDetail.RP_GA.phonemes.length
          + global.PhonemeDetail.RP_GA.words.length
          + global.PhonemeDetail.RP_GA.sentences.length : 0)
    };
  }

  global.ContentIndex = {
    SOURCES: SOURCES,
    dailyComm: dailyComm,
    dailyCommCats: dailyCommCats,
    dailyCommByCat: dailyCommByCat,
    scenes: scenes,
    scenesByLevel: scenesByLevel,
    liaisonExamples: liaisonExamples,
    liaisonRules: liaisonRules,
    liaisonDrills: liaisonDrills,
    readings: readings,
    allWords: allWords,
    allWordCount: allWordCount,
    topicWords: topicWords,
    phonemes: phonemes,
    phonemeDemo: phonemeDemo,
    stats: stats
  };
})(window);