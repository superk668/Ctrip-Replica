import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPasswordForm.module.css';
import ProgressIndicator from '../ProgressIndicator/ProgressIndicator';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    let timer;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsCountingDown(false);
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown]);

  // 手机号脱敏处理
  const maskPhone = (phone) => {
    if (!phone || phone.length < 11) return phone;
    return phone.substring(0, 3) + '****' + phone.substring(7);
  };

  // 密码强度检测
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

  // Step 1: 验证手机号是否已注册
  const handleStep1Submit = async () => {
    setError('');
    
    try {
      const normalizedPhone = (phoneNumber || '').replace(/\D/g, '').trim();
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(normalizedPhone)) {
        setError('手机号格式不正确');
        return;
      }

      const response = await fetch('/api/auth/reset-password/step1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: normalizedPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        setPhoneNumber(normalizedPhone);
        setStep(2);
      } else {
        const msg = data?.error || data?.message || '验证失败，请稍后重试';
        setError(msg);
      }
    } catch (error) {
      console.error('验证手机号失败:', error);
      setError('验证失败，请稍后重试');
    }
  };

  // 发送验证码
  const handleSendCode = async () => {
    setError('');
    if (isCountingDown) return;

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, type: 'reset' }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data?.message || '验证码发送成功');
        setIsCountingDown(true);
        setCountdown(60);
      } else {
        const msg = data?.error || data?.message || '发送验证码失败，请稍后重试';
        setError(msg);
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      setError('发送验证码失败，请稍后重试');
    }
  };

  // Step 2: 验证验证码
  const handleStep2Submit = async () => {
    setError('');
    
    try {
      const codeRegex = /^\d{6}$/;
      if (!codeRegex.test(verificationCode || '')) {
        setError('验证码格式不正确');
        return;
      }

      const response = await fetch('/api/auth/reset-password/step2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
      } else {
        const msg = data?.error || data?.message || '验证码错误或已过期';
        setError(msg);
      }
    } catch (error) {
      console.error('验证验证码失败:', error);
      setError('验证失败，请稍后重试');
    }
  };

  // Step 3: 重置密码
  const handleStep3Submit = async () => {
    setError('');
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    // 验证密码格式
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('密码必须至少8位且包含字母和数字');
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password/step3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneNumber, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccessMessage(true);
        // 2秒后跳转到登录页
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const msg = data?.error || data?.message || '密码重置失败，请稍后重试';
        setError(msg);
      }
    } catch (error) {
      console.error('密码重置失败:', error);
      setError('密码重置失败，请稍后重试');
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const steps = ['填写账号', '验证', '重置密码'];

  return (
    <div className={styles.formContainer}>
      <ProgressIndicator currentStep={step} steps={steps} />
      
      {error && <ErrorMessage message={error} />}

      {/* Step 1: 填写账号 */}
      {step === 1 && (
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label htmlFor="phone" className={styles.label}>
              账号
            </label>
            <input
              type="text"
              id="phone"
              className={styles.input}
              placeholder="手机号/用户名/邮箱/卡号"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          
          <div className={styles.hint}>
            境外手机请输入国家码-手机号，如852-18616666666
          </div>

          <button
            className={styles.submitButton}
            onClick={handleStep1Submit}
          >
            下一步，验证
          </button>
        </div>
      )}

      {/* Step 2: 验证 */}
      {step === 2 && (
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>账号</label>
            <div className={styles.maskedPhone}>{maskPhone(phoneNumber)}</div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>绑定手机</label>
            <div className={styles.phoneInfo}>86-{maskPhone(phoneNumber)}</div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="code" className={styles.label}>
              验证码
            </label>
            <div className={styles.codeInputWrapper}>
              <input
                type="text"
                id="code"
                className={styles.codeInput}
                placeholder="6位数字"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <button
                className={`${styles.sendCodeButton} ${isCountingDown ? styles.disabled : ''}`}
                onClick={handleSendCode}
                disabled={isCountingDown}
              >
                {isCountingDown ? `${countdown}秒后重新发送` : '发送验证码'}
              </button>
            </div>
          </div>

          <button
            className={styles.submitButton}
            onClick={handleStep2Submit}
          >
            下一步，验证
          </button>

          <div className={styles.backLink} onClick={handleBack}>
            &lt; 返回上一步
          </div>
        </div>
      )}

      {/* Step 3: 重置密码 */}
      {step === 3 && (
        <div className={styles.formGroup}>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              新密码
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={styles.input}
                placeholder="请设置新密码"
                value={password}
                onChange={handlePasswordChange}
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              确认新密码
            </label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={styles.input}
                placeholder="再次输入密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </span>
            </div>
          </div>

          {password && (
            <div className={styles.strengthIndicator}>
              <div className={`${styles.strengthBox} ${passwordStrength >= 1 ? styles.weak : ''}`}>
                弱
              </div>
              <div className={`${styles.strengthBox} ${passwordStrength >= 2 ? styles.medium : ''}`}>
                中
              </div>
              <div className={`${styles.strengthBox} ${passwordStrength >= 3 ? styles.strong : ''}`}>
                强
              </div>
            </div>
          )}

          <div className={styles.hint}>
            密码需为8-20位字母、数字和符号的组合，不含空格
          </div>

          <button
            className={styles.submitButton}
            onClick={handleStep3Submit}
          >
            完成
          </button>

          <div className={styles.backLink} onClick={handleBack}>
            &lt; 返回上一步
          </div>
        </div>
      )}

      {/* 成功提示 */}
      {showSuccessMessage && (
        <div className={styles.successModal}>
          <div className={styles.successMessage}>
            重置密码成功，请使用新密码登录
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;

