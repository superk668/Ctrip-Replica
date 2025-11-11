const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/auth/send-verification-code', () => {
  it('should send verification code to a valid phone number', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-code')
      .send({
        phoneNumber: '13800138000',
        type: 'login',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Verification code sent successfully.');
  });

  it('should return error for invalid phone number', async () => {
    const res = await request(app)
      .post('/api/auth/send-verification-code')
      .send({
        phoneNumber: '123',
        type: 'login',
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Invalid phone number format.');
  });
});