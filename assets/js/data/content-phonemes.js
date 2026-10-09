/* ============================================================
   content-phonemes.js —— 国际音标库（48 个元音 + 24 个辅音）
   音标说明 + 舌位描述 + 口型描述 + 发音要领 + 中国学习者常见错误

   说明：IPA 用斜线包裹，元音用重音符标出重读音节。
   舌位术语参考《英语语音学》（张维光）与 Oxford Guide to Phonetics。
   ============================================================================ */
(function (global) {
  'use strict';

  /* ============================================================
     一、元音（20 个）
     舌位图坐标说明（用于可视化）：
       x = 舌位前后（0=舌位前/靠齿龈，100=舌位后/靠软腭）
       y = 舌位高低（0=舌位低/开口大，100=舌位高/开口小）
     ============================================================ */
  var VOWELS = {
    /* ---- 单元音：前元音 ---- */
    'iː': {
      type: '长元音', name: '衣（长）', ipa: '/iː/',
      x: 12, y: 95,
      tongue: '舌位最前、 highest，舌尖抵下齿背，舌前部拱起',
      mouth: '嘴唇扁平自然伸展，嘴角略向两侧拉开，像微笑',
      how: '像中文「一」但更长更紧，肌肉要绷住。中文的「衣」偏短且松，'
        + '英语这个音要把舌前部抬到最高并保持住',
      pitfall: '中国学习者常读得太短太松，接近中文「衣」。'
        + '关键差别是英语 /iː/ 更长、更紧张，唇形更平',
      contrast: '对比 /ɪ/（短且松，如 sit）'
    },
    'ɪ': {
      type: '短元音', name: '衣（短）', ipa: '/ɪ/',
      x: 20, y: 78,
      tongue: '舌位前而较高，舌前部拱起但不到最高，肌肉放松',
      mouth: '嘴唇微开、略放松，不像 /iː/ 那样扁平',
      how: '比 /iː/ 短、懒散、放松。发音时不要用力',
      pitfall: '最常见的错误是与 /iː/ 混读。ship /ʃɪp/ 不能读成 sheep /ʃiːp/。'
        + '中文没有对应短音，一律读长了',
      contrast: '对比 /iː/（长且紧，如 see）'
    },
    'e': {
      type: '短元音', name: '埃', ipa: '/e/',
      x: 28, y: 62,
      tongue: '舌位前中，舌前部略拱，比 /ɪ/ 低一些',
      mouth: '嘴唇自然张开约一指宽，微展',
      how: '接近中文「诶」的前半段，唇不圆',
      pitfall: '常与 /æ/ 混读。bed /bed/ 的 e 嘴不咧开，bad /bæd/ 的 æ 要咧开',
      contrast: '对比 /æ/（更扁更开）'
    },
    'æ': {
      type: '短元音', name: '哀（扁）', ipa: '/æ/',
      x: 22, y: 40,
      tongue: '舌位前而低，舌尖抵下齿，下巴下压',
      mouth: '双唇向两侧咧开呈扁平状，像被「拉宽」',
      how: '像做鬼脸时把嘴横着拉开的动作。要领是「下巴往下、嘴角往两边」',
      pitfall: '中国学习者最容易错：常读成 /e/。'
        + 'man /mæn/ 读成「曼」而不是「闷」，听感完全不同',
      contrast: '对比 /e/（不咧开）'
    },
    'ɑː': {
      type: '长元音', name: '阿（长）', ipa: '/ɑː/',
      x: 82, y: 28,
      tongue: '舌位最靠后最低，舌根下压，舌身后缩',
      mouth: '嘴张到最大，双唇自然不圆',
      how: '像看医生说「啊——」，张嘴幅度要够大',
      pitfall: '常与 /ɒ/ 混读。美式 car /kɑːr/、英式 car /kɑː/ 的 a 更靠后更开',
      contrast: '对比 /ɒ/（英式，更短更圆）'
    },
    'ɒ': {
      type: '短元音', name: '奥（英式）', ipa: '/ɒ/',
      x: 78, y: 40,
      tongue: '舌位后而低圆，舌根下压，舌身后缩',
      mouth: '双唇自然圆拢，不要用力',
      how: '英式特有。嘴比 /ɑː/ 小一点，唇稍圆',
      pitfall: '美式英语里不存在这个音，用 /ɑː/ 代替',
      contrast: '对比 /ɔː/（更长更圆）'
    },
    'ɔː': {
      type: '长元音', name: '奥（长）', ipa: '/ɔː/',
      x: 76, y: 55,
      tongue: '舌位后而中圆，舌根抬起，舌身后缩',
      mouth: '双唇收圆并向前突出，嘴形较圆',
      how: '像中文「哦」但更长更用力，唇要圆要突',
      pitfall: '常读得太短。law /lɔː/ 是长音，不能读成「劳」的短音',
      contrast: '对比 /ɒ/（短）'
    },
    'ʊ': {
      type: '短元音', name: '乌（短）', ipa: '/ʊ/',
      x: 68, y: 68,
      tongue: '舌位后而高圆，舌根抬起但肌肉放松',
      mouth: '双唇微圆、放松，不要用力噘嘴',
      how: '像轻轻「呜」一下，唇不用力',
      pitfall: '常读成中文「乌」，但英语这个音更松更短，不能拖长',
      contrast: '对比 /uː/（紧而长）'
    },
    'uː': {
      type: '长元音', name: '乌（长）', ipa: '/uː/',
      x: 78, y: 92,
      tongue: '舌位最靠后最高，舌根高抬，舌身后缩',
      mouth: '双唇收得很圆并向前突出，像吹口哨的形状',
      how: '像中文「乌」但唇更圆、舌根更后、声音更长',
      pitfall: '常与 /ʊ/ 混读。fool /fuːl/ 与 full /fʊl/ 要区分开',
      contrast: '对比 /ʊ/（松而短）'
    },
    'ʌ': {
      type: '短元音', name: '啊（短）', ipa: '/ʌ/',
      x: 72, y: 55,
      tongue: '舌位后而中，舌身居中略后，舌根不上抬',
      mouth: '双唇自然微开，不圆不扁',
      how: '短促的中央音，嘴张开一点，像很短的「啊」',
      pitfall: '常读成中文「啊」的拉长版。cup /kʌp/ 要短促，不要拖成「卡普」',
      contrast: '对比 /ɑː/（更靠后更长）'
    },
    'ɜː': {
      type: '长元音', name: '呃（长）', ipa: '/ɜː/',
      x: 55, y: 62,
      tongue: '舌位中央，舌身平放在口腔中部，不前不后',
      mouth: '双唇扁平自然，绝不能圆',
      how: '英式读法。嘴形扁平、舌身居中，像「饿」的起始',
      pitfall: '中国学习者最易错的音。'
        + '美式把 bird /bɜːd/ 读成 /bɝd/，但英式的 e 千万别圆唇——'
        + '一圆就近成了 /ɔː/，这是英美差异最典型的例子',
      contrast: '对比 /ɔː/（圆唇）'
    },
    'ə': {
      type: '短元音', name: '弱读 schwa', ipa: '/ə/',
      x: 52, y: 58,
      tongue: '完全放松，舌身居中，肌肉零紧张',
      mouth: '嘴唇自然微开，既不圆也不扁',
      how: '英语中最常见的音，几乎所有非重读音节的元音都会弱化成它。'
        + '特点是又轻又含糊，重音永远不在它上面',
      pitfall: '很多中国学生不知道 schwa 的存在，'
        + '于是把该弱读的音读成重读，导致听感「每一词都重读」',
      contrast: '它是「轻读」，不是「随便读」'
    },
    /* ---- 双元音：前元音 ---- */
    'eɪ': {
      type: '双元音', name: '诶', ipa: '/eɪ/',
      x: 30, y: 55, x2: 18, y2: 78,
      tongue: '从前中元音 /e/ 滑向更高的 /ɪ/，前低后高',
      mouth: '从微开到扁平，嘴角略向两侧',
      how: '从「诶」快速滑到「衣」，前长后短',
      pitfall: '不要读成单元音。day /deɪ/ 要有滑动感，两个音都要听到',
      contrast: '对比 /e/（无滑动）'
    },
    'aɪ': {
      type: '双元音', name: '爱', ipa: '/aɪ/',
      x: 40, y: 35, x2: 16, y2: 88,
      tongue: '从低央元音 /a/ 滑向 /ɪ/，大开口到闭口',
      mouth: '从大张到扁平微笑，动作幅度大',
      how: '从「啊」滑到「衣」，中文「爱」的英文版',
      pitfall: '常读成中文「爱」，但要更靠前、滑动更快',
      contrast: '对比 /eɪ/（起点更前）'
    },
    'ɔɪ': {
      type: '双元音', name: '奥伊', ipa: '/ɔɪ/',
      x: 74, y: 50, x2: 24, y2: 92,
      tongue: '从后圆元音 /ɔː/ 滑向前高 /ɪ/，从圆到扁',
      mouth: '从圆唇滑到扁平唇，动作明显',
      how: '从「哦」滑到「衣」',
      pitfall: '嘴形过渡要到位，不能只做前半段',
      contrast: '对比 /aɪ/（起点是低央不是后圆）'
    },
    'əʊ': {
      type: '双元音', name: '欧', ipa: '/əʊ/',
      x: 52, y: 60, x2: 74, y2: 84,
      tongue: '从中央元音 /ə/ 滑向后高 /ʊ/，从前到后',
      mouth: '从扁平逐渐收圆，唇形由展变圆',
      how: '英式从「饿」滑到「乌」。美式起点常为 /oʊ/',
      pitfall: '中国学习者常读成单元音，缺少滑动',
      contrast: '美式 /oʊ/ 起点舌位更后'
    },
    'aʊ': {
      type: '双元音', name: '奥乌', ipa: '/aʊ/',
      x: 40, y: 32, x2: 78, y2: 80,
      tongue: '从低元音 /a/ 滑向后高 /ʊ/，大开口到收圆',
      mouth: '从大张到收圆',
      how: '从「啊」滑到「乌」，像惊讶时的「哇哦」',
      pitfall: '与 /əʊ/ 混淆。now /naʊ/ 起点是低元音，no /nəʊ/ 起点是中央音',
      contrast: '对比 /əʊ/'
    },
    'ɪə': {
      type: '双元音', name: '伊厄', ipa: '/ɪə/',
      x: 22, y: 82, x2: 45, y2: 68,
      tongue: '从前高 /ɪ/ 滑向中央 /ə/',
      mouth: '从扁平逐渐放松',
      how: '英式常见（here /hɪə/），美式多读成 /ɪr/',
      pitfall: '现代英式已逐渐单元音化，读成 /ɪː/ 也可接受',
      contrast: '美式对应 /ɪr/'
    },
    'eə': {
      type: '双元音', name: '厄', ipa: '/eə/',
      x: 28, y: 60, x2: 45, y2: 68,
      tongue: '从前中 /e/ 滑向中央 /ə/',
      mouth: '由微开渐放松',
      how: '英式 hair /heə/，美式常读 /er/',
      pitfall: '须与 /ɪə/ 区分：起点舌位一前一后',
      contrast: '对比 /ɪə/'
    },
    'ʊə': {
      type: '双元音', name: '乌厄', ipa: '/ʊə/',
      x: 68, y: 68, x2: 45, y2: 68,
      tongue: '后高 /ʊ/ 滑向中央 /ə/',
      mouth: '由微圆渐展平',
      how: '现代英式较少见',
      pitfall: '常被读成 /ɔː/，需注意滑动',
      contrast: '美式 /ʊr/'
    }
  };

  /* ============================================================
     二、辅音（按发音方式分组）
     x/y 坐标：x = 舌位前后，y = 舌位高低（辅音用发音部位示意）
     ============================================================ */
  var CONSONANTS = {
    /* ---- 爆破音（清） ---- */
    'p': {
      type: '爆破音·清', name: '普', ipa: '/p/', manner: 'plosive', place: '双唇',
      x: 50, y: 50,
      tongue: '双唇紧闭，舌身不动',
      mouth: '双唇完全闭合，屏住气再爆开',
      how: '先闭唇蓄力，然后突然放开。'
        + '注意：不送气！中文「坡」的 p 是送气的，英语 /p/ 不送气',
      pitfall: '★ 中国学习者第一大错：把 /p/ 读成送气的 /pʰ/。'
        + 'paper 不是「陪珀」，是「佩珀」——声带不振动',
      contrast: '对比 /b/（声带振动）'
    },
    't': {
      type: '爆破音·清', name: '特', ipa: '/t/', manner: 'plosive', place: '舌尖齿龈',
      x: 10, y: 70,
      tongue: '舌尖抵住上齿龈（齿龈后部），双唇展开',
      mouth: '双唇自然扁平',
      how: '舌尖顶上齿龈然后弹开。'
        + '美式英语中词首的 t 常浊化成 /d/（water 听起来像「瓦德」）',
      pitfall: '★ 需送气，与 /p/ /k/ 不同。ten /ten/ 要有气流。'
        + '另外美音 water、better 里的 t 听起来像 d，这是「美式 t 浊化」',
      contrast: '对比 /d/；注意美式 t 浊化现象'
    },
    'k': {
      type: '爆破音·清', name: '克', ipa: '/k/', manner: 'plosive', place: '舌根软腭',
      x: 85, y: 85,
      tongue: '舌根抵住软腭，舌身居中',
      mouth: '双唇微开但不圆',
      how: '舌根上抬抵住软腭后放开。'
        + '不送气（对比中文「科」的送气 k）',
      pitfall: '★ 与 /g/ 混读。coat 不是「购特」。'
        + '另外 skip 里的 k 会浊化成 g（sɡɪp）',
      contrast: '对比 /g/'
    },
    /* ---- 爆破音（浊） ---- */
    'b': {
      type: '爆破音·浊', name: '布', ipa: '/b/', manner: 'plosive', place: '双唇',
      x: 50, y: 50,
      tongue: '双唇紧闭，舌身不动',
      mouth: '双唇完全闭合',
      how: '口型与 /p/ 完全相同，但声带必须振动，'
        + '手放喉咙能摸到震动',
      pitfall: '★ 中国学习者常读成不浊的 /p/（像汉语「波」的声母是清音）。'
        + '要领是「先开声带再爆破」',
      contrast: '对比 /p/'
    },
    'd': {
      type: '爆破音·浊', name: '德', ipa: '/d/', manner: 'plosive', place: '舌尖齿龈',
      x: 10, y: 70,
      tongue: '舌尖抵上齿龈',
      mouth: '双唇扁平',
      how: '同 /t/ 位置，但声带振动',
      pitfall: '★ 常读成清音 /t/。day /deɪ/ 不能读成「泰」',
      contrast: '对比 /t/'
    },
    'ɡ': {
      type: '爆破音·浊', name: '格', ipa: '/ɡ/', manner: 'plosive', place: '舌根软腭',
      x: 85, y: 85,
      tongue: '舌根抵软腭',
      mouth: '双唇微开',
      how: '同 /k/ 位置，声带振动',
      pitfall: '★ 常读成清音 /k/。girl 要能感到喉咙震动',
      contrast: '对比 /k/'
    },
    /* ---- 摩擦音（清） ---- */
    'f': {
      type: '摩擦音·清', name: '夫', ipa: '/f/', manner: 'fricative', place: '唇齿',
      x: 5, y: 40,
      tongue: '下唇轻触上齿',
      mouth: '上门牙咬住下唇，唇略内收',
      how: '上齿咬下唇，气流从缝隙摩擦而出',
      pitfall: '中国学习者常把 /f/ 读成 /h/。'
        + '必须用上齿接触下唇，不能只是两唇靠近',
      contrast: '对比 /v/'
    },
    'θ': {
      type: '摩擦音·清', name: '思', ipa: '/θ/', manner: 'fricative', place: '舌齿',
      x: 5, y: 55,
      tongue: '舌尖轻放在上下齿之间，露出舌尖',
      mouth: '双唇微开，能看到舌尖',
      how: '舌尖从上下齿间伸出，气流摩擦而出。'
        + '可对镜子检查：必须能看到舌尖',
      pitfall: '★★ 中国学习者最难音之一。'
        + '常读成 /s/（sin 听成「星」）或 /f/。'
        + '硬性记忆：think 的 th 是咬舌音，不是 s',
      contrast: '对比 /s/（舌尖在上齿龈后方）与 /f/（唇齿）'
    },
    's': {
      type: '摩擦音·清', name: '丝', ipa: '/s/', manner: 'fricative', place: '舌尖齿龈',
      x: 12, y: 72,
      tongue: '舌尖抵近上齿龈，留窄缝',
      mouth: '双唇微开或扁平',
      how: '像蛇吐信子「丝丝」的声音',
      pitfall: '常读成汉语「思」的声母，但要更靠前、缝隙更窄',
      contrast: '对比 /θ/（咬舌）；词尾复数读 /z/'
    },
    'ʃ': {
      type: '摩擦音·清', name: '诗', ipa: '/ʃ/', manner: 'fricative', place: '舌面硬腭',
      x: 35, y: 75,
      tongue: '舌面前部抬向硬腭，舌身靠前',
      mouth: '双唇微圆稍前突',
      how: '比 /s/ 舌位更高更靠前，像让人安静的「嘘」',
      pitfall: '常读成 /s/。she 不能读成「西」',
      contrast: '对比 /s/；对比浊音 /ʒ/'
    },
    'h': {
      type: '摩擦音·清', name: '喝', ipa: '/h/', manner: 'fricative', place: '声门',
      x: 50, y: 50,
      tongue: '舌身平放自然',
      mouth: '双唇自然张开',
      how: '像哈气，但英语 /h/ 只需轻轻送气，'
        + '声门要振动（区别于汉语「喝」的清音 h）',
      pitfall: '常读得过重，像中文「喝」的声母',
      contrast: '词首 /h/ 弱化后可能省略'
    },
    /* ---- 摩擦音（浊） ---- */
    'v': {
      type: '摩擦音·浊', name: '夫（浊）', ipa: '/v/', manner: 'fricative', place: '唇齿',
      x: 5, y: 40,
      tongue: '下唇轻触上齿',
      mouth: '上门牙咬下唇',
      how: '口型同 /f/，声带振动',
      pitfall: '★ 中国学习者常读成 /w/。very 不能读成「威瑞」',
      contrast: '对比 /w/（双唇不接触）与 /f/'
    },
    'ð': {
      type: '摩擦音·浊', name: '诗（浊）', ipa: '/ð/', manner: 'fricative', place: '舌齿',
      x: 5, y: 55,
      tongue: '舌尖置于上下齿之间，声带振动',
      mouth: '双唇微开',
      how: '同 /θ/ 位置但要出声。'
        + '最常出现在 the、this、that 等虚词中',
      pitfall: '★★ 与 /θ/ 同样难。'
        + 'the /ðə/ 不是「泽」，this /ðɪs/ 不是「迪斯」',
      contrast: '对比 /θ/；the/this/that 都是浊音'
    },
    'z': {
      type: '摩擦音·浊', name: '丝（浊）', ipa: '/z/', manner: 'fricative', place: '舌尖齿龈',
      x: 12, y: 72,
      tongue: '同 /s/',
      mouth: '同 /s/',
      how: '同 /s/ 位置，声带振动',
      pitfall: '常读成清音 /s/。plural 结尾、zoo 都要浊化',
      contrast: '对比 /s/；名词复数词尾常读 /z/'
    },
    'ʒ': {
      type: '摩擦音·浊', name: '诗（浊）', ipa: '/ʒ/', manner: 'fricative', place: '舌面硬腭',
      x: 35, y: 75,
      tongue: '同 /ʃ/',
      mouth: '同 /ʃ/',
      how: '同 /ʃ/ 位置，声带振动',
      pitfall: '较少见（vision、measure）。常误读为 /ʃ/',
      contrast: '对比 /ʃ/'
    },
    /* ---- 破擦音 ---- */
    'tʃ': {
      type: '破擦音·清', name: '取', ipa: '/tʃ/', manner: 'affricate', place: '舌面硬腭',
      x: 35, y: 75,
      tongue: '舌面前部抵硬腭，先阻后放',
      mouth: '双唇微圆稍突',
      how: '像中文「七」的声母 /tɕʰ/ 但不送气',
      pitfall: '常读成送气的汉语拼音 q',
      contrast: '对比 /dʒ/'
    },
    'dʒ': {
      type: '破擦音·浊', name: '取（浊）', ipa: '/dʒ/', manner: 'affricate', place: '舌面硬腭',
      x: 35, y: 75,
      tongue: '同 /tʃ/',
      mouth: '同 /tʃ/',
      how: '同 /tʃ/ 位置，声带振动',
      pitfall: '★ 常读成汉语拼音 zh。'
        + 'judge 不能读成「朱奇」，要浊化',
      contrast: '对比 /tʃ/'
    },
    /* ---- 鼻音 ---- */
    'm': {
      type: '鼻音', name: '姆', ipa: '/m/', manner: 'nasal', place: '双唇',
      x: 50, y: 45,
      tongue: '舌身平放',
      mouth: '双唇完全闭合，气流从鼻腔出',
      how: '闭嘴用鼻子出声。声带振动',
      pitfall: '词尾的 /m/ 要闭唇，不要拖成鼻音尾巴',
      contrast: '对比 /n/（不闭唇）'
    },
    'n': {
      type: '鼻音', name: '呢', ipa: '/n/', manner: 'nasal', place: '舌尖齿龈',
      x: 12, y: 70,
      tongue: '舌尖抵上齿龈',
      mouth: '双唇自然闭合',
      how: '舌尖顶住上齿龈，气流从鼻腔出',
      pitfall: '常读成 /ŋ/（后鼻音）。sin 与 sing 要分清',
      contrast: '对比 /ŋ/'
    },
    'ŋ': {
      type: '鼻音', name: '嗯（后）', ipa: '/ŋ/', manner: 'nasal', place: '舌根软腭',
      x: 85, y: 78,
      tongue: '舌根抵软腭，舌尖不接触任何处',
      mouth: '双唇自然不圆',
      how: '像中文后鼻音「昂」，声带振动',
      pitfall: '常与 /n/ 混读。sing 结尾的 /ŋ/ 舌尖不能顶齿',
      contrast: '对比 /n/'
    },
    /* ---- 舌侧音 ---- */
    'l': {
      type: '舌侧音', name: '勒', ipa: '/l/', manner: 'lateral', place: '舌尖齿龈',
      x: 12, y: 62,
      tongue: '舌尖抵上齿龈，气流从舌两侧流出',
      mouth: '双唇自然扁平',
      how: '词首清亮（like），词尾要「暗 l」——舌尖仍顶齿龈但舌根后缩，'
        + '如 milk 的 l 听起来像「欧」',
      pitfall: '★ 词尾暗 l 缺失是中国学习者典型问题：'
        + 'feel 读成「fee」，people 读成「peep」',
      contrast: '英式有「清晰 l」与「模糊 l」之分'
    },
    'r': {
      type: '近音', name: '儿（美式）', ipa: '/r/', manner: 'approximant', place: '卷舌近音',
      x: 45, y: 50,
      tongue: '舌尖上卷靠近硬腭但不接触，舌身放松成拱形',
      mouth: '双唇略圆稍前突',
      how: '美式 r：舌尖卷起但不碰上腭，'
        + '关键在「不接触」。像轻微的「日」但更靠后',
      pitfall: '★★ 中国学习者常读成汉字「日」的卷舌（舌尖碰上腭）'
        + '或直接读成 /l/。'
        + '对比：red 的 r 舌尖不碰腭，led 的 l 舌尖碰齿龈',
      contrast: '★ 英式 r 不卷舌（不发音，如 car 的 r）：/kɑː/ 而非 /kɑːr/'
    },
    'j': {
      type: '半元音', name: '耶', ipa: '/j/', manner: 'glide', place: '硬腭',
      x: 32, y: 88,
      tongue: '舌面前部抬向硬腭',
      mouth: '双唇扁平',
      how: '像中文「一」的起头，快速滑向后面的元音。'
        + 'yes /jes/ 像「耶斯」',
      pitfall: '常被吞掉，导致元音之间黏连',
      contrast: '对比 /dʒ/'
    },
    'w': {
      type: '半元音', name: '乌', ipa: '/w/', manner: 'glide', place: '双唇',
      x: 80, y: 90,
      tongue: '舌身后缩，舌根上抬',
      mouth: '双唇收圆并明显前突',
      how: '像中文「乌」的起头，快速滑向后面的元音。'
        + 'we /wiː/ 像「威」',
      pitfall: '常与 /v/ 混读。vet 读成 wet 是典型错误',
      contrast: '对比 /v/'
    },
    /* ---- 边音 ---- */
    'h': { type: '摩擦音·清', name: '喝', ipa: '/h/' }
  };

  /* 去重合并 h */
  delete CONSONANTS['h'];
  CONSONANTS['h'] = {
    type: '摩擦音·清', name: '喝', ipa: '/h/', manner: 'fricative', place: '声门',
    x: 50, y: 50,
    tongue: '舌身平放自然，舌位居中',
    mouth: '双唇自然张开，声门张开送气',
    how: '像哈气，但英语 /h/ 只需轻轻送气，声门要振动'
      + '（区别于汉语「喝」的清音 h）',
    pitfall: '常读得过重，像汉语拼音 h',
    contrast: '词首 /h/ 弱化后常省略'
  };

  /* ============================================================
     三、音标规范化：ECDICT 的 ASCII 记法 → 标准 IPA
     ECDICT 用法： : = 长音标记  ' = 主重音  , = 次重音
     双元音写成 ai / ei / au / ou / oi 等
     ============================================================ */
  var DIPT = {
    // 先替换长的，避免 ai 被 a+i 误拆
    'eau': 'jʊ', 'aɪə': 'aɪə', 'ɔɪə': 'ɔɪə', 'əʊə': 'əʊə', 'eɪə': 'eɪə', 'ɪə': 'ɪə',
    'eə': 'eə', 'ʊə': 'ʊə',
    'aɪ': 'aɪ', 'eɪ': 'eɪ', 'ɔɪ': 'ɔɪ', 'əʊ': 'əʊ', 'aʊ': 'aʊ',
    'oi': 'ɔɪ', 'ou': 'aʊ', 'au': 'ɔː', 'aw': 'ɔː',
    'ee': 'iː', 'ea': 'iː', 'oo': 'uː', 'ou_': 'aʊ',
    // 注意：ei 在英语中多为 /eɪ/（eight）或 /iː/（receive，视词而定），
    // 词级歧义无法在此判断，故不设 ei 规则，交由数据层定点修正。
    'ai': 'eɪ', 'ei': 'iː', 'ay': 'eɪ', 'ey': 'eɪ', 'oy': 'ɔɪ',
    'ar': 'ɑː', 'or': 'ɔː', 'er': 'ə', 'ir': 'ɜː', 'ur': 'ɜː',
    'ie_': 'aɪ', 'oa_': 'əʊ'
  };

  /** ECDICT ASCII 音标 → 标准 IPA（带斜线） */
  function normalize(raw) {
    if (!raw) return '';
    var s = String(raw).trim();
    s = s.replace(/[()]/g, '');          // 去括号
    s = s.replace(/[\r\n]/g, '');
    // 重音符
    s = s.replace(/[,;]/g, 'ˈ');          // 次重音统一按主重音处理
    s = s.replace(/'/g, 'ˈ');
    s = s.replace(/^ˈ+/, 'ˈ');
    s = s.replace(/ˈ+/g, 'ˈ');
    // 长音
    s = s.replace(/:/g, 'ː');
    // 非 IPA 字符
    s = s.replace(/ɡ/g, 'g');
    s = s.replace(/є/g, 'e');            // ECDICT 用 є 表 /e/
    s = s.replace(/`/g, '');
    s = s.replace(/\\|@|\^|\?/g, '');
    // 双元音与组合（按长度降序）
    var keys = Object.keys(DIPT).sort(function (a, b) { return b.length - a.length; });
    keys.forEach(function (k) { s = s.split(k).join(DIPT[k]); });
    // 剩余单字母规范化
    s = s.replace(/ɛ/g, 'e');
    s = s.replace(/[ɪɒʊʌəɑɔæθðʃʒŋjɹʋ]/g, function (c) { return c; });
    // 清理
    s = s.replace(/ˈ\s*ː/, 'ː');
    s = s.replace(/\s+/g, '');
    if (!s) return '';
    return '/' + s + '/';
  }

  /** 从 IPA 串中拆出所有音素（用于点击查询） */
  function splitPhonemes(ipa) {
    if (!ipa) return [];
    var s = ipa.replace(/^\/|\/$/g, '');
    s = s.replace(/ˈ/g, ' ').replace(/\.|\s/g, ' ').trim();
    var out = [];
    // 双元音优先
    var pairs = ['aɪ', 'eɪ', 'ɔɪ', 'əʊ', 'aʊ', 'ɪə', 'eə', 'ʊə', 'aɪə', 'ɔɪə',
      'iː', 'ɑː', 'ɔː', 'uː', 'ɜː', 'ɝ', 'tʃ', 'dʒ', 'θ', 'ð', 'ʃ', 'ʒ', 'ŋ', 'iː'];
    var i = 0, guard = 0;
    while (i < s.length && guard++ < 60) {
      var two = s.substr(i, 2);
      if (pairs.indexOf(two) >= 0) { out.push(two); i += 2; continue; }
      out.push(s[i]); i++;
    }
    return out;
  }

  /** 查音素详情（自动处理浊音化变体） */
  var VARIANTS = { 'ɐ': 'ə', 'ɚ': 'ɜː', 'ɝ': 'ɜː', 'ɫ': 'l' };
  function lookup(sym) {
    if (!sym) return null;
    var s = sym.replace(/\//g, '');
    if (VOWELS[s]) return Object.assign({ kind: 'vowel' }, VOWELS[s]);
    if (CONSONANTS[s]) return Object.assign({ kind: 'consonant' }, CONSONANTS[s]);
    if (VARIANTS[s] && (VOWELS[VARIANTS[s]] || CONSONANTS[VARIANTS[s]])) {
      var t = VARIANTS[s];
      var base = VOWELS[t] || CONSONANTS[t];
      return Object.assign({ kind: VOWELS[t] ? 'vowel' : 'consonant' }, base);
    }
    return null;
  }

  global.PhonemeLib = {
    VOWELS: VOWELS,
    CONSONANTS: CONSONANTS,
    normalize: normalize,
    splitPhonemes: splitPhonemes,
    lookup: lookup,
    vowelCount: Object.keys(VOWELS).length,
    consonantCount: Object.keys(CONSONANTS).length
  };
})(window);