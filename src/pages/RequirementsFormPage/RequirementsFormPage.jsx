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

  useEffect(() => {
    checkExistingRequirements();
    
    // Cleanup function to clear any pending timeouts
    return () => {
      // This will be called when component unmounts
    };
  }, []);

  const checkExistingRequirements = async () => {
    try {
      console.log('🔍 Checking for existing requirements on page load...');
      console.log('👤 User ID for check:', user?.id);
      
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
    
    setLoading(true);
    setError('');
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Form submission timeout - resetting loading state');
      setLoading(false);
      setError('Request timed out. Please try again.');
    }, 30000); // 30 second timeout

    try {
      // Ensure user profile exists first
      try {
        console.log('👤 Ensuring user profile exists...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code === 'PGRST116') {
          console.log('👤 Creating user profile...');
          const { error: createError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                full_name: user.user_metadata?.full_name || null,
                email: user.email,
                role: 'user'
              }
            ]);
          
          if (createError) {
            console.error('❌ Error creating profile:', createError);
            throw createError;
          }
          console.log('✅ User profile created successfully');
        } else if (profileError) {
          console.error('❌ Error checking profile:', profileError);
          throw profileError;
        } else {
          console.log('✅ User profile exists');
        }
      } catch (profileError) {
        console.error('❌ Profile setup error:', profileError);
        throw profileError;
      }

      // Try to save requirements to database
      try {
        console.log('🔍 Checking for existing requirements...');
        // Check if requirements already exist
        const { data: existing, error: checkError } = await supabase
          .from('user_requirements')
          .select('id')
          .eq('user_id', user.id)
          .single();

        console.log('🔍 Existing requirements check result:', { existing, checkError });

        let result;
        if (existing && !checkError) {
          console.log('📝 Updating existing requirements...');
          // Update existing requirements
          result = await supabase
            .from('user_requirements')
            .update({
              ...formData,
              last_updated: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .select()
            .single();
        } else {
          console.log('📝 Creating new requirements...');
          // Insert new requirements
          result = await supabase
            .from('user_requirements')
            .insert([
              {
                user_id: user.id,
                ...formData,
                created_at: new Date().toISOString()
              }
            ])
            .select()
            .single();
        }

        console.log('📝 Requirements save result:', result);

        if (result.error) {
          console.error('❌ Requirements save error:', result.error);
          throw result.error;
        } else {
          console.log('✅ Requirements saved successfully');
        }

        // Try to update user profile
        try {
          console.log('👤 Updating user profile...');
          const profileResult = await supabase
            .from('profiles')
            .update({ requirements_completed: true })
            .eq('id', user.id);
          
          console.log('👤 Profile update result:', profileResult);
        } catch (profileError) {
          console.warn('❌ Profile update error:', profileError);
          // Continue anyway
        }

      } catch (dbError) {
        console.warn('❌ Database error:', dbError);
        // Continue anyway - don't block the user flow
      }

      console.log('✅ Setting success state');
      clearTimeout(timeoutId); // Clear the timeout
      setSuccess(true);
      setLoading(false); // Reset loading state on success
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        console.log('🚀 Redirecting to dashboard');
        navigate('/dashboard');
      }, 1000);

    } catch (error) {
      console.error('💥 Form submission error:', error);
      clearTimeout(timeoutId); // Clear the timeout
      
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
      
      // Always reset loading state on error
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
