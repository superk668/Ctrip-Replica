import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './ForgotPasswordPage.module.css';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>找回密码（占位）</h1>
        <p className={styles.desc}>此页面为占位，后续可按照流程：验证手机号 → 设置新密码。</p>
        <div className={styles.actions}>
          <Link to="/login" className={styles.button}>返回登录</Link>
          <Link to="/register" className={styles.link}>免费注册</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;