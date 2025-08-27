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
    <div className="hero-section">
      <div className="container">
        <div className="hero-section-inner">
          <div className="row g-xl-4 g-5 justify-content-between align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <div className="hero-content">
                <span className="section-subtitle">We Are SMM Matrix</span>
                <h1 className="hero-title">
                  We Will Help You To Grow Your Business
                </h1>
                <p className="hero-description">
                  We've managed to create more than 23,000 Instagram accounts
                </p>
                <p className="hero-description">
                  Our expertise spans across all major social media platforms including Facebook, Twitter, LinkedIn, and TikTok
                </p>

                <div className="btn-area">
                  <a href="/" className="cmn-btn">Get Started</a>
                  <div className="video-area">
                    <a 
                      data-fancybox 
                      href="https://www.youtube.com/watch?v=XWZ4GUuunVE" 
                      className="video-play-btn"
                    >
                      <i className="fas fa-play"></i>
                    </a>
                    <span className="watch-text">WATCH VIDEO</span>
                  </div>
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
    </div>
  );
};

export default HeroSection;
