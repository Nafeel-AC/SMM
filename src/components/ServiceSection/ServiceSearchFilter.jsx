import React from 'react';
import './ServiceSection.css';

const ServiceSearchFilter = ({ categories, selectedCategory, onCategoryChange, searchQuery, onSearchChange }) => {
  return (
    <div className="service-filter py-4">
      <div className="row g-3">
        <div className="col-md-6">
          <div className="search-box">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search services..."
                value={searchQuery}
                onChange={onSearchChange}
              />
              {searchQuery && (
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => onSearchChange({ target: { value: '' } })}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="category-filter">
            <select 
              className="form-select"
              value={selectedCategory}
              onChange={onCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((category, idx) => (
                <option key={idx} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceSearchFilter;
