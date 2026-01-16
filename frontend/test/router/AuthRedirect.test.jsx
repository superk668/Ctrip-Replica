import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../../src/router';

describe('未登录访问控制', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    global.fetch = vi.fn((url) => {
      if (typeof url === 'string' && url.startsWith('/api/flights/search')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            flights: [
              {
                id: 'F1',
                carrier: '测试航司',
                flightNo: 'CZ0001',
                model: 'A320',
                from: { time: '08:00', airport: '上海', terminal: 'T2' },
                to: { time: '10:00', airport: '北京', terminal: 'T3' },
                packages: [
                  {
                    id: 'PKG1',
                    cabin: 'Y',
                    name: '经济舱标准',
                    refundable: true,
                    baggage: { carry: 7, checkin: 20 },
                    price: 999,
                  },
                ],
              },
            ],
          }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  test('未登录访问订单管理跳转登录页', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/orders'] });
    render(<RouterProvider router={router} />);
    expect(await screen.findByPlaceholderText('国内手机号/用户名/邮箱/卡号')).toBeInTheDocument();
  });

  test('未登录访问个人中心跳转登录页', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/user-center/my-info'] });
    render(<RouterProvider router={router} />);
    expect(await screen.findByPlaceholderText('国内手机号/用户名/邮箱/卡号')).toBeInTheDocument();
  });

  test('未登录可搜索机票，点击预订跳转登录页', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/flights/results?from=SHA&to=BJS&departDate=2025-11-15'],
    });
    render(<RouterProvider router={router} />);

    const choose = await screen.findByRole('button', { name: /订票/ });
    fireEvent.click(choose);

    const book = await screen.findByRole('button', { name: '预订' });
    fireEvent.click(book);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('国内手机号/用户名/邮箱/卡号')).toBeInTheDocument();
    });
  });
});

