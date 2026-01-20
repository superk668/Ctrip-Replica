import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import FlightsResultsPage from '../../src/pages/Flights/FlightsResultsPage.jsx'

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location">{location.search}</div>
}

describe('FlightsResultsPage', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    sessionStorage.clear()
    global.fetch = vi.fn(async (url) => {
      const u = String(url)
      if (u.includes('/api/flights/search')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ flights: [] })
        }
      }
      if (u.includes('/api/airports/suggest')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ suggestions: [] })
        }
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({})
      }
    })
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('结果页顶端搜索框应与URL参数同步', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/flights/results?trip=oneway&from=CAN&to=BJS&departDate=2026-01-20']}>
          <Routes>
            <Route path="/flights/results" element={<FlightsResultsPage />} />
          </Routes>
        </MemoryRouter>
      )
    })

    expect(await screen.findByDisplayValue('广州(CAN)')).toBeTruthy()
    expect(await screen.findByDisplayValue('北京(BJS)')).toBeTruthy()
    expect(await screen.findByDisplayValue('2026-01-20')).toBeTruthy()
  })

  it('结果页输入城市名回车应匹配并更新URL参数', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/flights/results?trip=oneway&from=SHA&to=BJS&departDate=2026-01-20']}>
        <Routes>
          <Route path="/flights/results" element={<><FlightsResultsPage /><LocationDisplay /></>} />
        </Routes>
      </MemoryRouter>
    )

    const from = await screen.findByDisplayValue('上海(SHA)')
    await user.clear(from)
    await user.type(from, '广州{Enter}')

    expect(await screen.findByDisplayValue('广州(CAN)')).toBeTruthy()

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent || '').toContain('from=CAN')
    })

    expect(alertSpy).not.toHaveBeenCalled()
    alertSpy.mockRestore()
  })

  it('往返模式可切换去程/返程并在返程交换出发到达', async () => {
    const calls = []
    global.fetch = vi.fn(async (url) => {
      calls.push(String(url))
      const u = String(url)
      if (u.includes('/api/flights/search')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            flights: [
              {
                id: 'F1',
                carrier: '测试航司',
                flightNo: 'CZ0001',
                model: 'A320',
                from: { time: '08:00', airport: '广州', terminal: 'T1' },
                to: { time: '10:00', airport: '北京', terminal: 'T2' },
                packages: [
                  {
                    id: 'PKG1',
                    cabin: 'Y',
                    name: '经济舱标准',
                    refundable: true,
                    baggage: { carry: 7, checkin: 20 },
                    price: 999
                  }
                ]
              }
            ]
          })
        }
      }
      if (u.includes('/api/airports/suggest')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ suggestions: [] })
        }
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({})
      }
    })

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/flights/results?trip=round&leg=go&from=CAN&to=BJS&departDate=2026-01-20&returnDate=2026-01-22']}>
          <Routes>
            <Route path="/flights/results" element={<><FlightsResultsPage /><LocationDisplay /></>} />
          </Routes>
        </MemoryRouter>
      )
    })

    expect(await screen.findByDisplayValue('广州(CAN)')).toBeTruthy()
    expect(await screen.findByDisplayValue('北京(BJS)')).toBeTruthy()

    expect(await screen.findByRole('button', { name: /选为去程/ })).toBeTruthy()

    await waitFor(() => {
      expect(calls.some(u => u.includes('/api/flights/search?') && u.includes('trip=oneway') && u.includes('from=CAN') && u.includes('to=BJS') && u.includes('departDate=2026-01-20'))).toBe(true)
    })

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /^去程/ })
      expect(String(btn.className)).toContain('segmentBtnActive')
    })

    const getActiveClassName = () => {
      const goBtn = screen.getByRole('button', { name: /^去程/ })
      const backBtn = screen.getByRole('button', { name: /^返程/ })
      const goTokens = new Set(String(goBtn.className).split(/\s+/).filter(Boolean))
      const backTokens = new Set(String(backBtn.className).split(/\s+/).filter(Boolean))
      return Array.from(goTokens).find((t) => !backTokens.has(t)) || ''
    }

    const activeClass = getActiveClassName()
    expect(activeClass).toBeTruthy()

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^返程/ }))
    })

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent || '').toContain('leg=back')
    })

    expect(await screen.findByRole('button', { name: /选为返程/ })).toBeTruthy()

    await waitFor(() => {
      const goBtn = screen.getByRole('button', { name: /^去程/ })
      const backBtn = screen.getByRole('button', { name: /^返程/ })
      expect(String(backBtn.className).split(/\s+/)).toContain(activeClass)
      expect(String(goBtn.className).split(/\s+/)).not.toContain(activeClass)
    })

    await waitFor(() => {
      const lastSearch = calls.filter(u => u.includes('/api/flights/search?')).at(-1) || ''
      expect(lastSearch).toContain('trip=oneway')
      expect(lastSearch).toContain('from=BJS')
      expect(lastSearch).toContain('to=CAN')
      expect(lastSearch).toContain('departDate=2026-01-22')
    })
  })

  it('往返模式先选单程不跳转，双程都选后跳转订票并写入联合机票', async () => {
    const calls = []
    global.fetch = vi.fn(async (url) => {
      calls.push(String(url))
      const u = String(url)
      if (u.includes('/api/flights/search')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            flights: [
              {
                id: 'F1',
                carrier: '测试航司',
                flightNo: 'CZ0001',
                model: 'A320',
                from: { time: '08:00', airport: '广州', terminal: 'T1' },
                to: { time: '10:00', airport: '北京', terminal: 'T2' },
                packages: [
                  {
                    id: 'PKG1',
                    cabin: 'Y',
                    name: '经济舱标准',
                    refundable: true,
                    baggage: { carry: 7, checkin: 20 },
                    price: 999
                  }
                ]
              }
            ]
          })
        }
      }
      if (u.includes('/api/airports/suggest')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ suggestions: [] })
        }
      }
      return { ok: true, status: 200, json: async () => ({}) }
    })

    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/flights/results?trip=round&leg=go&from=CAN&to=BJS&departDate=2026-01-20&returnDate=2026-01-22']}>
          <Routes>
            <Route path="/flights/results" element={<><FlightsResultsPage /><LocationDisplay /></>} />
            <Route path="/booking" element={<div>booking</div>} />
          </Routes>
        </MemoryRouter>
      )
    })

    await waitFor(() => {
      expect(calls.some(u => u.includes('/api/flights/search?') && u.includes('from=CAN') && u.includes('to=BJS'))).toBe(true)
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /选为去程/ }))
    })

    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: '预订' }))
    })

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent || '').toContain('trip=round')
      expect(screen.getByRole('button', { name: /已设置为去程/ })).toBeTruthy()
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /^返程/ }))
    })

    await waitFor(() => {
      expect(screen.getByTestId('location').textContent || '').toContain('leg=back')
    })

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /选为返程/ }))
    })

    await act(async () => {
      fireEvent.click(await screen.findByRole('button', { name: '预订' }))
    })

    await waitFor(() => {
      expect(screen.queryByTestId('location')).toBeNull()
      expect(screen.getByText('booking')).toBeTruthy()
    })

    const stored = JSON.parse(sessionStorage.getItem('bookingSelection'))
    expect(stored.joint).toBe(true)
    expect(stored.legs && stored.legs.go && stored.legs.back).toBeTruthy()
    expect(stored.legs.go.flight.id).toBe('F1')
    expect(stored.legs.back.flight.id).toBe('F1')
  })
})
