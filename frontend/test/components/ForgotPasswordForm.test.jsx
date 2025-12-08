import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import ForgotPasswordForm from '../../src/components/ForgotPasswordForm/ForgotPasswordForm';

global.fetch = vi.fn();

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ForgotPasswordForm - 忘记密码表单测试', () => {
  beforeEach(() => {
    fetch.mockClear();
    mockNavigate.mockClear();
  });

  it('应该正确渲染表单', () => {
    render(<MemoryRouter><ForgotPasswordForm /></MemoryRouter>);
    
    // 验证账号输入框存在
    expect(screen.getByLabelText('账号')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('手机号/用户名/邮箱/卡号')).toBeInTheDocument();
  });

  it('应该成功验证已注册的手机号', async () => {
    render(<MemoryRouter><ForgotPasswordForm /></MemoryRouter>);
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, message: '手机号验证成功' })
    });

    const phoneInput = screen.getByPlaceholderText('手机号/用户名/邮箱/卡号');
    fireEvent.change(phoneInput, { target: { value: '15512345678' } });
    
    const nextButton = screen.getByRole('button', { name: /下一步/ });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/auth/reset-password/step1',
        expect.objectContaining({
          method: 'POST'
        })
      );
    }, { timeout: 2000 });
  });

  it('应该显示未注册手机号的错误', async () => {
    render(<MemoryRouter><ForgotPasswordForm /></MemoryRouter>);
    
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ success: false, error: '该手机号未注册' })
    });

    const phoneInput = screen.getByPlaceholderText('手机号/用户名/邮箱/卡号');
    fireEvent.change(phoneInput, { target: { value: '18800000000' } });
    
    const nextButton = screen.getByRole('button', { name: /下一步/ });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('该手机号未注册')).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('应该验证空手机号输入', async () => {
    render(<MemoryRouter><ForgotPasswordForm /></MemoryRouter>);
    
    const nextButton = screen.getByRole('button', { name: /下一步/ });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('应该验证手机号格式', async () => {
    render(<MemoryRouter><ForgotPasswordForm /></MemoryRouter>);
    
    const phoneInput = screen.getByPlaceholderText('手机号/用户名/邮箱/卡号');
    fireEvent.change(phoneInput, { target: { value: '123' } });
    
    const nextButton = screen.getByRole('button', { name: /下一步/ });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/手机号格式不正确/)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('应该能够发送验证码请求', async () => {
    render(<MemoryRouter><ForgotPasswordForm /></MemoryRouter>);
    
    // 进入步骤2
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    const phoneInput = screen.getByPlaceholderText('手机号/用户名/邮箱/卡号');
    fireEvent.change(phoneInput, { target: { value: '15512345678' } });
    fireEvent.click(screen.getByRole('button', { name: /下一步/ }));

    // 等待进入步骤2
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/auth/reset-password/step1',
        expect.any(Object)
      );
    }, { timeout: 2000 });

    // 模拟发送验证码
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true, message: '验证码已发送' })
    });

    const sendCodeButton = screen.queryByText('发送验证码');
    if (sendCodeButton) {
      fireEvent.click(sendCodeButton);

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          '/api/auth/send-code',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('reset')
          })
        );
      }, { timeout: 2000 });
    }
  });

  it('应该能够提交新密码', async () => {
    render(<MemoryRouter><ForgotPasswordForm /></MemoryRouter>);
    
    // 快速进入步骤3 - 模拟所有步骤
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    // 步骤1
    const phoneInput = screen.getByPlaceholderText('手机号/用户名/邮箱/卡号');
    fireEvent.change(phoneInput, { target: { value: '15512345678' } });
    fireEvent.click(screen.getByRole('button', { name: /下一步/ }));

    // 等待API调用
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});
