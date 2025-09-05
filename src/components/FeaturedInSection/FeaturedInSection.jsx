import React from 'react';
import './FeaturedInSection.css';

const FeaturedInSection = () => {
  const mediaLogos = [
    { name: 'Mashable', logo: 'Mashable' },
    { name: 'Forbes', logo: 'Forbes' },
    { name: 'HuffPost', logo: 'HUFFPOST' },
    { name: 'Social Media Today', logo: 'Social Media Today' },
    { name: 'Entrepreneur', logo: 'Entrepreneur' },
    { name: 'Medium', logo: 'Medium' },
    { name: 'BuzzFeed', logo: 'BuzzFeed' },
    { name: 'Product Hunt', logo: 'Product Hunt' },
    { name: 'TechCrunch', logo: 'TC TechCrunch' },
    { name: 'VICE', logo: 'VICE' }
  ];

  return (
    <section className="featured-in-section">
      <div className="container">
        <div className="hero-content">
          <h1 className="main-heading">
            <span className="number">#1</span> Instagram
            <br />
            Marketing Agency
          </h1>
          <p className="hero-description">
            Grow your Instagram with <strong>real followers</strong> that will
            <br />
            like, comment and engage with your content.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn chat-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Chat with us →
            </button>
            <button className="cta-btn growth-btn">
              Growth Estimation →
            </button>
          </div>
          <p className="stats-text">
            We've managed over 23,000 Instagram Accounts
          </p>
        </div>
        
        <div className="logos-grid">
          {mediaLogos.map((media, index) => (
            <div key={index} className="logo-item">
              <div className="logo-text">{media.logo}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedInSection;
