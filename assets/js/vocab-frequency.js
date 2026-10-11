/* ============================================================
   vocab-frequency.js —— 词频分级与考试体系
   ------------------------------------------------------------
   为什么单独一个模块：

   现有 L1-L6 是「难度/阶段」维度，与「常用度」维度互不替代。
   难度告诉你先学什么，词频告诉你哪些值得反复滚熟——
   把两者混为一谈，就会出现「背完 L6 还是不会用高频词」的情况。

   数据来自 assets/js/data/word-frequency.js，
   由 tools/build-freq-index.js 从 ECDICT 的 frq 字段生成。

   关键事实：frq 是**排名**而非频次，值越小越常用（the=1）。
   99999 是「无词频数据」的哨兵值（dvd/email 这类新词），
   必须单独归入 F5，不能当作「极常用」——否则新词会被顶到最前排。
   ============================================================ */
(function (global) {
  'use strict';

  var F = global.WORD_FREQ || null;

  /* 兜底定义：索引未加载时也要能用，不能让页面因缺数据而崩 */
  var BANDS = F ? F.meta.bands : [
    { id: 'F1', name: '极高频', desc: '必须滚熟', max: 1000, count: 0 },
    { id: 'F2', name: '高频', desc: '读写都要认', max: 3000, count: 0 },
    { id: 'F3', name: '中频', desc: '认识即可', max: 6000, count: 0 },
    { id: 'F4', name: '低频', desc: '见过就够', max: 9000, count: 0 },
    { id: 'F5', name: '生僻/无数据', desc: '按需查阅', max: null, count: 0 }
  ];

  /* 词 → 档位 的反查表。
     只收录每档前 400 个（索引本身的取舍），够用于筛选与提示；
     未收录的词通过 frq 现算，结果依然正确。 */
  var bandOfWord = {};
  if (F && F.words) {
    Object.keys(F.words).forEach(function (bid) {
      F.words[bid].forEach(function (w) { bandOfWord[w] = bid; });
    });
  }

  function meta() {
    return (F && F.meta) || { bands: BANDS, total: 0, exams: [], cet: null };
  }

  /** 该词的词频档位 id */
  function bandOf(word) {
    var w = String(word || '').toLowerCase();
    if (bandOfWord[w]) return bandOfWord[w];
    var f = frqOf(word);
    if (typeof f !== 'number' || !isFinite(f) || f >= 99999) return 'F5';
    for (var i = 0; i < BANDS.length; i++) {
      var mx = BANDS[i].max;
      if (mx == null || f < mx) return BANDS[i].id;
    }
    return 'F5';
  }

  /** 从词条对象取 frq */
  function frqOf(entry) {
    if (entry == null) return null;
    if (typeof entry === 'number') return entry;
    if (typeof entry.frq === 'number') return entry.frq;
    return null;
  }

  /** 档位的展示信息 */
  function bandInfo(id) {
    for (var i = 0; i < BANDS.length; i++) if (BANDS[i].id === id) return BANDS[i];
    return null;
  }

  /** 考试体系信息 */
  function exams() { return meta().exams || []; }
  function exam(id) {
    var list = exams();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  /** 该词属于哪些考试体系（读 tag 字段） */
  function examsOfWord(entry) {
    var out = [];
    var tags = String((entry && entry.tag) || '').split(/\s+/);
    exams().forEach(function (e) {
      if (tags.indexOf(e.id) > -1) out.push(e);
    });
    return out;
  }

  /** 四六级关系说明。这是本模块最该被用户看到的结论。 */
  function cetInsight() {
    var c = meta().cet;
    if (!c) return null;
    return {
      cet4: c.cet4Count,
      cet6: c.cet6Count,
      both: c.both,
      cet4Only: c.cet4Only,
      cet6Only: c.cet6Only,
      /* 四级 2052 词里 1802 词六级也要，只�� 250 词是四级独有。
         所以「四级考纲 = 六级子集」这个认知是错的：
         背四级只是入门，六级真正的增量在剩下的 696 词。 */
      overlapPct: Math.round(c.both / c.cet4Count * 100)
    };
  }

  /** 学习优先级：该考试内各词频档的词数 */
  function priorityOf(examId) {
    var p = (meta().priority || {})[examId];
    return p || null;
  }

  /**
   * 综合排序：把「考试范围」与「词频」交叉。
   * 同为考试内词时，词频高的排前面——这才是「优先背」的含义。
   */
  function sortByPriority(list, examId) {
    var tags = examId;
    var bandRank = { F1: 0, F2: 1, F3: 2, F4: 3, F5: 4 };
    var isIn = function (w) {
      if (!tags) return true;
      return String(w.tag || '').split(/\s+/).indexOf(tags) > -1;
    };
    return list.slice().sort(function (a, b) {
      var ia = isIn(a) ? 0 : 1, ib = isIn(b) ? 0 : 1;
      if (ia !== ib) return ia - ib;              // 考试内优先
      var ba = bandRank[bandOf(a.w)] || 0, bb = bandRank[bandOf(b.w)] || 0;
      if (ba !== bb) return ba - bb;              // 再按词频
      var fa = frqOf(a), fb = frqOf(b);
      if (typeof fa === 'number' && typeof fb === 'number' && fa !== fb) return fa - fb;
      return String(a.w).localeCompare(String(b.w));
    });
  }

  global.VocabFreq = {
    bands: BANDS,
    meta: meta,
    bandOf: bandOf,
    bandInfo: bandInfo,
    frqOf: frqOf,
    exams: exams,
    exam: exam,
    examsOfWord: examsOfWord,
    cetInsight: cetInsight,
    priorityOf: priorityOf,
    sortByPriority: sortByPriority,
    /* 档位 → 语义色类名，复用既有标签样式，不新增色值 */
    bandTag: function (id) {
      return { F1: 'l1', F2: 'l2', F3: 'l3', F4: 'l4', F5: 'l5' }[id] || 'grey';
    }
  };
})(window);
