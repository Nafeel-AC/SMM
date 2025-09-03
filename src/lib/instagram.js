// Instagram Graph API service
import { supabase } from './supabase';

const INSTAGRAM_BASIC_API_BASE = 'https://graph.instagram.com';
const FACEBOOK_API_BASE = 'https://graph.facebook.com/v18.0';
const FACEBOOK_AUTH_BASE = 'https://www.facebook.com/v18.0/dialog/oauth';

class InstagramService {
  constructor() {
    this.appId = import.meta.env.VITE_INSTAGRAM_APP_ID;
    this.appSecret = import.meta.env.VITE_INSTAGRAM_APP_SECRET;
    this.redirectUri = import.meta.env.VITE_INSTAGRAM_REDIRECT_URI;
  }

  // Generate Facebook OAuth URL for Instagram Graph API access
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.appId,
      redirect_uri: this.redirectUri,
      scope: 'instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement,business_management',
      response_type: 'code',
      state: 'instagram_auth'
    });

    return `${FACEBOOK_AUTH_BASE}?${params.toString()}`;
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

  // Get long-lived Facebook user access token
  async getLongLivedToken(shortLivedToken) {
    try {
      const url = new URL(`${FACEBOOK_API_BASE.replace('/v18.0','')}/oauth/access_token`);
      url.searchParams.append('grant_type', 'fb_exchange_token');
      url.searchParams.append('client_id', this.appId);
      url.searchParams.append('client_secret', this.appSecret);
      url.searchParams.append('fb_exchange_token', shortLivedToken);

      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error getting long-lived token:', error);
      throw error;
    }
  }

  // Resolve Instagram Business account from Facebook Pages
  async resolveInstagramUserFromPages(accessToken) {
    try {
      const pagesResponse = await fetch(`${FACEBOOK_API_BASE}/me/accounts?fields=name,access_token,connected_instagram_account&access_token=${accessToken}`);

      if (!pagesResponse.ok) {
        throw new Error(`Failed to fetch pages: ${pagesResponse.status}`);
      }

      const pagesData = await pagesResponse.json();
      if (!pagesData.data || pagesData.data.length === 0) {
        throw new Error('No Facebook Pages found. You need a Facebook Page connected to an Instagram Business account.');
      }

      const pageWithIg = pagesData.data.find(p => p.connected_instagram_account && p.connected_instagram_account.id);
      if (!pageWithIg) {
        throw new Error('No Instagram Business account connected to any Facebook Page. Please connect your Instagram Business account to a Facebook Page.');
      }

      return {
        pageId: pageWithIg.id,
        pageAccessToken: pageWithIg.access_token,
        igUserId: pageWithIg.connected_instagram_account.id
      };
    } catch (error) {
      console.error('Error resolving Instagram user from Pages:', error);
      throw error;
    }
  }

  // Get Instagram Business profile using Graph API
  async getInstagramProfile(igUserId, accessToken) {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/${igUserId}?fields=id,username,followers_count,follows_count,media_count&access_token=${accessToken}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch Instagram profile: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting Instagram profile:', error);
      throw error;
    }
  }

  // Get Instagram media using Graph API
  async getInstagramMedia(igUserId, accessToken, limit = 25) {
    try {
      const response = await fetch(`${FACEBOOK_API_BASE}/${igUserId}/media?fields=id,caption,media_type,like_count,comments_count,timestamp&limit=${limit}&access_token=${accessToken}`);
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

  // Fetch and save Instagram insights using Graph API
  async fetchAndSaveInsights(userId, accessToken) {
    try {
      // Resolve Instagram Business account from Facebook Pages
      const { igUserId, pageAccessToken } = await this.resolveInstagramUserFromPages(accessToken);

      // Get Instagram profile
      const profile = await this.getInstagramProfile(igUserId, pageAccessToken);
      
      // Get recent media
      const media = await this.getInstagramMedia(igUserId, pageAccessToken, 25);
      
      // Calculate insights from media data
      const insights = {
        followers_count: profile.followers_count || 0,
        following_count: profile.follows_count || 0,
        media_count: profile.media_count || 0,
        engagement_rate: 0,
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

      // Calculate engagement metrics from recent posts
      if (media.data && media.data.length > 0) {
        let totalLikes = 0;
        let totalComments = 0;
        const recentPosts = media.data.slice(0, 10); // Analyze last 10 posts

        for (const mediaItem of recentPosts) {
          totalLikes += mediaItem.like_count || 0;
          totalComments += mediaItem.comments_count || 0;
        }

        const postCount = recentPosts.length;
        insights.avg_likes = Math.round(totalLikes / postCount);
        insights.avg_comments = Math.round(totalComments / postCount);
        
        // Calculate engagement rate
        const totalEngagement = totalLikes + totalComments;
        const totalFollowers = insights.followers_count;
        if (totalFollowers > 0 && postCount > 0) {
          insights.engagement_rate = parseFloat(((totalEngagement / postCount) / totalFollowers * 100).toFixed(2));
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
