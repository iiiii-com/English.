/* ============================================================
   tts-prep.js —— 朗读文本预处理（共享）
   ------------------------------------------------------------
   为什么单独抽一个模块：

   原本 prepText 只存在于 tts-server.js 里，pregen-audio.js 为了
   保持一致抄了一份简化版。结果两边规则分叉——离线包只有 11 条
   缩写，主服务有 30 多条，于是同一个词在「离线播放」和「在线合成」
   下读法不同。这类不一致极难排查：单测都过，肉眼一听就能听出。

   所以规则只有这一份，两个入口都 require 它。
   ============================================================ */
'use strict';

/* ---- 数字读法 ---- */

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
  'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

/** 整数转英文。4200 → four thousand two hundred */
function numToWords(n) {
  if (n < 0) return 'minus ' + numToWords(-n);
  if (n < 20) return ONES[n];
  if (n < 100) {
    const t = TENS[Math.floor(n / 10)];
    const o = n % 10;
    return o ? t + '-' + ONES[o] : t;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const r = n % 100;
    return ONES[h] + ' hundred' + (r ? ' ' + numToWords(r) : '');
  }
  const units = [[1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']];
  for (const [base, name] of units) {
    if (n >= base) {
      const head = Math.floor(n / base);
      const rest = n % base;
      return numToWords(head) + ' ' + name + (rest ? ' ' + numToWords(rest) : '');
    }
  }
  return String(n);
}

/** 序数：1st→first, 2nd→second, 4th→fourth, 21st→twenty-first */
const ORD = { 1: 'first', 2: 'second', 3: 'third', 5: 'fifth',
  8: 'eighth', 9: 'ninth', 12: 'twelfth' };
function ordinal(n) {
  if (ORD[n]) return ORD[n];
  const w = numToWords(n);
  return w.replace(/y$/, 'ieth').replace(/e$/, 'th');
}

/**
 * 数值转英文读法。
 * 依据是对 26988 条真实学习内容的统计：7.7% 含数字，
 * 而 TTS 对裸数字常做「逐字符拼读」——4,200 会读成
 * four comma two zero zero，这在语义上是错的。
 */
function numberToSpeech(raw) {
  const t = String(raw).replace(/,/g, '');

  let m = t.match(/^(\d+)(?:st|nd|rd|th)$/i);
  if (m) return ordinal(parseInt(m[1], 10));

  if (/^\d*\.\d+$/.test(t)) {
    const parts = t.split('.');
    const head = parts[0] ? numToWords(parseInt(parts[0], 10)) : 'zero';
    return head + ' point ' + parts[1].split('').map(d => ONES[+d]).join(' ');
  }

  m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (m) {
    const h = +m[1], mm = +m[2];
    if (mm === 0) return numToWords(h) + " o'clock";
    if (mm < 10) return numToWords(h) + " oh " + numToWords(mm);
    return numToWords(h) + ' ' + numToWords(mm);
  }

  return numToWords(parseInt(t, 10));
}

/* 数字后缀单位：读法与符号不同，必须单独映射 */
const UNIT_WORDS = {
  km: 'kilometers', cm: 'centimeters', mm: 'millimeters', m: 'meters',
  kg: 'kilograms', g: 'grams', ml: 'milliliters', l: 'liters',
  kmh: 'kilometers per hour', kmph: 'kilometers per hour', mph: 'miles per hour',
  bpm: 'beats per minute', hz: 'hertz', kb: 'kilobytes', mb: 'megabytes',
  gb: 'gigabytes', tb: 'terabytes'
};

const ABBR = [
  [/\bMr\./g, 'Mister'], [/\bMrs\./g, 'Missus'], [/\bMs\./g, 'Miss'],
  [/\bDr\./g, 'Doctor'], [/\bProf\./g, 'Professor'],
  [/\bSt\./g, 'Saint'], [/\bvs\.?\b/g, 'versus'],
  [/\be\.g\./gi, 'for example'], [/\bi\.e\./gi, 'that is'],
  [/\betc\./gi, 'et cetera'], [/\bapprox\./gi, 'approximately'],
  [/\bNo\./g, 'number'],
  [/\bJr\./g, 'Junior'], [/\bSr\./g, 'Senior'],
  [/\bDept\./g, 'Department'], [/\bUniv\./g, 'University'],
  [/\bEst\./g, 'Established'],
  /* min/max/avg 只在带数字或独立成词时才展开。
     `30min` 已在单位规则里变成 "thirty minutes"，
     这里处理的是 "in 5 min" 这类写法。 */
  [/\b(\d+)\s*(min|sec|hr|hrs)\b/gi, function (_, n, u) {
    const map = { min: 'minutes', sec: 'seconds', hr: 'hours', hrs: 'hours' };
    return numberToSpeech(n) + ' ' + map[u.toLowerCase()];
  }],
  [/\bmax\b/g, 'maximum'], [/\bavg\b/g, 'average'],
  [/\bcf\./g, 'compare'], [/\bRef\./g, 'reference'], [/\bFig\./g, 'Figure'],
  [/\bVol\./g, 'Volume'], [/\bCh\./g, 'Chapter'], [/\bpp\./g, 'pages'],
  [/\bJan\./g, 'January'], [/\bFeb\./g, 'February'], [/\bMar\./g, 'March'],
  [/\bApr\./g, 'April'], [/\bJun\./g, 'June'], [/\bJul\./g, 'July'],
  [/\bAug\./g, 'August'], [/\bSep\./g, 'September'], [/\bSept\./g, 'September'],
  [/\bOct\./g, 'October'], [/\bNov\./g, 'November'], [/\bDec\./g, 'December']
];

/**
 * 把待朗读文本规范化为「TTS 能读对」的形式。
 *
 * 只改「怎么读」，不改「读什么」：不新增信息、不丢信息。
 *
 * 规则顺序不可调整：
 *   1. 比较符号先于 %，否则 `≥ 70%` 里的 ≥ 会被漏掉
 *   2. 时刻先于通用数字，否则 2:30 会被拆成两个数
 *   3. 年份先于通用数字，否则 1990 会读成 one thousand nine hundred ninety
 *   4. 区间先于通用数字，否则 8-12 会读成 eight dash twelve
 *   5. 单位先于裸数字，否则 5 已被替换成 five，km 匹配不上
 */
function prepText(text) {
  let s = String(text || '');

  // 撇号统一：让它按上下文判断，而不是被原样读成奇怪字符
  s = s.replace(/[''`]/g, "'");

  /* ---- 1. 比较与方向符号 ---- */
  s = s.replace(/≥/g, 'at least ')
       .replace(/≤/g, 'at most ')
       .replace(/≠/g, 'not equal to ')
       .replace(/≈/g, 'approximately ')
       .replace(/±/g, 'plus or minus ')
       .replace(/→/g, ' to ')
       .replace(/←/g, ' from ');

  /* ---- 2. 时刻：half past seven 而不是 two colon thirty ---- */
  s = s.replace(/\b(\d{1,2}):(\d{2})\b/g, function (_, h, mm) {
    const hh = +h, m2 = +mm;
    if (m2 === 0) return numToWords(hh) + " o'clock";
    if (m2 === 30) return 'half past ' + numToWords(hh);
    if (m2 < 30) return numToWords(m2) + ' past ' + numToWords(hh);
    return numToWords(60 - m2) + ' to ' + numToWords(hh + 1);
  });

  /* ---- 3. 年份：1990 读 nineteen ninety ----
     英语母语者不会把年份读成 one thousand nine hundred ninety，
     那会把年份误当成数量。 */
  s = s.replace(/\b(19|20)(\d{2})\b/g, function (_, cent, rest) {
    const n = parseInt(cent + rest, 10);
    if (n >= 2000 && n <= 2009) return 'two thousand ' + numToWords(+rest);
    if (n >= 2010 && n <= 2099) return 'twenty ' + numToWords(+rest);
    return numToWords(+cent) + ' ' + (rest[0] === '0'
      ? 'oh ' + numToWords(+rest[1]) : numToWords(+rest));
  });

  /* ---- 4. 区间：8-12 → eight to twelve ---- */
  s = s.replace(/\b(\d+)\s*[-–—]\s*(\d+)\b/g, function (_, a, b) {
    return numberToSpeech(a) + ' to ' + numberToSpeech(b);
  });

  /* ---- 5. 复合单位必须在斜杠规则之前处理 ----
     `60km/h` 若先被 `/` 规则拆开，会读成 "sixty km slash h"。
     这里不能用 \b 收尾：`m` 与 `/` 之间不构成词边界，
     \bkm\/h\b 匹配不到，必须把整段作为一个词整体匹配。 */
  s = s.replace(/(\d+(?:\.\d+)?)\s*(km\/h|kmph|kmh)\b/gi,
    function (_, num) { return numberToSpeech(num) + ' kilometers per hour'; });
  s = s.replace(/(\d+(?:\.\d+)?)\s*(mph)\b/gi,
    function (_, num) { return numberToSpeech(num) + ' miles per hour'; });
  s = s.replace(/\b(\d+(?:\.\d+)?)\s*(bpm)\b/gi,
    function (_, num) { return numberToSpeech(num) + ' beats per minute'; });
  // 剩余简单单位
  s = s.replace(/\b(\d+(?:\.\d+)?)\s*(cm|mm|kg|ml|hz|mb|gb|tb|kb|km|m|g|l)\b/gi,
    function (_, num, unit) {
      const u = UNIT_WORDS[unit.toLowerCase()];
      return numberToSpeech(num) + ' ' + (u || unit);
    });

  /* ---- 6. 金额：$3.50 读作 three dollars fifty cents ----
     逐字符读成 "dollars three point five zero" 是错的，
     真实场景里金额几乎总是按整体读的。
     注意必须在 `$` → dollars 规则之前，否则金额会被拆开。 */
  s = s.replace(/\$\s*(\d+)(?:\.(\d{2}))?\b/g, function (_, int, dec) {
    if (dec && +dec > 0) {
      return numberToSpeech(int) + ' dollars ' + numberToSpeech(dec) + ' cents';
    }
    return numberToSpeech(int) + ' dollars';
  });

  /* ---- 7. 百分号 ---- */
  s = s.replace(/\b(\d+(?:\.\d+)?)\s*%/g,
    function (_, num) { return numberToSpeech(num) + ' percent'; });

  /* ---- 7. 其余裸数字 ---- */
  s = s.replace(/\b\d[\d,]*(?:\.\d+)?\b/g, function (n) {
    return numberToSpeech(n);
  });

  /* ---- 8. 缩写（在数字之后，避免误伤） ---- */
  for (const [re, to] of ABBR) s = s.replace(re, to);

  /* ---- 9. 剩余符号；句号逗号保留，它们影响断句与语调 ----
     $ 已被金额规则消费，这里不再处理，否则会重复成 "dollars ... dollars"。 */
  s = s.replace(/&/g, ' and ')
       .replace(/\+/g, ' plus ')
       .replace(/=/g, ' equals ')
       .replace(/@/g, ' at ')
       .replace(/\$/g, ' dollars ')
       .replace(/#/g, ' number ')
       .replace(/\*/g, '')
       .replace(/~/g, ' to ')
       .replace(/\//g, ' slash ')
       .replace(/[·•]/g, ', ')
       .replace(/[（(]/g, ', ')
       .replace(/[）)]/g, ', ');

  s = s.replace(/\s+/g, ' ').trim();

  // 括号展开后句尾容易堆出逗号，听起来像是话没说完
  s = s.replace(/[,，]\s*$/, '.');

  return s;
}

module.exports = { prepText, numToWords, ordinal, numberToSpeech, ONES, TENS, UNIT_WORDS, ABBR };
