import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DownloadButton from '../../../src/components/orders/DownloadButton';

describe('UI-DownloadButton', () => {
  it('点击后，应调用API-GET-OrderAsPdf并触发浏览器下载', () => {
    const orderId = 'test-order-123';
    // TODO: 模拟API调用和下载逻辑
    const consoleSpy = jest.spyOn(console, 'log');
    render(<DownloadButton orderId={orderId} />);
    fireEvent.click(screen.getByText('下载订单'));
    expect(consoleSpy).toHaveBeenCalledWith('下载订单', orderId);
  });
});