import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = (token: string) => {
    saveToken(token);
    redirectToHome();
  };

  const handleError = (error: string) => {
    console.error('Authentication error:', error);
    // 可以在这里显示错误提示
  };

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  const saveToken = (token: string) => {
    localStorage.setItem('authToken', token);
  };

  const redirectToHome = () => {
    navigate('/');
  };

  return (
    <div className="login-page">
      {/* 顶部导航栏 */}
      <div className="login-page-header">
        <div className="header-content">
          <div className="logo">
            <img src="/logo.png" alt="携程旅行" className="logo-image" />
            <span className="logo-text">携程旅行</span>
          </div>
          <div className="header-actions">
            <a href="/" className="back-home">返回首页</a>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="login-main">
        <div className="login-container">
          {/* 左侧品牌区域 */}
          <div className="brand-section">
            <div className="brand-content">
              <h1 className="brand-title">携程旅行</h1>
              <p className="brand-subtitle">让旅行更简单</p>
              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-icon">✈️</span>
                  <span className="feature-text">机票预订</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🏨</span>
                  <span className="feature-text">酒店住宿</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🚗</span>
                  <span className="feature-text">租车服务</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧表单区域 */}
          <div className="form-section">
            <div className="form-container">
              <div className="form-header">
                <h2 className="form-title">登录</h2>
              </div>

              <div className="form-content">
                <LoginForm
                  onSuccess={handleLoginSuccess}
                  onError={handleError}
                  onSwitchToRegister={handleSwitchToRegister}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;