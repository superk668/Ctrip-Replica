const { db } = require('../config/database');

class AddressService {
  static listAddresses(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, receiver, province, city, district, detail, phone, created_at AS createdAt, updated_at AS updatedAt FROM addresses WHERE user_id = ? ORDER BY created_at DESC`,
        [userId],
        (err, rows) => err ? reject(err) : resolve(rows || [])
      );
    });
  }

  static createAddress(userId, data) {
    const sql = `INSERT INTO addresses (user_id, receiver, province, city, district, detail, phone) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [userId, data.receiver, data.province, data.city, data.district, data.detail, data.phone];
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      });
    });
  }

  static deleteAddress(userId, id) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM addresses WHERE user_id = ? AND id = ?',
        [userId, id],
        function(err) {
          if (err) return reject(err);
          resolve(this.changes || 0);
        }
      );
    });
  }
}

module.exports = AddressService;

