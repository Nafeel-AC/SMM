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

    
    // Tab data with modern design (updated)
    const tabs = [
    {
        id: 'creators',
        title: 'Creators & Influencers',
        icon: <FaUsers className="tab-icon" />,
        image: targetAudienceImages.contentCreators.path,
        imageAlt: targetAudienceImages.contentCreators.alt,
        description:
        'Expand your reach and make your mark in a competitive landscape. GlowUp Agency helps you gain real followers who engage with your content. Secure partnerships, monetize your talent, and craft a personal brand that stands out.',
        benefits: [
        { icon: <FaEye />, text: 'Gain Real & Engaged Followers' },
        { icon: <FaBullseye />, text: 'Land Brand Partnerships' },
        { icon: <FaChartLine />, text: 'Monetize Your Influence' }
        ]
    },
    {
        id: 'businesses',
        title: 'Local Businesses',
        icon: <FaRegLightbulb className="tab-icon" />,
        image: targetAudienceImages.smallBusiness.path,
        imageAlt: targetAudienceImages.smallBusiness.alt,
        description:
        'Implement a targeted growth plan that attracts customers already interested in your products or services. Boost revenue, convert followers into loyal fans, and let your business thrive effortlessly.',
        benefits: [
        { icon: <FaUsers />, text: 'Connect With Ready-to-Buy Customers' },
        { icon: <FaThumbsUp />, text: 'Turn Followers Into Loyal Fans' },
        { icon: <FaChartLine />, text: 'Increase Sales & Local Growth' }
        ]
    },
    {
        id: 'freelancers',
        title: 'Independent Professionals',
        icon: <FaBullseye className="tab-icon" />,
        image: targetAudienceImages.freelancers.path,
        imageAlt: targetAudienceImages.freelancers.alt,
        description:
        'Turn Instagram into a client-attracting tool. Connect with serious prospects, land high-value projects, and set premium rates that reflect your expertise.',
        benefits: [
        { icon: <FaChartLine />, text: 'Attract High-Value Clients' },
        { icon: <FaThumbsUp />, text: 'Showcase Your Professional Expertise' },
        { icon: <FaClock />, text: 'Generate Consistent Leads' }
        ]
    },
    {
        id: 'agencies',
        title: 'Digital Marketing Agencies',
        icon: <FaChartLine className="tab-icon" />,
        image: targetAudienceImages.marketingAgencies.path,
        imageAlt: targetAudienceImages.marketingAgencies.alt,
        description:
        'Deliver outstanding results for clients using clear, measurable strategies. Maximize ROI, position your agency as the go-to Instagram authority, and save hours of manual work.',
        benefits: [
        { icon: <FaChartLine />, text: 'Drive Measurable ROI' },
        { icon: <FaEye />, text: 'Strengthen Your Agency’s Authority' },
        { icon: <FaThumbsUp />, text: 'Improve Client Retention' }
        ]
    }
    ];


  // Find active tab data
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <section className="target-audience-section" id="target-audience">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetAudience;
