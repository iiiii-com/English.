/* ============================================================
   content-scene-expansion.js —— 场景对话扩充（36 → 60）
   补齐缺口：
     L1（+8）基础自理 —— 银行、剪头发、洗衣、坐地铁、药店、
                       问时间、借用东西、丢失物品
     L2（+8）生活服务 —— 酒店入住、快递、加油、宠物、
                       理发预约、搬家、维修、办卡
     L3（+8）社交进阶 —— 婚礼邀请、聚会自我介绍、劝酒、
                       dating、分手、道歉和原谅、介绍他人、闲聊天气

   每场景 8-10 句，每句含：en 英文 / cn 中文 / focus 发音要点 / tip 提示
   ============================================================ */
(function (global) {
  'use strict';

  var SCENES = [
    /* ==================== L1 基础自理 ==================== */
    {
      id: 'x1-01', lv: 'L1', title: 'At the Bank', titleCn: '在银行办理业务', minutes: 9,
      goal: '能完成开户、兑换、查询等基础银行事务',
      challenge: '用「I\'d like to…」礼貌地提出需求，不用命令句',
      lines: [
        { who: 'A', en: 'Good morning. What can I do for you?', cn: '早上好，需要什么服务？', focus: 'What can I do for you 服务行业标准问候语', tip: '主动问需求，比"How can I help?"更自然。' },
        { who: 'B', en: "I'd like to open an account.", cn: '我想开个账户。', focus: 'I would like to 比 I want to 礼貌', tip: '银行、柜台等正式场合用 I would like。' },
        { who: 'A', en: 'Certainly. Do you have identification with you?', cn: '当然，您带证件了吗？', focus: 'identification = identify 的名词，指身份证件', tip: 'identification 口语常缩写为 ID。' },
        { who: 'B', en: 'Here is my passport. Is that enough?', cn: '这是我的护照，够了吗？', focus: 'Is that enough?「这样够吗」句末用升调', tip: '确认句 Is that enough? 比用陈述句礼貌。' },
        { who: 'A', en: 'That works. Could you sign here, please?', cn: '可以，请在这里签名。', focus: 'sign here 重音在 here', tip: 'sign 在这里是动词「签名」。' },
        { who: 'B', en: 'Should I use my pen or yours?', cn: '用我的笔还是你的？', focus: 'yours / your 是同类词，勿混', tip: '名词性物主代词：mine / yours / his / hers。' },
        { who: 'A', en: 'Use yours, if you don\'t mind.', cn: '如果不介意的话用您的。', focus: 'if you do not mind 条件状语从句', tip: 'if you don\'t mind = if you would mind 的缩写。' },
        { who: 'B', en: 'How long does it take to get the card?', cn: '办卡需要多久？', focus: 'It takes + 时间 + to do', tip: '提问办事时长的高频句式。' },
        { who: 'A', en: 'About three working days. We\'ll send you a text.', cn: '大约三个工作日，我们会发短信通知您。', focus: 'working days 工作日（不含周末）', tip: 'text 在美式英语中已泛指「短信」。' }
      ]
    },
    {
      id: 'x1-02', lv: 'L1', title: 'At the Hair Salon', titleCn: '理发', minutes: 8,
      goal: '能说明想剪什么发型、长度',
      challenge: '用「Just a little off the sides」表达小幅修剪',
      lines: [
        { who: 'A', en: 'Do you have an appointment?', cn: '您有预约吗？', focus: 'appointment 重音在 point', tip: '没有预约也可直接说 Walk-in, please。' },
        { who: 'B', en: 'No, I walked in. I\'d like a haircut.', cn: '没有，我是直接来的。我想剪头发。', focus: 'walk in 是「走进店」，walked in 是其过去式', tip: 'walk-in 作名词：无预约顾客。' },
        { who: 'A', en: 'How much would you like off?', cn: '想剪掉多少？', focus: 'get / have + off 表示「剪掉」', tip: '口语常用 ask for + 长度。' },
        { who: 'B', en: 'Just a little off the sides and the back.', cn: '侧面和后面稍微剪一点。', focus: 'a little 表示「少量、稍微」', tip: '不想大改时说 just a little off。' },
        { who: 'A', en: 'Would you like to keep it long in front?', cn: '前面要留长吗？', focus: 'keep + it + long「保持长」', tip: 'keep 表示状态维持。' },
        { who: 'B', en: 'Yes, but trim the ends.', cn: '要，但把发尾修一下。', focus: 'trim 比 cut 更精确「小幅度修剪」', tip: 'trim the ends 是理发高频表达。' },
        { who: 'A', en: 'Any product you would like afterwards?', cn: '做完之后需要护理产品吗？', focus: 'afterwards 之后，副词', tip: 'afterwards 不接宾语。' },
        { who: 'B', en: 'No, that\'s all. How long will it take?', cn: '不用了，就这些。要多久？', focus: "that\\'s all「就这些」", tip: '结账前的固定说法。' }
      ]
    },
    {
      id: 'x1-03', lv: 'L1', title: 'Taking the Metro', titleCn: '坐地铁', minutes: 8,
      goal: '能买票、刷卡、换乘、报站',
      challenge: '用「You need to change at…」说换乘',
      lines: [
        { who: 'A', en: 'Excuse me, which line goes to the airport?', cn: '请问哪条线去机场？', focus: 'which line 重音在 line', tip: '地铁问路必用 line 而非 road。' },
        { who: 'B', en: 'Line 2. You need to change at Central Station.', cn: '2号线。你要在中央站换乘。', focus: 'change at + 站名', tip: 'change at 换乘，change to 换成（路线）。' },
        { who: 'A', en: 'How many stops is that?', cn: '有幾站？', focus: 'How many stops 复数', tip: 'stop 在此指「站」这个量。' },
        { who: 'B', en: 'About five. It takes roughly twenty minutes.', cn: '大概五站，大约二十分钟。', focus: 'roughly ≈ approximately', tip: 'roughly 更口语化。' },
        { who: 'A', en: 'Do I need a ticket or a card?', cn: '我需要买票还是刷卡？', focus: 'need A or B 选择', tip: '现在很多城市支持手机扫码，也可问。' },
        { who: 'B', en: 'A single ticket, or a travel card if you ride often.', cn: '单程票，常坐的话建议用交通卡。', focus: 'if you ride often 条件从句', tip: 'single 指单程，return 指往返。' },
        { who: 'A', en: 'Which platform is it?', cn: '在几号站台？', focus: 'platform 重音在前 plat-', tip: '美式读 /ˈplætfɔːrm/。' },
        { who: 'B', en: 'Platform two. Mind the gap when you get off.', cn: '2号站台。下车时注意站台间隙。', focus: 'mind the gap 广播高频（注意间隙）', tip: '英国地铁经典广播用语。' }
      ]
    },
    {
      id: 'x1-04', lv: 'L1', title: 'At the Pharmacy', titleCn: '在药店', minutes: 8,
      goal: '能说明症状并买对应药品',
      challenge: '用「I have a…」「I\'ve got a…」说明症状',
      lines: [
        { who: 'A', en: 'What seems to be the problem?', cn: '哪里不舒服？', focus: 'What seems to be 委婉提问', tip: '避免直接问 What\'s wrong，语气更柔。' },
        { who: 'B', en: 'I have a sore throat and a slight fever.', cn: '我嗓子疼，还有点发烧。', focus: 'sore throat 嗓子疼；slight 轻微的', tip: 'a slight fever = 低烧。' },
        { who: 'A', en: 'How long have you had it?', cn: '持续多久了？', focus: '现在完成进行时强调持续', tip: '问病程必用 have had，不用 did。' },
        { who: 'B', en: 'Since yesterday evening. I feel worse at night.', cn: '从昨晚开始，晚上更严重。', focus: 'Since + 时间点', tip: 'worse 是 bad 的比较级。' },
        { who: 'A', en: 'Are you allergic to anything?', cn: '你对什么过敏吗？', focus: 'be allergic to 对…过敏', tip: '常用搭配，务必记牢。' },
        { who: 'B', en: 'No, nothing. I\'m not taking any medication.', cn: '没有，什么都没过敏。我没在吃药。', focus: 'nothing 表示「没有东西」', tip: 'nothing / none / nobody 三者呼应。' },
        { who: 'A', en: 'Here, take these twice a day after meals.', cn: '这个一天吃两次，饭后。', focus: 'twice a day 一天两次', tip: '饭前 before meals，饭后 after meals。' },
        { who: 'B', en: 'Thank you. Should I come back if it doesn\'t help?', cn: '谢谢。如果没好转我要再来吗？', focus: 'if it does not help 条件从句', tip: '问「要不要复诊」的正确说法。' }
      ]
    },
    {
      id: 'x1-05', lv: 'L1', title: 'Asking the Time', titleCn: '问时间与日期', minutes: 6,
      goal: '能问时间、日期并听懂回答',
      challenge: '区分 past / to / past 的时间表达',
      lines: [
        { who: 'A', en: 'Excuse me, what time is it?', cn: '请问几点了？', focus: 'what time is it 问具体时刻', tip: '问「几点了」用 what time，不问「几点几分」也用它。' },
        { who: 'B', en: 'It\'s half past two.', cn: '两点半。', focus: 'half past two = 2:30（英式）', tip: '美式多说 two thirty；quarter past 表示 :15。' },
        { who: 'A', en: 'Thanks. And what\'s today\'s date?', cn: '谢谢。今天几号？', focus: 'date 日期；day 星期', tip: '注意区分：date 是几号，day 是星期几。' },
        { who: 'B', en: 'It\'s the fifteenth of March.', cn: '三月十五号。', focus: 'the + 序数词 + of + 月份', tip: '美式常省略 the：March fifteenth。' },
        { who: 'A', en: 'What day is it again?', cn: '今天星期几？', focus: 'What day is it 问星期', tip: '再次确认星期用 again。' },
        { who: 'B', en: 'Friday. The weekend is almost here.', cn: '星期五。周末快到了。', focus: 'the weekend「那个周末」', tip: '说「周末到了」用 here，不是 come。' },
        { who: 'A', en: 'Does the shop open at nine on Saturdays?', cn: '商店周六九点开门吗？', focus: 'Does + 主语 + 动词原形（疑问）', tip: '第三人称单数疑问要用 Does。' },
        { who: 'B', en: 'At ten on Saturdays, at nine on weekdays.', cn: '周六十点，工作日九点。', focus: 'weekdays 工作日；weekends 周末', tip: 'weekday 指周一到周五。' }
      ]
    },
    {
      id: 'x1-06', lv: 'L1', title: 'Lost and Found', titleCn: '丢失物品与报失', minutes: 8,
      goal: '能描述丢失的物品并办理挂失',
      challenge: '用「I think I left it on…」说可能遗落地点',
      lines: [
        { who: 'A', en: 'I think I left my wallet on the bus.', cn: '我觉得我把钱包落在公交上了。', focus: 'left 是 leave 的过去式', tip: 'left 兼指「左边」与「留下」，看语境判断。' },
        { who: 'B', en: 'What colour is it?', cn: '什么颜色的？', focus: 'colour 英式 / 美式 color', tip: 'colour 更常用；回答时可具体说 black / brown。' },
        { who: 'A', en: 'Dark brown, with a small metal clasp.', cn: '深棕色，有个小的金属扣。', focus: 'clasp 扣子；metal adj. 金属的', tip: '描述特征时 from 引导：a wallet with…' },
        { who: 'B', en: 'Let me check with the driver.', cn: '我问一下司机。', focus: 'check with sb 向某人核实', tip: 'check with 是「与…核实」，check 是「检查」。' },
        { who: 'A', en: 'Thanks. I also lost a phone charger.', cn: '谢谢。我还丢了个手机充电器。', focus: 'charger 充电器', tip: 'phone charger 是固定搭配。' },
        { who: 'B', en: 'Where did you last use it?', cn: '你最后在哪用的？', focus: 'last use 最后一次使用', tip: 'last 作副词表示「最后一次」。' },
        { who: 'A', en: 'In the library, yesterday afternoon.', cn: '昨天下午在图书馆。', focus: '用地点+时间的顺序作状语', tip: '英式常把地点放时间前。' },
        { who: 'B', en: 'I\'ll ask the library staff. Leave your number, please.', cn: '我去问图书馆工作人员。麻烦留个号码。', focus: 'staff 全体员工（集合名词）', tip: 'staff 作单数用，谓语用复数。' }
      ]
    },
    {
      id: 'x1-07', lv: 'L1', title: 'Asking to Borrow Something', titleCn: '借用东西', minutes: 7,
      goal: '能礼貌地请求借用并说明归还时间',
      challenge: '用「Could I possibly borrow…」加强礼貌程度',
      lines: [
        { who: 'A', en: 'Could I borrow your charger for a minute?', cn: '能借用一下你的充电器吗？', focus: 'for a minute 一会儿', tip: 'for + 时间段是持续多久，不是频率。' },
        { who: 'B', en: 'Sure, here you go. I don\'t need it right now.', cn: '当然，给你。我现在不用。', focus: 'here you go 给你（递东西时说）', tip: 'here you go 比 give you 更自然。' },
        { who: 'A', en: 'Thanks so much. I\'ll give it back before dinner.', cn: '太感谢了。晚饭前还你。', focus: 'give back 归还；before dinner', tip: 'give back 是「还回去」，比 return 更口语。' },
        { who: 'B', en: 'No rush. I have a spare one.', cn: '不急，我有一个备用的。', focus: 'spare adj. 备用的', tip: 'No rush 表示不用赶时间。' },
        { who: 'A', en: 'Actually, could I possibly borrow an umbrella too?', cn: '话说，能再借把伞吗？', focus: 'possibly 让请求更委婉', tip: 'Could I possibly 是加强礼貌的组合。' },
        { who: 'B', en: 'Of course. Here you go again.', cn: '当然，再给你。', focus: 'again 表示第二次做同一动作', tip: 'again 放在动词后。' },
        { who: 'A', en: 'You\'re very kind. I owe you one.', cn: '你人真好，我欠你个人情。', focus: 'owe sb one 欠某人一次人情', tip: '口语常用，别当成真的债务。' },
        { who: 'B', en: 'Just bring them back together, that\'s all.', cn: '一起还回来就行。', focus: 'together 一起；that\'s all 就这样', tip: 'that\'s all 是「就这些」的呼应。' }
      ]
    },
    {
      id: 'x1-08', lv: 'L1', title: 'Laundromat', titleCn: '自助洗衣店', minutes: 7,
      goal: '能使用洗衣设备、处理不同衣物',
      challenge: '用「separate…wash」表达分洗',
      lines: [
        { who: 'A', en: 'Do you have a machine available?', cn: '有空着的机器吗？', focus: 'available 可用的', tip: 'be available 表示「有空的」。' },
        { who: 'B', en: 'Number four is free. It takes forty minutes.', cn: '4号空着。四十分钟。', focus: 'free 空闲的（此处非免费）', tip: 'free 在机场/洗衣服语境指「空闲」。' },
        { who: 'A', en: 'Great. How do I pay?', cn: '好。怎么付款？', focus: 'How do I…? 问操作方式', tip: '问流程用 How do I。' },
        { who: 'B', en: 'Coin in the machine, or use the app.', cn: '机器投币，或者用手机应用。', focus: 'coin 可数「硬币」', tip: '或用 or 连接两种方式。' },
        { who: 'A', en: 'Should I wash delicates separately?', cn: '娇贵衣物要分开洗吗？', focus: 'delicates 娇贵衣物（名词复数）', tip: 'delicate 作形容词「精致的」。' },
        { who: 'B', en: 'Yes, and use cold water for wool.', cn: '要，羊毛制品用冷水。', focus: 'wool 羊毛；cold water 冷水', tip: '羊毛衫必须冷水，避免缩水。' },
        { who: 'A', en: 'How long until it\'s done?', cn: '多久能好？', focus: 'until + 时间点', tip: '疑问词 + until + 时间的省略句型。' },
        { who: 'B', en: 'The machine will beep. Don\'t leave your clothes.', cn: '机器会响。别把衣服忘了。', focus: 'beep 蜂鸣', tip: '美式说 dryer，洗衣机叫 washer。' }
      ]
    },

    /* ==================== L2 生活服务 ==================== */
    {
      id: 'x2-01', lv: 'L2', title: 'Hotel Check-in', titleCn: '酒店入住与需求', minutes: 10,
      goal: '能办理入住并提出住宿要求',
      challenge: '用「I was wondering if you could…」礼貌提要求',
      lines: [
        { who: 'A', en: 'Good evening. Do you have a reservation?', cn: '晚上好，有预订吗？', focus: 'reservation 预订；have a reservation', tip: '「有预订」是 have a reservation，不是 make（那是预订动作）。' },
        { who: 'B', en: 'Yes, under Chen, for three nights.', cn: '有的，姓陈，住三晚。', focus: 'under + 姓 表示「以…名义」', tip: '登记时说 under your last name。' },
        { who: 'A', en: 'Perfect. Your room is 805, on the eighth floor.', cn: '好的，您的房间是805，8楼。', focus: 'on the + 序数词 + floor', tip: '英式说 first floor 是一楼；美式 first floor 是二楼。' },
        { who: 'B', en: 'Is breakfast included?', cn: '含早餐吗？', focus: 'be included 被包含', tip: 'include 的反义是 exclude。' },
        { who: 'A', en: 'It is, from seven to ten in the morning.', cn: '含的，早上七点到十点。', focus: 'from…to… 从…到…', tip: '美式也常说 from seven to ten。' },
        { who: 'B', en: 'I was wondering if you could arrange a late checkout.', cn: '不知道能否安排延迟退房？', focus: 'I was wondering if… 委婉请求', tip: '这是最礼貌的请求句式之一。' },
        { who: 'A', en: 'I can check. How late do you need it?', cn: '我查一下。您需要到几点？', focus: 'How late 到多晚', tip: 'check 在此是「查一下」。' },
        { who: 'B', en: 'Two in the afternoon, if possible.', cn: '如果可以的话，下午两点。', focus: 'if possible 如果可能', tip: '加 if possible 让要求更软。' },
        { who: 'A', en: 'Let me see what I can do. I\'ll let you know tonight.', cn: '我看看能否安排，今晚通知您。', focus: 'let you know 告诉你', tip: 'let sb know 固定搭配。' }
      ]
    },
    {
      id: 'x2-02', lv: 'L2', title: 'Sending a Parcel', titleCn: '寄快递与填单', minutes: 9,
      goal: '能寄件、填单、选择服务',
      challenge: '用「I\'d like to send this to…」说明寄往何处',
      lines: [
        { who: 'A', en: 'What can I do for you?', cn: '需要什么服务？', focus: '寄件场景的通用问候', tip: '与银行/药店问法一致。' },
        { who: 'B', en: "I'd like to send this to Shanghai.", cn: '我想把这个寄到上海。', focus: 'send sth to + 地点', tip: '寄往用 to + 城市。' },
        { who: 'A', en: 'Sure. Is there anything fragile inside?', cn: '好的。里面有易碎品吗？', focus: 'fragile 易碎的', tip: 'fragile 是快递包装上的高频标识。' },
        { who: 'B', en: 'Yes, it\'s a glass item. Please handle it with care.', cn: '是的，是玻璃制品，请小心轻放。', focus: 'handle with care 小心轻放', tip: '这句印在包装上，实际使用率很高。' },
        { who: 'A', en: 'We\'ll add extra padding. How fast do you need it?', cn: '我们会加防撞材料。你要多快？', focus: 'padding 缓冲材料', tip: '问时效用 How fast。' },
        { who: 'B', en: 'Within three days if possible.', cn: '如果可以的话三天内。', focus: 'within + 时间段「在…之内」', tip: 'within three days = 三天以内。' },
        { who: 'A', en: 'Express is two days, standard is five.', cn: '快递两天，标准五天。', focus: 'express 快递；standard 标准', tip: 'express 在此是「快递服务」而非「表达」。' },
        { who: 'B', en: 'Express, please. Here is the address.', cn: '请用快递。这是地址。', focus: 'address 重音在第二个音节', tip: 'address 作动词时重音在前 /əˈdres/。' },
        { who: 'A', en: 'That\'ll be twenty-eight yuan. Keep your receipt.', cn: '一共28元，请保留收据。', focus: 'yuan 元（人民币单位）', tip: 'keep your receipt 是固定提醒。' }
      ]
    },
    {
      id: 'x2-03', lv: 'L2', title: 'Filling Up the Car', titleCn: '加油', minutes: 8,
      goal: '能指定油品、金额并付款',
      challenge: '用「Fill it up, please」和「Unleaded, please」',
      lines: [
        { who: 'A', en: 'Good afternoon. Full service or just fill-up?', cn: '下午好。需要全服务还是只加油？', focus: 'fill-up 只加油；full service 全服务', tip: 'full service 包含洗车等增值服务。' },
        { who: 'B', en: 'Just fill-up, please. Unleaded.', cn: '只加油，谢谢。加无铅汽油。', focus: 'unleaded 无铅的', tip: 'unleaded / diesel 是加油必知词。' },
        { who: 'A', en: 'Regular or premium?', cn: '普通还是高级？', focus: 'premium 高级的；regular 普通的', tip: '美式油价分 regular / mid-grade / premium。' },
        { who: 'B', en: 'Regular is fine. How much is it?', cn: '普通就行。多少钱？', focus: 'X is fine「X 就好」', tip: 'is fine 表示接受建议。' },
        { who: 'A', en: 'Forty-two fifty. Card or cash?', cn: '42块5。刷卡还是现金？', focus: 'forty-two fifty = 42.5', tip: '口语价格常省略小数点后的 zero。' },
        { who: 'B', en: 'Card, please.', cn: '刷卡。', focus: 'card 刷卡（省略 pay by）', tip: '刷卡说 card，不说 credit card 也行。' },
        { who: 'A', en: 'Tap your card here. Would you like a receipt?', cn: '在这里刷卡。需要收据吗？', focus: 'tap 轻触（感应式刷卡）', tip: 'tap 指碰一下，不用插卡。' },
        { who: 'B', en: 'No thanks. Drive safely.', cn: '不用了。开车小心。', focus: 'drive safely 祝行车安全', tip: '英语里说 safe trip 比 drive safely 更常见于告别。' }
      ]
    },
    {
      id: 'x2-04', lv: 'L2', title: 'At the Vet', titleCn: '带宠物看医生', minutes: 9,
      goal: '能描述宠物症状并理解医嘱',
      challenge: '用「He hasn\'t been eating」描述持续症状',
      lines: [
        { who: 'A', en: 'What seems to be the problem?', cn: '它怎么了？', focus: '宠物场景问诊开场', tip: 'it 指宠物，避免用 he/she 混淆。' },
        { who: 'B', en: 'He hasn\'t been eating for two days.', cn: '它两天没吃东西了。', focus: '现在完成进行时表持续', tip: '强调「到现在为止一直没」。' },
        { who: 'A', en: 'Any vomiting or diarrhoea?', cn: '有呕吐或腹泻吗？', focus: 'diarrhoea 腹泻（英式拼写）', tip: '美式拼作 diarrhea。' },
        { who: 'B', en: 'Vomiting once yesterday, nothing since.', cn: '昨天吐过一次，之后没有了。', focus: 'once 表一次；nothing since 之后没有', tip: 'once/ twice/ three times 表次数。' },
        { who: 'A', en: 'Let me examine him. Does he usually eat this much?', cn: '我检查一下。他平时吃这么多吗？', focus: 'examine 检查（动词）', tip: 'examine /ɪɡˈzæmɪn/。' },
        { who: 'B', en: 'No, usually less. He\'s been quiet too.', cn: '没有，平时更少。他还很安静。', focus: 'quiet 在此指「没精神、不活跃」', tip: '宠物语境下 quiet 描述异常安静。' },
        { who: 'A', en: 'He\'s mildly dehydrated. Give him this twice daily.', cn: '他轻度脱水。这个一天喂两次。', focus: 'dehydrated 脱水的；daily 每日', tip: 'once daily = 一天一次；twice daily = 一天两次。' },
        { who: 'B', en: 'Should I change his food?', cn: '我要换粮吗？', focus: 'change his food 换食物', tip: '宠物用 he/she/it 都可以，it 最中性。' },
        { who: 'A', en: 'Gradually, over a week. Cats need time.', cn: '一周内逐渐换。猫需要时间。', focus: 'gradually 逐渐地；over a week 一周内', tip: '突然换粮会导致肠胃问题。' }
      ]
    },
    {
      id: 'x2-05', lv: 'L2', title: 'Making an Appointment', titleCn: '预约与改期', minutes: 9,
      goal: '能预约、改期或取消',
      challenge: '用「I\'d like to reschedule to…」改期',
      lines: [
        { who: 'A', en: 'Salon, how can I help you?', cn: '美容院，需要什么？', focus: 'how can I help 服务开场', tip: '比 what can I do 更通用。' },
        { who: 'B', en: 'I have an appointment on Friday, but I need to move it.', cn: '我约了周五，但想改时间。', focus: 'move it 指「改期」，口语常用', tip: '正式说法是 reschedule。' },
        { who: 'A', en: 'No problem. What day works better?', cn: '没问题。哪天更方便？', focus: 'work better 更合适', tip: '「更适合你」用 works better for you。' },
        { who: 'B', en: 'Could I move it to Monday afternoon?', cn: '能改到周一下午吗？', focus: 'move it to + 时间', tip: 'Could I…? 比 Can I…? 更礼貌。' },
        { who: 'A', en: 'Let me check. We have a slot at three.', cn: '我看看。三点有个空位。', focus: 'slot 空档位', tip: 'slot 多指时间空档。' },
        { who: 'B', en: 'Three works. Is there anything I need to prepare?', cn: '三点可以。有什么需要准备的吗？', focus: 'prepare for 为…做准备', tip: '问「要不要忌口/带什么」用 prepare。' },
        { who: 'A', en: 'Just come with clean hair, if you can.', cn: '如果可以，洗净头发来就行。', focus: 'clean hair 干净的头发（不用吹）', tip: 'wash your hair 洗发 ≠ dry your hair 吹干。' },
        { who: 'B', en: 'Got it. So Monday at three.', cn: '明白了。所以周一点。', focus: 'Got it 明白了（口语）', tip: 'Got it 确认信息已收到。' },
        { who: 'A', en: 'Correct. See you then.', cn: '没错。到时见。', focus: 'Correct 对；See you then 到时见', tip: '确认信息时的标准收尾。' }
      ]
    },
    {
      id: 'x2-06', lv: 'L2', title: 'Moving House', titleCn: '搬家', minutes: 10,
      goal: '能协调搬家、确认细节与时间',
      challenge: '用「We\'d like to move on…」说明计划',
      lines: [
        { who: 'A', en: 'What can I help you with today?', cn: '今天需要什么帮助？', focus: 'What can I help you with', tip: '比 What can I do for you 更主动。' },
        { who: 'B', en: "We'd like to book a move for next Saturday.", cn: '我们想预约下周六搬家。', focus: 'book a move 预约搬家', tip: 'book 是「预订」，比 make 更常用。' },
        { who: 'A', en: 'How many rooms are we talking about?', cn: '一共几间房？', focus: 'What are we talking about? 委婉问', tip: '这句常用于敏感话题的委婉提问。' },
        { who: 'B', en: 'Two bedrooms and a living room.', cn: '两卧一厅。', focus: 'bedroom 卧室（bed room 也可）', tip: '卧室说 bedroom，不说 sleeping room。' },
        { who: 'A', en: 'Do you have stairs or a lift?', cn: '有楼梯还是电梯？', focus: 'stairs 楼梯；lift 电梯（英式）', tip: '美式电梯叫 elevator。' },
        { who: 'B', en: 'Second floor, no lift. Will that cost extra?', cn: '二楼，没电梯。会加钱吗？', focus: 'extra 额外的', tip: '问费用用 Will that cost extra?。' },
        { who: 'A', en: 'There\'s a small charge. Also, is there parking?', cn: '会收一点费用。另外有停车位吗？', focus: 'small charge 少量费用', tip: 'charge 可作名词费用或动词收费。' },
        { who: 'B', en: 'Yes, the truck can park outside.', cn: '有，货车可以停在外面。', focus: 'truck 卡车（英式 lorry）', tip: 'moving truck 搬家车。' },
        { who: 'A', en: 'Great. Eight in the morning, then?', cn: '好的。早上八点？', focus: 'Eight in the morning 早上八点', tip: 'in the morning/afternoon/evening 是大时段。' },
        { who: 'B', en: 'Works for us. We\'ll be ready by seven.', cn: '我们没问题。七点就准备好。', focus: 'be ready 准备好', tip: 'by seven 表示「到七点为止」。' }
      ]
    },
    {
      id: 'x2-07', lv: 'L2', title: 'Reporting a Repair', titleCn: '报修与联系维修', minutes: 9,
      goal: '能描述故障、预约维修、确认费用',
      challenge: '用「It\'s been…since…」描述持续时长',
      lines: [
        { who: 'A', en: 'Customer service, how can I help?', cn: '客服热线，需要帮忙吗？', focus: '客服开场白', tip: '热线客服常见开场。' },
        { who: 'B', en: 'My heating hasn\'t worked since Monday.', cn: '我的暖气从周一就没用了。', focus: 'has not worked since + 时间', tip: 'since 与现在完成时连用。' },
        { who: 'A', en: 'I\'m sorry about that. Have you tried resetting it?', cn: '很抱歉。您试过重启吗？', focus: 'reset 重启；try doing', tip: 'reset 指恢复到初始设置。' },
        { who: 'B', en: 'Yes, twice. It still doesn\'t work.', cn: '试了两次，还是不行。', focus: 'twice 两次；still（加强语气）', tip: 'still 不起就是「依然」。' },
        { who: 'A', en: 'Let\'s book an engineer. Are you home tomorrow?', cn: '我安排工程师。您明天在家吗？', focus: 'engineer 工程师（此处指维修工）', tip: '英式 plumber 水管工 / electrician 电工。' },
        { who: 'B', en: 'Between nine and twelve, yes.', cn: '九点到十二点之间在。', focus: 'between A and B 在两者之间', tip: 'between 用于两者，among 用于三者以上。' },
        { who: 'A', en: 'The visit is free if you\'re under warranty.', cn: '保修期内上门免费。', focus: 'warranty 保修单；under warranty', tip: '保修期是 under warranty。' },
        { who: 'B', en: 'I bought it last year. So it should be free?', cn: '我去年买的。那应该免费吧？', focus: 'I bought it last year 去年买的', tip: '用升调表达确认语气。' },
        { who: 'A', en: 'Let me check the purchase date for you.', cn: '我帮您查一下购买日期。', focus: 'purchase 购买（名词/动词）', tip: 'purchase 较正式，buy 更日常。' }
      ]
    },
    {
      id: 'x2-08', lv: 'L2', title: 'Joining a Gym', titleCn: '健身房与办卡', minutes: 9,
      goal: '能了解会员条款、签合同',
      challenge: '用「What does the contract include?」询问条款',
      lines: [
        { who: 'A', en: 'Hi, welcome. Any interest in a membership?', cn: '你好，欢迎。有办会员的意向吗？', focus: 'membership 会员资格', tip: '办卡说 take out a membership。' },
        { who: 'B', en: 'What does the monthly plan include?', cn: '月卡包含什么？', focus: 'include 包含；monthly plan 月度方案', tip: 'monthly/annual/yearly 是常见定价周期。' },
        { who: 'A', en: 'Gym, group classes, and one personal session.', cn: '健身房、团课，还有一次私教。', focus: 'group class 团课；personal session 私教课', tip: 'session 课次，一次一节。' },
        { who: 'B', en: 'Is there a joining fee?', cn: '有入会费吗？', focus: 'joining fee / sign-up fee 入会费', tip: 'joining fee 是一次性费用。' },
        { who: 'A', en: 'Yes, thirty yuan. It\'s waived for annual plans.', cn: '有，30元。年卡可免。', focus: 'be waived 被免除', tip: 'waive 是「放弃、免除」。' },
        { who: 'B', en: 'What\'s the cancellation policy?', cn: '取消政策是怎样的？', focus: 'cancellation 取消；policy 政策', tip: '问合同条款必用 policy。' },
        { who: 'A', en: 'Thirty days\' notice, no questions asked.', cn: '提前30天通知，不多问。', focus: 'notice 通知；no questions asked 不作解释', tip: 'notice 作名词表「通知」，作动词表「注意」。' },
        { who: 'B', en: 'Alright. Let\'s do the annual one.', cn: '好吧，那就办年卡。', focus: 'do the annual one 指办年卡', tip: '「就办年卡吧」用 Let\'s do…' },
        { who: 'A', en: 'Great, please scan your ID here.', cn: '好的，请在这里刷证件。', focus: 'scan 扫描/刷', tip: 'scan 在此指读卡。' }
      ]
    },

    /* ==================== L3 社交进阶 ==================== */
    {
      id: 'x3-01', lv: 'L3', title: 'Self-introduction at a Party', titleCn: '聚会自我介绍', minutes: 10,
      goal: '能在短时间内留下深刻印象',
      challenge: '用「What I do is…」一句话概括职业',
      lines: [
        { who: 'A', en: 'Hi, I don\'t think we\'ve met. I\'m Wei.', cn: '你好，我们好像还没见过。我叫伟。', focus: 'do not think we have met 委婉', tip: '寒暄开场的安全说法。' },
        { who: 'B', en: 'Nice to meet you, Wei. I\'m Anna.', cn: '很高兴认识你，伟。我叫安娜。', focus: 'Nice to meet you 首次见面的标准语', tip: '重复名字能帮助对方记住。' },
        { who: 'A', en: 'What do you do?', cn: '你是做什么的？', focus: 'What do you do? 问职业', tip: '不是问「你在做什么动作」。' },
        { who: 'B', en: 'What I do is teaching English to adults.', cn: '我做的是给成人教英语。', focus: 'What I do is… 强调职业', tip: 'teach sb sth = teach sth to sb。' },
        { who: 'A', en: 'Interesting. How long have you been doing that?', cn: '有意思。做多久了？', focus: '现在完成进行时问持续', tip: 'How long + have/has been + doing。' },
        { who: 'B', en: 'About five years. I started right after college.', cn: '大概五年。大学一毕业就开始了。', focus: 'right after 紧接着', tip: 'right after 表示紧接其后。' },
        { who: 'A', en: 'What brought you here tonight?', cn: '今晚什么风把你吹来的？', focus: 'What brought you here? 幽默问来由', tip: '英语里用「什么风」是调侃语气。' },
        { who: 'B', en: 'A friend dragged me along. I mostly came for the food.', cn: '朋友硬拉我来的。我主要是为吃的。', focus: 'drag sb along 硬拽某人', tip: 'mostly 主要地。' },
        { who: 'A', en: 'Fair enough. I\'m here for the same reason.', cn: '合理。我也是为吃的来的。', focus: 'Fair enough 说得也是', tip: '这是很地道的附和语。' }
      ]
    },
    {
      id: 'x3-02', lv: 'L3', title: 'Wedding Invitation', titleCn: '婚礼邀请与出席', minutes: 10,
      goal: '能接受婉拒邀请并询问细节',
      challenge: '用「I\'d love to, but…」婉拒而不失礼',
      lines: [
        { who: 'A', en: 'We\'re getting married in June. Will you come?', cn: '我们六月结婚，你能来吗？', focus: 'get married 结婚；Will you come? 邀请', tip: 'get married 是「结婚」，wedding 是「婚礼」。' },
        { who: 'B', en: 'That\'s wonderful. I\'d love to come.', cn: '太好了，我很愿意来。', focus: 'I\'d love to 表达强烈愿意', tip: 'to 在此是不定式，不是介词。' },
        { who: 'A', en: 'Great. It\'s a small ceremony, about forty people.', cn: '太好了。是小型仪式，大概40人。', focus: 'ceremony 仪式', tip: 'small ceremony 指婚礼规模小。' },
        { who: 'B', en: 'That\'s lovely. Is there a dress code?', cn: '真好。有着装要求吗？', focus: 'dress code 着装规范', tip: '问婚礼着装的标准问法。' },
        { who: 'A', en: 'Semi-formal. Nothing too dark.', cn: '半正式。别穿太深的颜色。', focus: 'semi-formal 半正式；too + adj 太…', tip: 'too dark 指黑色等深色。' },
        { who: 'B', en: 'Noted. Can I bring a plus one?', cn: '记下了。我能带一个人吗？', focus: 'plus one 携伴（活动常用词）', tip: 'bringa +1 是社交场合高频。' },
        { who: 'A', en: 'Of course. Does your partner have a name for the list?', cn: '当然。您伴侣的名字要登记吗？', focus: 'name sb for the list 为…登记姓名', tip: 'partner 比 girlfriend/boyfriend 更中性。' },
        { who: 'B', en: 'It\'s Lin. Lin Tao. Here, I\'ll write it down.', cn: '叫 Lin。林涛。我写下来。', focus: 'spell out 拼写出来', tip: '名字拼不清时说「How do you spell it?」。' },
        { who: 'A', en: 'Perfect. Thank you for coming.', cn: '完美。谢谢你来。', focus: 'Thank you for + 动名词', tip: 'for 后接动名词，不接不定式。' }
      ]
    },
    {
      id: 'x3-03', lv: 'L3', title: 'Declining an Invitation Politely', titleCn: '礼貌拒绝邀约', minutes: 9,
      goal: '能拒绝而不伤关系',
      challenge: '用「I\'d love to, but I have…」先肯定再给理由',
      lines: [
        { who: 'A', en: 'We\'re planning a weekend trip. Join us?', cn: '我们打算周末出游。一起吗？', focus: 'Join us? 邀约的开放问句', tip: '比 Will you join us? 更自然。' },
        { who: 'B', en: 'I\'d love to. When are you going?', cn: '我很想去。你们什么时候走？', focus: 'I\'d love to 后面跟 when 追问细节', tip: '先表态再问，是拒绝前的缓冲。' },
        { who: 'A', en: 'Saturday morning, back Sunday evening.', cn: '周六早上，周日晚上回。', focus: 'back Sunday 表示「周日回来」', tip: 'back 在此作副词「回来」。' },
        { who: 'B', en: 'I\'d love to, but I have a family thing that weekend.', cn: '我很想去，但那个周末家里有事。', focus: 'a family thing 家事（委婉说法）', tip: '比 I have plans 更模糊委婉。' },
        { who: 'A', en: 'Ah, tough luck. Another time, maybe?', cn: '啊，真遗憾。下次吧？', focus: 'Another time 改天', tip: 'Another time 是礼貌收尾。' },
        { who: 'B', en: 'Definitely. Let\'s do something smaller soon.', cn: '一定。我们soon找个小点的活动。', focus: 'do something 搞点活动', tip: '提议替代方案以示诚意。' },
        { who: 'A', en: 'Sounds good. I\'ll send you the photos.', cn: '好。我把照片发你。', focus: 'send you the photos 发照片给你', tip: '用「我会给你发照片」延续关系。' },
        { who: 'B', en: 'I\'d like that. Have a great trip!', cn: '好啊。旅途愉快！', focus: 'Have a great trip! 一路顺风', tip: '祝旅途愉快用 trip不用 journey。' }
      ]
    },
    {
      id: 'x3-04', lv: 'L3', title: 'Small Talk: Weather', titleCn: '天气闲聊', minutes: 8,
      goal: '能自然开启并延续天气话题',
      challenge: '从「今天真冷」自然过渡到实际事务',
      lines: [
        { who: 'A', en: 'It\'s freezing out there, isn\'t it?', cn: '外面很冷，是吧？', focus: '反义疑问句 isn\'t it? 求确认', tip: '英语闲聊常用反义疑问句寻求认同。' },
        { who: 'B', en: 'It really is. I wish I\'d brought a coat.', cn: '真是。我该带件外套的。', focus: 'I wish I had done 虚拟语气', tip: 'wish 后用过去式表后悔。' },
        { who: 'A', en: 'The forecast said it would warm up by noon.', cn: '预报说中午会回暖。', focus: 'would + 动词原形 表预测', tip: '主句过去时，从句用 would。' },
        { who: 'B', en: 'That would be nice. I have outdoor lunch planned.', cn: '那就好了。我安排了户外午餐。', focus: 'have… planned 计划好了', tip: 'plan 过去分词作后置定语。' },
        { who: 'A', en: 'Lucky you. We\'ll be stuck inside all day.', cn: '你真幸运。我们一整天都得待在室内。', focus: 'be stuck 被迫困住', tip: 'stuck 是口语常用词。' },
        { who: 'B', en: 'You could always come with us.', cn: '你也可以一起来啊。', focus: 'could always 表「随时可以」', tip: 'always 让邀请更柔和。' },
        { who: 'A', en: 'Maybe next time. Rain check?', cn: '下次吧。改天？', focus: 'rain check 改天（源自下雨）', tip: '源自「下雨则延期」，现泛指改期。' },
        { who: 'B', en: 'Rain check accepted. Take care.', cn: '改天。保重。', focus: 'Take care 保重', tip: '用 rain check 回应是很地道的接话。' }
      ]
    },
    {
      id: 'x3-05', lv: 'L3', title: 'Apologising and Forgiving', titleCn: '道歉与原谅', minutes: 9,
      goal: '能真诚道歉并接受道歉',
      challenge: '用「What I should have done was…」表本意',
      lines: [
        { who: 'A', en: 'I\'m really sorry about yesterday.', cn: '昨天的事我真的很抱歉。', focus: 'be sorry about 为…感到抱歉', tip: 'about 后接事情，to sb 表对谁。' },
        { who: 'B', en: 'I was pretty upset, honestly.', cn: '说实话，我挺难受的。', focus: 'pretty 在此是「相当」', tip: 'honestly 坦率地说。' },
        { who: 'A', en: 'I understand. What I should have done was call you.', cn: '我明白。我本来应该给你打电话的。', focus: 'should have done 本应做而未做', tip: 'should have + 过去分词表遗憾。' },
        { who: 'B', en: 'Yes. I was waiting to hear from you.', cn: '是啊。我一直在等你消息。', focus: 'hear from sb 收到某人的消息', tip: 'hear from 与 hear of 含义不同。' },
        { who: 'A', en: 'I got caught up and forgot. That won\'t happen again.', cn: '我忙昏了头给忘了。不会再发生了。', focus: 'get caught up 被事情缠住', tip: 'get caught up in sth 被卷入。' },
        { who: 'B', en: 'I appreciate you saying that.', cn: '谢谢你这么说。', focus: 'appreciate 后接动名词', tip: 'appreciate 不能接不定式。' },
        { who: 'A', en: 'Do you want to talk about it properly?', cn: '你想好好谈谈吗？', focus: 'talk about it properly 认真谈', tip: 'properly 在此是「认真、彻底」。' },
        { who: 'B', en: 'Let\'s just move on. Let\'s get lunch.', cn: '过去就让它过去吧。我们去吃午饭。', focus: 'move on 继续向前/放下', tip: 'move on 是「翻篇」。' },
        { who: 'A', en: 'Thank you for that. I owe you one.', cn: '谢谢你。我欠你一次。', focus: 'owe sb one 欠你人情', tip: '下次主动表示即可。' }
      ]
    },
    {
      id: 'x3-06', lv: 'L3', title: 'Talking About Work Life', titleCn: '聊工作与生活平衡', minutes: 9,
      goal: '能谈论工作压力与生活平衡',
      challenge: '用「I\'m trying to strike a balance」表达努力平衡',
      lines: [
        { who: 'A', en: 'How\'s work been treating you?', cn: '最近工作怎么样？', focus: 'How\'s X been treating you 是地道问候', tip: '比 How is your work 更自然。' },
        { who: 'B', en: 'Honestly, it\'s been a lot lately.', cn: '说实话，最近挺累的。', focus: 'a lot 大量工作；lately 最近', tip: 'it\'s a lot 委婉表示「事多」。' },
        { who: 'A', en: 'Same here. The deadlines have been relentless.', cn: '我也是。截止日期一个接一个。', focus: 'relentless 不间断的', tip: '形容词可修饰「压力持续不断」。' },
        { who: 'B', en: 'Exactly. I\'m trying to strike a balance.', cn: '正是。我正努力平衡。', focus: 'strike a balance 找到平衡', tip: 'strike 是「达成、取得」之意。' },
        { who: 'A', en: 'How are you managing outside of work?', cn: '工作之外你怎么调节？', focus: 'outside of work 工作之外', tip: 'outside of 比 apart from 更口语。' },
        { who: 'B', en: 'I picked up running. It clears my head.', cn: '我开始跑步了。它能让我清醒。', focus: 'pick up 开始（某爱好）', tip: 'pick up 也表示「学会」「接人」。' },
        { who: 'A', en: 'That\'s a good habit. I should take it up again.', cn: '好习惯。我该重新开始。', focus: 'take up 开始（某活动）', tip: 'pick up 与 take up 都能表「开始」。' },
        { who: 'B', en: 'Let me know if you want company.', cn: '想一起的话跟我说。', focus: 'want company 想有人陪', tip: 'company 在此是「陪伴」不是公司。' }
      ]
    },
    {
      id: 'x3-07', lv: 'L3', title: 'Making Plans on the Spot', titleCn: '临时决定与提议', minutes: 8,
      goal: '能当场提议、协商时间地点',
      challenge: '用「What if we…?」提出折中方案',
      lines: [
        { who: 'A', en: 'Are you free this evening?', cn: '你今晚有空吗？', focus: 'be free 有空', tip: 'free 在此指空闲。' },
        { who: 'B', en: 'Depends. Why are you asking?', cn: '看情况。怎么了？', focus: 'Depends 看情况（口语缩略）', tip: '视情况而定，别用 refuse。' },
        { who: 'A', en: 'I was thinking we could grab dinner.', cn: '我在想我们可以一起吃个饭。', focus: 'grab a bite/eat 快吃', tip: 'grab 在此表示「快速、随便」。' },
        { who: 'B', en: 'Sure, where were you thinking?', cn: '好啊，你想去哪吃？', focus: 'where were you thinking? 想去哪', tip: '很地道的「你有想法吗」。' },
        { who: 'A', en: 'That new place on the corner, maybe?', cn: '街角那家新店，怎么样？', focus: 'on the corner 在拐角处', tip: '用 maybe 结尾留出商量余地。' },
        { who: 'B', en: 'I\'ve heard it\'s good, but it\'s usually packed.', cn: '听说不错，不过通常人很多。', focus: 'packed 挤满（形容店）', tip: 'packed 口语形容拥挤。' },
        { who: 'A', en: 'What if we go a little earlier?', cn: '我们早一点去怎么样？', focus: 'What if we…? 提议', tip: 'What if 开头的建议最常用。' },
        { who: 'B', en: 'That could work. Six thirty, then?', cn: '那可行。六点半？', focus: 'That could work 可能行', tip: 'could work 是「可行」的软化说法。' }
      ]
    },
    {
      id: 'x3-08', lv: 'L3', title: 'Introducing Someone to Someone', titleCn: '为人作介绍', minutes: 8,
      goal: '能在两人之间做介绍并让对话继续',
      challenge: '用「Have you two met?」引出介绍',
      lines: [
        { who: 'A', en: 'Come here a moment. Have you two met?', cn: '过来一下。你们俩见过了吗？', focus: 'Have you two met? 双方见过吗', tip: '用 two 而非 you，避免「你见过他吗」。' },
        { who: 'B', en: 'I don\'t think so. Hi, I\'m Kai.', cn: '应该没有。你好，我叫凯。', focus: 'I don\'t think so 委婉否定', tip: '比直接说 no 礼貌。' },
        { who: 'C', en: 'Pleasure. I\'m Yuki, Kai\'s colleague.', cn: '很高兴认识你。我叫由纪，是凯的同事。', focus: 'Pleasure 初次见面回应用词', tip: '正式场合也可用 Nice to meet you。' },
        { who: 'A', en: 'They work together, actually.', cn: '其实他们是同事。', focus: 'actually 其实（补充信息）', tip: 'introduce 后常补充关系。' },
        { who: 'C', en: 'Right, on the same project. How long have you been here?', cn: '对，同一个项目。你来多久了？', focus: 'on the same project 在同一个项目', tip: '把提问抛回去延续对话。' },
        { who: 'B', en: 'Six months. Still learning the ropes.', cn: '六个月，还在熟悉流程。', focus: 'learning the ropes 学习门道', tip: '这是很地道的习语。' },
        { who: 'C', en: 'I remember those days. Anything I can help with?', cn: '我记得那段日子。有什么我能帮忙的吗？', focus: 'I remember those days 我记得那时', tip: '共鸣式回应拉近距离。' },
        { who: 'B', en: 'Thanks, I think I\'m OK. Thanks for offering.', cn: '谢谢，我觉得还好。谢谢你。', focus: 'Thanks for offering 谢谢你主动提出', tip: '婉拒帮助也要道谢。' }
      ]
    }
  ];

  global.SceneExpansion = { SCENES: SCENES };
})(window);