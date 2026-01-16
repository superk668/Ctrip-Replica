import React from 'react';
import { Navigate, createBrowserRouter, useLocation, useParams } from 'react-router-dom';
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
import MyInfo from './pages/UserCenter/MyInfo';
import BindLink from './pages/UserCenter/BindLink';
import AccountSecurity from './pages/UserCenter/AccountSecurity';
import CommunityHome from './pages/UserCenter/CommunityHome';
import CommonInfoIndex from './pages/UserCenter/CommonInfoIndex';
import CommonInfoPlaceholder from './pages/UserCenter/CommonInfoPlaceholder';
import TravelersManagement from './pages/UserCenter/TravelersManagement';
import TravelerEdit from './pages/UserCenter/TravelerEdit';
import TravelerAdd from './pages/UserCenter/TravelerAdd';
import TravelerView from './pages/UserCenter/TravelerView';

const OrderDetailRoute = () => {
  const params = useParams();
  const orderId = params?.orderId || '';
  return <OrderDetailPage orderId={orderId} />;
};

const isLoggedIn = () => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    if (token) return true;
    const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    if (!u) return false;
    const ju = JSON.parse(u);
    return !!(ju && (ju.phone || ju.username));
  } catch (_) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      return !!token;
    } catch (_) {
      return false;
    }
  }
};

const RequireAuth = ({ children }) => {
  const location = useLocation();
  if (!isLoggedIn()) {
    const next = `${location.pathname || ''}${location.search || ''}`;
    const to = next ? `/login?redirect=${encodeURIComponent(next)}` : '/login';
    return <Navigate to={to} replace />;
  }
  return children;
};

export const routes = [
  {
    path: '/',
    element: <HomePage />,
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
    element: <RequireAuth><BookingPage /></RequireAuth>,
  },
  {
    path: '/booking/services',
    element: <RequireAuth><ServicesPage /></RequireAuth>,
  },
  {
    path: '/booking/payment',
    element: <RequireAuth><PaymentPage /></RequireAuth>,
  },
  {
    path: '/booking/complete',
    element: <RequireAuth><CompletePage /></RequireAuth>,
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
    element: <RequireAuth><OrderListPage /></RequireAuth>,
  },
  {
    path: '/orders/:orderId',
    element: <RequireAuth><OrderDetailRoute /></RequireAuth>,
  },
  {
    path: '/user-center/my-info',
    element: <RequireAuth><MyInfo /></RequireAuth>,
  },
  {
    path: '/user-center/common-info',
    element: <RequireAuth><CommonInfoIndex /></RequireAuth>,
  },
  {
    path: '/user-center/common-info/:section',
    element: <RequireAuth><CommonInfoPlaceholder /></RequireAuth>,
  },
  {
    path: '/user-center/common-info/travelers',
    element: <RequireAuth><TravelersManagement /></RequireAuth>,
  },
  {
    path: '/user-center/common-info/travelers/edit',
    element: <RequireAuth><TravelerEdit /></RequireAuth>,
  },
  {
    path: '/user-center/common-info/travelers/add',
    element: <RequireAuth><TravelerAdd /></RequireAuth>,
  },
  {
    path: '/user-center/common-info/travelers/view',
    element: <RequireAuth><TravelerView /></RequireAuth>,
  },
  {
    path: '/user-center/bind-link',
    element: <RequireAuth><BindLink /></RequireAuth>,
  },
  {
    path: '/user-center/security',
    element: <RequireAuth><AccountSecurity /></RequireAuth>,
  },
  {
    path: '/user-center/community',
    element: <RequireAuth><CommunityHome /></RequireAuth>,
  },
];

const router = createBrowserRouter(routes);

export default router;
