import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import './RequirementsFormPage.css';

const RequirementsFormPage = () => {
  const [formData, setFormData] = useState({
    niche: '',
    location: '',
    comments: '',
    dms: '',
    max_following: '',
    hashtags: '',
    account_targets: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Removed artificial per-call timeouts to allow long-running requests during debugging

  useEffect(() => {
    // Guard: don't query until we have a user
    if (!user?.id) return;
    checkExistingRequirements();
    
    // Cleanup function to clear any pending timeouts
    return () => {
      // This will be called when component unmounts
    };
  }, [user?.id]);

  const checkExistingRequirements = async () => {
    try {
      console.log('🔍 Checking for existing requirements on page load...');
      console.log('👤 User ID for check:', user?.id);
      if (!user?.id) {
        console.warn('⚠️ No user found, skipping requirements check');
        return;
      }
      
      const { data, error } = await supabase
        .from('user_requirements')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('🔍 Existing requirements check result:', { data, error });

      if (data && !error) {
        console.log('📝 Loading existing requirements into form');
        setFormData({
          niche: data.niche || '',
          location: data.location || '',
          comments: data.comments || '',
          dms: data.dms || '',
          max_following: data.max_following || '',
          hashtags: data.hashtags || '',
          account_targets: data.account_targets || ''
        });
      } else {
        console.log('📝 No existing requirements found, using empty form');
      }
    } catch (error) {
      console.warn('❌ Error checking existing requirements:', error);
      // Continue with empty form - don't block the user
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Requirements form submitted');
    console.log('📝 Form data:', formData);
    console.log('👤 User ID:', user?.id);
    console.log('🌐 Online status:', navigator.onLine ? 'online' : 'offline');
    console.time('⏱️ handleSubmit total');
    
    if (!user?.id) {
      setError('You must be logged in to submit requirements. Please log in and try again.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Removed overall submission timeout for debugging
    const timeoutId = null;

    // Build and log payload BEFORE any DB call so we always see it
    const requirementsPayload = {
      niche: formData.niche || null,
      location: formData.location || null,
      comments: formData.comments !== '' && formData.comments !== null ? String(formData.comments) : null,
      dms: formData.dms !== '' && formData.dms !== null ? String(formData.dms) : null,
      max_following: formData.max_following !== '' && formData.max_following !== null ? parseInt(formData.max_following, 10) : null,
      hashtags: formData.hashtags || null,
      account_targets: formData.account_targets || null
    };
    console.log('🧾 Normalized payload (pre-DB):', requirementsPayload);
    console.log('🔎 Payload types (pre-DB):', {
      niche: typeof requirementsPayload.niche,
      location: typeof requirementsPayload.location,
      comments: typeof requirementsPayload.comments,
      dms: typeof requirementsPayload.dms,
      max_following: typeof requirementsPayload.max_following,
      hashtags: typeof requirementsPayload.hashtags,
      account_targets: typeof requirementsPayload.account_targets
    });

    try {
      // Skip profile lookup and pre-check; go straight to upsert
      console.log('⏭️ Skipping profile lookup and pre-check; proceeding to upsert');

      // Use a single upsert to avoid branch/policy/query-shape issues
      console.log('✅ About to upsert requirements for user:', user.id, requirementsPayload);
      console.log('📝 Saving requirements via upsert (no select)...');
      console.time('⏱️ user_requirements.upsert');
      
      // Add timeout to detect hanging calls
      const upsertPromise = supabase
        .from('user_requirements')
        .upsert(
          [
            {
              user_id: user.id,
              ...requirementsPayload,
              last_updated: new Date().toISOString()
            }
          ],
          { onConflict: 'user_id' }
        );
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upsert timeout after 10s')), 10000)
      );
      
      const { data: upsertData, error: upsertError } = await Promise.race([upsertPromise, timeoutPromise]);
      console.timeEnd('⏱️ user_requirements.upsert');
      console.log('📦 user_requirements.upsert result (no select):', { upsertData, upsertError });
      if (upsertError && upsertError.message) {
        console.error('🧰 Upsert error details:', {
          message: upsertError.message,
          details: upsertError.details,
          hint: upsertError.hint,
          code: upsertError.code
        });
      }

      console.log('📡 Upsert finished:', upsertError ? upsertError : 'success');
      if (upsertError) {
        console.error('❌ Requirements save error:', upsertError);
        throw upsertError;
      }
      console.log('✅ Requirements saved successfully');

      // Try to update user profile (do not block success if this fails)
      try {
        console.log('👤 Updating user profile...');
        console.time('⏱️ profiles.update');
        const profileResult = await supabase
          .from('profiles')
          .update({ requirements_completed: true })
          .eq('id', user.id);
        console.timeEnd('⏱️ profiles.update');
        console.log('👤 Profile update result:', profileResult);
      } catch (profileError) {
        console.warn('❌ Profile update error (non-blocking):', profileError);
      }

      console.log('✅ Setting success state');
      if (timeoutId) clearTimeout(timeoutId);
      setSuccess(true);
      console.timeEnd('⏱️ handleSubmit total');
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        console.log('🚀 Redirecting to dashboard');
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('💥 Form submission error:', error);
      if (error && error.stack) {
        console.error('💥 Error stack:', error.stack);
      }
      if (timeoutId) clearTimeout(timeoutId);
      
      // Provide more specific error messages
      if (error.message?.includes('foreign key')) {
        setError('User profile not found. Please try logging out and back in.');
      } else if (error.message?.includes('permission')) {
        setError('Permission denied. Please check your account status.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to save requirements: ${error.message || 'Unknown error'}. Please try again.`);
      }
      
    } finally {
      // Always reset loading state
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="requirements-form-page">
        <div className="form-container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Requirements Submitted Successfully!</h2>
            <p>Thank you for providing your requirements. Our team will review them and get started on your SMM campaign.</p>
            <p>Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="requirements-form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Tell Us About Your Goals</h1>
          <p>Help us understand your Instagram growth objectives so we can create a personalized strategy for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="requirements-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="niche">Niche (Target Audience)</label>
              <input
                type="text"
                id="niche"
                name="niche"
                value={formData.niche}
                onChange={handleInputChange}
                placeholder="e.g., Fitness, Fashion, Food, Travel"
                required
              />
              <small>What industry or topic does your content focus on?</small>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., New York, USA or Global"
                required
              />
              <small>Where are your target followers located?</small>
            </div>

            <div className="form-group">
              <label htmlFor="comments">Comments (per day)</label>
              <input
                type="number"
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleInputChange}
                placeholder="e.g., 50"
                min="0"
              />
              <small>How many comments would you like us to post daily?</small>
            </div>

            <div className="form-group">
              <label htmlFor="dms">DMs (per day)</label>
              <input
                type="number"
                id="dms"
                name="dms"
                value={formData.dms}
                onChange={handleInputChange}
                placeholder="e.g., 20"
                min="0"
              />
              <small>How many direct messages should we send daily?</small>
            </div>

            <div className="form-group">
              <label htmlFor="max_following">Max Following</label>
              <input
                type="number"
                id="max_following"
                name="max_following"
                value={formData.max_following}
                onChange={handleInputChange}
                placeholder="e.g., 1000"
                min="0"
                required
              />
              <small>Maximum number of accounts you want to follow</small>
            </div>

            <div className="form-group full-width">
              <label htmlFor="hashtags">Hashtags</label>
              <textarea
                id="hashtags"
                name="hashtags"
                value={formData.hashtags}
                onChange={handleInputChange}
                placeholder="e.g., #fitness #workout #health #motivation"
                rows="3"
              />
              <small>List hashtags you want us to use in your posts</small>
            </div>

            <div className="form-group full-width">
              <label htmlFor="account_targets">Account Targets</label>
              <textarea
                id="account_targets"
                name="account_targets"
                value={formData.account_targets}
                onChange={handleInputChange}
                placeholder="e.g., @fitness_influencer, @health_coach, @gym_motivation"
                rows="3"
              />
              <small>List specific accounts you want us to target for engagement</small>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
              <button 
                type="button"
                className="retry-btn"
                onClick={() => {
                  setError('');
                  setLoading(false);
                }}
              >
                Try Again
              </button>
            </div>
          )}

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Saving Requirements...' : 'Submit Requirements'}
            </button>
          </div>
        </form>

        <div className="form-note">
          <p><strong>Note:</strong> These requirements are visible to you but can only be edited by our staff team. If you need to make changes, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default RequirementsFormPage;
