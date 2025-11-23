import React, { useEffect, useRef, useState } from 'react';
import styles from './Header.module.css';
import logo from '../../assets/images/logo-ctrip.png';

const Header = () => {
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    try {
      const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      if (u) {
        const ju = JSON.parse(u);
        if (ju && ju.username) setUsername(String(ju.username));
      } else {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        if (token) {
          const parts = token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload && payload.username) setUsername(String(payload.username));
          }
        }
      }
    } catch (_) {}
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (_) {}
    window.location.href = '/login';
  };
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Ctrip Logo" />
      </div>
      <nav className={styles.navigation}>
        <a href="/home">首页</a>
        <a href="/orders">我的订单</a>
        <a href="#"><i className="fa fa-heart-o"></i></a>
        <div className={styles.userMenu} ref={menuRef}>
          <button className={styles.userBtn} onClick={() => setMenuOpen((v) => !v)}>
            <i className="fa fa-user-o"></i><span className={styles.username}>{username || ''}</span>
          </button>
          {menuOpen && (
            <div className={styles.dropdown}>
              <a href="/home" className={styles.dropdownItem}>个人中心</a>
              <button className={styles.dropdownItem} onClick={handleLogout}>退出登录</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
