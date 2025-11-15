import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from '../../src/components/LoginForm/LoginForm';

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ token: 'fake_token' }),
  })
);

// Mock alert
global.alert = vi.fn();

describe('LoginForm', () => {
  beforeEach(() => {
    fetch.mockClear();
    alert.mockClear();
  });

  test('renders login form correctly', () => {
    render(<MemoryRouter><LoginForm /></MemoryRouter>);
    
    expect(screen.getByPlaceholderText('国内手机号/用户名/邮箱/卡号')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('登录密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  test('allows user to enter username and password', () => {
    render(<MemoryRouter><LoginForm /></MemoryRouter>);
    
    const usernameInput = screen.getByPlaceholderText('国内手机号/用户名/邮箱/卡号');
    const passwordInput = screen.getByPlaceholderText('登录密码');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  test('shows error message on failed login', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: '无效的账号或密码' }),
      })
    );

    render(<MemoryRouter><LoginForm /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('国内手机号/用户名/邮箱/卡号'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('登录密码'), { target: { value: 'wrongpassword' } });
    // 同意协议
    fireEvent.click(screen.getByRole('checkbox', { name: /阅读并同意携程的/i }));
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(screen.getByText('无效的账号或密码')).toBeInTheDocument();
    });
  });

  test('calls api and stores token on successful login', async () => {
    render(<MemoryRouter><LoginForm /></MemoryRouter>);

    fireEvent.change(screen.getByPlaceholderText('国内手机号/用户名/邮箱/卡号'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText('登录密码'), { target: { value: 'password123' } });
    // 同意协议
    fireEvent.click(screen.getByRole('checkbox', { name: /阅读并同意携程的/i }));
    fireEvent.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'testuser', password: 'password123', agreeToTerms: true }),
      });
      expect(localStorage.getItem('token')).toBe('fake_token');
    });
  });
});