const request = require('supertest');
const app = require('../../src/app');
const { db } = require('../../src/config/database');

// 测试数据
const testUser = {
  phone: '13800138001',
  code: '123456',
  password: 'Test123456',
  username: 'testuser1'
};

describe('用户接口测试', () => {
  beforeAll(async () => {
    // 初始化测试数据库
    await new Promise(resolve => {
      db.serialize(() => {
        // 清空测试数据
        db.run('DELETE FROM users');
        db.run('DELETE FROM verification_codes');
        resolve();
      });
    });
  });

  afterAll(async () => {
    // 关闭数据库连接
    db.close();
  });

  describe('POST /api/user/register-step1', () => {
    it('应该成功验证手机号和验证码', async () => {
      // TODO: 首先发送验证码
      
      const response = await request(app)
        .post('/api/user/register-step1')
        .send({
          phone: testUser.phone,
          code: testUser.code
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('验证成功');
    });

    it('应该拒绝错误的验证码', async () => {
      const response = await request(app)
        .post('/api/user/register-step1')
        .send({
          phone: testUser.phone,
          code: '000000'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('验证码错误或已过期');
    });

    it('应该拒绝已注册的手机号', async () => {
      // TODO: 首先创建一个用户
      
      const response = await request(app)
        .post('/api/user/register-step1')
        .send({
          phone: testUser.phone,
          code: testUser.code
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('该手机号已注册');
    });

    it('应该验证必填字段', async () => {
      const response = await request(app)
        .post('/api/user/register-step1')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('参数验证失败');
    });
  });

  describe('POST /api/user/register-step2', () => {
    it('应该成功创建用户', async () => {
      // TODO: 首先完成第一步验证
      
      const response = await request(app)
        .post('/api/user/register-step2')
        .send({
          phone: testUser.phone,
          password: testUser.password,
          username: testUser.username
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.phone).toBe(testUser.phone);
      expect(response.body.data.user.username).toBe(testUser.username);
    });

    it('应该验证密码强度', async () => {
      const response = await request(app)
        .post('/api/user/register-step2')
        .send({
          phone: testUser.phone,
          password: '123',
          username: testUser.username
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('参数验证失败');
    });

    it('应该验证用户名格式', async () => {
      const response = await request(app)
        .post('/api/user/register-step2')
        .send({
          phone: testUser.phone,
          password: testUser.password,
          username: 'ab' // 太短
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('参数验证失败');
    });

    it('应该验证必填字段', async () => {
      const response = await request(app)
        .post('/api/user/register-step2')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('参数验证失败');
    });
  });
});