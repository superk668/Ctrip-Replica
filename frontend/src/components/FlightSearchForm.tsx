import React, { useState } from 'react';
import { FlightSearchRequest, City } from '../types';
import CitySelector from './CitySelector';

interface FlightSearchFormProps {
  onSearch: (searchData: FlightSearchRequest) => void;
  isLoading?: boolean;
}

const getTomorrowDate = (): string => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  onSearch,
  isLoading = false
}) => {
  const [searchData, setSearchData] = useState<FlightSearchRequest>({
    origin: '',
    destination: '',
    date: getTomorrowDate()
  });
  const [tripType, setTripType] = useState<'oneWay' | 'roundTrip'>('oneWay');
  const [returnDate, setReturnDate] = useState<string>('');
  const [passengers, setPassengers] = useState<number>(1);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOriginChange = (city: City) => {
    setSearchData(prev => ({ ...prev, origin: city.code }));
    if (errors.origin) {
      setErrors(prev => ({ ...prev, origin: '' }));
    }
  };

  const handleDestinationChange = (city: City) => {
    setSearchData(prev => ({ ...prev, destination: city.code }));
    if (errors.destination) {
      setErrors(prev => ({ ...prev, destination: '' }));
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePassengersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPassengers(parseInt(e.target.value));
  };

  const handleTripTypeChange = (newTripType: 'oneWay' | 'roundTrip') => {
    setTripType(newTripType);
    if (newTripType === 'oneWay') {
      setReturnDate('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSearch(searchData);
  };

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!searchData.origin) {
      errors.origin = '请选择出发城市';
    }

    if (!searchData.destination) {
      errors.destination = '请选择到达城市';
    }

    if (searchData.origin === searchData.destination) {
      errors.destination = '出发城市和到达城市不能相同';
    }

    if (!searchData.date) {
      errors.date = '请选择出发日期';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const departureDate = new Date(searchData.date);
      
      if (departureDate < today) {
        errors.date = '出发日期不能早于今天';
      }
    }

    if (tripType === 'roundTrip') {
      if (!returnDate) {
        errors.returnDate = '请选择返程日期';
      } else if (searchData.date && returnDate) {
        const departureDate = new Date(searchData.date);
        const returnDateObj = new Date(returnDate);
        
        if (returnDateObj <= departureDate) {
          errors.returnDate = '返程日期必须晚于出发日期';
        }
      }
    }

    return errors;
  };

  const swapCities = () => {
    setSearchData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  return (
    <form className="flight-search-form" onSubmit={handleSubmit}>
      <div className="trip-type-selector">
        <label className={`trip-type ${tripType === 'oneWay' ? 'active' : ''}`}>
          <input
            type="radio"
            name="tripType"
            value="oneWay"
            checked={tripType === 'oneWay'}
            onChange={() => handleTripTypeChange('oneWay')}
          />
          单程
        </label>
        <label className={`trip-type ${tripType === 'roundTrip' ? 'active' : ''}`}>
          <input
            type="radio"
            name="tripType"
            value="roundTrip"
            checked={tripType === 'roundTrip'}
            onChange={() => handleTripTypeChange('roundTrip')}
          />
          往返
        </label>
      </div>

      <div className="search-fields">
        <div className="city-fields">
          <div className="field-group">
            <label>出发城市</label>
            <CitySelector
              value={searchData.origin}
              onChange={handleOriginChange}
              placeholder="请选择出发城市"
            />
            {errors.origin && <span className="error-message">{errors.origin}</span>}
          </div>

          <button
            type="button"
            className="swap-cities-button"
            onClick={swapCities}
            title="交换城市"
          >
            ⇄
          </button>

          <div className="field-group">
            <label>到达城市</label>
            <CitySelector
              value={searchData.destination}
              onChange={handleDestinationChange}
              placeholder="请选择到达城市"
            />
            {errors.destination && <span className="error-message">{errors.destination}</span>}
          </div>
        </div>

        <div className="date-fields">
          <div className="field-group">
            <label>出发日期</label>
            <input
              type="date"
              name="date"
              value={searchData.date}
              onChange={handleDateChange}
              min={getTomorrowDate()}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          {tripType === 'roundTrip' && (
            <div className="field-group">
              <label>返程日期</label>
              <input
                type="date"
                name="returnDate"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={searchData.date || getTomorrowDate()}
              />
              {errors.returnDate && <span className="error-message">{errors.returnDate}</span>}
            </div>
          )}
        </div>

        <div className="passengers-field">
          <label>乘客数量</label>
          <select
            value={passengers}
            onChange={handlePassengersChange}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <option key={num} value={num}>
                {num} 位乘客
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="search-button"
        disabled={isLoading}
      >
        {isLoading ? '搜索中...' : '搜索航班'}
      </button>
    </form>
  );
};

export default FlightSearchForm;