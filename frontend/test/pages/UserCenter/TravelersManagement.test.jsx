import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import TravelersManagement from '../../../src/pages/UserCenter/TravelersManagement'

// Mock fetch
global.fetch = vi.fn();

describe('常用旅客信息列表页', () => {
  beforeEach(() => {
    fetch.mockClear();
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: vi.fn(() => 'mock-token') },
      writable: true
    });
  });

  it('渲染顶部工具栏与表格列', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: { items: [] } })
    });
    render(<MemoryRouter><TravelersManagement /></MemoryRouter>)
    expect(screen.getByPlaceholderText('中文名/英文名')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '查询' })).toBeInTheDocument()
    expect(screen.getByText('姓名')).toBeInTheDocument()
  })

  it('初始为空时显示“暂无记录”占位', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: { items: [] } })
    });
    render(<MemoryRouter><TravelersManagement /></MemoryRouter>)
    await waitFor(() => {
      expect(screen.getByText('暂无记录')).toBeInTheDocument()
    });
  })

  it('搜索无结果时显示“未找到旅客”', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: { items: [] } })
    });
    
    render(<MemoryRouter><TravelersManagement /></MemoryRouter>)
    
    const input = screen.getByPlaceholderText('中文名/英文名');
    fireEvent.change(input, { target: { value: 'NonExistent' } });
    
    // Simulate search click which triggers fetch
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: { items: [] } })
    });
    
    const searchBtn = screen.getByRole('button', { name: '查询' });
    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.getByText('未找到旅客')).toBeInTheDocument()
    });
  })

  it('正确显示性别转换', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({
        success: true,
        data: {
          items: [
            { id: 1, name: 'Male User', gender: 'M' },
            { id: 2, name: 'Female User', gender: 'F' }
          ]
        }
      })
    });

    render(<MemoryRouter><TravelersManagement /></MemoryRouter>)

    await waitFor(() => {
      expect(screen.getByText('Male User')).toBeInTheDocument();
      expect(screen.getByText('男')).toBeInTheDocument();
      expect(screen.getByText('Female User')).toBeInTheDocument();
      expect(screen.getByText('女')).toBeInTheDocument();
    });
  })
})
