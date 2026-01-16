import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
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
})

