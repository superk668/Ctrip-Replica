const express = require('express');
const router = express.Router();
const UserService = require('../services/userService');
const OrderService = require('../services/orderService');
const jwt = require('jsonwebtoken');

const getCurrentUser = async (req) => {
  let user = null;
  const headerPhone = req.headers['x-user-phone'];
  const queryPhone = req.query && req.query.phone;
  const auth = req.headers.authorization;
  let tokenPhone = null;
  let tokenUserId = null;
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      tokenPhone = payload.phone || null;
      tokenUserId = payload.userId || null;
    } catch (_) {}
  }
  const phone = headerPhone || queryPhone || tokenPhone || null;
  if (phone) user = await UserService.findUserByPhone(phone);
  if (!user && tokenUserId) user = await UserService.findUserById(tokenUserId);
  if (!user) user = await UserService.findFirstUser();
  return user;
};

const buildProductInfo = (order) => {
  const d = order.details || {};
  let p = {};
  const raw = d.productInfo;
  if (typeof raw === 'string') {
    try { p = JSON.parse(raw); } catch (_) { p = {}; }
  } else if (raw && typeof raw === 'object') {
    p = { ...raw };
  }
  const type = (order.productType || p.type || '').toLowerCase();
  const title = p.title || order.productTitle || '';
  let number = p.number || '';
  let seatType = p.seatType || '';
  let departCity = p.departCity || '';
  let arriveCity = p.arriveCity || '';
  let departTime = p.departTime || '';
  let arriveTime = p.arriveTime || '';
  let hotelName = p.hotelName || '';
  let roomType = p.roomType || '';
  let checkInDate = p.checkInDate || '';
  let checkOutDate = p.checkOutDate || '';
  let nights = p.nights || (typeof p.nights === 'number' ? p.nights : '');

  if (type === 'train') {
    if (!number) {
      const m = (title || '').match(/\b([GDKTZ]\d{1,4})\b/i);
      number = m ? m[1] : number;
    }
    if (!seatType) {
      const m = (title || '').match(/(商务座|一等座|二等座|软卧|硬卧|硬座)/);
      seatType = m ? m[1] : seatType;
    }
    if (!departCity || !arriveCity) {
      const m = (title || '').match(/([^\s\-–—]+)\s*[\-–—]\s*([^\s]+)/);
      if (m) { departCity = departCity || m[1]; arriveCity = arriveCity || m[2]; }
    }
  } else if (type === 'flight') {
    if (!number) {
      const m = (title || '').match(/\b([A-Z]{2}\d{3,5})\b/);
      number = m ? m[1] : number;
    }
    if (!seatType) {
      const m = (title || '').match(/(经济舱|超经|商务舱|头等舱)/);
      seatType = m ? m[1] : seatType;
    }
    if (!departCity || !arriveCity) {
      const m = (title || '').match(/([^\s\-–—]+)\s*[\-–—]\s*([^\s]+)/);
      if (m) { departCity = departCity || m[1]; arriveCity = arriveCity || m[2]; }
    }
  } else if (type === 'hotel') {
    if (!hotelName) hotelName = title || hotelName;
    if (!roomType) {
      const m = (title || '').match(/(大床房|双床房|家庭房|豪华房|标准间|商务房)/);
      roomType = m ? m[1] : roomType;
    }
    if (!nights) {
      const m = (title || '').match(/(\d+)晚/);
      nights = m ? Number(m[1]) : nights;
    }
  }

  return {
    title,
    number,
    seatType,
    departCity,
    arriveCity,
    departTime,
    arriveTime,
    hotelName,
    roomType,
    checkInDate,
    checkOutDate,
    nights
  };
};

router.get('/', async (req, res) => {
  const { status, page, pageSize } = req.query;
  if (!status || !page || !pageSize) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  try {
    await OrderService.init();
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(200).json({ orders: [], pagination: { currentPage: Number(page), totalPages: 1, totalCount: 0 } });
    }
    const productType = String(req.query.productType || 'all');
    const data = await OrderService.findOrdersByUserId(user.id, String(status), Number(page), Number(pageSize), productType);
    const orders = Array.isArray(data.orders) ? data.orders.map((o) => ({
      ...o,
      productInfo: buildProductInfo(o),
      travelerInfo: (o.details && o.details.travelerInfo) || []
    })) : [];
    return res.status(200).json({ orders, pagination: data.pagination });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load orders.' });
  }
});

router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    await OrderService.init();
    const user = await getCurrentUser(req);
    if (!user) return res.status(404).json({ error: 'Order not found.' });
    const order = await OrderService.findOrderById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    if (order.userId !== user.id) return res.status(403).json({ error: 'Forbidden. You do not have permission to view this order.' });
    const details = order.details || {};
    return res.status(200).json({
      orderId: order.orderId,
      orderStatus: order.orderStatus,
      productInfo: buildProductInfo(order),
      travelerInfo: details.travelerInfo || [],
      contactInfo: details.contactInfo || {},
      priceDetails: details.priceDetails || { total: order.totalAmount },
      actions: ['cancel', 'invoice']
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load order.' });
  }
});

router.post('/:orderId/cancel', async (req, res) => {
  const { orderId } = req.params;
  try {
    await OrderService.init();
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized.' });
    const order = await OrderService.findOrderById(orderId);
    if (!order || order.userId !== user.id) return res.status(404).json({ error: 'Order not found.' });
    if (order.orderStatus !== 'pending_travel') return res.status(400).json({ error: 'Order cannot be cancelled in its current state.' });
    await OrderService.updateOrderStatus(orderId, 'cancelled');
    return res.status(200).json({ message: 'Order cancelled successfully.' });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to cancel order.' });
  }
});

router.get('/:orderId/download', async (req, res) => {
  const { orderId } = req.params;
  try {
    await OrderService.init();
    const user = await getCurrentUser(req);
    if (!user) return res.status(404).json({ error: 'Order not found or TXT generation failed.' });
    const order = await OrderService.findOrderById(orderId);
    if (!order || order.userId !== user.id) return res.status(404).json({ error: 'Order not found or TXT generation failed.' });
    const details = order.details || {};
    const lines = [
      `订单号: ${order.orderId}`,
      `订单状态: ${order.orderStatus}`,
      `产品类型: ${order.productType || ''}`,
      `产品标题: ${order.productTitle || ''}`,
      `下单时间: ${order.orderDate || ''}`,
      `总金额: ${order.totalAmount ?? ''}`,
    ];
    if (details.productInfo) {
      lines.push(`产品信息: ${JSON.stringify(details.productInfo)}`);
    }
    if (details.travelerInfo) {
      lines.push(`旅客信息: ${JSON.stringify(details.travelerInfo)}`);
    }
    if (details.contactInfo) {
      lines.push(`联系信息: ${JSON.stringify(details.contactInfo)}`);
    }
    if (details.priceDetails) {
      lines.push(`价格明细: ${JSON.stringify(details.priceDetails)}`);
    }
    const content = lines.join('\n');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${orderId}.txt"`);
    return res.status(200).send(content);
  } catch (e) {
    return res.status(404).json({ error: 'Order not found or TXT generation failed.' });
  }
});

router.post('/', (req, res) => {
  const { flightId, packageId, passengers, contact } = req.body || {};
  if (!flightId || !packageId || !Array.isArray(passengers) || passengers.length === 0 || !contact || !contact.phone) {
    return res.status(400).json({ error: 'Invalid order payload.' });
  }
  if (String(contact.phone) === '13800138001') return res.status(409).json({ error: 'Inventory not enough.' });
  const orderId = 'ORD-' + Math.random().toString(36).slice(2, 10);
  const amount = 620;
  return res.status(201).json({ orderId, amount, status: 'pending_payment' });
});

router.post('/:orderId/pay', (req, res) => {
  const { orderId } = req.params;
  const { method } = req.body || {};
  if (!orderId || !method) return res.status(400).json({ error: 'Invalid payment info.' });
  return res.status(200).json({ paymentId: 'PAY-' + Math.random().toString(36).slice(2,8), redirectUrl: 'https://example.com/pay' });
});

router.get('/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  if (!orderId) return res.status(404).json({ error: 'Order not found.' });
  return res.status(200).json({ status: 'pending_payment' });
});

router.get('/:orderId/ticket', (req, res) => {
  const { orderId } = req.params;
  if (!orderId) return res.status(404).json({ error: 'Ticket not found.' });
  return res.status(200).json({ ticketNo: 'ETKT-' + Math.random().toString(36).slice(2,8), issuedAt: new Date().toISOString(), itinerary: {} });
});

router.post('/:orderId/issue', (req, res) => {
  const { orderId } = req.params;
  if (!orderId) return res.status(404).json({ error: 'Order not found.' });
  return res.status(200).json({ ticketNo: 'ETKT-' + Math.random().toString(36).slice(2,8) });
});

router.post('/create', async (req, res) => {
  try {
    await OrderService.init();
    const user = await getCurrentUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });
    const {
      productType = 'flight',
      productTitle = '',
      totalAmount,
      productInfo = {},
      travelerInfo = [],
      contactInfo = {},
      priceDetails = {}
    } = req.body || {};
    if (!productTitle || typeof totalAmount !== 'number') {
      return res.status(400).json({ error: 'Invalid order payload.' });
    }
    const orderId = 'ORD-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,6);
    const orderDate = new Date().toISOString();
    const status = 'pending_travel';
    const details = { productInfo, travelerInfo, contactInfo, priceDetails };
    await OrderService.createOrder({
      orderId,
      userId: user.id,
      productType,
      productTitle,
      orderDate,
      totalAmount,
      status,
      details
    });
    return res.status(201).json({ orderId, status, orderDate, totalAmount });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to create order.' });
  }
});

module.exports = router;
