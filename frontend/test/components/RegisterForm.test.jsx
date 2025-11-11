import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '../../src/components/RegisterForm/RegisterForm';

global.fetch = vi.fn();

describe('RegisterForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders step 1 of registration form correctly', () => {
    render(<RegisterForm />);
    expect(screen.getByPlaceholderText('有效手机号')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('6位数字')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '发送验证码' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '下一步，设置密码' })).toBeInTheDocument();
  });

  test('moves to step 2 after successful step 1 submission', async () => {
    render(<RegisterForm />);
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tempToken: 'test-token' }) });

    fireEvent.change(screen.getByPlaceholderText('有效手机号'), { target: { value: '13800138000' } });
    fireEvent.change(screen.getByPlaceholderText('6位数字'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('checkbox', { name: '同意《服务协议》和《隐私政策》' }));
    fireEvent.click(screen.getByRole('button', { name: '下一步，设置密码' }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('6-20位，建议字母、数字、符号组合')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('再次输入密码')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '完成注册' })).toBeInTheDocument();
    });
  });

  test('shows password strength indicator', async () => {
    render(<RegisterForm />);
    // Navigate to step 2
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ tempToken: 'test-token' }) });
    fireEvent.change(screen.getByPlaceholderText('有效手机号'), { target: { value: '13800138000' } });
    fireEvent.change(screen.getByPlaceholderText('6位数字'), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('checkbox', { name: '同意《服务协议》和《隐私政策》' }));
    fireEvent.click(screen.getByRole('button', { name: '下一步，设置密码' }));

    // Wait for step 2 to appear and then interact with it
    const passwordInput = await screen.findByPlaceholderText('6-20位，建议字母、数字、符号组合');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Wait for the strength indicator to update
    await waitFor(() => {
      expect(screen.getByTestId('strength-medium')).toHaveAttribute('data-active', 'true');
    });
  });
});