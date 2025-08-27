import React, { useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [currency, setCurrency] = useState('USD');
  const [scrolled, setScrolled] = useState(false);
  
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
        <a className="navbar-brand logo" href="/">
          <img src={logo} alt="Logo" />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
          <i className="fas fa-bars"></i>
        </button>
        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbar">
          <div className="offcanvas-header">
            <a className="navbar-brand" href="/">
              <img className="logo" src={logo} alt="Logo" />
            </a>
            <button type="button" className="cmn-btn-close" data-bs-dismiss="offcanvas" aria-label="Close">
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
          <div className="offcanvas-body align-items-center justify-content-between">
            <ul className="navbar-nav m-auto">
              <li className="nav-item"><a className="nav-link text-uppercase active" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link text-uppercase" href="/about">About</a></li>
              <li className="nav-item"><a className="nav-link text-uppercase" href="/faq">Faq</a></li>
              <li className="nav-item"><a className="nav-link text-uppercase" href="/blogs">Blogs</a></li>
              <li className="nav-item"><a className="nav-link text-uppercase" href="/services">Services</a></li>
              <li className="nav-item"><a className="nav-link text-uppercase" href="/contact">Contact</a></li>
            </ul>
            <ul>
              <li className="nav-item">
                <a className="nav-link login-btn" href="/login">
                  <i className="login-icon fas fa-sign-in-alt"></i>
                  <span className="d-md-none">Login</span>
                </a>
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
              <a className="nav-link login-btn" href="/login">
                <i className="login-icon fas fa-sign-in-alt"></i>
                <span className="d-none d-md-block">Login</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
