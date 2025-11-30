const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// 数据库文件路径
const DB_PATH = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.join(__dirname, '../../database.sqlite');

// 创建数据库连接
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('数据库连接失败:', err.message);
  } else {
    console.log('数据库连接成功');
  }
});

// 初始化数据库表（幂等）
let initPromise = null;
const initDatabase = () => {
  if (initPromise) return initPromise;
  initPromise = new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE,
          email TEXT UNIQUE,
          phone TEXT UNIQUE,
          password_hash TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS verification_codes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          phone TEXT NOT NULL,
          code TEXT NOT NULL,
          type TEXT NOT NULL,
          expires_at DATETIME NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          order_id TEXT UNIQUE,
          user_id INTEGER NOT NULL,
          product_type TEXT,
          product_title TEXT,
          order_date DATETIME,
          total_amount REAL,
          status TEXT,
          details TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS travelers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          cn_name TEXT,
          en_last TEXT,
          en_first TEXT,
          nationality TEXT,
          gender TEXT,
          birthday DATETIME,
          birthplace TEXT,
          phone TEXT,
          fax TEXT,
          email TEXT,
          document_type TEXT,
          document_no TEXT,
          document_valid_till DATETIME,
          document_long_term BOOLEAN,
          is_self BOOLEAN DEFAULT FALSE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL UNIQUE,
          nickname TEXT,
          name TEXT,
          gender TEXT,
          birthday DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      console.log('数据库表初始化完成');
      resolve();
    });
  });
  return initPromise;
};

// 清理个人中心相关数据（开发初始化）
const clearPersonalCenterData = () => new Promise((resolve, reject) => {
  db.all('SELECT name FROM sqlite_master WHERE type = "table"', [], (err, rows) => {
    if (err) return reject(err);
    const has = (t) => Array.isArray(rows) && rows.some((r) => String(r.name) === t);
    db.serialize(() => {
      if (has('users')) db.run('DELETE FROM users');
      if (has('verification_codes')) db.run('DELETE FROM verification_codes');
      if (has('orders')) db.run('DELETE FROM orders');
      if (has('travelers')) db.run('DELETE FROM travelers');
      if (has('contacts')) db.run('DELETE FROM contacts');
      if (has('profiles')) db.run('DELETE FROM profiles');
      resolve();
    });
  });
});

const clearUserData = (userId) => new Promise((resolve, reject) => {
  db.all('SELECT name FROM sqlite_master WHERE type = "table"', [], (err, rows) => {
    if (err) return reject(err);
    const has = (t) => Array.isArray(rows) && rows.some((r) => String(r.name) === t);
    db.serialize(() => {
      if (has('orders')) db.run('DELETE FROM orders WHERE user_id = ?', [userId]);
      if (has('travelers')) db.run('DELETE FROM travelers WHERE user_id = ?', [userId]);
      if (has('contacts')) db.run('DELETE FROM contacts WHERE user_id = ?', [userId]);
      if (has('profiles')) db.run('DELETE FROM profiles WHERE user_id = ?', [userId]);
      resolve();
    });
  });
});

// 生成开发者账户：用户名/密码均为 dev，手机号为 13812345678
const seedDeveloperAccount = () => new Promise((resolve, reject) => {
  const username = 'dev';
  const phone = '13812345678';
  const bcrypt = require('bcrypt');
  db.get('SELECT id FROM users WHERE username = ? OR phone = ?', [username, phone], async (err, row) => {
    if (err) return reject(err);
    if (row) return resolve();
    try {
      const hash = await bcrypt.hash('dev', 10);
      db.run('INSERT INTO users (username, phone, password_hash) VALUES (?, ?, ?)', [username, phone, hash], (e) => {
        if (e) return reject(e);
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
});

module.exports = {
  db,
  initDatabase,
  clearPersonalCenterData,
  clearUserData,
  seedDeveloperAccount
};
