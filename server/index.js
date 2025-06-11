import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import CryptoJS from 'crypto-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 加密密钥
const SECRET_KEY = 'AllcareRecordWeb2024SecretKey';

// 加密函数
function encryptData(data) {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('加密失败:', error);
    return null;
  }
}

// 解密函数
function decryptData(encryptedData) {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('解密失败:', error);
    return null;
  }
}

// 中间件
app.use(cors());
app.use(express.json());

// 数据文件路径
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILES = {
  customers: path.join(DATA_DIR, 'customers.json'),
  employees: path.join(DATA_DIR, 'employees.json'),
  customerPoints: path.join(DATA_DIR, 'customerPoints.json'),
  employeePoints: path.join(DATA_DIR, 'employeePoints.json'),
  customerPointRecords: path.join(DATA_DIR, 'customerPointRecords.json'),
  employeePointRecords: path.join(DATA_DIR, 'employeePointRecords.json')
};

// 确保数据目录存在
async function ensureDataDirectory() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  
  // 确保所有数据文件存在
  for (const [key, filePath] of Object.entries(DATA_FILES)) {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify([], null, 2));
    }
  }
}

// 读取数据文件
async function readDataFile(type) {
  try {
    const encryptedData = await fs.readFile(DATA_FILES[type], 'utf8');

    // 如果文件为空或只包含空数组，直接返回空数组
    if (!encryptedData || encryptedData.trim() === '[]') {
      return [];
    }

    // 尝试解密数据
    const decryptedData = decryptData(encryptedData);
    if (decryptedData !== null) {
      return decryptedData;
    }

    // 如果解密失败，尝试直接解析（兼容未加密的旧数据）
    try {
      return JSON.parse(encryptedData);
    } catch {
      console.warn(`${type}数据解密和解析都失败，返回空数组`);
      return [];
    }
  } catch (error) {
    console.error(`读取${type}数据失败:`, error);
    return [];
  }
}

// 写入数据文件
async function writeDataFile(type, data) {
  try {
    // 加密数据
    const encryptedData = encryptData(data);
    if (encryptedData === null) {
      console.error(`加密${type}数据失败`);
      return false;
    }

    await fs.writeFile(DATA_FILES[type], encryptedData);
    console.log(`成功保存加密的${type}数据`);
    return true;
  } catch (error) {
    console.error(`写入${type}数据失败:`, error);
    return false;
  }
}

// API 路由

// 获取所有数据
app.get('/api/data', async (req, res) => {
  try {
    const data = {};
    for (const type of Object.keys(DATA_FILES)) {
      data[type] = await readDataFile(type);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 获取特定类型数据
app.get('/api/data/:type', async (req, res) => {
  const { type } = req.params;
  if (!DATA_FILES[type]) {
    return res.status(404).json({ error: '数据类型不存在' });
  }
  
  try {
    const data = await readDataFile(type);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '获取数据失败' });
  }
});

// 保存特定类型数据
app.post('/api/data/:type', async (req, res) => {
  const { type } = req.params;
  const { data } = req.body;
  
  if (!DATA_FILES[type]) {
    return res.status(404).json({ error: '数据类型不存在' });
  }
  
  try {
    const success = await writeDataFile(type, data);
    if (success) {
      res.json({ success: true, message: '数据保存成功' });
    } else {
      res.status(500).json({ error: '数据保存失败' });
    }
  } catch (error) {
    res.status(500).json({ error: '数据保存失败' });
  }
});

// 批量保存所有数据
app.post('/api/data', async (req, res) => {
  const { data } = req.body;
  
  try {
    const results = {};
    for (const [type, typeData] of Object.entries(data)) {
      if (DATA_FILES[type]) {
        results[type] = await writeDataFile(type, typeData);
      }
    }
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: '批量保存数据失败' });
  }
});

// 静态文件服务（生产环境）
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// 启动服务器
async function startServer() {
  await ensureDataDirectory();
  app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`数据存储目录: ${DATA_DIR}`);
  });
}

startServer().catch(console.error);
