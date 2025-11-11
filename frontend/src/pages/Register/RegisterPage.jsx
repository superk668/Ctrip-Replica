import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import styles from './RegisterPage.module.css';

const RegisterPage = () => {
  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <RegisterForm />
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;