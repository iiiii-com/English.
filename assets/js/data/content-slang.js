/* ============================================================
   content-slang.js —— 日常对话表达 + 俚语 + 习语 + 网络用语

   设计原则（重要）：
   1. 每个词标注【语域等级】，教「在什么场合能用」比教「意思」更重要。
      R1 正式（书面/演讲/面试） R2 中性（日常通用） R3 随意（朋友同事）
      R4 俚语（同龄人之间） R5 粗俗/危险（部分场合禁忌）
   2. 每个俚语给出【正式替代说法】——这是最实用的部分。
   3. 明确标注「假英语」警告，中国教材与网络流传的错误表达。
   4. 标注英美差异（BrE/AmE），避免学了美式却在英场合出错。
   ============================================================ */
(function (global) {
  'use strict';

  var R = {
    R1: { label: '正式', color: '#4f7cff', desc: '书面语、演讲、面试、正式邮件' },
    R2: { label: '中性', color: '#22b07d', desc: '日常通用，场合限制少' },
    R3: { label: '随意', color: '#f0a020', desc: '朋友、同事之间' },
    R4: { label: '俚语', color: '#e2585f', desc: '同龄人、网络、娱乐圈' },
    R5: { label: '粗俗', color: '#8b5cf6', desc: '部分场合禁忌' }
  };

  /* ============================================================
     一、语域等级说明（学习前必读）
     ============================================================ */
  var REGISTER_GUIDE = {
    why: '母语者的英语能力，一半体现在「知道一个词但知道什么时候不能用它」。' +
      '把 "That\'s awesome" 用在学术答辩上，或在葬礼上说 "cool"，比语法错误更暴露水平。' +
      '本模块把「语域」作为第一维度教，而不是只教词义。',
    rule: '判断语域三问：对方是谁？我有多了解他？正式程度多高？' +
      '三个问题的答案决定你能用哪个等级。',
    ladder: '进阶顺序：R1→R2→R3→R4。' +
      '学习者应先掌握 R1+R2 的 3000 词，再逐步引入 R3。' +
      'R4 俚语对理解听力至关重要（电影、剧集、YouTube 中大量出现），' +
      '但使用应保守——听不懂是问题，用错场合是更大的问题。'
  };

  /* ============================================================
     二、日常高频表达（按功能分组）—— 零基础最实用的部分
     每条：en 英文 / cn 中文 / r 语域 / note 使用提示
     ============================================================ */
  var PHRASES = [
    {
      cat: '打招呼与开场',
      items: [
        { en: 'How\'s it going?', cn: '最近怎么样？', r: 'R3', note: '比 How are you 更自然的日常问候，回答通常也是寒暄而非真答。' },
        { en: 'What\'s up?', cn: '啥事？怎么了？', r: 'R3', note: '朋友间最常用。回答常是 "Not much" ——这是固定回答，不要真汇报近况。' },
        { en: 'Long time no see.', cn: '好久不见。', r: 'R2', note: '源自中文，直译回英语。现在已被英语母语者自然使用。' },
        { en: 'It\'s been a while.', cn: '有一阵子没见了。', r: 'R2', note: '中性版寒暄，适用面最广。' },
        { en: 'How have you been keeping?', cn: '你最近怎么样？', r: 'R1', note: '较正式，问得比 How have you been 更深。' },
        { en: 'How\'s everything?', cn: '一切都好吗？', r: 'R2', note: '万能问候，回答 "Not bad" 最自然。' },
        { en: 'Good to see you.', cn: '见到你真好。', r: 'R2', note: '寒暄后必接的一句，用来争取思考时间。' },
        { en: 'You look great.', cn: '你气色真好。', r: 'R2', note: '西方社交基本礼仪，即使一般也要说。' },
        { en: 'I haven\'t seen you in ages.', cn: '好久没见了。', r: 'R3', note: 'ages 在这里是夸张语气，不是真的年纪。' },
        { en: 'What brings you here today?', cn: '今天怎么来了？', r: 'R2', note: '对不常来的访客说的客套话。' },
        { en: 'How is it going so far?', cn: '目前进展如何？', r: 'R2', note: '会议或项目中途询问进度。' },
        { en: 'Sorry, I didn\'t catch that.', cn: '抱歉，我没听清。', r: 'R2', note: '比 What? 礼貌得多，后者非常不客气。' },
        { en: 'Could you say that again, please?', cn: '能麻烦再说一遍吗？', r: 'R2', note: '最安全的请求重复方式。' },
        { en: 'I\'m not sure I follow.', cn: '我不太明白你的意思。', r: 'R2', note: '委婉表示没听懂，保留对方面子。' }
      ]
    },
    {
      cat: '表达同意',
      items: [
        { en: 'Absolutely.', cn: '绝对同意。', r: 'R2', note: '强烈同意，比 Yes 有力得多。' },
        { en: 'For sure.', cn: '当然。', r: 'R3', note: '口语常用。' },
        { en: 'You\'re right.', cn: '你说得对。', r: 'R2', note: '直接同意。' },
        { en: 'That makes sense.', cn: '这说得通。', r: 'R2', note: '表示理解其逻辑，不完全等于同意。' },
        { en: 'I see what you mean.', cn: '我明白你的意思了。', r: 'R2', note: '承认理解，但可能并不同意——比直接反对更圆滑。' },
        { en: 'That\'s a fair point.', cn: '这个观点有道理。', r: 'R2', note: '接受对方论点而不放弃自己立场的关键句。' },
        { en: 'You have a point.', cn: '你说得有道理。', r: 'R2', note: '同上，程度更轻。' },
        { 'en': 'I couldn\'t agree more.', cn: '我完全同意。', r: 'R2', note: '强烈同意。字面是「不能更同意」。' },
        { en: 'Same here.', cn: '我也一样。', r: 'R3', note: '回应「你也累吗」类问题的自然回答。' },
        { en: 'Well put.', cn: '说得精辟。', r: 'R2', note: '称赞对方表达得好的说法，很高级。' },
        { en: 'That rings a bell.', cn: '这听起来耳熟。', r: 'R3', note: '表示「好像在哪听过」。' },
        { en: 'I\'m with you.', cn: '我站你这边。', r: 'R3', note: '口语表达支持，职场可用。' },
        { en: 'Count me in.', cn: '算我一个。', r: 'R3', note: '表示愿意参与。' },
        { en: 'No arguments from me.', cn: '我完全没意见。', r: 'R3', note: '自然、口语化的同意。' }
      ]
    },
    {
      cat: '委婉不同意（最实用的一组）',
      items: [
        { en: 'I see it a little differently.', cn: '我的看法略有不同。', r: 'R2', note: '最重要的委婉反对句式。' },
        { en: 'I\'m not sure I agree.', cn: '我不太确定是否同意。', r: 'R2', note: '标准缓冲句。' },
        { en: 'That may be true, but…', cn: '这也许对，但是……', r: 'R2', note: '先认同再转折，标准辩论句式。' },
        { en: 'I take your point, but…', cn: '我接受你的观点，不过……', r: 'R2', note: '谈判与讨论中的核心句式。' },
        { en: 'I\'m afraid I have to disagree.', cn: '恐怕我不能同意。', r: 'R2', note: '正式场合的委婉反对。' },
        { en: 'I\'d look at it differently.', cn: '我会用不同的角度看。', r: 'R3', note: '个人化的表达方式。' },
        { en: 'I don\'t think that quite works.', cn: '我觉得这样恐怕行不通。', r: 'R2', note: '委婉否定，注意 quite 起到软化作用。' },
        { en: 'Perhaps we should think about it.', cn: '也许我们该再想想。', r: 'R2', note: '拖延式回应，留有余地。' },
        { en: 'Let me get back to you on that.', cn: '这个我回头答复你。', r: 'R2', note: '拖延但不失礼的说法。' },
        { en: 'I\'m not convinced yet.', cn: '我还没被说服。', r: 'R2', note: '保留意见的得体说法。' }
      ]
    },
    {
      cat: '表达感谢与赞赏',
      items: [
        { en: 'Thanks a lot.', cn: '非常感谢。', r: 'R2', note: '通用。' },
        { en: 'I really appreciate it.', cn: '我真的很感激。', r: 'R2', note: '比 Thank you 更重、更真诚。' },
        { en: 'That means a lot to me.', cn: '这对我意义重大。', r: 'R2', note: '强调情感分量，用于重要帮助。' },
        { en: 'I owe you one.', cn: '我欠你一个人情。', r: 'R3', note: '朋友间说法，暗示将来要还。' },
        { en: 'You\'re a lifesaver.', cn: '你真是救了我。', r: 'R3', note: '夸张的感谢，日常很常用。' },
        { en: 'Thanks for letting me know.', cn: '谢谢你告诉我。', r: 'R2', note: '收到提醒或信息时的标准回复。' },
        { en: 'Much appreciated.', cn: '不胜感激。', r: 'R1', note: '正式书面语，邮件常用。' },
        { en: 'I owe you one for that.', cn: '这事我欠你一次。', r: 'R3', note: '口语版人情表达。' },
        { en: 'That\'s very kind of you.', cn: '你真是太好了。', r: 'R2', note: '夸对方善良，通用且真诚。' },
        { en: 'I really appreciate your patience.', cn: '非常感谢你的耐心。', r: 'R1', note: '正式场合致谢的高频句。' }
      ]
    },
    {
      cat: '道歉',
      items: [
        { en: 'I\'m sorry.', cn: '对不起。', r: 'R2', note: '轻度道歉——打扰、借过、迟到几分钟。' },
        { en: 'I apologize.', cn: '我道歉。', r: 'R1', note: '正式书面。' },
        { en: 'My bad.', cn: '我的错。', r: 'R3', note: '极轻松的口语道歉，年轻人常用。' },
        { en: 'I owe you an apology.', cn: '我该向你道歉。', r: 'R1', note: '郑重道歉。' },
        { en: 'That was my fault.', cn: '那是我的责任。', r: 'R2', note: '主动承担责任的说法。' },
        { en: 'I take full responsibility.', cn: '我承担全部责任。', r: 'R1', note: '职场书面语。' },
        { en: 'Sorry to keep you waiting.', cn: '抱歉让你久等了。', r: 'R2', note: '让别人等待时的标准道歉。' },
        { en: 'Please forgive me.', cn: '请原谅我。', r: 'R1', note: '较正式。' },
        { en: 'I messed up.', cn: '我搞砸了。', r: 'R3', note: '承认错误，口语化。' },
        { en: 'It won\'t happen again.', cn: '不会再发生了。', r: 'R2', note: '道歉时的补救承诺。' }
      ]
    },
    {
      cat: '表达感谢以外的请求',
      items: [
        { en: 'Could you give me a hand?', cn: '能帮我一下吗？', r: 'R3', note: 'give a hand 是「帮忙」，很自然。' },
        { en: 'Would you mind helping me out?', cn: '你介意帮我一下吗？', r: 'R2', note: 'mind 后接动名词，help sb out 更随意。' },
        { en: 'Do you have a minute?', cn: '你有空吗？', r: 'R2', note: '开场请求的万能句，暗示占用一点时间。' },
        { en: 'Any chance you could…?', cn: '你有可能……吗？', r: 'R3', note: '比 Could you 更委婉，暗示「如果方便的话」。' },
        { en: 'I was wondering if you could…', cn: '我想问下你能否……', r: 'R2', note: '邮件里提出请求的标准开头，礼貌度最高。' },
        { en: 'Let me know if you need anything.', cn: '需要什么跟我说。', r: 'R2', note: '结束对话时的万能收尾。' },
        { en: 'Thanks in advance.', cn: '提前谢了。', r: 'R3', note: '请求前先道谢，礼貌且自然。' },
        { en: 'Sorry to bother you, but…', cn: '不好意思打扰你，……', r: 'R2', note: '打扰别人时的标准缓冲。' },
        { en: 'Can I pick your brain?', cn: '我能请教你一下吗？', r: 'R3', note: '字面「翻你的脑子」，实际是「向你请教」。' },
        { en: 'Do you mind if I…?', cn: '我……你不介意吧？', r: 'R2', note: '请求许可的标准句式。' }
      ]
    },
    {
      cat: '日常闲聊过渡句',
      items: [
        { en: 'Speaking of which…', cn: '说到这个……', r: 'R3', note: '话题转换的高级技巧。' },
        { en: 'That reminds me…', cn: '这让我想起……', r: 'R2', note: '自然引入新话题。' },
        { en: 'By the way…', cn: '顺便说一句……', r: 'R2', note: '最常见的转换语。' },
        { en: 'Anyway, moving on…', cn: '总之，我们继续……', r: 'R2', note: '会议中推进议程。' },
        { en: 'To make a long story short…', cn: '长话短说……', r: 'R3', note: '准备快速讲完一件事。' },
        { en: 'Let me put it this way.', cn: '我这么说吧。', r: 'R2', note: '准备重新表达。' },
        { en: 'The point is…', cn: '关键是……', r: 'R2', note: '强调重点。' },
        { en: 'What I\'m trying to say is…', cn: '我想说的是……', r: 'R2', note: '纠正对方误解。' },
        { en: 'So, anyway…', cn: '那么……', r: 'R3', note: '填补沉默的填充词。' },
        { en: 'Well, I don\'t know about that.', cn: '这个我还真不好说。', r: 'R3', note: '表达怀疑又不直接否定。' }
      ]
    },
    {
      cat: '结束对话',
      items: [
        { en: 'Anyway, I should get going.', cn: '那个，我得走了。', r: 'R2', note: '最自然的告别开场。' },
        { en: 'It was nice talking to you.', cn: '和你聊天很愉快。', r: 'R2', note: '标准告别语。' },
        { en: 'I should let you go.', cn: '我就不打扰你了。', r: 'R2', note: '体贴的告别。' },
        { en: 'Take care.', cn: '保重。', r: 'R2', note: '通用。' },
        { en: 'Keep in touch.', cn: '保持联系。', r: 'R2', note: '期待再联系。' },
        { en: 'Catch you later.', cn: '回头见。', r: 'R3', note: '轻松版告别。' },
        { en: 'Talk to you soon.', cn: '回头聊。', r: 'R3', note: '线上对话常用。' },
        { en: 'Have a good one.', cn: '祝你愉快。', r: 'R3', note: '轻松随意的告别。' },
        { en: 'I\'ll let you get back to it.', cn: '你继续忙吧。', r: 'R2', note: '体贴地结束对话。' },
        { en: 'Give my regards to…', cn: '代我向……问好。', r: 'R1', note: '正式告别语。' }
      ]
    },
    {
      cat: '表达情绪与状态',
      items: [
        { en: 'I\'m exhausted.', cn: '我累坏了。', r: 'R3', note: '日常口语。' },
        { en: 'I\'m beat.', cn: '我累瘫了。', r: 'R4', note: '俚语，beaten up 的缩写。' },
        { en: 'I\'m dying to see you.', cn: '我超级想见你。', r: 'R3', note: 'dying to 意为「渴望」，不是「要死」。' },
        { en: 'I can\'t wait.', cn: '我等不及了。', r: 'R2', note: '期待。' },
        { en: 'It\'s driving me crazy.', cn: '快把我逼疯了。', r: 'R3', note: '表达烦躁。' },
        { en: 'I\'m fed up with…', cn: '我受够了……', r: 'R3', note: '强烈不满，注意搭配 with。' },
        { en: 'I\'m stressed out.', cn: '我压力山大。', r: 'R3', note: '口语表达压力大。' },
        { en: 'It\'s a piece of cake.', cn: '这太简单了。', r: 'R3', note: '习语，字面「一块蛋糕」。' },
        { en: 'I\'m over the moon.', cn: '我开心极了。', r: 'R3', note: '习语，非常高兴。' },
        { en: 'It\'s driving me nuts.', cn: '快把我逼疯了。', r: 'R3', note: 'drive sb nuts 与 crazy 同义。' },
        { en: 'I\'m all ears.', cn: '我在认真听。', r: 'R3', note: '习语，表示「洗耳恭听」。' },
        { en: 'I\'m swamped today.', cn: '我今天忙翻了。', r: 'R3', note: 'swamped 意为「被淹没」，形容忙不过来。' }
      ]
    }
  ];

  /* ============================================================
     三、俚语库 —— 按语域 R3/R4 标注，每个给正式替代说法
     ============================================================ */
  var SLANG = [
    {
      cat: '程度与评价',
      items: [
        { w: 'awesome', cn: '超棒的；极好的', r: 'R3', formal: 'excellent / wonderful', ex: 'That concert was awesome!', tip: '源自 1960 年代，1980 年代后 mainstream。正式场合用 "wonderful" 更稳。' },
        { w: 'amazing', cn: '令人惊奇的', r: 'R3', formal: 'remarkable / outstanding', ex: 'Your presentation was amazing.', tip: '比 awesome 更偏「出乎意料的好」。' },
        { w: 'fantastic', cn: '极好的', r: 'R3', formal: 'excellent', ex: 'The weather is fantastic today.', tip: '也可表示「奇幻的」，看语境。' },
        { w: 'terrible', cn: '糟糕的', r: 'R2', formal: 'dreadful / awful', ex: 'The traffic was terrible this morning.', tip: '这个其实是 R2，职场可用。' },
        { w: 'horrible', cn: '可怕的；糟糕的', r: 'R2', formal: 'dreadful', ex: 'The weather is horrible.', tip: 'R2，不必回避。' },
        { w: 'super', cn: '非常；超级', r: 'R3', formal: 'very / extremely', ex: 'That\'s super helpful, thanks!', tip: '作程度副词，源自 "superior"。' },
        { w: 'totally', cn: '完全；绝对', r: 'R3', formal: 'completely / absolutely', ex: 'I totally understand.', tip: '加强语气，not totally 是部分同意。' },
        { w: 'pretty much', cn: '基本上；差不多', r: 'R3', formal: 'almost / nearly', ex: 'I\'m pretty much done with it.', tip: '注意不是形容词，pretty 在这里是「相当」。' },
        { w: 'a piece of cake', cn: '小菜一碟', r: 'R3', formal: 'very easy', ex: 'The exam was a piece of cake.', tip: '习语，做某事很轻松。' },
        { w: 'no big deal', cn: '没什么大不了', r: 'R3', formal: 'not a problem', ex: 'Sorry I\'m late — it\'s no big deal.', tip: '安慰对方别放在心上。' },
        { w: 'the best ever', cn: '史上最好的', r: 'R3', formal: 'the finest', ex: 'That was the best meal ever.', tip: '口语强调，书面用 "the finest"。' },
        { w: 'mind-blowing', cn: '震撼的', r: 'R3', formal: 'stunning / overwhelming', ex: 'The ending was mind-blowing.', tip: '口语复合形容词，正式用 overwhelming。' },
        { w: 'insanely good', cn: '好到离谱', r: 'R3', formal: 'exceptionally good', ex: 'This espresso is insanely good.', tip: 'insanely 在这里是程度副词。' },
        { w: 'meh', cn: '一般般；不咋地', r: 'R4', formal: 'mediocre / unremarkable', ex: 'The movie was… meh.', tip: '网络与年轻人用语，源自 Meme。' },
        { w: 'fire', cn: '超酷的', r: 'R4', formal: 'excellent', ex: 'That\'s a fire jacket.', tip: 'Hip-hop 用语，2000 年代后流行，黑人俚语起源。' },
        { w: 'lit', cn: '很棒；嗨翻了', r: 'R4', formal: 'great / exciting', ex: 'The party was lit!', tip: '现在也指「点亮的」。' },
        { w: 'goated', cn: '最强的', r: 'R4', formal: 'the best', ex: 'He\'s the goated rapper right now.', tip: '网络俚语，源自 "goat"（最棒）。' },
        { w: 'slaps', cn: '超棒（指音乐）', r: 'R4', formal: 'excellent', ex: 'This track slaps.', tip: '常用于音乐评价。' }
      ]
    },
    {
      cat: '人 —— 描述他人',
      items: [
        { w: 'chill', cn: '随和的；放松的', r: 'R3', formal: 'easygoing / relaxed', ex: 'She\'s super chill about everything.', tip: '也可作动词 "chill out"（放松）。' },
        { w: 'legit', cn: '正当的；真实的', r: 'R4', formal: 'legitimate / genuine', ex: 'That\'s a legit reason.', tip: '本义「合法」，现在常指「站得住脚」。' },
        { w: 'a jerk', cn: '一个混蛋', r: 'R3', formal: 'an unpleasant person', ex: 'He was a jerk to me.', tip: '负面评价，中等强度。' },
        { w: 'a pain in the neck', cn: '很烦人的人', r: 'R3', formal: 'an annoying person', ex: 'My little sister is a pain in the neck.', tip: '习语，比 jerk 轻。' },
        { w: 'a big deal', cn: '了不得的事', r: 'R3', formal: 'something significant', ex: 'Don\'t make it a big deal.', tip: '常用于安慰对方别想太多。' },
        { w: 'a showstopper', cn: '全场最亮眼的表演', r: 'R4', formal: 'an outstanding performance', ex: 'Her solo was a showstopper.', tip: '原指谢幕时观众叫好停演。' },
        { w: 'a nerd', cn: '书呆子', r: 'R3', formal: 'a studious person', ex: 'I was such a nerd in school.', tip: '如今多指「技术宅」，略带褒义。' },
        { w: 'a go-getter', cn: '有上进心的人', r: 'R3', formal: 'an ambitious person', ex: 'She\'s a real go-getter.', tip: '褒义，强调主动进取。' },
        { w: 'a sly fox', cn: '狡猾的人', r: 'R3', formal: 'a cunning person', ex: 'You sly fox!', tip: '略带调侃的称呼。' },
        { w: 'dude', cn: '哥们儿', r: 'R4', formal: 'man / buddy', ex: 'Dude, that was insane!', tip: '⚠️ 高度性别化且随意，正式场合或对女性使用可能不适。' },
        { w: 'guys', cn: '大家；各位', r: 'R3', formal: 'everyone', ex: 'Thanks, you guys.', tip: '在部分口音中是通用词，不专属男性。' },
        { w: 'fam', cn: '家人（昵称）；好兄弟', r: 'R4', formal: 'family / close friends', ex: 'The whole fam is coming.', tip: '源自 Black English，年轻人与体育解说常用。' }
      ]
    },
    {
      cat: '动词短语',
      items: [
        { w: 'chill out', cn: '放松；冷静', r: 'R3', formal: 'relax / calm down', ex: 'Chill out, everything\'s fine.', tip: 'Chill 是形容词，chill out 是动词短语。' },
        { w: 'hang out', cn: '闲逛；一起玩', r: 'R2', formal: 'spend time together', ex: 'Want to hang out this weekend?', tip: '注意是有 out 的短语，不加 out 的 hang 含义不同。' },
        { w: 'hang in there', cn: '坚持住；加油', r: 'R3', formal: 'keep going', ex: 'Almost there — hang in there!', tip: '鼓励对方坚持。' },
        { w: 'figure out', cn: '弄明白', r: 'R2', formal: 'work out / understand', ex: 'I need to figure out the schedule.', tip: '比 understand 更强调「摸索过程」。' },
        { w: 'get it done', cn: '把它搞定', r: 'R3', formal: 'complete it', ex: 'I\'ll get it done by Friday.', tip: '强调完成而非过程。' },
        { w: 'show up', cn: '到场；出现', r: 'R3', formal: 'arrive / attend', ex: 'He didn\'t show up at all.', tip: '比 come 更强调「露面」。' },
        { w: 'look into', cn: '调查；研究', r: 'R2', formal: 'investigate', ex: 'I\'ll look into the issue.', tip: '⚠️ 注意：look into 是调查，look 后面直接跟宾语是「看」。' },
        { w: 'check out', cn: '查看；体验', r: 'R3', formal: 'examine / try', ex: 'You should check out this new café.', tip: '口语里也指「结账离开」，看语境。' },
        { w: 'put up with', cn: '忍受', r: 'R2', formal: 'tolerate', ex: 'I can\'t put up with the noise.', tip: '固定搭配，up with 不可省略。' },
        { w: 'run out of', cn: '用完；耗尽', r: 'R2', formal: 'exhaust the supply', ex: 'We ran out of coffee.', tip: '注意与 run out（跑到尽头）区分。' },
        { w: 'turn down', cn: '拒绝；调小', r: 'R2', formal: 'reject / lower the volume', ex: 'She turned down the offer.', tip: '一词多义，靠语境判断。' },
        { w: 'come up with', cn: '想出（主意）', r: 'R2', formal: 'devise / think of', ex: 'I need to come up with a plan.', tip: '强调「创造性地想出」。' },
        { w: 'get away with', cn: '蒙混过关', r: 'R2', formal: 'escape punishment', ex: 'He got away with it this time.', tip: '含「本该受罚但没有」之意。' },
        { w: 'screw up', cn: '搞砸；犯大错', r: 'R4', formal: 'make a mistake', ex: 'I really screwed up that interview.', tip: '⚠️ 稍粗，职场慎用。' },
        { w: 'bail out', cn: '保释；甩锅；放弃', r: 'R3', formal: 'rescue / abandon', ex: 'He bailed on the project.', tip: 'bail on sb 意为「放某人鸽子」。' },
        { w: 'zone out', cn: '走神；发呆', r: 'R3', formal: 'daydream / be inattentive', ex: 'I zoned out in class.', tip: '最常见的「走神」表达。' },
        { w: 'call it a day', cn: '今天就到这儿', r: 'R2', formal: 'stop for the day', ex: 'It\'s 10 pm — let\'s call it a day.', tip: '习语，表示收工。' },
        { w: 'touch base', cn: '简短沟通一下', r: 'R3', formal: 'make contact briefly', ex: 'Let\'s touch base on Monday.', tip: '职场高频，指非正式同步。' }
      ]
    },
    {
      cat: '网络用语与缩写',
      items: [
        { w: 'LOL', cn: '大声笑', r: 'R3', formal: '(write "that\'s funny")', ex: 'That\'s hilarious lol', tip: '源自 "laughing out loud"。现在职场邮件中仍常见，但正式文件不用。' },
        { w: 'IMO', cn: '我觉得', r: 'R2', formal: 'in my opinion', ex: 'IMO, we should wait.', tip: '= in my opinion，讨论时常用。' },
        { w: 'TBH', cn: '说实话', r: 'R3', formal: 'to be honest', ex: 'TBH, I didn\'t like it.', tip: '= to be honest，坦率表达。' },
        { w: 'BTW', cn: '顺便说一句', r: 'R2', formal: 'by the way', ex: 'BTW, the meeting moved to 3pm.', tip: '= by the way，邮件结尾常用。' },
        { w: 'FYI', cn: '供你参考', r: 'R2', formal: 'for your information', ex: 'FYI, the deadline moved.', tip: '= for your information，邮件常用但略生硬。' },
        { w: 'ASAP', cn: '尽快', r: 'R2', formal: 'as soon as possible', ex: 'I need it ASAP.', tip: '= as soon as possible，工作邮件高频。' },
        { w: 'IMO / ITTM', cn: '我觉得（个人）', r: 'R4', formal: 'I think / in my humble opinion', ex: 'IMHO we should wait.', tip: 'IMHO = in my humble opinion（恕我直言）。' },
        { w: 'TIL', cn: '原来才知道', r: 'R4', formal: '(nothing — this is internet-only)', ex: 'TIL that bananas are berries.', tip: '= today I learned，Reddit 起源，仅限网络。' },
        { w: 'FOMO', cn: '错失恐惧', r: 'R4', formal: 'fear of missing out', ex: 'I have serious FOMO about that trip.', tip: '已进入日常词汇，可直接说。' },
        { w: 'on fleek', cn: '非常地道', r: 'R4', formal: 'perfectly idiomatic', ex: 'Your pronunciation is on fleek.', tip: '⚠️ 原为黑人群俚，网络爆红后被部分人视为已过时。' },
        { w: 'no cap', cn: '说真的；不骗你', r: 'R4', formal: 'honestly / no lie', ex: 'That\'s the best burger, no cap.', tip: '⚠️ 源自黑人俚语，种族敏感，慎用。' },
        { w: 'ate and left no crumbs', cn: '做得漂亮（无敌）', r: 'R4', formal: 'nailed it perfectly', ex: 'She absolutely ate that presentation.', tip: '2022 年后爆红的网络表达。' },
        { w: 'npc', cn: '像路人甲一样没存在感', r: 'R4', formal: 'forgettable / unremarkable', ex: 'My outfit was giving NPC.', tip: '源自游戏术语「非玩家角色」，网络流行语。' },
        { w: 'delulu', cn: '不切实际的幻想者', r: 'R4', formal: 'dreamy / unrealistic', ex: 'You\'re being delulu.', tip: 'K-pop 粉丝用语，2023 年后流行。' },
        { w: 'rizz', cn: '魅力（尤指异性缘好）', r: 'R4', formal: 'charm / charisma', ex: 'He has undeniable rizz.', tip: '2023 年爆红，仅限年轻人网络用语。' },
        { w: 'touch grass', cn: '该出门见见现实了', r: 'R4', formal: 'get off the internet / go outside', ex: 'Go touch grass, dude.', tip: '⚠️ 语气轻蔑，说别人沉迷网络。' }
      ]
    },
    {
      cat: '英美差异（容易踩坑）',
      items: [
        { w: 'football', cn: '⚠️ 美式=橄榄球，英式=足球', r: 'R2', formal: 'soccer (AmE) / football (BrE)', ex: 'Let\'s play football.', tip: '⚠️ 中国学生最常误解的点。跟美国人说 football 他们会以为橄榄球。' },
        { w: 'trash / rubbish / garbage', cn: '垃圾（三地全不同）', r: 'R2', formal: 'refuse', ex: 'Take it out to the trash.', tip: '美式 trash，英式 rubbish / garbage。' },
        { w: 'apartment / flat', cn: '公寓（美式/英式）', r: 'R2', formal: '(same meaning)', ex: 'I rent an apartment.', tip: '美式 apartment，英式 flat。' },
        { w: 'elevator / lift', cn: '电梯（美式/英式）', r: 'R2', formal: '(same meaning)', ex: 'Take the elevator up.', tip: '美式 elevator，英式 lift。' },
        { w: 'schedule / timetable', cn: '日程表（美式/英式）', r: 'R2', formal: '(same meaning)', ex: 'It\'s on my schedule.', tip: '美式 schedule 的读法 /ˈskedʒuːl/ 是英式，/ˈskedʒuːl/ 在美式也常见，另有 /ˈskedʒuːl/ 变体。' },
        { w: 'store / shop', cn: '商店（美式/英式）', r: 'R2', formal: '(same meaning)', ex: 'I went to the store.', tip: '美式 store，英式 shop。' },
        { w: 'subway / underground', cn: '地铁（美式/英式）', r: 'R2', formal: 'metro / tube', ex: 'I take the subway.', tip: '美式 subway，英式 underground / tube。' },
        { w: 'sidewalk / pavement', cn: '人行道（美式/英式）', r: 'R2', formal: '(same meaning)', ex: 'Walk on the sidewalk.', tip: '美式 sidewalk，英式 pavement。' },
        { w: 'pants / trousers', cn: '裤子（美式/英式）', r: 'R2', formal: '(same meaning)', ex: 'These pants are new.', tip: '⚠️ pants 在美式是复数，必须用 are；英式 trousers 也是复数。' },
        { w: 'math / maths', cn: '数学（美式/英式）', r: 'R2', formal: '(same meaning)', ex: 'Math is easy for me.', tip: '美式 math，英式 maths。' }
      ]
    }
  ];

  /* ============================================================
     四、习语（Idioms）—— 母语者的高频表达
     ============================================================ */
  var IDIOMS = [
    { en: 'break the ice', cn: '打破僵局；破冰', story: '两个人初次见面都很紧张，有人提议"把冰敲破"，气氛就轻松了。', ex: 'He told a joke to break the ice.' },
    { en: 'hit the books', cn: '开始用功读书', story: '"hit" 意为猛攻，books 指课本。', ex: 'I need to hit the books before the exam.' },
    { en: 'under the weather', cn: '身体不舒服', story: '病得好像被天气影响了一样——一种古老的说法。', ex: 'I\'m feeling a bit under the weather.' },
    { en: 'on the same page', cn: '想法一致；达成共识', story: '两个人翻书翻到同一页，所以是同一个想法。', ex: 'Let\'s make sure we\'re on the same page.' },
    { en: 'burn the midnight oil', cn: '熬夜苦读', story: '油灯要烧到午夜，形容挑灯夜战。', ex: 'She burned the midnight oil writing her thesis.' },
    { en: 'cost an arm and a leg', cn: '花费巨大', story: '形容贵得像砍掉四肢一样。', ex: 'That car cost me an arm and a leg.' },
    { en: 'once in a blue moon', cn: '极其罕见', story: '蓝色月亮（一个月出现两次）代表罕见。', ex: 'We meet once in a blue moon.' },
    { en: 'the last straw', cn: '最后一根稻草；临界点', story: '源自「骆驼背上最后一根稻草」。', ex: 'That was the last straw for me.' },
    { en: 'pull someone\'s leg', cn: '开玩笑取笑某人', story: '字面是「拉某人的腿」，实际是开玩笑而非欺负。', ex: 'Don\'t pull my leg — I\'m serious.' },
    { en: 'get the hang of it', cn: '掌握窍门', story: '原指「抓住（某物）的用法」，后泛指学会做某事。', ex: 'You\'ll get the hang of it soon.' },
    { en: 'in hot water', cn: '陷入麻烦', story: '字面是「泡在热水里」，实际是遇到麻烦。', ex: 'He\'s in hot water with his boss.' },
    { en: 'miss the boat', cn: '错失良机', story: '没赶上的渡船，等于错过了机会。', ex: 'Don\'t miss the boat on this deal.' },
    { en: 'wrap your head around it', cn: '理解；想明白', story: '字面是「把头包住」，实际是让信息在脑中形成完整概念。', ex: 'It took me a while to wrap my head around it.' },
    { en: 'rain check', cn: '改天再约', story: '雨天无法赴约时说 "take a rain check"，后来泛指改期。', ex: 'Can I take a rain check on dinner?' },
    { en: 'piece of cake', cn: '小菜一碟', story: '生日蛋糕切一块很轻松，所以小事容易。', ex: 'This task is a piece of cake.' },
    { en: 'beat around the bush', cn: '说话绕圈子', story: '打猎时惊动灌木旁的鸟，比喻不直接说重点。', ex: 'Stop beating around the bush — what happened?' },
    { en: 'let the cat out of the bag', cn: '泄露秘密', story: '字面「让猫跑出袋子」，引申为说漏嘴。', ex: 'He let the cat out of the bag.' },
    { en: 'throw in the towel', cn: '认输；放弃', story: '源自拳击，扔毛巾表示弃赛。', ex: 'I\'m not throwing in the towel yet.' },
    { en: 'hit the nail on the head', cn: '一语中的；说到点子上', story: '敲钉子敲在头上，比喻说到关键点。', ex: 'That\'s exactly it — you hit the nail on the head.' },
    { en: 'jump on the bandwagon', cn: '随大流；赶时髦', story: '原指跳上流动马车（bandwagon），后指跟风。', ex: 'Everyone jumped on the bandwagon after it went viral.' },
    { en: 'read between the lines', cn: '读出言外之意', story: '字面是「读行与行之间」，实际是体会隐含意思。', ex: 'You need to read between the lines here.' },
    { en: 'bite the bullet', cn: '硬着头皮去做难事', story: '战场上士兵咬住子弹带忍耐，形容强忍痛苦去做。', ex: 'Sometimes you just have to bite the bullet.' },
    { en: 'call it quits', cn: '就此打住；结束', story: 'quits 意为「停止」，表示不再继续。', ex: 'Let\'s call it quits for today.' },
    { en: 'in a nutshell', cn: '简而言之', story: ' nutshell 原指小果壳，浓缩了全部精华。', ex: 'In a nutshell, we need more time.' },
    { en: 'out of the blue', cn: '突然；出乎意料', story: '毫无预兆的一击。', ex: 'The offer came out of the blue.' },
    { en: 'under your nose', cn: '就在你眼前（你却没看见）', story: '东西在鼻子底下却错过，强调「显而易见却没注意到」。', ex: 'The answer was under your nose the whole time.' },
    { en: 'up in the air', cn: '悬而未决', story: '原指飞在高空中，形容结果未定。', ex: 'The decision is still up in the air.' },
    { en: 'in hot water', cn: '有大麻烦', story: '如上，比喻陷入困境。', ex: 'You\'ll get in hot water if you\'re late again.' },
    { en: 'cold feet', cn: '临阵退缩', story: '在关键时刻因为害怕而退缩。', ex: 'Don\'t get cold feet now — you\'re ready.' },
    { en: 'sugarcoat', cn: '美化（事实）', story: '在难听的真相上裹一层糖衣。', ex: 'Don\'t sugarcoat the results.' },
    { en: 'sober up', cn: '清醒过来', story: '从醉酒状态恢复。', ex: 'I need to sober up before driving.' },
    { en: 'slip of the tongue', cn: '口误', story: '舌头"滑"了一下，说错了话。', ex: 'Sorry, that was a slip of the tongue.' },
    { en: 'drop the ball', cn: '搞砸；疏忽', story: '手中有球却掉了，比喻失误。', ex: 'Don\'t drop the ball on this one.' },
    { en: 'take it with a grain of salt', cn: '不要全信', story: '吃盐要加一粒，形容对不可靠的信息要打折。', ex: 'Take his advice with a grain of salt.' },
    { en: 'down to the wire', cn: '胜负未定；胶着', story: '原指赛马终点线极近，现在泛指竞争激烈。', ex: 'The race is down to the wire.' },
    { en: 'go the extra mile', cn: '多做一步；超额付出', story: '比要求的距离多走一英里，比喻付出超出标准。', ex: 'She always goes the extra mile for her team.' },
    { en: 'a blessing in disguise', cn: '因祸得福', story: '看起来是坏事，实际是好事。', ex: 'Losing that job was a blessing in disguise.' }
  ];

  /* ============================================================
     五、假英语警告 —— 中国学生高频错误
     ============================================================ */
  var FAKE_ENGLISH = [
    { wrong: 'How to say it in English?', right: 'How do you say this in English?', why: '英语的间接问句不用助动词 how，句中用 do you。' },
    { wrong: 'I very like it.', right: 'I like it very much. / I really like it.', why: 'very 不能直接修饰动词，只能修饰形容词或副词。' },
    { wrong: 'Although…, but…', right: 'Although… (不加 but) / Because… (不加 so)', why: '英语中一个从句只用一个连接词，中文的「虽然…但是」直译过来是错的。' },
    { wrong: 'I very like Chinese food.', right: 'I really like Chinese food.', why: '同上，very 修饰名词短语需用 really / very much。' },
    { wrong: 'open the light.', right: 'turn on the light.', why: '「开灯」用 turn on，「关灯」turn off。open 是打开门窗。' },
    { wrong: 'close the light.', right: 'turn off the light.', why: '同上。' },
    { wrong: 'I want to marry with him.', right: 'I want to marry him.', why: 'marry 本身是及物动词，不加 with。be married to 才是介词。' },
    { wrong: 'He is interesting.', right: 'He is interesting. / He is interested.', why: '这两个都对但意思不同：interesting 是「他这个人有趣」，interested 是「他对某事感兴趣」。' },
    { wrong: 'yesterday I go to school.', right: 'yesterday I went to school.', why: '有 yesterday 等时间词时用过去时。' },
    { wrong: 'I go there last week.', right: 'I went there last week.', why: '同上。' },
    { wrong: 'I am agree.', right: 'I agree.', why: 'agree 本身是动词，不与 be 动词连用。' },
    { wrong: 'I very much like it.', right: 'I like it very much.', why: 'very much 要紧跟被修饰的动词或形容词，不能放句首修饰动词。' },
    { wrong: 'Please give me a call back.', right: 'Please call me back.', why: 'call back 是动词短语，不能再加 give me。' },
    { wrong: 'I go to home.', right: 'I go home.', why: 'home 在此是副词，不加 to。I go to my home 可以。' },
    { wrong: 'The weather is very hot today, isn\'t it?', right: 'The weather is very hot today, isn\'t it?', why: '✅ 这句是对的，但注意反义疑问句部分需用陈述句语序。' },
    { wrong: 'Peoples are different.', right: 'People are different.', why: 'people 本身是复数，不加 -s。peoples 特指「民族」。' },
    { wrong: 'He has a advice.', right: 'He has some advice.', why: 'advice 是不可数名词，没有复数形式。' },
    { wrong: 'I need many informations.', right: 'I need a lot of information.', why: 'information 不可数。' },
    { wrong: 'My English is poor.', right: 'My English is poor.', why: '✅ 正确。但注意说「我英语差」用 My English is weak 也很常见。' },
    { wrong: 'Do you understand me?', right: 'Do you understand me?', why: '✅ 正确。' },
    { wrong: 'I think it is not good.', right: 'I don\'t think it\'s good.', why: '英语偏好「I don\'t think + 肯定句」，而非「I think + 否定句」。' }
  ];

  /* ============================================================
     六、日常场景对话 —— 扩充版（高频生活场景）
     ============================================================ */
  var DAILY_SCENES = [
    {
      id: 'd-01', lv: 'L1', title: '超市购物', titleCn: '在超市买东西', minutes: 5,
      goal: '能问价格、找商品、结账，并听懂促销信息',
      challenge: '全程不问「这个怎么说」完成一次结账',
      lines: [
        { who: 'A', en: 'Excuse me, where can I find the milk?', cn: '打扰一下，牛奶在哪里？', focus: 'where can I find + 物品，是问路的万能句式。', tip: '比 "where is milk" 礼貌得多。' },
        { who: 'B', en: 'Aisle 5, next to the yogurt.', cn: '第 5 通道，在酸奶旁边。', focus: 'Aisle /aɪl/ 读同「ale」，是超市的纵向货架通道。', tip: '美国超市常说 Aisle 3，编号从入口往里。' },
        { who: 'A', en: 'Got it. Thanks!', cn: '知道了，谢谢！', focus: 'Got it 是「懂了」，比 OK 更口语。', tip: '自然对话中极少用「You\'re welcome」。' },
        { who: 'A', en: 'Excuse me, this is on sale, right?', cn: '这个在打折吧？', focus: 'on sale 在打折（美式）；英式常说 off / reduced。', tip: '注意 sale 在美式有「降价」，英式 sale 常见「特卖会」。' },
        { who: 'B', en: 'Yep, buy one, get one free this week.', cn: '是的，本周买一送一。', focus: 'buy one, get one free (BOGO) 是超市最常见的促销话术。', tip: '「买一送一」不是译成 buy two get one free。' },
        { who: 'A', en: 'Sounds good. I\'ll take two.', cn: '不错，我拿两盒。', focus: 'I\'ll take… 是买东西的固定说法，不是 I want。', tip: '⚠️ 中国学生爱说 I want this，但英美母语者说 I\'ll take it 或 Can I get this, please。' },
        { who: 'B', en: 'Anything else?', cn: '还需要别的吗？', focus: '结账前的万能问句。', tip: '不想买了就说 "That\'s all, thank you."' },
        { who: 'A', en: 'That\'s all. Where do I pay?', cn: '就这些。在哪儿结账？', focus: 'pay 比 buy 更常用于结账环节。', tip: '自助结账叫 self-checkout，扫条形码叫 scan the barcode。' },
        { who: 'B', en: 'Cash register is at the front, on the right.', cn: '收银台在前面右边。', focus: 'cash register 就是超市收银台。', tip: '「排队」是 line up / queue up，英式多用 queue。' }
      ]
    },
    {
      id: 'd-02', lv: 'L1', title: 'Seeing a Doctor', titleCn: '看医生', minutes: 6,
      goal: '能描述症状（身体部位+症状+持续时间）',
      challenge: '用「I\'ve had a… for two days」句式描述症状',
      lines: [
        { who: 'A', en: 'What seems to be the problem?', cn: '哪里不舒服？', focus: 'What seems to be the problem 是医生问诊的标准开场。', tip: 'seems 保留了医生不确定的语气。' },
        { who: 'B', en: 'I\'ve had a sore throat for two days.', cn: '我嗓子疼两天了。', focus: '现在完成时 + for + 时间段，表示症状持续多久。', tip: '⚠️ 关键句型。看医生必须说「持续多久」，医生据此判断。' },
        { who: 'A', en: 'Any fever or cough?', cn: '有发烧或者咳嗽吗？', focus: 'Any…? 用于询问「有没有」，比 Do you have 更简练。', tip: 'fever 发烧不可数，说 have a fever 或 have fever 都行。' },
        { who: 'B', en: 'I have a mild fever, but no cough.', cn: '有点低烧，但没咳嗽。', focus: 'mild 是「轻微的」，mild pain / mild fever 都很常用。', tip: '表达「有没有症状」用 have，不要用 I have a cough 之外的形式。' },
        { who: 'A', en: 'Let me take a look. Open your mouth, please.', cn: '我看看。请张开嘴。', focus: 'take a look 是「看一眼」，let me… 是提供帮助的固定结构。', tip: 'let me 后接动词原形。' },
        { who: 'B', en: 'Is it serious?', cn: '严重吗？', focus: '患者最常问的一句，务必学会。', tip: '医生通常会回 "It\'s nothing serious."（不严重）' },
        { who: 'A', en: 'Just a common cold. Drink plenty of water and rest.', cn: '就是普通感冒。多喝水，休息。', focus: 'plenty of + 不可数名词，drink plenty of water 是医嘱高频。', tip: 'plenty of 意为「大量的」。' },
        { who: 'B', en: 'Got it. Thanks, doctor.', cn: '明白了，谢谢医生。', focus: '叫 doctor 时不用加 Mr/Dr，正式场合才用。', tip: '⚠️ 英语中称呼医生直接用 Doctor 即可，不说「Doctor Wang」除非知道姓氏。' }
      ]
    },
    {
      id: 'd-03', lv: 'L2', title: 'Renting an Apartment', titleCn: '租房看房', minutes: 8,
      goal: '能问清房租、押金、合同与房���条件',
      challenge: '用「Is it… included in the rent?」询问费用包含项',
      lines: [
        { who: 'A', en: 'How much is the rent per month?', cn: '月租多少？', focus: 'per month 修饰时间频率，How much is… 是价格问句核心。', tip: 'per = 每，per week / per year 同理。' },
        { who: 'B', en: 'Twelve hundred a month, utilities not included.', cn: '1200 一个月，水电不含。', focus: 'utilities 指水电气等公用事业费，是租房必备词。', tip: 'utilities 在美式读 /juːˈtɪlətiz/，读三音节。' },
        { who: 'A', en: 'Got it. What about the deposit?', cn: '那押金呢？', focus: 'deposit 押金，退租时退还（若无损坏）。', tip: '押金通常是 1-2 个月租金。' },
        { who: 'B', en: 'One month\'s rent, refundable when you move out.', cn: '一个月租金，退租时退还。', focus: 'refundable 可退还的，对应名词 refund。', tip: 'move out 是「搬出」，move in 是「搬入」。' },
        { who: 'A', en: 'Is internet included in the rent?', cn: '房租含网费吗？', focus: 'internet 不可数，常说 internet is included。', tip: 'included in = 包含在…里面。' },
        { who: 'B', en: 'No, the internet is separate. It\'s about forty dollars.', cn: '不含，要单独交，大概 40 美元。', focus: 'separate 单独的，意为「不包含在内」。', tip: '三十到五十美元是美式常见网费。' },
        { who: 'A', en: 'How long is the lease?', cn: '租期多长？', focus: 'lease 租约，固定期限的租约。', tip: 'month-to-month 是按月租，12-month lease 是签一年。' },
        { who: 'B', en: 'It\'s a one-year lease, but you can break it with 30 days\' notice.', cn: '一年租约，但提前 30 天通知可以解约。', focus: 'notice 在此是「提前告知」，break the lease 意为解约。', tip: '30 days\' notice 是美国租客的基本权利。' },
        { who: 'A', en: 'That works for me. When can I move in?', cn: '那我可以，什么时候能入住？', focus: 'move in 入住，move in date 入住日期。', tip: '看房满意后立刻问入住时间，推进签约。' }
      ]
    },
    {
      id: 'd-04', lv: 'L2', title: 'Small Talk at a Party', titleCn: '派对上的闲聊', minutes: 7,
      goal: '能自然接话、延续对话、礼貌结束对话',
      challenge: '用「So, how do you know the host?」延续话题 3 轮',
      lines: [
        { who: 'A', en: 'Hi! I don\'t think we\'ve met. I\'m Sam.', cn: '你好！好像我们还没见过，我叫 Sam。', focus: 'I don\'t think we\'ve met 是初次见面最自然的自我介绍开场。', tip: '比 "What\'s your name" 礼貌得多，后者显得对方你都没记住。' },
        { who: 'B', en: 'Nice to meet you. I\'m Alex.', cn: '很高兴认识你，我叫 Alex。', focus: 'Nice to meet you 后不再加 I\'m 也可以。', tip: 'A 说 "Nice to meet you"，B 回 "Nice to meet you too." 不用重复 I\'m。' },
        { who: 'A', en: 'So, how do you know the host?', cn: '那你是怎么认识主人的？', focus: 'how do you know + 人的标准问句，用来延续话题。', tip: '⚠️ 派对闲聊的核心技巧：问一个开放问题，别问封闭式 yes/no 问题。' },
        { who: 'B', en: 'We used to work together. And you?', cn: '我们以前是同事。你呢？', focus: 'used to do 表示「过去常常（现已不）」。', tip: 'used to + 动词原形，表示过去的习惯。' },
        { who: 'A', en: 'I went to college with her.', cn: '我和她是大学同学。', focus: 'went to college with sb 是「和某人同校」。', tip: '「大学同学」最自然的说法就是 went to college with。' },
        { who: 'B', en: 'Oh nice, that explains a lot. So what do you do?', cn: '那解释得通了。你做什么工作？', focus: 'that explains a lot 是「难怪」，说明你理解了对方的话。', tip: 'avoid asking about salary — 这是英美社交潜规则。' },
        { who: 'A', en: 'I work in design. And you?', cn: '我做设计。你呢？', focus: 'what do you do 是问职业的日常问法。', tip: '和 What are you? 相比，what do you do 更自然。' },
        { who: 'B', en: 'I\'m in marketing. Anyway, it\'s getting late — I should head out.', cn: '我做市场的。总之不早了，我该走了。', focus: 'head out 意为「出发/离开」，比 leave 更口语。', tip: '「我该走了」是得体的结束信号。' },
        { who: 'A', en: 'Yeah, me too. It was great chatting with you!', cn: '对，我也是。跟你聊得很开心！', focus: 'It was great chatting with you 是完美的告别语。', tip: '比 Goodbye 温暖得多，是派对散场的标配。' }
      ]
    },
    {
      id: 'd-05', lv: 'L2', title: 'Getting a Taxi', titleCn: '打车', minutes: 5,
      goal: '能确认目的地、上车前确认价格、评价行程',
      challenge: '上车前用「Is it… to the airport?」确认目的地',
      lines: [
        { who: 'A', en: 'Hi, is this cab free?', cn: '你好，这辆出租车空着吗？', focus: 'Is this cab free? 问「有没有被占用」，比 Is it free?（问是否免费）更准确。', tip: '⚠️ 这是中国学生常错点。问「车空不空」用 free，问「要不要钱」也用 free，靠语境区分。' },
        { who: 'B', en: 'Yes, where are you headed?', cn: '是的，您要去哪？', focus: 'where are you headed 是问目的地的地道说法。', tip: 'head for / be headed to 意为「前往」。' },
        { who: 'A', en: 'To the train station, please.', cn: '请去火车站。', focus: '介词 to 开头表示目的地。', tip: '「去某地」用 to 开头：To the airport, please.' },
        { who: 'B', en: 'Sure. Traffic is bad today though — might take longer.', cn: '没问题。不过今天堵车，可能会久一点。', focus: 'might take longer 表示不确定预期，主动告知。', tip: 'though 放在句中作让步，意为「不过」。' },
        { who: 'A', en: 'No problem. How much is it going to be?', cn: '没事。大概要多少钱？', focus: 'How much is it going to be? 询问预估费用。', tip: '比 How much will it cost? 更日常。' },
        { who: 'B', en: 'Around twenty bucks, depending on the meter.', cn: '大概 20 块，看计价器。', focus: 'bucks 是 dollar 的口语说法。', tip: 'meter 指出租车计价器。' },
        { who: 'A', en: 'Great. Do you take card?', cn: '好的。能刷卡吗？', focus: '「刷��」是 take card 或 swipe，不是 pay by card（虽然也行）。', tip: 'swipe 指刷卡动作，口语常用。' },
        { who: 'B', en: 'Sure, just tap when we get there.', cn: '可以，到站时您刷一下就行。', focus: 'tap 指「碰一下」支付，Apple Pay 时代的说法。', tip: '较新的表达，cash 也仍常见。' },
        { who: 'A', en: 'Here you go. Can you drop me at the corner?', cn: '给您。能停在那个路口吗？', focus: 'drop sb at + 地点 是「把某人放在某处」。', tip: 'drop off 意为「下车」，pick up 意为「上车/接人」。' }
      ]
    },
    {
      id: 'd-06', lv: 'L3', title: 'Complaining Politely', titleCn: '投诉与提意见', minutes: 8,
      goal: '能在不冒犯对方的前提下指出问题并提出要求',
      challenge: '用「I\'d appreciate it if you could…」提出具体诉求',
      lines: [
        { who: 'A', en: 'I\'m calling about an issue with my order.', cn: '我打电话是想反映一下订单的问题。', focus: 'calling about an issue with… 是投诉电话的标准开场。', tip: 'issue 比 problem 更中性，适合正式场合。' },
        { who: 'B', en: 'I\'m sorry to hear that. Could you describe the problem?', cn: '很抱歉。能描述一下问题吗？', focus: 'I\'m sorry to hear that 是客服标准道歉，比 I\'m sorry 更有同理心。', tip: '注意 to hear that 结构，不可说 sorry to hear the problem。' },
        { who: 'A', en: 'The delivery was three days late, and two items were damaged.', cn: '配送晚了三天，有两件商品还破损了。', focus: '陈述事实（延迟天数、损坏件数），避免情绪化用词。', tip: '投诉技巧：先说事实，再提诉求。不要先说「你们太差了」。' },
        { who: 'B', en: 'I\'m sorry about that. Let me check your order.', cn: '很抱歉。我查一下您的订单。', focus: 'let me check 是「我来查一下」，给客户一个明确的下一步。', tip: '每个环节都给出下一步，是客服的基本功。' },
        { who: 'A', en: 'I\'d appreciate it if you could send a replacement this week.', cn: '如果你们本周能补发替换品，我会很感激。', focus: 'I\'d appreciate it if you could… 是最礼貌的请求句式（比 I want you to 强得多）。', tip: '⚠️ 商务核心句式。I want 是命令，I\'d appreciate 是请求。' },
        { who: 'B', en: 'That\'s reasonable. I can dispatch a replacement tomorrow.', cn: '这要求合理。我明天就能安排补发。', focus: 'That\'s reasonable 先认同诉求合理，再给方案。', tip: '先认同再解决，比直接说 yes 更有同理心。' },
        { who: 'A', en: 'That would be great. Could you send me a confirmation email?', cn: '那太好了。能给我发封确认邮件吗？', focus: 'That would be great 是同意时的自然回应，比 Yes 好。', tip: '留书面记录是好习惯，对方也更愿意接受你的诉求。' },
        { who: 'B', en: 'Absolutely. You\'ll have it by end of day.', cn: '没问题，今天下班前您会收到。', focus: 'by end of day (EOD) 是时限的明确表达。', tip: 'EOD / EOW 是职场缩写：end of day / end of week。' },
        { who: 'A', en: 'Great, I appreciate your help.', cn: '好的，谢谢你的帮助。', focus: 'appreciate 后直接跟名词或动名词，不加 for。', tip: '⚠️ I appreciate your help 正确，I appreciate for your help 错误。' }
      ]
    },
    {
      id: 'd-07', lv: 'L3', title: 'Debating an Issue', titleCn: '讨论与辩论', minutes: 10,
      goal: '能表达立场、给出理由、用数据支撑、回应反对',
      challenge: '用「That\'s a fair point, however…」回应一次质疑',
      lines: [
        { who: 'A', en: 'I\'d like to argue that remote work improves productivity.', cn: '我想论证远程办公能提升生产力。', focus: 'I\'d like to argue that… 是提出论点的正式句式。', tip: 'argue that 后面接完整句子。' },
        { who: 'B', en: 'That\'s a strong claim. What\'s your evidence?', cn: '这是很强的论断。有什么证据？', focus: 'What\'s your evidence? 是学术讨论的标准追问。', tip: 'strong claim 表示质疑但不失礼。' },
        { who: 'A', en: 'A 2022 Stanford study found a 13% increase in output.', cn: '斯坦福 2022 年的一项研究发现产出提升了 13%。', focus: 'find + 过去分词，表示「研究得出结果」。', tip: '引用数据时加上来源和时间，论证才有分量。' },
        { who: 'B', en: 'But isn\'t that just self-reported data?', cn: '但那不都是自我报告的数据吗？', focus: 'self-reported data 指问卷调查式的主观数据，可信度较低。', tip: '学术反驳常用 "But isn\'t…" 开头。' },
        { who: 'A', en: 'That\'s a fair point. However, the follow-up interviews addressed that.', cn: '这观点有道理。不过后续访谈弥补了这一点。', focus: 'That\'s a fair point, however… 是先认同再转折的标准答辩结构。', tip: '⚠️ 不要说 "But I disagree" 直接硬顶，先认同再转折更有说服力。' },
        { who: 'B', en: 'How did those interviews address the bias?', cn: '那些访谈如何解决这个偏差？', focus: 'address 在此意为「处理、解决」，不是「地址」。', tip: 'address a problem / issue 是高频固定搭配。' },
        { who: 'A', en: 'They triangulated with manager assessments, which were independent.', cn: '他们与管理层的独立评估做了三角验证。', focus: 'triangulate 是研究方法术语「三角验证」，学术词汇。', tip: '独立评估 = independent assessment。' },
        { who: 'B', en: 'Okay, I\'m partially convinced. But isn\'t there a cost to isolation?', cn: '好吧，我有点被说服了。但难道没有孤立的代价吗？', focus: 'partially convinced 是「部分接受」，比 fully convinced 留余地。', tip: '「部分同意」在英语辩论中是安全且专业的姿态。' },
        { who: 'A', en: 'There is, for new hires. That\'s why I\'d propose a hybrid model.', cn: '有，对新员工而言。所以我建议混合模式。', focus: 'That\'s why 引出结论建议，是逻辑收尾。', tip: 'I\'d propose that… 比 I think we should 更正式。' }
      ]
    },
    {
      id: 'd-08', lv: 'L3', title: 'Making Arrangements', titleCn: '约时间与改期', minutes: 7,
      goal: '能提议时间、协商冲突、确认安排',
      challenge: '用「Would it work if we pushed it to…?」协商改期',
      lines: [
        { who: 'A', en: 'Are you free Thursday afternoon?', cn: '你周四下午有空吗？', focus: 'Are you free + 时间，是约时间的直接问法。', tip: 'free 在这里是形容词「空闲的」。' },
        { who: 'B', en: 'I have a conflict, actually. Could we do Friday?', cn: '我周四其实有安排。能改周五吗？', focus: 'I have a conflict 是委婉说法，比 I\'m busy 客气。', tip: 'Conflict 在职场指「日程冲突」。' },
        { who: 'A', en: 'Friday could work. Would morning or afternoon suit you better?', cn: '周五可以。上午还是下午对你更方便？', focus: 'Would X suit you better? 是询问偏好的礼貌句式。', tip: 'suit 比 like 更适合询问时间偏好。' },
        { who: 'B', en: 'Afternoon is better for me. Say, 2 o\'clock?', cn: '下午比较好。两点怎么样？', focus: 'Say 是提议时间的柔和说法，比 What about 更随意。', tip: '「Say 2 o\'clock?」是很地道的英式提议。' },
        { who: 'A', en: 'Let me check my calendar and get back to you.', cn: '我查一下日程再答复你。', focus: 'check my calendar 是「查日程」的固定说法。', tip: 'get back to you 是「回头答复你」，拖延的礼貌表达。' },
        { who: 'B', en: 'Sure, no rush. Let me know by tomorrow?', cn: '好的，不急。明天之前告诉我行吗？', focus: 'no rush 表示不着急，是给对方空间。', tip: 'push for a deadline 用 By when? 比 Can you… 更直接。' },
        { who: 'A', en: 'Actually, something just came up. Can we push it to Monday?', cn: '不好意思，突然有事。能推到周一吗？', focus: 'something came up 是「临时有事」，最常用的爽约理由。', tip: '⚠️ 请配合 apology，用 excuse me + something came up 不失礼。' },
        { who: 'B', en: 'No problem at all. Monday works.', cn: '完全没问题。周一可以。', focus: 'No problem at all 是最自然的同意，比 No 更好。', tip: '英语里单独说 No 听起来很不耐烦。' },
        { who: 'A', en: 'Great — I\'ll send an invite. Looking forward to it.', cn: '好，我发个邀请。很期待。', focus: 'I\'ll send an invite 是确认安排的具体动作。', tip: 'Looking forward to it 表示期待，是得体的收尾。' }
      ]
    }
  ];

  /* ============================================================
     七、语域速查表 —— 同一意思的多种说法
     ============================================================ */
  var REGISTER_TABLE = [
    { meaning: '好', R1: 'excellent / outstanding', R2: 'great / very good', R3: 'awesome / fantastic', R4: 'dope / fire', note: 'R4 的 dope 源自黑人俚语，有种族敏感。' },
    { meaning: '不好', R1: 'poor / unacceptable', R2: 'bad / not good', R3: 'terrible / awful', R4: 'trash / garbage', note: 'garbage 在美式也常指「垃圾食品」。' },
    { meaning: '非常', R1: 'exceedingly / profoundly', R2: 'very / extremely', R3: 'super / really', R4: 'insanely / hella', note: 'hella 源自湾区俚语，已进入主流。' },
    { meaning: '说', R1: 'state / express', R2: 'say / tell me', R3: 'go / shoot the breeze', R4: 'yap / gas', note: 'gas 在俚语中意为「说废话」。' },
    { meaning: '不懂', R1: 'I do not understand', R2: 'I don\'t get it', R3: 'I\'m lost / I have no idea', R4: 'I\'m clueless', note: 'I\'m lost 意为「我迷路了」，引申为「听不懂」。' },
    { meaning: '同意', R1: 'I agree / That is correct', R2: 'Sure / Absolutely', R3: 'For sure / You\'re right', R4: 'Facts / True', note: 'Facts 是网络流行语，单独发出表示「确实如此」。' },
    { meaning: '钱', R1: 'money / funds', R2: 'money', R3: 'cash / dough', R4: 'moolah / bread', note: 'bread 源自俚语，含义是钱。' },
    { meaning: '工作', R1: 'employment / occupation', R2: 'job / work', R3: 'gig / gig', R4: 'hustle / grind', note: 'gig 特指短期或自由职业。' },
    { meaning: '疲劳', R1: 'fatigued / exhausted', R2: 'tired', R3: 'wiped out / beat', R4: 'dead / shattered', note: 'wiped out 意为「累瘫了」，英式常用。' },
    { meaning: '离开', R1: 'depart / leave', R2: 'leave / go', R3: 'head out / bounce', R4: 'dip / peace out', note: 'dip 是俚语的「溜走」，现在很常见。' },
    { meaning: '看', R1: 'observe / examine', R2: 'look at / watch', R3: 'check out / look at', R4: 'peep / catch a look', note: 'catch a look 是「看一眼」。' },
    { meaning: '吃', R1: 'consume / eat', R2: 'eat / have', R3: 'grab a bite / chow down', R4: 'munch / scarf down', note: 'grab a bite 是「随便吃点」，非常高频。' }
  ];

  global.SlangContent = {
    R: R,
    REGISTER_GUIDE: REGISTER_GUIDE,
    PHRASES: PHRASES,
    SLANG: SLANG,
    IDIOMS: IDIOMS,
    FAKE_ENGLISH: FAKE_ENGLISH,
    DAILY_SCENES: DAILY_SCENES,
    REGISTER_TABLE: REGISTER_TABLE,
    /** 合并所有日常词汇，供自测出题使用 */
    allWords: function () {
      var out = [];
      PHRASES.forEach(function (g) {
        g.items.forEach(function (x) {
          out.push({ w: x.en, cn: x.cn, p: '短语', th: g.cat, lv: 'L2', ex: '', r: x.r });
        });
      });
      SLANG.forEach(function (g) {
        g.items.forEach(function (x) {
          out.push({ w: x.w, cn: x.cn, p: '俚语', th: g.cat, lv: 'L4', ex: x.ex || '', r: x.r, formal: x.formal, tip: x.tip });
        });
      });
      return out;
    },
    phraseCount: function () {
      var n = 0;
      PHRASES.forEach(function (g) { n += g.items.length; });
      return n;
    },
    slangCount: function () {
      var n = 0;
      SLANG.forEach(function (g) { n += g.items.length; });
      return n;
    }
  };
})(window);