# 携程网站复制版 (Ctrip Replica)

一个基于现代Web技术栈构建的携程网站复制版，实现了用户认证、机票搜索、目的地推荐等核心功能。

## 📋 项目概述

本项目旨在复制携程网站的核心功能，包括：
- 用户注册与登录系统
- 机票搜索与预订
- 热门目的地推荐
- 响应式用户界面设计

## 🏗️ 技术架构

### 前端技术栈
- **React 18** - 现代化的用户界面框架
- **TypeScript** - 类型安全的JavaScript超集
- **React Router DOM** - 客户端路由管理
- **Vite** - 快速的构建工具和开发服务器
- **CSS3** - 现代化样式设计

### 后端技术栈
- **Node.js** - JavaScript运行时环境
- **Express.js** - Web应用框架
- **SQLite** - 轻量级关系型数据库
- **JWT** - JSON Web Token身份验证
- **bcryptjs** - 密码加密
- **Joi** - 数据验证

### 开发工具
- **ESLint** - 代码质量检查
- **Vitest** - 前端单元测试
- **Jest** - 后端单元测试
- **Nodemon** - 开发环境自动重启

## 📁 项目结构

```
Ctrip-Replica/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/       # React组件
│   │   │   ├── CitySelector.tsx
│   │   │   ├── FlightSearchForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── pages/           # 页面组件
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/        # API服务
│   │   ├── styles/          # 样式文件
│   │   ├── types/           # TypeScript类型定义
│   │   └── utils/           # 工具函数
│   ├── test/                # 测试文件
│   └── package.json
├── backend/                 # 后端服务
│   ├── src/
│   │   ├── config/          # 配置文件
│   │   ├── middleware/      # 中间件
│   │   ├── models/          # 数据模型
│   │   │   ├── User.js
│   │   │   ├── City.js
│   │   │   └── Destination.js
│   │   ├── routes/          # 路由处理
│   │   │   ├── auth.js
│   │   │   └── travel.js
│   │   ├── services/        # 业务逻辑
│   │   └── app.js           # 应用入口
│   ├── test/                # 测试文件
│   └── package.json
├── images/                  # 项目截图
├── requirements.md          # 需求文档
└── README.md               # 项目说明
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

1. **克隆项目**
```bash
git clone <repository-url>
cd Ctrip-Replica
```

2. **安装前端依赖**
```bash
cd frontend
npm install
```

3. **安装后端依赖**
```bash
cd ../backend
npm install
```

### 启动开发环境

1. **启动后端服务**
```bash
cd backend
npm run dev
```
后端服务将在 `http://localhost:3000` 启动

2. **启动前端应用**
```bash
cd frontend
npm run dev
```
前端应用将在 `http://localhost:5173` 启动

## 🔧 可用脚本

### 前端脚本
```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产构建
npm run test         # 运行测试
npm run test:ui      # 运行测试UI
npm run test:coverage # 生成测试覆盖率报告
```

### 后端脚本
```bash
npm start            # 启动生产服务器
npm run dev          # 启动开发服务器
npm run test         # 运行测试
npm run test:watch   # 监听模式运行测试
npm run test:coverage # 生成测试覆盖率报告
```

## 📱 功能特性

### 用户认证系统
- **多种登录方式**：支持密码登录和验证码登录
- **分步注册流程**：手机验证 → 验证码确认 → 密码设置
- **第三方登录**：支持微信、QQ、支付宝等第三方登录（UI展示）
- **安全性**：JWT token认证，密码加密存储

### 机票搜索功能
- **智能城市选择**：支持城市搜索和自动补全
- **灵活搜索选项**：单程/往返、乘客类型、舱位选择
- **日期选择器**：直观的出发和返程日期选择

### 目的地推荐
- **热门目的地**：展示热门旅游城市
- **特价机票**：推荐优惠机票信息
- **个性化推荐**：基于用户偏好的目的地推荐

### 用户界面
- **响应式设计**：适配桌面和移动设备
- **现代化UI**：简洁美观的界面设计
- **流畅交互**：优化的用户体验和动画效果

## 🔌 API接口

### 认证相关
- `POST /api/auth/register/send-code` - 发送注册验证码
- `POST /api/auth/register/verify` - 验证注册验证码
- `POST /api/auth/register/complete` - 完成注册
- `POST /api/auth/login/password` - 密码登录
- `POST /api/auth/login/send-code` - 发送登录验证码
- `POST /api/auth/login/verify` - 验证码登录

### 旅行相关
- `GET /api/travel/cities` - 获取城市列表
- `GET /api/travel/hot-destinations` - 获取热门目的地
- `GET /api/travel/promotional-flights` - 获取特价机票

## 🗄️ 数据库设计

项目使用SQLite数据库，包含以下主要表：

- **users** - 用户信息表
- **cities** - 城市信息表
- **destinations** - 目的地信息表
- **promotional_flights** - 特价机票表
- **verification_codes** - 验证码表

## 🧪 测试

### 前端测试
```bash
cd frontend
npm run test         # 运行所有测试
npm run test:ui      # 启动测试UI界面
npm run test:coverage # 生成覆盖率报告
```

### 后端测试
```bash
cd backend
npm run test         # 运行所有测试
npm run test:watch   # 监听模式
npm run test:coverage # 生成覆盖率报告
```

## 🚧 开发说明

### 测试版本特性
当前版本为开发测试版本，包含以下临时特性：

1. **验证码功能**：
   - 跳过实际短信发送
   - 接受任意6位数字作为有效验证码
   - 用于开发和测试阶段

2. **数据库**：
   - 使用SQLite轻量级数据库
   - 包含测试数据用于开发

### 代码规范
- 使用ESLint进行代码质量检查
- 遵循TypeScript严格模式
- 组件采用函数式编程风格
- API遵循RESTful设计原则

## 🔮 未来计划

- [ ] 实现真实短信验证码服务
- [ ] 添加机票预订功能
- [ ] 集成支付系统
- [ ] 添加订单管理
- [ ] 实现用户个人中心
- [ ] 优化移动端体验
- [ ] 添加国际化支持

## 📄 许可证

本项目仅用于学习和教育目的。

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues页面
- 邮箱：[your-email@example.com]

---

**注意**：本项目为携程网站的学习复制版本，仅用于技术学习和展示，不用于商业用途。
