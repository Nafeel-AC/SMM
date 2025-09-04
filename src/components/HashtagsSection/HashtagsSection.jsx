import React, { useState, useEffect } from 'react';
import { dashboardDataService } from '../../lib/dashboard-data-service';
import './HashtagsSection.css';

const HashtagsSection = ({ 
  initialHashtags = [
    { id: 1, hashtag: '#WanderAlign', posts: 12 },
    { id: 2, hashtag: '#TravelWithPurpose', posts: 8 },
    { id: 3, hashtag: '#MindfulTravel', posts: 15 },
    { id: 4, hashtag: '#AlignYourJourney', posts: 6 }
  ],
  predefinedHashtags = [
    '#WanderAlign', '#TravelWithPurpose', '#MindfulTravel', '#AlignYourJourney',
    '#ExploreWithIntention', '#ConsciousTravel', '#WanderlustWithPurpose', '#AlignYourPath',
    '#PurposefulTravel', '#MindfulAdventures', '#TravelInspiration', '#ExploreAndAlign',
    '#JourneyWithin', '#TravelAlignment', '#TravelForGrowth', '#ConsciousExploration',
    '#HolisticTravel', '#SoulfulJourneys', '#InnerAlignment', '#WanderWithMeaning'
  ],
  userId
}) => {
  const [selectedHashtags, setSelectedHashtags] = useState(initialHashtags);
  const [newHashtag, setNewHashtag] = useState('');

  // Update selected hashtags when initial data changes
  useEffect(() => {
    setSelectedHashtags(initialHashtags);
  }, [initialHashtags]);

  const handleAddHashtag = async (hashtag) => {
    const hashtagText = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    
    // Check if hashtag is already selected
    if (selectedHashtags.some(item => item.hashtag === hashtagText)) {
      return;
    }

    const newHashtagItem = {
      id: Date.now(),
      hashtag: hashtagText,
      posts: 0
    };

    const updatedHashtags = [...selectedHashtags, newHashtagItem];
    setSelectedHashtags(updatedHashtags);

    // Save to database
    if (userId) {
      try {
        await dashboardDataService.updateHashtags(userId, updatedHashtags);
      } catch (error) {
        console.error('Error saving hashtags:', error);
      }
    }
  };

  const handleRemoveHashtag = async (id) => {
    const updatedHashtags = selectedHashtags.filter(item => item.id !== id);
    setSelectedHashtags(updatedHashtags);

    // Save to database
    if (userId) {
      try {
        await dashboardDataService.updateHashtags(userId, updatedHashtags);
      } catch (error) {
        console.error('Error saving hashtags:', error);
      }
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (newHashtag.trim()) {
      handleAddHashtag(newHashtag.trim());
      setNewHashtag('');
    }
  };

  return (
    <div className="hashtags-section">
      <div className="hashtags-header">
        <div className="hashtags-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M10 3h4v18h-4V3zM3 10h18v4H3v-4z" fill="currentColor"/>
          </svg>
        </div>
        <h3>Hashtags</h3>
      </div>

      {/* Predefined Hashtags List */}
      <div className="predefined-hashtags">
        <div className="hashtags-list">
          {predefinedHashtags.map((hashtag, index) => (
            <span key={index} className="hashtag-item">
              {index + 1}. {hashtag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HashtagsSection;
