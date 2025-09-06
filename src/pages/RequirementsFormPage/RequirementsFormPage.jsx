import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import { firebaseDb } from '../../lib/firebase-db';
import './RequirementsFormPage.css';

const RequirementsFormPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    niche: [''], // max 5
    location: [''], // max 3
    comments: [''], // max 5
    dms: [''], // max 3
    max_following: '',
    hashtags: [''], // max 10
    account_targets: [''] // max 5
  });
  const { user, fetchUserProfile } = useFirebaseAuth();
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

  // For array fields
  // Usage: handleArrayChange('niche', idx, value)
  const handleArrayChange = (field, idx, value) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr[idx] = value;
      return { ...prev, [field]: arr };
    });
  };

  // Add item to array field
  const handleAddItem = (field, max) => {
    setFormData(prev => {
      if (prev[field].length < max) {
        return { ...prev, [field]: [...prev[field], ''] };
      }
      return prev;
    });
  };

  // Remove item from array field
  const handleRemoveItem = (field, idx) => {
    setFormData(prev => {
      const arr = [...prev[field]];
      arr.splice(idx, 1);
      return { ...prev, [field]: arr.length ? arr : [''] };
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log('🚀 Form submission started');
    console.log('👤 User:', user);
    console.log('📝 Form data:', formData);

    // Validate required fields
    const requiredArrays = [
      { field: 'niche', max: 5 },
      { field: 'location', max: 3 },
      { field: 'comments', max: 5 },
      { field: 'dms', max: 3 },
      { field: 'hashtags', max: 10 },
      { field: 'account_targets', max: 5 }
    ];
    for (const { field, max } of requiredArrays) {
      if (!formData[field] || !formData[field].length || formData[field].some(v => !v.trim())) {
        alert(`Please fill in all required fields for ${field}.`);
        setLoading(false);
        return;
      }
      if (formData[field].length > max) {
        alert(`Maximum allowed for ${field} is ${max}.`);
        setLoading(false);
        return;
      }
    }
    if (!formData.max_following) {
      alert('Please fill in max following.');
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
        comments: formData.comments,
        dms: formData.dms,
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
        // Reload profile context
        if (fetchUserProfile && typeof fetchUserProfile === 'function') {
          console.log('🔄 Reloading profile context...');
          await fetchUserProfile(user.uid);
        }
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
        </div>

        <form onSubmit={handleSubmit} className="requirements-form">
          <div className="form-section">
            <h3>Niche Information</h3>
            <div className="form-group">
              <label>Niche (Target Audience) *</label>
              {formData.niche.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <select
                    value={item}
                    onChange={e => handleArrayChange('niche', idx, e.target.value)}
                    required
                  >
                    <option value="">Select your niche</option>
                    {nicheOptions.map(niche => (
                      <option key={niche} value={niche}>{niche}</option>
                    ))}
                  </select>
                  {formData.niche.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('niche', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.niche.length < 5 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('niche', 5)}>Add item</button>
              )}
            </div>
            <div className="form-group">
              <label>Location *</label>
              {formData.location.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleArrayChange('location', idx, e.target.value)}
                    placeholder="e.g., New York, USA or Global"
                    required
                  />
                  {formData.location.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('location', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.location.length < 3 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('location', 3)}>Add item</button>
              )}
            </div>
          </div>
          <div className="form-section">
            <h3>Engagement Preferences</h3>
            <div className="form-group">
              <label>Comments (describe your comment strategy)</label>
              {formData.comments.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <textarea
                    value={item}
                    onChange={e => handleArrayChange('comments', idx, e.target.value)}
                    placeholder="e.g., Engage with fitness content, ask questions, share tips"
                    rows="2"
                  />
                  {formData.comments.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('comments', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.comments.length < 5 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('comments', 5)}>Add item</button>
              )}
            </div>
            <div className="form-group">
              <label>DMs (describe your DM strategy)</label>
              {formData.dms.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <textarea
                    value={item}
                    onChange={e => handleArrayChange('dms', idx, e.target.value)}
                    placeholder="e.g., Send welcome messages, share exclusive content, build relationships"
                    rows="2"
                  />
                  {formData.dms.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('dms', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.dms.length < 3 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('dms', 3)}>Add item</button>
              )}
            </div>
            <div className="form-group">
              <label>Max Following (numbers only) *</label>
              <input
                type="number"
                value={formData.max_following}
                onChange={e => handleInputChange('max_following', e.target.value)}
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
              {formData.hashtags.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleArrayChange('hashtags', idx, e.target.value)}
                    placeholder="#fitness #health #lifestyle #motivation #workout"
                    required
                  />
                  {formData.hashtags.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('hashtags', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.hashtags.length < 10 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('hashtags', 10)}>Add item</button>
              )}
            </div>
            <div className="form-group">
              <label>Account Targets *</label>
              {formData.account_targets.map((item, idx) => (
                <div key={idx} className="form-item-container">
                  <input
                    type="text"
                    value={item}
                    onChange={e => handleArrayChange('account_targets', idx, e.target.value)}
                    placeholder="@fitness_influencer1, @health_coach2, @lifestyle_blogger3"
                    required
                  />
                  {formData.account_targets.length > 1 && (
                    <button type="button" className="remove-item-btn" onClick={() => handleRemoveItem('account_targets', idx)}>Remove</button>
                  )}
                </div>
              ))}
              {formData.account_targets.length < 5 && (
                <button type="button" className="add-item-btn" onClick={() => handleAddItem('account_targets', 5)}>Add item</button>
              )}
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
