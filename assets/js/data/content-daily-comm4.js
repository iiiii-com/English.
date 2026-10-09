/* ============================================================
   content-daily-comm4.js —— 日常交流扩充（第四批）
   目标：把日常表达从 1500 补到 2000+
   保持与前三批一致结构：[英文, 中文, 语域]
   分类涵盖前三批未覆盖的生活场景
   ============================================================ */
(function (global) {
  'use strict';

  var R = { R1: '正式', R2: '中性', R3: '随意', R4: '俚语' };

  var DATA = {
    /* ---------- 53. 天气与气候闲聊 ---------- */
    weather_chat: [
      ["It's really hot today.", "今天真热。", "R2"],
      ["Can you believe how cold it is?", "你能信这有多冷吗？", "R3"],
      ["It's been raining all day.", "下了一整天雨。", "R2"],
      ["I think it might snow tonight.", "我觉得今晚可能下雪。", "R2"],
      ["The forecast says it'll clear up tomorrow.", "预报说明天转晴。", "R2"],
      ["I'd better wear a jacket.", "我最好穿件外套。", "R2"],
      ["This coffee is just right.", "这咖啡温度刚好。", "R2"],
      ["It feels like spring.", "感觉像春天。", "R2"],
      ["Fall is my favourite season.", "秋天是我最喜欢的季节。", "R2"],
      ["Winter here is brutal.", "这儿的冬天很严酷。", "R2"],
      ["I love autumn colours.", "我喜欢秋天的色彩。", "R2"],
      ["It should clear up by noon.", "中午应该会转晴。", "R2"],
      ["The sun is out at last.", "太阳终于出来了。", "R2"],
      ["It's muggy today.", "今天很闷热。", "R3"],
      ["We finally got some rain.", "终于下雨了。", "R2"],
      ["Perfect weather for a walk.", "散步的绝佳天气。", "R2"],
      ["I love when it snows.", "我喜欢下雪天。", "R2"],
      ["The air feels so crisp today.", "今天空气特别清新。", "R2"],
      ["It's supposed to rain this afternoon.", "据说今天下午会下雨。", "R2"],
      ["Better take an umbrella.", "最好带把伞。", "R2"],
      ["It's a bit chilly out.", "外面有点冷。", "R2"],
      ["The heatwave is killing me.", "热浪快把我热死了。", "R3"],
      ["I'm freezing.", "我冻死了。", "R2"],
      ["It's pouring outside.", "外面下大雨。", "R2"]
    ],
    /* ---------- 54. 餐厅点餐进阶 ---------- */
    dining_more: [
      ["Could we get the bill, please?", "能结账吗？", "R2"],
      ["Is service included?", "含服务费吗？", "R2"],
      ["Could I have this to go?", "这个能打包吗？", "R2"],
      ["Do you have any specials?", "有什么特色菜吗？", "R2"],
      ["What's the dish of the day?", "今日主打菜是什么？", "R2"],
      ["Does this contain nuts?", "这个含坚果吗？", "R2"],
      ["I'm allergic to shellfish.", "我对贝类过敏。", "R2"],
      ["Could I substitute the salad?", "沙拉能换吗？", "R2"],
      ["We'd like to order now.", "我们现在点餐。", "R2"],
      ["Could we sit by the window?", "能坐窗边吗？", "R2"],
      ["How long will the wait be?", "要等多久？", "R2"],
      ["Do you take reservations?", "你们接受预订吗？", "R2"],
      ["I have a reservation under Chen.", "我有预订，名字是 Chen。", "R2"],
      ["Could we get the check, please?", "请结账好吗？", "R2"],
      ["Can we split the check?", "能分开结账吗？", "R2"],
      ["Could I pay separately?", "我能单独付吗？", "R2"],
      ["I'll have the same, thanks.", "我要一样的，谢谢。", "R2"],
      ["The food was excellent.", "食物很棒。", "R2"],
      ["Everything was delicious.", "一切都很好吃。", "R2"],
      ["Could you bring us some water?", "能给我们上点水吗？", "R2"],
      ["Is this dish very spicy?", "这道菜很辣吗？", "R2"],
      ["Could I get a little less oil?", "能少放点油吗？", "R2"],
      ["The portions are huge here.", "这里的分量很大。", "R2"],
      ["I'll skip dessert, thanks.", "甜点我就不用了，谢谢。", "R2"]
    ],
    /* ---------- 55. 租房与看房 ---------- */
    renting: [
      ["I'm looking for a one-bedroom.", "我在找一居室。", "R2"],
      ["How much is the rent per month?", "月租多少？", "R2"],
      ["Is the rent negotiable?", "房租能议吗？", "R2"],
      ["What utilities are included?", "含哪些水电费？", "R2"],
      ["When can I move in?", "什么时候能入住？", "R2"],
      ["How long is the lease?", "租期多长？", "R2"],
      ["Is there a deposit?", "有押金吗？", "R2"],
      ["Are pets allowed?", "允许养宠物吗？", "R2"],
      ["Does it come furnished?", "带家具吗？", "R2"],
      ["Is there parking available?", "有停车位吗？", "R2"],
      ["How far is the subway station?", "离地铁站多远？", "R2"],
      ["Is the neighbourhood quiet?", "这一带安静吗？", "R2"],
      ["Could I see the room again?", "我能再看一次房间吗？", "R2"],
      ["The room is smaller than I expected.", "房间比我想的小。", "R2"],
      ["There's no natural light.", "没有自然采光。", "R2"],
      ["The heating doesn't work well.", "供暖不太好。", "R2"],
      ["Is the water bill included?", "水费含在内吗？", "R2"],
      ["Could we negotiate the price?", "价格能商量吗？", "R2"],
      ["I'd like to think about it first.", "我想先考虑一下。", "R2"],
      ["When would you like to move in?", "你想什么时候入住？", "R2"],
      ["Could I sign a one-year lease?", "我能签一年租约吗？", "R2"],
      ["The landlord is easy to deal with.", "房东好相处。", "R2"]
    ],
    /* ---------- 56. 医院与看诊 ---------- */
    doctor_visit: [
      ["What brings you in today?", "今天哪里不舒服？", "R2"],
      ["How long have you had this?", "这个持续多久了？", "R2"],
      ["Where does it hurt?", "哪里疼？", "R2"],
      ["Is it sharp or dull?", "是尖锐痛还是钝痛？", "R2"],
      ["Does it hurt when I press?", "我按的时候疼吗？", "R2"],
      ["Have you taken any medicine?", "你吃过药吗？", "R2"],
      ["Are you allergic to anything?", "你对什么过敏吗？", "R2"],
      ["Let me take your temperature.", "我给你量下体温。", "R2"],
      ["Take a deep breath.", "深呼吸。", "R2"],
      ["You'll need a blood test.", "你需要做个血检。", "R2"],
      ["Take this twice a day.", "这个一天吃两次。", "R2"],
      ["Come back if it gets worse.", "如果变严重就回来。", "R2"],
      ["You should get plenty of rest.", "你需要充分休息。", "R2"],
      ["Try to drink more water.", "尽量多喝水。", "R2"],
      ["It looks like a mild infection.", "看起来是轻度感染。", "R2"],
      ["Nothing serious, don't worry.", "不严重，别担心。", "R2"],
      ["I'll write you a prescription.", "我给你开个处方。", "R2"],
      ["You can pick this up downstairs.", "这个你可以在一楼取。", "R2"],
      ["How do you feel now?", "你现在感觉怎么样？", "R2"],
      ["That's a huge improvement.", "好转很多。", "R2"]
    ],
    /* ---------- 57. 快递与网购 ---------- */
    delivery: [
      ["I'd like to track my package.", "我想查一下快递。", "R2"],
      ["Can I change the delivery address?", "能改收货地址吗？", "R2"],
      ["My package hasn't arrived yet.", "我的快递还没到。", "R2"],
      ["It was delivered to the wrong address.", "送错地址了。", "R2"],
      ["Could you send me a replacement?", "能给我补发一个吗？", "R2"],
      ["I need to return this item.", "我要退货。", "R2"],
      ["How do I claim my refund?", "怎么申请退款？", "R2"],
      ["Can I exchange it for another size?", "能换个尺码吗？", "R2"],
      ["The item arrived damaged.", "商品到货时破损了。", "R2"],
      ["Here's my order number.", "这是我的订单号。", "R2"],
      ["Could you leave it at the front desk?", "能放前台吗？", "R2"],
      ["I'll pick it up from the locker.", "我从快递柜取。", "R2"],
      ["Is there a tracking number?", "有运单号吗？", "R2"],
      ["How long does delivery take?", "配送要多久？", "R2"],
      ["Do you ship internationally?", "你们国际发货吗？", "R2"],
      ["The discount code didn't work.", "优惠码用不了。", "R2"],
      ["Could you apply the discount manually?", "能手动加上优惠吗？", "R2"]
    ],
    /* ---------- 58. 银行与政务 ---------- */
    bank: [
      ["I'd like to open an account.", "我想开个账户。", "R2"],
      ["What documents do I need?", "需要什么材料？", "R2"],
      ["I need to check my balance.", "我要查余额。", "R2"],
      ["Can I withdraw money here?", "这里能取钱吗？", "R2"],
      ["I forgot my password.", "我忘了密码。", "R2"],
      ["Can I reset it online?", "能网上重置吗？", "R2"],
      ["I'd like to make a transfer.", "我想转账。", "R2"],
      ["What are the fees?", "手续费多少？", "R2"],
      ["Could I speak to a manager?", "能和经理谈谈吗？", "R2"],
      ["I need to book an appointment.", "我要预约。", "R2"],
      ["What time slots are available?", "有哪些时段？", "R2"],
      ["Is this document valid?", "这份文件有效吗？", "R2"],
      ["What else do I need?", "还需要什么？", "R2"],
      ["How long does it take to process?", "处理要多久？", "R2"],
      ["I'd like to renew my passport.", "我要办护照延期。", "R2"]
    ],
    /* ---------- 59. 社交聚会 ---------- */
    party: [
      ["Thanks for having us over.", "谢谢你们招待。", "R2"],
      ["Can I get you a drink?", "要喝点什么吗？", "R2"],
      ["What do you do for fun?", "你平时怎么消遣？", "R2"],
      ["How do you two know each other?", "你们俩怎么认识的？", "R3"],
      ["I've heard so much about you.", "久仰大名。", "R2"],
      ["Nice to finally meet you.", "终于见到你了。", "R2"],
      ["How are you two acquainted?", "你们怎么认识的？", "R1"],
      ["Are you having a good time?", "玩得开心吗？", "R2"],
      ["I should get going soon.", "我得走了。", "R2"],
      ["It was great seeing you.", "见到你真好。", "R2"],
      ["Let's keep in touch.", "保持联系。", "R2"],
      ["Text me when you get home.", "到家给我发消息。", "R2"],
      ["Thanks for inviting me.", "谢谢你邀请我。", "R2"],
      ["I'll help you with the dishes.", "我来帮你洗碗。", "R2"],
      ["The host is a great cook.", "主人厨艺很好。", "R2"],
      ["We got to around midnight.", "我们待到午夜左右。", "R2"],
      ["It was a really fun night.", "今晚真开心。", "R2"]
    ],
    /* ---------- 60. 日常抱怨 ---------- */
    complain: [
      ["I'm so tired today.", "我今天好累。", "R2"],
      ["This is driving me crazy.", "这快把我逼疯了。", "R3"],
      ["I can't deal with this.", "我应付不了这个。", "R2"],
      ["It's driving me nuts.", "这快把我逼疯了。", "R3"],
      ["I need a break.", "我需要休息一下。", "R2"],
      ["I'm fed up with this.", "我受够了。", "R3"],
      ["This is really frustrating.", "这真让人沮丧。", "R2"],
      ["I'm stressed out.", "我压力山大。", "R3"],
      ["Everything feels too much.", "一切都让我喘不过气。", "R2"],
      ["I hate when this happens.", "我讨厌这样。", "R2"],
      ["Nothing is going right.", "什么都不顺。", "R2"],
      ["I'm having a bad day.", "我今天过得很糟。", "R2"],
      ["It won't work, no matter what I do.", "我怎么做都没用。", "R2"],
      ["I've been at this all day.", "这个我搞了一整天。", "R2"],
      ["I'm running out of patience.", "我快没耐心了。", "R2"],
      ["Let me take a break.", "让我休息一下。", "R2"],
      ["I need to clear my head.", "我需要理清思路。", "R2"],
      ["It's been a long week.", "这周真是长。", "R2"],
      ["I could use some quiet time.", "我需要点安静时间。", "R2"],
      ["I think I need a holiday.", "我想我需要休假。", "R2"]
    ],
    /* ---------- 61. 请求重复与澄清 ---------- */
    clarify: [
      ["Sorry, could you repeat that?", "抱歉，能再说一遍吗？", "R2"],
      ["What did you say?", "你说什么？", "R2"],
      ["I didn't quite catch that.", "我没太听清。", "R2"],
      ["Could you speak a little slower?", "能说慢一点吗？", "R2"],
      ["How do you spell that?", "那个怎么拼？", "R2"],
      ["What does that mean?", "那是什么意思？", "R2"],
      ["I'm not sure I follow.", "我不太明白。", "R2"],
      ["Could you explain that again?", "能再解释一下吗？", "R2"],
      ["Sorry to interrupt — one question.", "抱歉打断一下——有个问题。", "R2"],
      ["Could I ask you something?", "我能问你个问题吗？", "R2"],
      ["Just to be clear, ...", "我明确一下，……", "R2"],
      ["So what you're saying is ...", "所以你的意思是……", "R2"],
      ["Am I right?", "我说得对吗？", "R2"],
      ["Let me make sure I understand.", "让我确认我理解对了。", "R2"],
      ["Say more, please.", "请详细说说。", "R2"],
      ["I'm still a bit lost.", "我还是有点糊涂。", "R2"]
    ],
    /* ---------- 62. 表达时间安排 ---------- */
    schedule_more: [
      ["Are you free this afternoon?", "你今天下午有空吗？", "R2"],
      ["Does tomorrow work for you?", "明天你方便吗？", "R2"],
      ["I'm free after five.", "我五点后有空。", "R2"],
      ["Could we make it Thursday?", "我们定周四可以吗？", "R2"],
      ["Something's come up.", "临时有点事。", "R2"],
      ["Can we push it to next week?", "能推到下周吗？", "R2"],
      ["Let me check my calendar first.", "我先查一下日程。", "R2"],
      ["I'll get back to you today.", "我今天答复你。", "R2"],
      ["Let's set a time and stick to it.", "定个时间然后守住。", "R2"],
      ["I'm running behind.", "我要迟到了。", "R2"],
      ["Could we do a quick call?", "我们快速通个电话好吗？", "R2"],
      ["I need a couple of days.", "我需要几天时间。", "R2"],
      ["Any time before Friday works.", "周五前什么时候都行。", "R2"],
      ["Let's pencil it in.", "先暂定一下。", "R2"]
    ],
    /* ---------- 63. 表达喜欢与偏好 ---------- */
    like_more: [
      ["I prefer tea to coffee.", "比起咖啡我更喜欢茶。", "R2"],
      ["I'm not really a coffee person.", "我不太爱咖啡。", "R3"],
      ["I could go for that.", "我倒是挺想要那个的。", "R3"],
      ["That sounds good to me.", "我觉得挺好的。", "R2"],
      ["I'm really into this.", "我特别迷这个。", "R3"],
      ["I'd rather stay in tonight.", "今晚我更想待家里。", "R2"],
      ["I'm not a morning person.", "我不是早起型。", "R2"],
      ["Count me in.", "算我一个。", "R3"],
      ["I'm not feeling up to it.", "我今天没心情。", "R2"],
      ["I love it here.", "我超喜欢这里。", "R2"],
      ["I enjoy the outdoors.", "我喜欢户外。", "R2"],
      ["I don't really do crowds.", "我不太喜欢人多。", "R2"],
      ["I'm open to suggestions.", "我愿意听建议。", "R2"],
      ["That's a bit much for me.", "对我来说有点过。", "R2"],
      ["I could go either way.", "两种我都行。", "R2"],
      ["I feel like staying in.", "我想待在家。", "R2"]
    ],
    /* ---------- 64. 网络与社交媒体 ---------- */
    social_media: [
      ["Did you see my post?", "你看到我的动态了吗？", "R2"],
      ["I'll send you the link.", "我把链接发你。", "R2"],
      ["I'm not on social media much.", "我很少上社交媒体。", "R2"],
      ["Could you send me a picture?", "能给我发张图吗？", "R2"],
      ["I'll text you the details.", "细节我发你。", "R2"],
      ["Check your messages.", "看下你的消息。", "R2"],
      ["I didn't get your text.", "我没收到你的消息。", "R2"],
      ["The app keeps crashing.", "这个应用总是闪退。", "R2"],
      ["I need to update my profile.", "我得更新我的资料。", "R2"],
      ["Follow me if you want.", "想的话关注我。", "R3"],
      ["I'll tag you in it.", "我会在里面@你。", "R3"],
      ["My phone died.", "我手机没电了。", "R2"],
      ["Can you send me the file?", "能把文件发我吗？", "R2"],
      ["I can't log in.", "我登不上。", "R2"],
      ["I forgot my password again.", "我又忘密码了。", "R2"]
    ],
    /* ---------- 65. 鼓励与支持 ---------- */
    encourage_more: [
      ["You can do it.", "你能行的。", "R2"],
      ["You've got this.", "你能行。", "R3"],
      ["Keep going, don't give up.", "继续，别放弃。", "R2"],
      ["One step at a time.", "一步一步来。", "R2"],
      ["You're making progress.", "你在进步。", "R2"],
      ["It's OK to ask for help.", "求助是可以的。", "R2"],
      ["Give yourself credit.", "给自己一点肯定。", "R2"],
      ["You're doing better than you think.", "你比你想的做得好。", "R2"],
      ["It's not a setback, it's a pause.", "这不是 setback，是暂停。", "R2"],
      ["Tomorrow is a new day.", "明天是新的一天。", "R2"],
      ["Small steps still count.", "小的进步也算。", "R2"],
      ["I believe in you.", "我相信你。", "R2"],
      ["That's totally normal.", "这很正常。", "R2"],
      ["Don't be too hard on yourself.", "别对自己太苛刻。", "R2"],
      ["Hang in there.", "坚持住。", "R2"]
    ],
    /* ---------- 66. 介绍他人 ---------- */
    introduce: [
      ["Let me introduce you two.", "我来给你们介绍一下。", "R2"],
      ["This is my wife, Sarah.", "这是我太太 Sarah。", "R2"],
      ["I'd like you to meet...", "我想让你见见……", "R1"],
      ["Have you two met?", "你们俩见过了吗？", "R2"],
      ["Nice to meet you, I've heard a lot about you.", "很高兴认识你，久仰大名。", "R2"],
      ["This is the colleague I mentioned.", "这就是我提过的同事。", "R2"],
      ["Sit anywhere you like.", "随便坐。", "R2"],
      ["Help yourself to the food.", "请自便，随便吃。", "R2"],
      ["Make yourself at home.", "别客气，当自己家。", "R2"]
    ],
    /* ---------- 67. 表达惊讶与感叹 ---------- */
    react: [
      ["That's unbelievable.", "太难以置信了。", "R2"],
      ["No way!", "不可能吧！", "R3"],
      ["Are you serious?", "你是认真的吗？", "R2"],
      ["I had no idea.", "我完全不知道。", "R2"],
      ["That's crazy!", "太疯狂了！", "R3"],
      ["Wow, that's great news.", "哇，这真是好消息。", "R2"],
      ["How did that happen?", "这怎么发生的？", "R2"],
      ["I'm shocked.", "我很震惊。", "R2"],
      ["That's hard to believe.", "难以相信。", "R2"],
      ["Wait, what?", "等等，什么？", "R3"],
      ["That takes my breath away.", "这让我屏住呼吸。", "R2"],
      ["I never would have guessed.", "我完全猜不到。", "R2"],
      ["That's a pleasant surprise.", "这是个惊喜。", "R2"]
    ],
    /* ---------- 68. 确认信息 ---------- */
    verify: [
      ["Just to confirm, we meet at three?", "确认一下，我们三点见？", "R2"],
      ["So that's Tuesday, right?", "所以是周二，对吧？", "R2"],
      ["Let me make sure I have this right.", "让我确认我理解对了。", "R2"],
      ["Did I catch that correctly?", "我理解得对吗？", "R2"],
      ["Is that the address?", "地址是这个吗？", "R2"],
      ["You're coming at seven, correct?", "你七点来，对吗？", "R2"],
      ["So we agreed on Friday.", "所以我们定的是周五。", "R2"],
      ["That's the plan, unless something changes.", "计划是这样，除非有变。", "R2"],
      ["I just want to be sure.", "我只是想确认一下。", "R2"]
    ],
    /* ---------- 69. 表达条件与假设 ---------- */
    condition: [
      ["If you need anything, let me know.", "需要什么跟我说。", "R2"],
      ["In case you change your mind.", "万一你改主意了。", "R2"],
      ["Unless you object, I'll go ahead.", "如果你没意见，我就继续了。", "R2"],
      ["As long as it works for you.", "只要对你没问题。", "R2"],
      ["Provided that everyone agrees.", "前提是大家都同意。", "R1"],
      ["Should you need help, just ask.", "需要帮忙就说。", "R2"],
      ["If it rains, we'll stay in.", "如果下雨我们就待家里。", "R2"],
      ["Otherwise, let's meet at noon.", "否则我们中午见。", "R2"],
      ["Given the circumstances, that's fair.", "考虑到情况，这很合理。", "R1"],
      ["In that case, I'll handle it.", "那样的话，我来处理。", "R2"]
    ],
    /* ---------- 70. 处理误解 ---------- */
    misunderstand: [
      ["I don't think that's what I meant.", "我觉得那不是我的意思。", "R2"],
      ["Sorry, I misunderstood.", "抱歉，我误会了。", "R2"],
      ["Let me clarify what I meant.", "我澄清一下我的意思。", "R2"],
      ["That's not what I was asking.", "那不是我问的。", "R2"],
      ["Oh, I see now.", "哦，我明白了。", "R2"],
      ["I worded that badly.", "我措辞不当。", "R2"],
      ["No, I meant the other one.", "不，我是指另一个。", "R2"],
      ["We're on the same page then.", "那我们理解一致了。", "R2"],
      ["Thanks for clearing that up.", "谢谢你说明白。", "R2"],
      ["My bad, I was confused.", "我的错，我搞混了。", "R3"]
    ]
  };

  var CATS = {
    weather_chat: '天气与气候闲聊',
    dining_more: '餐厅点餐进阶',
    renting: '租房与看房',
    doctor_visit: '医院与看诊',
    delivery: '快递与网购',
    bank: '银行与政务',
    party: '社交聚会',
    complain: '日常抱怨',
    clarify: '请求重复与澄清',
    schedule_more: '时间安排表达',
    like_more: '喜欢与偏好',
    social_media: '网络与社交媒体',
    encourage_more: '鼓励与支持',
    introduce: '介绍他人',
    react: '惊讶与感叹',
    verify: '确认信息',
    condition: '条件与假设',
    misunderstand: '处理误解'
  };

  function countAll() {
    var n = 0;
    Object.keys(DATA).forEach(function (k) { n += DATA[k].length; });
    return n;
  }
  function flat() {
    var out = [];
    Object.keys(DATA).forEach(function (k) {
      DATA[k].forEach(function (row) {
        out.push({ en: row[0], cn: row[1], r: row[2], cat: CATS[k], key: k });
      });
    });
    return out;
  }
  function byCat(key) {
    return (DATA[key] || []).map(function (row) {
      return { en: row[0], cn: row[1], r: row[2], cat: CATS[key], key: key };
    });
  }

  global.DailyComm4 = {
    DATA: DATA, CATS: CATS, R: R,
    countAll: countAll, flat: flat, byCat: byCat,
    catKeys: function () { return Object.keys(CATS); }
  };
})(window);