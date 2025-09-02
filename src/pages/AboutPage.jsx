import React, { useState } from 'react';
import './AboutPage.css';
import Navbar from '../components/Navbar';


const AboutPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="about-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">About Us</h1>
            <h2 className="hero-subtitle">Glowup Agency Redefining Social Media Excellence</h2>
            <p className="hero-description">
              At Glowup Agency, we're not just a social media marketing agency — we're your partners in digital success. 
              Established with a passion for propelling businesses to new heights through strategic online presence, 
              we bring a unique blend of creativity, innovation, and expertise to every project.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <h3 className="feature-title">Strategic Brilliance</h3>
              <p className="feature-description">
                We don't just create content; we craft strategies. Our team of experts meticulously plans every campaign, 
                ensuring that your brand's message resonates with your target audience.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="feature-title">Time Efficiency</h3>
              <p className="feature-description">
                In the fast-paced world of social media, timing is everything. Our streamlined processes and agile approach 
                guarantee timely delivery without compromising on quality.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-tasks"></i>
              </div>
              <h3 className="feature-title">Save Your Time</h3>
              <p className="feature-description">
                Organize your to-do list with ease. Create, edit, and prioritize tasks to ensure nothing falls through the cracks.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chess"></i>
              </div>
              <h3 className="feature-title">Best Strategy</h3>
              <p className="feature-description">
                Craft your success with the best strategy tailored to your goals.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-dollar-sign"></i>
              </div>
              <h3 className="feature-title">Affordable Price For You</h3>
              <p className="feature-description">
                Get the best value with affordable prices tailored just for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="about-faq">
        <div className="container">
          <div className="faq-header">
            <h2 className="faq-title">Any questions? We have answers!</h2>
            <p className="faq-subtitle">
              SocialSprint is a cutting-edge communication platform designed to streamline conversations for individuals and businesses. 
              It offers a range of features to enhance collaboration and connectivity.
            </p>
          </div>

          <div className="faq-grid">
            <div className={`faq-item ${openFaq === 0 ? 'active' : ''}`} onClick={() => toggleFaq(0)}>
              <div className="faq-item-header">
                <h3 className="faq-question">What services does your SMM website offer?</h3>
                <div className="faq-toggle">
                  <i className={`fas fa-${openFaq === 0 ? 'minus' : 'plus'}`}></i>
                </div>
              </div>
              <div className={`faq-answer ${openFaq === 0 ? 'show' : ''}`}>
                <p>
                  We provide a comprehensive range of social media marketing services, including strategy development, 
                  content creation, platform management, advertising campaigns, and analytics. Explore our Services Page for a detailed overview.
                </p>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 1 ? 'active' : ''}`} onClick={() => toggleFaq(1)}>
              <div className="faq-item-header">
                <h3 className="faq-question">How can I get started with your SMM services?</h3>
                <div className="faq-toggle">
                  <i className={`fas fa-${openFaq === 1 ? 'minus' : 'plus'}`}></i>
                </div>
              </div>
              <div className={`faq-answer ${openFaq === 1 ? 'show' : ''}`}>
                <p>
                  Getting started is simple! Visit our Get Started page, fill out the form, and our team will reach out to you 
                  promptly to discuss your goals and tailor a strategy to meet your specific needs.
                </p>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 2 ? 'active' : ''}`} onClick={() => toggleFaq(2)}>
              <div className="faq-item-header">
                <h3 className="faq-question">What social media platforms do you specialize in?</h3>
                <div className="faq-toggle">
                  <i className={`fas fa-${openFaq === 2 ? 'minus' : 'plus'}`}></i>
                </div>
              </div>
              <div className={`faq-answer ${openFaq === 2 ? 'show' : ''}`}>
                <p>
                  Our expertise spans across major social media platforms, including but not limited to Facebook, Instagram, 
                  Twitter, LinkedIn, and Pinterest. We tailor our strategies to align with the unique dynamics of each platform.
                </p>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 3 ? 'active' : ''}`} onClick={() => toggleFaq(3)}>
              <div className="faq-item-header">
                <h3 className="faq-question">How do you create content for social media?</h3>
                <div className="faq-toggle">
                  <i className={`fas fa-${openFaq === 3 ? 'minus' : 'plus'}`}></i>
                </div>
              </div>
              <div className={`faq-answer ${openFaq === 3 ? 'show' : ''}`}>
                <p>
                  Our content creation process involves understanding your brand, target audience, and goals. We craft engaging 
                  and shareable content, including images, videos, and captions, to enhance your brand presence and engagement.
                </p>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 4 ? 'active' : ''}`} onClick={() => toggleFaq(4)}>
              <div className="faq-item-header">
                <h3 className="faq-question">Can I track the performance of my social media campaigns?</h3>
                <div className="faq-toggle">
                  <i className={`fas fa-${openFaq === 4 ? 'minus' : 'plus'}`}></i>
                </div>
              </div>
              <div className={`faq-answer ${openFaq === 4 ? 'show' : ''}`}>
                <p>
                  Absolutely. We provide detailed analytics reports that track the performance of your social media campaigns. 
                  These reports include metrics such as reach, engagement, conversion rates, and more, giving you valuable 
                  insights into the effectiveness of your strategies.
                </p>
              </div>
            </div>

            <div className={`faq-item ${openFaq === 5 ? 'active' : ''}`} onClick={() => toggleFaq(5)}>
              <div className="faq-item-header">
                <h3 className="faq-question">Is my information secure when using your services?</h3>
                <div className="faq-toggle">
                  <i className={`fas fa-${openFaq === 5 ? 'minus' : 'plus'}`}></i>
                </div>
              </div>
              <div className={`faq-answer ${openFaq === 5 ? 'show' : ''}`}>
                <p>
                  Yes, we prioritize the security and confidentiality of your information. Our website and services incorporate 
                  industry-standard security measures to protect your data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="about-testimonials">
        <div className="container">
          <div className="testimonials-header">
            <h2 className="testimonials-title">What Our Clients Say</h2>
            <p className="testimonials-subtitle">
              Our clients praise our excellence, personalized approach, and exceptional results. They highlight our innovative 
              solutions, responsiveness, and strategic thinking as key factors in their success.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  I like this panel, I actually face a problem with my first try but support was there, and they help me to fix 
                  that problem then I tried YouTube views and it's one of the best.
                </p>
                <div className="testimonial-author">
                  <h4 className="author-name">Crol Mickey</h4>
                  <p className="author-location">Sydney, Australia</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  I ordered Facebook page likes & IG followers, I received good quality followers highly recommended, 
                  and I'll definitely order again Thank you.
                </p>
                <div className="testimonial-author">
                  <h4 className="author-name">Jim Morison</h4>
                  <p className="author-location">London, UK</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  Well, I was testing the Instagram followers service and works really well! Takes about 5-10 minutes to start 
                  and complete the followers super fast! So, I like the service.
                </p>
                <div className="testimonial-author">
                  <h4 className="author-name">Tom Haris</h4>
                  <p className="author-location">New York, USA</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  I'm thrilled to hear that Binary SMM has been such a positive experience for you with its excellent prices, 
                  user-friendly interface, and consistent updates—keep enjoying the benefits!
                </p>
                <div className="testimonial-author">
                  <h4 className="author-name">Alex Cruis</h4>
                  <p className="author-location">Dublin, Ireland</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">
                  Used this service for a week and made 15 orders of different services. There was a pause in supplying likes, 
                  but eventually everything was delivered at full.
                </p>
                <div className="testimonial-author">
                  <h4 className="author-name">Akihisa Daisuke</h4>
                  <p className="author-location">Tokyo, Japan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;

