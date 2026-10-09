/* ============================================================
   content-comm-dialogs.js —— 日常表达的「对话示例」层
   ------------------------------------------------------------
   为什么需要这一层：

   现有 697 条日常表达是「孤立话轮」——每条都能说出口，但学的时候
   是一句一句背的。真实的口语是「轮替」：对方说完一句，你要在 1 秒内
   调出对应回应，而这个能力背单词表学不到。

   所以这一层做的事：
     1. 把高频表达重新编排成完整对话（A/B 轮替），每段对话标注功能场景；
     2. 每段对话给出「触发条件」——在什么情况下会用这段话；
     3. 每段对话标注语域，提醒在正式场合要换说法；
     4. 关键表达单独抽出，说明它在这段对话里为什么这样说。

   数据结构：
     DIALOGS[i] = {
       id, cat（对应日常交流的分类名）, title, titleCn,
       scene（使用场景：什么时候会用）,
       r（这段对话整体语域）,
       note（这段对话的语域提醒）,
       lines: [ { who:'A'|'B', en, cn, key（重点表达，可空） } ]
     }

   key 用来把对话里的句子和词库里的表达连起来：
   视图会用它去查 VocabDeepAny / DailyComm，补上搭配与用法提示。
   ============================================================ */
(function (global) {
  'use strict';

  var DIALOGS = [
    /* ========== 一、职场沟通 ========== */
    {
      id: 'd-w1', cat: '邮件与书面沟通', title: 'Requesting a deadline extension',
      titleCn: '请求延期（书面转口头）', r: 'R1',
      scene: '任务交付日期将到但确实做不完，需要向主管或客户争取时间。这是职场里最难的开口之一。',
      note: 'R1 场合：邮件里避免直接说「我做不到」（can\'t）。改用「我预计周五前做不完」—— 陈述预期，而不是否定能力。',
      lines: [
        { who: 'B', en: 'How is the report coming along?', cn: '报告进展如何？' },
        { who: 'A', en: "I don't expect to have this ready by Friday.", cn: '我周五前恐怕做不完。', key: "I don't expect to" },
        { who: 'B', en: 'How much longer would you need?', cn: '那你要多多久？' },
        { who: 'A', en: 'If I get the data by Tuesday, I can have it to you by the following Monday.', cn: '如果周二拿到数据，我下周一能给你。', key: "If I get the data by Tuesday" },
        { who: 'B', en: 'That works. I\'ll let the client know.', cn: '可以。我跟客户说一声。' },
        { who: 'A', en: 'Thank you for understanding.', cn: '谢谢理解。', key: 'Thank you for understanding' }
      ]
    },
    {
      id: 'd-w2', cat: '邮件与书面沟通', title: 'Pushing back on a scope change',
      titleCn: '对需求变更提出异议', r: 'R1',
      scene: '客户或上级临时加需求，直接答应会做不完，不说又会被认为没担当。',
      note: '关键是把「拒绝需求」换成「重新确认优先级」——不否定人，只讨论顺序。',
      lines: [
        { who: 'B', en: 'Can you also add a mobile version this week?', cn: '这周能顺便加个手机版吗？' },
        { who: 'A', en: 'That would push the original delivery past the deadline.', cn: '那样的话，原定交付会超期。', key: 'That would push the original delivery' },
        { who: 'A', en: 'Would you rather have the mobile version or the full feature set first?', cn: '你是想先要手机版，还是先要完整功能？', key: 'Would you rather have A or B' },
        { who: 'B', en: 'Good point. Let\'s keep the original scope for now.', cn: '有道理。先按原范围做吧。' },
        { who: 'A', en: 'I\'ll flag the mobile version as a phase-two item.', cn: '我把手机版标为二期需求。', key: 'flag something as' }
      ]
    },
    {
      id: 'd-w3', cat: '表达意见与建议', title: 'Disagreeing in a meeting',
      titleCn: '会上表达不同意见', r: 'R1',
      scene: '听上去有道理但你认为不对。直接说 "No" 会显得对抗。',
      note: 'R1 的黄金句式：先承认对方，再转折，最后给理由。',
      lines: [
        { who: 'B', en: 'We should just launch it everywhere at once.', cn: '我们干脆一次全量上线吧。' },
        { who: 'A', en: 'I see where you\'re coming from.', cn: '我明白你的考虑。', key: "I see where you're coming from" },
        { who: 'A', en: 'That said, I\'d push back on that a little.', cn: '不过我有点不同意。', key: "I'd push back on that" },
        { who: 'A', en: 'We have no regional data yet, and the support load could be heavy.', cn: '我们还没有分地区数据，客服压力可能会很大。' },
        { who: 'B', en: 'What would you suggest instead?', cn: '那你建议怎么做？' },
        { who: 'A', en: 'A phased rollout in two key markets first.', cn: '先在两个关键市场分阶段推进。', key: 'a phased rollout' }
      ]
    },

    /* ========== 二、社交与日常 ========== */
    {
      id: 'd-s1', cat: '打招呼与开场', title: 'Meeting someone for the first time',
      titleCn: '初次见面破冰', r: 'R2',
      scene: '活动、 conference、飞机邻座——需要在一分钟内从寒暄过渡到能继续聊下去。',
      note: '寒暄的关键是「给钩子」：说完自己必须抛一个能被对方接话的问题。',
      lines: [
        { who: 'A', en: 'Hi, I don\'t think we\'ve met. I\'m Wei.', cn: '嗨，我们好像没见过。我叫伟。', key: "I don't think we've met" },
        { who: 'B', en: 'Nice to meet you. I\'m Sarah.', cn: '很高兴认识你。我叫莎拉。' },
        { who: 'A', en: 'Are you here for the conference, or just passing through?', cn: '你是来参加会议的，还是路过的？' },
        { who: 'B', en: 'The conference. I\'m presenting on Thursday.', cn: '来参加会议的。我周四要做报告。' },
        { who: 'A', en: 'What\'s your talk on?', cn: '你讲什么主题？' },
        { who: 'B', en: 'On onboarding. It\'s a bit of a niche topic.', cn: '关于新人入职培训。有点小众。' },
        { who: 'A', en: 'Niche topics are usually the interesting ones.', cn: '小众的题目通常才是有意思的。' }
      ]
    },
    {
      id: 'd-s2', cat: '表达感谢', title: 'Thanking someone for a favour',
      titleCn: '别人帮了忙之后怎么谢', r: 'R2',
      scene: '同事帮你顶了班、朋友帮你搬家、陌生人帮你捡了东西。',
      note: 'R2 场合里 "Thanks a lot" 太轻，"Thank you so much" 又太重。最安全的是「谢 + 具体说明帮了什么」。',
      lines: [
        { who: 'A', en: 'I can\'t thank you enough for covering my shift.', cn: '谢谢你替我值班，真的太感谢了。', key: "I can't thank you enough" },
        { who: 'B', en: 'No worries, it was not a big deal.', cn: '别客气，不是什么大事。', key: 'no big deal' },
        { who: 'A', en: 'It was a big deal to me — I\'d have been in trouble.', cn: '对我来说是大事，不然我就麻烦了。' },
        { who: 'B', en: 'Happy to help. Let me know next time.', cn: '乐意帮忙，下次说一声。', key: 'happy to help' },
        { who: 'A', en: 'I\'ll buy you a coffee.', cn: '我请你喝杯咖啡。', key: 'buy you a coffee' }
      ]
    },
    {
      id: 'd-s3', cat: '道歉', title: 'Apologising without grovelling',
      titleCn: '道歉的分寸', r: 'R2',
      scene: '你迟到了、弄错了日期、忘了回复消息。重点是道歉后立刻给出补救。',
      note: '"Sorry for the trouble" 在英语里偏英式；美式更常说 "Sorry for the inconvenience"（对造成的不便致歉）。',
      lines: [
        { who: 'A', en: 'I\'m sorry, I completely missed your message.', cn: '抱歉，我完全漏掉了你的消息。', key: "I completely missed your message" },
        { who: 'B', en: 'No worries, it happens.', cn: '没事，这种事常有。' },
        { who: 'A', en: 'I should have replied sooner. I\'ll get back to you today.', cn: '我应该早点回的。我今天就处理。', key: 'I should have replied sooner' },
        { who: 'B', en: 'Thanks for letting me know.', cn: '谢谢你告诉我。' },
        { who: 'A', en: 'Sorry again for the delay.', cn: '抱歉又拖了时间。', key: 'sorry again for the delay' }
      ]
    },

    /* ========== 三、意见分歧与说服 ========== */
    {
      id: 'd-o1', cat: '表达不同意', title: 'Pushing back politely',
      titleCn: '温和反对', r: 'R2',
      scene: '朋友推荐你不看好的东西、同事方案你觉得有问题。',
      note: '三段式：先接住 → 再转折 → 最后给替代。不要用 "But" 开头。',
      lines: [
        { who: 'B', en: 'You should totally switch to that new phone.', cn: '你真该换那部新手机。' },
        { who: 'A', en: 'I appreciate the suggestion.', cn: '谢谢你的建议。', key: 'I appreciate the suggestion' },
        { who: 'A', en: 'I\'m not sure it\'s the right time, though.', cn: '不过我觉得现在不是合适的时候。', key: "I'm not sure it's the right time" },
        { who: 'B', en: 'When would be a good time?', cn: '什么时候合适？' },
        { who: 'A', en: 'After the project wraps up in June.', cn: '等六月这个项目结束之后。', key: 'after it wraps up' }
      ]
    },
    {
      id: 'd-o2', cat: '表达不同意', title: 'Holding your ground in an argument',
      titleCn: '坚持立场不吵架', r: 'R2',
      scene: '对方反复施压、容易被带跑，需要既不升级也不让步。',
      note: '技巧：不要重复同一句话，换角度重复同一个意思。重复措辞会被当成没在听。',
      lines: [
        { who: 'B', en: 'But don\'t you think it\'s a bit unfair?', cn: '但你不觉得这有点不公平吗？' },
        { who: 'A', en: 'I understand why it feels that way.', cn: '我理解为什么你会这么觉得。' },
        { who: 'A', en: 'My view is that the rule applies to everyone equally.', cn: '我的看法是这个规则对每个人一视同仁。', key: 'my view is that' },
        { who: 'B', en: 'It doesn\'t feel equal to me.', cn: '对我来说就是不平等。' },
        { who: 'A', en: 'That\'s fair to say. Maybe we can look at how it is applied in practice.', cn: '这话有道理。也许我们可以看看实际是怎么执行的。', key: "that's fair to say" },
        { who: 'B', en: 'Alright. I\'m still not convinced, but I\'ll go along with it.', cn: '好吧。我还是不太信服，但我先配合。' }
      ]
    },

    /* ========== 四、情感与状态 ========== */
    {
      id: 'd-e1', cat: '表达情绪与状态', title: 'Checking in on a friend',
      titleCn: '朋友状态不好时的问候', r: 'R3',
      scene: '朋友很久没联系、发消息已读不回、社交账号明显低落。',
      note: 'R3 场合的关键：不要一上来就问 "Are you OK?"——这会让人有防御。给一个开口的缝。',
      lines: [
        { who: 'A', en: 'Hey, you seemed a bit off lately. No rush to reply.', cn: '嗨，你最近好像有点不在状态。不用急着回。', key: 'you seemed a bit off' },
        { who: 'B', en: 'Thanks for noticing. It\'s been a rough week.', cn: '谢谢你注意到。这周挺难的。' },
        { who: 'A', en: 'Do you want to talk about it, or just take your mind off it?', cn: '你想聊聊，还是先不想这事？', key: 'take your mind off it' },
        { who: 'B', en: 'Honestly, a walk would help.', cn: '说实话，出去走走会有用。' },
        { who: 'A', en: 'I\'m around this weekend if you want company.', cn: '这周末我都有空，想找人一起的话。', key: "I'm around" }
      ]
    },
    {
      id: 'd-e2', cat: '表达情绪与状态', title: 'Saying you are overwhelmed',
      titleCn: '说自己忙不过来', r: 'R2',
      scene: '任务堆积、同事甩活给你。英语文化里「直接说忙」不会得罪人，含糊其辞才会。',
      note: '关键：不要说 "I\'m too busy" 就停住——一定给出「我能做什么、不能做什么」。',
      lines: [
        { who: 'B', en: 'Could you take this on as well?', cn: '这个也能你来做吗？' },
        { who: 'A', en: 'I\'m running behind on a couple of things already.', cn: '我手头已经有几件事落后了。', key: "I'm running behind on" },
        { who: 'A', en: 'I can take it on if the Q3 report slips by a week.', cn: '如果三季报能晚一周，我可以接。', key: 'slip by a week' },
        { who: 'B', en: 'Let me check whether that\'s possible.', cn: '我看看行不行。' },
        { who: 'A', en: 'Happy to prioritise — just let me know which matters most.', cn: '我可以调整优先级——告诉我哪个最重要。', key: 'happy to prioritise' }
      ]
    },
    {
      id: 'd-e3', cat: '表达情绪与状态', title: 'Good news and bad news',
      titleCn: '报喜与报忧', r: 'R2',
      scene: '同时有一好一坏两件事要告诉对方。先说哪个是设计出来的。',
      note: '英语惯例先报忧（bad news first）——先给坏消息再给好消息，听者的情绪曲线更平。',
      lines: [
        { who: 'A', en: 'I have some news, some of it good and some of it not.', cn: '我有个消息，有好有坏。' },
        { who: 'B', en: 'Uh oh. Which one first?', cn: '啊，先说哪个？' },
        { who: 'A', en: 'The bad news is the project got pushed back a month.', cn: '坏消息是项目推迟了一个月。', key: 'got pushed back' },
        { who: 'B', en: 'That\'s tough. And the good news?', cn: '那挺难办的。好消息呢？' },
        { who: 'A', en: 'I got the promotion I was after.', cn: '我拿到了想要的晋升。', key: 'get the promotion I was after' },
        { who: 'B', en: 'Congratulations! That partly makes up for the delay.', cn: '恭喜！这多少能弥补一下延期。' }
      ]
    },

    /* ========== 五、事务与办事 ========== */
    {
      id: 'd-t1', cat: '办事与跑流程', title: 'Sorting out a problem at a shop',
      titleCn: '商店/机构解决问题', r: 'R2',
      scene: '买错尺码、订单没到、账单有误。与其抱怨不如直接要解决方案。',
      note: '句式：说清事实 → 说你想要的解决方式 → 给对方留余地。',
      lines: [
        { who: 'A', en: 'Excuse me, I ordered this in a different size.', cn: '不好意思，这个我订的是另一个尺码。' },
        { who: 'B', en: 'Let me check the order.', cn: '我查一下订单。' },
        { who: 'B', en: 'It went through, but the wrong item was picked.', cn: '订单没错，是拣错了货。' },
        { who: 'A', en: 'Could I swap it for the size I ordered?', cn: '能换成我订的尺码吗？', key: 'swap it for' },
        { who: 'B', en: 'Of course. Do you have the receipt?', cn: '当然。你有小票吗？' },
        { who: 'A', en: 'Here you go. Sorry to bother you.', cn: '给你。麻烦你了。', key: 'sorry to bother you' }
      ]
    },
    {
      id: 'd-t2', cat: '办事与跑流程', title: 'Booking an appointment by phone',
      titleCn: '电话预约', r: 'R2',
      scene: '看医生、理发、餐厅订位。电话里没有可视化信息，所以要主动确认细节。',
      note: '电话沟通要点：先说你是谁、为什么打来、再进入正题。',
      lines: [
        { who: 'B', en: 'Good morning, Riverside Clinic, how can I help?', cn: '早上好，河畔诊所，有什么可以帮您？' },
        { who: 'A', en: 'Hi, I\'d like to book an appointment with Dr Chen.', cn: '你好，我想预约陈医生。', key: "I'd like to book an appointment" },
        { who: 'B', en: 'Have you been with us before?', cn: '您以前来过吗？' },
        { who: 'A', en: 'Yes, last March, for a check-up.', cn: '来过，去年三月做体检。' },
        { who: 'B', en: 'Any day you can\'t make it?', cn: '有哪几天不方便？' },
        { who: 'A', en: 'Tuesday and Wednesday are both difficult for me.', cn: '周二周三都不太方便。', key: "difficult for me" },
        { who: 'B', en: 'We have you down for Thursday at ten.', cn: '那给您约周四十点。', key: 'have you down for' }
      ]
    },

    /* ========== 六、学习与自我提升 ========== */
    {
      id: 'd-l1', cat: '讨论学习与进步', title: 'Talking about a learning goal',
      titleCn: '谈论学习目标', r: 'R2',
      scene: '设定一个可衡量的目标，而不是 "学得好一点"。',
      note: '把目标说成可衡量的（每天 X 分钟 / 到 Y 分），比 "多练练" 有效得多。',
      lines: [
        { who: 'A', en: 'My goal this year is to be able to hold a thirty-minute conversation.', cn: '我今年的目标是能撑起三十分钟对话。', key: 'My goal this year is to' },
        { who: 'B', en: 'That\'s ambitious. How are you planning to get there?', cn: '这个目标不小。你打算怎么达到？' },
        { who: 'A', en: 'Twenty minutes of listening every morning, no exceptions.', cn: '每天早上二十分钟听力，雷打不动。', key: 'no exceptions' },
        { who: 'B', en: 'Every morning?', cn: '每天早上都练？' },
        { who: 'A', en: 'Even on days when I don\'t feel like it.', cn: '哪怕哪天不想练也练。' },
        { who: 'B', en: 'That\'s the part that decides it, honestly.', cn: '说实话，能不能成就在这一步。' }
      ]
    },
    {
      id: 'd-l2', cat: '讨论学习与进步', title: 'Correcting yourself mid-sentence',
      titleCn: '说错时如何自我修正', r: 'R2',
      scene: '口语里说错是常态，母语者靠修正信号表达「我重新组织一下」，而不是停下来道歉。',
      note: '母语者常用 "sorry, I mean…" 快速重来；如果说错了还继续往下说，听者会直接误解。',
      lines: [
        { who: 'A', en: 'I went to Berlin last year — sorry, I mean two years ago.', cn: '我去年去了柏林——抱歉，我是说两年前。', key: 'sorry, I mean' },
        { who: 'B', en: 'No problem. How long were you there?', cn: '没事。你待了多久？' },
        { who: 'A', en: 'About a week. I was there for a conference.', cn: '大概一周。去参加会议。' },
        { who: 'B', en: 'What did you make of the city?', cn: '你觉得那座城市怎么样？', key: 'what did you make of' },
        { who: 'A', en: 'It\'s quieter than I expected. Hard to believe it\'s a capital city.', cn: '比我想的安静，很难相信这是座首都。' }
      ]
    },

    /* ========== 七、模糊限制与不确定 ========== */
    {
      id: 'd-u1', cat: '模糊限制表达', title: 'Being honest about uncertainty',
      titleCn: '坦承不确定', r: 'R1',
      scene: '被问到不知道的事。英语文化极度反感编造答案。',
      note: '"I don\'t know" 不等于能力不足——「假装知道」才是真正扣分项。',
      lines: [
        { who: 'B', en: 'Do you know the population of this city?', cn: '你知道这座城市的人口吗？' },
        { who: 'A', en: 'Not off the top of my head.', cn: '我一时说不上来。', key: 'not off the top of my head' },
        { who: 'B', en: 'No problem, roughly is fine.', cn: '没事，大致数字就行。' },
        { who: 'A', en: 'I think it\'s around two million, but I\'d want to check.', cn: '我记得大概两百万，但我想确认一下。', key: "I'd want to check" },
        { who: 'B', en: 'Better to flag that than guess.', cn: '标明不确定比乱猜好。' },
        { who: 'A', en: 'Let me look it up and get back to you.', cn: '我查一下再回复你。', key: 'look it up and get back to you' }
      ]
    },
    {
      id: 'd-u2', cat: '模糊限制表达', title: 'Softening what you say',
      titleCn: '把话说软', r: 'R2',
      scene: '直接说 "no" 太生硬，尤其在拒绝或提意见时。',
      note: '英语里拒绝的三种硬度：Not really < I don\'t think so < I\'m afraid I can\'t. 能用前两种就别用第三种。',
      lines: [
        { who: 'B', en: 'Can we talk for a second?', cn: '能聊一下吗？' },
        { who: 'A', en: 'Of course.', cn: '当然。' },
        { who: 'A', en: 'I might be wrong, but I don\'t think this is the right approach.', cn: '我可能不对，但我觉得这个方法不合适。', key: 'I might be wrong, but' },
        { who: 'B', en: 'What would you suggest?', cn: '你会建议怎么做？' },
        { who: 'A', en: 'It might be worth starting with a smaller test first.', cn: '也许先做个小规模测试更值得。', key: 'it might be worth doing' },
        { who: 'B', en: 'That\'s a fair point.', cn: '这话有道理。' }
      ]
    }
  ];

  /* ============================================================
     索引：按分类、按重点表达反查
     ============================================================ */
  var byCatIdx = {};
  var byKeyIdx = {};
  var seenId = {};

  function buildIndex() {
    if (Object.keys(byCatIdx).length) return;
    DIALOGS.forEach(function (d) {
      var list = byCatIdx[d.cat] || (byCatIdx[d.cat] = []);
      list.push(d);
      if (!seenId[d.id]) seenId[d.id] = d;
      (d.lines || []).forEach(function (l) {
        if (!l.key) return;
        var k = l.key.toLowerCase();
        (byKeyIdx[k] || (byKeyIdx[k] = [])).push({ d: d, line: l });
      });
    });
  }

  /* 供「按分类」筛选：给 view-daily-comm 的分类浏览用 */
  function byCat() {
    buildIndex();
    return Object.keys(byCatIdx).map(function (k) {
      return { cat: k, n: byCatIdx[k].length, list: byCatIdx[k] };
    });
  }

  /* 供划词/词条反查：给某个表达找出它出现在哪些对话里。
     双向匹配是必需的：对话里的 key 往往只是句子的一段
     （"I'd push back on that"），而词库里的表达可能是完整句
     （"I'd push back on that assumption"）—— 只做单向 contains 会两边都漏。*/
  function findByExpression(en) {
    buildIndex();
    var w = String(en || '').trim().toLowerCase();
    if (!w) return [];
    var seen = {};
    function push(d) { if (d && !seen[d.id]) { seen[d.id] = 1; } }
    var out = [];

    // 1) key 精确命中
    (byKeyIdx[w] || []).forEach(function (x) { if (!seen[x.d.id]) { seen[x.d.id] = 1; out.push(x.d); } });
    if (out.length) return out;

    // 2) key 被表达包含（key 短、表达长）
    Object.keys(byKeyIdx).forEach(function (k) {
      if (k.length < 4) return;
      if (w.indexOf(k) >= 0) byKeyIdx[k].forEach(function (x) { push(x.d); });
    });
    if (out.length) return out;

    // 3) 表达被 key 包含（表达短、key 长）—— 用词的集合比较，避免整句死板匹配
    var words = w.split(/[^a-z0-9']+/).filter(function (x) { return x.length > 2; });
    if (words.length >= 2) {
      var hits = Object.keys(byKeyIdx).filter(function (k) {
        var kw = k.split(/[^a-z0-9']+/).filter(function (x) { return x.length > 2; });
        if (!kw.length) return false;
        var inter = kw.filter(function (x) { return words.indexOf(x) >= 0; }).length;
        return inter / kw.length >= 0.6;
      });
      hits.slice(0, 6).forEach(function (k) { byKeyIdx[k].forEach(function (x) { push(x.d); }); });
      if (out.length) return out;
    }

    // 4) 整句包含兜底
    DIALOGS.forEach(function (d) {
      var ok = (d.lines || []).some(function (l) {
        return String(l.en || '').toLowerCase().indexOf(w) >= 0;
      });
      if (ok) push(d);
    });
    out = DIALOGS.filter(function (d) { return seen[d.id]; });
    return out;
  }

  global.CommDialogs = {
    all: function () { return DIALOGS; },
    count: function () { return DIALOGS.length; },
    lineCount: function () {
      return DIALOGS.reduce(function (n, d) { return n + (d.lines || []).length; }, 0);
    },
    byId: function (id) { buildIndex(); return seenId[id] || null; },
    byCat: byCat,
    cats: function () { buildIndex(); return Object.keys(byCatIdx); },
    findByExpression: findByExpression,
    stats: function () {
      buildIndex();
      var lines = DIALOGS.reduce(function (n, d) { return n + (d.lines || []).length; }, 0);
      return {
        dialogs: DIALOGS.length, lines: lines, cats: Object.keys(byCatIdx).length,
        keyedLines: Object.keys(byKeyIdx).length
      };
    }
  };
})(window);
