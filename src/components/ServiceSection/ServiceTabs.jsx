import React from 'react';
import './ServiceSection.css';

const getPlatformIcon = (platformName) => {
  switch (platformName.toLowerCase()) {
    case 'instagram':
      return <i className="fab fa-instagram"></i>;
    case 'facebook':
      return <i className="fab fa-facebook-f"></i>;
    case 'youtube':
      return <i className="fab fa-youtube"></i>;
    case 'spotify':
      return <i className="fab fa-spotify"></i>;
    case 'tiktok':
      return <i className="fab fa-tiktok"></i>;
    case 'google':
      return <i className="fab fa-google"></i>;
    case 'telegram':
      return <i className="fab fa-telegram-plane"></i>;
    case 'others':
      return <i className="fas fa-ellipsis-h"></i>;
    default:
      return <i className="fas fa-share-alt"></i>;
  }
};

const ServiceTabs = ({ platforms, selectedPlatform, onPlatformChange }) => {
  return (
    <div className="service-tabs">
      <div className="row">
        <div className="col-12">
          <div className="card mb-30">
            <div className="card-body">
              <div className="row g-3">
                {platforms.map(platform => (
                  <div key={platform.id} className="col-lg-3 col-md-4 col-sm-6">
                    <button
                      type="button"
                      className={`social-btn w-100 ${selectedPlatform && selectedPlatform.id === platform.id ? 'active' : ''}`}
                      onClick={() => onPlatformChange(platform)}
                    >
                      <div className="social-media-icon" style={{ 
                        background: platform.gradient,
                        color: '#fff'
                      }}>
                        {getPlatformIcon(platform.name)}
                      </div>
                      <span>{platform.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {selectedPlatform && (
        <div className="platform-info mt-4">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h3 className="platform-title" style={{ color: selectedPlatform.color }}>
                    {selectedPlatform.name} Services
                  </h3>
                  <p className="platform-description">
                    Enhance your {selectedPlatform.name} presence with our premium services. 
                    We offer a wide range of solutions to boost your engagement and growth.
                  </p>
                </div>
                <div className="col-md-4 text-md-end">
                  <div className="platform-categories">
                    <span className="categories-label">Available Categories:</span>
                    <div className="categories-list">
                      {selectedPlatform.categories.map((category, idx) => (
                        <span key={idx} className="category-badge" style={{ background: selectedPlatform.gradient }}>
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceTabs;
