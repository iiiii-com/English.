/* ============================================================
   content-reading.js —— 英语阅读分级短文 + 理解题
   难度体系与词汇模块完全一致：
     L1 入门：句子极短，95% 词在 L1 词表内，80-120 词
     L2 基础：简单复合句，85% 词在 L1-L2，160-220 词
     L3 进阶：抽象议论/职场话题，90% 在 L1-L3，260-340 词
     L4 精通：论证性/书面语，长难句，350-450 词
   题目类型：细节题 / 推理题 / 主旨题 / 词义题 / 态度题
   ============================================================ */
(function (global) {
  'use strict';

  var ARTICLES = [
    /* ============================ L1 ============================ */
    {
      id: 'r-l1-01', lv: 'L1', title: 'My Morning Routine', titleCn: '我的早晨', level: '入门',
      words: 146, minutes: 7.6, topic: '日常生活',
      keyWords: ['routine', 'wake', 'breakfast', 'usually'],
      text: `My name is Lin. I am thirty years old. I work in a small office in the city.

I get up at seven every morning. First, I drink a glass of water. Then I wash my face and brush my teeth. I do not eat much for breakfast. I usually eat bread and an egg, and drink some milk.

I go to work by subway. The subway is fast, but it is very crowded at eight o'clock. My office is near the station, so I walk for five minutes.

I work from nine to six. In the afternoon, I sometimes go to a small park near my office. I sit on a bench and read a book. After work, I go home and cook dinner.

I am busy every day, but I am happy. English is hard for me, but I learn a little every day.`,
      questions: [
        { type: '细节', q: 'What does Lin do first in the morning?', options: ['Drink a glass of water', 'Eat breakfast', 'Take the subway'], answer: 0, why: '原文第一句动作是 "First, I drink a glass of water."' },
        { type: '细节', q: 'How does Lin go to work?', options: ['By bus', 'By subway', 'By car'], answer: 1, why: '"I go to work by subway."' },
        { type: '细节', q: 'What does Lin do after work?', options: ['Go to a park', 'Cook dinner', 'Read a book at the office'], answer: 1, why: '"After work, I go home and cook dinner." 注意公园是下午去的，不是下班后。' },
        { type: '词义', q: 'The word "crowded" in paragraph 2 probably means:', options: ['很贵', '很挤', '很慢'], answer: 1, why: '上下文 "The subway is fast, but it is very crowded" —— 快速但人多，即"拥挤"。' },
        { type: '主旨', q: 'What is the main idea of this passage?', options: ['城市交通很方便', '作者一天的日常生活', '作者的英语学习经历'], answer: 1, why: '全文按时间顺序描述一天的完整生活，核心是"日常生活"。' }
      ]
    },
    {
      id: 'r-l1-02', lv: 'L1', title: 'A Simple Shopping Trip', titleCn: '一次简单的购物', level: '入门',
      words: 162, minutes: 7.8, topic: '购物',
      keyWords: ['shop', 'price', 'buy', 'cheap'],
      text: `Yesterday afternoon, my friend and I went to a supermarket near my home.

It was Saturday afternoon, so the shop was very full. People stood in long lines to pay. We wanted to buy some apples, milk and bread.

The price of apples was five yuan for one kilo. That was not expensive. My friend bought a big bottle of orange juice. It cost eighteen yuan. I bought bread and a small box of eggs. The eggs were nine yuan.

Then we walked to a small shop near the bus stop. This shop sells clothes. I did not buy anything, but I looked at a blue jacket for a long time. It was one hundred and thirty yuan. That was too expensive for me.

On the bus home, we were both tired but happy. We spent about sixty yuan together.

Learning English is not hard if you use it every day. Today I can tell you about my shopping trip in English.`,
      questions: [
        { type: '细节', q: 'Why was the supermarket very full?', options: ['It was a holiday', 'It was Saturday afternoon', 'The price was low'], answer: 1, why: '"It was Saturday afternoon, so the shop was very full."' },
        { type: '细节', q: 'How much did the orange juice cost?', options: ['9 yuan', '18 yuan', '60 yuan'], answer: 1, why: '"It cost eighteen yuan."' },
        { type: '细节', q: 'Why didn\'t the writer buy the jacket?', options: ['It was too small', 'It was too expensive', 'It was a bad color'], answer: 1, why: '"It was one hundred and thirty yuan. That was too expensive for me."' },
        { type: '推理', q: 'How much did the writer spend on bread and eggs?', options: ['About 9 yuan', 'About 18 yuan', 'We don\'t know from the text'], answer: 2, why: '文中只说面包加一盒鸡蛋 9 元，但没有分别给单价，无法拆分，所以属于"文中未提及"。这是训练"不臆测"的阅读习惯。' },
        { type: '主旨', q: 'What does the last paragraph mainly tell us?', options: ['The total price of all things', 'English is useful in daily life', 'The bus was late'], answer: 1, why: '结尾用购物经历举例，说明"每天用英语并不难"，是全文的落脚点。' }
      ]
    },
    {
      id: 'r-l1-03', lv: 'L1', title: 'My Family', titleCn: '我的家庭', level: '入门',
      words: 138, minutes: 7.5, topic: '家庭',
      keyWords: ['family', 'father', 'mother', 'brother'],
      text: `I live with my parents and my younger brother. My father is a teacher. He works at a middle school. He teaches Chinese and history.

My mother is a nurse. She works in a hospital. Her work is hard, because she is often busy at night. She also works on Sunday.

My brother is only seven years old. He is short and thin. He likes football. He plays football every weekend with his friends.

I am the oldest in my family. I do not live with my family now, because I work in another city. I go home every two months.

On Sunday evening, we often have dinner together. My mother cooks fish. My father talks about his day. My brother runs around the table. It is noisy, but it is warm.

I love my family very much.`,
      questions: [
        { type: '细节', q: 'What does the father teach?', options: ['Math and science', 'Chinese and history', 'English'], answer: 1, why: '"He teaches Chinese and history."' },
        { type: '细节', q: 'How old is the brother?', options: ['5 years old', '7 years old', '9 years old'], answer: 1, why: '"My brother is only seven years old."' },
        { type: '细节', q: 'Why doesn\'t the writer live with the family?', options: ['He studies in another city', 'He works in another city', 'The family is too small'], answer: 1, why: '"because I work in another city." 注意不是 study。' },
        { type: '词义', q: 'The word "noisy" in the last part probably means:', options: ['安静的', '吵闹的', '温暖的'], answer: 1, why: '前面说弟弟"绕着桌子跑"，孩子跑来跑去 + 随后 "but it is warm"，所以是"吵闹但温暖"。' },
        { type: '推理', q: 'What can we learn about the mother?', options: ['She works only at night', 'She sometimes works on Sunday', 'She does not like her job'], answer: 1, why: '"She also works on Sunday." 也/还 说明是在已有工作之外的额外一天。' }
      ]
    },

    /* ============================ L2 ============================ */
    {
      id: 'r-l2-01', lv: 'L2', title: 'Why I Started Running', titleCn: '我为什么开始跑步', level: '基础',
      words: 251, minutes: 9.5, topic: '健康',
      keyWords: ['exercise', 'stress', 'habit', 'progress', 'consistent'],
      text: `Two years ago, I could not run for one minute without stopping. Today, I can run five kilometers without a break. Nothing changed except my habits.

At that time, I worked long hours in a small company. Every evening, I came home feeling empty. I ate dinner, watched television, and went to bed. I was not unhappy, but something was missing. I could not sleep well, and I often felt tired in the morning.

A friend told me: "You don't need a gym. You just need twenty minutes and a pair of shoes." So I started small. First week, I ran only one kilometer, three times. It felt stupid, but I finished.

In the second month, I added ten minutes each week. Sometimes I did not want to go out, especially in winter. But once I put on my shoes and started running, the feeling changed. The bad mood disappeared after five minutes.

The biggest change was not physical. Running taught me that progress is boring. Most days look the same. You run, you finish, you go home. But if you stop for two weeks, you lose much more than two weeks of fitness. You lose the habit itself.

Now running is part of my life. I run three times a week, about thirty minutes each time. My sleep is better, my mood is more stable, and I have more energy for work.

If you want to change something, do not start big. Start so small that you cannot say no.`,
      questions: [
        { type: '细节', q: 'What problem did the writer have before running?', options: ['He had no friends', 'He slept badly and felt tired', 'He did not like television'], answer: 1, why: '"I could not sleep well, and I often felt tired in the morning."' },
        { type: '细节', q: 'How much did the writer run in the first week?', options: ['One kilometer, three times', 'Two kilometers every day', 'Thirty minutes each time'], answer: 0, why: '"First week, I ran only one kilometer, three times."' },
        { type: '推理', q: 'Why does the writer say the feeling changed after putting on the shoes?', options: ['Because running is fun', 'Because the body starts moving before the mind gives up', 'Because his friend called him'], answer: 1, why: '"Once I put on my shoes and started running, the feeling changed. The bad mood disappeared after five minutes." —— 身体先动，情绪随后改变，这是在解释启动机制。' },
        { type: '主旨', q: 'What is the writer\'s main point?', options: ['Running is the best sport', 'Small consistent actions beat large ambitious plans', 'Gym membership is expensive'], answer: 1, why: '最后一句是论点："Start so small that you cannot say no." 全文都在用跑步经历证明这一点。' },
        { type: '词义', q: 'The word "empty" in paragraph 2 is closest in meaning to:', options: ['angry', 'without meaning or energy', 'busy'], answer: 1, why: '"I came home feeling empty" 后文 "something was missing"，说明是空虚而非忙碌或愤怒。' },
        { type: '态度', q: 'What is the writer\'s attitude toward starting small?', options: ['Doubtful', 'Strongly supportive', 'Indifferent'], answer: 1, why: '作者用自身经历 + "do not start big" 来明确主张，态度是支持。' }
      ]
    },
    {
      id: 'r-l2-02', lv: 'L2', title: 'The Coffee Shop on the Corner', titleCn: '拐角的那家咖啡店', level: '基础',
      words: 274, minutes: 9.7, topic: '城市生活',
      keyWords: ['regular', 'neighborhood', 'conversation', 'stranger'],
      text: `There is a small coffee shop near my office. It is not popular on the internet, and it has no big sign outside. Most people walk past it without looking.

I have been going there for about six months. I am not a regular customer with a name tag, but the woman behind the counter always says hello when I come in. On Tuesdays, she gives me a small cake for free. I have never asked why.

At first, I went there only because it was quiet. But over time, I noticed something unusual: almost nobody uses a phone inside. People sit, drink slowly, and talk.

One afternoon, I heard a conversation between two strangers. The old man on the left was telling the young man on the right about his work. Twenty minutes later, they were laughing about something. Nobody asked them to talk. The shop simply allowed it.

This made me think about public space. In a big city, most places want you to buy something as quickly as possible: a coffee shop with free Wi-Fi, where you sit for two hours with a small cup. A train station where you cannot stay. A park with no place to sit down.

This small shop does the opposite. It does not sell time, and it does not sell attention. It only sells coffee, which is cheap, and leaves the rest alone.

I still do not know the woman's name. But when I am tired and do not want to talk to anyone, I go there, order one cup, and sit for forty minutes. Sometimes I read. Sometimes I do nothing. Both feel good.`,
      questions: [
        { type: '细节', q: 'Why doesn\'t the coffee shop have a big sign?', options: ['It is too small', 'The text does not say', 'People know it well'], answer: 1, why: '原文只说 "it has no big sign outside"，并未解释原因。这是一个"文中未提及"的选项。' },
        { type: '细节', q: 'What does the woman do on Tuesdays?', options: ['Gives the writer a free cake', 'Closes the shop early', 'Serves better coffee'], answer: 0, why: '"On Tuesdays, she gives me a small cake for free."' },
        { type: '推理', q: 'Why did the writer first go to the shop?', options: ['It was cheap', 'It was quiet', 'A friend recommended it'], answer: 1, why: '"At first, I went there only because it was quiet." 注意 first 与 later 的对比。' },
        { type: '主旨', q: 'What does the writer mainly want to say?', options: ['Coffee is expensive in cities', 'Small public spaces can create real human connection', 'Wi-Fi is not useful'], answer: 1, why: '结尾用 "This small shop does the opposite" 与城市商业空间对比，落点是"真实的人际连接"。' },
        { type: '词义', q: '"A regular customer with a name tag" means the writer:', options: ['Is a famous customer', 'Is not an officially recognized regular', 'Visits twice a month'], answer: 1, why: '作者先否定 "regular customer"，又补充没有 name tag，实际意思是"算常客但没有那种被记住的感觉"。' },
        { type: '推理', q: 'What does "It does not sell time" most probably mean?', options: ['The shop closes early', 'Customers are not pushed to leave or to consume more', 'The shop has no clock'], answer: 1, why: '前文批评的是"希望你尽快消费"的空间，所以这里指不催促消费与停留时长。' }
      ]
    },
    {
      id: 'r-l2-03', lv: 'L2', title: 'Learning English After 30', titleCn: '30 岁之后学英语', level: '基础',
      words: 251, minutes: 9.5, topic: '学习',
      keyWords: ['adult', 'grammar', 'mistake', 'patience'],
      text: `Many adults believe they are too old to learn a language. This belief is popular, but the evidence is weak.

Children have some real advantages. Their brains form new connections faster, and they rarely worry about making mistakes. That does not mean adults cannot learn. It means adults need a different method.

The first difference is input. Children hear simple sentences again and again, and every sentence fits a clear situation. Adults often try to read difficult texts, then feel tired and blame themselves. The fix is not harder material; it is easier material read more often.

The second difference is error. A child says "he go" and nobody laughs. An adult says "he go" and immediately stops speaking, because speaking badly feels like losing face. But avoiding error is not the goal. Delayed and corrected errors grow faster than errors avoided by silence.

The third difference is time. Children are forced to learn; adults choose to learn. Therefore adults must design the environment, because will power alone is weak. A fixed time, a small daily target, and a visible record work better than motivation.

So is it too late? No. It is different. Adults often learn faster than children in some areas, especially when the goal is clear. Many people in their forties use English at work for the first time, and they learn in a few years what children get in a longer time.

The real question is not your age. It is whether your method matches your age.`,
      questions: [
        { type: '主旨', q: 'What is the main argument of the passage?', options: ['Adults can never speak English well', 'Adults need methods that match how adults learn', 'Children should study grammar first'], answer: 1, why: '全文对比儿童与成人的差异，结论句 "whether your method matches your age" 直接点题。' },
        { type: '细节', q: 'What do children do when they make mistakes?', options: ['Stop speaking immediately', 'Rarely worry about them', 'Study grammar for hours'], answer: 1, why: '"they rarely worry about making mistakes."' },
        { type: '推理', q: 'Why does the writer suggest adults read easier material?', options: ['Easy texts are more interesting', 'Repeated simple sentences match how adults can sustain study', 'Difficult texts are bad for everyone'], answer: 1, why: '原文对比儿童"简单句反复 + 情境清晰"，建议成人"不是更难，而是更简单且重复更多"。' },
        { type: '词义', q: '"will power alone is weak" means:', options: ['Tired people cannot use their phone', 'Motivation by itself is not reliable enough', 'People should study while tired'], answer: 1, why: '下一句给的三个替代方案（固定时间、小目标、可视记录）说明单靠意志不可靠。' },
        { type: '细节', q: 'What is the writer\'s answer to "Is it too late?"', options: ['Yes, definitely', 'No, but the method must fit adults', 'Only if you are under 40'], answer: 1, why: '"No. It is different." 且强调成人方法要匹配年龄。' },
        { type: '推理', q: 'Why does the writer mention people in their forties?', options: ['To show adults can reach practical goals', 'To argue against working in English', 'To say children learn too fast'], answer: 0, why: '"Many people in their forties use English at work... and they learn in a few years" 是反例，用来反驳"太晚了"。' }
      ]
    },

    /* ============================ L3 ============================ */
    {
      id: 'r-l3-01', lv: 'L3', title: 'The Hidden Cost of Constant Connectivity', titleCn: '持续连接的隐性成本', level: '进阶',
      words: 353, minutes: 11.1, topic: '科技社会',
      keyWords: ['productivity', 'sustained', 'discipline', 'signal', 'justify'],
      text: `The last twenty years have seen a strange consensus form around productivity. Tools that once saved time now arrive bundled with the expectation of constant availability. It is not unreasonable to ask whether the trade was worth it.

Consider what a message actually costs. Sending one takes seconds, but the response is not free. Even when we are not physically interrupted, the mind treats an incoming notification as a small threat: it checks, evaluates, and files. Cognitive scientists call this attention residue, and while the effect of a single interruption is small, the accumulation across a day changes the quality of thought available for the rest of it.

The more serious issue is that this pattern cannot be switched off by intention. Companies that have tried to ban devices during meetings often discover that employees shift the same behavior to chat, or to a phone held below the desk. This is not a moral failure. A system that has been reinforced for years does not disappear because a policy document says so.

There is also an asymmetry that businesses prefer to leave unmentioned. A worker who is reachable at eleven at night saves the employer nothing measurable, because few decisions can be validly made that late. But the expectation itself acts as a guarantee: the employee who does not reply will be judged by someone who could have replied. Loyalty is thus rewarded with a cost that has no measurable return.

None of this suggests that constant availability is pointless. Emergency medicine, trading, and infrastructure maintenance all require rapid response. The problem is not the value of availability; it is the way availability has been generalized into a default state across occupations where it adds nothing.

A healthier arrangement would distinguish between being reachable and being watched. The first is a tool. The second is a condition, and conditions are expensive because they cannot be partially switched off.

What would it take? Perhaps not a revolution, but a norm: nobody expects a reply at eleven at night, and nobody loses face for saying so. Norms are cheaper than laws, and they travel faster.`,
      questions: [
        { type: '词义', q: '"Attention residue" refers to:', options: ['The time spent on each notification', 'The reduced attention quality left after being interrupted', 'A type of software error'], answer: 1, why: '上下文 "the accumulation across a day changes the quality of thought" 表明它指被打断后残留的注意力损耗。' },
        { type: '推理', q: 'Why do companies that ban devices during meetings often fail?', options: ['Employees ignore all rules', 'The underlying habit redirects to another channel', 'Bans are too short'], answer: 1, why: '"the same behavior" 转移到 chat 或桌下手机 —— 不是动机问题而是习惯路径问题。' },
        { type: '推理', q: 'What does the "asymmetry" paragraph mainly argue?', options: ['Night work is physically dangerous', 'Availability is rewarded even when it produces no measurable value', 'Employees prefer late replies'], answer: 1, why: '"Loyalty is thus rewarded with a cost that has no measurable return." 这是全段结论。' },
        { type: '主旨', q: 'What does the author ultimately recommend?', options: ['Banning all technology in workplaces', 'Distinguishing reachability from constant observation', 'Increasing pay for night shifts'], answer: 1, why: '"A healthier arrangement would distinguish between being reachable and being watched."' },
        { type: '细节', q: 'Which occupations does the author consider valid for constant availability?', options: ['Teaching and writing', 'Emergency medicine, trading, infrastructure', 'Software and design'], answer: 1, why: '这三类被明确列举为"需要快速响应"的正当领域。' },
        { type: '态度', q: 'The tone of the final paragraph is best described as:', options: ['Radical', 'Pragmatic and moderate', 'Sarcastic'], answer: 1, why: '"not a revolution, but a norm" "Norms are cheaper than laws" —— 温和、建设性。' },
        { type: '推理', q: 'Why does the author say "norms are cheaper than laws"?', options: ['Norms are legally binding', 'Social expectations can spread without enforcement', 'Laws are ineffective everywhere'], answer: 1, why: '对比暗示规范靠自愿遵守传播更快、成本更低，不需要强制执行。' }
      ]
    },
    {
      id: 'r-l3-02', lv: 'L3', title: 'Why Good Feedback Is Rare', titleCn: '为什么好的反馈如此稀缺', level: '进阶',
      words: 309, minutes: 10.8, topic: '职场',
      keyWords: ['criteria', 'specific', 'timely', 'defensive', 'accountability'],
      text: `Most managers who claim to give regular feedback are describing an event rather than a process. An event has a date, a duration, and an ending. Feedback that actually changes behavior has none of these.

The first reason is timing. Useful feedback must arrive while the work is still alive in the performer's mind, which usually means within days rather than weeks. By the time a quarterly review happens, the person has repeated the behavior dozens of times and no longer connects it to a single moment. What they hear is an assessment of themselves rather than a note about a decision.

The second reason is the absence of criteria. Most evaluators operate on intuition: they know when something feels wrong but cannot name what right would look like. Without that articulation, feedback becomes an opinion, and opinions in a professional context carry little weight. A reviewer who says the report is not persuasive has done very little; one who says the second paragraph states two claims that the data cannot support has done almost everything.

The third reason is social. Specific criticism reliably produces defensiveness, because the listener hears a judgment about identity rather than about a product. This response is not irrational. Years of schooling train people to protect a sense of self, and a workplace critique can feel like an extension of that training. The solution is not to avoid specificity; it is to separate the evaluation from the person explicitly, and to model the same standard on one's own work.

None of this makes feedback easy, but it does make it tractable. It requires three habits: observe closely enough to have evidence, articulate the standard before the conversation, and deliver the observation while it still has consequences. Managers who do the third step rarely are praised for it, which is why so few do it.`,
      questions: [
        { type: '词义', q: 'The author\'s phrase "an event rather than a process" implies that most claimed feedback is:', options: ['Too infrequent and poorly targeted', 'Too emotionally intense', 'Too short to be useful'], answer: 0, why: '后文用"及时性、缺乏标准、社交防御"三条解释为什么事件化的反馈无效。' },
        { type: '推理', q: 'Why does late feedback feel like "an assessment of themselves"?', options: ['Managers usually criticize personality', 'The specific moment is no longer associated with the behavior', 'It takes too long to write'], answer: 1, why: '"the person has repeated the behavior dozens of times and no longer connects it to a single moment."' },
        { type: '细节', q: 'What makes an opinion "carry little weight" in a professional context?', options: ['It is too long', 'It cannot be checked against a named standard', 'It comes from a manager'], answer: 1, why: '"Without that articulation, feedback becomes an opinion."' },
        { type: '推理', q: 'Why is defensiveness described as "not irrational"?', options: ['It is always justified', 'People are trained to protect their sense of self', 'Managers are usually wrong'], answer: 1, why: '"Years of schooling train people to protect a sense of self."' },
        { type: '主旨', q: 'What three habits does the author recommend?', options: ['Hiring, training, and promoting', 'Close observation, articulated standards, timely delivery', 'Budgeting, planning, and reporting'], answer: 1, why: '末段明确列出三项，全部来自前文三条原因的对策。' },
        { type: '细节', q: 'Why do few managers deliver timely critical feedback?', options: ['They are too busy', 'They are rarely praised for it', 'They lack technical knowledge'], answer: 1, why: '"Managers who do the third step rarely are praised for it, which is why so few do it."' },
        { type: '推理', q: 'What does the author suggest about the framing of criticism?', options: ['Avoid specific comments', 'Separate the evaluation of work from judgment of the person', 'Let peers handle it instead'], answer: 1, why: '"The solution is not to avoid specificity; it is to separate the evaluation from the person explicitly."' }
      ]
    },

    /* ============================ L4 ============================ */
    {
      id: 'r-l4-01', lv: 'L4', title: 'On Losing the Ability to Be Bored', titleCn: '论失去忍受无聊的能力', level: '精通',
      words: 459, minutes: 12.7, topic: '认知',
      keyWords: ['threshold', 'default', 'somatic', 'substitute', 'attainment'],
      text: `There is a particular quality of silence that younger readers of this essay may never have encountered: the productive, faintly uncomfortable quiet of a mind with nothing to do. It is not pleasant at first. Boredom announces itself as an itch, and most of us treat the itch as an emergency.

That reflex has a short history. For most of human history, and for the first several decades of industrial modernity, the default state of an unoccupied adult was simply available: to think, to walk, to notice. A threshold for escape had to be crossed deliberately, by standing up and leaving. Only in the past two decades has that threshold collapsed, so that distraction requires no action while presence requires enormous effort.

The consequences are easy to underestimate because they present as small annoyances rather than as losses. A generation that never sits still learns, by the mechanism all learning works, that a feeling of restlessness means the correct response is to change the state rather than to examine it. The intellectual habit that suffers is not imagination in the romantic sense; it is tolerance. Every sustained intellectual effort — a difficult book, an unfamiliar argument, a problem that refuses a quick answer — proceeds through a stretch of boredom that most people now experience as a signal to stop. Those who never endure that stretch never reach what lies beyond it, not because they lack capacity but because they exit too early to discover whether they have any.

It is worth being precise about the claim, because a weaker version of it has become fashionable and is not defensible. Nobody needs to discard convenience; the argument is not nostalgia. Nor is the recommendation ascetic. The issue is substitution rather than addition: what is lost is not the smartphone but the default mode of attention in which a person meets a problem before deciding how to feel about it.

The practical implication is almost embarrassingly modest. When a task has stalled, the instinct to reach for something else is a signal about discomfort, not information about strategy. A ten-minute walk with no input does more for a stuck problem than ten minutes of searching for advice, because the walk permits the mind to do what it was built to do and has not been asked to do in years: continue quietly. The restlessness that follows is not the enemy. It is the sensation of a threshold being crossed, and it is uncomfortable precisely because something is beginning.

The ability to be bored is not a temperament; it is an attainment, and attainments decay when unused. It can be rebuilt, but only by declining the reflex at the moment it appears — which is the only moment at which it can be rebuilt.`,
      questions: [
        { type: '词义', q: 'In the fourth paragraph, the author explicitly rejects which interpretation of their argument?', options: ['That convenience should be eliminated entirely', 'That intellectual capacity is fixed and unchangeable', 'That boredom is a medical condition'], answer: 0, why: '"Nobody needs to discard convenience; the argument is not nostalgia." 明确排除了这一读法。' },
        { type: '推理', q: 'What does the author mean by "substitution rather than addition"?', options: ['The loss is the replacement of a default mode of attention, not the mere presence of a device', 'People should add more leisure activities', 'Boredom and technology add up to equal harm'], answer: 0, why: '原文 "what is lost is not the smartphone but the default mode of attention" 正是对这句话的展开。' },
        { type: '推理', q: 'Why does the author say people "exit too early to discover whether they have any" capacity?', options: ['The tasks are genuinely impossible', 'Abandoning at first discomfort means they never test their limits', 'Nobody explains the difficulty'], answer: 1, why: '"not because they lack capacity but because they exit too early to discover whether they have any."' },
        { type: '词义', q: '"attainments decay when unused" suggests that the capacity to tolerate boredom is:', options: ['A permanent personality trait', 'Something trained that weakens without practice', 'Unrelated to physical activity'], answer: 1, why: '与前文 "temperament" 对比：不是气质，而是后天获得的能力，用进废退。' },
        { type: '细节', q: 'According to the passage, what is the useful response to a stalled task?', options: ['Searching online for solutions', 'Taking a ten-minute walk with no input', 'Waiting until the feeling disappears'], answer: 1, why: '"A ten-minute walk with no input does more for a stuck problem than ten minutes of searching for advice."' },
        { type: '主旨', q: 'What is the function of the final sentence ("only by declining the reflex at the moment it appears")?', options: ['It introduces a new topic about technology brands', 'It resolves the apparent paradox that a decaying ability can be rebuilt', 'It calls for government regulation'], answer: 1, why: '前文说能力会衰减，最后说仍可重建——必须在冲动出现的当下拒绝，两句构成转折闭环。' },
        { type: '态度', q: 'The author\'s tone is best described as:', options: ['Moralistic and condemning', 'Analytical with occasional warmth', 'Indifferent'], answer: 1, why: '作者在做机制分析而非道德批判（"not a temperament; it is an attainment"），语气克制但结尾带有温和的鼓励。' },
        { type: '推理', q: 'What does "it is uncomfortable precisely because something is beginning" imply?', options: ['Boredom signals impending failure', 'Discomfort during difficult work indicates forward movement rather than a reason to stop', 'Learning is inherently unpleasant'], answer: 1, why: '这是把不适感重新解释为"阈值正在被跨越"的证据，直接反驳"不适 = 该停下"的默认等式。' }
      ]
    },
    {
      id: 'r-l4-02', lv: 'L4', title: 'The Illusion of Understanding', titleCn: '理解的幻觉', level: '精通',
      words: 456, minutes: 13.8, topic: '认知/学习',
      keyWords: ['fluency', 'retention', 'generative', 'threshold', 'deception'],
      text: `Reading is a skill that punishes its own practitioners. The better you read, the more certain you become that you understood, and the less your confidence is worth. A reader can follow the grammar of a difficult text, hold its argument in view, and arrive at the end with a warm, confident sense of having absorbed something substantial. That sense is the most reliable thing about reading and the least reliable evidence of understanding.

The reason is that fluency and comprehension are produced by separate systems. Fluency comes from prediction: the reader's model of the language continuously generates what is likely to come next, and because language is predictable enough to model, this works so well that it feels like comprehension. Comprehension, by contrast, requires that the prediction be checked against meaning. This checking is effortful, and unlike prediction it produces no pleasant signal when it succeeds. The result is a systematic asymmetry: the mind generates the sensation of understanding far more easily than it generates understanding itself, and the sensation is then accepted as evidence.

This explains an observation that teachers have long found puzzling. A passage can be summarized accurately by a student who cannot answer a single question about the argument it was meant to establish. Summarizing is another generative act — it produces fluent text — and so it inherits the same weakness. What fails is not language but checking, and checking cannot be trained by doing more of the thing that is failing.

The practical implication concerns what to do after reading. The almost universal instinct is to move on. Having finished, the reader experiences closure, and closure is mistaken for attainment. But the interval between reading and understanding is where almost all of the loss occurs, because the reading itself establishes nothing: it creates a temporary state in which the material is available, and this state decays on a schedule that has nothing to do with interest.

Two practices survive contact with this analysis. The first is immediate retrieval: before consulting notes, state what the text argued and how it got there. The second is delayed retest: return after an interval and again attempt the reconstruction, accepting that a failure at this stage is information rather than a verdict. Both are uncomfortable, and both work, and the discomfort is the reason they are so often skipped in favor of rereading, which feels productive and produces nothing.

None of this is an argument against reading for pleasure. Fiction in particular often resists the checking operation entirely, and may be better for it. But pleasure and comprehension are different achievements, and confusing the sensation of one with the evidence of the other is the most reliable way to be wrong about what you know.`,
      questions: [
        { type: '词义', q: 'In paragraph 2, "This checking is effortful" primarily explains:', options: ['Reading is physically tiring', 'The mechanism verifying prediction against meaning does not reward itself', 'Comprehension requires memorization'], answer: 1, why: '后半句 "unlike prediction it produces no pleasant signal when it succeeds" 是对 effortful 的直接解释。' },
        { type: '推理', q: 'Why does the author call summarizing a "generative act"?', options: ['Because summaries are usually too long', 'Because it produces fluent output and inherits the same verification weakness', 'Because summaries are written by machines'], answer: 1, why: '"Summarizing is another generative act — it produces fluent text — and so it inherits the same weakness."' },
        { type: '推理', q: 'What does the author mean by "checking cannot be trained by doing more of the thing that is failing"?', options: ['Rereading is useless for language skills', 'Practicing fluent generation does not train the verification process', 'Only experts can check comprehension'], answer: 1, why: '"what fails is not language but checking"，故练习流畅度无法训练核查能力。' },
        { type: '细节', q: 'The passage recommends which two practices?', options: ['Highlighting and summarizing', 'Immediate retrieval and delayed retest', 'Reading aloud and note-taking'], answer: 1, why: '"Two practices survive contact with this analysis: immediate retrieval... delayed retest."' },
        { type: '推理', q: 'What does the author say about rereading?', options: ['It is the most reliable method', 'It feels productive but produces nothing for comprehension', 'It works only for fiction'], answer: 1, why: '"rereading, which feels productive and produces nothing."' },
        { type: '主旨', q: 'Why does the author raise fiction in the last paragraph?', options: ['To recommend a genre for learners', 'To acknowledge an exception so the main claim is not overgeneralized', 'To argue that fiction is harder to summarize'], answer: 1, why: '"Fiction in particular often resists the checking operation entirely, and may be better for it. But pleasure and comprehension are different achievements" —— 主动让论断更精确，而不是绝对化。' },
        { type: '推理', q: 'What does the author view as "the most reliable way to be wrong about what you know"?', options: ['Skipping difficult texts', 'Mistaking the sensation of pleasure or fluency for evidence of understanding', 'Relying on summaries rather than originals'], answer: 1, why: '末句 "confusing the sensation of one with the evidence of the other" 即此意。' },
        { type: '词义', q: '"closure" in paragraph 4 most likely refers to:', options: ['A legal closure', 'The subjective feeling that a task is finished', 'A decline in memory'], answer: 1, why: '"Having finished, the reader experiences closure, and closure is mistaken for attainment."' },
        { type: '态度', q: 'The author\'s view of the "sensation of understanding" is:', options: ['Reliable evidence that can be trusted', 'Necessary but systematically misleading', 'Entirely psychological and therefore irrelevant'], answer: 1, why: '开篇即 "the least reliable evidence of understanding"，第二段说明其系统性偏差，必要但不可靠。' }
      ]
    }
  ];

  /* 词汇量 → 阅读理解力对照模型（用于可视化预测） */
  var READING_POWER = [
    { vocab: 300, speed: 70, comprehension: 45, note: '能读懂简单说明文' },
    { vocab: 600, speed: 95, comprehension: 58, note: '能读日常邮件与短新闻' },
    { vocab: 1000, speed: 120, comprehension: 68, note: '能读一般杂志文章' },
    { vocab: 1500, speed: 145, comprehension: 76, note: '能读英文小说简节' },
    { vocab: 2500, speed: 170, comprehension: 83, note: '能读原版专业书籍' },
    { vocab: 4000, speed: 195, comprehension: 88, note: '接近母语者阅读速度' }
  ];

  function byLevel(lv) { return ARTICLES.filter(function (a) { return !lv || lv === 'ALL' || a.lv === lv; }); }

  /* 合并第二批扩充短文（content-reading2.js），按 id 去重 */
  function merged() {
    var extra = (global.ReadingContent2 && global.ReadingContent2.ARTICLES) || [];
    var seen = {};
    ARTICLES.forEach(function (a) { seen[a.id] = 1; });
    return ARTICLES.concat(extra.filter(function (a) { return !seen[a.id]; }));
  }

  function byLevelMerged(lv) { return merged().filter(function (a) { return !lv || lv === 'ALL' || a.lv === lv; }); }

  /* 词汇覆盖率检测：文中生词占比估算（用于 L1 严格控词） */
  function coverage(text, levelPool) {
    var known = {};
    (levelPool || []).forEach(function (w) { known[w.w.toLowerCase()] = 1; });
    var tokens = text.toLowerCase().match(/[a-z][a-z'-]*/g) || [];
    var total = tokens.length, hit = 0;
    tokens.forEach(function (t) { if (known[t]) hit++; });
    return total ? hit / total : 0;
  }

  global.ReadingContent = {
    ARTICLES: ARTICLES,
    byLevel: byLevelMerged,      // 视图使用合并后的全集
    byLevelOwn: byLevel,          // 仅本文件内容
    merged: merged,
    READING_POWER: READING_POWER,
    coverage: coverage
  };
})(window);