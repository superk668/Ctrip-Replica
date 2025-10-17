import React, { useState } from 'react';
import { LoginPasswordRequest, LoginVerifyCodeRequest, FormState } from '../types';
import apiService from '../services/api';
import '../styles/LoginForm.css';

interface LoginFormProps {
  onSuccess: (token: string, user: any) => void;
  onError: (error: string) => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  onSwitchToRegister
}) => {
  const [loginMode, setLoginMode] = useState<'password' | 'code'>('password');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
    verificationCode: ''
  });
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null
  });
  const [countdown, setCountdown] = useState(0);
  const [codeId, setCodeId] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除错误信息
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  };

  const handlePasswordLogin = async () => {
    if (!formData.phoneNumber || !formData.password) {
      setFormState({ isLoading: false, error: '请输入手机号和密码' });
      return;
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      setFormState({ isLoading: false, error: '请输入正确的手机号码' });
      return;
    }

    setFormState({ isLoading: true, error: null });

    try {
      const loginData: LoginPasswordRequest = {
        phoneNumber: formData.phoneNumber,
        password: formData.password
      };

      const response = await apiService.loginPassword(loginData);
      
      if (response.success && response.data) {
        onSuccess(response.data.token, response.data.user);
      } else {
        onError(response.message || '登录失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请重试';
      onError(errorMessage);
    } finally {
      setFormState({ isLoading: false, error: null });
    }
  };

  const handleSendVerificationCode = async () => {
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setFormState({ isLoading: false, error: '请输入正确的手机号码' });
      return;
    }

    setFormState({ isLoading: true, error: null });

    try {
      const response = await apiService.loginSendCode({ phoneNumber: formData.phoneNumber });
      
      if (response.success && response.data) {
        setCodeId(response.data.codeId);
        startCountdown();
      } else {
        onError(response.message || '发送验证码失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送验证码失败，请重试';
      onError(errorMessage);
    } finally {
      setFormState({ isLoading: false, error: null });
    }
  };

  const handleCodeLogin = async () => {
    if (!formData.phoneNumber || !formData.verificationCode) {
      setFormState({ isLoading: false, error: '请输入手机号和验证码' });
      return;
    }

    if (!codeId) {
      setFormState({ isLoading: false, error: '请先获取验证码' });
      return;
    }

    setFormState({ isLoading: true, error: null });

    try {
      const loginData: LoginVerifyCodeRequest = {
        phoneNumber: formData.phoneNumber,
        verificationCode: formData.verificationCode,
        codeId: codeId
      };

      const response = await apiService.loginVerifyCode(loginData);
      
      if (response.success && response.data) {
        onSuccess(response.data.token, response.data.user);
      } else {
        onError(response.message || '验证码登录失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '验证码登录失败，请重试';
      onError(errorMessage);
    } finally {
      setFormState({ isLoading: false, error: null });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMode === 'password') {
      handlePasswordLogin();
    } else {
      handleCodeLogin();
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const switchLoginMode = () => {
    setLoginMode(prev => prev === 'password' ? 'code' : 'password');
    setFormState({ isLoading: false, error: null });
    setFormData(prev => ({ ...prev, password: '', verificationCode: '' }));
  };

  return (
    <div className="login-form-container">
      <div className="login-form-header">
        <h2 className="login-form-title">
          {loginMode === 'password' ? '密码登录' : '验证码登录'}
        </h2>
        <p className="login-form-subtitle">
          {loginMode === 'password' ? '使用手机号和密码登录' : '使用手机号和验证码登录'}
        </p>
      </div>
      
      <div className="login-mode-tabs">
        <button
          type="button"
          className={`mode-tab ${loginMode === 'password' ? 'active' : ''}`}
          onClick={() => setLoginMode('password')}
        >
          密码登录
        </button>
        <button
          type="button"
          className={`mode-tab ${loginMode === 'code' ? 'active' : ''}`}
          onClick={() => setLoginMode('code')}
        >
          验证码登录
        </button>
      </div>

      {formState.error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {formState.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="phoneNumber" className="form-label">手机号码</label>
          <div className="input-wrapper">
            <span className="country-code">+86</span>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              className={`form-input ${formState.error ? 'error' : ''}`}
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="请输入手机号码"
              maxLength={11}
              required
            />
          </div>
        </div>

        {loginMode === 'password' ? (
          <div className="form-group">
            <label htmlFor="password" className="form-label">密码</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${formState.error ? 'error' : ''}`}
                value={formData.password}
                onChange={handleInputChange}
                placeholder="请输入密码"
                required
              />
            </div>
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="verificationCode" className="form-label">验证码</label>
            <div className="verification-group">
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                className={`form-input verification-input ${formState.error ? 'error' : ''}`}
                value={formData.verificationCode}
                onChange={handleInputChange}
                placeholder="请输入6位验证码"
                maxLength={6}
                required
              />
              <button
                type="button"
                className={`send-code-btn ${countdown > 0 ? 'disabled' : ''}`}
                onClick={handleSendVerificationCode}
                disabled={countdown > 0 || formState.isLoading || !validatePhoneNumber(formData.phoneNumber)}
              >
                {countdown > 0 ? `${countdown}s后重新发送` : '发送验证码'}
              </button>
            </div>
          </div>
        )}

        {loginMode === 'password' && (
          <div className="form-options">
            <label className="remember-me">
              <input
                type="checkbox"
                className="remember-checkbox"
              />
              <span className="checkmark"></span>
              记住登录状态
            </label>
            <a href="#forgot" className="forgot-password">忘记密码？</a>
          </div>
        )}

        <button
          type="submit"
          className={`login-btn ${formState.isLoading ? 'loading' : ''}`}
          disabled={formState.isLoading}
        >
          {formState.isLoading ? (
            <>
              <span className="loading-spinner"></span>
              登录中...
            </>
          ) : (
            '登录'
          )}
        </button>
      </form>

      <div className="divider">
        <span className="divider-text">其他登录方式</span>
      </div>

      <div className="third-party-login">
        <button className="third-party-btn wechat" title="微信登录">
          <span className="third-party-icon">💬</span>
          <span className="third-party-text">微信</span>
        </button>
        <button className="third-party-btn qq" title="QQ登录">
          <span className="third-party-icon">🐧</span>
          <span className="third-party-text">QQ</span>
        </button>
        <button className="third-party-btn alipay" title="支付宝登录">
          <span className="third-party-icon">💰</span>
          <span className="third-party-text">支付宝</span>
        </button>
      </div>

      <div className="register-link">
        还没有账号？
        <button 
          type="button"
          className="link-btn"
          onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }}
        >
          立即注册
        </button>
      </div>
    </div>
  );
};

export default LoginForm;