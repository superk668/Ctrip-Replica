const { body, validationResult } = require('express-validator');

// 验证手机号格式
const validatePhone = (phone) => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

// 验证邮箱格式
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 验证密码强度
const validatePassword = (password) => {
  // 至少8位，包含字母和数字
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// 验证验证码格式
const validateVerificationCode = (code) => {
  return /^\d{6}$/.test(code);
};

const validateChineseIdNumber = (id) => {
  if (typeof id !== 'string') return false;
  const s = id.trim();
  if (!/^\d{15}$/.test(s) && !/^\d{17}[\dXx]$/.test(s)) return false;
  return true;
};

const validatePassport = (no) => {
  if (typeof no !== 'string') return false;
  const s = no.trim();
  return /^[A-Za-z0-9]{5,17}$/.test(s);
};

const validateDateYMD = (str) => {
  if (typeof str !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return false;
  return true;
};

// 验证规则
const validationRules = {
  // 登录验证
  login: [
    body('username').notEmpty().withMessage('用户名不能为空'),
    body('password').notEmpty().withMessage('密码不能为空')
  ],
  
  // 手机号登录验证
  phoneLogin: [
    body('phone').custom(validatePhone).withMessage('手机号格式不正确'),
    body('code').custom(validateVerificationCode).withMessage('验证码格式不正确')
  ],
  
  // 发送验证码验证
  sendCode: [
    body('phone').custom(validatePhone).withMessage('手机号格式不正确'),
    body('type').isIn(['login', 'register']).withMessage('验证码类型不正确')
  ],
  
  // 注册第一步验证
  registerStep1: [
    body('phone').custom(validatePhone).withMessage('手机号格式不正确'),
    body('code').custom(validateVerificationCode).withMessage('验证码格式不正确')
  ],
  
  // 注册第二步验证
  registerStep2: [
    body('phone').custom(validatePhone).withMessage('手机号格式不正确'),
    body('password').custom(validatePassword).withMessage('密码必须至少8位且包含字母和数字')
  ]
};

// 验证结果处理
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: '参数验证失败',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validatePhone,
  validateEmail,
  validatePassword,
  validateVerificationCode,
  validateChineseIdNumber,
  validatePassport,
  validateDateYMD,
  validationRules,
  handleValidationErrors
};
