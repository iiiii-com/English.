# Lumen · 交付文档

面向零基础成年学习者的英语学习闭环系统。纯前端，无需构建。

---

## 线上地址

**https://english-learning-system-36589.app.workbuddy.host/**

静态部署，断网也能正常使用。

---

## 一、快速开始

### 发音需要先启动一个服务（重要）

朗读功能走本项目的在线发音服务，**首次使用必须先启动它**，否则点任何发音按钮都没有声音。

**Windows**：双击 `tools/启动发音服务.bat`
**命令行**：在 `tools/` 目录下执行 `node tools/tts-server.js`

启动后打开网站即可，无需再做任何配置。服务地址 `http://127.0.0.1:8788`，网站会自动连接。

> 没有启动服务时，网站总览页顶部会出现一条提示，直接告诉你怎么启动。
> 若设备本身装了英语语音包（本机语音），不启动服务也能发音，只是音色选择较少、整句支持不稳。

### 打开网站

```
双击 index.html
```

无构建、无 npm 依赖（仅发音服务需要）。数据存于浏览器 localStorage。

**推荐环境**：Chrome / Edge 最新版（支持 Web Speech API，跟读评分可用）。
其他浏览器可正常使用全部功能，唯「跟读评分」降级为「听音—对照—自查」模式。

**部署**：把整个目录传到任意静态托管（GitHub Pages / Vercel / 对象存储 / nginx 均可）。
若要让线上版本也能发音，把 `tts-server.js` 部署到同一域名的 `/tts` 路径下即可，前端会自动发现它。

---


## 云服务（账号与跨设备同步）

应用已开通 WorkBuddy 云服务，学习数据可备份到云端并在多设备间同步。

### 线上地址

**https://english-learning-system-36589.app.workbuddy.host/**

### 数据表

| 表 | 用途 | 关键列 |
|---|---|---|
| `learner_state` | 主状态：SM-2 词卡、每日统计、徽章、设置 | `payload JSONB`, `device_label`, `updated_at` |
| `learner_progress` | 自动进度记忆：逐词掌握度、逐句发音、时间线、弱项| `payload JSONB`, `updated_at` |

两张表均为 `owner_id TEXT DEFAULT auth.uid()` + RLS 行级安全，
用户只能读写自己的数据（4 条策略/表：SELECT / INSERT / UPDATE / DELETE）。

### 数据流

```
本机 localStorage（权威，写入即生效）
     ↕ 自动同步（登录后启用，防抖 3s + 5 分钟兜底 + 联网恢复补传）
云端 PostgreSQL（跨设备持久化）
```

冲突以 `updated_at` 时间戳为准：较新的一方覆盖较旧的一方。

### 登录方式

邮箱验证码（注册 / 登录）。**不登录也完全可用**——数据存本机，
只是换设备不会自动同步。

### 手动操作

「账号同步」页提供：立即同步、导出本机 JSON、从 JSON 导入、删除云端数据、退出登录。

### 文件结构

| 文件 | 职责 |
|---|---|
| `assets/js/cloud.js` | SDK 初始化、认证、双向同步、自动同步调度 |
| `assets/js/view-account.js` | 登录/注册界面、同步状态、数据管理 |

SDK 以 CDN `<script>` 形式引入（项目为纯静态、无构建步骤）：

```html
<script src="https://cdn.jsdelivr.net/npm/@tencent-ai/workbuddy-cloud-sdk@dev/lib/index.global.js"></script>
```

---

## 二、目录结构

```
英语学习网站/
├── index.html                    入口（单页应用，hash 路由）
├── README.md                     本文件
└── assets/
    ├── css/style.css             设计系统（CSS 变量 + 三档响应式）
    └── js/
        ├── store.js              状态 + localStorage + SM-2 算法
        ├── progress.js           ★ 自动进度记忆系统（细粒度记录）
        ├── ui.js                 统一 UI 组件（弹层/状态占位/反馈）
        ├── charts.js             零依赖 SVG 图表引擎
        ├── app.js                路由 + 首页看板 + 语音 + 评分算法
        ├── view-vocab.js         词汇视图
        ├── view-speak.js         口语视图
        ├── view-read.js          阅读视图
        ├── view-path.js          等级路径视图
        ├── view-psych.js         心理机制 + 数据模型视图
        ├── view-daily-comm.js    日常交流视图
        ├── view-phoneme.js       音标口型视图（舌位图）
        ├── view-english.js       ★ 英语学习资料（音标/词汇/连读/英美）
        ├── view-progress.js      ★ 学习记忆中心
        └── data/                 内容层（见下表）
            ├── content-index.js  ★ 统一内容索引（新增内容只改这一处）
            └── ...（其余 20 个内容文件）
```

### 加载顺序（重要）

`index.html` 中的 script 顺序不可随意调整：

1. `data/*.js` —— 数据层，必须最先（定义 `window.VOCAB_DATA` 等全局）。
   **`content-index.js` 放在数据层最后**，它依赖其他内容模块。
2. `store.js` —— 依赖数据层
3. `progress.js` —— 依赖 store
4. `ui.js` —— 组件层
5. `charts.js` —— 图形层
6. `app.js` —— 核心，**必须早于所有 `view-*.js`**（它创建 `window.Views` 注册表）
7. `view-*.js` —— 视图，各自向 `window.Views` 注册
8. 末尾的 IIFE 调用 `App.init()`

---

## 三、内容清单

| 文件 | 内容 | 规模 |
|---|---|---|
| `words.js` | 生活实用词库 L1-L4 | 1456 词 |
| `words-gaokao.js` | 高考词库 L5-L6（源自 ECDICT） | 3993 词 |
| `content-path.js` | 六级路径 + 10 条行为心理机制 | 6 级 |
| `content-vocab.js` | 核心词精讲 + 出题器 + SM-2 科学参数 | 16 词 |
| `content-speaking.js` | 场景对话（基础版） | 8 场景 |
| `content-daily-scene.js` | 生活场景对话（扩充） | 12 场景 |
| `content-scene-l4.js` | L4 高阶场景（学术/职场/谈判） | 6 场景 |
| `content-slang.js` | 俚语 + 习语 + 语域体系 + 避坑指南 | 111 条 |
| `content-daily-comm.js` ~ `3.js` | 日常沟通表达（按功能分类） | 1500 条 / 52 类 |
| `content-reading.js` | 分级短文 | 10 篇 |
| `content-reading2.js` | 分级短文（日常主题扩充） | 12 篇 |
| `content-phonemes.js` | 国际音标库（舌位/口型/易错点） | 20 元音 + 24 辅音 |
| `content-phoneme-detail.js` | 音素独立示范 + 音组合 + 英美对照 | 44 示范 / 18 组合 / 39 组对照 |
| `content-topic-words.js` | 主题分类高频词汇 | 12 主题 464 词 |
| `content-liaison.js` | 连读规则体系 + 例句 | 5 类规则 + 91 句 |
| `content-liaison2.js` | 连读例句（按场景） | 128 句 |
| `content-index.js` | **统一内容索引** | 14 个 API |

**合计**：5449 词条 · 2000 条日常表达 / 87 类 · 36 个场景 / 297 句 ·
22 篇短文 / 155 道理解题 · 219 句连读例句 · 44 音素独立示范 · 464 主题词 · 43 核心词精讲

---

## 四、统一内容索引（ContentIndex）

所有内容通过 `window.ContentIndex` 访问，**新增数据文件只需在索引里注册一行**：

```js
SOURCES: {
  dailyComm: [
    { key: 'DailyComm',  label: '基础功能表达' },
    { key: 'DailyComm2', label: '场景功能表达' },
    // ... 新增只需在这里加一行
  ],
  scenes: [...], liaison: [...], reading: [...]
}
```

### API

| 方法 | 返回 |
|---|---|
| `dailyComm()` | 全部日常交流表达（归一化为 `{en, cn, r, cat, catKey, src}`） |
| `dailyCommCats()` | 分类列表 `{id, key, name, src, module}` |
| `dailyCommByCat(catId)` | 某分类的表达；入参兼容裸 key 与全局 id |
| `scenes()` / `scenesByLevel(lv)` | 场景对话（自动跨源去重） |
| `liaisonExamples()` / `liaisonRules()` / `liaisonDrills()` | 连读例句 / 规则 / 专项 |
| `readings()` | 分级短文（自动含第二批） |
| `allWords()` / `topicWords()` | 词库 / 主题词 |
| `phonemes()` / `phonemeDemo(sym)` | 音素列表 / 单个音素示范 |
| `stats()` | 全站内容统计（视图「数据模型」实时调用） |

**解决的问题**：此前各视图自行拼数据源（`view-speak.js` 列 4 个场景源、
`view-daily-comm.js` 列 5 个表达源），新增内容必须同时改多个视图，**极易遗漏**。
现在收敛为单一注册点。

---

## 五、自动进度记忆系统

### 设计原则

- **零手动操作**：所有记录在学习行为发生时自动写入
- **有界增长**：环形缓冲 + 定期压缩，防止 localStorage 无限膨胀
- **可解释**：每条诊断都能溯源到具体记录，不做黑箱判断

### 记录粒度（比每日统计更细）

| 字段 | 内容 |
|---|---|
| `words` | 每词掌握度：首次/最近日期、SM-2 间隔、作答历史（保留 12 次）、累计尝试与正确数、平均用时 |
| `speaking` | 逐句发音：`sceneId:lineIdx` → 最佳得分、尝试次数、历史（10 次）、ASR 置信度 |
| `expressions` | 日常表达暴露次数：`catKey:idx` → 看过几次 |
| `liaison` | 连读例句跟读记录 |
| `reading` | 阅读轨迹：逐篇的逐题对错、最佳正确率、答题用时 |
| `timeline` | 学习时间线：每次学习的时刻、时段、模块、时长（上限 200 条） |
| `weak` | 弱项累积：易错音素次数、薄弱题型次数、模块投入时长 |

存储键：`localStorage['eng_atlas_progress_v1']`

### 记忆分层判定

| 层 | 判据 | 含义 |
|---|---|---|
| 未学 | 无记录 | — |
| 初识 | 有作答但 ivl < 2 | 见过 |
| 熟悉 | ivl ≥ 2 | 短期记忆 |
| 掌握 | ivl ≥ 7 | 中期记忆 |
| **长期记忆** | **ivl ≥ 21** | **真正不再需要主动复习** |

依据艾宾浩斯遗忘曲线 + Karpicke & Roediger (2008) 提取练习效应。

### 自动诊断

`Progress.diagnose()` 输出可溯源建议：

- **易错音素集中** — 统计 `weak.phonemes`，≥2 次的排序输出
- **阅读题型薄弱** — 统计 `weak.questionTypes`
- **词汇覆盖面窄** — 已学占比 < 15% 时提示调整每日新词量
- **学习节奏中断** — 最近 3 天有 ≥2 天空白
- **高效时段** — 从 `timeline` 聚合出高峰时段与高学习星期（正向反馈）
- **模块投入不均衡** — 某模块占比 < 12% 时提醒短板

### 有界增长

```js
MAX_WORD_HISTORY = 12    // 每词保留最近 12 次作答
MAX_SPEAK_RECORDS = 400  // 全局跟读记录上限
MAX_READ_RECORDS = 300
MAX_TIMELINE = 200
```

`compress()` **只删明细，不动汇总**——累计尝试次数、正确率等永久保留。
超过 180 天未练的词自动清除 history 但保留汇总。

---

## 六、数据模型（store.js）

### 存储键

`localStorage['eng_atlas_v1']`，损坏时备份到 `eng_atlas_v1_corrupt`。

### 核心结构（Schema v2）

```js
{
  version: 2,
  createdAt: '2026-10-06',      // 首次使用日期
  lastOpenDate: '2026-10-06',   // 上次打开（用于跨天重置与回归检测）

  profile: { name, dailyMinutes, startedLevel },

  // 词卡：wordId -> 卡片状态
  words: {
    "1": {
      ef: 2.5,          // 难度因子 1.3–3.2，越大下次间隔越长
      ivl: 8,           // 当前间隔天数
      reps: 3,          // 连续答对次数
      lapses: 0,        // 遗忘次数
      due: '2026-10-14',// 下次复习日（本地时区 YYYY-MM-DD）
      last: '2026-10-06',
      seen: 3, right: 3
    }
  },

  // 每日统计
  daily: {
    "2026-10-06": { minutes, newWords, reviews, right, total, readMin, speakMin }
  },

  speaking: [{ scene, lv, score, minutes, date }],   // 上限 500 条
  reading:  { 'r-l1-01': { best: 0.8, done: 2 } },
  marks:    { 'ubiquitous': { date, article } },      // 阅读中标记的生词
  badges:   { 'first_step': { at: ISO8601 } },
  commitment: { goal, start, log: [] },
  settings: { ttsRate, ttsVoice, showPhonetic, dailyNew, dailyReviewCap },
  unlocked: { L1: true, L2: false, ... },
  microDone: { 'review': true }                        // 今日任务打卡
}
```

### 关键设计约定

**1. 日期一律用本地时区**

```js
'2026-10-06'   // ✅ 正确
'2026-10-06T00:00:00Z'.slice(0,10)   // ❌ 禁止：东八区凌晨 0-8 点会算成前一天
```

历史版本曾用 `toISOString().slice(0,10)`，导致连续打卡与复习到期日整体偏移一天。
现统一由 `Store.today()` / `Store.daysAgoISO()` / `Store.parseDate()` 生成与解析。

**2. 词库 ID 段隔离**

- 原词库：1 – 99999
- 高考词库：100000 起

两库可安全合并（`Store.vocabAll()`），ID 不冲突。

**3. 「掌握」的定义**

间隔 ≥21 天且无遗忘记录（`ivl >= 21`），而非「看过」。
依据：Ebbinghaus 遗忘曲线 + Karpicke & Roediger (2008) 提取练习效应。

**4. 短语不标音标**

502 条短语（`mark down`、`check in` 等）不做音标标注——它们的"标准音标"是单词音标的机械拼接，无学习价值。
短语的发音要点（重音、连读）分散标注在场景对话的 `focus` 字段。

---

## 七、核心算法

### SM-2 间隔重复

纯函数 `Store.reviewSM2(card, q)`，可独立测试。

```
q < 3（遗忘）：
  lapses += 1;  reps = 0;  ivl = 1
  ef = max(1.3, ef - 0.20)

q >= 3（记住）：
  reps += 1
  reps == 1 → ivl = 1
  reps == 2 → ivl = 3
  否则      → ivl = min(180, round(ivl × ef))
  ef = clamp(ef + 0.1 - (5-q)(0.08 + (5-q)×0.02), 1.3, 3.2)
```

实测序列（连续 4 次满分）：`1 → 3 → 8 → 20 → 50` 天。

**升级点**：函数已隔离为单一出口，若有 1000+ 复习历史可替换为 FSRS（17+ 参数，约 +5% 复习量节省），不影响其他模块。

### 跟读评分

```
1. 归一化：去标点、小写、按空格分词
2. 词级匹配：最长公共子序列（LCS）动态规划
3. 词准确率 = 匹配词数 ÷ 目标词数
4. 语速得分：与理想 140 WPM 的偏差，容差 ±45
5. 置信度：ASR 返回的 confidence，多候选取最高
综合 = 词准确率×60% + 语速×15% + 置信度×25%
```

容错：若漏读词全为功能词（a/the/to/of…），每词只扣 3 分。

**局限**：浏览器 ASR 受噪音与口音影响明显，此评分只适合观察趋势，不作绝对水平判定。

---

## 八、异常与边界处理

| 场景 | 处理 |
|---|---|
| localStorage 不可用（隐私模式） | 进入内存态运行，顶部显示降级横幅，提示导出备份 |
| 存储配额溢出 | 自动裁剪历史统计（保留 120 天）后重试；仍失败则降级并提示 |
| 数据 JSON 损坏 | 备份到 `eng_atlas_v1_corrupt`，重置为默认状态，不静默丢失 |
| 字段级脏数据 | 逐字段 `clampNum` 夹紧 + 日期校验，**不整条丢弃**（避免连带丢失学习进度） |
| 导入非法文件 | 校验是否含本应用特有字段，拒绝并提示；导入前自动备份当前数据 |
| 统计函数遇空数据 | 全部返回安全默认值（0 / 空数组），不抛异常 |
| `addMinutes(NaN/-100/Infinity)` | 拦截，单次上限 240 分钟 |
| 视图渲染抛异常 | 全局错误边界捕获，显示错误态 + 重试按钮，不白屏 |
| 未捕获 Promise 拒绝 | 全局 `unhandledrejection` 监听 |
| 多标签页并发 | `storage` 事件监听其他标签写入并重载；写入串行化防交叉 |
| 页面关闭前防抖未落盘 | `beforeunload` / `pagehide` 强制 flush |
| 跨天 | 清空今日任务勾选，检测「中断后回归」写入徽章标记 |

---

## 九、验证方式

### 自动化测试

```bash
npm install playwright-core
node _t_release.js     # 21 项：核心逻辑 + 异常处理 + 响应式 + 可访问性
node _t_en.js          # 14 项：内容模块（音标/词汇/连读/英美对照）
node _t_prog.js        # 19 项：统一索引 + 进度记忆系统
node _audit.js         # 数据层审计（结构完整性、字段缺失、答案越界）
```

**回归覆盖（共 54 项，已全部通过）**：

- 冷启动（无 localStorage）/ 日期为本地时区
- 11 个视图渲染 + 无错误态
- SM-2 间隔序列 / 遗忘重置 / 边界夹紧 / 空输入
- 脏数据修复（8 类）/ 非法导入拒绝（5 种）/ 空数据不崩
- 非法时长输入拦截 / 复习端到端 + 刷新持久化
- 存储降级横幅 / 空状态行动按钮 / 确认弹层 Promise 化
- 错误边界（注入异常 → 错误态 → 恢复）
- 响应式 390 / 768 / 1440 三档零溢出
- 导航可访问性 / Esc 关闭弹层
- 统一索引 API 完整性 / 去重正确性 / 双入参兼容
- 词汇记录写入 / 记忆分层判定 / 发音连读表达记录 / 阅读轨迹 / 持久化
- 时间线作息画像 / 热力图 / 诊断可溯源 / 压缩不丢汇总
- 内容模块：音标示范 / 音组合 / 主题词 / 连读规则 / 例句筛选 / 英美对照
- 移动端 390 / 768px 零溢出

### 手动验收清单

1. 新用户打开 → 首页显示 L1 环形进度 0%，任务列表 4 项
2. 词汇 → 今日复习 → 完成一轮 → 进度与正确率更新
3. 刷新 → 进度与记忆画像均保留
4. 语音 → 场景对话 → 点 🎤 跟读 → 评分与漏读词正确
5. 阅读 → 打开短文 → 点词查释义 → 答题 → 正确率记录
6. 日常交流 → 展开某分类 → 该分类表达被记入进度记忆
7. 音标口型 → 点元音 → 弹层含口型/舌位/要领/易错点
8. 英语资料 → 四个子页（音标/词汇/连读/英美）均可翻页与朗读
9. 学习记忆 → 查看画像、诊断、作息、热力图；导出报告
10. 数据模型 → 查看内容总览（实时统计）与记忆数据结构
11. 断网打开 → 全部功能正常（无任何外部请求）
12. 移动端 390px → 11 个视图无横向滚动

---

## 十、已知限制

| 限制 | 影响 | 说明 |
|---|---|---|
| 跟读评分依赖浏览器 ASR | Chrome/Edge 效果最好，Safari 降级 | 噪音与口音会影响结果 |
| 数据仅存本机 | 换设备/清缓存会丢 | 已提供 JSON 导出/导入 |
| 多标签页并发 | 后写入的会覆盖前者 | 已加 `storage` 监听自动重载，但同时编辑仍可能冲突 |
| 无服务端 | 无法多端同步、无账号体系 | 纯本地应用的固有边界 |
| 词库 5449 词 | 覆盖日常+高考，未含专业术语 | 超出范围的词需要扩充 |
| 短语无音标 | 502 条短语 | 有意为之，见「数据模型」第 4 条 |

---

## 十一、内容来源与版权

- **生活实用词库**：项目自有（`英语学习计划/数据/词汇表_种子词_*.tsv`）
- **高考词库**：ECDICT（github.com/skywind3000/ECDICT），CC-BY-SA 4.0
  仅取 `gk/cet4/cet6/ky/toefl/gre` 标签词，附中文释义与音标
- **音标数据**：ECDICT phonetic 字段 + 手工修正表（美式 IPA，参考 Merriam-Webster / Cambridge）
- **音标库**：`/iː/`、`/θ/` 等 IPA 符号与术语参考《英语语音学》，元音舌位坐标系为通用教学近似
- **行为心理机制**：B. J. Fogg《福格行为模型》、Deci & Ryan 自我决定论、
  Schultz 多巴胺预测误差理论、Kahneman & Tversky 前景理论、Lally 等习惯形成研究
- **短文与对话**：原创编写

---

## 十二、浏览器支持

| 浏览器 | 最低版本 | 备注 |
|---|---|---|
| Chrome / Edge | 90+ | 全部功能可用 |
| Safari | 14+ | 跟读评分降级；`toISOString` 相关行为一致 |
| Firefox | 90+ | 跟读评分不可用（无 SpeechRecognition） |
| 移动端浏览器 | 主流均可 | 已适配 390px |

依赖的浏览器 API：`localStorage`、SVG、`Blob`/`URL.createObjectURL`、
`SpeechSynthesis`（可选）、`SpeechRecognition`（可选）、CSS 变量、`Intl`。
