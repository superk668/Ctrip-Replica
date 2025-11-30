import React, { useEffect, useMemo, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './MyInfo.module.css';
import UserCenterSidebar from '../../components/UserCenter/UserCenterSidebar';

const Sidebar = () => (<UserCenterSidebar active="common" activeSub="travelers" />);

const Row = ({ label, value }) => (
  <div className={styles.infoRow}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{value}</div>
  </div>
);

const SectionTitle = ({ no, text }) => (
  <div className={styles.viewSectionHeader}>
    <span className={styles.badgeNo}>{no}</span>
    <span className={styles.sectionText}>{text}</span>
  </div>
);

const TravelerView = () => {
  const [rec, setRec] = useState(null);

  useEffect(() => {
    const searchStr = (typeof window !== 'undefined' && window.location && typeof window.location.search === 'string') ? window.location.search : (typeof location !== 'undefined' && typeof location.search === 'string' ? location.search : '');
    const params = new URLSearchParams(searchStr || '');
    const id = params.get('id');
    if (id) {
      fetchTraveler(id);
    }
  }, []);

  const fetchTraveler = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch(`/api/users/me/travelers/${id}`, {
        headers
      });
      const data = await res.json();
      if (data.success) {
        setRec(data.data.traveler);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.layout}>
          <Sidebar />
          <section className={styles.mainArea}>
            <div className={styles.headerBar}>
              <div className={styles.title}>查看常用旅客信息</div>
              <a href="/user-center/common-info/travelers" className={styles.actionLink}>查看所有旅客信息</a>
            </div>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <SectionTitle no={1} text="旅客信息" />
                <Row label="中文名" value={rec?.cnName || '未设置'} />
                <Row label="英文名" value={(rec?.enLast || rec?.enFirst) ? `${rec?.enLast||''} ${rec?.enFirst||''}` : '未设置'} />
                <Row label="国籍(国家/地区)" value={rec?.nationality || '未设置'} />
                <Row label="性别" value={rec?.gender || '未设置'} />
                <Row label="生日" value={rec?.birthday || '未设置'} />
                <Row label="出生地" value={rec?.birthplace || '未设置'} />
                <Row label="手机号" value={rec?.phone || '未设置'} />
                <Row label="传真号码" value={rec?.fax || '未设置'} />
                <Row label="Email" value={rec?.email || '未设置'} />
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardBody}>
                <SectionTitle no={2} text="证件信息" />
                <div className={styles.infoRow}><div className={styles.infoLabel}>证件类型</div><div className={styles.infoValue}>{rec?.document?.type || '未设置'}</div></div>
                <div className={styles.infoRow}><div className={styles.infoLabel}>证件号码</div><div className={styles.infoValue}>{rec?.document?.no || '未设置'}</div></div>
                <div className={styles.infoRow}><div className={styles.infoLabel}>有效期</div><div className={styles.infoValue}>{rec?.document?.validTill || '未设置'}</div></div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardBody}>
                <SectionTitle no={3} text="常旅客卡" />
                <div className={styles.infoValue}>{rec?.ffCard || '未设置'}</div>
              </div>
            </div>

            <a href="/user-center/common-info/travelers" className={styles.actionLink}>返回</a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TravelerView;
