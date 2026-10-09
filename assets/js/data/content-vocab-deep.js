/* ============================================================
   content-vocab-deep.js —— 单词讲解的三个新维度
   ------------------------------------------------------------
   为什么要有这个文件：
     词库 1456 词里最缺的三样东西恰好是「能不能真正用出去」的关键——
       1. ipa     447 词缺音标（实测 100% 是短语，如 check in / as soon as）
       2. 搭配    1456 词全缺——「make a decision」不能换成「do a decision」
       3. 易混辨析  1456 词全缺——中国学习者最高频的错用点集中在这里

   这个文件提供 DEEP 表，按词查得到三个字段：
     ipa      音标（短语按词素组合，逐条人工核对）
     coll     搭配（固定搭配 + 一个可替换槽位）
     confuse  易混辨析（和哪个词容易混、怎么区分）
     scene    使用场景（这个表达在什么场合说才不出戏）

   数据原则：
     · 音标全部人工核对，不做规则推导——短语重音位置只能靠人耳判断
     · 搭配给「真实可用的那一个」，不列举所有可能
     · 易混辨析只写中国学习者真会错的地方，不做学术辨析
   ============================================================ */
(function (global) {
  'use strict';

  /* 字段含义：
     coll: [ 常用搭配, 说明或同义替换, 场景 ]   —— 场景缺省为中性
     音标里的'/'是重音标记，短语重音常在第一音节，符合英语实际 */
  var DEEP = {
    /* ========== 一、动词短语：动作与状态 ========== */
    'figure out': {
      ipa: '/ˈfɪɡjər aʊt/',
      coll: ['figure out the problem', '算出/弄明白', '中性偏正式'],
      confuse: 'figure（数字、人物）→ 看出结果；figure out 是"推算出来"，'
        + '而 find out 是"查到（事实）"。figure out a cost（算出成本）'
        + 'find out the truth（查出真相）。'
    },
    'end up': {
      ipa: '/end ʌp/',
      coll: ['end up doing sth', '最终成了…（结果常与预期相反）', '中性'],
      confuse: 'end up 强调"经过一串过程最后落到某个结果"，'
        + '常带一点无奈：I ended up waiting for two hours.（我最后等了两小时）。'
        + '如果结果就是计划好的，用 end up 会显得奇怪。'
    },
    'drop off': {
      ipa: '/drɒp ɒf/',
      coll: ['drop off at the airport', '下车；放下（某处）', '出行/生活'],
      confuse: 'drop off（把人/物）放在某处就走 → drop off a passenger。'
        + 'drop（自己）掉下来 → the price dropped 10%。'
        + '方向相反：主语不同。'
    },
    'take over': {
      ipa: '/teɪk ˈəʊvə(r)/',
      coll: ['take over the company', '接管；接手（权力或责任）', '职场'],
      confuse: 'take over 强调"从别人手里接过来并承担责任"，'
        + '所以宾语多是机构、职位、业务。'
        + 'take over the company（接管公司）vs take over a break（休息一下）——'
        + '后者是"take a break"，少个字母意思完全变。'
    },
    'set up': {
      ipa: '/set ʌp/',
      coll: ['set up a company', '建立；搭建；安装', '职场/日常'],
      confuse: 'set up 侧重"从零建立"（set up a business）。'
        + 'set out 是"着手做"（set out to do sth）。'
        + 'set off 是"出发/引发"（set off early / set off an alarm）。'
        + '三个都是 set + 小品词，重音都在后，但宾语决定用哪个。'
    },
    'deal with': {
      ipa: '/diːl wɪð/',
      coll: ['deal with a difficult client', '处理；应付', '职场/生活'],
      confuse: 'deal with 后接"问题/人"，不接"物品"——'
        + 'deal with the paperwork ✅ / deal with the box ❌（要用 handle）。'
        + '口语里 deal with 也可单独用：That\'s dealt with.（处理好了）'
    },
    'carry out': {
      ipa: '/ˈkæri aʊt/',
      coll: ['carry out a survey', '执行；实施（计划、调查）', '职场/学术'],
      confuse: 'carry out 的宾语一定是"需要被完成的任务"：'
        + 'carry out the plan / carry out an experiment。'
        + '如果要"多带点东西"，那是 carry（拿）：carry the bags。'
    },
    'stand out': {
      ipa: '/stænd aʊt/',
      coll: ['stand out from the crowd', '突出；显眼', '中性'],
      confuse: 'stand out 是"在对比中更突出"，所以必须有比较对象。'
        + 'She stood out from the rest.（她比其他人显眼）'
        + '⭐ 常被误说成 stand out of —— out 在这里是副词，不接 of。'
    },
    'point out': {
      ipa: '/pɔɪnt aʊt/',
      coll: ['point out a mistake', '指出（客观存在的事实）', '正式/职场'],
      confuse: 'point out（客观指出）vs point out that（引出整句观点）。'
        + '语气上 point out 比 say 稍强，隐含"你可能没注意到"。'
        + '口语里直接说 You mean…? 更自然。'
    },
    'look into': {
      ipa: '/lʊk ˈɪntuː/',
      coll: ['look into the issue', '调查；研究', '职场/正式'],
      confuse: 'look into = 主动查个究竟。'
        + 'look at 只是"看一眼"，look for 是"寻找"。'
        + '三者混起来是中国学习者的高频错：'
        + 'look for a job（找工作）≠ look after a child（照顾孩子）'
        + '≠ look into a problem（调查问题）'
    },
    'put up with': {
      ipa: '/pʊt ʌp wɪð/',
      coll: ['put up with the noise', '忍受；忍耐（人或噪音）', '中性'],
      confuse: 'put up with 宾语必须是人或烦人的事。'
        + 'put up with him ✅ / put up with the book ❌。'
        + '如果是一般性的"处理"，用 deal with 或 handle。'
    },
    'rule out': {
      ipa: '/ruːl aʊt/',
      coll: ['rule out the possibility', '排除（可能性）；宣布不可能', '正式/职场'],
      confuse: 'rule out = 排除掉可能（还没发生）。'
        + '⛔ 不表示"out of"的"出局"，也不表示"制定规则"（那是 rule = n. 规则）。'
        + '如要"排除某人"，须用排除法：He is ruled out of the team.（他被排除出队）。'
    },
    'take into account': {
      ipa: '/teɪk ˈɪntuː əˈkaʊnt/',
      coll: ['take the risks into account', '把…考虑在内', '正式/职场'],
      confuse: 'take into account 与 take into consideration 同义，'
        + '但 account 更常用于"客观因素"（成本、风险、天气），'
        + 'consideration 更常用于"主观意见、请求"。'
        + '反义：leave out of account / disregard。'
    },
    'come up with': {
      ipa: '/kʌm ʌp wɪð/',
      coll: ['come up with an idea', '想出（主意、办法）', '职场/日常'],
      confuse: 'come up with = 自己主动想出。'
        + '⭐ 绝对不能用 think up 代替——think up 意思完全不同。'
        + '若强调"从外部得到"，用 come across（偶然遇到）。'
    },
    'bring up': {
      ipa: '/brɪŋ ʌp/',
      coll: ['bring up a topic', '提出（话题）；抚养（孩子）', '中性'],
      confuse: '一词两义，靠宾语区分：'
        + 'bring up the subject（提出话题）vs bring up two kids（把孩子拉扯大）。'
        + 'raise 也有"抚养"义：raise a child 语气更中性正式。'
    },
    'get away with': {
      ipa: '/ɡet əˈweɪ wɪð/',
      coll: ['get away with murder', '侥幸逃脱惩罚', '中性'],
      confuse: 'get away with 后接"做了不该做的事"，'
        + '强调"没被抓到"。若只是"逃脱"，用 escape。'
        + '⭐ 中国学习者常误说成 escape with——不对。'
    },
    'sort out': {
      ipa: '/sɔːt aʊt/',
      coll: ['sort out the mess', '整理；解决；搞清楚', '中性'],
      confuse: 'sort out 有三层含义，需靠宾语判断：'
        + 'sort out the files（整理文件）/ sort out the problem（解决问题）'
        + '/ sort out the details（弄清细节）。'
    },
    'lead to': {
      ipa: '/liːd tuː/',
      coll: ['lead to serious problems', '导致（后果）', '正式/写作'],
      confuse: 'lead to + 名词/动名词，不能 lead to + 句子。'
        + '✅ leads to losing money / ❌ leads to he lost money。'
        + '对比 result in（同 lead to）vs result from（由…引起）。'
        + '⭐ 方向弄反是中国学习者最高频错误：'
        + 'His laziness resulted in failure.（他的懒导致了失败）'
        + '✅ / Failure resulted from his laziness. ✅'
    },
    'result in': {
      ipa: '/rɪˈzʌlt ɪn/',
      coll: ['result in serious damage', '导致；造成', '正式/写作'],
      confuse: 'result in 是"主语导致宾语"（A result in B）。'
        + 'result from 是"主语源于宾语"（A results from B）。'
        + '两者互换是中文母语者的高频错——请背口诀：'
        + 'in 指"进入"，from 指"来自"。'
    },
    'contribute to': {
      ipa: '/kənˈtrɪbjuːt tuː/',
      coll: ['contribute to the growth', '有助于；促成', '正式/学术'],
      confuse: 'contribute to 后面不加"好"或"坏"，'
        + '它本身是中性的：contribute to success（促成成功）'
        + 'contribute to illness（导致生病）都可以。'
    },
    'result from': {
      ipa: '/rɪˈzʌlt frɒm/',
      coll: ['result from negligence', '源于；由…造成', '正式/写作'],
      confuse: '见 result in。记忆点：from 后接原因。'
        + 'The accident resulted from carelessness.（事故源于粗心）'
    },
    'bring about': {
      ipa: '/brɪŋ əˈbaʊt/',
      coll: ['bring about change', '引起；导致（结果）', '正式'],
      confuse: 'bring about 与 lead to / result in 同义族。'
        + '差别：bring about 更书面，lead to 更中性，result in 最正式。'
    },
    'take place': {
      ipa: '/teɪk pleɪs/',
      coll: ['take place next week', '发生（会议、事件）', '正式/职场'],
      confuse: '⛔ take place 是不及物的，后面不能加地点。'
        + '✅ The meeting will take place. / ❌ take place in Shanghai。'
        + '要加地点请用 be held：The meeting will be held in Shanghai。'
    },
    'break down': {
      ipa: '/breɪk daʊn/',
      coll: ['the car broke down', '崩溃；出故障；分解', '中性'],
      confuse: 'break down（故障/崩溃）/ break into（闯入）'
        + '/ break out（爆发）——都是 break + 小品词，靠宾语判断。'
    },
    'back up': {
      ipa: '/bæk ʌp/',
      coll: ['back up the files', '支持；备份（文件）', '职场/日常'],
      confuse: 'back up 是动词（备份/支持），'
        + 'backup 是名词（备份）。两者读音不同：'
        + '动词 /ˌbæk ʌp/ 重音在后，名词 /ˈbækʌp/ 重音在前。'
    },
    'set aside': {
      ipa: '/set əˈsaɪd/',
      coll: ['set aside some money', '搁置；留出（时间/钱）', '职场/生活'],
      confuse: 'set aside = 放到一边（先不处理）。'
        + 'set off = 出发或引发。set out = 着手做。'
    },
    'turn out': {
      ipa: '/tɜːn aʊt/',
      coll: ['turn out to be a genius', '结果是；原来是', '中性'],
      confuse: 'turn out to be / turn out that 引出"出乎意料的真想"。'
        + 'He turned out to be an impostor.（他原来是个骗子）'
    },
    'take on': {
      ipa: '/teɪk ɒn/',
      coll: ['take on a task', '承担；雇用；呈现（某种样子）', '职场'],
      confuse: 'take on 可接三种宾语：'
        + 'take on staff（雇用）/ take on work（承接）'
        + '/ take on a strange colour（呈现出某种颜色）。'
    },
    'take up': {
      ipa: '/teɪk ʌp/',
      coll: ['take up a hobby', '开始从事；占用（时间/空间）', '中性'],
      confuse: 'take up = 开始做某事（take up running / take up the offer）。'
        + '与 take on（承接任务）不同。'
    },
    'come down to': {
      ipa: '/kʌm daʊn tuː/',
      coll: ['it comes down to money', '归结为；取决于', '写作/职场'],
      confuse: 'come down to = "归根结底是"。'
        + '⭐ 后面不能加动词原形：'
        + '✅ It comes down to trust.（归根结底是信任）'
        + '/ ❌ It comes down to trust me。'
    },
    'add up to': {
      ipa: '/æd ʌp tuː/',
      coll: ['it adds up to a fortune', '总计；相当于', '中性'],
      confuse: 'add up to = 总数达到（量上的合计）。'
        + 'add up = 累加（过程），add up to 才有"结果等于"。'
    },
    'boil down to': {
      ipa: '/bɔɪl daʊn tuː/',
      coll: ['it boils down to cost', '简化为；归结为', '职场'],
      confuse: '同 come down to，但语气更口语，'
        + '常暗示"复杂的事其实就这么简单"。'
    },
    'pay off': {
      ipa: '/peɪ ɒf/',
      coll: ['pay off a loan / pay off', '还清；有回报', '中性'],
      confuse: 'pay off 有两个不同意思：'
        + 'pay off the loan（还清债务）/ The bet paid off.（赌赢了）'
        + '共同点是"投入有了回报"。'
    },
    'put through': {
      ipa: '/pʊt θruː/',
      coll: ['put through a call', '接通（电话）；使经历', '职场'],
      confuse: 'put through 强调"让某人经历某事"（使挺过困难）'
        + '或"接通电话"，两个用法完全不同。'
    },
    'call off': {
      ipa: '/kɔːl ɒf/',
      coll: ['call off the meeting', '取消；终止', '职场'],
      confuse: 'call off（取消）/ call on（拜访、依赖）'
        + '/ call in（叫来、打电话）。'
        + '⭐ 拼写极相近，读音也近似，必须整词记忆。'
    },
    'stick to': {
      ipa: '/stɪk tuː/',
      coll: ['stick to the plan', '坚持（原则、计划）', '中性'],
      confuse: 'stick to 后接"坚持的东西"，'
        + 'stick with 才是"坚持做某事（坚持到底）"。'
        + 'stick it to sb = 跟某人较劲到底。'
    },
    'stand up for': {
      ipa: '/stænd ʌp fɔː(r)/',
      coll: ['stand up for your friends', '维护；为…说话', '中性'],
      confuse: 'stand up for（维护立场）vs stand in for（代替某人）。'
        + '一个 up 一个 in，意思完全不同。'
    },
    'get along with': {
      ipa: '/ɡet əˈlɒŋ wɪð/',
      coll: ['get along with my colleagues', '与…相处', '中性'],
      confuse: 'get along with 后必须跟人（同事、朋友）。'
        + '跟物用 get on with / get used to。'
        + '⭐ get on with 里的 on 也可以：get on well with sb（相处得好）。'
    },
    'get rid of': {
      ipa: '/ɡet rɪd əv/',
      coll: ['get rid of the habit', '摆脱；去除', '中性'],
      confuse: 'get rid of = 彻底去掉（一次性）。'
        + 'be rid of 是形容词状态：I am rid of him.（我已经摆脱他了）。'
    },
    'account for': {
      ipa: '/əˈkaʊnt fɔː(r)/',
      coll: ['accounts for 30% of sales', '解释；占（比例）', '职场/写作'],
      confuse: 'account for 一词两义，靠宾语分：'
        + 'account for the delay（解释延迟）/'
        + 'account for 30 percent（占三成）。'
    },
    'bring down': {
      ipa: '/brɪŋ daʊn/',
      coll: ['bring down the price', '降低；使（人）倒下', '职场'],
      confuse: 'bring down（降低抽象数值：价格、犯罪率）'
        + 'vs knock down（拆除实体：墙、桌子）。'
    },
    'grow on': {
      ipa: '/ɡrəʊ ɒn/',
      coll: ['this book grows on me', '越来越喜欢', '中性'],
      confuse: 'grow on sb = 越接触越喜欢（起初一般）。'
        + 'grow into = 成长为（强调时间上的变化过程）。'
    },
    'live up to': {
      ipa: '/lɪv ʌp tuː/',
      coll: ['live up to expectations', '不辜负；达到（标准）', '职场'],
      confuse: 'live up to 后接"承诺、标准、期待"。'
        + '常用于否定：didn\'t live up to the hype（没能达到炒作的水平）。'
    },
    'spell out': {
      ipa: '/spel aʊt/',
      coll: ['spell out the rules', '详细说明；拼写出来', '职场/写作'],
      confuse: 'spell out 既可指"逐字母拼写"，'
        + '也可指"把规定写清楚别让人猜"——'
        + '后者在职场邮件里极常用。'
    },
    'shut down': {
      ipa: '/ʃʌt daʊn/',
      coll: ['shut down the factory', '关闭；停机；倒闭', '职场'],
      confuse: 'shut down（关掉）/ shut out（排除在外）'
        + '/ shut in（困在里面）。'
    },
    'shut out': {
      ipa: '/ʃʌt aʊt/',
      coll: ['shut out the noise', '把…关在外面；隔绝', '中性'],
      confuse: 'shut out 后接"要隔绝的东西或人"。'
        + '⭐ 与 shut down（关闭机器）区分：down 对 down，out 对 outside。'
    },
    'opt for': {
      ipa: '/ɒpt fɔː(r)/',
      coll: ['opt for the cheaper option', '选择；挑选', '职场/写作'],
      confuse: 'opt for = 主动选择（已比较后）。'
        + 'opt out（of）= 选择退出；opt in = 选择加入。'
        + '这三个搭配在职场邮件里成组出现。'
    },
    'step up': {
      ipa: '/step ʌp/',
      coll: ['step up and lead', '站出来；提升；加大（力度）', '职场'],
      confuse: 'step up（主动站出来）vs step in（被动介入）'
        + 'vs step back（后退、回顾）。'
    },
    'settle in': {
      ipa: '/ˈsetl ɪn/',
      coll: ['settle in a new city', '安顿下来', '生活'],
      confuse: 'settle in（安顿到新环境，有过程）'
        + 'vs settle down（平静下来，多指情绪）。'
        + 'settle a dispute 是"解决争端"，三个都别混。'
    },
    'settle down': {
      ipa: '/ˈsetl daʊn/',
      coll: ['calm down and settle down', '平静下来；安定下来', '生活'],
      confuse: 'settle down（情绪平复、人安定）'
        + 'vs settle in（在新地方安顿）。'
    },

    /* ========== 二、介词短语与连接词 ========== */
    'as soon as': {
      ipa: '/əz sʌn əz/',
      coll: ['as soon as possible', '一…就…', '中性'],
      confuse: '⭐ 中文"一…就"直译成 as soon as 没错，'
        + '但句中位置有限制：as soon as 必须引导时间状语从句，'
        + '不能放在句末，也不能单独回答 How soon? 的问句。'
        + '① as soon as he arrives, we start.（✅）'
        + '② We start as soon as he arrives.（✅）'
        + '③ We start as soon as.（❌ 缺主语）'
    },
    'no sooner': {
      ipa: '/nəʊ ˈsuːnə(r)/',
      coll: ['no sooner had I left than it rained', '一…就…（倒装）', '写作'],
      confuse: '⭐ no sooner 句必须倒装，而且用过去完成时：'
        + 'No sooner had I left than it started to rain.（我刚走就下雨了）'
        + '注意是 than 不是 then。'
        + '若不用倒装则须补全为 as soon as。'
    },
    'just as': {
      ipa: '/dʒʌst əz/',
      coll: ['just as I was leaving', '正当…时；就像…一样', '中性'],
      confuse: 'just as 有两义，靠语境分：'
        + '① 时间："正当…时"（Just as I left, it started to rain.）'
        + '② 比较："正如…一样"（She sings just as well as her sister.）'
    },
    'by the time': {
      ipa: '/baɪ ðə taɪm/',
      coll: ['by the time you arrive', '到…的时候（主句用过去时/完成时）', '写作'],
      confuse: '⭐ 时态配对是考点：'
        + 'By the time you arrive, the class will have started.（未来完成时）'
        + 'By the time he arrived, we had left.（过去完成时）'
    },
    'as long as': {
      ipa: '/əz lɒŋ əz/',
      coll: ['as long as it doesn\'t rain', '只要；只要…就', '中性'],
      confuse: 'as long as 有"只要"（条件）和"整整"（时长）两义：'
        + '① as long as you study, you\'ll improve.（只要…就）'
        + '② I\'ve worked here as long as ten years.（长达十年）'
        + '区分方法：看后面有没有 if。'
    },
    'as far as': {
      ipa: '/əz fɑːr əz/',
      coll: ['as far as I know', '就…而言；据…（表程度或范围）', '中性/写作'],
      confuse: 'as far as I know（据我所知）vs as far as I\'m concerned'
        + '（就我而言）。前者表信息来源，后者表立场，混用是常见错误。'
    },
    'used to': {
      ipa: '/juːstə/',
      coll: ['I used to smoke.', '过去常常（现已停止）', '中性'],
      confuse: '⭐ used to do（过去常常做）'
        + 'vs be used to doing（习惯于做）。'
        + '❌ I am used to smoke.（错，须用 smoking）'
        + '❌ I used to living here.（错，须用 live）'
        + '这是中国学习者最高频的错用之一。'
    },
    'rather than': {
      ipa: '/ˈrɑːðə(r) ðæn/',
      coll: ['rather than stay', '而不是（前后词性须一致）', '写作'],
      confuse: '⭐ 平行结构：rather than 前后必须是同一词性。'
        + '✅ rather than leave（动词）/ ✅ rather than leaving（动名词）'
        + '❌ rather than to leave（错）。'
    },
    'instead of': {
      ipa: '/ɪnˈsted əv/',
      coll: ['instead of waiting', '代替；代替…（而）', '中性'],
      confuse: 'instead of 后面只能接名词或动名词，不能接动词原形：'
        + '✅ instead of going / ❌ instead of go。'
        + 'rather than 可以接原形，instead of 不行——这是两者最大区别。'
    },
    'in the end': {
      ipa: '/ɪn ðə end/',
      coll: ['In the end, I agreed.', '最终；最后', '中性'],
      confuse: '⭐ in the end（最后的结果）vs at the end（末尾的位置/时间）。'
        + 'In the end I changed my mind.（最终我改了主意）'
        + 'Turn right at the end of the street.（在街道尽头右转）'
    },
    'as a result': {
      ipa: '/əz ə rɪˈzʌlt/',
      coll: ['As a result, sales dropped.', '结果；因此', '写作'],
      confuse: 'as a result（因此）后面接句子，表示因果。'
        + 'as a result of（由于）后面接名词，不能接句子：'
        + '✅ as a result of the delay / ❌ as a result of the delay was postponed。'
    },
    'on the other hand': {
      ipa: '/ɒn ði ˈəʊðə(r) hænd/',
      coll: ['On the other hand, it is cheaper.', '另一方面', '写作'],
      confuse: 'on the other hand 只能用于"同一话题的相反面"，'
        + '不能用来引入全新话题——'
        + '❌ On the other hand, let\'s talk about food.（错）'
        + '换个话题应该用 By the way / That said。'
    },
    'by contrast': {
      ipa: '/baɪ ˈkɒntrɑːst/',
      coll: ['By contrast, sales rose.', '相比之下', '写作'],
      confuse: 'by contrast 必须有明确的比较对象，通常出现在句首或用 ; 隔开。'
        + 'on the other hand 侧重"另一个角度"，'
        + 'by contrast 侧重"对比差异"，后者更正式。'
    },
    'at least': {
      ipa: '/æt liːst/',
      coll: ['at least three people', '至少；起码', '中性'],
      confuse: 'at least（至少，下限）vs at most（至多，上限）。'
        + '与 as many as / as few as（多达/少到）也常一起考。'
    },
    'in short': {
      ipa: '/ɪn ʃɔːt/',
      coll: ['In short, I disagree.', '简言之；总之', '写作'],
      confuse: '总结类短语一共有五个，语体不同：'
        + 'in short / to sum up（中性）/ all in all（偏正式）'
        + '/ by and large（总体上）/ on the whole（总体上）。'
        + '句首都要用逗号隔开：❌ In short I disagree。'
    },
    'all in all': {
      ipa: '/ɔːl ɪn ɔːl/',
      coll: ['All in all, it was a success.', '总的来说；总计', '写作'],
      confuse: 'all in all 可作总结句，也可表示"总共"：'
        + 'All in all, there were 50 people.（总共有 50 人）。'
        + '同一个短语两种用法，靠语境判断。'
    },

    /* ========== 三、动词短语：社交与沟通 ========== */
    'reach out to': {
      ipa: '/riːtʃ aʊt tuː/',
      coll: ['reach out to the support team', '联系；主动伸手（求助或帮助）', '职场'],
      confuse: 'reach out to 后接"人"，是"主动联系"（含示好的意味）。'
        + 'contact sb 只是"联系"，中性。'
        + '⭐ I\'m reaching out（我来联系您）是英文邮件的高频开场。'
    },
    'follow up': {
      ipa: '/ˈfɒləʊ ʌp/',
      coll: ['follow up on the request', '跟进；后续处理', '职场'],
      confuse: 'follow up on sth（跟进某事）'
        + 'vs follow up with sb（跟某人继续沟通）。'
        + '邮件结尾 "I\'ll follow up next week." 是标准商务表达。'
    },
    'circle back': {
      ipa: '/ˈsɜːkl bæk/',
      coll: ['Let\'s circle back on this.', '稍后再谈；回头再说', '职场'],
      confuse: '⭐ circle back 是职场会议里"缓兵之计"的委婉说法，'
        + '字面是"绕回来"。'
        + '注意这是英式/美式职场都高频的俚语化表达，不是语法词。'
    },
    'loop in': {
      ipa: '/luːp ɪn/',
      coll: ['loop in the legal team', '让…参与进来；抄送', '职场'],
      confuse: 'loop in 是"把相关的人加进沟通链"，'
        + '≈ cc（抄送）。⭐ 很正式场合不宜使用，'
        + '应写 "I\'ll cc the legal team"。'
    },
    'sign off': {
      ipa: '/saɪn ɒf/',
      coll: ['sign off on the contract', '批准；签字（同意）', '职场'],
      confuse: 'sign off on sth（批准）vs sign off（邮件结尾语）。'
        + '医疗语境里 sign off = 签病危通知单，口语慎用。'
    },
    'wrap up': {
      ipa: '/ræp ʌp/',
      coll: ['wrap up the meeting', '收尾；结束（工作或会议）', '职场'],
      confuse: 'wrap up（结束一件事）vs wind up（结束演讲、搞笑地"总是"）。'
        + 'wind up 是名词 "the wind-up"（开场铺垫）。'
    },
    'take minutes': {
      ipa: '/teɪk ˈmaɪnɪts/',
      coll: ['take minutes at the meeting', '做会议记录', '职场'],
      confuse: '⭐ take minutes 不是"花几分钟"，'
        + '而是"做会议纪要"。这个表达被误解率极高。'
    },

    /* ========== 四、名词短语：职场与商务 ========== */
    'long-term goal': {
      ipa: '/ˌlɒŋ ˈtɜːm ɡəʊl/',
      coll: ['set a long-term goal', '长期目标', '职场'],
      confuse: 'long-term 是形容词，long term 是名词短语：'
        + 'a long-term goal（长期目标）'
        + 'in the long term（长期来看）。'
        + '⭐ 作定语时必须有连字符，中文学习者常漏写。'
    },
    'scope creep': {
      ipa: '/skəʊp kriːp/',
      coll: ['watch for scope creep', '范围蔓延（需求不断膨胀）', '职场'],
      confuse: '⭐ 纯正的项目管理术语，动词是 creep。'
        + 'The project suffered from scope creep.（项目因需求膨胀而失控）'
    },
    'action item': {
      ipa: '/ˈækʃn ˈaɪtəm/',
      coll: ['assign action items', '行动项（待办事项）', '职场'],
      confuse: '会议纪要里的标准术语，等于 to-do item，'
        + '但比 to-do 更正式，强调"有明确责任人和期限"。'
    },
    'risk assessment': {
      ipa: '/rɪsk əˈsesmənt/',
      coll: ['conduct a risk assessment', '风险评估', '职场'],
      confuse: 'risk assessment（评估过程）vs risk assessment report（评估报告）。'
        + 'conduct/perform an assessment（进行评估）'
        + 'vs make/do an assessment（不太自然）。'
    },
    'mutual benefit': {
      ipa: '/ˈmjuːtʃuəl ˈbenɪfɪt/',
      coll: ['create mutual benefits', '互利；双方受益', '职场'],
      confuse: 'mutual（相互的）vs common（共同的）vs reciprocal（互惠的）：'
        + 'mutual benefit 强调双方都有好处；'
        + 'common interest 强调共同的兴趣。'
    },
    'final offer': {
      ipa: '/ˈfaɪnl ˈɒfə(r)/',
      coll: ['make a final offer', '最终报价；最后通牒', '职场'],
      confuse: 'final offer 在谈判语境里语气很强，'
        + '等于"最后底线"，慎用。'
    },
    'budget constraint': {
      ipa: '/ˈbʌdʒɪt kənˈstreɪnt/',
      coll: ['tight budget constraints', '预算限制', '职场'],
      confuse: 'constraint（约束、限制）比 limitation 更强调"外部强加的"。'
        + 'budget constraint 指钱不够，是客观限制而非自己选择。'
    },
    'flexible on': {
      ipa: '/ˈfleksəbl ɒn/',
      coll: ['be flexible on the schedule', '在…上可以灵活/通融', '职场'],
      confuse: '⭐ 面试高频句式。be flexible on + 某方面，'
        + '表示"这一项可以商量"，其后接的名词才是让步的维度。'
    },
    'meet halfway': {
      ipa: '/miːt ˌhɑːfˈweɪ/',
      coll: ['meet halfway with the client', '各让一步；折中', '谈判'],
      confuse: 'meet sb halfway 是固定搭配，'
        + '字面"走到一半相遇"，实际指"各让一步达成妥协"。'
    },
    'stepping stone': {
      ipa: '/ˈstepɪŋ stəʊn/',
      coll: ['a stepping stone to', '跳板；垫脚石', '职场'],
      confuse: 'a stepping stone to sth（通往某事的跳板），'
        + '注意 to 后接名词或动名词：'
        + 'a stepping stone to success / to getting promoted。'
    },
    'support system': {
      ipa: '/səˈpɔːt ˈsɪstəm/',
      coll: ['build a strong support system', '支持系统；后盾', '中性'],
      confuse: 'support 可作名词（支持）或动词（支持）。'
        + 'support system 更强调"成体系的支撑网络"，'
        + '而不是单个人。'
    },

    /* ========== 五、名词短语：技术与心理 ========== */
    'artificial intelligence': {
      ipa: '/ˌɑːtɪˈfɪʃl ɪnˈtelɪdʒəns/',
      coll: ['work in artificial intelligence', '人工智能', '科技'],
      confuse: 'AI 已在日常英语中取代 long form 作为常用，'
        + '但正式写作中仍建议首次出现时给全称并加缩写。'
    },
    'machine learning': {
      ipa: '/məˈʃiːn ˈlɜːnɪŋ/',
      coll: ['a machine learning model', '机器学习', '科技'],
      confuse: 'machine learning 是 AI 的子集，'
        + '两者不可互换：machine learning ⊂ artificial intelligence。'
    },
    'neural network': {
      ipa: '/ˈnjʊərəl ˈnetwɜːk/',
      coll: ['train a neural network', '神经网络', '科技'],
      confuse: 'neural 读 /ˈnjʊərəl/，不要读成"纽拉"。'
        + 'network 重音在前。'
    },
    'training data': {
      ipa: '/ˈtreɪnɪŋ ˈdeɪtə/',
      coll: ['feed the model with training data', '训练数据', '科技'],
      confuse: 'training data 是给模型学的，'
        + 'test data 是用来检验的。'
        + '⭐ 不可数用法：a lot of training data，不说 datas。'
    },
    'side effect': {
      ipa: '/ˈsaɪd ɪˌfekt/',
      coll: ['have a side effect', '副作用', '健康/科技'],
      confuse: 'side effect 是"附带的不利影响"（几乎都是负面的）。'
        + '想要"正面副作用"要用 bonus / upside。'
    },
    'coping mechanism': {
      ipa: '/ˈkəʊpɪŋ ˈmekənɪzəm/',
      coll: ['develop coping mechanisms', '应对机制', '心理学'],
      confuse: 'mechanism 重音在第一个音节 /ˈmekə-/。'
        + 'coping 后面不加 s：coping skills / coping strategy 都可以。'
    },
    'skill set': {
      ipa: '/skɪl set/',
      coll: ['expand your skill set', '技能组合', '职场'],
      confuse: 'skill set 是"一组技能的集合"，'
        + '用单数：a skill set / expand your skill set（不写 sets）。'
    },
    'career path': {
      ipa: '/kəˈrɪə pɑːθ/',
      coll: ['chart a career path', '职业路径', '职场'],
      confuse: 'career path（发展路径）vs career pathing（职业规划，近年流行）。'
        + 'path 与 pathway 均可，pathway 更强调"具体路径"。'
    },
    'endurance training': {
      ipa: '/ɪnˈdjʊərəns ˈtreɪnɪŋ/',
      coll: ['do endurance training', '耐力训练', '运动'],
      confuse: 'endurance（耐力）vs strength（力量）vs flexibility（柔韧）'
        + '是运动三大类，训练时要对应。'
    },

    /* ========== 六、书信与正式邮件用语 ========== */
    'I am writing to': {
      ipa: '/aɪ æm ˈraɪtɪŋ tuː/',
      coll: ['I am writing to confirm our meeting.', '我写信是为了…', '商务'],
      confuse: '⭐ 英文商务邮件的固定开头，后面直接跟不定式短语（to inform / to confirm）。'
        + '注意是 writing，不是 writting（双 t 是错的）。'
    },
    'please find attached': {
      ipa: '/pliːz faɪnd əˈtætʃt/',
      coll: ['Please find attached the report.', '请见附件', '商务'],
      confuse: '⭐ 传统商务信函的固定句式。'
        + '现代邮件更倾向直白："I\'ve attached the report." '
        + '如果用 please find attached，后面跟名词时要带 the。'
    },
    'at your earliest convenience': {
      ipa: '/æt jʊə ˈɜːlɪɪst kənˈviːniəns/',
      coll: ['Please reply at your earliest convenience.', '在您方便时尽快', '商务'],
      confuse: '⭐ 三个细节：'
        + '① 用复数 convenience（固定惯例）'
        + '② 后面不要加 "as soon as possible"，否则重复'
        + '③ 比 "ASAP" 正式，语气礼貌但不容忽视。'
    },
    'I would appreciate it if': {
      ipa: '/aɪ wʊd əˈpriːʃieɪt ɪt ɪf/',
      coll: ['I would appreciate it if you could reply by Friday.', '若您能…不胜感激', '商务'],
      confuse: '⭐ 虚拟语气里的 "appreciate it"：'
        + '用 it 不用 you（I would appreciate it if you…）。'
        + '后接 if 从句，从句要用过去式（could / would / would mind）。'
    },
    'best regards': {
      ipa: '/best rɪˈɡɑːdz/',
      coll: ['Best regards, / Best wishes,', '此致敬礼', '商务'],
      confuse: '英文邮件结尾的等级（英式 → 美式）：'
        + 'Yours sincerely（不知姓名）/ Yours faithfully（知姓名）'
        + '→ Best regards（通用）/ Best wishes（较亲切）/ Regards（最随意）。'
    },
    'to confirm': {
      ipa: '/tuː kənˈfɜːm/',
      coll: ['To confirm, we will meet on Monday.', '确认一下', '商务'],
      confuse: '邮件中用于引出"最终确认内容"的信号词，'
        + '暗示前面已经谈过，这里只是落定。'
    },
    'feel free to': {
      ipa: '/fiːl friː tuː/',
      coll: ['Please feel free to contact me.', '请随意（不必客气）', '商务'],
      confuse: '⭐ 后必须跟动词原形：feel free to ask ❌ feel free to asking。'
        + '这是日常邮件最常用的"客气话"。'
    },
    'as discussed': {
      ipa: '/əz dɪˈskjuːzd/',
      coll: ['As discussed, we agree on the timeline.', '如所讨论', '商务'],
      confuse: '邮件中引用先前沟通的信号词，'
        + '变体：as per our discussion（依我们讨论）。'
    },
    'let me know if': {
      ipa: '/let miː nəʊ ɪf/',
      coll: ['Let me know if you need anything.', '如需请告知', '商务'],
      confuse: '⭐ 邮件结尾最常见的跟进句。'
        + '更礼貌：Please let me know if…；'
        + '更正式：Should you require anything, please let me know know。'
    },

    /* ========== 七、对话中的立场表达（高阶） ========== */
    'fair enough': {
      ipa: '/feər ɪˈnʌf/',
      coll: ['Fair enough, let\'s do it.', '有道理；那行吧', '口语'],
      confuse: '⭐ 不是"足够公平"，而是"我承认你说得有道理"。'
        + '英式常用，美式较少见。'
        + '后面接拒绝时会很自然：Fair enough, but I still disagree。'
    },
    'I see where you\'re coming from': {
      ipa: '/aɪ siː weə jər ˈkʌmɪŋ frɒm/',
      coll: ['I see where you\'re coming from, but…', '我明白你的出发点', '口语/职场'],
      confuse: '⭐ 字面是"我看到你从哪来"，'
        + '实际是"我理解你的立场"，但常暗含"但我未必同意"。'
        + '是英语母语者表达"委婉不同意"的标准说法。'
    },
    'I\'d push back on that': {
      ipa: '/aɪd pʊʃ bæk ɒn ðæt/',
      coll: ['I\'d push back on that assumption.', '我不同意这一点', '职场'],
      confuse: '⭐ push back 是职场"温和反对"的核心词组。'
        + 'push back on a plan / push back on the timeline。'
        + '比 I disagree 更有建设性，是英美职场沟通的标准做法。'
    },
    'all things considered': {
      ipa: '/ɔːl θɪŋz kənˈsɪdəd/',
      coll: ['All things considered, it was a good call.', '综合考虑', '写作'],
      confuse: '综合类短语：all things considered（综合权衡）'
        + '> on balance（大致而言）> all in all（总的来说）。'
        + '前者暗含"权衡了利弊之后"。'
    },
    'having said that': {
      ipa: '/ˈhævɪŋ sed ðæt/',
      coll: ['Having said that, I still have concerns.', '话虽如此', '写作'],
      confuse: '⭐ 书面语中"先让步再反驳"的信号词，'
        + '相当于口语的"that said"。'
        + '说完紧跟的内容通常是转折。'
    },
    'to put it another way': {
      ipa: '/tuː pʊt ɪt əˈnʌðə(r) weɪ/',
      coll: ['To put it another way, I disagree.', '换个说法', '写作/演讲'],
      confuse: '引出"重新表述"的信号词，强调"刚才说得不够清楚"。'
        + '近义：to put it bluntly（直说）/ put simply（简单说）。'
    },
    'to be precise': {
      ipa: '/tuː biː prɪˈsaɪs/',
      coll: ['To be precise, we need three days.', '准确地说', '写作/演讲'],
      confuse: '用于在粗略陈述后给出精确版本，'
        + '前置动词不定式，不加 that。'
    },
    'objectively speaking': {
      ipa: '/əbˈdʒektɪvli ˈspiːkɪŋ/',
      coll: ['Objectively speaking, it is unfair.', '客观来说', '口语/写作'],
      confuse: 'objectively speaking（客观地说）'
        + 'vs to be objective（保持客观）vs objective（客观的，形容词）。'
    },
    'that being the case': {
      ipa: '/ðæt ˈbiːɪŋ ðə keɪs/',
      coll: ['That being the case, we\'ll proceed.', '既然如此', '书面'],
      confuse: '正式书面语，比 now that / since 更庄重，'
        + '后接虚拟语气或祈使句。'
    },
    'by the same token': {
      ipa: '/baɪ ðə seɪm ˈtəʊkən/',
      coll: ['By the same token, the same applies to you.', '同理', '写作'],
      confuse: '⭐ 常被误解为"同理"，但更准确的含义是'
        + '"出于同样的理由 / 反过来说也成立"，'
        + '含有"这个逻辑对你也适用"的言下之意。'
    },
    'if nothing else': {
      ipa: '/ɪf ˈnʌθɪŋ els/',
      coll: ['If nothing else, it\'s a good start.', '至少；退一步说', '口语/写作'],
      confuse: 'if nothing else 用于"降低预期后的让步"，'
        + '常接 the only / at least。'
    },
    'I wouldn\'t go that far': {
      ipa: '/aɪ ˈwʊdnt ɡəʊ ðæt fɑː/',
      coll: ['I wouldn\'t go that far.', '我不会说得那么绝对', '口语'],
      confuse: '⭐ 地道用法。字面"我不至于走到那一步"，'
        + '实际是"你说得过头了，我保留意见"。'
        + '比 I disagree 温和，但立场更清晰。'
    },

    /* ========== 八、日常口语高频表达 ========== */
    'no big deal': {
      ipa: '/nəʊ bɪɡ diːl/',
      coll: ['Don\'t worry, it\'s no big deal.', '没什么大不了', '口语'],
      confuse: 'no big deal = 不重要（回应道歉或感谢）。'
        + 'big deal（重要）前面才加 no。'
        + '这与 not a big deal 是同义，正式度后者略高。'
    },
    'out of the blue': {
      ipa: '/aʊt əv ðə bluː/',
      coll: ['The news came out of the blue.', '突如其来', '口语/写作'],
      confuse: 'out of the blue（突然）'
        + 'vs out of the blue sky（天蓝云开状，有细微差别）。'
        + '同义：all of a sudden / without warning。'
    },
    'under the weather': {
      ipa: '/ˈʌndə ðə ˈweðə(r)/',
      coll: ['I\'m a bit under the weather.', '身体不适', '口语'],
      confuse: '⭐ 不能直译成"在天气下面"。'
        + '这是一个固定习语，只能整体记忆。'
        + '程度副词放中间：a bit / seriously under the weather。'
    },
    'piece of cake': {
      ipa: '/piːs əv keɪk/',
      coll: ['That was a piece of cake.', '小菜一碟', '口语'],
      confuse: '习语，不含 cake 的实义。'
        + '近义：a piece of eight（同样是习语，稍旧）。'
        + '反义：a hard nut to crack（难题）。'
    },
    'break the ice': {
      ipa: '/breɪk ði aɪs/',
      coll: ['tell a joke to break the ice', '打破僵局；破冰', '口语'],
      confuse: '这个表达也可用于会议/商务语境：'
        + 'an icebreaker activity（破冰活动）。'
        + '注意与 break the ice（破冰）区分：break the ice ✅'
    },
    'on the same page': {
      ipa: '/ɒn ðə seɪm peɪdʒ/',
      coll: ['Let\'s make sure we\'re on the same page.', '达成共识', '职场'],
      confuse: '⭐ 会议高频。字面是"在同一页纸上"，'
        + '意思是"我们对这件事的理解一致"。'
        + '不同表达：see eye to eye（想法一致）/ '
        + 'in sync（同步）。'
    },
    'in the loop': {
      ipa: '/ɪn ðə luːp/',
      coll: ['keep me in the loop.', '让我知情；保持知情', '职场'],
      confuse: 'in the loop（在信息圈内）'
        + 'vs out of the loop（被排除在外）。'
        + '⭐ keep sb in the loop 极常用，'
        + '相当于 keep sb posted / updated。'
    },
    'burn the midnight oil': {
      ipa: '/bɜːn ðə ˈmɪdnaɪt ɔɪl/',
      coll: ['burn the midnight oil', '熬夜；开夜车', '口语'],
      confuse: '习语，源自烛油。'
        + '同类还有：pull an all-nighter（通宵）、'
        + 'burn the candle at both ends（过度消耗）。'
    },
    'eat your words': {
      ipa: '/iːt jʊə wɜːdz/',
      coll: ['He had to eat his words.', '认错；收回前言', '口语'],
      confuse: '⭐ eat your words = 承认自己说错了。'
        + '相关：swallow your words（咽下话，忍住不说）、'
        + 'be made to eat humble pie（低头认错）。'
    },
    'face the music': {
      ipa: '/feɪs ðə ˈmjuːzɪk/',
      coll: ['finally face the music', '承担后果；接受处罚', '口语'],
      confuse: '习语，字面是"面对音乐"，'
        + '指"接受自己该得的惩罚"。'
        + '常与 inevitable 连用：face the inevitable music。'
    },
    'hit the nail on the head': {
      ipa: '/hɪt ðə neɪl ɒn ðə hed/',
      coll: ['You hit the nail on the head.', '正中要害；说到点子上', '口语'],
      confuse: '形容"评论或判断非常准确"。'
        + '近义：hit the mark（达到目标）。'
    },
    'a blessing in disguise': {
      ipa: '/ə ˈblesɪŋ ɪn dɪsˈɡaɪz/',
      coll: ['It turned out to be a blessing in disguise.', '因祸得福', '口语/写作'],
      confuse: '指"看似坏事实则带来好结果的事"。'
        + '常与 in hindsight（事后看来）一起出现在复盘文章中。'
    },
    'the tip of the iceberg': {
      ipa: '/ðə tɪp əv ði aɪsberɡ/',
      coll: ['This is just the tip of the iceberg.', '冰山一角', '口语/写作'],
      confuse: '指"看到的一小部分，还有更多隐藏的问题"。'
        + '写作中常用于引出"深层问题"的论证。'
    },
    'a double-edged sword': {
      ipa: '/ə ˌdʌbl edged ˈsɔːd/',
      coll: ['Automation is a double-edged sword.', '双刃剑', '口语/写作'],
      confuse: '兼指好处与坏处。'
        + '中文"双刃剑"已是外来词，'
        + '英语中 cut both ways 也表示同样含义。'
    },
    'the last straw': {
      ipa: '/ðə lɑːst strɔː/',
      coll: ['It was the last straw.', '最后一根稻草（忍无可忍）', '口语'],
      confuse: 'the straw that broke the camel\'s back 也表同义。'
        + '⚠️ 中文语境中常被误解为"救命稻草"（救命是 a life saver）。'
    },
    'burn bridges': {
      ipa: '/bɜːn ˈbrɪdʒɪz/',
      coll: ['Don\'t burn your bridges.', '毁掉关系；断绝后路', '口语/职场'],
      confuse: 'burn（烧毁）bridge（桥）——'
        + '字面"把桥烧了"，即"断了退路或关系"。'
        + '职场建议里常与 don\'t quit your job on an impulse 类。'
    },
    'read between the lines': {
      ipa: '/riːd bɪˈtwiːn ðə laɪnz/',
      coll: ['read between the lines', '读出言外之意', '口语/写作'],
      confuse: '指"从字里行间推断真实意图"。'
        + '相关：read into something（过度解读，贬义）、'
        + 'on the same wavelength（想法一致）。'
    },
    'bite the bullet': {
      ipa: '/baɪt ðə ˈbʊlɪt/',
      coll: ['We\'ll have to bite the bullet.', '硬着头皮做（ unpleasant 但必须做）', '口语'],
      confuse: '源自战地手术咬子弹止痛。'
        + '近义：face the music（承担后果）、'
        + 'grit your teeth（咬牙坚持）。'
    },
    'cut corners': {
      ipa: '/kʌt ˈkɔːnəz/',
      coll: ['They cut corners on safety.', '偷工减料；走捷径', '口语/职场'],
      confuse: '⭐ 职场高频负面表达，指"为省事而降低标准"。'
        + 'cut corners on quality / cut corners on safety。'
    },
    'play it by ear': {
      ipa: '/pleɪ ɪt baɪ ɪə(r)/',
      coll: ['Let\'s play it by ear.', '随机应变；见机行事', '口语'],
      confuse: '源自不识谱的乐手凭感觉弹奏。'
        + '字面 play（演奏）+ by ear（凭耳朵）。'
    },
    'take it with a grain of salt': {
      ipa: '/teɪk ɪt wɪð ə ɡreɪn əv sɒːlt/',
      coll: ['Take it with a grain of salt.', '别全信', '口语'],
      confuse: '⭐ 同义短语：take it with a pinch of salt（更常见）。'
        + '两个版本都对，pinch 版本在现代英语中更普遍。'
    },
    'miss the boat': {
      ipa: '/mɪs ðə bəʊt/',
      coll: ['Don\'t miss the boat.', '错失良机', '口语'],
      confuse: '原指错过船只，现指"错过了时机"。'
        + '近义：miss the opportunity / let the train go。'
    },
    'beat around the bush': {
      ipa: '/biːt əˈraʊnd ðə bʊʃ/',
      coll: ['Don\'t beat around the bush.', '说话绕弯子；别兜圈子', '口语'],
      confuse: '⭐ 美式英语中更常用。'
        + '英式常说：talk around the point。'
        + '近义：talk in circles / waffle。'
    },
    'under your nose': {
      ipa: '/ˈʌndə jɔː(r) nəʊz/',
      coll: ['It was right under your nose.', '就在你眼前', '口语'],
      confuse: '强调"答案就在那里，你却没看见"。'
        + '反义：in plain sight。'
    },
    'in hot water': {
      ipa: '/ɪn hɒt ˈwɔːtə(r)/',
      coll: ['get into hot water', '陷入麻烦', '口语'],
      confuse: 'get into trouble 的替换说法，更口语化。'
        + '常接 with sb：get into hot water with the boss。'
    },
    'throw in the towel': {
      ipa: '/θrəʊ ɪn ðə ˈtaʊəl/',
      coll: ['throw in the towel', '认输；放弃', '口语'],
      confuse: '源自拳击扔毛巾认输。'
        + '近义：give up / concede defeat（正式）。'
    },
    'get cold feet': {
      ipa: '/ɡet kəʊld fiːt/',
      coll: ['I got cold feet before the speech.', '临阵退缩；打退堂鼓', '口语'],
      confuse: '指"在最后一刻退缩"，与 cold weather 无关。'
        + '近义：chicken out（美式）、lose your nerve。'
    },
    'a gut feeling': {
      ipa: '/ə ɡʌt ˈfiːlɪŋ/',
      coll: ['I had a gut feeling something was wrong.', '直觉', '口语'],
      confuse: '形容词短语，不能说 a gut idea（口语中后者也可但不规范）。'
        + '正式写作可用 intuition。'
    },
    'in the nick of time': {
      ipa: '/ɪn ðə nɪk əv taɪm/',
      coll: ['in the nick of time', '千钧一发；最后一刻', '口语'],
      confuse: '字面 nick（凹陷）指"刚好在裂开的瞬间"，'
        + '即"差一点就来不及"。'
    },
    'on thin ice': {
      ipa: '/ɒn θɪn aɪs/',
      coll: ['You\'re on thin ice.', '如履薄冰；处境危险', '口语/职场'],
      confuse: '指"处于被清算或崩溃的边缘"。'
        + '常接 with：He\'s on thin ice with his manager。'
    },
    'go the extra mile': {
      ipa: '/ɡəʊ ði ˈekstrə maɪl/',
      coll: ['She always goes the extra mile.', '多做一步；格外用心', '职场'],
      confuse: '褒义，强调"在职责之外额外付出"。'
        + '近义：above and beyond（更正式）。'
    },
    'keep an eye on': {
      ipa: '/kiːp ən aɪ ɒn/',
      coll: ['keep an eye on the price', '留意；照看', '中性'],
      confuse: '⭐ 书面与口语都用。不写作 watch。'
        + '与 keep an eye out for（留心等候新出现的）区分：'
        + 'keep an eye out for a job（留意工作机会）。'
    },
    'at face value': {
      ipa: '/æt feɪs ˈvæljuː/',
      coll: ['take it at face value', '表面上；照字面理解', '写作'],
      confuse: 'take sth at face value = 相信表面说法（不一定全对）。'
        + '含轻微怀疑意味。'
    },
    'beyond a shadow of a doubt': {
      ipa: '/bɪˈɒnd ə ˈʃædəʊ əv ə daʊt/',
      coll: ['beyond a shadow of a doubt', '毫无疑问', '写作'],
      confuse: '书面强调语。口语可用 no doubt / without doubt。'
        + '含复数 doubt 的形式是历史遗留，按惯例保留。'
    },

    /* ========== 九、高频副词短语 ========== */
    'at the end of the day': {
      ipa: '/æt ðə end əv ðə deɪ/',
      coll: ['At the end of the day, it doesn\'t matter.', '说到底；归根结底', '口语'],
      confuse: '⭐ 口语句中的固定表达，与 day 本身无关。'
        + '在说理时带"说到底还是…"的总结意味，'
        + '常出现在争论收尾时。'
    },
    'for what it\'s worth': {
      ipa: '/fɔː wɒt ɪts wɜːθ/',
      coll: ['For what it\'s worth, I disagree.', '不管怎么说', '口语/写作'],
      confuse: '⭐ 插入语，表示"我说这话不算数，但供参考"。'
        + 'its 是物主代词（它的），it\'s 是 it is，'
        + '正式写作中不能混。'
    },
    'more often than not': {
      ipa: '/mɔːr ˈɒfn ðæn nɒt/',
      coll: ['He is more often than not late.', '通常；多半', '写作'],
      confuse: '书面语频率副词，比 usually 更强调"常态"。'
        + '近义：as a rule / by and large。'
    },
    'sooner or later': {
      ipa: '/ˈsuːnər ɔː ˈleɪtə(r)/',
      coll: ['Sooner or later, everyone makes mistakes.', '迟早', '口语'],
      confuse: '与 as soon as（时间状语从句）不同——'
        + 'sooner or later 是独立副词短语，不引导从句。'
    },
    'as far as I\'m concerned': {
      ipa: '/əz fɑːr əz aɪm kənˈsɜːnd/',
      coll: ['As far as I\'m concerned, it\'s fine.', '就我而言', '口语/写作'],
      confuse: '⭐ 只表立场，不表信息来源。'
        + 'as far as I know（据我所知）= 表信息来源。'
        + '两者语序相近但含义完全不同，是高频混淆点。'
    },
    'as luck would have it': {
      ipa: '/əz lʌk wʊd hæv ɪt/',
      coll: ['As luck would have it, we met again.', '碰巧；凑巧', '口语/写作'],
      confuse: '虚拟语气（would），表示与事实相反的假设。'
        + '表示"运气好"时也可说 As luck would have it。'
        + '反义：As bad luck would have it（倒霉的是）。'
    },
    'against all odds': {
      ipa: '/əˈɡenst ɔːl ɒdz/',
      coll: ['Against all odds, the team won.', '出乎意料地', '写作'],
      confuse: '字面"违背所有胜算"，即"在极不可能的情况下"。'
        + '后接过去式，暗示"结果已发生"。'
    },
    'to a great extent': {
      ipa: '/tuː ə ɡreɪt ɪkˈstent/',
      coll: ['To a great extent, I agree.', '在很大程度上', '写作'],
      confuse: '程度副词，置于 be 动词之后、实义动词之前：'
        + 'It is to a great extent true.（在很大程度上是对的）'
    },
    'in hindsight': {
      ipa: '/ɪn ˈhaɪndsaɪt/',
      coll: ['In hindsight, I should have waited.', '事后看来', '写作'],
      confuse: '⭐ 只能用于回顾已经过去的事，'
        + '不能用于未来：'
        + '✅ In hindsight, it was obvious. / ❌ In hindsight, it will be obvious。'
    },
    'the best of both worlds': {
      ipa: '/ðə best əv bəʊθ wɜːldz/',
      coll: ['get the best of both worlds', '两全其美', '口语'],
      confuse: '指"同时拥有两件互相冲突的好事"。'
        + '常接 like：I get the best of both worlds — a great job and time off。'
    },
    'all of a sudden': {
      ipa: '/ɔːl əv ə ˈsʌdn/',
      coll: ['All of a sudden, it started to rain.', '突然', '口语'],
      confuse: '同 out of the blue，都表"事先没有预兆"。'
        + 'all of a sudden 常用于真实情境，'
        + 'out of the blue 常用于叙事中的意外转折。'
    }
  };

  /* ============================================================
     对外接口
     ============================================================ */

  /** 取某个词的深层讲解；没有就返回 null */
  function get(word) {
    var w = String(word || '').trim().toLowerCase();
    return idx()[w] || null;
  }

  /* key 里含大写字母的条目（如 "I am writing to"）用小写查表会永远落空，
     所以额外建一张全小写索引。惰性构建，只建一次。*/
  var _idx = null;
  function idx() {
    if (_idx) return _idx;
    _idx = {};
    for (var k in DEEP) {
      if (Object.prototype.hasOwnProperty.call(DEEP, k)) _idx[k.toLowerCase()] = DEEP[k];
    }
    return _idx;
  }

  /** 把深层讲解合并进词条对象（不修改原对象，返回新对象） */
  function enrich(entry) {
    if (!entry || !entry.w) return entry;
    var d = get(entry.w);
    if (!d) return entry;
    var out = {};
    for (var k in entry) {
      if (Object.prototype.hasOwnProperty.call(entry, k)) out[k] = entry[k];
    }
    // 只补空缺的，不覆盖已有内容
    if (!out.ipa && d.ipa) out.ipa = d.ipa;
    if (!out.confuse && d.confuse) out.confuse = d.confuse;
    if (!out.coll) out.coll = d.coll;
    if (d.scene) out.scene = d.scene;
    return out;
  }

  function all() { return DEEP; }

  function stats() {
    var coll = 0, conf = 0;
    for (var k in DEEP) {
      if (!Object.prototype.hasOwnProperty.call(DEEP, k)) continue;
      if (DEEP[k].coll) coll++;
      if (DEEP[k].confuse) conf++;
    }
    return {
      entries: Object.keys(DEEP).length,
      withIpa: Object.keys(DEEP).filter(function (k) { return DEEP[k].ipa; }).length,
      withColl: coll,
      withConfuse: conf
    };
  }

  /* ============================================================
     一次性把深层讲解补进词库
     ------------------------------------------------------------
     为什么在这一层做，而不是让每个视图各自 enrich：
       划词取词、词汇视图、词根反查、自测出题…… 六七个消费点
       都要用到词条，如果在各处各自补，早晚会漏掉一处，
       而且分片懒加载（L5/L6）后还得再补一遍。
     在数据层补一次，所有人自动一致。
     ============================================================ */
  function applyToPool(pool) {
    if (!pool || !pool.length) return 0;
    var n = 0;
    for (var i = 0; i < pool.length; i++) {
      var e = pool[i];
      var d = idx()[String(e.w || '').trim().toLowerCase()];
      if (!d) continue;
      // 只补空缺，不覆盖词库自带的
      if (!e.ipa && d.ipa) { e.ipa = d.ipa; n++; }
      if (!e.coll && d.coll) e.coll = d.coll;
      if (!e.confuse && d.confuse) e.confuse = d.confuse;
    }
    return n;
  }

  var applied = 0;
  function applyAll() {
    var total = 0;
    total += applyToPool(global.VOCAB_DATA && global.VOCAB_DATA.words);
    total += applyToPool(global.GAOKAO_L5 && global.GAOKAO_L5.words);
    total += applyToPool(global.GAOKAO_L6 && global.GAOKAO_L6.words);
    total += applyToPool(global.GAOKAO_DATA && global.GAOKAO_DATA.words);
    applied += total;
    return total;
  }

  /* 高考词库 L5/L6 是懒加载的（各约 400KB），
     第一次补全时它们还不存在，所以要把 Store.ensureLevel 包一层，
     分片到位后再补一次。Store 在本文件之后加载，故延迟处理。 */
  var patched = false;
  var patchTries = 0;
  function patchLazyLoader() {
    if (patched || patchTries > 25) return;   // 上限：避免 Store 始终不来时无限轮询
    var S = global.Store;
    if (!S || typeof S.ensureLevel !== 'function') {
      patchTries++;
      setTimeout(patchLazyLoader, 200);
      return;
    }
    patched = true;
    var orig = S.ensureLevel;
    S.ensureLevel = function (lv) {
      var p = orig.apply(this, arguments);
      if (p && typeof p.then === 'function') p.then(function () { applyAll(); });
      return p;
    };
  }

  global.VocabDeep = {
    get: get, enrich: enrich, all: all, stats: stats, applyAll: applyAll,
    keys: function () { return Object.keys(DEEP); }
  };

  // 词库文件比本文件先加载（见 index.html 顺序），此处直接补即可
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      applyAll();
      patchLazyLoader();
    });
  } else {
    applyAll();
    patchLazyLoader();
  }
})(window);