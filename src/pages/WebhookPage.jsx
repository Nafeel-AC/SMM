import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const WebhookPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Processing webhook...');

  useEffect(() => {
    const handleWebhook = async () => {
      try {
        // Get webhook verification parameters
        const mode = searchParams.get('hub.mode');
        const token = searchParams.get('hub.verify_token');
        const challenge = searchParams.get('hub.challenge');

        console.log('Webhook verification:', { mode, token, challenge });

        // Verify the webhook
        if (mode === 'subscribe' && token === 'webhook_verify_token_12345') {
          setStatus('Webhook verified successfully!');
          // Return the challenge to complete verification
          return challenge;
        } else {
          setStatus('Webhook verification failed');
          return 'Verification failed';
        }
      } catch (error) {
        console.error('Webhook error:', error);
        setStatus('Webhook error occurred');
      }
    };

    handleWebhook();
  }, [searchParams]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Instagram Webhook Handler</h2>
      <p>{status}</p>
      <p>This endpoint handles Instagram webhook verification and events.</p>
    </div>
  );
};

export default WebhookPage;
