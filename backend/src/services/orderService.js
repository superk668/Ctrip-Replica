const { db, initDatabase } = require('../db');

class OrderService {
  static async init() {
    return initDatabase();
  }
  static async findOrdersByUserId(userId, status, page, pageSize, productType = 'all') {
    const whereStatus = status === 'all' ? '' : 'AND status = ?';
    const whereProduct = productType === 'all' ? '' : 'AND product_type = ?';
    const filterParams = [userId];
    if (status !== 'all') filterParams.push(status);
    if (productType !== 'all') filterParams.push(productType);

    const count = await new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) AS cnt FROM orders WHERE user_id = ? ${whereStatus} ${whereProduct}`,
        filterParams,
        (err, row) => err ? reject(err) : resolve((row && row.cnt) || 0)
      );
    });
    const offset = (Number(page) - 1) * Number(pageSize);
    const data = await new Promise((resolve, reject) => {
      db.all(
        `SELECT order_id AS orderId, product_type AS productType, product_title AS productTitle, order_date AS orderDate, total_amount AS totalAmount, status AS orderStatus
         FROM orders WHERE user_id = ? ${whereStatus} ${whereProduct} ORDER BY datetime(order_date) DESC LIMIT ? OFFSET ?`,
        [...filterParams, Number(pageSize), offset],
        (err, rows) => err ? reject(err) : resolve(rows || [])
      );
    });
    const totalPages = Math.max(1, Math.ceil(Number(count) / Number(pageSize)) || 1);
    return { orders: data, pagination: { currentPage: Number(page), totalPages, totalCount: Number(count) } };
  }

  static async findOrderById(orderId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT id, order_id AS orderId, user_id AS userId, product_type AS productType, product_title AS productTitle, order_date AS orderDate, total_amount AS totalAmount, status AS orderStatus, details
         FROM orders WHERE order_id = ?`,
        [orderId],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return resolve(null);
          let details = {};
          try { details = row.details ? JSON.parse(row.details) : {}; } catch (_) {}
          resolve({ ...row, details });
        }
      );
    });
  }

  static async updateOrderStatus(orderId, status) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
        [status, orderId],
        (err) => err ? reject(err) : resolve()
      );
    });
  }
}

module.exports = OrderService;