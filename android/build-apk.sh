#!/usr/bin/env bash
# ============================================================
# 一键构建 Android APK
#
# 关键点：项目路径含中文（E:/ai/英语学习网站），Gradle/Android 构建工具
# 在 Windows 下会因编码问题失败（文件名、目录名或卷标语法不正确）。
# 因此构建时把工程同步到纯英文临时目录，构建完成再把 APK 拷回来。
#
#   用法：bash "E:/ai/英语学习网站/android/build-apk.sh"
#   产物：E:/ai/英语学习网站/android/app-release.apk
# ============================================================
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJ="$(dirname "$HERE")"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-$LOCALAPPDATA/Android/Sdk}}"
JAVA_HOME_DIR="${JAVA_HOME:-C:/Program Files/Microsoft/jdk-17.0.20.8-hotspot}"
GRADLE_BIN="${GRADLE_BIN:-E:/ai/_wn/gradle-8.7/bin/gradle}"
BUILD_DIR="E:/ai/_apkbuild"
OUT_APK="$HERE/app-release.apk"

echo "== 1/5 检查工具链 =="
if [ ! -x "$GRADLE_BIN" ] && [ ! -f "$GRADLE_BIN" ]; then
  echo "找不到 Gradle：$GRADLE_BIN"
  echo "请先下载 Gradle 8.7 并解压到 E:/ai/_wn/gradle-8.7"
  exit 1
fi
if [ ! -d "$SDK" ]; then
  echo "找不到 Android SDK：$SDK"; exit 1
fi
echo "   Gradle: OK"
echo "   SDK:OK"
echo "   JDK:     OK"

echo "== 2/5 同步工程到英文临时目录 =="
# 注意：不要 rm -rf 整个临时目录。
# 目录里累积了 Gradle 缓存与依赖，删掉会导致每次重新下载（首次要 5 分钟）。
# 改为「就地覆盖」：直接复制文件，旧的多余文件由 Gradle 自行处理。
mkdir -p "$BUILD_DIR"

# 复制 Gradle 工程文件与源码
for item in settings.gradle build.gradle gradle.properties; do
  if [ -f "$HERE/$item" ]; then
    cp -f "$HERE/$item" "$BUILD_DIR/"
  fi
done
# app 目录用 rsync 语义：覆盖同名文件但不删除目录本身
cp -r "$HERE/app" "$BUILD_DIR/"
# 清掉上一次的构建产物（这是 Gradle 自己生成的，可安全重建）
if [ -d "$BUILD_DIR/app/build" ]; then
  find "$BUILD_DIR/app/build" -mindepth 1 -delete 2>/dev/null || true
fi

# 同步网页资源到 assets
WEB_DEST="$BUILD_DIR/app/src/main/assets/web"
mkdir -p "$WEB_DEST"
# 先清掉旧的 web 资源，保证不会残留上版本的 js
if [ -d "$WEB_DEST" ]; then
  find "$WEB_DEST" -mindepth 1 -delete 2>/dev/null || true
fi
for item in index.html manifest.webmanifest assets; do
  if [ -e "$PROJ/$item" ]; then
    cp -r "$PROJ/$item" "$WEB_DEST/"
  fi
done
# 离线音频包放在 assets/audio/ 下（已被上面覆盖），
# 这里额外校验一次：漏掉它会让 App 退回「必须联网才能发音」的老问题
if [ ! -f "$WEB_DEST/assets/audio/manifest.js" ]; then
  echo "   错误：离线音频包清单未同步，终止构建"
  echo "   请先执行：node tools/pregen-audio.js"
  exit 1
fi
# APK 内不需要 Service Worker：资源已随包分发，
# 留着反而会缓存旧版本资源导致更新不及时
rm -f "$WEB_DEST/sw.js"

# 校验：发音修复必须打进包里，否则 App 里还是旧的坏版本
for must in assets/js/tts.js assets/js/view-tts.js; do
  if [ ! -f "$WEB_DEST/$must" ]; then
    echo "   错误：$must 没有同步进 assets，终止构建"; exit 1
  fi
done
echo "   已同步发音模块：tts.js / view-tts.js"

# 原生 TTS 桥接是 App 内发声的唯一通路，必须同步成功
if [ ! -f "$BUILD_DIR/app/src/main/java/com/englearn/app/NativeTTS.java" ]; then
  echo "   错误：NativeTTS.java 未同步，App 内将无法发音，终止构建"; exit 1
fi
echo "   已同步原生语音桥接：NativeTTS.java"

echo "sdk.dir=$(cygpath -m "$SDK")" > "$BUILD_DIR/local.properties"
echo "   资源大小：$(du -sh "$WEB_DEST" | cut -f1)"

echo "== 3/5 准备签名 =="
KEYSTORE="$BUILD_DIR/debug.keystore"
# keytool 必须用 JDK 的完整路径：系统 PATH 里没有 keytool，
# 直接调 keytool 会静默失败并让 set -e 提前退出脚本。
KEYTOOL="$JAVA_HOME_DIR/bin/keytool.exe"
if [ ! -f "$KEYTOOL" ]; then
  echo "   错误：找不到 keytool（$KEYTOOL）"; exit 1
fi
# 已有签名就复用，保证能覆盖安装升级（签名变了装不上）
if [ -f "$KEYSTORE" ]; then
  echo "   复用已有调试签名"
else
  "$KEYTOOL" -genkeypair -v -keystore "$KEYSTORE" \
    -storepass android -keypass android -alias androiddebugkey \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=English Learn Debug, OU=Dev, O=EngLearn, L=NA, ST=NA, C=CN" \
    > "$BUILD_DIR/keytool.log" 2>&1 || {
      echo "   错误：生成签名失败，日志见 $BUILD_DIR/keytool.log"; exit 1; }
  echo "   已生成调试签名"
fi

echo "== 4/5 构建（首次需下载依赖，约 2-5 分钟）==="
cd "$BUILD_DIR"
JAVA_HOME="$JAVA_HOME_DIR" "$GRADLE_BIN" assembleRelease \
  --no-daemon --console=plain 2>&1 | tail -25
GRADLE_RC=${PIPESTATUS[0]}
if [ "$GRADLE_RC" != "0" ]; then
  echo "   Gradle 构建失败（退出码 $GRADLE_RC）"; exit 1
fi

echo "== 5/5 收集产物 =="
BUILT_APK="$BUILD_DIR/app/build/outputs/apk/release/app-release.apk"
if [ ! -f "$BUILT_APK" ]; then
  echo "构建失败，未找到 APK"; exit 1
fi
cp "$BUILT_APK" "$OUT_APK"
SIZE=$(du -h "$OUT_APK" | cut -f1)

echo
echo "=================================================="
echo " APK 构建成功"
echo " 文件：$OUT_APK  ($SIZE)"
echo "=================================================="
echo
echo "安装到手机："
echo "  1) 数据线：adb install -r \"$OUT_APK\""
echo "  2) 或把 apk 传到手机点击安装（需允许「未知来源」）"
echo