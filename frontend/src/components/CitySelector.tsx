import React, { useState, useEffect } from 'react';
import { City } from '../types';
import apiService from '../services/api';

interface CitySelectorProps {
  value?: string;
  onChange: (city: City) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChange,
  placeholder = '请选择城市',
  disabled = false
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getCities();
      if (response.success && response.data) {
        setCities(response.data);
        setFilteredCities(response.data);
      }
    } catch (err) {
      console.error('Failed to load cities:', err);
      // 使用模拟数据作为后备
      setCities([]);
      setFilteredCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    filterCities(keyword);
  };

  const handleCitySelect = (city: City) => {
    onChange(city);
    setIsOpen(false);
    setSearchKeyword('');
  };

  const filterCities = (keyword: string) => {
    if (!keyword.trim()) {
      setFilteredCities(cities);
      return;
    }
    
    const filtered = cities.filter(city => 
      city.name.toLowerCase().includes(keyword.toLowerCase()) ||
      city.code.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const getHotCities = (): City[] => {
    // 返回前8个城市作为热门城市
    return cities.slice(0, 8);
  };

  const selectedCity = cities.find(city => city.code === value);

  return (
    <div className={`city-selector ${disabled ? 'disabled' : ''}`}>
      <div 
        className={`selector-input ${isOpen ? 'open' : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="selected-value">
          {selectedCity ? selectedCity.name : placeholder}
        </span>
        <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="dropdown-panel">
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索城市"
              value={searchKeyword}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
          </div>

          {isLoading ? (
            <div className="loading-state">加载中...</div>
          ) : (
            <div className="cities-list">
              {!searchKeyword && (
                <div className="hot-cities-section">
                  <div className="section-title">热门城市</div>
                  <div className="hot-cities-grid">
                    {getHotCities().map((city) => (
                      <div
                        key={city.code}
                        className="hot-city-item"
                        onClick={() => handleCitySelect(city)}
                      >
                        {city.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="all-cities-section">
                {searchKeyword && (
                  <div className="section-title">搜索结果</div>
                )}
                <div className="cities-grid">
                  {filteredCities.map((city) => (
                    <div
                      key={city.code}
                      className={`city-item ${city.code === value ? 'selected' : ''}`}
                      onClick={() => handleCitySelect(city)}
                    >
                      <span className="city-name">{city.name}</span>
                      <span className="city-code">{city.code}</span>
                    </div>
                  ))}
                </div>

                {filteredCities.length === 0 && searchKeyword && (
                  <div className="no-results">
                    未找到匹配的城市
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CitySelector;