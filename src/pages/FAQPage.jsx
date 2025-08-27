import React, { useState } from 'react';
import './FAQPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqData = [
    {
      question: "What services does your SMM website offer?",
      answer: "We provide a comprehensive range of social media marketing services, including strategy development, content creation, platform management, advertising campaigns, and analytics. Explore our Services Page for a detailed overview."
    },
    {
      question: "How can I get started with your SMM services?",
      answer: "Getting started is simple! Visit our Get Started page, fill out the form, and our team will reach out to you promptly to discuss your goals and tailor a strategy to meet your specific needs."
    },
    {
      question: "What social media platforms do you specialize in?",
      answer: "Our expertise spans across major social media platforms, including but not limited to Facebook, Instagram, Twitter, LinkedIn, and Pinterest. We tailor our strategies to align with the unique dynamics of each platform."
    },
    {
      question: "How do you create content for social media?",
      answer: "Our content creation process involves understanding your brand, target audience, and goals. We craft engaging and shareable content, including images, videos, and captions, to enhance your brand presence and engagement."
    },
    {
      question: "Can I track the performance of my social media campaigns?",
      answer: "Absolutely. We provide detailed analytics reports that track the performance of your social media campaigns. These reports include metrics such as reach, engagement, conversion rates, and more, giving you valuable insights into the effectiveness of your strategies."
    },
    {
      question: "Is my information secure when using your services?",
      answer: "Yes, we prioritize the security and confidentiality of your information. Our website and services incorporate industry-standard security measures to protect your data."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <div className="faq-page">
      <Navbar />
      
      {/* Main FAQ Section */}
      <section className="faq-main-section">
        <div className="container">
          <div className="faq-two-column">
            {/* Left Column: Content */}
            <div className="faq-content-column">
              <div className="faq-badge">FAQS</div>
              <h1 className="faq-title">Any Questions?<br />We Have Answers!</h1>
              <p className="faq-description">
                SocialSprint is a cutting-edge communication platform designed to streamline conversations for individuals and businesses. 
                It offers a range of features to enhance collaboration and connectivity.
              </p>
              <button className="contact-btn">Contact Us</button>
            </div>

            {/* Right Column: FAQ Accordion */}
            <div className="faq-accordion-column">
              <div className="faq-list">
                {faqData.map((faq, index) => (
                  <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                    <div className="faq-header" onClick={() => toggleFAQ(index)}>
                      <h3 className="faq-question">{faq.question}</h3>
                      <button className="faq-toggle">
                        {activeIndex === index ? (
                          <i className="fas fa-minus"></i>
                        ) : (
                          <i className="fas fa-plus"></i>
                        )}
                      </button>
                    </div>
                    <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;
