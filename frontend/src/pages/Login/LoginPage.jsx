import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import LoginForm from '../../components/LoginForm/LoginForm';
import VerificationCodeForm from '../../components/VerificationCodeForm/VerificationCodeForm';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const LoginPage = () => {
  const [isVerificationMode, setIsVerificationMode] = useState(false);

  const handleSwitchMode = () => {
    setIsVerificationMode(!isVerificationMode);
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.banner}>
        <p>依据《网络安全法》，为保障您的帐号安全与正常使用，请尽快完成手机号验证！</p>
      </div>
      <div className={`${styles.container} ${isVerificationMode ? styles.verificationActive : ''}`}>
        {isVerificationMode ? (
          <VerificationCodeForm onSwitchMode={handleSwitchMode} />
        ) : (
          <LoginForm onSwitchMode={handleSwitchMode} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;