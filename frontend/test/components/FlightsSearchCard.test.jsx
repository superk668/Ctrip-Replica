import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FlightsSearchCard from '../../src/pages/Home/LocalComponents/FlightsSearchCard.jsx'

describe('FlightsSearchCard', () => {
  it('渲染单程/往返/多程切换与出发/目的地与日期', () => {
    render(<FlightsSearchCard />)
    expect(screen.getByText('单程')).toBeTruthy()
    expect(screen.getByText('往返')).toBeTruthy()
    expect(screen.getByText(/出发地/)).toBeTruthy()
    expect(screen.getByText(/目的地/)).toBeTruthy()
    expect(screen.getByText(/出发日期/)).toBeTruthy()
  })

  it('点击搜索应调用onSearch并携带输入条件', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<FlightsSearchCard onSearch={onSearch} />)
    const btn = screen.getByRole('button', { name: '搜索' })
    await user.click(btn)
    expect(onSearch).toHaveBeenCalled()
    const args = onSearch.mock.calls[0][0]
    expect(args).toHaveProperty('tripType')
    expect(args).toHaveProperty('fromCity')
    expect(args).toHaveProperty('toCity')
    expect(args).toHaveProperty('departDate')
  })

  
})