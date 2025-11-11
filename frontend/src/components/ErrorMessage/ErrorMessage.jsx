import React from 'react';
import styles from './ErrorMessage.module.css';

const ErrorMessage = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={styles.errorMessage}>
      {message}
    </div>
  );
};

export default ErrorMessage;