import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CancelOrderModal from '../../../src/components/orders/CancelOrderModal';

describe('UI-CancelOrderModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  it('弹窗应包含明确的提示信息和操作按钮', () => {
    render(<CancelOrderModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    expect(screen.getByText('确认取消订单？')).toBeInTheDocument();
    expect(screen.getByText('确认')).toBeInTheDocument();
    expect(screen.getByText('关闭')).toBeInTheDocument();
  });

  it('点击确认后，应调用onConfirm并显示加载状态', () => {
    render(<CancelOrderModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByText('确认'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    // TODO: 测试加载状态的显示
    // 这个测试会因为找不到 '取消订单弹窗 (未实现)' 而失败
    expect(screen.queryByText('取消订单弹窗 (未实现)')).not.toBeInTheDocument();
  });
});