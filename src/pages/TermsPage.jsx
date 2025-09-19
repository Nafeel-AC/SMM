import React from 'react';
import './TermsPage.css';

const TermsPage = () => {
  return (
    <div className="terms-page">
      <div className="container">
        <h1>Terms of Service</h1>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>Acceptance of Terms</h2>
          <p>By accessing and using our service, you accept and agree to be bound by the terms and provision of this agreement.</p>
        </section>

        <section>
          <h2>Description of Service</h2>
          <p>Our service provides Instagram analytics and social media management tools to help you grow your Instagram presence.</p>
        </section>

        <section>
          <h2>User Responsibilities</h2>
          <p>You agree to:</p>
          <ul>
            <li>Provide accurate and complete information when creating your account</li>
            <li>Use the service only for lawful purposes</li>
            <li>Not attempt to gain unauthorized access to our systems</li>
            <li>Comply with Instagram's Terms of Service when using our platform</li>
          </ul>
        </section>

        <section>
          <h2>Instagram Integration</h2>
          <p>When you connect your Instagram account:</p>
          <ul>
            <li>You grant us permission to access your Instagram data as necessary to provide our services</li>
            <li>You represent that you have the right to grant such permission</li>
            <li>You understand that we will only access data required for our services</li>
          </ul>
        </section>

        <section>
          <h2>Data Usage</h2>
          <p>We use your Instagram data solely to provide analytics and insights. We do not:</p>
          <ul>
            <li>Share your data with third parties without your consent</li>
            <li>Use your data for purposes other than providing our services</li>
            <li>Store your Instagram password or login credentials</li>
          </ul>
        </section>

        <section>
          <h2>Service Availability</h2>
          <p>We strive to maintain high service availability but do not guarantee uninterrupted access. We may temporarily suspend the service for maintenance or updates.</p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>Our service is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of our service.</p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>We may terminate or suspend your account at any time for violation of these terms. You may also terminate your account at any time.</p>
        </section>

        <section>
          <h2>Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through our service.</p>
        </section>

        <section>
          <h2>Contact Information</h2>
          <p>If you have any questions about these Terms of Service, please contact us at gagadroebit@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
