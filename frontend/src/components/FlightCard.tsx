import React from 'react';
import { PromotionalFlight } from '../types';

interface FlightCardProps {
  flight: PromotionalFlight;
  onClick?: (flight: PromotionalFlight) => void;
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(flight);
    }
  };

  const formatPrice = (price: number): string => {
    return `¥${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const calculateDuration = (): string => {
    // 由于PromotionalFlight类型中没有arrivalTime，我们假设航班时长为2小时
    return '2小时';
  };

  return (
    <div className="flight-card" onClick={handleClick}>
      <div className="flight-info">
        <div className="departure">
          <div className="time">{formatTime(flight.date)}</div>
          <div className="airport">{flight.origin}</div>
          <div className="date">{formatDate(flight.date)}</div>
        </div>

        <div className="flight-path">
          <div className="duration">
            {calculateDuration()}
          </div>
          <div className="path-line">
            <div className="direct">直飞</div>
          </div>
        </div>

        <div className="arrival">
          <div className="time">{formatTime(flight.date)}</div>
          <div className="airport">{flight.destination}</div>
          <div className="date">{formatDate(flight.date)}</div>
        </div>
      </div>

      <div className="price-info">
        <div className="current-price">{formatPrice(flight.price)}</div>
        {flight.originalPrice > flight.price && (
          <div className="original-price">{formatPrice(flight.originalPrice)}</div>
        )}
        {flight.discount > 0 && (
          <div className="discount">{flight.discount}折</div>
        )}
      </div>
    </div>
  );
};

export default FlightCard;