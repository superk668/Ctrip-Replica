import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import FlightsResultsPage from '../../src/pages/Flights/FlightsResultsPage.jsx'

describe('FlightsResultsPage', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
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
    render(
      <MemoryRouter initialEntries={['/flights/results?trip=oneway&from=CAN&to=BJS&departDate=2026-01-20']}>
        <Routes>
          <Route path="/flights/results" element={<FlightsResultsPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByDisplayValue('广州(CAN)')).toBeTruthy()
    expect(await screen.findByDisplayValue('北京(BJS)')).toBeTruthy()
    expect(await screen.findByDisplayValue('2026-01-20')).toBeTruthy()
  })

  it('往返模式可切换去程/返程并在返程交换出发到达', async () => {
    const user = userEvent.setup()
    const calls = []
    global.fetch = vi.fn(async (url) => {
      calls.push(String(url))
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

    render(
      <MemoryRouter initialEntries={['/flights/results?trip=round&leg=go&from=CAN&to=BJS&departDate=2026-01-20&returnDate=2026-01-22']}>
        <Routes>
          <Route path="/flights/results" element={<FlightsResultsPage />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByDisplayValue('广州(CAN)')).toBeTruthy()
    expect(await screen.findByDisplayValue('北京(BJS)')).toBeTruthy()

    await waitFor(() => {
      expect(calls.some(u => u.includes('/api/flights/search?') && u.includes('trip=oneway') && u.includes('from=CAN') && u.includes('to=BJS') && u.includes('departDate=2026-01-20'))).toBe(true)
    })

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /去程/ })
      expect(String(btn.className)).toContain('segmentBtnActive')
    })

    await user.click(screen.getByRole('button', { name: /返程/ }))

    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /返程/ })
      expect(String(btn.className)).toContain('segmentBtnActive')
    })

    await waitFor(() => {
      const lastSearch = calls.filter(u => u.includes('/api/flights/search?')).at(-1) || ''
      expect(lastSearch).toContain('trip=oneway')
      expect(lastSearch).toContain('from=BJS')
      expect(lastSearch).toContain('to=CAN')
      expect(lastSearch).toContain('departDate=2026-01-22')
    })
  })
})
