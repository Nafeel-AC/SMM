// Instagram Graph API service
import { supabase } from './supabase';

const INSTAGRAM_BASIC_API_BASE = 'https://graph.instagram.com';
const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0';
const FACEBOOK_AUTH_BASE = 'https://www.facebook.com/v18.0/dialog/oauth';
const INSTAGRAM_AUTH_BASE = 'https://api.instagram.com/oauth/authorize';

class InstagramService {
  constructor() {
    this.appId = import.meta.env.VITE_INSTAGRAM_APP_ID;
    this.appSecret = import.meta.env.VITE_INSTAGRAM_APP_SECRET;
    this.redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI;
  }

  // Generate Instagram Basic Display OAuth URL
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      scope: 'user_profile,user_media',
      response_type: 'code',
      state: 'instagram_auth'
    });

    return `${INSTAGRAM_AUTH_BASE}?${params.toString()}`;
  }

  // Exchange authorization code for token via serverless function (keeps secret off client)
  async exchangeCodeForToken(code) {
    const resp = await fetch(`/api/instagram/exchange?code=${encodeURIComponent(code)}`);
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    return await resp.json();
  }

  // Get long-lived Facebook user access token
  async getLongLivedToken(shortLivedToken) {
    try {
      const url = new URL(`${FACEBOOK_API_BASE.replace('/v18.0','')}/oauth/access_token`);
      url.searchParams.append('grant_type', 'fb_exchange_token');
      url.searchParams.append('client_id', this.appId);
      url.searchParams.append('client_secret', this.appSecret);
      url.searchParams.append('fb_exchange_token', shortLivedToken);

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

  // Get Instagram user profile using Basic Display API
  async getInstagramProfile(accessToken) {
    try {
      const response = await fetch(`${INSTAGRAM_BASIC_API_BASE}/me?fields=id,username&access_token=${accessToken}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Instagram profile: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting Instagram profile:', error);
      throw error;
    }
  }

  // Get Instagram media using Basic Display API
  async getInstagramMedia(accessToken, limit = 25) {
    try {
      const response = await fetch(`${INSTAGRAM_BASIC_API_BASE}/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&limit=${limit}&access_token=${accessToken}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Instagram media: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting Instagram media:', error);
      throw error;
    }
  }

  // Get media insights via Graph API (reach, impressions)
  async getMediaInsights(mediaId, accessToken) {
    try {
      const url = `${FACEBOOK_API_BASE}/${mediaId}/insights?metric=impressions,reach,saved`;
      const response = await fetch(url, { headers: { 'Authorization': `Bearer ${accessToken}` } });
      if (!response.ok) throw new Error(`Failed to fetch media insights: ${response.status}`);
      return await response.json();
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
      // Get Instagram profile using Basic Display API
      const profile = await this.getInstagramProfile(accessToken);
      
      // Get recent media
      const media = await this.getInstagramMedia(accessToken, 25);
      
      // Calculate basic insights - Note: Basic Display API has limited data
      const insights = {
        followers_count: 0, // Not available in Basic Display API
        following_count: 0, // Not available in Basic Display API
        media_count: media.data ? media.data.length : 0,
        engagement_rate: 0,
        avg_likes: 0,
        avg_comments: 0,
        reach: 0, // Not available in Basic Display API
        impressions: 0, // Not available in Basic Display API
        profile_views: 0, // Not available in Basic Display API
        website_clicks: 0, // Not available in Basic Display API
        email_contacts: 0, // Not available in Basic Display API
        phone_contacts: 0, // Not available in Basic Display API
        get_directions: 0, // Not available in Basic Display API
        text_message: 0, // Not available in Basic Display API
        last_updated: new Date().toISOString()
      };

      // Note: Instagram Basic Display API doesn't provide likes/comments count
      // These would require Instagram Business API with proper app review
      console.warn('Instagram Basic Display API has limited metrics. Consider upgrading to Instagram Business API for full insights.');

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
