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

    // 验证 Token 有效性（例如后端重启后 User ID 变更导致 Token 失效）
    const validateSession = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) return;

      try {
        // 使用 profile 接口验证 Token 对应的用户是否存在
        const res = await fetch('/api/users/me/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
          // 401 Unauthorized 或 404 User Not Found
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUsername('');
        }
      } catch (_) {
        // 网络错误暂不处理，以免误登出
      }
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
          {!username ? (
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
                  <a href="/user-center/my-info" className={styles.idText} onClick={(e)=>e.stopPropagation()}>{username || ''}</a>
                </button>
                {menuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownHeaderTop}>
                        <img className={styles.avatar} src="/dist/assets/user_avatar.jpg" alt="avatar" />
                        <a href="/user-center/my-info" className={styles.memberName}>{username || ''}</a>
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
