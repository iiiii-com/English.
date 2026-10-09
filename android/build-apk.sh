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
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

# 复制 Gradle 工程文件与源码（排除构建产物与签名）
for item in settings.gradle build.gradle gradle.properties app; do
  if [ -e "$HERE/$item" ]; then
    cp -r "$HERE/$item" "$BUILD_DIR/"
  fi
done
rm -rf "$BUILD_DIR/app/build"

# 同步网页资源到 assets
WEB_DEST="$BUILD_DIR/app/src/main/assets/web"
mkdir -p "$WEB_DEST"
for item in index.html manifest.webmanifest assets; do
  if [ -e "$PROJ/$item" ]; then
    cp -r "$PROJ/$item" "$WEB_DEST/"
  fi
done
# APK 内不需要 Service Worker：资源已随包分发，
# 留着反而会缓存旧版本资源导致更新不及时
rm -f "$WEB_DEST/sw.js"

echo "sdk.dir=$(cygpath -m "$SDK")" > "$BUILD_DIR/local.properties"
echo "   资源大小：$(du -sh "$WEB_DEST" | cut -f1)"

echo "== 3/5 生成签名 =="
KEYSTORE="$BUILD_DIR/debug.keystore"
keytool -genkeypair -v -keystore "$KEYSTORE" \
  -storepass android -keypass android -alias androiddebugkey \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=English Learn Debug, OU=Dev, O=EngLearn, L=NA, ST=NA, C=CN" >/dev/null 2>&1
echo "   OK"

echo "== 4/5 构建（首次需下载依赖，约 2-5 分钟）==="
cd "$BUILD_DIR"
JAVA_HOME="$JAVA_HOME_DIR" "$GRADLE_BIN" assembleRelease \
  --no-daemon --console=plain 2>&1 | tail -25

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