import React from 'react';
import './AboutSection.css';
import data from './data.json';

// SVG icons for the feature items
const IconComponents = {
  strategy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  ),
  time: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  ),
  growth: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"></path>
      <path d="M18 17V9"></path>
      <path d="M13 17V5"></path>
      <path d="M8 17v-3"></path>
    </svg>
  )
};

const AboutSection = () => {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-section-inner">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="about-content">
                <span className="section-subtitle">{data.sectionTitle}</span>
                <h2 className="section-title">{data.mainTitle}</h2>
                <p>{data.description}</p>
                <ul className="item-list-container">
                  {data.features.map(feature => (
                    <li className="cmn-box4" key={feature.id}>
                      <div className="icon-box">
                        {IconComponents[feature.icon] ? React.createElement(IconComponents[feature.icon]) : <i className="fa-regular fa-chart-line-up"></i>}
                      </div>
                      <div className="item-content">
                        <h5>{feature.title}</h5>
                        <span><p>{feature.description}</p></span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="btn-area mt-30">
                  <a href={data.buttonUrl} className="cmn-btn">
                    <span>{data.buttonText}</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2">
              <div className="about-image-area rotate-group-images">
                <figure className="img1">
                  <img src={data.images.main} alt="About Our Company" />
                </figure>
                <figure className="img2">
                  <img src={data.images.secondary} alt="Our Team" />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
