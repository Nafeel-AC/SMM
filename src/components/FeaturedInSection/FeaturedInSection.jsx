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
