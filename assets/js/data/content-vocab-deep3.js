/* ============================================================
   content-vocab-deep3.js —— 单词讲解深层数据（第三批，收尾）
   ------------------------------------------------------------
   前两批把 447 个缺音标短语补到只剩 38 条，这一批把它们收掉。

   剩下的这些集中在两类：
     · 邮件与商务开头语（I am writing to / as a follow-up to…）
       —— 主语是"我"时，首字母大写导致 key 匹配要大小写不敏感
     · hear / pass / rule / stand / start 系列的小品词动词
       —— 与前两批的动词短语同源，但当时只补了 coll 没补条目
   ============================================================ */
(function (global) {
  'use strict';

  var DEEP3 = {
    /* ========== 一、邮件与商务开头语 ========== */
    'minutes from': {
      ipa: '/ˈmɪnɪts frɒm/',
      coll: ['It\'s ten minutes from here.', '距离…几分钟（路程）', '出行'],
      confuse: '⭐ 分钟的复数是 minutes（/ˈmɪnɪts/），'
        + '不是 minute\'s。'
        + 'minutes from（路程上几分钟）vs minutes to go（还剩几分钟要做）。'
        + '例：The hotel is five minutes from the station.'
    },
    'I am writing to': {
      ipa: '/aɪ æm ˈraɪtɪŋ tuː/',
      coll: ['I am writing to confirm our meeting.', '我写信是为了…', '商务'],
      confuse: '⭐ 英文商务邮件的标准开头，后接不定式：'
        + 'I am writing to inform you… / I am writing to confirm…'
        + '注意是 writing（一个 t），不是 writting。'
        + '口语邮件可省 am：I\'m writing to…'
    },
    'I would appreciate it if': {
      ipa: '/aɪ wʊd əˈpriːʃieɪt ɪt ɪf/',
      coll: ['I would appreciate it if you could reply by Friday.', '若您能…不胜感激', '商务'],
      confuse: '⭐ 虚拟语气三要素：'
        + '① 用 appreciate **it**（不用 appreciate you）'
        + '② 后接 if 从句'
        + '③ 从句用过去式：could / would / would mind。'
        + '❌ I would appreciate you if…（错）'
    },
    'per my last email': {
      ipa: '/pər maɪ lɑːst ˈiːmeɪl/',
      coll: ['Per my last email of 3 May…', '根据我上一封邮件', '商务'],
      confuse: '⭐ per 是正式/法律书面语，'
        + '相当于 according to，后接来源。'
        + '一般商务邮件用 with reference to 或 as discussed 更自然，'
        + 'per 略显生硬。'
    },
    'thank you for your patience': {
      ipa: '/θæŋk juː fɔː jɔː ˈpeɪʃns/',
      coll: ['Thank you for your patience.', '感谢你的耐心', '商务/客服'],
      confuse: '⭐ 客服与商务的标准致歉语，'
        + '常与等待连用：'
        + 'Thank you for your patience while we process your request.'
        + '后面不加 more。'
    },
    'I\'m reaching out': {
      ipa: '/aɪm ˈriːtʃɪŋ aʊt/',
      coll: ['I\'m reaching out to see if…', '我来联系您（主动）', '商务'],
      confuse: '⭐ reach out 含"主动伸出手"的意味，'
        + '语气比 contact 更友好。'
        + '邮件开头 "I\'m reaching out because…" 极常见。'
    },
    'I hope this email finds you well': {
      ipa: '/aɪ həʊp ðɪs ˈiːmeɪl faɪndz juː wel/',
      coll: ['I hope this email finds you well.', '希望您一切都好', '商务'],
      confuse: '⭐ 邮件套话，字面是"希望这封信找到您时您状态良好"。'
        + '英式商务常用，美式也通行。'
    },
    'just to clarify': {
      ipa: '/dʒʌst tuː ˈklærəfaɪ/',
      coll: ['Just to clarify, I meant Tuesday.', '补充说明；澄清一下', '商务'],
      confuse: '⭐ 暗示"前面说得不清楚，需要更正"。'
        + 'just to double-check（再确认一下）'
        + 'just to be clear（明确说一下）三者接近但语气强度不同。'
    },
    'should you have any questions': {
      ipa: '/ʃʊd juː hæv ˈeni ˈkwestʃənz/',
      coll: ['Should you have any questions, please let me know.', '如有任何疑问', '商务'],
      confuse: '⭐ 邮件结尾固定三连：'
        + 'Should you have any questions /'
        + 'Please do not hesitate to contact me /'
        + 'Thank you for your time.'
    },
    'please do not hesitate': {
      ipa: '/pliːz duː nɒt ˈhezɪteɪt/',
      coll: ['Please do not hesitate to contact me.', '请随时（不要客气）', '商务'],
      confuse: '⭐ 后必须接 to do：'
        + 'do not hesitate **to** contact me。'
        + '❌ do not hesitate contacting me。'
        + '近义：feel free to（更轻松）。'
    },
    'as a follow-up to': {
      ipa: '/əz ə ˈfɒləʊ ʊp tuː/',
      coll: ['As a follow-up to our call…', '作为…的后续（跟进）', '商务'],
      confuse: '⭐ 邮件与会议的高频信号词，'
        + '表示"延续上一次的话题"：'
        + 'As a follow-up to my previous message…'
        + '同 follow up on（跟进某事）。'
    },
    'I see where you\'re coming from': {
      ipa: '/aɪ siː weə jə ˈkʌmɪŋ frɒm/',
      coll: ['I see where you\'re coming from, but…', '我明白你的出发点', '口语/职场'],
      confuse: '⭐ 字面"我看到你从哪来"，'
        + '实际"我理解你的立场"，'
        + '但常暗含"但我未必同意"。'
        + '是委婉表达不同意的标准说法。'
    },
    'I wouldn\'t go that far': {
      ipa: '/aɪ ˈwʊdnt ɡəʊ ðæt fɑː/',
      coll: ['I wouldn\'t go that far, though.', '我不会说得那么绝对', '口语'],
      confuse: '⭐ 地道用法。字面"我不至于走到那一步"，'
        + '实际是"你说得过头了，我保留意见"。'
        + '比 I disagree 温和，但立场更清晰。'
    },
    'I\'d push back on that': {
      ipa: '/aɪd pʊʃ bæk ɒn ðæt/',
      coll: ['I\'d push back on that assumption.', '我不同意这一点（职场委婉）', '职场'],
      confuse: '⭐ push back 是职场"温和反对"的核心词组：'
        + 'push back on a plan / push back on the timeline。'
        + '比 I disagree 更有建设性，'
        + '是英美职场沟通的标准做法。'
    },
    'I\'d argue that': {
      ipa: '/aɪd ˈærɡjuː ðæt/',
      coll: ['I\'d argue that we should wait.', '我会主张；我会说', '书面'],
      confuse: '⭐ argue 在这里是"主张"（提出论点），不是"争吵"。'
        + 'I\'d argue that X 成立。'
        + '学术与商务写作常用：'
        + 'Some would argue that…（有人会主张…）'
    },
    'I partly agree': {
      ipa: '/aɪ ˈpɑːtli əˈɡriː/',
      coll: ['I partly agree with point 2.', '我部分同意', '口语/职场'],
      confuse: 'partly agree（部分同意——暗示有保留）'
        + 'vs I see your point（我理解你的观点——≠同意）'
        + 'vs I agree in principle（原则上同意——保留细节）。'
        + '⚠️ agree with sb，agree on sth，agree to do 三种搭配不同。'
    },
    'the way I see it': {
      ipa: '/ðə weɪ aɪ siː ɪt/',
      coll: ['The way I see it, we\'re fine.', '在我看来', '口语'],
      confuse: '⭐ 表达个人观点的固定句式。'
        + '同义：from my point of view / as I see it /'
        + 'the way I look at it。'
        + '比 in my opinion 更口语。'
    },
    'as far as I\'m concerned': {
      ipa: '/əz fɑːr əz aɪm kənˈsɜːnd/',
      coll: ['As far as I\'m concerned, it\'s fine.', '就我而言', '口语/写作'],
      confuse: '⭐ 只表立场，不表信息来源。'
        + 'as far as I know（据我所知）= 表信息来源。'
        + '两种含义不能互换，'
        + '语序相近但一为立场、一为证据。'
    },
    'as far as I know': {
      ipa: '/əz fɑːr əz aɪ nəʊ/',
      coll: ['As far as I know, he left.', '据我所知（信息来源）', '口语'],
      confuse: '表信息来源，后接句子：'
        + 'As far as I know, they never met.'
        + '⭐ 与 as far as I\'m concerned（就我而言）严格区分。'
    },
    'if I may': {
      ipa: '/ɪf aɪ meɪ/',
      coll: ['If I may, I\'d add one thing.', '如果可以的话', '书面'],
      confuse: '⭐ 礼貌地请求发言或行动：'
        + 'If I may, I\'d like to add…'
        + '同义：if you\'ll allow me。'
        + '比 could I 更正式。'
    },
    'if I recall correctly': {
      ipa: '/ɪf aɪ rɪˈkɔːl ˈkɒrəktli/',
      coll: ['If I recall correctly, we met in 2019.', '如果我没记错', '口语'],
      confuse: '⭐ 回忆时降低断言强度：'
        + 'if I recall / if I remember correctly /'
        + 'if memory serves（更文学）。'
        + '在商务场合比 I\'m not sure 更得体。'
    },
    'I\'ll give you that': {
      ipa: '/aɪl ɡɪv juː ðæt/',
      coll: ['I\'ll give you that, but…', '这点我承认（但…）', '口语'],
      confuse: '⭐ 先承认对方某一点有理，'
        + '然后通常会转折。'
        + '同义：fair enough / I will give you that point。'
    },
    'I mean': {
      ipa: '/aɪ miːn/',
      coll: ['I mean, it was hard.', '我是说（补充解释）', '口语'],
      confuse: '⭐ 高频口语插入语，用于补充说明或修正自己：'
        + 'It was, I mean, surprising。'
        + '不同义：I mean（我是说）/'
        + 'You mean…?（你是说…？）。'
    },
    'I suppose': {
      ipa: '/aɪ səˈpəʊz/',
      coll: ['I suppose so.', '我想也是；大概吧', '口语'],
      confuse: '⭐ 委婉表达"同意但不太情愿"：'
        + 'I suppose so（勉强同意）。'
        + '含不确定，比 I agree 更保守。'
    },
    'now that I think about it': {
      ipa: '/naʊ ðæt aɪ θɪŋk əˈbaʊt ɪt/',
      coll: ['Now that I think about it, it\'s fine.', '现在想想（才发现）', '口语'],
      confuse: '⭐ 作插入语时是"现在想来"。'
        + '但 now that 本身也可表示"既然"：'
        + 'Now that you\'re here, let\'s start。'
        + '两种用法靠语意区分。'
    },
    'on second thought': {
      ipa: '/ɒn ˈsekənd θɔːt/',
      coll: ['On second thought, let\'s stay in.', '再想想（改变主意）', '口语'],
      confuse: '⭐ 改变主意的信号词：'
        + 'On second thought, I\'ll take the bus.'
        + '同义：on reflection / thinking about it more。'
    },
    'for the time being': {
      ipa: '/fər ðə taɪm ˈbiːɪŋ/',
      coll: ['Let\'s pause for the time being.', '暂时；暂且', '书面'],
      confuse: 'for now（暂时——更简短）'
        + 'for the time being（暂时——更正式）。'
        + '两者都暗示"以后可能会变"。'
    },

    /* ========== 二、小品词动词收尾 ========== */
    'hear from': {
      ipa: '/hɪə(r) frɒm/',
      coll: ['hear from you soon', '收到某人的消息', '中性'],
      confuse: '⭐ 三个要背：'
        + 'hear from sb（收到某人消息）'
        + 'hear of sb/sth（听说过——只是听说，不是直接消息）'
        + 'hear sb/sth（听见某声音）。'
        + 'I haven\'t heard from him（没收到他消息）'
        + '≠ I haven\'t heard of him（没听说过他）。'
    },
    'hear of': {
      ipa: '/hɪə(r) əv/',
      coll: ['I\'ve heard of it before.', '听说（从他人处）', '中性'],
      confuse: '见 hear from 的三义对比。'
        + '⭐ hear of 强调"知道这回事"，'
        + 'hear from 强调"收到直接消息"。'
    },
    'step through': {
      ipa: '/step θruː/',
      coll: ['step through the routine', '演练；逐步演示', '职场/口语'],
      confuse: 'step through（逐步走过流程、演示）'
        + 'vs run through（快速过一遍）'
        + 'vs walk through（边走边讲）。'
        + '面试时 "Let me walk you through the process" 是高频句。'
    },
    'rule in': {
      ipa: '/ruːl ɪn/',
      coll: ['rule in a suspect', '认定为（成立）', '法律'],
      confuse: '⭐ 与 rule out 成对，必须分清：'
        + 'rule in（认定为成立/纳入）'
        + 'rule out（排除在外）。'
        + '⚠️ rule in 的出现频率远低于 rule out，'
        + '但法律与新闻语境中必须会用。'
    },
    'rule over': {
      ipa: '/ruːl ˈəʊvə(r)/',
      coll: ['rule over the country', '统治', '书面'],
      confuse: 'rule over（统治——书面）'
        + 'vs govern（治理——动词）'
        + 'vs rule（裁决——法律）。'
        + '日常口语几乎不用 rule over。'
    },
    'pay back': {
      ipa: '/peɪ bæk/',
      coll: ['pay back the loan', '还钱；回报', '中性'],
      confuse: 'pay back（还钱／回报恩情）'
        + 'vs pay off（还清／有回报）'
        + 'vs pay up（付清、提前还清）。'
        + 'pay back an insult = 报复。'
    },
    'pass by': {
      ipa: '/pɑːs baɪ/',
      coll: ['as time passed by', '路过；（时间）流逝', '中性'],
      confuse: '⭐ 两义：'
        + '① pass by（从旁经过）：I passed by your house. '
        + '② pass by（时间流逝）：as years passed by。'
        + '⭐⭐ 最常错用：pass by 绝不能表示"错过"！'
        + '"我错过了他的车" 是 miss him，不是 pass by him。'
    },
    'stand to': {
      ipa: '/stænd tuː/',
      coll: ['you stand to gain/lose', '有可能（获得或失去）', '书面'],
      confuse: '⭐ stand to do 是"有可能做（通常指有利或不利结果）"：'
        + 'You stand to lose money（你有可能亏钱）。'
        + '⭐ 绝大多数情况是负面后果：'
        + 'stand to gain / stand to lose。'
        + '不能与 stand in for（代替）混淆。'
    },
    'start off': {
      ipa: '/stɑːt ɒf/',
      coll: ['start off with a joke', '以…开始；先（做某事）', '口语'],
      confuse: 'start off with…（以…开头）'
        + 'start with…（同上）'
        + 'start over（从头再来）。'
        + '会议开场：Let\'s start off with questions。'
    },
    'start over': {
      ipa: '/stɑːt ˈəʊvə(r)/',
      coll: ['Let\'s start over.', '重新开始（重来）', '口语'],
      confuse: '⭐ "再来一遍"，通常指推翻之前的做法：'
        + 'We made a mistake—let\'s start over.'
        + 'vs start again（再做一次——不否定之前的）。'
    },
    'sets and reps': {
      ipa: '/sets ənd reps/',
      coll: ['three sets and reps', '组数与次数', '运动'],
      confuse: '⭐ 健身术语：'
        + 'a set（一组，连续做若干次）'
        + 'a rep（一次动作）。'
        + '3 sets of 10 reps = 做 3 组，每组 10 次。'
        + '口语中 sets / reps 常读字母缩写。'
    }
  };

  /* ============================================================
     对外接口
     ============================================================ */
  function get3(word) {
    var w = String(word || '').trim().toLowerCase();
    return idx3()[w] || null;
  }

  /* 这一批的 key 大多是 "I am writing to" 这类整句，大写 I 会让小写查表落空，
     所以额外建一张全小写索引。惰性构建，只建一次。*/
  var _idx3 = null;
  function idx3() {
    if (_idx3) return _idx3;
    _idx3 = {};
    for (var k in DEEP3) {
      if (Object.prototype.hasOwnProperty.call(DEEP3, k)) _idx3[k.toLowerCase()] = DEEP3[k];
    }
    return _idx3;
  }

  global.VocabDeep3 = {
    get: get3, all: function () { return DEEP3; },
    keys: function () { return Object.keys(DEEP3); },
    stats: function () {
      return { entries: Object.keys(DEEP3).length };
    }
  };

  /* ============================================================
     统一入口：把三批数据合成一个查询接口
     ------------------------------------------------------------
     lookup.js / view-vocab.js 只需认 VocabDeepAny 一个全局，
     后续再加第四批也只改这一处。
     ============================================================ */
  function getAny(word) {
    var d = get3(word);
    if (d) return d;
    if (global.VocabDeep2) { d = global.VocabDeep2.get(word); if (d) return d; }
    if (global.VocabDeep) { d = global.VocabDeep.get(word); if (d) return d; }
    return null;
  }

  function statsAny() {
    var seen = {};
    [DEEP3, global.VocabDeep2 && global.VocabDeep2.all(),
      global.VocabDeep && global.VocabDeep.all()].forEach(function (set) {
      if (!set) return;
      for (var k in set) {
        if (Object.prototype.hasOwnProperty.call(set, k)) seen[k.toLowerCase()] = 1;
      }
    });
    return { entries: Object.keys(seen).length, batches: 3 };
  }

  global.VocabDeepAny = { get: getAny, stats: statsAny };

  /* ---------------- 补进词库 ---------------- */
  function applyToPool(pool) {
    if (!pool || !pool.length) return 0;
    var n = 0;
    for (var i = 0; i < pool.length; i++) {
      var e = pool[i];
      var d = idx3()[String(e.w || '').trim().toLowerCase()];
      if (!d) continue;
      if (!e.ipa && d.ipa) { e.ipa = d.ipa; n++; }
      if (!e.coll && d.coll) e.coll = d.coll;
      if (!e.confuse && d.confuse) e.confuse = d.confuse;
    }
    return n;
  }

  function applyAll3() {
    return applyToPool(global.VOCAB_DATA && global.VOCAB_DATA.words)
      + applyToPool(global.GAOKAO_L5 && global.GAOKAO_L5.words)
      + applyToPool(global.GAOKAO_L6 && global.GAOKAO_L6.words)
      + applyToPool(global.GAOKAO_DATA && global.GAOKAO_DATA.words);
  }

  function boot3() {
    applyAll3();
    var S = global.Store;
    if (S && typeof S.ensureLevel === 'function' && !S.__vd3Patched) {
      S.__vd3Patched = true;
      var orig = S.ensureLevel;
      S.ensureLevel = function () {
        var p = orig.apply(this, arguments);
        if (p && typeof p.then === 'function') p.then(function () { applyAll3(); });
        return p;
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot3);
  } else {
    boot3();
  }
})(window);