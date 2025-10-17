import React, { useState, useEffect } from 'react';
import { Destination, PromotionalFlight, FlightSearchRequest } from '../types';
import FlightSearchForm from '../components/FlightSearchForm';
import DestinationCard from '../components/DestinationCard';
import FlightCard from '../components/FlightCard';
import apiService from '../services/api';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const [hotDestinations, setHotDestinations] = useState<Destination[]>([]);
  const [promotionalFlights, setPromotionalFlights] = useState<PromotionalFlight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPageData();
  }, []);

  const loadPageData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        loadHotDestinations(),
        loadPromotionalFlights()
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载数据失败';
      setError(errorMessage);
      console.error('Failed to load page data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadHotDestinations = async () => {
    try {
      const response = await apiService.getHotDestinations(6);
      if (response.success && response.data) {
        setHotDestinations(response.data);
      }
    } catch (err) {
      console.error('Failed to load hot destinations:', err);
      // 使用模拟数据作为后备
      setHotDestinations([]);
    }
  };

  const loadPromotionalFlights = async () => {
    try {
      const response = await apiService.getPromotionalFlights(8);
      if (response.success && response.data) {
        setPromotionalFlights(response.data);
      }
    } catch (err) {
      console.error('Failed to load promotional flights:', err);
      // 使用模拟数据作为后备
      setPromotionalFlights([]);
    }
  };

  const handleFlightSearch = async (searchData: FlightSearchRequest) => {
    console.log('Searching flights with data:', searchData);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.searchFlights(searchData);
      if (response.success && response.data) {
        // 这里可以导航到搜索结果页面或更新当前页面显示
        console.log('Search results:', response.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '搜索失败';
      setError(errorMessage);
      console.error('Flight search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestinationClick = (destination: Destination) => {
    console.log('Destination clicked:', destination);
    // 这里可以导航到目的地详情页面
    // navigate(`/destination/${destination.id}`);
  };

  const handleFlightClick = (flight: PromotionalFlight) => {
    console.log('Flight clicked:', flight);
    // 这里可以导航到航班详情页面或预订页面
    // navigate(`/flight/${flight.id}`);
  };

  if (error) {
    return (
      <div className="home-page error-state">
        <div className="error-message">
          <h2>加载失败</h2>
          <p>{error}</p>
          <button onClick={loadPageData} className="retry-button">
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* 顶部导航栏 */}
      <header className="homepage-header">
        <div className="header-content">
          <a href="/" className="logo">携程旅行</a>
          <nav className="main-nav">
            <a href="/flights" className="nav-link">机票</a>
            <a href="/login" className="nav-link">登录</a>
            <a href="/register" className="nav-link">注册</a>
            <a href="/orders" className="nav-link">我的订单</a>
          </nav>
        </div>
      </header>

      <main className="homepage-main">
        {/* 机票搜索表单区域 */}
        <section className="search-section">
          <div className="search-container">
            <h1 className="search-title">发现世界，从这里开始</h1>
            <div className="search-form-wrapper">
              <FlightSearchForm 
                onSearch={handleFlightSearch}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>

        {/* 热门目的地推荐区域 */}
        <section className="destinations-section">
          <div className="container">
            <h2 className="section-title">热门目的地</h2>
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>加载中...</span>
              </div>
            ) : (
              <div className="destinations-grid">
                {hotDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onClick={() => handleDestinationClick(destination)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 特价机票展示区域 */}
        <section className="flights-section">
          <div className="container">
            <h2 className="section-title">特价机票</h2>
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <span>加载中...</span>
              </div>
            ) : (
              <div className="flights-grid">
                {promotionalFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onClick={() => handleFlightClick(flight)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 页脚信息区域 */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>关于携程</h3>
            <ul>
              <li><a href="/about">公司介绍</a></li>
              <li><a href="/careers">加入我们</a></li>
              <li><a href="/contact">联系我们</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>服务支持</h3>
            <ul>
              <li><a href="/help">帮助中心</a></li>
              <li><a href="/privacy">隐私政策</a></li>
              <li><a href="/terms">服务条款</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>联系方式</h3>
            <ul>
              <li>客服热线：400-123-4567</li>
              <li>邮箱：service@ctrip.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 携程旅行. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;