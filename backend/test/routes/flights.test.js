const request = require('supertest')
const app = require('../../src/app')
const jwt = require('jsonwebtoken')

describe('航班搜索接口', () => {
  it('单程搜索应返回航班与套餐并状态码200', async () => {
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'your-secret-key')
    const res = await request(app)
      .get('/api/flights/search')
      .query({
        trip: 'oneway',
        from: 'SHA',
        to: 'BJS',
        departDate: '2025-12-10',
        adults: 1,
        children: 0,
        infants: 0,
        cabin: 'economy',
        directOnly: false
      })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.flights)).toBe(true)
    const f = res.body.flights[0]
    expect(f).toHaveProperty('carrier')
    expect(f).toHaveProperty('flightNo')
    expect(f).toHaveProperty('from')
    expect(f).toHaveProperty('to')
    expect(Array.isArray(f.packages)).toBe(true)
    expect(f.packages[0]).toHaveProperty('id')
    expect(f.packages[0]).toHaveProperty('price')
    expect(f.packages[0]).toHaveProperty('refundable')
  })

  it('过去日期应返回400', async () => {
    const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'your-secret-key')
    const res = await request(app)
      .get('/api/flights/search')
      .query({ trip: 'oneway', from: 'SHA', to: 'BJS', departDate: '2020-01-01', adults: 1, children: 0, infants: 0, cabin: 'economy', directOnly: false })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  it('未认证应返回401', async () => {
    const res = await request(app)
      .get('/api/flights/search')
      .query({ trip: 'oneway', from: 'SHA', to: 'BJS', departDate: '2025-12-10', adults: 1, children: 0, infants: 0, cabin: 'economy', directOnly: false })
    expect(res.status).toBe(401)
  })
})