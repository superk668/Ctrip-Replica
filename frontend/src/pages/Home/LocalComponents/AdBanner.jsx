import React from 'react';
import styles from './AdBanner.module.css';

const AdBanner = () => {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <h2 className={styles.title}>机票6重服务保障</h2>
        <div className={styles.badge}>保障新升级，价格放心，出行安心</div>
      </div>
      <div className={styles.imageContainer}>
        {/* Placeholder for plane image */}
        <svg className={styles.planeIcon} viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M10,25 L40,25 L50,10 L70,10 L50,25 L90,25 L95,20 L100,20 L95,30 L20,30 Z" fill="rgba(255,255,255,0.8)"/>
        </svg>
      </div>
    </div>
  );
};

export default AdBanner;
