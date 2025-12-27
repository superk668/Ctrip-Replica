import React, { useState } from 'react';
import styles from './RecommendationSection.module.css';

const mockData = [
  {
    id: 1,
    title: '周末省心游',
    theme: 'green',
    routes: [
      { rank: 1, from: '北京', to: '大连', price: 430, date: '12-20 去 12-23 回', discount: '2.4折', img: '' },
      { rank: 2, from: '北京', to: '宁波', price: 510, date: '12-19 去 12-20 回', discount: '1.5折', img: '' },
      { rank: 3, from: '北京', to: '杭州', price: 575, date: '12-13 去 12-15 回', discount: '1.2折', img: '' },
      { rank: 4, from: '北京', to: '合肥', price: 580, date: '12-13 去 12-15 回', discount: '1.8折', img: '' },
      { rank: 5, from: '北京', to: '长沙', price: 580, date: '12-13 去 12-16 回', discount: '1.5折', img: '' },
    ]
  },
  {
    id: 2,
    title: '爱上大草原',
    theme: 'orange',
    routes: [
      { rank: 1, from: '北京', to: '鄂尔多斯', price: 250, date: '2025-12-09 周二', discount: '2折', img: '' },
      { rank: 2, from: '北京', to: '通辽', price: 275, date: '2025-12-11 周四', discount: '3折', img: '' },
      { rank: 3, from: '北京', to: '锡林浩特', price: 330, date: '2025-12-22 周一', discount: '5.3折', img: '' },
      { rank: 4, from: '北京', to: '赤峰', price: 360, date: '2025-12-14 周日', discount: '' },
      { rank: 5, from: '北京', to: '伊宁', price: 449, date: '2025-12-20 周六', discount: '1折', img: '' },
    ]
  },
  {
    id: 3,
    title: '海边浪一浪',
    theme: 'blue',
    routes: [
      { rank: 1, from: '北京', to: '大连', price: 220, date: '2025-12-20 周六', discount: '2.4折', img: '' },
      { rank: 2, from: '北京', to: '宁波', price: 260, date: '2025-12-10 周三', discount: '1.9折', img: '' },
      { rank: 3, from: '北京', to: '深圳', price: 300, date: '2025-12-10 周三', discount: '1.2折', img: '' },
      { rank: 4, from: '北京', to: '福州', price: 300, date: '2025-12-17 周三', discount: '1.5折', img: '' },
      { rank: 5, from: '北京', to: '舟山', price: 350, date: '2025-12-30 周二', discount: '' },
    ]
  }
];

const Card = ({ data }) => {
  const themeClass = styles[data.theme] || styles.blue;
  
  return (
    <div className={styles.card}>
      <div className={`${styles.cardHeader} ${themeClass}`}>
        <span className={styles.cardTitle}>{data.title}</span>
        <span className={styles.arrow}>&gt;</span>
      </div>
      <div className={styles.cardBody}>
        {data.routes.map((route, idx) => (
          <div key={idx} className={styles.routeRow}>
            <div className={`${styles.rank} ${styles['rank'+route.rank]}`}>{route.rank}</div>
            <div className={styles.thumb}>
               {/* Placeholder image */}
               <div className={styles.imgPlaceholder} style={{background: `hsl(${idx * 60}, 70%, 80%)`}}></div>
            </div>
            <div className={styles.info}>
              <div className={styles.routeTitle}>{route.from} ⇌ {route.to}</div>
              <div className={styles.routeDate}>{route.date}</div>
            </div>
            <div className={styles.priceInfo}>
              <div className={styles.price}>¥{route.price}<span className={styles.qi}>起</span></div>
              {route.discount && <div className={styles.discount}>{route.discount}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecommendationSection = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>
          <h3 className={styles.mainTitle}>低价速报</h3>
          <div className={styles.inputGroup}>
            <span className={styles.label}>出发地:</span>
            <input className={styles.input} placeholder="请输入出发地" defaultValue="" />
          </div>
        </div>
        <div className={styles.right}>
          <a href="#" className={styles.moreLink}>更多目的地 &gt;</a>
        </div>
      </div>
      <div className={styles.grid}>
        {mockData.map(item => <Card key={item.id} data={item} />)}
      </div>
    </div>
  );
};

export default RecommendationSection;
