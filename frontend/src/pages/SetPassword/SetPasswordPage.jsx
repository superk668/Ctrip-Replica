import React from 'react';
import styles from './SetPasswordPage.module.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ProgressIndicator from '../../components/ProgressIndicator/ProgressIndicator';
import SetPasswordForm from '../../components/SetPasswordForm/SetPasswordForm';

const SetPasswordPage = () => {
  const steps = ['验证手机', '设置密码', '注册成功'];

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <ProgressIndicator steps={steps} currentStep={1} />
        <SetPasswordForm />
      </main>
      <Footer />
    </div>
  );
};

export default SetPasswordPage;