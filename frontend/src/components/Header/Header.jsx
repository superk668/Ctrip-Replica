import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/images/logo-ctrip.png';

const Header = () => {
  const [username, setUsername] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
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

  // 仅在购票流程相关页面显示进度条（示例：/booking、/payment、/orders/complete）
  const showBookingProgress = /^\/booking(\b|\/)/.test(location.pathname);
  const stage = (() => {
    // 允许通过 sessionStorage 覆盖当前阶段；默认展示第一步“乘机信息”
    try {
      const s = sessionStorage.getItem('bookingStage');
      const n = Number(s);
      if (Number.isFinite(n) && n >= 1 && n <= 4) return n;
    } catch (_) {}
    return 1;
  })();
  const steps = [
    { id: 1, label: '乘机信息' },
    { id: 2, label: '增值服务' },
    { id: 3, label: '支付' },
    { id: 4, label: '完成' },
  ];
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.logo}>
          <img src={logo} alt="Ctrip Logo" />
        </div>
        <div className={styles.progressCenter}>
          {showBookingProgress && (
            <div className={styles.progressBar} aria-label="购票进度">
              {steps.map((s, idx) => {
                const isDone = s.id < stage;
                const isActive = s.id === stage;
                return (
                  <div key={s.id} className={styles.progressItem}>
                    <span className={
                      isDone ? styles.badgeDone : isActive ? styles.badgeActive : styles.badgeIdle
                    }>
                      {isDone ? '✓' : s.id}
                    </span>
                    <span className={
                      isDone ? styles.progressTextDone : isActive ? styles.progressTextActive : styles.progressTextIdle
                    }>{s.label}</span>
                    {idx !== steps.length - 1 && <span className={styles.divider} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <nav className={styles.navigation}>
          <a href="/home">首页</a>
          <a href="/orders">我的订单</a>
          <a href="#"><i className="fa fa-heart-o"></i></a>
          <div className={styles.userMenu} ref={menuRef}>
            <button className={styles.userBtn} onClick={() => setMenuOpen((v) => !v)}>
              <i className="fa fa-lock"></i><span className={styles.username}>{username || ''}</span>
            </button>
            {menuOpen && (
              <div className={styles.dropdown}>
                <a href="/home" className={styles.dropdownItem}>个人中心</a>
                <button className={styles.dropdownItem} onClick={handleLogout}>退出登录</button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
