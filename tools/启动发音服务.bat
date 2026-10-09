@echo off
chcp 65001 >nul
title Lumen 在线发音服务
cd /d "%~dp0"

echo.
echo  ============================================================
echo   Lumen 在线发音服务
echo  ============================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo   [错误] 没有找到 Node.js。
  echo   请先安装 Node.js 18或更高版本：https://nodejs.org/
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\msedge-tts" (
  echo   首次运行，正在安装依赖...
  echo.
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo.
    echo   [错误] 依赖安装失败，请检查网络后重试。
    pause
    exit /b 1
  )
  echo.
)

echo   服务地址：http://127.0.0.1:8788
echo   按 Ctrl+C 停止服务
echo.
echo   提示：网站会自动连接本服务。如果网站不是从本机打开的，
echo   请在网站的「发音设置」页把服务地址改成实际地址。
echo.

node tts-server.js

echo.
echo   服务已停止。
pause