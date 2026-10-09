/* ============================================================
   content-phoneme-detail.js —— 音标独立发音示范 + 音组合 + 英美差异
   补充 content-phonemes.js 未覆盖的部分：

   1. DEMO      每个音素的「独立发音示范」：最小对立对 + 例词组
   2. CLUSTERS  音组合（连读单元）：/ts/ /dz/ /ks/ /gz/ /tʃ/ /dʒ/ 等
   3. LIAISON   常见音组合的连读示范（含拼写 → 实际读音）
   4. RP_VS_GA  英式（RP）与美式（GA）发音差异对照
   5. MIN_PAIRS 最小对立对（只差一个音素，最能暴露发音问题）

   术语约定：
     RP = Received Pronunciation（英式标准音，牛津/剑桥）
     GA = General American（美式通用音，Merriam-Webster）
   ============================================================ */
(function (global) {
  'use strict';

  /* ============================================================
     一、音素独立发音示范
     words: 承载该音素的最小例词（从易到难）
     pair:  最小对立对（只差一个音素，混淆时优先练）
     ga:    美式特有读法（null 表示与英式一致）
     tip:   针对该音的发音要领补充
     ============================================================ */
  var DEMO = {
    /* ---------------- 元音 ---------------- */
    'iː': {
      words: ['see', 'eat', 'need', 'green', 'sheep'],
      pair: { a: '/iː/', b: '/ɪ/', aw: 'see /siː/', bw: 'sit /sɪt/' },
      ga: null,
      tip: '开口度比 /ɪ/ 大，肌肉更紧张，时长约 1.5 倍。对镜看：嘴角应向两侧拉开。'
    },
    'ɪ': {
      words: ['sit', 'big', 'city', 'busy', 'build'],
      pair: { a: '/ɪ/', b: '/iː/', aw: 'sit /sɪt/', bw: 'seat /siːt/' },
      ga: null,
      tip: '短而松，舌位比 /iː/ 低一点。千万不要拖长——英语里它总是轻快的。'
    },
    'e': {
      words: ['bed', 'said', 'head', 'ten', 'friend'],
      pair: { a: '/e/', b: '/æ/', aw: 'bed /bed/', bw: 'bad /bæd/' },
      ga: null,
      tip: '嘴唇自然半开、不向两侧咧。/æ/ 要咧开，/e/ 不咧——这是两者的唯一区别。'
    },
    'æ': {
      words: ['cat', 'bad', 'man', 'apple', 'happy'],
      pair: { a: '/æ/', b: '/e/', aw: 'cat /kæt/', bw: 'ket（不存在的词）' },
      ga: '美音中 /æ/ 起点常带 /e/ 成分，接近 /ɛ/，听感更「扁」',
      tip: '下巴下压 + 嘴角横拉。可对镜检查是否真的咧开了嘴。中国学习者最常见错误。'
    },
    'ɑː': {
      words: ['hot', 'car', 'father', 'arm', 'class'],
      pair: { a: '/ɑː/', b: '/ɔː/', aw: 'father /ˈfɑːðər/', bw: 'faux /foʊ/' },
      ga: null,
      tip: '美音在 /ɑː/ 后有卷舌化（rhotic），father 听起来像 /ˈfɑːðɚ/。'
    },
    'ɒ': {
      words: ['hot', 'dog', 'not', 'watch', 'thought'],
      pair: { a: '/ɒ/', b: '/ɔː/', aw: 'cot /kɒt/', bw: 'caught /kɔːt/' },
      ga: '美音无此音，合并到 /ɑː/（cot = caught）',
      tip: '英式专有。嘴唇比 /ɑː/ 更圆，双唇略前突。'
    },
    'ɔː': {
      words: ['law', 'thought', 'talk', 'door', 'walk'],
      pair: { a: '/ɔː/', b: '/ɒ/', aw: 'walk /wɔːk/', bw: 'watch /wɒtʃ/' },
      ga: '美音多数词已并入 /ɑː/：law /lɑː/、door /dɔːr/（带卷舌）',
      tip: '双唇收圆前突，舌根后缩。英式 law /lɔː/ 与美式 /lɑː/ 有别。'
    },
    'ʊ': {
      words: ['book', 'good', 'foot', 'put', 'could'],
      pair: { a: '/ʊ/', b: '/uː/', aw: 'full /fʊl/', bw: 'fool /fuːl/' },
      ga: null,
      tip: '短而松，唇不用力。与 /uː/ 的区别在于是否收紧唇肌。'
    },
    'uː': {
      words: ['food', 'blue', 'school', 'do', 'true'],
      pair: { a: '/uː/', b: '/ʊ/', aw: 'fool /fuːl/', bw: 'full /fʊl/' },
      ga: null,
      tip: '双唇收成小圆并前突，舌根高抬。气流从唇缝集中射出。'
    },
    'ʌ': {
      words: ['cup', 'love', 'money', 'just', 'young'],
      pair: { a: '/ʌ/', b: '/ɑː/', aw: 'cup /kʌp/', bw: 'corp（不常用）' },
      ga: null,
      tip: '短促的中央音，嘴张开一点即可。切勿拖成「啊」的拉长版。'
    },
    'ɜː': {
      words: ['bird', 'work', 'learn', 'nurse', 'person'],
      pair: { a: '/ɜː/', b: '/ɔː/', aw: 'bird /bɜːd/', bw: 'bored /bɔːd/' },
      ga: '美音为 /ɝ/（带卷舌）：bird /bɝd/ ≈「伯德」',
      tip: '英式嘴唇必须扁平——一旦圆唇就近了 /ɔː/。这是英美最大差异之一。'
    },
    'ə': {
      words: ['about', 'banana', 'problem', 'teacher', 'support'],
      pair: { a: '/ə/', b: '重读元音', aw: 'about /əˈbaʊt/', bw: '重读时读 /aʊ/' },
      ga: null,
      tip: '英语最常见的音。几乎所有非重读音节的元音都弱化成它。特征：又轻又含糊。'
    },
    'eɪ': {
      words: ['day', 'make', 'name', 'eight', 'wait'],
      pair: { a: '/eɪ/', b: '/e/', aw: 'late /leɪt/', bw: 'let /let/' },
      ga: null,
      tip: '从 /e/ 滑向 /ɪ/，前长后短。必须有滑动感，不能读成单元音。'
    },
    'aɪ': {
      words: ['time', 'my', 'like', 'night', 'buy'],
      pair: { a: '/aɪ/', b: '/ɔɪ/', aw: 'bite /baɪt/', bw: 'bought /bɔːt/' },
      ga: null,
      tip: '从低央 /a/ 滑向高前 /ɪ/，开口到闭口，幅度大。'
    },
    'ɔɪ': {
      words: ['boy', 'noise', 'choice', 'voice', 'enjoy'],
      pair: { a: '/ɔɪ/', b: '/aɪ/', aw: 'boil /bɔɪl/', bw: 'bile /baɪl/' },
      ga: null,
      tip: '从圆唇 /ɔː/ 滑向扁平 /ɪ/，唇形由圆变展。'
    },
    'əʊ': {
      words: ['go', 'no', 'home', 'boat', 'phone'],
      pair: { a: '/əʊ/', b: '/aʊ/', aw: 'coat /kəʊt/', bw: 'caught /kɔːt/' },
      ga: '美音起点为 /oʊ/（更靠后）：no /noʊ/ 而非 /nəʊ/',
      tip: '英式起点是中央音 /ə/，向 /ʊ/ 滑动。唇形由展变圆。'
    },
    'aʊ': {
      words: ['now', 'how', 'house', 'down', 'about'],
      pair: { a: '/aʊ/', b: '/əʊ/', aw: 'now /naʊ/', bw: 'no /nəʊ/' },
      ga: null,
      tip: '从大开口滑向收圆。now 与 no 是最经典的对比对。'
    },
    'ɪə': {
      words: ['here', 'near', 'year', 'idea', 'really'],
      pair: { a: '/ɪə/', b: '/eə/', aw: 'beer /bɪə/', bw: 'bear /beə/' },
      ga: '美音为 /ɪr/：here /hɪr/',
      tip: '现代英式已单元音化，读成 /ɪː/ 也能被接受。'
    },
    'eə': {
      words: ['hair', 'care', 'where', 'bear', 'air'],
      pair: { a: '/eə/', b: '/ɪə/', aw: 'hair /heə/', bw: 'here /hɪə/' },
      ga: '美音为 /er/：hair /her/',
      tip: '起点舌位比 /ɪə/ 更低更前。听感上「air」比「ear」开口大。'
    },
    'ʊə': {
      words: ['tour', 'poor', 'sure', 'during', 'Europe'],
      pair: { a: '/ʊə/', b: '/ɔː/', aw: 'tour /tʊə/', bw: 'tore /tɔː/' },
      ga: '美音为 /ʊr/：tour /tʊr/',
      tip: '现代英式较少见，易读成 /ɔː/。注意起点是 /ʊ/ 不是 /ɔː/。'
    },

    /* ---------------- 辅音 ---------------- */
    'p': {
      words: ['pen', 'happy', 'people', 'stop', 'cup'],
      pair: { a: '/p/', b: '/b/', aw: 'pen /pen/', bw: 'Ben /ben/' },
      ga: null,
      tip: '双唇紧闭后爆开，纸片测试：嘴前放张纸，/p/ 不应吹动纸面。'
    },
    'b': {
      words: ['big', 'about', 'job', 'rubber', 'maybe'],
      pair: { a: '/b/', b: '/p/', aw: 'buy /baɪ/', bw: 'pie /paɪ/' },
      ga: null,
      tip: '口型同 /p/，但声带必须振动。手放喉咙应感到明显震动。'
    },
    't': {
      words: ['ten', 'water', 'better', 'cat', 'tomato'],
      pair: { a: '/t/', b: '/d/', aw: 'ten /ten/', bw: 'den /den/' },
      ga: '美音中词首与重读元音间的 t 常浊化成 /d/：water 听起来像「瓦德」',
      tip: '舌尖抵上齿龈后弹开。英式送气明显，美式几乎不送气。'
    },
    'd': {
      words: ['do', 'ready', 'bed', 'mother', 'red'],
      pair: { a: '/d/', b: '/t/', aw: 'do /duː/', bw: 'to /tuː/' },
      ga: null,
      tip: '同 /t/ 位置但声带振动。中国学习者常读成清音，听起来像 "to"。'
    },
    'k': {
      words: ['cat', 'school', 'quick', 'black', 'make'],
      pair: { a: '/k/', b: '/ɡ/', aw: 'coat /koʊt/', bw: 'goat /ɡoʊt/' },
      ga: 's 后的 t 会被同化为 /k/：stop → /stɒp/（英式）',
      tip: '舌根抵软腭后放开，不送气。与 /ɡ/ 的区别全在声带。'
    },
    'ɡ': {
      words: ['go', 'bigger', 'bag', 'again', 'give'],
      pair: { a: '/ɡ/', b: '/k/', aw: 'goose /ɡuːs/', bw: 'coose（不常用）' },
      ga: null,
      tip: '同 /k/ 位置但声带振动。girl 听起来像「吉欧」而非「基欧」。'
    },
    'f': {
      words: ['fine', 'life', 'coffee', 'safe', 'off'],
      pair: { a: '/f/', b: '/v/', aw: 'fan /fæn/', bw: 'van /væn/' },
      ga: null,
      tip: '上门牙轻咬下唇。对镜检查：必须看到下唇被上齿接触，不能只是两唇靠近。'
    },
    'v': {
      words: ['very', 'love', 'give', 'have', 'of'],
      pair: { a: '/v/', b: '/w/', aw: 'vest /vest/', bw: 'west /west/' },
      ga: null,
      tip: '同 /f/ 口型 + 声带振动。very 绝不能读成「威瑞」。'
    },
    'θ': {
      words: ['think', 'three', 'mouth', 'month', 'death'],
      pair: { a: '/θ/', b: '/s/', aw: 'thing /θɪŋ/', bw: 'sing /sɪŋ/' },
      ga: null,
      tip: '舌尖轻放上下齿之间，露出舌尖，气流摩擦。对镜必须看得见舌尖。'
    },
    'ð': {
      words: ['this', 'that', 'the', 'mother', 'with'],
      pair: { a: '/ð/', b: '/z/', aw: 'they /ðeɪ/', bw: 'Zday（不存在的词）' },
      ga: null,
      tip: '同 /θ/ 位置但声带振动。最常出现在 the / this / that 等高频虚词。'
    },
    's': {
      words: ['see', 'bus', 'city', 'grass', 'pass'],
      pair: { a: '/s/', b: '/θ/', aw: 'sip /sɪp/', bw: 'thin /θɪn/' },
      ga: null,
      tip: '舌尖靠近上齿龈留窄缝，像蛇吐信子。词尾复数才读 /z/。'
    },
    'z': {
      words: ['zoo', 'is', 'busy', 'those', 'please'],
      pair: { a: '/z/', b: '/s/', aw: 'buzz /bʌz/', bw: 'bus /bʌs/' },
      ga: null,
      tip: '同 /s/ 位置 + 声带振动。名词复数(-s) 与动词三单(-s) 都要浊化。'
    },
    'ʃ': {
      words: ['she', 'nation', 'fish', 'sure', 'wash'],
      pair: { a: '/ʃ/', b: '/s/', aw: 'ship /ʃɪp/', bw: 'sip /sɪp/' },
      ga: null,
      tip: '舌位比 /s/ 更高更靠前，双唇微圆。像让人安静的「嘘」——但要出声。'
    },
    'ʒ': {
      words: ['vision', 'measure', 'usually', 'garage', 'television'],
      pair: { a: '/ʒ/', b: '/ʃ/', aw: 'measure /ˈmeʒər/', bw: 'mesh /meʃ/' },
      ga: null,
      tip: '同 /ʃ/ 位置 + 声带振动。较少见，常误读为 /ʃ/。'
    },
    'h': {
      words: ['hat', 'behind', 'hello', 'house', 'happy'],
      pair: { a: '/h/', b: '不发音', aw: 'hat /hæt/', bw: 'at（省略 h）' },
      ga: null,
      tip: '只是送气，声带仍要振动。与汉语拼音 h 的区别就在这一点。'
    },
    'tʃ': {
      words: ['chair', 'watch', 'nation', 'teacher', 'picture'],
      pair: { a: '/tʃ/', b: '/dʒ/', aw: 'cheap /tʃiːp/', bw: 'jeep /dʒiːp/' },
      ga: '美音中 tʃ 常浊化为 /dʒ/：much 听起来像「马奇」',
      tip: '先阻后擦，一气呵成。类似汉语拼音 q 但不送气。'
    },
    'dʒ': {
      words: ['job', 'age', 'bridge', 'January', 'gem'],
      pair: { a: '/dʒ/', b: '/tʃ/', aw: 'jam /dʒæm/', bw: 'cham（不常用）' },
      ga: null,
      tip: '同 /tʃ/ 位置但声带振动。judge 绝不能读成汉语拼音 zh。'
    },
    'm': {
      words: ['man', 'summer', 'come', 'time', 'swim'],
      pair: { a: '/m/', b: '/n/', aw: 'ram /ræm/', bw: 'ran /ræn/' },
      ga: null,
      tip: '双唇闭合，气流从鼻腔出。词尾要闭唇，不要拖成鼻音尾巴。'
    },
    'n': {
      words: ['no', 'ten', 'sin', 'run', 'dinner'],
      pair: { a: '/n/', b: '/ŋ/', aw: 'sin /sɪn/', bw: 'sing /sɪŋ/' },
      ga: null,
      tip: '舌尖抵上齿龈。与 /ŋ/ 的区别是舌尖是否接触。'
    },
    'ŋ': {
      words: ['sing', 'long', 'thing', 'bank', 'wrong'],
      pair: { a: '/ŋ/', b: '/n/', aw: 'sing /sɪŋ/', bw: 'sin /sɪn/' },
      ga: null,
      tip: '舌根抵软腭，舌尖不接触任何处。类似中文后鼻音「昂」。'
    },
    'l': {
      words: ['like', 'people', 'feel', 'call', 'well'],
      pair: { a: '/l/', b: '/r/', aw: 'led /led/', bw: 'red /red/' },
      ga: '美音中词尾 l 常卷舌化（dark l → 儿化）：people 听起来像「皮波欧」',
      tip: '舌尖必须顶住上齿龈。词尾是「暗 l」，听起来像 /o/。'
    },
    'r': {
      words: ['red', 'around', 'sorry', 'car', 'bring'],
      pair: { a: '/r/', b: '/l/', aw: 'red /red/', bw: 'led /led/' },
      ga: null,
      tip: '舌尖上卷但【不碰】上腭，舌身放松。碰到就是中式卷舌。'
    },
    'j': {
      words: ['yes', 'year', 'you', 'music', 'student'],
      pair: { a: '/j/', b: '/dʒ/', aw: 'year /jɪr/', bw: 'jeer /dʒɪr/' },
      ga: null,
      tip: '像中文「一」的起头，快速滑向后面的元音。不可省略，否则会黏连。'
    },
    'w': {
      words: ['we', 'quick', 'work', 'window', 'swim'],
      pair: { a: '/w/', b: '/v/', aw: 'wet /wet/', bw: 'vet /vet/' },
      ga: null,
      tip: '双唇收圆前突。切勿与 /v/ 混淆——这是听力学高频错点。'
    }
  };

  /* ============================================================
     二、音组合（辅音连缀）—— 教学中最易忽略的部分
     这些组合有「固定读法」，不能拆开拼
     ============================================================ */
  var CLUSTERS = [
    { ipa: '/ts/', ex: 'cats', cn: '复数词尾', note: '/t/ + /s/ 合成一个 /ts/，类似汉语拼音 c', trap: '读成两个音节「卡-次」' },
    { ipa: '/dz/', ex: 'beds', cn: '复数词尾', note: '/d/ + /z/ 合成 /dz/，类似拼音 z', trap: '浊音化不足，听起来像 /ts/' },
    { ipa: '/ks/', ex: 'books', cn: '词尾 -x', note: '/k/ + /s/，一气呵成不换气', trap: '在中间加了个 e 音' },
    { ipa: '/ɡz/', ex: 'bags', cn: '词尾 -g', note: '/ɡ/ + /z/，英式常清化为 /ks/', trap: '误读为 /bs/ 顺序颠倒' },
    { ipa: '/tʃ/', ex: 'church', cn: 'ch 组合', note: '阻塞后摩擦，舌面抵硬腭', trap: '读成汉语拼音 ch（送气）' },
    { ipa: '/dʒ/', ex: 'bridge', cn: 'dge 组合', note: '送气版 ch，声带振动', trap: '与 /tʃ/ 混淆' },
    { ipa: '/tr/', ex: 'tree', cn: 'tr 组合', note: '/t/ + /r/ 需快速连读', trap: '逐字拼读 t-r' },
    { ipa: '/dr/', ex: 'dream', cn: 'dr 组合', note: '/d/ + /r/ 连读', trap: '把 r 读成汉语「日」' },
    { ipa: '/str/', ex: 'street', cn: 'str 组合', note: '/s/ + /tr/ 三音合一', trap: '拆成三个独立音' },
    { ipa: '/spr/', ex: 'spring', cn: 'spr 组合', note: '三个辅音快速滑过', trap: '每个音都发足' },
    { ipa: '/sk/', ex: 'school', cn: 'sk 组合', note: '/s/ + /k/ 连读', trap: '中间停顿' },
    { ipa: '/sl/', ex: 'slow', cn: 'sl 组合', note: '/s/ + /l/ 连读', trap: 'l 的舌位不到位' },
    { ipa: '/sm/', ex: 'small', cn: 'sm 组合', note: '/s/ + /m/ 连读', trap: 'm 读不闭唇' },
    { ipa: '/sn/', ex: 'snow', cn: 'sn 组合', note: '/s/ + /n/ 连读', trap: 'n 变成后鼻音' },
    { ipa: '/sp/', ex: 'speak', cn: 'sp 组合', note: '/s/ + /p/ 连读', trap: 'p 前多加了元音' },
    { ipa: '/st/', ex: 'stop', cn: 'st 组合', note: '/s/ + /t/ 连读，美音 t 常浊化', trap: '两个音完全分开' },
    { ipa: '/ʃr/', ex: 'sugar', cn: 'sh + r', note: '如汉语拼音 sh + r，但 r 不碰上腭', trap: 'r 卷舌过度' },
    { ipa: '/pj/', ex: 'pure', cn: 'p + j', note: '/p/ 送气后滑向 /j/', trap: 'p 与 j 之间断开' }
  ];

  /* ============================================================
     三、连读音组（Liaison）—— 拼写与实际读音的对应
     before: 原拼写　after: 实际读音（斜体部分为连读产生的音）
     ============================================================ */
  var LIAISON = [
    { before: 'pick it up', after: 'pi‿ki‿tup', cn: '辅+元连读', rule: '前词尾辅音 + 后词首元音' },
    { before: 'an hour', after: 'a‿nower', cn: '冠词 an + h 开头', rule: 'an hour 读作 /əˈnaʊər/，几乎无停顿' },
    { before: 'go on', after: 'go‿won', cn: '元音+元音', rule: '插入过渡音 /w/' },
    { before: 'I am', after: 'I‿am', cn: "I am → I\'m", rule: "/aɪ/ + /æm/ → /aɪm/，失去爆破" },
    { before: 'she is', after: 'she‿is', cn: "she is → she\'s", rule: "/ʃiː/ + /ɪz/ → /ʃiːz/" },
    { before: 'do you', after: 'd‿you', cn: '助动词 + 人称', rule: "/d/ + /juː/ → /dʒuː/" },
    { before: 'want to', after: 'wan‿to', cn: 'want to → wanna', rule: '/t/ + /t/ 合并为 /t/' },
    { before: 'going to', after: 'gon‿to', cn: 'going to → gonna', rule: "/ŋ/ + /t/ → /ŋt/" },
    { before: 'got to', after: 'got‿ta', cn: 'got to → gotta', rule: "/t/ + /t/ → /t/" },
    { before: 'let me', after: 'let‿mi', cn: 'let me → lemme', rule: "/t/ + /m/ → /m/" },
    { before: 'big girl', after: 'bi‿girl', cn: '相同辅音', rule: '两个 /ɡ/ 只发一次' },
    { before: 'good day', after: 'goo‿day', cn: '相同辅音', rule: '/d/ + /d/ 只发一次' },
    { before: 'first day', after: 'fir‿day', cn: '词尾辅音丛', rule: "/st/ + /d/ → /sd/" },
    { before: 'take it', after: 'ta‿kit', cn: '失去爆破', rule: '/k/ 在 /t/ 前不爆破' },
    { before: 'good boy', after: 'goo‿boy', cn: '失去爆破', rule: '/d/ 在 /b/ 前不爆破' },
    { before: 'hot dog', after: 'ho‿dog', cn: '失去爆破', rule: '/t/ 变闪音 /t̚/' },
    { before: 'make sure', after: 'ma‿ksure', cn: '失去爆破', rule: '/k/ 在 /ʃ/ 前不爆破，读作 /kʃ/' },
    { before: 'I would', after: 'I‿wuːd', cn: '弱读', rule: 'would 弱读成 /wəd/' },
    { before: 'of the', after: 'ov‿the', cn: '弱读', rule: 'of 弱读，the 弱读成 /ðə/' },
    { before: 'for you', after: 'fə‿juː', cn: '弱读', rule: 'for 弱读成 /fə/，不是 /fɔːr/' },
    { before: 'and so', after: 'an‿so', cn: '弱读', rule: 'and 弱读成 /ən/ 或 /ənd/' },
    { before: 'can you', after: 'kə‿juː', cn: '弱读', rule: 'can 在非肯定句中弱读' },
    { before: 'would you', after: 'wʊ‿dʒuː', cn: '弱读', rule: 'would 弱读 + you 变 /juː/' },
    { before: 'have to', after: 'hæ‿ftə', cn: '不完全发音', rule: 'have 的 v 不发音' },
    { before: 'has to', after: 'hæ‿stə', cn: '不完全发音', rule: 'has 的 s 失读，残留 /hæt/' },
    { before: 'used to', after: '/juːstə/', cn: '固定读法', rule: 'used 读 /juːst/，不读 /juːzd/' },
    { before: 'want to', after: 'wɛnə', cn: '弱读', rule: '口语中 to 常读成 /ə/' },
    { before: 'have a', after: 'hævə', cn: '弱读', rule: 'a 弱读成 /ə/' },
    { before: 'on the', after: 'on‿the', cn: '连读', rule: "/n/ + /ð/ 合成 /nð/" },
    { before: 'in the', after: 'in‿the', cn: '连读', rule: "/n/ + /ð/ 合成 /nð/" },
    { before: 'for the', after: 'fə‿the', cn: '连读 + 弱读', rule: '三个词连成一串' },
    { before: 'back of', after: 'ba‿kəv', cn: '连读', rule: "/k/ + /əv/ → /kəv/" },
    { before: 'a lot of', after: 'ə‿lo‿təv', cn: '弱读', rule: 'a 和 of 都弱读成 /ə/' },
    { before: 'out of', after: 'ow‿təv', cn: '弱读', rule: 'out 与 of 黏连' },
    { before: 'one of', after: 'wə‿nəv', cn: '弱读', rule: 'one 弱读成 /wən/' },
    { before: 'each other', after: 'ee‿ch‿the', cn: '连读', rule: "/iː/ + /tʃ/ + /ð/ 全部相连" },
    { before: 'more than', after: 'mo‿rðən', cn: '失去爆破 + 连读', rule: 'r + ð + ə 三音滑动' },
    { before: 'want some', after: 'wan‿tsəm', cn: '连读', rule: "/t/ + /s/ → /ts/" },
    { before: 'eighteen', after: 'ei‿tin', cn: '音节连读', rule: '双音节合成 /eɪˈtiːn/' },
    { before: 'going on', after: 'go‿in‿on', cn: '连读', rule: '三个词一口气说完' },
    { before: 'a little', after: 'ə‿li‿tl', cn: '不完全发音', rule: 'middle t 不发音' },
    { before: 'family', after: 'fam‏i‿ly', cn: '音节划分', rule: '三音节 fam-i-ly' },
    { before: 'comfortable', after: 'cam‿ftrə‿bl', cn: '不完全发音', rule: 't 不发音，共 4 音节' },
    { before: 'vegetable', after: 've‏chə‿tl', cn: '不完全发音', rule: '第二音节 t 不发音' },
    { before: 'chocolate', after: 'choc‏ə‿lit', note: '', cn: '不完全发音', rule: '第二音节 c 不发音' },
    { before: 'knowledge', after: 'nol‏idʒ', cn: '不完全发音', rule: 'k 与 w 都不发音' },
    { before: 'write', after: 'rait', cn: '不完全发音', rule: 'w 不发音' },
    { before: 'psychology', after: 'sai‏kol‏ə‏dʒi', cn: '不完全发音', rule: 'p 不发音' },
    { before: 'island', after: 'ai‏land', cn: '不完全发音', rule: 's 不发音' }
  ];

  /* ============================================================
     四、英美发音对照（RP vs GA）
     ============================================================ */
  var RP_GA = {
    /* 音素层面 */
    phonemes: [
      { item: '/ɑː/ + r', rp: '/ɑː/', ga: '/ɑːr/', cn: '卷舌化', ex: ['car', 'farm', 'nurse'], note: '美音 r 化：car 听起来像「卡尔」，英音像「卡」' },
      { item: '/ɜː/', rp: '/ɜː/', ga: '/ɝ/', cn: '英式扁平 vs 美式卷舌', ex: ['bird', 'work', 'learn'], note: '英音 must 扁平唇，美音听起来像「墨斯」' },
      { item: '/ɒ/', rp: '/ɒ/', ga: '/ɑː/', cn: '音位合并', ex: ['hot', 'dog', 'watch'], note: '英式 cot /kɒt/ ≠ caught；美音两者相同' },
      { item: '/juː/', rp: '/juː/', ga: '/uː/', cn: '无 /j/ 音', ex: ['new', 'use', 'student'], note: '美音 student 听起来像「斯丢等」' },
      { item: '/r/ 音尾', rp: '不发音', ga: '发 /r/', cn: 'r 音', ex: ['car', 'teacher', 'water'], note: '英音 teacher = 「踢彻」；美音 = 「踢彻尔」' },
      { item: 'lottery', rp: '/ˈlɒtri/', ga: '/ˈlɑːtəri/', cn: '首元音差异', ex: ['lottery'], note: '典型最小对立对' },
      { item: 'cot/caught', rp: '不同音', ga: '同音', cn: '常见词对', ex: ['cot', 'caught'], note: '英式能分辨，美式不能' },
      { item: '/tʃ/', rp: '清辅音', ga: '常浊化为 /dʒ/', cn: '送气差异', ex: ['much', 'water', 'better'], note: '美音 much 像「马奇」' },
      { item: 'schedule', rp: '/ˈʃedjuːl/', ga: '/ˈskedʒuːl/', cn: '首音节差异', ex: ['schedule'], note: '英式「谢」，美式「斯凯」' },
      { item: 'ask', rp: '/ɑːsk/', ga: '/æsk/', cn: '元音差异', ex: ['ask'], note: '英式「阿斯克」，美式「艾斯克」' }
    ],
    /* 词汇层面 */
    words: [
      { rp: 'bath /bɑːθ/', ga: 'bath /bæθ/', cn: '元音', note: '英音更长' },
      { rp: "can't /kɑːnt/", ga: "can't /kænt/", cn: '元音', note: '' },
      { rp: 'dance /dɑːns/', ga: 'dance /dæns/', cn: '元音', note: '美音更接近「蛋斯」' },
      { rp: 'half /hɑːf/', ga: 'half /hæf/', cn: '元音', note: '' },
      { rp: 'laugh /lɑːf/', ga: 'laugh /læf/', cn: '元音', note: '' },
      { rp: 'example /ɪɡˈzɑːmpl/', ga: 'example /ɪɡˈzæmpl/', cn: '元音', note: '' },
      { rp: 'after /ˈɑːftə/', ga: 'after /ˈæftər/', cn: '元音 + r', note: '' },
      { rp: 'aluminium /ˌæljəˈmɪniəm/', ga: 'aluminum /əˈluːməniəm/', cn: '词形拼写', note: '注意拼写也不同' },
      { rp: 'defence /dɪˈfens/', ga: 'defense /dɪˈfens/', cn: '拼写', note: '' },
      { rp: 'centre /ˈsentə/', ga: 'center /ˈsentər/', cn: '拼写 + r', note: '' },
      { rp: 'organise /ˈɔːɡənaɪz/', ga: 'organize /ˈɔːrɡənaɪz/', cn: '拼写 + r', note: '' },
      { rp: 'realise /ˈriːəlaɪz/', ga: 'realize /ˈriːəlaɪz/', cn: '拼写', note: '' },
      { rp: 'colour /ˈkʌlə/', ga: 'color /ˈkʌlər/', cn: '拼写 + r', note: '' },
      { rp: "neighbour /ˈneɪbə/", ga: "neighbor /ˈneɪbər/", cn: '拼写 + r', note: '' },
      { rp: "travelling /ˈtrævlɪŋ/", ga: "traveling /ˈtrævəlɪŋ/", cn: '双写 l', note: '美式单 l，英式双 l' },
      { rp: "cancelled /ˈkænsld/", ga: "canceled /ˈkænsld/", cn: '双写 l', note: '' },
      { rp: "practise /ˈpræktɪs/ (动词)", ga: "practice /ˈpræktɪs/ (动词/名词)", cn: '词性分工', note: '英式严格区分：动词 practise / 名词 practice' },
      { rp: 'travelled /ˈtrævld/', ga: 'traveled /ˈtrævld/', cn: '双写 l', note: '' },
      { rp: 'meant /ment/', ga: 'meant /ment/', cn: '同音', note: '' },
      { rp: 'either /ˈaɪðə/', ga: 'either /ˈiːðər/', cn: '首元音 + r', note: '美音以 /iː/ 开头' },
      { rp: 'neither /ˈnaɪðə/', ga: 'neither /ˈniːðər/', cn: '同上', note: '' }
    ],
    /* 常见句子的整体语感 */
    sentences: [
      {
        en: "I can't hear you.",
        rp: '整体偏慢、清晰，元音更长',
        ga: '整体偏快，t 浊化，句尾 rise 明显',
        cn: '听感差异',
        note: '同样一句话，英音像「I kanth hear you」，美音像「I cæn’ hear you」'
      },
      {
        en: 'Water.',
        rp: '「沃特」——双唇不圆',
        ga: '「沃特」——双唇更圆，接近 /wɔːt/',
        cn: '单音节对比',
        note: '经典的发音对照组，建议反复练'
      },
      {
        en: 'Ask her.',
        rp: '/ɑːsk hɜː/',
        ga: '/æsk hɝ/',
        cn: '双音节',
        note: '一句话里同时体现元音与 r 两个差异'
      },
      {
        en: 'I have to go.',
        rp: "have 的 v 保留：/hæv tə/",
        ga: "have 完全弱读：/əv tə/ 或 /hæf tə/",
        cn: '不完全发音',
        note: '美音听起来像「I hafta go」'
      },
      {
        en: 'Tomato.',
        rp: '/təˈmɑːtəʊ/',
        ga: '/təˈmeɪtoʊ/',
        cn: '第二音节',
        note: '英音「托玛陶」，美音「托梅陶」'
      },
      {
        en: 'Sorry.',
        rp: '/ˈsɒri/',
        ga: '/ˈsɑːri/',
        cn: '元音',
        note: '英音「索瑞」，美音「萨瑞」'
      },
      {
        en: 'Schedule a meeting.',
        rp: '/ˈʃedjuːl ə ˈmiːtɪŋ/',
        ga: '/ˈskedʒuːl ə ˈmiːtɪŋ/',
        cn: '首音节 + 鼻音',
        note: 'meeting 在美音中 t 浊化成 /d/'
      },
      {
        en: 'Let me tell you.',
        rp: '/let mi ˈtel juː/',
        ga: '/lemme ˈtel jə/',
        cn: '不完全发音 + 弱读',
        note: '美音完全吞掉 t'
      }
    ],
    /* 选哪个口音 */
    guide: {
      advice: '学习者应先选一个主口音，不要混用。',
      rpWhy: '英式（RP）规则更规则、元音体系更完整（20 个元音 vs 美式 15 个），'
        + '且 Oxford/Cambridge 教材配套资源齐全，适合系统学习与国际场合。',
      gaWhy: '美式（GA）在影视、互联网、AI 语音识别中占绝对优势，'
        + 'Google 语音、微软 TTS 默认美音。日常泛泛说英语时，美音被听到的概率更高。',
      tip: '两者都可接受，关键是「一致性」。'
        + '同一段话里英美混用会让听者困惑，这比选哪个口音的问题更严重。'
    }
  };

  global.PhonemeDetail = {
    DEMO: DEMO,
    CLUSTERS: CLUSTERS,
    LIAISON: LIAISON,
    RP_GA: RP_GA
  };
})(window);