import React from 'react';
import Navbar from '../components/Navbar';
import BlogSection from '../components/BlogSection';
import { BlogProvider } from '../contexts/BlogContext';
import './BlogPage.css';

const BlogPage = () => {
  return (
    <>
      <Navbar />
      <div className="blog-page">
        <BlogProvider>
          <BlogSection />
        </BlogProvider>
      </div>
    </>
  );
};

export default BlogPage;
