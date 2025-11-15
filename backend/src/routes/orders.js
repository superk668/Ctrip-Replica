const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
  const { flightId, packageId, passengers, contact } = req.body || {}
  if (!flightId || !packageId || !Array.isArray(passengers) || passengers.length === 0 || !contact || !contact.phone) {
    return res.status(400).json({ error: 'Invalid order payload.' })
  }
  if (String(contact.phone) === '13800138001') return res.status(409).json({ error: 'Inventory not enough.' })
  const orderId = 'ORD-' + Math.random().toString(36).slice(2, 10)
  const amount = 620
  res.status(201).json({ orderId, amount, status: 'pending_payment' })
})

router.get('/:orderId', (req, res) => {
  const { orderId } = req.params
  if (!orderId) return res.status(404).json({ error: 'Order not found.' })
  res.status(200).json({ orderId, status: 'pending_payment', passengers: [], amount: 620 })
})

router.post('/:orderId/pay', (req, res) => {
  const { orderId } = req.params
  const { method } = req.body || {}
  if (!orderId || !method) return res.status(400).json({ error: 'Invalid payment info.' })
  res.status(200).json({ paymentId: 'PAY-' + Math.random().toString(36).slice(2,8), redirectUrl: 'https://example.com/pay' })
})

router.get('/:orderId/status', (req, res) => {
  const { orderId } = req.params
  if (!orderId) return res.status(404).json({ error: 'Order not found.' })
  res.status(200).json({ status: 'pending_payment' })
})

router.get('/:orderId/ticket', (req, res) => {
  const { orderId } = req.params
  if (!orderId) return res.status(404).json({ error: 'Ticket not found.' })
  res.status(200).json({ ticketNo: 'ETKT-' + Math.random().toString(36).slice(2,8), issuedAt: new Date().toISOString(), itinerary: {} })
})

router.post('/:orderId/issue', (req, res) => {
  const { orderId } = req.params
  if (!orderId) return res.status(404).json({ error: 'Order not found.' })
  res.status(200).json({ ticketNo: 'ETKT-' + Math.random().toString(36).slice(2,8) })
})

module.exports = router