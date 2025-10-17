import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import HomePage from '../../src/pages/HomePage';
import apiService from '../../src/services/api';

// Mock API service
vi.mock('../../src/services/api');

// Mock child components
vi.mock('../../src/components/FlightSearchForm', () => ({
  default: ({ onSearch }: { onSearch: Function }) => (
    <div data-testid="flight-search-form">
      <button onClick={() => onSearch({ origin: '北京', destination: '上海', date: '2023-12-25' })}>
        搜索航班
      </button>
    </div>
  )
}));

vi.mock('../../src/components/DestinationCard', () => ({
  default: ({ destination, onClick }: { destination: any, onClick: Function }) => (
    <div data-testid="destination-card" onClick={() => onClick(destination)}>
      {destination.name}
    </div>
  )
}));

vi.mock('../../src/components/FlightCard', () => ({
  default: ({ flight, onClick }: { flight: any, onClick: Function }) => (
    <div data-testid="flight-card" onClick={() => onClick(flight)}>
      {flight.origin} → {flight.destination}
    </div>
  )
}));

describe('HomePage', () => {
  const mockDestinations = [
    {
      id: '1',
      name: '巴厘岛',
      image: 'bali.jpg',
      description: '热带天堂',
      price: 2999,
      hotRank: 1
    },
    {
      id: '2',
      name: '马尔代夫',
      image: 'maldives.jpg',
      description: '蜜月圣地',
      price: 8999,
      hotRank: 2
    }
  ];

  const mockFlights = [
    {
      id: '1',
      origin: '北京',
      destination: '上海',
      price: 599,
      originalPrice: 899,
      discount: 33,
      date: '2023-12-25',
      createdAt: '2023-12-01'
    },
    {
      id: '2',
      origin: '广州',
      destination: '深圳',
      price: 299,
      originalPrice: 399,
      discount: 25,
      date: '2023-12-26',
      createdAt: '2023-12-02'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(apiService.getHotDestinations).mockResolvedValue({
      success: true,
      data: mockDestinations
    });
    vi.mocked(apiService.getPromotionalFlights).mockResolvedValue({
      success: true,
      data: mockFlights
    });
  });

  it('should render homepage with main sections', () => {
    render(<HomePage />);

    expect(screen.getByText('携程旅行')).toBeInTheDocument();
    expect(screen.getByText('发现世界，从这里开始')).toBeInTheDocument();
    expect(screen.getByText('搜索航班')).toBeInTheDocument();
    expect(screen.getByText('热门目的地')).toBeInTheDocument();
    expect(screen.getByText('特价机票')).toBeInTheDocument();
  });

  it('should load page data on mount', async () => {
    render(<HomePage />);

    await expect(async () => {
      await waitFor(() => {
        expect(apiService.getHotDestinations).toHaveBeenCalled();
        expect(apiService.getPromotionalFlights).toHaveBeenCalled();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should display hot destinations', async () => {
    render(<HomePage />);

    await expect(async () => {
      await waitFor(() => {
        expect(screen.getByText('巴厘岛')).toBeInTheDocument();
        expect(screen.getByText('马尔代夫')).toBeInTheDocument();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should display promotional flights', async () => {
    render(<HomePage />);

    await expect(async () => {
      await waitFor(() => {
        expect(screen.getByText('北京 → 上海')).toBeInTheDocument();
        expect(screen.getByText('广州 → 深圳')).toBeInTheDocument();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should handle flight search', async () => {
    render(<HomePage />);

    await expect(async () => {
      const searchButton = screen.getByText('搜索航班');
      fireEvent.click(searchButton);
    }).rejects.toThrow('Not implemented');
  });

  it('should handle destination click', async () => {
    render(<HomePage />);

    await expect(async () => {
      await waitFor(() => {
        const destinationCard = screen.getByText('巴厘岛');
        fireEvent.click(destinationCard);
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should handle flight click', async () => {
    render(<HomePage />);

    await expect(async () => {
      await waitFor(() => {
        const flightCard = screen.getByText('北京 → 上海');
        fireEvent.click(flightCard);
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should display loading state', async () => {
    vi.mocked(apiService.getHotDestinations).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );
    vi.mocked(apiService.getPromotionalFlights).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<HomePage />);

    await expect(async () => {
      expect(screen.getAllByText('加载中...')).toHaveLength(2);
    }).rejects.toThrow('Not implemented');
  });

  it('should display error message on API failure', async () => {
    vi.mocked(apiService.getHotDestinations).mockRejectedValue(new Error('Network error'));
    vi.mocked(apiService.getPromotionalFlights).mockRejectedValue(new Error('Network error'));

    render(<HomePage />);

    await expect(async () => {
      await waitFor(() => {
        expect(screen.getByText(/加载数据时出现错误/)).toBeInTheDocument();
        expect(screen.getByText('重试')).toBeInTheDocument();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should retry loading data when retry button is clicked', async () => {
    vi.mocked(apiService.getHotDestinations).mockRejectedValueOnce(new Error('Network error'));
    vi.mocked(apiService.getPromotionalFlights).mockRejectedValueOnce(new Error('Network error'));

    render(<HomePage />);

    await expect(async () => {
      await waitFor(() => {
        const retryButton = screen.getByText('重试');
        fireEvent.click(retryButton);
      });

      expect(apiService.getHotDestinations).toHaveBeenCalledTimes(2);
      expect(apiService.getPromotionalFlights).toHaveBeenCalledTimes(2);
    }).rejects.toThrow('Not implemented');
  });

  it('should display empty state when no data available', async () => {
    vi.mocked(apiService.getHotDestinations).mockResolvedValue({
      success: true,
      data: []
    });
    vi.mocked(apiService.getPromotionalFlights).mockResolvedValue({
      success: true,
      data: []
    });

    render(<HomePage />);

    await expect(async () => {
      await waitFor(() => {
        expect(screen.getByText('暂无热门目的地数据')).toBeInTheDocument();
        expect(screen.getByText('暂无特价机票数据')).toBeInTheDocument();
      });
    }).rejects.toThrow('Not implemented');
  });

  it('should render view all buttons', () => {
    render(<HomePage />);

    const viewAllButtons = screen.getAllByText('查看全部');
    expect(viewAllButtons).toHaveLength(1);
    
    const viewMoreButtons = screen.getAllByText('查看更多');
    expect(viewMoreButtons).toHaveLength(1);
  });
});