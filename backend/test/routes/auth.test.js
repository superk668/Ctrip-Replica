const request = require('supertest');
const app = require('../../src/app');
const { db } = require('../../src/db');

// 测试数据
const testUser = {
  username: 'testuser',
  password: 'Test123456',
  phone: '13800138000',
  code: '123456'
};

describe('认证接口测试', () => {
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

  describe('POST /api/auth/login', () => {
    it('应该使用正确的用户名和密码成功登录', async () => {
      // 首先创建一个测试用户
      await request(app)
        .post('/api/user/register-step2')
        .send({
          phone: '13800138001',
          password: testUser.password,
          verificationId: 'test-verification-id'
        });
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'user' + Date.now(),
          password: testUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.username).toBeTruthy();
    });

    it('应该拒绝错误的用户名或密码', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'wronguser',
          password: 'wrongpass'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('用户名或密码错误');
    });

    it('应该验证必填字段', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('参数验证失败');
    });
  });

  describe('POST /api/auth/send-code', () => {
    it('应该成功发送验证码', async () => {
      const response = await request(app)
        .post('/api/auth/send-code')
        .send({
          phone: testUser.phone,
          type: 'login'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('验证码发送成功');
    });

    it('应该验证手机号格式', async () => {
      const response = await request(app)
        .post('/api/auth/send-code')
        .send({
          phone: 'invalid-phone',
          type: 'login'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('参数验证失败');
    });

    it('应该验证验证码类型', async () => {
      const response = await request(app)
        .post('/api/auth/send-code')
        .send({
          phone: testUser.phone,
          type: 'invalid-type'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('参数验证失败');
    });
  });

  describe('POST /api/auth/phone-login', () => {
    it('应该使用正确的验证码成功登录', async () => {
      // 先注册该手机号的用户，保证只有已注册用户才能验证码登录
      await request(app)
        .post('/api/user/register-step2')
        .send({
          phone: testUser.phone,
          password: testUser.password,
          username: 'user_' + Date.now().toString().slice(-6)
        });
      // 首先发送验证码
      await request(app)
        .post('/api/auth/send-code')
        .send({
          phone: testUser.phone,
          type: 'login'
        });
      
      const response = await request(app)
        .post('/api/auth/phone-login')
        .send({
          phone: testUser.phone,
          code: testUser.code
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.phone).toBe(testUser.phone);
    });

    it('应该拒绝错误的验证码', async () => {
      const response = await request(app)
        .post('/api/auth/phone-login')
        .send({
          phone: testUser.phone,
          code: '000000'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('验证码错误或已过期');
    });

    it('应该验证必填字段', async () => {
      const response = await request(app)
        .post('/api/auth/phone-login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('参数验证失败');
    });

    it('应该拒绝未注册的手机号', async () => {
      const unregisteredPhone = '13900139000';

      // 为未注册的手机号发送验证码
      await request(app)
        .post('/api/auth/send-code')
        .send({ phone: unregisteredPhone, type: 'login' });

      // 使用正确验证码尝试登录，但由于未注册应被拒绝
      const response = await request(app)
        .post('/api/auth/phone-login')
        .send({ phone: unregisteredPhone, code: testUser.code });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('该手机号未注册，请先注册');
    });
  });
});