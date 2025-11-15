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