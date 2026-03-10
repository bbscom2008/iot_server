/**
 * 安全的页面导航工具
 * 解决移动端浏览器（特别是微信/支付宝）的跳转兼容性问题
 */

/**
 * 检测浏览器环境
 * @returns {Object} 浏览器环境信息
 */
export function getBrowserEnv() {
  const ua = navigator.userAgent.toLowerCase();
  
  return {
    // 微信浏览器
    isWeChat: /micromessenger/i.test(ua),
    // 支付宝浏览器
    isAlipay: /alipayclient/i.test(ua),
    // QQ浏览器
    isQQ: /qq\//i.test(ua),
    // iOS 设备
    isIOS: /iphone|ipad|ipod/i.test(ua),
    // Android 设备
    isAndroid: /android/i.test(ua),
    // 移动设备
    isMobile: /mobile/i.test(ua) || 
              'ontouchstart' in window || 
              (navigator.maxTouchPoints > 0),
    // Safari 浏览器
    isSafari: /safari/i.test(ua) && !/chrome/i.test(ua),
    // 完整的 UA
    userAgent: ua
  };
}

/**
 * 检测是否为微信/支付宝等内置浏览器
 * @returns {boolean}
 */
export function isInAppBrowser() {
  const env = getBrowserEnv();
  return env.isWeChat || env.isAlipay || env.isQQ;
}

/**
 * 安全的打开链接方法
 * @param {string} url - 要打开的URL
 * @param {object} options - 配置选项
 * @param {string} options.target - 目标窗口 ('_blank', '_self', '_parent', '_top')
 * @param {boolean} options.forceNewWindow - 是否强制新窗口打开
 * @param {boolean} options.showErrorTip - 是否显示错误提示
 * @param {Function} options.onBlocked - 被拦截时的回调
 * @returns {boolean} 是否成功打开
 */
export function safeOpen(url, options = {}) {
  const {
    target = '_blank',
    forceNewWindow = false,
    showErrorTip = true,
    onBlocked = null
  } = options;
  
  // 验证 URL
  if (!url || typeof url !== 'string') {
    console.error('Invalid URL:', url);
    return false;
  }
  
  const env = getBrowserEnv();
  
  // 策略1: 微信/支付宝/QQ等内置浏览器 + 移动端
  // 这些环境下 window.open 经常被拦截，直接使用 location.href
  if (!forceNewWindow && (isInAppBrowser() || (env.isMobile && target === '_blank'))) {
    console.log('[Navigator] Using location.href for in-app browser or mobile');
    window.location.href = url;
    return true;
  }
  
  // 策略2: PC端或强制新窗口，尝试使用 window.open
  try {
    const windowFeatures = 'noopener,noreferrer';
    const newWindow = window.open(url, target, windowFeatures);
    
    // 检测是否被拦截
    // 某些浏览器会返回 null，某些会返回一个已关闭的窗口
    const isBlocked = !newWindow || 
                      newWindow.closed || 
                      typeof newWindow.closed === 'undefined';
    
    if (isBlocked) {
      console.warn('[Navigator] window.open was blocked');
      
      // 执行被拦截回调
      if (onBlocked && typeof onBlocked === 'function') {
        onBlocked(url);
      }
      
      // 显示错误提示
      if (showErrorTip) {
        handlePopupBlocked(url, target);
      }
      
      return false;
    }
    
    console.log('[Navigator] Successfully opened with window.open');
    return true;
    
  } catch (e) {
    console.error('[Navigator] window.open failed:', e);
    
    // 异常时的降级处理
    handleOpenError(url, target, showErrorTip);
    
    return false;
  }
}

/**
 * 处理弹窗被拦截的情况
 * @param {string} url - URL
 * @param {string} target - 目标窗口
 */
function handlePopupBlocked(url, target) {
  // 检查是否有全局消息提示
  if (typeof window.Vue !== 'undefined' && window.Vue.prototype.$message) {
    window.Vue.prototype.$message.warning({
      message: '浏览器拦截了弹窗，请允许弹窗后重试',
      duration: 3000
    });
  }
  
  // 降级方案：询问用户是否在当前窗口打开
  setTimeout(() => {
    const userConfirm = confirm('浏览器拦截了弹窗，是否在当前页面打开？\n\n点击"确定"打开链接');
    if (userConfirm) {
      window.location.href = url;
    }
  }, 100);
}

/**
 * 处理打开失败的情况
 * @param {string} url - URL
 * @param {string} target - 目标窗口
 * @param {boolean} showErrorTip - 是否显示提示
 */
function handleOpenError(url, target, showErrorTip) {
  if (target === '_blank') {
    // 新窗口打开失败，尝试当前窗口
    if (showErrorTip) {
      const userConfirm = confirm('无法打开新窗口，是否在当前页面打开？');
      if (userConfirm) {
        window.location.href = url;
      }
    } else {
      window.location.href = url;
    }
  } else {
    // 当前窗口打开
    window.location.href = url;
  }
}

/**
 * 创建一个临时 <a> 标签进行跳转
 * 这种方式在某些浏览器中可以绕过拦截
 * @param {string} url - URL
 * @param {string} target - 目标窗口
 * @returns {boolean}
 */
export function openWithAnchor(url, target = '_blank') {
  try {
    const a = document.createElement('a');
    a.href = url;
    a.target = target;
    a.rel = 'noopener noreferrer';
    
    // 添加到 DOM（某些浏览器需要）
    a.style.display = 'none';
    document.body.appendChild(a);
    
    // 触发点击
    a.click();
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(a);
    }, 100);
    
    return true;
  } catch (e) {
    console.error('[Navigator] openWithAnchor failed:', e);
    return false;
  }
}

/**
 * 智能跳转：自动选择最佳跳转方式
 * @param {string} url - URL
 * @param {object} options - 配置选项
 */
export function smartOpen(url, options = {}) {
  const env = getBrowserEnv();
  
  // 策略选择
  if (isInAppBrowser() || env.isMobile) {
    // 内置浏览器或移动端：直接跳转
    window.location.href = url;
  } else if (env.isSafari) {
    // Safari：使用 <a> 标签方式
    if (!openWithAnchor(url, options.target || '_blank')) {
      // 降级为 safeOpen
      safeOpen(url, options);
    }
  } else {
    // 其他浏览器：使用 safeOpen
    safeOpen(url, options);
  }
}

/**
 * 检测 URL 是否安全
 * @param {string} url - URL
 * @returns {boolean}
 */
export function isUrlSafe(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // 允许的协议
  const allowedProtocols = ['http:', 'https:', 'tel:', 'mailto:'];
  
  try {
    const urlObj = new URL(url, window.location.href);
    return allowedProtocols.includes(urlObj.protocol);
  } catch (e) {
    // 相对路径
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }
}

/**
 * 带验证的安全跳转
 * @param {string} url - URL
 * @param {object} options - 配置选项
 */
export function safeOpenWithValidation(url, options = {}) {
  // 验证 URL 安全性
  if (!isUrlSafe(url)) {
    console.error('[Navigator] Unsafe URL detected:', url);
    
    if (typeof window.Vue !== 'undefined' && window.Vue.prototype.$message) {
      window.Vue.prototype.$message.error('不安全的链接');
    }
    
    return false;
  }
  
  return safeOpen(url, options);
}

// 默认导出
export default {
  getBrowserEnv,
  isInAppBrowser,
  safeOpen,
  smartOpen,
  openWithAnchor,
  isUrlSafe,
  safeOpenWithValidation
};


