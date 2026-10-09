/* ============================================================
   content-poetry.js —— 英文诗歌与名句（审美拓展）

   为什么要有这个模块：
     前三个阶段解决"会记、会用"，但语言最终要抵达审美。
     诗歌提供的是语言的**密度**——同样的表达，压缩到最短仍承载完整感受。
     这也是最好的语音练习材料：节奏、重音、连读都藏在诗行里。

   内容分级：
     L1 入门：三行以内的短诗，词汇简单，适合整首背诵
     L2 基础：经典短诗，有明确意象，语言平易
     L3 进阶：名家名篇，需要一点背景知识才能读懂
     L4 精通：难句与典故，适合精读与语言赏析

   每个条目包含：
     text        原文（按行数组）
     cn          译文（逐行对应）
     images      意象清单（这首诗在写什么具象的东西）
     analysis    语言赏析（为什么这样写、有什么手法）
     devices     修辞手法标注
     words       值得记的词（点击可查释义）
     tips        朗读提示（重音与节奏）
   ============================================================ */
(function (global) {
  'use strict';

  var POEMS = [
    /* ==================== L1 入门 ==================== */
    {
      id: 'p-l1-01', lv: 'L1', title: 'A Dream', titleCn: '一个梦',
      poet: 'Claude Fontaine', poetCn: '克洛德·方丹',
      form: '自由诗', minutes: 1,
      text: [
        'If you had a dream,',
        'you would open your eyes,',
        'you would open your heart,',
        'and you would close your mouth.'
      ],
      cn: [
        '如果你有一个梦，',
        '你会睁开双眼，',
        '你会敞开心扉，',
        '你会闭上嘴巴。'
      ],
      images: ['双眼', '心扉', '嘴巴'],
      analysis: '这首诗的核心是**对比**：前三个动作都朝外开放，最后一个却朝内闭合。'
        + '前三个用 open，第四个也用 open 却在前面加 close，形成镜像。'
        + '这种结构上的对称，让意思在最后一个词处反转 —— '
        + '真正的沟通不在于说得多，而在于懂得何时沉默。',
      devices: ['对仗', '反转'],
      words: [
        ['dream', '梦想；梦'], ['heart', '心'], ['mouth', '嘴'],
        ['if', '如果'], ['would', '将（虚拟语气）']
      ],
      tips: '前三个句式完全相同，朗读时保持节奏一致；最后一句稍稍放慢，'
        + '在 close 上加重音，制造转折的力量。'
    },
    {
      id: 'p-l1-02', lv: 'L1', title: 'Let It Be', titleCn: '顺其自然',
      poet: 'Traditional', poetCn: '佚名',
      form: '短诗', minutes: 1,
      text: [
        'Let it be, let it be,',
        'Words are flowing out like endless rain,',
        'Let it be, let it be,',
        'There is so much to see.'
      ],
      cn: [
        '顺其自然，顺其自然，',
        '话语像无尽雨一样流淌而出，',
        '顺其自然，顺其自然，',
        '还有那么多可看的。'
      ],
      images: ['雨', '流动'],
      analysis: '全诗用**流水**这一意象承载情绪。flowing out（流出去）'
        + '把言语比作不受控制的雨点 —— 你无法决定它下在哪里。'
        + '结尾"There is so much to see"用一个 so much 把情绪从忧郁转向开阔，'
        + '这是英语诗常见的"先下沉后抬升"结构。',
      devices: ['重复', '明喻'],
      words: [
        ['let it be', '顺其自然（固定表达）'],
        ['flowing out', '流出；涌出'],
        ['endless', '无尽的'],
        ['rain', '雨'],
        ['so much', '那么多（加强语气）']
      ],
      tips: 'let it be 要轻声、快速，像叹一口气。'
        + 'flowing out 要拖长，突出"不受控"的绵延感。'
    },
    {
      id: 'p-l1-03', lv: 'L1', title: 'The Small Things', titleCn: '微小之事',
      poet: 'Traditional', poetCn: '佚名',
      form: '短诗', minutes: 1,
      text: [
        'Little things mean a lot,',
        'A smile can change a day,',
        'A word can lift someone up,',
        'That is the way we play.'
      ],
      cn: [
        '微小之事意义重大，',
        '一个微笑能改变一天，',
        '一句话能托起某个人，',
        '这就是我们的玩法。'
      ],
      images: ['微笑', '托举'],
      analysis: '这首诗想说明"微小之力"，但最后一句"That is the way we play"'
        + '让整首诗降了调 —— 前三句是郑重的说理，末句用 play（玩耍）'
        + '把重心拉回日常。这不是缺陷，而是英语口语诗歌的常见风格：'
        + '把道理说轻一点，让读者更容易接受。',
      devices: ['排比', '反转'],
      words: [
        ['mean a lot', '意味着很多（重要）'],
        ['lift someone up', '使某人振作'],
        ['change a day', '改变一天']
      ],
      tips: 'mean a lot 中 a lot 稍重读，强调"微小也能重要"这个反差。'
    },
    {
      id: 'p-l1-04', lv: 'L1', title: 'Seasons', titleCn: '四季',
      poet: 'Traditional', poetCn: '佚名',
      form: '四行诗', minutes: 1,
      text: [
        'Spring is here with flowers bright,',
        'Summer comes with days long and light,',
        'Autumn leaves are falling down,',
        'Winter brings a gentle town.'
      ],
      cn: [
        '春天来了，花儿明艳，',
        '夏天到来，白昼悠长而明亮，',
        '秋叶纷纷落下，',
        '冬天带来一座温柔的小城。'
      ],
      images: ['花', '落叶', '冬'],
      analysis: '四季诗是最经典的入门题材，因为它**结构对称**：'
        + '每一行都以季节开头，以形容词结尾。'
        + 'bright / light / down / town 四个尾韵构成完整韵脚，'
        + '读起来像儿歌，适合整首背诵。'
        + '注意 down 和 town 是**不完全韵**（slant rhyme），英语诗歌中很常见。',
      devices: ['排比', '头韵', '不完全韵'],
      words: [
        ['bright', '明亮的'], ['falling down', '落下'],
        ['gentle', '温柔的'], ['long and light', '悠长而明亮']
      ],
      tips: '这是一个韵文，四行要读出相同的节拍，'
        + '落在 bright / light / down / town 上的韵脚要清晰。'
    },

    /* ==================== L2 基础 ==================== */
    {
      id: 'p-l2-01', lv: 'L2', title: 'Invictus', titleCn: '绝不低头',
      poet: 'William Ernest Henley', poetCn: '威廉·恩内斯特·亨利',
      form: '自由诗', minutes: 3,
      context: '作者 21 岁时患骨结核病面临截肢，写下这首诗。'
        + '"Invictus" 是拉丁语"征服/不受束缚"的意思 —— 与词根模块的 in-/vict 呼应。',
      text: [
        'Out of the night that covers me,',
        'Black as the pit from pole to pole,',
        'I thank whatever gods may be',
        'For my unconquerable soul.',
        '',
        'I go wherever you may go,',
        'My unconquerable soul,',
        'I bear whatever you may bear,',
        'My unconquerable soul.'
      ],
      cn: [
        '从我笼罩我的夜色中走出，',
        '漆黑如从一极到另一极的深井，',
        '我感谢一切可能存在的诸神，',
        '赐予我不可征服的灵魂。',
        '',
        '你去何处，我便去何处，',
        '我不可征服的灵魂，',
        '你承受什么，我便承受什么，',
        '我不可征服的灵魂。'
      ],
      images: ['夜', '深井', '灵魂'],
      analysis: '这首诗的核心是**两个重复段落的严格对称**：'
        + '"I go wherever you may go / I bear whatever you may bear" —— '
        + '你去我随，你担我担。这种对称不是重复，而是**承诺**的句法形式。\n\n'
        + '语言上最值得学的是 unconquerable 这个词：'
        + 'un-（否定）+ conquer（征服）+ -able（能被…的）= 不可被征服的。'
        + '一个形容词承载了整首诗的标题与主旨。\n\n'
        + '注意 Out of 是"从…中出来"，这个介词短语把诗人从黑暗中"提取"出来，'
        + '这个空间感的转换是全诗的戏剧动作。',
      devices: ['对仗', '重复', '头韵', '长句'],
      words: [
        ['invictus', '不屈服的（拉丁语）'],
        ['unconquerable', '不可征服的'],
        ['pole to pole', '从一极到另一极'],
        ['bear', '承受；承担'],
        ['whatever', '无论什么']
      ],
      tips: '这是首强节奏的诗。朗读时前半段压抑、后半段昂扬。'
        + 'My unconquerable soul 在每段末尾出现，'
        + '是全诗的"落脚点"，务必读得饱满有力。'
    },
    {
      id: 'p-l2-02', lv: 'L2', title: 'If —', titleCn: '如果……',
      poet: 'Rudyard Kipling', poetCn: '吉卜林',
      form: '自由诗', minutes: 4,
      context: '吉卜林为儿子写的一首教导诗。'
        + '"If" 在这里是假设语气，不是"如果"的日常用法 —— '
        + '注意与虚拟语气从句的呼应。',
      text: [
        'If you can keep your head when all about you',
        'Are losing theirs and blaming it on you,',
        'If you can trust yourself when all men doubt you,',
        'But make allowance for their doubting too;',
        'If you can wait and not be tired by waiting,',
        'Or being lied about, don\'t deal in lies,',
        'Or being hated, don\'t give way to hating,',
        'And yet don\'t look too good, nor talk too wise.'
      ],
      cn: [
        '如果你能保持冷静，而周围所有人',
        '正在失去他们的理智并归咎于你，',
        '如果你能信任自己，而所有人均在怀疑你，',
        '但也请为他们的怀疑留出余地；',
        '如果你能等待而不因等待而疲惫，',
        '或被谎言中伤，却不以谎言回报，',
        '或被憎恨，却不因憎恨而屈服，',
        '同时又不过分自许，不说得过于智慧。'
      ],
      images: ['头脑', '等待', '谎'],
      analysis: '这首诗是英语**条件句**的教科书示范。全诗八行都是 '
        + '"If you + 动词原形" 开头，构成假设语境的层层递进。\n\n'
        + '结构上最精彩的是每行的转折（but / yet）：'
        + '前面说"要承受"，后面立刻说"但不要过度"。'
        + '这种 "A, but not B" 的让步—限制结构，让诗避免了说教感。\n\n'
        + '语言点：make allowance for（体谅、考虑到）、'
        + 'give way to（屈服于）、deal in（从事/涉足）。'
        + 'deal in lies 是最容易用错的搭配 —— deal in 指"掺有"，'
        + '而 deal with 才是"处理"，deal out 才是"分发"。',
      devices: ['条件句', '排比', '转折', '头韵'],
      words: [
        ['keep your head', '保持冷静（成语）'],
        ['blaming it on you', '把责任推给你'],
        ['make allowance for', '体谅；考虑到'],
        ['give way to', '屈服于'],
        ['deal in', '掺有；从事（某类活动）'],
        ['look too good', '显得太完美（自许）']
      ],
      tips: '朗读节奏是"两个半行 + 两个半行"：'
        + '前半行是"If you…"的铺垫，后半行是"you + 动词"的重心。'
        + 'but / yet 之前要微顿，这是这首诗的呼吸点。'
    },
    {
      id: 'p-l2-03', lv: 'L2', title: 'A Noiseless Patient Spider', titleCn: '无声的耐心的蜘蛛',
      poet: 'Walt Whitman', poetCn: '沃尔特·惠特曼',
      form: '自由诗', minutes: 3,
      context: '惠特曼是《草叶集》作者，主张诗歌应像草一样自然生长。'
        + '此诗写的是他"注意到"一个意象，并因此领悟自己的创作。',
      text: [
        'A noiseless patient spider,',
        'I mark\'d where on a little promontory it stood isolated,',
        'Mark\'d how to explore the vacant vast surrounding,',
        'It launch\'d forth filament, filament, filament, out of itself,',
        'Ever unreeling them, ever tirelessly speeding them.',
        '',
        'And you O my soul where you stand,',
        'Surrounded, detached, in measureless oceans of space,',
        'CEASELESSLY musing, venturing, throwing, seeking the spheres to connect them,',
        'Till the bridge you will need be form\'d, till the ductile anchor hold you,',
        'Till the gossamer thread you fling catch somewhere, O my soul.'
      ],
      cn: [
        '一只无声而耐心的蜘蛛，',
        '我标记出它站在一处小小海角上，孤零零的，',
        '标记出它如何探索周围空旷无垠的空间，',
        '它吐出丝，丝，丝，从自己身上不断抽出，',
        '永远不停地抽出，永远不停地飞速射出。',
        '',
        '而你啊，我的心魂，你伫立在那里，',
        '被环绕着，被分离着，处于无垠的空间之海里，',
        '不停地沉思着，冒险着，投射着，寻觅着诸星球要把它们连接，',
        '直到你需要的桥建成，直到那可塑的锚能稳住你，',
        '直到你抛出的游丝能抓住某处，啊，我的心魂。'
      ],
      images: ['蜘蛛', '丝', '海角', '桥', '锚'],
      analysis: '这是英语诗歌中**最著名的长句实验之一**。'
        + '倒数第二行长达 60 余词，惠特曼故意用超长句模拟蜘蛛不断抛丝的动作 —— '
        + '形式本身就是内容。\n\n'
        + '诗中的动词极富变化：launch、unreel、speed、fling，'
        + '全部是动态的、向下坠落或向外抛出的动作。'
        + '而名词则相反：oceans、spaces、spheres，都是无边无际的容器。'
        + '动词向下、名词向外，这个张力构成全诗的动力。\n\n'
        + '末句的 gossamer thread（游丝）呼应开头的 filament（丝），'
        + '形成环形结构：诗人从蜘蛛身上认出了自己。',
      devices: ['长句', '重复', '通感', '环形结构'],
      words: [
        ['noiseless', '无声的'],
        ['promontory', '海角；岬角'],
        ['filament', '细丝；纤维'],
        ['unreel', '放出（卷轴）'],
        ['ceaselessly', '不停地'],
        ['ductile', '可塑的；有延展性的'],
        ['gossamer', '游丝；轻薄的'],
        ['venturing', '冒险；敢于（现在分词）']
      ],
      tips: '这首诗不适合背诵，适合**分段朗读**。'
        + '每一行一口气读到底，不要在行中断开。'
        + '注意连读：it stood / how to explore / you will need 都要读成连音。'
    },

    /* ==================== L3 进阶 ==================== */
    {
      id: 'p-l3-01', lv: 'L3', title: 'Stopping by Woods on a Snowy Evening', titleCn: '雪夜林边停驻',
      poet: 'Robert Frost', poetCn: '罗伯特·弗罗斯特',
      form: '十四行诗', minutes: 4,
      context: '弗罗斯特是美国 20 世纪重要诗人。他偏好用日常场景承载复杂情绪 —— '
        + '这首诗写的是一个人在雪夜停下脚步，不肯继续赶路。',
      text: [
        'Whose woods these are I think I know.',
        'His house is in the village though;',
        'He will not see me stopping here',
        'To watch his woods fill up with snow.',
        '',
        'My little footstool only a',
        'Though I have rambled far and long,',
        'And deeply with the silent creek',
        'Have I kept meeting with the moon.',
        '',
        'The woods are lovely, dark and deep,',
        'But I have promises to keep,',
        'And miles to go before I sleep,',
        'And miles to go before I sleep.'
      ],
      cn: [
        '我知道这是谁的树林，',
        '虽然他的房子在村子里；',
        '他不会看见我在这里停下，',
        '看着他的树林渐渐积满白雪。',
        '',
        '这只是我的小小的落脚凳，',
        '尽管我已经漫游得又远又久，',
        '而与那条寂静的小溪，',
        '我已多次相遇，与月亮同行。',
        '',
        '树林可爱、幽暗而深邃，',
        '但我还有承诺要守，',
        '还有 miles 要赶，才能安睡，',
        '还有 miles 要赶，才能安睡。'
      ],
      images: ['雪', '林', '月', '小溪', '脚步'],
      analysis: '这首诗的全部张力来自**两条路的冲突**：'
        + '树林代表"停下来"的诱惑，承诺代表"必须走"的现实。\n\n'
        + '结构上最著名的是**末两行重复**：'
        + '"And miles to go before I sleep" 出现两次，'
        + '但第一次像陈述，第二次像说服自己。重复在此不是修辞，是**心理**。\n\n'
        + '值得注意的是第 6 行的 meter（格律）突然打乱：'
        + '"My little footstool only a" 突然多出三个音节，'
        + '在整齐的格律中造成一个踉跄 —— 这正是诗人在雪地里踩空一脚的感觉。'
        + '形式上的失控对应心理的失衡，这是现代诗的典型手法。',
      devices: ['重复', '格律突变', '象征', '头韵'],
      words: [
        ['ramble', '漫游；闲逛'],
        ['footstool', '脚凳'],
        ['keep promises', '遵守承诺（固定搭配）'],
        ['before I sleep', '在我入睡前（也可理解为"还活着"）'],
        ['the silent creek', '寂静的小溪']
      ],
      tips: '前四行要平稳克制，读出"我知道"的淡然。'
        + '第 6 行 footstool 后故意停顿一下，模拟踩空。'
        + '末两行第二遍要把 sleep 拖长，声音里透出疲惫与自我说服。'
    },
    {
      id: 'p-l3-02', lv: 'L3', title: 'She Walks in Beauty', titleCn: '她走在光里',
      poet: 'Lord Byron', poetCn: '拜伦勋爵',
      form: '节选', minutes: 3,
      context: '拜伦以写爱情与孤独著称。这首诗描写一位女性身上"光"的流动。',
      text: [
        'She walks in beauty, like the night',
        'Of cloudless climes and starry skies;',
        'And all that\'s best of dark and bright',
        'Meet in her aspect and her eyes;',
        'Thus mellowed to that tender light',
        'By which heaven to happy eyes',
        'She carries sunshine from her face,'
      ],
      cn: [
        '她走在光里，如同夜色，',
        '那无云的国度，那缀满繁星的天穹；',
        '而黑暗与光明中最美的部分，',
        '都在她的容貌与她的眼睛里交汇；',
        '于是柔和成那温柔的微光，',
        '借着它，天空为幸福的眼睛',
        '把阳光从她脸上带走。'
      ],
      images: ['夜', '星', '光', '眼睛', '阳光'],
      analysis: '这首诗的核心是**通感（synaesthesia）**：'
        + '把视觉的光写成可以"携带"（carries sunshine）的东西。'
        + 'sunnshine from her face 被"带走"，说明她一出现就把光吸走了。\n\n'
        + '第二行"无云的国度、缀星的天穹"其实是两个明喻的叠加：'
        + 'like the night of cloudless climes，'
        + 'like starry skies。诗人把她比作"夜空"，'
        + '但夜空是暗的，他随即说"dark and bright 交汇在她身上" —— '
        + '把矛盾放在一句里，这就是这首诗的技巧核心。\n\n'
        + '最后一行是全诗的点睛：她不是自己发光，'
        + '而是从天上"取来"阳光再分发给别人。',
      devices: ['明喻', '通感', '矛盾修辞'],
      words: [
        ['clime', '气候；地域（书面语）'],
        ['cloudless', '无云的'],
        ['aspect', '容貌；面貌'],
        ['mellowed', '变得柔和（的）'],
        ['tender', '温柔的'],
        ['carries sunshine', '带着阳光']
      ],
      tips: '这首诗的节奏是二音步与三音步交替（amarameter），'
        + '读起来像轻微的摇摆。night 与 skies 押韵，bright 与 eyes 押韵，'
        + 'light 与 eyes 相隔一行 —— 朗读时让这些韵脚稍微延长。'
    },
    {
      id: 'p-l3-03', lv: 'L3', title: 'The Road Not Taken', titleCn: '未选择的路',
      poet: 'Robert Frost', poetCn: '罗伯特·弗罗斯特',
      form: '四节自由诗', minutes: 4,
      context: '这首诗常被误读为"勇敢选择冒险道路"。'
        + '实际上末两节恰恰说明：两条路"磨损得一模一样"，'
        + '差别只存在于讲述者的想象里。这是全诗最精妙的地方。',
      text: [
        'Two roads diverged in a yellow wood,',
        'And sorry I could not travel both',
        'And be one traveler, long I stood',
        'And looked down one as far as I could',
        'To where it bent in the undergrowth;',
        '',
        'Then took the other, as just as fair,',
        'And having perhaps the better claim,',
        'Because it was grassy and wanted wear;',
        'Though as for that the passing there',
        'Had worn them really about the same,',
        '',
        'And both that morning equally lay',
        'In leaves no step had trodden black.',
        'Oh, I kept the first for another day!',
        'Yet knowing how way leads on to way,',
        'I doubted if I should ever come back.',
        '',
        'I shall be telling this with a sigh',
        'Somewhere ages and ages hence:',
        'Two roads diverged in a wood, and I—',
        'I took the one less traveled by,',
        'And that has made all the difference.'
      ],
      cn: [
        '两条路在金黄的树林里分岔，',
        '而我抱歉不能同时走过两条，',
        '做一名旅行者，我久久伫立，',
        '尽力向一条路望到尽头，',
        '直到它弯入那片灌木丛；',
        '',
        '于是我走了另一条 equally fair，',
        '而且大概它有更好的理由，',
        '因为它长满青草，渴望被踏过；',
        '虽然就那里的 passersby 而言，',
        '其实两条路都同样磨损；',
        '',
        '而那天早晨，两条路 equally lay，',
        '在落叶中，没有脚步踏黑过。',
        '啊，我把第一条留给了另一天！',
        '但我知道路连着路，',
        '我怀疑自己是否还能回来。',
        '',
        '我会在某处，叹了口气，讲起这事：',
        '久远之后，许久许久：',
        '两条路在树林里分岔，而我——',
        '我走了人迹更少的那一条，',
        '而这一切的差别，就源于此。'
      ],
      images: ['分岔', '树林', '落叶', '脚步'],
      analysis: '这首诗的教学价值极高，因为它**教会你如何不被表面叙事欺骗**。\n\n'
        + '第 10 行 Had worn them really about the same —— '
        + '两条路其实磨损得完全一样。'
        + '这意味着"我选了更少人走的路"这个叙述本身就是自我美化。\n\n'
        + '更微妙的是第 16 行 Yeah I kept the first for another day —— '
        + '诗人明知自己在自欺（用 Yeah 一个词就露馅了），却仍这样讲。\n\n'
        + '结尾 that has made all the difference 是反讽的顶点：'
        + '诗里并没有证据表明这条路真的带来了不同，'
        + '但叙述者会这样讲一辈子。\n\n'
        + '语言教学重点：diverged、bent、undergrowth、trodden、'
        + 'ages and ages、hence 这几个词共同营造出"路的选择"的意象。'
        + '其中 diverged 与 ages 都来自拉丁语词根（di-/ver- 与 aet-）。',
      devices: ['反讽', '重复', '象征', '叙事张力'],
      words: [
        ['diverge', '分岔；背离'],
        ['undergrowth', '下层灌木；林下植物'],
        ['claim', '权利；理由'],
        ['trodden', '被踩踏过的（tread 的过去分词）'],
        ['hence', '因此；从此（正式）'],
        ['sigh', '叹息'],
        ['passersby', '路人（passer + by）']
      ],
      tips: '注意英文标点在原诗中的位置与中文习惯不同：'
        + 'And sorry I could not travel both / 句末没有标点，是诗行的有意留白。'
        + '朗读时保留这种停顿，不要补上逗号。'
    },
    {
      id: 'p-l3-04', lv: 'L3', title: 'Ozymandias', titleCn: '奥曼德斯',
      poet: 'Percy Bysshe Shelley', poetCn: '珀西·比希·雪莱',
      form: '十四行诗', minutes: 4,
      context: 'Ozymandias 是希腊语对埃及法老 Ramses II 的称呼。'
        + '雪莱借用它写权力如何崩塌 —— 这与词根模块的"权力/统治"词族呼应。',
      text: [
        'I met a traveller from an antique land',
        'Who said: "Two vast and trunkless legs of stone',
        'Stand in the desert. Near them, on the sand,',
        'Half sunk, a shattered visage lies, whose frown,',
        'And wrinkled lip, and sneer of cold command,',
        'Tell that its sculptor well those passions read',
        'Which yet survive, stamped on these lifeless things,',
        'The hand that mocked them, and the heart that fed;',
        'And on the sand, half sunk, a broken column lies,',
        'Looking on with quenchless smile',
        'And round its base the wild grass and the ruin',
        'Spread their green mantle, where the ruins decay.',
        '',
        'Nothing beside remains. Round the decay',
        'Of that colossal wreck, boundless and bare',
        'The lone and level sands stretch far away.'
      ],
      cn: [
        '我遇见一位来自古老国度的旅人，',
        '他说："两座巨大而没有躯干的石腿',
        '矗立在沙漠里。在它们近旁，沙地上',
        '半陷着一张破碎的脸，那蹙眉，',
        '那皱唇，那冷峻的轻蔑，',
        '告诉人们雕刻者曾读懂这些激情，',
        '它们依然存留，印在这些无生命之物上，',
        '那嘲讽的手，那喂养它们的心；',
        '而在沙上，半陷着一根断裂的柱，',
        '带着永不泯灭的微笑看着，',
        '柱基四周，野草与废墟',
        '铺开它们的绿 mantle，在那残垣腐朽处。',
        '',
        '别无他物留存。在那',
        '巨大残骸的腐朽周围，无边而赤裸，',
        '那孤独而平坦的沙，向远方延伸。'
      ],
      images: ['石腿', '破碎的脸', '断柱', '绿草', '荒沙'],
      analysis: '这首诗是英语**最适合学习叙事视角**的文本之一。\n\n'
        + '全诗是一个**框架结构**：诗人遇见旅人，旅人讲述他见到的东西。'
        + '这叫嵌套叙事（frame narrative），读者要同时站在两个视角上。\n\n'
        + '语言上最震撼的是第 10 行：'
        + 'the wild grass and the ruin / Spread their green mantle —— '
        + '用 mantle（斗篷、覆盖物）这个词，让荒草"穿上"了死者华美的衣饰，'
        + '把自然写成了覆盖文明的裹尸布。\n\n'
        + '结尾三行是英语诗歌史上最著名的结尾之一：'
        + 'Nothing beside remains（旁边什么也没留下），'
        + '却用 boundless and bare（无边而赤裸）与前文所有的具体形成对照。'
        + '诗人最终什么都没剩给你 —— 这正是这首诗的警示。',
      devices: ['框架叙事', '象征', '比喻（mantle）', '对比'],
      words: [
        ['antique land', '古老的国度（antiquated sense）'],
        ['trunkless', '无躯干的'],
        ['visage', '面孔（书面语，比 face 更庄重）'],
        ['sculptor', '雕刻家'],
        ['quenchless', '不可熄灭的；不屈的'],
        ['colossal', '巨大的'],
        ['wreck', '残骸；严重破坏'],
        ['mantle', '斗篷；覆盖物']
      ],
      tips: '朗读时把旅人引语里的部分（"Two vast..."到 "the heart that fed"）'
        + '读出转述的语气，与诗人自己的声音区分开。'
        + '结尾三行要读得平、冷、干净 —— 这正是诗意的所在。'
    },

    /* ==================== L4 精通 ==================== */
    {
      id: 'p-l4-01', lv: 'L4', title: 'Hope is the thing with feathers', titleCn: '希望是长着羽毛的东西',
      poet: 'Emily Dickinson', poetCn: '艾米莉·狄金森',
      form: '抒情诗', minutes: 4,
      context: '狄金森一生只发表约十首诗，生前默默无闻。'
        + '她的诗以奇特的意象和省略的语法著称，是英语诗歌最难也最迷人的入口。',
      text: [
        'Hope is the thing with feathers -',
        'That perches in the soul -',
        'And sings the tune without the words -',
        'And never stops - at all -',
        '',
        'And sweetest - in the Gale - is heard -',
        'And sore must be the storm -',
        'That could abash the little Bird',
        'That kept so many warm -',
        '',
        'I\'ve heard it in the chillest land -',
        'And on the strangest Sea -',
        'Yet - never - in Extremity,',
        'It asked a crumb - of me.'
      ],
      cn: [
        '希望是长着羽毛的东西 -',
        '栖息在灵魂里 -',
        '唱着没有歌词的曲调 -',
        '从不停歇 - 从不 -',
        '',
        '而最甜的 - 在风暴里 - 被听见，',
        '而那风暴一定很猛烈 -',
        '那能使这小小鸟儿羞怯的东西，',
        '它却让那么多温暖得以保持 -',
        '',
        '我曾在最冷之地听见它 -',
        '也在最奇异的海面上 -',
        '但 - 从不 - 在极端的境地，',
        '它向我乞求过一丁点 - 面包屑。'
      ],
      images: ['羽毛', '鸟', '灵魂', '风暴', '面包屑'],
      analysis: '这首诗的核心是**通感与拟人**的双重叠加：'
        + 'hope（抽象概念）被写成 a thing with feathers（长羽毛的东西），'
        + '进而变成一只 bird（鸟）。\n\n'
        + '最精妙的是末行 It asked a crumb - of me：'
        + '希望不索取任何东西，只"要了一丁点面包屑"。'
        + 'crumb 与 me 的轻，与前面 gales、Extremity 的重形成极端反差。'
        + '整首诗的力量全部压缩在这个轻描淡写里。\n\n'
        + '**语法赏析**：狄金森大量使用破折号（-）打断句子，'
        + '这在标准英语里不合规范，但恰恰制造了"思绪停顿、意识流动"的节奏。'
        + '读的时候要**在破折号处明显停顿**，否则会失去全诗的呼吸感。\n\n'
        + '注意 and sore must be the storm 用 must 表推测（一定），'
        + '这是虚拟语气的 should/must 表"推测"用法，与"义务"无关。',
      devices: ['通感', '拟人', '破折号停顿', '对比'],
      words: [
        ['perch', '栖息（鸟停在小枝上）'],
        ['abash', '使羞怯；使脸红（罕见词，狄金森偏爱）'],
        ['gale', '大风；狂风（比 wind 强）'],
        ['chillest', '最寒冷的'],
        ['extremity', '极端； extremities 四肢'],
        ['crumb', '面包屑；碎屑'],
        ['sore', '剧烈的；疼痛的（此处副词修饰 must be）']
      ],
      tips: '**破折号必须停顿**——这是读懂这首诗的关键。'
        + '朗读节奏为：短句—停顿—短句—停顿。'
        + '末行 crumb of me 要读得极轻，与前文的 storm 形成反差。'
    },
    {
      id: 'p-l4-02', lv: 'L4', title: 'The Second Coming', titleCn: '第二次降临',
      poet: 'W. B. Yeats', poetCn: '叶芝',
      form: '自由诗', minutes: 4,
      context: '写于 1919 年爱尔兰独立战争期间。'
        + '叶芝在诗中反复提到"旋转的鸽子"（gyre），'
        + '这是他宇宙观的核心意象 —— 历史像陀螺一样周期性旋转。',
      text: [
        'Turning and turning in the widening gyre',
        'The falcon cannot hear the falconer.',
        'Wind, Fire and Water',
        'All perfect, in their station.',
        'Falling and falling',
        'The turn of the world',
        'Watched by the same eye',
        'Always the same eye.',
        '',
        'Things fall apart; the centre cannot hold;',
        'And from the shifting dusty Places',
        'And from the dispersing cloud',
        'The bird of the air is-quick,',
        'And from the Next,',
        'The word "release" is spoken,',
        'And in some quarters of the world',
        'The people are dancing, and dancing, and dancing,',
        'And dancing, and dancing, and dancing.'
      ],
      cn: [
        '在不断扩大的旋转里，',
        '转呀转 falcon 再也听不见猎人。',
        '风、火与水，',
        '各自完美，在各自的岗位。',
        '落呀落，',
        '世界的旋转，',
        '被同一只眼睛注视，',
        '永远是同一只眼睛。',
        '',
        '事物分崩离析；中心无法支撑；',
        '从那移动的尘世之地，',
        '从那四散的云中，',
        '空中的鸟急速掠过，',
        '而从"来世"中，',
        '"解脱"这个词被说出，',
        '而在世界的某些角落，',
        '人们正在跳舞，跳着，跳着，',
        '跳着，跳着，跳着。'
      ],
      images: ['旋转', '猎鹰', '猎人', '鸟', '舞蹈'],
      analysis: '这首诗是 20 世纪英语诗歌的里程碑，理解它需要三层：\n\n'
        + '**第一层：意象。** 首尾形成闭环 —— '
        + '开头是 falcon 在 gyre（螺旋）中越飞越远，听不见猎人；'
        + '结尾是人��无止境地 dancing，'
        + '同样听不见任何呼唤。开头与结尾都是"与自身隔绝"。\n\n'
        + '**第二层：典故。** bird of the air 呼应圣灵（Holy Spirit），'
        + '与"release（解脱）"一起构成宗教救赎的暗示。'
        + '而"事物分崩离析"直接呼应叶芝自己参与写的爱尔兰独立宣言。\n\n'
        + '**语言赏析**：结尾四个 "and dancing" 构成**递进的重复**。'
        + '第一次是叙述，第二次是强调，第三次是失控，第四次是虚无。'
        + '语法上完全平行，意义却层层塌陷 —— '
        + '这是英语诗歌中重复手法最极致的示范。\n\n'
        + '注意 Things fall apart 是**分开**的（不是 falls apart）：'
        + '主语 Things 是复数但被视为不可数 collective，'
        + '此处用复数动词是古体用法，叶芝出于诗意而非语法正确性。',
      devices: ['循环结构', '递进重复', '典故', '象征'],
      words: [
        ['gyre', '旋转；螺旋（来自希腊语 gyros，词根与 gyroscope 同源）'],
        ['falconer', '猎人（驯鹰人）'],
        ['station', '位置；岗位'],
        ['shifting dusty Places', '移动的尘世之地'],
        ['disperse', '驱散；散开'],
        ['quarters', '地区；区域'],
        ['release', '解脱；释放']
      ],
      tips: '这首诗的节奏由**音节数控制**，不押韵。'
        + 'Turning and turning 要转得越来越快（陀螺加速），'
        + '而结尾的 and dancing 越读越快、越读越轻，'
        + '像回旋的余韵慢慢消失。'
    },
    {
      id: 'p-l4-03', lv: 'L4', title: 'When We Two Parted', titleCn: '当我们俩分手时',
      poet: 'Lord Byron', poetCn: '拜伦勋爵',
      form: '节选', minutes: 3,
      context: '拜伦二十一岁写下这首诗，据说是他与初恋分离后的真实感受。'
        + '诗中的冷与痛，十九岁的语气已见端倪。',
      text: [
        'When we two parted,',
        'In silence and with grief,',
        'Our hearts it severed,',
        'And words withstood,',
        '',
        'And yet I knew not what I had to do',
        'In that hour when I felt my heart be so cold',
        'And the words I spoke with, they seemed',
        'To have been words of the heart.'
      ],
      cn: [
        '当我们俩分手时，',
        '在沉默与哀伤中，',
        '我们的心被劈开，',
        '而言语未能靠近，',
        '',
        '可那时刻当我感到心如此冰冷，',
        '我说出口的话，它们似乎',
        '是发自心底的言语。'
      ],
      images: ['沉默', '碎裂', '冷', '言语'],
      analysis: '这首诗的力量在于**语法层面的自我拆解**。\n\n'
        + '看这三行：\n'
        + 'Our hearts it severed —— 主动宾语倒装，'
        + '正常语序应为 it severed our hearts。'
        + '诗人用倒装把动作的主语（it，即分离本身）顶到最前，'
        + '让"它"看起来才是施动者，而心只是被动的对象。\n\n'
        + 'And words withstood —— withstood 在这里不是"抵挡"，'
        + '而是**站住了、隔开了**。words 成了障碍物。'
        + '这个动词的选择极其精准：言语本该连接，却成了阻隔。\n\n'
        + '结尾更狠：I knew not what I had to do（我不知道该怎么办），'
        + '紧接着 yet I knew（然而我知道）—— '
        + '两个 knew 构成逻辑上的自我矛盾，'
        + '这不是逻辑错误，是情绪的真实：**理性上不知所措，本能上却已经在行动**。',
      devices: ['倒装', '矛盾修辞', '通感（心冷）'],
      words: [
        ['sever', '割裂；分离（尤指关系）'],
        ['withstand', '抵挡；承受（此处意为"隔开、阻隔"）'],
        ['and yet', '然而；尽管如此（语气较强）'],
        ['spoke with', '说出（with 是完成式的标志）']
      ],
      tips: '注意 1850 年前的拼写与现代不同（severed 作 severed）。'
        + '朗读时前四行要极度克制，'
        + '几乎不用语气，靠停顿推进 —— 那种"说不下去"的感觉。'
        + '结尾 yet 要转折加重，透出不甘。'
    }
  ];

  /* ============================================================
     英文名句（prose quotes）—— 与诗歌互补
     ============================================================ */
  var QUOTES = [
    {
      id: 'q-01', text: 'The only way to do great work is to love what you do.',
      cn: '做出伟大工作的唯一方法，是热爱你所做的事。',
      author: 'Steve Jobs', authorCn: '史蒂夫·乔布斯',
      from: '斯坦福大学毕业演讲',
      tags: ['职业', '热情'],
      analysis: '结构上是一个"唯一"式强调：'
        + 'The only way to do great work is to love what you do。'
        + '把"方法"限定为一条，再把这条唯一的路指向"热爱"，'
        + '把职业建议提升到了价值观层面。'
        + '句中 what you do 是动宾结构，do 在口语里有"做事"的泛指义，'
        + '比 work 更口语、更贴近听众。'
    },
    {
      id: 'q-02', text: 'Not all those who wander are lost.',
      cn: '并非所有漫游者都是迷失的。',
      author: 'J. R. R. Tolkien', authorCn: '托尔金',
      from: '《魔戒》',
      tags: ['探索', '自我认同'],
      analysis: '这是一个**双重否定**的经典用法：'
        + 'Not all + who + are lost → 并非所有人都是迷失的。'
        + '重点在 all 的位置 —— '
        + '否定的是"全体"，不是"个别"，所以逻辑上留下了一个"例外"，'
        + '而这个例外就是你。'
        + '这类句子的力量在于它既是安慰，也是挑衅。'
    },
    {
      id: 'q-03',
      text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
      cn: '我们由自己反复做的事构成。因此卓越不是一种行为，而是一种习惯。',
      author: 'Will Durant', authorCn: '威尔·杜兰特',
      from: '《如何度过一生》',
      tags: ['习惯', '自我提升'],
      analysis: 'will Durant 名言的出处常被误传，实为误引自其妻 '
        + 'Martha Durant 的《How We Eat》。'
        + '引用时写清楚作者更严谨。\n\n'
        + '语言上第一句用被动语态 are what we repeatedly do，'
        + '强调"我们由行为构成"，把主语 we 与动词 are 拉近，'
        + '强调这是定义而非描述。'
        + '第二句用 not an act but a habit 做二分对比，'
        + '把一次性的"行为"与持续性的"习惯"对立起来。'
    },
    {
      id: 'q-04', text: 'Simplicity is the ultimate sophistication.',
      cn: '简约是终极的复杂。',
      author: 'Leonardo da Vinci', authorCn: '列奥纳多·达·芬奇',
      from: '据称（真实性存疑）',
      tags: ['设计', '美学'],
      analysis: '这句话常被设计界引用，但**没有可靠出处** —— '
        + '达·芬奇从未留下这句话的记录。'
        + '使用时最好注明"广泛流传但出处存疑"。\n\n'
        + '语言本身的精巧值得注意：'
        + 'simplicity（简单）与 sophistication（复杂精致）'
        + '构成反义对立，ultimate（终极的）'
        + '把逻辑推到极致 —— 复杂的最高境界是简单。'
        + '这与建筑学中"少即是多"的理念同源。'
    },
    {
      id: 'q-05', text: 'The root of all evil is the tongue.',
      cn: '一切恶之根源在于舌。',
      author: '传统格言（常见于道德哲学文献）',
      from: '英语谚语传统',
      tags: ['言语', '道德'],
      analysis: '这句话的句式值得学：'
        + 'The root of + 抽象名词（all evil）+ is + the tongue。'
        + 'The root of 后接**不可数名词** all evil，表示"……的根源"，'
        + '中间不加复数词 ——'
        + '注意与 "the roots of plants"（植物的根）区分，'
        + '后者 root 用复数。这是英语搭配的固定差异。'
    },
    {
      id: 'q-06', text: 'It is not that we have little time, but more that we waste a good deal of it.',
      cn: '并非我们没有太多时间，而是我们浪费了太多。',
      author: 'Seneca', authorCn: '塞涅卡',
      from: '《论生命之短暂》',
      tags: ['时间管理', '哲学'],
      analysis: '古罗马哲学家塞涅卡的这句话是英语时间管理写作的常被引用来源。\n\n'
        + '句式亮点：It is not that A, but more that B —— '
        + 'not that 与 but more that 的搭配，'
        + '把"缺少时间"的判断彻底转向"浪费时间"。'
        + '其中 more 在此不是"更多"，而是"更是"。'
        + '这种 not...but more 的结构在英语书面语中很常见，'
        + '用于纠正对方的判断。'
    }
  ];

  /* ============================================================
     导出
     ============================================================ */
  var PoetryIndex = {
    all: function () { return POEMS; },

    quotes: function () { return QUOTES; },

    /** 按难度分级 */
    byLevel: function (lv) {
      return POEMS.filter(function (p) { return p.lv === lv; });
    },

    /** 按主题标签（名句） */
    quotesByTag: function () {
      var g = {};
      QUOTES.forEach(function (q) {
        (q.tags || []).forEach(function (t) {
          if (!g[t]) g[t] = [];
          g[t].push(q);
        });
      });
      return g;
    },

    /** 全文检索：标题、原文、译文、赏析 */
    search: function (kw) {
      var k = String(kw || '').trim().toLowerCase();
      if (!k) return [];
      return POEMS.filter(function (p) {
        return (p.title || '').toLowerCase().indexOf(k) >= 0
          || (p.titleCn || '').indexOf(k) >= 0
          || (p.poet || '').toLowerCase().indexOf(k) >= 0
          || (p.text || []).join(' ').toLowerCase().indexOf(k) >= 0
          || (p.cn || []).join(' ').indexOf(k) >= 0
          || (p.analysis || '').indexOf(k) >= 0;
      }).concat(QUOTES.filter(function (q) {
        return (q.text || '').toLowerCase().indexOf(k) >= 0
          || (q.cn || '').indexOf(k) >= 0
          || (q.author || '').toLowerCase().indexOf(k) >= 0;
      }));
    },

    /** 取一首诗的完整朗读文本（用于跟读） */
    readText: function (id) {
      var p = POEMS.filter(function (x) { return x.id === id; })[0];
      return p ? p.text.join(' ') : '';
    },

    /** 统计 */
    stats: function () {
      var lines = POEMS.reduce(function (n, p) { return n + (p.text || []).length; }, 0);
      var words = POEMS.reduce(function (n, p) {
        return n + (p.text || []).join(' ').split(/\s+/).filter(Boolean).length;
      }, 0);
      return {
        poems: POEMS.length,
        quotes: QUOTES.length,
        lines: lines,
        words: words,
        levels: ['L1', 'L2', 'L3', 'L4'].map(function (lv) {
          return lv + ':' + POEMS.filter(function (p) { return p.lv === lv; }).length;
        }).join(' ')
      };
    }
  };

  global.PoetryIndex = PoetryIndex;
})(window);
