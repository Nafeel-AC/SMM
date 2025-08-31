import React, { useEffect, useState, useRef } from 'react';
import './TargetAudience.css';

// Import target audience data
import targetAudienceImages from '../../data/targetAudienceData';

// Icon imports
import { FaEye, FaThumbsUp, FaClock, FaUsers, FaBullseye, FaChartLine, FaRegLightbulb } from 'react-icons/fa';

const TargetAudience = () => {
  const [activeTab, setActiveTab] = useState('creators');
  const [animationTriggered, setAnimationTriggered] = useState(false);
  const tabsRef = useRef(null);
  const activeTabRef = useRef(null);

  // Update slider position when active tab changes
  useEffect(() => {
    if (tabsRef.current && activeTabRef.current) {
      const tabsContainer = tabsRef.current;
      const activeTabElement = activeTabRef.current;
      
      // Get position of active tab relative to tabs container
      const tabRect = activeTabElement.getBoundingClientRect();
      const containerRect = tabsContainer.getBoundingClientRect();
      
      // Calculate the left position and width for the slider
      const left = tabRect.left - containerRect.left + tabsContainer.scrollLeft;
      const width = tabRect.width;
      
      // Apply the styles to the pseudo-element using CSS custom properties
      tabsContainer.style.setProperty('--slider-left', `${left}px`);
      tabsContainer.style.setProperty('--slider-width', `${width}px`);
    }
  }, [activeTab]);

  // Animation on scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const section = document.querySelector('.target-audience-section');
      if (!section) return;
      
      const sectionPosition = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (sectionPosition.top < windowHeight * 0.75 && !animationTriggered) {
        setAnimationTriggered(true);
        
        // Animate elements
        const elements = document.querySelectorAll('.audience-animate');
        elements.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add('audience-fade-in');
          }, 100 * index);
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationTriggered]);

  // Tab data with modern design
  const tabs = [
    {
      id: 'creators',
      title: 'Content Creators',
      icon: <FaUsers className="tab-icon" />,
      image: targetAudienceImages.contentCreators.path,
      imageAlt: targetAudienceImages.contentCreators.alt,
      description: 'Amplify your influence and stand out in a saturated market. Grow with authentic followers who truly engage with your content, land brand collaborations, and build a monetizable personal brand.',
      benefits: [
        { icon: <FaEye />, text: 'Boost Visibility' },
        { icon: <FaBullseye />, text: 'Reach the Right Audience' },
        { icon: <FaClock />, text: 'Save Time Creating Content' }
      ]
    },
    {
      id: 'businesses',
      title: 'Small Businesses',
      icon: <FaRegLightbulb className="tab-icon" />,
      image: targetAudienceImages.smallBusiness.path,
      imageAlt: targetAudienceImages.smallBusiness.alt,
      description: 'Develop focused growth strategies that attract customers who already need what you offer. Boost local sales and convert followers into loyal customers on autopilot.',
      benefits: [
        { icon: <FaUsers />, text: 'Connect with Local Buyers' },
        { icon: <FaThumbsUp />, text: 'Build Brand Trust' },
        { icon: <FaChartLine />, text: 'Increase Conversion Rates' }
      ]
    },
    {
      id: 'freelancers',
      title: 'Freelancers',
      icon: <FaBullseye className="tab-icon" />,
      image: targetAudienceImages.freelancers.path,
      imageAlt: targetAudienceImages.freelancers.alt,
      description: 'Transform your social presence into a client magnet. Connect with high-value prospects in your niche, book premium projects, and position yourself for higher rates.',
      benefits: [
        { icon: <FaChartLine />, text: 'Attract Premium Clients' },
        { icon: <FaThumbsUp />, text: 'Showcase Your Expertise' },
        { icon: <FaClock />, text: 'Passive Lead Generation' }
      ]
    },
    {
      id: 'agencies',
      title: 'Marketing Agencies',
      icon: <FaChartLine className="tab-icon" />,
      image: targetAudienceImages.marketingAgencies.path,
      imageAlt: targetAudienceImages.marketingAgencies.alt,
      description: 'Deliver exceptional results for clients with data-driven strategies. Drive measurable ROI and position your agency as the go-to expert for social media success.',
      benefits: [
        { icon: <FaChartLine />, text: 'Scale Client Growth' },
        { icon: <FaEye />, text: 'Demonstrate Clear ROI' },
        { icon: <FaThumbsUp />, text: 'Retain More Clients' }
      ]
    }
  ];

  // Find active tab data
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <section className="target-audience-section">
      <div className="container">
        <div className="section-header audience-animate">
          <span className="section-subtitle">Tailored Growth Strategies</span>
          <h2 className="section-title">
            Your <span className="highlight">Target Audience</span> Is Waiting
          </h2>
          <p className="section-description">
            Our platform adapts to your unique goals and connects you with followers that truly engage with your content and become loyal brand advocates
          </p>
        </div>

        <div className="audience-content">
          {/* Visual display side */}
          <div className="audience-visual audience-animate">
            <div className="audience-image-container">
              <img 
                src={activeTabData.image} 
                alt={activeTabData.imageAlt} 
                className="audience-image"
              />
              <div className="audience-overlay"></div>
              
              {/* Floating benefit badges */}
              <div className="audience-benefits">
                {activeTabData.benefits.map((benefit, index) => (
                  <div 
                    key={index} 
                    className="benefit-badge"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <span className="benefit-icon">{benefit.icon}</span>
                    <span className="benefit-text">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Content side */}
          <div className="audience-content-side audience-animate">
            {/* Tab navigation */}
            <div className="audience-tabs" ref={tabsRef}>
              {tabs.map((tab) => (
                <button 
                  key={tab.id}
                  className={`audience-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  ref={activeTab === tab.id ? activeTabRef : null}
                >
                  {tab.icon}
                  <span>{tab.title}</span>
                </button>
              ))}
            </div>
            
            {/* Tab content */}
            <div className="audience-tab-content">
              <h3>{activeTabData.title}</h3>
              <p>{activeTabData.description}</p>
              <a href="/" className="audience-learn-more">
                Learn More About {activeTabData.title}
                <svg className="arrow-icon" viewBox="0 0 24 24">
                  <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
