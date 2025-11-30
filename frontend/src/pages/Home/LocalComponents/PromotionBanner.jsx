import React from 'react';
import styles from './PromotionBanner.module.css';

const itemsTop = [
  { key: '酒店', label: '酒店' },
  { key: '机票', label: '机票' },
  { key: '火车票', label: '火车票' },
  { key: '旅游', label: '旅游' },
  { key: '门票·活动', label: '门票·活动' },
  { key: '汽车·船票', label: '汽车·船票' },
  { key: '用车', label: '用车' },
];

const itemsMiddle = [
  { key: 'AI行程助手', label: 'AI行程助手', badge: 'NEW' },
  { key: '攻略·景点', label: '攻略·景点' },
  { key: '旅游地图', label: '旅游地图' },
];

const itemsBottom = [
  { key: '全球购', label: '全球购' },
  { key: '礼品卡', label: '礼品卡' },
  { key: '携程金融', label: '携程金融' },
];

const itemsLast = [
  { key: '企业商旅', label: '企业商旅' },
  { key: '老友会', label: '老友会' },
  { key: '关于携程', label: '关于携程' },
];

function Icon({ text }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="0" y="0" width="24" height="24" rx="6" className={styles.iconBg}></rect>
      <text x="12" y="14" textAnchor="middle" className={styles.iconText}>{text}</text>
    </svg>
  );
}

const Section = ({ data }) => (
  <ul className={styles.list}>
    {data.map(item => (
      <li key={item.key} className={styles.item}>
        <Icon text="占位" />
        <span className={styles.label}>{item.label}</span>
        {item.badge && <span className={styles.badge}>{item.badge}</span>}
      </li>
    ))}
  </ul>
);

const PromotionBanner = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.menuTrigger}>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
        <span className={styles.bar}></span>
      </div>
      <Section data={itemsTop} />
      <div className={styles.divider}></div>
      <Section data={itemsMiddle} />
      <div className={styles.divider}></div>
      <Section data={itemsBottom} />
      <div className={styles.divider}></div>
      <Section data={itemsLast} />
    </aside>
  );
};

export default PromotionBanner;