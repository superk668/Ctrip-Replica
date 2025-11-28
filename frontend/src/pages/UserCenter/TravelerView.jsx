import React, { useEffect, useMemo, useState } from 'react';
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
    <a className={`${styles.menuItem} ${styles.menuItemActive}`} href="/user-center/common-info/travelers">常用旅客信息</a>
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
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      fetchTraveler(id);
    }
  }, []);

  const fetchTraveler = async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`/api/users/me/travelers/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
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
