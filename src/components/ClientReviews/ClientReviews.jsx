import React from 'react';
import './ClientReviews.css';

const ClientReviews = () => {
  const testimonials = [
    {
      id: 1,
      name: "Gregg Lomas",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      review: "The platform is incredibly user-friendly and their team truly understands our target market. We experienced significant growth and engagement within the first week of implementation."
    },
    {
      id: 2,
      name: "Veronika Bargaric",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      review: "I'm thoroughly impressed with the quality of service. The authentic engagement and genuine followers we received exceeded our expectations. We look forward to continuing our partnership."
    },
    {
      id: 3,
      name: "Sarah Chen",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      review: "GlowUp Agency transformed our social media presence completely. The growth has been organic and sustainable. Our engagement rates increased by 300% in just two months!"
    },
    {
      id: 4,
      name: "Marcus Johnson",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      review: "Outstanding service! The team's strategic approach and attention to detail helped us reach our target audience effectively. Highly recommend for any business looking to grow their Instagram presence."
    },
    {
      id: 5,
      name: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      review: "Absolutely phenomenal results! Our Instagram following grew from 2K to 50K in just 3 months. The team's expertise in social media marketing is unmatched. Worth every penny!"
    },
    {
      id: 6,
      name: "David Kim",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      review: "Professional, reliable, and results-driven. GlowUp Agency helped us establish a strong online presence that directly translated to increased sales. The ROI has been incredible!"
    }
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
        {/* Header Section */}
        <div className="reviews-header">
          <div className="reviews-subtitle">TESTIMONIAL</div>
          <h2 className="reviews-title">What Our Clients Are Saying</h2>
          <p className="reviews-description">
            GlowUp Agency supports over 4,500 active clients worldwide, helping them grow their audience across more than 120 countries. From solo creators to Fortune 500 companies, we empower businesses and individuals in every industry!
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
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
    </section>
  );
};

export default ClientReviews;
