#!/usr/bin/env node
/* ============================================================
   build-freq-index.js —— 生成词频分级索引
   ------------------------------------------------------------
   要解决的两个问题：

   1) 四六级没有独立入口。
      现状是 cet4/cet6 词被打散塞进 L5/L6（"高考延伸词"），
      但四六级本就是独立考试体系，混在高考词里既不符合认知习惯，
      也让「按考试范围背词」这件事做不了。

   2) 没有按使用频率组织词汇。
      现有 L1-L6 是「难度/阶段」维度，不是「常用度」维度。
      学习者真正想知道的是：哪些词天天见、哪些词读一次就够了。
      这两种排序互不替代——难度告诉你先学什么，
      词频告诉你哪些值得反复滚熟。

   词频字段说明（实测自 ECDICT）：
     frq 是**排名**而非频次：值越小越常用（the=1, of=4, in=6）。
     99999 是「无词频数据」的哨兵值（实测 51 个，多为新词如 dvd/email）。
     所以分档必须把 99999 单独归入「生僻」，绝不能当作「极常用」。
   ============================================================ */

'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'assets', 'js', 'data');
const OUT = path.join(DATA, 'word-frequency.js');

/* ---------- 分档定义 ----------
   档位边界按 ECDICT 排名直方图的实际形状划定：
     0-1000    410 词   —— 这些是 the/of/in 这类虚词与最高频实词
     1000-3000 914 词
     3000-6000 1292 词
     6000-9000 1051 词
     9000+     326 词 + 51 个无数据

   四档而非更细，是因为学习用途只关心「该滚熟多少遍」，
   分太细会导致每档都太大，失去指导意义。 */
const BANDS = [
  { id: 'F1', max: 1000, name: '极高频', desc: '母语者日常与考试中反复出现，必须滚熟' },
  { id: 'F2', max: 3000, name: '高频', desc: '常见实词，读写都要认' },
  { id: 'F3', max: 6000, name: '中频', desc: '有一定出现频率，认识即可' },
  { id: 'F4', max: 9000, name: '低频', desc: '偏少出现，见过就够' },
  { id: 'F5', max: Infinity, name: '生僻/无数据', desc: '罕见词或无词频记录，按需查阅' }
];

/** 排名 → 档位 id */
function bandOf(frq) {
  if (typeof frq !== 'number' || !isFinite(frq) || frq >= 99999) return 'F5';
  for (const b of BANDS) {
    if (frq < b.max) return b.id;
  }
  return 'F5';
}

/* ---------- 加载现有词库 ---------- */
function loadWords() {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  const files = fs.readdirSync(DATA).filter(f => /^words.*\.js$/.test(f));
  for (const f of files) {
    try {
      vm.runInContext(fs.readFileSync(path.join(DATA, f), 'utf8'), sandbox, { timeout: 30000 });
    } catch (e) { /* 单个文件失败不影响其他 */ }
  }
  const W = sandbox.window;
  const out = [];
  if (W.VOCAB_DATA && Array.isArray(W.VOCAB_DATA.words)) out.push(...W.VOCAB_DATA.words);
  if (W.GAOKAO_L5) out.push(...W.GAOKAO_L5.words);
  if (W.GAOKAO_L6) out.push(...W.GAOKAO_L6.words);
  return { words: out, sandbox: W };
}

function hasTag(w, tag) {
  return String(w.tag || '').split(/\s+/).indexOf(tag) > -1;
}

function main() {
  const { words } = loadWords();
  if (!words.length) {
    console.error('[freq] 读不到任何词条，请确认 assets/js/data/words*.js 存在');
    process.exit(1);
  }

  /* ---------- 词频分档统计 ---------- */
  const bandCount = {};
  const bandWords = {};
  BANDS.forEach(b => { bandCount[b.id] = 0; bandWords[b.id] = []; });

  for (const w of words) {
    const b = bandOf(w.frq);
    bandCount[b]++;
    // 只收最常用的若干个进索引，避免索引文件过大
    if (bandWords[b].length < 400) bandWords[b].push(w.w);
  }

  /* ---------- 考试体系统计 ----------
     四六级是「包含关系」而非「难度递增」：
       cet4 ⊂ cet6，且与高考词大量重叠。
     所以独立统计每个体系自己的词数与独占词数。 */
  const EXAMS = [
    { id: 'cet4', name: 'CET-4', full: '大学英语四级' },
    { id: 'cet6', name: 'CET-6', full: '大学英语六级' },
    { id: 'ky', name: '考研', full: '研究生入学考试' },
    { id: 'toefl', name: 'TOEFL', full: '托福' },
    { id: 'ielts', name: 'IELTS', full: '雅思' },
    { id: 'gre', name: 'GRE', full: '美国研究生入学考试' },
    { id: 'gk', name: '高考', full: '普通高等学校招生全国统一考试' },
    { id: 'zk', name: '中考', full: '初中学业水平考试' }
  ];
  const exams = {};
  for (const e of EXAMS) {
    const inExam = words.filter(w => hasTag(w, e.id));
    /* 独占词 = 这个考试要、但其他体系都不要。
       注意要在 filter 内部判断，拿到具体的 w 才能查其他 tag。 */
    const exclusive = inExam.filter(w =>
      !EXAMS.some(o => o.id !== e.id && hasTag(w, o.id))).length;
    exams[e.id] = {
      name: e.name,
      full: e.full,
      count: inExam.length,
      exclusive: exclusive
    };
  }

  /* 四六级关系：cet4 独有的才是「四级特有」，四级六级都要的算共同词 */
  const cet4Set = new Set(words.filter(w => hasTag(w, 'cet4')).map(w => w.w));
  const cet6Set = new Set(words.filter(w => hasTag(w, 'cet6')).map(w => w.w));
  let cet4Only = 0, both = 0;
  cet4Set.forEach(w => { if (cet6Set.has(w)) both++; else cet4Only++; });
  const cet6Only = [...cet6Set].filter(w => !cet4Set.has(w)).length;

  /* ---------- 学习优先级 ----------
     把「考试范围」与「使用频率」交叉，得到真正的推荐顺序。
     高频且在目标考试内 → 最该先背。
     高频但不在考试内 → 日常表达，仍值得掌握。
     低频但在考试内 → 考纲边缘，考前扫一眼即可。 */
  const priority = {};
  for (const e of EXAMS) {
    const inExam = words.filter(w => hasTag(w, e.id));
    const c = { core: 0, high: 0, mid: 0, low: 0 };
    inExam.forEach(w => {
      const b = bandOf(w.frq);
      if (b === 'F1' || b === 'F2') c.core++;
      else if (b === 'F3') c.high++;
      else if (b === 'F4') c.mid++;
      else c.low++;
    });
    priority[e.id] = c;
  }

  const meta = {
    source: 'ECDICT frq 字段（排名，越小越常用；99999 = 无数据）',
    total: words.length,
    bands: BANDS.map(b => ({
      id: b.id, name: b.name, desc: b.desc,
      max: b.max === Infinity ? null : b.max,
      count: bandCount[b.id]
    })),
    exams: EXAMS.map(e => ({ id: e.id, ...exams[e.id] })),
    cet: {
      cet4Count: cet4Set.size,
      cet6Count: cet6Set.size,
      both: both,
      cet4Only: cet4Only,
      cet6Only: cet6Only
    },
    priority: priority
  };

  const payload = {
    meta: meta,
    words: bandWords
  };

  const js = '/* 自动生成，勿手改。重新生成：node tools/build-freq-index.js */\n'
    + 'window.WORD_FREQ = ' + JSON.stringify(payload) + ';\n';
  fs.writeFileSync(OUT, js);

  console.log('');
  console.log('[freq] 词频索引已生成：' + path.relative(ROOT, OUT));
  console.log('  总词数 ' + words.length);
  console.log('');
  console.log('  词频分档：');
  meta.bands.forEach(b => {
    const pct = (b.count / words.length * 100).toFixed(1);
    console.log('    ' + b.id + ' ' + b.name.padEnd(12) + String(b.count).padStart(5) + ' 词  ' + pct + '%');
  });
  console.log('');
  console.log('  考试体系：');
  meta.exams.forEach(e => {
    console.log('    ' + e.name.padEnd(7) + String(e.count).padStart(5) + ' 词'
      + '（其他体系未收录 ' + e.exclusive + '）');
  });
  console.log('');
  console.log('  四六级关系：');
  console.log('    四级 ' + meta.cet.cet4Count + ' / 六级 ' + meta.cet.cet6Count);
  console.log('    共有 ' + meta.cet.both + '，四级独有 ' + meta.cet.cet4Only
    + '，六级独有 ' + meta.cet.cet6Only);
  console.log('');
  console.log('  学习优先级（该考试内按词频拆分）：');
  ['cet4', 'cet6', 'ky'].forEach(id => {
    const p = priority[id];
    console.log('    ' + id.padEnd(6) + '核心(高频) ' + String(p.core).padStart(5)
      + '  次核心 ' + String(p.high).padStart(5)
      + '  中频 ' + String(p.mid).padStart(5)
      + '  低频 ' + String(p.low).padStart(5));
  });
  console.log('');
}

main();
