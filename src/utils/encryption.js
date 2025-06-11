import CryptoJS from 'crypto-js';

// 加密密钥 - 在实际应用中应该更安全地管理
const SECRET_KEY = 'AllcareRecordWeb2024SecretKey';

/**
 * 加密数据
 * @param {any} data - 要加密的数据
 * @returns {string} 加密后的字符串
 */
export const encryptData = (data) => {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('加密失败:', error);
    return null;
  }
};

/**
 * 解密数据
 * @param {string} encryptedData - 加密的数据
 * @returns {any} 解密后的数据
 */
export const decryptData = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
};

/**
 * 安全存储数据到 localStorage
 * @param {string} key - 存储键
 * @param {any} data - 要存储的数据
 */
export const secureStore = (key, data) => {
  try {
    const encrypted = encryptData(data);
    if (encrypted) {
      localStorage.setItem(key, encrypted);
      return true;
    }
    return false;
  } catch (error) {
    console.error('存储失败:', error);
    return false;
  }
};

/**
 * 从 localStorage 安全读取数据
 * @param {string} key - 存储键
 * @returns {any} 解密后的数据
 */
export const secureRetrieve = (key) => {
  try {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData(encrypted);
  } catch (error) {
    console.error('读取失败:', error);
    return null;
  }
};

/**
 * 删除存储的数据
 * @param {string} key - 存储键
 */
export const secureRemove = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('删除失败:', error);
    return false;
  }
};

/**
 * 清除所有存储的数据
 */
export const secureClearAll = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('清除失败:', error);
    return false;
  }
};
