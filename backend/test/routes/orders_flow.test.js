const request = require('supertest')
const app = require('../../src/app')
const OrderService = require('../../src/services/orderService')
const UserService = require('../../src/services/userService')
const jwt = require('jsonwebtoken')

describe('Order Flow (Create -> Pay)', () => {
  let token
  let userId
  let userPhone = '13800000000'

  beforeAll(async () => {
    // Ensure DB is ready
    await OrderService.init()
    // Create a user for testing
    const user = await UserService.createUser({
      username: 'testuser',
      password: 'password',
      phone: userPhone,
      email: 'test@example.com'
    })
    userId = user.id
    token = jwt.sign({ userId, phone: userPhone }, process.env.JWT_SECRET || 'your-secret-key')
  })

  it('should create an unpaid order and then update status on payment', async () => {
    // 1. Create Order (Unpaid)
    const payload = {
      productTitle: 'Test Flight',
      totalAmount: 1000,
      status: 'pending_payment'
    }
    const createRes = await request(app)
      .post('/api/orders/create')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
    
    expect(createRes.status).toBe(201)
    expect(createRes.body.status).toBe('pending_payment')
    const orderId = createRes.body.orderId

    // Verify in DB
    const orderBefore = await OrderService.findOrderById(orderId)
    expect(orderBefore.orderStatus).toBe('pending_payment')

    // 2. Pay (Update Status)
    const payRes = await request(app)
      .post(`/api/orders/${orderId}/pay`)
      .set('Authorization', `Bearer ${token}`)
      .send({ method: 'confirmed' })

    expect(payRes.status).toBe(200)

    // Verify in DB
    const orderAfter = await OrderService.findOrderById(orderId)
    expect(orderAfter.orderStatus).toBe('pending_travel')
  })
})
