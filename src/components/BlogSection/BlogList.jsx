import React from 'react';
import BlogCard from './BlogCard';
import './BlogSection.css';

const BlogList = ({ blogs, loading, error }) => {
  if (loading) {
    return <div className="blog-loading">Loading blogs...</div>;
  }

  if (error) {
    return <div className="blog-error">{error}</div>;
  }

  if (blogs.length === 0) {
    return (
      <div className="no-results">
        <h3>No blogs found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="blog-grid-container">
      {blogs.map((blog) => (
        <div className="blog-grid-item" key={blog.id}>
          <BlogCard blog={blog} />
        </div>
      ))}
    </div>
  );
};

export default BlogList;
