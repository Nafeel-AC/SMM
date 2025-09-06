import React from 'react';
import './ClientReviews.css';

const ClientReviews = () => {
  const testimonials = [
    {
      id: 1,
      name: "Gregg Lomas",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      review: "Service is really easy to use. They understand your target market and I saw growth and engagement immediately."
    },
    {
      id: 2,
      name: "Veronika Bargaric",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      review: "I'm really impressed! Especially with the fact that it wasn't all fake users adding me up! Hope to work with ya'll more!"
    }
  ];

  const features = [
    "Real, Organic and Engaged Instagram Followers",
    "24/7 Live Chat and Phone Support in UK & US",
    "100% No-risk, all plans include our Instagram Growth Guarantee!"
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
    }

    return stars;
  };

  return (
    <section className="client-reviews" id="reviews">
      <div className="container">
        <div className="reviews-grid">
          {/* Left Column: Introduction and Features */}
          <div className="reviews-intro">
            <div className="reviews-subtitle">REVIEWS</div>
            <h2 className="reviews-title">What do our customers say?</h2>
            <p className="reviews-description">
              Glowup Agency helps 3,000+ active customers to build their audience servicing customers in over 140 countries in a variety of industries from individuals to Fortune 500 companies, and everything inbetween!
            </p>
            
            <div className="features-list">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <i className="fas fa-check checkmark-icon"></i>
                  <span className="feature-text">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Customer Testimonials */}
          <div className="testimonials-column">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="testimonial-card">
                <div className="testimonial-header">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="profile-image"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name}&background=8b5cf6&color=fff&size=100`;
                    }}
                  />
                  <div className="testimonial-info">
                    <h3 className="customer-name">{testimonial.name}</h3>
                    <div className="star-rating">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                </div>
                <p className="testimonial-text">{testimonial.review}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientReviews;
