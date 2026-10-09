/* ============================================================
   content-scene-l4.js —— L4 精通级场景对话（补充）
   审计发现 L4 仅 2 个场景，与 L1(9)/L2(10)/L3(9) 严重失衡。
   本批补 6 个 L4 场景，聚焦高阶沟通：学术汇报、导师沟通、
   会议主持、跨文化协作、客户谈判、危机应对。
   ============================================================ */
(function (global) {
  'use strict';

  var SCENES = [
    {
      id: 'x4-01', lv: 'L4', title: 'Presenting Research', titleCn: '学术汇报与答辩', minutes: 14,
      goal: '能就专业话题做 5 分钟陈述并应对提问',
      challenge: '用「The finding suggests… rather than proves…」区分结论强度',
      lines: [
        { who: 'A', en: 'Thank you all for coming. Today I\'ll present the results of our six-month study.', cn: '感谢各位到场。今天我将汇报我们为期六个月的研究结果。', focus: 'result 常读 /ˈrɪzʌlt/ 或 /rɪˈzʌlt/，注意重音位置变化。', tip: '开场先给时间跨度，让听众知道体量。' },
        { who: 'A', en: 'The research question was simple: does remote work actually improve output?', cn: '研究问题很简单：远程办公是否真的提升了产出？', focus: '陈述疑问句时句末用升调，research 重音在第一音节。', tip: '把复杂问题压缩成一句，是汇报的核心技巧。' },
        { who: 'B', en: 'That\'s a claim many people dispute. How did you control for that?', cn: '这个说法很多人有异议。你们怎么控制这个变量？', focus: 'control for 是学术常用搭配，指「控制变量」。', tip: '「How did you…?」是质疑的礼貌形式。' },
        { who: 'A', en: 'Good question. We used a control group of comparable employees.', cn: '好问题。我们设了一个可比的员工对照组。', focus: 'Good question 是学术场合对提问者的标准致谢。', tip: '注意：对「问题」的感谢，不是否定提问本身。' },
        { who: 'A', en: 'The finding suggests a thirteen percent increase, though we would not claim causation.', cn: '研究结果表明产出提升 13%，但我们不主张因果关系。', focus: 'suggests 比 shows 弱；claim causation 是学术分寸的关键。', tip: '⚠️ 学术诚实：数据说「相关」就不要说「导致」。' },
        { who: 'B', en: 'Fair. But self-reported satisfaction data is notoriously soft.', cn: '有道理。但自我报告的满意度数据 notoriously 不可靠。', focus: 'notoriously 意为「出了名地（负面）」，学术吐槽常用。', tip: 'notoriously + 形容词，是英式学术口语的高频表达。' },
        { who: 'A', en: 'Agreed, which is why we triangulated with manager assessments.', cn: '同意，所以我们与管理层的评估做了三角验证。', focus: 'triangulated 指「多源交叉验证」，方法论术语。', tip: '主动补充方法论局限，比被问到才答更显专业。' },
        { who: 'A', en: 'To sum up: the effect is real but modest, and it varies by role.', cn: '总结一下：效应确实存在但幅度不大，且因岗位而异。', focus: 'To sum up 是收尾的经典信号词，提示「我要总结了」。', tip: '汇报收尾三要素：结论 + 限度 + 变量。' }
      ]
    },
    {
      id: 'x4-02', lv: 'L4', title: 'Talking to Your Advisor', titleCn: '与导师沟通', minutes: 10,
      goal: '能向导师汇报进展、提出困难、争取明确建议',
      challenge: '用「I\'m torn between A and B」表达两难并请求决断',
      lines: [
        { who: 'A', en: 'Thanks for making time. I want to update you on the project.', cn: '感谢您抽时间。我想向您汇报项目进展。', focus: 'update sb on sth 是汇报的固定搭配。', tip: '开场致谢是必要礼节，即便对方是导师。' },
        { who: 'B', en: 'Of course. Where are you at?', cn: '当然。你进展到哪了？', focus: 'Where are you at? 意为「你到什么程度了」，口语常用。', tip: '比 How is your project going 更随意自然。' },
        { who: 'A', en: 'Data collection is done. Analysis is about sixty percent complete.', cn: '数据收集已完成，分析完成了大约 60%。', focus: 'sixty percent 的重音在 percent，与 sixty 相比 percent 更强。', tip: '给具体百分比，不说「差不多一半」。' },
        { who: 'B', en: 'Slower than you hoped?', cn: '比预期慢吗？', focus: 'hop 是 hope 的过去式，重音只有一个音节。', tip: '这类简短追问是给对方表态的空间。' },
        { who: 'A', en: 'Slower. I\'m torn between delaying the write-up or cutting the sample size.', cn: '是的。我在「推迟写作」和「缩小样本量」之间犹豫。', focus: 'be torn between A and B 意为「左右为难」。', tip: '⚠️ 提两难要给出两个具体选项，让对方容易决策。' },
        { who: 'B', en: 'I\'d cut the sample. A smaller defensible study beats a large unfinished one.', cn: '我会缩小样本。有据可依的小研究胜过没做完的大研究。', focus: 'defensible 意为「站得住脚的」，学术评价用词。', tip: '记住这句：宁小勿散。' },
        { who: 'A', en: 'That makes sense. Could I get your guidance on the methodology section?', cn: '有道理。方法论部分能给我一些建议吗？', focus: 'guidance on 意为「关于…的指导」；methodology 重音在第二音节。', tip: '具体到「哪一部分」，导师才好给具体建议。' },
        { who: 'B', en: 'Send me the draft and mark where you\'re uncertain. I\'ll respond within two days.', cn: '把草稿发我，标出你不确定的地方。我两天内回复。', focus: 'mark where you\'re uncertain 是给出可操作的具体请求。', tip: '提请求时给对方明确的时间承诺，比「尽快」更有说服力。' }
      ]
    },
    {
      id: 'x4-03', lv: 'L4', title: 'Chairing a Meeting', titleCn: '主持会议', minutes: 12,
      goal: '能主持 30 分钟会议、控制节奏、推动决策',
      challenge: '用「Let me park that and move on」收束跑题讨论',
      lines: [
        { who: 'A', en: 'Right, let\'s get started. We have three items on the agenda.', cn: '好，我们开始。议程上有三项议题。', focus: 'agenda 重音在第二音节 /əˈdʒendə/。', tip: '开场三句话：欢迎 + 议程 + 时长预期。' },
        { who: 'B', en: 'Sorry, one thing before we start — did anyone see the updated figures?', cn: '抱歉，开始前问一句——有人看到更新后的数据了吗？', focus: '插话时先说 Sorry，再用 one thing 降低打断感。', tip: '打断礼仪：道歉 + 预告 + 简短。' },
        { who: 'A', en: 'Let\'s park that and come back to it. Item one.', cn: '我们先搁置这个，等会儿回来讨论。第一项。', focus: 'park 意为「搁置」，会议管理高频词。', tip: '⚠️ park 而不是 ignore——会回来处理的才用 park。' },
        { who: 'A', en: 'Marcus, could you take us through the timeline?', cn: 'Marcus，能带我们过一遍时间线吗？', focus: 'take sb through 意为「带某人过一遍」，会议高频。', tip: '指定具体的人，避免「有人能说说吗」导致冷场。' },
        { who: 'C', en: 'Sure. We\'re behind on the testing phase, mainly because of the dependency.', cn: '可以。测试阶段落后了，主要是依赖项的问题。', focus: 'behind on 意为「落后于（进度）」；dependency 重音在第三音节。', tip: '落后要归因，但不 excuses——说明原因 + 给方案。' },
        { who: 'A', en: 'What would it take to get us back on schedule?', cn: '需要什么才能回到进度？', focus: 'get back on schedule 意为「回到原计划进度」。', tip: '把「报告问题」转成「解决问题」，会议效率翻倍。' },
        { who: 'A', en: 'I hear a proposal forming. Let\'s hear it.', cn: '我听到有方案成型了，说来听听。', focus: 'I hear a proposal forming 是很地道的引导话术。', tip: '给发言人明确邀请，避免集体沉默。' },
        { who: 'A', en: 'We\'re at time. Let me summarize the decision and assign the actions.', cn: '到时间了。我总结一下决定并分配任务。', focus: 'assign 动词重音在后；actions 读 /ˈækʃnz/ 不是 /ˈækʃənz/。', tip: '会议必须以「决定 + 责任人 + 时间」三要素收尾。' }
      ]
    },
    {
      id: 'x4-04', lv: 'L4', title: 'Cross-cultural Collaboration', titleCn: '跨文化协作', minutes: 11,
      goal: '能与不同文化背景的同事高效协作、处理低语境沟通',
      challenge: '用「I want to make sure I\'m not misreading you」确认对方真实意图',
      lines: [
        { who: 'A', en: 'I want to make sure I\'m not misreading you. You seemed hesitant.', cn: '我想确认我没误解你。你看起来有些犹豫。', focus: 'I want to make sure… 是英式高频缓冲句，暗示「我要问了」。', tip: '低语境文化中，直觉判断容易错，要显式确认。' },
        { who: 'B', en: 'Honestly, I\'m not sure it\'s the right fit for the team.', cn: '坦白说，我觉得这对团队不太合适。', focus: 'I\'m not sure 委婉否定；fit for 意为「适合」。', tip: '英美式的「我不太确定」在某些文化里就是委婉的拒绝。' },
        { who: 'A', en: 'That\'s useful to know. Is it a capability issue or a priority issue?', cn: '这个信息很有用。是能力问题还是优先级问题？', focus: 'issue 泛指「问题」，比 problem 中性。', tip: '把模糊的否定拆成两个维度，指向可解的方向。' },
        { who: 'B', en: 'Priority. If the team had more capacity, I think it would work.', cn: '优先级问题。如果团队有余力，我觉得可行。', focus: 'capacity 在职场指「人力/承载力」，非「容量」。', tip: 'capacity 是职场高频隐喻，听不懂会理解错。' },
        { who: 'A', en: 'Understood. Would you be open to revisiting it in Q3?', cn: '明白。Q3 之后你愿意重新考虑吗？', focus: 'be open to 意为「愿意接受」；revisit 重新审视。', tip: 'Q3 是「第三季度」，职场时间表达。' },
        { who: 'B', en: 'Possibly. Let\'s revisit once the hiring is done.', cn: '有可能。等招人完成后我们再看看。', focus: 'Possibly 是比 Yes 更保守的承诺，留有空间。', tip: '把 Possibly 理解为「大概率行但需条件」，别当定论。' },
        { who: 'A', en: 'Fair enough. I\'ll flag it in the roadmap for review.', cn: '有道理。我会把它标进路线图待评审。', focus: 'flag 意为「标记」；roadmap 重音在第二音节。', tip: '「flag it for review」是柔和的「我记录下来了」。' },
        { who: 'B', en: 'Appreciated. It\'s not a no, just not a yes yet.', cn: '谢谢。这不是拒绝，只是还不是同意。', focus: 'not a no, just a not yet —— 保留可能性的话术。', tip: '英语里「Yes but」与「not yet」都是常见的软拒绝。' }
      ]
    },
    {
      id: 'x4-05', lv: 'L4', title: 'Handling a Client Complaint', titleCn: '处理客户投诉', minutes: 12,
      goal: '能在客户不满时既共情又推进解决',
      challenge: '用「What would make this right for you?」把主导权交给客户',
      lines: [
        { who: 'A', en: 'I\'m sorry to hear you\'ve had a poor experience. Let me help.', cn: '很抱歉听说您的体验不佳。让我来帮您处理。', focus: 'poor experience 委婉说法，避免直接说 bad。', tip: '先共情（I\'m sorry to hear）再行动（Let me help）。' },
        { who: 'B', en: 'This is the third time I\'ve raised it. Nothing has changed.', cn: '这是我第三次提了。什么都没变。', focus: 'raised it 是「提出问题」的委婉说法。', tip: '客户强调「第三次」，你必须承认历史问题而非辩解。' },
        { who: 'A', en: 'You\'ve been more than patient, and we\'ve let you down. That\'s on us.', cn: '您已经非常耐心了，是我们辜负了您。这是我们的问题。', focus: 'let sb down 意为「让某人失望」，介词是 down。', tip: '主动认责（That\'s on us）是止损最快的动作。' },
        { who: 'B', en: 'I appreciate you not blaming your team. What happens now?', cn: '感谢你没有责怪你的团队。现在怎么办？', focus: '现在如何 读 What happens now。', tip: '客户要的是「下一步」，不是道歉。' },
        { who: 'A', en: 'Here\'s what I can do today: I\'ll flag this to our lead and call you back.', cn: '我今天能做的是：向主管上报并给您回电。', focus: 'flag to 意为「向…上报」；call you back 回电。', tip: '给出具体动作 + 时间承诺，而不是「我们会处理」。' },
        { who: 'B', en: 'By when?', cn: '什么时候之前？', focus: 'By when? 用 by + 时间点，比 when 更有承诺感。', tip: '客户追问时间，要给具体时间点而非「尽快」。' },
        { who: 'A', en: 'By Thursday, I\'ll have a written update with dates and owners.', cn: '周四之前我会给您一份书面更新，含时间点和负责人。', focus: 'written update 书面更新；owners 指责任人。', tip: '书面 + 日期 + 责任人 = 可追责的承诺。' },
        { who: 'B', en: 'That would work. I\'d appreciate a copy either way.', cn: '那可以。无论结果如何我都想要一份副本。', focus: 'either way 意为「无论哪种情况」。', tip: '客户留后手的措辞，说明信任尚未完全恢复。' }
      ]
    },
    {
      id: 'x4-06', lv: 'L4', title: 'Disagreeing with a Colleague', titleCn: '与同事意见相左', minutes: 10,
      goal: '能在不损伤关系的前提下坚持不同立场',
      challenge: '用「I\'m not convinced yet, though I\'m open to being persuaded」表达既不认同也不封闭',
      lines: [
        { who: 'A', en: 'I see where you\'re coming from, but I\'m not convinced yet.', cn: '我理解你的出发点，但我还没被说服。', focus: 'be convinced 意为「被说服」；yet 表示「暂时」。', tip: '「还没被说服」比「我不同意」温和，但立场清晰。' },
        { who: 'B', en: 'What specifically gives you pause?', cn: '具体是哪一点让你犹豫？', focus: 'give sb pause 意为「让某人迟疑」。', tip: '「具体是哪一点」把抽象分歧拆成可讨论的具体项。' },
        { who: 'A', en: 'The timeline assumes we get the data in March. I don\'t think we will.', cn: '这个时间表假设我们三月能拿到数据。我不认为能拿到。', focus: 'assume 假设；I don\'t think 委婉否定。', tip: '指出「假设」而不是「结论错」，是有效的质疑方式。' },
        { who: 'B', en: 'Fair. But if we wait, we lose the whole quarter.', cn: '有道理。但如果我们等，整个季度就没了。', focus: 'lose the quarter 指「失去这个季度的产出」。', tip: '承认对方的点，同时坚持你的风险判断。' },
        { who: 'A', en: 'We could start with partial data and update as results come in.', cn: '我们可以先用部分数据开工，结果出来再更新。', focus: 'partial 部分的；come in 表「到来」。', tip: '提折中方案，而非站队。' },
        { who: 'B', en: 'That might work, though the analysis is weaker that way.', cn: '这可能行，虽然那样分析会更弱。', focus: 'might 表可能；weaker 较弱的。', tip: '「That might work」是英语里的「有条件同意」。' },
        { who: 'A', en: 'Weaker but honest. I\'d rather flag the limitation than publish something fragile.', cn: '弱但诚实。我宁愿标注局限，也不发布脆弱的东西。', focus: 'flag the limitation 标注局限；fragile 脆弱的。', tip: '学术诚实是硬道理，但用「I\'d rather…」表达立场。' },
        { who: 'B', en: 'I can live with that. Let\'s document the assumption so nobody is surprised.', cn: '我可以接受。把假设记录下来，免得有人意外。', focus: 'I can live with it 意为「我能接受」；surprised 意外的。', tip: '「记下假设」是化解分歧后最专业的收尾。' }
      ]
    }
  ];

  global.SceneL4 = { SCENES: SCENES };
})(window);