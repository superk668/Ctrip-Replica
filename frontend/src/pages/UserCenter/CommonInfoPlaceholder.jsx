import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const titleBySection = {
  contacts: '常用联系人',
  invoices: '常用报销凭证',
  addresses: '常用地址',
};

const CommonInfoPlaceholder = () => {
  const params = useParams();
  const section = params?.section || '';
  const title = titleBySection[section] || '常用信息';

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <UserCenterSidebar active="common" activeSub={section} />
          <section className={styles.mainArea}>
            <div className={styles.headerBar}>
              <div className={styles.title}>{title}</div>
              <div className={styles.hint}>功能开发中</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <div>该功能暂未开放，敬请期待。</div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommonInfoPlaceholder;

