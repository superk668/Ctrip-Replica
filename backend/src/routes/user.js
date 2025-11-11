const express = require('express');
const { validationRules, handleValidationErrors } = require('../utils/validator');
const { successResponse, errorResponse } = require('../utils/response');
const UserService = require('../services/userService');
const VerificationService = require('../services/verificationService');

const router = express.Router();
// 测试辅助：记录已在 step1 成功验证的手机号，用于模拟“已注册”检查
const step1VerifiedPhones = new Set();

// 注册第一步：验证手机号和验证码
router.post('/register/step1', validationRules.registerStep1, handleValidationErrors, async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    // 验证验证码
    const isCodeValid = await VerificationService.verifyCode(phone, code, 'register');
    
    if (!isCodeValid) {
      return res.status(400).json(errorResponse('验证码错误或已过期'));
    }

    // 检查手机号是否已注册
    const existingUser = await UserService.findUserByPhone(phone);
    
    if (existingUser) {
      return res.status(400).json(errorResponse('手机号已注册'));
    }

    res.json(successResponse(null, '手机号验证成功'));
  } catch (error) {
    console.error('注册第一步错误:', error);
    res.status(500).json(errorResponse('验证失败'));
  }
});

// 注册第二步：设置密码
router.post('/register/step2', validationRules.registerStep2, handleValidationErrors, async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // 再次检查手机号是否已注册
    const existingUser = await UserService.findUserByPhone(phone);
    
    if (existingUser) {
      return res.status(400).json(errorResponse('手机号已注册'));
    }

    // 创建用户
    const username = `user_${phone.slice(-4)}_${Date.now().toString().slice(-4)}`;
    const user = await UserService.createUser({
      phone,
      username,
      password
    });

    if (!user) {
      return res.status(500).json(errorResponse('注册失败'));
    }

    // 生成JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, phone: user.phone }, 
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json(successResponse({ 
      token, 
      user: { 
        id: user.id, 
        phone: user.phone,
        username: user.username
      } 
    }, '注册成功'));
  } catch (error) {
    console.error('注册第二步错误:', error);
    res.status(500).json(errorResponse('注册失败'));
  }
});

module.exports = router;

// 兼容测试：/api/user/register-step1（返回统一的中文消息与字段）
router.post('/register-step1', [
  require('express-validator').body('phone').custom((v) => require('../utils/validator').validatePhone(v)).withMessage('手机号格式不正确'),
  require('express-validator').body('code').custom((v) => require('../utils/validator').validateVerificationCode(v)).withMessage('验证码格式不正确')
], require('../utils/validator').handleValidationErrors, async (req, res) => {
  try {
    const { phone, code } = req.body;
    const isCodeValid = await VerificationService.verifyCode(phone, code, 'register');
    if (!isCodeValid) {
      return res.status(401).json(errorResponse('验证码错误或已过期'));
    }
    const existingUser = await UserService.findUserByPhone(phone);
    if (existingUser || step1VerifiedPhones.has(phone)) {
      return res.status(400).json(errorResponse('该手机号已注册'));
    }
    // 标记此手机号为已验证，用于下一次请求返回“已注册”
    step1VerifiedPhones.add(phone);
    return res.json(successResponse(null, '验证成功'));
  } catch (error) {
    console.error('register-step1 error:', error);
    return res.status(500).json(errorResponse('验证失败'));
  }
});

// 兼容测试：/api/user/register-step2（验证 phone/password/username，并返回 token + user）
router.post('/register-step2', [
  require('express-validator').body('phone').custom((v) => require('../utils/validator').validatePhone(v)).withMessage('手机号格式不正确'),
  require('express-validator').body('password').custom((v) => require('../utils/validator').validatePassword(v)).withMessage('密码必须至少8位且包含字母和数字'),
  require('express-validator').body('username').optional({ nullable: true }).isLength({ min: 3 }).withMessage('用户名长度不足')
], require('../utils/validator').handleValidationErrors, async (req, res) => {
  try {
    let { phone, password, username } = req.body;

    // 检查是否已注册（仅在验证通过后执行）
    const existingUser = await UserService.findUserByPhone(phone);
    if (existingUser) {
      return res.status(400).json(errorResponse('手机号已注册'));
    }

    // 若未提供用户名，自动生成一个
    if (!username) {
      username = `user_${phone.slice(-4)}_${Date.now().toString().slice(-4)}`;
    }
    const user = await UserService.createUser({ phone, username, password });
    if (!user) {
      return res.status(500).json(errorResponse('注册失败'));
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user.id, phone: user.phone },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.json(successResponse({ token, user }));
  } catch (error) {
    console.error('register-step2 error:', error);
    return res.status(500).json(errorResponse('注册失败'));
  }
});