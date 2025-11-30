import React, { useState } from 'react';
import styles from '../../pages/UserCenter/MyInfo.module.css';

const UserCenterSidebar = ({ active = '', activeSub = '', activeSubCenter = '' }) => {
  const [commonOpen, setCommonOpen] = useState(active === 'common' || !!activeSub);
  const [centerOpen, setCenterOpen] = useState(active === 'center' || !!activeSubCenter);
  React.useEffect(() => { setCommonOpen(active === 'common' || !!activeSub); }, [active, activeSub]);
  React.useEffect(() => { setCenterOpen(active === 'center' || !!activeSubCenter); }, [active, activeSubCenter]);
  return (
    <aside className={styles.sidebar}>
      <div className={`${styles.sectionTitle} ${active==='home' ? styles.menuItemActive : ''}`}>我的携程首页</div>
      <a className={`${styles.menuItem} ${active==='orders' ? styles.menuItemActive : ''}`} href="/orders">订单</a>
      <div className={styles.menuItem}>我的消息</div>
      <div className={styles.menuItem}>钱包</div>
      <div className={styles.menuItem}>礼品卡</div>
      <div className={styles.menuItem}>优惠券</div>
      <div className={styles.menuItem}>积分</div>
      <div className={styles.menuItem}>我的收藏</div>

      <div
        className={`${styles.sectionTitle} ${styles.sectionTitleCaret} ${!commonOpen ? styles.sectionTitleCollapsed : ''} ${active==='common' ? styles.menuItemActive : ''}`}
        onClick={() => setCommonOpen(v=>!v)}
      >常用信息</div>
      {commonOpen && (
        <>
          <a className={`${styles.menuItem} ${activeSub==='travelers' ? styles.menuItemActive : ''}`} href="/user-center/common-info/travelers">常用旅客信息</a>
          <a className={`${styles.menuItem} ${activeSub==='contacts' ? styles.menuItemActive : ''}`} href="/user-center/common-info/contacts">常用联系人</a>
          <a className={`${styles.menuItem} ${activeSub==='invoices' ? styles.menuItemActive : ''}`} href="/user-center/common-info/invoices">常用报销凭证</a>
          <a className={`${styles.menuItem} ${activeSub==='addresses' ? styles.menuItemActive : ''}`} href="/user-center/common-info/addresses">常用地址</a>
        </>
      )}

      <div
        className={`${styles.sectionTitle} ${styles.sectionTitleCaret} ${!centerOpen ? styles.sectionTitleCollapsed : ''} ${active==='center' ? styles.menuItemActive : ''}`}
        onClick={() => setCenterOpen(v=>!v)}
      >个人中心</div>
      {centerOpen && (
        <>
          <a className={`${styles.menuItem} ${activeSubCenter==='my-info' ? styles.menuItemActive : ''}`} href="/user-center/my-info">我的信息</a>
          <a className={`${styles.menuItem} ${activeSubCenter==='bind-link' ? styles.menuItemActive : ''}`} href="/user-center/bind-link">绑定和关联</a>
          <a className={`${styles.menuItem} ${activeSubCenter==='security' ? styles.menuItemActive : ''}`} href="/user-center/security">账户安全</a>
          <a className={`${styles.menuItem} ${activeSubCenter==='community' ? styles.menuItemActive : ''}`} href="/user-center/community">我的社区主页</a>
        </>
      )}
    </aside>
  );
};

export default UserCenterSidebar;
