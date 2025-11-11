// 统一响应格式
const successResponse = (data = null, message = '操作成功') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

const errorResponse = (message = '操作失败', code = 400, data = null) => {
  return {
    success: false,
    message,
    code,
    data,
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  successResponse,
  errorResponse
};