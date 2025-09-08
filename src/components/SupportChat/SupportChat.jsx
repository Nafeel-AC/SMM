import React, { useState, useEffect } from 'react';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG, validateEmailJSConfig } from '../../lib/emailjs';
import './SupportChat.css';

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailData, setEmailData] = useState({
    title: '',
    body: ''
  });
  const { user, profile } = useFirebaseAuth();

  // Initialize EmailJS
  useEffect(() => {
    if (validateEmailJSConfig()) {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
      console.log('EmailJS initialized for SupportChat');
    } else {
      console.warn('EmailJS not configured for SupportChat');
    }
  }, []);

  const handleEmailInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailData.title.trim() || !emailData.body.trim()) return;

    try {
      setLoading(true);
      setError('');

      // Validate EmailJS configuration
      if (!validateEmailJSConfig()) {
        throw new Error('EmailJS is not properly configured. Please try again later.');
      }

      // Prepare template parameters with userId attached
      const templateParams = {
        from_name: profile?.full_name || user.displayName || 'Support User',
        from_email: user.email,
        subject: `Support Query: ${emailData.title}`,
        message: `${emailData.body}\n\n--- User Details ---\nUser ID: ${user.uid}\nEmail: ${user.email}\nName: ${profile?.full_name || user.displayName || 'N/A'}\nSent at: ${new Date().toLocaleString()}`,
        reply_to: user.email,
        to_name: 'SMM Support Team',
        user_id: user.uid,
        sent_at: new Date().toLocaleString(),
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );

      console.log('Support email sent successfully:', result);

      // Also save to Firestore for internal tracking
      const messagesRef = collection(db, 'support_chats');
      await addDoc(messagesRef, {
        user_id: user.uid,
        message: `📧 Email sent: ${emailData.title} - ${emailData.body.substring(0, 100)}...`,
        sent_by: 'user',
        sent_at: serverTimestamp(),
        user_name: profile?.full_name || user.displayName || 'User',
        email_sent: true,
        email_title: emailData.title,
        email_body: emailData.body
      });

      // Reset form
      setEmailData({ title: '', body: '' });

      // Show success message
      alert('Your support query has been sent successfully! We\'ll get back to you soon.');

    } catch (error) {
      console.error('Error sending support email:', error);

      let errorMessage = 'Failed to send your query. Please try again.';

      if (error.message && error.message.includes('EmailJS')) {
        errorMessage = 'Email service is not configured. Please try again later.';
      } else if (error.text) {
        errorMessage = `Failed to send: ${error.text}`;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="support-chat-toggle">
        <button 
          className="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          title="Open Support Chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" fill="currentColor"/>
          </svg>
          <span>Support</span>
        </button>
      </div>
    );
  }

  return (
    <div className="support-chat">
      <div className="chat-header">
        <div className="chat-title">
          <h3>Email Support</h3>
          <p>Send us your query and we'll get back to you!</p>
        </div>
        <div className="chat-controls">
          <button
            className="close-btn"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>
      </div>

      <div className="email-form-container">
        <div className="email-form-header">
          <h4>Send Support Query</h4>
          <p>We'll get back to you via email within 24 hours</p>
        </div>

        {error && (
          <div className="chat-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSendEmail} className="email-form">
          <div className="input-group">
            <label htmlFor="email-title">Subject/Title</label>
            <input
              id="email-title"
              name="title"
              type="text"
              value={emailData.title}
              onChange={handleEmailInputChange}
              placeholder="Brief description of your issue"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email-body">Message</label>
            <textarea
              id="email-body"
              name="body"
              value={emailData.body}
              onChange={handleEmailInputChange}
              placeholder="Please describe your query in detail..."
              rows="6"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !emailData.title.trim() || !emailData.body.trim()}
            className="send-email-btn"
          >
            {loading ? (
              <>
                <div className="spinner small"></div>
                Sending...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '8px'}}>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor"/>
                </svg>
                Send Query
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportChat;
