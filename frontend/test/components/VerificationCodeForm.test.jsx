import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import VerificationCodeForm from '../../src/components/VerificationCodeForm/VerificationCodeForm';

global.fetch = vi.fn();

describe('VerificationCodeForm', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders verification code form correctly', () => {
    render(<MemoryRouter><VerificationCodeForm /></MemoryRouter>);
    expect(screen.getByPlaceholderText('请输入手机号')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('短信验证码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '发送验证码' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  test('shows error for invalid phone number', async () => {
    render(<MemoryRouter><VerificationCodeForm /></MemoryRouter>);
    fetch.mockResolvedValueOnce({ ok: false, json: () => Promise.resolve({ error: '手机号格式不正确，请重新输入' }) });

    fireEvent.change(screen.getByPlaceholderText('请输入手机号'), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: '发送验证码' }));

    expect(await screen.findByText('手机号格式不正确，请重新输入')).toBeInTheDocument();
  });

  test('starts countdown after sending code', async () => {
    render(<MemoryRouter><VerificationCodeForm /></MemoryRouter>);
    fetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    fireEvent.change(screen.getByPlaceholderText('请输入手机号'), { target: { value: '13800138000' } });
    fireEvent.click(screen.getByRole('button', { name: '发送验证码' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /重新发送/ })).toBeDisabled();
    });
  });
});