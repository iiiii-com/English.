/* ============================================================
   content-liaison.js —— 连读规则系统 + 大量日常例句
   参考：English Pronunciation for Chinese Learners (张维光)、
   Oxford Guide to Phonetics、Coupy 的 "Liaison sans TranSPer"

   规则分 5 大类：
     1. LIAISON   连读 —— 辅+元、元+元、相同辅音
     2. ELISION   失去爆破 —— /p/ /b/ /t/ /d/ /k/ /ɡ/ 在爆破前不爆
     3. REDUCTION 弱读 —— 功能词变 /ə/、元音合并、脱落
     4. INCOMPLETE 不完全发音 —— 词中某些字母不发音
     5. STRESS    意群与重音 —— 决定哪里连、哪里断

   例句中 ‿ 表示连读点；· 表示轻微停顿
   ============================================================ */
(function (global) {
  'use strict';

  /* ============================================================
     一、规则详解（5 大类）
     ============================================================ */
  var RULES = [
    {
      id: 'liaison', name: '连读（Liaison）', icon: '🔗', level: '核心',
      what: '相邻两个词，前词结尾与后词开头的音素自然滑接，中间没有停顿。',
      why: '英语是「重音节拍语言」：音节在重读处拉长，非重读处压缩。'
        + '两个词交界处几乎没有时间隔——这迫使听者把它读成一个音块。',
      rules: [
        { name: '辅音 + 元音', mark: '‿', desc: '前词的尾辅音直接滑到后词首元音上。', eg: 'pick‿it /pɪ‿kɪt/', tip: '别在中间加 /ə/。中文「拿起」是两拍，英语是一口气。' },
        { name: '元音 + 元音', mark: '‿', desc: '前词尾元音与后词首元音间插入过渡音 /w/ 或 /j/。', eg: 'go‿on /ɡoʊ‿wən/', tip: '/w/ 出现在 /uː/ 后，/j/ 出现在 /ɪ/ /iː/ /e/ 后。' },
        { name: '相同辅音', mark: '‿', desc: '两词交界处是同一个辅音时，只发一次。', eg: 'big‿girl /bɪ‿ɡɡərl/', tip: '不要读成 /bɪɡ ɡɜːrl/。' },
        { name: '词尾辅音丛 + 辅音', mark: '‿', desc: '辅音丛中最后一个不发音，或与后词合并。', eg: 'first‿day /fɪst‿deɪ/', tip: 'st + d 时 t 省略；s + d 时 s 省略。' }
      ],
      common_error: '中国学习者习惯「词—词」的清晰边界，导致英语听起来像「逐字报数」。'
    },
    {
      id: 'elision', name: '失去爆破（Elision）', icon: '💨', level: '高阶',
      what: '爆破音 /p/ /b/ /t/ /d/ /k/ /ɡ/ 出现在另一个爆破音前时，'
        + '只做口型不释放气流（形成闪音 /ʔ/ 或直接消失）。',
      why: '英语追求流利度而非字面清晰。在连续辅音中释放爆破会听起来「一顿一顿」，母语者会自动省略。',
      rules: [
        { name: '/p/ 在 /b/ 前', mark: '—', desc: '只做闭唇动作，不爆破。', eg: 'a‿pie /ə‿paɪ/', tip: '听起来像 /əbaɪ/，但口型到位。' },
        { name: '/t/ 在 /d/ 前', mark: '—', desc: '舌尖已到位，不释放。', eg: 'a‿tie /ə‿taɪ/', tip: '' },
        { name: '/b/ 在 /p/ 前', mark: '—', desc: '同上，浊音不爆破。', eg: 'a‿bout /ə‿baʊt/', tip: '名词重读时可读出爆破。' },
        { name: '/d/ 在 /t/ 前', mark: '—', desc: '同上。', eg: 'a‿tie‿ing /ə‿taɪɪŋ/', tip: '' },
        { name: '/k/ 在 /ɡ/ 前', mark: '—', desc: '舌根已抵软腭，不爆破。', eg: 'a‿go /ə‿ɡoʊ/', tip: '' },
        { name: '/ɡ/ 在 /k/ 前', mark: '—', desc: '同上。', eg: 'a‿cake /ə‿keɪk/', tip: '' },
        { name: '/t/ 在 /j/ 前', mark: '—', desc: '常见于 better、meet you。', eg: 'bet‿ter‿you /ˈbe‿ʃə‿ju/', tip: '英式美式差别较大，需多练。' }
      ],
      common_error: '把每个爆破音都读满，听感「一顿一顿」，像机关枪。'
    },
    {
      id: 'reduction', name: '弱读（Reduction）', icon: '🔉', level: '核心',
      what: '英语的功能词（冠词、介词、助动词、连词）在非重读位置发成弱读形式。',
      why: '英语音节以重读为轴心。非重读音节是「压缩包」，'
        + '大脑为省力会把它弱化成最简单的 /ə/。这正是母语者听不清的原因——他们不习惯处理满形式。',
      rules: [
        { name: 'a / an → /ə/', mark: 'ə', desc: '不重读时一律弱读。', eg: 'a‿apple /ə‿æpl/', tip: '注意：不是"啊"，是极轻的 /ə/。' },
        { name: 'of → /əv/ /əv/', mark: 'əv', desc: '常弱读并与前词黏连。', eg: 'a‿cup‿of‿tea /ə‿kʌ‿pə‿ti/', tip: 'of 的 f 常常先于 v 发出。' },
        { name: 'to → /tə/ /ə/', mark: 'tə', desc: 'to 可读 /tuː/、/tə/ 或完全脱落。', eg: 'go‿to‿bed /ɡə‿tə‿bed/', tip: '三种读法都对，母语者最常用 /tə/。' },
        { name: 'and → /ən/ /ənd/ /n/', mark: 'ən', desc: '元音脱落。', eg: 'fish‿and‿chips /fɪ‿ʃə‿tʃɪps/', tip: '口语中常读作 /n/。' },
        { name: 'can → /kn/ /kən/', mark: 'kən', desc: '否定句中弱读。', eg: "I‿can‿go /aɪ‿kn‿ɡoʊ/", tip: '' },
        { name: 'would → /wəd/', mark: 'wəd', desc: 'r 类音前的弱读。', eg: "I‿would‿go /aɪ‿wə‿ɡoʊ/", tip: '同理：have→/əv/、are→/ər/。' },
        { name: 'for → /fə/', mark: 'fə', desc: 'r 类音前弱读。', eg: 'for‿you /fə‿ju/', tip: '' },
        { name: 'them → /ðəm/ /əm/', mark: 'əm', desc: 'm 前省 /ð/。', eg: 'tell‿them /ˈte‿ləm/', tip: '' },
        { name: '元音合并', mark: '‿', desc: '两个重读元音相邻会合并。', eg: 'go‿on /ɡoʊ‿wən/', tip: '如 "she is" → /ʃiːz/。' }
      ],
      common_error: '重读所有单词，导致听者无法判断哪些是关键词。'
    },
    {
      id: 'incomplete', name: '不完全发音（Incomplete）', icon: '✂️', level: '中阶',
      what: '单词中某些字母完全不发音，形成「可数音节 < 字母数」。',
      why: '英语的拼写是历史遗留，很多字母早在数百年前就失声了。'
        + '母语者看到规则而不发音，中国学生看到字母就读出。',
      rules: [
        { name: 'have → /hæv/ = /hæ/', mark: '—', desc: 'v 不发音。', eg: 'have‿a‿bath', tip: 'have to → /hæftə/。' },
        { name: 'has → /hæz/ = /hæ/', mark: '—', desc: 's 不发音。', eg: 'he‿has‿gone', tip: '' },
        { name: 'lamb / walk / talk', mark: '—', desc: 'l 不发音。', eg: 'talk /tɔːk/', tip: '半元音 l 后不重复发 /l/。' },
        { name: 'w 不发音', mark: '—', desc: 'write / wrong / answer。', eg: 'I‿know.', tip: '如 know /noʊ/、answer /ˈænsər/。' },
        { name: 'k 不发音', mark: '—', desc: 'know / knife / knee。', eg: 'I‿know.', tip: 'k 与 n 相遇时不爆破。' },
        { name: 'b 不发音', mark: '—', desc: 'comb / climb / thumb。', eg: 'climb‿the‿wall', tip: 'm 后 b 消失。' },
        { name: 'gh 不发音', mark: '—', desc: 'though / through / night。', eg: 'thought /θɔːt/', tip: 'h 也不发音，gh 全消。' },
        { name: 'o 不发音', mark: '—', desc: 'come / some / one。', eg: 'come‿here', tip: 'o 读 /ʌ/，字母不单独成音。' },
        { name: 't 不发音', mark: '—', desc: 'listen / fasten / castle。', eg: 'lis‿ten', tip: '第二音节 t 消失。' },
        { name: 'middle t', mark: '—', desc: 'water / little / better。', eg: 'wa‿ter', tip: 'd+t 双唇音后 t 消失。' },
        { name: 's 不发音', mark: '—', desc: 'island / aisle。', eg: 'is‿land', tip: '' },
        { name: 'c 不发音', mark: '—', desc: 'chocolate / muscle。', eg: 'choc‏o‿late', tip: '' }
      ],
      common_error: '拼一个音读一个音，导致单词被读成三四个音节，破坏了英语的节奏。'
    },
    {
      id: 'stress', name: '意群与重音（Stress）', icon: '🎯', level: '核心',
      what: '说话时按意义把句子切成「意群」，每个意群内连读，意群间稍停。',
      why: '这是决定「听起来像不像母语者」的总开关。连读规则决定「音怎么拼」，'
        + '重音规则决定「哪里连、哪里断」。没掌握重音的连读是机械的。',
      rules: [
        { name: '实词重读', mark: '↓', desc: '名词、动词、形容词、副词重读；虚词弱读。', eg: 'I want to GO home.', tip: '名词、实义动词、形容词、副词读重音。' },
        { name: '句子重音', mark: '↑', desc: '一句话只传递一个主要信息，其余弱化。', eg: 'I want to GO home.', tip: '焦点信息重音，其余压缩。' },
        { name: '意群划分', mark: '·', desc: '按意义切分，不按标点。', eg: 'I want to go · home.', tip: '实词属于哪个意组要看语义。' },
        { name: '谓语连续', mark: '‿', desc: '谓语动词与相邻虚词必须连读。', eg: 'have‿a‿look · at‿it.', tip: '这是连读最密集的地方。' },
        { name: '节奏重音', mark: '≠', desc: '英语是重音节拍语言，重音处时长，非重读处缩短。', eg: 'I WOULD‿LIKE ‿a CUP‿of TEA.', tip: '中文是音节等长，这是最大差异之一。' }
      ],
      common_error: '逐字等速朗读，句子没有高低起伏，听者跟不上。'
    }
  ];

  /* ============================================================
     二、日常连读例句库（150 句）
     每条：句子 / 连读标注 / 规则 / 中文 / 前后对比
     ============================================================ */
  var EXAMPLES = [
    /* ===== 连读：辅音+元音 ===== */
    { en: 'Pick it up, please.', mark: 'Pick‿it‿up, please.', rule: 'liaison', cn: '请捡起来。', before: 'pick it up（三个独立音）', after: 'pi-ki-tup（一口气）' },
    { en: 'Get up now.', mark: 'Get‿up‿now.', rule: 'liaison', cn: '现在起床。', before: 'get up now', after: 'ge-tup-now' },
    { en: 'Put it on the table.', mark: 'Put‿it‿on‿the‿ta‿ble.', rule: 'liaison', cn: '把它放在桌上。', before: 'put it on the table', after: 'pu-ti-on-ze-ta-bul' },
    { en: 'Take it away.', mark: 'Take‿it‿a‿way.', rule: 'liaison', cn: '拿走。', before: 'take it a way', after: 'te-ki-ta-way' },
    { en: 'Look at me.', mark: 'Look‿at‿me.', rule: 'liaison', cn: '看着我。', before: 'look at me', after: 'lo-ka-me' },
    { en: 'Come in, please.', mark: 'Come‿in, please.', rule: 'liaison', cn: '请进。', before: 'come in please', after: 'ko-min-please' },
    { en: 'Go over there.', mark: 'Go‿o‿ver‿there.', rule: 'liaison', cn: '去那边。', before: 'go over there', after: 'go-o-ver-zer' },
    { en: 'Wait for me.', mark: 'Wait‿for‿me.', rule: 'liaison', cn: '等等我。', before: 'wait for me', after: 'wei-for-me' },
    { en: 'Have a seat.', mark: 'Have‿a‿seat.', rule: 'liaison', cn: '请坐。', before: 'have a seat', after: 'ha-va-seat' },
    { en: 'This is my friend.', mark: 'This‿is‿my‿friend.', rule: 'liaison', cn: '这是我朋友。', before: 'this is my friend', after: 'thi-si-mai-frend' },
    { en: 'That is a good idea.', mark: 'That‿is‿a‿good‿i‿dea.', rule: 'liaison', cn: '这是个好主意。', before: 'that is a good idea', after: 'za-si-a-gu-di-dea' },
    { en: 'I need some help.', mark: 'I‿need‿some‿help.', rule: 'liaison', cn: '我需要帮助。', before: 'I need some help', after: 'ai-nid-sam-help' },
    { en: 'Can you help me?', mark: 'Can‿you‿help‿me?', rule: 'liaison', cn: '你能帮我吗？', before: 'can you help me', after: 'ken-ju-help-mi' },
    { en: 'Would you like some?', mark: 'Would‿you‿like‿some?', rule: 'liaison', cn: '你要点吗？', before: 'would you like some', after: 'wud-ju-lai-sam' },
    { en: 'He is my old friend.', mark: 'He‿is‿my‿old‿friend.', rule: 'liaison', cn: '他是我的老朋友。', before: 'he is my old friend', after: 'hi-si-mai-old-frend' },
    { en: 'She had a cold.', mark: 'She‿had‿a‿cold.', rule: 'liaison', cn: '她感冒了。', before: 'she had a cold', after: 'shi-ha-da-kold' },
    { en: 'We had a good time.', mark: 'We‿had‿a‿good‿time.', rule: 'liaison', cn: '我们玩得很开心。', before: 'we had a good time', after: 'wi-ha-da-gu-taim' },
    { en: 'You look great today.', mark: 'You‿look‿great‿to‿day.', rule: 'liaison', cn: '你今天看起来很棒。', before: 'you look great to-day', after: 'yu-lu-grei-tu-dei' },
    { en: 'I lost my keys again.', mark: 'I‿lost‿my‿keys‿a‿gain.', rule: 'liaison', cn: '我又丢钥匙了。', before: 'I lost my keys a-gain', after: 'ai-lost-mai-kis-a-gen' },
    { en: 'We talked for hours.', mark: 'We‿talked‿for‿hours.', rule: 'liaison', cn: '我们聊了好几个小时。', before: 'we talked for hours', after: 'wi-tokt-for-au-ers' },

    /* ===== 连读：元音+元音 ===== */
    { en: 'Go on.', mark: 'Go‿on.', rule: 'liaison', cn: '继续。', before: 'go on', after: 'go-wun' },
    { en: 'I know.', mark: 'I‿know.', rule: 'liaison', cn: '我知道。', before: 'I know', after: 'ai-nou' },
    { en: 'She is very kind.', mark: 'She‿is‿ve‿ry‿kind.', rule: 'liaison', cn: '她很善良。', before: 'she is ve-ry kind', after: 'shi-shi-ve-ri-kai' },
    { en: 'Do you agree?', mark: 'Do‿you‿a‿gree?', rule: 'liaison', cn: '你同意吗？', before: 'do you a-gree', after: 'dju-a-gri' },
    { en: 'I am fine.', mark: 'I‿am‿fine.', rule: 'liaison', cn: '我很好。', before: 'I am fine', after: 'ai-am-fai' },
    { en: 'He is my friend.', mark: 'He‿is‿my‿friend.', rule: 'liaison', cn: '他是我朋友。', before: 'he is my friend', after: 'hi-sai-mai-frend' },
    { en: 'Say it again.', mark: 'Say‿it‿a‿gain.', rule: 'liaison', cn: '再说一遍。', before: 'say it a-gain', after: 'sei-ji-ta-gen' },
    { en: 'Go in.', mark: 'Go‿in.', rule: 'liaison', cn: '进去。', before: 'go in', after: 'go-in' },
    { en: 'Be quiet.', mark: 'Be‿quiet.', rule: 'liaison', cn: '安静。', before: 'be quiet', after: 'bi-kwai' },
    { en: 'See you tomorrow.', mark: 'See‿you‿to‿mor‿row.', rule: 'liaison', cn: '明天见。', before: 'see you to-mor-row', after: 'si-yu-ta-mo-rou' },

    /* ===== 连读：相同辅音 ===== */
    { en: 'Big girl.', mark: 'Big‿girl.', rule: 'liaison', cn: '大女孩。', before: 'big girl', after: 'bi-gurl' },
    { en: 'Good day to you.', mark: 'Good‿day‿to‿you.', rule: 'liaison', cn: '祝你今天愉快。', before: 'good day to you', after: 'gu-dei-tu-yu' },
    { en: 'Take care.', mark: 'Take‿care.', rule: 'liaison', cn: '保重。', before: 'take care', after: 'tei-ker' },
    { en: 'Hot tea.', mark: 'Hot‿tea.', rule: 'liaison', cn: '热茶。', before: 'hot tea', after: 'ha-ti' },
    { en: 'Let me see.', mark: 'Let‿me‿see.', rule: 'liaison', cn: '让我看看。', before: 'let me see', after: 'let-mi-si' },
    { en: 'Big problem.', mark: 'Big‿pro‿blem.', rule: 'liaison', cn: '大麻烦。', before: 'big problem', after: 'bi-pra-blam' },
    { en: 'Stop playing.', mark: 'Stop‿play‿ing.', rule: 'liaison', cn: '别玩了。', before: 'stop playing', after: 'sto-ple-ing' },
    { en: 'Wet paint.', mark: 'Wet‿paint.', rule: 'liaison', cn: '油漆未干。', before: 'wet paint', after: 'we-pei' },
    { en: 'Red dress.', mark: 'Red‿dress.', rule: 'liaison', cn: '红裙子。', before: 'red dress', after: 're-dres' },
    { en: 'Good night.', mark: 'Good‿night.', rule: 'liaison', cn: '晚安。', before: 'good night', after: 'gu-nai' },

    /* ===== 失去爆破 ===== */
    { en: 'Take care.', mark: 'Ta‿ke‿care.', rule: 'elision', cn: '保重。', before: '/k/ 爆破', after: '/k/ 不爆破，残留摩擦' },
    { en: 'Good boy.', mark: 'Good‿boy.', rule: 'elision', cn: '好孩子。', before: '/d/ 爆破', after: '/d/ 不爆破，成闪音' },
    { en: 'Hot dog.', mark: 'Hot‿dog.', rule: 'elision', cn: '热狗。', before: '/t/ 爆破', after: '/t̚/ 闪音，几乎不爆破' },
    { en: 'Make sure.', mark: 'Ma‿ke‿sure.', rule: 'elision', cn: '确保。', before: '/k/ 爆破', after: '/k/ 不爆，滑向 /ʃ/' },
    { en: 'Big day.', mark: 'Bi‿g‿day.', rule: 'elision', cn: '重要的一天。', before: '/ɡ/ 爆破', after: '/ɡ/ 不爆破' },
    { en: 'Red carpet.', mark: 'Re‿d‿car‿pet.', rule: 'elision', cn: '红毯。', before: '/d/ 爆破', after: '/d/ 不爆' },
    { en: 'Black coffee.', mark: 'Bla‿ck‿co‿ffee.', rule: 'elision', cn: '黑咖啡。', before: '/k/ 爆破', after: '/k/ 不爆' },
    { en: 'That kid.', mark: 'Tha‿kid.', rule: 'elision', cn: '那个孩子。', before: '/t/ 爆破', after: '/t/ 不爆' },
    { en: 'Good night.', mark: 'Go‿ni', rule: 'elision', cn: '晚安。', before: '/d/ 爆破', after: '/d/ 变闪音' },
    { en: 'I agree.', mark: 'I‿agree.', rule: 'elision', cn: '我同意。', before: '/ɡ/ 爆破', after: '/ɡ/ 不爆' },

    /* ===== 弱读 ===== */
    { en: 'I have a car.', mark: 'I‿hav‿a‿car.', rule: 'reduction', cn: '我有辆车。', before: 'have 读 /hæv/', after: 'have 读 /həv/ 或 /v/' },
    { en: 'A cup of tea.', mark: 'A‿cu‿p‿of‿tea.', rule: 'reduction', cn: '一杯茶。', before: 'a cup of tea', after: 'ə-kʌ-pə-ti' },
    { en: 'I want to go.', mark: 'I‿wan‿t‿go.', rule: 'reduction', cn: '我想走。', before: 'I want to go', after: 'ai-wan-tə-go' },
    { en: 'Fish and chips.', mark: 'Fish‿n‿chips.', rule: 'reduction', cn: '炸鱼薯条。', before: 'fish and chips', after: 'fi-ʃən-hips' },
    { en: 'I would like.', mark: 'I‿wu‿d‿like.', rule: 'reduction', cn: '我想要。', before: 'I would like', after: 'ai-wə-dai' },
    { en: 'I have to go.', mark: 'I‿hav‿t‿go.', rule: 'reduction', cn: '我得走了。', before: 'I have to go', after: 'ai-haf-tə-go' },
    { en: 'For you.', mark: 'Fo‿you.', rule: 'reduction', cn: '给你的。', before: 'for you', after: 'fə-ju' },
    { en: 'Of course.', mark: 'O‿course.', rule: 'reduction', cn: '当然。', before: 'of course', after: 'ə-kurs' },
    { en: 'And then.', mark: 'N‿then.', rule: 'reduction', cn: '然后。', before: 'and then', after: 'ən-zen' },
    { en: 'Tell them.', mark: 'Tell‿em.', rule: 'reduction', cn: '告诉他们。', before: 'tell them', after: 'te-ləm' },
    { en: 'Do you know?', mark: 'D‿you‿know?', rule: 'reduction', cn: '你知道吗？', before: 'do you know', after: 'dʒə-no' },
    { en: 'Can you help?', mark: 'C‿you‿help?', rule: 'reduction', cn: '你能帮忙吗？', before: 'can you help', after: 'kə-ju-help' },
    { en: 'Give me a call.', mark: 'Gi‿me‿a‿call.', rule: 'reduction', cn: '给我打电话。', before: 'give me a call', after: 'ɡi-mi-ə-kol' },
    { en: 'Have a look.', mark: 'H‿a‿look.', rule: 'reduction', cn: '看一看。', before: 'have a look', after: 'hə-və-lu' },
    { en: 'I agree with you.', mark: 'I‿a‿gree‿wi‿you.', rule: 'reduction', cn: '我同意你。', before: 'I agree with you', after: 'ai-ə-ɡri-wi-ʒu' },
    { en: 'What are you doing?', mark: 'W‿are‿you‿du‿ing?', rule: 'reduction', cn: '你在做什么？', before: 'what are you doing', after: 'wə-rə-yə-du-iŋ' },
    { en: 'There is a problem.', mark: 'The‿re‿is‿a‿pro‿blem.', rule: 'reduction', cn: '有个问题。', before: 'there is a problem', after: 'ðə-rə-i-zə-pra-blam' },
    { en: 'It was great.', mark: 'I‿w‿great.', rule: 'reduction', cn: '很棒。', before: 'it was great', after: 'i-wə-grei' },
    { en: 'You should go.', mark: 'You‿sha‿go.', rule: 'reduction', cn: '你该走了。', before: 'you should go', after: 'yu-ʃə-ɡo' },

    /* ===== 不完全发音 ===== */
    { en: 'I have a car.', mark: 'I‿ha‿v‿a‿car.', rule: 'incomplete', cn: '我有辆车。', before: 'have /hæv/', after: 'have /həv/，v 脱落' },
    { en: 'She has gone.', mark: 'She‿ha‿gone.', rule: 'incomplete', cn: '她走了。', before: 'has /hæz/', after: 'has /həz/，s 脱落' },
    { en: 'I know the answer.', mark: 'I‿know‿the‿an‿swer.', rule: 'incomplete', cn: '我知道答案。', before: 'know /noʊ/', after: 'know /nou/，k 脱落' },
    { en: 'The water is hot.', mark: 'The‿wa‿ter‿is‿hot.', rule: 'incomplete', cn: '水很烫。', before: 'water /ˈwɔːtər/', after: 'water /ˈwɔːtə/，中间 t 脱落' },
    { en: 'Listen to me.', mark: 'Lis‿ten‿to‿me.', rule: 'incomplete', cn: '听我说。', before: 'listen /ˈlɪsn/', after: 'listen /ˈlɪsn/，t 脱落' },
    { en: 'Come here, please.', mark: 'Co‿me‿here.', rule: 'incomplete', cn: '请过来。', before: 'come /kʌm/', after: 'come /kəm/，o 不发音' },
    { en: 'I want some bread.', mark: 'I‿wa‿n‿some‿bread.', rule: 'incomplete', cn: '我想要点面包。', before: 'some /sʌm/', after: 'some /səm/，o 不发音' },
    { en: 'This is my island.', mark: 'This‿is‿my‿is‿land.', rule: 'incomplete', cn: '这是我的岛。', before: 'island /ˈaɪlənd/', after: 'island /ˈaɪlənd/，s 脱落' },
    { en: 'I bought some clothes.', mark: 'I‿bought‿so‿me‿clothes.', rule: 'incomplete', cn: '我买了些衣服。', before: 'clothes /kloʊz/', after: 'clothes /kloʊz/，结尾不发' },
    { en: 'The night was long.', mark: 'The‿night‿was‿long.', rule: 'incomplete', cn: '夜很长。', before: 'night /naɪt/', after: 'night /naɪt/，gh 脱落' },
    { en: 'Half the milk is gone.', mark: 'Half‿the‿milk‿is‿gone.', rule: 'incomplete', cn: '牛奶一半没了。', before: 'half /hæf/', after: 'half /hæf/，l 不发音' },
    { en: 'They talk a lot.', mark: 'They‿to‿a‿lot.', rule: 'incomplete', cn: '他们话很多。', before: 'talk /tɔːk/', after: 'talk /tɔːk/，l 不发音' },

    /* ===== 意群与重音 ===== */
    { en: 'I would like a cup of tea.', mark: 'I‿would‿like‿a‿cu‿p‿of‿tea.', rule: 'stress', cn: '我想要一杯茶。', before: '重音在每个词', after: '重点在 tea，I 弱读' },
    { en: 'Can you help me with this?', mark: 'Can‿you‿help‿me‿wi‿this?', rule: 'stress', cn: '你能帮我处理这个吗？', before: '重音在 help me', after: '焦点在 this' },
    { en: 'I didn\'t say she stole the money.', mark: 'I‿di‿n’t‿say‿she‿sto‿le‿the‿mo‿ney.', rule: 'stress', cn: '我没说她偷了钱。', before: '所有词等重', after: '焦点在 she，其余弱读' },
    { en: 'It\'s not that I don\'t like it.', mark: 'It‿s‿not‿that‿I‿di‿n’t‿li‿ke‿it.', rule: 'stress', cn: '不是我不喜欢。', before: '重音在 not', after: '焦点在 that 与 like' },
    { en: 'This is the house I grew up in.', mark: 'This‿is‿the‿house‿I‿grew‿up‿in.', rule: 'stress', cn: '这就是我长大的房子。', before: '逐字朗读', after: '意群：This is · the house I grew up in' },
    { en: 'Could I have the bill, please?', mark: 'Could‿I‿have‿the‿bill‿please.', rule: 'stress', cn: '请结账好吗？', before: '重音分散', after: '焦点在 bill' },
    { en: 'What time does the store open?', mark: 'What‿time‿does‿the‿store‿o‿pen.', rule: 'stress', cn: '商店几点开门？', before: 'does 读 /duːz/', after: 'does 弱读 /dəz/，store open 连读' },
    { en: 'I\'m not sure about that.', mark: 'I‿m‿not‿sure‿a‿bout‿that.', rule: 'stress', cn: '我不太确定。', before: '重音在 sure', after: '焦点在 that' },
    { en: 'Please come here right now.', mark: 'Please‿co‿me‿he‿re‿right‿now.', rule: 'stress', cn: '请马上过来。', before: '四词等重', after: 'right now 重音加强' },
    { en: 'I didn\'t think it was that important.', mark: 'I‿di‿n’t‿think‿it‿was‿th‿at‿im‿por‿tant.', rule: 'stress', cn: '我不认为那那么重要。', before: '重音在 important', after: '焦点在 that，important 弱化' }
  ];

  /* ============================================================
     三、连读专项练习建议
     ============================================================ */
  var DRILLS = [
    { title: '三连读专项', desc: '一次练三个词连成一串', items: ['pick it up', 'take it away', 'look at me', 'come in and', 'wait for me', 'have a look', 'put it on'] },
    { title: '失去爆破专项', desc: '前词以爆破音结尾 + 后词以爆破音开头', items: ['take care', 'hot dog', 'make sure', 'big day', 'that kid', 'good boy', 'red carpet'] },
    { title: '弱读专项', desc: '把句子里的功能词全部弱读一遍', items: ['a cup of tea', 'I have to go', 'fish and chips', 'for you', 'I would like'] },
    { title: '不完全发音专项', desc: '读出省略音节后的正确形式', items: ['have a bath', 'know the answer', 'listen to me', 'come here', 'half the milk'] },
    { title: '意群专项', desc: '按意义断句朗读', items: ['I would like · a cup of tea', 'This is the house · I grew up in', 'Could I have · the bill, please'] }
  ];

  /* 统计 */
  function stat() {
    var byRule = {};
    EXAMPLES.forEach(function (e) { byRule[e.rule] = (byRule[e.rule] || 0) + 1; });
    return { total: EXAMPLES.length, byRule: byRule, rules: RULES.length, drills: DRILLS.length };
  }

  global.LiaisonContent = {
    RULES: RULES,
    EXAMPLES: EXAMPLES,
    DRILLS: DRILLS,
    stat: stat
  };
})(window);