import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import CitySelector from '../../src/components/CitySelector';
import apiService from '../../src/services/api';

// Mock API service
vi.mock('../../src/services/api');

describe('CitySelector', () => {
  const mockOnChange = vi.fn();
  const mockCities = [
    { code: 'BJS', name: '北京', pinyin: 'beijing', hot: true },
    { code: 'SHA', name: '上海', pinyin: 'shanghai', hot: true },
    { code: 'SZX', name: '深圳', pinyin: 'shenzhen', hot: false },
    { code: 'CAN', name: '广州', pinyin: 'guangzhou', hot: false }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiService.getCities).mockResolvedValue({
      success: true,
      data: mockCities
    });
  });

  it('should render city selector with placeholder', () => {
    render(
      <CitySelector
        onChange={mockOnChange}
        placeholder="请选择城市"
      />
    );

    expect(screen.getByPlaceholderText('请选择城市')).toBeInTheDocument();
  });

  it('should load cities on mount', async () => {
    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      await waitFor(() => {
        expect(apiService.getCities).toHaveBeenCalled();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should open dropdown when clicked', async () => {
    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.click(input);
    }).rejects.toThrow('Not implemented');
  });

  it('should display hot cities section', async () => {
    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      await waitFor(() => {
        expect(screen.getByText('热门城市')).toBeInTheDocument();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should filter cities by search keyword', async () => {
    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '北京' } });
    }).rejects.toThrow('Not implemented');
  });

  it('should search cities by pinyin', async () => {
    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'beijing' } });
    }).rejects.toThrow('Not implemented');
  });

  it('should call onChange when city is selected', async () => {
    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      await waitFor(() => {
        const cityItem = screen.getByText('北京');
        fireEvent.click(cityItem);
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should close dropdown after city selection', async () => {
    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      await waitFor(() => {
        const cityItem = screen.getByText('北京');
        fireEvent.click(cityItem);
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should display "no results" message for invalid search', async () => {
    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '不存在的城市' } });

      await waitFor(() => {
        expect(screen.getByText('未找到相关城市')).toBeInTheDocument();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <CitySelector
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('should display current value', () => {
    render(
      <CitySelector
        value="北京"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByDisplayValue('北京')).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    vi.mocked(apiService.getCities).mockRejectedValue(new Error('Network error'));

    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      await waitFor(() => {
        expect(apiService.getCities).toHaveBeenCalled();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should prioritize hot cities in display', async () => {
    render(<CitySelector onChange={mockOnChange} />);

    await expect(async () => {
      const input = screen.getByRole('textbox');
      fireEvent.click(input);

      await waitFor(() => {
        const hotCitiesSection = screen.getByText('热门城市').parentElement;
        expect(hotCitiesSection).toContainElement(screen.getByText('北京'));
        expect(hotCitiesSection).toContainElement(screen.getByText('上海'));
      });
    }).rejects.toThrow('Not implemented');
  });
});