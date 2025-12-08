import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ForgotPasswordForm from '../../components/ForgotPasswordForm/ForgotPasswordForm';
import styles from './ForgotPasswordPage.module.css';

const ForgotPasswordPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <ForgotPasswordForm />
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;