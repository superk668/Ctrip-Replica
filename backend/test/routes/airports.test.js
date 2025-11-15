const request = require('supertest')
const app = require('../../src/app')

describe('机场联想接口', () => {
  it('应返回最多20条联想结果并状态码200', async () => {
    const res = await request(app).get('/api/airports/suggest').query({ query: 'sha' })
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.suggestions)).toBe(true)
    expect(res.body.suggestions.length).toBeLessThanOrEqual(20)
    const item = res.body.suggestions[0]
    expect(item).toHaveProperty('city')
    expect(item).toHaveProperty('cityCode')
    expect(item).toHaveProperty('airport')
    expect(item).toHaveProperty('airportCode')
    expect(item).toHaveProperty('hot')
  })

  it('非法关键词应返回400', async () => {
    const res = await request(app).get('/api/airports/suggest').query({ query: '' })
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })
})