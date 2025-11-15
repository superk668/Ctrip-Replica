<<<<<<< HEAD
const request = require('supertest')
const app = require('../../src/app')

describe('订单接口', () => {
  it('应创建订单并返回201与订单信息', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        flightId: 'F123',
        packageId: 'PKG1',
        passengers: [ { name: '张三', type: 'adult', documentType: 'id', documentNo: '110101199001010011' } ],
        contact: { phone: '13800138000' }
      })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('orderId')
    expect(res.body).toHaveProperty('amount')
    expect(res.body.status).toBe('pending_payment')
  })

  it('库存不足应返回409', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({
        flightId: 'F123',
        packageId: 'PKG1',
        passengers: [ { name: '李四', type: 'adult', documentType: 'id', documentNo: '110101199001010012' } ],
        contact: { phone: '13800138001' }
      })
    expect(res.status).toBe(409)
    expect(res.body.error).toBeDefined()
  })
})
=======
const request = require('supertest');
const express = require('express');
const ordersRouter = require('../../src/routes/orders');
const { db, initDatabase } = require('../../src/db');
const bcrypt = require('bcrypt');

const app = express();
app.use('/api/orders', ordersRouter);

describe('Order API', () => {
  beforeAll(async () => {
    await initDatabase();
    await new Promise((resolve) => {
      db.serialize(() => {
        db.run('DELETE FROM users');
        db.run('DELETE FROM orders');
        resolve();
      });
    });
    const hash = await bcrypt.hash('test1234', 10);
    await new Promise((resolve) => {
      db.run('INSERT INTO users (phone, password_hash, username) VALUES (?, ?, ?)', ['15874450027', hash, 'user_5027'], resolve);
    });
    await new Promise((resolve) => {
      db.run('INSERT INTO users (phone, password_hash, username) VALUES (?, ?, ?)', ['13900000000', hash, 'user_0000'], resolve);
    });
    const getUserId = async (phone) => new Promise((resolve) => {
      db.get('SELECT id FROM users WHERE phone = ?', [phone], (e, r) => resolve(r.id));
    });
    const uid1 = await getUserId('15874450027');
    const uid2 = await getUserId('13900000000');
    await new Promise((resolve) => {
      db.run('INSERT INTO orders (order_id, user_id, product_type, product_title, order_date, total_amount, status, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['order-OK', uid1, 'train', '张家界 → 慈利', new Date().toISOString(), 5.5, 'pending_travel', JSON.stringify({})], resolve);
    });
    await new Promise((resolve) => {
      db.run('INSERT INTO orders (order_id, user_id, product_type, product_title, order_date, total_amount, status, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['order-other', uid2, 'train', '张家界 → 慈利', new Date().toISOString(), 5.5, 'pending_travel', JSON.stringify({})], resolve);
    });
    await new Promise((resolve) => {
      db.run('INSERT INTO orders (order_id, user_id, product_type, product_title, order_date, total_amount, status, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['order-non-cancelable', uid1, 'train', '张家界 → 慈利', new Date().toISOString(), 5.5, 'pending_payment', JSON.stringify({})], resolve);
    });
    await new Promise((resolve) => {
      db.run('INSERT INTO orders (order_id, user_id, product_type, product_title, order_date, total_amount, status, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['order-download', uid1, 'train', '张家界 → 慈利', new Date().toISOString(), 5.5, 'pending_travel', JSON.stringify({})], resolve);
    });
  });

  // 测试获取订单列表 (GET /api/orders)
  describe('GET /api/orders', () => {
    it('成功请求后应返回200 OK及订单列表和分页信息', async () => {
      const response = await request(app).get('/api/orders?status=all&page=1&pageSize=10');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('orders');
      expect(response.body).toHaveProperty('pagination');
    });

    it('未登录用户请求应返回401 Unauthorized', async () => {
      // 模拟未登录状态，这里我们假设通过某种方式（例如，缺少token）可以判断
      const response = await request(app).get('/api/orders');
      // 根据骨架代码，目前会返回501，所以这个测试会失败
      expect(response.statusCode).toBe(401);
    });
  });

  // 测试获取订单详情 (GET /api/orders/:orderId)
  describe('GET /api/orders/:orderId', () => {
    it('成功请求后应返回200 OK及完整的订单详情', async () => {
      const response = await request(app).get('/api/orders/order-OK');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('orderId', 'order-OK');
    });

    it('如果订单不属于当前用户，应返回403 Forbidden', async () => {
      const response = await request(app).get('/api/orders/order-other');
      expect(response.statusCode).toBe(403);
    });

    it('如果订单ID不存在，应返回404 Not Found', async () => {
      const response = await request(app).get('/api/orders/non-existent-order-id');
      expect(response.statusCode).toBe(404);
    });
  });

  // 测试取消订单 (POST /api/orders/:orderId/cancel)
  describe('POST /api/orders/:orderId/cancel', () => {
    it('成功取消后应返回200 OK', async () => {
      const response = await request(app).post('/api/orders/order-OK/cancel');
      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Order cancelled successfully.');
    });

    it('如果订单状态不允许取消，应返回400 Bad Request', async () => {
      const response = await request(app).post('/api/orders/order-non-cancelable/cancel');
      expect(response.statusCode).toBe(400);
    });
  });

  // 测试下载订单TXT (GET /api/orders/:orderId/download)
  describe('GET /api/orders/:orderId/download', () => {
    it('成功请求后应返回200 OK及TXT文件流', async () => {
      const response = await request(app).get('/api/orders/order-download/download');
      expect(response.statusCode).toBe(200);
      expect(String(response.headers['content-type'] || '')).toContain('text/plain');
      expect(String(response.text || '')).toContain('订单号: order-download');
    });
  });
});
>>>>>>> 9eca3d52f2b796cafa8676a1e4b5b2950bae0e4f
