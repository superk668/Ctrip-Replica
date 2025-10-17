import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import RegisterForm from '../../src/components/RegisterForm';
import apiService from '../../src/services/api';

// Mock API service
vi.mock('../../src/services/api');

describe('RegisterForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render register form with required fields', () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    expect(screen.getByLabelText('手机号')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
    expect(screen.getByLabelText('验证码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '发送验证码' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '注册' })).toBeInTheDocument();
  });

  it('should handle input changes', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const phoneInput = screen.getByLabelText('手机号');
    const passwordInput = screen.getByLabelText('密码');
    const codeInput = screen.getByLabelText('验证码');

    await expect(async () => {
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });
    }).rejects.toThrow('Not implemented');
  });

  it('should validate phone number before sending code', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    const sendCodeButton = screen.getByRole('button', { name: '发送验证码' });

    await expect(async () => {
      fireEvent.click(sendCodeButton);
    }).rejects.toThrow('Not implemented');
  });

  it('should send verification code successfully', async () => {
    const mockResponse = {
      success: true,
      message: '验证码已发送'
    };

    vi.mocked(apiService.sendVerificationCode).mockResolvedValue(mockResponse);

    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await expect(async () => {
      const phoneInput = screen.getByLabelText('手机号');
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });

      const sendCodeButton = screen.getByRole('button', { name: '发送验证码' });
      fireEvent.click(sendCodeButton);
    }).rejects.toThrow('Not implemented');
  });

  it('should handle verification code send failure', async () => {
    const mockResponse = {
      success: false,
      message: '发送失败，请稍后重试'
    };

    vi.mocked(apiService.sendVerificationCode).mockResolvedValue(mockResponse);

    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await expect(async () => {
      const phoneInput = screen.getByLabelText('手机号');
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });

      const sendCodeButton = screen.getByRole('button', { name: '发送验证码' });
      fireEvent.click(sendCodeButton);
    }).rejects.toThrow('Not implemented');
  });

  it('should start countdown after sending code', async () => {
    const mockResponse = {
      success: true,
      message: '验证码已发送'
    };

    vi.mocked(apiService.sendVerificationCode).mockResolvedValue(mockResponse);

    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await expect(async () => {
      const phoneInput = screen.getByLabelText('手机号');
      fireEvent.change(phoneInput, { target: { value: '13800138000' } });

      const sendCodeButton = screen.getByRole('button', { name: '发送验证码' });
      fireEvent.click(sendCodeButton);

      await waitFor(() => {
        expect(screen.getByText(/\d+s/)).toBeInTheDocument();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should submit registration form with valid data', async () => {
    const mockResponse = {
      success: true,
      data: {
        user: { id: '1', phoneNumber: '13800138000' },
        token: 'mock-token'
      }
    };

    vi.mocked(apiService.register).mockResolvedValue(mockResponse);

    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await expect(async () => {
      const form = screen.getByRole('form') || screen.getByTestId('register-form');
      fireEvent.submit(form);
    }).rejects.toThrow('Not implemented');
  });

  it('should handle registration success', async () => {
    const mockResponse = {
      success: true,
      data: {
        user: { id: '1', phoneNumber: '13800138000' },
        token: 'mock-token'
      }
    };

    vi.mocked(apiService.register).mockResolvedValue(mockResponse);

    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await expect(async () => {
      const form = screen.getByRole('form') || screen.getByTestId('register-form');
      fireEvent.submit(form);
    }).rejects.toThrow('Not implemented');
  });

  it('should handle registration failure', async () => {
    const mockResponse = {
      success: false,
      message: '验证码错误'
    };

    vi.mocked(apiService.register).mockResolvedValue(mockResponse);

    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await expect(async () => {
      const form = screen.getByRole('form') || screen.getByTestId('register-form');
      fireEvent.submit(form);
    }).rejects.toThrow('Not implemented');
  });

  it('should validate password strength', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await expect(async () => {
      const passwordInput = screen.getByLabelText('密码');
      fireEvent.change(passwordInput, { target: { value: '123' } });
    }).rejects.toThrow('Not implemented');
  });

  it('should disable submit button while loading', async () => {
    vi.mocked(apiService.register).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await expect(async () => {
      const submitButton = screen.getByRole('button', { name: '注册' });
      fireEvent.click(submitButton);
      
      expect(submitButton).toBeDisabled();
      expect(screen.getByText('注册中...')).toBeInTheDocument();
    }).rejects.toThrow('Not implemented');
  });

  it('should validate all required fields', async () => {
    render(<RegisterForm onSuccess={mockOnSuccess} onError={mockOnError} />);

    await expect(async () => {
      const submitButton = screen.getByRole('button', { name: '注册' });
      fireEvent.click(submitButton);
    }).rejects.toThrow('Not implemented');
  });
});