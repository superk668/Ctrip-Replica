import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterForm.module.css';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let timer;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCountingDown(false);
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    if (password.length >= 8 && strength > 2) strength++;

    if (strength <= 2) setPasswordStrength(1); // weak
    else if (strength <= 4) setPasswordStrength(2); // medium
    else setPasswordStrength(3); // strong
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const handleSendCode = async () => {
    setError('');
    if (isCountingDown) return;

    try {
      // 统一后端字段：使用 /api/auth/send-code，提交 { phone, type }
      const normalizedPhone = (phoneNumber || '').replace(/\D/g, '').trim();
      // 前端先校验手机号格式，避免后端直接返回“参数验证失败”但用户不知具体原因
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(normalizedPhone)) {
        setError('手机号格式不正确');
        return;
      }

      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: normalizedPhone, type: 'register' }),
      });

      const data = await response.json();

      if (response.ok) {
        // 中文接口返回统一结构 { success, message }
        alert(data?.message || '验证码发送成功');
        setIsCountingDown(true);
        setCountdown(60);
      } else {
        const msg = data?.error || data?.message || (Array.isArray(data?.errors) ? data.errors.map(e => e.msg || e).join('；') : '') || '发送验证码失败，请稍后重试';
        setError(msg);
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      setError('发送验证码失败，请稍后重试');
    }
  };

  const handleStep1Submit = async () => {
    setError('');
    if (!agreeToTerms) {
      setError('请同意《服务协议》和《隐私政策》');
      return;
    }

    try {
      // 与后端实际校验一致：走 /api/user/register-step1，提交 { phone, code }
      const normalizedPhone = (phoneNumber || '').replace(/\D/g, '').trim();
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(normalizedPhone)) {
        setError('手机号格式不正确');
        return;
      }
      const codeRegex = /^\d{6}$/;
      if (!codeRegex.test(verificationCode || '')) {
        setError('验证码格式不正确');
        return;
      }

      const response = await fetch('/api/user/register-step1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: normalizedPhone, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        // 后端返回 { success: true, message: '验证成功' }
        setStep(2);
      } else {
        const msg = data?.error || data?.message || (Array.isArray(data?.errors) ? data.errors.map(e => e.msg || e).join('；') : '') || '验证失败，请稍后重试';
        setError(msg);
      }
    } catch (error) {
      console.error('注册第一步失败:', error);
      setError('注册第一步失败，请稍后重试');
    }
  };

  const handleStep2Submit = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      // 使用真正创建用户的接口：/api/user/register-step2
      // 该接口会在数据库中创建用户，并返回 token 与 user 信息
      const normalizedPhone = (phoneNumber || '').replace(/\D/g, '').trim();
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(normalizedPhone)) {
        setError('手机号格式不正确');
        return;
      }
      // 前端同步检查密码强度以给出更清晰提示（至少8位且包含字母和数字）
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passwordRegex.test(password || '')) {
        setError('密码必须至少8位且包含字母和数字');
        return;
      }

      const response = await fetch('/api/user/register-step2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: normalizedPhone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 注册成功后提示并跳转到登录页
        // 后端返回的数据结构为 { success: true, data: { token, user } }
        try {
          const username = data?.data?.user?.username;
          if (username) {
            alert(`注册成功！系统已为您生成用户名：${username}。您也可以直接使用手机号登录。`);
          } else {
            alert('注册成功！您可以使用手机号登录。');
          }
        } catch (_) {
          alert('注册成功！');
        }
        // 注册成功后跳转到登录页面
        navigate('/login');
      } else {
        // 兼容后端返回的多种错误结构
        const msg = data?.error || data?.message || (Array.isArray(data?.errors) ? data.errors.map(e => e.msg || e).join('；') : '') || '注册失败，请稍后重试';
        setError(msg);
      }
    } catch (error) {
      console.error('注册第二步失败:', error);
      setError('注册第二步失败，请稍后重试');
    }
  };

  return (
    <div className={styles.registerForm}>
      <ProgressIndicator currentStep={step} />
      <ErrorMessage message={error} />
      {step === 1 && (
        <>
          <div className={styles.formItem}>
            <label htmlFor="phone">手机号</label>
            <select className={styles.phoneSelect}>
              <option>中国大陆 86</option>
            </select>
            <input
              type="text"
              id="phone"
              placeholder="有效手机号"
              className={styles.phoneInput}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className={styles.formItem}>
            <label htmlFor="verificationCode">短信验证码</label>
            <input
              type="text"
              id="verificationCode"
              placeholder="6位数字"
              className={styles.verificationCodeInput}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
            <button className={styles.sendCodeButton} onClick={handleSendCode} disabled={isCountingDown}>
              {isCountingDown ? `重新发送(${countdown}s)` : '发送验证码'}
            </button>
          </div>
          <div className={styles.agreement}>
            <input
              type="checkbox"
              id="agreement"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
            />
            <label htmlFor="agreement">同意《服务协议》和《隐私政策》</label>
          </div>
          <button className={styles.submitButton} onClick={handleStep1Submit}>下一步，设置密码</button>
        </>
      )}
      {step === 2 && (
        <>
          <div className={styles.formItem}>
            <label htmlFor="password">设置密码</label>
            <div className={styles.passwordField}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="6-20位，建议字母、数字、符号组合"
                className={styles.passwordInput}
                value={password}
                onChange={handlePasswordChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.showPasswordButton}>
                {showPassword ? '隐藏' : '显示'}
              </button>
            </div>
            <div className={styles.passwordStrengthInline}>
              <div
                data-testid="strength-weak"
                data-active={passwordStrength === 1 ? 'true' : 'false'}
                className={`${styles.strengthBar} ${passwordStrength === 1 ? styles.weak : ''}`}
              >
                弱
              </div>
              <div
                data-testid="strength-medium"
                data-active={passwordStrength === 2 ? 'true' : 'false'}
                className={`${styles.strengthBar} ${passwordStrength === 2 ? styles.medium : ''}`}
              >
                中
              </div>
              <div
                data-testid="strength-strong"
                data-active={passwordStrength === 3 ? 'true' : 'false'}
                className={`${styles.strengthBar} ${passwordStrength === 3 ? styles.strong : ''}`}
              >
                强
              </div>
            </div>
          </div>
          <div className={styles.formItem}>
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="再次输入密码"
              className={styles.passwordInput}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button className={styles.submitButton} onClick={handleStep2Submit}>完成注册</button>
        </>
      )}
      <div className={styles.enterpriseLink}>
        <a href="#">企业客户注册</a>
      </div>
    </div>
  );
};

export default RegisterForm;