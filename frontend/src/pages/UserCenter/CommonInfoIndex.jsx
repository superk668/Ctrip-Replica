import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="common" />);

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
