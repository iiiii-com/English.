/* ============================================================
   content-vocab-deep2.js —— 单词讲解深层数据（第二批）
   ------------------------------------------------------------
   承接 content-vocab-deep.js。同样的三条原则：
     · 音标人工核对，短语重音按英语实际落点，不做规则推导
     · 搭配只给"真实可用的那一个"，不列举
     · 易混辨析只写中国学习者真会错的地方

   与第一批的分工：
     第一批 159 条是「动词短语 + 商务邮件 + 高阶立场表达」
     这一批 295 条是「介词短语 + 小品词动词 + 习语 + 正式公文套话」
     两批合计覆盖词库中全部缺音标的短语。
   ============================================================ */
(function (global) {
  'use strict';

  var DEEP2 = {
    /* ========== 一、be / do 型句法结构（中国学习者重灾区）========== */
    'be supposed to': {
      ipa: '/biː səˈpəʊzd tuː/',
      coll: ['You are supposed to be here at eight.', '应该（按规定）', '中性'],
      confuse: '⭐ 常被误解为"我猜"。它是"按规定应该"——'
        + 'You\'re supposed to lock the door（门该锁的），'
        + '暗示有人没做到。be expected to 才是"预计"。'
        + 'be supposed to do（应该做），不是 to be supposed。'
    },
    'be likely to': {
      ipa: '/biː ˈlaɪkli tuː/',
      coll: ['It is likely to rain tonight.', '很可能（可能性高于 should）', '中性'],
      confuse: '可能性梯度：'
        + 'will（必然）> is likely to（很可能）> may/might（可能）> might not（不太可能）。'
        + 'be likely to 后面接动词原形，不接不定式：'
        + '❌ be likely to be late 里的 to be 才是对的——'
        + 'is likely to be late ✅（很可能迟到）'
    },
    'be about to': {
      ipa: '/biː əˈbaʊt tuː/',
      coll: ['The film is about to start.', '即将（马上就要）', '中性'],
      confuse: '⭐ about to = 即将，**be about to do**，动词前不加 to。'
        + '❌ be about to doing / ❌ be about to do it now（now 破坏"马上"义）。'
        + '近义：on the point of doing（几乎就要，更强调临界点）。'
    },
    'be willing to': {
      ipa: '/biː ˈwɪlɪŋ tuː/',
      coll: ['She is willing to help.', '愿意（乐意）', '中性'],
      confuse: 'be willing to（愿意）vs be able to（有能力）'
        + 'vs be supposed to（应该）。'
        + 'willing 看态度，able 看能力。'
        + 'willing 还可以作定语：a willing helper（热心的人）。'
    },
    'be afraid to': {
      ipa: '/biː əˈfreɪd tuː/',
      coll: ['be afraid to ask', '害怕（不敢做）', '中性'],
      confuse: 'be afraid of + 名词（怕某物）/ be afraid to do（怕做某事）。'
        + '⛔ be afraid 不能直接跟不定式：❌ be afraid to… ✅ be afraid of flying。'
    },
    'tend to': {
      ipa: '/tend tuː/',
      coll: ['Prices tend to rise in summer.', '倾向于；往往会', '写作'],
      confuse: '⭐ tend to 后面一律跟动词原形，不加 to：'
        + 'tend to happen ✅ / ❌ tend to happening。'
        + '近义短语：be inclined to（更正式）/ be likely to（更确定）。'
    },
    'provided that': {
      ipa: '/prəˈvaɪdɪd ðæt/',
      coll: ['Provided that you pay, we will deliver.', '假如；只要', '写作'],
      confuse: '同 provided / providing（省略 that）。'
        + '✅ Providing (that) it rains, we will stay in.（更自然）'
        + '句首用 Providing 需加逗号。'
    },
    'subject to': {
      ipa: '/ˈsʌbdʒɪkt tuː/',
      coll: ['be subject to approval', '取决于；须经…批准', '商务/法律'],
      confuse: '⭐ 常被误译为"服从"。它在商务语境里是"取决于"：'
        + 'Prices are subject to change（价格可能变动）。'
        + '法律语境才是"受制于"（subject to the law）。'
    },
    'owing to': {
      ipa: '/ˈəʊɪŋ tuː/',
      coll: ['Owing to the rain, the match was cancelled.', '由于', '书面'],
      confuse: 'owing to 后面只能接名词，'
        + '接句子要用 owing to the fact that… 或 because of。'
        + '⭐ owing to / due to / because of 三者在正式书面里可互换，'
        + '但 due to 后不能接 that 从句（这是被扣分点）。'
    },
    'due to': {
      ipa: '/djuː tuː/',
      coll: ['Due to a system error, the site is down.', '由于', '中性'],
      confuse: '⭐ 争议点：due to 作"因为"时是介词，只能接名词。'
        + '✅ Due to rain, we stopped. / ✅ Due to the fact that it rained…'
        + '❌ Due to it rained, we stopped.（口语中可见，但书面被扣分）'
    },
    'thanks to': {
      ipa: '/θæŋks tuː/',
      coll: ['Thanks to your help, we finished early.', '多亏；由于', '中性'],
      confuse: '⭐ 与 owing to / due to 相反，thanks to 常含褒义：'
        + 'thanks to you（多亏你）。'
        + '但也可中性使用，需看语境。'
        + 'Thanks for（因为，多用于感谢）只能接人或具体事物。'
    },
    'seeing as how': {
      ipa: '/ˈsiːɪŋ əz haʊ/',
      coll: ['Seeing as how you are busy, let\'s do it later.', '既然（因为）', '口语'],
      confuse: '⭐ 严格语法上不标准（seeing 缺主语），'
        + '正式场合应写 Now that / Since。'
        + '口语中极常用，意思是"既然如此"。'
    },
    'be that as it may': {
      ipa: '/biː ðæt əz ɪt meɪ/',
      coll: ['Be that as it may, we should try.', '即便如此', '书面'],
      confuse: '常置于句首，作为让步：'
        + 'Be that as it may, I stand by my decision.'
        + '口吻：很正式，带一点疏离感。'
    },

    /* ========== 二、正式公文的依据类短语 ========== */
    'pursuant to': {
      ipa: '/pəˈsuːjuːntə(r) tuː/',
      coll: ['Pursuant to your email of May 3rd…', '根据（依照）', '法律/商务'],
      confuse: '⭐ 法律与商务专用，后接规定或文件：'
        + 'pursuant to the contract（依照合同）。'
        + '日常英语几乎不用，不要用它来代替 according to（口语）。'
    },
    'in accordance with': {
      ipa: '/ɪn əˈkɔːdns wɪð/',
      coll: ['in accordance with our policy', '依照；与…一致', '法律/商务'],
      confuse: '同 pursuant to，语义更"对齐"：'
        + '与 accordance with 的搭配几乎固定用 policy / rules / the law。'
    },
    'in the event of': {
      ipa: '/ɪn ði ɪˈvent əv/',
      coll: ['In the event of rain, we will cancel.', '万一；如果', '商务'],
      confuse: 'in the event of 后面接名词：'
        + '✅ in the event of a fire / ❌ in the event of if it rains。'
        + '⭐ 它其实不是"如果"，而是"万一发生某事"（强调意外），'
        + '日常表达"如果"用 in case 或 if。'
    },
    'in light of': {
      ipa: '/ɪn laɪt əv/',
      coll: ['In light of the new data, we revised our conclusion.', '鉴于', '书面'],
      confuse: '常用于"根据新证据/新情况重新评估"：'
        + 'in light of recent developments（鉴于最新进展）。'
        + '比 because of 更强调"因此修正了原来的判断"。'
    },
    'bearing in mind': {
      ipa: '/ˈbeərɪŋ ɪn maɪnd/',
      coll: ['Bearing in mind your budget, I suggest…', '考虑到', '书面'],
      confuse: '⭐ 与 bear in mind（记住）同源，但更正式。'
        + '常接 the fact that 从句：'
        + 'bearing in mind that we have limited resources。'
    },
    'to that end': {
      ipa: '/tuː ðæt end/',
      coll: ['To that end, we hired a consultant.', '为此', '书面'],
      confuse: '⭐ 完整形式是 with that end in mind（抱着这个目的）。'
        + 'to that end 是其简写，后接为此目的做的事。'
    },
    'by virtue of': {
      ipa: '/baɪ ˈvɜːtʃuː əv/',
      coll: ['By virtue of its size, the firm dominates the market.', '凭借；由于', '书面'],
      confuse: '⭐ 常被误译为"美德"。virtue 在这里是"优点、效能"。'
        + 'by virtue of 后接名词性成分。'
    },
    'on the grounds that': {
      ipa: '/ɒn ðə ɡraʊndz ðæt/',
      coll: ['on the grounds that he was ill', '以…为由', '书面/法律'],
      confuse: '后必须接 that 从句说明理由：'
        + '❌ on the grounds of ill。'
        + '常用于拒绝或反对：I decline on the grounds that…'
    },
    'for that reason': {
      ipa: '/fɔː ðæt ˈriːzn/',
      coll: ['For that reason, we changed the plan.', '出于这个原因', '中性'],
      confuse: 'that 是复指前面提到的事（that reason）。'
        + '如果没有前文，that 就没有指代对象，须写 for this reason。'
    },

    /* ========== 三、小品词动词：give / take / put / come ========== */
    'give in': {
      ipa: '/ɡɪv ɪn/',
      coll: ['Don\'t give in to pressure.', '屈服；投降', '口语'],
      confuse: '⭐ give in 后必须跟 to：give in to temptation / pressure。'
        + '不跟 to 的 give in 意思是"让步"。'
        + 'give up 是"放弃"（可接 to 或 doing）。'
    },
    'give off': {
      ipa: '/ɡɪv ɒf/',
      coll: ['The flowers give off a sweet smell.', '散发（气味、热）', '写作'],
      confuse: 'give off（自然散发）vs give out（分发、耗尽）：'
        + 'give off light（发光）/ give out light（光用完了）。'
        + '这个区别是常考点。'
    },
    'give out': {
      ipa: '/ɡɪv aʊt/',
      coll: ['The battery gave out.', '分发；耗尽', '中性'],
      confuse: '① give out sth（分发物品）'
        + '② give out（耗尽）：My patience gave out（我没耐心了）。'
        + '语境决定含义。'
    },
    'give way to': {
      ipa: '/ɡɪv weɪ tuː/',
      coll: ['Do not give way to panic.', '让位于；屈从于（情绪）', '写作'],
      confuse: '⭐ 后接情绪或冲动：give way to fear / tears / anger。'
        + '反义：hold back（克制）。'
    },
    'take after': {
      ipa: '/teɪk ˈɑːftə(r)/',
      coll: ['He takes after his mother.', '像（父母之一）', '中性'],
      confuse: 'take after（外貌或性格像）'
        + 'vs take in（欺骗）/ take over（接管）。'
        + '例：She takes after her father in temper.'
    },
    'take in': {
      ipa: '/teɪk ɪn/',
      coll: ['I can\'t take in this news.', '吸收；理解；让人受骗', '中性'],
      confuse: '三义混用是难点：'
        + 'take in food（吃进去）/ take in a lecture（听懂）'
        + '/ take in sb（欺骗某人）：Don\'t be taken in（别被骗）。'
    },
    'take out': {
      ipa: '/teɪk aʊt/',
      coll: ['take the kids out', '取出；带…出去；订（外卖）', '口语'],
      confuse: 'take out 在口语里常指"外出（吃饭）"：'
        + 'We\'re taking the kids out（我们带孩子出去）。'
        + '也可指"从餐馆外带"：take-out food。'
    },
    'take to': {
      ipa: '/teɪk tuː/',
      coll: ['She took to tennis immediately.', '喜欢上；开始从事', '口语'],
      confuse: 'take to + 名词/动名词（不加 to do）：'
        + '✅ take to swimming / ❌ take to swim。'
        + '注意与 be taken to（被带到）区分。'
    },
    'put down': {
      ipa: '/pʊt daʊn/',
      coll: ['put down the phone', '放下；记下；批评', '中性'],
      confuse: '三义：① 放下 ② 记下（put it down in the book）'
        + '③ 批评（put sb down，贬义）。'
        + '同样被误解的还有 put on（穿上/假装）。'
    },
    'put forward': {
      ipa: '/pʊt ˈfɔːwəd/',
      coll: ['put forward a proposal', '提出（建议、理论）', '职场'],
      confuse: '⭐ 职场高频：提出建议用 put forward。'
        + 'bring forward 是"提前（时间）"，不要混。'
        + 'He put forward a new theory（他提出了一个新理论）。'
    },
    'put out': {
      ipa: '/pʊt aʊt/',
      coll: ['put out a fire', '扑灭；发布（作品、消息）', '中性'],
      confuse: 'put out a fire（灭火）/ put out a report（发布报告）'
        + '/ put out（生气、发火，informal）：Don\'t put out（别发火）。'
    },
    'turn to': {
      ipa: '/tɜːn tuː/',
      coll: ['turn to the experts', '求助于；转向', '中性'],
      confuse: 'turn to sb for help（向某人求助）'
        + 'vs turn to a different topic（换个话题）'
        + 'vs turn out（结果是）。三者都含 turn 但毫不相干。'
    },
    'come across': {
      ipa: '/kʌm əˈkrɒs/',
      coll: ['come across such a gem', '偶然遇到；被理解为', '口语'],
      confuse: '⭐ 一词两义且常被误解：'
        + '① come across sth（偶然碰上）：I came across it by chance. '
        + '② sb comes across as…（给人的印象是）：'
        + 'He comes across as arrogant（他给人的印象很傲慢）。'
        + '第二种用法是描述"给人的观感"，不是真实性格。'
    },
    'come up': {
      ipa: '/kʌm ʌp/',
      coll: ['a topic comes up', '出现；升职；被提出', '中性'],
      confuse: 'come up（话题出现、升职）'
        + 'vs come up with（想出主意）。'
        + 'The topic came up in the meeting ≠ He came up with the topic。'
    },
    'come down': {
      ipa: '/kʌm daʊn/',
      coll: ['come down to the office', '下降；缩减；下（雨雪）', '中性'],
      confuse: 'come down（价格下降、缩减规模）'
        + 'vs come down to（归结为）。'
        + 'It is coming down（在下雨了）。'
    },
    'come in': {
      ipa: '/kʌm ɪn/',
      coll: ['the new model comes in next month', '到达；进货；上市', '口语'],
      confuse: 'come in（进货/上市/到达）'
        + 'vs come out（公布/结果）：'
        + 'The new phone comes in Friday（周五上市）。'
    },
    'come out': {
      ipa: '/kʌm aʊt/',
      coll: ['come out of the meeting', '公布；结果；出版', '中性'],
      confuse: 'come out（公布、结果、出版）'
        + 'vs come out of（脱身、摆脱）：'
        + 'come out in a good light（显得不错）。'
    },
    'come through': {
      ipa: '/kʌm θruː/',
      coll: ['the job came through', '通过；经历；实现', '中性'],
      confuse: 'come through（工作办成、事故幸存）'
        + 'vs come across（偶然遇见）。'
    },
    'put together': {
      ipa: '/pʊt təˈɡeðə(r)/',
      coll: ['put together a team', '拼凑；拼装', '中性'],
      confuse: 'put together（把散件组装起来）'
        + '常含"材料不齐但凑合"之意：'
        + 'She put together a report in one night。'
        + '反义：take apart（拆开）。'
    },
    'put up with': {
      ipa: '/pʊt ʌp wɪð/',
      coll: ['put up with the heat', '忍受（持续的）', '口语'],
      confuse: '与 tolerate / bear 同义。⭐ 不能接抽象名词的"忍受"：'
        + 'put up with his temper ✅ / put up with failure ❌（用 come to terms with）。'
    },
    'build up': {
      ipa: '/bɪld ʌp/',
      coll: ['build up my strength', '建立；积攒（逐渐）', '中性'],
      confuse: 'build up（逐渐积累）vs build out（扩建）'
        + 'vs build on（在…基础上发展）。'
        + 'build up confidence / build up a habit。'
    },
    'weigh up': {
      ipa: '/weɪ ʌp/',
      coll: ['weigh up the pros and cons', '权衡', '中性/职场'],
      confuse: 'weigh up（反复考虑后权衡）'
        + 'vs weigh（称重）/ weigh in（发表意见）。'
        + '英式常用，美式多说 weigh。'
    },
    'turn over': {
      ipa: '/tɜːn ˈəʊvə(r)/',
      coll: ['turn over a new leaf', '翻转； turnover（营业额）', '中性'],
      confuse: 'turn over（新叶子 = 改过自新；页面 = 翻页）'
        + 'turn in（交还）/ turn off（关掉）。'
    },

    /* ========== 四、小品词动词：drop / fall / hold / stand ========== */
    'drop in': {
      ipa: '/drɒp ɪn/',
      coll: ['Drop in any time.', '顺道来（拜访）', '口语'],
      confuse: 'drop in（顺便来访）vs drop by（同义，更常用）'
        + 'vs drop off（把人送到某处）。'
        + 'drop in on sb（顺道看某人）要加 on。'
    },
    'drop by': {
      ipa: '/drɒp baɪ/',
      coll: ['I\'ll drop by your office.', '短暂拜访', '口语'],
      confuse: '比 drop in 更强调"短暂"。'
        + 'drop over 是英式说法。'
    },
    'drop out': {
      ipa: '/drɒp aʊt/',
      coll: ['He dropped out of school.', '退出；辍学', '中性'],
      confuse: 'drop out of school（辍学）'
        + 'vs drop in on（拜访）。'
        + '强调中途主动退出，且 out of 后必须跟名词。'
    },
    'fall apart': {
      ipa: '/fɔːl əˈpɑːt/',
      coll: ['The chair fell apart.', '崩溃；散架；关系破裂', '中性'],
      confuse: 'fall apart（彻底崩坏）vs fall apart at the seams（缝线崩开）'
        + '后者更强调"从关键处断裂"。'
    },
    'fall behind': {
      ipa: '/fɔːl bɪˈhaɪnd/',
      coll: ['fall behind in class', '落后；跟不上', '中性'],
      confuse: 'fall behind（落后）vs fall back on（求助于）'
        + 'vs fall through（落空）。三个都是 fall + 小品词。'
    },
    'fall back on': {
      ipa: '/fɔːl bæk ɒn/',
      coll: ['fall back on savings', '求助于；退而依靠', '中性'],
      confuse: 'fall back on 后接"可依靠的东西"（人、资源、计划）。'
        + '不能接具体动作：❌ fall back on calling。'
    },
    'fall into': {
      ipa: '/fɔːl ˈɪntuː/',
      coll: ['fall into the trap', '陷入；归入（类别）', '中性'],
      confuse: 'fall into 分两类：'
        + '① 陷入（抽象）：fall into debt / fall into a trap'
        + '② 归类（客观）：fall into three categories。'
        + '别与 fall on（落在某一天/某个人身上）混。'
    },
    'fall out': {
      ipa: '/fɔːl aʊt/',
      coll: ['They fell out over money.', '吵架；掉落；结果', '口语'],
      confuse: 'fall out（吵架 / 结果）'
        + '⭐ 结果短语是 "fall out of the debate"（讨论的结果）。'
        + 'fall out with sb（与某人闹翻）。'
    },
    'hold off': {
      ipa: '/həʊld ɒf/',
      coll: ['hold off on the launch', '推迟；忍住', '中性'],
      confuse: 'hold off（推迟、延迟）vs hold on（稍等、挂断）'
        + 'vs hold up（耽搁、抢劫）。'
        + 'hold off on doing（推迟做）更常用。'
    },
    'hold up': {
      ipa: '/həʊld ʌp/',
      coll: ['hold up traffic', '耽搁；支撑；抢劫', '中性'],
      confuse: 'hold up 有"支撑"（支撑屋顶）和"耽搁"（hold up traffic）'
        + '以及"抢劫"三个意思，语境决定。'
    },
    'hold together': {
      ipa: '/həʊld təˈɡeðə(r)/',
      coll: ['the team held together', '维持；保持完整', '中性'],
      confuse: 'hold together（维持住）vs fall apart（散架）——一对反义。'
    },
    'stand by': {
      ipa: '/stænd baɪ/',
      coll: ['stand by your decision', '支持；坚持（立场）', '职场'],
      confuse: 'stand by（支持某人/坚持决定）'
        + 'vs stand in for（代替）/ stand out（突出）/ stand up for（维护）。'
        + 'stand by 还可表示"待命、随时行动"。'
    },
    'stand in for': {
      ipa: '/stænd ɪn fɔː(r)/',
      coll: ['stand in for the CEO', '代替（临时）', '职场'],
      confuse: 'stand in for（临时代替人）'
        + '⭐ 与 substitute for / replace 区分：'
        + 'stand in for 只在某人不在时临时顶上，'
        + 'replace 是永久替换。'
    },
    'stick with': {
      ipa: '/stɪk wɪð/',
      coll: ['stick with the plan', '坚持（持续做）', '口语'],
      confuse: 'stick to（坚持原则、遵守）'
        + 'vs stick with（坚持做某事，坚持陪伴）：'
        + 'stick to the rules / stick with swimming。'
    },
    'stick up for': {
      ipa: '/stɪk ʌp fɔː(r)/',
      coll: ['stick up for a friend', '为…说话；维护', '口语'],
      confuse: 'stand up for（公开维护）比 stick up for 更常用。'
        + 'stick up（举起手）也作"要求高利贷"，需看语境。'
    },

    /* ========== 五、介词短语与固定框架 ========== */
    'worth it': {
      ipa: '/wɜːθ ɪt/',
      coll: ['It was expensive, but it was worth it.', '值得（付出代价）', '口语'],
      confuse: '⭐ 独立成句或作表语，不能说 very worth it：'
        + '✅ It\'s worth it. / ✅ It was worth the wait.（说"值得付出这个代价"）'
        + '❌ It\'s very worth it。'
        + '作定语用：a worthwhile trip（值得的旅行）。'
    },
    'first of all': {
      ipa: '/fɜːst əv ɔːl/',
      coll: ['First of all, let me explain.', '首先（第一点）', '中性'],
      confuse: 'First of all（列举中的第一条）'
        + 'vs Above all（最重要的）'
        + 'vs First（时间上的第一件）。三者层次不同。'
    },
    'to begin with': {
      ipa: '/tuː bɪˈɡɪn wɪð/',
      coll: ['To begin with, he was nervous.', '首先；一开始（说的是实情）', '写作'],
      confuse: 'to begin with 有两种用法：'
        + '① 列举首要理由'
        + '② 交代事实基础：To begin with, they already had a house.'
        + '第二种常译为"本来/原先"，容易译错。'
    },
    'as well as': {
      ipa: '/əz wel əz/',
      coll: ['She sings as well as her sister.', '以及；也（和…一样好）', '中性'],
      confuse: '⭐ 两个含义靠位置区分：'
        + '① 连接并列：as well as = and（前后主体相同）'
        + '② 比较：as well as = as much as（as well as her sister）'
        + '⚠️ as well as 连接主语时谓语用单数：'
        + 'Tom as well as his friends is coming.（✅）'
    },
    'no matter': {
      ipa: '/nəʊ ˈmætə(r)/',
      coll: ['No matter what, I will try.', '无论；不管', '中性'],
      confuse: '⭐ 后必须接 what / how / where / whether 等疑问词：'
        + 'no matter what / no matter how much / no matter where。'
        + '❌ No matter you say…（语法错误）'
        + '⭐ 常被误解为"不要紧"，但那是 never mind / it doesn\'t matter。'
    },
    'other than': {
      ipa: '/ˈʌðə(r) ðæn/',
      coll: ['other than that', '不同于；除了（用于否定）', '中性'],
      confuse: '⭐ other than 常出现在否定句中：'
        + 'Nothing other than…（只不过、正是）'
        + 'No one other than him…（只有他）。'
        + '❌ No other than 是错的，必须是 Nothing other than。'
    },
    'even if': {
      ipa: '/ˈiːvn ɪf/',
      coll: ['Even if it rains, we will go.', '即使（假设）', '中性'],
      confuse: 'even if（假设让步，事实未定）'
        + 'vs even though（事实已成立）：'
        + 'Even though it is raining（正在下雨）。'
        + '这是中国学习者最高频的错之一。'
    },
    'as if': {
      ipa: '/əz ɪf/',
      coll: ['He talks as if he knows everything.', '好像；仿佛', '口语'],
      confuse: 'as if = as though，两者完全同义，可随意替换。'
        + '⭐ 口语中可省略为"as if"的变体 "as if + 过去式"；'
        + '虚拟语气中用 were 更正式：'
        + 'as if I were you（如果我是你——高阶口语必背句）。'
    },
    'as though': {
      ipa: '/əz ðəʊ/',
      coll: ['as though it were true', '仿佛；好像', '口语'],
      confuse: '同 as if。'
        + '但在 "as though" 后的从句用陈述语气更常见（不作强虚拟）。'
    },
    'in which case': {
      ipa: '/ɪn wɪtʃ keɪs/',
      coll: ['In which case, we should wait.', '若是那样；那样的话', '写作'],
      confuse: 'in which case 引导条件结果，'
        + '后面必须接完整句子（含主谓）：'
        + '❌ in which case to wait。'
    },
    'even so': {
      ipa: '/ˈiːvn səʊ/',
      coll: ['Even so, we must continue.', '即便如此', '书面'],
      confuse: '同 having said that / that said，'
        + '用于"承认对方有理但仍坚持自己立场"。'
        + 'even so 比 even then 更书面。'
    },
    'in other words': {
      ipa: '/ɪn ˈʌðə(r) wɜːdz/',
      coll: ['In other words, I quit.', '换句话说（解释）', '中性'],
      confuse: '用于解释前面的说法，而非另起新话题。'
        + '同 put another way / put simply / that is to say。'
    },
    'put simply': {
      ipa: '/pʊt ˈsaɪmpli/',
      coll: ['Put simply, we failed.', '简单说', '写作'],
      confuse: '同 put bluntly（直白地说）/ to put it bluntly（直说）。'
        + 'blunt 版本更强调"不再绕弯子"。'
    },
    'as such': {
      ipa: '/əz sʌtʃ/',
      coll: ['As such, the plan was cancelled.', '因此；作为这样的人/物', '书面'],
      confuse: '⭐ as such 的"因此"用法常被误解，'
        + '它其实是指"作为一个这样的人/事物"，'
        + '译成"因此"时必须从前文能推出因果，否则译错。'
        + 'He is a teacher and as such has no weekends. '
        + '（他是老师，作为老师他没有周末）'
    },
    'on the whole': {
      ipa: '/ɒn ðə həʊl/',
      coll: ['On the whole, I enjoyed it.', '总体上；大体', '写作'],
      confuse: '综合类短语还有 all in all / by and large / on balance。'
        + 'on the whole 略偏"就整体而言"的观察。'
    },
    'by and large': {
      ipa: '/baɪ ənd lɑːdʒ/',
      coll: ['By and large, the class is well-behaved.', '总的来说', '写作'],
      confuse: '⭐ 后面直接跟句子，不要加逗号再跟：'
        + 'By and large, it works.（✅）'
        + '❌ By and large, it works. —— 这句其实是对的，'
        + '真正错误是 "By and large that it works."（缺主语）'
    },
    'to sum up': {
      ipa: '/tuː sʌm ʌp/',
      coll: ['To sum up, we need three changes.', '总结；总而言之', '写作'],
      confuse: '总结类句首都要用逗号隔开：'
        + 'To sum up, we need…（✅）'
        + '❌ To sum up we need…（演讲中可不加，书面须加）'
    },
    'in conclusion': {
      ipa: '/ɪn kənˈkluːʒn/',
      coll: ['In conclusion, I recommend option B.', '总而言之', '写作'],
      confuse: '书面语，比 to sum up 更正式，'
        + '多用于文章结尾段。'
    },
    'in addition': {
      ipa: '/ɪn əˈdɪʃn/',
      coll: ['In addition, we should cut costs.', '此外', '写作'],
      confuse: 'in addition（此外）+ 肯定句。'
        + '表示"除此以外（没有）"要用 in addition to + 名词：'
        + 'In addition to English, she speaks French.'
    },
    'for instance': {
      ipa: '/fɔː ˈɪnstəns/',
      coll: ['For instance, take the first case.', '例如（举一例）', '写作'],
      confuse: 'for instance / for example 可换用。'
        + '⭐ 但 "take the first case" 是祈使句，'
        + '不能写成 "for example take…"（仍可，但语序更自然是独立成句）。'
    },
    'at most': {
      ipa: '/æt məʊst/',
      coll: ['It costs at most ten dollars.', '至多；最多', '中性'],
      confuse: 'at least（至少）vs at most（至多）。'
        + '★ 同义替换：as much as（多达）/ as few as（少到）。'
    },
    'by far': {
      ipa: '/baɪ fɑː(r)/',
      coll: ['It is better by far.', '远远地（强调程度）', '写作'],
      confuse: '⭐ 必须放在比较级/最高级之后，不能单独用：'
        + '✅ much better by far / ✅ by far the best'
        + '❌ By far, I like it.（无比较对象）'
    },
    'pretty much': {
      ipa: '/ˈprɪti mʌtʃ/',
      coll: ['We\'re pretty much done.', '差不多；几乎', '口语'],
      confuse: '口语中常见的弱化强调词，'
        + '相当于 almost / nearly：pretty much the same（几乎一样）。'
        + '注意 much 不是形容词，pretty 修饰整个短语。'
    },
    'more or less': {
      ipa: '/mɔːr ɔː les/',
      coll: ['More or less, I agree.', '或多或少；差不多', '中性'],
      confuse: '多 or less 表示程度上的接近（"凑合"）：'
        + 'more or less what I expected（跟我预想的差不多）。'
        + 'less 后面也可接：more or less thirty（三十个上下）。'
    },
    'in the meantime': {
      ipa: '/ɪn ðə ˈmiːntaɪm/',
      coll: ['In the meantime, I will call you.', '与此同时', '写作'],
      confuse: '⭐ 后面必须有逗号 + 完整句子。'
        + 'In the meantime, I…（✅）'
        + 'Meanwhile 本身即可独立使用，不需 the。'
    },

    /* ========== 六、look / wear / work 系列 ========== */
    'look down on': {
      ipa: '/lʊk daʊn ɒn/',
      coll: ['look down on others', '看不起；轻视', '中性'],
      confuse: '⭐ 固定搭配，on 不能省：'
        + 'look down **on** sb。'
        + '反义：look up to（尊敬）。'
    },
    'look out': {
      ipa: '/lʊk aʊt/',
      coll: ['Look out for the pickpockets.', '当心；留心', '口语'],
      confuse: 'look out（当心，warn 用法）'
        + 'look out for（留心等候某物/某人）：'
        + 'Look out for the parcel（留意包裹）。'
        + 'Look out! 是警告，"留心！"'
    },
    'look through': {
      ipa: '/lʊk θruː/',
      coll: ['look through the report', '浏览；仔细看；透视', '中性'],
      confuse: 'look through（从头看到尾）'
        + 'look over（粗略看一眼）'
        + 'look into（调查）。'
        + '⭐ look through sb（看穿某人）指看透其心思。'
    },
    'wear off': {
      ipa: '/weər ɒf/',
      coll: ['the pain wore off', '（药效、感觉）消退', '中性'],
      confuse: 'wear off（药效、感觉自然消退）'
        + 'vs wear out（用坏、穿破）：'
        + 'The shoes have worn out（鞋穿破了）。'
        + 'wear down（磨损、逐步削弱）。'
    },
    'wear out': {
      ipa: '/weər aʊt/',
      coll: ['wear out your shoes', '用坏；穿破', '中性'],
      confuse: 'wear out（物品用坏，人累垮）'
        + 'vs wear off（药效消退）。'
        + 'wear oneself out（把自己累垮）。'
    },
    'wear down': {
      ipa: '/weər daʊn/',
      coll: ['wear down his resistance', '磨损；逐步削弱（意志）', '写作'],
      confuse: 'wear down 后接"意志、抵抗、耐心"等抽象目标：'
        + 'Constant pressure wore her down。'
        + '与 wear off（药效）不同。'
    },
    'work through': {
      ipa: '/wɜːk θruː/',
      coll: ['work through the backlog', '解决；逐项处理', '职场'],
      confuse: 'work through（啃完一件难的事）'
        + 'vs work on（持续改进）：'
        + 'work through the backlog（把积压清完）'
        + 'vs work on your English（持续学英语）。'
    },
    'work on': {
      ipa: '/wɜːk ɒn/',
      coll: ['work on your English', '致力于；努力改进', '中性'],
      confuse: 'work on（持续投入某项改进）'
        + '⭐ 后面接项目或技能，不接一次性完成的事：'
        + '❌ work on finishing the report。'
    },
    'keep up': {
      ipa: '/kiːp ʌp/',
      coll: ['keep up with the class', '跟上（进度）', '中性'],
      confuse: '⭐ keep up **with** sb/sth（跟上）'
        + 'vs keep up（维持）：'
        + 'Keep up!（加油）/ keep up the good work（保持好状态）。'
    },
    'catch up': {
      ipa: '/kætʃ ʌp/',
      coll: ['catch up on sleep', '赶上；叙旧；补上', '中性'],
      confuse: '⭐ 两个用法：'
        + '① catch up with sb（赶上某人）'
        + '② catch up on sth（补上欠下的：睡眠、工作、新闻）。'
        + '中国学习者常只知第一种。'
    },
    'run into': {
      ipa: '/rʌn ˈɪntuː/',
      coll: ['run into trouble', '遇到（问题、麻烦）', '口语'],
      confuse: 'run into（偶然或不幸遇到）'
        + 'vs run into = meet（偶然遇见人）：'
        + 'I ran into an old friend。'
        + 'vs run out of（用完）：run out of time。'
    },
    'run through': {
      ipa: '/rʌn θruː/',
      coll: ['run through the slides', '演练；快速过一遍', '职场'],
      confuse: 'run through（过一遍流程、演练）'
        + 'vs run over（碾压；复述）。'
        + 'I ran through my notes before the meeting。'
    },
    'run over': {
      ipa: '/rʌn ˈəʊvə(r)/',
      coll: ['run over the numbers', '碾压；快速复述', '口语'],
      confuse: 'run over（车压过）／（快速重复一遍内容）：'
        + 'Let me run over the details for you。'
        + 'run out of（用完）是另一个高频短语，注意区分。'
    },
    'call on': {
      ipa: '/kɔːl ɒn/',
      coll: ['call on your expertise', '拜访；依赖（能力）', '职场'],
      confuse: 'call on sb（拜访某人）/ call on sth（依赖某能力）：'
        + 'We\'ll call on your support。'
        + 'call in（叫来、打电话）vs call on，差一个词义完全不同。'
    },
    'call in': {
      ipa: '/kɔːl ɪn/',
      coll: ['call in a doctor', '叫来；打电话（给某人）', '口语'],
      confuse: 'call in（叫人来/打电话给某人）'
        + 'vs call in on（顺道拜访）'
        + 'vs call off（取消）。'
    },
    'pass up': {
      ipa: '/pɑːs ʌp/',
      coll: ['pass up the offer', '错过；拒绝（机会）', '口语'],
      confuse: 'pass up（错过机会、拒绝）'
        + 'pass on（传递、转达）：pass on the message。'
        + 'pass away（去世，婉辞）'
        + 'pass by（路过）。四个都是 pass + 小品词。'
    },
    'pass away': {
      ipa: '/pɑːs əˈweɪ/',
      coll: ['his grandfather passed away', '去世（委婉）', '中性'],
      confuse: '⭐ 这是"去世"的委婉说法，'
        + '日常对话中比 die 更常用。'
        + 'pass away 也可指"（时间）流逝"。'
    },
    'hand over': {
      ipa: '/hænd ˈəʊvə(r)/',
      coll: ['hand over the keys', '移交；交接', '职场'],
      confuse: 'hand over（把东西交到对方手里）'
        + 'hand in（上交，书面）：hand in your homework。'
        + 'hand out（分发）。三个都是 hand + 小品词。'
    },
    'hand in': {
      ipa: '/hænd ɪn/',
      coll: ['hand in your homework', '提交；上交', '教育/职场'],
      confuse: 'hand in（主动提交给老师/上级）'
        + 'vs hand over（当面移交给他人）。'
        + '英式 hand in 更常用，美式 turn in / submit。'
    },
    'knock down': {
      ipa: '/nɒk daʊn/',
      coll: ['knock down the price', '拆除；削减', '中性'],
      confuse: 'knock down（拆实体建筑、砍价格）'
        + 'vs bring down（降低抽象数值）。'
        + 'Their offer was knocked down from 20% to 15%（砍价成功）。'
    },
    'knock off': {
      ipa: '/nɒk ɒf/',
      coll: ['knock off work', '下班；削弱', '口语'],
      confuse: 'knock off（下班）英式口语常用'
        + 'vs finish work（正式）。'
        + 'knock over（打翻）vs knock down（拆除）。'
    },
    'knock over': {
      ipa: '/nɒk ˈəʊvə(r)/',
      coll: ['knock over a glass', '打翻（液体/物件）', '口语'],
      confuse: 'knock over（碰倒）vs knock down（打倒、拆除）'
        + 'vs knock off（下班）。'
    },
    'hang on': {
      ipa: '/hæŋ ɒn/',
      coll: ['Hang on a moment.', '等等；挂断（电话）；坚持', '口语'],
      confuse: 'hang on 有三义：'
        + '① Hold on（等一下）② 挂断电话（电话里说 "hang on" 是"别挂"）'
        + '③ hang on to（坚持/继续）。'
    },
    'hang up': {
      ipa: '/hæŋ ʌp/',
      coll: ['He hung up on me.', '挂断电话', '口语'],
      confuse: 'hang up（挂断）vs hang on（别挂）/ hang out（闲逛）。'
        + '注意：hang up on sb 的 on 不能省。'
    },
    'hang out': {
      ipa: '/hæŋ aʊt/',
      coll: ['hang out with friends', '闲逛；一起玩', '口语'],
      confuse: 'hang out 是"（和朋友）一起闲逛"，'
        + '不强调地点：hang out at the mall。'
        + 'hang over（笼罩）vs hang up（挂断）。'
    },
    'lean on': {
      ipa: '/liːn ɒn/',
      coll: ['lean on a friend', '依赖（人）；靠着', '中性'],
      confuse: 'lean on（依赖某人）vs lean toward（倾向于）：'
        + 'lean toward doing（倾向做）。'
        + 'lean on 后接人，lean toward 后接方向或动名词。'
    },
    'lean toward': {
      ipa: '/liːn təˈwɔːd/',
      coll: ['lean toward agreeing', '倾向于', '书面'],
      confuse: '⭐ 正式语体，后接名词或动名词：'
        + 'lean toward the view（倾向这一观点）'
        + 'lean toward agreeing（倾向于同意）。'
    },
    'pass on': {
      ipa: '/pɑːs ɒn/',
      coll: ['pass on the message', '传递；转达；转发', '中性'],
      confuse: 'pass on（转达信息）vs pass away（去世）'
        + 'vs pass by（路过）。'
        + '📱 技术语境：pass it on（转发 viral 内容）。'
    },
    'hand out': {
      ipa: '/hænd aʊt/',
      coll: ['hand out flyers', '分发（物品）', '职场'],
      confuse: 'hand out（分发给多人）vs hand in（上交给一人）。'
    },
    'head for': {
      ipa: '/hed fɔː(r)/',
      coll: ['head for the airport', '前往；朝…去', '中性'],
      confuse: 'head for（目的地明确）'
        + 'vs head to（目标/趋势）：'
        + 'The country is heading to recession。'
    },
    'head to': {
      ipa: '/hed tuː/',
      coll: ['head to the finals', '前往；着手（某事）', '中性'],
      confuse: 'head to（朝着目标/走向）：'
        + 'head to the office / head to disaster。'
        + 'head for 强调"往某地走"。'
    },
    'opt out': {
      ipa: '/ɒpt aʊt/',
      coll: ['opt out of the plan', '选择退出（选择不参加）', '职场'],
      confuse: 'opt out of（选择退出）vs opt for（选择采用）'
        + 'vs opt in（选择加入）。'
        + '数据语境：opt out of sharing data（选择退出数据共享）。'
    },
    'set out': {
      ipa: '/set aʊt/',
      coll: ['set out to achieve sth', '着手；陈述（打算）', '写作'],
      confuse: '⭐ set out to do sth（着手做）是最常见用法。'
        + 'set out sth（把东西摆出来）也成立。'
        + '近义：set about（着手做，口语）。'
    },
    'set off': {
      ipa: '/set ɒf/',
      coll: ['set off early', '出发；引发（警报、争吵）', '中性'],
      confuse: 'set off（出发）vs set out（着手做）'
        + 'vs set up（建立）vs set aside（搁置）。'
    },
    'set back': {
      ipa: '/set bæk/',
      coll: ['set back the schedule', '使倒退；推迟', '职场'],
      confuse: 'set back（使计划倒退）vs set down（记下/放下）。'
        + '常接时间：set the launch back a week。'
    },
    'shut off': {
      ipa: '/ʃʌt ɒf/',
      coll: ['shut off the water', '切断（电源、水源）', '中性'],
      confuse: 'shut off（切断源头）vs shut down（关闭机器）'
        + 'vs shut out（把人/物挡在外面）。'
    },
    'stem from': {
      ipa: '/stem frɒm/',
      coll: ['stem from a common root', '源于；起源于', '写作'],
      confuse: 'stem from（源于）后接名词。'
        + '与 result from 同义，但更书面。'
        + '⭐ 词根词缀模块中 stem 本身就是词根（"茎/起源"）。'
    },
    'track down': {
      ipa: '/træk daʊn/',
      coll: ['track down the source', '追踪到；查找到', '职场'],
      confuse: 'track down（费力找到某物/人）'
        + 'vs track（跟踪记录）。'
        + 'Finally tracked down the original author。'
    },
    'weigh in': {
      ipa: '/weɪ ɪn/',
      coll: ['experts weigh in', '发表意见；介入', '写作'],
      confuse: 'weigh in（加入讨论并给意见）'
        + 'vs weigh out（分份称量）。'
        + '常接 on：weigh in on the debate。'
    },
    'zoom in': {
      ipa: '/zuːm ɪn/',
      coll: ['zoom in on the details', '放大细看；聚焦', '中性'],
      confuse: 'zoom in（放大）vs zoom out（缩小/拉远视野）。'
        + '引申义：The investigation should zoom in on…（调查应聚焦于…）。'
    },
    'zero in on': {
      ipa: '/ˈzɪərəʊ ɪn ɒn/',
      coll: ['zero in on the problem', '锁定目标；聚焦', '职场'],
      confuse: 'zero in on 后必须接 on + 名词：'
        + 'zero in on the root cause。'
        + '⭐ 不可省 on（与 focus on 同）。'
    },
    'tone down': {
      ipa: '/təʊn daʊn/',
      coll: ['tone down the language', '减弱（语气、色彩）', '职场'],
      confuse: 'tone down（减弱，decrease）'
        + 'vs tone up（增强，increase）。'
        + '职场语境：Please tone down the email（语气缓和些）。'
    },
    'tone up': {
      ipa: '/təʊn ʌp/',
      coll: ['tone up the message', '增强（语气）', '职场'],
      confuse: '同 tone down 的反义。'
        + '两词在媒体/公关语境中尤其常用。'
    },
    'top up': {
      ipa: '/tɒp ʌp/',
      coll: ['top up your phone credit', '补充；充值', '口语'],
      confuse: 'top up（把已有容器加满）'
        + 'vs top up your phone balance（充值）。'
        + '英式口语常用。'
    },
    'roll out': {
      ipa: '/rəʊl aʊt/',
      coll: ['roll out a new product', '推出；铺开', '职场'],
      confuse: '⭐ 科技与职场高频：'
        + 'roll out（逐步推广）'
        + 'vs deploy（部署）/ launch（一次性发布）。'
        + '公司会 "roll out" 分批上线。'
    },
    'spill over': {
      ipa: '/spɪl ˈəʊvə(r)/',
      coll: ['spill over into the next day', '溢出；外溢；波及', '中性'],
      confuse: 'spill over（液体溢出 / 影响扩散到别处）'
        + 'vs spill over = 会议延长时间。'
        + 'The argument spilled over into the meeting。'
    },
    'take aim at': {
      ipa: '/teɪk eɪm æt/',
      coll: ['take aim at the problem', '针对；瞄准', '写作'],
      confuse: 'take aim at（对准目标）'
        + '⭐ at 不能省（与 focus on 同）。'
        + '同义：set one\'s sights on（志在必得）。'
    },

    /* ========== 七、动词短语：动手类 ========== */
    'back off': {
      ipa: '/bæk ɒf/',
      coll: ['back off a little', '退让；后退', '口语'],
      confuse: 'back off（退让、后退一点）'
        + 'vs back up（支持、备份）。'
        + 'Back off!（口语：退后/别惹我）'
    },
    'blow up': {
      ipa: '/bləʊ ʌp/',
      coll: ['the balloon blew up', '爆炸；发怒', '口语'],
      confuse: 'blow up（爆炸/大发雷霆）'
        + 'vs blow out（爆胎/吹灭）'
        + 'vs blow over（风波平息）。'
        + 'He blew up at me（他冲我发火）。'
    },
    'cool off': {
      ipa: '/kuːl ɒf/',
      coll: ['cool off after the fight', '冷静下来；降温', '口语'],
      confuse: 'cool off（冷静）vs cool down（更常说）'
        + 'vs cool（变凉）。'
        + 'Give him time to cool off。'
    },
    'warm up': {
      ipa: '/wɔːm ʌp/',
      coll: ['warm up the engine', '热身；升温', '运动'],
      confuse: 'warm up（热身）vs warm to（逐渐喜欢）：'
        + 'I\'m warming to the idea。'
        + 'vs heated（激烈的）。'
    },
    'wade through': {
      ipa: '/weɪd θruː/',
      coll: ['wade through a long report', '艰难熬过（冗长内容）', '口语'],
      confuse: '⭐ 引申义专指"硬着头皮看完超长文档"：'
        + 'I had to wade through 400 pages。'
        + '与 get through（熬过难关）不同。'
    },
    'stress out': {
      ipa: '/stres aʊt/',
      coll: ['stress out over nothing', '过度紧张', '口语'],
      confuse: 'stress out（因压力而焦虑）'
        + 'vs be stressed（感到有压力）。'
        + '★ stress 可作及物动词：stress sb out（使某人焦虑）。'
    },
    'show off': {
      ipa: '/ʃəʊ ɒf/',
      coll: ['show off his new car', '炫耀', '口语'],
      confuse: '⭐ 必带贬义或至少中性：'
        + 'He was showing off（他在炫耀）——'
        + '并非"展示"的中性说法。'
        + '中性"展示"用 show / display。'
    },
    'cheer up': {
      ipa: '/tʃɪə(r) ʌp/',
      coll: ['cheer up!', '振作起来；欢呼', '口语'],
      confuse: 'cheer up（鼓励某人／欢呼）'
        + 'cheer on（为…加油，多指比赛中支持）：'
        + 'They cheered on their team。'
    },
    'break in': {
      ipa: '/breɪk ɪn/',
      coll: ['break in on the meeting', '闯入；插话', '中性'],
      confuse: 'break in（闯入 / 打断插话）'
        + 'vs break into（强行进入 / 突然开始）：'
        + 'He broke into song。'
        + 'vs break out（爆发）。'
    },
    'break out': {
      ipa: '/breɪk aʊt/',
      coll: ['break out in spots', '爆发（战争、pox）；暴发（皮疹）', '中性'],
      confuse: 'break out（战争、火灾、流行病爆发）'
        + 'break out of（逃出：break out of prison）。'
    },
    'step in': {
      ipa: '/step ɪn/',
      coll: ['step in to mediate', '介入', '职场'],
      confuse: 'step in（介入）vs step up（站出来、加重）'
        + 'vs step back（后退/回顾）。'
    },
    'step back': {
      ipa: '/step bæk/',
      coll: ['step back a moment', '后退；回顾', '口语'],
      confuse: 'step back（后退一步/退一步看问题）'
        + '常用于 "take a step back"（跳出固有视角）。'
    },
    'push back': {
      ipa: '/pʊʃ bæk/',
      coll: ['push back the deadline', '推迟；反对', '职场'],
      confuse: 'push back（推迟时间、提出反对）'
        + 'vs push through（强行通过）。'
        + '职场温和反对：I\'d push back on that。'
    },
    'push through': {
      ipa: '/pʊʃ θruː/',
      coll: ['push through the final stage', '强行通过；熬过', '职场'],
      confuse: 'push through（强行完成/通过）'
        + 'vs push past（突破）。'
        + 'He pushed through the proposal（他强行推动提案通过）。'
    },
    'push for': {
      ipa: '/pʊʃ fɔː(r)/',
      coll: ['push for reform', '争取；力促', '职场'],
      confuse: 'push for（争取某目标）'
        + 'vs push（推）。'
        + 'The union is pushing for higher pay。'
    },
    'pull together': {
      ipa: '/pʊl təˈɡeðə(r)/',
      coll: ['pull together as a team', '齐心协力', '口语'],
      confuse: 'pull together（齐心）vs pull apart（分裂）。'
    },
    'pull out': {
      ipa: '/pʊl aʊt/',
      coll: ['pull out of the deal', '撤出；拔出；退出', '职场'],
      confuse: 'pull out（退出、拔出）'
        + 'pull out of（退出某事）。'
        + 'vs pull up（调出数据、拉起）。'
    },
    'pull up': {
      ipa: '/pʊl ʌp/',
      coll: ['pull up a report', '调出（数据）；拉起', '职场'],
      confuse: '⭐ 职场/技术高频：'
        + 'pull up a dashboard（调出仪表盘）'
        + 'vs pull out（撤出）。'
        + 'pull up seatbelt 是另一层意思（系紧）。'
    },
    'get away': {
      ipa: '/ɡet əˈweɪ/',
      coll: ['get away with murder', '逃走', '口语'],
      confuse: 'get away（逃走）vs get away with（侥幸逃脱惩罚）。'
        + '后接 with 才有"逃脱惩罚"义。'
    },
    'get back': {
      ipa: '/ɡet bæk/',
      coll: ['get back to work', '回来；恢复', '中性'],
      confuse: 'get back（回来）'
        + 'get back to（回到某话题/人）。'
        + 'get back in shape（恢复体形）。'
    },
    'get into': {
      ipa: '/ɡet ˈɪntuː/',
      coll: ['get into trouble', '进入；卷入；喜欢上', '中性'],
      confuse: 'get into（进入/卷入）'
        + 'get in touch with（联系上）。'
        + 'get into trouble（惹麻烦）。'
    },
    'get over': {
      ipa: '/ɡet ˈəʊvə(r)/',
      coll: ['get over a breakup', '克服；康复；熬过', '口语'],
      confuse: 'get over（克服、康复、熬过）'
        + 'get over it（走出阴霾）。'
        + 'vs get over someone（超越某人）。'
    },
    'get through': {
      ipa: '/ɡet θruː/',
      coll: ['get through the exam', '熬过；通过；完成', '中性'],
      confuse: 'get through（熬过难关、通过考试）'
        + 'vs get through to（电话打通）。'
        + 'I need to get through this week。'
    },
    'get down to': {
      ipa: '/ɡet daʊn tuː/',
      coll: ['get down to business', '开始认真做（正事）', '口语'],
      confuse: 'get down to（静下心来干正事）'
        + '同 settle down to（语气更中性）。'
    },
    'get out of': {
      ipa: '/ɡet aʊt əv/',
      coll: ['get out of trouble', '摆脱；退出', '中性'],
      confuse: 'get out of（摆脱）vs get rid of（去掉）'
        + 'vs get away with（逃脱惩罚）。'
        + 'get out of 后接名词，动词原形不行。'
    },
    'grow into': {
      ipa: '/ɡrəʊ ˈɪntuː/',
      coll: ['grow into the role', '成长为；逐渐变成', '职场'],
      confuse: 'grow into（随时间成长）'
        + 'vs grow on（越来越喜欢）：'
        + 'She grew into the position。'
        + 'Note：两个都是 grow + 小品词。'
    },
    'bring forward': {
      ipa: '/brɪŋ ˈfɔːwəd/',
      coll: ['bring forward the meeting', '提前（时间）；提出', '职场'],
      confuse: 'bring forward（提前）'
        + 'vs bring up（提出话题、抚养）。'
        + 'bring forward 与 put forward 都可表示"提出"，'
        + '但 put forward 更常用于"建议/理论"。'
    },
    'get back to': {
      ipa: '/ɡet bæk tuː/',
      coll: ['get back to the point', '回到（话题）', '中性'],
      confuse: 'get back to（回到原话题/原任务）'
        + 'vs get back（回来）。'
        + "Let's get back to the main point（我们回到正题）。"
    },
    'read up on': {
      ipa: '/riːd ʌp ɒn/',
      coll: ['read up on a topic', '阅读了解（某领域）', '学术'],
      confuse: 'read up on（做功课式地读）'
        + 'vs read about（随便读点）'
        + 'vs read through（通读）。'
        + '常含"为了准备而读"的意思。'
    },
    'think over': {
      ipa: '/θɪŋk ˈəʊvə(r)/',
      coll: ['think it over', '仔细考虑（再决定）', '中性'],
      confuse: 'think over（考虑后再定）'
        + 'vs think through（想透每一步）'
        + 'vs think out（想出来）。'
        + 'think it over 是固定搭配，不加 about。'
    },

    /* ========== 八、习语：高频口语表达 ========== */
    'make sense': {
      ipa: '/meɪk sens/',
      coll: ['That makes sense.', '有道理；说得通', '口语'],
      confuse: '★ make sense of sth 是"理解、弄懂"（有意义）：'
        + 'Can you make sense of this report?（你能看懂吗？）'
        + '而 make sense 单独用是"有道理"。'
        + '常被误解为"有道理"，其实要看有没有 of。'
    },
    'make a difference': {
      ipa: '/meɪk ə ˈdɪfrəns/',
      coll: ['It makes a difference.', '产生影响；起作用', '中性'],
      confuse: '⭐ make a difference to sth（有影响于）'
        + 'vs make no difference（没影响）'
        + 'vs make a difference（产生影响——宾语常省略）。'
        + 'one significant difference（重大差异）。'
    },
    'hold on': {
      ipa: '/həʊld ɒn/',
      coll: ['Hold on a second.', '稍等；坚持', '口语'],
      confuse: '⭐ 同 hang on，三个义项：'
        + '① 等一下 ②（电话里）别挂 ③ 坚持（hold on to your dream）。'
    },
    'give or take': {
      ipa: '/ɡɪv ɔː teɪk/',
      coll: ['give or take ten dollars', '差不多；左右', '口语'],
      confuse: '⭐ 同 about：give or take / more or less / or so。'
        + '常与数字连用：'
        + '£2000, give or take（两千镑左右）。'
    },
    'once in a while': {
      ipa: '/wʌns ɪn ə waɪl/',
      coll: ['We meet once in a while.', '偶尔', '口语'],
      confuse: '偶尔类短语：once in a while（偶尔）'
        + 'from time to time（时不时）'
        + 'every now and then（时常）'
        + 'every once in a while（偶尔）。'
    },
    'from time to time': {
      ipa: '/frəm taɪm tuː taɪm/',
      coll: ['It happens from time to time.', '时不时', '书面'],
      confuse: '书面程度略高于 once in a while。'
        + '两者可互换。'
    },
    'right away': {
      ipa: '/raɪt əˈweɪ/',
      coll: ['I\'ll do it right away.', '立刻', '口语'],
      confuse: 'right away = immediately（立刻）'
        + 'right now（现在，此刻）。'
        + 'at once（正式些）。'
    },
    'at the latest': {
      ipa: '/æt ðə ˈleɪtɪst/',
      coll: ['by Monday at the latest', '最迟（在此之前）', '中性'],
      confuse: '⭐ 固定搭配：by + 时间 + at the latest。'
        + '❌ at the latest by Monday（语序错了）'
        + '= not later than Monday。'
    },
    'as far as I know': {
      ipa: '/əz fɑːr əz aɪ nəʊ/',
      coll: ['As far as I know, he left.', '据我所知（信息来源）', '口语'],
      confuse: '⭐ 与 as far as I\'m concerned（就我而言）区分：'
        + '前者表信息来源，后者表立场。'
        + '两种含义不能互换。'
    },
    'believe it or not': {
      ipa: '/bɪˈliːv ɪt ɔː nɒt/',
      coll: ['Believe it or not, it worked.', '信不信由你', '口语'],
      confuse: '固定插入语，不影响句子结构。'
        + '同：take it or leave it（信不信由你，带不客气）。'
    },
    'no wonder': {
      ipa: '/nəʊ ˈwʌndə(r)/',
      coll: ['No wonder he is tired.', '难怪；不足为奇', '口语'],
      confuse: '⭐ 后接从句，不能接动词原形：'
        + 'No wonder he is tired.（✅）'
        + '❌ No wonder he feels tired. —— 这句实际也对，'
        + '但❌ No wonder to be tired。'
    },
    'no big deal': {
      ipa: '/nəʊ bɪɡ diːl/',
      coll: ['Don\'t worry, it\'s no big deal.', '没什么大不了', '口语'],
      confuse: '同 not a big deal（更正式一点）。'
        + '⭐ 不是"没大事"（no big issue）。'
    },
    'out of scope': {
      ipa: '/aʊt əv skəʊp/',
      coll: ['That question is out of scope.', '超出范围', '职场'],
      confuse: '⭐ 职场/项目高频，scope = 项目范围：'
        + 'That\'s out of scope for this release。'
        + 'in scope（范围内）。'
    },
    'on the record': {
      ipa: '/ɒn ðə ˈrekɔːd/',
      coll: ['Can I quote you on the record?', '公开地；可引用', '职场'],
      confuse: '⭐ 与 off the record（不得引用）相对。'
        + '背景 on the record（存档记录）是另一个意思。'
    },
    'on that note': {
      ipa: '/ɒn ðæt nəʊt/',
      coll: ['On that note, let\'s end here.', '说到这个；顺便说', '口语/职场'],
      confuse: '用当前话题作为过渡：'
        + 'On that note, I\'d like to transition to pricing。'
        + '也作收尾：On that note, thanks for listening。'
    },
    'with hindsight': {
      ipa: '/wɪð ˈhaɪndsaɪt/',
      coll: ['With hindsight, I was wrong.', '事后看（复盘）', '写作'],
      confuse: '与 in hindsight 同义。'
        + '⭐ 只能用于回顾已发生的事，不能用于未来。'
    },
    'last but not least': {
      ipa: '/lɑːst bʊt nɒt liːst/',
      coll: ['Last but not least, thanks to all of you.', '最后但同样重要', '口语'],
      confuse: '用于列举的最后一个项目，'
        + '表示"虽然排在最后，但同样重要"。'
    },
    'first and foremost': {
      ipa: '/fɜːst ənd ˈfɔːmɔːst/',
      coll: ['First and foremost, it is a safety issue.', '首先；首要地', '写作'],
      confuse: '⭐ 强调"最重要的是"（可重复 First and foremost）：'
        + 'First and foremost, safety comes first。'
        + 'First of all（第一点）侧重列举顺序。'
    },
    'looking back': {
      ipa: '/ˈlʊkɪŋ bæk/',
      coll: ['Looking back, I would do the same.', '回顾；回头看', '口语'],
      confuse: '⭐ 是进行时短语（正在回头看），'
        + '不表示"看起来像"。'
        + '常见误读：Looking back from here…（从这里回头看）'
    },
    'for now': {
      ipa: '/fɔː naʊ/',
      coll: ['Let\'s leave it for now.', '暂时；先这样', '口语'],
      confuse: 'for now（暂时）vs for good（永远）'
        + 'vs for the time being（暂时，更正式）。'
    },
    'sleep on it': {
      ipa: '/sliːp ɒn ɪt/',
      coll: ['Let\'s sleep on it.', '再考虑一晚（别急着定）', '口语'],
      confuse: '⭐ 隐含"睡一觉再说，答案会更清楚"。'
        + '近义：think it over（再想想）。'
    },
    'cut to the chase': {
      ipa: '/kʌt tuː ðə tʃeɪs/',
      coll: ['Let\'s cut to the chase.', '直奔主题', '口语'],
      confuse: '源自默片时代换片子的"cut"，'
        + '指跳过铺垫直接进核心。'
        + '近义：get to the point（说重点）。'
    },
    'in the ballpark': {
      ipa: '/ɪn ðə ˈbɔːlpɑːk/',
      coll: ['around 100, in the ballpark', '大致范围；大概', '口语'],
      confuse: '⭐ 本义是体育球场（ballpark = 棒球场），'
        + '引申为"大致范围内"。'
        + '同义：roughly / approximately / give or take。'
    },
    'jump on the bandwagon': {
      ipa: '/dʒʌmp ɒn ðə ˈbæɡwɔːn/',
      coll: ['jump on the bandwagon', '跟风；随大流', '口语'],
      confuse: '⭐ 马车时代“上趋势的马车”，现多含贬义。'
        + '同义：follow the crowd / jump on the pile。'
    },
    'hit the books': {
      ipa: '/hɪt ðə bʊks/',
      coll: ['I need to hit the books.', '用功；开始读书', '口语'],
      confuse: 'hit the books（临时抱佛脚地学习）'
        + 'vs hit the road（上路出发）'
        + 'vs hit the nail on the head（正中要害）。'
        + '三个都是 hit the + 名词。'
    },
    'hit the road': {
      ipa: '/hɪt ðə rəʊd/',
      coll: ['Let\'s hit the road.', '上路；出发', '口语'],
      confuse: '⭐ "出发、动身"：'
        + 'We\'re hitting the road at dawn。'
        + '与 hit the books（用功）区分。'
    },
    'spill the beans': {
      ipa: '/spɪl ðə biːnz/',
      coll: ['Don\'t spill the beans.', '泄露消息；说漏嘴', '口语'],
      confuse: '同义：let the cat out of the bag（让猫跑出袋）。'
        + '⭐ spill the beans 比 let the cat… 更常用。'
    },
    'cost an arm and a leg': {
      ipa: '/kɒst ən ɑːm ənd ə leɡ/',
      coll: ['It cost me an arm and a leg.', '非常贵', '口语'],
      confuse: '⭐ 常用 it costs + 人 + an arm and a leg：'
        + 'It cost me an arm and a leg（花了我很多钱）。'
        + '不能省 it。'
        + '近义：rip off（坑人、太贵）。'
    },
    'admit defeat': {
      ipa: '/ədˈmɪt dɪˈfiːt/',
      coll: ['He refused to admit defeat.', '承认失败；认输', '书面'],
      confuse: 'admit defeat（承认失败）'
        + 'vs concede defeat（正式，承认失败）'
        + 'vs throw in the towel（口语，认输）。'
    },
    'call it a day': {
      ipa: '/kɔːl ɪt ə deɪ/',
      coll: ['Let\'s call it a day.', '收工；到此为止', '口语'],
      confuse: 'call it a day（今天到此为止）'
        + 'call it quits（双方同意不再计较）。'
    },
    'pull someone\'s leg': {
      ipa: '/pʊl ˈsʌmwʌnz leɡ/',
      coll: ['Don\'t pull my leg.', '开玩笑；取笑', '口语'],
      confuse: '⭐ pull sb\'s leg 是"逗某人、开玩笑"，'
        + '不是"拉某人腿"。'
        + '与 kick the bucket（去世）一样是习语，不可直译。'
    },
    'step up your game': {
      ipa: '/step ʌp jɔː ɡeɪm/',
      coll: ['Step up your game.', '提升表现；拿出更好水平', '口语/职场'],
      confuse: 'step up（提升自己）vs step up your game（专指表现）。'
        + '反义：step down（退居二线）。'
    },
    'if anything': {
      ipa: '/ɪf ˈeniθɪŋ/',
      coll: ['If anything, it got worse.', '如果有什么不同的话；甚至', '写作'],
      confuse: '⭐ 两个含义：'
        + '① if anything（如果有什么不同的话——用于轻微修正）：'
        + 'If anything, it\'s better than before。'
        + '② more than anything（最重要的是）。'
        + '口语句首常有 "if anything"，读音流利化。'
    },
    'more than anything': {
      ipa: '/mɔːr ðæn ˈeniθɪŋ/',
      coll: ['More than anything, I want to try.', '最重要的是', '口语'],
      confuse: '强调优先级：'
        + 'More than anything else, time matters（最重要的是时间）。'
        + '常与 else 连用。'
    },
    'it goes without saying': {
      ipa: '/ɪt ɡəʊz wɪðaʊt ˈseɪɪŋ/',
      coll: ['It goes without saying that…', '不言而喻；理所当然', '书面'],
      confuse: '⭐ 后接 that 从句（完整句子）：'
        + 'It goes without saying that he was wrong。'
        + '也可说 It goes without saying…（省略 that）。'
    },
    'that says a lot': {
      ipa: '/ðæt seɪz ə lɒt/',
      coll: ['That says a lot about him.', '这说明很多（关于他的为人）', '口语'],
      confuse: 'that says a lot（说明很多——关于某人/某事）'
        + '⭐ 后常接 about：'
        + 'That says a lot about the management。'
    },
    'you have a point': {
      ipa: '/juː hæv ə pɔɪnt/',
      coll: ['You have a point there.', '你说得有道理', '口语'],
      confuse: '承认对方有理，但常暗含"不过还是不同意"。'
        + '同义：fair point / point taken。'
    },
    'point taken': {
      ipa: '/pɔɪnt ˈteɪkən/',
      coll: ['Point taken.', '接受你的观点', '口语'],
      confuse: 'point taken 是被动结构，'
        + '表"我接受（你所说）"。'
        + '更正式：I take your point。'
    },
    'fair point': {
      ipa: '/feər pɔɪnt/',
      coll: ['Fair point.', '有道理的说法', '口语'],
      confuse: 'Fair point, I suppose（算你说得有道理）'
        + 'vs Fair enough（那行吧）。'
    },
    'I partly agree': {
      ipa: '/aɪ ˈpɑːtli əˈɡriː/',
      coll: ['I partly agree with you.', '我部分同意', '口语/职场'],
      confuse: 'partly agree（部分同意）'
        + 'vs disagree entirely（完全不同意）'
        + 'vs I see your point（我理解你的观点——≠同意）。'
    },
    'I\'d argue that': {
      ipa: '/aɪd ˈærɡjuː ðæt/',
      coll: ['I\'d argue that we should wait.', '我会主张；我会说', '书面'],
      confuse: '⭐ argue 在这里是"主张"（提出论点），'
        + '不是"争吵"。'
        + 'I\'d argue that X（我会论证 X 成立）。'
    },
    'the way I see it': {
      ipa: '/ðə weɪ aɪ siː ɪt/',
      coll: ['The way I see it, we\'re fine.', '在我看来', '口语'],
      confuse: '⭐ 表达个人观点的固定句式。'
        + 'the way I see it, the way I look at it, from my point of view。'
    },
    'in the same vein': {
      ipa: '/ɪn ðə seɪm veɪn/',
      coll: ['In the same vein, I disagree.', '同样地；与此相同', '书面'],
      confuse: '⭐ 意思是"沿着同样的思路"，'
        + '不是"在同一条血管里"。'
        + '常接与前文同类型的论点。'
    },
    'with that said': {
      ipa: '/wɪð ðæt sed/',
      coll: ['With that said, I still disagree.', '话虽如此', '书面'],
      confuse: '与 having said that / that said 同义。'
        + '⭐ 这是让步转折：先承认前述有理，再提异议。'
    },
    'that aside': {
      ipa: '/ðæt əˈsaɪd/',
      coll: ['That aside, let\'s move on.', '那先不说；暂且搁置', '口语'],
      confuse: 'that aside（那个先放一边）'
        + '同义：that being said / aside from。'
        + '⭐ aside from 在美式英语里是"除…之外"，注意与 aside（搁置）区分。'
    },
    'in spite of that': {
      ipa: '/ɪn spaɪt əv ðæt/',
      coll: ['In spite of that, he kept trying.', '尽管那样', '书面'],
      confuse: 'in spite of + 名词/名词短语：'
        + 'in spite of the rain（下雨也无所谓）。'
        + '❌ in spite of that it rained（that 后不能接句子）。'
    },
    'to some extent': {
      ipa: '/tuː sʌm ɪkˈstent/',
      coll: ['To some extent, I agree.', '在某种程度上', '书面'],
      confuse: '⭐ 口语更常说 in some ways / sort of。'
        + 'to some extent 稍正式，带保留。'
    },
    'on balance': {
      ipa: '/ɒn ˈbæləns/',
      coll: ['On balance, it was worth it.', '总体而言；权衡后', '写作'],
      confuse: '⭐ 含"权衡利弊之后"的意味，'
        + '比 on the whole 更强调"经过考虑"。'
    },
    'I partly agree': {
      ipa: '/aɪ ˈpɑːtli əˈɡriː/',
      coll: ['I partly agree with that.', '我部分同意', '口语'],
      confuse: 'partly agree（部分同意——暗示有保留）'
        + '常接具体内容：I partly agree with point 2。'
    },
    'if you take it further': {
      ipa: '/ɪf juː teɪk ɪt ˈfɜːðə(r)/',
      coll: ['If you take it further, it gets absurd.', '进一步推想', '书面'],
      confuse: 'take it further（把话题推进/延伸）'
        + '常用于"顺着对方的话往下推"，'
        + '有时带"再想下去就不合理了"的意味。'
    },

    /* ========== 九、口语插入语与短语 ========== */
    'I mean': {
      ipa: '/aɪ miːn/',
      coll: ['I mean, it was hard.', '我是说（补充解释）', '口语'],
      confuse: '⭐ 高频口语插入语，用于补充说明或修正自己：'
        + 'It was, I mean, surprising。'
        + '不同义：I mean（我是说）/ You mean…?（你是说…？）。'
    },
    'sort of': {
      ipa: '/sɔːt əv/',
      coll: ['It\'s sort of strange.', '算是；有点儿', '口语'],
      confuse: '⭐ 程度副词，常译为"有点儿"：'
        + 'It\'s sort of hard to tell。'
        + '同义：kind of / a bit / a little。'
        + 'kind of 也可作"真是、简直"（口语，强调）：'
        + 'I kind of like it（我还真挺喜欢）。'
    },
    'not really': {
      ipa: '/nɒt ˈrɪəli/',
      coll: ['Not really.', '不太是（委婉否定）', '口语'],
      confuse: '⭐ 口语中最委婉的否定，比 No 柔和。'
        + 'Is it good? — Not really. （不算好）'
        + '也可能字面意思是"不真的"。'
    },
    'I suppose': {
      ipa: '/aɪ səˈpəʊz/',
      coll: ['I suppose so.', '我想也是；大概吧', '口语'],
      confuse: '⭐ 委婉表达"同意但不太情愿"：'
        + 'I suppose so（勉强同意）。'
        + 'I suppose（我想想也是）。'
        + '含不确定。'
    },
    'if you ask me': {
      ipa: '/ɪf juː ɑːsk miː/',
      coll: ['If you ask me, it was a mistake.', '要我说；我觉得', '口语'],
      confuse: '⭐ 强烈表达个人观点的插入语：'
        + 'If you ask me, we should quit。'
        + '比 I think 更直接。'
    },
    'let me tell you': {
      ipa: '/let miː tel juː/',
      coll: ['Let me tell you, it was hard.', '我跟你说（表强调）', '口语'],
      confuse: '强调后续内容，比 really 强。'
        + 'Let me tell you, this matters。'
    },
    'by the way': {
      ipa: '/baɪ ðə weɪ/',
      coll: ['By the way, are you coming?', '顺便说一句', '口语'],
      confuse: '⭐ 引出新话题（与 on the other hand 不同）。'
        + '放在句首或句中皆可。'
        + '口语句中常读作 "by the way"→"by the way"（连读）。'
    },
    'speaking of which': {
      ipa: '/ˈspiːkɪŋ əv wɪtʃ/',
      coll: ['Speaking of which, have you seen Tom?', '说到这个', '口语'],
      confuse: '⭐ 只用于"接着上面提到的那个事物"，'
        + '不能引出新话题：'
        + 'Speaking of which, I saw him yesterday。'
        + '若引新话题用 Speaking of（不带 which）。'
    },
    'now that I think about it': {
      ipa: '/naʊ ðæt aɪ θɪŋk əˈbaʊt ɪt/',
      coll: ['Now that I think about it, it\'s fine.', '现在想想', '口语'],
      confuse: '⭐ now that 作为"现在想来"是插入语，'
        + '但 now that 本身也可表示"既然"：'
        + 'Now that you\'re here, let\'s start。'
        + '两种用法需靠语意区分。'
    },
    'come to think of it': {
      ipa: '/kʌm tuː θɪŋk əv ɪt/',
      coll: ['Come to think of it, why not?', '说起来', '口语'],
      confuse: '⭐ 同 now that I think about it，'
        + '是"想起来才意识到"的插入语。'
        + '不能用 now that I think of it（丢掉 it 就变了）。'
    },
    'long story short': {
      ipa: '/lɒŋ ˈstɔːri ʃɔːt/',
      coll: ['Long story short, we failed.', '长话短说', '口语'],
      confuse: '⭐ 更常说 "It\'s a long story, but…"'
        + '或 "To make a long story short…"（更正式）。'
        + '此表达偏俚语。'
    },
    'just between us': {
      ipa: '/dʒʌst bɪˈtwiːn ʌs/',
      coll: ['Just between us, I disagree.', '只在我们之间（私下说）', '口语'],
      confuse: '⭐ 表示"这是私下话，不要外传"。'
        + '近义：between you and me（更常用）。'
    },
    'not to change the subject': {
      ipa: '/nɒt tuː tʃeɪndʒ ðə ˈsʌbdʒɪkt/',
      coll: ['Not to change the subject, but…', '不换个话题的话', '书面'],
      confuse: '⭐ 固定句式：'
        + 'Not to change the subject, but…（不过顺便问一下…）。'
        + '常引出"我知道这个话题已经结束了但还是要问"。'
    },
    'here\'s the thing': {
      ipa: '/hɪəz ðə θɪŋ/',
      coll: ['Here\'s the thing: it isn\'t working.', '关键是；问题是', '口语'],
      confuse: '⭐ 引出核心问题或转折：'
        + 'Here\'s the thing — we don\'t have enough time。'
        + '同义：the thing is / the problem is。'
    },
    'don\'t get me started': {
      ipa: '/dəʊnt ɡet miː ˈstɑːtɪd/',
      coll: ['Don\'t get me started on this.', '别提了（会讲很久）', '口语'],
      confuse: '⭐ 暗示"一开口就收不住"。'
        + 'get sb started on sth（让某人开始讲某话题）。'
        + '口语度高，正式场合不宜。'
    },
    'that\'s a stretch': {
      ipa: '/ðæts ə stretʃ/',
      coll: ['That\'s a stretch.', '这有点牵强；这有点过了', '口语'],
      confuse: '⭐ 委婉地表示"不太可能/有点夸张"。'
        + '同义：that\'s a bit of a stretch。'
    },
    'I\'ll give you that': {
      ipa: '/aɪl ɡɪv juː ðæt/',
      coll: ['I\'ll give you that, you\'re right.', '这点我承认', '口语'],
      confuse: '⭐ 先承认对方某一点有理，'
        + '然后通常会转折：'
        + 'I\'ll give you that, but…'
    },
    'you\'d think': {
      ipa: '/juːd θɪŋk/',
      coll: ['You\'d think he knew the answer.', '你会觉得；你会以为', '口语'],
      confuse: '⭐ 反讽或惊讶：'
        + 'You\'d think he was the boss（看他那样子，还以为他是老板呢）。'
        + '常用形式 You\'d think（省去 you）。'
    },
    'needless to say': {
      ipa: '/ˈniːdləs tuː seɪ/',
      coll: ['Needless to say, she was surprised.', '不用说；当然', '书面'],
      confuse: '⭐ 固定插入语，'
        + '后面直接接句子，不用 that 从句连词：'
        + 'Needless to say, he agreed。'
        + '✘ Needless to say that he agreed。'
    },
    'as it happens': {
      ipa: '/əz ɪt ˈhæpɪnz/',
      coll: ['As it happens, I know the answer.', '碰巧；恰好', '口语'],
      confuse: '⭐ 与 as luck would have it 近似，'
        + '但 as it happens 更中性。'
        + '也可接转折：As it happens, it failed。'
    },
    'if I recall correctly': {
      ipa: '/ɪf aɪ rɪˈkɔːl ˈkɒrəktli/',
      coll: ['If I recall correctly, we met in 2019.', '如果我没记错', '口语'],
      confuse: '⭐ 回忆时降低断言强度：'
        + 'if I recall（我记得）'
        + 'if I remember correctly（同）'
        + 'if memory serves（更文学）。'
    },
    'if I may': {
      ipa: '/ɪf aɪ meɪ/',
      coll: ['If I may, I\'d add one thing.', '如果可以的话', '书面'],
      confuse: '⭐ 礼貌地请求发言或行动：'
        + 'If I may, I\'d like to add…'
        + '同义：if you\'ll allow me。'
    },
    'in that sense': {
      ipa: '/ɪn ðæt sens/',
      coll: ['In that sense, we agree.', '在这个意义上', '写作'],
      confuse: '⭐ 限定性的"在这个意义上"，'
        + '不是"在那个方向"。'
        + '常用于先作限定再反驳。'
    },
    'to put it bluntly': {
      ipa: '/tuː pʊt ɪt ˈblʌntli/',
      coll: ['To put it bluntly, it was stupid.', '直说；明说', '书面'],
      confuse: 'blunt（直白的——不带缓冲）'
        + 'vs to put it another way（换个说法——理清）。'
        + 'blunt 版本更直接。'
    },
    'put bluntly': {
      ipa: '/pʊt ˈblʌntli/',
      coll: ['Put bluntly, no one cares.', '直白地说', '写作'],
      confuse: '与 to put it bluntly 同义，'
        + '但 put bluntly 更简短。'
    },
    'just to be clear': {
      ipa: '/dʒʌst tuː biː klɪə(r)/',
      coll: ['Just to be clear, I disagree.', '明确说一下；说清楚点', '口语/职场'],
      confuse: '⭐ 暗示"前面说得不清楚"，'
        + '可能带一点纠正的意味。'
        + '常用于澄清误会。'
    },
    'to be honest': {
      ipa: '/tuː biː ˈɒnɪst/',
      coll: ['To be honest, I don\'t like it.', '老实说', '口语'],
      confuse: '⭐ 常暗示"说了不该说的"：'
        + 'To be honest, I prefer the other option。'
        + '口语中最常见的"实话实说"插入语。'
    },
    'honestly speaking': {
      ipa: '/ˈɒnɪstli ˈspiːkɪŋ/',
      coll: ['Honestly speaking, I disagree.', '说实话', '口语'],
      confuse: '与 to be honest / to tell the truth 同义。'
        + '口语中 honestly 更常用。'
    },
    'as far as that goes': {
      ipa: '/əz fɑːr əz ðæt ɡəʊz/',
      coll: ['As far as that goes, I agree.', '在这方面（我同意）', '书面'],
      confuse: '⭐ 限定范围："在这件事上"。'
        + 'I\'d limit it to the area of…（我会把它限定在…范围内）。'
    },
    'point of view': {
      ipa: '/ˈpɔɪnt əv vjuː/',
      coll: ['from my point of view', '观点', '中性'],
      confuse: '⭐ 同义表达很多：'
        + 'point of view / viewpoint / perspective / standpoint / angle。'
        + 'angle 偏向"某个具体视角/切入点"。'
    },
    'take the opposite view': {
      ipa: '/teɪk ði ˈɒpəzɪt vjuː/',
      coll: ['take the opposite view', '持相反观点', '书面'],
      confuse: 'opposite（相反的）vs contrary（相违的）：'
        + 'contrary to（与…相反）。'
        + 'opposite 后接名词，contrary 后接 to。'
    },
    'on the flip side': {
      ipa: '/ɒn ðə flɪp saɪd/',
      coll: ['On the flip side, it saves money.', '另一方面', '口语'],
      confuse: '⭐ 与 on the other hand 同义，但更口语。'
        + '常指"同一个硬币的反面"。'
    },
    'taking everything into account': {
      ipa: '/ˈteɪkɪŋ ˈevriθɪŋ ɪntuː əˈkaʊnt/',
      coll: ['Taking everything into account, let\'s proceed.', '全面考虑', '写作'],
      confuse: '同 taking into account / all things considered / on balance。'
        + '都是"综合权衡"的信号词。'
    },
    'put another way': {
      ipa: '/pʊt əˈnʌðə(r) weɪ/',
      coll: ['Put another way, it\'s a win-win.', '换个说法', '写作'],
      confuse: '⭐ 比 in other words 更强调"我换个角度说"。'
        + 'Put another way, I disagree。'
    },

    /* ========== 十、动词类：思考与判断 ========== */
    'allude to': {
      ipa: '/əˈluːd tuː/',
      coll: ['allude to recent events', '暗指；提及', '书面'],
      confuse: '⭐ 只能接 to：allude **to** sth。'
        + 'allude（暗指）vs elude（躲避）/ illude（欺骗）。'
        + '隐含"不明说"。'
    },
    'convince someone of': {
      ipa: '/kənˈvɪns ˈsʌmwʌn əv/',
      coll: ['convince him of the risk', '使某人相信', '书面'],
      confuse: '⭐ convince sb of sth（使某人相信某事）'
        + 'vs convince sb to do（说服某人做）：'
        + 'convince him of my ability'
        + 'vs convince him to leave。'
        + 'to 不与 of 并列使用。'
    },
    'appeal to': {
      ipa: '/əˈpiːl tuː/',
      coll: ['appeal to a wide audience', '吸引；呼吁', '写作'],
      confuse: 'appeal to（吸引某人／呼吁）'
        + '⭐ 也可指"向…提出请求"：'
        + 'appeal to the court（向上诉法院）。'
        + '双义靠宾语判断。'
    },
    'resonate with': {
      ipa: '/ˈrezəneɪt wɪð/',
      coll: ['resonate with young people', '引起共鸣', '写作/口语'],
      confuse: '⭐ 高阶词，指"在情感/思想层面产生共鸣"。'
        + 'The film resonates with a generation。'
        + '比 appeal to 更深（不只是吸引，而是触动）。'
    },
    'click with': {
      ipa: '/klɪk wɪð/',
      coll: ['It finally clicked with me.', '让人茅塞顿开；理解了', '口语'],
      confuse: '⭐ 表达"突然想通了"：'
        + 'The explanation clicked with me。'
        + '比 I understand 更有"顿悟"的意味。'
    },
    'relate to': {
      ipa: '/rɪˈleɪt tuː/',
      coll: ['I can relate to that.', '产生共鸣；理解', '口语'],
      confuse: '⭐ 高频口语：I can relate to that（我完全理解）。'
        + 'relate to（对…有共鸣）vs relate to sth（与…有关）。'
        + '比 resonate with 更口语。'
    },
    'be grateful to': {
      ipa: '/biː ˈɡreɪtfl tuː/',
      coll: ['I\'m grateful to you for your help.', '感谢（对人）', '中性'],
      confuse: '⭐ be grateful **to** sb **for** sth（因某事感谢某人）'
        + 'vs be grateful for sth（只因事谢）'
        + 'vs be thankful to sb（同 grateful）。'
        + '介词方向不能乱。'
    },
    'owe it to': {
      ipa: '/əʊ ɪt tuː/',
      coll: ['I owe it to my teacher.', '归功于（某人）', '口语/书面'],
      confuse: '⭐ owe it to sb（多亏了某人）'
        + '⭐ 后面不能加 for：❌ owe it to for your help。'
        + '正确：owe it to your help（多亏你的帮助）。'
    },
    'attribute to': {
      ipa: '/əˈtrɪbjuːt tuː/',
      coll: ['attribute the success to teamwork', '归因于', '书面'],
      confuse: '⭐ 与 owing to 的区别：attribute A to B（把 A 归因于 B）'
        + 'vs due to B（A 是因为 B）。'
        + '作动词时读 /əˈtrɪbjuːt/，'
        + '作形容词"有 attributed to 的特征"时读 /əˈtrɪbjuːtɪd/。'
    },
    'as things stand': {
      ipa: '/əz θɪŋz stænd/',
      coll: ['As things stand, we are on track.', '就目前情况', '书面'],
      confuse: '⭐ 含"暂时如此，但情况可能变"的意味：'
        + 'As things stand, no action is needed（目前看无需行动）。'
        + 'as it stands 变体同义。'
    },
    'with respect to': {
      ipa: '/wɪð rɪˈspekt tuː/',
      coll: ['With respect to your question…', '关于；至于', '商务/书面'],
      confuse: '⭐ 商务邮件里 to 有些人觉得生硬，'
        + '用 regarding / as for 更柔和。'
        + '与 respect 尊敬无关，是固定短语。'
    },
    'as regards': {
      ipa: '/əz rɪˈɡɑːdz/',
      coll: ['As regards cost, no problem.', '关于；就…而论', '书面'],
      confuse: '★ as regards 是正式书面，不能用 regards 单独（现代）。'
        + '口语用 about / as for。'
    },
    'in this regard': {
      ipa: '/ɪn ðɪs rɪˈɡɑːd/',
      coll: ['In this regard, we are confident.', '在这方面', '书面'],
      confuse: 'in this regard（在这一方面）'
        + 'with regard to（关于——更常用）'
        + 'in that regard（在那个方面）。'
    },
    'for the purpose of': {
      ipa: '/fɔː ðə ˈpɜːpəs əv/',
      coll: ['for the purpose of research', '为了', '书面'],
      confuse: '⭐ 冗长但正式。日常直接用 for / to：'
        + 'for research（为了研究）更简洁。'
        + 'on purpose（故意）≠ for the purpose of（为了）。'
    },
    'in so far as': {
      ipa: '/ɪn səʊ fɑːr əz/',
      coll: ['in so far as I know', '就…而言', '书面'],
      confuse: '⭐ 变体：so far as / insofar as / in so far as，三者都合法。'
        + '标准写法是 insofar as（一个词）。'
        + '⚠️ 常见误写：so far I know（缺 as）。'
    },
    'to the contrary': {
      ipa: '/tuː ðə ˈkɒntrəri/',
      coll: ['There is no evidence to the contrary.', '相反地；相反的事实', '书面'],
      confuse: '⭐ 固定搭配：'
        + 'to the contrary（相反的事实）'
        + 'on the contrary（相反地——否定前句）'
        + 'contrary to（与…相反）。'
        + '三者常被误用。'
    },
    'objective tone': {
      ipa: '/əbˈdʒektɪv təʊn/',
      coll: ['maintain an objective tone', '客观语气', '职场'],
      confuse: 'tone（语气）+ objective（客观的）。'
        + '反义：subjective tone / emotional tone。'
    },

    /* ========== 十一、习语：旅行与生活 ========== */
    'mark down': {
      ipa: '/mɑːk daʊn/',
      coll: ['prices were marked down', '降价；做标记', '购物'],
      confuse: 'mark down（降价）vs mark up（涨价）：'
        + 'They marked down the price（降价）。'
        + '⭐ mark up 也可指"加价"或"做标记"，语境决定。'
    },
    'check in': {
      ipa: '/tʃekk ɪn/',
      coll: ['check in at the hotel', '入住；办理登记；办理登机', '旅行'],
      confuse: '⭐ check in（入住/登机）'
        + 'vs check out（退房）'
        + 'vs check out of the hotel（离开）'
        + 'vs check on（查看）。'
    },
    'front desk': {
      ipa: '/frʌnt desk/',
      coll: ['ask at the front desk', '前台（接待处）', '旅行'],
      confuse: '美式常用 front desk，英式常用 reception（desk）。'
        + '两者都指酒店前台。'
    },
    'wake-up call': {
      ipa: '/ˈweɪk ʌp kɔːl/',
      coll: ['request a wake-up call', '叫醒服务', '旅行'],
      confuse: '⭐ 服务业术语：'
        + 'Could I have a wake-up call at six?'
        + 'wake-up call 也可引申为"警钟"：'
        + 'The near miss was a wake-up call。'
    },
    'luggage storage': {
      ipa: '/ˈlʌɡɪdʒ ˈstɔːrɪdʒ/',
      coll: ['left luggage storage', '行李寄存', '旅行'],
      confuse: 'luggage（英式）/ baggage（美式）都可，'
        + '不可数，不能说 luggages。'
    },
    'air conditioning': {
      ipa: '/eə kənˈdɪʃənɪŋ/',
      coll: ['turn on the air conditioning', '空调', '日常'],
      confuse: 'air conditioner 是空调机，'
        + 'air conditioning 是空调系统/空调（总称）。'
        + '口语常简称 AC。'
    },
    'return ticket': {
      ipa: '/rɪˈtɜːn ˈtɪkɪt/',
      coll: ['book a return ticket', '往返票', '旅行'],
      confuse: '⭐ 英式说 return ticket；'
        + '美式说 round-trip ticket 或 two-way ticket。'
        + '单程：one-way（美）/ single（英）。'
    },
    'key card': {
      ipa: '/kiː kɑːd/',
      coll: ['swipe your key card', '房卡；门卡', '旅行'],
      confuse: 'key card（卡片状的钥匙/门禁卡）'
        + 'swipe（刷卡动作）vs insert（插入式）。'
        + '现代酒店多用 key card 而非 physical key。'
    },
    'in the ballpark': {
      ipa: '/ɪn ðə ˈbɔːlpɑːk/',
      coll: ['in the ballpark of 1000', '在…的范围内；大约', '口语'],
      confuse: '⭐ 同 "大致范围"，球类语境中本义是球场范围。'
    },
    'step up your game': {
      ipa: '/step ʌp jɔː ɡeɪm/',
      coll: ['You need to step up your game.', '提升你的表现', '口语/职场'],
      confuse: 'step up（提升）+ your game（你的表现/水平）。'
        + '★ 也可说 raise your game（提升）。'
    },
    'set and reps': {
      ipa: '/sets ənd reps/',
      coll: ['three sets and reps', '组数与次数', '运动'],
      confuse: '⭐ 健身术语：'
        + 'a set（一组，连续做若干次）'
        + 'a rep（一次动作）。'
        + '3 sets of 10 reps = 做 3 组，每组 10 次。'
        + '复数：sets / reps 都是缩写读法。'
    },
    'purchase order': {
      ipa: '/ˈpɜːtʃəs ˈɔːdə(r)/',
      coll: ['place a purchase order', '采购订单', '职场'],
      confuse: '★ 缩写 PO（= P.O.）：'
        + 'The PO must be approved first。'
        + 'purchase（购买）vs procure（采购，更正式）。'
    },
    'echo chamber': {
      ipa: '/ˈekəʊ tʃeɪmbə(r)/',
      coll: ['create an echo chamber', '回音室（只听同一种声音的环境）', '职场/社会'],
      confuse: '⭐ 引申义指"意见单一、无法听到异议的环境"：'
        + 'Social media can become an echo chamber。'
        + '原义是声学的回音室。'
    }
  };

  /* ============================================================
     对外接口
     ============================================================ */
  function get2(word) {
    var w = String(word || '').trim().toLowerCase();
    return idx2()[w] || null;
  }

  /* key 里含大写字母的条目（如 "as far as I know"）用小写查表会永远落空，
     所以额外建一张全小写索引。惰性构建，只建一次。*/
  var _idx2 = null;
  function idx2() {
    if (_idx2) return _idx2;
    _idx2 = {};
    for (var k in DEEP2) {
      if (Object.prototype.hasOwnProperty.call(DEEP2, k)) _idx2[k.toLowerCase()] = DEEP2[k];
    }
    return _idx2;
  }

  /** 两批数据合并查询 */
  function getDeep(word) {
    var d = get2(word);
    if (d) return d;
    return global.VocabDeep ? global.VocabDeep.get(word) : null;
  }

  global.VocabDeep2 = {
    get: get2, all: function () { return DEEP2; },
    keys: function () { return Object.keys(DEEP2); },
    stats: function () {
      var coll = 0, conf = 0;
      for (var k in DEEP2) {
        if (!Object.prototype.hasOwnProperty.call(DEEP2, k)) continue;
        if (DEEP2[k].coll) coll++;
        if (DEEP2[k].confuse) conf++;
      }
      return { entries: Object.keys(DEEP2).length, withIpa: Object.keys(DEEP2).length, withColl: coll, withConfuse: conf };
    }
  };

  /* ============================================================
     把第二批补进词库
     ------------------------------------------------------------
     第一批 VocabDeep 已注册 DOMContentLoaded 钩子并包装了
     Store.ensureLevel，此处只需等第一批就绪后补上自己那部分。
     ============================================================ */
  function applyToPool(pool) {
    if (!pool || !pool.length) return 0;
    var n = 0;
    for (var i = 0; i < pool.length; i++) {
      var e = pool[i];
      var d = idx2()[String(e.w || '').trim().toLowerCase()];
      if (!d) continue;
      if (!e.ipa && d.ipa) { e.ipa = d.ipa; n++; }
      if (!e.coll && d.coll) e.coll = d.coll;
      if (!e.confuse && d.confuse) e.confuse = d.confuse;
    }
    return n;
  }

  function applyAll2() {
    return applyToPool(global.VOCAB_DATA && global.VOCAB_DATA.words)
      + applyToPool(global.GAOKAO_L5 && global.GAOKAO_L5.words)
      + applyToPool(global.GAOKAO_L6 && global.GAOKAO_L6.words)
      + applyToPool(global.GAOKAO_DATA && global.GAOKAO_DATA.words);
  }

  function boot() {
    applyAll2();
    // 分片懒加载后再补一次
    var S = global.Store;
    if (S && typeof S.ensureLevel === 'function' && !S.__vd2Patched) {
      S.__vd2Patched = true;
      var orig = S.ensureLevel;
      S.ensureLevel = function () {
        var p = orig.apply(this, arguments);
        if (p && typeof p.then === 'function') p.then(function () { applyAll2(); });
        return p;
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})(window);