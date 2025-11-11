import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>携程首页（占位）</h1>
        <p className={styles.desc}>这是一个用于演示页面跳转逻辑的占位首页。</p>
        <div className={styles.actions}>
          <Link to="/login" className={styles.button}>登录</Link>
          <Link to="/register" className={styles.link}>免费注册</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;