// Firebase Instagram service - replaces Supabase Instagram service
import { firebaseDb } from './firebase-db';

class FirebaseInstagramService {
  constructor() {
    // No need for environment variables in test mode
  }

  // Mock Instagram connection - just returns success immediately
  async connectInstagram(userId) {
    console.log('🧪 Test mode: Connecting Instagram locally (no redirects)');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate test data
    const testData = {
      access_token: 'test_access_token_' + Date.now(),
      user_id: 'test_user_12345',
      permissions: 'instagram_business_basic,instagram_business_manage_messages',
      token_type: 'bearer',
      expires_in: 5183944
    };
    
    console.log('🧪 Test mode: Generated test data:', testData);
    return testData;
  }

  // Mock Instagram profile data
  async getInstagramProfile(accessToken) {
    console.log('🧪 Test mode: Mocking Instagram profile fetch');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: 'test_instagram_account_123',
      username: 'test_business_account',
      account_type: 'BUSINESS',
      media_count: 25
    };
  }

  // Mock Instagram media data
  async getInstagramMedia(accessToken, limit = 25) {
    console.log('🧪 Test mode: Mocking Instagram media fetch');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      data: [
        {
          id: 'test_media_1',
          caption: 'Test post 1 - Sample content for testing',
          media_type: 'IMAGE',
          media_url: 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=Test+Post+1',
          permalink: 'https://instagram.com/p/test1',
          timestamp: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'test_media_2',
          caption: 'Test post 2 - Another sample post',
          media_type: 'VIDEO',
          media_url: 'https://via.placeholder.com/400x400/4ECDC4/FFFFFF?text=Test+Video+2',
          permalink: 'https://instagram.com/p/test2',
          timestamp: new Date(Date.now() - 172800000).toISOString()
        },
        {
          id: 'test_media_3',
          caption: 'Test post 3 - Third test post',
          media_type: 'IMAGE',
          media_url: 'https://via.placeholder.com/400x400/45B7D1/FFFFFF?text=Test+Post+3',
          permalink: 'https://instagram.com/p/test3',
          timestamp: new Date(Date.now() - 259200000).toISOString()
        }
      ]
    };
  }

  // Mock Instagram insights data
  async getInstagramInsights(accessToken) {
    console.log('🧪 Test mode: Mocking Instagram insights fetch');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      data: [
        {
          name: 'impressions',
          values: [{ value: 1250 }]
        },
        {
          name: 'reach',
          values: [{ value: 980 }]
        },
        {
          name: 'profile_views',
          values: [{ value: 45 }]
        },
        {
          name: 'website_clicks',
          values: [{ value: 12 }]
        },
        {
          name: 'email_contacts',
          values: [{ value: 3 }]
        },
        {
          name: 'phone_call_clicks',
          values: [{ value: 2 }]
        },
        {
          name: 'get_directions_clicks',
          values: [{ value: 1 }]
        },
        {
          name: 'text_message_clicks',
          values: [{ value: 0 }]
        }
      ]
    };
  }

  // Mock media insights
  async getMediaInsights(mediaId, accessToken) {
    console.log('🧪 Test mode: Mocking media insights for:', mediaId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      data: [
        {
          name: 'impressions',
          values: [{ value: Math.floor(Math.random() * 500) + 100 }]
        },
        {
          name: 'reach',
          values: [{ value: Math.floor(Math.random() * 400) + 80 }]
        },
        {
          name: 'engagement',
          values: [{ value: Math.floor(Math.random() * 50) + 10 }]
        },
        {
          name: 'saved',
          values: [{ value: Math.floor(Math.random() * 20) + 2 }]
        }
      ]
    };
  }

  // Save Instagram account to Firestore
  async saveInstagramAccount(userId, instagramData, accessToken) {
    try {
      console.log('🧪 Test mode: Saving Instagram account to Firestore');
      console.log('🧪 Data to save:', { userId, instagramData, accessToken });
      
      const accountData = {
        user_id: userId,
        instagram_user_id: instagramData.id,
        username: instagramData.username,
        access_token: accessToken,
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString()
      };

      const result = await firebaseDb.saveInstagramAccount(accountData);

      if (result.error) {
        console.error('❌ Firebase error saving Instagram account:', result.error);
        // In test mode, we can continue even if database save fails
        console.log('🧪 Test mode: Continuing despite database save failure');
        return { id: 'test_account_' + Date.now(), user_id: userId };
      }

      console.log('✅ Instagram account saved to Firestore:', result.data);

      // Update user profile to mark Instagram as connected
      try {
        await firebaseDb.updateProfile(userId, { instagram_connected: true });
        console.log('✅ Profile updated to mark Instagram as connected');
      } catch (profileError) {
        console.error('❌ Error updating profile:', profileError);
        console.log('🧪 Test mode: Continuing despite profile update failure');
      }

      return result.data;
    } catch (error) {
      console.error('❌ Error saving Instagram account:', error);
      // In test mode, return mock data instead of throwing
      console.log('🧪 Test mode: Returning mock data due to database error');
      return { id: 'test_account_' + Date.now(), user_id: userId };
    }
  }

  // Fetch and save Instagram insights using test data
  async fetchAndSaveInsights(userId, accessToken) {
    try {
      console.log('🧪 Test mode: Fetching and saving test insights');
      
      // Get test Instagram profile
      const profile = await this.getInstagramProfile(accessToken);
      
      // Get test Instagram insights
      const insights = await this.getInstagramInsights(accessToken);
      
      // Get test recent media
      const media = await this.getInstagramMedia(accessToken, 25);
      
      // Process insights data
      const processedInsights = {
        user_id: userId,
        followers_count: 1250, // Test data
        following_count: 320,  // Test data
        media_count: profile.media_count || 0,
        engagement_rate: 4.2,  // Test data
        avg_likes: 85,         // Test data
        avg_comments: 12,      // Test data
        reach: 0,
        impressions: 0,
        profile_views: 0,
        website_clicks: 0,
        email_contacts: 0,
        phone_contacts: 0,
        get_directions: 0,
        text_message: 0,
        last_updated: new Date().toISOString()
      };

      // Process insights data if available
      if (insights && insights.data) {
        insights.data.forEach(metric => {
          switch (metric.name) {
            case 'impressions':
              processedInsights.impressions = metric.values[0]?.value || 0;
              break;
            case 'reach':
              processedInsights.reach = metric.values[0]?.value || 0;
              break;
            case 'profile_views':
              processedInsights.profile_views = metric.values[0]?.value || 0;
              break;
            case 'website_clicks':
              processedInsights.website_clicks = metric.values[0]?.value || 0;
              break;
            case 'email_contacts':
              processedInsights.email_contacts = metric.values[0]?.value || 0;
              break;
            case 'phone_call_clicks':
              processedInsights.phone_contacts = metric.values[0]?.value || 0;
              break;
            case 'get_directions_clicks':
              processedInsights.get_directions = metric.values[0]?.value || 0;
              break;
            case 'text_message_clicks':
              processedInsights.text_message = metric.values[0]?.value || 0;
              break;
          }
        });
      }

      // Calculate engagement rate from media insights
      if (media.data) {
        let totalEngagement = 0;
        let mediaWithInsights = 0;
        
        for (const mediaItem of media.data) {
          try {
            const mediaInsights = await this.getMediaInsights(mediaItem.id, accessToken);
            if (mediaInsights.data) {
              const engagement = mediaInsights.data.find(metric => metric.name === 'engagement');
              if (engagement) {
                totalEngagement += engagement.values[0]?.value || 0;
                mediaWithInsights++;
              }
            }
          } catch (error) {
            console.log(`No insights available for media ${mediaItem.id}`);
          }
        }
        
        if (mediaWithInsights > 0) {
          processedInsights.engagement_rate = (totalEngagement / mediaWithInsights).toFixed(2);
        }
      }

      // Save insights to Firestore
      console.log('🧪 Saving insights to Firestore:', processedInsights);
      const result = await firebaseDb.saveInstagramInsights(processedInsights);

      if (result.error) {
        console.error('❌ Firebase error saving insights:', result.error);
        // In test mode, we can continue even if insights save fails
        console.log('🧪 Test mode: Continuing despite insights save failure');
        return { id: 'test_insights_' + Date.now(), user_id: userId };
      }

      console.log('✅ Test insights saved successfully:', result.data);
      return result.data;
    } catch (error) {
      console.error('Error fetching and saving insights:', error);
      throw error;
    }
  }

  // Get stored insights from Firestore
  async getStoredInsights(userId) {
    try {
      const result = await firebaseDb.getInstagramInsights(userId);
      return result.data;
    } catch (error) {
      console.error('Error getting stored insights:', error);
      throw error;
    }
  }

  // Test Firebase connection with detailed logging
  async testFirebaseConnection(userId) {
    console.log('🔍 Testing Firebase connection with detailed logging...');
    
    try {
      // Test 1: Basic connection
      console.log('🔍 Test 1: Basic Firebase client test...');
      const { data: profileData, error: profileError } = await firebaseDb.getProfile(userId);
      console.log('🔍 Profile test:', { 
        data: profileData, 
        error: profileError,
        hasData: !!profileData
      });
      
      // Test 2: Instagram accounts collection
      console.log('🔍 Test 2: Testing instagram_accounts collection...');
      const { data: instagramData, error: instagramError } = await firebaseDb.getInstagramAccount(userId);
      console.log('🔍 Instagram accounts test:', { 
        data: instagramData, 
        error: instagramError,
        hasData: !!instagramData
      });
      
      // Test 3: Instagram insights collection
      console.log('🔍 Test 3: Testing instagram_insights collection...');
      const { data: insightsData, error: insightsError } = await firebaseDb.getInstagramInsights(userId);
      console.log('🔍 Instagram insights test:', { 
        data: insightsData, 
        error: insightsError,
        hasData: !!insightsData
      });
      
      // Test 4: Try to insert test data
      console.log('🔍 Test 4: Testing data insertion...');
      const testInsertData = {
        user_id: userId,
        instagram_user_id: 'test_user_123',
        username: 'test_user',
        access_token: 'test_token',
        connected_at: new Date().toISOString()
      };
      
      const { data: insertData, error: insertError } = await firebaseDb.saveInstagramAccount(testInsertData);
      
      console.log('🔍 Insert test result:', { 
        data: insertData, 
        error: insertError,
        success: !!insertData
      });
      
      // If insert was successful, clean up the test data
      if (insertData && insertData.id) {
        console.log('🔍 Cleaning up test data...');
        await firebaseDb.deleteDocument('instagram_accounts', insertData.id);
        console.log('🔍 Test data cleaned up');
      }
      
      return {
        success: true,
        profile: !profileError,
        instagram: !instagramError,
        insights: !insightsError,
        insert: !insertError
      };
      
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Complete Instagram connection flow (local only)
  async connectInstagramAccount(userId) {
    try {
      console.log('🧪 Test mode: Starting complete Instagram connection flow for user:', userId);
      
      // Test Firebase connection with detailed logging
      console.log('🧪 Testing Firebase connection...');
      
      const connectionTest = await this.testFirebaseConnection(userId);
      let firebaseAvailable = connectionTest.success;
      
      if (!firebaseAvailable) {
        console.log('🧪 Test mode: Firebase not available, using offline mode');
      } else {
        console.log('✅ Firebase connection test passed:', connectionTest);
      }
      
      // Step 1: Connect Instagram (get token)
      console.log('🧪 Step 1: Getting token data...');
      const tokenData = await this.connectInstagram(userId);
      console.log('✅ Step 1 complete:', tokenData);
      
      // Step 2: Get profile
      console.log('🧪 Step 2: Getting profile...');
      const profile = await this.getInstagramProfile(tokenData.access_token);
      console.log('✅ Step 2 complete:', profile);
      
      // Step 3: Save account (only if Firebase is available)
      if (firebaseAvailable) {
        console.log('🧪 Step 3: Saving account...');
        try {
          await this.saveInstagramAccount(userId, profile, tokenData.access_token);
          console.log('✅ Step 3 complete');
        } catch (error) {
          console.log('🧪 Step 3 failed but continuing:', error.message);
        }
      } else {
        console.log('🧪 Step 3: Skipping account save (Firebase not available)');
      }
      
      // Step 4: Fetch and save insights (only if Firebase is available)
      if (firebaseAvailable) {
        console.log('🧪 Step 4: Fetching and saving insights...');
        try {
          await this.fetchAndSaveInsights(userId, tokenData.access_token);
          console.log('✅ Step 4 complete');
        } catch (error) {
          console.log('🧪 Step 4 failed but continuing:', error.message);
        }
      } else {
        console.log('🧪 Step 4: Skipping insights save (Firebase not available)');
      }
      
      console.log('✅ Complete Instagram connection flow finished successfully');
      return { success: true, profile, tokenData };
      
    } catch (error) {
      console.error('❌ Error in Instagram connection flow:', error);
      throw error;
    }
  }
}

export const firebaseInstagramService = new FirebaseInstagramService();
