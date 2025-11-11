import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage'; // 导入注册页面
import SetPasswordPage from './pages/SetPassword/SetPasswordPage'; // 导入设置密码页面
import HomePage from './pages/Home/HomePage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/set-password',
    element: <SetPasswordPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
]);

export default router;