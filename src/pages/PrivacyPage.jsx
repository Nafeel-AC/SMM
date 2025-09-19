import React from 'react';
import './PrivacyPage.css';

const PrivacyPage = () => {
  return (
    <div className="privacy-page">
      <div className="container">
        <h1>Privacy Policy</h1>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
        </section>

        <section>
          <h2>Instagram Data</h2>
          <p>When you connect your Instagram account, we collect:</p>
          <ul>
            <li>Your Instagram username and profile information</li>
            <li>Basic account metrics and insights</li>
            <li>Content performance data</li>
          </ul>
          <p>We only access data necessary to provide our services and do not store your Instagram password.</p>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our services</li>
            <li>Generate analytics and insights for your Instagram account</li>
            <li>Communicate with you about our services</li>
            <li>Ensure the security of our platform</li>
          </ul>
        </section>

        <section>
          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        </section>

        <section>
          <h2>Data Deletion</h2>
          <p>You can request deletion of your data at any time by contacting us at gagadroebit@gmail.com. We will delete your data within 30 days of your request.</p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at gagadroebit@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;