import React, { useState, useEffect } from 'react';
import ServiceTabs from './ServiceTabs';
import ServiceSearchFilter from './ServiceSearchFilter';
import ServiceList from './ServiceList';
import serviceData from '../../data/services.json';
import './ServiceSection.css';

const ServiceSection = () => {
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [expandedCategory, setExpandedCategory] = useState(null);
  
  // Initialize with the first platform selected
  useEffect(() => {
    if (serviceData.socialMedia.length > 0 && !selectedPlatform) {
      setSelectedPlatform(serviceData.socialMedia[0]);
    }
  }, []);

  // Filter services based on selected platform, category, and search query
  useEffect(() => {
    let filtered = [...serviceData.services];
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }
    
    // Group by category for display
    const groupedByCategory = {};
    filtered.forEach(service => {
      if (!groupedByCategory[service.category]) {
        groupedByCategory[service.category] = [];
      }
      groupedByCategory[service.category].push(service);
    });
    
    setFilteredServices(Object.entries(groupedByCategory).map(([category, services]) => ({
      category,
      services
    })));
    
    // Set the first category as expanded by default
    if (filtered.length > 0 && !expandedCategory) {
      setExpandedCategory(filtered[0].category);
    }
  }, [selectedPlatform, selectedCategory, searchQuery]);

  const handlePlatformChange = (platform) => {
    setSelectedPlatform(platform);
    setSelectedCategory('');
    setExpandedCategory(null);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleAccordion = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <section className="service-section" id="services">
      <div className="container">
        <div className="section-header text-center mb-5">
          <span className="section-subtitle">Our Services</span>
          <h2 className="section-title">Boost Your Social Media Presence</h2>
          <p className="section-description">
            We offer a wide range of social media marketing services to help you grow your online presence 
            and increase your engagement. Choose a platform to get started.
          </p>
        </div>
        
        <div className="row">
          <div className="col-12">
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <ServiceTabs 
                  platforms={serviceData.socialMedia} 
                  selectedPlatform={selectedPlatform}
                  onPlatformChange={handlePlatformChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="row">
          <div className="col">
            <ServiceSearchFilter 
              categories={serviceData.categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>
        
        <div className="row">
          <div className="col-12">
            <ServiceList 
              services={filteredServices}
              expandedCategory={expandedCategory}
              toggleAccordion={toggleAccordion}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
