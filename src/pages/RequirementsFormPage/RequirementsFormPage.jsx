import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { firebaseDb } from '../../lib/firebase-db';
import './RequirementsFormPage.css';

const RequirementsFormPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    niche: '',
    location: '',
    comments: '',
    dms: '',
    max_following: '',
    hashtags: '',
    account_targets: ''
  });
  const { user } = useFirebaseAuth();
  const navigate = useNavigate();

  const nicheOptions = [
    'Fashion & Beauty',
    'Fitness & Health',
    'Food & Cooking',
    'Travel & Lifestyle',
    'Technology',
    'Business & Entrepreneurship',
    'Education',
    'Entertainment',
    'Art & Design',
    'Sports',
    'Gaming',
    'Parenting',
    'Pets & Animals',
    'Home & Garden',
    'Automotive',
    'Finance',
    'Real Estate',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('🚀 Form submission started');
    console.log('👤 User:', user);
    console.log('📝 Form data:', formData);

    // Validate required fields
    if (!formData.niche || !formData.location || !formData.max_following || !formData.hashtags || !formData.account_targets) {
      alert('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Check if user is authenticated
    if (!user || !user.uid) {
      alert('You must be logged in to submit requirements.');
      setLoading(false);
      return;
    }

    try {
      console.log('💾 Attempting to save to database...');
      
      // Prepare data for insertion
      const insertData = {
        user_id: user.uid,
        niche: formData.niche,
        location: formData.location,
        comments: formData.comments || null,
        dms: formData.dms || null,
        max_following: formData.max_following ? parseInt(formData.max_following) : null,
        hashtags: formData.hashtags,
        account_targets: formData.account_targets
      };

      console.log('📦 Data to insert:', insertData);

      // Save requirements to database
      const result = await firebaseDb.saveUserRequirements(insertData);

      if (result.error) {
        console.error('❌ Database error:', result.error);
        throw result.error;
      }

      console.log('✅ Requirements saved successfully:', result.data);
      
      // Update user profile to mark requirements as completed
      console.log('🔄 Updating user profile...');
      const profileResult = await firebaseDb.updateProfile(user.uid, { requirements_completed: true });

      if (profileResult.error) {
        console.error('⚠️ Warning: Could not update profile:', profileResult.error);
      } else {
        console.log('✅ Profile updated successfully');
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('💥 Error submitting requirements:', error);
      
      // Show more specific error message
      let errorMessage = 'Failed to save requirements. Please try again.';
      
      if (error.message) {
        if (error.message.includes('duplicate key')) {
          errorMessage = 'You have already submitted requirements. Please contact support if you need to update them.';
        } else if (error.message.includes('permission denied')) {
          errorMessage = 'Permission denied. Please make sure you are logged in.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirements-form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Niche Data Collection</h1>
          <p>Help us understand your Instagram niche and targeting preferences for optimal growth strategy.</p>
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              background: '#f0f0f0', 
              padding: '10px', 
              margin: '10px 0', 
              borderRadius: '5px',
              fontSize: '12px',
              border: '1px solid #ccc'
            }}>
              <strong>Debug Info:</strong><br/>
              User: {user ? `${user.email} (${user.id})` : 'Not logged in'}<br/>
              Form Data: {JSON.stringify(formData, null, 2)}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="requirements-form">
          <div className="form-section">
            <h3>Niche Information</h3>
            
            <div className="form-group">
              <label>Niche (Target Audience) *</label>
              <select
                value={formData.niche}
                onChange={(e) => handleInputChange('niche', e.target.value)}
                required
              >
                <option value="">Select your niche</option>
                {nicheOptions.map(niche => (
                  <option key={niche} value={niche}>{niche}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g., New York, USA or Global"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Engagement Preferences</h3>
            
            <div className="form-group">
              <label>Comments (describe your comment strategy)</label>
              <textarea
                value={formData.comments}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                placeholder="e.g., Engage with fitness content, ask questions, share tips"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>DMs (describe your DM strategy)</label>
              <textarea
                value={formData.dms}
                onChange={(e) => handleInputChange('dms', e.target.value)}
                placeholder="e.g., Send welcome messages, share exclusive content, build relationships"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Max Following (numbers only) *</label>
              <input
                type="number"
                value={formData.max_following}
                onChange={(e) => handleInputChange('max_following', e.target.value)}
                placeholder="e.g., 5000"
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Content Strategy</h3>
            
            <div className="form-group">
              <label>Hashtags *</label>
              <textarea
                value={formData.hashtags}
                onChange={(e) => handleInputChange('hashtags', e.target.value)}
                placeholder="e.g., #fitness #health #lifestyle #motivation #workout"
                required
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Account Targets *</label>
              <textarea
                value={formData.account_targets}
                onChange={(e) => handleInputChange('account_targets', e.target.value)}
                placeholder="e.g., @fitness_influencer1, @health_coach2, @lifestyle_blogger3"
                required
                rows="3"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Saving Niche Data...
                </>
              ) : (
                'Save Niche Data & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequirementsFormPage;
