import smCrypto from 'sm-crypto'
import CryptoJS  from 'crypto-js'
import { Base64 } from 'js-base64'
import crypto from 'crypto'


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
    return Buffer.from(hexString, 'hex').toString('base64');
}


/**
 * 将Base64字符串转换为Hex字符串
 * @param {string} base64String Base64格式的字符串
 * @returns {string} Hex格式的字符串
 */
function base64ToHex(base64String) {
    const bytes = Buffer.from(base64String, 'base64');
    return bytes.toString('hex');
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
   * @returns {object} { publicKey, privateKey }
   */
  static generateRSAKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
    return { publicKey, privateKey };
  }

  /**
   * RSA 公钥加密
   * @param {string} data 要加密的数据
   * @param {string} publicKey PEM格式的公钥
   * @param {string} padding 填充方式，可选：'OAEP'（默认） 或 'PKCS1'
   * @returns {string} Base64编码的加密结果
   */
  static rsaEncrypt(data, publicKey, padding = 'OAEP') {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: padding === 'OAEP' 
          ? crypto.constants.RSA_PKCS1_OAEP_PADDING
          : crypto.constants.RSA_PKCS1_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    );
    return encrypted.toString('base64');
  }

  /**
   * RSA 私钥解密
   * @param {string} encryptedData Base64编码的加密数据
   * @param {string} privateKey PEM格式的私钥
   * @param {string} padding 填充方式，必须与加密时一致
   * @returns {string} 解密后的原始数据
   */
  static rsaDecrypt(encryptedData, privateKey=PrivateKey, padding = '') {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: padding === 'OAEP' 
          ? crypto.constants.RSA_PKCS1_OAEP_PADDING
          : crypto.constants.RSA_PKCS1_PADDING,
        oaepHash: 'sha256'
      },
      buffer
    );
    return decrypted.toString('utf8');
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
      const hexResult = smCrypto.sm4.encrypt(data, keyBytes, options);
      
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
      return smCrypto.sm4.decrypt(hexData, keyBytes, options);
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
    return Base64.encode(data);
  }

  /**
   * Base64解码
   */
  static base64Decode(data) {
    return Base64.decode(data);
  }
}

export default EncryptUtils;