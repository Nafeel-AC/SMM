import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchUserProfile, user } = useFirebaseAuth();

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('Missing session id');
      setLoading(false);
      return;
    }

    // After success, refresh profile and move to next step
    const finalize = async () => {
      try {
        if (user?.uid) {
          await fetchUserProfile(user.uid);
        }
        setLoading(false);
        navigate('/instagram-connect');
      } catch (e) {
        setError('Could not finalize payment.');
        setLoading(false);
      }
    };
    finalize();
  }, [searchParams, fetchUserProfile, user, navigate]);

  if (loading) {
    return <div className="loading">Processing your payment...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return <div>Payment successful. Redirecting...</div>;
};

export default PaymentSuccessPage;


