import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (token: string, user: any) => {
    // 保存token到localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // 跳转到首页
    navigate('/');
  };

  const handleRegisterError = (error: string) => {
    console.error('Registration error:', error);
    // 错误处理已经在RegisterForm组件内部处理了
  };

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return (
    <RegisterForm
      onSuccess={handleRegisterSuccess}
      onError={handleRegisterError}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
};

export default RegisterPage;