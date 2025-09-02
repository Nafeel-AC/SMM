import React, { useState } from 'react';
import './FAQSection.css';

const FAQSection = () => {
  const [activeAccordion, setActiveAccordion] = useState(0);

  const faqData = [
    {
      id: 1,
      question: "What social media platforms do you support?",
      answer: "We support all major social media platforms including Instagram, Facebook, Twitter, LinkedIn, TikTok, YouTube, and Pinterest. Our services are tailored to each platform's unique requirements and best practices."
    },
    {
      id: 2,
      question: "How quickly will I see results?",
      answer: "Results vary depending on your current following, content quality, and engagement strategy. Most clients see noticeable improvements within 2-4 weeks, with significant growth typically occurring within 2-3 months of consistent implementation."
    },
    {
      id: 3,
      question: "Is it safe to use your services?",
      answer: "Absolutely! We use 100% authentic engagement methods that comply with all platform guidelines. We never use bots, fake accounts, or any practices that could jeopardize your account's safety and reputation."
    },
    {
      id: 4,
      question: "What's included in your pricing plans?",
      answer: "Our plans include content strategy development, hashtag research, engagement optimization, analytics reporting, and dedicated account management. Higher-tier plans also include content creation, influencer outreach, and advanced automation tools."
    },
    {
      id: 5,
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. We offer flexible month-to-month plans with no long-term contracts. If you cancel, you'll continue to have access to our services until the end of your current billing cycle."
    },
    {
      id: 6,
      question: "Do you provide content creation services?",
      answer: "Yes! Our premium plans include professional content creation services. This includes custom graphics, video editing, copywriting, and content calendar planning tailored to your brand's voice and aesthetic."
    },
    {
      id: 7,
      question: "How do you ensure my brand's authenticity?",
      answer: "We work closely with you to understand your brand voice, values, and target audience. All our strategies are customized to maintain your authentic brand identity while optimizing for growth and engagement."
    },
    {
      id: 8,
      question: "What kind of support do you offer?",
      answer: "We provide 24/7 customer support through multiple channels including live chat, email, and phone. Our dedicated account managers are always available to help you optimize your social media strategy and answer any questions."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? -1 : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">FAQ</span>
          <h2 className="section-title">
            Frequently Asked <span className="highlight">Questions</span>
          </h2>
          <p className="section-description">
            Get answers to the most common questions about our social media marketing services
          </p>
        </div>

        <div className="faq-content">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="accordion-container">
                {faqData.map((faq, index) => (
                  <div key={faq.id} className={`accordion-item ${activeAccordion === index ? 'active' : ''}`}>
                    <div 
                      className="accordion-header"
                      onClick={() => toggleAccordion(index)}
                    >
                      <h3 className="accordion-title">{faq.question}</h3>
                      <div className="accordion-icon">
                        <i className={`fas ${activeAccordion === index ? 'fa-minus' : 'fa-plus'}`}></i>
                      </div>
                    </div>
                    <div className={`accordion-content ${activeAccordion === index ? 'active' : ''}`}>
                      <div className="accordion-body">
                        <p>{faq.answer}</p>
                      </div>
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

export default FAQSection;
