import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/images/logo-ctrip.png';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logo} alt="Ctrip Logo" />
      </div>
      <nav className={styles.navigation}>
        <a href="#">首页</a>
        <a href="#"><i className="fa fa-heart-o"></i></a>
        <a href="#"><i className="fa fa-user-o"></i></a>
      </nav>
    </header>
  );
};

export default Header;