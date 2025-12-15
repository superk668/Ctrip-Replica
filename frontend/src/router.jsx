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
import MyInfo from './pages/UserCenter/MyInfo';
import BindLink from './pages/UserCenter/BindLink';
import AccountSecurity from './pages/UserCenter/AccountSecurity';
import CommunityHome from './pages/UserCenter/CommunityHome';
import CommonInfoIndex from './pages/UserCenter/CommonInfoIndex';
import TravelersManagement from './pages/UserCenter/TravelersManagement';
import TravelerEdit from './pages/UserCenter/TravelerEdit';
import TravelerAdd from './pages/UserCenter/TravelerAdd';
import TravelerView from './pages/UserCenter/TravelerView';
import AddressesManagement from './pages/UserCenter/AddressesManagement';
import AddressAdd from './pages/UserCenter/AddressAdd';

const OrderDetailRoute = () => {
  const params = useParams();
  const orderId = params?.orderId || '';
  return <OrderDetailPage orderId={orderId} />;
};

const router = createBrowserRouter([
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
  {
    path: '/user-center/my-info',
    element: <MyInfo />,
  },
  {
    path: '/user-center/common-info',
    element: <CommonInfoIndex />,
  },
  {
    path: '/user-center/common-info/travelers',
    element: <TravelersManagement />,
  },
  {
    path: '/user-center/common-info/travelers/edit',
    element: <TravelerEdit />,
  },
  {
    path: '/user-center/common-info/travelers/add',
    element: <TravelerAdd />,
  },
  {
    path: '/user-center/common-info/travelers/view',
    element: <TravelerView />,
  },
  {
    path: '/user-center/common-info/addresses',
    element: <AddressesManagement />,
  },
  {
    path: '/user-center/common-info/addresses/add',
    element: <AddressAdd />,
  },
  {
    path: '/user-center/bind-link',
    element: <BindLink />,
  },
  {
    path: '/user-center/security',
    element: <AccountSecurity />,
  },
  {
    path: '/user-center/community',
    element: <CommunityHome />,
  },
]);

export default router;
