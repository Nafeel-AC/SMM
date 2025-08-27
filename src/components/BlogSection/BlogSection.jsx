import React, { useState, useEffect } from 'react';
import './BlogSection.css';
import blogData from './data.json';
import BlogCard from './BlogCard';

const BlogSection = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setBlogs(blogData.blogs);
    setFilteredBlogs(blogData.blogs);
  }, []);

  // Get unique categories
  const categories = ['All', ...new Set(blogs.map(blog => blog.category))];

  // Filter blogs by category and search term
  useEffect(() => {
    let filtered = blogs;
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBlogs(filtered);
  }, [selectedCategory, searchTerm, blogs]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <section className="blog-section" id="blogs">
      <div className="container">
        <div className="section-heading text-center">
          <h6 className="section-subtitle">{blogData.sectionTitle}</h6>
          <h2 className="section-title">{blogData.mainTitle}</h2>
          <p className="section-description">{blogData.description}</p>
        </div>

        {/* Search and Filter Controls */}
        <div className="blog-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <div className="category-filters">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid">
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))
          ) : (
            <div className="no-results">
              <h3>No blogs found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredBlogs.length > 0 && (
          <div className="text-center mt-5">
            <button className="load-more-btn">
              Load More Blogs
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
