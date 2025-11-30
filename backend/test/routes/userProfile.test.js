const request = require('supertest');
const app = require('../../src/app');
const { db } = require('../../src/config/database');

describe('User Profile & Travelers API', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Clear DB
    await new Promise(resolve => {
      db.serialize(() => {
        db.run('DELETE FROM users');
        db.run('DELETE FROM travelers');
        db.run('DELETE FROM profiles');
        resolve();
      });
    });

    // Create User and Login
    const phone = '13912345678';
    await request(app).post('/api/user/register-step2').send({
      phone,
      password: 'Password123'
    });

    const res = await request(app).post('/api/auth/login').send({
      username: phone,
      password: 'Password123'
    });
    token = res.body.data.token;
    userId = res.body.data.user.id;
  });

  afterAll(() => {
    db.close();
  });

  describe('Travelers API', () => {
    it('should list empty travelers initially', async () => {
      const res = await request(app)
        .get('/api/users/me/travelers')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.items).toEqual([]);
      expect(res.body.data.total).toBe(0);
    });

    it('should create a traveler', async () => {
      const res = await request(app)
        .post('/api/users/me/travelers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cnName: '张三',
          isSelf: false,
          document: { type: '身份证', no: '110101199001011234' }
        });
      expect(res.status).toBe(201);
      expect(res.body.data.id).toBeDefined();
    });

    it('should list travelers after creation', async () => {
      const res = await request(app)
        .get('/api/users/me/travelers')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.items.length).toBe(1);
      expect(res.body.data.items[0].cnName).toBe('张三');
    });

    it('should update a traveler', async () => {
      // First get list to get ID
      const listRes = await request(app)
        .get('/api/users/me/travelers')
        .set('Authorization', `Bearer ${token}`);
      const id = listRes.body.data.items[0].id;

      const res = await request(app)
        .put(`/api/users/me/travelers/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ cnName: '张三丰' });
      expect(res.status).toBe(200);

      // Verify update
      const getRes = await request(app)
        .get(`/api/users/me/travelers/${id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(getRes.body.data.traveler.cnName).toBe('张三丰');
    });

    it('should delete a traveler', async () => {
       const listRes = await request(app)
        .get('/api/users/me/travelers')
        .set('Authorization', `Bearer ${token}`);
      const id = listRes.body.data.items[0].id;

      const res = await request(app)
        .delete('/api/users/me/travelers')
        .set('Authorization', `Bearer ${token}`)
        .send({ ids: [id] });
      expect(res.status).toBe(200);
      expect(res.body.data.deleted).toBe(1);

      const listResAfter = await request(app)
        .get('/api/users/me/travelers')
        .set('Authorization', `Bearer ${token}`);
      expect(listResAfter.body.data.items.length).toBe(0);
    });

    it('should not delete self traveler', async () => {
      // Create self traveler
      const createRes = await request(app)
        .post('/api/users/me/travelers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          cnName: 'SelfUser',
          isSelf: true,
          document: { type: '护照', no: 'G12345678' }
        });
      expect(createRes.status).toBe(201);
      const id = createRes.body.data.id;

      // Try to delete
      const res = await request(app)
        .delete('/api/users/me/travelers')
        .set('Authorization', `Bearer ${token}`)
        .send({ ids: [id] });
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('Contains non-deletable travelers.');
    });
  });

  describe('Profile API', () => {
    it('should get initial profile', async () => {
      const res = await request(app)
        .get('/api/users/me/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.data.phoneMasked).toContain('****');
      expect(res.body.data.nickname).toBe('');
    });

    it('should reject invalid birthday', async () => {
      const res = await request(app)
        .patch('/api/users/me/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ birthday: '2099-01-01' }); // Future
      expect(res.status).toBe(400);
      expect(res.body.message).toContain('future');
      
      const res2 = await request(app)
        .patch('/api/users/me/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ birthday: 'invalid-date' });
      expect(res2.status).toBe(400);
      expect(res2.body.message).toContain('format');
    });

    it('should update profile', async () => {
      const res = await request(app)
        .patch('/api/users/me/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ nickname: 'TestNick', gender: '男' });
      expect(res.status).toBe(200);
      expect(res.body.data.nickname).toBe('TestNick');
      expect(res.body.data.gender).toBe('男');

      // Verify persistence
      const getRes = await request(app)
        .get('/api/users/me/profile')
        .set('Authorization', `Bearer ${token}`);
      expect(getRes.body.data.nickname).toBe('TestNick');
    });
  });
});
