import React, { useEffect } from "react";
import "./PrivacyPage.css";

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="privacy-page" style={{ maxWidth: 800, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <h1 style={{ textAlign: "center", marginBottom: 32 }}>Privacy Policy</h1>
      <p>At GlowUp Agency (“we”, “our”, or “us”), your privacy is very important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or use our marketing services (the “Service”).</p>
    <h2>1. Information We Collect</h2>
    <ul>
      <li><b>Personal Information:</b> such as your name, email address, phone number, and business details when you contact us or register for our services.</li>
      <li><b>Usage Data:</b> including your browser type, IP address, and how you interact with our website.</li>
      <li><b>Cookies and Tracking:</b> we use cookies to provide a better browsing experience and to analyze website performance.</li>
    </ul>
    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>Providing and delivering the services you request.</li>
      <li>Communicating with you regarding updates, offers, and customer support.</li>
      <li>Improving our website, marketing strategies, and overall client experience.</li>
      <li>Ensuring the security and proper functioning of our Service.</li>
    </ul>
    <h2>3. Sharing of Information</h2>
    <ul>
      <li>We do not sell, rent, or trade your personal data to third parties.</li>
      <li>We may share your information only with trusted service providers who help us operate our website or deliver services, and only when necessary.</li>
      <li>We may also disclose information if required by law or to protect our legal rights.</li>
    </ul>
    <h2>4. Data Protection</h2>
    <p>We use industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. However, no method of transmission over the internet is completely secure, so we cannot guarantee absolute security.</p>
    <h2>5. Your Rights</h2>
    <ul>
      <li>Request access to the personal data we hold about you.</li>
      <li>Ask us to correct or update your information.</li>
      <li>Request deletion of your personal data, subject to legal or contractual obligations.</li>
      <li>Opt out of receiving marketing communications at any time.</li>
    </ul>
    <h2>6. Changes to This Policy</h2>
    <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated “Last Modified” date. Continued use of our Service means you accept the updated policy.</p>
    <h2>7. Contact Us</h2>
    <p>If you have any questions about this Privacy Policy or how we handle your data, please contact us at:<br/>
      <b>support@glowupagency.com</b>
    </p>

    <hr style={{ margin: "40px 0" }} />
    <h1 style={{ textAlign: "center", marginBottom: 32 }}>Terms and Conditions</h1>
    <p>Welcome to GlowUp Agency. By accessing or using our website and services (“Service”), you agree to be bound by the following Terms and Conditions. Please read them carefully before using our Service.</p>
    <h2>1. Use of Service</h2>
    <ul>
      <li>Our services are intended for businesses and individuals seeking marketing and promotional support.</li>
      <li>You agree to use our services only for lawful purposes and in compliance with all applicable laws.</li>
    </ul>
    <h2>2. Account Registration</h2>
    <ul>
      <li>When you register with GlowUp Agency, you agree to provide accurate, current, and complete information.</li>
      <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
    </ul>
    <h2>3. Payments</h2>
    <ul>
      <li>All fees for our services must be paid in accordance with the chosen plan.</li>
      <li>Payments are non-transferable and subject to our Refund Policy.</li>
    </ul>
    <h2>4. Intellectual Property</h2>
    <ul>
      <li>All content, branding, strategies, and materials provided by GlowUp Agency remain the intellectual property of GlowUp Agency.</li>
      <li>You may not copy, reproduce, or distribute our materials without written consent.</li>
    </ul>
    <h2>5. Termination</h2>
    <ul>
      <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
    </ul>
    <h2>6. Changes to Terms</h2>
    <ul>
      <li>GlowUp Agency may update these Terms at any time. Continued use of our services indicates acceptance of any modifications.</li>
    </ul>

    <hr style={{ margin: "40px 0" }} />
    <h1 style={{ textAlign: "center", marginBottom: 32 }}>Refund Policy</h1>
    <p>At GlowUp Agency, we aim to provide high-quality marketing services to every client. However, we understand that circumstances may change, and we have created the following Refund Policy to ensure clarity:</p>
    <h2>1. Eligibility for Refunds</h2>
    <ul>
      <li>Refund requests must be submitted within 7 days of the initial purchase.</li>
      <li>Refunds apply only to services that have not yet been initiated or delivered.</li>
    </ul>
    <h2>2. Non-Refundable Services</h2>
    <ul>
      <li>Once a service or campaign has begun (such as strategy planning, ad setup, or content creation), it becomes non-refundable.</li>
      <li>Customized services tailored to a client’s business are also non-refundable due to the resources invested.</li>
    </ul>
    <h2>3. How to Request a Refund</h2>
    <ul>
      <li>To request a refund, you must contact our support team via email with your order details.</li>
      <li>Approved refunds will be processed within 10 business days to the original payment method.</li>
    </ul>

    <hr style={{ margin: "40px 0" }} />
    <h1 style={{ textAlign: "center", marginBottom: 32 }}>Cookie Policy</h1>
    <p>GlowUp Agency uses cookies to improve your experience on our website. This Cookie Policy explains how and why we use them.</p>
    <h2>1. What Are Cookies?</h2>
    <p>Cookies are small text files stored on your device that help us provide a smoother and more personalized browsing experience.</p>
    <h2>2. How We Use Cookies</h2>
    <ul>
      <li>To analyze website traffic and performance.</li>
      <li>To remember your preferences and improve user experience.</li>
      <li>To provide relevant marketing and advertising content.</li>
    </ul>
    <h2>3. Types of Cookies We Use</h2>
    <ul>
      <li><b>Essential Cookies:</b> Necessary for website functionality.</li>
      <li><b>Analytics Cookies:</b> Help us understand how visitors use our site.</li>
      <li><b>Marketing Cookies:</b> Allow us to deliver personalized advertisements.</li>
    </ul>
    <h2>4. Managing Cookies</h2>
    <ul>
      <li>You can choose to disable cookies through your browser settings at any time.</li>
      <li>Please note that disabling cookies may affect some website features.</li>
    </ul>
    <p>By continuing to use our website, you consent to our use of cookies in accordance with this policy.</p>
    </div>
  );
};

export default PrivacyPage;
