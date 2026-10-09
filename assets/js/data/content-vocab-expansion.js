/* ============================================================
   content-vocab-expansion.js —— 核心词精讲扩充（43 → 85 词）
   承接 content-vocab.js 的 CORE 数组，结构完全一致：
     w 单词 / ipa 音标 / pos 词性 / cn 中文
     tip 用法要点 / ex 例句对 / confuse 易混辨析（可选）

   选词标准：零基础必须掌握的高频词，或中国学习者的高频错用词。
   排序：按认知难度从低到高，L1 优先。
   ============================================================ */
(function (global) {
  'use strict';

  var CORE = [
    /* ==================== 动词：核心高频 ==================== */
    {
      w: 'run', ipa: '/rʌn/', pos: '动词', cn: '跑；经营',
      tip: 'run 的过去式 ran 是高频不规则动词，注意与「现在分词 running」区分。',
      ex: [['She runs every morning.', '她每天早上跑步。'], ['The company runs three factories.', '这家公司经营三家工厂。'], ['Don\'t run in the hallway.', '别在走廊里跑。']],
      confuse: 'run（跑/经营）vs walk（走）vs jog（慢跑）'
    },
    {
      w: 'eat', ipa: '/iːt/', pos: '动词', cn: '吃',
      tip: 'eat 的过去式 ate 与 eight（八）同音，容易听错。',
      ex: [['I eat breakfast at seven.', '我七点吃早饭。'], ['We ate dinner early.', '我们很早吃了晚饭。'], ['Are you eating anything tonight?', '你今晚吃东西吗？']],
      confuse: 'eat（吃）vs have（吃/喝，口语更常用）'
    },
    {
      w: 'read', ipa: '/riːd/', pos: '动词', cn: '读',
      tip: 'read 的过去式 read 拼写相同但读音变浊：现在 /riːd/，过去 /red/。',
      ex: [['I read the news every morning.', '我每天早上看新闻。'], ['She read the whole book.', '她读完了整本书。'], ['Have you read it yet?', '你读完了吗？']],
      confuse: '⚠️ 拼写相同但读音不同：现在时 /riːd/，过去式 /red/'
    },
    {
      w: 'write', ipa: '/raɪt/', pos: '动词', cn: '写',
      tip: 'write 的 w 不发音，读作 /raɪt/。',
      ex: [['I write in a journal every night.', '我每晚写日记。'], ['She wrote a long email.', '她写了一封长邮件。'], ['Write it down before you forget.', '趁没忘写下来。']],
      confuse: 'write（写）vs ride（骑）vs right（右边）三词同音'
    },
    {
      w: 'sit', ipa: '/sɪt/', pos: '动词', cn: '坐',
      tip: 'sit 的过去式 sat 是高频不规则动词。',
      ex: [['Please sit down.', '请坐。'], ['She sat beside me.', '她坐在我旁边。'], ['We sat there for hours.', '我们在那儿坐了几个小时。']],
      confuse: 'sit（坐，状态）vs stand（站）'
    },
    {
      w: 'stand', ipa: '/stænd/', pos: '动词', cn: '站立；忍受',
      tip: 'stand 的过去式 stood 含 d 结尾，读作 /stʊd/。',
      ex: [['Don\'t stand in the doorway.', '别站在门口。'], ['He stood there waiting.', '他站在那儿等。'], ['I can\'t stand the heat.', '我受不了这heat。']],
      confuse: 'stand（站立/忍受）vs sit（坐）；can\'t stand 表「受不了」'
    },
    {
      w: 'sleep', ipa: '/sliːp/', pos: '动词', cn: '睡觉',
      tip: 'sleep 的过去式 slept 不规则，读作 /slept/。',
      ex: [['I sleep about seven hours.', '我睡大约七小时。'], ['She slept all morning.', '她睡了一上午。'], ['Did you sleep well?', '你睡得好吗？']],
      confuse: 'sleep（睡觉，强调过程）vs asleep（睡着的，状态）'
    },
    {
      w: 'buy', ipa: '/baɪ/', pos: '动词', cn: '买',
      tip: 'buy 的过去式 bought 含 gh：/bɔːt/。',
      ex: [['I bought this yesterday.', '我昨天买的这个。'], ['She bought two tickets.', '她买了两张票。'], ['Where did you buy it?', '你在哪买的？']],
      confuse: 'buy（买）vs by（在…旁）vs bye（再见）同音'
    },
    {
      w: 'bring', ipa: '/brɪŋ/', pos: '动词', cn: '带来',
      tip: 'bring 是「带来」（向说话人方向），take 是「带走」。',
      ex: [['Bring your notebook tomorrow.', '明天把笔记本带来。'], ['She brought me a gift.', '她给我带了礼物。'], ['I forgot to bring it.', '我忘了带。']],
      confuse: '⚠️ bring（带来）↔ take（带走）——中国学习者最常混用的一对'
    },
    {
      w: 'show', ipa: '/ʃoʊ/', pos: '动词', cn: '展示；演出',
      tip: 'show 的过去式是 showed（规则动词）。',
      ex: [['Show me how it works.', '给我演示一下怎么用。'], ['The film showed a different story.', '这部电影讲的是另一个故事。'], ['Can you show me around?', '你能带我参观一下吗？']],
      confuse: 'show sb sth = show sth to sb（两种语序都对）'
    },
    {
      w: 'learn', ipa: '/lɜːrn/', pos: '动词', cn: '学习；得知',
      tip: 'learn 强调「学会」（结果），study 强调「学习」（过程）。',
      ex: [['I learned English as an adult.', '我成年后才学英语。'], ['She learned the news yesterday.', '她昨天得知这个消息。'], ['I\'m learning to swim.', '我在学游泳。']],
      confuse: '⚠️ learn（学会）vs study（学习）——「我正在学」用 I am studying'
    },
    {
      w: 'teach', ipa: '/tiːtʃ/', pos: '动词', cn: '教',
      tip: 'teach 的过去式 taught 含 gh，读作 /tɔːt/。',
      ex: [['She teaches English.', '她教英语。'], ['He taught me a lot.', '他教会我很多。'], ['Can you teach me how to cook?', '你能教我做菜吗？']],
      confuse: 'teach sb sth = teach sth to sb'
    },
    {
      w: 'meet', ipa: '/miːt/', pos: '动词', cn: '遇见；见面',
      tip: 'meet 的过去式 met 是不规则动词。',
      ex: [['Nice to meet you.', '很高兴认识你。'], ['We met at a conference.', '我们在会上认识的。'], ['I met her two years ago.', '我两年前遇见她。']],
      confuse: 'Nice to meet you（初次见面）vs Nice to see you again（再见）'
    },
    {
      w: 'pay', ipa: '/peɪ/', pos: '动词', cn: '支付',
      tip: 'pay 的过去式 paid 与「paid 付费」同形。',
      ex: [['I paid by card.', '我刷卡付的。'], ['How much did you pay?', '你付了多少？'], ['You can pay in cash.', '你可以现金支付。']],
      confuse: 'pay for sth（为某物付钱）vs pay sb（付给某人）'
    },
    {
      w: 'buy / sell', ipa: '/baɪ/ /sel/', pos: '动词', cn: '买 / 卖',
      tip: 'buy 的反义词是 sell，不规则过去式 sold。',
      ex: [['They sell secondhand books.', '他们卖二手书。'], ['She sold her car last year.', '她去年卖了车。'], ['I bought it for fifty yuan.', '我花五十买下的。']],
      confuse: 'buy（买）↔ sell（卖）——过去式都是 sold，但 sold 也表示「已售出」'
    },

    /* ==================== 动词：进阶与易错 ==================== */
    {
      w: 'borrow / lend', ipa: '/ˈbɑːroʊ/ /lend/', pos: '动词', cn: '借入 / 借出',
      tip: 'borrow 是「借入」（主语是借的人），lend 是「借出」（主语是借东西的人）。',
      ex: [['Can I borrow your pen?', '我能借你的笔吗？'], ['I lent him my bike.', '我把自行车借给了他。'], ['He borrowed money from the bank.', '他从银行借了钱。']],
      confuse: '⚠️ borrow from sb / lend to sb ——方向最容易搞反的一对动词'
    },
    {
      w: 'rise / raise', ipa: '/raɪz/ /reɪz/', pos: '动词', cn: '上升 / 举起；提高',
      tip: 'rise 是不及物（自己升），raise 是及物（使某物升）。',
      ex: [['Prices rose last year.', '去年物价上涨了。'], ['The company raised prices.', '公司提高了价格。'], ['The sun rises in the east.', '太阳从东方升起。']],
      confuse: '⚠️ rise（不及物）vs raise（及物）——能否带宾语是关键'
    },
    {
      w: 'lie / lay', ipa: '/laɪ/ /leɪ/', pos: '动词', cn: '躺 / 放置',
      tip: 'lie（躺，不及物）过去式 lay；lay（放置，及物）过去式 laid。',
      ex: [['The book lies on the table.', '书在桌上。'], ['She laid it down gently.', '她轻轻放下它。'], ['He lay there for an hour.', '他躺了一小时。']],
      confuse: '⚠️ lay 的过去式与 lie 的原形同形，务必区分：lie-lay-laid 躺，lay-laid-laid 放'
    },
    {
      w: 'win / beat', ipa: '/wɪn/ /biːt/', pos: '动词', cn: '赢 / 打败',
      tip: 'win 后面接比赛或奖品；beat 后面接人或队伍。',
      ex: [['Our team won the game.', '我们队赢了比赛。'], ['We beat their team 3-1.', '我们以3比1打败了他们。'], ['She won first prize.', '她获得一等奖。']],
      confuse: '⚠️ win the game（赢比赛）vs beat the other team（打败队伍）——不能说 win their team'
    },
    {
      w: 'spend / cost / take', ipa: '/spend/ /kɔːst/ /teɪk/', pos: '动词', cn: '花费',
      tip: 'spend 的宾语是「人」或「时间/金钱」，cost 的主语是「物」。',
      ex: [['I spent two hours on it.', '我在这上面花了两小时。'], ['It cost me fifty yuan.', '它花了我五十块。'], ['It took an hour to finish.', '完成花了一个小时。']],
      confuse: '⚠️ sb spends time/money / sth costs money / sth takes time'
    },
    {
      w: 'reach / arrive', ipa: '/riːtʃ/ /əˈraɪv/', pos: '动词', cn: '到达',
      tip: 'arrive 是不及物动词，必须配介词（at/in）；reach 是及物，直接接地点。',
      ex: [['I arrived at the station.', '我到了车站。'], ['We arrived in London.', '我们到了伦敦。'], ['Just call me when you arrive.', '你到了给我打电话。']],
      confuse: '⚠️ arrive at（小地方）vs arrive in（大地方）；reach 无需介词'
    },
    {
      w: 'listen / hear', ipa: '/ˈlɪsn/ /hɪr/', pos: '动词', cn: '听',
      tip: 'listen 是主动听（listen to），hear 是听到结果（不强调动作）。',
      ex: [['Listen to me carefully.', '仔细听我说。'], ['I can\'t hear you.', '我听不清你。'], ['I wasn\'t listening.', '我当时没在听。']],
      confuse: '⚠️ listen to（主动听）vs hear（听到）——中国学习者常漏掉 to'
    },
    {
      w: 'look / see / watch', ipa: '/lʊk/ /siː/ /wɑːtʃ/', pos: '动词', cn: '看',
      tip: 'look 是「看这个动作」，see 是「看见结果」，watch 是「观看」。',
      ex: [['Look at this photo.', '看这张照片。'], ['I can see the mountain.', '我能看见那座山。'], ['We watched a film last night.', '我们昨晚看了部电影。']],
      confuse: '⚠️ look at（看）vs see（看见）vs watch（观看）——一个动作、一个结果、一个过程'
    },
    {
      w: 'say / tell / speak / talk', ipa: '/seɪ/ /tel/ /spiːk/ /tɔːk/', pos: '动词', cn: '说',
      tip: 'say 说内容，tell 告诉人，speak 说语言，talk 交谈。',
      ex: [['Say hello to her for me.', '替我向她问好。'], ['Tell me the truth.', '告诉我实话。'], ['Do you speak Chinese?', '你会说中文吗？']],
      confuse: '⚠️ say（说内容，不能直接接人）vs tell sb（告诉某人）——「告诉我」是 tell me 不是 say me'
    },
    {
      w: 'give / pass', ipa: '/ɡɪv/ /pæs/', pos: '动词', cn: '给 / 传递',
      tip: 'give 是「给」，pass 是「递过（手）」，pass 还表「经过、通过」。',
      ex: [['Give me a minute.', '给我一分钟。'], ['Can you pass me the salt?', '能把盐递给我吗？'], ['They passed the exam.', '他们通过了考试。']],
      confuse: 'give sb sth（给）vs pass sth to sb（递）vs pass an exam（通过）'
    },
    {
      w: 'keep / put / set', ipa: '/kiːp/ /pʊt/ /set/', pos: '动词', cn: '放',
      tip: 'keep 保持状态，put 放入某处，set 放置（尤指物品在某位置）。',
      ex: [['Keep the door open.', '让门开着。'], ['Put it on the shelf.', '把它放到架子上。'], ['She set the cup down.', '她把杯子放下。']],
      confuse: '⚠️ keep it open（保持开着）vs put it there（放那）vs set it down（放下）'
    },
    {
      w: 'remember / forget', ipa: '/rɪˈmembər/ /fərˈɡet/', pos: '动词', cn: '记得 / 忘记',
      tip: 'remember/forget + to do 表「记得/忘记要做」；+ doing 表「记得/忘记做过」。',
      ex: [['Remember to lock the door.', '记得锁门。'], ['I remember meeting her.', '我记得见过她。'], ['Don\'t forget your keys.', '别忘了钥匙。']],
      confuse: '⚠️ remember to do（还没做，要去做）vs remember doing（已经做过，记得）'
    },
    {
      w: 'stop / finish / end', ipa: '/stɑːp/ /ˈfɪnɪʃ/ /end/', pos: '动词', cn: '停止 / 完成 / 结束',
      tip: 'stop doing 停止做，stop to do 停下来去做另一件事。',
      ex: [['He stopped smoking.', '他戒烟了。'], ['I stopped to buy coffee.', '我停下来买了咖啡。'], ['The meeting ended at six.', '会议六点结束。']],
      confuse: '⚠️ stop doing（停止做某事）vs stop to do（停下去做别的事）'
    },

    /* ==================== 名词：核心概念 ==================== */
    {
      w: 'thing', ipa: '/θɪŋ/', pos: '名词', cn: '东西；事情',
      tip: '泛指「东西」最安全的词，口语中高频。',
      ex: [['I have a lot of things to do.', '我有很多事要做。'], ['What is this thing?', '这是什么玩意儿？'], ['It\'s a small thing.', '这是件小事。']],
      confuse: 'something/anything/nothing 是复合形式'
    },
    {
      w: 'people / person', ipa: '/ˈpiːpl/ /ˈpɜːrsn/', pos: '名词', cn: '人；人们',
      tip: 'people 是集合名词，表示「人们」时看作复数。',
      ex: [['People are friendly here.', '这里的人很友好。'], ['How many people are coming?', '有多少人来？'], ['She is a kind person.', '她是个善良的人。']],
      confuse: '⚠️ people 表「人们」看作复数：people are，不是 people is'
    },
    {
      w: 'way', ipa: '/weɪ/', pos: '名词', cn: '方法；路',
      tip: 'way 的用法极多：in this way、on the way、the way to…',
      ex: [['This way, please.', '这边请。'], ['What\'s the way to the station?', '去车站怎么走？'], ['It\'s a good way to learn.', '这是个好办法。']],
      confuse: 'the way to do（做…的方法）vs the way of doing（做的风格）'
    },
    {
      w: 'year / month / week', ipa: '/jɪr/ /mʌnθ/ /wiːk/', pos: '名词', cn: '年/月/周',
      tip: '时间的量词搭配固定，注意冠词使用。',
      ex: [['two years ago', '两年前'], ['next month', '下个月'], ['a week from now', '一周后']],
      confuse: 'in a year（一年后）vs after a year（一年之后）——in 从现在算起'
    },
    {
      w: 'place', ipa: '/pleɪs/', pos: '名词', cn: '地方',
      tip: 'place 可指具体地点，也可指「位置、名次、职位」。',
      ex: [['This is a nice place.', '这地方不错。'], ['Sit somewhere else.', '坐别处。'], ['He got first place.', '他拿了第一名。']],
      confuse: 'place（地方/位置）vs space（空间/场地）vs spot（地点，较小）'
    },
    {
      w: 'number', ipa: '/ˈnʌmbər/', pos: '名词', cn: '数字；号码',
      tip: 'phone number（电话号码）用 number，house number（门牌号）也用 number。',
      ex: [['What\'s your phone number?', '你的电话号码是多少？'], ['The number is on the door.', '号码在门上。'], ['Give me your number.', '把你的号码给我。']],
      confuse: 'a number of（许多）vs the number of（…的数量）'
    },
    {
      w: 'problem / question', ipa: '/ˈprɑːbləm/ /ˈkwestʃən/', pos: '名词', cn: '问题',
      tip: 'question 是「提问」，problem 是「待解决的难题或故障」。',
      ex: [['I have a question.', '我有个问题要问。'], ['We solved the problem.', '我们解决了问题。'], ['There\'s a problem with the app.', '这个应用有问题。']],
      confuse: '⚠️ question（疑问）vs problem（困难/故障）——「我想问」用 question'
    },

    /* ==================== 形容词与副词 ==================== */
    {
      w: 'good / well / better / best', ipa: '/ɡʊd/ /wel/ /ˈbetər/ /best/', pos: '形容词', cn: '好的',
      tip: 'good 是形容词，well 是副词；比较级 better，最高级 best。',
      ex: [['She is a good teacher.', '她是个好老师。'], ['She teaches well.', '她教得好。'], ['This one is better.', '这个更好。']],
      confuse: '⚠️ good（形容词）vs well（副词）——「她身体好」是 She is well，不是 She is good'
    },
    {
      w: 'many / much / a lot of', ipa: '/ˈmeni/ /mʌtʃ/ /ə lɑːt əv/', pos: '限定词', cn: '许多',
      tip: 'many + 可数复数，much + 不可数，a lot of 两者都行。',
      ex: [['How many people came?', '来了多少人？'], ['How much does it cost?', '多少钱？'], ['I have a lot of work.', '我很多活儿。']],
      confuse: '⚠️ many books（可数）vs much water（不可数）'
    },
    {
      w: 'few / a few / little / a little', ipa: '/fjuː/ /ˈlɪtl/', pos: '限定词', cn: '少；一点',
      tip: '不加 a 表「几乎没有」，加 a 表「有一些」。little 用于不可数。',
      ex: [['I have few friends here.', '我这儿没什么朋友。'], ['I have a few friends.', '我有几个朋友。'], ['There\'s little time left.', '没多少时间了。']],
      confuse: '⚠️ few（几乎没有）vs a few（有少数）——差一个 a 意义反转'
    },
    {
      w: 'enough', ipa: '/ɪˈnʌf/', pos: '形容词/副词', cn: '足够的',
      tip: 'enough 作形容词放名词前，作副词放句末或形容词后。',
      ex: [['We have enough time.', '我们时间够。'], ['She isn\'t old enough.', '她还不够大。'], ['He runs fast enough.', '他跑得够快。']],
      confuse: 'enough + 形容词 + to do 表「足够…以至于能…」'
    },
    {
      w: 'almost / nearly / hardly', ipa: '/ˈɔːlmoʊst/ /ˈnɪrli/ /ˈhɑːrdli/', pos: '副词', cn: '几乎',
      tip: 'almost/nearly 表「接近」，hardly 表「几乎不」，意思相反。',
      ex: [['It\'s almost done.', '快做完了。'], ['It\'s nearly finished.', '差不多完成了。'], ['I can hardly hear you.', '我几乎听不见你。']],
      confuse: '⚠️ almost 几乎 = 接近；hardly 几乎不 = 几乎做不到'
    },
    {
      w: 'too / enough', ipa: '/tuː/ /ɪˈnʌf/', pos: '副词', cn: '太；足够',
      tip: 'too 表示「超出合适程度」（负面），enough 表示「足够」（中性）。',
      ex: [['It\'s too hot.', '太热了（不好）。'], ['It\'s hot enough to swim.', '够热了可以游泳（正好）。'], ['He\'s too young to drive.', '他太小了不能开车。']],
      confuse: '⚠️ too + 形容词 表「太…」；enough + 形容词 + to do 表「足够…以至于能…」'
    },
    {
      w: 'already / yet / still / just', ipa: '/ɔːlˈredi/ /jet/ /stɪl/ /dʒʌst/', pos: '副词', cn: '已经；还；刚刚',
      tip: 'already 用于肯定句，yet 用于否定和疑问句。',
      ex: [['I\'ve already finished.', '我已经做完了。'], ['I haven\'t finished yet.', '我还没做完。'], ['She\'s still waiting.', '她还在等。']],
      confuse: '⚠️ already（已，用于肯定）vs yet（还，用于否定疑问）'
    },

    /* ==================== 高频短语动词 ==================== */
    {
      w: 'figure out', ipa: '/ˈfɪɡjər aʊt/', pos: '短语动词', cn: '弄明白；算出',
      tip: '口语中可缩为 fig out。',
      ex: [['I can\'t figure it out.', '我弄不明白。'], ['Let me figure out the cost.', '让我算下成本。'], ['We need to figure this out.', '我们得把这弄清楚。']],
      confuse: 'figure（数字/人物）→ figure out（算出）是两个不同的词'
    },
    {
      w: 'find out', ipa: '/faɪnd aʊt/', pos: '短语动词', cn: '查明；发现',
      tip: '强调「得知结果」，与 find（找到）不同。',
      ex: [['I found out later.', '我后来才知道。'], ['Let\'s find out the price.', '我们查下价格。'], ['Did you find out what happened?', '你查明发生什么了吗？']],
      confuse: 'find（找到东西）vs find out（查明信息）'
    },
    {
      w: 'look after', ipa: '/lʊk ˈæftər/', pos: '短语动词', cn: '照顾',
      tip: '= take care of',
      ex: [['She looks after her dog.', '她照顾她的狗。'], ['Can you look after my plants?', '你能帮我照顾植物吗？'], ['I\'ll look after it.', '我来处理。']],
      confuse: 'look after（照顾）vs look for（寻找）vs look forward to（期待）'
    },
    {
      w: 'look forward to', ipa: '/lʊk ˈfɔːrwərd tuː/', pos: '短语动词', cn: '期待',
      tip: 'to 在此是介词，后面接动名词或名词。',
      ex: [['I look forward to hearing from you.', '期待你的回复。'], ['She\'s looking forward to the trip.', '她很期待这趟旅行。'], ['We look forward to your support.', '期待您的支持。']],
      confuse: '⚠️ look forward to + doing（不能加 to do）——这里的 to 是介词'
    },
    {
      w: 'give up', ipa: '/ɡɪv ʌp/', pos: '短语动词', cn: '放弃',
      tip: 'give up + doing 表「放弃做某事」。',
      ex: [['Don\'t give up so easily.', '别轻易放弃。'], ['He gave up smoking last year.', '他去年戒烟了。'], ['She gave up the job.', '她辞了这份工作。']],
      confuse: 'give up（放弃）vs give in（屈服）vs give away（赠送）'
    },
    {
      w: 'put off / put up with', ipa: '/pʊt ɔːf/ /pʊt ʌp wɪð/', pos: '短语动词', cn: '推迟 / 忍受',
      tip: 'put off 推迟，put up with 忍受，两者介词不同。',
      ex: [['They put off the meeting.', '他们推迟了会议。'], ['I put it off until next week.', '我推到下周了。'], ['I can\'t put up with the noise.', '我受不了这噪音。']],
      confuse: '⚠️ put off（推迟）vs put up with（忍受）——介词完全不同的两个短语'
    },
    {
      w: 'turn down / turn up', ipa: '/tɜːrn daʊn/ /tɜːrn ʌp/', pos: '短语动词', cn: '拒绝 / 出现；调高',
      tip: 'turn down 表拒绝（邀请/提议），turn up 表出现（人到了）。',
      ex: [['She turned down the offer.', '她拒绝了这个提议。'], ['Turn the music down.', '把音乐调小。'], ['He turned up an hour late.', '他迟到了一小时。']],
      confuse: 'turn down（拒绝/调小）vs turn up（出现/调大）——方向相反'
    },
    {
      w: 'come across / come up with', ipa: '/kʌm əˈkrɔːs/ /kʌm ʌp wɪð/', pos: '短语动词', cn: '偶遇 / 想出',
      tip: 'come across 意为「偶然遇到」（非故意），come up with 意为「想出（主意）」。',
      ex: [['I came across an old book.', '我偶然发现一本旧书。'], ['She came up with a great idea.', '她想出了一个好主意。'], ['We came across a problem.', '我们遇到了一个问题。']],
      confuse: 'come across（偶然遇见）vs come up with（想出方案）'
    },

    /* ==================== 易错结构 ==================== */
    {
      w: 'used to / be used to / get used to', ipa: '/juːst tuː/ /biː ˈjuːst tuː/', pos: '结构', cn: '过去常常 / 习惯于',
      tip: '三者意思完全不同，混用是最常见的错误之一。',
      ex: [['I used to play tennis.', '我以前常打网球。'], ['I am used to getting up early.', '我习惯早起。'], ['I got used to the noise.', '我习惯了噪音。']],
      confuse: '⚠️ used to do（过去常常）vs be used to doing（习惯于）vs get used to doing（逐渐习惯）'
    },
    {
      w: 'would rather', ipa: '/wʊd ˈræðər/', pos: '结构', cn: '宁愿',
      tip: 'would rather + 动词原形，后接 than。',
      ex: [['I\'d rather stay home.', '我宁愿待家里。'], ['I would rather walk than drive.', '我宁愿走路不开车。'], ['She\'d rather not talk about it.', '她宁愿不谈这事。']],
      confuse: '⚠️ would rather do（宁愿做）vs prefer to do（更喜欢做）——后接内容不同'
    },
    {
      w: 'the more… the more…', ipa: '/ðə mɔːr/', pos: '结构', cn: '越…越…',
      tip: '前后都是 the + 比较级，句末用逗号。',
      ex: [['The more you practise, the better you get.', '你练得越多，就越好。'], ['The more I read, the more I want to learn.', '我读得越多，越想学。'], ['The earlier you start, the better.', '开始得越早越好。']],
      confuse: '固定句式，不可拆开使用'
    },
    {
      w: 'too… to / so… that', ipa: '/tuː tuː/ /soʊ ðæt/', pos: '结构', cn: '太…以至于不能 / 如此…以至于',
      tip: 'too + adj + to do 表否定，so + adj + that 表结果（可以是肯定）。',
      ex: [['He is too young to drive.', '他太小了不能开车。'], ['It was so cold that we stayed in.', '太冷了我们待屋里了。'], ['She is too shy to speak.', '她太害羞了不敢说话。']],
      confuse: '⚠️ too… to 表否定（不能），so… that 表结果（可能肯定也可能否定）'
    },
    {
      w: 'not only… but also', ipa: '/nɑːt ˈoʊnli/', pos: '结构', cn: '不仅…而且',
      tip: '前后成分要对称。',
      ex: [['He is not only smart but also hard-working.', '他不仅聪明还努力。'], ['Not only did she finish, but she also helped.', '她不仅完成了，还帮了忙。'], ['It affects not only me but you.', '这不只是影响我，还影响你。']],
      confuse: '注意倒装：Not only did he…（否定词提前要倒装）'
    }
  ];

  /* 挂到 VocabContent 上（保持与 content-vocab.js 的一致接口） */
  var base = global.VocabContent || {};
  var existing = {};
  (base.CORE || []).forEach(function (x) { existing[x.w] = x; });
  CORE.forEach(function (x) {
    if (!existing[x.w]) {
      base.CORE = (base.CORE || []).concat([x]);
    }
  });
  global.VocabContent = base;
  global.VocabExpansion = { CORE: CORE };
})(window);