package com.englearn.app;

import android.content.Context;
import android.os.Build;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;

import java.util.HashMap;
import java.util.Locale;

/**
 * 英语学习系统 · 原生语音引擎桥接
 *
 * <h3>为什么必须有这个类</h3>
 * <p>Android 的 WebView <b>不实现 Web Speech API</b>：
 * <ul>
 *   <li>{@code window.speechSynthesis} 对象存在，但 {@code getVoices()} 恒返回空数组；</li>
 *   <li>{@code speak()} 调用后没有任何回调，也没有声音 —— 完全静默失败。</li>
 * </ul>
 * <p>因此网页里的发音代码在 App 内一定会失败。唯一的出路是走 Android 原生的
 * {@link TextToSpeech}，把结果通过 {@code evaluateJavascript} 回调给网页。
 *
 * <h3>语言选择策略</h3>
 * <p>手机上通常装了 Google 文字转语音，中文肯定有，英语常常也有。
 * 初始化时先按英语（美式）请求，失败则退回「系统默认 + 语言标记」，让引擎自己挑音色。
 *
 * <h3>线程</h3>
 * <p>{@link TextToSpeech#speak} 必须在主线程调用；{@code @JavascriptInterface} 方法
 * 本身就在 WebView 的 JavaBridge 线程上，所以这里用 {@code runOnUiThread} 切回主线程。
 */
public class NativeTTS {

    /** 初始化/朗读是否可用 */
    private volatile boolean ready = false;
    /** 是否已经尝试过初始化（避免重复初始化） */
    private volatile boolean tried = false;
    /** 引擎缺失的错误码 */
    private static final String ERR_NO_ENGINE = "tts-no-engine";
    private static final String ERR_NOT_READY = "tts-not-ready";
    private static final String ERR_LANG_MISSING = "tts-lang-missing";

    private final MainActivity act;
    private TextToSpeech tts;

    /** 正在朗读的 utteranceId，用于作废过期的回调 */
    private volatile String currentId = null;

    public NativeTTS(MainActivity act) {
        this.act = act;
    }

    /* ---------------------------------------------------------------
     * 初始化
     * --------------------------------------------------------------- */

    /**
     * 初始化引擎。可以在页面加载后立即调用，失败也不影响其他功能。
     */
    public void init() {
        if (tried) return;
        tried = true;

        act.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    tts = new TextToSpeech(act.getApplicationContext(), status -> {
                        if (status != TextToSpeech.SUCCESS) {
                            ready = false;
                            return;
                        }
                        // 优先英语（美式）；失败则用默认引擎，让它自己挑
                        int r = tts.setLanguage(Locale.US);
                        if (r == TextToSpeech.LANG_MISSING_DATA
                                || r == TextToSpeech.LANG_NOT_SUPPORTED) {
                            // 英语不可用：退回 UK，再不行就用默认
                            int r2 = tts.setLanguage(Locale.UK);
                            if (r2 == TextToSpeech.LANG_MISSING_DATA
                                    || r2 == TextToSpeech.LANG_NOT_SUPPORTED) {
                                tts.setLanguage(Locale.getDefault());
                            }
                        }
                        // Android 11+ 可指定音色，优先挑一个英语音色
                        applyBestVoice();
                        setProgressListener();
                        ready = true;
                    });
                } catch (Exception e) {
                    ready = false;
                }
            }
        });
    }

    /**
     * Android 11+ 从系统可用音色里挑一个质量较好的英语音色。
     * 低于该版本没有 Voice API，跳过即可（引擎会用默认音色）。
     */
    private void applyBestVoice() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.R) return;
        try {
            Voice best = null;
            for (Voice v : tts.getVoices()) {
                Locale l = v.getLocale();
                if (l == null) continue;
                String lang = l.getLanguage();
                if (!"en".equals(lang)) continue;
                // networkRequired=false 优先：离线也能响
                if (best == null) best = v;
                else if (!v.isNetworkConnectionRequired() && best.isNetworkConnectionRequired()) {
                    best = v;
                }
            }
            if (best != null) tts.setVoice(best);
        } catch (Exception e) { /* 拿不到音色就用默认 */ }
    }

    private void setProgressListener() {
        try {
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override public void onStart(String id) { fire("onstart", id, null); }
                @Override public void onDone(String id) { fire("onend", id, null); }

                @Override
                public void onError(String id) { fire("onerror", id, ERR_LANG_MISSING); }

                @Override
                public void onError(String id, int errorCode) {
                    fire("onerror", id, ERR_LANG_MISSING);
                }
            });
        } catch (Exception e) { /* 部分厂商不支持监听 */ }
    }

    /* ---------------------------------------------------------------
     * 供 JavaScript 调用
     * --------------------------------------------------------------- */

    /**
     * 朗读一段文本。
     *
     * @param text 要读的内容
     * @param rate 语速（0.5 ~ 2.0，已由网页侧做过映射）
     * @param token 本次朗读的唯一标识，用来作废过期回调
     */
    @android.webkit.JavascriptInterface
    public void speak(final String text, final float rate, final int token) {
        if (text == null || text.trim().isEmpty()) {
            fireError(token, "empty-text");
            return;
        }
        // 引擎还没初始化完：立刻回调错误，网页侧会退到云端发音
        if (!ready || tts == null) {
            init();
            fireError(token, ERR_NOT_READY);
            return;
        }

        final String id = "u" + token;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    currentId = id;
                    tts.stop();
                    int r = tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, id);
                    if (r != TextToSpeech.SUCCESS) {
                        currentId = null;
                        fireError(token, ERR_NO_ENGINE);
                    }
                } catch (Exception e) {
                    currentId = null;
                    fireError(token, ERR_NO_ENGINE);
                }
            }
        });
    }

    /** 停止朗读 */
    @android.webkit.JavascriptInterface
    public void stop() {
        currentId = null;
        if (tts == null) return;
        act.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try { tts.stop(); } catch (Exception e) { /* 忽略 */ }
            }
        });
    }

    /** 引擎是否就绪。同步返回，供网页侧判断该走原生还是云端。 */
    @android.webkit.JavascriptInterface
    public boolean isReady() {
        return ready && tts != null;
    }

    /** 主动触发初始化（网页加载完成后调用一次） */
    @android.webkit.JavascriptInterface
    public void prepare() {
        init();
    }

    /** 引擎诊断信息，供「发音设置」页展示 */
    @android.webkit.JavascriptInterface
    public String info() {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"ready\":").append(ready);
        sb.append(",\"engine\":").append(tts == null ? "null" : "\"" + safe(tts.getDefaultEngine()) + "\"");
        sb.append(",\"lang\":");
        try {
            sb.append(tts != null && tts.getLanguage() != null
                    ? "\"" + tts.getLanguage() + "\"" : "null");
        } catch (Exception e) { sb.append("null"); }
        sb.append("}");
        return sb.toString();
    }

    private static String safe(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    /* ---------------------------------------------------------------
     * 回调网页
     * --------------------------------------------------------------- */

    private void fire(String fn, String id, String err) {
        // 只回调当前这次朗读，忽略被新朗读打断的旧回调
        if (id != null && !id.equals(currentId) && !"onerror".equals(fn)) return;
        String js;
        if ("onerror".equals(fn)) {
            js = "window.__nativeTtsFire && window.__nativeTtsFire('onerror','" + err + "')";
        } else {
            js = "window.__nativeTtsFire && window.__nativeTtsFire('" + fn + "','')";
        }
        act.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    act.getWebView().evaluateJavascript(js, null);
                } catch (Exception e) { /* WebView 已销毁 */ }
            }
        });
    }

    private void fireError(int token, String code) {
        String js = "window.__nativeTtsFire && window.__nativeTtsFire('onerror','" + code + "')";
        act.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    act.getWebView().evaluateJavascript(js, null);
                } catch (Exception e) { /* 忽略 */ }
            }
        });
    }

    /** 释放资源 */
    public void destroy() {
        ready = false;
        if (tts != null) {
            try { tts.stop(); tts.shutdown(); } catch (Exception e) { /* 忽略 */ }
            tts = null;
        }
    }
}
