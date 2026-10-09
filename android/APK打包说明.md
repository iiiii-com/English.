# Lumen · Android APK 打包说明

## 这是什么

把整个英语学习系统打包成一个可安装的 Android 应用（`.apk`）。
装到手机后有独立图标，点开即用，**完全离线可用**（全部词库与学习内容随包分发）。

App 内的发音走**系统原生 TTS 引擎**，不是网页接口——Android WebView 根本不实现 Web Speech API，
网页里看到的语音数恒为 0，这是正常现象。详见 `docs/双端语言功能设计说明.md`。

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
| 网络安全 | `network_security_config.xml` | 默认禁止明文 HTTP；**仅对 `127.0.0.1`/`localhost`/`10.0.2.2` 放开**，供本地发音代理访问。其余域名（含云同步）仍强制加密 |
| 混合内容 | `MIXED_CONTENT_COMPATIBILITY_MODE` | 严格模式会掐掉 https 页面加载 http 代理音频，表现为「点发音完全没反应且不报错」 |
| 签名 | 调试签名 | 保证 APK 能直接安装，且能覆盖安装升级。**上架应用商店需换成正式签名** |
| 体积 | 约 17 MB | 网页资源 2.8 MB + 离线音频包 11.7 MB（616 个 mp3） |

> App 内的发音优先级：**离线音频包 → 系统原生 TTS → 在线代理 → 云端**。
>
> 离线音频包是唯一在「手机连不上电脑上服务」时依然可用的路径，因此放在最前面。系统原生 TTS 次之——它离线可用，但手机上常常没装英语语音包。
>
> 代价是体积：616 个 L1+L2 高频词预生成为 mp3 占 11.7 MB。换来的是这批词在任何网络条件下都能发音。整句与例句不在包内，仍需在线服务。

## 构建脚本的强制校验

`build-apk.sh` 不会盲目打包，缺件时直接终止：

- `assets/js/tts.js`、`assets/js/view-tts.js` 未同步 → 终止（否则 App 里是旧的发音代码）
- `NativeTTS.java` 未同步 → 终止（否则 App 内无法发音）
- 每次构建前清空 `assets/web` 与 `app/build`，避免残留上版本资源

## 常见问题

**Q：装上后打开是白屏？**
A：多半是资源没同步。重新执行一次 `build-apk.sh`，确认 `android/app/src/main/assets/web/` 下有 `index.html`。

**Q：更新版本后手机上还是旧内容？**
A：APK 内已移除 Service Worker，正常情况下安装新版即生效。若仍显示旧内容，先卸载旧版再装。

**Q：发音没声音？**
A：App 走系统 TTS。需在手机「设置 → 系统 → 语言和输入法 → 文字转语音输出」中安装英语语音包。
若已装仍无声，进 App 内「发音设置」页查看状态卡——它会明确区分「原生引擎未就绪」与「系统缺英语语音包」。

**Q：想验证包内资源对不对？**
```bash
node "E:/ai/英语学习网站/test/verify-apk-content.js"   # 32 项：发音桥接、词库、WebView 配置
```

**Q：项目路径含中文会不会构建失败？**
A：会。Gradle 在 Windows 下遇到中文路径会报「文件名、目录名或卷标语法不正确」。
脚本的解法是把工程同步到纯英文临时目录 `E:/ai/_apkbuild` 再构建，产物再拷回来。

**Q：想要应用商店版本？**
A：需要改成正式签名（`keytool -genkeypair` 生成自己的密钥并妥善保管），并把 targetSdk、隐私政策等按商店要求补齐。当前版本仅供自行安装使用。

## 目录结构

```
android/
├── build.gradle              顶层构建脚本
├── gradle.properties         构建参数
├── local.properties          SDK 路径（自动生成，勿提交）
├── build-apk.sh              一键打包脚本
├── APK打包说明.md             本文件
└── app/
    ├── build.gradle          模块构建脚本
    └── src/main/
        ├── AndroidManifest.xml
        ├── java/com/englearn/app/
        │   ├── MainActivity.java     原生外壳（WebView 配置 + 原生桥接注册）
        │   └── NativeTTS.java        系统 TTS 引擎封装（App 内发声的唯一通路）
        ├── res/
        │   ├── values/strings.xml    应用名（Lumen）
        │   └── xml/network_security_config.xml   网络明文白名单
        └── assets/web/        网页资源（构建时自动同步，不入库）
```