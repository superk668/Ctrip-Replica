import React, { useState } from 'react';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
  onClick?: (destination: Destination) => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick(destination);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price: number): string => {
    return `¥${price.toLocaleString()}`;
  };

  const truncateDescription = (description: string, maxLength: number = 100): string => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  };

  return (
    <div className="destination-card" onClick={handleClick}>
      <div className="image-container">
        {!imageError ? (
          <img
            src={destination.image}
            alt={destination.name}
            onError={handleImageError}
            className="destination-image"
          />
        ) : (
          <div className="image-placeholder">
            <span>图片加载失败</span>
          </div>
        )}
        {destination.hotRank > 0 && (
          <div className="hot-badge">
            热门第{destination.hotRank}
          </div>
        )}
      </div>

      <div className="destination-info">
        <h3 className="destination-name">{destination.name}</h3>
        <p className="destination-description">
          {truncateDescription(destination.description)}
        </p>
        <div className="price-info">
          <span className="price">{formatPrice(destination.price)}</span>
          <span className="price-label">起</span>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;