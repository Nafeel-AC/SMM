import React from 'react';
import './WhyChooseUs.css';
import teamImage from '../../assets/team-image.jpg';

const WhyChooseUs = () => {
  const features = [
    {
      id: 1,
      icon: "fas fa-users",
      title: "Professional Team",
      description: "Our professional team is the backbone of our success. Comprising seasoned experts in their respective fields, we bring a wealth of knowledge and experience to every project."
    },
    {
      id: 2,
      icon: "fas fa-briefcase",
      title: "Experience",
      description: "Our legacy is built on a foundation of experience. With a proven track record and a portfolio of successful projects, Glowup Agency stands as a testament to our commitment to excellence."
    },
    {
      id: 3,
      icon: "fas fa-trophy",
      title: "Success Guaranteed",
      description: "Success is not just a goal; it's a commitment we make to every client. At Glowup Agency, we stand by our promise to deliver measurable and impactful results."
    },
    {
      id: 4,
      icon: "fas fa-chart-line",
      title: "Data-Driven Approach",
      description: "In a digital age, decisions without data are mere guesses. At Glowup Agency, we pride ourselves on our data-driven approach. Every strategy is backed by comprehensive analytics and insights."
    }
  ];

  return (
    <section className="why-choose-us" id="why-choose-us">
      <div className="container">
        <div className="row g-5 align-items-center">
          {/* Left Column - Image */}
          <div className="col-lg-6">
            <div className="image-section">
              <div className="main-image">
                <img src={teamImage} alt="Professional Team" />
              </div>
              <div className="secondary-image">
                <img src={teamImage} alt="Team Collaboration" />
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="col-lg-6">
            <div className="content-section">
              <div className="section-header">
                <h6 className="section-subtitle">WHY CHOOSE US</h6>
                <h2 className="section-title">
                  Elevating Your Experience, Amplifying Your Success
                </h2>
                <p className="section-description">
                  At Glowup Agency, we recognize that selecting a partner for your business needs is a significant decision. Here's why choosing us is not just a choice but an investment in a dynamic and impactful collaboration.
                </p>
              </div>

              <div className="features-grid">
                {features.map((feature) => (
                  <div className="feature-item" key={feature.id}>
                    <div className="feature-icon">
                      <i className={feature.icon}></i>
                    </div>
                    <div className="feature-content">
                      <h4 className="feature-title">{feature.title}:</h4>
                      <p className="feature-description">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
