import React, { useEffect, useState } from 'react';
import { Link, useInRouterContext } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/images/logo-ctrip.png';

const Header = () => {
  const inRouter = useInRouterContext();
  const NavLink = ({ to, children }) => (inRouter ? <Link to={to}>{children}</Link> : <a href={to}>{children}</a>);
  const [userName, setUserName] = useState('');
  useEffect(() => {
    try {
      const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const parsed = u ? JSON.parse(u) : null;
      const name = parsed?.username || parsed?.phone || '';
      if (name) setUserName(String(name));
    } catch (_) {}
  }, []);
  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (_) {}
    setUserName('');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Ctrip Logo" />
      </div>
      <nav className={styles.navigation}>
        <NavLink to="/home">首页</NavLink>
        <NavLink to="/orders">我的订单</NavLink>
        {userName ? (
          <>
            <NavLink to="/home">{userName}</NavLink>
            <button type="button" onClick={handleLogout}>退出登录</button>
          </>
        ) : (
          <NavLink to="/login"><i className="fa fa-user-o"></i></NavLink>
        )}
      </nav>
    </header>
  );
};

export default Header;