import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import TravelerView from '../../../src/pages/UserCenter/TravelerView'

global.fetch = vi.fn();

describe('常用旅客信息查看页（只读）', () => {
  beforeEach(() => {
    fetch.mockClear();
    fetch.mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: {
          traveler: {
            id: 1,
            cnName: '李四',
            enLast: 'Li',
            enFirst: 'Si',
            isSelf: false,
            document: { type: '护照', no: 'G12345678', validTill: '2030-01-01' }
          }
        }
      })
    });
    Object.defineProperty(window, 'localStorage', {
      value: { getItem: vi.fn(() => 'mock-token') },
      writable: true
    });
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, search: '?id=1', href: '' };
  });

  it('展示分段标题与只读字段并加载数据', async () => {
    render(<MemoryRouter><TravelerView /></MemoryRouter>)
    
    expect(screen.getByText('查看常用旅客信息')).toBeInTheDocument()
    expect(screen.getByText('旅客信息')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('李四')).toBeInTheDocument();
      expect(screen.getByText('Li Si')).toBeInTheDocument();
      expect(screen.getByText('G12345678')).toBeInTheDocument();
    });
  })
})
