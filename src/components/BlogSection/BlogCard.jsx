import React, { useState } from 'react';
import './BlogCard.css';

// Import blog images
import blog1Image from '../../assets/blog-1.svg';
import blog2Image from '../../assets/blog-2.svg';
import blog3Image from '../../assets/blog-3.svg';
import blog4Image from '../../assets/blog-4.svg';
import blog5Image from '../../assets/blog-5.svg';
import blog6Image from '../../assets/blog-6.svg';

const blogImages = {
  'blog-1.svg': blog1Image,
  'blog-2.svg': blog2Image,
  'blog-3.svg': blog3Image,
  'blog-4.svg': blog4Image,
  'blog-5.svg': blog5Image,
  'blog-6.svg': blog6Image
};

const BlogCard = ({ blog }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

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
        <img src={blogImages[blog.image] || blog.image} alt={blog.title} />
        <div className="blog-category">{blog.category}</div>
      </div>
      
      <div className="blog-content">
        <div className="blog-meta">
          <span className="author">
            <i className="fas fa-user"></i>
            by {blog.author}
          </span>
          <span className="views">
            <i className="fas fa-eye"></i>
            {blog.views} Views
          </span>
          <span className="date">
            <i className="fas fa-calendar"></i>
            {formatDate(blog.date)}
          </span>
        </div>
        
        <h3 className="blog-title">{blog.title}</h3>
        
        <div className="blog-excerpt">
          {isExpanded ? (
            <p>{blog.excerpt}</p>
          ) : (
            <p>{truncateText(blog.excerpt)}</p>
          )}
        </div>
        
        <div className="blog-actions">
          <button 
            className="read-more-btn"
            onClick={toggleExpanded}
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
          
          <button className="share-btn">
            <i className="fas fa-share-alt"></i>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
