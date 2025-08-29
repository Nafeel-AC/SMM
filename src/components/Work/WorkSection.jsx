import React, { useEffect } from 'react';
import './WorkSection.css';
import data from './data.json';
import heroImage from '../../assets/hero-image.jpg';

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
      <path d="M22 2H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"></path>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
  ),
  display: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
      <line x1="8" y1="21" x2="16" y2="21"></line>
      <line x1="12" y1="17" x2="12" y2="21"></line>
    </svg>
  ),
  file: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  )
};

const WorkSection = () => {
  // DEBUG: Log when component mounts
  useEffect(() => {
    console.log('🚀 WORK SECTION MOUNTED');
    console.log('Number of work items:', data.workItems.length);
    console.log('Window width:', window.innerWidth);
    
    // Test grid layout after component mounts
    setTimeout(() => {
      const gridItems = document.querySelectorAll('.col-lg-4');
      console.log('Grid items found:', gridItems.length);
      
      if (gridItems.length > 0) {
        const firstItem = gridItems[0];
        const computedStyle = window.getComputedStyle(firstItem);
        console.log('First grid item styles:');
        console.log('- Flex basis:', computedStyle.flexBasis);
        console.log('- Max width:', computedStyle.maxWidth);
        console.log('- Width:', firstItem.offsetWidth);
        console.log('- Container width:', firstItem.parentElement.offsetWidth);
      }
    }, 100);
  }, []);

  return (
    <section className="work-section" id="work">
      <div 
        className="bg-img-overlay" 
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>
      <div className="work-section-inner">
        <div className="container">
          <div className="row">
            <div className="section-header">
              <span className="section-subtitle">{data.sectionTitle}</span>
              <h2 className="section-title">{data.mainTitle}</h2>
              <p className="cmn-para-text">{data.description}</p>
            </div>
          </div>
          <div className="row g-4">
            {data.workItems.map((workItem, index) => (
              <div 
                className="col-lg-4 cmn-box-item" 
                key={workItem.id}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="cmn-box">
                  <div className="icon-area">
                    {React.createElement(IconComponents[workItem.icon] || IconComponents.rocket)}
                  </div>
                  <div className="content-area">
                    <h4 className="title">{workItem.title}</h4>
                    <p>{workItem.description}</p>
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

export default WorkSection;
