import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const LoginForm = ({ onSwitchMode }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    if (!username) {
      setError('请输入用户名');
      setIsSubmitting(false);
      return;
    }
    if (!password) {
      setError('请输入密码');
      setIsSubmitting(false);
      return;
    }
    if (!agreeToTerms) {
      setError('请阅读并同意服务协议和个人信息保护政策');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, agreeToTerms }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('登录成功:', data);
        const token = data?.data?.token || data?.token;
        if (token) {
          localStorage.setItem('token', token);
        }
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
    <div className={styles.loginForm}>
      <div className={styles.title}>账号密码登录</div>
      <ErrorMessage message={error} />
      <div className={styles.inputGroup}>
        <input
          type="text"
          placeholder="国内手机号/用户名/邮箱/卡号"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <input
          type="password"
          placeholder="登录密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Link to="/forgot-password" className={styles.forgotPassword}>忘记密码</Link>
      </div>
      <button className={styles.loginButton} onClick={handleLogin} disabled={isSubmitting}>{isSubmitting ? '登录中…' : '登录'}</button>
      <div className={styles.agreement}>
        <input
          type="checkbox"
          id="agreement"
          checked={agreeToTerms}
          onChange={(e) => setAgreeToTerms(e.target.checked)}
        />
        <label htmlFor="agreement">
          阅读并同意携程的 <a href="#">服务协议</a> 和 <a href="#">个人信息保护政策</a>
        </label>
      </div>
      <div className={styles.links}>
        <button onClick={onSwitchMode} className={styles.switchButton}>验证码登录</button>
        <Link to="/register">免费注册</Link>
      </div>
      <div className={styles.socialLogin}>
        <span>社交帐号登录</span>
        <div className={styles.socialIcons}>
          <a href="#"><i className="fa fa-weixin"></i></a>
          <a href="#"><i className="fa fa-qq"></i></a>
          <a href="#"><i className="fa fa-weibo"></i></a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;