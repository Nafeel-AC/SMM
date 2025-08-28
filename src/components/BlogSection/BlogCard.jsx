import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEye, FaCalendarAlt, FaArrowRight, FaTag } from 'react-icons/fa';
import './BlogCard.css';

// Default placeholder image in case the specified image doesn't exist
import placeholderImage from '../../assets/logo.png';

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="blog-card">
      <div className="blog-image">
        <Link to={`/blog/${blog.id}`}>
          <img 
            src={`/src/assets/${blog.image}`} 
            alt={blog.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = placeholderImage;
            }}
          />
        </Link>
        <span className="blog-category">
          <FaTag />
          {blog.category}
        </span>
      </div>
      <div className="blog-content">
        <div className="blog-meta">
          <div className="blog-author">
            <Link to={`/blog/author/${blog.author.toLowerCase().replace(/\s+/g, '-')}`}>
              <FaUser />
              <span>{blog.author}</span>
            </Link>
          </div>
          <div className="blog-date">
            <FaCalendarAlt />
            <span>{formatDate(blog.date)}</span>
          </div>
          <div className="blog-views">
            <FaEye />
            <span>{blog.views} Views</span>
          </div>
        </div>
        
        <h3 className="blog-title">
          <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
        </h3>
        
        <p className="blog-excerpt">
          {truncateText(blog.excerpt, 120)}
        </p>
        
        <Link to={`/blog/${blog.id}`} className="read-more">
          <span>Read Article</span>
          <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
