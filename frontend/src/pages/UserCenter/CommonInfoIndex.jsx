import React from 'react';
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
    <a className={`${styles.menuItem} ${styles.menuItemActive}`} href="/user-center/common-info">常用信息</a>
    <a className={styles.menuItem} href="/user-center/common-info/travelers">常用旅客信息</a>
    <a className={styles.menuItem} href="/user-center/common-info/contacts">常用联系人</a>
    <a className={styles.menuItem} href="/user-center/common-info/invoices">常用报销凭证</a>
    <a className={styles.menuItem} href="/user-center/common-info/addresses">常用地址</a>
    <div className={styles.sectionTitle}>个人中心</div>
    <a className={styles.menuItem} href="/user-center/my-info">我的信息</a>
    <a className={styles.menuItem} href="/user-center/bind-link">绑定和关联</a>
    <a className={styles.menuItem} href="/user-center/security">账户安全</a>
    <a className={styles.menuItem} href="/user-center/community">我的社区主页</a>
  </aside>
);

const CommonInfoIndex = () => (
  <div className={styles.container}>
    <Header />
    <main className={styles.main}>
      <div className={styles.layout}>
        <Sidebar />
        <section className={styles.mainArea}>
          <div className={styles.headerBar}>
            <div className={styles.title}>常用信息</div>
            <div className={styles.hint}>请选择需要管理的类型</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardBody}>
              <div className={styles.gridButtons}>
                <a className={styles.infoBtn} href="/user-center/common-info/travelers">常用旅客信息</a>
                <a className={styles.infoBtn} href="/user-center/common-info/contacts">常用联系人</a>
                <a className={styles.infoBtn} href="/user-center/common-info/invoices">常用报销凭证</a>
                <a className={styles.infoBtn} href="/user-center/common-info/addresses">常用地址</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default CommonInfoIndex;
