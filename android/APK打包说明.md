# 英语学习系统 · Android APK 打包说明

## 这是什么

把整个英语学习系统打包成一个可安装的 Android 应用（`.apk`）。
装到手机后有独立图标，点开即用，**完全离线可用**（5449 词库、全部内容随包分发）。

## 一键打包

在 Git Bash / WSL 中执行：

```bash
bash "E:/ai/英语学习网站/android/build-apk.sh"
```

脚本会依次完成：准备 Gradle → 同步网页资源 → 生成签名 → 构建 APK。

产物路径：

```
android/app/build/outputs/apk/release/app-release.apk
```

## 装到手机

**方式一：数据线（推荐）**

```bash
adb install -r "E:/ai/英语学习网站/android/app/build/outputs/apk/release/app-release.apk"
```

**方式二：直接传文件**

1. 把 `app-release.apk` 传到手机（微信、数据线、网盘均可）
2. 在手机上点击这个文件
3. 系统会提示「未知来源」，按提示允许即可

**最低系统版本**：Android 7.0（API 24）

## 离线与云端

APK 采用**本地优先**设计：

- 学习记录存在手机本地，**断网完全可用**
- 云端登录是**可选**的，由你自己决定要不要用
  - 不用登录：所有功能正常，只是数据不跨设备
  - 想同步：进「账号同步」用邮箱登录，进度会在多设备间同步

云端功能依赖联网。如果登录失败或网络不通，应用会自动退回纯本地模式，
**不会阻塞任何学习功能**。

## 技术选型说明

| 项目 | 选择 | 原因 |
|---|---|---|
| 外壳 | 单 Activity + WebView | 复用已验证的网页代码，无需重写 UI |
| 资源加载 | `WebViewAssetLoader` | 以 `https://appassets.androidplatform.net/` 加载，而非 `file://`。这样 localStorage、Service Worker、fetch 都能正常工作，Origin 稳定 |
| Service Worker | 包内已移除 | 资源随包分发，不需要缓存层。留着反而会缓存旧版本导致更新不及时 |
| 权限 | 仅联网 | 不申请存储与麦克风。学习数据只存应用私有目录 |
| 签名 | 调试签名 | 保证 APK 能直接安装。**上架应用商店需换成正式签名** |
| 体积 | 约 12–18 MB | 主要来自 5449 词库与全部学习内容 |

## 常见问题

**Q：装上后打开是白屏？**
A：多半是资源没同步。重新执行一次 `build-apk.sh`，确认 `android/app/src/main/assets/web/` 下有 `index.html`。

**Q：更新版本后手机上还是旧内容？**
A：APK 内已移除 Service Worker，正常情况下安装新版即生效。若仍显示旧内容，先卸载旧版再装。

**Q：发音没声音？**
A：APK 调用系统 TTS（和浏览器发音是同一套）。需在手机「设置 → 系统 → 语言和输入法 → 文字转语音」中安装英语语音包。

**Q：想要应用商店版本？**
A：需要改成正式签名（`keytool -genkeypair` 生成自己的密钥并妥善保管），并把 targetSdk、隐私政策等按商店要求补齐。当前版本仅供自行安装使用。

## 目录结构

```
android/
├── build.gradle              顶层构建脚本
├── gradle.properties         构建参数
├── local.properties          SDK 路径（自动生成，勿提交）
├── build-apk.sh              一键打包脚本
└── app/
    ├── build.gradle          模块构建脚本
    └── src/main/
        ├── AndroidManifest.xml
        ├── java/com/englearn/app/MainActivity.java   原生外壳
        ├── res/               图标与主题
        └── assets/web/        网页资源（构建时自动同步）
```