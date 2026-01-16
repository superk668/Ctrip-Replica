import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import logo from '../../assets/images/logo-ctrip.png';

const Header = () => {
  const [authed, setAuthed] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const maskPhone = (p) => {
    const s = String(p || '').replace(/\D/g, '');
    if (s.length === 11) return `${s.slice(0, 3)}****${s.slice(7)}`;
    if (s.length >= 7) return `${s.slice(0, 3)}****${s.slice(-4)}`;
    return s;
  };

  const readSession = () => {
    let token = '';
    let user = null;
    try { token = typeof window !== 'undefined' ? (localStorage.getItem('token') || '') : ''; } catch (_) {}
    try {
      const u = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      user = u ? JSON.parse(u) : null;
    } catch (_) {
      user = null;
    }

    const isAuthed = !!token || !!(user && (user.username || user.phone));

    let name = '';
    if (user && user.username) name = String(user.username);
    if (!name && user && user.phone) name = maskPhone(user.phone);
    if (!name && token) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          if (payload && payload.username) name = String(payload.username);
          if (!name && payload && payload.phone) name = maskPhone(payload.phone);
        }
      } catch (_) {}
    }
    if (!name && isAuthed) name = '已登录';

    return { isAuthed, name };
  };

  useEffect(() => {
    try {
      const s = readSession();
      setAuthed(!!s.isAuthed);
      setDisplayName(s.name || '');
    } catch (_) {}
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => {
      try {
        const s = readSession();
        setAuthed(!!s.isAuthed);
        setDisplayName(s.name || '');
      } catch (_) {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    const validateSession = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;
      const path = typeof window !== 'undefined' ? window.location?.pathname || '' : ''
      if (/^\/login\b/.test(path) || /^\/register\b/.test(path) || /^\/forgot-password\b/.test(path)) return;

      try {
        const res = await fetch('/api/users/me/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.status === 401 || res.status === 404) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthed(false);
          setDisplayName('');
        }
      } catch (_) {}
    };
    const isTest = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'test';
    if (!isTest) validateSession();
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    const handlerTouch = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('touchstart', handlerTouch, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handlerTouch);
    };
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
          {!authed ? (
            <>
              <a href="/home">首页</a>
              <span className={styles.navDivider}>|</span>
              <button className={styles.loginBtn} onClick={() => window.location.href = '/login'}>登录</button>
              <a href="/register">注册</a>
              <span className={styles.navDivider}>|</span>
              <a href="/orders">我的订单</a>
              <span className={styles.navDivider}>|</span>
              <a href="#">联系客服</a>
            </>
          ) : (
            <>
              <a href="/home">首页</a>
              <span className={styles.navDivider}>|</span>
              <div className={styles.userMenu} ref={menuRef} onMouseEnter={()=>setMenuOpen(true)} onMouseLeave={()=>setMenuOpen(false)} onTouchStart={()=>setMenuOpen(true)}>
                <button className={`${styles.userBtn} ${styles.userBadge}`}>
                  <img className={styles.avatar} src="/dist/assets/user_avatar.jpg" alt="avatar" />
                  <a href="/user-center/my-info" className={styles.idText} onClick={(e)=>e.stopPropagation()}>{displayName || ''}</a>
                </button>
                {menuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownHeaderTop}>
                        <img className={styles.avatar} src="/dist/assets/user_avatar.jpg" alt="avatar" />
                        <a href="/user-center/my-info" className={styles.memberName}>{displayName || ''}</a>
                        <span className={styles.caret}>›</span>
                      </div>
                      <div className={styles.dropdownHeaderBottom}>普通会员</div>
                    </div>
                    <a href="#" className={styles.dropdownItem}>我的积分</a>
                    <a href="#" className={styles.dropdownItem}>我的钱包</a>
                    <a href="#" className={styles.dropdownItem}>我的收藏</a>
                    <a href="/user-center/common-info/travelers" className={styles.dropdownItem}>常用信息</a>
                    <a href="#" className={styles.dropdownItem}>会员商城</a>
                    <a href="#" className={styles.dropdownItem}>合作卡</a>
                    <div className={styles.dropdownDivider}></div>
                    <button className={styles.dropdownItem} onClick={handleLogout}>退出登录</button>
                  </div>
                )}
              </div>
              <span className={styles.navDivider}>|</span>
              <a href="/orders">我的订单</a>
              <span className={styles.navDivider}>|</span>
              <a href="#">联系客服</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
