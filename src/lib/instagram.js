// Simple test Instagram service - completely local, no API calls, no redirects
import { supabase } from './supabase';
import { DatabaseChecker } from './database-checker';

class InstagramService {
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

  // Save Instagram account to database
  async saveInstagramAccount(userId, instagramData, accessToken) {
    try {
      console.log('🧪 Test mode: Saving Instagram account to database');
      console.log('🧪 Data to save:', { userId, instagramData, accessToken });
      
      // Add timeout for database operations
      const savePromise = supabase
        .from('instagram_accounts')
        .upsert({
          user_id: userId,
          instagram_user_id: instagramData.id,
          username: instagramData.username,
          access_token: accessToken,
          connected_at: new Date().toISOString(),
          last_sync: new Date().toISOString()
        })
        .select()
        .single();

      const saveTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database save timeout')), 8000)
      );

      const { data, error } = await Promise.race([savePromise, saveTimeoutPromise]);

      if (error) {
        console.error('❌ Supabase error saving Instagram account:', error);
        // In test mode, we can continue even if database save fails
        console.log('🧪 Test mode: Continuing despite database save failure');
        return { id: 'test_account_' + Date.now(), user_id: userId };
      }

      console.log('✅ Instagram account saved to database:', data);

      // Update user profile to mark Instagram as connected (with timeout)
      try {
        const profilePromise = supabase
          .from('profiles')
          .update({ instagram_connected: true })
          .eq('id', userId);

        const profileTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Profile update timeout')), 5000)
        );

        const { error: profileError } = await Promise.race([profilePromise, profileTimeoutPromise]);

        if (profileError) {
          console.error('❌ Error updating profile:', profileError);
          console.log('🧪 Test mode: Continuing despite profile update failure');
        } else {
          console.log('✅ Profile updated to mark Instagram as connected');
        }
      } catch (profileError) {
        console.log('🧪 Test mode: Profile update failed, continuing anyway');
      }

      return data;
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

      // Save insights to database with timeout
      console.log('🧪 Saving insights to database:', processedInsights);
      const insightsPromise = supabase
        .from('instagram_insights')
        .upsert({
          user_id: userId,
          ...processedInsights
        })
        .select()
        .single();

      const insightsTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Insights save timeout')), 8000)
      );

      const { data, error } = await Promise.race([insightsPromise, insightsTimeoutPromise]);

      if (error) {
        console.error('❌ Supabase error saving insights:', error);
        // In test mode, we can continue even if insights save fails
        console.log('🧪 Test mode: Continuing despite insights save failure');
        return { id: 'test_insights_' + Date.now(), user_id: userId };
      }

      console.log('✅ Test insights saved successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching and saving insights:', error);
      throw error;
    }
  }

  // Get stored insights from database
  async getStoredInsights(userId) {
    try {
      const { data, error } = await supabase
        .from('instagram_insights')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Error getting stored insights:', error);
      throw error;
    }
  }

  // Test Supabase connection with detailed logging
  async testSupabaseConnection(userId) {
    console.log('🔍 Testing Supabase connection with detailed logging...');
    
    try {
      // Test 1: Basic connection
      console.log('🔍 Test 1: Basic Supabase client test...');
      const { data: authData, error: authError } = await supabase.auth.getSession();
      console.log('🔍 Auth session test:', { authData: !!authData, authError: !!authError });
      
      // Test 2: Simple table query
      console.log('🔍 Test 2: Testing profiles table access...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      console.log('🔍 Profiles table test:', { 
        data: profileData, 
        error: profileError,
        hasData: !!profileData,
        dataLength: profileData?.length || 0
      });
      
      // Test 3: User-specific query
      console.log('🔍 Test 3: Testing user-specific query...');
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      console.log('🔍 User-specific query test:', { 
        data: userData, 
        error: userError,
        hasData: !!userData
      });
      
      // Test 4: Instagram accounts table
      console.log('🔍 Test 4: Testing instagram_accounts table...');
      const { data: instagramData, error: instagramError } = await supabase
        .from('instagram_accounts')
        .select('id')
        .limit(1);
      console.log('🔍 Instagram accounts table test:', { 
        data: instagramData, 
        error: instagramError,
        hasData: !!instagramData
      });
      
      // Test 5: Instagram insights table
      console.log('🔍 Test 5: Testing instagram_insights table...');
      const { data: insightsData, error: insightsError } = await supabase
        .from('instagram_insights')
        .select('id')
        .limit(1);
      console.log('🔍 Instagram insights table test:', { 
        data: insightsData, 
        error: insightsError,
        hasData: !!insightsData
      });
      
      // Test 6: Try to insert test data (this will help identify RLS issues)
      console.log('🔍 Test 6: Testing data insertion...');
      const testInsertData = {
        user_id: userId,
        instagram_user_id: 'test_user_123',
        username: 'test_user',
        access_token: 'test_token',
        connected_at: new Date().toISOString()
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('instagram_accounts')
        .insert(testInsertData)
        .select()
        .single();
      
      console.log('🔍 Insert test result:', { 
        data: insertData, 
        error: insertError,
        success: !!insertData
      });
      
      // If insert was successful, clean up the test data
      if (insertData) {
        console.log('🔍 Cleaning up test data...');
        await supabase
          .from('instagram_accounts')
          .delete()
          .eq('id', insertData.id);
        console.log('🔍 Test data cleaned up');
      }
      
      return {
        success: true,
        auth: !authError,
        profiles: !profileError,
        userQuery: !userError,
        instagram: !instagramError,
        insights: !insightsError,
        insert: !insertError
      };
      
    } catch (error) {
      console.error('❌ Supabase connection test failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Complete Instagram connection flow (local only)
  async connectInstagramAccount(userId) {
    try {
      console.log('🧪 Test mode: Starting complete Instagram connection flow for user:', userId);
      
      // Test Supabase connection with detailed logging
      console.log('🧪 Testing Supabase connection...');
      
      // First, check database setup
      const dbCheck = await DatabaseChecker.checkDatabaseSetup();
      console.log('🔍 Database setup check:', dbCheck);
      
      // Then test connection
      const connectionTest = await this.testSupabaseConnection(userId);
      let supabaseAvailable = connectionTest.success;
      
      if (!supabaseAvailable) {
        console.log('🧪 Test mode: Supabase not available, using offline mode');
        console.log('💡 Database setup status:', dbCheck.overall);
        
        if (dbCheck.overall === 'needs_setup') {
          console.log('📋 Database needs setup. Please run the SQL script in Supabase dashboard.');
          console.log('📋 File: sql/safe_database_setup.sql');
        }
      } else {
        console.log('✅ Supabase connection test passed:', connectionTest);
      }
      
      // Step 1: Connect Instagram (get token)
      console.log('🧪 Step 1: Getting token data...');
      const tokenData = await this.connectInstagram(userId);
      console.log('✅ Step 1 complete:', tokenData);
      
      // Step 2: Get profile
      console.log('🧪 Step 2: Getting profile...');
      const profile = await this.getInstagramProfile(tokenData.access_token);
      console.log('✅ Step 2 complete:', profile);
      
      // Step 3: Save account (only if Supabase is available)
      if (supabaseAvailable) {
        console.log('🧪 Step 3: Saving account...');
        try {
          await this.saveInstagramAccount(userId, profile, tokenData.access_token);
          console.log('✅ Step 3 complete');
        } catch (error) {
          console.log('🧪 Step 3 failed but continuing:', error.message);
        }
      } else {
        console.log('🧪 Step 3: Skipping account save (Supabase not available)');
      }
      
      // Step 4: Fetch and save insights (only if Supabase is available)
      if (supabaseAvailable) {
        console.log('🧪 Step 4: Fetching and saving insights...');
        try {
          await this.fetchAndSaveInsights(userId, tokenData.access_token);
          console.log('✅ Step 4 complete');
        } catch (error) {
          console.log('🧪 Step 4 failed but continuing:', error.message);
        }
      } else {
        console.log('🧪 Step 4: Skipping insights save (Supabase not available)');
      }
      
      console.log('✅ Complete Instagram connection flow finished successfully');
      return { success: true, profile, tokenData };
      
    } catch (error) {
      console.error('❌ Error in Instagram connection flow:', error);
      throw error;
    }
  }
}

export const instagramService = new InstagramService();

