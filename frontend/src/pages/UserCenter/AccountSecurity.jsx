import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="center" activeSubCenter="security" />);

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
