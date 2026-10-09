/* ============================================================
   lookup.js —— 全站划词取词
   ------------------------------------------------------------
   作用：选中任意英文单词，立刻看到释义 + 发音 + 词根来路 + 例句。
   这是把「单词讲解」「词根词缀」「诗歌赏析」三个模块串起来的枢纽：
     在诗句里选中一个词 → 能查到它的词根与例句
     在阅读里选中一个词 → 能跳到词汇模块的详细讲解

   为什么不能直接用 window.getSelection()：
     1. 选中文本可能被浏览器原生菜单（复制/粘贴）抢走
     2. 触屏上选词需要长按，交互重
     3. 需要同时支持点击取词与划词取词

   实现要点：
     · 鼠标：双击选词后自动弹出
     · 触屏：长按 400ms（浏览器已弹出选择菜单，此时读 selection）
     · 键盘：Ctrl/⌘ + 单击 直接取当前光标处单词
     · 所有入口统一走 show(word)，逻辑只有一份
   ============================================================ */
(function (global) {
  'use strict';
  /* global.ui 由 app.js 定义（共享工具箱），所以本文件必须在 app.js 之后加载。
     这里额外做一次防御性读取：万一手工调整了脚本顺序，也不会让整个 IIFE 静默死掉。*/
  var ui = global.ui || (global.UI && { h: global.UI.h }) || null;
  if (!ui || !ui.h) {
    console.error('[lookup] 未找到 ui.h —— 请确认 lookup.js 在 app.js 之后加载');
    return;
  }
  var h = ui.h;

  var STOP_WORDS = {
    the: 1, a: 1, an: 1, and: 1, or: 1, but: 1, is: 1, are: 1, was: 1, were: 1,
    be: 1, been: 1, being: 1, have: 1, has: 1, had: 1, do: 1, does: 1, did: 1,
    will: 1, would: 1, can: 1, could: 1, should: 1, may: 1, might: 1, must: 1,
    of: 1, to: 1, in: 1, on: 1, at: 1, by: 1, for: 1, with: 1, from: 1, as: 1,
    it: 1, its: 1, this: 1, that: 1, these: 1, those: 1, i: 1, you: 1, he: 1,
    she: 1, we: 1, they: 1, me: 1, him: 1, her: 1, us: 1, them: 1, my: 1,
    your: 1, his: 1, their: 1, our: 1, not: 1, no: 1, so: 1, if: 1, not: 1
  };

  /** 只接受看起来像英语单词的文本 */
  function normalize(raw) {
    var w = String(raw || '').trim()
      // 去掉引号、括号、标点
      .replace(/^[^A-Za-z'-]+|[^A-Za-z'-]+$/g, '')
      // 连字符词（如 well-known）整体保留
      .toLowerCase();
    if (!w) return '';
    if (w.length < 2 || w.length > 24) return '';
    // 必须含字母
    if (!/[A-Za-z]/.test(w)) return '';
    return w;
  }

  function isStop(w) { return !!STOP_WORDS[w]; }

  /* ---------------- 数据归一化 ----------------
     词库由多个来源合并而成，例句/词形字段的形态并不统一：
       A. [["I have a question.", "我有个问题。"], ...]   成对数组
       B. ["I have a question.", ...]                   纯英文字符串数组
       C. "I have a question.|我有个问题。"                单条带分隔符
     渲染层统一只吃 [en, cn] 形态，所以在读���层收口，
     免得每个渲染分支各写一遍防御。 */
  function normPairs(raw) {
    var out = [];
    if (!raw) return out;
    var list = Array.isArray(raw) ? raw : [raw];
    list.forEach(function (it) {
      if (it == null) return;
      if (Array.isArray(it)) {
        if (it.length) out.push([String(it[0] || ''), String(it[1] || '')]);
        return;
      }
      var s = String(it).trim();
      if (!s) return;
      // "en|cn" / "en：cn" / "en - cn" 都能拆
      var m = /^(.+?)\s*[|｜：:]\s*(.+)$/.exec(s);
      if (m) out.push([m[1].trim(), m[2].trim()]);
      else out.push([s, '']);
    });
    // 去掉空的英文项
    return out.filter(function (p) { return p[0]; });
  }
  function normExamples(raw) { return normPairs(raw); }

  /* ---------------- 查词数据聚合 ---------------- */

  /** 从词库中查找词条
   *  词库的真实来源是 global.VOCAB_DATA.words（+ 懒加载的 GAOKAO_L5/L6），
   *  Store 上并没有 lookupWord / allWords 这两个方法——早前误调它们导致
   *  findInVocab 永远返回 null，弹层里「在词汇模块查看完整讲解」按钮从不出现。 */
  function findInVocab(word) {
    var hit = scanPools(word);
    if (hit) return hit;
    // 首次 miss：把 L5/L6 分片拉下来后重试（冷启动只加载了 1456 词）
    ensureHighLevels().then(function () {
      var again = scanPools(word);
      if (again) global.__lkRetry && global.__lkRetry(word, again);
    });
    return null;
  }

  /** 高考词库 L5/L6 约 4000 词按需加载，首次查不到时补拉一次 */
  var L5L6_LOADED = false;
  function ensureHighLevels() {
    if (L5L6_LOADED) return Promise.resolve();
    var S = global.Store;
    if (!S || typeof S.ensureLevel !== 'function') return Promise.resolve();
    var jobs = [];
    if (!global.GAOKAO_L5) jobs.push(Promise.resolve(S.ensureLevel('L5')).catch(function () {}));
    if (!global.GAOKAO_L6) jobs.push(Promise.resolve(S.ensureLevel('L6')).catch(function () {}));
    if (!jobs.length) { L5L6_LOADED = true; return Promise.resolve(); }
    return Promise.all(jobs).then(function () { L5L6_LOADED = true; });
  }

  function scanPools(word) {
    try {
      if (global.ContentIndex && typeof global.ContentIndex.lookupWord === 'function') {
        var byIdx = global.ContentIndex.lookupWord(word);
        if (byIdx && byIdx.length) return byIdx[0];
      }
      var pools = [
        (global.VOCAB_DATA && global.VOCAB_DATA.words) || [],
        (global.GAOKAO_L5 && global.GAOKAO_L5.words) || [],
        (global.GAOKAO_L6 && global.GAOKAO_L6.words) || []
      ];
      for (var i = 0; i < pools.length; i++) {
        var arr = pools[i];
        // 词库不大（数千条），线性扫足够；真要提速可在词库侧建 map
        for (var j = 0; j < arr.length; j++) {
          if (String(arr[j].w || '').toLowerCase() === word) return arr[j];
        }
      }
    } catch (e) { /* 词库不可用时只显示词根信息 */ }
    return null;
  }

  /** 从英语资料里查找释义（覆盖不在词库里的词）
   *  真实数据源是 word-en-defs.js 挂载的 global.WordEnDefs。 */
  function findInDict(word) {
    var D = global.WordEnDefs;
    if (D && typeof D.lookup === 'function') {
      try { return D.lookup(word); } catch (e) { /* 忽略 */ }
    }
    if (D && D.DEFS) {
      var d = D.DEFS[word] || D.DEFS[String(word).toLowerCase()];
      if (d) return { cn: typeof d === 'string' ? d : (d.cn || d.def || '') };
    }
    return null;
  }

  /* ---------------- 弹层 ---------------- */

  /**
   * 显示一个词的完整讲解。
   * 统一入口：划词、点击、搜索都调它。
   */
  function show(word) {
    var w = normalize(word);
    if (!w) return;

    if (isStop(w)) {
      // 虚词也给出提示，但不做详细讲解
      ui.toast('「' + w + '」是英语虚词（功能词），不单独记忆。', { ms: 2600, type: 'info' });
      return;
    }

    var entry = findInVocab(w);
    var dict = entry ? null : findInDict(w);
    var roots = global.RootIndex ? global.RootIndex.lookup(w) : [];

    // app.js 暴露的共享工具箱里叫 openSheet，不是 sheet
    var openSheet = ui.openSheet || ui.sheet;

    // L5/L6 分片异步加载完毕后，若补查到词条，就把「跳到词汇模块」的
    // 按钮补上——否则冷启动时查高考词会看不到这个入口。
    var sheetEl = null;
    global.__lkRetry = function (rw) {
      if (rw !== w || !sheetEl) return;
      var acts = sheetEl.querySelector('.lk-acts');
      if (!acts || acts.querySelector('[data-jump-vocab]')) return;
      var b = h('button', 'soft', '📖 在词汇模块查看完整讲解');
      b.dataset.jumpVocab = '1';
      b.onclick = function () {
        var close = ui.closeAllSheets || (global.UI && global.UI.closeAllSheets);
        if (close) close();
        global.__pendingWord = rw;
        location.hash = 'vocab?w=' + encodeURIComponent(rw);
      };
      acts.insertBefore(b, acts.firstChild);
    };
    openSheet(w, function (box) {
      sheetEl = box;
      /* ---- 顶部：发音控制 ---- */
      var bar = h('div', 'lk-bar');
      var bSay = h('button', 'primary', '🔊 朗读');
      bSay.onclick = function () { ui.tts.speak(w); };
      bar.appendChild(bSay);

      var bSlow = h('button', 'soft', '🐢 慢速');
      bSlow.onclick = function () { ui.tts.slow(w); };
      bar.appendChild(bSlow);

      box.appendChild(bar);

      /* ---- 释义 ---- */
      var main = entry || dict;
      if (main) {
        var head = h('div', 'lk-head');
        head.appendChild(h('span', 'lk-w', main.w || w));
        if (main.ipa) head.appendChild(h('span', 'lk-ipa', main.ipa));
        // 词性字段两个来源不一致：content-vocab.js 用 pos，高考词库用 p
        var posCn = main.pos || main.p;
        if (posCn) head.appendChild(h('span', 'tag', posCn));
        box.appendChild(head);

        if (main.cn) {
          box.appendChild(h('div', 'lk-cn', main.cn));
        }
        // 高考词库带 en（英文释义），一并给出，方便对照英汉差异
        if (main.en) {
          box.appendChild(h('div', 'lk-en', main.en));
        }
        if (main.tip) {
          var tip = h('div', 'lk-tip');
          tip.appendChild(h('span', 'tip-icon', '💡'));
          tip.appendChild(h('span', 'tip-text', main.tip));
          box.appendChild(tip);
        }
      } else {
        var none = h('div', 'lk-none');
        none.textContent = '词库里还没有「' + w + '」的详细释义。'
          + '但如果它含已知词根，下面的词根信息仍能帮你推断意思。';
        box.appendChild(none);
      }

      /* ---- 词根来路 ---- */
      if (roots.length) {
        var rh = h('div', 'lk-sec-head');
        rh.appendChild(h('span', null, '词根来路'));
        box.appendChild(rh);

        roots.forEach(function (r) {
          var key = r.root || r.affix;
          var blk = h('div', 'lk-root');

          var top = h('div', 'lk-root-top');
          top.appendChild(h('b', null, key));
          top.appendChild(h('span', 'lk-root-gloss', r.gloss));
          var tg = h('span', 'tag grey', r.from);
          top.appendChild(tg);
          blk.appendChild(top);

          if (r.demo && (r.demo.w || '').toLowerCase() === w && r.demo.break) {
            var brk = h('div', 'lk-break');
            brk.appendChild(h('span', 'break-label', '拆解'));
            brk.appendChild(h('span', 'break-val', r.demo.break));
            blk.appendChild(brk);
            if (r.demo.note) blk.appendChild(h('div', 'lk-note', r.demo.note));
          }

          // 同源词：点一下能替换当前弹层内容，实现"顺着词根一直挖下去"
          var fam = r.family || r.words || [];
          if (fam.length) {
            var fw = h('div', 'lk-family');
            var sh = h('div', 'lk-family-head', '同源词（点击继续查）');
            fw.appendChild(sh);
            var chips = h('div', 'lk-chips');
            fam.forEach(function (item) {
              var fw2 = typeof item === 'string' ? item : item.w;
              if (!fw2) return;
              var chip = h('button', 'chip');
              chip.appendChild(h('span', null, fw2));
              if (typeof item !== 'string' && item.cn) {
                chip.appendChild(h('span', 'chip-cn', item.cn));
              }
              var sp = h('span', 'chip-speak', '🔊');
              sp.onclick = function (e) { e.stopPropagation(); ui.tts.speak(fw2); };
              chip.appendChild(sp);
              chip.onclick = function () { show(fw2); };
              chips.appendChild(chip);
            });
            fw.appendChild(chips);
            blk.appendChild(fw);
          }

          if (r.tip) {
            var t2 = h('div', 'lk-tip');
            t2.appendChild(h('span', 'tip-icon', '💡'));
            t2.appendChild(h('span', 'tip-text', r.tip));
            blk.appendChild(t2);
          }

          box.appendChild(blk);
        });
      }

      /* ---- 例句 ----
         词库的 ex 字段有两种形态：
           content-vocab.js  → [[en, cn], ...]  成对
           高考词库 words-gaokao-*.js → "en句" 或 "en|中文"  字符串
         早前直接 ex.forEach(pair => pair[0]) 在字符串上取下标 1 会得到
         第二个字符，导致整层构建崩溃，这里统一归一化。 */
      var exList = normExamples(entry && entry.ex);
      if (exList.length) {
        var eh = h('div', 'lk-sec-head');
        eh.appendChild(h('span', null, '例句'));
        box.appendChild(eh);

        exList.forEach(function (pair) {
          var en = pair[0], cn = pair[1] || '';
          var row = h('div', 'lk-ex');
          var top = h('div', 'lk-ex-top');
          top.appendChild(h('span', 'lk-ex-en', en));
          var sp2 = h('span', 'chip-speak', '🔊');
          sp2.onclick = function () { ui.tts.speak(en); };
          top.appendChild(sp2);
          row.appendChild(top);
          if (cn) row.appendChild(h('div', 'lk-ex-cn', cn));
          box.appendChild(row);
        });
      }

      /* ---- 固定搭配 ----
         搭配比释义更接近"能不能用出去"：
         知道 worth 是"值得"没用，知道 it's worth it 才有用。 */
      var deepHit = global.VocabDeepAny ? global.VocabDeepAny.get(w) : null;
      var coll = (entry && entry.coll) || (deepHit ? deepHit.coll : null);
      if (coll && coll.length) {
        var ch = h('div', 'lk-sec-head');
        ch.appendChild(h('span', null, '固定搭配'));
        box.appendChild(ch);
        var cl = h('div', 'lk-coll');
        var main = h('div', 'lk-coll-main');
        var cs = h('span', 'chip-speak', '🔊');
        cs.onclick = function () { ui.tts.speak(coll[0]); };
        main.appendChild(h('b', null, coll[0]));
        main.appendChild(cs);
        cl.appendChild(main);
        if (coll[1]) {
          var note = h('div', 'lk-coll-note');
          note.textContent = coll[1];
          if (coll[2]) {
            var sc = h('span', 'tag grey', coll[2]);
            note.appendChild(sc);
          }
          cl.appendChild(note);
        }
        box.appendChild(cl);
      }

      /* ---- 词形变化 ---- */
      var forms = normPairs(entry && entry.forms);
      if (forms.length) {
        var fh = h('div', 'lk-sec-head');
        fh.appendChild(h('span', null, '词形变化'));
        box.appendChild(fh);
        var fl = h('div', 'lk-forms');
        forms.forEach(function (pair) {
          var fr = h('div', 'lk-form');
          fr.appendChild(h('b', null, pair[0] || ''));
          fr.appendChild(h('span', null, pair[1] || ''));
          fl.appendChild(fr);
        });
        box.appendChild(fl);
      }

      /* ---- 易混辨析 ---- */
      if (entry && entry.confuse) {
        var dh = h('div', 'lk-sec-head');
        dh.appendChild(h('span', null, '易混辨析'));
        box.appendChild(dh);
        box.appendChild(h('div', 'lk-confuse', entry.confuse));
      }

      /* ---- 相关操作 ---- */
      var acts = h('div', 'lk-acts');
      if (entry) {
        var bVoc = h('button', 'soft', '📖 在词汇模块查看完整讲解');
        bVoc.dataset.jumpVocab = '1';
        bVoc.onclick = function () {
          // closeAllSheets 只挂在 global.UI 上，global.ui 里没有，必须这么取。
          // 早前直接写 ui.closeAllSheets() 会抛错，后面的 hash 赋值根本不执行。
          var close = ui.closeAllSheets
            || (global.UI && global.UI.closeAllSheets);
          if (close) close();
          global.__pendingWord = w;
          location.hash = 'vocab?w=' + encodeURIComponent(w);
        };
        acts.appendChild(bVoc);
      }
      if (roots.length) {
        var bRoot = h('button', 'ghost', '🌱 打开词根词缀');
        bRoot.onclick = function () {
          var close = ui.closeAllSheets
            || (global.UI && global.UI.closeAllSheets);
          if (close) close();
          location.hash = 'roots';
        };
        acts.appendChild(bRoot);
      }
      box.appendChild(acts);
    }, { size: 'md' });
  }

  /* ---------------- 事件绑定 ---------------- */
  var timer = null;

  function currentWord() {
    var sel = global.getSelection ? global.getSelection() : null;
    if (!sel || sel.isCollapsed) return '';
    return normalize(sel.toString());
  }

  function bind() {
    if (global.__lookupBound) return;
    global.__lookupBound = true;

    // 鼠标：双击取词（配合浏览器选中）
    document.addEventListener('dblclick', function () {
      setTimeout(function () {
        var w = currentWord();
        if (w) show(w);
      }, 60);
    });

    // 触屏：长按后读选区
    document.addEventListener('touchend', function () {
      if (timer) { clearTimeout(timer); timer = null; }
      // 长按已让浏览器显示了选择菜单，此时 selection 可读
      timer = setTimeout(function () {
        var w = currentWord();
        if (w) show(w);
      }, 450);
    }, { passive: true });

    document.addEventListener('selectionchange', function () {
      // 短选择（可能是拖选）在鼠标端不处理，双击已足够
    });

    // 键盘：Ctrl/⌘ + 单击
    document.addEventListener('click', function (e) {
      if (!(e.ctrlKey || e.metaKey)) return;
      var sel = global.getSelection ? global.getSelection() : null;
      var w = sel && !sel.isCollapsed ? normalize(sel.toString()) : '';
      if (w) { e.preventDefault(); show(w); }
    });
  }

  global.Lookup = {
    bind: bind,
    show: show,
    normalize: normalize
  };

  // 页面加载后自动绑定
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }
})(window);
