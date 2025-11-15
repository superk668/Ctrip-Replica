import React from 'react';
import { createBrowserRouter, useParams } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage'; // 导入注册页面
import SetPasswordPage from './pages/SetPassword/SetPasswordPage'; // 导入设置密码页面
import HomePage from './pages/Home/HomePage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
<<<<<<< HEAD
import FlightsResultsPage from './pages/Flights/FlightsResultsPage';
=======
import OrderListPage from './components/orders/OrderListPage';
import OrderDetailPage from './components/orders/OrderDetailPage';

const OrderDetailWrapper = () => {
  const { orderId } = useParams();
  return <OrderDetailPage orderId={orderId} />;
};
>>>>>>> 9eca3d52f2b796cafa8676a1e4b5b2950bae0e4f

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
<<<<<<< HEAD
    path: '/flights/results',
    element: <FlightsResultsPage />,
=======
    path: '/orders',
    element: <OrderListPage />,
  },
  {
    path: '/orders/:orderId',
    element: <OrderDetailWrapper />,
>>>>>>> 9eca3d52f2b796cafa8676a1e4b5b2950bae0e4f
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
