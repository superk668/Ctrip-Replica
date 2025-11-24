import React from 'react';
import { createBrowserRouter, useParams } from 'react-router-dom';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage'; // 导入注册页面
import SetPasswordPage from './pages/SetPassword/SetPasswordPage'; // 导入设置密码页面
import HomePage from './pages/Home/HomePage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import FlightsResultsPage from './pages/Flights/FlightsResultsPage';
import BookingPage from './pages/Booking/BookingPage';
import ServicesPage from './pages/Services/ServicesPage';
import PaymentPage from './pages/Payment/PaymentPage';
import CompletePage from './pages/Complete/CompletePage';
import OrderListPage from './components/orders/OrderListPage';
import OrderDetailPage from './components/orders/OrderDetailPage';

const OrderDetailRoute = () => {
  const params = useParams();
  const orderId = params?.orderId || '';
  return <OrderDetailPage orderId={orderId} />;
};

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
    path: '/flights/results',
    element: <FlightsResultsPage />,
  },
  {
    path: '/booking',
    element: <BookingPage />,
  },
  {
    path: '/booking/services',
    element: <ServicesPage />,
  },
  {
    path: '/booking/payment',
    element: <PaymentPage />,
  },
  {
    path: '/booking/complete',
    element: <CompletePage />,
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
  {
    path: '/orders',
    element: <OrderListPage />,
  },
  {
    path: '/orders/:orderId',
    element: <OrderDetailRoute />,
  },
]);

export default router;
