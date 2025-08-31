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
      icon: "./src/assets/feature-1.png",
      title: "REAL GROWTH ",
      description: "Reach genuine Instagram followers effortlessly. Our strategies focus on authentic audience expansion 24/7, helping your profile grow with real people who care.",
      active: false
    },
    {
      icon: "./src/assets/feature-2.png",
      title: "HIGH ENGAGEMENT ",
      description: "Turn followers into loyal fans. Boost likes, comments, and shares through smart, automated actions that maintain authenticity and keep your audience actively involved. ",
      active: true
    },
    {
      icon: "./src/assets/feature-3.png",
      title: "TOTAL SECURITY ",
      description: "Your safety is our priority. We use encrypted, proxy-based systems to ensure your account is fully protected while growing confidently. ",
      active: false
    },
    {
      icon: "./src/assets/feature-4.png",
      title: "INSIGHTFUL ANALYTICS ",
      description: "Know what works and refine your strategy. Our comprehensive analytics help you track performance, measure growth, and optimize engagement for maximum results.",
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
              {/* <div className="icon-area"> */}
                {/* <span className={`icon ${feature.icon}`}></span> */}
                <div className='image-area'>
                  <img src={feature.icon} alt="" />
                </div>
              {/* </div> */}
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
