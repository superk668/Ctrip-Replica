import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="center" activeSubCenter="bind-link" />);

const Row = ({ label, value, action }) => (
  <div className={styles.infoRow}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{value}</div>
    {action && <a className={styles.actionLink} href="#">{action}</a>}
  </div>
);

const BindLink = () => (
  <div className={styles.container}>
    <Header />
    <main className={styles.main}>
      <div className={styles.layout}>
        <Sidebar />
        <section className={styles.mainArea}>
          <div className={styles.headerBar}>
            <div className={styles.title}>绑定和关联</div>
            <div className={styles.hint}>绑定第三方账户以便快捷登录与同步</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}><div>账户绑定</div></div>
            <div className={styles.cardBody}>
              <Row label="微信" value="未绑定" action="绑定" />
              <Row label="QQ" value="未绑定" action="绑定" />
              <Row label="邮箱" value="未绑定" action="绑定" />
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default BindLink;
