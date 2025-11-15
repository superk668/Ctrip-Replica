const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const { initDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// 确保数据库在任何请求之前初始化完成（包括测试环境）
const dbReady = initDatabase();
app.use(async (req, res, next) => {
  try {
    await dbReady;
    next();
  } catch (e) {
    console.error('数据库初始化失败:', e);
    res.status(500).json({ error: '数据库初始化失败' });
  }
});

// 安全中间件
app.use(helmet());
app.use(cors());

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP每15分钟最多100个请求
});
app.use(limiter);

// 解析JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/orders', orderRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务器
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
  });
}

module.exports = app;