import React, { useState, useEffect } from 'react';
import './ServicesPage.css';
import serviceData from '../data/services.json';

const ServicesPage = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  // Initialize with the first platform selected
  useEffect(() => {
    if (serviceData.socialMedia.length > 0 && !selectedPlatform) {
      setSelectedPlatform(serviceData.socialMedia[0]);
    }
  }, [selectedPlatform]);

  // Filter services based on selection and search
  useEffect(() => {
    let filtered = serviceData.services || [];
    
    // Filter by platform categories if a platform is selected
    if (selectedPlatform && selectedPlatform.categories) {
      filtered = filtered.filter(service => 
        selectedPlatform.categories.some(category => 
          service.category.includes(category) || 
          service.name.toLowerCase().includes(selectedPlatform.name.toLowerCase())
        )
      );
    }
    
    // Filter by selected category
    if (selectedCategory) {
      filtered = filtered.filter(service => 
        service.category === selectedCategory
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredServices(filtered);
  }, [selectedPlatform, selectedCategory, searchQuery]);

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Our Services</h1>
            <p className="hero-subtitle">
              Comprehensive social media marketing solutions to boost your online presence
            </p>
          </div>
        </div>
      </section>

      {/* Platform Selection */}
      <section className="platforms-section">
        <div className="container">
          <h2 className="section-title">Choose Your Platform</h2>
          <div className="platform-tabs">
            {serviceData.socialMedia.map((platform) => (
              <button
                key={platform.id}
                className={`platform-tab ${selectedPlatform?.id === platform.id ? 'active' : ''}`}
                onClick={() => setSelectedPlatform(platform)}
              >
                <div className="platform-icon">
                  <i className={`fab fa-${platform.name.toLowerCase()}`}></i>
                </div>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="search-section">
        <div className="container">
          <div className="search-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>
            
            <div className="category-filter">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                <option value="">All Categories</option>
                {serviceData.categories?.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Services Display */}
      <section className="services-display">
        <div className="container">
          {filteredServices.length > 0 ? (
            <div className="services-grid">
              {filteredServices.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-header">
                    <h3 className="service-name">{service.name}</h3>
                    <div className="service-price">
                      <span className="price-amount">${service.price}</span>
                      <span className="price-unit">/1000</span>
                    </div>
                  </div>
                  
                  <p className="service-description">{service.description}</p>
                  
                  <div className="service-features">
                    <div className="feature">
                      <i className="fas fa-clock"></i>
                      <span>Min: {service.min}</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-rocket"></i>
                      <span>Max: {service.max}</span>
                    </div>
                    <div className="feature">
                      <i className="fas fa-tag"></i>
                      <span>{service.category}</span>
                    </div>
                  </div>
                  
                  <button className="order-btn">
                    <i className="fas fa-shopping-cart"></i>
                    Order Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-services">
              <i className="fas fa-search"></i>
              <h3>No services found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Choose your platform and start growing your social media presence today</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
