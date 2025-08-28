import React from 'react';
import './BlogSection.css';
import { FaSearch } from 'react-icons/fa';

const BlogFilter = ({ categories, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm }) => {
  return (
    <div className="row mb-50">
      <div className="col-lg-8 col-md-7">
        <div className="category-filters">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="col-lg-4 col-md-5 mt-md-0 mt-4">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>
      </div>
    </div>
  );
};

export default BlogFilter;
