const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/auth/register-step1', () => {
  it('should return a temp token for valid phone and code', async () => {
    // This test requires a valid code from the send-verification-code endpoint
    // For simplicity, we'll assume a valid code is provided
    const res = await request(app)
      .post('/api/auth/register-step1')
      .send({
        phoneNumber: '13900139000',
        verificationCode: '123456', // Assume this is a valid code for testing
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tempToken');
  });

  it('should return error for invalid code', async () => {
    const res = await request(app)
      .post('/api/auth/register-step1')
      .send({
        phoneNumber: '13900139000',
        verificationCode: '000000',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('error', 'Invalid verification code.');
  });
});

describe('POST /api/auth/register-step2', () => {
  it('should create a new user with valid password and token', async () => {
    // This test requires a valid tempToken from the register-step1 endpoint
    const res = await request(app)
      .post('/api/auth/register-step2')
      .send({
        tempToken: 'some-valid-temp-token', // Assume a valid token
        password: 'Password123!',
        confirmPassword: 'Password123!',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Registration successful.');
  });

  it('should return error for mismatched passwords', async () => {
    const res = await request(app)
      .post('/api/auth/register-step2')
      .send({
        tempToken: 'some-valid-temp-token',
        password: 'Password123!',
        confirmPassword: 'Password1234',
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('error', 'Passwords do not match.');
  });
});