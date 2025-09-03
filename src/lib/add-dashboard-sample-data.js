import { addSampleData } from './add-sample-data';

// Function to add comprehensive sample data for dashboard
export const addDashboardSampleData = async () => {
  try {
    console.log('🚀 Adding comprehensive dashboard sample data...');
    
    // Add all sample data
    await addSampleData.addSampleProfiles();
    await addSampleData.addSampleInstagramAccounts();
    await addSampleData.addSampleInstagramInsights();
    await addSampleData.addSampleUserRequirements();
    
    console.log('✅ All dashboard sample data added successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error adding dashboard sample data:', error);
    return { success: false, error };
  }
};

// Function to add sample data for a specific user
export const addUserSampleData = async (userId) => {
  try {
    console.log(`🚀 Adding sample data for user: ${userId}`);
    
    // Add sample Instagram insights
    const sampleInsights = {
      user_id: userId,
      followers_count: 1381,
      following_count: 676,
      media_count: 42,
      engagement_rate: 4.8,
      avg_likes: 95,
      avg_comments: 15,
      reach: 1200,
      impressions: 1381,
      profile_views: 65,
      website_clicks: 18,
      email_contacts: 5,
      phone_contacts: 2,
      get_directions: 1,
      text_message: 0,
      last_updated: new Date().toISOString()
    };

    // Add sample user requirements
    const sampleRequirements = {
      user_id: userId,
      business_type: 'Wellness & Travel',
      posting_frequency: 'Daily',
      budget_range: '$500-1000/month',
      content_goals: ['Brand Awareness', 'Engagement', 'Lead Generation'],
      target_locations: ['USA', 'New York', 'India', 'Canada', 'Chicago'],
      target_audience: [
        'Minimalist', 'Travel', 'Wellness', 'fitness', 'healthyfood', 
        'facelessinstagram', 'quotes', 'aesthetic vibes', 'health tips', 
        'wellness resort', 'yoga and zen mode', 'Journaling and vision boards'
      ],
      preferred_content_types: ['Images', 'Videos', 'Stories', 'Reels'],
      brand_voice: 'Inspirational and Authentic'
    };

    // Add sample dashboard settings
    const sampleSettings = {
      user_id: userId,
      hashtags: [
        { id: 1, hashtag: '#WanderAlign', posts: 12 },
        { id: 2, hashtag: '#TravelWithPurpose', posts: 8 },
        { id: 3, hashtag: '#MindfulTravel', posts: 15 },
        { id: 4, hashtag: '#AlignYourJourney', posts: 6 }
      ],
      accounts: [
        { id: 1, account: '@@payalsharmanyc' },
        { id: 2, account: '@Wealthywomansecrets' },
        { id: 3, account: '@Female' },
        { id: 4, account: '@@bossbabeclubs' }
      ],
      strategy: {
        target_locations: ['USA', 'New York', 'India', 'Canada', 'Chicago'],
        target_audience: [
          'Minimalist', 'Travel', 'Wellness', 'fitness', 'healthyfood', 
          'facelessinstagram', 'quotes', 'aesthetic vibes', 'health tips', 
          'wellness resort', 'yoga and zen mode', 'Journaling and vision boards'
        ]
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Import firebaseDb here to avoid circular imports
    const { firebaseDb } = await import('./firebase-db');
    
    // Save all sample data
    await firebaseDb.saveInstagramInsights(sampleInsights);
    await firebaseDb.saveUserRequirements(sampleRequirements);
    await firebaseDb.addDocument('dashboard_settings', sampleSettings);
    
    console.log(`✅ Sample data added for user: ${userId}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error adding sample data for user ${userId}:`, error);
    return { success: false, error };
  }
};
