import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './VerificationCodeForm.module.css';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const VerificationCodeForm = ({ onSwitchMode }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCountingDown(false);
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  const handleSendCode = async () => {
    setError('');
    if (isCountingDown) return;

    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, type: 'login' }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('验证码发送成功');
        setIsCountingDown(true);
        setCountdown(60);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      setError('发送验证码失败，请稍后重试');
    }
  };

  const handleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    if (!phoneNumber) {
      setError('请输入手机号');
      setIsSubmitting(false);
      return;
    }
    if (!verificationCode) {
      setError('请输入验证码');
      setIsSubmitting(false);
      return;
    }
    if (!agreeToTerms) {
      setError('先请阅读并勾选服务协议');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/phone-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, code: verificationCode }),
      });

      const data = await response.json();
      if (response.ok) {
        const token = (data && data.token) || (data && data.data && data.data.token) || '';
        const user = (data && data.user) || (data && data.data && data.data.user) || null;
        if (token) localStorage.setItem('token', token);
        if (user) localStorage.setItem('user', JSON.stringify(user));
        navigate('/home');
      } else {
        const errMsg = data.error || data.message || '登录失败';
        const details = Array.isArray(data.errors) ? data.errors.map(e => e.msg || e.message).join('；') : '';
        setError(details ? `${errMsg}：${details}` : errMsg);
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      setError('登录请求失败，请稍后重试');
    }
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.form}>
      <h2 className={styles.title}>验证码登录</h2>
      <ErrorMessage message={error} />
      <div className={styles.inputGroup}>
        <div className={styles.countryCode}>中国大陆 86</div>
        <input
          type="text"
          placeholder="请输入手机号"
          className={styles.input}
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="短信验证码"
          className={styles.input}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button className={styles.sendCodeButton} onClick={handleSendCode} disabled={isCountingDown}>
          {isCountingDown ? `重新发送(${countdown}s)` : '发送验证码'}
        </button>
      </div>
      <button className={styles.loginButton} onClick={handleLogin} disabled={isSubmitting}>{isSubmitting ? '登录中…' : '登录'}</button>
      <div className={styles.agreement}>
        <input
          type="checkbox"
          id="agreement-code"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
        />
        <label htmlFor="agreement-code">阅读并同意携程的 <span>服务协议</span> 和 <span>个人信息保护政策</span></label>
      </div>
      <div className={styles.footer}>
        <a href="#" onClick={onSwitchMode}>账号登录</a>
      </div>
    </div>
  );
};

export default VerificationCodeForm;