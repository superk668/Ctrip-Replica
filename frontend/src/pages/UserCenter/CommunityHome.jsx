import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="center" activeSubCenter="community" />);

const CommunityHome = () => (
  <div className={styles.container}>
    <Header />
    <main className={styles.main}>
      <div className={styles.layout}>
        <Sidebar />
        <section className={styles.mainArea}>
          <div className={styles.headerBar}>
            <div className={styles.title}>我的社区主页</div>
            <div className={styles.hint}>展示你的动态与收藏</div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardHeader}><div>近期动态</div></div>
            <div className={styles.cardBody}>暂无内容</div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </div>
);

export default CommunityHome;
