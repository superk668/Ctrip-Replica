const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()

router.get('/search', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  try {
    if (!token) throw new Error('missing')
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { trip, from, to, departDate } = req.query
  if (!trip || !from || !to || !departDate) return res.status(400).json({ error: 'Invalid search conditions.' })
  const d = new Date(String(departDate))
  const today = new Date()
  today.setHours(0,0,0,0)
  if (isNaN(d.getTime()) || d < today) return res.status(400).json({ error: 'Depart date must be in the future.' })

  const seedStr = `${from}-${to}-${departDate}`
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) h = (h ^ seedStr.charCodeAt(i)) >>> 0, h = (h * 16777619) >>> 0
  const rand = () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return ((h >>> 0) % 1000) / 1000
  }
  const carriers = [
    { code: 'CA', name: '中国国航' },
    { code: 'MU', name: '东方航空' },
    { code: 'HU', name: '海南航空' },
    { code: 'CZ', name: '南方航空' },
    { code: 'SC', name: '山东航空' },
    { code: 'ZH', name: '深圳航空' }
  ]
  const models = ['空客A320','空客A321','空客A330-300','波音737-800','波音777-300ER','波音787-9']
  const airportMap = {
    SHA: { name: '虹桥', terminals: ['T1','T2'] },
    PVG: { name: '浦东', terminals: ['T1','T2'] },
    BJS: { name: '首都', terminals: ['T2','T3'] },
    PEK: { name: '首都', terminals: ['T2','T3'] },
    TSN: { name: '滨海', terminals: ['T1','T2'] },
    CKG: { name: '江北', terminals: ['T2','T3'] },
    NKG: { name: '禄口', terminals: ['T1','T2'] },
    HGH: { name: '萧山', terminals: ['T1','T2'] },
    CGO: { name: '新郑', terminals: ['T2'] },
    WUH: { name: '天河', terminals: ['T2'] },
    CAN: { name: '白云', terminals: ['T1','T2'] },
    CTU: { name: '双流', terminals: ['T1','T2'] },
    KMG: { name: '长水', terminals: ['T1'] },
    XIY: { name: '咸阳', terminals: ['T2','T3'] },
    URC: { name: '地窝堡', terminals: ['T2','T3'] }
  }
  const formatTime = (m) => {
    const hh = String(Math.floor(m / 60)).padStart(2, '0')
    const mm = String(m % 60).padStart(2, '0')
    return `${hh}:${mm}`
  }
  const len = 10 + Math.floor(rand() * 11)
  const baseDepartMinutes = 6 * 60
  const endDepartMinutes = 22 * 60 + 30
  const filters = {
    airline: String(req.query.airline || ''),
    timeSlot: String(req.query.timeSlot || ''),
    model: String(req.query.model || ''),
    cabin: String(req.query.cabin || '')
  }
  const flights = []
  for (let i = 0; i < len; i++) {
    const c = carriers[Math.floor(rand() * carriers.length)]
    const depMin = baseDepartMinutes + Math.floor(rand() * (endDepartMinutes - baseDepartMinutes))
    const dur = 100 + Math.floor(rand() * 60)
    const arrMin = depMin + dur
    const depTime = formatTime(depMin)
    const arrTime = formatTime(arrMin % (24 * 60))
    const plusDay = arrMin >= 24 * 60 ? 1 : 0
    const model = models[Math.floor(rand() * models.length)]
    const fromAirport = airportMap[from]?.name || from
    const toAirport = airportMap[to]?.name || to
    const fromTerminal = (airportMap[from]?.terminals || ['T2'])[Math.floor(rand()*((airportMap[from]?.terminals||['T2']).length))]
    const toTerminal = (airportMap[to]?.terminals || ['T3'])[Math.floor(rand()*((airportMap[to]?.terminals||['T3']).length))]
    const basePrice = 400 + Math.floor(rand() * 900)
    const econPrices = [0, 80, 150, 220, 300].map(delta => basePrice + delta)
    const firstBase = basePrice + 900
    const firstPrices = [0, 120, 250, 380, 500].map(delta => firstBase + delta)
    const econPkgs = [
      { id: `pkg-${i}-y1`, name: '经济舱·特价', cabin: 'Y', price: econPrices[0], refundable: false, baggage: { carry: 5, checkin: 0 } },
      { id: `pkg-${i}-y2`, name: '经济舱·省心', cabin: 'Y', price: econPrices[1], refundable: true, baggage: { carry: 5, checkin: 15 } },
      { id: `pkg-${i}-y3`, name: '经济舱·可退改', cabin: 'Y', price: econPrices[2], refundable: true, baggage: { carry: 5, checkin: 20 } },
      { id: `pkg-${i}-y4`, name: '经济舱·行李升级', cabin: 'Y', price: econPrices[3], refundable: true, baggage: { carry: 7, checkin: 23 } },
      { id: `pkg-${i}-y5`, name: '经济舱·灵活', cabin: 'Y', price: econPrices[4], refundable: true, baggage: { carry: 7, checkin: 28 } },
    ]
    const firstPkgs = [
      { id: `pkg-${i}-f1`, name: '头等舱·基础', cabin: 'F', price: firstPrices[0], refundable: true, baggage: { carry: 10, checkin: 30 } },
      { id: `pkg-${i}-f2`, name: '头等舱·尊享', cabin: 'F', price: firstPrices[1], refundable: true, baggage: { carry: 12, checkin: 32 } },
      { id: `pkg-${i}-f3`, name: '头等舱·可退改', cabin: 'F', price: firstPrices[2], refundable: true, baggage: { carry: 12, checkin: 35 } },
      { id: `pkg-${i}-f4`, name: '头等舱·行李升级', cabin: 'F', price: firstPrices[3], refundable: true, baggage: { carry: 15, checkin: 40 } },
      { id: `pkg-${i}-f5`, name: '头等舱·灵活', cabin: 'F', price: firstPrices[4], refundable: true, baggage: { carry: 15, checkin: 45 } },
    ]
    const pkgs = [...econPkgs, ...firstPkgs]
    const flight = {
      id: `${c.code}-${String(1000 + Math.floor(rand() * 9000))}`,
      carrier: c.code,
      flightNo: `${c.code}${String(1000 + Math.floor(rand() * 9000))}`,
      from: { airport: fromAirport, code: from, terminal: fromTerminal, time: depTime },
      to: { airport: toAirport, code: to, terminal: toTerminal, time: arrTime },
      duration: `${Math.floor(dur/60)}h${dur%60}m`,
      punctuality: 0.85 + rand() * 0.13,
      meals: true,
      packages: pkgs,
      model
    }
    flights.push(flight)
  }
  let filtered = flights
  if (filters.airline) filtered = filtered.filter(f => f.carrier === filters.airline)
  if (filters.model) filtered = filtered.filter(f => f.model === filters.model)
  if (filters.cabin) {
    const map = { economy: 'Y', premium: 'W', business: 'C', first: 'F' }
    const code = map[String(filters.cabin).toLowerCase()] || ''
    if (code) filtered = filtered.filter(f => f.packages.some(p => String(p.cabin) === code))
  }
  if (filters.timeSlot) {
    const m = /^([0-9]{2}:[0-9]{2})-([0-9]{2}:[0-9]{2})$/.exec(filters.timeSlot)
    if (m) {
      const toM = (t) => parseInt(t.slice(0,2))*60 + parseInt(t.slice(3,5))
      const startM = toM(m[1])
      const endM = toM(m[2])
      filtered = filtered.filter(f => {
        const dm = toM(f.from.time)
        return dm >= startM && dm < endM
      })
    }
  }
  res.status(200).json({ flights: filtered })
})

router.get('/:flightId/details', (req, res) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
  try {
    if (!token) throw new Error('missing')
    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const { flightId } = req.params
  if (!flightId) return res.status(404).json({ error: 'Flight not found.' })
  const details = { baggage: { carry: 5, checkin: 20 }, wifi: true, meals: true, rules: [ { cabin: 'Y', refundFee: 200, changeFee: 100 } ] }
  res.status(200).json({ details })
})

module.exports = router
