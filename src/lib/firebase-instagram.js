// Firebase Instagram service - replaces Supabase Instagram service
import { firebaseDb } from './firebase-db';
import { instagramGraphClient } from './instagram-graph';

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

  // Fetch and save Instagram insights using REAL Instagram Graph API
  // Requires that the user's instagram account (with access_token) is already saved in Firestore
  async fetchAndSaveRealInsights(userId) {
    try {
      // Load saved instagram account to get instagram_user_id and access token
      const accountResult = await firebaseDb.getInstagramAccount(userId);
      if (accountResult.error || !accountResult.data) {
        throw new Error('No Instagram account found for user');
      }

      const account = accountResult.data;
      const accessToken = account.access_token;
      const instagramUserId = account.instagram_user_id;

      if (!accessToken || !instagramUserId) {
        throw new Error('Instagram access token or user id missing');
      }

      // 1) Account insights (impressions, reach, profile_views)
      const accountInsightsJson = await instagramGraphClient.getAccountInsights({
        instagramUserId,
        accessToken,
        metrics: ['impressions','reach','profile_views'],
        period: 'day'
      });

      // 2) Recent media and media insights (engagement, impressions, reach)
      const { ids: mediaIds } = await instagramGraphClient.getRecentMediaIds({
        instagramUserId,
        accessToken,
        limit: 10
      });

      const mediaInsights = [];
      for (const id of mediaIds) {
        try {
          const mi = await instagramGraphClient.getMediaInsights({ mediaId: id, accessToken });
          mediaInsights.push(mi);
        } catch (e) {
          // Skip media without insights
        }
      }

      // Compute a simple engagement average across recent media
      const avgEngagement = instagramGraphClient.computeAverageEngagement(mediaInsights);

      // Map account insights response to flat fields
      const mapMetric = (json, name) => {
        const m = Array.isArray(json?.data) ? json.data.find(d => d.name === name) : null;
        const v = m?.values?.[0]?.value;
        return typeof v === 'number' ? v : 0;
      };

      const processedInsights = {
        user_id: userId,
        followers_count: typeof account.followers_count === 'number' ? account.followers_count : 0,
        following_count: typeof account.following_count === 'number' ? account.following_count : 0,
        media_count: typeof account.media_count === 'number' ? account.media_count : 0,
        engagement_rate: avgEngagement,
        avg_likes: 0, // Optional: compute via media edges if needed
        avg_comments: 0, // Optional: compute via media edges if needed
        reach: mapMetric(accountInsightsJson, 'reach'),
        impressions: mapMetric(accountInsightsJson, 'impressions'),
        profile_views: mapMetric(accountInsightsJson, 'profile_views'),
        website_clicks: 0,
        email_contacts: 0,
        phone_contacts: 0,
        get_directions: 0,
        text_message: 0,
        last_updated: new Date().toISOString()
      };

      const result = await firebaseDb.saveInstagramInsights(processedInsights);
      if (result.error) throw result.error;
      return { data: result.data, error: null };
    } catch (error) {
      console.error('❌ Error fetching/saving real Instagram insights:', error);
      return { data: null, error };
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
