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
        <div className="reviews-grid">
          {/* Left Column: Introduction and Features */}
          <div className="reviews-intro">
            <div className="reviews-subtitle">TESTIMONIAL</div>
            <h2 className="reviews-title">What Our Clients Say</h2>
            <p className="reviews-description">
              Our clients praise our excellence, personalized approach, and exceptional results. They highlight our innovative solutions, responsiveness, and strategic thinking as key factors in their success.
            </p>
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
