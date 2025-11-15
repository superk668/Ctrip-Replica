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

// GET /api/orders - 获取订单列表
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
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load orders.' });
  }
});

// GET /api/orders/:orderId - 获取订单详情
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
      productInfo: details.productInfo || {},
      travelerInfo: details.travelerInfo || [],
      contactInfo: details.contactInfo || {},
      priceDetails: details.priceDetails || { total: order.totalAmount },
      actions: ['cancel', 'invoice']
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to load order.' });
  }
});

// POST /api/orders/:orderId/cancel - 取消订单
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

// GET /api/orders/:orderId/download - 下载订单TXT
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

module.exports = router;
