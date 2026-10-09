/* ============================================================
   content-daily-scene.js —— 日常场景对话（第二批扩充）
   主题全部取自真实高频生活动线：出门办事、租房沟通、社交休闲、身体不适
   每个场景含：目标 / 挑战 / 逐句（原文+译文+发音要点+使用提示）
   ============================================================ */
(function (global) {
  'use strict';

  var SCENES = [
    /* ============ L1 入门 ============ */
    {
      id: 'x-01', lv: 'L1', title: 'At the Post Office', titleCn: '在邮局寄件', minutes: 5,
      goal: '能寄包裹、称重、问费用与到达时间',
      challenge: '不看提示说出收件人地址、邮编和寄件方式',
      lines: [
        { who: 'A', en: 'I\'d like to send a package to Shanghai.', cn: '我想寄一个包裹到上海。', focus: 'I\'d like to 是「我想要」，比 I want 礼貌得多。', tip: '关键：I would like 中的 d 不发音，念 /aɪd/。' },
        { who: 'B', en: 'Sure. What\'s in the package?', cn: '好的，里面是什么？', focus: '包裹用 package 或 parcel，英式常用 parcel。', tip: '寄件前工作人员一定会问内容，这是必答项。' },
        { who: 'A', en: 'Just some books and a jacket. Nothing fragile.', cn: '一些书和一件外套，没有易碎品。', focus: 'fragile /ˈfreɪdʒaɪl/ 易碎的，寄件必说。', tip: '「Nothing fragile」是免赔的重要一句，能省下保价费。' },
        { who: 'B', en: 'How long will it take?', cn: '大概需要多久？', focus: 'take 表示花费时间，主动词是 it 而非 you。', tip: '邮件寄送时间用 how long 问；「多长时间」= how long。' },
        { who: 'A', en: 'A week or so. Is that the fastest option?', cn: '一周左右。这是最快的方式吗？', focus: 'or so 意为「左右」，是数量表达的高频后缀。', tip: 'Is that the fastest option? 问是否有更快选项，比直接问「能不能更快」得体。' },
        { who: 'B', en: 'Express delivery is two days, but it costs more.', cn: '快递两天，但费用更高。', focus: 'express delivery 快递；the more…, the more… 是比较级套路。', tip: '给出选项让对方选（two days + more money），是服务人员的标准做法。' },
        { who: 'A', en: 'Regular is fine. Here\'s the address.', cn: '平邮就行。这是地址。', focus: 'Here\'s = Here is，句中已含 is 不能再加。', tip: '寄件时把地址写清楚是最容易出错的地方，务必核对。' },
        { who: 'B', en: 'Let me weigh it. That\'s two kilos, so it\'ll be thirty yuan.', cn: '我称一下。两公斤，三十元。', focus: 'weigh /weɪ/ 读同「way」，称重。', tip: '国际运费按重量算，国内按件，这是最常问的费用。' },
        { who: 'A', en: 'Here\'s the money. Can I have a receipt?', cn: '钱给您。能给我一张收据吗？', focus: 'receipt 收据；recieve 是常见拼写错误，注意拼写。', tip: '要收据（receipt）不是收据错误拼法「receipt」/rɪˈsiːt/。' }
      ]
    },
    {
      id: 'x-02', lv: 'L1', title: 'At the Coffee Shop', titleCn: '在咖啡店点单', minutes: 5,
      goal: '能点咖啡、说明冷热与规格、听懂店名叫法',
      challenge: '用「Can I get a…?」点单并说出自定义要求',
      lines: [
        { who: 'A', en: 'Can I get a medium latte, please?', cn: '我要一杯中杯拿铁。', focus: 'Can I get…? 是点单最自然的说法。', tip: '中杯 = medium，不要说 middle。「中杯拿铁」是 medium latte。' },
        { who: 'B', en: 'Hot or iced?', cn: '热的还是冰的？', focus: 'iced 读 /aɪst/，iced 中 c 不发音。', tip: '问 hot / iced 是所有饮品店标配。' },
        { who: 'A', en: 'Iced, please. Less ice, actually.', cn: '冰的。少冰，谢谢。', focus: 'actually 用来修正自己刚说的话，自然又礼貌。', tip: '「少冰」「去冰」是高频自定义：less ice / no ice。' },
        { who: 'B', en: 'Sure. For here or to go?', cn: '好的。堂食还是外带？', focus: 'for here = 堂食，to go = 外带。', tip: '这是美式咖啡店最经典的一句问话，中国学生常听不懂。' },
        { who: 'A', en: 'To go, please. And that\'s all.', cn: '外带，就这些。', focus: 'that\'s all = 就这些，用于结账。', tip: '不想再加东西就说 "That\'s all, thank you."' },
        { who: 'B', en: 'That\'ll be forty-two dollars.', cn: '一共四十二美元。', focus: 'That\'ll be 是 That will be 的缩写，「一共」。', tip: '账单时的固定说法，无需额外动词。' },
        { who: 'A', en: 'Card, please. Can I pay by phone?', cn: '刷卡。能手机支付吗？', focus: 'phone 指手机，pay by phone 即手机支付。', tip: '手机支付说 pay by phone 或 use Apple Pay。' },
        { who: 'B', en: 'Sure, just tap here. Your drink will be ready in three minutes.', cn: '可以，在这里碰一下。三分钟后就好。', focus: 'tap 指「碰一下」，手机支付的动作。', tip: 'be ready 备好，比 it will be ready 更常用。' }
      ]
    },
    {
      id: 'x-03', lv: 'L1', title: 'Asking about the Bus', titleCn: '坐公交与问路', minutes: 5,
      goal: '能问公交线路、报站、听懂换乘信息',
      challenge: '用「Which bus goes to…?」问出路线并成功上车',
      lines: [
        { who: 'A', en: 'Excuse me, which bus goes to the hospital?', cn: '打扰一下，哪路公交去医院？', focus: 'which bus goes to + 地点，问线路的核心句式。', tip: '不问「How do I go」而问「哪路车」，更直接。' },
        { who: 'B', en: 'Bus 12 goes there. It stops right out front.', cn: '12 路。车就停在前门。', focus: 'right out front 意为「就在正门口」。', tip: 'stop out front 指车站位置，字面是「停在外面的前面」。' },
        { who: 'A', en: 'Does it run every twenty minutes?', cn: '二十分钟一班吗？', focus: 'every + 时间段，表示发车频率。', tip: '问班次：every… / how often。用 every 更简洁。' },
        { who: 'B', en: 'Every fifteen minutes during rush hour.', cn: '高峰期每十五分钟一班。', focus: 'rush hour 高峰期；during 表示「在……期间」。', tip: '高峰/非高峰班次不同，美国城市公交很常见。' },
        { who: 'A', en: 'Do I need to transfer to get there?', cn: '需要换乘吗？', focus: 'transfer 换乘（公交地铁通用），是问路高频词。', tip: '「换乘」用 transfer，不用 change（change 是换零钱）。' },
        { who: 'B', en: 'No, it\'s direct. About twenty minutes.', cn: '不用，直达。大概二十分钟。', focus: 'it\'s direct 意为「直达」，是交通问路的回答。', tip: 'direct 与 transfer 相对，回答换乘问题的标准词。' },
        { who: 'A', en: 'How much is the fare?', cn: '车费多少？', focus: 'fare 车费（比 price 更专指交通票价）。', tip: 'fare 只能用于交通票价，不能用于商品价格。' },
        { who: 'B', en: 'Two fifty. You can pay with a transit card or cash.', cn: '两毛五。能用交通卡或现金。', focus: 'Transit card 交通卡；cash 现金。', tip: '⚠️ 部分城市已不收现金，备好 transit card 更保险。' }
      ]
    },
    {
      id: 'x-04', lv: 'L1', title: 'At the Convenience Store', titleCn: '在便利店', minutes: 4,
      goal: '能买指定商品、问热食、听懂促销广播',
      challenge: '结账时说清「要这个热的、不要吸管」',
      lines: [
        { who: 'A', en: 'Do you have any sandwiches left?', cn: '还有三明治吗？', focus: 'any 在疑问句中表示「任何」，用于询问是否有存货。', tip: '「还有吗」用 any left，left 指剩下。' },
        { who: 'B', en: 'We have two left. Warming one up?', cn: '还剩两个。需要加热吗？', focus: 'warm up 加热；up 表示动作完成。', tip: '便利店的加热服务很常见，主动问一句能省时间。' },
        { who: 'A', en: 'Yes, please. And a bottle of water.', cn: '好的，谢谢。再要一瓶水。', focus: 'bottle of + 物品，表示容器里的量。', tip: 'a bottle of / a cup of / a box of 是量词搭配，必背。' },
        { who: 'B', en: 'Anything else?', cn: '还需要别的吗？', focus: 'Anything else? 结账前的万能问句。', tip: '「不要了」就说 "No, that\'s all."' },
        { who: 'A', en: 'No, that\'s all. Actually, can I get a receipt?', cn: '不用了，就这些。对了，能给我收据吗？', focus: 'Actually 用来追加请求，是很自然的转折。', tip: '用 Actually 追加需求不会显得唐突。' },
        { who: 'B', en: 'Sure. It\'ll be seven forty-five.', cn: '好的，一共七块四毛五。', focus: '金额读法：7.45 读作 seven forty-five 或 seven forty-five cents。', tip: '⚠️ 美式金额读法是「整数 + 两位小数」，不读 point。' }
      ]
    },

    /* ============ L2 基础 ============ */
    {
      id: 'x-05', lv: 'L2', title: 'Talking to the Landlord', titleCn: '和房东沟通', minutes: 8,
      goal: '能报告房子问题、协商维修时间、确认费用',
      challenge: '用「I\'d appreciate it if…」提出一个具体诉求',
      lines: [
        { who: 'A', en: 'Hi, I\'m calling about the heater in unit 3B.', cn: '你好，我打电话是想说 3B 的暖气。', focus: 'unit 3B 意为「3B 单元」，美国公寓常用。', tip: '报门牌号用 unit，比 room number 更准确。' },
        { who: 'B', en: 'I\'m sorry to hear that. What seems to be the problem?', cn: '很抱歉。什么情况？', focus: 'What seems to be the problem 是客服标准问句。', tip: '这句话在租房、维修、客服场景通用，值得背下来。' },
        { who: 'A', en: 'It hasn\'t worked for three days. The temperature is really low.', cn: '三天没用了。室温特别低。', focus: '现在完成时 + for + 时间段，说明持续多久。', tip: '强调「持续多久」能让对方判断紧急程度。' },
        { who: 'B', en: 'I\'ll send someone over this afternoon. Is 2pm okay?', cn: '我下午派人过去。两点可以吗？', focus: 'send someone over 派人过去；Is 2pm okay 确认时间。', tip: 'over 在此意为「过去」，不是「结束」。' },
        { who: 'A', en: 'That works. I\'ll be home. Thanks for the quick response.', cn: '可以，我在家。谢谢你这么快回复。', focus: 'That works 是同意对方的提议（口语常用）。', tip: '「可以」用 That works 比 Yes 更自然。' },
        { who: 'B', en: 'No problem. If it\'s not fixed by tomorrow, call me back.', cn: '没问题。如果明天还没好，打电话给我。', focus: 'If it\'s not fixed 条件句，给出后续方案。', tip: '主动给「如果没有…就…」的预案，是让人放心的做法。' },
        { who: 'A', en: 'Will I be charged for the repair?', cn: '维修要收费吗？', focus: 'be charged for 因…被收费，被动语态。', tip: '问维修费是否自付，这是租客的合理关切。' },
        { who: 'B', en: 'Normal wear and tear is on us. If it\'s a faulty part, you won\'t pay.', cn: '正常损耗我们承担。如果是零件故障，你不用付。', focus: 'wear and tear 正常磨损；faulty  faulty = 有毛病的。', tip: '区分「正常损耗」和「设备故障」是租客维权要点。' },
        { who: 'A', en: 'I appreciate the clarification. Have a good one.', cn: '谢谢说明清楚。祝你愉快。', focus: 'clarification 澄清；Have a good one 轻松的告别语。', tip: '「Thank you for clarifying」比 thanks 更正式。' }
      ]
    },
    {
      id: 'x-06', lv: 'L2', title: 'At the Gym', titleCn: '在健身房', minutes: 6,
      goal: '能询问器械用法、课程时间、办卡与请假',
      challenge: '用「How do I use this?」问清一个器械',
      lines: [
        { who: 'A', en: 'Excuse me, how do I use this machine?', cn: '打扰一下，这台器械怎么用？', focus: 'How do I use + 物品，是问操作的最直接说法。', tip: 'machine 在健身房指器械，equipment 更泛。' },
        { who: 'B', en: 'Start light. Add weight every two weeks if it feels easy.', cn: '从轻重量开始。每两周加一次，如果觉得轻松的话。', focus: 'add weight 加重量；if 从句表条件。', tip: '渐进增加负荷是健身的基本原则。' },
        { who: 'A', en: 'How many reps should I do?', cn: '我应该做多少个？', focus: 'reps = repetitions 的缩写，健身圈通用。', tip: '「几次一组」的完整说法是 sets of reps。' },
        { who: 'B', en: 'Three sets of twelve. Rest a minute between sets.', cn: '三组，每组十二个。组间休息一分钟。', focus: 'three sets of twelve，「十二个一组共三组」的固定语序。', tip: '⚠️ 英美健身术语略有差异，美式说 reps，英式说 reps 也通行。' },
        { who: 'A', en: 'Do you have any classes?', cn: '你们有团课吗？', focus: 'class 在此指健身课程，不是「班级」。', tip: '问课程时说 "Do you offer any classes?" 更自然。' },
        { who: 'B', en: 'Yoga is Monday and Wednesday, spinning is Friday morning.', cn: '瑜伽周一和周三，单车课周五上午。', focus: 'spinning 动感单车，健身房固定课程名。', tip: '「动感单车」英美都叫 spinning。' },
        { who: 'A', en: 'Is there a trial period?', cn: '有试用期吗？', focus: 'trial period 试用期，办卡前的必问项。', tip: '「免费试用」是 free trial，健身房常用促销。' },
        { who: 'B', en: 'First week is free. After that it\'s sixty a month.', cn: '第一周免费，之后一个月六十。', focus: 'After that 之后，指时间节点转换。', tip: '「一个月六十」= sixty a month，是最自然的说法。' }
      ]
    },
    {
      id: 'x-07', lv: 'L2', title: 'Making Plans with Friends', titleCn: '和朋友约聚会', minutes: 7,
      goal: '能提议活动、确认时间地点、表达偏好',
      challenge: '用「I\'m up for… / I\'m not really into…」表达态度',
      lines: [
        { who: 'A', en: 'We should hang out this weekend. Any ideas?', cn: '这周末该聚聚。有什么想法吗？', focus: 'We should… 提出建议；Any ideas? 征求意见。', tip: 'We should 比 Let\'s 更个人化，Let\'s 更提议。' },
        { who: 'B', en: 'I\'m up for anything. Last time was fun.', cn: '我都行。上次挺开心的。', focus: 'be up for + anything 表示「什么都行」。', tip: 'I\'m up for… 是接受邀约的固定说法。' },
        { who: 'A', en: 'There\'s a new ramen place near my apartment. Want to check it out?', cn: '我公寓附近有家新拉面店。要去看看吗？', focus: 'check out 在此意为「去体验」，是口语而非「结账」。', tip: '一词多义：check out 可指结账、查看、体验，看语境。' },
        { who: 'B', en: 'Sounds good. When should we go?', cn: '不错。什么时候去？', focus: 'Sounds good 是最常见的口头同意。', tip: 'Sounds good 后不要加 I think，直接问下一步。' },
        { who: 'A', en: 'How about Saturday evening? Around seven?', cn: '周六晚上怎么样？七点左右？', focus: 'How about 提议；Around 七点表示大概时间。', tip: '给具体时间比问 "When are you free" 更容易成行。' },
        { who: 'B', en: 'Seven works. Should I drive or meet you there?', cn: '七点行。我开车还是到那边找你？', focus: 'drive or meet you there 两个选项并列提出。', tip: '主动提供「接送」选项是很贴心的社交行为。' },
        { who: 'A', en: 'Let\'s meet there. Parking near my place is a nightmare.', cn: '那边见。我这边停车太难了。', focus: 'a nightmare 意为「噩梦」，指非常糟糕的体验。', tip: 'nightmare 在此不是真的噩梦，是「痛苦经历」。' },
        { who: 'B', en: 'Fair enough. Text me when you\'re leaving.', cn: '有道理。你出发时给我发消息。', focus: 'Fair enough 表示「有道理」，接受对方的理由。', tip: 'text me 发消息，口语中比 message me 自然。' }
      ]
    },
    {
      id: 'x-08', lv: 'L2', title: 'Calling in Sick', titleCn: '请病假', minutes: 5,
      goal: '能礼貌请假、说明症状、确认工作交接',
      challenge: '用「I\'m afraid I won\'t be able to…」表达不得不',
      lines: [
        { who: 'A', en: 'Hi, it\'s Sarah from the design team. I\'m calling to let you know I\'ll be out sick today.', cn: '你好，我是设计部的 Sarah。我打电话来说今天请病假。', focus: 'out sick 请病假；let you know 告诉你。', tip: 'out sick / call in sick 是请病假的固定说法。' },
        { who: 'B', en: 'Oh no, are you okay? Do you need anything?', cn: '哎，你还好吗？需要什么吗？', focus: 'Are you okay? 关切询问；Do you need anything? 提供帮助。', tip: '同事听到请假时的标准回应，先关心再问工作。' },
        { who: 'A', en: 'I have a fever and a sore throat. I\'ll probably be back tomorrow.', cn: '我发烧加嗓子疼。可能明天就回来。', focus: 'I have a fever 发烧；probably 表推测。', tip: '给出预计返岗时间，体现专业态度。' },
        { who: 'B', en: 'Take care and get some rest. Do you want me to cover your deadline?', cn: '好好休息。需要我帮你赶deadline 吗？', focus: 'get some rest 好好休息；cover your deadline 帮你赶工。', tip: 'cover 在此意为「代为处理（工作）」。' },
        { who: 'A', en: 'That would be great, thank you. I\'ll send you the files tonight from home.', cn: '那太好了，谢谢。我今晚从家里把文件发给你。', focus: 'That would be great 表示感激的同意（虚拟语气）。', tip: 'That would be 语气比 That will be 更礼貌柔和。' },
        { who: 'B', en: 'Don\'t worry about it. Just focus on getting better.', cn: '别担心。专心养好身体。', focus: 'Don\'t worry about it 别担心；get better 康复。', tip: 'get better 是「好转」，口语固定搭配。' },
        { who: 'A', en: 'I appreciate it. I\'ll keep you posted.', cn: '谢谢。我会随时告知进展。', focus: 'keep you posted 随时向你通报，是职场常用语。', tip: 'keep sb posted 是「让某人了解最新情况」。' }
      ]
    },

    /* ============ L3 进阶 ============ */
    {
      id: 'x-09', lv: 'L3', title: 'Negotiating the Rent', titleCn: '和房东谈房租', minutes: 10,
      goal: '能提出涨租异议、用市场数据说服、维持关系',
      challenge: '用「I understand, but I\'d like to propose…」提出反提案',
      lines: [
        { who: 'A', en: 'I\'d like to discuss the rent increase you mentioned.', cn: '我想谈谈您提到的涨租。', focus: 'discuss 比 talk 更正式，适合谈判开场。', tip: '用 discuss 定调为「协商」而非「对抗」。' },
        { who: 'B', en: 'Sure, the market has changed a lot since last year.', cn: '当然，这一年市场变化很大。', focus: 'the market 指租金市场，是房东的论据基础。', tip: '房东通常先讲市场，这是他们的标准开场。' },
        { who: 'A', en: 'I understand, but I\'d like to propose keeping the current rate for another year.', cn: '我理解，但我想提议按当前租金再续一年。', focus: 'I understand, but… 是「先认同再反提案」的标准结构。', tip: '⚠️ 注意：承认对方合理性后立刻给出具体替代方案，而非只表达不满。' },
        { who: 'B', en: 'That\'s difficult. My costs have gone up too.', cn: '这有点难。我的成本也涨了。', focus: 'costs have gone up 成本上升，房东的真实压力来源。', tip: '房东提成本是真实的，不要否定它，要谈解决方案。' },
        { who: 'A', en: 'I\'m not questioning that. But I have market data showing nearby units are lower.', cn: '我不是质疑这点。但我有市场数据显示附近房源更低。', focus: 'have data showing… 用数据支撑，是谈判中的杀手锏。', tip: '「我不是质疑你，我是带数据来的」比「你在骗我」有效十倍。' },
        { who: 'B', en: 'What kind of difference are we talking about?', cn: '大概差多少？', focus: 'What kind of difference 询问差距，比 how much 更委婉。', tip: '让对方先报数字，你再回应，保留调整空间。' },
        { who: 'A', en: 'About fifteen percent. If we split the difference, that would work for me.', cn: '大约百分之十五。如果各让一步，我可以接受。', focus: 'split the difference 各退一步，是谈判核心术语。', tip: 'split the difference 是解决价格僵局最实用的表达。' },
        { who: 'B', en: 'Ten percent, and we renew for two years. That\'s the best I can do.', cn: '百分之十，然后签两年。这是我能做到的极限。', focus: 'That\'s the best I can do 这是我能做的极限，用于结束谈判。', tip: '「这是我极限」是得体的收尾，不伤关系。' },
        { who: 'A', en: 'That works. Let\'s put it in writing.', cn: '可以。我们写下来吧。', focus: 'put it in writing 形成书面，是自我保护的关键。', tip: '⚠️ 所有口头承诺都要落实为书面，这是最重要的一条。' }
      ]
    },
    {
      id: 'x-10', lv: 'L3', title: 'Small Talk with a Stranger', titleCn: '和陌生人搭话', minutes: 7,
      goal: '能在电梯、咖啡店等场合自然开启对话并收尾',
      challenge: '用「I love this place」开启话题并维持 3 轮',
      lines: [
        { who: 'A', en: 'Excuse me, does this elevator go to the fourth floor?', cn: '打扰一下，这电梯到四楼吗？', focus: '用问路开启对话，是与陌生人搭话最自然的方式。', tip: '不要一上来就问私人问题，先用一个合理问题破冰。' },
        { who: 'B', en: 'Yes, it does. It\'s going up now.', cn: '是的。现在在上升。', focus: 'it does 代替 it goes，避免重复。', tip: '英语用助动词 do 回答，避免重复主语动词。' },
        { who: 'A', en: 'Great, thank you. I always get confused with this building.', cn: '好的，谢谢。我每次在这栋楼都搞不清。', focus: 'get confused with 在某地搞不清；get + 形容词表示状态。', tip: 'get confused / get lost / get stuck 都是「get + adj」结构。' },
        { who: 'B', en: 'Yeah, the signs are confusing. I\'ve been here two years and still get lost.', cn: '是啊，标识很容易混淆。我来了两年还常迷路。', focus: 'still 强调「到现在仍然」，暗示长期状态。', tip: '自嘲（self-deprecation）是英美社交拉近距离的技巧。' },
        { who: 'A', en: 'Really? I just started last month. Any tips?', cn: '真的吗？我上个月才来。有什么建议吗？', focus: 'Any tips? 是开放式提问，把话头递回对方。', tip: '⚠️ 搭话技巧：用「开放式问题」而非闭合问题，闭合问题会让对话终止。' },
        { who: 'B', en: 'Sure. The coffee shop on the third floor is great. And the rooftop at lunch is quiet.', cn: '当然。三楼咖啡店很棒，午餐时间的屋顶很安静。', focus: 'The + 序数词表示「第几层」；at lunch 在午餐时。', tip: '分享「内部信息」是陌生人迅速变熟的最有效方法。' },
        { who: 'A', en: 'That\'s helpful. Thanks for letting me ramble on.', cn: '很有帮助。谢谢你听我絮叨。', focus: 'ramble on 喋喋不休，是自谦的说法。', tip: '「Thanks for letting me ramble」是结束对话的得体方式。' },
        { who: 'B', en: 'No problem. Enjoy the coffee shop!', cn: '不客气。咖啡店很值得一试！', focus: 'Enjoy + 名词，祝对方享受。', tip: '用「祝你享受 X」代替「再见」，更友好。' }
      ]
    },
    {
      id: 'x-11', lv: 'L3', title: 'Talking About a Photo', titleCn: '聊天时谈论照片', minutes: 6,
      goal: '能自然评论照片、问背景、不打听敏感信息',
      challenge: '用「What\'s the story behind this?」问出照片背景',
      lines: [
        { who: 'A', en: 'Is that a photo from your trip last weekend?', cn: '这是你上周末旅行拍的照片吗？', focus: '注意比较：照片是 taken（拍），人is 去了。', tip: '⚠️ 中文说「我去的时候拍的」，英文要说 you took this photo。' },
        { who: 'B', en: 'Yeah, we hiked up the mountain. It was brutal but beautiful.', cn: '对，我们爬了山。很累但很美。', focus: 'brutal 原指「残酷的」，这里口语化形容「累」。', tip: 'brutal 在年轻人口语中意为「累坏了」，不只指暴力。' },
        { who: 'A', en: 'Wow, the view is incredible. How long did it take?', cn: '哇，景色太棒了。花了多久？', focus: 'incredible 令人难以置信的；How long did it take 问耗时。', tip: '用 how long 问「多久」，用 how far 问「多远」。' },
        { who: 'B', en: 'About four hours up, two down. Longer than I expected.', cn: '上山路四小时，下山两小时。比我预想的久。', focus: 'up / down 表示上行下行，是最简洁的表达。', tip: '「四小时上去」用 four hours up，不说 up four hours。' },
        { who: 'A', en: 'What\'s the story behind this shot?', cn: '这张照片背后有什么故事？', focus: 'the story behind… 「背后的故事」，是照片话题的高级问法。', tip: '比 What happened here 更柔和，且暗示「我看到有趣的东西」。' },
        { who: 'B', en: 'We almost turned back. It was pouring rain and my friend slipped.', cn: '我们差点掉头回去。大雨，我朋友滑倒了。', focus: 'almost turned back 差点返回；slip 滑倒。', tip: 'pouring rain 是「下大雨」，动词 pour 表示雨倾盆。' },
        { who: 'A', en: 'That sounds like a story worth telling. You should share it more often.', cn: '这故事值得讲。你应该多分享。', focus: 'worth + 动名词 值得做；share… more often 多分享。', tip: 'worth 后面只能接动名词，不能接不定式。' },
        { who: 'B', en: 'Maybe I will. Thanks for asking.', cn: '也许吧。谢谢你问。', focus: 'Thanks for asking 谢谢你问，是自然的收尾。', tip: '英文文化中「问照片」是安全话题，比问收入更得体。' }
      ]
    },
    {
      id: 'x-12', lv: 'L3', title: 'Declining an Invitation Politely', titleCn: '礼貌地拒绝邀约', minutes: 6,
      goal: '能拒绝而不伤关系、给出理由、提供替代',
      challenge: '用「I wish I could, but…」拒绝并约下次',
      lines: [
        { who: 'A', en: 'Hey, are you free Saturday? There\'s a concert downtown.', cn: '嘿，周六有空吗？市中心有场演唱会。', focus: 'There\'s a concert downtown 用 there\'s 引出邀约理由。', tip: '给出「理由」再问，比直接问更易被接受。' },
        { who: 'B', en: 'That sounds fun! Let me check my schedule.', cn: '听起来不错！我查下日程。', focus: 'That sounds fun! 先表达兴趣再考虑，是缓冲。', tip: '不要立刻说 yes/no，先说 sounds fun 给自己留时间。' },
        { who: 'B', en: 'Actually, I have a family thing that night. I wish I could go.', cn: '实际上，那天晚上我有家里的事。真想去。', focus: 'I wish I could + 动词原形，表达遗憾。', tip: 'I wish I could 表示「真希望可以」，是拒绝时最暖的说法。' },
        { who: 'A', en: 'No worries. Next time, though.', cn: '没事。下次一定。', focus: 'No worries 是英式常用，美式多说 No problem。', tip: '⚠️ 英美差异：英式 No worries / quite， 美式 No problem / sure。' },
        { who: 'B', en: 'I\'ll hold you to that. Rain check on the concert?', cn: '我可记着了。演唱会改天约？', focus: 'hold you to that 让你说话算数；rain check 改天。', tip: 'rain check 源自雨天无法赴约，现泛指「改天」。' },
        { who: 'A', en: 'Rain check works. How about the following weekend?', cn: '改天行。下一个周末怎么样？', focus: 'the following weekend 指「下下周」，避免与 next week 混淆。', tip: '⚠️ this/next/last + 时间的歧义：用 the following 更精确。' },
        { who: 'B', en: 'Works for me. Let\'s do something cheaper though — coffee?', cn: '我这边可以。不过换个便宜点的——喝咖啡？', focus: 'Let\'s do + 提议，do 表示「进行某活动」。', tip: '提出更省钱的替代方案，显得体贴而非难搞。' },
        { who: 'A', en: 'Coffee sounds even better. Text me the details.', cn: '喝咖啡更好。细节发我消息。', focus: 'even better 更好，语气积极。', tip: '拒绝后立刻给出你更想要的方案，是关键。' }
      ]
    }
  ];

  function byLevel(lv) { return SCENES.filter(function (s) { return !lv || lv === 'ALL' || s.lv === lv; }); }

  global.DailySceneContent = { SCENES: SCENES, byLevel: byLevel };
})(window);