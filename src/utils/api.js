// API 基础配置
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' // 生产环境使用相对路径
  : 'http://localhost:3001'; // 开发环境使用本地服务器

/**
 * 发送 API 请求
 * @param {string} endpoint - API 端点
 * @param {object} options - 请求选项
 * @returns {Promise} 响应数据
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

/**
 * 获取所有数据
 * @returns {Promise<object>} 所有数据
 */
export async function getAllData() {
  return await apiRequest('/data');
}

/**
 * 获取特定类型的数据
 * @param {string} type - 数据类型
 * @returns {Promise<array>} 数据数组
 */
export async function getData(type) {
  return await apiRequest(`/data/${type}`);
}

/**
 * 保存特定类型的数据
 * @param {string} type - 数据类型
 * @param {array} data - 数据数组
 * @returns {Promise<object>} 响应结果
 */
export async function saveData(type, data) {
  return await apiRequest(`/data/${type}`, {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
}

/**
 * 批量保存所有数据
 * @param {object} allData - 所有数据对象
 * @returns {Promise<object>} 响应结果
 */
export async function saveAllData(allData) {
  return await apiRequest('/data', {
    method: 'POST',
    body: JSON.stringify({ data: allData }),
  });
}

/**
 * 安全存储数据（兼容旧的加密接口）
 * @param {string} key - 存储键
 * @param {any} data - 要存储的数据
 * @returns {Promise<boolean>} 是否成功
 */
export async function secureStore(key, data) {
  try {
    await saveData(key, data);
    return true;
  } catch (error) {
    console.error('存储失败:', error);
    return false;
  }
}

/**
 * 安全读取数据（兼容旧的加密接口）
 * @param {string} key - 存储键
 * @returns {Promise<any>} 读取的数据
 */
export async function secureRetrieve(key) {
  try {
    return await getData(key);
  } catch (error) {
    console.error('读取失败:', error);
    return null;
  }
}

/**
 * 删除存储的数据（兼容旧的加密接口）
 * @param {string} key - 存储键
 * @returns {Promise<boolean>} 是否成功
 */
export async function secureRemove(key) {
  try {
    await saveData(key, []);
    return true;
  } catch (error) {
    console.error('删除失败:', error);
    return false;
  }
}

/**
 * 清除所有存储的数据（兼容旧的加密接口）
 * @returns {Promise<boolean>} 是否成功
 */
export async function secureClearAll() {
  try {
    const emptyData = {
      customers: [],
      employees: [],
      customerPoints: [],
      employeePoints: [],
      customerPointRecords: [],
      employeePointRecords: []
    };
    await saveAllData(emptyData);
    return true;
  } catch (error) {
    console.error('清除失败:', error);
    return false;
  }
}
