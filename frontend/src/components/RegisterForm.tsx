import React, { useState } from 'react';
import '../styles/RegisterForm.css';
import { RegisterVerifyRequest, RegisterCompleteRequest, FormState } from '../types';
import apiService from '../services/api';

interface RegisterFormProps {
  onSuccess: (token: string, user: any) => void;
  onError: (error: string) => void;
  onSwitchToLogin: () => void;
}

type RegisterStep = 'phoneAndVerify' | 'password';

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onError,
  onSwitchToLogin
}) => {
  const [currentStep, setCurrentStep] = useState<RegisterStep>('phoneAndVerify');
  const [formData, setFormData] = useState({
    phoneNumber: '',
    verificationCode: '',
    password: '',
    confirmPassword: ''
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

  const handleSendCode = async () => {
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setFormState({ isLoading: false, error: '请输入正确的手机号码' });
      return;
    }

    setFormState({ isLoading: true, error: null });

    try {
      const response = await apiService.registerSendCode({ phoneNumber: formData.phoneNumber });
      
      if (response.success && response.data) {
        setCodeId(response.data.codeId);
        // 启动倒计时
        startCountdown();
        // 测试版本：不切换步骤，保持在同一界面
        console.log('[TEST MODE] Code sent, staying on same step');
      } else {
        // 直接使用后端返回的错误信息
        setFormState({ isLoading: false, error: response.message || '发送验证码失败' });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送验证码失败，请重试';
      setFormState({ isLoading: false, error: errorMessage });
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setFormState({ isLoading: false, error: '请输入验证码' });
      return;
    }

    // 测试版本：验证六位数字格式
    if (!/^\d{6}$/.test(formData.verificationCode)) {
      setFormState({ isLoading: false, error: '请输入6位数字验证码' });
      return;
    }

    setFormState({ isLoading: true, error: null });

    try {
      const verifyData: RegisterVerifyRequest = {
        phoneNumber: formData.phoneNumber,
        verificationCode: formData.verificationCode,
        codeId: codeId
      };

      const response = await apiService.registerVerify(verifyData);
      
      if (response.success) {
        setCurrentStep('password');
      } else {
        onError(response.message || '验证码验证失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '验证码验证失败，请重试';
      onError(errorMessage);
    } finally {
      setFormState({ isLoading: false, error: null });
    }
  };

  const handleCompleteRegistration = async () => {
    if (!validatePassword()) return;

    setFormState({ isLoading: true, error: null });

    try {
      const completeData: RegisterCompleteRequest = {
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        token: codeId // 使用codeId作为token
      };

      const response = await apiService.registerComplete(completeData);
      
      if (response.success && response.data) {
        onSuccess(response.data.token, response.data.user);
      } else {
        onError(response.message || '注册失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '注册失败，请重试';
      onError(errorMessage);
    } finally {
      setFormState({ isLoading: false, error: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 'phoneAndVerify') {
      if (!codeId) {
        // 如果还没有发送验证码，先发送验证码
        await handleSendCode();
        return;
      }
      
      // 验证验证码
      await handleVerifyCode();
    } else if (currentStep === 'password') {
      await handleCompleteRegistration();
    }
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validatePassword = (): boolean => {
    if (!formData.password) {
      setFormState({ isLoading: false, error: '请输入密码' });
      return false;
    }

    if (formData.password.length < 6) {
      setFormState({ isLoading: false, error: '密码长度至少6位' });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormState({ isLoading: false, error: '两次输入的密码不一致' });
      return false;
    }

    return true;
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

  const goBack = () => {
    switch (currentStep) {
      case 'password':
        setCurrentStep('phoneAndVerify');
        break;
    }
  };

  const renderPhoneAndVerifyStep = () => (
    <div className="register-step">
      <div className="step-title">验证手机</div>
      
      <div className="form-group">
        <label htmlFor="phoneNumber" className="form-label">手机号</label>
        <div className="phone-input-wrapper">
          <div className="country-selector">
            <span className="country-flag">🇨🇳</span>
            <span className="country-text">中国大陆 86</span>
            <span className="dropdown-arrow">▼</span>
          </div>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className={`form-input phone-input ${formState.error ? 'error' : ''}`}
            value={formData.phoneNumber}
            onChange={handleInputChange}
            placeholder="请输入手机号"
            maxLength={11}
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="verificationCode" className="form-label">短信验证码</label>
        <div className="verification-wrapper">
          <input
            type="text"
            id="verificationCode"
            name="verificationCode"
            className={`form-input verification-input ${formState.error ? 'error' : ''}`}
            value={formData.verificationCode}
            onChange={handleInputChange}
            placeholder="6位数字"
            maxLength={6}
            required
          />
          <button
            type="button"
            className="send-code-btn"
            onClick={handleSendCode}
            disabled={countdown > 0 || formState.isLoading || !validatePhoneNumber(formData.phoneNumber)}
          >
            {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
          </button>
        </div>
      </div>

      <div className="agreement-section">
        <label className="agreement-checkbox">
          <input type="checkbox" required />
          <span className="checkmark"></span>
          <span className="agreement-text">
            同意<a href="#terms" target="_blank">《服务协议》</a>和<a href="#privacy" target="_blank">《隐私政策》</a>
          </span>
        </label>
      </div>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="register-step">
      <div className="step-title">设置密码</div>
      
      <div className="registered-phone">
        <span className="phone-label">注册手机号</span>
        <span className="phone-number">86-{formData.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3')}</span>
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">密码</label>
        <div className="password-input-wrapper">
          <input
            type="password"
            id="password"
            name="password"
            className={`form-input ${formState.error ? 'error' : ''}`}
            value={formData.password}
            onChange={handleInputChange}
            placeholder="8-20位字母、数字和符号"
            required
          />
          <button type="button" className="password-toggle">👁️</button>
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">确认密码</label>
        <div className="password-input-wrapper">
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`form-input ${formState.error ? 'error' : ''}`}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="再次输入密码"
            required
          />
          <button type="button" className="password-toggle">👁️</button>
        </div>
      </div>

      <div className="password-strength">
        <div className="strength-indicators">
          <div className={`strength-dot ${getPasswordStrength() >= 1 ? 'active weak' : ''}`}></div>
          <div className={`strength-dot ${getPasswordStrength() >= 2 ? 'active medium' : ''}`}></div>
          <div className={`strength-dot ${getPasswordStrength() >= 3 ? 'active strong' : ''}`}></div>
        </div>
        <span className="strength-text">
          {getPasswordStrength() === 0 && '请输入密码'}
          {getPasswordStrength() === 1 && '弱'}
          {getPasswordStrength() === 2 && '中'}
          {getPasswordStrength() === 3 && '强'}
        </span>
      </div>
    </div>
  );

  const getStepTitle = () => {
    switch (currentStep) {
      case 'phoneAndVerify': 
        return codeId ? '验证并继续' : '下一步，设置密码';
      case 'password': return '完成';
      default: return '下一步';
    }
  };

  const getPasswordStrength = (): number => {
    const password = formData.password;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
    if (/\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return strength;
  };

  return (
    <div className="register-page">
      {/* 顶部导航栏 */}
      <div className="register-nav">
        <div className="nav-content">
          <div className="nav-left">
            <div className="logo">携程旅行</div>
          </div>
          <div className="nav-center">
            <div className="search-box">
              <input type="text" placeholder="搜索任何旅游相关" />
              <button className="search-btn">🔍</button>
            </div>
          </div>
          <div className="nav-right">
            <a href="#home" className="nav-link">首页</a>
            <span className="nav-icon">❤️</span>
            <span className="nav-icon">📤</span>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="register-container">
        <div className="register-form-wrapper">
          {/* 步骤指示器 */}
          <div className="register-steps">
            <div className="step-item">
              <div className={`step-circle ${currentStep === 'phoneAndVerify' ? 'active' : 'completed'}`}>
                {currentStep !== 'phoneAndVerify' ? '✓' : '1'}
              </div>
              <span className="step-label">验证手机</span>
            </div>
            <div className={`step-line ${currentStep !== 'phoneAndVerify' ? 'completed' : ''}`}></div>
            <div className="step-item">
              <div className={`step-circle ${currentStep === 'password' ? 'active' : 'inactive'}`}>
                2
              </div>
              <span className="step-label">设置密码</span>
            </div>
            <div className="step-line inactive"></div>
            <div className="step-item">
              <div className="step-circle inactive">3</div>
              <span className="step-label">注册成功</span>
            </div>
          </div>

          {/* 错误信息 */}
          {formState.error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {formState.error}
            </div>
          )}

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="register-form">
            {currentStep === 'phoneAndVerify' && renderPhoneAndVerifyStep()}
            {currentStep === 'password' && renderPasswordStep()}

            <div className="form-actions">
              {currentStep !== 'phoneAndVerify' && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={goBack}
                  disabled={formState.isLoading}
                >
                  上一步
                </button>
              )}
              
              <button
                type="submit"
                className={`btn-primary ${currentStep === 'phoneAndVerify' ? 'full-width' : ''}`}
                disabled={formState.isLoading}
              >
                {formState.isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    处理中...
                  </>
                ) : (
                  getStepTitle()
                )}
              </button>
            </div>
          </form>

          {/* 辅助链接 */}
          <div className="register-footer">
            {currentStep === 'phoneAndVerify' && (
              <div className="enterprise-link">
                <a href="#enterprise">企业客户注册</a>
              </div>
            )}
            {currentStep === 'password' && (
              <div className="help-link">
                <a href="#help">注册遇到问题？</a>
              </div>
            )}
            <div className="login-link">
              已有账号？
              <a href="#login" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
                立即登录
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;