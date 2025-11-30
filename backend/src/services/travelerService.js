const { db } = require('../config/database');

class TravelerService {
  static listTravelers(userId, { keyword, page = 1, pageSize = 10 }) {
    return new Promise((resolve, reject) => {
      const offset = (page - 1) * pageSize;
      let sql = 'SELECT * FROM travelers WHERE user_id = ?';
      const params = [userId];

      if (keyword) {
        sql += ' AND (cn_name LIKE ? OR en_last LIKE ? OR en_first LIKE ?)';
        const like = `%${keyword}%`;
        params.push(like, like, like);
      }

      sql += ' ORDER BY is_self DESC, created_at DESC LIMIT ? OFFSET ?';
      params.push(pageSize, offset);

      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        
        // Get total count
        let countSql = 'SELECT COUNT(*) as total FROM travelers WHERE user_id = ?';
        const countParams = [userId];
        if (keyword) {
          countSql += ' AND (cn_name LIKE ? OR en_last LIKE ? OR en_first LIKE ?)';
          const like = `%${keyword}%`;
          countParams.push(like, like, like);
        }

        db.get(countSql, countParams, (err, result) => {
          if (err) return reject(err);
          resolve({
            items: rows.map(this.formatTraveler),
            total: result.total,
            page: parseInt(page),
            pageSize: parseInt(pageSize)
          });
        });
      });
    });
  }

  static getTraveler(userId, travelerId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM travelers WHERE id = ? AND user_id = ?', [travelerId, userId], (err, row) => {
        if (err) return reject(err);
        resolve(row ? this.formatTraveler(row) : null);
      });
    });
  }

  static createTraveler(userId, data) {
    return new Promise((resolve, reject) => {
      // Check for duplicate document if provided
      if (data.document && data.document.type && data.document.no) {
        const checkSql = 'SELECT id FROM travelers WHERE user_id = ? AND document_type = ? AND document_no = ?';
        db.get(checkSql, [userId, data.document.type, data.document.no], (err, row) => {
          if (err) return reject(err);
          if (row) return reject(new Error('Document already exists'));
          this._insertTraveler(userId, data, resolve, reject);
        });
      } else {
        this._insertTraveler(userId, data, resolve, reject);
      }
    });
  }

  static _insertTraveler(userId, data, resolve, reject) {
    const sql = `
      INSERT INTO travelers (
        user_id, cn_name, en_last, en_first, nationality, gender, birthday, birthplace,
        phone, fax, email, document_type, document_no, document_valid_till, document_long_term, is_self
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      userId,
      data.cnName,
      data.enLast,
      data.enFirst,
      data.nationality,
      data.gender,
      data.birthday,
      data.birthplace,
      data.phone,
      data.fax,
      data.email,
      data.document?.type,
      data.document?.no,
      data.document?.validTill,
      data.document?.longTerm ? 1 : 0,
      data.isSelf ? 1 : 0
    ];

    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID });
    });
  }

  static updateTraveler(userId, travelerId, data) {
    return new Promise((resolve, reject) => {
      // Check existence
      db.get('SELECT id FROM travelers WHERE id = ? AND user_id = ?', [travelerId, userId], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null); // Not found

        // If updating document, check duplicates
        if (data.document && data.document.type && data.document.no) {
           const checkSql = 'SELECT id FROM travelers WHERE user_id = ? AND document_type = ? AND document_no = ? AND id != ?';
           db.get(checkSql, [userId, data.document.type, data.document.no, travelerId], (err, dup) => {
             if (err) return reject(err);
             if (dup) return reject(new Error('Document already exists'));
             this._updateTraveler(travelerId, data, resolve, reject);
           });
        } else {
          this._updateTraveler(travelerId, data, resolve, reject);
        }
      });
    });
  }

  static _updateTraveler(travelerId, data, resolve, reject) {
    const updates = [];
    const params = [];

    const map = {
      cnName: 'cn_name',
      enLast: 'en_last',
      enFirst: 'en_first',
      nationality: 'nationality',
      gender: 'gender',
      birthday: 'birthday',
      birthplace: 'birthplace',
      phone: 'phone',
      fax: 'fax',
      email: 'email',
      isSelf: 'is_self'
    };

    Object.keys(map).forEach(key => {
      if (data[key] !== undefined) {
        updates.push(`${map[key]} = ?`);
        params.push(key === 'isSelf' ? (data[key] ? 1 : 0) : data[key]);
      }
    });

    if (data.document) {
      if (data.document.type !== undefined) { updates.push('document_type = ?'); params.push(data.document.type); }
      if (data.document.no !== undefined) { updates.push('document_no = ?'); params.push(data.document.no); }
      if (data.document.validTill !== undefined) { updates.push('document_valid_till = ?'); params.push(data.document.validTill); }
      if (data.document.longTerm !== undefined) { updates.push('document_long_term = ?'); params.push(data.document.longTerm ? 1 : 0); }
    }

    if (updates.length === 0) return resolve({ id: travelerId });

    updates.push('updated_at = CURRENT_TIMESTAMP');
    const sql = `UPDATE travelers SET ${updates.join(', ')} WHERE id = ?`;
    params.push(travelerId);

    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve({ id: travelerId });
    });
  }

  static deleteTravelers(userId, ids) {
    return new Promise((resolve, reject) => {
      if (!ids || ids.length === 0) return resolve(0);
      
      const placeholders = ids.map(() => '?').join(',');
      
      // Check for non-deletable travelers (is_self = 1)
      const checkSql = `SELECT id FROM travelers WHERE user_id = ? AND is_self = 1 AND id IN (${placeholders})`;
      const checkParams = [userId, ...ids];
      
      db.get(checkSql, checkParams, (err, row) => {
        if (err) return reject(err);
        if (row) return reject(new Error('Contains non-deletable travelers'));

        const sql = `DELETE FROM travelers WHERE user_id = ? AND id IN (${placeholders})`;
        const params = [userId, ...ids];
  
        db.run(sql, params, function(err) {
          if (err) return reject(err);
          resolve(this.changes);
        });
      });
    });
  }

  static formatTraveler(row) {
    return {
      id: row.id,
      cnName: row.cn_name,
      enLast: row.en_last,
      enFirst: row.en_first,
      name: row.cn_name || `${row.en_last || ''} ${row.en_first || ''}`.trim(), // Derived field for list view
      nationality: row.nationality,
      gender: row.gender,
      birthday: row.birthday,
      birthplace: row.birthplace,
      phone: row.phone,
      fax: row.fax,
      email: row.email,
      document: {
        type: row.document_type,
        no: row.document_no,
        validTill: row.document_valid_till,
        longTerm: !!row.document_long_term
      },
      isSelf: !!row.is_self
    };
  }
}

module.exports = TravelerService;
