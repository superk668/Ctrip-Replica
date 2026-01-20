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

  it('输入城市名搜索应自动匹配并携带城市代码', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<FlightsSearchCard onSearch={onSearch} />)

    const inputs = screen.getAllByRole('textbox')
    const from = inputs[0]
    const to = inputs[1]
    await user.clear(from)
    await user.type(from, '上海')
    await user.clear(to)
    await user.type(to, '北京')

    await user.click(screen.getByRole('button', { name: '搜索' }))

    expect(onSearch).toHaveBeenCalledTimes(1)
    const payload = onSearch.mock.calls[0][0]
    expect(payload.from.cityCode || payload.from.airportCode).toBe('SHA')
    expect(payload.to.cityCode || payload.to.airportCode).toBe('BJS')
  })

  it('输入无匹配项应提示并阻止搜索', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

    render(<FlightsSearchCard onSearch={onSearch} />)

    const inputs = screen.getAllByRole('textbox')
    const from = inputs[0]
    await user.clear(from)
    await user.type(from, '不存在城市')

    await user.click(screen.getByRole('button', { name: '搜索' }))

    expect(onSearch).not.toHaveBeenCalled()
    expect(alertSpy).toHaveBeenCalledWith('未找到匹配项')
    alertSpy.mockRestore()
  })

  
})
