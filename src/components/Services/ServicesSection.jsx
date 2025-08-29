import React from 'react';
import './ServicesSection.css';
import data from './data.json';

// SVG icons for the service items
const IconComponents = {
  rocket: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
    </svg>
  ),
  chart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"></path>
      <path d="M8 17h.01"></path>
      <path d="M11 13h.01"></path>
      <path d="M14 11h.01"></path>
      <path d="M17 7h.01"></path>
      <path d="m7 14 2.4-3.2a2 2 0 0 1 3.2 0l4.8 6.4"></path>
    </svg>
  ),
  cart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"></circle>
      <circle cx="19" cy="21" r="1"></circle>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
      <path d="M14 13V9a4 4 0 0 0-4-4h0a4 4 0 0 0-4 4v4"></path>
    </svg>
  ),
  email: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.2 8.4c.5.38.8.96.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"></path>
      <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"></path>
    </svg>
  ),
  display: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  ),
  content: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
  )
};

const ServicesSection = () => {
  return (
    <section className="services-section" id="services">
      <div 
        className="bg-img-overlay" 
        style={{ backgroundImage: `url(${data.backgroundImage})` }}
      ></div>
      <div className="services-section-inner">
        <div className="container">
          <div className="row">
            <div className="section-header">
              <span className="section-subtitle">{data.sectionTitle}</span>
              <h2 className="section-title">{data.mainTitle}</h2>
              <p className="cmn-para-text">{data.description}</p>
            </div>
          </div>
          <div className="row g-4">
            {data.services.map((service, index) => (
              <div 
                className="col-lg-4 cmn-box-item" 
                key={service.id}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="cmn-box">
                  <div className="icon-area">
                    {React.createElement(IconComponents[service.icon] || IconComponents.rocket)}
                  </div>
                  <div className="content-area">
                    <h4 className="title">{service.title}</h4>
                    <p>{service.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
