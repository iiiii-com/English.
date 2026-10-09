/* ============================================================
   content-daily-comm5.js —— 日常交流扩充（第五批，补足 2000+）
   结构与前四批一致：[英文, 中文, 语域]
   ============================================================ */
(function (global) {
  'use strict';

  var R = { R1: '正式', R2: '中性', R3: '随意', R4: '俚语' };

  var DATA = {
    /* ---------- 71. 起床与早晨routine ---------- */
    morning_routine: [
      ["I usually get up at seven.", "我通常七点起床。", "R2"],
      ["I need a few more minutes.", "我还需要几分钟。", "R2"],
      ["Could you turn off your alarm?", "能把你闹钟关了吗？", "R2"],
      ["I'm running out of time.", "我快没时间了。", "R2"],
      ["Let me just grab a coffee.", "我喝杯咖啡就走。", "R2"],
      ["I overslept again.", "我又睡过头了。", "R2"],
      ["Could you drive me to work?", "你能送我去上班吗？", "R2"],
      ["I'll be out in ten minutes.", "我十分钟后出门。", "R2"],
      ["Don't forget your keys.", "别忘了钥匙。", "R2"],
      ["Have a good day at work.", "工作顺利。", "R2"],
      ["See you this evening.", "晚上见。", "R2"],
      ["I need to catch the early bus.", "我得赶早班车。", "R2"],
      ["My alarm didn't go off.", "我闹钟没响。", "R2"],
      ["Coffee first, then everything else.", "先喝咖啡，别的之后再说。", "R3"],
      ["I'm not a morning person.", "我不是早起型。", "R2"],
      ["Let's just get takeaway.", "我们点外卖吧。", "R2"],
      ["I'm running late again.", "我又要迟到了。", "R2"],
      ["Can you cover for me?", "你能替我一下吗？", "R2"]
    ],
    /* ---------- 72. 晚间与睡前 ---------- */
    evening_routine: [
      ["What are you up to tonight?", "今晚你打算做什么？", "R2"],
      ["I'm just winding down.", "我就是想放松一下。", "R2"],
      ["I need to go to bed early.", "我得早点睡。", "R2"],
      ["Are you working late again?", "你又要加班吗？", "R2"],
      ["I can't sleep.", "我睡不着。", "R2"],
      ["Let me just read a bit.", "我看会儿书吧。", "R2"],
      ["I should really go to bed.", "我真该睡了。", "R2"],
      ["Are you coming to bed?", "你过来睡吗？", "R2"],
      ["I had a long day.", "我今天很累。", "R2"],
      ["Nothing much, just chilling.", "没什么，就随便待着。", "R2"],
      ["I'm too wired to sleep.", "我太兴奋了睡不着。", "R3"],
      ["Let's just call it a day.", "今天就到这儿吧。", "R2"],
      ["I forgot to set my alarm.", "我忘定闹钟了。", "R2"],
      ["Turn the light off, please.", "请把灯关了。", "R2"],
      ["I'm exhausted.", "我累坏了。", "R2"],
      ["Sweet dreams.", "做个好梦。", "R2"]
    ],
    /* ---------- 73. 做饭与厨房 ---------- */
    cooking: [
      ["What are we having tonight?", "今晚吃什么？", "R2"],
      ["I'm cooking tonight.", "今晚我做饭。", "R2"],
      ["Can you chop these onions?", "你能切一下这些洋葱吗？", "R2"],
      ["The water's starting to boil.", "水开了。", "R2"],
      ["It smells amazing in here.", "这里闻起来太香了。", "R2"],
      ["Could you set the table?", "能摆一下餐具吗？", "R2"],
      ["This needs more salt.", "这个还需要加点盐。", "R2"],
      ["I burned it.", "我把它烧焦了。", "R2"],
      ["Help yourself.", "请自便。", "R2"],
      ["I'm watching a recipe video.", "我在看做菜视频。", "R2"],
      ["This is easy to make.", "这个很简单。", "R2"],
      ["I forgot to defrost the chicken.", "我忘了解冻鸡肉。", "R2"],
      ["Do you want to try?", "你想试试吗？", "R2"],
      ["It needs a few more minutes.", "还需要几分钟。", "R2"],
      ["I'm full but it was delicious.", "我饱了，但真好吃。", "R2"]
    ],
    /* ---------- 74. 洗衣服与家务 ---------- */
    housework: [
      ["Could you take out the trash?", "能倒一下垃圾吗？", "R2"],
      ["The washing machine's finished.", "洗衣机洗完了。", "R2"],
      ["I need to do the dishes.", "我得洗碗。", "R2"],
      ["Could you vacuum the living room?", "能吸一下客厅的地吗？", "R2"],
      ["We're out of laundry detergent.", "洗衣液用完了。", "R2"],
      ["I folded the clothes.", "我把衣服叠好了。", "R2"],
      ["Could you hang up the laundry?", "能把衣服晾起来吗？", "R2"],
      ["The dishes are clean.", "碗洗好了。", "R2"],
      ["I need to change the bed sheets.", "我得换床单了。", "R2"],
      ["Could you water the plants?", "能浇一下花吗？", "R2"],
      ["The bathroom needs cleaning.", "浴室需要打扫了。", "R2"],
      ["I'll do the ironing later.", "我晚点熨衣服。", "R2"]
    ],
    /* ---------- 75. 问路进阶 ---------- */
    ask_directions: [
      ["Excuse me, is this the right way to the museum?", "请问去博物馆是这条路吗？", "R2"],
      ["Am I going the right way?", "我走对了吗？", "R2"],
      ["Could you point it out on the map?", "能在地图上指给我吗？", "R2"],
      ["Is it within walking distance?", "走路能到吗？", "R2"],
      ["How long does it take on foot?", "走路要多久？", "R2"],
      ["Should I take a taxi?", "我该打车吗？", "R2"],
      ["Is there a bus that goes there?", "有公交到那儿吗？", "R2"],
      ["Where is the nearest station?", "最近的车站在哪？", "R2"],
      ["Could you tell me if I need to transfer?", "能告诉我需要换乘吗？", "R2"],
      ["Sorry, you've gone past it.", "抱歉，你已经走过了。", "R2"],
      ["It's right around the corner.", "就在拐角那边。", "R2"],
      ["Go past the bank and turn left.", "过了银行左转。", "R2"],
      ["It's across from the park.", "在公园对面。", "R2"],
      ["You can't miss it.", "你不会错过的。", "R2"]
    ],
    /* ---------- 76. 银行取现与支付 ---------- */
    payment: [
      ["Can I pay by card?", "能刷卡吗？", "R2"],
      ["Do you accept mobile payment?", "接受手机支付吗？", "R2"],
      ["I'd like to withdraw some cash.", "我想取点现金。", "R2"],
      ["Could I have a receipt?", "能给我收据吗？", "R2"],
      ["Can I get a refund on this?", "这个能退款吗？", "R2"],
      ["It's out of stock.", "这个缺货了。", "R2"],
      ["When will it be available again?", "什么时候能再有货？", "R2"],
      ["Do you have a smaller size?", "有小号的吗？", "R2"],
      ["I'll take two.", "我要两个。", "R2"],
      ["Could I get a bag?", "能给我个袋子吗？", "R2"],
      ["That'll be thirteen fifty.", "一共十三块五。", "R2"]
    ],
    /* ---------- 77. 表达习惯与频率 ---------- */
    habit: [
      ["I'm trying to exercise more.", "我在努力多运动。", "R2"],
      ["I've been trying to eat healthier.", "我一直在吃得更健康。", "R2"],
      ["I try to go to bed by eleven.", "我尽量十一点前睡。", "R2"],
      ["I'm working on my English.", "我在提升英语。", "R2"],
      ["I go running three times a week.", "我一周跑三次。", "R2"],
      ["I've cut back on sugar.", "我减少了糖分。", "R2"],
      ["I'm reading before bed now.", "我现在睡前读书。", "R2"],
      ["I try to avoid social media.", "我尽量少用社交媒体。", "R2"],
      ["I'm learning to cook.", "我在学做饭。", "R2"],
      ["I've started walking to work.", "我开始走路上班了。", "R2"],
      ["I meditate every morning.", "我每天早上冥想。", "R2"],
      ["I'm trying to sleep earlier.", "我尽量早点睡。", "R2"]
    ],
    /* ---------- 78. 表达兴趣与爱好 ---------- */
    interest: [
      ["What do you do in your free time?", "你空闲时做什么？", "R2"],
      ["I've been learning guitar.", "我在学吉他。", "R2"],
      ["I'm really into photography.", "我迷上摄影了。", "R2"],
      ["Do you play any sports?", "你做什么运动吗？", "R2"],
      ["I like reading non-fiction.", "我喜欢读非虚构类。", "R2"],
      ["I've always wanted to learn surfing.", "我一直想学冲浪。", "R2"],
      ["I spend too much time online.", "我花太多时间上网了。", "R2"],
      ["Do you cook or order in?", "你做饭还是点外卖？", "R2"],
      ["I've taken up gardening.", "我开始搞园艺了。", "R2"],
      ["I paint when I'm stressed.", "我压力大时画画。", "R2"],
      ["What kind of music do you like?", "你喜欢什么音乐？", "R2"],
      ["I go hiking every weekend.", "我每个周末去徒步。", "R2"]
    ],
    /* ---------- 79. 描述天气与穿着 ---------- */
    weather_wear: [
      ["It's freezing outside.", "外面冷死了。", "R2"],
      ["You'd better wear a coat.", "你最好穿件外套。", "R2"],
      ["I'm wearing a sweater today.", "我今天穿毛衣。", "R2"],
      ["Don't forget an umbrella.", "别忘了带伞。", "R2"],
      ["These shoes are uncomfortable.", "这鞋穿着不舒服。", "R2"],
      ["I need a new pair of jeans.", "我需要一条新牛仔裤。", "R2"],
      ["It fits perfectly.", "很合身。", "R2"],
      ["Do you have this in black?", "这个有黑色的吗？", "R2"],
      ["It's a bit tight.", "有点紧。", "R2"],
      ["Can I try a larger size?", "我能试大一号的吗？", "R2"]
    ],
    /* ---------- 80. 表达时间安排冲突 ---------- */
    conflict: [
      ["I'm afraid I already have plans.", "恐怕我已经有安排了。", "R2"],
      ["Can we do it another time?", "我们改天可以吗？", "R2"],
      ["That doesn't work for me.", "我时间不合适。", "R2"],
      ["I'll have to take a rain check.", "这次我就不参加了。", "R2"],
      ["Could we reschedule for Friday?", "我们改到周五好吗？", "R2"],
      ["Something came up last minute.", "临时有点事。", "R2"],
      ["I'll get back to you tomorrow.", "我明天答复你。", "R2"],
      ["Can we move it to the afternoon?", "能挪到下午吗？", "R2"],
      ["I'd rather not commit right now.", "我现在还不想答应。", "R2"],
      ["Let me check and confirm.", "我查一下再确认。", "R2"]
    ],
    /* ---------- 81. 请求帮忙（更口语） ---------- */
    favor: [
      ["Would you mind helping me?", "你介意帮我一下吗？", "R2"],
      ["Can I bother you for a second?", "能打扰你一下吗？", "R2"],
      ["Could you do me a favour?", "能帮我个忙吗？", "R2"],
      ["I hate to ask, but...", "我不想麻烦你，但是……", "R2"],
      ["If you have a minute...", "如果你有空……", "R2"],
      ["Would you be able to cover for me?", "你能替我一下吗？", "R2"],
      ["Could you give me a hand?", "能搭把手吗？", "R2"],
      ["I really owe you one.", "我真欠你个人情。", "R2"],
      ["No worries if you're busy.", "忙的话没关系。", "R2"],
      ["Let me know if you can help.", "你能帮的话告诉我。", "R2"]
    ],
    /* ---------- 82. 回应与接话 ---------- */
    respond: [
      ["Right, that makes sense.", "对，这说得通。", "R2"],
      ["I see what you mean.", "我明白你的意思。", "R2"],
      ["That's a good point.", "这是个好观点。", "R2"],
      ["Hmm, I'm not sure.", "嗯，我不太确定。", "R2"],
      ["I'll think about it.", "我考虑一下。", "R2"],
      ["That works for me.", "我这边可以。", "R2"],
      ["Let me get back to you on that.", "这个我回头答复你。", "R2"],
      ["I hear you.", "我懂你的意思。", "R2"],
      ["You might have a point.", "你可能有点道理。", "R2"],
      ["I hadn't thought of that.", "我没想过这一点。", "R2"]
    ],
    /* ---------- 83. 表达感谢（更多） ---------- */
    thanks_more: [
      ["Thanks for having me today.", "谢谢你今天招待我。", "R2"],
      ["I really appreciate it.", "我真的很感激。", "R2"],
      ["Thanks for being patient with me.", "谢谢你对我的耐心。", "R2"],
      ["Thanks for the heads-up.", "谢谢你提醒我。", "R2"],
      ["I owe you one.", "我欠你一次。", "R3"],
      ["Thanks for sorting that out.", "谢谢你处理好了。", "R2"],
      ["You've been a great help.", "你帮了大忙。", "R2"],
      ["Thanks for explaining it clearly.", "谢谢你讲得很清楚。", "R2"],
      ["I owe you, big time.", "我欠你太多了。", "R3"],
      ["Thanks for not giving up.", "谢谢你没放弃。", "R2"]
    ],
    /* ---------- 84. 表达歉意（更多） ---------- */
    sorry_more: [
      ["Sorry, my mistake.", "抱歉，是我的错。", "R3"],
      ["I'm sorry to put you through that.", "抱歉让你经历这些。", "R2"],
      ["That was careless of me.", "那是我太粗心了。", "R2"],
      ["I really should have told you.", "我真该告诉你的。", "R2"],
      ["Please forgive me for that.", "请原谅我那样做。", "R2"],
      ["I won't let it happen again.", "不会再发生了。", "R2"],
      ["I'm genuinely sorry.", "我真的很抱歉。", "R2"],
      ["I take full responsibility.", "我承担全部责任。", "R2"],
      ["You have my apologies.", "我向你道歉。", "R1"],
      ["I understand if you're upset.", "我理解你不高兴。", "R2"]
    ],
    /* ---------- 85. 表达好奇 ---------- */
    curious: [
      ["I'm curious about that.", "我很好奇那件事。", "R2"],
      ["How did that happen?", "那是怎么发生的？", "R2"],
      ["What made you choose that?", "你为什么选那个？", "R2"],
      ["I've always wondered...", "我一直想知道……", "R2"],
      ["Tell me more about it.", "再多说点。", "R2"],
      ["Is that something new?", "那是新东西吗？", "R2"],
      ["I didn't know that.", "我不知道这个。", "R2"],
      ["How does that work?", "那是怎么运作的？", "R2"],
      ["What's the reason behind it?", "背后的原因是什么？", "R2"],
      ["I've heard a lot about it.", "我听说过很多。", "R2"]
    ],
    /* ---------- 86. 表达不同意见（更多） ---------- */
    disagree_more: [
      ["I see it differently.", "我的看法不同。", "R2"],
      ["I don't quite agree.", "我不太同意。", "R2"],
      ["That's your perspective.", "那是你的观点。", "R2"],
      ["I understand, but...", "我理解，但是……", "R2"],
      ["Have you considered the opposite?", "你想过反面吗？", "R2"],
      ["I'm not entirely convinced.", "我并未完全信服。", "R2"],
      ["I'd push back on that.", "这一点我要反对。", "R2"],
      ["Both are valid.", "两种都有道理。", "R2"],
      ["I see your point, but...", "我懂你的意思，不过……", "R2"],
      ["Let's agree to disagree.", "我们就保留分歧吧。", "R2"]
    ],
    /* ---------- 87. 日常综合杂项 ---------- */
    misc_daily: [
      ["Mind if I join you?", "我加入你们介意吗？", "R2"],
      ["Does this happen often?", "这经常发生吗？", "R2"],
      ["I'll let you get on with it.", "我就不打扰你了。", "R2"],
      ["Let me know if anything changes.", "有变化告诉我。", "R2"],
      ["No need to reply.", "不用回复。", "R2"],
      ["Whenever suits you.", "你什么时候方便都行。", "R2"],
      ["It slipped my mind.", "我给忘了。", "R3"],
      ["Just realised —", "刚意识到——", "R3"],
      ["That makes two of us.", "算我一个，两人这样。", "R3"],
      ["Noted.", "记下了。", "R2"],
      ["Will do.", "会的。", "R2"],
      ["Could be.", "有可能。", "R2"],
      ["Let's leave it there.", "这话题先到这儿吧。", "R2"],
      ["Suit yourself.", "随你便。", "R2"],
      ["Better safe than sorry.", "小心为上。", "R3"],
      ["Give me a call sometime.", "有空给我打电话。", "R2"],
      ["I won't keep you.", "不耽误你时间了。", "R2"],
      ["Take care of yourself.", "照顾好自己。", "R2"],
      ["Good luck with it.", "祝你顺利。", "R2"],
      ["Right, I'm off.", "好了，我走了。", "R3"],
      ["See you another time.", "改天见。", "R2"],
      ["Speak soon.", "回头聊。", "R2"],
      ["Later.", "回见。", "R3"],
      ["Cheers for that.", "谢啦。", "R3"]
    ]
  };

  var CATS = {
    morning_routine: '早晨routine',
    evening_routine: '晚间与睡前',
    cooking: '做饭与厨房',
    housework: '家务与洗衣',
    ask_directions: '问路进阶',
    payment: '支付与取现',
    habit: '习惯与频率',
    interest: '兴趣爱好',
    weather_wear: '天气与穿着',
    conflict: '时间冲突',
    favor: '请求帮忙',
    respond: '回应与接话',
    thanks_more: '感谢（扩充）',
    sorry_more: '道歉（扩充）',
    curious: '表达好奇',
    disagree_more: '不同意见（扩充）',
    misc_daily: '日常综合杂项',
    misc_daily: '日常综合杂项'
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

  global.DailyComm5 = {
    DATA: DATA, CATS: CATS, R: R,
    countAll: countAll, flat: flat, byCat: byCat,
    catKeys: function () { return Object.keys(CATS); }
  };
})(window);