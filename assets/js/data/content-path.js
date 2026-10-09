/* ============================================================
   content-path.js —— 等级路径 + 行为心理机制库
   四级统一体系贯穿词汇/口语/阅读三模块：
     L1 入门 → L2 基础 → L3 进阶 → L4 精通
   每级含：目标、词汇量门槛、能力指标、解锁条件、里程碑
   ============================================================ */
(function (global) {
  'use strict';

  /* ------------------------------------------------------------
     一、四级路径定义
     ------------------------------------------------------------ */
  var LEVELS = [
    {
      id: 'L1', name: '入门', en: 'Starter', months: '第 1-3 月',
      color: '#22b07d',
      goal: '建立"能开口、能听懂最简单内容"的基础生存能力',
      vocabTarget: 331,          // 主动掌握词量
      vocabPool: 331,            // 本级词库容量
      abilityTargets: {
        listening: 40, speaking: 30, reading: 40, writing: 25,
        grammar: 30, vocab: 35
      },
      dimensions: [
        { key: 'listening', name: '听力理解', target: 40, desc: '能听懂含 90% 已知词的慢速句子' },
        { key: 'speaking', name: '口语流利', target: 30, desc: '能说出 5-8 句连贯的自我介绍与日常应答' },
        { key: 'reading', name: '阅读速度', target: 40, desc: '读懂 90 词短文，WPM 达 70' },
        { key: 'writing', name: '书面表达', target: 25, desc: '能写 5 句简单句描述日常' },
        { key: 'grammar', name: '语法准确', target: 30, desc: '掌握 be/do/have 三套动词与一般现在时' },
        { key: 'vocab', name: '词汇广度', target: 35, desc: '掌握 350 个高频生活词' }
      ],
      unlock: { vocab: 280, accuracy: 70, streak: 5, speaking: 8 },
      milestones: [
        { text: '完成 300 词，复习正确率稳定在 70% 以上', check: 'vocab300' },
        { text: '连续打卡 5 天，不出现"补作业"', check: 'streak5' },
        { text: '独立完成 8 次口语跟读', check: 'speak8' },
        { text: '读懂 3 篇 L1 短文，正确率 ≥ 70%', check: 'read3' }
      ],
      dailyPlan: '每天 20 分钟：新词 10 个 + 复习到期词 + 跟读 1 段对话 + 读 1 篇短文',
      reality: '零基础到 L1 通常需要 8-12 周，前 2 周痛苦感最强，第 3 周开始能听懂简单句子'
    },
    {
      id: 'L2', name: '基础', en: 'Elementary', months: '第 4-6 月',
      color: '#4f7cff',
      goal: '能处理绝大多数日常场景的听说读写，形成稳定学习节奏',
      vocabTarget: 616,
      vocabPool: 285,
      abilityTargets: { listening: 55, speaking: 45, reading: 55, writing: 45, grammar: 50, vocab: 55 },
      dimensions: [
        { key: 'listening', name: '听力理解', target: 55, desc: '能听懂日常对话与简单播客（每分钟 120 词）' },
        { key: 'speaking', name: '口语流利', target: 45, desc: '能与陌生人完成 3 分钟对话，语速自然' },
        { key: 'reading', name: '阅读速度', target: 55, desc: '读一般邮件与新闻短文，WPM 达 95' },
        { key: 'writing', name: '书面表达', target: 45, desc: '能写 100 词的邮件与日记' },
        { key: 'grammar', name: '语法准确', target: 50, desc: '掌握六大时态基础与从句雏形' },
        { key: 'vocab', name: '词汇广度', target: 55, desc: '累计 700 词，含 285 个本级新词' }
      ],
      unlock: { vocab: 560, accuracy: 75, streak: 15, speaking: 25 },
      milestones: [
        { text: '主动词汇达 700，含 250 个间隔 ≥21 天的成熟词', check: 'vocab700' },
        { text: '连续打卡 15 天', check: 'streak15' },
        { text: '口语跟读累计 25 次，平均得分 ≥ 70', check: 'speak25' },
        { text: '完整读完 3 篇 L2 短文，正确率 ≥ 75%', check: 'read3L2' }
      ],
      dailyPlan: '每天 25 分钟：新词 12 个 + 复习 + 跟读 + 1 篇 L2 短文 + 1 句书面写作',
      reality: 'L2 是分化点：多数人在此放弃。关键是不追求"完美"，而是保证"不中断"'
    },
    {
      id: 'L3', name: '进阶', en: 'Intermediate', months: '第 7-9 月',
      color: '#f0a020',
      goal: '能用英语处理职场与学术场景，具备逻辑表达能力',
      vocabTarget: 866,
      vocabPool: 250,
      abilityTargets: { listening: 70, speaking: 60, reading: 68, writing: 60, grammar: 65, vocab: 70 },
      dimensions: [
        { key: 'listening', name: '听力理解', target: 70, desc: '能听懂会议发言与专业播客' },
        { key: 'speaking', name: '口语流利', target: 60, desc: '能就观点性话题表达立场并处理反对意见' },
        { key: 'reading', name: '阅读速度', target: 68, desc: '读专业文章，WPM 达 120' },
        { key: 'writing', name: '书面表达', target: 60, desc: '能写 300 词的论证段落与工作邮件' },
        { key: 'grammar', name: '语法准确', target: 65, desc: '掌握定语从句、状语从句、非谓语结构' },
        { key: 'vocab', name: '词汇广度', target: 70, desc: '累计 1100 词，覆盖职场与抽象话题' }
      ],
      unlock: { vocab: 800, accuracy: 78, streak: 30, speaking: 45 },
      milestones: [
        { text: '主动词汇达 1100', check: 'vocab1100' },
        { text: '连续打卡 30 天（习惯已成型）', check: 'streak30' },
        { text: '口语跟读 45 次，平均得分 ≥ 78，能完成观点表达', check: 'speak45' },
        { text: '读完 4 篇 L3 长文，答对推理题', check: 'read4L3' }
      ],
      dailyPlan: '每天 30 分钟：新词 15 个 + 复习 + 场景对话跟读 + 1 篇 L3 论述文 + 5 句观点写作',
      reality: 'L3 开始需要"用英语思考"而非"翻译成英语"，这是最高的一道心理坎'
    },
    {
      id: 'L4', name: '精通', en: 'Advanced', months: '第 10-12 月',
      color: '#e2585f',
      goal: '接近母语者的理解与表达能力，能自由处理复杂信息与观点',
      vocabTarget: 1456,
      vocabPool: 590,
      abilityTargets: { listening: 82, speaking: 75, reading: 80, writing: 78, grammar: 80, vocab: 82 },
      dimensions: [
        { key: 'listening', name: '听力理解', target: 82, desc: '能理解抽象论述与复杂论证' },
        { key: 'speaking', name: '口语流利', target: 75, desc: '能主持讨论、处理冲突与谈判' },
        { key: 'reading', name: '阅读速度', target: 80, desc: '读原版书籍与专业论文，WPM 达 145+' },
        { key: 'writing', name: '书面表达', target: 78, desc: '能写结构完整的报告与长文' },
        { key: 'grammar', name: '语法准确', target: 80, desc: '能识别并主动使用复杂句式' },
        { key: 'vocab', name: '词汇广度', target: 82, desc: '累计 1600 词，含 590 个高阶语块' }
      ],
      unlock: null,
      milestones: [
        { text: '主动词汇达 1600，400 个成熟词间隔 >30 天', check: 'vocab1600' },
        { text: '阅读理解能答对推理题与态度题（不只是细节题）', check: 'readReason' },
        { text: '口语能完成 L4 谈判与压力陈述场景', check: 'speakL4' }
      ],
      dailyPlan: '每天 35 分钟：高阶语块 15 个 + 长文精读 + 论证写作 + 高阶场景对话',
      reality: '"精通"不是母语者水平，而是能在专业领域自如工作——按 Hamada & Kondo (2013)，母语者约需 4,200 小时习得英语'
    },
    {
      id: 'L5', name: '高中', en: 'High School', months: '第 13-18 月',
      color: '#8b5cf6',
      goal: '达到高考大纲核心词汇量，能读懂议论文与说明文，具备初步书面表达',
      vocabTarget: 2000,
      vocabPool: 1993,
      abilityTargets: { listening: 85, speaking: 78, reading: 78, writing: 70, grammar: 80, vocab: 78 },
      dimensions: [
        { key: 'listening', name: '听力理解', target: 85, desc: '能听懂新闻与长篇对话' },
        { key: 'speaking', name: '口语流利', target: 78, desc: '能就社会话题表达观点' },
        { key: 'reading', name: '阅读速度', target: 78, desc: '读议论文/说明文，WPM 达 145' },
        { key: 'writing', name: '书面表达', target: 70, desc: '能写 120-150 词的应用文' },
        { key: 'grammar', name: '语法准确', target: 80, desc: '掌握虚拟语气、倒装、定语从句' },
        { key: 'vocab', name: '词汇广度', target: 78, desc: '掌握 2000 高考核心词' }
      ],
      unlock: { vocab: 1350, accuracy: 82, streak: 45, speaking: 60 },
      milestones: [
        { text: '掌握 1600 个高考大纲核心词', check: 'vocab1600' },
        { text: '总正确率 ≥ 82%', check: 'acc82' },
        { text: '连续打卡 45 天', check: 'streak45' },
        { text: '口语跟读 60 次', check: 'speak60' }
      ],
      dailyPlan: '每天 20 分钟：新词 15 个 + 全部到期复习 + 议论文阅读 1 篇 + 应用文写作 1 篇',
      reality: '高考词汇的难点不在数量而在「书面语 vs 口语」的差别。考纲词多为书面语，' +
        '很多词日常口语根本不用（如 abide、constitute）。这是本阶段最需要适应的转变。'
    },
    {
      id: 'L6', name: '高考拓展', en: 'Gaokao Plus', months: '第 19-24 月',
      color: '#ec4899',
      goal: '覆盖高考延伸词（cet4/6、考研、托福雅思），具备学术与职场双重能力',
      vocabTarget: 4000,
      vocabPool: 2000,
      abilityTargets: { listening: 88, speaking: 82, reading: 85, writing: 80, grammar: 88, vocab: 88 },
      dimensions: [
        { key: 'listening', name: '听力理解', target: 88, desc: '能理解学术讲座与长篇报告' },
        { key: 'speaking', name: '口语流利', target: 82, desc: '能主持讨论、学术汇报' },
        { key: 'reading', name: '阅读速度', target: 85, desc: '读专业书籍，WPM 达 170' },
        { key: 'writing', name: '书面表达', target: 80, desc: '能写结构完整的论文与报告' },
        { key: 'grammar', name: '语法准确', target: 88, desc: '主动使用复杂句式，错误率 <5%' },
        { key: 'vocab', name: '词汇广度', target: 88, desc: '掌握 4000 词（核心+延伸）' }
      ],
      unlock: null,
      milestones: [
        { text: '累计词汇 4000（核心+延伸）', check: 'vocab4000' },
        { text: '阅读能答对推理题与词义题', check: 'readReason' },
        { text: '口语能完成 L4 谈判与压力陈述', check: 'speakL4' }
      ],
      dailyPlan: '每天 25 分钟：延伸词 15 个 + 精读学术文章 + 论文段落写作',
      reality: '本阶段是「能力定型期」。4,000 词是母语者日常阅读的门槛（约 4,000-5,000 词覆盖 95% 日常文本），' +
        '但真正的流利度取决于主动输出量，而非词汇量本身。'
    }
  ];

  /* ------------------------------------------------------------
     二、行为心理机制库
     每条机制含：现象 → 机制原理 → 大脑奖赏解释 → 本站的实现方式
     ------------------------------------------------------------ */
  var MECHANISMS = [
    {
      id: 'trigger', icon: '🎯', name: '行为触发提示', category: '启动',
      phenomenon: '你知道自己该学英语，但坐在桌前就是打开不了app。',
      principle: '行为发生需要 B = MAP（动机 × 能力 × 提示）。多数人失败在"提示"缺失——你依赖"想起来"，而想起是需要意志力的动作。',
      brain: '前额叶的"执行启动"本身消耗葡萄糖，是最贵的一种神经能量。把启动交给外部线索（固定时间、固定位置、固定动作），等于把这笔成本外包给环境。',
      science: 'BJ Fogg 行为模型（2009）',
      implementation: [
        '每天固定时段弹出"今日任务卡"，无需用户自己规划',
        '任务卡直接给出"下一步动作"（如"打开复习队列"），而不是给目标',
        '每晚 21:00 发送次日预告，把决策前置到低负担时段'
      ],
      metric: '每日任务完成率'
    },
    {
      id: 'microhabit', icon: '🪫', name: '微习惯小步任务', category: '启动',
      phenomenon: '"每天背 30 个单词"太重，于是第一天就放弃。',
      principle: '能力是 MAP 的乘数之一。任务难度一旦超过当前能力，启动阻力会指数上升。降低到"荒谬地容易"，反而能形成习惯。',
      brain: '多巴胺编码的是"值得去做"而不是"做完多快乐"（Berridge, 2004）。任务越难，预期奖励越低，多巴胺释放越少。把任务缩到 1 个词，多巴胺就足以启动。',
      science: 'BJ Fogg《福格行为模型》微习惯法；Tiny Habits 实践',
      implementation: [
        '每日任务可切换为"极简模式"：只学 1 个词也算达标',
        '默认目标 12 新词，但系统同时给出"最低可执行量：1 个"',
        '连续达标后主动提议升级，升级由用户点击而非自动'
      ],
      metric: '连续打卡天数'
    },
    {
      id: 'feedback', icon: '⚡', name: '即时反馈', category: '强化',
      phenomenon: '背了半小时不知道有没有进步，逐渐放弃。',
      principle: '反馈延迟越长，行为越难被强化。动物实验表明，即时结果比延迟 24 小时的延迟结果有效得多。',
      brain: '预测误差（prediction error）是强化学习的驱动信号：结果好于预期时释放多巴胺。所以反馈必须在"行为—结果"之间立刻发生，才能被大脑归因为"我做对了"。',
      science: 'Ferris 1971 等动物强化实验；Skinner 操作条件作用',
      implementation: [
        '每个词作答后立即显示对错 + 明日间隔天数',
        '每轮复习结束即显示本轮正确率与记忆稳定性预测',
        '跟读后立即给出逐词匹配度、语速、漏读词清单'
      ],
      metric: '单次答题正确率'
    },
    {
      id: 'variablereward', icon: '🎲', name: '可变奖励', category: '强化',
      phenomenon: '固定奖励很快失效，学习变得像完成任务。',
      principle: '固定比率的奖励产生的多巴胺效率快速下降。可变比率奖励（赌场老虎机）会产生持续 searching behavior，因为下一次奖励不可预测。',
      brain: 'Schultz 多巴胺预测误差理论：奖励"不可预测"时，误差信号最大。因此惊喜卡能产生比固定奖励更强的动机，且不破坏任务价值感。',
      science: 'Clark 1961 可变比率强化实验；Schultz 1997 预测误差理论',
      implementation: [
        '每完成一轮复习有概率掉落"惊喜卡"（知识卡 / 休息券 / 成就预告）',
        '惊喜内容每次不同，且不含分数型奖励，避免扭曲学习动机',
        '惊喜频率约 25%，过高会稀释任务价值，过低无效果'
      ],
      metric: '惊喜卡开启次数'
    },
    {
      id: 'streak', icon: '🔥', name: '连续打卡与徽章', category: '强化',
      phenomenon: '中断一天就想全部放弃。',
      principle: '人不怕爬 10 层，怕的是从第 9 层摔到第 8 层。连续记录的价值在于把"不中断"变成可维护的身份。',
      brain: '"承诺升级 + 损失厌恶"：中断时损失的是已经建立的连续记录（沉没成本），而非当天少学的知识（未来收益）。损失厌恶的心理权重约为同等收益的 2 倍（Kahneman & Tversky, 1979）。',
      science: '损失厌恶理论；习惯环路（cue-routine-reward）',
      implementation: [
        '顶部常驻连续天数 + 热力图（断档在视觉上非常刺眼）',
        '15 个徽章覆盖不同成就维度，持续给予身份确认',
        '断档后不惩罚，只提示"连续记录已重置，从 1 重新开始"',
        '刻意不提供"补签"功能——补签会教会大脑规律可以作弊'
      ],
      metric: '当前连续天数 / 最长连续天数'
    },
    {
      id: 'lossaversion', icon: '⏳', name: '损失厌恶式提醒', category: '动机',
      phenomenon: '计划书上写得很好，但从不看。',
      principle: '人天生厌恶损失远甚于追求收益。把"目标进度"与"放弃的代价"同时可视化，动机来自两侧夹逼而非单侧推动。',
      brain: '前景理论（Kahneman & Tversky）：损失带来的负效用约为同等收益正效用的 2 倍，且亏损时的痛苦会持续更久。这就是为什么"连续记录清零"比"再学 20 分钟"更有驱动力。',
      science: 'Kahneman & Tversky 前景理论 1979；行为经济学中的沉没成本效应',
      implementation: [
        '首页显示"距目标还差 X 词"，并显示"如果今天不学，达成日期推迟 Y 天"',
        '承诺装置：设定目标后记录签约日与目标日，全程可见进度落后/领先',
        '落后于进度基线时，用中性语气呈现差距，不做道德评判',
        '绝不显示"你已经浪费了 X 天"这类指责性表述——这会触发羞耻并导致彻底放弃'
      ],
      metric: '目标进度偏差'
    },
    {
      id: 'commitment', icon: '🔒', name: '目标可视化承诺', category: '动机',
      phenomenon: '"我要学好英语"——这句话没有任何约束力。',
      principle: '模糊意图无法产生行为。承诺必须满足三要素：具体（可量化）、公开（有人知道）、有代价（违背需付出）。',
      brain: '自我决定论中的自主感（Deci & Ryan, 1985）：完全外部强制的目标会削弱动机，但"我自己签下的承诺"被大脑归因为自主选择，因此内驱力保留。',
      science: '目标设定理论（Gollwitzer 的 WOOP 与实施意图）；自我决定论',
      implementation: [
        '要求设定：目标词汇量 + 目标日期（实施意图：何时何地做什么）',
        '进度以"基线对照线"显示，看得见领先或落后',
        '提供"自主放弃"入口：可主动降低 20% 目标而不受惩罚——这是自主感投资，显著降低中途放弃率',
        '所有数据本地可导出，形成个人学习档案'
      ],
      metric: '目标完成率 / 自主调整次数'
    },
    {
      id: 'iplusone', icon: '📐', name: '难度自适应 i+1', category: '学习',
      phenomenon: '材料太简单无聊，太难又直接放弃。',
      principle: 'Krashen 输入假说：可理解输入应略高于当前水平（i+1）。85% 可理解 + 15% 新内容是公认的最佳比例。',
      brain: '心流（Csikszentmihalyi）要求挑战略高于技能：太低则无聊，太高则焦虑。最优区间是"努力后可达"。',
      science: 'Krashen 输入假说；Flow 心流理论',
      implementation: [
        '题目从当前已学词 + 同级词构造，保证 85% 可解',
        '正确率掉到 70% 以下时提示降难度，而非惩罚',
        '复习队列按"最该复习"排序（逾期最久、难度因子最低优先）',
        '每张卡片难度因子（EF）独立追踪，薄弱词出现频率更高'
      ],
      metric: '滚动 7 日正确率'
    },
    {
      id: 'retrieval', icon: '🧠', name: '提取练习优先', category: '学习',
      phenomenon: '单词"看着眼熟"，但要用时想不起来。',
      principle: '反复阅读产生的熟悉感会被误认为记忆。真正的记忆巩固发生在"从记忆中取出"这个动作本身。',
      brain: 'Karpicke & Roediger (2008)：反复提取组测试正确率达 80%+，反复阅读组停在 40%。测试本身就是学习，不是对学习的检验。',
      science: '提取练习效应；测试效应（testing effect）',
      implementation: [
        '默认以"看中文回忆英文"出题，不提供选择提示',
        '每个词必须经过多次分散提取才算掌握（间隔 ≥21 天）',
        '已成熟词不再出现，除非到期',
        '统计"提取次数"而非"浏览次数"作为掌握标准'
      ],
      metric: '成熟词数（间隔 ≥21 天）'
    },
    {
      id: 'sleep', icon: '😴', name: '睡眠与巩固提示', category: '学习',
      phenomenon: '熬夜学效率高，实际上第二天全忘。',
      principle: '记忆并非在学习时写入，而在深度睡眠期间由海马体转运至皮层。',
      brain: '睡眠期间海马体向皮层重放当日记忆轨迹（sharp-wave ripples），完成长期记忆固化。BDNF（脑源性神经营养因子）在睡眠中升高，促进突触连接。',
      science: '睡眠依赖记忆巩固假说；Rasch & Born 2013',
      implementation: [
        '在 22:30 后提醒"今日已完成，建议休息"',
        '建议把当日复习安排在睡前 30 分钟（提取而非新学）',
        '不使用任何打断睡眠的推送'
      ],
      metric: '学习时段分布'
    }
  ];

  /* 微习惯阶梯：不同投入时间下的任务切分 */
  var MICRO_LADDER = [
    { min: 2, label: '极简', tasks: ['复习 3 个到期词', '读 1 句话'], color: '#c8cedb' },
    { min: 5, label: '轻量', tasks: ['复习 8 个到期词', '跟读 1 段对话', '读 1 段短文'], color: '#8fbaff' },
    { min: 15, label: '标准', tasks: ['复习 20 个到期词', '学 8 个新词', '跟读 1 段对话', '读 1 篇短文'], color: '#4f7cff' },
    { min: 30, label: '进阶', tasks: ['复习 30 个到期词', '学 12 个新词', '口语场景 + 发音练习', '读 1 篇短文 + 理解题', '写 3 句笔记'], color: '#f0a020' },
    { min: 60, label: '沉浸', tasks: ['完成 30 分钟标准任务 + 1 篇长文精读 + 复盘'], color: '#e2585f' }
  ];

  /* 每日任务模板（按等级） */
  function dailyTasks(level, isWeekend) {
    var base = {
      L1: [
        { id: 'review', text: '复习到期单词', min: 6, kind: 'review' },
        { id: 'new', text: '学习 8 个新词', min: 6, kind: 'new' },
        { id: 'speak', text: '跟读 1 段对话', min: 4, kind: 'speak' },
        { id: 'read', text: '读 1 篇短文', min: 4, kind: 'read' }
      ],
      L2: [
        { id: 'review', text: '复习到期单词', min: 8, kind: 'review' },
        { id: 'new', text: '学习 12 个新词', min: 8, kind: 'new' },
        { id: 'speak', text: '跟读 1 个场景', min: 6, kind: 'speak' },
        { id: 'read', text: '读 1 篇短文 + 答题', min: 7, kind: 'read' }
      ],
      L3: [
        { id: 'review', text: '复习到期单词', min: 10, kind: 'review' },
        { id: 'new', text: '学习 15 个新词', min: 8, kind: 'new' },
        { id: 'speak', text: '场景对话跟读 + 复盘', min: 7, kind: 'speak' },
        { id: 'read', text: '读 1 篇论述 + 理解题', min: 8, kind: 'read' }
      ],
      L4: [
        { id: 'review', text: '复习高阶语块', min: 10, kind: 'review' },
        { id: 'new', text: '学习 15 个高阶词', min: 8, kind: 'new' },
        { id: 'speak', text: '高阶场景谈判对话', min: 9, kind: 'speak' },
        { id: 'read', text: '精读长文 + 推理题', min: 10, kind: 'read' }
      ]
    };
    var tasks = (base[level] || base.L1).map(function (t) { return Object.assign({}, t); });
    if (isWeekend) {
      tasks.push({ id: 'extra', text: '周末加练：复盘本周错题', min: 10, kind: 'review' });
    }
    return tasks;
  }

  /* 惊喜卡内容池 */
  var SURPRISES = [
    { type: 'fact', title: '冷知识', text: '英语中 "I" 永远大写。这不是因为傲慢，而是因为古英语的 "ic"（就是我）在印刷术时代需要与 "i"（介词"在"）区分，于是被普遍改成大写以避免混淆。' },
    { type: 'fact', title: '冷知识', text: '英语中约 40% 的常用词来自拉丁语、约 20% 来自法语，但它们大多保留了 1000 多年前的拉丁词根——所以 "trans"（横过）出现在 transport、translate、transaction 三个完全不同的领域。' },
    { type: 'fact', title: '冷知识', text: '"Thank" 一词来自古英语 "þanc"，本意是"思考"。感谢别人，本质上是在说"我记着你的好意"。' },
    { type: 'tip', title: '学习技巧', text: '学一个新词时，同时学它的两个搭配（collocation），比记 10 个孤立例句更有效。因为大脑存储的是"词 + 典型搭配"的块（chunk），而非单词本身。' },
    { type: 'tip', title: '学习技巧', text: '把今天学的词造 1 个和你自己有关的句子（"我"相关），记忆强度比照抄书上的例句高约 30%。个人相关性调动了更大的神经网络参与。' },
    { type: 'tip', title: '学习技巧', text: '遇到读不懂的长句，不要从头读三遍。正确做法是：找到从句的引导词（that/which/who/while），先划掉修饰部分，读主干。主干能读懂，意思就拿到了 70%。' },
    { type: 'rest', title: '休息券', text: '现在允许自己休息 10 分钟。站起来，喝水，看窗外远处。这不是浪费时间——默认模式网络（DMN）在放空时整理记忆，休息本身是学习的一部分。' },
    { type: 'encourage', title: '给此刻的你', text: '你已经连续坚持到现在。多数人不是不会，而是没坚持下来。你正在做最难的那部分——继续。' },
    { type: 'encourage', title: '认知重构', text: '今天感觉"学得慢"其实是正常的。成人大脑建立新突触连接的速度本就低于儿童，但每个连接的强度更高。慢是过程，不是结果。' },
    { type: 'challenge', title: '进阶挑战', text: '下次跟读时，尝试只用句子重读规则（实词重读、虚词弱读）来读。读慢但读准，比读快但含混更有价值。' }
  ];

  function levelById(id) {
    for (var i = 0; i < LEVELS.length; i++) if (LEVELS[i].id === id) return LEVELS[i];
    return LEVELS[0];
  }
  function nextLevel(id) {
    var idx = LEVELS.findIndex(function (l) { return l.id === id; });
    return idx >= 0 && idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  }

  global.PathContent = {
    LEVELS: LEVELS,
    MECHANISMS: MECHANISMS,
    MICRO_LADDER: MICRO_LADDER,
    SURPRISES: SURPRISES,
    levelById: levelById,
    nextLevel: nextLevel,
    dailyTasks: dailyTasks
  };
})(window);