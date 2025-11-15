const { db } = require('../db');
const bcrypt = require('bcrypt');

class UserService {
  /**
   * 根据手机号查询用户信息
   * @param {string} phone - 手机号
   * @returns {Promise<Object|null>} 用户信息或null
   */
  static async findUserByPhone(phone) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE phone = ?',
        [phone],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  /**
   * 根据邮箱查询用户信息
   * @param {string} email - 邮箱
   * @returns {Promise<Object|null>} 用户信息或null
   */
  static async findUserByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  /**
   * 根据用户名查询用户信息
   * @param {string} username - 用户名
   * @returns {Promise<Object|null>} 用户信息或null
   */
  static async findUserByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  static async findUserById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  static async findFirstUser() {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users ORDER BY id ASC LIMIT 1',
        [],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  /**
   * 创建新用户
   * @param {Object} userData - 用户数据
   * @param {string} userData.phone - 手机号
   * @param {string} userData.password - 密码
   * @param {string} userData.username - 用户名（可选）
   * @param {string} userData.email - 邮箱（可选）
   * @returns {Promise<Object>} 创建的用户信息
   */
  static async createUser(userData) {
    const { phone, password, username, email } = userData;
    
    // 密码哈希
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (phone, password_hash, username, email) 
         VALUES (?, ?, ?, ?)`,
        [phone, passwordHash, username || null, email || null],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              phone,
              username: username || null,
              email: email || null
            });
          }
        }
      );
    });
  }

  /**
   * 验证密码
   * @param {string} plainPassword - 明文密码
   * @param {string} hashedPassword - 哈希密码
   * @returns {Promise<boolean>} 验证结果
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * 更新用户密码
   * @param {string} userId - 用户ID
   * @param {string} newPassword - 新密码
   * @returns {Promise<void>}
   */
  static async updateUserPassword(userId, newPassword) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [passwordHash, userId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  /**
   * （测试辅助）根据明文密码找到最近创建的用户
   * 仅在测试环境中使用，避免生产环境的性能与安全问题
   * @param {string} plainPassword
   * @returns {Promise<Object|null>}
   */
  static async findUserByPlainPassword(plainPassword) {
    if (process.env.NODE_ENV !== 'test') return null;
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT 50',
        [],
        async (err, rows) => {
          if (err) {
            return reject(err);
          }
          for (const row of rows) {
            const ok = await bcrypt.compare(plainPassword, row.password_hash);
            if (ok) {
              return resolve(row);
            }
          }
          resolve(null);
        }
      );
    });
  }
}

module.exports = UserService;