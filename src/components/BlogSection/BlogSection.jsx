import React, { useState, useEffect } from 'react';
import './BlogSection.css';
import { useBlog } from '../../contexts/BlogContext';
import BlogFilter from './BlogFilter';
import BlogList from './BlogList';


const BlogSection = () => {
  const { blogs, categories, loading, error } = useBlog();
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter blogs by category and search term
  useEffect(() => {
    if (!blogs) return;
    
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

  return (
    <>
      <section className="blog-section" id="blogs">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section-header text-center mb-50">
                <span className="section-subtitle">OUR BLOGS</span>
                <h3 className="section-title mx-auto">our news &amp; blogs</h3>
                <p className="cmn-para-text mx-auto mt-20">
                  Welcome to our dynamic world of insights and information! Our Blogs section is your gateway 
                  to staying informed, discovering industry trends, and gaining valuable knowledge to propel 
                  your business forward.
                </p>
              </div>
            </div>
          </div>

          <BlogFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <BlogList 
            blogs={filteredBlogs}
            loading={loading}
            error={error}
          />
          
          {filteredBlogs.length > 6 && (
            <div className="pagination-section">
              <nav>
                <ul className="pagination">
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li className="page-item active"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default BlogSection;
