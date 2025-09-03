import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import './RequirementsFormPage.css';

const RequirementsFormPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_type: '',
    target_audience: '',
    content_goals: [],
    posting_frequency: '',
    budget_range: '',
    special_requirements: '',
    preferred_hashtags: '',
    competitor_accounts: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  const businessTypes = [
    'E-commerce Store',
    'Local Business',
    'Personal Brand',
    'Service Provider',
    'Restaurant/Food',
    'Fashion/Beauty',
    'Fitness/Health',
    'Technology',
    'Education',
    'Other'
  ];

  const contentGoals = [
    'Increase Followers',
    'Boost Engagement',
    'Drive Website Traffic',
    'Generate Sales',
    'Build Brand Awareness',
    'Community Building',
    'Lead Generation',
    'Product Showcase'
  ];

  const postingFrequencies = [
    'Daily',
    '5-6 times per week',
    '3-4 times per week',
    '2-3 times per week',
    'Weekly',
    'As needed'
  ];

  const budgetRanges = [
    'Under $500/month',
    '$500 - $1,000/month',
    '$1,000 - $2,500/month',
    '$2,500 - $5,000/month',
    '$5,000+/month'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save requirements to database
      const { data, error } = await supabase
        .from('user_requirements')
        .insert({
          user_id: user.id,
          business_type: formData.business_type,
          target_audience: formData.target_audience,
          content_goals: formData.content_goals,
          posting_frequency: formData.posting_frequency,
          budget_range: formData.budget_range,
          special_requirements: formData.special_requirements,
          preferred_hashtags: formData.preferred_hashtags,
          competitor_accounts: formData.competitor_accounts,
          status: 'submitted',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving requirements:', error);
        throw error;
      }

      console.log('✅ Requirements saved successfully:', data);
      
      // Navigate to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error submitting requirements:', error);
      alert('Failed to save requirements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="requirements-form-page">
      <div className="form-container">
        <div className="form-header">
          <h1>Tell Us About Your Business</h1>
          <p>Help us understand your Instagram goals so we can create the perfect growth strategy for you.</p>
        </div>

        <form onSubmit={handleSubmit} className="requirements-form">
          <div className="form-section">
            <h3>Business Information</h3>
            
            <div className="form-group">
              <label>What type of business do you have? *</label>
              <select
                value={formData.business_type}
                onChange={(e) => handleInputChange('business_type', e.target.value)}
                required
              >
                <option value="">Select your business type</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Describe your target audience *</label>
              <textarea
                value={formData.target_audience}
                onChange={(e) => handleInputChange('target_audience', e.target.value)}
                placeholder="e.g., Young professionals aged 25-35 interested in fitness and healthy living"
                required
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Content Goals</h3>
            <p>What are your main objectives for Instagram? (Select all that apply)</p>
            
            <div className="checkbox-group">
              {contentGoals.map(goal => (
                <label key={goal} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.content_goals.includes(goal)}
                    onChange={() => handleCheckboxChange('content_goals', goal)}
                  />
                  <span className="checkmark"></span>
                  {goal}
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Posting Preferences</h3>
            
            <div className="form-group">
              <label>How often would you like to post? *</label>
              <select
                value={formData.posting_frequency}
                onChange={(e) => handleInputChange('posting_frequency', e.target.value)}
                required
              >
                <option value="">Select posting frequency</option>
                {postingFrequencies.map(freq => (
                  <option key={freq} value={freq}>{freq}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>What's your monthly marketing budget? *</label>
              <select
                value={formData.budget_range}
                onChange={(e) => handleInputChange('budget_range', e.target.value)}
                required
              >
                <option value="">Select budget range</option>
                {budgetRanges.map(budget => (
                  <option key={budget} value={budget}>{budget}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-group">
              <label>Any special requirements or preferences?</label>
              <textarea
                value={formData.special_requirements}
                onChange={(e) => handleInputChange('special_requirements', e.target.value)}
                placeholder="e.g., Must avoid certain topics, specific brand guidelines, etc."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Preferred hashtags (comma-separated)</label>
              <input
                type="text"
                value={formData.preferred_hashtags}
                onChange={(e) => handleInputChange('preferred_hashtags', e.target.value)}
                placeholder="e.g., #fitness, #health, #lifestyle"
              />
            </div>

            <div className="form-group">
              <label>Competitor accounts you'd like to follow (usernames, comma-separated)</label>
              <input
                type="text"
                value={formData.competitor_accounts}
                onChange={(e) => handleInputChange('competitor_accounts', e.target.value)}
                placeholder="e.g., @competitor1, @competitor2"
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
                  Saving Requirements...
                </>
              ) : (
                'Save Requirements & Continue'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequirementsFormPage;
