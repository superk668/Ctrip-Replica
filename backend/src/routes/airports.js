const express = require('express')
const router = express.Router()

router.get('/suggest', (req, res) => {
  const q = String((req.query.query || '').trim())
  if (!q) return res.status(400).json({ error: 'Invalid query keyword.' })

  const all = [
    { city: '上海', cityCode: 'SHA', airport: '浦东国际机场', airportCode: 'PVG', hot: true },
    { city: '上海', cityCode: 'SHA', airport: '虹桥国际机场', airportCode: 'SHA', hot: true },
    { city: '北京', cityCode: 'BJS', airport: '首都国际机场', airportCode: 'PEK', hot: true },
    { city: '北京', cityCode: 'BJS', airport: '大兴国际机场', airportCode: 'PKX', hot: true },
    { city: '广州', cityCode: 'CAN', airport: '白云国际机场', airportCode: 'CAN', hot: true },
    { city: '深圳', cityCode: 'SZX', airport: '宝安国际机场', airportCode: 'SZX', hot: false },
    { city: '成都', cityCode: 'CTU', airport: '双流国际机场', airportCode: 'CTU', hot: false },
    { city: '重庆', cityCode: 'CKG', airport: '江北国际机场', airportCode: 'CKG', hot: false }
  ]

  const kw = q.toLowerCase()
  const matched = all.filter(x =>
    x.city.toLowerCase().includes(kw) ||
    x.airport.toLowerCase().includes(kw) ||
    x.airportCode.toLowerCase().includes(kw) ||
    x.cityCode.toLowerCase().includes(kw)
  ).slice(0, 20)

  res.status(200).json({ suggestions: matched })
})

module.exports = router