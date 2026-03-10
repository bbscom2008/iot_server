// ==================== 联网工具类 ====================
class NetworkTool {
    // 配置项
    static config = {
        apiUrl: '/wxapi',
        timeout: 10000, // 10秒超时
        retryCount: 1, // 重试次数
    };

    /**
     * 获取支付信息
     * @param {string} params - 请求参数
     * @returns {Promise<Object>} 返回支付信息
     */
    static async getBasePayCashInfo(params) {
        return await this._retryFetch({
            url: '/payCash/page/getBasePayCashInfo/' + params
        });
    }

    /**
     * 获取支付信息
     * @param {string} params - 请求参数
     * @returns {Promise<Object>} 返回支付信息
     */
    static async getPayCashInfo(params) {
        return await this._retryFetch({
            url: '/payCash/page/getPayCashInfo/' + params
        });
    }



    /**
     * 有重试机制的请求方法
     * @private
     * @param {Object} params - 请求参数
     * @returns {Promise<Object>} 返回支付信息
     */
    static async _retryFetch({ url, method = 'GET', data = null }) {
        let lastError;

        for (let i = 0; i < this.config.retryCount; i++) {
            try {
                const response = await this._fetch(url, method, data);
                return response;
            } catch (error) {
                lastError = error;
                console.warn(`第${i + 1}次请求失败:`, error.message);

                // 不是最后一次，等待后重试
                if (i < this.config.retryCount - 1) {
                    await this._delay(1000 * (i + 1)); // 指数退避
                }
            }
        }

        throw lastError || new Error('获取失败');
    }

    /**
     * 基于 XMLHttpRequest 的请求方法
     * @private
     * @param {string} url - 请求 URL
     * @param {string} method - 请求方法，默认 GET
     * @param {Object} data - 请求数据（POST 时使用）
     * @returns {Promise<Object>} 返回响应 JSON
     */
    static _fetch(url, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // 设置超时
            xhr.timeout = this.config.timeout;

            // 完成事件
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {

                        // 读取响应头中的 encrypt-key
                        const encryptKey = xhr.getResponseHeader('encrypt-key');

                        let decryptData = ''
                        let res = ''
                        if (encryptKey) {
                            // 解密
                            try {
                                decryptData = EncryptUtils.rsaDecrypt(encryptKey)
                                decryptData = EncryptUtils.base64Decode(decryptData)
                                console.log('-----response.data--decryptData----');
                                console.log(decryptData)

                                res = EncryptUtils.sm4Decrypt(xhr.responseText, decryptData)

                                res = JSON.parse(res);
                            } catch (e) {
                                console.log('----catch------');
                                console.log(e);
                            }
                        } else {
                            res = JSON.parse(xhr.responseText);
                        }

                        console.log(res);

                        if (res.code !== '00000') {
                            // 特殊处理订单关闭的情况
                            if (res.code === 'U0001') {
                                reject(new Error(JSON.stringify({
                                    code: res.code,
                                    message: res.message,
                                    isOrderClosed: true
                                })));
                            } else {
                                reject(new Error(res.message || '服务器返回错误'));
                            }
                            return;
                        }

                        resolve(res.data);

                    } catch (error) {
                        reject(new Error('响应数据格式错误: ' + error.message));
                    }
                } else {
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                }
            };

            // 错误事件
            xhr.onerror = function () {
                reject(new Error('网络请求失败'));
            };

            // 超时事件
            xhr.ontimeout = function () {
                reject(new Error(`请求超时（${NetworkPaymentTool.config.timeout}ms）`));
            };

            // 中止事件
            xhr.onabort = function () {
                reject(new Error('请求已中止'));
            };

            // 打开连接
            xhr.open(method, this.config.apiUrl + url, true);

            // 设置请求头
            xhr.setRequestHeader('Content-Type', 'application/json');

            // 发送请求
            if (method === 'POST' || method === 'PUT') {
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send();
            }
        });
    }

    /**
     * 延时函数
     * @private
     * @param {number} ms - 延时毫秒数
     * @returns {Promise<void>}
     */
    static _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================== 倒计时管理器 ====================
class CountdownTimer {
    constructor() {
        this.timerId = null;
        this.remainingSeconds = 0;
        this.onComplete = null;
        this.onUpdate = null;
    }

    /**
     * 根据截止时间开始倒计时
     * @param {string} deadline - 截止时间 '2026-01-20 12:30:45'
     * @param {Function} onUpdate - 更新回调
     * @param {Function} onComplete - 完成回调
     */
    start(deadline, onUpdate, onComplete) {
        this.onUpdate = onUpdate;
        this.onComplete = onComplete;

        // 计算截止时间的毫秒数
        const deadlineTime = new Date(deadline).getTime();
        const now = new Date().getTime();
        this.remainingSeconds = Math.floor((deadlineTime - now) / 1000);

        // 如果已经过期
        if (this.remainingSeconds <= 0) {
            this.onComplete && this.onComplete();
            return;
        }

        // 立即更新一次
        this._updateDisplay();

        // 定时器
        this.timerId = setInterval(() => {
            this.remainingSeconds--;
            this._updateDisplay();

            if (this.remainingSeconds <= 0) {
                this.stop();
                this.onComplete && this.onComplete();
            }
        }, 1000);
    }

    /**
     * 更新显示
     * @private
     */
    _updateDisplay() {
        const hours = Math.floor(this.remainingSeconds / 3600);
        const minutes = Math.floor((this.remainingSeconds % 3600) / 60);
        const seconds = this.remainingSeconds % 60;

        this.onUpdate && this.onUpdate({
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
            total: this.remainingSeconds
        });
    }

    /**
     * 停止倒计时
     */
    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
}

// ==================== URL 工具函数 ====================
/**
 * 获取地址栏中最后一个 / 后面的内容
 * @returns {string} 最后一个 / 后面的内容
 */
function getUrlLastSegment() {
    const pathname = window.location.pathname;
    const lastSegment = pathname.split('/').filter(Boolean).pop();
    return lastSegment;
}

// ==================== 加载框工具函数 ====================
/**
 * 显示加载框
 * @param {string} message - 加载提示文本，默认 '正在加载支付信息...'
 * @returns {void}
 */
function showLoading(message = '正在加载...') {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        const loadingText = loadingOverlay.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = message;
        }
        loadingOverlay.classList.remove('hidden');
    }
}

/**
 * 隐藏加载框
 * @returns {void}
 */
function hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// ==================== 复制到剪贴板工具函数 ====================
/**
 * 复制文本到剪贴板（兼容多种浏览器）
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 返回Promise，成功返回true，失败返回false
 */
function copyToClipboard(text) {
    return new Promise((resolve) => {
        // 首先尝试使用现代 Clipboard API
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(text)
                .then(() => {
                    resolve(true);
                })
                .catch((err) => {
                    console.warn('Clipboard API 失败，尝试备选方案:', err);
                    // 如果现代 API 失败，使用备选方案
                    copyToClipboardFallback(text) ? resolve(true) : resolve(false);
                });
        } else {
            // 浏览器不支持 Clipboard API，使用备选方案
            copyToClipboardFallback(text) ? resolve(true) : resolve(false);
        }
    });
}

/**
 * 复制文本到剪贴板的备选方案（使用 execCommand）
 * @param {string} text - 要复制的文本
 * @returns {boolean} 成功返回true，失败返回false
 */
function copyToClipboardFallback(text) {
    try {
        // 创建临时的 textarea 元素
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.top = '0';
        textarea.style.left = '0';
        document.body.appendChild(textarea);

        // 选择文本
        textarea.select();
        textarea.setSelectionRange(0, 99999); // 处理某些移动设备的问题

        // 执行复制命令
        const successful = document.execCommand('copy');

        // 移除临时元素
        document.body.removeChild(textarea);

        return successful;
    } catch (err) {
        console.error('备选方案复制失败:', err);
        return false;
    }
}

// ==================== 弹窗工具函数 ====================
/**
 * 显示弹窗
 * @param {string} message - 弹窗显示的消息内容
 * @param {Function} onConfirm - 点击确定按钮的回调函数
 * @returns {void}
 */
function showModal(message = '提示', onConfirm = null) {
    const modalOverlay = document.getElementById('modal-overlay');
    const modalMessage = document.getElementById('modal-message');
    const modalBtn = document.getElementById('modal-btn');

    if (modalOverlay && modalMessage) {
        modalMessage.textContent = message;
        modalOverlay.classList.remove('hidden');

        // 移除旧的事件监听器，避免重复绑定
        const newModalBtn = modalBtn.cloneNode(true);
        modalBtn.parentNode.replaceChild(newModalBtn, modalBtn);

        // 添加确定按钮的点击事件
        newModalBtn.addEventListener('click', function () {
            hideModal();
            if (onConfirm && typeof onConfirm === 'function') {
                onConfirm();
            }
        });
    }
}

/**
 * 隐藏弹窗
 * @returns {void}
 */
function hideModal() {
    const modalOverlay = document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.add('hidden');
    }
}

// ==================== Toast 工具函数 ====================
/**
 * 显示 Toast 消息
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长（毫秒），默认1000ms
 */
function showToast(message, duration = 1000) {
    // 获取或创建容器
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    // 创建 toast 元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    // 根据动画时长自动删除元素
    setTimeout(() => {
        toast.remove();
    }, duration + 300); // 300ms 用于动画退出
}

// ==================== 二维码生成工具函数 ====================
/**
 * 根据字符串生成二维码
 * @param {string} text - 要转换为二维码的文本
 * @param {string} containerId - 二维码容器的 ID
 * @param {Object} options - 配置选项
 * @returns {void}
 */
function generateQRCode(text, containerId = 'qrcode', options = {}) {
    const defaultOptions = {
        width: 200,           // 宽度，像素
        height: 200,          // 高度，像素
        colorDark: '#000000', // 前景色（黑色）
        colorLight: '#FFFFFF', // 背景色（白色）
        correctLevel: QRCode.CorrectLevel.H // 容错级别：L/M/Q/H
    };

    const config = { ...defaultOptions, ...options };

    // 获取容器
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`找不到 ID 为 "${containerId}" 的容器`);
        return;
    }

    // 清空容器（如果存在之前的二维码）
    container.innerHTML = '';

    try {
        // 创建二维码
        const qrcode = new QRCode(container, {
            text: text,
            width: config.width,
            height: config.height,
            colorDark: config.colorDark,
            colorLight: config.colorLight,
            correctLevel: config.correctLevel
        });

        console.log('二维码生成成功:', text);
    } catch (error) {
        console.error('生成二维码失败:', error);
        showToast('二维码生成失败');
    }
}

/**
 * 下载二维码为图片
 * @param {string} containerId - 二维码容器的 ID
 * @param {string} filename - 下载文件名，默认 'qrcode.png'
 * @returns {void}
 */
function downloadQRCode(containerId = 'qrcode', filename = 'qrcode.png') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`找不到 ID 为 "${containerId}" 的容器`);
        return;
    }

    // 获取 canvas 元素
    const canvas = container.querySelector('canvas');
    if (!canvas) {
        console.error('找不到二维码 canvas');
        showToast('无法下载二维码');
        return;
    }

    try {
        // 创建下载链接
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        link.click();

        showToast('二维码已下载');
    } catch (error) {
        console.error('下载二维码失败:', error);
        showToast('下载失败，请重试');
    }
}



/**
 * 加密解密工具类 - 浏览器版本
 * 需要在 HTML 中引入以下库：
 * <script src="https://cdn.jsdelivr.net/npm/jsencrypt@3.0.3/bin/jsencrypt.min.js"></script>
 * <script src="https://cdn.jsdelivr.net/npm/sm-crypto@0.3.1/dist/sm-crypto.min.js"></script>
 */

const PrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCccEn1rSVNpoVI
pqB6pU885sR8Lr3v4ESRZn3M06a7fxp8RjBstIYyorw1e9dcACBZEJiuPsyeNYhs
NFZerQ2T30/ucjDNkMZ7hnQmqdUSOQTk80E9aSaHA5VZ9LGNPFdPiphhDndiJbmk
2bmDUJAsB3mAtxkJdsRnX+B/RLL4zWYQLBzn8k423dIAodDOgO4hGmAtWqZd5Nv/
3+ubv4bFva/JdqlijH5IbJV+nYjv899I7CJSJbxdjUkJn0XnfS08G7oLLkMs8qF1
oNJKxpaOHrPROhw5QLLW0kDCwV+/L2WJ7fD5XfoqV4+rbhuSS+HE0/OUGNoVcWj0
nXoUxEZJAgMBAAECggEARf/kyD6iu30wlJKiql5/90NXVi3gJY7Xf6w5zEZEjA9S
vZr2nh2lEtFIoDH66prP3qqTdxx4mK5hjfFZWGHc+nbpIEwOVF1cwvcl0AscYVwM
OZozbhQ3/h/3W1onfIgslVXx2zQK7WruB7q4zO5mpJzvnE3RsS9osMzw+mG2J6ej
MMLmc55yqCV4sKa2IHHP1W1Sr8RJO6t+Jv69/luM7zuakxdR81/CnwitY5pwcFqk
70TS28pkP8c/xn6YOhk/SdaBGtsDYLC7ft2+LhD+trHg/uM7eRfdJSNA0/CVSmvN
wAbl8QKQf/ahiFIheDjeFeHVUIvZ/LAXV+m4i/4IBQKBgQDtkJSxWfM8M7GRUXAi
Yu7dQ/2LzN4lJ7ilSRqRn6L1yia4SXUcQKuE/KqEW22HqrpkSnW/1OxIFe13lwFv
GdUBQAXlXqPScGnZYcqpF/aQSCrD5N8A4U0LJLTYE+Z4pv+6Nikenh7nRXNzi5Xi
0pTgF9QS4eWVL3bM7CghFHZk7wKBgQColBIY9Tw8wb4DyNas88XQPDsK0tZuDxVR
L+EzE09+QCg/wAfusKOT1y2oTuGldh6Aw97VyU+OvzV1cDisIo7wf9qeCkDvDv6d
N8iabM/BfEpY1KuKI4SX0zbxmUn8nzwSnn+jgTCxAvJKl+G0OmiaGXVsEDNndqXR
MD9/n8Y4RwKBgGMvNAV/yp/d7UsAt1KD/7p9woP1uuHEXcEUbnVSMxVvmw7iDHUJ
QxM48nBkQ6yayUtKEzNOUIAgN47wiva50Ea/VjbXdopLyMWroJNMn/LJTqGPEtQp
PKNkZeS5GkZRYv950V0pIznnszYQlzmmNeYBzNc9XT8WHAGer3pwMqYdAoGBAJqr
kJc5mlUcZZzPTrhMybgvKvTZUUiVqjddOMBF/W+Wqdcj96M2ij8A9LEx/rJzV7VJ
AVEhbU9JfGEN39F/u6pJhGnwendcSJwzLGkTYOLjiMtMBT+vKt6qOgUdYdbYuqNS
rUV1KRmf3HI4PCvCU2rf5O6LRr6tC6KNJBWSoKnNAoGBAORhlw6tU0xDJZkWcbSb
wUlxx9/l9m0999MfmUrD0LjFHrb/p7lmxDB0eFXHuOqqG1d1Rp6wVJo4UctsbBPZ
Ddg61RJFRHZ88/IQnKMbpHvkztoGjl0bnVUzTC///dtErR5lfwL/nkk+Ys45PYwM
xeTF92rDHSXEXsKOQRqNj0NW
-----END PRIVATE KEY-----`



// 辅助函数：将Hex字符串转换为Base64
function hexToBase64(hexString) {
    const bytes = [];
    for (let i = 0; i < hexString.length; i += 2) {
        bytes.push(parseInt(hexString.substr(i, 2), 16));
    }
    return btoa(String.fromCharCode.apply(null, bytes));
}


/**
 * 将Base64字符串转换为Hex字符串
 * @param {string} base64String Base64格式的字符串
 * @returns {string} Hex格式的字符串
 */
function base64ToHex(base64String) {
    const binaryString = atob(base64String);
    let hexString = '';
    for (let i = 0; i < binaryString.length; i++) {
        hexString += ('0' + binaryString.charCodeAt(i).toString(16)).slice(-2);
    }
    return hexString;
}


/**
 * 加密解密工具类
 * 支持 RSA 和 SM4 算法
 */
class EncryptUtils {
    /**
     * ====================== RSA 加解密 ======================
     */

    /**
     * 生成 RSA 密钥对
     * 注：浏览器环境建议通过服务器生成
     * @returns {object} { publicKey, privateKey }
     */
    static generateRSAKeyPair() {
        throw new Error('浏览器环境不支持生成RSA密钥对，请使用服务器端生成');
    }

    /**
     * RSA 公钥加密
     * @param {string} data 要加密的数据
     * @param {string} publicKey PEM格式的公钥
     * @returns {string} Base64编码的加密结果
     */
    static rsaEncrypt(data, publicKey) {
        if (typeof JSEncrypt === 'undefined') {
            throw new Error('请先引入 JSEncrypt 库：<script src="https://cdn.jsdelivr.net/npm/jsencrypt@3.0.3/bin/jsencrypt.min.js"><\/script>');
        }
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        return encrypt.encrypt(data);
    }

    /**
     * RSA 私钥解密
     * @param {string} encryptedData Base64编码的加密数据
     * @param {string} privateKey PEM格式的私钥（默认使用文件中的 PrivateKey）
     * @returns {string} 解密后的原始数据
     */
    static rsaDecrypt(encryptedData, privateKey = PrivateKey) {
        if (typeof JSEncrypt === 'undefined') {
            throw new Error('请先引入 JSEncrypt 库：<script src="https://cdn.jsdelivr.net/npm/jsencrypt@3.0.3/bin/jsencrypt.min.js"><\/script>');
        }
        const decrypt = new JSEncrypt();
        decrypt.setPrivateKey(privateKey);
        const decrypted = decrypt.decrypt(encryptedData);
        if (!decrypted) {
            throw new Error('RSA解密失败，请检查加密数据和私钥是否匹配');
        }
        return decrypted;
    }

    /**
     * ====================== SM4 加解密 ======================
     */

    /**
     * SM4 加密 (ECB模式)
     * @param {string} data 要加密的数据
     * @param {string} key 16字节的密钥
     * @param {string} mode 加密模式，可选：'ecb'（默认） 或 'cbc'
     * @param {string} iv 16字节的初始化向量（CBC模式需要）
     * @returns {string} Base64编码的加密结果
     */
    static sm4Encrypt(data, key, mode = 'ecb', iv = '0000000000000000') {
        if (typeof key === 'string' && key.length !== 16) {
            throw new Error('字符串密钥必须是16个字符(16字节)');
        }

        // 将字符串密钥转换为字节数组
        const keyBytes = typeof key === 'string'
            ? Array.from(key).map(c => c.charCodeAt(0))
            : key;

        if (keyBytes.length !== 16) {
            throw new Error('密钥必须是16字节');
        }

        const options = { mode };
        if (mode === 'cbc') {
            const ivBytes = typeof iv === 'string'
                ? Array.from(iv).map(c => c.charCodeAt(0))
                : iv;
            if (ivBytes.length !== 16) {
                throw new Error('CBC模式需要16字节的IV');
            }
            options.iv = ivBytes;
        }

        // 获取hex格式的加密结果
        const hexResult = sm4.encrypt(data, keyBytes, options);

        // 将hex转换为Base64
        return hexToBase64(hexResult);
    }

    /**
     * SM4 解密
     * @param {string} encryptedData Base64编码的加密数据
     * @param {string} key 16字节的密钥（必须与加密时相同）
     * @param {string} mode 加密模式，必须与加密时一致
     * @param {string} iv 16字节的初始化向量（如果加密时使用了）
     * @returns {string} 解密后的原始数据
     */
    static sm4Decrypt(encryptedData, key, mode = 'ecb', iv = '0000000000000000') {
        if (typeof key === 'string' && key.length !== 16) {
            throw new Error('字符串密钥必须是16个字符(16字节)');
        }

        // 将Base64格式转换为Hex格式（sm-crypto需要的输入格式）
        const hexData = base64ToHex(encryptedData);

        // 将字符串密钥转换为字节数组
        const keyBytes = typeof key === 'string'
            ? Array.from(key).map(c => c.charCodeAt(0))
            : key;

        if (keyBytes.length !== 16) {
            throw new Error('密钥必须是16字节');
        }

        const options = { mode };
        if (mode === 'cbc') {
            const ivBytes = typeof iv === 'string'
                ? Array.from(iv).map(c => c.charCodeAt(0))
                : iv;
            if (ivBytes.length !== 16) {
                throw new Error('CBC模式需要16字节的IV');
            }
            options.iv = ivBytes;
        }

        // 使用sm-crypto进行解密
        return sm4.decrypt(hexData, keyBytes, options);
    }

    /**
     * 生成随机SM4密钥
     * @returns {string} 16字节的随机密钥
     */
    static generateSM4Key() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 16; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * ====================== 辅助方法 ======================
     */

    /**
     * Base64编码
     */
    static base64Encode(data) {
        return btoa(unescape(encodeURIComponent(data)));
    }

    /**
     * Base64解码
     */
    static base64Decode(data) {
        return decodeURIComponent(escape(atob(data)));
    }
}

// 浏览器环境下导出到全局作用域
if (typeof window !== 'undefined') {
    window.EncryptUtils = EncryptUtils;
}