import React from 'react';
import styles from './ProgressIndicator.module.css';

const ProgressIndicator = ({ currentStep, steps = ['验证手机', '设置密码', '注册成功'] }) => {
  return (
    <div className={styles.progressIndicator} data-step={currentStep}>
      {steps.map((stepText, index) => {
        const stepNumber = index + 1;
        const isActive = currentStep >= stepNumber;
        const isCompleted = currentStep > stepNumber;
        
        return (
          <div 
            key={stepNumber} 
            className={`${styles.step} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
          >
            <div className={styles.stepNumber}></div>
            <div className={styles.stepText}>{stepText}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressIndicator;