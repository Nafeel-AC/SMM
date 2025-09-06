import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-background">
        <div className="footer-content">
          <div className="container">
            <div className="footer-grid">
              {/* Left Column: Glowup Agency Branding and Social Media */}
              <div className="footer-column">
                <div className="brand-section">
                  <div className="logo-container">
                    <div className="logo-icon">
                      <div className="cube-icon"></div>
                    </div>
                    <h3 className="brand-name">Glowup Agency</h3>
                  </div>
                  <p className="brand-description">
                    Experience the Glowup Agency Advantage - Empowering Social Success with Data-Driven Solutions.
                  </p>
                  <div className="social-media">
                    <a href="#" className="social-btn">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-btn">
                      <i className="fab fa-tiktok"></i>
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
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/faq">Faq</Link></li>
                    <li><Link to="/blog">Blogs</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                  </ul>
                </div>
              </div>

              {/* Third Column: Company Policy */}
              {/* <div className="footer-column">
                <div className="footer-section">
                  <h4 className="section-title">Company Policy</h4>
                  <ul className="footer-links">
                    <li><Link to="/api-docs">Api Docs</Link></li>
                    <li><Link to="/cookies">Cookie Policy</Link></li>
                  </ul>
                </div>
              </div> */}

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
          <div className="bottom-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="copyright">
              © {currentYear} Glowup Agency. All rights reserved.
            </div>
            <div>
              <Link to="/privacy" style={{ color: '#888', textDecoration: 'underline', fontSize: 14 }}>Privacy &amp; Policy</Link>
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
