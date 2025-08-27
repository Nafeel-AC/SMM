import React from 'react';
import Navbar from '../components/Navbar';
import BlogSection from '../components/BlogSection';
import './BlogPage.css';

const BlogPage = () => {
  return (
    <>
      <Navbar />
      <div className="blog-page">
        <BlogSection />
      </div>
    </>
  );
};

export default BlogPage;
