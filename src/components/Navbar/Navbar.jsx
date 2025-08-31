import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [currency, setCurrency] = useState('USD');
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  return (
    <nav className={`navbar fixed-top navbar-expand-lg ${scrolled ? 'scrolled' : 'transparent'}`}>
      <div className="container">
        <Link className="navbar-brand logo" to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
          <i className="fas fa-bars"></i>
        </button>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbar">
          <div className="offcanvas-header">
            <Link className="navbar-brand" to="/">
              <img className="logo" src={logo} alt="Logo" />
            </Link>
            <button type="button" className="cmn-btn-close" data-bs-dismiss="offcanvas" aria-label="Close">
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="offcanvas-body align-items-center justify-content-between">
            <ul className="navbar-nav m-auto">
              <li className="nav-item">
                <Link 
                  className={`nav-link text-uppercase ${location.pathname === '/' && !location.hash ? 'active' : ''}`} 
                  to="/"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-uppercase ${location.pathname === '/about' ? 'active' : ''}`} 
                  to="/about"
                >
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-uppercase ${location.pathname === '/faq' ? 'active' : ''}`} 
                  to="/faq"
                >
                  Faq
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link text-uppercase ${location.pathname === '/contact' ? 'active' : ''}`}
                  to="/contact"
                >
                  Contact
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link text-uppercase ${location.hash === '#pricing' || location.pathname + location.hash === '/#pricing' ? 'active' : ''}`}
                  to="/#pricing"
                  onClick={(e) => {
                    // If already on the homepage, just scroll to the section
                    if (location.pathname === '/') {
                      e.preventDefault();
                      document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Pricing
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-uppercase ${location.pathname === '/blog' ? 'active' : ''}`} 
                  to="/blog"
                >
                  Blogs
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link 
                  className={`nav-link text-uppercase ${location.pathname === '/services' ? 'active' : ''}`} 
                  to="/services"
                >
                  Services
                </Link>
              </li> */}
              {/* <li className="nav-item">
                <Link 
                  className={`nav-link text-uppercase ${location.pathname === '/contact' ? 'active' : ''}`} 
                  to="/contact"
                >
                  Contact
                </Link>
              </li> */}
            </ul>
            <ul>
              <li className="nav-item">
                <Link className="nav-link login-btn" to="/login">
                  <i className="login-icon fas fa-sign-in-alt"></i>
                  <span className="d-md-none">Login</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="nav-right">
          <ul className="custom-nav">
            <li className="nav-item">
              <div className="language-box">
                <i className="fas fa-coins"></i>
                <select 
                  className="form-select select-currency" 
                  value={currency}
                  onChange={handleCurrencyChange}
                >
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </li>
            <li className="nav-item">
              <Link className="nav-link login-btn" to="/login">
                <i className="login-icon fas fa-sign-in-alt"></i>
                <span className="d-none d-md-block">Login</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
