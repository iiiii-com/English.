/* ============================================================
   content-vocab.js —— 词汇学习内容
   1) 核心词精讲卡（含音标、真实例句、易混词辨析）
   2) 词汇自测题生成器（按等级+主题动态出题）
   音标采用国际音标（美式），标注 * 为可点击朗读
   ============================================================ */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------
     一、核心高频词精讲卡
     这些词零基础必须先掌握，覆盖 L1~L2 最高频部分。
     key = 单词，音标为美式 IPA。
     ------------------------------------------------------------ */
  var CORE = [
    {
      w: 'be', ipa: '/biː/', pos: '动词', cn: '是；存在',
      tip: 'be 动词的三种形式随人称和时态变化，这是中文母语者最容易错的地方。',
      forms: [['am', 'I am'], ['is', 'he/she/it is'], ['are', 'you/we/they are']],
      ex: [['I am a beginner.', '我是个初学者。'], ['She is my colleague.', '她是我同事。'], ['They are very kind.', '他们很友好。']],
      confuse: 'be（是）/ do（做）/ have（有）三个动词空着时别用，不要说 "I am study"。'
    },
    {
      w: 'have', ipa: '/hæv/', pos: '动词', cn: '有；吃；进行',
      tip: 'have 也能当"进行时"结构：have + 过去分词 = 现在完成时。',
      ex: [['I have a question.', '我有个问题。'], ['She has two children.', '她有两个孩子。'], ['I have finished the report.', '我完成报告了。']],
      confuse: 'have 还是 has 跟 be 一样看人称：He/She/It has，其余 have。'
    },
    {
      w: 'do', ipa: '/duː/', pos: '动词', cn: '做；干（助动词）',
      tip: 'do 既表"做"，也作助动词：Do you like…? / I do not know.',
      ex: [['What do you do?', '你做什么工作？'], ['I do my best.', '我尽力了。'], ['Do you have time tomorrow?', '你明天有时间吗？']],
      confuse: 'Do not = don\'t；Does not = doesn\'t（第三人称单数要加 es）。'
    },
    {
      w: 'go', ipa: '/ɡoʊ/', pos: '动词', cn: '去；走',
      tip: 'go 的过去式是 went，不规则动词。',
      ex: [['I go to work by subway.', '我坐地铁上班。'], ['She went home early.', '她很早回家了。'], ["Let's go.", '我们走吧。']]
    },
    {
      w: 'get', ipa: '/ɡet/', pos: '动词', cn: '得到；到达；变得',
      tip: 'get 是万能动词：get up 起床、get better 变好、get to + 地点 到达。',
      ex: [['I got your email.', '我收到你的邮件了。'], ['It gets cold at night.', '晚上会变冷。'], ['Please get to the office by 9.', '请 9 点前到办公室。']],
      confuse: 'get to do（有空做）vs get sb to do（让某人做）'
    },
    {
      w: 'make', ipa: '/meɪk/', pos: '动词', cn: '做；制作；使得',
      tip: 'make 强调"制造结果"，do 强调"执行动作"。make a decision / do work。',
      ex: [['I make breakfast every day.', '我每天做早饭。'], ['She made a big mistake.', '她犯了个大错。'], ['That made me happy.', '那让我很开心。']]
    },
    {
      w: 'think', ipa: '/θɪŋk/', pos: '动词', cn: '想；认为',
      tip: 'think 表示"思考/认为"；think about 是"想某事"（更慢更刻意）。',
      ex: [['I think you are right.', '我觉得你说得对。'], ['I think about it a lot.', '我经常想这件事。'], ['What do you think?', '你觉得呢？']]
    },
    {
      w: 'need', ipa: '/niːd/', pos: '动词', cn: '需要',
      tip: 'need + to do 和 need + 名词都对：need to rest / need a break。',
      ex: [['I need a break.', '我需要休息一下。'], ['You need to sleep more.', '你需要多睡点。'], ['Do you need anything?', '你需要什么吗？']]
    },
    {
      w: 'want', ipa: '/wɑːnt/', pos: '动词', cn: '想要',
      tip: 'want to do 想做某事；want sb to do 想让某人做。',
      ex: [['I want to learn English.', '我想学英语。'], ['I want you to try it.', '我想让你试试。'], ['She wants more time.', '她想要更多时间。']]
    },
    {
      w: 'time', ipa: '/taɪm/', pos: '名词', cn: '时间；次；时代',
      tip: '三个常用结构：in time（及时）、on time（准时）、at the right time（恰当时候）。',
      ex: [['I have no time today.', '我今天没时间。'], ['The train is on time.', '火车准时。'], ['I have been there three times.', '我去过那儿三次。']]
    },
    {
      w: 'work', ipa: '/wɜːrk/', pos: '名词/动词', cn: '工作；运转',
      tip: 'work 可以是名词（工作）或动词（运转/有效）。',
      ex: [['Where do you work?', '你在哪工作？'], ['Does it work?', '它能用吗？'], ['I have a lot of work to do.', '我有很多活儿要做。']]
    },
    {
      w: 'people', ipa: '/ˈpiːpl/', pos: '名词', cn: '人们',
      tip: 'people 是复数，不能说 peoples（那是"民族"）。',
      ex: [['Many people work here.', '很多人在这儿工作。'], ['How many people did you meet?', '你见了多少人？'], ['People say it will rain.', '人们说要下雨了。']]
    },
    {
      w: 'because', ipa: '/bɪˈkɔːz/', pos: '连词', cn: '因为',
      tip: '回答 Why 一定要用 because 开头的完整句。',
      ex: [['I stayed home because I was tired.', '我待在家因为我累了。'], ['Why? — Because it was late.', '为什么？——因为太晚了。']],
      confuse: 'because（强理由）/ since / so（结果）。Do not 混用："Because it rained, so I stayed." 是错的。'
    },
    {
      w: 'but', ipa: '/bʌt/', pos: '连词', cn: '但是',
      tip: '转折词，不能和 although 同时出现在一句里。',
      ex: [['It is small but comfortable.', '它小但很舒服。'], ['I tried, but I failed.', '我试了，但失败了。']],
      confuse: 'although + 句子, but + 句子 → 二选一，不要都用。'
    },
    {
      w: 'question', ipa: '/ˈkwestʃən/', pos: '名词', cn: '问题',
      tip: '注意拼写：question 不是 quest（quest 是"追求"）。',
      ex: [['May I ask a question?', '我能问个问题吗？'], ['That is a good question.', '这是个好问题。'], ['I have a question about this.', '我有个关于这个的问题。']]
    },
    {
      w: 'about', ipa: '/əˈbaʊt/', pos: '介词', cn: '关于；大约',
      tip: 'a + 形容词 + about 表示"关于…的"，几乎固定。',
      ex: [['Tell me about yourself.', '说说你自己。'], ['It is about ten dollars.', '大约十美元。'], ['What is it about?', '这是关于什么的？']]
    },
    /* ---------- 第二批扩充（32 词，覆盖零基础必需高频） ---------- */
    {
      w: 'get', ipa: '/ɡet/', pos: '动词', cn: '得到；到达；变得',
      tip: 'get 是万能动词：得到=get、到达=get to、逐渐=get + adj。',
      ex: [['I get up at seven.', '我七点起床。'], ['I got your message.', '我收到你的消息了。'], ['It is getting cold.', '天越来越冷了。']],
      confuse: 'get to do（得以做）vs. do you get it（你懂吗）'
    },
    {
      w: 'make', ipa: '/meɪk/', pos: '动词', cn: '制作；使',
      tip: 'make + 人 + do（让某人做）vs. do + 人（自己动手做）。',
      ex: [['I make breakfast every day.', '我每天做早饭。'], ['She made me wait.', '她让我等。'], ['Don\'t make it so hard.', '别把它搞这么难。']],
      confuse: 'be made of（由…制成，成分改变）vs be made from（由…制成，原材料）'
    },
    {
      w: 'take', ipa: '/teɪk/', pos: '动词', cn: '拿；花费；乘坐',
      tip: 'take + 交通工具表示乘坐，但 in/by 用于大车。',
      ex: [['Take an umbrella.', '带把伞。'], ['It takes two hours.', '要两个小时。'], ['I take the subway to work.', '我坐地铁上班。']],
      confuse: 'take care（保重）vs take care of（照顾）'
    },
    {
      w: 'come', ipa: '/kʌm/', pos: '动词', cn: '来；到来',
      tip: 'come 的过去式 came 与 take 的过去式 took 元音相同，都是 /eɪ/ / /oʊ/。',
      ex: [['Come here, please.', '请过来。'], ['She came home late.', '她回家晚了。'], ['Something has come up.', '临时有点事。']],
      confuse: 'come to（总共达到）vs come from（来自）'
    },
    {
      w: 'want', ipa: '/wɑːnt/', pos: '动词', cn: '想要；需要',
      tip: 'want 后面接动词要加 to，不接动词原形。',
      ex: [['I want to learn English.', '我想学英语。'], ['She wants a cup of tea.', '她想要杯茶。'], ['I don\'t want any trouble.', '我不想惹麻烦。']],
      confuse: 'I want to go（我想去）vs I don\'t want to go（不想去）——否定在 want 之后'
    },
    {
      w: 'know', ipa: '/noʊ/', pos: '动词', cn: '知道；认识',
      tip: 'know 后面不能直接跟宾语，要用 know that / know how / know someone。',
      ex: [['I know the answer.', '我知道答案。'], ['I don\'t know how to swim.', '我不会游泳。'], ['Do you know him?', '你认识他吗？']],
      confuse: 'I know（表知识）vs I think（表推测）——不确定用 think'
    },
    {
      w: 'think', ipa: '/θɪŋk/', pos: '动词', cn: '想；认为',
      tip: 'think of（想到/考虑）vs think about（考虑）vs think over（细想）。',
      ex: [['I think you are right.', '我认为你是对的。'], ['What are you thinking of?', '你在想什么？'], ['Can I think it over?', '我能再想想吗？']],
      confuse: 'think 表推测要留有余地；I think so（我认为是的）比 Yes 更谨慎'
    },
    {
      w: 'need', ipa: '/niːd/', pos: '动词/名词', cn: '需要；必需品',
      tip: 'need + to do 或 need doing 都可以，口语中常省略 to。',
      ex: [['I need to sleep.', '我需要睡觉。'], ['You need a break.', '你需要休息。'], ['There\'s no need to worry.', '不用担心。']],
      confuse: 'must（必须，主观）vs need（需要，客观）'
    },
    {
      w: 'try', ipa: '/traɪ/', pos: '动词', cn: '尝试；努力',
      tip: 'try to do（努力做）vs try doing（试着做某事）。',
      ex: [['Try to relax.', '试着放松。'], ['I tried calling you.', '我试着给你打电话了。'], ['Just try it.', '试试看。']],
      confuse: 'try to do 表示"努力去做但可能失败"，try doing 表示"试着做看结果"'
    },
    {
      w: 'ask', ipa: '/æsk/', pos: '动词', cn: '问；要求',
      tip: 'ask 后接人，question 后接问题本身。',
      ex: [['Can I ask you something?', '我能问你件事吗？'], ['He asked me a question.', '他问了我一个问题。'], ['Ask for the bill.', '要账单。']],
      confuse: 'ask for（要求得到）vs ask about（询问关于）'
    },
    {
      w: 'tell', ipa: '/tel/', pos: '动词', cn: '告诉；分辨',
      tip: 'tell + 人 + 内容（不能 tell me that… 的直接宾语结构是 tell me about it）。',
      ex: [['Tell me the truth.', '告诉我实话。'], ['Can you tell me the time?', '能告诉我几点了吗？'], ['I can tell you are tired.', '我看得出你累了。']],
      confuse: 'tell（某人某事）vs say（说出内容）—— say 不能直接跟人'
    },
    {
      w: 'give', ipa: '/ɡɪv/', pos: '动词', cn: '给；提供',
      tip: 'give sb sth = give sth to sb，两种语序都对。',
      ex: [['Give me a call.', '给我打电话。'], ['He gave me a hand.', '他帮了我。'], ['Give it a try.', '试试看。']],
      confuse: 'give up（放弃）vs give in（屈服）vs give away（赠送/泄露）'
    },
    {
      w: 'put', ipa: '/pʊt/', pos: '动词', cn: '放；使处于',
      tip: 'put 的过去式 put 与原型同形，不规则但形式不变。',
      ex: [['Put it on the table.', '放在桌上。'], ['I put off the meeting.', '我推迟了会议。'], ['Put your phone down.', '放下手机。']],
      confuse: 'put on（穿上）vs wear（穿着，状态）'
    },
    {
      w: 'keep', ipa: '/kiːp/', pos: '动词', cn: '保持；保留',
      tip: 'keep + doing 表示"持续做"，keep sb doing 表示"让某人一直做"。',
      ex: [['Keep going.', '继续。'], ['Please keep the receipt.', '请保留收据。'], ['He kept me waiting.', '他让我一直等。']],
      confuse: 'keep（保持状态）vs put（放入状态）'
    },
    {
      w: 'let', ipa: '/let/', pos: '动词', cn: '让；允许',
      tip: 'let + 人 + 动词原形（不加 to）；let\'s = let us。',
      ex: [['Let me help you.', '让我帮你。'], ['Let\'s go.', '我们走吧。'], ['Don\'t let it go.', '别放过它。']],
      confuse: 'let sb do（让某人做）vs let sb have（让某人拥有）'
    },
    {
      w: 'help', ipa: '/help/', pos: '动词/名词', cn: '帮助',
      tip: 'help sb (to) do 或 help sb with sth。',
      ex: [['Can you help me?', '你能帮我吗？'], ['Help yourself.', '请自便。'], ['Thanks for your help.', '谢谢你的帮助。']],
      confuse: 'with 后接事物，to 后接动作'
    },
    {
      w: 'look', ipa: '/lʊk/', pos: '动词', cn: '看；看起来',
      tip: 'look at（看）vs look（看起来）vs look for（寻找）。',
      ex: [['Look at this.', '看这个。'], ['You look tired.', '你看起来很累。'], ['I\'m looking for my keys.', '我在找钥匙。']],
      confuse: 'see（看见结果）vs look at（主动看）vs watch（观看）'
    },
    {
      w: 'see', ipa: '/siː/', pos: '动词', cn: '看见；明白',
      tip: 'see + 宾语 + 补语：I see him run.（我看见他跑了）',
      ex: [['I see what you mean.', '我明白你的意思。'], ['Can you see the sign?', '你能看见那个牌子吗？'], ['I see.', '我明白了。']],
      confuse: 'I see（明白了）vs I watch（我在看）—— see 是瞬间，watch 是持续'
    },
    {
      w: 'hear', ipa: '/hɪr/', pos: '动词', cn: '听见；听说',
      tip: 'hear 与 see 结构相同：hear sb do（听见某人做）。',
      ex: [['I heard a noise.', '我听到一个声音。'], ['I didn\'t hear you.', '我没听到你说什么。'], ['Hear me out.', '听我说完。']],
      confuse: 'hear（听见）vs listen to（主动听）'
    },
    {
      w: 'feel', ipa: '/fiːl/', pos: '动词', cn: '感觉；觉得',
      tip: 'feel + 形容词（不用系动词 be）：I feel tired.（不是 I am feel）',
      ex: [['I feel better now.', '我现在好些了。'], ['How do you feel?', '你感觉怎么样？'], ['I felt embarrassed.', '我觉得尴尬。']],
      confuse: 'I feel + adj（状态）vs I am + adj（暂时状态）'
    },
    {
      w: 'become', ipa: '/bɪˈkʌm/', pos: '动词', cn: '变成；成为',
      tip: 'become 是渐变过程，get 也可表渐变但更口语。',
      ex: [['She became a doctor.', '她成了医生。'], ['It\'s getting cold.', '天变冷了。'], ['He became famous overnight.', '他一夜成名。']],
      confuse: 'become + 形容词/名词（永久变化）vs get（口语，短暂）'
    },
    {
      w: 'begin', ipa: '/bɪˈɡɪn/', pos: '动词', cn: '开始',
      tip: 'begin to do 与 begin doing 完全等价。',
      ex: [['Let\'s begin.', '我们开始吧。'], ['It began to rain.', '开始下雨了。'], ['She began writing at dawn.', '她黎明开始写作。']],
      confuse: 'start（开始某事）vs begin（起始点，常用于 start to do）'
    },
    {
      w: 'speak', ipa: '/spiːk/', pos: '动词', cn: '说；讲',
      tip: 'speak to sb（与人说）vs speak about sth（谈论某事）。',
      ex: [['Can I speak to you?', '我能和你谈谈吗？'], ['They speak English at home.', '他们在家说英语。'], ['I\'ll speak to my boss.', '我会跟老板说。']],
      confuse: 'speak（开口说）vs talk（交谈）vs say（说出某句）'
    },
    {
      w: 'say', ipa: '/seɪ/', pos: '动词', cn: '说（某句话）',
      tip: 'say 不接人作直接宾语：说"告诉我"是 tell me，不是 say me。',
      ex: [['What did you say?', '你说什么？'], ['He said nothing.', '他什么也没说。'], ['She said she was tired.', '她说她累了。']],
      confuse: 'say（说内容）vs tell（告诉某人）vs speak（语言）'
    },
    {
      w: 'find', ipa: '/faɪnd/', pos: '动词', cn: '找到；发现',
      tip: 'find + 宾语 + 形容词：I find it easy.（不用 to be）',
      ex: [['I found the key.', '我找到钥匙了。'], ['I find it hard to focus.', '我发现很难集中注意力。'], ['How do you find this place?', '你觉得这地方怎么样？']],
      confuse: 'find（发现结果）vs look for（寻找过程）'
    },
    {
      w: 'work', ipa: '/wɜːrk/', pos: '动词/名词', cn: '工作；运转',
      tip: 'work at（为…工作）vs work in（在某领域）vs work out（算出/锻炼）。',
      ex: [['I work at a school.', '我在学校工作。'], ['She works in finance.', '她从事金融。'], ['It works out fine.', '结果还不错。']],
      confuse: 'work out（解决/锻炼）比 work（工作）多了"结果"或"锻炼"的意思'
    },
    {
      w: 'play', ipa: '/pleɪ/', pos: '动词', cn: '玩；演奏；扮演',
      tip: 'play + 乐器/运动 不加 the；play the piano / play football。',
      ex: [['I play tennis on Saturdays.', '我周六打网球。'], ['She plays the piano.', '她弹钢琴。'], ['He played a key role.', '他扮演了关键角色。']],
      confuse: 'play（参与活动）vs do（做具体事）—— do the dishes（洗碗）不用 play'
    }
  ];

  /* ------------------------------------------------------------
     二、学习科学参数表（复习计划透明化）
     ------------------------------------------------------------ */
  var SCIENCE = {
    // SM-2 各评分对应的间隔与含义
    grades: [
      { q: 0, label: '完全忘记', hint: '想不起来', days: 0, color: '#e2585f' },
      { q: 1, label: '答错', hint: '想了很久才错', days: 0, color: '#ef8a5f' },
      { q: 2, label: '勉强想起', hint: '想了很久才答对', days: 1, color: '#f0a020' },
      { q: 3, label: '答对', hint: '正常反应时间', days: 2, color: '#4f9fe0' },
      { q: 4, label: '秒答', hint: '脱口而出', days: 4, color: '#22b07d' }
    ],
    // 遗忘曲线（Ebbinghaus 原始数据，无复习）
    forgetting: [
      { t: '20分钟', r: 0.58 }, { t: '1小时', r: 0.44 }, { t: '9小时', r: 0.36 },
      { t: '1天', r: 0.33 }, { t: '2天', r: 0.28 }, { t: '6天', r: 0.25 },
      { t: '31天', r: 0.21 }
    ],
    // 提取练习 vs 反复阅读（Karpicke & Roediger 2008）
    retrieval: [
      { label: '第1次', extract: 40, reread: 40 },
      { label: '第2次', extract: 56, reread: 40 },
      { label: '第3次', extract: 72, reread: 40 },
      { label: '1周后', extract: 80, reread: 40 }
    ]
  };

  /* ------------------------------------------------------------
     三、词汇测试出题器
     mode: 'cn2en' 中译英 / 'en2cn' 英译中 / 'listen' 听音辨义 / 'cloze' 句子填空
     ------------------------------------------------------------ */
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function sample(arr, n) { return shuffle(arr).slice(0, n); }

  /** 生成一道题 */
  function makeQuestion(word, pool, mode) {
    var distractors = pool.filter(function (x) { return x.id !== word.id; });
    var opts = sample(distractors, 3).map(function (x) { return { text: mode === 'en2cn' ? x.cn : x.w, ok: false }; });
    var answer = mode === 'en2cn' ? word.cn : word.w;
    opts.push({ text: answer, ok: true });
    opts = shuffle(opts);
    var q = { word: word, mode: mode, options: opts };
    if (mode === 'en2cn') q.prompt = word.w; else q.prompt = word.cn;
    if (mode === 'listen') { q.prompt = ''; q.options = sample(pool, 4).map(function (x) { return { text: x.cn, ok: x.id === word.id }; }); }
    if (mode === 'cloze') {
      var ex = word.ex || '';
      // 用搭配造句：把目标词替换成空格
      var idx = ex.toLowerCase().indexOf(word.w.toLowerCase());
      if (idx >= 0) {
        var masked = ex.slice(0, idx) + '_____' + ex.slice(idx + word.w.length);
        q.prompt = masked;
        q.hint = word.w.replace(/./g, '_');
      } else {
        q.prompt = word.cn;
        q.mode = 'cn2en';
        q.options = opts;
      }
    }
    return q;
  }

  function buildQuiz(level, theme, count) {
    var all = allWords();
    var pool = all.filter(function (w) {
      if (level && level !== 'ALL' && w.lv !== level) return false;
      if (theme && theme !== 'ALL' && w.th !== theme) return false;
      return true;
    });
    if (pool.length < 4) pool = all.filter(function (w) { return !level || level === 'ALL' || w.lv === level; });
    count = count || Math.min(12, pool.length);
    var mode = ['cn2en', 'en2cn', 'listen', 'cloze'][Math.floor(Math.random() * 4)];
    // 混合模式：一半中译英一半英译中，保证可评分
    return sample(pool, count).map(function (w) {
      return makeQuestion(w, pool, Math.random() < 0.5 ? 'cn2en' : mode);
    });
  }

  /** 取某等级（或全部）的主题列表。同时包含原词库与高考词库 */
  function themesOf(level) {
    var set = [];
    var pools = [
      (global.VOCAB_DATA && global.VOCAB_DATA.words) || [],
      (global.GAOKAO_DATA && global.GAOKAO_DATA.words) || []
    ];
    pools.forEach(function (pool) {
      pool.forEach(function (w) {
        if ((!level || level === 'ALL' || w.lv === level) && set.indexOf(w.th) < 0) set.push(w.th);
      });
    });
    return set;
  }

  /** 全部词库（原词库 + 高考词库） */
  function allWords() {
    return ((global.VOCAB_DATA && global.VOCAB_DATA.words) || [])
      .concat((global.GAOKAO_DATA && global.GAOKAO_DATA.words) || []);
  }

  function findWord(w) {
    var all = allWords();
    for (var i = 0; i < all.length; i++) if (all[i].w.toLowerCase() === String(w).toLowerCase()) return all[i];
    return null;
  }

  global.VocabContent = {
    CORE: CORE,
    SCIENCE: SCIENCE,
    buildQuiz: buildQuiz,
    themesOf: themesOf,
    findWord: findWord,
    shuffle: shuffle,
    sample: sample
  };
})(window);