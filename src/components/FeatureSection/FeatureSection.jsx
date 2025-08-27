import React, { useEffect } from 'react';
import './FeatureSection.css';
import './ionicons.css'; // Import Ionicons
import './animations.css'; // Import animations

const FeatureSection = () => {
  // Add animation effect similar to wow.js
  useEffect(() => {
    const animateElements = () => {
      const elements = document.querySelectorAll('.wow');
      
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add('fadeIn');
        }, 300 + (index * 200));
      });
      
      // Animate feature items
      const items = document.querySelectorAll('.feature-section .item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animated');
        }, 500 + (index * 100));
      });
    };
    
    // Run animation after a slight delay
    setTimeout(animateElements, 200);
  }, []);
  const features = [
    {
      icon: "ion-ios-monitor",
      title: "Interface Design",
      description: "Creating intuitive and visually appealing user interfaces that enhance user experience and drive engagement across all digital platforms.",
      active: false
    },
    {
      icon: "ion-ios-bolt-outline",
      title: "Creative Always",
      description: "Delivering innovative and imaginative solutions that push creative boundaries and set new standards in digital design and development.",
      active: true
    },
    {
      icon: "ion-cube",
      title: "Real-time Editing",
      description: "Providing instant collaboration tools and live editing capabilities that enable seamless teamwork and rapid project iteration.",
      active: false
    },
    {
      icon: "ion-ios-color-wand",
      title: "Art Concept",
      description: "Transforming creative visions into stunning visual concepts that capture brand essence and communicate powerful messages.",
      active: false
    }
  ];

  return (
    <section className="feature-section" id="features">
      <div className="container">
        <div className="section-heading">
          <h6 className="wow fadeIn" data-wow-delay=".5s">Best Services</h6>
          <h3 className="wow">We help to create <span className="color-font">strategies, design</span> & development.</h3>
        </div>
        <div className="feature-section-inner">
          {features.map((feature, index) => (
            <div className={`item ${feature.active ? 'active' : ''} wow`} key={index}>
              <div className="icon-area">
                <span className={`icon ${feature.icon}`}></span>
              </div>
              <div className="content-area">
                <h5>{feature.title}</h5>
                <p>{feature.description}</p>
                <a className="more-stroke" href="/about/">
                  <span></span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
