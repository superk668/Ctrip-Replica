import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import OrderDetailPage from '../../../src/components/orders/OrderDetailPage'

global.fetch = vi.fn()

describe('OrderDetailPage', () => {
  beforeEach(() => {
    fetch.mockClear()
    localStorage.setItem('token', 'test-token')
    sessionStorage.clear()

    const originalLocation = window.location
    delete window.location
    window.location = { ...originalLocation, href: '' }
  })

  afterEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('待支付时点击“立即支付”跳转到支付页', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          orderId: 'O-1',
          orderStatus: 'pending_payment',
          orderDate: new Date().toISOString(),
          totalAmount: 100,
          productInfo: { departCity: '上海', arriveCity: '北京', number: 'MU1234' },
          travelerInfo: [{ name: '张三', idMasked: '430802**********12' }]
        })
    })

    render(
      <MemoryRouter>
        <OrderDetailPage orderId="O-1" />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('订单详情')).toBeInTheDocument()
      expect(screen.getByText(/订单号：O-1/)).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: '立即支付' }))

    expect(sessionStorage.getItem('createdOrderId')).toBe('O-1')
    expect(sessionStorage.getItem('bookingStage')).toBe('3')
    expect(window.location.href).toBe('/booking/payment')
  })

  it('起始点为SJW时应显示为石家庄', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          orderId: 'O-2',
          orderStatus: 'pending_payment',
          orderDate: new Date().toISOString(),
          totalAmount: 100,
          productInfo: { departCity: 'SJW', arriveCity: 'BJS', number: 'MU1234' },
          travelerInfo: [{ name: '张三', idMasked: '430802**********12' }]
        })
    })

    render(
      <MemoryRouter>
        <OrderDetailPage orderId="O-2" />
      </MemoryRouter>
    )

    expect(await screen.findByText('石家庄 → BJS')).toBeInTheDocument()
  })
})
