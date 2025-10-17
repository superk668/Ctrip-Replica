import {
  User,
  LoginRequest,
  RegisterRequest,
  SendVerificationCodeRequest,
  RegisterSendCodeRequest,
  RegisterVerifyRequest,
  RegisterCompleteRequest,
  LoginPasswordRequest,
  LoginSendCodeRequest,
  LoginVerifyCodeRequest,
  AuthResponse,
  VerificationCodeResponse,
  VerifyResponse,
  City,
  Destination,
  PromotionalFlight,
  FlightSearchRequest,
  ApiResponse
} from '../types';

const API_BASE_URL = (globalThis as any).process?.env?.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        // 返回包含错误信息的响应对象，而不是抛出错误
        return {
          success: false,
          message: data.error || data.message || `HTTP error! status: ${response.status}`,
          data: null
        } as ApiResponse<T>;
      }
      
      // 成功响应，包装成统一格式
      return {
        success: true,
        message: data.message || 'Success',
        data: data.codeId ? { codeId: data.codeId } : data
      } as ApiResponse<T>;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '网络请求失败',
        data: null
      } as ApiResponse<T>;
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // 旧版认证API（保持兼容性）
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<AuthResponse>;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<AuthResponse>;
  }

  async sendVerificationCode(data: SendVerificationCodeRequest): Promise<ApiResponse> {
    return this.request<any>('/auth/send-verification-code', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 新版分步骤注册API
  async registerSendCode(data: RegisterSendCodeRequest): Promise<VerificationCodeResponse> {
    return this.request<{ codeId: string }>('/auth/register/send-code', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<VerificationCodeResponse>;
  }

  async registerVerify(data: RegisterVerifyRequest): Promise<VerifyResponse> {
    return this.request<{ token: string }>('/auth/register/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<VerifyResponse>;
  }

  async registerComplete(data: RegisterCompleteRequest): Promise<AuthResponse> {
    return this.request<{ user: User; token: string }>('/auth/register/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<AuthResponse>;
  }

  // 新版登录API
  async loginPassword(data: LoginPasswordRequest): Promise<AuthResponse> {
    return this.request<{ user: User; token: string }>('/auth/login/password', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<AuthResponse>;
  }

  async loginSendCode(data: LoginSendCodeRequest): Promise<VerificationCodeResponse> {
    return this.request<{ codeId: string }>('/auth/login/send-code', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<VerificationCodeResponse>;
  }

  async loginVerifyCode(data: LoginVerifyCodeRequest): Promise<AuthResponse> {
    return this.request<{ user: User; token: string }>('/auth/login/verify-code', {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<AuthResponse>;
  }

  async logout(): Promise<ApiResponse> {
    const result = await this.request<ApiResponse>('/auth/logout', {
      method: 'POST',
    });
    localStorage.removeItem('authToken');
    return result;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    // TODO: 实现获取当前用户信息
    throw new Error('Not implemented');
  }

  // 旅行相关API
  async getCities(keyword?: string): Promise<ApiResponse<City[]>> {
    // TODO: 实现获取城市列表
    console.log('getCities called with keyword:', keyword);
    throw new Error('Not implemented');
  }

  async getHotDestinations(limit?: number): Promise<ApiResponse<Destination[]>> {
    // TODO: 实现获取热门目的地
    console.log('getHotDestinations called with limit:', limit);
    throw new Error('Not implemented');
  }

  async getPromotionalFlights(limit?: number): Promise<ApiResponse<PromotionalFlight[]>> {
    // TODO: 实现获取促销航班
    console.log('getPromotionalFlights called with limit:', limit);
    throw new Error('Not implemented');
  }

  async searchFlights(data: FlightSearchRequest): Promise<ApiResponse<PromotionalFlight[]>> {
    // TODO: 实现搜索航班
    console.log('searchFlights called with data:', data);
    throw new Error('Not implemented');
  }

  async getDestinationById(id: string): Promise<ApiResponse<Destination>> {
    // TODO: 实现根据ID获取目的地详情
    console.log('getDestinationById called with id:', id);
    throw new Error('Not implemented');
  }

  async getCityByCode(code: string): Promise<ApiResponse<City>> {
    // TODO: 实现根据代码获取城市信息
    console.log('getCityByCode called with code:', code);
    throw new Error('Not implemented');
  }
}

export const apiService = new ApiService();
export default apiService;