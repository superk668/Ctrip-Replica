// 用户相关类型
export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

// 认证相关类型
export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  password: string;
  verificationCode: string;
}

export interface SendVerificationCodeRequest {
  phoneNumber: string;
}

// 新的分步骤注册类型
export interface RegisterSendCodeRequest {
  phoneNumber: string;
}

export interface RegisterVerifyRequest {
  phoneNumber: string;
  verificationCode: string;
  codeId: string;
}

export interface RegisterCompleteRequest {
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  token: string;
}

// 新的登录类型
export interface LoginPasswordRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginSendCodeRequest {
  phoneNumber: string;
}

export interface LoginVerifyCodeRequest {
  phoneNumber: string;
  verificationCode: string;
  codeId: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}

// 验证码响应类型
export interface VerificationCodeResponse {
  success: boolean;
  message: string;
  data?: {
    codeId: string;
  };
}

// 验证响应类型
export interface VerifyResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
  };
}

// 城市相关类型
export interface City {
  code: string;
  name: string;
  pinyin: string;
  hot: boolean;
}

// 目的地相关类型
export interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  hotRank: number;
}

// 促销航班相关类型
export interface PromotionalFlight {
  id: string;
  origin: string;
  destination: string;
  price: number;
  originalPrice: number;
  discount: number;
  date: string;
  createdAt: string;
}

// 航班搜索相关类型
export interface FlightSearchRequest {
  origin: string;
  destination: string;
  date: string;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// 表单状态类型
export interface FormState {
  isLoading: boolean;
  error: string | null;
}

// 路由参数类型
export interface RouteParams {
  id?: string;
  code?: string;
}