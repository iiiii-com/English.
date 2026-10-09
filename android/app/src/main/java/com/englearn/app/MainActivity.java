package com.englearn.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;

/**
 * 英语学习系统 · 原生外壳
 *
 * 设计要点：
 * 1. 用 WebViewAssetLoader 把 assets 以 https://appassets.androidplatform.net/ 暴露，
 *    而不是 file:// —— 这样 Service Worker、localStorage、fetch 都能正常工作，
 *    且 Origin 稳定，不会因为页面来源不同而行为异常。
 * 2. 学习数据默认全部存在本机（localStorage），断网完全可用。
 * 3. 云同步是可选功能：用户在应用内自行决定是否登录，失败也不影响本地使用。
 */
public class MainActivity extends AppCompatActivity {

    private WebView web;
    private long lastBackAt = 0L;
    private NativeTTS nativeTTS;

    /** WebView 内承载网页的虚拟域名 */
    private static final String APP_ORIGIN = "https://appassets.androidplatform.net";
    private static final String START_URL = APP_ORIGIN + "/assets/web/index.html";

    /** 供 NativeTTS 回调网页时拿到 WebView */
    public WebView getWebView() {
        return web;
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        web = new WebView(this);
        setContentView(web);

        // ---- 资源配置 ----
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);           // localStorage：学习记录靠它
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);             // 不需要真实文件系统权限
        s.setAllowContentAccess(false);
        s.setLoadWithOverviewMode(true);
        s.setUseWideViewPort(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setMediaPlaybackRequiresUserGesture(false); // 允许发音自动播放
        s.setCacheMode(WebSettings.LOAD_DEFAULT);

        // 混合内容：云服务与在线发音代理都可能是 https，默认保持严格模式。
        // 但保留 COMPATIBILITY_MODE 作为兜底——网站以 https 提供时，
        // 严格模式会把指向 http 代理的音频请求直接掐掉，表现为「发音按钮无反应」，
        // 而这种失败没有任何报错，只能靠放宽这一档来避免。
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            s.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        }

        // 让网页里的语音合成走系统 TTS
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            web.setWebContentsDebuggingEnabled(false);
        }

        // ---- 资源加载器：把 assets 映射到虚拟域名 ----
        final WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                // 应用内页面正常加载；站外链接交给系统浏览器
                if (uri.toString().startsWith(APP_ORIGIN)) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "无法打开链接", Toast.LENGTH_SHORT).show();
                }
                return true;
            }
        });

        if (savedInstanceState == null) {
            // 注入 App 标识：网页侧据此判断「运行在原生外壳内」，
            // 从而关闭只在浏览器里需要的逻辑（如 Service Worker 注册、安装引导）
            injectNativeFlag();
            web.loadUrl(START_URL);
        } else {
            web.restoreState(savedInstanceState);
        }

        // ---- 返回键：优先在应用内后退，根页面再按两次退出 ----
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (web.canGoBack()) {
                    web.goBack();
                    return;
                }
                long now = System.currentTimeMillis();
                if (now - lastBackAt < 2000) {
                    finish();
                } else {
                    lastBackAt = now;
                    Toast.makeText(MainActivity.this, "再按一次退出", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    /**
     * 网页加载前设置全局标识。
     *
     * 注入两样东西：
     *   AndroidBridge —— 用于识别「运行在原生外壳内」
     *   AndroidTTS   —— 原生 TextToSpeech 桥接。
     *     必须注入，因为 Android WebView 不实现 Web Speech API，
     *     speechSynthesis 对象存在但 getVoices() 恒空、speak() 静默失败。
     */
    private void injectNativeFlag() {
        web.getSettings().setUserAgentString(
                web.getSettings().getUserAgentString() + " EngLearnAndroid/1.0");

        web.addJavascriptInterface(new Object() {
            @android.webkit.JavascriptInterface
            public String getPlatform() {
                return "android";
            }
        }, "AndroidBridge");

        nativeTTS = new NativeTTS(this);
        web.addJavascriptInterface(nativeTTS, "AndroidTTS");
        nativeTTS.init();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    protected void onDestroy() {
        if (nativeTTS != null) {
            nativeTTS.destroy();
        }
        if (web != null) {
            web.destroy();
        }
        super.onDestroy();
    }
}