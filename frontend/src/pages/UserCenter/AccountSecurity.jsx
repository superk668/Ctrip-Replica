import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';

const Sidebar = () => (
  <aside className={styles.sidebar}>
    <div className={styles.sectionTitle}>我的携程首页</div>
    <div className={styles.sideGroup}>快捷入口</div>
    <a className={styles.menuItem} href="/orders">订单</a>
    <a className={styles.menuItem} href="#">我的消息</a>
    <div className={styles.sectionTitle}>常用信息</div>
    <a className={styles.menuItem} href="/user-center/common-info">常用信息</a>
    <a className={styles.menuItem} href="/user-center/common-info/travelers">常用旅客信息</a>
    <a className={styles.menuItem} href="/user-center/common-info/contacts">常用联系人</a>
    <a className={styles.menuItem} href="/user-center/common-info/invoices">常用报销凭证</a>
    <a className={styles.menuItem} href="/user-center/common-info/addresses">常用地址</a>
    <div className={styles.sectionTitle}>个人中心</div>
    <a className={styles.menuItem} href="/user-center/my-info">我的信息</a>
    <a className={styles.menuItem} href="/user-center/bind-link">绑定和关联</a>
    <a className={`${styles.menuItem} ${styles.menuItemActive}`} href="/user-center/security">账户安全</a>
    <a className={styles.menuItem} href="/user-center/community">我的社区主页</a>
  </aside>
);

const Row = ({ label, value, action }) => (
  <div className={styles.infoRow}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{value}</div>
    {action && <a className={styles.actionLink} href="#">{action}</a>}
  </div>
);

const AccountSecurity = () => {
  const [phoneMasked, setPhoneMasked] = useState('未设置');
  const [emailStatus, setEmailStatus] = useState('未设置');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch('/api/users/me/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setPhoneMasked(data.data.phoneMasked || '未设置');
          setEmailStatus(data.data.emailStatus || '未设置');
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <Sidebar />
          <section className={styles.mainArea}>
            <div className={styles.headerBar}>
              <div className={styles.title}>账户安全</div>
              <div className={styles.hint}>建议完善安全设置以保护账户</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardHeader}><div>安全设置</div></div>
              <div className={styles.cardBody}>
                <Row label="登录密码" value="已设置" action="修改" />
                <Row label="安全手机" value={phoneMasked} action="设置" />
                <Row label="安全邮箱" value={emailStatus} action="设置" />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountSecurity;
