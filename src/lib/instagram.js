// Instagram Graph API service
import { supabase } from './supabase';

const INSTAGRAM_API_BASE = 'https://graph.instagram.com';
const FACEBOOK_API_BASE = 'https://graph.facebook.com';
const FACEBOOK_AUTH_BASE = 'https://www.facebook.com/v18.0/dialog/oauth';

class InstagramService {
  constructor() {
    this.appId = import.meta.env.VITE_INSTAGRAM_APP_ID;
    this.appSecret = import.meta.env.VITE_INSTAGRAM_APP_SECRET;
    this.redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI;
  }

  // Generate Facebook OAuth URL for Instagram access
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      scope: 'instagram_basic,instagram_manage_insights,pages_show_list',
      response_type: 'code',
      state: 'instagram_auth'
    });

    return `${FACEBOOK_AUTH_BASE}?${params.toString()}`;
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(code) {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/oauth/access_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const url = new URL(`${FACEBOOK_API_BASE}/oauth/access_token`);
      url.searchParams.append('client_id', this.appId);
      url.searchParams.append('client_secret', this.appSecret);
      url.searchParams.append('redirect_uri', this.redirectUri);
      url.searchParams.append('code', code);

      const response2 = await fetch(url.toString());

      if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
      }

      const data = await response2.json();
      return data;
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      throw error;
    }
  }

  // Get long-lived access token
  async getLongLivedToken(shortLivedToken) {
    try {
      const response = await fetch(`${INSTAGRAM_API_BASE}/access_token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const url = new URL(`${INSTAGRAM_API_BASE}/access_token`);
      url.searchParams.append('grant_type', 'ig_exchange_token');
      url.searchParams.append('client_secret', this.appSecret);
      url.searchParams.append('access_token', shortLivedToken);

      const response2 = await fetch(url.toString());

      if (!response2.ok) {
        throw new Error(`HTTP error! status: ${response2.status}`);
      }

      const data = await response2.json();
      return data;
    } catch (error) {
      console.error('Error getting long-lived token:', error);
      throw error;
    }
  }

  // Get user profile information
  async getUserProfile(accessToken) {
    try {
      const response = await fetch(`${INSTAGRAM_API_BASE}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  // Get user media
  async getUserMedia(accessToken, limit = 25) {
    try {
      const response = await fetch(`${INSTAGRAM_API_BASE}/me/media`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting user media:', error);
      throw error;
    }
  }

  // Get media insights (requires Instagram Business Account)
  async getMediaInsights(mediaId, accessToken) {
    try {
      const response = await fetch(`${INSTAGRAM_API_BASE}/${mediaId}/insights`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting media insights:', error);
      throw error;
    }
  }

  // Save Instagram account to database
  async saveInstagramAccount(userId, instagramData, accessToken) {
    try {
      const { data, error } = await supabase
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

      if (error) throw error;

      // Update user profile to mark Instagram as connected
      await supabase
        .from('profiles')
        .update({ instagram_connected: true })
        .eq('id', userId);

      return data;
    } catch (error) {
      console.error('Error saving Instagram account:', error);
      throw error;
    }
  }

  // Fetch and save Instagram insights
  async fetchAndSaveInsights(userId, accessToken) {
    try {
      // Get user profile
      const profile = await this.getUserProfile(accessToken);
      
      // Get user media
      const media = await this.getUserMedia(accessToken);
      
      // Calculate basic insights
      const insights = {
        followers_count: profile.followers_count || 0,
        following_count: profile.following_count || 0,
        media_count: profile.media_count || 0,
        engagement_rate: 0, // Will be calculated from media data
        avg_likes: 0,
        avg_comments: 0,
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

      // If we have media, calculate engagement metrics
      if (media.data && media.data.length > 0) {
        let totalLikes = 0;
        let totalComments = 0;
        let totalReach = 0;
        let totalImpressions = 0;

        for (const mediaItem of media.data.slice(0, 10)) { // Analyze last 10 posts
          try {
            const mediaInsights = await this.getMediaInsights(mediaItem.id, accessToken);
            
            if (mediaInsights.data) {
              mediaInsights.data.forEach(insight => {
                if (insight.name === 'likes') totalLikes += insight.values[0]?.value || 0;
                if (insight.name === 'comments') totalComments += insight.values[0]?.value || 0;
                if (insight.name === 'reach') totalReach += insight.values[0]?.value || 0;
                if (insight.name === 'impressions') totalImpressions += insight.values[0]?.value || 0;
              });
            }
          } catch (error) {
            console.warn(`Could not fetch insights for media ${mediaItem.id}:`, error);
          }
        }

        const analyzedPosts = Math.min(media.data.length, 10);
        insights.avg_likes = Math.round(totalLikes / analyzedPosts);
        insights.avg_comments = Math.round(totalComments / analyzedPosts);
        insights.reach = totalReach;
        insights.impressions = totalImpressions;
        
        // Calculate engagement rate
        const totalEngagement = totalLikes + totalComments;
        const totalFollowers = insights.followers_count;
        if (totalFollowers > 0) {
          insights.engagement_rate = parseFloat(((totalEngagement / analyzedPosts) / totalFollowers * 100).toFixed(2));
        }
      }

      // Save insights to database
      const { data, error } = await supabase
        .from('instagram_insights')
        .upsert({
          user_id: userId,
          ...insights
        })
        .select()
        .single();

      if (error) throw error;

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

  // Refresh access token
  async refreshAccessToken(accessToken) {
    try {
      const response = await fetch(`${INSTAGRAM_API_BASE}/refresh_access_token`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
  }
}

export const instagramService = new InstagramService();
