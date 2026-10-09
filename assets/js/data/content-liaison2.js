/* ============================================================
   content-liaison2.js —— 连读例句库（第二批扩充至 150+ 句）
   补充 content-liaison.js，按真实生活场景组织，便于按场景检索
   字段与第一批保持一致：en 原句 / mark 标注 / rule 规则 / cn 中文 / before 前 / after 后
   ============================================================ */
(function (global) {
  'use strict';

  var EXAMPLES = [
    /* ===== 咖啡店 / 点餐（高频日常） ===== */
    { en: 'I\'d like a latte, please.', mark: 'I‿d‿like‿a‿lat‿te, please.', rule: 'liaison', cn: '我要一杯拿铁。', before: 'I would like a latte', after: 'ai-dai-kai-a-lat-ti' },
    { en: 'Can I get a medium coffee?', mark: 'Can‿I‿get‿a‿me‿di‿um‿co‿fee?', rule: 'liaison', cn: '能给我一杯中杯咖啡吗？', before: 'can I get a medium coffee', after: 'kə-nai-ge-tə-mi-djam-ko-fi' },
    { en: 'What\'s your recommendation?', mark: 'What‿s‿your‿re‿com‿men‿da‿tion.', rule: 'liaison', cn: '你推荐什么？', before: "what's your recommendation", after: "wəts-jə-re-kə-men-dei-ʃən" },
    { en: 'To go, please.', mark: 'To‿go, please.', rule: 'liaison', cn: '打包带走。', before: 'to go please', after: 'tə-go-please' },
    { en: 'Less ice, please.', mark: 'Less‿ice, please.', rule: 'liaison', cn: '少冰，谢谢。', before: 'less ice please', after: 'le-sai-plesi' },
    { en: 'That\'ll be five dollars.', mark: 'That‿ll‿be‿five‿dol‿lars.', rule: 'liaison', cn: '一共五美元。', before: "that'll be five dollars", after: 'za-də-bi-faiv-da-lərz' },
    { en: 'Do you take card?', mark: 'Do‿you‿take‿card?', rule: 'liaison', cn: '能刷卡吗？', before: 'do you take card', after: 'də-ju-teik-kard' },
    { en: 'I\'ll pay by phone.', mark: 'I‿ll‿pay‿by‿phone.', rule: 'liaison', cn: '我手机支付。', before: "I'll pay by phone", after: 'ai-pei-bai-fon' },
    { en: 'Keep the change.', mark: 'Keep‿the‿change.', rule: 'liaison', cn: '不用找了。', before: 'keep the change', after: 'kip-ze-tʃein' },
    { en: 'Have a nice day.', mark: 'H‿a‿nice‿day.', rule: 'reduction', cn: '祝你愉快。', before: 'have a nice day', after: 'hə-va-nais-dei' },
    { en: 'For here or to go?', mark: 'For‿he‿re‿or‿to‿go.', rule: 'liaison', cn: '堂食还是外带？', before: 'for here or to go', after: 'fo-ri-ə-rə-gou' },
    { en: 'One more coffee, please.', mark: 'One‿mo‿re‿co‿ffee, please.', rule: 'liaison', cn: '再来一杯咖啡。', before: 'one more coffee', after: 'wan-mo-rə-ko-fi' },
    { en: 'I\'m just looking, thanks.', mark: 'I‿m‿just‿loo‿king, thanks.', rule: 'liaison', cn: '我随便看看，谢谢。', before: "I'm just looking", after: 'aim-dʒəst-lu-kiŋ' },
    { en: 'Is this seat taken?', mark: 'Is‿this‿seat‿ta‿ken?', rule: 'liaison', cn: '这位子有人吗？', before: 'is this seat taken', after: 'iz-ze-si-tin' },
    { en: 'Could I get this to go?', mark: 'Could‿I‿get‿this‿to‿go?', rule: 'liaison', cn: '这个能打包吗？', before: 'could I get this to go', after: 'kə-dai-ge-ze-tə-gou' },
    { en: 'No sugar for me.', mark: 'No‿su‿gar‿for‿me.', rule: 'liaison', cn: '我不加糖。', before: 'no sugar for me', after: 'no-ʃu-ɡə-fə-mi' },

    /* ===== 问路 / 交通 ===== */
    { en: 'Excuse me, how do I get to the station?', mark: 'Ex‿cuse‿me, how‿do‿I‿get‿to‿the‿sta‿tion.', rule: 'liaison', cn: '打扰一下，车站怎么走？', before: 'how do I get to the station', after: 'hau-də-nai-ge-tə-ze-stei-ʃən' },
    { en: 'Is it far from here?', mark: 'Is‿it‿far‿from‿he‿re?', rule: 'liaison', cn: '离这儿远吗？', before: 'is it far from here', after: 'i-zit-fə-frəm-hi-ə' },
    { en: 'Can I walk there?', mark: 'Can‿I‿walk‿the‿re?', rule: 'liaison', cn: '走过去可以吗？', before: 'can I walk there', after: 'kə-nai-wok-ðə' },
    { en: 'Go straight and turn left.', mark: 'Go‿strai‿ght‿an‿turn‿left.', rule: 'liaison', cn: '直走然后左转。', before: 'go straight and turn left', after: 'gou-stren-an-ten-lef' },
    { en: 'How long does it take?', mark: 'How‿long‿does‿it‿take?', rule: 'liaison', cn: '要多久？', before: 'how long does it take', after: 'hau-loŋ-də-zit-teik' },
    { en: 'Which line should I take?', mark: 'Which‿line‿should‿I‿take?', rule: 'liaison', cn: '我该坐哪条线？', before: 'which line should I take', after: 'wi-tʃ-lai-n-ʃə-dai-teik' },
    { en: 'Does this bus go downtown?', mark: 'Does‿this‿bus‿go‿down‿town?', rule: 'liaison', cn: '这班车去市中心吗？', before: 'does this bus go downtown', after: 'də-ze-bəs-gou-daun-taun' },
    { en: 'One stop, please.', mark: 'One‿stop, please.', rule: 'liaison', cn: '请停一站。', before: 'one stop please', after: 'wan-stop-please' },
    { en: 'You can walk from here.', mark: 'You‿can‿walk‿from‿he‿re.', rule: 'liaison', cn: '从这里可以走过去。', before: 'you can walk from here', after: 'yu-kən-wok-frəm-hi-ə' },
    { en: 'Turn right at the corner.', mark: 'Turn‿right‿at‿the‿cor‿ner.', rule: 'liaison', cn: '在拐角右转。', before: 'turn right at the corner', after: 'ten-rait-ə-ze-kor-nə' },
    { en: 'I think I\'m lost.', mark: 'I‿think‿I‿m‿lost.', rule: 'liaison', cn: '我好像迷路了。', before: "I think I'm lost", after: 'ai-θi-ai-mlɔst' },
    { en: 'Could you show me on the map?', mark: 'Could‿you‿show‿me‿on‿ze‿map.', rule: 'liaison', cn: '能在地图上指给我吗？', before: 'could you show me on the map', after: 'kə-dʒu-ʃou-mi-on-ze-mæp' },
    { en: 'It\'s about ten minutes on foot.', mark: 'It‿s‿a‿bout‿te‿n‿mi‿nutes‿on‿fu‿t.', rule: 'liaison', cn: '走路大概十分钟。', before: "it's about ten minutes on foot", after: 'i-tə-ba-ten-mi-nəts-on-fut' },
    { en: 'Take the second turn on the right.', mark: 'Take‿ze‿se‿cond‿turn‿on‿ze‿ri.', rule: 'liaison', cn: '在第二个路口右转。', before: 'take the second turn on the right', after: 'teik-ze-si-kənd-ten-on-ze-rai' },
    { en: 'Does this train stop at the airport?', mark: 'Does‿this‿train‿stop‿at‿ze‿air‿port.', rule: 'liaison', cn: '这趟火车停机场吗？', before: 'does this train stop at the airport', after: 'də-ze-trein-sɒ-pət-ə-rport' },

    /* ===== 购物 / 砍价 ===== */
    { en: 'How much is this?', mark: 'How‿much‿is‿this?', rule: 'liaison', cn: '这个多少钱？', before: 'how much is this', after: 'hau-mʌ-tʃi-zdis' },
    { en: 'I\'m just looking, thank you.', mark: 'I‿m‿just‿loo‿king, thank‿you.', rule: 'liaison', cn: '我随便看看，谢谢。', before: "I'm just looking", after: 'aim-dʒəst-lu-kiŋ-θæŋk-ju' },
    { en: 'Do you have this in a smaller size?', mark: 'Do‿you‿have‿this‿in‿a‿small‿er‿size?', rule: 'liaison', cn: '这个有小一号的吗？', before: 'do you have this in a smaller size', after: 'də-ju-hæ-ze-in-ə-smɔ-lə-saiz' },
    { en: 'Can I try it on?', mark: 'Can‿I‿try‿it‿on?', rule: 'liaison', cn: '我能试穿吗？', before: 'can I try it on', after: 'kə-nai-trai-i-tɒn' },
    { en: 'Is this on sale?', mark: 'Is‿this‿on‿sale?', rule: 'liaison', cn: '这个在打折吗？', before: 'is this on sale', after: 'iz-ze-ɒn-seil' },
    { en: 'That\'s a bit too expensive.', mark: 'That‿s‿a‿bit‿too‿ex‿pen‿sive.', rule: 'liaison', cn: '这有点太贵了。', before: "that's a bit too expensive", after: 'za-sa-bit-tu-ik-spen-siv' },
    { en: 'Can you give me a discount?', mark: 'Can‿you‿give‿me‿a‿dis‿count.', rule: 'liaison', cn: '能给我打折吗？', before: 'can you give me a discount', after: 'kə-nai-ɡi-vmi-ə-dis-kaunt' },
    { en: 'Do you accept cards?', mark: 'Do‿you‿ac‿cept‿cards?', rule: 'liaison', cn: '你们收卡吗？', before: 'do you accept cards', after: 'də-ju-æk-cept-kardz' },
    { en: 'I\'ll take it.', mark: 'I‿ll‿take‿it.', rule: 'liaison', cn: '我买了。', before: "I'll take it", after: 'ai-teik-it' },
    { en: 'Could I get a receipt?', mark: 'Could‿I‿get‿a‿re‿ceipt?', rule: 'liaison', cn: '能给我收据吗？', before: 'could I get a receipt', after: 'kə-dai-ɡe-tə-ri-sit' },
    { en: 'Where are the fitting rooms?', mark: 'Whe‿re‿are‿the‿fit‿ting‿rooms.', rule: 'liaison', cn: '试衣间在哪？', before: 'where are the fitting rooms', after: 'wε-rə-ze-fi-ting-rumz' },
    { en: 'It\'s not in my budget.', mark: 'It‿s‿not‿in‿my‿bu‿dget.', rule: 'liaison', cn: '这超出我的预算。', before: "it's not in my budget", after: 'its-nɒ-tin-mai-bʌ-dʒət' },
    { en: 'Do you have a smaller one?', mark: 'Do‿you‿have‿a‿small‿er‿one?', rule: 'liaison', cn: '有小一点的吗？', before: 'do you have a smaller one', after: 'də-ju-hæ-və-smɔ-lə-wʌn' },
    { en: 'Let me think about it.', mark: 'Let‿me‿think‿a‿bout‿it.', rule: 'liaison', cn: '让我再想想。', before: 'let me think about it', after: 'let-mi-θiŋ-ə-baut-it' },

    /* ===== 医疗 / 身体不适 ===== */
    { en: 'I don\'t feel well.', mark: 'I‿don‿t‿feel‿well.', rule: 'liaison', cn: '我不舒服。', before: "I don't feel well", after: 'ai-dount-fi-lwel' },
    { en: 'I have a sore throat.', mark: 'I‿ha‿v‿a‿sore‿throat.', rule: 'liaison', cn: '我嗓子疼。', before: 'I have a sore throat', after: 'ai-hæ-və-sor-θrout' },
    { en: 'It started three days ago.', mark: 'It‿star‿ted‿three‿days‿a‿go.', rule: 'liaison', cn: '三天前开始的。', before: 'it started three days ago', after: 'it-star-ti-θri-deiz-ə-gou' },
    { en: 'Is it serious?', mark: 'Is‿it‿se‿ri‿ous?', rule: 'liaison', cn: '严重吗？', before: 'is it serious', after: 'i-zit-si-ri-əs' },
    { en: 'I need to see a doctor.', mark: 'I‿need‿to‿see‿a‿doc‿tor.', rule: 'liaison', cn: '我需要看医生。', before: 'I need to see a doctor', after: 'ai-nid-ta-si-ə-dak-tə' },
    { en: 'How often do I take it?', mark: 'How‿of‿ten‿do‿I‿take‿it?', rule: 'liaison', cn: '这个多久吃一次？', before: 'how often do I take it', after: 'hau-ɒf-tən-dai-teik-it' },
    { en: 'Are there any side effects?', mark: 'Are‿the‿re‿a‿ny‿side‿ef‿fects?', rule: 'liaison', cn: '有副作用吗？', before: 'are there any side effects', after: 'ə-ðε-ə-ni-sai-də-fekts' },
    { en: 'Could I have an appointment?', mark: 'Could‿I‿have‿an‿ap‿point‿ment?', rule: 'liaison', cn: '能预约吗？', before: 'could I have an appointment', after: 'kə-dai-hæ-və-nə-pɔɪnt-mənt' },
    { en: 'I\'m allergic to penicillin.', mark: 'I‿m‿al‿ler‿gic‿to‿pe‿ni‿cil‿lin.', rule: 'liaison', cn: '我对青霉素过敏。', before: "I'm allergic to penicillin", after: 'aim-ə-lə-dʒik-tə-peni-si-lin' },
    { en: 'It hurts when I press here.', mark: 'It‿hurts‿when‿I‿press‿he‿re.', rule: 'liaison', cn: '按这里会疼。', before: 'it hurts when I press here', after: 'it-herts-wen-ai-pres-hi-ə' },
    { en: 'Take a rest and drink water.', mark: 'Take‿a‿rest‿and‿drink‿wa‿ter.', rule: 'liaison', cn: '休息一下，多喝水。', before: 'take a rest and drink water', after: 'tei-ə-rest-ən-drink-wɔ-tə' },

    /* ===== 打电话 ===== */
    { en: 'Hello, this is John speaking.', mark: 'He‿llo, this‿is‿John‿speak‿ing.', rule: 'liaison', cn: '你好，我是 John。', before: 'hello this is John speaking', after: 'hə-lou-ðis-iz-dʒɑn-spi-kiŋ' },
    { en: 'Can I speak to Mr. Smith?', mark: 'Can‿I‿speak‿to‿Mr‿Smith.', rule: 'liaison', cn: '我能和 Smith 先生通话吗？', before: 'can I speak to Mr Smith', after: 'kə-nai-spi-k-tə-mis-tə-smiθ' },
    { en: 'Hold on, please.', mark: 'Hold‿on, please.', rule: 'liaison', cn: '请稍等。', before: 'hold on please', after: 'hou-don-plezi' },
    { en: 'Sorry, he\'s not in right now.', mark: 'So‿ry, he‿s‿not‿in‿right‿now.', rule: 'liaison', cn: '抱歉，他现在不在。', before: "sorry he's not in right now", after: 'sɔ-ri-hiz-nɒt-in-rait-nau' },
    { en: 'Can I call you back?', mark: 'Can‿I‿call‿you‿back?', rule: 'liaison', cn: '我能给你回电吗？', before: 'can I call you back', after: 'kə-nai-kɔl-ju-bæk' },
    { en: 'I\'ll call you later.', mark: 'I‿ll‿call‿you‿la‿ter.', rule: 'liaison', cn: '我晚点打给你。', before: "I'll call you later", after: 'ai-kɔl-ju-lei-tə' },
    { en: 'Did I get the number right?', mark: 'Did‿I‿get‿ze‿num‿ber‿ri.', rule: 'liaison', cn: '我号码对吗？', before: 'did I get the number right', after: 'di-dai-ɡe-ze-nam-bə-rai' },
    { en: 'I\'m afraid he\'s in a meeting.', mark: 'I‿m‿a‿fraid‿he‿s‿in‿a‿mee‿ting.', rule: 'liaison', cn: '恐怕他在开会。', before: "I'm afraid he's in a meeting", after: 'aim-ə-frei-hiz-in-ə-mi-ting' },
    { en: 'Thanks for calling.', mark: 'Thanks‿for‿cal‿ling.', rule: 'liaison', cn: '谢谢来电。', before: 'thanks for calling', after: 'θæŋks-fə-kɔ-ling' },

    /* ===== 办公 / 会议 ===== */
    { en: 'Let\'s get started.', mark: 'Let‿s‿get‿star‿ted.', rule: 'liaison', cn: '我们开始吧。', before: "let's get started", after: 'lets-ɡe-star-təd' },
    { en: 'Can everyone hear me?', mark: 'Can‿eve‿ry‿one‿he‿me?', rule: 'liaison', cn: '大家能听到吗？', before: 'can everyone hear me', after: 'kən-ev-ri-wʌn-hi-mi' },
    { en: 'I\'ll send the file tonight.', mark: 'I‿ll‿send‿the‿file‿to‿night.', rule: 'liaison', cn: '我今晚发文件。', before: "I'll send the file tonight", after: 'ai-send-ze-fail-tə-nai' },
    { en: 'Let\'s schedule a follow-up.', mark: 'Let‿s‿sche‿dule‿a‿fol‿low‿up.', rule: 'liaison', cn: '我们约个跟进会。', before: "let's schedule a follow-up", after: 'lets-ske-dʒu-lə-fou-lʌp' },
    { en: 'That works for me.', mark: 'That‿works‿for‿me.', rule: 'liaison', cn: '我这边可以。', before: 'that works for me', after: 'ðæt-wərks-fə-mi' },
    { en: 'I\'ll keep you posted.', mark: 'I‿ll‿keep‿you‿po‿sted.', rule: 'liaison', cn: '我会及时告知你。', before: "I'll keep you posted", after: 'ai-ki-pu-pou-stəd' },
    { en: 'Let\'s touch base next week.', mark: 'Let‿s‿touch‿base‿next‿week.', rule: 'liaison', cn: '我们下周再对一下。', before: "let's touch base next week", after: 'lets-tʌtʃ-beis-nekst-wik' },
    { en: 'Sorry, I\'m running late.', mark: 'So‿ry, I‿m‿run‿ning‿late.', rule: 'liaison', cn: '抱歉，我要迟到了。', before: "sorry I'm running late", after: 'sɔ-ri-aim-rʌ-ning-leit' },
    { en: 'Could you clarify that?', mark: 'Could‿you‿cla‿ri‿fy‿that?', rule: 'liaison', cn: '能澄清一下吗？', before: 'could you clarify that', after: 'kə-dʒu-klɛ-rə-fai-ðæt' },
    { en: 'Let\'s circle back on this.', mark: 'Let‿s‿ser‿kəl‿ba‿ck‿on‿this.', rule: 'liaison', cn: '这个我们回头再谈。', before: "let's circle back on this", after: 'lets-ser-kəl-bæk-ɒn-ðis' },

    /* ===== 情绪 / 安慰 ===== */
    { en: 'Don\'t worry about it.', mark: 'Don‿t‿worry‿a‿bout‿it.', rule: 'liaison', cn: '别担心。', before: "don't worry about it", after: 'dount-wʌ-ri-ə-baut-it' },
    { en: 'It\'ll get better soon.', mark: 'It‿ll‿get‿bet‿ter‿soon.', rule: 'liaison', cn: '会好起来的。', before: "it'll get better soon", after: 'it-l-ɡe-bet-ə-sun' },
    { en: 'I\'m here for you.', mark: 'I‿m‿he‿re‿for‿you.', rule: 'liaison', cn: '我在你身边。', before: "I'm here for you", after: 'aim-hi-ə-fə-ju' },
    { en: 'That must be hard.', mark: 'That‿must‿be‿hard.', rule: 'liaison', cn: '那一定很难。', before: 'that must be hard', after: 'ðæt-məst-bi-hard' },
    { en: 'Hang in there.', mark: 'Hang‿in‿the‿re.', rule: 'liaison', cn: '坚持住。', before: 'hang in there', after: 'haŋ-in-ðɛ-ə' },
    { en: 'I\'ve got your back.', mark: 'I‿ve‿got‿your‿back.', rule: 'liaison', cn: '我支持你。', before: "I've got your back", after: 'aiv-ɡɔt-jɔ-bæk' },
    { en: 'Things will work out.', mark: 'Things‿will‿work‿out.', rule: 'liaison', cn: '会顺利的。', before: 'things will work out', after: 'θiŋz-wil-wə-kaut' },
    { en: 'Take your time.', mark: 'Take‿your‿time.', rule: 'liaison', cn: '慢慢来。', before: 'take your time', after: 'tei-jo-taim' },
    { en: 'I\'m proud of you.', mark: 'I‿m‿proud‿a‿you.', rule: 'liaison', cn: '我为你骄傲。', before: "I'm proud of you", after: 'aim-praut-ə-ju' },

    /* ===== 失去爆破（补充） ===== */
    { en: 'Sweet dreams.', mark: 'Sweet‿dreams.', rule: 'elision', cn: '做个好梦。', before: '/t/ 爆破', after: '/t̚/ 闪音，几乎不爆破' },
    { en: 'Good luck.', mark: 'Good‿luck.', rule: 'elision', cn: '祝你好运。', before: '/d/ 爆破', after: '/d/ 变闪音' },
    { en: 'What time is it?', mark: 'What‿time‿is‿it?', rule: 'elision', cn: '几点了？', before: '/t/ 两次爆破', after: '第一个 /t̚/ 不爆，第二个弱化' },
    { en: 'Sit down.', mark: 'Si‿down.', rule: 'elision', cn: '坐下。', before: '/t/ 爆破', after: '/t/ 与 /d/ 合并成 /t/' },
    { en: 'Get up.', mark: 'Ge‿up.', rule: 'elision', cn: '起来。', before: '/t/ 爆破', after: '/t/ 与元音黏连，闪音化' },
    { en: 'That\'s right.', mark: 'Tha‿right.', rule: 'elision', cn: '对了。', before: '/t/ 爆破', after: '/t/ 与 /r/ 合并，闪音化' },
    { en: 'Let it go.', mark: 'Le‿go.', rule: 'elision', cn: '放手吧。', before: '/t/ 爆破', after: '/t/ 闪音后滑向 /ɡ/' },
    { en: 'Big problem?', mark: 'Bi‿pro‿blem.', rule: 'elision', cn: '大问题？', before: '/ɡ/ 爆破', after: '/ɡ/ 不爆破' },
    { en: 'Black car.', mark: 'Bla‿car.', rule: 'elision', cn: '黑车。', before: '/k/ 爆破', after: '/k/ 不爆破，残留摩擦' },
    { en: 'Good dog.', mark: 'Go‿dog.', rule: 'elision', cn: '好狗。', before: '/d/ 爆破', after: '/d/ 变闪音' },
    { en: 'Take care of it.', mark: 'Ta‿ke‿care‿a‿vit.', rule: 'elision', cn: '照顾好它。', before: '三个 /k/ 分别爆破', after: '三个 /k/ 全部不爆破' },
    { en: 'What do you want?', mark: 'W‿do‿you‿wan.', rule: 'elision', cn: '你想要什么？', before: '/t/ 爆破', after: '/t/ 闪音，与 /d/ 合并' },
    { en: 'I need to check.', mark: 'I‿ni‿d‿check.', rule: 'elision', cn: '我得确认一下。', before: 'need to 的 /t/ 爆破', after: '/t/ 完全不爆，舌尖仍到位' },

    /* ===== 弱读（补充） ===== */
    { en: 'It\'s a pleasure to meet you.', mark: 'It‿s‿a‿plea‿sure‿to‿meet‿you.', rule: 'reduction', cn: '很高兴认识你。', before: "it's a pleasure to meet you", after: 'i-tə-ple-ʒə-tə-mi-ju' },
    { en: 'Would you like to come?', mark: 'Wu‿you‿like‿t‿come?', rule: 'reduction', cn: '你想来吗？', before: 'would you like to come', after: 'wə-ju-laik-tə-kʌm' },
    { en: 'I\'m going to the store.', mark: 'I‿m‿go‿ing‿t‿the‿store.', rule: 'reduction', cn: '我要去商店。', before: "I'm going to the store", after: 'aim-ɡou-in-tə-ze-stɔ' },
    { en: 'Do you have any questions?', mark: 'D‿you‿have‿a‿ny‿ques‿tions?', rule: 'reduction', cn: '你有问题吗？', before: 'do you have any questions', after: 'də-ju-hæ-və-ni-kwes-ʃənz' },
    { en: 'I\'d like to make a reservation.', mark: 'I‿d‿like‿t‿make‿a‿re‿ser‿va‿tion.', rule: 'reduction', cn: '我想订位。', before: "I'd like to make a reservation", after: 'ai-dai-laik-tə-meik-ə-re-zə-vei-ʃən' },
    { en: 'Is that all for you?', mark: 'Is‿that‿all‿for‿you?', rule: 'reduction', cn: '就这些吗？', before: 'is that all for you', after: 'iz-ðæ-tɔl-fə-ju' },
    { en: 'How are you doing today?', mark: 'How‿are‿you‿du‿ing‿to‿day?', rule: 'reduction', cn: '你今天怎么样？', before: 'how are you doing today', after: 'hau-rə-ju-du-in-tə-dei' },
    { en: 'I\'ve been there before.', mark: 'I‿ve‿been‿the‿re‿be‿fore.', rule: 'reduction', cn: '我去过那儿。', before: "I've been there before", after: 'aiv-bin-ðɛ-ə-bi-fɔ' },
    { en: 'Could you pass me the salt?', mark: 'Could‿you‿pass‿me‿the‿salt?', rule: 'reduction', cn: '能递一下盐吗？', before: 'could you pass me the salt', after: 'kə-dʒu-pæs-mi-ze-sɔlt' },
    { en: 'What time do you open?', mark: 'W‿time‿do‿you‿o‿pen?', rule: 'reduction', cn: '你们几点开门？', before: 'what time do you open', after: 'wə-taim-də-ju-ou-pən' },
    { en: 'I don\'t think it\'s a good idea.', mark: 'I‿don‿t‿think‿it‿s‿a‿good‿i‿dea.', rule: 'reduction', cn: '我觉得这不是个好主意。', before: "I don't think it's a good idea", after: 'ai-dount-θi-kits-ə-gu-di-dea' },
    { en: 'There\'s no need to worry.', mark: 'The‿re‿s‿no‿need‿t‿worry.', rule: 'reduction', cn: '不用担心。', before: "there's no need to worry", after: 'ðɛ-zə-nou-nid-tə-wʌ-ri' },

    /* ===== 不完全发音（补充） ===== */
    { en: 'I\'ve been there.', mark: 'I‿v‿been‿the‿re.', rule: 'incomplete', cn: '我去过那儿。', before: "I've /aɪv/", after: 'ive /aiv/，v 不再爆破' },
    { en: 'They would have gone.', mark: 'They‿wu‿d‿ha‿gon.', rule: 'incomplete', cn: '他们本来会走的。', before: 'would have 读全', after: 'wu-d ə-gon，d 脱落' },
    { en: 'We should have known.', mark: 'We‿shu‿d‿ha‿known.', rule: 'incomplete', cn: '我们本该知道的。', before: 'should have 读全', after: 'ʃu-də-non，d 脱落' },
    { en: 'The answer is wrong.', mark: 'The‿an‿swer‿is‿wrong.', rule: 'incomplete', cn: '答案是错的。', before: 'answer /ˈænsər/', after: 'answer /ˈænsə/，w 不发音' },
    { en: 'He knows the way.', mark: 'He‿knows‿ze‿way.', rule: 'incomplete', cn: '他知道路。', before: 'knows /noʊz/', after: 'knows /nou/，k 不发音' },
    { en: 'Climb the stairs.', mark: 'Climb‿ze‿stairs.', rule: 'incomplete', cn: '爬楼梯。', before: 'climb /klaɪm/', after: 'climb /klaɪm/，b 不发音' },
    { en: 'A comfortable chair.', mark: 'A‿com‏for‏ta‏ble‏chair.', rule: 'incomplete', cn: '一把舒服的椅子。', before: 'comfortable 4 音节', after: 'com-fər-tə-bul，2 音节' },
    { en: 'The evening was quiet.', mark: 'The‿e‏ven‏ing‿was‿qui‏et.', rule: 'incomplete', cn: '夜晚很安静。', before: 'evening 3 音节', after: 'e-ven-ing，2 音节' },
    { en: 'Give me some water.', mark: 'Gi‿me‿so‿me‿wa‿ter.', rule: 'incomplete', cn: '给我点水。', before: 'water 2 音节', after: 'wa-ter，t 脱落变1 音节' },
    { en: 'I went through.', mark: 'I‿went‿thru.', rule: 'incomplete', cn: '我穿过去了。', before: 'through /θruː/', after: 'through /θru/，gh 脱落' },
    { en: 'A little bird.', mark: 'A‿li‏tle‏bird.', rule: 'incomplete', cn: '一只小鸟。', before: 'little 2 音节', after: 'li-tul，t 脱落' },

    /* ===== 意群重音（补充） ===== */
    { en: 'I didn\'t say I was going to.', mark: 'I‿di‿n’t‿say‿I‿was‿go‿ing‿t‿who.', rule: 'stress', cn: '我没说我打算去。', before: '重音平均', after: '焦点在 going' },
    { en: 'It\'s not that I can\'t.', mark: 'It‿s‿not‿that‿I‿can‿t.', rule: 'stress', cn: '不是我做不到。', before: 'can 重音', after: '焦点在 not that' },
    { en: 'Which one do you want?', mark: 'Which‿one‿do‿you‿want?', rule: 'stress', cn: '你要哪个？', before: '重音在 want', after: '焦点在 one' },
    { en: 'How much is it in total?', mark: 'How‿much‿is‿it‿in‿to‿tal.', rule: 'stress', cn: '一共多少钱？', before: 'total 重音', after: '焦点 in total' },
    { en: 'I only said it once.', mark: 'I‿o‏nly‏said‿it‿wun‿s.', rule: 'stress', cn: '我刚说了一遍。', before: 'once 重音', after: '焦点在 only' },
    { en: 'Give me the other one.', mark: 'Gi‿me‿ze‿o‏ther‿one.', rule: 'stress', cn: '给我另一个。', before: '重音在 one', after: '焦点在 other' },
    { en: 'I\'ll be there in five.', mark: 'I‿ll‿be‿the‿re‿in‿five.', rule: 'stress', cn: '我五分钟后到。', before: 'five 重音', after: '焦点在 in five' },
    { en: 'It\'s the first time.', mark: 'It‿s‿the‿first‿time.', rule: 'stress', cn: '这是第一次。', before: 'first 重音', after: '焦点在 first time' }
  ];

  global.LiaisonContent2 = {
    EXAMPLES: EXAMPLES,
    count: function () { return EXAMPLES.length; }
  };
})(window);