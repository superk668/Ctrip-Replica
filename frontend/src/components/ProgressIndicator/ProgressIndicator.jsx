import React from 'react';
import styles from './ProgressIndicator.module.css';

const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className={styles.progressIndicator}>
      <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
        <div className={styles.stepNumber}>1</div>
        <div className={styles.stepText}>验证手机</div>
      </div>
      <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
        <div className={styles.stepNumber}>2</div>
        <div className={styles.stepText}>设置密码</div>
      </div>
      <div className={`${styles.step} ${currentStep === 3 ? styles.active : ''}`}>
        <div className={styles.stepNumber}>3</div>
        <div className={styles.stepText}>注册成功</div>
      </div>
    </div>
  );
};

export default ProgressIndicator;