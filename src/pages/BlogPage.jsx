import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import BlogSection from '../components/BlogSection';
import { BlogProvider } from '../contexts/BlogContext';
import './BlogPage.css';

const BlogPage = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Blog - Social Media Marketing Insights | Glowup Agency';
  }, []);

  return (
    <>
      <Navbar />
      <div className="blog-page">
        {/* Blog Hero Section */}
        <section className="blog-hero-section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <div className="blog-hero-content">
                  {/* Breadcrumb */}
                  <nav className="breadcrumb-nav">
                    <span className="breadcrumb-item">Home</span>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-item active">Blog</span>
                  </nav>
                  
                  <span className="blog-hero-subtitle">INSIGHTS & KNOWLEDGE</span>
                  <h1 className="blog-hero-title">
                    Our Latest <span className="highlight">Blogs & Articles</span>
                  </h1>
                  <p className="blog-hero-description">
                    Stay ahead of the curve with our expert insights, industry trends, and actionable strategies 
                    to boost your social media presence and grow your business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Content Section */}
        <BlogProvider>
          <BlogSection hideHeader={true} />
        </BlogProvider>
      </div>
    </>
  );
};

export default BlogPage;
