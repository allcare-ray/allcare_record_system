# Allcare Record System

一个基于React的客户和员工管理系统，包含积分管理和兑换记录功能。

## 功能特性

### 客户管理
- 客户信息的增删改查
- 客户详情查看
- 支持搜索和分页
- 状态和服务时数排序

### 员工管理
- 员工信息的增删改查
- 员工详情查看
- 支持搜索和分页
- 状态排序

### 积分管理
- 客户积分管理
- 员工积分管理
- 积分调整和批量调整
- 积分记录详情（支持搜索和分页）
- 编辑积分时自动记录调整原因

### 兑换记录
- 兑换记录管理
- 支持积分扣减
- 兑换记录详情（支持搜索和分页）
- 包含兑换时间、物品、兑换人、经办人信息

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **路由**: React Router
- **状态管理**: React Context API
- **数据存储**: LocalStorage

## 安装和运行

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式运行
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 通用组件
│   └── Pagination.jsx   # 分页组件
├── contexts/            # React Context
│   └── DataContext.jsx  # 数据管理上下文
├── pages/              # 页面组件
│   ├── Customers.jsx    # 客户管理
│   ├── CustomerForm.jsx # 客户表单
│   ├── Employees.jsx    # 员工管理
│   ├── EmployeeForm.jsx # 员工表单
│   ├── CustomerPoints.jsx # 客户积分管理
│   └── EmployeePoints.jsx # 员工积分管理
├── App.jsx             # 主应用组件
├── main.jsx           # 应用入口
└── index.css          # 全局样式
```

## 主要功能说明

### 数据管理
- 使用React Context API进行全局状态管理
- 数据持久化到LocalStorage
- 支持数据的增删改查操作

### 分页功能
- 自定义分页组件，支持页码跳转
- 可选择每页显示条数（10, 20, 50, 100）
- 响应式设计，移动端友好

### 搜索功能
- 支持多字段模糊搜索
- 实时搜索结果更新
- 搜索时自动重置到第一页

### 排序功能
- 支持按状态、服务时数等字段排序
- 升序/降序切换
- 可视化排序指示器

## 开发说明

### 添加新功能
1. 在相应的Context中添加数据操作函数
2. 创建或修改页面组件
3. 更新路由配置

### 样式定制
- 使用Tailwind CSS进行样式开发
- 主题色彩已预设，可在tailwind.config.js中修改

### 数据格式
- 客户数据包含：姓名、年龄、电话、邮箱、微信、城市、地址、服务时数、状态、备注
- 员工数据包含：姓名、年龄、电话、邮箱、微信、城市、地址、状态、备注
- 积分数据包含：用户ID、积分数量、开始日期、兑换记录、备注
- 积分记录包含：变化量、原因、时间戳等详细信息

## 许可证

MIT License
