# GitHub Pages 部署说明

本项目是纯静态站点（HTML + CSS + JS），无后端、无构建步骤。

## 一键启用 Pages

1. 打开仓库 **Settings**
2. 左侧菜单选 **Pages**
3. **Build and deployment** → Source 选 **Deploy from a branch**
4. Branch 选 **main**，目录选 **/ (root)**
5. 点 **Save**

等待 1-2 分钟后访问：

```
https://iiiii-com.github.io/english-learning-system/
```

## 本地预览

```bash
# 任选其一
python -m http.server 8000
npx serve .
```

然后打开 http://localhost:8000

> 直接双击 index.html 也能用，但浏览器会限制 file:// 下的
> 动态脚本加载（高考词库 L5/L6 懒加载会失效），
> 所以建议用本地服务器。

## 目录说明

```
index.html              入口
assets/css/style.css    设计系统
assets/js/
  store.js              状态管理 + localStorage + SM-2 算法
  progress.js           自动进度记忆系统
  ui.js                 统一 UI 组件
  charts.js             SVG 图表引擎
  app.js                路由 + 首页
  view-*.js             各功能视图
  data/
    content-index.js    统一内容索引（新增内容只改这里）
    words.js            生活词库 L1-L4
    words-gaokao-meta.js 高考词库元信息（1KB，首屏加载）
    words-gaokao-l5.js  L5 词库（413KB，按需加载）
    words-gaokao-l6.js  L6 词库（415KB，按需加载）
    content-*.js        各模块内容
```

## 性能设计

高考词库（L5/L6）采用**按等级懒加载**：

- 首屏只加载 1KB 元信息，词库总计从 1959KB 降到 1136KB
- 进入 L5/L6 学习时才动态注入对应词库
- 打开速度从 6.4s 降到 1.8s

## 内容来源

- 生活实用词库：项目自有
- 高考词库：[ECDICT](https://github.com/skywind3000/ECDICT) CC-BY-SA 4.0
- 音标：ECDICT phonetic 字段 + 手工修正（美式 IPA）
