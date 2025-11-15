import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReorderButton from '../../../src/components/orders/ReorderButton';

describe('UI-ReorderButton', () => {
  it('点击后，应能携带旧订单信息跳转到搜索或预订页面', () => {
    const orderInfo = { productId: 'prod-123' };
    // TODO: 模拟跳转逻辑并验证
    const consoleSpy = jest.spyOn(console, 'log');
    render(<ReorderButton orderInfo={orderInfo} />);
    fireEvent.click(screen.getByText('重新下单'));
    expect(consoleSpy).toHaveBeenCalledWith('重新下单', orderInfo);
  });
});