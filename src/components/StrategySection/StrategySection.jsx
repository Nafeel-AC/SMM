import React from 'react';
import './StrategySection.css';

const StrategySection = ({ 
  targetLocations = ['USA', 'New York', 'India', 'Canada', 'Chicago'],
  targetAudience = [
    'Minimalist', 'Travel', 'Wellness', 'fitness', 'healthyfood', 
    'facelessinstagram', 'quotes', 'aesthetic vibes', 'health tips', 
    'wellness resort', 'yoga and zen mode', 'Journaling and vision boards'
  ]
}) => {
  return (
    <div className="strategy-section">
      <div className="strategy-header">
        <div className="strategy-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="currentColor"/>
            <path d="M19 15L19.5 17L22 17.5L19.5 18L19 20L18.5 18L16 17.5L18.5 17L19 15Z" fill="currentColor"/>
            <path d="M5 15L5.5 17L8 17.5L5.5 18L5 20L4.5 18L2 17.5L4.5 17L5 15Z" fill="currentColor"/>
          </svg>
        </div>
        <h3>Strategy</h3>
      </div>
      
      <div className="strategy-content">
        <div className="strategy-item">
          <div className="strategy-label">Target location</div>
          <div className="strategy-tags">
            {targetLocations.map((location, index) => (
              <span key={index} className="strategy-tag location-tag">
                {location}
              </span>
            ))}
          </div>
        </div>
        
        <div className="strategy-item">
          <div className="strategy-label">Target audience</div>
          <div className="strategy-tags">
            {targetAudience.map((audience, index) => (
              <span key={index} className="strategy-tag audience-tag">
                {audience}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategySection;
