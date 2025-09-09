import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [currency, setCurrency] = useState('USD');
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, getNextUserFlowStep, signOut } = useFirebaseAuth();
  
  // Get dashboard URL based on user role and flow progress
  const getDashboardUrl = () => {
    return getNextUserFlowStep();
  };
  
  // Enhanced smooth scroll function with better animation
  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`);
      return;
    }

    // Temporarily disable any CSS scroll behavior
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';

    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1200; // 1.2 seconds for even smoother animation
    let start = null;

    // Improved easing function for very smooth animation
    const easeInOutCubic = (t) => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const ease = easeInOutCubic(progress);
      
      const currentPosition = startPosition + (distance * ease);
      window.scrollTo(0, currentPosition);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Animation complete
        setActiveSection(elementId);
        // Re-enable CSS scroll behavior
        document.documentElement.style.scrollBehavior = '';
        document.body.style.scrollBehavior = '';
      }
    };

    window.requestAnimationFrame(step);
  };

  // Handle navigation with smooth scroll
  const handleNavigation = (e, sectionId) => {
    e.preventDefault();
    
    if (location.pathname === '/') {
      // If already on homepage, just scroll to section
      smoothScrollTo(sectionId);
      // Update URL hash
      window.history.replaceState(null, null, `/#${sectionId}`);
    } else {
      // If on different page, navigate to homepage then scroll
      navigate('/');
      // Store the target section to scroll to after navigation
      sessionStorage.setItem('scrollToSection', sectionId);
      setTimeout(() => {
        smoothScrollTo(sectionId);
        window.history.replaceState(null, null, `/#${sectionId}`);
      }, 100);
    }
  };

  // Handle scroll to section on page load (for direct links)
  useEffect(() => {
    const scrollToSection = sessionStorage.getItem('scrollToSection');
    if (scrollToSection && location.pathname === '/') {
      setTimeout(() => {
        smoothScrollTo(scrollToSection);
        sessionStorage.removeItem('scrollToSection');
      }, 300);
    } else if (location.hash && location.pathname === '/') {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        smoothScrollTo(sectionId);
      }, 300);
    }
  }, [location.pathname]);
  
  // Handle scroll effect and active section detection
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const offset = window.scrollY;
          
          // Handle navbar background change
          if (offset > 50) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }

          // Only track active sections on homepage
          if (location.pathname === '/') {
            const sections = ['home', 'about', 'pricing', 'faq'];
            let currentSection = 'home';

            // Check which section is most visible in the viewport
            sections.forEach(sectionId => {
              const element = document.getElementById(sectionId);
              if (element) {
                const rect = element.getBoundingClientRect();
                const elementTop = rect.top;
                const elementBottom = rect.bottom;
                const windowHeight = window.innerHeight;
                
                // Section is considered active if its top is within the upper 50% of viewport
                // or if we're near the bottom of the page and this is the last section
                if (elementTop <= windowHeight * 0.3 && elementBottom > windowHeight * 0.1) {
                  currentSection = sectionId;
                }
                
                // Special case for FAQ section if we're near bottom of page
                if (sectionId === 'faq' && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
                  currentSection = 'faq';
                }
              }
            });

            setActiveSection(currentSection);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set initial active section based on URL hash
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      setActiveSection(hash);
    }

    // Initial scroll check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

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
                <a
                  href="/#home"
                  className={`nav-link text-uppercase ${
                    location.pathname === '/' && activeSection === 'home' ? 'active' : ''
                  }`}
                  onClick={(e) => handleNavigation(e, 'home')}
                >
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/#about"
                  className={`nav-link text-uppercase ${
                    location.pathname === '/' && activeSection === 'about' ? 'active' : ''
                  }`}
                  onClick={(e) => handleNavigation(e, 'about')}
                >
                  About
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/#pricing"
                  className={`nav-link text-uppercase ${
                    location.pathname === '/' && activeSection === 'pricing' ? 'active' : ''
                  }`}
                  onClick={(e) => handleNavigation(e, 'pricing')}
                >
                  Pricing
                </a>
              </li>
              <li className="nav-item">
                {location.pathname === '/' ? (
                  <a
                    href="/#faq"
                    className={`nav-link text-uppercase ${
                      activeSection === 'faq' ? 'active' : ''
                    }`}
                    onClick={(e) => handleNavigation(e, 'faq')}
                  >
                    FAQ
                  </a>
                ) : (
                  <Link
                    className={`nav-link text-uppercase ${location.pathname === '/faq' ? 'active' : ''}`}
                    to="/faq"
                  >
                    FAQ
                  </Link>
                )}
              </li>
              <li className="nav-item">
                <Link 
                  className={`nav-link text-uppercase ${location.pathname === '/blog' ? 'active' : ''}`} 
                  to="/blog"
                >
                  Blog
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
            {/* <ul>
              <li className="nav-item">
                <Link className="nav-link login-btn mobile-login-btn" to="/login">
                  <i className="login-icon fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </Link>
              </li>
            </ul> */}
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
              {user ? (
                <div className="user-actions">
                  <Link className="nav-link login-btn" to={getDashboardUrl()}>
                    <i className="login-icon fas fa-tachometer-alt"></i>
                    <span className="d-none d-md-block">Dashboard</span>
                  </Link>
                  <button 
                    className="nav-link logout-btn" 
                    onClick={async () => {
                      await signOut();
                      navigate('/login');
                    }}
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: '#fff', 
                      cursor: 'pointer',
                      padding: '8px 16px',
                      borderRadius: '4px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.target.style.background = 'transparent'}
                  >
                    <i className="login-icon fas fa-sign-out-alt"></i>
                    <span className="d-none d-md-block">Logout</span>
                  </button>
                </div>
              ) : (
                <Link className="nav-link login-btn" to="/login">
                  <i className="login-icon fas fa-sign-in-alt"></i>
                  <span className="d-none d-md-block">Login</span>
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
