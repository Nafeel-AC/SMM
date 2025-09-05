import React, { useEffect } from 'react';
import './HeroSection.css';
import heroImage from '../../assets/hero-image.jpg';
import heroMask from '../../assets/hero-mask.png';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const HeroSection = () => {
  useEffect(() => {
    // Initialize Fancybox
    Fancybox.bind("[data-fancybox]", {
      // Your options here
    });

    // Cleanup
    return () => {
      Fancybox.destroy();
    };
  }, []);

  return (
    <section className="hero-section" id="home">
      <div className="container">
        <div className="hero-section-inner">
          <div className="row g-xl-4 g-5 justify-content-between align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="hero-content">
                <span className="hero-section-subtitle"> &#10024; We're Glowup Agency</span>
                <h1 className="hero-title">
                  Glowup Agency helps YOUR brand shine & grow on Instagram
                </h1>
                {/* <p className="hero-description">
                  Our expertise spans across all major social media platforms including Facebook, Twitter, LinkedIn, and TikTok
                </p> */}

                <div className="btn-area">
                  <a href="/login" className="cmn-btn">&#128640; Get Started</a>
                  <a href="/contact" className="chat-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: '8px'}}>
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    Chat with us
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mx-auto order-1 order-lg-2">
              <div className="hero-thumbs mx-auto">
                <img 
                  src={heroImage} 
                  alt="Hero Image"
                  style={{
                    maskImage: `url(${heroMask})`,
                    WebkitMaskImage: `url(${heroMask})`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
