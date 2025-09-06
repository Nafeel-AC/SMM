import React from 'react';
import './MetricsDisplay.css';

const MetricsDisplay = ({ followers = 1381, following = 676 }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="metrics-display">
      <div className="metrics-container">
        <div className="metric-item">
          <div className="metric-value">{formatNumber(following)}</div>
          <div className="metric-label">Following</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">{formatNumber(followers)}</div>
          <div className="metric-label">Followers</div>
        </div>
      </div>
      
    </div>
  );
};

export default MetricsDisplay;
