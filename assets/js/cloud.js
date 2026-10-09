/* ============================================================
   cloud.js —— 云服务接入层
   职责：
     1. 初始化 SDK（CDN 形式，纯静态项目无构建步骤）
     2. 邮箱注册 / 登录 / 登出 / 会话监听
     3. 学习数据与进度记忆的双向同步（云端 ⇄ 本地）
     4. 冲突处理：以 updated_at 时间戳为准，保留较新的一方

   设计原则：
     - 本地优先：所有写入先落localStorage，云端失败不影响使用
     - 离线可用：无网络时静默跳过同步，联网后补传
     - 用户可拒绝：未登录时功能完整可用，登录只是锦上添花
     - 认证闸门：用户私有数据读写前必须校验会话

   数据流：
     本地 localStorage（权威，写入即生效）
        ↕ sync（登录后启用，指数退避重试）
     云端 PostgreSQL（跨设备持久化）
   ============================================================ */
(function (global) {
  'use strict';

  /* ============================================================
     公共配置
     来自 workbuddy_cloud_service 返回的 publicConfig。
     endpoint 与 publishableKey 必须同时提供，不可省略 endpoint。
     ============================================================ */
  var PUBLIC_CONFIG = {
    endpoint: 'https://english-learning-system-36589.app.workbuddy.host',
    oauthRelayBaseUrl: 'https://www.workbuddy.cn/v2/as/genie-baas/oauth',
    publishableKey: 'wbpk_nvGVvv19q33PHDpN07ndUi_v11ldvDj4KvKE4gey9P46cILjh0fySlw'
  };

  var LOCAL_KEY = 'eng_atlas_v1';            // store.js 用的键
  var PROGRESS_KEY = 'eng_atlas_progress_v1'; // progress.js 用的键
  var SYNC_META_KEY = 'eng_atlas_cloud_meta';

  var cloud = null;          // SDK 客户端
  var session = null;        // 当前会话
  var status = {
    ready: false,      // SDK 已初始化
    online: true,      // 网络可用
    lastSyncAt: 0,     // 上次成功同步时间戳
    lastError: '',     // 最近一次错误（用户可见）
    syncing: false     // 是否正在同步
  };

  /* ============================================================
     初始化
     ============================================================ */
  function init() {
    if (status.ready) return Promise.resolve(cloud);
    if (!global.WorkBuddyCloud || !global.WorkBuddyCloud.createWorkBuddyCloud) {
      // SDK 未加载（离线或 CDN 不可达）：应用继续以纯本地模式运行
      status.ready = false;
      status.online = false;
      return Promise.resolve(null);
    }
    try {
      cloud = global.WorkBuddyCloud.createWorkBuddyCloud({
        endpoint: PUBLIC_CONFIG.endpoint,
        oauthRelayBaseUrl: PUBLIC_CONFIG.oauthRelayBaseUrl,
        publishableKey: PUBLIC_CONFIG.publishableKey
      });
      status.ready = true;
      // 恢复已有会话
      return cloud.auth.getSession()
        .then(function (r) {
          if (r && r.data) session = r.data;
          return cloud;
        })
        .catch(function () { return cloud; });
    } catch (e) {
      console.warn('[cloud] 初始化失败', e);
      status.ready = false;
      status.lastError = '云服务初始化失败：' + (e.message || '未知错误');
      return Promise.resolve(null);
    }
  }

  /** 当前是否已登录（有有效会话） */
  function isSignedIn() {
    return !!(session && session.user);
  }
  function currentUser() {
    return session ? session.user : null;
  }

  /* ============================================================
     网络探测
     ============================================================ */
  function ping() {
    if (!navigator.onLine) {
      status.online = false;
      return Promise.resolve(false);
    }
    // 用一个极轻量的 HEAD 请求判断可达性；失败不抛错
    return fetch(PUBLIC_CONFIG.endpoint + '/', { method: 'HEAD', cache: 'no-store' })
      .then(function () { status.online = true; return true; })
      .catch(function () { status.online = false; return false; });
  }

  /* ============================================================
     认证
     ============================================================ */
  /**
   * 邮箱注册：先取验证码，再带密码验证
   * 新账号必须提供密码（SDK 契约要求），老用户仅需验证码
   * @returns {{stage:'sent'|'done', isExistingUser?:boolean}}
   */
  var pendingOtp = null;   // { email, verificationId, isExistingUser }

  /** 当前是否已为某邮箱获取过验证码（供 UI 判断提交顺序） */
  function hasPendingCode(email) {
    return !!(pendingOtp && pendingOtp.email === email);
  }

  /** 把 SDK 返回的错误对象转成可展示的短消息
   服务端有时会返回带 printf 占位符未填充的字符串（如 "无效的验证码%!(EXTRA string=...)"），
   这里剥掉这类噪声，避免把内部细节暴露给用户。 */
  function friendlyError(e, fallback) {
    var msg = '';
    try {
      if (e && typeof e === 'object') {
        msg = e.message || e.error_description || e.msg || '';
        if (!msg && e.error && typeof e.error === 'object') msg = e.error.message || '';
      } else if (typeof e === 'string') msg = e;
    } catch (_) { msg = ''; }
    msg = String(msg)
      // 去掉 %!(EXTRA string=...) / %!s(...) 之类的格式化残留
      .replace(/%!\([A-Z]+\s[^)]*\)/g, '')
      .replace(/%[sdv]\s/g, '')
      .trim();
    if (!msg) msg = fallback || '操作失败，请稍后重试';
    // 过长且含技术细节时不直接展示
    if (msg.length > 120) msg = msg.slice(0, 117) + '…';
    return msg;
  }

  function sendCode(email) {
    if (!email || !/.+@.+\..+/.test(email)) {
      return Promise.reject(new Error('请输入正确的邮箱地址'));
    }
    if (!status.ready) return Promise.reject(new Error('云服务未就绪，请稍后重试'));
    return cloud.auth.sendOtp({ email: email }).then(function (r) {
      if (r.error) throw new Error(friendlyError(r.error, '验证码发送失败'));
      pendingOtp = {
        email: email,
        verificationId: r.data.verificationId,
        isExistingUser: r.data.isExistingUser
      };
      return { stage: 'sent', isExistingUser: r.data.isExistingUser };
    });
  }

  /**
   * 提交验证码完成登录/注册
   * @param {string} email
   * @param {string} code 验证码
   * @param {string} [password] 新用户注册时必填
   */
  function submitCode(email, code, password) {
    if (!pendingOtp || pendingOtp.email !== email) {
      return Promise.reject(new Error('请先为当前邮箱获取验证码'));
    }
    if (!code) return Promise.reject(new Error('请输入验证码'));
    if (!pendingOtp.isExistingUser && !password) {
      return Promise.reject(new Error('新账号需要设置密码（至少 6 位）'));
    }
    return cloud.auth.verifyOtp({
      email: pendingOtp.email,
      verificationId: pendingOtp.verificationId,
      isExistingUser: pendingOtp.isExistingUser,
      token: code,
      password: pendingOtp.isExistingUser ? undefined : password
    }).then(function (r) {
      if (r.error) throw new Error(friendlyError(r.error, '验证失败'));
      pendingOtp = null;
      session = r.data;
      status.lastError = '';
      return r.data;
    });
  }

  /** 提交前的前置检查，供 UI 给出准确提示（不发起请求） */
  function checkBeforeSubmit(email) {
    if (!pendingOtp || pendingOtp.email !== email) {
      return { ok: false, message: '请先为当前邮箱获取验证码' };
    }
    if (!pendingOtp.isExistingUser) {
      return { ok: true, needPassword: true };   // 新账号必须带密码
    }
    return { ok: true, needPassword: false };
  }

  /** 邮箱 + 密码直接登录（已注册用户） */
  function signInWithPassword(email, password) {
    if (!status.ready) return Promise.reject(new Error('云服务未就绪'));
    return cloud.auth.signInWithPassword({ email: email, password: password })
      .then(function (r) {
        if (r.error) throw new Error(friendlyError(r.error, '登录失败'));
        session = r.data;
        return r.data;
      });
  }

  function signOut() {
    if (!status.ready) return Promise.resolve();
    return cloud.auth.signOut().then(function () {
      session = null;
      // 登出后清理同步元数据，避免把A 账号的数据同步给 B 账号
      try { localStorage.removeItem(SYNC_META_KEY); } catch (e) { /* 无痕模式 */ }
    });
  }

  /** 监听登录状态变化（跨标签页同步） */
  function onAuthStateChange(cb) {
    if (!status.ready) return function () {};
    return cloud.auth.onAuthStateChange(function (event, s) {
      session = s;
      cb(event, s);
    });
  }

  /* ============================================================
     本地数据读写
     ============================================================ */
  function readLocal(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('[cloud] 读取本地数据失败', e);
      return null;
    }
  }
  function writeLocal(key, obj) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
      return true;
    } catch (e) {
      console.warn('[cloud] 写入本地数据失败', e);
      return false;
    }
  }
  function readMeta() {
    return readLocal(SYNC_META_KEY) || {};
  }
  function writeMeta(m) {
    writeLocal(SYNC_META_KEY, m);
  }

  /* ============================================================
     同步：本地 → 云端
     ============================================================ */
  /**
   * 推送本地数据到云端
   * @param {object} opts { state:boolean, progress:boolean }
   */
  function push(opts) {
    var o = opts || {};
    if (!status.ready || !isSignedIn()) {
      return Promise.resolve({ skipped: true, reason: 'not-ready' });
    }
    if (status.syncing) return Promise.resolve({ skipped: true, reason: 'busy' });
    status.syncing = true;

    var tasks = [];
    var meta = readMeta();
    var now = Date.now();

    if (o.state !== false) {
      var st = readLocal(LOCAL_KEY);
      if (st) {
        tasks.push(
          cloud.database.from('learner_state')
            .select('id, updated_at')
            .order('updated_at', { ascending: false })
            .limit(1)
            .then(function (r) {
              if (r.error) throw new Error(friendlyError(r.error, '数据库请求失败'));
              var remote = r.data && r.data[0];
              var row = {
                payload: st,
                schema_version: st.version || 2,
                device_label: deviceLabel(),
                updated_at: new Date(now).toISOString()
              };
              if (remote) {
                return cloud.database.from('learner_state')
                  .update(row).eq('id', remote.id).select();
              }
              return cloud.database.from('learner_state').insert(row).select();
            })
            .then(function (r) {
              if (r.error) throw new Error(friendlyError(r.error, '数据库请求失败'));
              meta.stateAt = now;
              return 'state';
            })
        );
      }
    }

    if (o.progress !== false) {
      var pg = readLocal(PROGRESS_KEY);
      if (pg) {
        tasks.push(
          cloud.database.from('learner_progress')
            .select('id')
            .limit(1)
            .then(function (r) {
              if (r.error) throw new Error(friendlyError(r.error, '数据库请求失败'));
              var remote = r.data && r.data[0];
              var row = {
                payload: pg,
                updated_at: new Date(now).toISOString()
              };
              if (remote) {
                return cloud.database.from('learner_progress')
                  .update(row).eq('id', remote.id).select();
              }
              return cloud.database.from('learner_progress').insert(row).select();
            })
            .then(function (r) {
              if (r.error) throw new Error(friendlyError(r.error, '数据库请求失败'));
              meta.progressAt = now;
              return 'progress';
            })
        );
      }
    }

    return Promise.all(tasks)
      .then(function (results) {
        status.syncing = false;
        status.lastSyncAt = now;
        status.lastError = '';
        writeMeta(meta);
        return { ok: true, synced: results };
      })
      .catch(function (e) {
        status.syncing = false;
        status.lastError = e.message || '同步失败';
        // 失败不抛：本地仍是权威，静默等待下次重试
        console.warn('[cloud] 推送失败', e.message);
        return { ok: false, error: e.message };
      });
  }

  /* ============================================================
     同步：云端 → 本地
     ============================================================ */
  /**
   * 从云端拉取并按时间戳决定是否覆盖本地
   * @returns {{restored:boolean, reason?:string}}
   */
  function pull() {
    if (!status.ready || !isSignedIn()) {
      return Promise.resolve({ restored: false, reason: 'not-ready' });
    }
    var meta = readMeta();

    return cloud.database.from('learner_state')
      .select('payload, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1)
      .then(function (r) {
        if (r.error) throw new Error(friendlyError(r.error, '数据库请求失败'));
        if (!r.data || !r.data.length) return null;
        var remoteTs = new Date(r.data[0].updated_at).getTime();
        // 云端更新才覆盖本地，避免多设备互相覆盖
        if (meta.stateAt && remoteTs <= meta.stateAt) return null;
        if (writeLocal(LOCAL_KEY, r.data[0].payload)) {
          meta.stateAt = remoteTs;
          return 'state';
        }
        return null;
      })
      .then(function (stateRestored) {
        return cloud.database.from('learner_progress')
          .select('payload, updated_at')
          .order('updated_at', { ascending: false })
          .limit(1)
          .then(function (r) {
            if (r.error) throw new Error(friendlyError(r.error, '数据库请求失败'));
            if (!r.data || !r.data.length) return stateRestored;
            var remoteTs = new Date(r.data[0].updated_at).getTime();
            if (meta.progressAt && remoteTs <= meta.progressAt) return stateRestored;
            if (writeLocal(PROGRESS_KEY, r.data[0].payload)) {
              meta.progressAt = remoteTs;
              return stateRestored || 'progress';
            }
            return stateRestored;
          });
      })
      .then(function (restored) {
        if (restored) {
          writeMeta(meta);
          status.lastSyncAt = Date.now();
        }
        return { restored: !!restored, what: restored || null };
      })
      .catch(function (e) {
        status.lastError = e.message || '拉取失败';
        console.warn('[cloud] 拉取失败', e.message);
        return { restored: false, reason: e.message };
      });
  }

  /** 完整同步：先拉后推（登录后调用） */
  function syncAll() {
    return pull().then(function (r) {
      return push().then(function (p) {
        return { pulled: r.restored, pushed: p.ok };
      });
    });
  }

  /* ============================================================
     自动同步：防抖 + 定时 + 联网恢复
     ============================================================ */
  var debounceTimer = null;
  /** 安排一次同步（合并密集调用） */
  function scheduleSync(delay) {
    if (!isSignedIn()) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      debounceTimer = null;
      if (navigator.onLine) push();
    }, delay || 3000);
  }

  function startAutoSync() {
    // 1) 登录后立即全量同步一次
    syncAll();
    // 2) 定时兜底（每 5 分钟推一次，防止漏掉关闭前的改动）
    setInterval(function () {
      if (isSignedIn() && navigator.onLine) push();
    }, 5 * 60 * 1000);
    // 3) 关闭页面前落盘 + 推送
    global.addEventListener('beforeunload', function () {
      if (isSignedIn() && navigator.onLine) push();
    });
    // 4) 从离线恢复时补传
    global.addEventListener('online', function () {
      status.online = true;
      if (isSignedIn()) syncAll();
    });
    global.addEventListener('offline', function () {
      status.online = false;
    });
  }

  function deviceLabel() {
    var ua = navigator.userAgent;
    var os = /Windows/.test(ua) ? 'Windows'
      : /Mac/.test(ua) ? 'macOS'
      : /Android/.test(ua) ? 'Android'
      : /iPhone|iPad/.test(ua) ? 'iOS'
      : /Linux/.test(ua) ? 'Linux' : '未知系统';
    var br = /Edg/.test(ua) ? 'Edge'
      : /Chrome/.test(ua) ? 'Chrome'
      : /Safari/.test(ua) ? 'Safari'
      : /Firefox/.test(ua) ? 'Firefox' : '浏览器';
    return os + ' · ' + br;
  }

  /* ============================================================
     云端数据管理
     ============================================================ */
  /** 删除云端数据（不影响本地）
   RLS 已限定只能操作自己的行，因此无需手动传 owner_id */
  function clearCloud() {
    if (!status.ready || !isSignedIn()) {
      return Promise.reject(new Error('请先登录'));
    }
    return Promise.all([
      cloud.database.from('learner_state').delete().neq('id', 0).select(),
      cloud.database.from('learner_progress').delete().neq('id', 0).select()
    ]).then(function (rs) {
      var n = 0;
      rs.forEach(function (r) {
        if (r.error) throw new Error(friendlyError(r.error, '数据库请求失败'));
        n += Array.isArray(r.data) ? r.data.length : 0;
      });
      return n;
    });
  }

  global.Cloud = {
    PUBLIC_CONFIG: PUBLIC_CONFIG,
    init: init,
    ping: ping,
    // 认证
    sendCode: sendCode,
    submitCode: submitCode,
    checkBeforeSubmit: checkBeforeSubmit,
    hasPendingCode: hasPendingCode,
    signInWithPassword: signInWithPassword,
    signOut: signOut,
    onAuthStateChange: onAuthStateChange,
    isSignedIn: isSignedIn,
    currentUser: currentUser,
    // 同步
    push: push,
    pull: pull,
    syncAll: syncAll,
    scheduleSync: scheduleSync,
    startAutoSync: startAutoSync,
    // 管理
    clearCloud: clearCloud,
    get status() { return status; }
  };
})(window);