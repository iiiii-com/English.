/* ============================================================
   content-speaking.js —— 口语场景对话 + 发音训练
   每个场景包含：角色台词、逐句发音要点、连读/弱读提示、情景任务
   发音评分原理：Web Speech API 识别文本 + 音节/重音位置比对
   ============================================================ */
(function (global) {
  'use strict';

  var SCENES = [
    /* ===================== L1 入门 ===================== */
    {
      id: 's-l1-01', lv: 'L1', title: '自我介绍', titleCn: '在会议上介绍自己', minutes: 5,
      goal: '能在 30 秒内说出姓名、职业、所在地三项信息',
      challenge: '不看提示，连续说满 5 句',
      lines: [
        {
          who: 'A', en: 'Good morning, everyone.',
          cn: '大家早上好。',
          focus: 'Good 的 d 与 morning 的 m 之间要连读成 /d m/；everyone 重音在第二个音节 every。',
          tip: '重音落在 "MORN-ing"，句尾升调表示问候未结束。'
        },
        {
          who: 'B', en: 'Hi, I\'d like to introduce myself.',
          cn: '大家好，我想做个自我介绍。',
          focus: "I'd = I would 的缩写，念 /aɪd/，不要拆成三个音节分开的 I would。",
          tip: 'introduce 重音在后：in-tro-DUCE（动词重音在最后）。'
        },
        {
          who: 'A', en: 'My name is Chen Wei. Nice to meet you.',
          cn: '我叫陈伟，很高兴认识你。',
          focus: 'Nice to meet you 连读为 "nice-to-meet-ya"，t 与 y 相遇产生辅音融合。',
          tip: '姓在前名在后：Chen 是姓，Wei 是名。中文习惯相反，听力时容易混。'
        },
        {
          who: 'B', en: 'Nice to meet you too. Where are you from?',
          cn: '我也很高兴认识你。你来自哪里？',
          focus: 'Where are you 三个词连读时 w 与 a 相邻，元音容易被省略成 /werjə/。',
          tip: 'too 在句尾升调；from 尾音 /m/ 要闭上嘴唇收音。'
        },
        {
          who: 'A', en: 'I\'m from Hangzhou. I work as a designer.',
          cn: '我来自杭州，我是一名设计师。',
          focus: "I'm 念 /aɪm/ 不分拆；as a 连读成 /əzə/。",
          tip: '职业名词重音通常在首音节：DE-sign-er。'
        },
        {
          who: 'B', en: 'How long have you worked there?',
          cn: '你在那里工作多久了？',
          focus: '现在完成时：How long + have/has + 过去分词。回答必须是 "I have worked..."',
          tip: 'work 在此重读 /wɜːrk/，ed 在过去分词中读 /t/：worked。'
        },
        {
          who: 'A', en: 'For about three years. I enjoy my work.',
          cn: '大约三年了。我喜欢我的工作。',
          focus: 'for + 一段时间；about 轻读，three 重读。',
          tip: '"I enjoy" 的 enjoy 重音在后：en-JOY。'
        },
        {
          who: 'B', en: 'Great. Let\'s hope we work together soon.',
          cn: '很好，希望我们很快能一起合作。',
          focus: "Let's = let us，/lets/；work together 中 t 与 t 相遇只发一个 t。",
          tip: 'hop 在这里是"希望"，不是"跳"。'
        }
      ]
    },
    {
      id: 's-l1-02', lv: 'L1', title: 'Ordering Food', titleCn: '在餐厅点餐', minutes: 5,
      goal: '能完成点单、加要求、结账三个环节',
      challenge: '全程只用英文说出你要什么、忌口什么、买单',
      lines: [
        { who: 'A', en: 'Good evening. A table for two, please.', cn: '晚上好，两位。', focus: 'for two 连读；two 的 w 不发音，念 /tuː/。', tip: '餐厅开场固定句，务必背熟。' },
        { who: 'B', en: 'Of course. Would you like to sit by the window?', cn: '当然。您想坐窗边吗？', focus: 'Would you 连读成 /wʊdʒu/，d+ʒ 融合。', tip: '礼貌问句用升调。' },
        { who: 'A', en: 'Yes, that would be great. Thank you.', cn: '是的，那太好了，谢谢。', focus: 'that would 中 t 与 w 相邻，t 几乎不发音。', tip: '接受建议的万能句型。' },
        { who: 'B', en: 'Here is the menu. Can I get you something to drink?', cn: '这是菜单。喝点什么吗？', focus: 'get you something 连读密集，注意 y 在词中读 /j/。', tip: 'Can I get... 是点单的核心句型。' },
        { who: 'A', en: 'I\'d like a glass of water, please. No ice, please.', cn: '我要一杯水，谢谢。不要冰。', focus: "I'd like = I would like；ice 的 c 不发音。", tip: '"No ___ , please" 是提出要求的固定结构。' },
        { who: 'B', en: 'Sure. Are you ready to order?', cn: '好的。可以点餐了吗？', focus: 'ready to order 中 /di/ 与 /tu/ 之间有轻微辅音过渡。', tip: '服务员通常会这样问。' },
        { who: 'A', en: 'Yes. I\'d like the chicken and rice. And one more water.', cn: '是的，我要鸡肉饭，再要一杯水。', focus: 'chicken 中 ch 读 /tʃ/，不是 /k/；rice 结尾 /s/ 不浊化。', tip: 'and 在元音前读 /ænd/，在辅音前读 /ən/。' },
        { who: 'B', en: 'Excellent. Your food will be about fifteen minutes.', cn: '好的，您的餐大约十五分钟。', focus: 'fifteen 中 ee 读长音 /iː/。', tip: '美食名词重音常在首音节：CHICK-en。' },
        { who: 'A', en: 'Great. Can we have the bill, please?', cn: '好的，请结账。', focus: 'bill 在美式是账单，英式常用 check。', tip: '结账美式说 check / bill，英式说 bill，别混用场合。' }
      ]
    },
    {
      id: 's-l1-03', lv: 'L1', title: 'Asking for Help', titleCn: '问路与求助', minutes: 4,
      goal: '能向陌生人问路并听懂方向回答',
      challenge: '描述你要去的地点，不使用中文地名',
      lines: [
        { who: 'A', en: 'Excuse me, could you help me?', cn: '打扰一下，您能帮我吗？', focus: 'Excuse me 中 /s/ 结尾轻读，不加 d。', tip: '问路前的礼貌开场，绝不能省。' },
        { who: 'B', en: 'Of course. What are you looking for?', cn: '当然，您在找什么？', focus: 'looking for 连读为 /lʊkɪŋfɔː/。', tip: '自然表达是 "What are you looking for?" 而非 "What do you want?"' },
        { who: 'A', en: 'I\'m looking for the subway station.', cn: '我在找地铁站。', focus: "I'm 缩短为 /aɪm/；station 中 -tion 读 /ʃən/。", tip: '找某地：looking for + 地点。' },
        { who: 'B', en: 'Go straight for two blocks, then turn left.', cn: '直走两个街区，然后左转。', focus: 'straight 里 str 三辅音丛，要读完整不吞音。', tip: '方位指令核心词：straight / left / right / corner' },
        { who: 'A', en: 'Two blocks, then left. Is it far?', cn: '两个街区然后左转。远吗？', focus: 'block 中 ck 读 /k/，词尾 /k/ 清晰。', tip: '确认指令的复述练习是听力关键。' },
        { who: 'B', en: 'Not far. About five minutes on foot.', cn: '不远，走路大约五分钟。', focus: 'on foot 连读为 /ɒnfʊt/，两个词几乎合成一个。', tip: 'on foot = 步行，与 by bus / by taxi 对比记。' },
        { who: 'A', en: 'Great, thank you so much for your help.', cn: '太好了，非常感谢您的帮助。', focus: 'so much 连读；for your 中 /fɔːrjə/。', tip: '强化感谢：Thank you so much / Thanks a lot。' },
        { who: 'B', en: 'You\'re welcome. Have a nice day.', cn: '不客气，祝您愉快。', focus: "You're = /jʊr/，w 不发音。", tip: '标准告别语。' }
      ]
    },

    /* ===================== L2 基础 ===================== */
    {
      id: 's-l2-01', lv: 'L2', title: 'Talking About Your Weekend', titleCn: '聊周末做了什么', minutes: 7,
      goal: '能使用一般过去时讲述过去的事，含时间与频率副词',
      challenge: '用过去时讲 3 件上周的事，其中 1 件说清楚原因',
      lines: [
        { who: 'A', en: 'How was your weekend?', cn: '你周末过得怎么样？', focus: 'How was 快速连读成 /haʊwəz/。', tip: '开启话题的经典提问。' },
        { who: 'B', en: 'It was pretty good. I went to the park.', cn: '挺好的，我去公园了。', focus: 'went 是 go 的不规则过去式；went to 连读。', tip: '一般过去时：动词加 -ed 或用不规则形式。' },
        { who: 'A', en: 'Oh, that sounds nice. What did you do there?', cn: '哦，听起来不错。你在那儿做什么？', focus: 'did you 连读成 /dɪdʒu/；过去疑问句用 did。', tip: '注意：过去疑问句 did 后动词用原形。' },
        { who: 'B', en: 'I read a book and had lunch at a small restaurant.', cn: '我读了本书，还在一家小餐馆吃了午饭。', focus: 'had 中 h 不发音；lunch 的 ch 读 /tʃ/。', tip: '并列动词用 and 连接，顺序与中文一致。' },
        { who: 'A', en: 'Did you do that last weekend too?', cn: '上周末你也这样吗？', focus: 'last weekend 的两个词几乎连成一个词。', tip: 'last / next / this + 时间，顺序固定。' },
        { who: 'B', en: 'No, I don\'t usually. I was too tired from work.', cn: '不，我不常这样。上班太累了。', focus: 'don\'t 缩写 /doʊnt/；too 表"太……了"。', tip: 'too + 形容词 = 过于；very + 形容词 = 非常。' },
        { who: 'A', en: 'I understand. I usually stay home on weekends.', cn: '我理解。周末我通常待在家。', focus: 'stay home 中 t 与 h 相遇，前 t 变轻。', tip: '频率副词位置：在实义动词前、be 动词后。' },
        { who: 'B', en: 'You should get out more. The city is beautiful on Sundays.', cn: '你应该多出去走走。星期天城市很美。', tip: 'get out 指"出门活动"，与 stay home 相对。', focus: 'beautiful 三音节 /ˈbjuːtɪfəl/，中间 -tiful 弱读。' }
      ]
    },
    {
      id: 's-l2-02', lv: 'L2', title: 'Making Plans', titleCn: '和朋友约时间', minutes: 7,
      goal: '能提出邀约、确认时间、协商改期',
      challenge: '主动改一次时间并说明理由',
      lines: [
        { who: 'A', en: 'Do you want to grab a coffee this week?', cn: '这周想喝杯咖啡吗？', focus: 'grab a coffee 是地道口语，意为"随便喝一杯"。', tip: 'grab 这里是"快速去一下"，不是抓。' },
        { who: 'B', en: 'Sure, that works for me. When are you free?', cn: '当然，我没问题。你什么时候有空？', focus: 'that works for me 表示"我没问题"，比 no problem 更专业。', tip: '可用表达：works for me / suits me / I\'m free.' },
        { who: 'A', en: 'How about Thursday afternoon, around three?', cn: '周四下午三点左右怎么样？', focus: 'How about 后接名词或动名词；around 意为"大约"。', tip: '约时间的三个问法：How about / What about / Does… work?' },
        { who: 'B', en: 'Three is a bit early. Could we make it four instead?', cn: '三点有点早。能改四点吗？', focus: 'make it + 时间 = 定在；instead 表替代。', tip: '委婉协商：a bit early 不是拒绝，是留台阶。' },
        { who: 'A', en: 'Four works better. Should we meet at the cafe near my office?', cn: '四点更好。我们在我办公室附近的咖啡店见？', focus: 'Should we 是建议语气，比 Will we 更礼貌。', tip: '提地点时说清参照物，near / next to / across from。' },
        { who: 'B', en: 'Sounds good. I\'ll text you when I leave.', cn: '好的，我出发时给你发消息。', focus: "I'll = I will；text 在这里作动词，表示「发消息」。", tip: '约定确认句：I\'ll text you / I\'ll let you know.' },
        { who: 'A', en: 'Perfect. See you then. Looking forward to it.', cn: '好的，到时见，我很期待。', focus: 'looking forward to 中 to 是介词，后接名词或动名词。', tip: '期待表达：look forward to + doing，不是 to do。' },
        { who: 'B', en: 'Me too. See you!', cn: '我也是，回见！', focus: 'Me too = 我也一样，比 I do 更自然。', tip: '告别语尾随意的 me too。' }
      ]
    },
    {
      id: 's-l2-03', lv: 'L2', title: 'Talking About a Problem', titleCn: '描述问题并求助', minutes: 8,
      goal: '能按"现象-影响-原因-诉求"四步法描述问题',
      challenge: '用 because 说明原因，用 so 给出诉求',
      lines: [
        { who: 'A', en: 'Sorry to bother you. Do you have a minute?', cn: '不好意思打扰，您有空吗？', focus: 'Sorry to bother you 是最得体的开场。', tip: '英语沟通先给缓冲垫，再进入正题。' },
        { who: 'B', en: 'Sure, no problem. What can I do for you?', cn: '当然，什么事？', focus: 'What can I do for you 是服务/职场万能句。', tip: 'Do 的助动词形式在疑问句中前置。' },
        { who: 'A', en: 'My computer has been running slowly for a week.', cn: '我的电脑一周来一直运行很慢。', focus: '现在完成进行时：has been + doing，强调持续。', tip: 'for + 一段时间 = 持续多久，是这个句型的关键。' },
        { who: 'B', en: 'Have you tried restarting it?', cn: '你试过重启吗？', focus: '现在完成时疑问：Have you tried。', tip: 'restart = restart，动词重音在后。' },
        { who: 'A', en: 'Yes, but that only helps for a few minutes.', cn: '试过，但只能管几分钟。', focus: 'that 指代前句内容；a few 修饰可数名词复数。', tip: 'a few（一些）/ a little（一点）区分清楚。' },
        { who: 'B', en: 'It might be because too many programs are open.', cn: '可能是因为开了太多程序。', focus: 'might be because 委婉推测；too many + 复数。', tip: '表达推测用 might / may / probably，不要用 must。' },
        { who: 'A', en: 'That makes sense. So I should close some of them?', cn: '有道理。那我应该关掉一些？', focus: 'makes sense 是高频确认词；句尾升调表示确认。', tip: '确认理解：So I should…? / Do you mean…?' },
        { who: 'B', en: 'Exactly. And if it still happens, let me know.', cn: '完全正确。如果还发生，告诉我。', focus: 'if 引导条件句，主句用祈使句 let me know。', tip: 'offer help：let me know 是自然的跟进承诺。' }
      ]
    },

    /* ===================== L3 进阶 ===================== */
    {
      id: 's-l3-01', lv: 'L3', title: 'Presenting Your Opinion', titleCn: '表达观点并说服他人', minutes: 10,
      goal: '能给出观点、给出理由、用让步处理反对意见',
      challenge: '说出一个你不同意的观点，并用 although 让步结构回应质疑',
      lines: [
        { who: 'A', en: 'I\'d argue that remote work improves focus rather than reduces it.', cn: '我认为远程办公提升专注力而非削弱它。', focus: "I'd argue that 学术化表达；rather than 表对比。", tip: '开门见山给立场，比先铺垫更有效。' },
        { who: 'B', en: 'That\'s an interesting claim. How do you justify it?', cn: '有意思的说法，你怎么论证？', focus: 'justify 要求你给依据，不是给感受。', tip: 'justify = provide evidence/reason for。' },
        { who: 'A', en: 'The data suggests fewer interruptions. My focus drops every time someone walks by.', cn: '数据显示打断减少了。有人经过时我的注意力就掉。', focus: 'suggests 比 proves 弱，更符合学术表达的分寸。', tip: '降级用词：suggest / indicate / tend to，比断言更专业。' },
        { who: 'B', en: 'But isn\'t that just about your personality? Some people need the office.', cn: '但那不只跟个性有关吗？有些人需要在办公室。', focus: '反问句尾升调，B 不同意但在等你回应。', tip: '识别对方反对信号：but / isn\'t that…' },
        { who: 'A', en: 'That\'s fair. Although some people do need structure, the average case favors focus.', cn: '有道理。虽然有些人确实需要结构，但平均而言专注更受益。', focus: 'although + 句子, but + 句子 的正确用法：让步后仍给出立场。', tip: '先承认对方合理（That\'s fair），再坚持观点。' },
        { who: 'B', en: 'What about new employees learning from colleagues?', cn: '那新员工向同事学习怎么办？', focus: 'What about 用于引入未涉及的反对点。', tip: '预判反对意见并主动回应，谈话会显得你更有准备。' },
        { who: 'A', en: 'Valid point. I\'d say the answer is a hybrid model for onboarding specifically.', cn: '有道理。我的建议是入职阶段采用混合模式。', focus: 'hybrid 是职场高频词；specifically 收窄范围以化解反对。', tip: '化解反对的技巧：同意前提 + 收窄范围 + 给出方案。' },
        { who: 'B', en: 'That feels more practical. Let\'s test it for one quarter.', cn: '这听起来更可行。我们试一个季度吧。', focus: 'practical 优于 good；test it 弱化承诺风险。', tip: '结尾用小范围试点降低对方决策压力。' }
      ]
    },
    {
      id: 's-l3-02', lv: 'L3', title: 'Job Interview', titleCn: '面试中的核心问答', minutes: 12,
      goal: '能完成自我介绍、能力举证、反问环节',
      challenge: '用 STAR 结构回答一个行为面试题（情境-任务-行动-结果）',
      lines: [
        { who: 'A', en: 'Tell me about yourself.', cn: '介绍一下你自己。', focus: '这是硬问题，答案必须是 60 秒的浓缩版。', tip: '结构：现在做什么 → 之前做过什么 → 与岗位的关联。' },
        { who: 'B', en: 'I\'m a data analyst with four years of experience in retail. Currently I build dashboards that save my team about ten hours a month.', cn: '我是数据分析师，零售行业四年经验。目前做的看板每月为团队省约十小时。', focus: 'with + 时间段表示经验；现在完成时说 to date 的成果。', tip: '用数字说话：four years / ten hours 比 diligent 有力十倍。' },
        { who: 'A', en: 'Give me an example of a time you handled conflicting priorities.', cn: '举一个你处理优先级冲突的例子。', focus: 'behavioral question，用 STAR，不要泛泛而谈。', tip: 'Situation / Task / Action / Result，四段各一句。' },
        { who: 'B', en: 'Last quarter, two teams needed the same dataset by Friday. Sales\' deadline was fixed, but product\'s could move.', cn: '上个季度两个团队都要同一份数据，周五交。销售的时间不能动，但产品的可以。', focus: 'fixed vs could move 是关键对比；don\'t 后用动词原形。', tip: '第一步先厘清哪个可协商，这是判断力的展示。' },
        { who: 'B', en: 'So I gave sales the priority fields first, and shared the full set with product three days later.', cn: '所以我先给销售优先字段，三天后再把完整版给产品。', focus: 'give sb sth 顺序：give sales the fields；later 位置在句末。', tip: 'Action 部分要说清具体做了什么，不是"我沟通了"。' },
        { who: 'B', en: 'Both teams got what they needed, and the process is now our default for overlapping requests.', cn: '两个团队都拿到了需要的，这个流程现在成了重叠需求的默认做法。', focus: 'now 暗示结果延续至今，是加分细节。', tip: 'Result 要有可验证的沉淀，不要只说"大家都满意"。' },
        { who: 'A', en: 'Good. Do you have any questions for us?', cn: '很好，你有什么想问我们的吗？', focus: '不问问题会被视为不感兴趣，必须准备 2 个。', tip: '反问要展示你在思考，而不是在质疑公司。' },
        { who: 'B', en: 'Yes. How would you describe the team\'s current priority for the next year?', cn: '有的。您会怎么描述团队明年的首要方向？', focus: 'How would you describe 是邀请对方分享信息的安全问法。', tip: '好问题：关于目标、评价标准、成长路径，而非福利。' },
        { who: 'B', en: 'And what does success look like in the first six months?', cn: '以及前六个月做到什么样算成功？', focus: 'look like 意为"呈现什么样子"，非常实用。', tip: '这个问题表明你已经在思考交付，面试官会记住。' }
      ]
    },

    /* ===================== L4 精通 ===================== */
    {
      id: 's-l4-01', lv: 'L4', title: 'Negotiating and Disagreeing', titleCn: '谈判与有礼貌的反对', minutes: 12,
      goal: '能在分歧中守住立场，同时不破坏关系',
      challenge: '用 "I see your point, but…" 结构表达一次真实的反对',
      lines: [
        { who: 'A', en: 'I see your point, but the timeline looks unrealistic given where the project stands.', cn: '我理解你的观点，但就项目当前进度而言，这个时间表不现实。', focus: 'I see your point, but 是最安全的反对开场：先承认再转折。', tip: '切勿用 "You are wrong" 或 "No" 起手。' },
        { who: 'B', en: 'We had agreed on the date in March. Moving it now affects three other teams.', cn: '我们三月就定好日期了。现在改会影响另外三个团队。', focus: '现在时 had agreed 表示过去的约定仍然有效。', tip: '用事实和影响代替情绪，是谈判的基本盘。' },
        { who: 'A', en: 'That\'s a fair constraint. Could we phase it instead — core features first, the rest in August?', cn: '这个约束合理。我们能否分阶段做——先核心功能，其余八月再上？', focus: 'phase it = 分阶段实施；破折号做解释停顿。', tip: '不要只说"不行"，要给替代方案，否则谈判变成对抗。' },
        { who: 'B', en: 'Phasing complicates the rollout. We\'d need to maintain two versions for a while.', cn: '分阶段会让上线复杂。有一段时间我们得维护两个版本。', focus: 'rollout = 上线/推广；maintain two versions 是真实成本。', tip: '对方提出的成本是有效信息，要接住而不是绕开。' },
        { who: 'A', en: 'Understood. The version split is the real problem, not the date.', cn: '理解了。真正的问题是版本分叉，不是日期。', focus: '重述对方顾虑以确认理解：real problem, not the date。', tip: '把分歧从"立场之争"转为"问题识别"，是最快的降温方式。' },
        { who: 'B', en: 'Exactly. So if the maintenance burden is the issue, we could extend the deadline by three weeks.', cn: '正是。所以如果负担是关键，我们可以把截止时间延三周。', focus: 'if 从句用陈述语气引导结论，比用疑问句更有力。', tip: '用 If 引导的陈述句做柔性提议，比 Could we 更难被拒。' },
        { who: 'A', en: 'Three weeks works. Let\'s document the maintenance plan so we don\'t revisit this.', cn: '三周可以。我们把维护方案写下来，免得以后再讨论。', focus: 'document = 书面记录；revisit this = 回头再谈这件事。', tip: '谈判收尾必须落到书面动作，否则口头共识会消失。' },
        { who: 'B', en: 'Agreed. I\'ll send the plan by Thursday and cc the three teams.', cn: '同意。我周四前发方案，并抄送那三个团队。', focus: 'cc = carbon copy，抄送，邮件高频缩写。', tip: '明确责任人与时间点：I\'ll + 动词 + by + 时间。' }
      ]
    },
    {
      id: 's-l4-02', lv: 'L4', title: 'Presenting Under Pressure', titleCn: '在质疑中陈述数据', minutes: 14,
      goal: '能承受质疑、承认数据局限、用限定语保护结论',
      challenge: '面对一个尖锐质疑，先承认合理部分再给出你的判断',
      lines: [
        { who: 'A', en: 'Based on last quarter\'s data, churn dropped by twelve percent.', cn: '根据上季度数据，流失率下降了百分之十二。', focus: 'Based on… 引出依据；数字后用 past tense。', tip: '开场给结论 + 依据，符合金字塔原理。' },
        { who: 'B', en: 'Twelve percent seems like a lot. What caused it?', cn: '百分之十二不少。是什么原因？', focus: 'seems like 保留判断，是质疑的缓冲说法。', tip: '面对"这数字太大了"，先别立刻让步。' },
        { who: 'A', en: 'Two factors. We changed the onboarding flow, and there was a pricing update in May.', cn: '两个因素。我们改了引导流程，五月还有一次价格调整。', focus: 'enumeration：先给数量再展开，听者更好接。', tip: '归因时区分你能影响的和你不能控制的。' },
        { who: 'B', en: 'So you can\'t really separate the two effects.', cn: '所以你没法把这两个影响分开。', focus: 'separate A from B 是数据讨论的常用表达。', tip: '这是关键质疑，回应方式决定专业度。' },
        { who: 'A', en: 'You\'re right that a clean separation would require more data. What I can say is that the timing of the two changes is close.', cn: '你说得对，彻底分离需要更多数据。我能说的是这两项变动的时间点接近。', focus: 'What I can say is that 明确限定你的主张范围。', tip: '承认局限不等于示弱，它避免了你被更大的反驳击穿。' },
        { who: 'B', en: 'That\'s a reasonable position. What would it take to be more certain?', cn: '这是合理的立场。要更有把握需要什么？', focus: 'What would it take to… 是推进讨论的高效提问。', tip: '主动说明"需要什么证据"，显示你懂方法论。' },
        { who: 'A', en: 'A holdout group with the old onboarding, six weeks, about three hundred users.', cn: '一组用旧流程的对照用户，六周，大约三百人。', focus: 'holdout group = 对照组；数字给具体范围而非精确值。', tip: '给出可执行的验证方案，是分析师的标志能力。' },
        { who: 'B', en: 'Good. Run it and bring the result to the review meeting.', cn: '很好。做完拿到评审会上来汇报。', focus: 'bring sth to… = 把某物带到某场合。', tip: '结论要能被检验。把"我们觉得"变成"我们测了"。' }
      ]
    }
  ];

  /* 发音训练音标对照（美式 IPA + 常见中国学习者问题） */
  var SOUNDS = [
    { sym: '/iː/', name: '长音 ee', words: ['see', 'eat', 'meet', 'need'], tip: '嘴唇放松、微开，舌位高而靠前，时长约为中文"一"的两倍。', pitfall: '不要读成中文"一"，那太短。' },
    { sym: '/ɪ/', name: '短音 i', words: ['it', 'sit', 'build', 'busy'], tip: '比 /iː/ 更松、更短，嘴角不需要展开。', pitfall: 'ship / sheep 混读：舌位差 2mm，靠肌肉记忆。' },
    { sym: '/æ/', name: '扁嘴 a', words: ['cat', 'bad', 'man', 'happy'], tip: '下巴下压，嘴横向拉开，接近微笑状。', pitfall: '中国学习者常读成 /e/，听感偏"bet"而非"bat"。' },
    { sym: '/ɑː/', name: '长音 ah', words: ['hot', 'stop', 'not', 'father'], tip: '嘴张大，舌身后缩，喉部放松。', pitfall: '别读成 /æ/，car 不能读成 care 的音。' },
    { sym: '/ʌ/', name: '短音 uh', words: ['cup', 'love', 'money', 'bus'], tip: '口型比 /ɑː/ 小，舌位居中，音短促。', pitfall: '与 /ɑː/ 混淆：bus ≠ bars。' },
    { sym: '/ɜːr/', name: '卷舌 er', words: ['work', 'first', 'learn', 'person'], tip: '舌中抬起接近上颚，双唇略圆，不卷舌。', pitfall: '与 /ɑːr/（car）区分，wɜːrk ≠ wark。' },
    { sym: '/θ/ /ð/', name: '咬舌音', words: ['think', 'three', 'this', 'mother'], tip: '舌尖轻触上齿边缘，送气（/θ/）或声带振动（/ð/）。', pitfall: '中国学习者最常见错误：读成 /s/ 或 /z/，think 听起来像 sink。' },
    { sym: '/r/', name: '美式 r', words: ['red', 'right', 'around', 'car'], tip: '舌尖卷起但不碰上颚，舌身放松成拱形。', pitfall: '不要碰到上颚，否则变成英式 /r/。' },
    { sym: '/l/', name: '暗 l', words: ['like', 'will', 'feel', 'people'], tip: '词尾 l 舌尖要抵住上齿龈（dark l 在元音后）。', pitfall: 'feel 词尾别丢，读成 "fee"。' },
    { sym: '/v/ /w/', name: '双唇音', words: ['very', 'want', 'we', 'work'], tip: '/v/ 上齿轻触下唇；/w/ 双唇收圆前突。', pitfall: 'v 与 w 分不清会严重损害可懂度。' }
  ];

  /* 连读/弱读规则表 */
  var CONNECTIVES = [
    { rule: '辅音+元音', desc: '前词辅音连到后词元音', ex: 'pick it up → pi-ki-tup', level: '入门' },
    { rule: '元音+元音', desc: '加过渡音 /w/ 或 /j/', ex: 'go on → go-won / I am → I-yam', level: '入门' },
    { rule: '相同辅音', desc: '只发一次，不重复', ex: 'big girl → bi-girl', level: '基础' },
    { rule: '辅音群相遇', desc: '前词尾辅音省略', ex: 'first day → firs-day', level: '基础' },
    { rule: '失去爆破', desc: '只做口型不爆破', ex: 'good boy → goo(d)-boy', level: '进阶' },
    { rule: '弱读', desc: '功能词读轻音', ex: 'and → /ənd/ 或 /ən/, of → /əv/', level: '入门' },
    { rule: '句子重音', desc: '实词重读虚词弱读', ex: 'I WANT to GO home', level: '基础' },
    { rule: '意群停顿', desc: '在意义单位间停顿', ex: 'I came, / saw, / and conquered.', level: '进阶' }
  ];

  function byLevel(lv) { return SCENES.filter(function (s) { return !lv || lv === 'ALL' || s.lv === lv; }); }

  global.SpeakingContent = { SCENES: SCENES, SOUNDS: SOUNDS, CONNECTIVES: CONNECTIVES, byLevel: byLevel };
})(window);