/* ============================================================
   content-roots.js —— 词根词缀体系（认知输入 → 理解解析）

   为什么要有这个模块：
     单词记不住，多半是因为只记住了「翻译」而没记住「来路」。
     同一词根的词往往长得像、意思也相近，成串记忆的效率远高于孤立背诵。
     例如 -spect-（看）一次拿下：inspect / respect / prospect / spectator。

   内容原则：
     1. 每个词根标注**语种来源**（拉丁语 / 希腊语 / 日耳曼语 / 法语等），
        标注是"直接借入"还是"经由法语/英语化过程中缀"。
     2. 同源词给出**语义场**（spectator 偏"看的人"、prospect 偏"往前看"），
        而不是简单罗列，让学习者能推断词义而不是死记。
     3. 每个词根给一个**高频词**做拆解示范，展示词根如何决定词义。

   数据结构：
     ROOT_LIST: [
       {
         root: 'spect',
         from: '拉丁语 specere / spectus',
         type: '词根',
         gloss: '看',
         detail: '原始形态 specere（第一人称单数 spec），过去分词 spectus。
                  拉丁语还有拼写变体 spic-（如 conspicuous）。',
         field: '视觉',
         demo: { w: 'inspect', ... },      // 拆解示范
         family: [ { w, ipa, pos, cn, note } ],   // 同源词族
         tip: '记忆策略'
       }
     ]
   ============================================================ */
(function (global) {
  'use strict';

  /* ============================================================
     一、核心词根（大类：看、说、走、做、知）
     ============================================================ */
  var ROOT_LIST = [
    {
      root: 'spect',
      type: '词根',
      from: '拉丁语 specere（看）/ spectus（被看的）',
      gloss: '看',
      detail: '原始动词 specere，第一人称单数 spec，过去分词 spectus。'
        + '同族变体拼作 spic-，出现在 conspicuous（明显）中。',
      field: '视觉',
      demo: {
        w: 'prospect', ipa: '/ˈprɒspekt/', pos: '名词',
        cn: '前景；可能性',
        break: 'pro-（向前）+ spect（看）',
        note: '「向前看」看到的东西 → 前景、 prospects（前景/可能性）。'
          + '同源 prospectus 是商业语境里"招股说明书"的词源。'
      },
      family: [
        { w: 'inspect', cn: '检查', note: 'in-（向内）+ spect → 往里看 → 检查' },
        { w: 'respect', cn: '尊重', note: 're-（回）+ spect → 回头看 → 审视 → 尊重。词根是"值得回头看"' },
        { w: 'spectator', cn: '观众', note: '-ator（做…的人）+ spect → 用眼睛看的人' },
        { w: 'conspicuous', cn: '显眼的', note: 'con-（共同）+ spic- → 一眼能看见 → 显眼的。反义词 inconspicuous' },
        { w: 'circumspect', cn: '谨慎的', note: 'circum-（环绕）+ spect → 四周都看 → 谨慎。拼写 c/s 混用是拉丁词常见现象' },
        { w: 'speculate', cn: '推测；投机', note: '词根同源，但走了另一条路：speculum 是"镜子"，所以也有"观察"义' }
      ],
      tip: '把这 6 个词按"往里看 / 回头看 / 往前看 / 四周看"分组记，'
        + '比按字母表背 6 次牢固得多。'
    },
    {
      root: 'port',
      type: '词根',
      from: '拉丁语 portare（搬运）/ portus（门）',
      gloss: '搬运；港口',
      detail: '注意它分裂成两个独立词根：'
        + 'port-（搬运，如 import / export / portable）与 port-（港口，如 port / airport）。'
        + '它们同源但语义已分化。',
      field: '移动与运输',
      demo: {
        w: 'important', ipa: '/ɪmˈpɔːtnt/', pos: '形容词',
        cn: '重要的',
        break: 'im-（进入）+ port（带进来）',
        note: '「被带进来的东西」→ 重要。import 本身也是同一词根。'
      },
      family: [
        { w: 'export', cn: '出口', note: 'ex-（向外）+ port → 往外带' },
        { w: 'transport', cn: '运输', note: 'trans-（横越）+ port → 从一地搬到另一地' },
        { w: 'portable', cn: '便携的', note: '-able（能够…的）+ port → 能被带着走的' },
        { w: 'support', cn: '支持', note: 'sup-（在下面）+ port → 从底下托着。这是中文"支持"最典型的来源' },
        { w: 'portfolio', cn: '作品集；投资组合', note: 'port + folio（页）→ 原指装文件的文件夹 → 今天的作品集' },
        { w: 'deport', cn: '驱逐出境', note: 'de-（离开）+ port → 送走。反义：repatriate（遣返）' }
      ],
      tip: '注意 support 是"从下往上托"，所以引申为"支撑 → 支持"。'
        + '中文的"支持"和英语的 support 是同一个比喻。'
    },
    {
      root: 'dict',
      type: '词根',
      from: '拉丁语 dicere（说）/ dictus（已被说）',
      gloss: '说',
      detail: '过去分词 dictus 是英语里 -dict- 后缀的来源，如 verdict（裁决）、'
        + 'contradict（反驳）都是它。',
      field: '言语',
      demo: {
        w: 'predict', ipa: '/prɪˈdɪkt/', pos: '动词',
        cn: '预言；预测',
        break: 'pre-（预先）+ dict（说）',
        note: '「预先说出来」→ 预测。同源 pre- 在这里是"预先"，不是"前面"。'
      },
      family: [
        { w: 'contradict', cn: '反驳；与…矛盾', note: 'contra-（相反）+ dict → 说过相反的话。形容词 contradictory' },
        { w: 'verdict', cn: '裁决；结论', note: 'ver（真实）+ dict → 说出真相 → 裁决' },
        { w: 'indict', cn: '起诉；控告', note: 'in-（向内）+ dict → 把罪状说进去。注意与 indite（written）区分拼写' },
        { w: 'predictable', cn: '可预测的', note: '形容词，实际使用频率远高于动词 predict' },
        { w: 'dictate', cn: '口述；命令', note: 'dict + -ate。动词重音在第一音节，名词重音在第二音节' }
      ],
      tip: 'contradict 与 indict 只差一个字母，意思完全不同。'
        + '用"contra 是相反、in 是向内"这条线索记住。'
    },
    {
      root: 'duc / duct',
      type: '词根',
      from: '拉丁语 ducere（引导）/ ductus（被引导的）',
      gloss: '引导',
      detail: '动词形式 duc-，名词/过去分词形式 duct-。'
        + '英语里两者并存，是 -duct- 系列词的判断依据。',
      field: '引导与流动',
      demo: {
        w: 'introduce', ipa: '/ˌɪntrəˈdjuːs/', pos: '动词',
        cn: '介绍；引入',
        break: 'intro-（向内）+ duc（引导）',
        note: '「往里引」→ 介绍。常见误解是把它当及物动词直接加宾语，'
          + '但它必须写成 introduce sb. to sth. 或 introduce sth. into sth.'
      },
      family: [
        { w: 'produce', cn: '生产', note: 'pro-（向前）+ duc → 向前引出 → 产出。同源 product（产品）' },
        { w: 'conduct', cn: '实施；指挥', note: 'con-（一起）+ duct → 引导大家一起做 → 实施。重音在第二音节' },
        { w: 'educate', cn: '教育', note: 'e-（向外）+ duc + -ate → 把内在的东西引出来 → 教育。这是词根最有教育意义的例证' },
        { w: 'deduce', cn: '推断', note: 'de-（向下）+ duc → 把结论往下引 → 演绎。动词 deduce / 名词 deduction' },
        { w: 'seduce', cn: '诱惑', note: 'se-（分开）+ duc → 把你带偏 → 诱惑。元音后的 s 是拉丁语接缀的常见拼法' }
      ],
      tip: 'educate 拆成 e + duc + ate 后就能直译为"引出内在的东西"，'
        + '这正是教育的本意——不是塞满，而是引出。'
    },
    {
      root: 'ject',
      type: '词根',
      from: '拉丁语 jacere（投掷）/jectus（被投出的）',
      gloss: '投；掷',
      detail: '前缀决定方向：in- 向内、e- 向外、re- 回来、de- 向下、'
        + 'sub- 向下、ob- 反对、pro- 向前。',
      field: '投掷与强加',
      demo: {
        w: 'reject', ipa: '/rɪˈdʒekt/', pos: '动词',
        cn: '拒绝；否决',
        break: 're-（回）+ ject（掷）',
        note: '「掷回去」→ 拒绝。同源项目 reject 在这 6 个词里最基础，'
          + '因为其他词几乎都是它的近亲。'
      },
      family: [
        { w: 'inject', cn: '注射', note: 'in-（向内）+ ject → 打进去。引申义"注入想法"来自比喻' },
        { w: 'eject', cn: '弹出；驱逐', note: 'e-（向外）+ ject → 弹出去。CD 播放器的 eject 键就是这个词' },
        { w: 'project', cn: '投射；项目', note: 'pro-（向前）+ ject → 往前投 → 放映 / 项目。同源名词 projector' },
        { w: 'deject', cn: '使沮丧', note: 'de-（向下）+ ject → 情绪向下。形容词 dejected 是考试高频词' },
        { w: 'object', cn: '反对；物体', note: 'ob-（朝向）+ ject → 挡在前面 → 反对 / 障碍物。动词与名词重音不同：obJECT / OBject' },
        { w: 'subject', cn: '使遭受；主题', note: 'sub-（向下）+ ject → 压在下面 → 使遭受（某事）。常用被动：be subject to（易受…影响）' }
      ],
      tip: '这 7 个词的前缀就是 7 个方向箭头。'
        + '把前缀当"方向"记，比背拼写可靠——写错前缀方向就错了，逻辑不会错。'
    },
    {
      root: 'struct',
      type: '词根',
      from: '拉丁语 struere（堆积）/ structus（堆好的）',
      gloss: '建造；堆积',
      detail: '与 construct / destroy / instruct 是同一家族，'
        + '英语里 -struct- 几乎只出现在这几个学术词中。',
      field: '建造',
      demo: {
        w: 'construct', ipa: '/kənˈstrʌkt/', pos: '动词',
        cn: '建造；构建',
        break: 'con-（共同）+ struct（堆）',
        note: '「堆在一起」→ 建造。名词 construction（建筑/Construction 行业）。'
      },
      family: [
        { w: 'destruction', cn: '破坏', note: 'de-（相反）+ struct + -ion → 拆掉。同根形容词 destructive' },
        { w: 'instruct', cn: '教导；指示', note: 'in-（向内）+ struct → 把知识放进别人心里 → 教学。与 educator 同源' },
        { w: 'structure', cn: '结构', note: 'struct + -ure → 堆起来的样子 → 结构。学术写作高频词' },
        { w: 'obstruct', cn: '阻塞；妨碍', note: 'ob-（挡）+ struct → 挡住去路。医学里指血管堵塞' },
        { w: 'reconstruct', cn: '重建', note: 're-（再）+ construct → 重建。口语里也可指"还原事情经过"' }
      ],
      tip: 'deconstruct 是哲学/文学批评的常用词，'
        + '本意是"拆解分析"，与建筑学同源——先拆才能看清结构。'
    },
    {
      root: 'grav',
      type: '词根',
      from: '拉丁语 gravis（重的）/ gravus（沉重的）',
      gloss: '重；沉重',
      detail: '同源于 grave（重的、严肃的）和 gravity（重力、严重）。'
        + '注意它与西班牙语 peso、意大利语 grave 同源。',
      field: '重量与严重性',
      demo: {
        w: 'gravity', ipa: '/ˈɡrævəti/', pos: '名词',
        cn: '重力；严重性',
        break: 'grav + -ity',
        note: '物理学的"重力"与日常的"严重"是同一个词。'
          + '同源短语 give gravity to（认真对待）保留了原义。'
      },
      family: [
        { w: 'gravitate', cn: '受吸引；倾向于', note: '词根 + -ate。社交场合常说 gravitate to sb.（被某人吸引）' },
        { w: 'grave', cn: '严重的；严肃的；墓穴', note: '同一词根。形容词"严肃的"与名词"墓穴"语义相连——都是沉重的事' },
        { w: 'grievance', cn: '不满；委屈', note: '拼写变体 griev-，源自 gravis。 grievances 指职场申诉，是投诉信常用词' },
        { w: 'aggravate', cn: '加重；恶化', note: 'ag-（加强）+ grav + -ate → 加重。注意：这个词几乎只用于负面，不要用来表示"加剧好处"' },
        { w: 'greasy', cn: '油腻的', note: '同源的日常形容词，与 gravity 同祖。是"重、油"这个语义的直接延伸' }
      ],
      tip: 'aggravate 是个精确词：只用于负面后果。'
        + '"加剧矛盾"可以，"加剧热情"是错的。'
    },
    {
      root: 'cred',
      type: '词根',
      from: '拉丁语 credere（相信）',
      gloss: '相信',
      detail: '词根变体：cred-（相信）、credul-（轻信）。'
        + '英语里 credit 是最常用的一个。',
      field: '信念与信任',
      demo: {
        w: 'credit', ipa: '/ˈkredɪt/', pos: '名词',
        cn: '信用；学分；赞扬',
        break: 'cred + -it',
        note: '原义"相信、信任"，所以信用卡是"信用"，学分是"被认可的学习量"。'
      },
      family: [
        { w: 'incredible', cn: '难以置信的', note: 'in-（不）+ cred + -ible → 不可信的 → 难以置信的。这是日常高频词' },
        { w: 'credible', cn: '可信的', note: 'cred + -ible → 可信的。新闻语境里常见 credible evidence（可信证据）' },
        { w: 'creed', cn: '信条', note: '原指"我相信什么"，因此特指宗教信条。柏拉图的 famous quote 用的就是这个义项' },
        { w: 'creditor', cn: '债权人', note: '-or（人）→ 相信你会还钱的人。反义 debtor（欠债人）' },
        { w: 'discredit', cn: '使丧失信誉', note: 'dis-（否定）+ credit → 让人不再相信。职场里 discredit sb.\'s argument 很常见' }
      ],
      tip: 'incredible 日常里已经"不可信"义转成了"惊人"义：'
        + '"That\'s incredible!" 多是赞叹而非怀疑。'
    },
    {
      root: 'aud',
      type: '词根',
      from: '拉丁语 audire（听）',
      gloss: '听',
      detail: '变体：aud-（听）、audit-（ audits，与"审计"无关，源自" audits ＝ 听取"）。'
        + '音频领域的 audio、audience 都出自这里。',
      field: '听觉',
      demo: {
        w: 'audience', ipa: '/ˈɔːdiəns/', pos: '名词',
        cn: '听众；观众',
        break: 'aud + -ience',
        note: '「听的人」→ 观众。今天的"观众"其实保留了听觉属性。'
      },
      family: [
        { w: 'audio', cn: '音频', note: '同根。技术领域 ubiquitous（无处不在）' },
        { w: 'audible', cn: '听得见的', note: 'aud + -ible。反义 inaudible（听不见的），演唱会描述常用' },
        { w: 'audit', cn: '审计；旁听', note: '原义是"听取账目审查"，所以字面是"听"。同根 auditor' },
        { w: 'audiology', cn: '听力学', note: '医疗专业词。医院里 audiology department 就是耳鼻喉的听力部分' },
        { w: 'inaudible', cn: '听不见的', note: '学术形容词，日常少用但精准' }
      ],
      tip: '"audience" 的词根是"听"而不是"看"，这提醒我们：'
        + '英语里许多词保留了器官的原始意象，是理解词义最快的方式。'
    },
    {
      root: 'scrib / script',
      type: '词根',
      from: '拉丁语 scribere（写）/ scriptus（写好的）',
      gloss: '写',
      detail: '这是英语里最高产的词根之一，也是最值得整体记忆的。',
      field: '书写',
      demo: {
        w: 'describe', ipa: '/dɪˈskraɪb/', pos: '动词',
        cn: '描述',
        break: 'de-（向下）+ scrib（写）',
        note: '「写下来」→ 描述。同源 description 是雅思写作的常用词。'
      },
      family: [
        { w: 'prescribe', cn: '开处方；规定', note: 'pre-（预先）+ scrib → 预先写下 → 开处方。名词 prescription 是"处方"' },
        { w: 'subscribe', cn: '订阅；赞同', note: 'sub-（在下面）+ scrib → 在下面签名 → 订阅 / 表示赞同' },
        { w: 'manuscript', cn: '手稿', note: 'manu（手）+ script → 手写的。学术论文的 abstract 就在这类文件里' },
        { w: 'conscript', cn: '征兵', note: 'con-（共同）+ script → 强制登记入伍。与 conscripted（被征的）相关' },
        { w: 'transcript', cn: '文字记录；成绩单', note: 'trans-（转移）+ script → 抄写一份。学术申请必备材料' },
        { w: 'scripture', cn: '经文', note: 'script + -ure → 写下的东西 → 特指宗教经典' }
      ],
      tip: '注意 -scribe 是名词（抄写员）、-scribe 是动词。'
        + 'designer 对应 design、scribe 对应 scrib，这是英语的 -er 名词规律。'
    },

    /* ============================================================
       二、常见前缀（方向与否定）
       ============================================================ */
    {
      root: 'a- / an-',
      type: '前缀',
      from: '希腊语 a-/an-（不、无）',
      gloss: '否定：没有',
      detail: '元音字母开头时 n 不发音：an- + e 开头 = an-（an example、an error），'
        + 'an 其他情况才用 a-。',
      field: '否定',
      demo: {
        w: 'atypical', ipa: '/eɪˈtɪpɪkl/', pos: '形容词',
        cn: '非典型的',
        break: 'a-（不）+ typical（典型的）',
        note: '医学语境里 atypical 出现频率极高，如 atypical symptom（非典型症状）。'
      },
      family: [
        { w: 'anonymous', cn: '匿名的', note: 'a- + nym（名字）→ 没有名字的' },
        { w: 'apathy', cn: '冷漠', note: 'a- + path（感情）→ 没有感情 → 冷漠' },
        { w: 'aseptic', cn: '无菌的', note: 'a- + septic（腐败的）→ 无菌。医院标语常写 aseptic' },
        { w: 'abnormal', cn: '异常的', note: 'ab-（是 a- 的变体）+ normal → 不正常' },
        { w: 'immortal', cn: '不朽的', note: '否定前缀遇到 m 开头会变成 im-：immobile / immortal / impatient' }
      ],
      tip: '否定前缀遇到 b/m/p 开头会变形成：im-/in-/il-（非正式），'
        + '或 ab-（正式）。学术词多用 ab-，日常词多用 im-。'
    },
    {
      root: 'counter-',
      type: '前缀',
      from: '拉丁语 contra-（相对）经法语 counter-',
      gloss: '反；对抗',
      detail: '常与及物动词搭配，形成"对抗某动作"的含义。',
      field: '对抗',
      demo: {
        w: 'counterproductive', ipa: '/ˌkaʊntərprɒˈdʌktɪv/', pos: '形容词',
        cn: '适得其反的',
        break: 'counter-（反）+ productive（有益的）',
        note: '职场高频：措施反而有害。注意它只用于"本意有益却造成反效果"。'
      },
      family: [
        { w: 'counterpart', cn: '对应的人/物', note: 'counter + part → 在另一方的那个部分 → 职位对等的同事' },
        { w: 'counterpart', cn: '对应职位', note: '谈工作时常用：my counterpart in Tokyo（在东京的对接人）' },
        { w: 'counteract', cn: '抵消；中和', note: 'counter + act → 反着做 → 抵消。如 counteract the effects（抵消影响）' },
        { w: 'counterintuitive', cn: '反直觉的', note: '谈论数据结论时常用：counterintuitive result（反直觉的结果）' },
        { w: 'countersign', cn: '副签；会签', note: '军事/商务用语，指第二个人签字确认' }
      ],
      tip: 'counter- 多用于"制度性"的对立行为，'
        + '而 contra- 偏"观点上的对立"（contradict / contrary）。'
    },
    {
      root: 'pro-',
      type: '前缀',
      from: '拉丁语 pro-（向前；代替）',
      gloss: '向前；支持；代替',
      detail: '含义有三类：向前（progress）、支持（pro-democracy）、'
        + '代替某人（proxy、prosecute）。同一形式多义，靠搭配区分。',
      field: '方向与代理',
      demo: {
        w: 'proceed', ipa: '/prəˈsiːd/', pos: '动词',
        cn: '继续进行',
        break: 'pro-（向前）+ ceed（走）',
        note: '「向前走」→ 继续。注意它的过去式是 proceeded，不是 proceeded。'
      },
      family: [
        { w: 'process', cn: '过程；处理', note: 'pro-（向前）+ cess（走）→ 一步步向前 → 过程。同义动词处理公文' },
        { w: 'prosecute', cn: '起诉；检举', note: 'pro-（向前）+ secu-（追随）→ 把案子追到底 → 起诉。注意与 persecute（迫害）拼写差一字母' },
        { w: 'proxy', cn: '代理人；代理投票', note: 'pro-（代替）+ -xy → 代替你的人。这是商务语境的高频词' },
        { w: 'proficient', cn: '熟练的', note: 'pro- + fic（做）→ 做得超前 → 熟练。搭配 proficient in' },
        { w: 'profound', cn: '深刻的；深远的', note: 'pro- + fund（底部）→ 挖到底 → 深刻的。学术写作常用 profound impact' },
        { w: 'prosecution', cn: '起诉；检察', note: 'prosecute 的名词。legal prosecution（法律起诉）' }
      ],
      tip: 'prosecute（起诉）和 persecute（迫害）是高频混淆对，'
        + '一个字母之差：prosecute 是法律程序，persecute 是政治迫害。'
    },
    {
      root: 'sub-',
      type: '前缀',
      from: '拉丁语 sub-（在下面）',
      gloss: '在下面；次级',
      detail: '既表空间（below），也表等级（次要），如 subordinate（次要的）。',
      field: '位置与层级',
      demo: {
        w: 'submit', ipa: '/səbˈmɪt/', pos: '动词',
        cn: '提交；服从',
        break: 'sub-（在下面）+ mit（送）',
        note: '「送到下面」→ 交上去（submit an application）；引申为"屈服"（submit to pressure）。'
      },
      family: [
        { w: 'substance', cn: '物质；实质', note: 'sub-（在下面）+ stanc（站）→ 站在下面的 → 物质/实质。搭配 in substance（实质上）' },
        { w: 'subordinate', cn: '下级的；从属的', note: 'sub- + ordin（顺序）→ 顺序在下的 → 下级。搭配 be subordinate to' },
        { w: 'subside', cn: '平息；下沉', note: 'sub- + sid（坐）→ 坐下去 → 沉淀 / 平息。用于 argue（争论）平息' },
        { w: 'subtle', cn: '微妙的', note: 'sub- + -tle，词根不确定，但保留"在表面之下"的意象 → 细微难辨' },
        { w: 'substitute', cn: '替代品', note: 'sub- + stit（放）→ 放在下面的 → 备用的。搭配 substitute A for B' },
        { w: 'subsidiary', cn: '附带的；子公司', note: 'sub- + sid + -iary → 在下面的 → 次要的 / 分公司' }
      ],
      tip: 'sub- 的核心意象是"在表面之下"。'
        + 'subtle（表面之下所以难察觉）、subsidiary（下属）、substance（本质）都成立。'
    },
    {
      root: 'super- / sur-',
      type: '前缀',
      from: '拉丁语 super-（在上；超过）/ superus（之上的）',
      gloss: '在上；超过',
      detail: 'sur- 是 super- 在法语中的简写形式，两者在现代英语中常并存。',
      field: '位置与程度',
      demo: {
        w: 'supervise', ipa: '/ˈsuːpəvaɪz/', pos: '动词',
        cn: '监督；管理',
        break: 'super-（在上）+ vise（看）',
        note: '「在上面看」→ 监督。同源 supervisor（主管）是职场高频词。'
      },
      family: [
        { w: 'superficial', cn: '表面的；肤浅的', note: 'super + fic（表面）→ 只在表面 → 肤浅的。形容人时略带贬义' },
        { w: 'superior', cn: '更好的；上级的', note: '「在上面」→ 更优 / 上位。比较级用法：be superior to' },
        { w: 'surpass', ipa: '/sərˈpɑːs/', pos: '动词', cn: '超越', note: 'sur- + pass（通过）→ 超过。及物动词，后直接加宾语' },
        { w: 'surplus', cn: '过剩；盈余', note: 'sur- + plus（多）→ 超出部分 → 盈余。经济新闻常见' },
        { w: 'surrender', cn: '投降；交出', note: 'sur- + render（交出）→ 完全交出去 → 投降。引申为放弃（surrender a ticket 退票）' },
        { w: 'surveillance', cn: '监视', note: 'sur- + veil（看）→ 一直在看 → 监视。读音 /sɜːˈveɪləns/' }
      ],
      tip: 'super- 和 sur- 是同一个词根的两副面孔。'
        + '看到 sur- 就想"在上/超过"，八成是对的。'
    }
  ];

  /* ============================================================
     二·补：更多高频词根（扩充族）
     ============================================================ */
  var ROOT_LIST_EXT = [
    {
      root: 'viv / vit',
      type: '词根',
      from: '拉丁语 vivere（活）/ vita（生命）',
      gloss: '生命；活',
      detail: '变体：viv-（活，如 survive）、vit-（生命，如 vital）。'
        + '英语里两个变体都有大量派生词。',
      field: '生命',
      demo: {
        w: 'survive', ipa: '/səˈvaɪv/', pos: '动词',
        cn: '幸存',
        break: 'sur-（超过）+ viv（活）',
        note: '「活得比（灾难）更久」→ 幸存。这是唯一能进入日常英语的 surv- 词。'
      },
      family: [
        { w: 'vital', cn: '至关重要的；生命的', note: 'vit + -al → 生命的 → 至关重要的。be vital to（对…至关重要）是写作高频搭配' },
        { w: 'vivid', cn: '生动的；鲜明的', note: 'viv + -id → 活过来的 → 生动的。如 a vivid description' },
        { w: 'vitality', cn: '活力；生命力', note: 'vital + -ity → 生命力。这个词本身就说明了它的含义' },
        { w: 'revive', cn: '复活；复苏', note: 're-（再）+ viv + -e → 再活过来 → 复苏。经济复苏常说 economy revives' },
        { w: 'vivacious', cn: '活泼的', note: 'viv + -acious → 有生命力的 → 活泼的。形容人：a vivacious child' },
        { w: 'vitamin', cn: '维生素', note: '原拼 vitam- + in。词源是 vital（生命）+ amine（胺），"维持生命的胺"' }
      ],
      tip: 'vitamin 的词源是一个完整的故事：'
        + '1912 年发现它时，人们发现喂鸽子吃它能治神经症状，命名为 "vital amine"。'
    },
    {
      root: 'log / logy',
      type: '词根',
      from: '希腊语 logos（言；词）+ 后缀 -logy（学科）',
      gloss: '言；学科',
      detail: '-logy 系列是英语学科名的统一后缀：biology、psychology、sociology…'
        + '全部是"研究…的学问"。',
      field: '学科与言语',
      demo: {
        w: 'dialogue', ipa: '/ˈdaɪəlɒɡ/', pos: '名词',
        cn: '对话',
        break: 'dia-（在…之间）+ logue（言）',
        note: '「彼此之间说的话」→ 对话。英语口语教学的核心形式。'
      },
      family: [
        { w: 'biology', cn: '生物学', note: 'bio-（生命）+ -logy → 研究生命的学问' },
        { w: 'psychology', cn: '心理学', note: 'psycho-（灵魂）+ -logy。希腊词源为"研究灵魂"，与"心理"不完全等同' },
        { w: 'sociology', cn: '社会学', note: 'socio-（社会）+ -logy → 研究社会的学问' },
        { w: 'apology', cn: '道歉；辩护', note: 'apo-（离开）+ logy → 说 away（辩解的话）→ 道歉。希腊语中本是辩护词' },
        { w: 'monologue', cn: '独白', note: 'mono-（单一）+ logue → 一个人说 → 独白。戏剧术语' },
        { w: 'analogy', cn: '类比', note: 'ana-（依照）+ logy → 按照已有的话来说 → 类比。写作里常用 draw an analogy' }
      ],
      tip: '-logy = "研究…的学问"，这是一个**可推导**的规律。'
        + '遇到陌生学科名，先切出词干就能猜出大致意思。'
    },
    {
      root: 'path',
      type: '词根',
      from: '希腊语 pathos（感觉； suffering）经法语 -pathy',
      gloss: '感觉；病',
      detail: '-pathy = 感受/疾病状态。sym-（一起）→ 同感 → 共情；'
        + 'apo-（离开）→ 无感觉 → 冷漠；a-（无）→ 无感觉。',
      field: '情感与疾病',
      demo: {
        w: 'sympathy', ipa: '/ˈsɪmpəθi/', pos: '名词',
        cn: '同情',
        break: 'sym-（共同）+ pathy（感觉）',
        note: '「有同样的感觉」→ 同情。注意不与 empathy（共情）混淆：'
          + 'sympathy 是"同情他人的处境"，empathy 是"进入对方的感受"。'
      },
      family: [
        { w: 'empathy', cn: '共情', note: 'em-（进入）+ pathy → 进入对方的感受。心理学术语，与 sympathy 区分是考试高频考点' },
        { w: 'apathy', cn: '冷漠；无兴趣', note: 'a-（无）+ pathy → 没有感觉 → 冷漠。搭配 apathy about（对…漠不关心）' },
        { w: 'symptom', cn: '症状', note: 'sym-（一起）+ ptom（fall 落下）→ 一同出现的征兆 → 症状。字面是"一起掉下来的东西"' },
        { w: 'psychopathic', cn: '有精神病态的', note: 'psycho-（精神）+ path + -ic。日常口语说 psychopathic 意为"疯的"' },
        { w: 'telepathy', cn: '心灵感应', note: 'tele-（远）+ pathy → 远处的感受。词根直觉来自"远距离传心"' }
      ],
      tip: 'sympathy 与 empathy 的区别是雅思写作的经典考点：'
        + '前者是"我认为你的处境很糟"（保持距离），后者是"我感受到了你的痛苦"（进入其中）。'
    },
    {
      root: 'sens / sent',
      type: '词根',
      from: '拉丁语 sentire（感觉）/ sensus（被感觉到的）',
      gloss: '感觉',
      detail: '动词形式 sent-，名词/过去分词形式 sens-。'
        + 'consent、resent、sentiment、sensitive 全部同源。',
      field: '感觉',
      demo: {
        w: 'sensitive', ipa: '/ˈsensətɪv/', pos: '形容词',
        cn: '敏感的',
        break: 'sens + -itive',
        note: '双写 t（sens + -itive → sensitive），这是英语拼写的特殊之处。'
      },
      family: [
        { w: 'consent', cn: '同意', note: 'con-（共同）+ sent → 感觉一致 → 同意。搭配 consent to（同意某事）' },
        { w: 'resent', cn: '怨恨', note: 're-（回）+ sent → 情绪回转 → 怨恨。搭配 resent doing（讨厌做某事）' },
        { w: 'sentiment', cn: '情绪；观点', note: 'sent + -ment → 感觉的东西 → 情绪。market sentiment（市场情绪）是财经高频' },
        { w: 'consentient', cn: '有共识的', note: 'con- + sent + -ient → 感觉相同 → 共识。学术形容词' },
        { w: 'dissent', cn: '异议', note: 'dis-（不）+ sent → 感觉不同 → 异议。名词 dissent 常见于讨论' },
        { w: 'sentimental', cn: '多愁善感的', note: 'sentiment + -al。注意这个词在英语里常带贬义，与"有感情"的中文中性含义不同' }
      ],
      tip: 'consent / dissent / resent 是同一家族的三种情绪方向：'
        + '一起感觉（同意）/ 不同感觉（异议）/ 情绪回转（怨恨）。'
    },
    {
      root: 'tain / ten',
      type: '词根',
      from: '拉丁语 tenere（持有）/ tentus（被握住的）',
      gloss: '持有；保持',
      detail: '变体：tain-（保持，如 contain）、ten-（持有，如 maintain）、'
        + '-tainment（名词，如 entertainment）。',
      field: '保持与持有',
      demo: {
        w: 'maintain', ipa: '/meɪnˈteɪn/', pos: '动词',
        cn: '维持；保养；坚持认为',
        break: 'main（手） + tain（保持）',
        note: '「用手保持」→ 维持。main 本身来自拉丁语 manus（手）。'
          + '日常高频短语：maintain that（坚持认为），后接完整句子。'
      },
      family: [
        { w: 'contain', cn: '包含', note: 'con-（在内）+ tain → 装在里面 → 包含。宾语必须是内容物' },
        { w: 'obtain', cn: '获得', note: 'ob-（朝向）+ tain → 把东西拿到手边 → 获得。比 get 更正式' },
        { w: 'retain', cn: '保留', note: 're-（再）+ tain → 留住。搭配 retain control（保持控制）' },
        { w: 'entertain', cn: '娱乐；招待', note: 'enter-（进入）+ tain → 让客人进来 → 接待 → 娱乐。original sense 与"招待客人"相关' },
        { w: 'maintenance', cn: '维护；保养', note: 'maintain + -ance → 保持的行为。搭配 car maintenance（汽车保养）' },
        { w: 'detain', cn: '拘留', note: 'de-（向下）+ tain + -1 → 按住不让走 → 拘留。法律用语' }
      ],
      tip: 'entertain 的原义是"招待"，与"娱乐"的关系是引申：'
        + '让客人开心 → 使人愉悦。这类"原义与今义"的关联是记忆的钩子。'
    },
    {
      root: 'cede / cess / ced',
      type: '词根',
      from: '拉丁语 cedere（走；让出）/ cessus（走开的）',
      gloss: '走；退让',
      detail: '「走」的词根家族。cede- 动词、cess- 名词（process）、'
        + '-cede 后缀（precede 先行）。',
      field: '行走与退让',
      demo: {
        w: 'process', ipa: '/ˈprəʊses/', pos: '名词',
        cn: '过程；程序',
        break: 'pro-（向前）+ cess（走）',
        note: '「一步步向前走」→ 过程。同源 procession（游行）就是"走着前进"。'
      },
      family: [
        { w: 'precede', cn: '先于；在…之前', note: 'pre-（在前）+ cede → 走在前面。固定用法：be preceded by（被…所 precede）' },
        { w: 'concede', cn: '承认；让步', note: 'con-（一起）+ cede → 退让一步 → 承认/让步。政治辩论常用' },
        { w: 'recede', cn: '后退；减弱', note: 're-（回）+ cede → 往回走。recede into the distance（渐渐远去）' },
        { w: 'accessible', cn: '可进入的；易懂的', note: 'ac-（朝向）+ cess + -ible → 能走进去的 → 可获取的。access 是名词' },
        { w: 'unprecedented', cn: '史无前例的', note: 'un-（不）+ precede + -ed → 没有先例的。新闻高频：unprecedented scale' },
        { w: 'procedure', cn: '程序', note: 'pro-（向前）+ ced + -ure → 一步步向前走 → 程序。实验室的 procedure 就是流程' }
      ],
      tip: 'accessible 来自"能走进去的"，所以它同时指：'
        + '物理上可进入的（无障碍设施）、信息上可获取的（可下载）、理解上可懂的（通俗）。'
    },
    {
      root: 'man / manu',
      type: '词根',
      from: '拉丁语 manus（手）/ manu（手）',
      gloss: '手',
      detail: '大量表示"手工、制作"的词都出自此。',
      field: '手与操作',
      demo: {
        w: 'manual', ipa: '/ˈmænjuəl/', pos: '形容词',
        cn: '手工的；体力的',
        break: 'manu + -al',
        note: '「用手做的」→ 手工的。与 mechanic（机械师）同源，都是从"用手做事"来的。'
      },
      family: [
        { w: 'manage', cn: '管理', note: 'man-（手）+ -age → 用手操纵 → 驾驭 → 管理。日常超高频词' },
        { w: 'manufacture', cn: '制造', note: 'manu（手）+ fact（做）→ 用手做出来 → 制造。factory 的 -fy 才是工厂' },
        { w: 'manoeuvre', cn: '机动；巧妙处理', note: 'manu（手）+ -oeuvre（工作）→ 用手操作 → 灵活行动。英式拼 manoeuvre' },
        { w: 'manual', cn: '手册', note: '名词义来自"要动手操作的东西" → 使用手册' },
        { w: 'manipulate', cn: '操纵；操作', note: 'manu（手）+ -pulate → 用手摆弄 → 操纵。搭配 manipulate data（篡改数据）' },
        { w: 'manifest', cn: '显示；manifest', note: 'man-（手）+ fest（敲打）→ 用手敲打出来 → 显示。名词 manifest（清单）同源' }
      ],
      tip: 'manage / manual / manufacture 共享"手"的意象，'
        + '说明它们都源自"用手操作"这个人类最原始的动作。'
    },
    {
      root: 'cap / capt',
      type: '词根',
      from: '拉丁语 capere（拿；抓）/ captus（被抓住的）',
      gloss: '拿；抓',
      detail: '「拿」的词根家族，商业与政治词汇的主力。',
      field: '拿取与捕获',
      demo: {
        w: 'capture', ipa: '/ˈkæptʃə/', pos: '动词',
        cn: '捕获；俘获',
        break: 'cap + -ture',
        note: '「用手抓住」→ 捕获。同源 captive（战俘）——被抓的人。'
      },
      family: [
        { w: 'capacity', cn: '容量；能力', note: 'cap + -acity → 能容纳的量 → 容量 → 能力。搭配 capacity to do（做…的能力）' },
        { w: 'capture', cn: '捕获', note: '原义"抓住"，引申为"夺得（市场份额）""捕获（数据）"' },
        { w: 'captive', cn: '被俘的；被困的', note: 'capt + -ive → 被抓住的。be held captive（被囚禁）' },
        { w: 'captor', cn: '捕捉者', note: '与 captive 相对的施动者。Captor Reef 是著名地名' },
        { w: 'captivate', cn: '迷住', note: 'capt + -ivate → 用目光抓住 → 迷住。搭配 be captivated by（被…迷住）' },
        { w: 'reciprocal', cn: '互惠的', note: 're-（回）+ cip（拿）+ -rocal → 拿回来的 → 互相给还 → 互惠的。经济学的 reciprocal agreement' }
      ],
      tip: 'reciprocal 是谈判与经济类文本的高频词，'
        + '意为"对等互惠的"，比 mutual 更强调"有来有往的对应关系"。'
    },
    {
      root: 'pos / pon',
      type: '词根',
      from: '拉丁语 ponere（放置）/ positus（放好的）',
      gloss: '放',
      detail: '英语里最实用的词根之一，因为搭配极多。'
        + '动词 pon-、名词 pos-、后缀 -pose（如 purpose）。',
      field: '放置与姿态',
      demo: {
        w: 'purpose', ipa: '/ˈpɜːpəs/', pos: '名词',
        cn: '目的',
        break: 'pur-（向前，源自 pro-）+ pose（放置）',
        note: '「放在前面的东西」→ 目的。这个后缀 -pose 也出现在 expose、propose、compose、suppose、dispose。'
      },
      family: [
        { w: 'expose', cn: '暴露；揭露', note: 'ex-（向外）+ pose → 放到外面 → 暴露。搭配 expose sb. to（使某人接触）' },
        { w: 'propose', cn: '提议；求婚', note: 'pro-（向前）+ pose → 放在前面提出 → 提议。proposal（提案）是商务高频' },
        { w: 'compose', cn: '组成；创作', note: 'com-（共同）+ pose → 放在一起 → 组成。be composed of（由…组成）' },
        { w: 'suppose', cn: '假设；认为', note: 'sup-（在下面）+ pose → 放在下面的假设 → 推测。suppose 的原义是"设定"' },
        { w: 'dispose', cn: '处理；使倾向于', note: 'dis-（分开）+ pose → 分开放 → 处理。be disposed to（倾向于）' },
        { w: 'posture', cn: '姿势；态度', note: 'pos + -ture → 放置的方式 → 姿势。引申为"态度、立场"：adopt a posture（采取某种立场）' }
      ],
      tip: '这 6 个 -pose 词用同一张表就能记完：'
        + 'ex（出）/ pro（前）/ com（合）/ sup（下）/ dis（分）→ 决定是"放出去/放前面/放一起/放下面/分开"。'
    },
    {
      root: 'vert / vers',
      type: '词根',
      from: '拉丁语 vertere（转）/ versus（转过的）',
      gloss: '转',
      detail: '形容词后缀 -verse/-ious 也来自此：'
        + 'verse（转过）→ 相反的 → adverse、universal、diverse。',
      field: '转向',
      demo: {
        w: 'convert', ipa: '/kənˈvɜːt/', pos: '动词',
        cn: '转换',
        break: 'con-（完全）+ vert（转）',
        note: '「完全转过来」→ 转换。同源 conversion（转化）、converter（转换器）。'
      },
      family: [
        { w: 'diverse', cn: '多样的', note: 'di-（分开）+ vers + -e → 转到不同方向 → 多样的。这是形容"多样性"最常用的词' },
        { w: 'adverse', cn: '不利的； adverse', note: 'ad-（朝向）+ vers → 转过来对着你 → 不利的。搭配 adverse effects（不良影响）' },
        { w: 'universal', cn: '普遍的；通用的', note: 'uni-（一个）+ vers + -al → 转遍所有方向 → 普遍的' },
        { w: 'conversant', cn: '熟悉的', note: 'con-（共同）+ vers + -ant → 转遍（接触）很多 → 熟悉的。搭配 be conversant with（熟悉某领域）' },
        { w: 'controversy', cn: '争议', note: 'contro-（相对）+ vers + -y → 转向相反方向 → 争议。形容词 controversial 极高频' },
        { w: 'reverse', cn: '相反；倒转', note: 're-（回）+ verse → 转回去 → 相反。名词 reverse（倒车档）是驾驶常用词' }
      ],
      tip: 'convert / converse / convex / versatile 都长得像，'
        + '记忆锚点：conversion（转化）/ conversation（交谈）/ convex（凸的）/ versatile（多才多艺的）。'
    },
    {
      root: 'fin',
      type: '词根',
      from: '拉丁语 finis（终点；界限）/ finire（结束）',
      gloss: '结束；界限',
      detail: '经济与法律词汇常见。注意与 -fine（罚款）区分：'
        + 'fine 作名词是"罚款"，但与"结束"同源（拉丁语 finis → fine）。',
      field: '结束与界限',
      demo: {
        w: 'define', ipa: '/dɪˈfaɪn/', pos: '动词',
        cn: '定义',
        break: 'de-（下）+ fin（界限）',
        note: '「划出界限」→ 定义。这是全英语最常用的"定义"动词。'
      },
      family: [
        { w: 'final', cn: '最后的', note: 'fin + -al → 到终点的 → 最后的。finance（财务）同源' },
        { w: 'finance', cn: '财政；金融', note: 'fin + -ance → 到了尽头才结账 → 结算 → 财务。金融行业的词根' },
        { w: 'confine', cn: '限制； confines（界限）', note: 'con-（在内）+ fin → 限制在范围内 → 拘禁。常用复数 confines（边界）' },
        { w: 'refine', cn: '精炼；改进', note: 're-（再）+ fin + -e → 再做一次终末处理 → 精炼。搭配 refine your idea（完善想法）' },
        { w: 'infinite', cn: '无限的', note: 'in-（不）+ fin + -ite → 没有终点 → 无限的。数学基础词' },
        { w: 'fiscal', cn: '财政的', note: '与 finish 同源，指"与结账/账目有关的"。fiscal year（财年）是财经高频' }
      ],
      tip: 'finance / fiscal / final / define 共享"终结"的意象，'
        + '因为在拉丁时代"结算"就是"到期末结账"。'
    },
    {
      root: 'gen',
      type: '词根',
      from: '拉丁语 genus（种类；起源）/ generare（产生）',
      gloss: '产生；种类',
      detail: '表达"起源、种类、产生"的庞大词族。'
        + 'gen-（基因）就是从拉丁语 genus 借来的。',
      field: '起源与种类',
      demo: {
        w: 'generate', ipa: '/ˈdʒenəreɪt/', pos: '动词',
        cn: '产生；生成',
        break: 'gen + -erate',
        note: '「产生」。同源 generator（发电机）、generation（一代人）、genius（天赋）。'
      },
      family: [
        { w: 'genuine', cn: '真正的', note: '与 genius 同源，原义"天赋的" → 天然生成的 → 真正的。genuine concern（真诚的关切）' },
        { w: 'generous', cn: '慷慨的', note: 'gen-（种类）+ -ous → 高贵的出身 → 慷慨。词义引申路线是"贵族式的给予"' },
        { w: 'generic', cn: '通用的；无品牌的', note: 'gen（种类）+ -ic → 属于类的 → 通用的。generic drug（仿制药）' },
        { w: 'genre', ipa: '/ˈʒɒnrə/', pos: '名词', cn: '体裁；类型', note: '法语借词，原义"种类"。genres of literature（文学体裁）' },
        { w: 'ingenious', cn: '巧妙的；有创造力的', note: '与 ingenuous（天真的）只差一个字母，是经典易混对。搭配 an ingenious solution' },
        { w: 'germinate', cn: '发芽；产生', note: 'germ（芽）+ inate → 生出芽。比喻义：an idea germinates（想法逐渐成形）' }
      ],
      tip: 'ingenuous（天真的）与 ingenious（巧妙的）是高频混淆对。'
        + '记法：in-（不）+ genu（天赋）→ 没有伪装 → 天真的；'
        + 'in + geni（天生的才智）→ 有巧思的。'
    },
    {
      root: 'nol / nos',
      type: '词根',
      from: '拉丁语 noscere（知道）/ notus（已知的）',
      gloss: '知道；认识',
      detail: '表达"认识、知道、描述"的词族。'
        + 'note / not- 表示"知道"，是拉丁语最灵活的词根之一。',
      field: '认知',
      demo: {
        w: 'notify', ipa: '/ˈnəʊtɪfaɪ/', pos: '动词',
        cn: '通知',
        break: 'not（知道）+ -ify（使…）',
        note: '「使人知道」→ 通知。搭配 notify sb. of sth.（通知某人某事）。'
      },
      family: [
        { w: 'notable', cn: '显著的；著名的', note: 'not + -able → 值得知道的 → 显著的。搭配 notable achievement' },
        { w: 'notion', cn: '概念；想法', note: 'not + -ion → 脑中的认知 → 概念。the notion that（…这一概念）' },
        { w: 'annotate', cn: '注释', note: 'an-（在…上）+ not + -ate → 在旁边写上认知 → 注释' },
        { w: 'denote', cn: '表示；指代', note: 'de-（下）+ not + -e → 下下来定义 → 表示。语言学常用词' },
        { w: 'recognize', cn: '认出；承认', note: 're-（再）+ cogn（知道）+ -ize → 再一次知道 → 认出。认知心理学 cognitive 同一词根' },
        { w: 'knowledge', cn: '知识', note: 'know + -ledge，不属于本词根，但语义相通：知道的东西 → 知识' }
      ],
      tip: 'notion 与 knowledge 语义相通但搭配不同：'
        + 'knowledge 强调"知道的总量"，notion 强调"脑中的概念、想法"。'
    }
  ];

  ROOT_LIST = ROOT_LIST.concat(ROOT_LIST_EXT);

  /* ============================================================
     三、词缀（前缀 + 后缀）
     ============================================================ */
  var AFFIX_LIST = [
    /* ---- 否定 ---- */
    { affix: 'un-', type: '前缀', from: '英语 / 拉丁语 in- 的变体', gloss: '不；相反',
      note: '最常用的否定前缀。用于形容词与名词。',
      words: ['unhappy', 'unusual', 'unavoidable', 'unconscious', 'unprecedented'],
      tip: '加在形容词上；原词已是形容词时可能变成副词（unlucky → unluckily）。' },
    { affix: 'in-', type: '前缀', from: '拉丁语 in-（不）', gloss: '不（多用于拉丁源词）',
      note: '学术词、法律词偏好这个形式。',
      words: ['invisible', 'inevitable', 'incompetent', 'indifferent', 'infinite'],
      tip: '遇到 -ible/-able 结尾的词，不可用 in- 只能用 un-（invisible ✓ / unable ✗）。' },
    { affix: 'im-', type: '前缀', from: '拉丁语 in- 的辅音同化', gloss: '不',
      note: '用于 b/m/p 开头的词根。',
      words: ['impossible', 'immature', 'impatient', 'imperfect', 'impartial'],
      tip: 'im- 只用于 b/m/p 开头：impossible ✓ / impolite ✓ / inpossible ✗。' },
    { affix: 'il-', type: '前缀', from: '拉丁语 in- 的辅音同化', gloss: '不',
      note: '用于 l 开头的词根。',
      words: ['illegal', 'illiterate', 'illegible', 'illogical', 'illegible'],
      tip: '与 illegal、illicit 区分：illegal（违法的）/ illicit（违禁的），后者多用于贸易。' },
    { affix: 'dis-', type: '前缀', from: '拉丁语 dis-（分开；不）', gloss: '不；相反；分开',
      note: '既表否定，也可表"分开"。',
      words: ['disagree', 'disappear', 'disable', 'discard', 'distract'],
      tip: 'distract（分散注意力）字面是"拉到别处去"，discard（丢弃）是"分开藏起来"。' },
    /* ---- 程度 ---- */
    { affix: 'super-', type: '前缀', from: '拉丁语 super-', gloss: '超过；过度',
      note: '程度与空间双义。',
      words: ['supermarket', 'superficial', 'supervise', 'superior', 'superstition'],
      tip: 'superficial（表面的）是"只看表面"——super（在上面）+ facial（脸的）。' },
    { affix: 'over-', type: '前缀', from: '英语 over-', gloss: '过度；超过',
      note: '常表"做得太多"。',
      words: ['overwork', 'overestimate', 'overcome', 'overwhelm', 'overlap'],
      tip: 'overcome 是唯一表"克服"的（字面是"压过"），overwhelm 表"淹没"要记区别。' },
    { affix: 'under-', type: '前缀', from: '英语 under-', gloss: '不足；下方',
      note: '常表"做得不够"。',
      words: ['underestimate', 'undergo', 'underline', 'undertake', 'undergraduate'],
      tip: 'undergo（经历）字面是"走到底下"，是最容易误解的搭配之一。' },
    /* ---- 方向 ---- */
    { affix: 're-', type: '前缀', from: '拉丁语 re-（回；再）', gloss: '回；再',
      note: '英语中最高频的词缀之一，但含义需靠搭配推断。',
      words: ['rewrite', 'rebuild', 'reconsider', 'recover', 'recur'],
      tip: 're- 不总是"再"：recover（恢复）、retire（退休）是"回"。判断方法：看宾语能不能被"再来一遍"。' },
    { affix: 'pre-', type: '前缀', from: '拉丁语 prae-（前）', gloss: '在…之前',
      note: '表时间或空间的"先"。',
      words: ['preview', 'predict', 'prepare', 'previous', 'precede'],
      tip: 'precede（先于）与 peruse（细读）拼写相近，注意区分。' },
    { affix: 'inter-', type: '前缀', from: '拉丁语 inter-（在…之间）', gloss: '在…之间；相互',
      note: '表"之间"或"相互"。',
      words: ['international', 'interact', 'interview', 'intervene', 'interpret'],
      tip: 'interpret 字面是"在两者之间解读"——这是"翻译"一词的来源。' },
    { affix: 'trans-', type: '前缀', from: '拉丁语 trans-（横越）', gloss: '横越；转移',
      note: '表"穿过"或"改变状态"。',
      words: ['translate', 'transfer', 'transparent', 'transmit', 'transition'],
      tip: 'transparent 是"能看穿的"——trans + par（显现），即光能穿过去。' },
    /* ---- 形容词后缀 ---- */
    { affix: '-able / -ible', type: '后缀', from: '拉丁语 -abilis / -ibilis', gloss: '能够…的；可被…的',
      note: '构成形容词，表示"可以被…的"或"能够…的"。',
      words: ['readable', 'comfortable', 'reliable', 'flexible', 'accessible'],
      tip: '注意拼写：-able 用元音字母收尾（comfortable），-ible 用辅音收尾（terrible）。' },
    { affix: '-ous', type: '后缀', from: '拉丁语 -osus', gloss: '充满…的；有…性质的',
      note: '常带褒义或中性。',
      words: ['dangerous', 'famous', 'nervous', 'various', 'curious'],
      tip: '-ous 常带"多"的暗示：various（各种各样的）、nervous（充满紧张的）。' },
    { affix: '-ful', type: '后缀', from: '英语 -full', gloss: '充满；量词（标准容量）',
      note: '双重含义：形容词"充满"、名词"满杯"。',
      words: ['beautiful', 'useful', 'careful', 'powerful', 'helpful'],
      tip: 'beautiful 里 -ful 表示"充满美"，不是"美很多"。' },
    { affix: '-less', type: '后缀', from: '英语 -less', gloss: '没有；不',
      note: '-less 的反义。',
      words: ['useless', 'hopeless', 'endless', 'restless', 'homeless'],
      tip: 'restless 是"静不下来"，不是"没有休息"；endless 是"没有终点"。' },
    { affix: '-ly', type: '后缀', from: '英语 -ly', gloss: '以…方式；像…一样',
      note: '绝大多数是副词，但少数是形容词。',
      words: ['quickly', 'carefully', 'friendly', 'lovely', 'daily'],
      tip: 'friendly、lovely、lonely、lively 是形容词（描述事物），不是副词。' },
    { affix: '-ment', type: '后缀', from: '拉丁语 -mentum', gloss: '行为；结果；手段',
      note: '构成名词，中性。',
      words: ['movement', 'government', 'achievement', 'payment', 'argument'],
      tip: 'government 是" govern + ment "（管理的行为）→ 政府，这是理解政治词的关键。' },
    { affix: '-tion / -sion', type: '后缀', from: '拉丁语 -tio / -sio', gloss: '动作；结果；状态',
      note: '构成抽象名词，最常见的名词后缀之一。',
      words: ['action', 'decision', 'information', 'situation', 'conversation'],
      tip: '-tion 与 -sion 交替出现：decision（决定）是 -sion，因为前面的 d 是 -s- 的读音同化。' }
  ];

  /* ============================================================
     四、导出
     ============================================================ */
  var ALL = ROOT_LIST.concat(AFFIX_LIST);

  var RootIndex = {
    /** 全部词根词缀 */
    all: function () { return ALL; },

    /** 仅词根 */
    roots: function () { return ROOT_LIST; },

    /** 仅词缀 */
    affixes: function () { return AFFIX_LIST; },

    /** 按语义场分组（词根才有 field） */
    byField: function () {
      var g = {};
      ROOT_LIST.forEach(function (r) {
        if (!r.field) return;
        if (!g[r.field]) g[r.field] = [];
        g[r.field].push(r);
      });
      return g;
    },

    /** 语种来源分组 */
    byOrigin: function () {
      var g = {};
      ALL.forEach(function (r) {
        // 取来源里的语种名
        var m = /(拉丁语|希腊语|法语|日耳曼语|英语)/.exec(r.from || '');
        var lang = m ? m[1] : '其他';
        if (!g[lang]) g[lang] = [];
        g[lang].push(r);
      });
      return g;
    },

    /** 按词根串同源词：一个词根下的所有同源词 */
    familyOf: function (root) {
      var r = ALL.filter(function (x) { return x.root === root || x.affix === root; })[0];
      return r ? (r.family || r.words || []) : [];
    },

    /**
     * 反查：给定一个单词，找出它属于哪些词根词缀。
     * 这是「划词取词」功能的核心 —— 选中任意词都能追溯到它的来路。
     */
    lookup: function (word) {
      var w = String(word || '').trim().toLowerCase();
      if (!w) return [];
      return ALL.filter(function (x) {
        var key = x.root || x.affix;
        var stem = String(key || '').split('/')[0].replace(/-$/, '');
        if (!stem) return false;
        if (w === key) return true;
        if (w.indexOf(stem) >= 0) return true;
        // 同源词命中
        var fam = x.family || x.words || [];
        for (var i = 0; i < fam.length; i++) {
          var fw = (typeof fam[i] === 'string' ? fam[i] : fam[i].w) || '';
          if (fw.toLowerCase() === w) return true;
        }
        return false;
      });
    },

    /** 统计 */
    stats: function () {
      var familyCount = ROOT_LIST.reduce(function (n, r) {
        return n + (r.family ? r.family.length : 0);
      }, 0);
      var affixWords = AFFIX_LIST.reduce(function (n, a) {
        return n + (a.words ? a.words.length : 0);
      }, 0);
      return {
        roots: ROOT_LIST.length,
        affixes: AFFIX_LIST.length,
        total: ALL.length,
        familyWords: familyCount,
        affixWords: affixWords
      };
    }
  };

  global.RootIndex = RootIndex;
})(window);
