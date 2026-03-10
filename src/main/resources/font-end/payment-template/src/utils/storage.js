/**
 * 安全的本地存储工具
 * 处理隐私模式、存储空间满等异常情况
 */

import Message from '@/utils/message'

/**
 * 存储管理类
 */
class StorageManager {
  constructor(storage = localStorage, prefix = '') {
    this.storage = storage;
    this.prefix = prefix;
    this.isSupported = this.checkSupport();
    this.fallbackData = {}; // 降级时使用内存存储
    
    if (!this.isSupported) {
      console.warn(`[Storage] ${storage === localStorage ? 'localStorage' : 'sessionStorage'} is not supported, using memory fallback`);
    }
  }
  
  /**
   * 检测存储是否可用
   * @returns {boolean}
   */
  checkSupport() {
    try {
      const test = '__storage_test__';
      this.storage.setItem(test, test);
      this.storage.removeItem(test);
      return true;
    } catch(e) {
      return false;
    }
  }
  
  /**
   * 重新检测存储支持
   * 在某些场景下（如退出隐私模式），存储可能恢复可用
   */
  recheckSupport() {
    this.isSupported = this.checkSupport();
    return this.isSupported;
  }
  
  /**
   * 获取完整的键名（带前缀）
   * @param {string} key - 原始键
   * @returns {string}
   */
  getFullKey(key) {
    return this.prefix ? `${this.prefix}_${key}` : key;
  }
  
  /**
   * 获取存储项
   * @param {string} key - 键
   * @param {*} defaultValue - 默认值
   * @returns {*}
   */
  getItem(key, defaultValue = null) {
    const fullKey = this.getFullKey(key);
    
    // 如果存储不可用，使用内存数据
    if (!this.isSupported) {
      return this.fallbackData[fullKey] !== undefined 
        ? this.fallbackData[fullKey] 
        : defaultValue;
    }
    
    try {
      const value = this.storage.getItem(fullKey);
      
      if (value === null) {
        return defaultValue;
      }
      
      // 尝试解析 JSON
      try {
        return JSON.parse(value);
      } catch (e) {
        // 不是 JSON，返回原始字符串
        return value;
      }
    } catch(e) {
      console.error(`[Storage] getItem error for key "${fullKey}":`, e);
      
      // 返回内存数据或默认值
      return this.fallbackData[fullKey] !== undefined 
        ? this.fallbackData[fullKey] 
        : defaultValue;
    }
  }
  
  /**
   * 设置存储项
   * @param {string} key - 键
   * @param {*} value - 值（会自动 JSON 序列化）
   * @returns {boolean} 是否成功
   */
  setItem(key, value) {
    const fullKey = this.getFullKey(key);
    
    // 同时保存到内存（作为备份）
    this.fallbackData[fullKey] = value;
    
    // 如果存储不可用，只保存到内存
    if (!this.isSupported) {
      return true;
    }
    
    try {
      // 自动序列化对象
      const serializedValue = typeof value === 'object' 
        ? JSON.stringify(value) 
        : String(value);
      
      this.storage.setItem(fullKey, serializedValue);
      return true;
      
    } catch(e) {
      console.error(`[Storage] setItem error for key "${fullKey}":`, e);
      
      // 处理存储空间满的情况
      if (e.name === 'QuotaExceededError') {
        console.warn('[Storage] Storage quota exceeded, trying to clear old data...');
        
        // 尝试清理旧数据
        if (this.clearOldData()) {
          // 清理后重试
          try {
            const serializedValue = typeof value === 'object' 
              ? JSON.stringify(value) 
              : String(value);
            this.storage.setItem(fullKey, serializedValue);
            return true;
          } catch(e2) {
            console.error('[Storage] Still failed after clearing:', e2);
          }
        }
        
        // 提示用户
        Message.warning('存储空间不足，部分功能可能受限')
      }
      
      // 失败但至少保存到了内存
      return false;
    }
  }
  
  /**
   * 删除存储项
   * @param {string} key - 键
   * @returns {boolean}
   */
  removeItem(key) {
    const fullKey = this.getFullKey(key);
    
    // 删除内存数据
    delete this.fallbackData[fullKey];
    
    if (!this.isSupported) {
      return true;
    }
    
    try {
      this.storage.removeItem(fullKey);
      return true;
    } catch(e) {
      console.error(`[Storage] removeItem error for key "${fullKey}":`, e);
      return false;
    }
  }
  
  /**
   * 清空所有存储（只清理带前缀的）
   * @returns {boolean}
   */
  clear() {
    // 清空内存数据
    this.fallbackData = {};
    
    if (!this.isSupported) {
      return true;
    }
    
    try {
      if (this.prefix) {
        // 只清理带前缀的键
        const keys = this.getKeys();
        keys.forEach(key => this.removeItem(key));
      } else {
        // 清空所有
        this.storage.clear();
      }
      return true;
    } catch(e) {
      console.error('[Storage] clear error:', e);
      return false;
    }
  }
  
  /**
   * 获取所有键（不包含前缀）
   * @returns {string[]}
   */
  getKeys() {
    if (!this.isSupported) {
      return Object.keys(this.fallbackData).map(key => 
        this.prefix ? key.replace(`${this.prefix}_`, '') : key
      );
    }
    
    try {
      const allKeys = Object.keys(this.storage);
      
      if (this.prefix) {
        return allKeys
          .filter(key => key.startsWith(`${this.prefix}_`))
          .map(key => key.replace(`${this.prefix}_`, ''));
      }
      
      return allKeys;
    } catch(e) {
      console.error('[Storage] getKeys error:', e);
      return [];
    }
  }
  
  /**
   * 检查键是否存在
   * @param {string} key - 键
   * @returns {boolean}
   */
  hasItem(key) {
    const fullKey = this.getFullKey(key);
    
    if (!this.isSupported) {
      return fullKey in this.fallbackData;
    }
    
    try {
      return this.storage.getItem(fullKey) !== null;
    } catch(e) {
      return fullKey in this.fallbackData;
    }
  }
  
  /**
   * 获取存储大小（估算）
   * @returns {number} 字节数
   */
  getSize() {
    if (!this.isSupported) {
      return JSON.stringify(this.fallbackData).length;
    }
    
    try {
      let size = 0;
      const keys = this.prefix 
        ? Object.keys(this.storage).filter(k => k.startsWith(`${this.prefix}_`))
        : Object.keys(this.storage);
      
      keys.forEach(key => {
        const value = this.storage.getItem(key);
        size += key.length + (value ? value.length : 0);
      });
      
      return size;
    } catch(e) {
      console.error('[Storage] getSize error:', e);
      return 0;
    }
  }
  
  /**
   * 清理旧数据（按时间戳）
   * @param {number} maxAge - 最大保留时间（毫秒）
   * @returns {boolean}
   */
  clearOldData(maxAge = 7 * 24 * 60 * 60 * 1000) { // 默认7天
    if (!this.isSupported) {
      return false;
    }
    
    try {
      const now = Date.now();
      const keys = this.getKeys();
      let cleared = false;
      
      keys.forEach(key => {
        const value = this.getItem(key);
        
        // 如果值包含时间戳字段，检查是否过期
        if (value && typeof value === 'object' && value.timestamp) {
          if (now - value.timestamp > maxAge) {
            this.removeItem(key);
            cleared = true;
          }
        }
      });
      
      return cleared;
    } catch(e) {
      console.error('[Storage] clearOldData error:', e);
      return false;
    }
  }
}

// 创建实例
export const storage = new StorageManager(localStorage, '');
export const sessionStorage = new StorageManager(window.sessionStorage, '');

// 带前缀的实例（用于命名空间隔离）
export const createStorage = (prefix, useSession = false) => {
  return new StorageManager(
    useSession ? window.sessionStorage : localStorage, 
    prefix
  );
};

/**
 * 便捷方法（兼容原有 localStorage API）
 */
export const getItem = (key, defaultValue) => storage.getItem(key, defaultValue);
export const setItem = (key, value) => storage.setItem(key, value);
export const removeItem = (key) => storage.removeItem(key);
export const clear = () => storage.clear();
export const hasItem = (key) => storage.hasItem(key);
export const getKeys = () => storage.getKeys();

export default storage;


