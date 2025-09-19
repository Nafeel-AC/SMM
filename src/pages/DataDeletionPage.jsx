import React from 'react';
import './DataDeletionPage.css';

const DataDeletionPage = () => {
  return (
    <div className="data-deletion-page">
      <div className="container">
        <h1>Data Deletion Instructions</h1>
        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2>How to Request Data Deletion</h2>
          <p>You can request deletion of your personal data at any time by following these steps:</p>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Contact Us</h3>
                <p>Send an email to <strong>gagadroebit@gmail.com</strong> with the subject "Data Deletion Request"</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Provide Account Information</h3>
                <p>Include your registered email address and any other account identifiers to help us locate your data</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Verification</h3>
                <p>We may ask you to verify your identity to ensure the security of your account</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Confirmation</h3>
                <p>We will confirm receipt of your request and provide an estimated timeline for completion</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2>What Data We Delete</h2>
          <p>When you request data deletion, we will remove:</p>
          <ul>
            <li>Your account information and profile data</li>
            <li>Instagram account connections and access tokens</li>
            <li>Analytics data and insights associated with your account</li>
            <li>Any other personal information we have collected</li>
          </ul>
        </section>

        <section>
          <h2>Timeline</h2>
          <p>We will process your data deletion request within <strong>30 days</strong> of receiving your verified request.</p>
        </section>

        <section>
          <h2>Data Retention</h2>
          <p>Some data may be retained for legal or regulatory purposes, but will not be used for service provision or marketing.</p>
        </section>

        <section>
          <h2>Alternative Methods</h2>
          <p>You can also:</p>
          <ul>
            <li>Disconnect your Instagram account from our service through your dashboard</li>
            <li>Delete your account directly from your profile settings</li>
            <li>Contact us through our support system</li>
          </ul>
        </section>

        <section>
          <h2>Questions?</h2>
          <p>If you have any questions about data deletion or our privacy practices, please contact us at <strong>gagadroebit@gmail.com</strong></p>
        </section>
      </div>
    </div>
  );
};

export default DataDeletionPage;
