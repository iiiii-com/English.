/* ============================================================
   content-reading2.js —— 分级阅读短文（第二批·日常主题扩充）
   与 content-reading.js 同构，同一难度体系：
     L1 入门：80-110 词，极简单句
     L2 基础：190-230 词，简单复合句
     L3 进阶：290-330 词，抽象议论
     L4 精通：380-430 词，长难句与论证
   本批主题全部取自真实日常生活动线：
     租房搬家 / 菜市场 / 通勤 / 外卖与厨房 / 健身房 / 图书馆
     快递与网购 / 社区邻里 / 手机与注意力 / 城市噪声 / 衣物与消费 / 老年与数字鸿沟
   ============================================================ */
(function (global) {
  'use strict';

  var ARTICLES = [
    /* ============================ L1 ============================ */
    {
      id: 'r2-l1-01', lv: 'L1', title: 'My New Apartment', titleCn: '我的新公寓', level: '入门',
      words: 163, minutes: 9, topic: '租房',
      keyWords: ['apartment', 'rent', 'furniture', 'move'],
      text: `Last month, I moved to a new apartment. It is small, but it is very nice.

My old home was far from my work. Every morning, I spent one hour on the bus. Now I live near the subway station. I walk to work in ten minutes. This is a big change for me.

My new apartment has one bedroom, a kitchen, and a small living room. The rent is eight hundred dollars a month. It is not cheap, but I do not need a car now. I save money on gas.

Last weekend, I moved my furniture. My friend helped me. We carried the bed and the desk. We did not have many things, so it was not hard.

Now my apartment is still empty in some rooms. I want to buy a sofa and a lamp. I do not have much money, so I must choose carefully.

I am very happy here. A short trip to work makes my day easier.`,
      questions: [
        { type: '细节', q: 'Why did the writer move?', options: ['The old apartment was too small', 'The old home was far from work', 'The rent was too high'], answer: 1, why: '第一段后文说 "My old home was far from my work" — 这才是搬家原因。' },
        { type: '细节', q: 'How does the writer go to work now?', options: ['By bus', 'By subway', 'On foot'], answer: 2, why: '"I live near the subway station. I walk to work in ten minutes." 注意：住地铁站附近，但**走路**上班，两个信息要分清。' },
        { type: '推理', q: 'Why does the writer save money?', options: ['Because the new rent is cheap', 'Because he/she does not need a car', 'Because the room is small'], answer: 1, why: '"I do not need a car now. I save money on gas." 省钱来自不需要车，不是房租便宜。' },
        { type: '细节', q: 'What does the writer want to buy?', options: ['A car and a bed', 'A sofa and a lamp', 'A new kitchen'], answer: 1, why: '"I want to buy a sofa and a lamp."' },
        { type: '主旨', q: 'What is the main idea?', options: ['Living alone is difficult', 'The move made daily life easier', 'Furniture is expensive to move'], answer: 1, why: '搬家原因、过程、结果都指向同一个结论：通勤变短让生活更轻松。' },
        { type: '词义', q: 'The word "still" in paragraph 4 is closest in meaning to:', options: ['already', 'yet / up to now', 'again'], answer: 1, why: '"still empty" 指「到目前为止还空着」，是 yet 的用法，不是「静止的」。' }
      ]
    },
    {
      id: 'r2-l1-02', lv: 'L1', title: 'My Morning Market', titleCn: '清晨的菜市场', level: '入门',
      words: 168, minutes: 9.1, topic: '生活',
      keyWords: ['market', 'fresh', 'cheap', 'neighbor'],
      text: `My mother goes to the market every morning. She gets up at five thirty. The market opens at six.

The market is near my home. It is not big, but it has everything. There are vegetables, meat, fish, eggs, and fruit. There are also small shops for rice, oil, and noodles.

My mother does not buy much food at the supermarket. She says the market food is fresher. The vegetables there are small, but they taste better. The price is also lower.

Every morning, many people go there. My mother knows most of them. She often talks with the fish seller and the woman who sells eggs. They know her name. They know what she buys.

Last month, I went with her. I carried the bag. She bought six eggs, some green vegetables, and two pieces of fish. The total was about eight dollars. That is cheap for a week of food for one person.

I like the market. It is noisy, but it is full of life.`,
      questions: [
        { type: '细节', q: 'What time does the market open?', options: ['At five thirty', 'At six', 'At seven'], answer: 1, why: '"She gets up at five thirty. The market opens at six." 起床时间和开门时间不同，别混淆。' },
        { type: '细节', q: 'Why doesn\'t the mother buy food at the supermarket?', options: ['It is too far', 'The market food is fresher and cheaper', 'She works there'], answer: 1, why: '"the market food is fresher… The price is also lower." 两个原因都给了。' },
        { type: '细节', q: 'How much did they spend?', options: ['Six dollars', 'Eight dollars', 'Eighteen dollars'], answer: 1, why: '"The total was about eight dollars." 6 和 18 是干扰项。' },
        { type: '推理', q: 'What can we learn about the market sellers?', options: ['They do not know the mother', 'They know the mother well', 'They are new'], answer: 1, why: '"They know her name. They know what she buys." 说明是熟人关系。' },
        { type: '态度', q: 'How does the writer feel about the market?', options: ['They think it is too noisy and bad', 'They like it and find it lively', 'They think it is too cheap'], answer: 1, why: '"I like the market. It is noisy, but it is full of life." 先转折后肯定。' },
        { type: '词义', q: 'The phrase "full of life" means:', options: ['dangerous', 'lively and energetic', 'expensive'], answer: 1, why: '「充满活力」——是褒义，与前面的 noisy（吵闹）形成转折对比。' }
      ]
    },
    {
      id: 'r2-l1-03', lv: 'L1', title: 'Why I Love Rainy Days', titleCn: '我爱雨天', level: '入门',
      words: 170, minutes: 9.1, topic: '天气',
      keyWords: ['rain', 'sound', 'cozy', 'umbrella'],
      text: `I like rainy days. Many people do not like them, because the sky is gray and the streets are wet. But I think rainy days are special.

First, the sound of rain is relaxing. When it rains, I stay at home and listen to it. I drink hot tea and read a book. I do not need to go anywhere.

Second, rainy days are good for sleeping. Many people sleep longer on rainy days. A rainy day in my city is like a free day.

Last year, I lived in a small room without a window. On rainy days, the room was dark and quiet. I did not like it then. But now I live in a bigger place, and I like rainy days again.

One problem: I forget my umbrella often. Last week I got wet in the rain. I walked two blocks to the bus stop. It was not fun.

Still, I do not want to stop liking rainy days. They give me a reason to stay home.`,
      questions: [
        { type: '细节', q: 'What does the writer do on rainy days?', options: ['Go to work early', 'Stay home, drink tea, and read', 'Clean the house'], answer: 1, why: '"I stay at home and listen to it. I drink hot tea and read a book."' },
        { type: '细节', q: 'What problem does the writer mention?', options: ['No window', 'Forgetting the umbrella', 'No hot water'], answer: 1, why: '"One problem: I forget my umbrella often." 去年无窗是过去的事，不是现在的问题。' },
        { type: '推理', q: 'Why did the writer not like rainy days before?', options: ['The room was dark and quiet', 'He was busy', 'He was sick'], answer: 0, why: '"I lived in a small room without a window. On rainy days, the room was dark and quiet. I did not like it then."' },
        { type: '主旨', q: 'What is the main idea?', options: ['Rain is always bad', 'Rainy days can be pleasant if you have a good home', 'The writer hates the rain'], answer: 1, why: '关键是"if you have a good home"——同样的雨，有窗的房间和没窗的房间体验完全不同。' },
        { type: '词义', q: 'The word "cozy" in paragraph 2 is closest to:', options: ['cold', 'warm and comfortable', 'noisy'], answer: 1, why: '配合 hot tea 和 book，cozy 指温暖舒适。' },
        { type: '细节', q: 'How long did the writer live in the room without a window?', options: ['For a month', 'For a year', 'We don\'t know'], answer: 2, why: '文中只说 "Last year, I lived in…" — 时间跨度是去年某时段，不是"住了一年"。这是训练"不臆测"的阅读习惯。' }
      ]
    },

    /* ============================ L2 ============================ */
    {
      id: 'r2-l2-01', lv: 'L2', title: 'The Delivery Changed My Week', titleCn: '外卖改变了我的生活', level: '基础',
      words: 294, minutes: 11.1, topic: '生活',
      keyWords: ['convenient', 'routine', 'expense', 'balance', 'reliable'],
      text: `For years, I cooked dinner every evening. It was not hard, but on busy days it felt like one more task. Then, last year, I started ordering food delivery three times a week. Now I order it five times, and I want to explain why.

The first reason is time. When I worked late, I was too tired to shop for ingredients and cook. After work, I only wanted to sit down. Delivery solved that problem completely. I open the app, choose a restaurant, and the food arrives in thirty minutes. On those evenings, I get maybe two extra hours for myself.

The second reason is consistency. When I cook, I usually make the same three or four dishes. Delivery lets me try something different without any effort. Last month I had dishes from Thailand, from Mexico, and from my neighbor\'s noodle place. I would never have tried most of them.

However, there is a real cost. Delivery is expensive. A meal that costs twelve dollars to make at home can cost twenty-five dollars delivered, and I am not always careful about that. I also noticed something worse: when I order delivery four times in a row, I feel low afterwards. It is not about the food. It is about knowing I did nothing.

So I set a rule. I order delivery at most three times a week, and never on weekends. On those days I buy ingredients and cook something simple. The rule is not about health. It is about keeping the choice.

The truth is that the problem was never delivery. The problem was that I was using it to avoid a tired evening. Now I use it to make a good evening easier, and the difference is small but real.`,
      questions: [
        { type: '主旨', q: 'What is the main argument of the passage?', options: ['Delivery food is unhealthy and should be banned', 'The value of delivery depends on whether it replaces a choice or makes one easier', 'The writer stopped ordering delivery completely'], answer: 1, why: '末段是论点：区别在于「替代选择」还是「让选择更容易」。中间两段分别给出理由与代价。' },
        { type: '细节', q: 'How many times a week does the writer now allow delivery?', options: ['Three', 'Four', 'Five'], answer: 0, why: '"I order delivery at most three times a week, and never on weekends." 注意 now allow 是规则，不是最初的五次。' },
        { type: '推理', q: 'Why does the writer feel low after four orders in a row?', options: ['The food was bad', 'Because he/she did nothing and it felt like avoiding a choice', 'Because delivery was expensive'], answer: 1, why: '"It is not about the food. It is about knowing I did nothing." 直接排除食物因素。' },
        { type: '细节', q: 'What was the reason the writer ordered delivery at the very beginning?', options: ['To try new food', 'Because he/she was too tired to shop and cook', 'To save money'], answer: 1, why: '"on busy days it felt like one more task" + "I was too tired to shop for ingredients and cook"。' },
        { type: '推理', q: 'Why does the writer avoid delivery on weekends?', options: ['Weekend delivery is expensive', 'To keep weekends for cooking, preserving the sense of choice', 'The restaurant is closed'], answer: 1, why: '"The rule is not about health. It is about keeping the choice." 目的是保留自主感。' },
        { type: '词义', q: 'The word "ingredients" in paragraph 2 is closest in meaning to:', options: ['utensils', 'the food items used to cook a dish', 'restaurants'], answer: 1, why: 'shop for ingredients = 买菜；utensils 是厨具。' },
        { type: '态度', q: 'What is the writer\'s attitude toward delivery?', options: ['Completely against it', 'Balanced and thoughtful', 'Enthusiastically promoting it'], answer: 1, why: '既承认优点（省时、尝新），也承认代价（贵、空虚感），最终给出折中规则。' }
      ]
    },
    {
      id: 'r2-l2-02', lv: 'L2', title: 'Learning to Run Again', titleCn: '重新开始跑步', level: '基础',
      words: 294, minutes: 11.1, topic: '运动',
      keyWords: ['injury', 'gradual', 'return', 'frustrated', 'commitment'],
      text: `I ran for four years before I hurt my knee. It was not a dramatic injury — I was going down a hill, and I felt something pull in my knee. The pain was sharp for two weeks and dull for three months. I stopped running completely.

The first month after the injury was difficult, not physically but in my head. I could not understand why my body was so slow to heal. I kept thinking about the runs I used to have. Then I started reading about the injury, and the reading made it worse. Every article mentioned a new risk, and I was certain I would never run well again.

What helped was not information. It was a very small decision. I decided that, for one month, I would not run at all. I would only walk. The relief was immediate. I was no longer a runner who was injured; I was a person who was walking.

After that month, I walked for thirty minutes and jogged for one. It felt strange and slow, but I did not push. The next month, I jogged for two. By the sixth month, I could run three kilometers again. It took a year to get back to where I was, and honestly, the first three months were the hardest.

What I learned was simple but hard to keep: the injury was not a punishment. It was a pause. The difference sounds small, but it changes what you do next. When I thought of it as a punishment, I wanted to quit. When I thought of it as a pause, I was willing to wait.

If you are injured now, you do not need a better plan. You need a smaller one that you can do today.`,
      questions: [
        { type: '主旨', q: 'What is the writer\'s main point?', options: ['Running is dangerous and should be avoided', 'How you frame a setback determines whether you quit or continue', 'Medical advice about knee injuries'], answer: 1, why: '末两段是论点：把受伤看成「惩罚」还是「暂停」，决定行为走向。' },
        { type: '细节', q: 'How did the injury happen?', options: ['In a race', 'Going down a hill', 'At the gym'], answer: 1, why: '"I was going down a hill, and I felt something pull in my knee."' },
        { type: '推理', q: 'Why did reading about the injury make things worse?', options: ['The articles were hard to understand', 'Each article added new risks, increasing fear', 'The writer could not find good sources'], answer: 1, why: '"the reading made it worse. Every article mentioned a new risk." 问题是信息增加了焦虑。' },
        { type: '细节', q: 'What was the small decision that helped?', options: ['To run slowly every day', 'To not run at all for a month and only walk', 'To see a doctor immediately'], answer: 1, why: '"For one month, I would not run at all. I would only walk." 关键在于重新定义身份。' },
        { type: '细节', q: 'How long did it take to return to the previous level?', options: ['Six months', 'Nine months', 'A year'], answer: 2, why: '"It took a year to get back to where I was." 注意与 six months（回到三公里）区分。' },
        { type: '推理', q: 'What does "The injury was not a punishment. It was a pause" mean?', options: ['Injuries are not your fault', 'How you interpret a setback changes your response to it', 'You should never exercise'], answer: 1, why: '后文紧接「difference changes what you do next」，说明解释方式决定行为。' },
        { type: '态度', q: 'The tone of the last paragraph is best described as:', options: ['Regretful', 'Direct and encouraging', 'Apologetic'], answer: 1, why: '「You need a smaller one that you can do today」是直接的行动建议，没有铺垫情绪。' }
      ]
    },
    {
      id: 'r2-l2-03', lv: 'L2', title: 'The Library I Started Using', titleCn: '我开始使用的图书馆', level: '基础',
      words: 261, minutes: 10.8, topic: '学习',
      keyWords: ['borrow', 'quiet', 'resource', 'screen', 'belong'],
      text: `I did not go to the library for most of my twenties. I bought books, then lost them, then bought more. My books at home numbered perhaps forty, and I had read maybe six of them.

A year ago, a friend asked why I did not borrow instead. I did not have a good answer. So I went, and I did not buy a book that day. It felt strangely bad, as if I were leaving with nothing.

The library near my apartment is small. It has one reading room with twelve seats, and a rule against food. But something changed when I started going every Tuesday evening. The books were not mine, so I could not leave them on my desk and forget about them. I had to finish them, or at least decide.

What surprised me most was not the reading. It was the quiet. My apartment was full of small noises: the fridge, the neighbors, my phone. In the reading room, nobody was doing anything, including me. After an hour, my head felt different.

Now I go every Tuesday. I finish most books. I have not bought a new one in a year, which has saved a surprising amount of money.

The lesson was not about money. Anyone can use a library. The lesson was about the difference between a thing you own and a thing you borrow. Owning felt permanent, but permanent things are easy to ignore. Borrowing felt temporary, and temporary things ask for a decision.

I still buy books. But now I finish them first.`,
      questions: [
        { type: '细节', q: 'Why didn\'t the writer go to the library in their twenties?', options: ['It was too far', 'They bought books instead, then forgot them', 'They were not allowed'], answer: 1, why: '"I bought books, then lost them, then bought more." 买了但没读完。' },
        { type: '推理', q: 'Why did the library feel "strangely bad" at first?', options: ['It was dirty and crowded', 'The writer felt they were leaving with nothing', 'The librarian was unfriendly'], answer: 1, why: '"as if I were leaving with nothing" — 买习惯了，空手离开反而不适。' },
        { type: '细节', q: 'What surprised the writer most?', options: ['The quiet', 'The number of books', 'The cost'], answer: 0, why: '"What surprised me most was not the reading. It was the quiet." 直接明示。' },
        { type: '细节', q: 'What is the rule in the reading room?', options: ['No talking', 'No food', 'No phones'], answer: 1, why: '"a rule against food" — 只有禁食，没有禁说话或禁手机。' },
        { type: '推理', q: 'Why did borrowing feel different from owning?', options: ['Borrowed books are more interesting', 'Borrowing asks for a decision, while owning allows ignoring', 'The library has better books'], answer: 1, why: '「永久的东西容易被忽略，暂时的东西要求你做决定」是全文论证核心。' },
        { type: '主旨', q: 'What is the main idea?', options: ['Libraries are better than bookstores', 'Temporary access creates motivation that permanent ownership does not', 'Reading is good for health'], answer: 1, why: '末段总结：owning 感觉永久所以容易忽略，borrowing 感觉暂时所以要求决策。' },
        { type: '细节', q: 'How often does the writer go now?', options: ['Every day', 'Every Tuesday', 'Every month'], answer: 1, why: '"Now I go every Tuesday." 两处都提到。' }
      ]
    },

    /* ============================ L3 ============================ */
    {
      id: 'r2-l3-01', lv: 'L3', title: 'The Hidden Cost of the Convenience Store', titleCn: '便利店背后的隐性代价', level: '进阶',
      words: 368, minutes: 12.4, topic: '社会观察',
      keyWords: ['proximity', 'impulse', 'deficit', 'visible', 'normalize'],
      text: `It is easy to mock the convenience store. It is small, it is expensive, and the food is not good. Yet the format has spread to nearly every city block, and the reason is not that people prefer bad food. It is that proximity changes behavior in ways that have nothing to do with preference.

Consider what a convenience store is actually optimizing. It is not selling food; it is selling the removal of a decision. A person who wants water does not walk to the supermarket and does not compare prices. They see a lit window, they walk in, and the transaction takes ninety seconds. The store has captured something valuable: a moment when the person was already thinking about what they wanted.

This is not a conspiracy, and it would be easier to dismiss if it were. The design is simply competent. The food is placed at eye level, not buried. The prices are legible from the door, so the decision happens before entry. Cold drinks are by the register, because thirst is strongest at the point of payment. None of this requires deceiving anyone.

The consequence is a change in the baseline. When a store is open on every corner, a stopped habit becomes a single step rather than a plan. And single steps are exactly what most behavioral changes fail at. Research on habit formation is remarkably consistent: what separates people who change a routine from people who do not is rarely motivation and almost always the number of steps required.

There is a visible cost and an invisible one. The visible cost is the money — the same bottle of water costs three times more at the corner than at the supermarket. The invisible cost is more troubling. It is the slow normalization of buying instead of planning, which removes the small moment in which a better choice was possible.

None of this means the store is bad. Convenience is a real good, and for someone walking home at eleven at night, ninety seconds and a lit window is genuinely worth three dollars. The problem is not the store. The problem is that we rarely notice when a shortcut has quietly replaced a decision.`,
      questions: [
        { type: '词义', q: 'In paragraph 2, "The removal of a decision" means the store:', options: ['Deletes price information', 'Eliminates the need to compare and choose', 'Prevents people from entering'], answer: 1, why: '后文举例说明：不用比价、不用走去超市，决策被省略。' },
        { type: '推理', q: 'Why does the author say the design "would be easier to dismiss if it were" a conspiracy?', options: ['Conspiracies are more common', 'The problem is competent design rather than deliberate deception, which is harder to oppose', 'Stores are not designed at all'], answer: 1, why: '作者强调不是阴谋而是专业设计——这让它无法被简单谴责，反而更难抵抗。' },
        { type: '细节', q: 'Where are cold drinks placed, and why?', options: ['At the back, to be found', 'By the register, because thirst is strongest at payment', 'By the door, for visibility'], answer: 1, why: '"Cold drinks are by the register, because thirst is strongest at the point of payment."' },
        { type: '推理', q: 'What does the author say about habit formation research?', options: ['Motivation is the main factor', 'The number of steps required is the deciding factor', 'Habits form in exactly 21 days'], answer: 1, why: '"rarely motivation and almost always the number of steps required."' },
        { type: '词义', q: 'The word "normalize" in paragraph 6 most likely means:', options: ['To correct something', 'To make something become accepted as ordinary', 'To measure something'], answer: 1, why: '「逐渐变成常态」—— buy instead of plan 成为默认行为。' },
        { type: '主旨', q: 'What is the author\'s main point?', options: ['Convenience stores should be banned', 'We rarely notice when a shortcut has quietly replaced a decision', 'Supermarket food is better for health'], answer: 1, why: '末句直接给出结论。' },
        { type: '态度', q: 'How does the author feel about convenience stores?', options: ['Entirely hostile', 'Critical but fair — they acknowledge the real value', 'Indifferent'], answer: 1, why: '末段承认「对深夜回家的人，90 秒和亮着的窗确实值 3 美元」，批评的是替换决策而非商店本身。' },
        { type: '推理', q: 'Why does the author call the visible cost "more troubling" than invisible?', options: ['Money problems are worse', 'The invisible cost removes the moment in which a better choice becomes possible', 'Convenience stores charge too much'], answer: 1, why: '原文对比：钱是可量化的，而「失去做更好选择的那个瞬间」是结构性损失。' }
      ]
    },
    {
      id: 'r2-l3-02', lv: 'L3', title: 'Why We Keep Recommending Things We Do Not Use', titleCn: '我们为何推荐自己不用的东西', level: '进阶',
      words: 381, minutes: 12.5, topic: '科技社会',
      keyWords: ['algorithm', 'plausible', 'disclosure', 'incentive', 'endorsement'],
      text: `Every platform that ranks content eventually faces the same question: what exactly is being ranked, and on whose behalf? The industry answer is engagement, and engagement is a real measure. It is also, in an important sense, the wrong one.

Consider what a recommendation is for. When a person opens a cooking app and sees a recipe, the reasonable assumption is that someone believes this recipe is worth their time. This assumption is usually correct, and precisely for that reason it is valuable to abuse. A list of genuinely good items will be followed. A list of genuinely good items with a few poor ones mixed in will be followed faster, because the poor ones are more interesting.

This is the problem with plausibility rather than quality. A mediocre recipe with an involved process scores well on every metric a system can measure without knowing anything about cooking. It takes twenty minutes to watch, and it creates exactly the anticipation that keeps someone from cooking. The recommendation is not malicious. It is just not about what the user said they wanted.

Effort is where this becomes visible. Platforms that host user-generated content face a structural problem: contributors are compensated for producing, and rarely for being good. Reputation systems help, but they are also gameable, and once a system becomes gameable, a certain fraction of participants will game it, regardless of intentions. This is not a failure of character. It is what happens when the incentive and the goal are not the same thing.

Disclosure does not fix this. A label saying content may be sponsored reduces deception, but it does not reduce the effect; most people do not read the label, and the ones who do still click. What reduces the effect is changing the incentive, which is expensive, and building a ranking that models long-term satisfaction rather than next-click probability, which is harder and slower.

The honest position is narrow. Recommenders are useful, they are not neutral, and the fact that a system is optimizing something does not tell you what that something is worth to you. These systems are not lying, but they are not helping either, in the way that the word "helping" implies. They are predicting, accurately and without any interest in whether the prediction serves you.`,
      questions: [
        { type: '词义', q: 'In paragraph 2, "This is the problem with plausibility rather than quality" means:', options: ['Quality items are not recommended', 'Items that merely seem appealing perform better than genuinely good ones', 'Plausible items are cheaper'], answer: 1, why: '前文论证：几道真正好的菜 + 几道差的会让人更快地跟着做，因为差的更"有意思"（引起好奇）。' },
        { type: '推理', q: 'Why does an involved mediocre recipe score well?', options: ['Viewers praise it', 'It is easy to watch and creates anticipation, which metrics can measure', 'The platform pays for it'], answer: 1, why: '「需要 20 分钟观看 + 制造期待感」都是可测指标，而「好不好吃」不是。' },
        { type: '词义', q: 'The word "gameable" in paragraph 4 means:', options: ['Impossible to improve', 'Easy to manipulate for advantage', 'Very difficult to design'], answer: 1, why: '游戏可被利用来刷分——reputation system 容易被操纵。' },
        { type: '推理', q: 'Why doesn\'t the author think disclosure labels solve the problem?', options: ['Labels are illegal', 'Most people skip them, and those who read still click; the incentive remains', 'They are too expensive'], answer: 1, why: '"most people do not read the label, and the ones who do still click."' },
        { type: '细节', q: 'What does the author say is the "honest position"?', options: ['Recommenders should be banned', 'Recommenders are useful but not neutral, and we must find out what they optimize', 'Users should stop using them'], answer: 1, why: '末段：有用、不中立、且优化目标未必对你有价值。' },
        { type: '主旨', q: 'What is the main argument?', options: ['Algorithms are inherently evil', 'Recommendation systems optimize measurable proxies that diverge from stated user goals', 'User-generated content has no value'], answer: 1, why: '全文围绕「可测代理指标 ≠ 用户真实目标」这一结构性问题展开。' },
        { type: '词义', q: '"Engagement is a real measure. It is also... the wrong one" suggests:', options: ['Engagement cannot be measured', 'Engagement is valid but does not serve the actual goal', 'The industry made a mistake'], answer: 1, why: '两个分句构成转折：指标是真的，方向是错的。' },
        { type: '态度', q: 'The author\'s tone toward recommendation systems is best described as:', options: ['Enthusiastic', 'Analytically detached and carefully qualified', 'Indignant'], answer: 1, why: '用 not lying / but not helping / they are predicting 这样精确的措辞，保持距离与克制。' }
      ]
    },
    {
      id: 'r2-l3-03', lv: 'L3', title: 'The Comfort of Routines', titleCn: '规律的慰藉', level: '进阶',
      words: 384, minutes: 13.8, topic: '心理',
      keyWords: ['novelty', 'undulate', 'relief', 'curate', 'sustain'],
      text: `Most people treat variety as a default good. A different restaurant, a different route, a different show — each is offered as an improvement. This preference is so widely shared that it requires no argument, which is precisely why it deserves one.

Novelty and comfort are not opposites, and treating them as such creates a strange pattern. The pattern is this: a person spends most weeks wishing for change, arranges a change when the wish becomes uncomfortable, and then finds the change disappointing within days. The disappointment is real, and the wish returns quickly. This cycle is common enough to be unremarkable, and also common enough to be a poor strategy.

The mechanism is easy to trace. A new option carries uncertainty, and uncertainty is uncomfortable because the brain cannot predict the outcome. A routine carries no uncertainty at all, because the outcome has already been resolved. What we usually describe as boring is in fact the absence of a question to solve. For a brain that exists to resolve questions, this absence registers as a kind of mild deprivation, and the relief it produces when a question returns is experienced as pleasure.

This explains why the anticipation of a change often feels better than the change itself. The anticipation contains the question. The experience itself, having been predicted accurately, contains nothing.

The practical implication is not that routines are good and novelty is bad. It is that they serve different functions, and the mistake is using one to do the other\'s job. A routine is an efficient instrument for maintaining a state; asking it to produce meaning produces the mid-week restlessness that people often describe as needing a holiday. Novelty is an instrument for producing attention; asking it to maintain a state produces the constant low-level dissatisfaction of someone who changes their routine every few days.

There is a practical technique here that costs nothing. Rather than trying to decide whether you need stability or change, decide which hour of the day you will protect and which you will leave open. Most people manage their weeks with a single undulating mood, hoping to be in the good part. Curating the week instead of the mood tends to be more reliable, because it replaces an outcome you cannot control with a rule you can.`,
      questions: [
        { type: '细节', q: 'What pattern does the author say is common?', options: ['People avoid change entirely', 'People wish for change, try it, then find it disappointing and wish again', 'People change routines and enjoy them'], answer: 1, why: '第 2 段完整描述了这个循环。' },
        { type: '词义', q: '"Novelty and comfort are not opposites" means:', options: ['They are opposite ends of a scale', 'They serve different purposes and can coexist', 'One always destroys the other'], answer: 1, why: '后文说 they serve different functions。' },
        { type: '推理', q: 'Why is a new option uncomfortable, according to the passage?', options: ['It is expensive', 'Uncertainty means the outcome cannot be predicted', 'It takes more time'], answer: 1, why: '"A new option carries uncertainty, and uncertainty is uncomfortable because the brain cannot predict the outcome."' },
        { type: '推理', q: 'Why does the author say "boring" is actually the absence of a question?', options: ['Boredom is caused by low intelligence', 'A resolved routine produces no unresolved question for the brain to work on', 'Boredom is a medical condition'], answer: 1, why: '"What we usually describe as boring is in fact the absence of a question to solve."' },
        { type: '细节', q: 'What two functions do routines and novelty serve?', options: ['Routines maintain a state; novelty produces attention', 'Routines produce attention; novelty maintains a state', 'Both produce meaning'], answer: 0, why: '第 5 段明确对比两者的功能，且指出常见错误是让一个做另一个的活。' },
        { type: '细节', q: 'What technique does the author recommend?', options: ['Take more holidays', 'Protect one hour and leave one open — curate the week rather than the mood', 'Change routine every few days'], answer: 1, why: '末段给出具体做法。' },
        { type: '词义', q: '"undulate" in the last paragraph most likely means:', options: ['Remain flat and constant', 'Move up and down repeatedly', 'Disappear gradually'], answer: 1, why: 'undulate = 波动，指情绪随时间起伏，与后面 curate the week 对照。' },
        { type: '主旨', q: 'What is the author\'s main point?', options: ['Novelty is overrated and should be avoided', 'Routines and novelty serve different functions; don\'t use one to do the other\'s job', 'Weekly planning is more important than daily mood'], answer: 1, why: '第 5 段「They serve different functions, and the mistake is using one to do the other\'s job」是全文论点。' },
        { type: '推理', q: 'Why does the author say curating the week is more reliable?', options: ['It is easier to plan than to feel', 'It replaces an uncontrollable outcome with a rule you can follow', 'It guarantees a good mood'], answer: 1, why: '"it replaces an outcome you cannot control with a rule you can."' }
      ]
    },

    /* ============================ L4 ============================ */
    {
      id: 'r2-l4-01', lv: 'L4', title: 'On the Problem with Reading Everything', titleCn: '论「什么都读」的问题', level: '精通',
      words: 558, minutes: 14.5, topic: '认知',
      keyWords: ['saturation', 'consolidate', 'exhaustive', 'productive', 'neglect'],
      text: `There is a particular kind of ambition that looks admirable and is quietly corrosive: the intention to read everything. The phrase appears in a great many biographies, and it is almost always reported approvingly. The person who read the hundred books of the year is described as curious, as rigorous, as a better citizen of the world. Nothing in the framing suggests that anything was lost.

Something was lost, and the loss is difficult to name because it does not feel like loss. It feels like accumulation. Consider what a year of indiscriminate reading actually produces: perhaps sixty books, each attended to for three or four hours, each joined to a memory of having understood something, and almost none of it available a year later. The factual residue is thin. The sense of intellectual breadth is genuine. The two are frequently confused, and the confusion is convenient for us because breadth can be listed and retained.

The underlying operation is a failure to distinguish exposure from consolidation. A mind is not a container that fills; it is a system that consolidates. Consolidation is not a matter of volume but of recurrence, spacing, and retrieval under conditions where the material is not present to be consulted. The person who has read a thousand books in three years has, by ordinary standards, done the opposite of learning them, because the conditions required for consolidation were never met. This is not a criticism of the reader, who is doing exactly what the reader was told. It is a criticism of the instruction, which framed accumulation as achievement.

There is a further cost, and it is the one least often acknowledged. Reading everything is a way of not choosing. The enormous time commitment appears to justify itself precisely because it excludes the alternative activity, which is thought. To think about a single problem for a year requires that other things go unread, and very few people are willing to make that trade in public, because the appearance of consumption is indistinguishable, to the observer and often to the practitioner, from the appearance of work. The reader who has read a hundred books has a ready answer to the question of what they did this year, and that ready answer is worth more to them than the argument they might have built.

None of this suggests that wide reading is valueless. It is valuable, and the person who reads across many fields will draw connections the specialist cannot. But the connection is drawn from what was retained, not from what was opened, and the distinction should govern how we talk about it. The honest formulation is that breadth is a condition for insight, not a substitute for it. A mind that has read everything and retained nothing has not been educated; it has been delayed, and the delay was pleasant, which is the most difficult kind of delay to notice in oneself.

What would it take to read less and retain more? Not discipline, which is a poor answer because it frames the problem as a matter of effort. The answer is structural: choose fewer books, and accept that you will not know what you have missed. This is the entire cost, and it is a real one, because not knowing what you have missed is one of the principal pleasures of reading.`,
      questions: [
        { type: '主旨', q: 'What is the author\'s central claim?', options: ['Wide reading is inherently wasteful', 'Exposure is not consolidation; accumulation is easily mistaken for learning', 'Specialization is superior to breadth'], answer: 1, why: '第 4 段 "exposure from consolidation" 是全文的枢纽论点，其余段落都在支撑它。' },
        { type: '细节', q: 'What does the author say about "the factual residue" of indiscriminate reading?', options: ['It is rich and detailed', 'It is thin, though the sense of breadth is genuine', 'It is irrelevant to memory'], answer: 1, why: '"The factual residue is thin. The sense of intellectual breadth is genuine." 两者必须分开算。' },
        { type: '推理', q: 'Why does the author say reading everything is "a way of not choosing"?', options: ['It takes no time', 'It excludes the alternative activity of thinking on a single problem, and the appearance of consumption resembles work', 'It makes one appear well-read without trying'], answer: 1, why: '第 5 段明确论述：广读排除了「想一个问题想一年」，且消费的外观与工作的外观难以区分。' },
        { type: '词义', q: '"consolidation" in paragraph 4 most nearly means:', options: ['Purchasing in bulk', 'The process by which knowledge becomes durable through recurrence and retrieval', 'Summarizing a text'], answer: 1, why: '紧接解释：consolidation 取决于 recurrence、spacing 和无提示下的 retrieval，而非数量。' },
        { type: '词义', q: 'The phrase "a citizen of the world" is used here to suggest:', options: ['Someone who travels widely', 'A flattering description the author is about to complicate', 'A person without national ties'], answer: 1, why: '"Nothing in the framing suggests that anything was lost." — 这是在为后文的反驳铺垫。' },
        { type: '推理', q: 'Why does the author reject "discipline" as the answer to reading less?', options: ['Discipline is too difficult', 'It frames a structural design problem as an individual failure of effort', 'It would reduce the pleasure of reading'], answer: 1, why: '"which is a poor answer because it frames the problem as a matter of effort"，且后文给出「structural」作对比。' },
        { type: '细节', q: 'What does the author say the cost of reading fewer books is?', options: ['Loss of general knowledge', 'Not knowing what you have missed, which is one of reading\'s main pleasures', 'Loss of reading speed'], answer: 1, why: '末句明确点出，并称其「是阅读最主要的乐趣之一」。' },
        { type: '态度', q: 'The tone of the final paragraph is best described as:', options: ['Enthusiastic', 'Measured, with a cost-benefit framing rather than a verdict', 'Sarcastic'], answer: 1, why: '既承认广读的局限，也承认其价值，最后给出结构性建议并诚实说明代价，语气克制。' },
        { type: '推理', q: 'Why does the author say the delay was "the most difficult kind of delay to notice in oneself"?', options: ['It is the shortest kind of delay', 'It feels like progress, so there is no signal that anything is wrong', 'It affects others more than oneself'], answer: 1, why: '「 pleasant」是关键：延迟伴随愉悦感，因此缺少纠错信号。' }
      ]
    },
    {
      id: 'r2-l4-02', lv: 'L4', title: 'The Person Who Is Always Tired', titleCn: '总是疲惫的人', level: '精通',
      words: 529, minutes: 14.3, topic: '健康',
      keyWords: ['chronic', 'threshold', 'attributable', 'disregard', 'intervention'],
      text: `Chronic tiredness is treated in popular health writing as either a medical mystery or a lifestyle choice, and both treatments are unsatisfying. The first assigns the problem to a body that will eventually be scanned and found innocent; the second assigns it to a person who has simply not tried hard enough. Neither is much help, because both locate the difficulty outside the thing the sufferer can actually observe.

The experience itself is distinctive and worth describing accurately, since misdescribing it is a large part of why it goes unmanaged. The tired person is not sleepy in the sense of being unable to stay awake. They are tired in the sense that the ordinary tasks have become disproportionately expensive. A conversation that once took no effort now requires an act of will. Reading a page requires holding a sentence in mind while attending to the next one. The intellectual effort is small, and the cost of it is disproportionate, and this disproportion is what the person notices.

A second feature is often left out because it does not appear in any symptom list: the tiredness is not always proportional to effort. Someone who has done nothing may feel well-rested, and someone who has done a modest amount may collapse. This inconsistency frustrates the standard advice, which assumes that rest and activity can be titrated against each other like two quantities of a substance. In fact, the relationship is not linear, and titrating is not possible, which is why the standard advice fails so reliably.

The most consequential error, however, is one of attribution. The tired person almost always assumes the cause is proportional to the visible event — the week, the deadline, the child\'s illness. This is usually wrong, and it is wrong in a specific direction: the visible event is more often the occasion on which an underlying deficit becomes visible than its cause. Treating a visible event as the cause produces a reliable error. The person rests for two days, resumes, and within a week the same deficit is expressed again, now attributed to the next visible event. This cycle can continue for years, because each cycle appears to have been addressed.

This is why the interventions that help are frequently unglamorous. The threshold at which a symptom becomes visible is set by the baseline, not by the event. Raising the baseline — through whatever mechanism happens to work for the person, and the mechanisms differ considerably — is the only intervention that changes what a given week costs. And because the mechanism is not a matter of will, the person who cannot find it is not failing at self-care; they are looking in a place where the answer will not be.

None of this is a reason for despair, and the reason is structural rather than inspirational. A deficit that is invisible until an event exposes it will remain invisible if the event is removed, which means the diagnostic error is self-sealing. The person concludes they were tired because of the week. The week ends. The deficit returns. The same conclusion is reached again, and the evidence accumulates for a belief that is, in its central claim, false.`,
      questions: [
        { type: '主旨', q: 'What is the author\'s central claim?', options: ['Chronic tiredness is untreatable', 'Fatigue is systematically misattributed to visible events, which makes the error self-sealing', 'Sleep hygiene solves most cases'], answer: 1, why: '第 4-6 段论述归因错误的机制，末段用 self-sealing 收束。' },
        { type: '细节', q: 'How does the author distinguish the tired person\'s experience from sleepiness?', options: ['They fall asleep easily', 'Ordinary tasks become disproportionately expensive, requiring an act of will', 'They sleep too little'], answer: 1, why: '"The tired person is not sleepy in the sense of being unable to stay awake."' },
        { type: '推理', q: 'Why does the standard advice fail?', options: ['It is too expensive to follow', 'It assumes rest and activity are linearly titratable, but the relationship is not linear', 'It targets the wrong organ'], answer: 1, why: '第 3 段：把休息与活动当作两种可称量的物质来配比，而实际关系非线性。' },
        { type: '推理', q: 'What does the author mean by saying the visible event is "the occasion on which an underlying deficit becomes visible rather than its cause"?', options: ['Events never cause fatigue', 'The event reveals a pre-existing deficit rather than creating it', 'Deficits are imaginary'], answer: 1, why: '这解释了为什么"休息两天后同样问题再次出现"。' },
        { type: '词义', q: '"self-sealing" in the final paragraph most nearly means:', options: ['The error cannot be detected by the evidence it generates', 'The condition is untreatable', 'The person recovers over time'], answer: 0, why: '每次循环都像是"处理过了"，因而错误无法被自身产生的证据推翻。' },
        { type: '细节', q: 'According to the author, what determines the threshold at which symptoms appear?', options: ['The duration of the event', 'The baseline, not the event', 'The amount of sleep'], answer: 1, why: '"The threshold at which a symptom becomes visible is set by the baseline, not by the event."' },
        { type: '态度', q: 'The author\'s attitude toward the "willpower" explanation is:', options: ['Sympathetic', 'Explicitly rejected as a category error', 'Neutral'], answer: 1, why: '"the person who cannot find it is not failing at self-care; they are looking in a place where the answer will not be."' },
        { type: '推理', q: 'Why does the author say the interventions that help are "unglamorous"?', options: ['They are cheap', 'They work by raising the baseline rather than by dramatic individual interventions, and the right mechanism differs per person', 'They are not officially approved'], answer: 1, why: '干预机制因人而异，且作用点是提高基线而非单次努力。' },
        { type: '细节', q: 'Why does the author say there is "no reason for despair"?', options: ['Most cases resolve within a month', 'The reason is structural rather than inspirational — the problem is diagnosable in principle', 'Medication is effective'], answer: 1, why: '末段给出结构性理由：如果移除可见事件，隐性赤字就会一直隐形——问题在原理上可诊断。' }
      ]
    },
    {
      id: 'r2-l4-03', lv: 'L4', title: 'What Cities Do to Strangers', titleCn: '城市如何对待陌生人', level: '精通',
      words: 563, minutes: 14.6, topic: '城市社会',
      keyWords: ['anonymity', 'encounter', 'legibility', 'civility', 'reclaim'],
      text: `Every large city runs an experiment that no laboratory could afford. It places millions of people in close physical proximity without any prior relationship, then observes what happens. The conventional account of urban life is that this arrangement produces alienation, and the alienation is usually blamed on the crowd. The evidence is less obliging, and considerably more interesting.

The stranger is not the city\'s natural enemy; the stranger is its precondition. A city that is genuinely composed of acquaintances does not require a single one of its characteristic features — not the anonymity, not the stranger-facing shop, not the platform that assumes nobody will be recognised. The institution of the stranger is what makes the institution of the city possible at all. The argument is not that the city is good, but that it is a device, and the device has properties that we experience as costs.

Consider legibility. A shop that is legible to a stranger — where the prices are visible, the queue is orderly, the exit is marked — is legible by being explicit, and being explicit means denying the owner the right to be obscure. A small shop with a hand-painted sign and a door that opens only when someone is known has not failed at design; it has chosen a different audience. Both are reasonable positions, and the person who is not known pays the difference. The cost of legibility is not that it is unpleasant. It is that it is uniform, and uniformity is a real reduction even when nothing is being lost that the person shopping would have named.

The reverse move is what most people actually mean when they say that cities are cold. It is not that the absence of recognition is unpleasant in itself, but that the interaction has no shape. A transaction with a stranger requires a small number of moves — ask, answer, confirm, leave — and in a highly legible environment these moves become purely instrumental. Nothing in the exchange is superfluous, which is why nothing in it is memorable. The city does not make people unfriendly. It removes the opportunity for the interaction to be anything other than useful.

The counter-example is instructive precisely because it is limited. In the small shop, the transaction includes an unrequested element — a recommendation, a question, a minute of waiting that is not strictly necessary — and that element is what makes the shop worth returning to. This is not warmth as sentiment. It is an inefficiency, and the inefficiency is the product. The person who is known gets something the system cannot provide, and the system is not threatened by this, because the known are few.

The argument for reclaiming some of this is frequently met with the observation that a city cannot afford to be slow. The observation is correct, and it is also a choice being presented as a constraint. A city could be legible at its entrances and recognisable in its interiors, and almost no one would object to the second. What has happened instead is a totalization: the legible logic has been extended into spaces where legibility has no purchase, and the result is a city in which the only reliable currency is efficiency and every other value must be justified in its terms. The awkwardness of a stranger in such an environment is not a bug. It is what the design requires.`,
      questions: [
        { type: '主旨', q: 'What is the author\'s main argument?', options: ['Cities are inherently alienating and should be redesigned', 'The city depends on the stranger, and its characteristic features are experienced as costs', 'Small shops are always preferable to chains'], answer: 1, why: '第 2 段是核心：陌生人不是城市的天敌，而是城市的先决条件。' },
        { type: '词义', q: 'In paragraph 3, "legible" is used to describe a shop that:', options: ['Is easy to read emotionally', 'Makes prices, queue, and exit explicit to anyone', 'Is owned by a familiar person'], answer: 1, why: 'legible = 对陌生人可读；explicit 意味着店主放弃了"隐晦"的权利。' },
        { type: '推理', q: 'According to the passage, what is the cost of legibility?', options: ['It is unpleasant to shop in', 'It is uniform, which is a real reduction even when nothing is lost', 'It is expensive'], answer: 1, why: '"The cost of legibility is not that it is unpleasant. It is that it is uniform."' },
        { type: '推理', q: 'Why does the author say cities do not make people unfriendly?', options: ['People are naturally polite', 'They remove the opportunity for interaction to be anything other than useful', 'There is no crowding in cities'], answer: 1, why: '"The city does not make people unfriendly. It removes the opportunity for the interaction to be anything other than useful."' },
        { type: '推理', q: 'Why does the author call the small shop\'s extra element an "inefficiency"?', options: ['It wastes the owner\'s time', 'It is unrequested by the transaction, and that superfluity is the product', 'It is too slow to be profitable'], answer: 1, why: '"It is an inefficiency, and the inefficiency is the product." 冗余才是回头客的来源。' },
        { type: '细节', q: 'How does the author characterize the claim that "a city cannot afford to be slow"?', options: ['As a genuine constraint', 'As a choice being presented as a constraint', 'As obviously wrong'], answer: 1, why: '"The observation is correct, and it is also a choice being presented as a constraint."' },
        { type: '词义', q: 'The word "totalization" in the final paragraph most nearly means:', options: ['The total population', 'The extension of one logic into all domains, beyond where it applies', 'A financial collapse'], answer: 1, why: 'legible 逻辑被扩展进「它不产生效果的空间」，导致效率成为唯一货币。' },
        { type: '推理', q: 'What does the author suggest is possible?', options: ['Returning to pre-industrial cities', 'Making cities legible at entrances and recognisable in interiors', 'Eliminating the stranger'], answer: 1, why: '"A city could be legible at its entrances and recognisable in its interiors, and almost no one would object."' },
        { type: '态度', q: 'The tone is best described as:', options: ['Nostalgic and romantic about small shops', 'Analytically detached, with an argument the author presents as already available', 'Sarcastic and mocking'], answer: 1, why: '作者提出一套机制解释，并在末段给出「几乎没人会反对」的温和建议，语气克制。' }
      ]
    }
  ];

  function byLevel(lv) { return ARTICLES.filter(function (a) { return !lv || lv === 'ALL' || a.lv === lv; }); }

  global.ReadingContent2 = { ARTICLES: ARTICLES, byLevel: byLevel };
})(window);