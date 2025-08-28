import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-background">
        <div className="footer-content">
          <div className="container">
            <div className="footer-grid">
              {/* Left Column: SMM Matrix Branding and Social Media */}
              <div className="footer-column">
                <div className="brand-section">
                  <div className="logo-container">
                    <div className="logo-icon">
                      <div className="cube-icon"></div>
                    </div>
                    <h3 className="brand-name">SMM Matrix</h3>
                  </div>
                  <p className="brand-description">
                    Experience the SMM Matrix Advantage - Empowering Social Success with Data-Driven Solutions.
                  </p>
                  <div className="social-media">
                    <a href="#" className="social-btn">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-btn">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-btn">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-btn">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Second Column: Quick Links */}
              <div className="footer-column">
                <div className="footer-section">
                  <h4 className="section-title">Quick Links</h4>
                  <ul className="footer-links">
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/faq">Faq</a></li>
                    <li><a href="/blogs">Blogs</a></li>
                    <li><a href="/contact">Contact</a></li>
                  </ul>
                </div>
              </div>

              {/* Third Column: Company Policy */}
              <div className="footer-column">
                <div className="footer-section">
                  <h4 className="section-title">Company Policy</h4>
                  <ul className="footer-links">
                    <li><a href="/api-docs">Api Docs</a></li>
                    <li><a href="/privacy">Privacy & Policy</a></li>
                    <li><a href="/terms">Terms and Conditions</a></li>
                    <li><a href="/refund">Refund Policy</a></li>
                    <li><a href="/cookies">Cookie Policy</a></li>
                  </ul>
                </div>
              </div>

              {/* Fourth Column: Newsletter */}
              <div className="footer-column">
                <div className="footer-section">
                  <h4 className="section-title">Newsletter</h4>
                  <p className="newsletter-text">
                    Subscribe To Our Mailing List And Stay Up To Date
                  </p>
                  <div className="newsletter-form">
                    <input 
                      type="email" 
                      placeholder="Your Email Address" 
                      className="email-input"
                    />
                    <button className="newsletter-submit-btn">
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright and Language Selector */}
      <div className="footer-bottom">
        <div className="container">
          <div className="bottom-content">
            <div className="copyright">
              © {currentYear} Social Boost. All rights reserved.
            </div>
            <div className="location">
              London • New York
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
