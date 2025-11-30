import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import TravelerEdit from '../../../src/pages/UserCenter/TravelerEdit';

// Mock fetch
global.fetch = vi.fn();

describe('TravelerEdit', () => {
  beforeEach(() => {
    fetch.mockClear();
    // Mock successful fetch response
    fetch.mockResolvedValue({
      json: () => Promise.resolve({
        success: true,
        data: {
          traveler: {
            id: 1,
            cnName: '张三',
            isSelf: false,
            document: { type: '身份证', no: '123456', validTill: '2030-01-01' }
          }
        }
      })
    });
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => 'mock-token'),
      },
      writable: true
    });
    // Mock window.location.search
    // Note: window.location is read-only in some envs, but jsdom allows some modification or we can mock URLSearchParams
    // But since component uses window.location.search directly, we need to mock it.
    // In vitest/jsdom, we can often set it.
    const originalLocation = window.location;
    delete window.location;
    window.location = { ...originalLocation, search: '?id=1', href: '' };
  });

  it('renders without crashing and fetches data', async () => {
    render(
      <MemoryRouter>
        <TravelerEdit />
      </MemoryRouter>
    );

    expect(screen.getByText('编辑常用旅客信息')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    
    // Check if data is populated (inputs have values)
    await waitFor(() => {
      expect(screen.getByDisplayValue('张三')).toBeInTheDocument();
    });
  });
});
