const app = require('./app');
const { initDatabase } = require('./db');

const PORT = process.env.PORT || 3000;

// 初始化数据库并启动服务器
async function startServer() {
  try {
    await initDatabase();
    console.log('数据库初始化完成');
    
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };