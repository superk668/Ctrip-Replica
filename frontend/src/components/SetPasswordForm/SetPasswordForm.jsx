import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SetPasswordForm.module.css';

const SetPasswordForm = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.setPasswordForm}>
      <div className={styles.formItem}>
        <span className={styles.label}>注册手机号</span>
        <span className={styles.phone}>86-138****3769</span>
      </div>
      <div className={styles.formItem}>
        <label htmlFor="password" className={styles.label}>密码</label>
        <div className={styles.passwordWrapper}>
          <input type="password" id="password" className={styles.passwordInput} placeholder="8-20位字母、数字和符号" />
          <div className={styles.strengthIndicator}>
            <span className={styles.weak}>弱</span>
            <span className={styles.medium}>中</span>
            <span className={styles.strong}>强</span>
          </div>
        </div>
      </div>
      <div className={styles.formItem}>
        <label htmlFor="confirmPassword" className={styles.label}>确认密码</label>
        <input type="password" id="confirmPassword" className={styles.passwordInput} placeholder="再次输入密码" />
      </div>
      <button className={styles.submitButton}>完成</button>
      <a href="#" className={styles.link}>注册遇到问题？</a>
      <a href="#" className={styles.link} onClick={(e) => { e.preventDefault(); navigate('/register'); }}>&lt; 返回上一步</a>
    </div>
  );
};

export default SetPasswordForm;