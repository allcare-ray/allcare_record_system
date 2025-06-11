import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

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
    const data = await fs.readFile(DATA_FILES[type], 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取${type}数据失败:`, error);
    return [];
  }
}

// 写入数据文件
async function writeDataFile(type, data) {
  try {
    await fs.writeFile(DATA_FILES[type], JSON.stringify(data, null, 2));
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
