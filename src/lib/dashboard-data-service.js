import { firebaseDb } from './firebase-db';

class DashboardDataService {
  // Expose getAllStaff for staff assignment
  async getAllStaff() {
    return this.db.getAllStaff();
  }
  constructor() {
    this.db = firebaseDb;
  }

  // Get comprehensive dashboard data for a user
  async getDashboardData(userId) {
    try {
      console.log('🔍 Fetching dashboard data for user:', userId);

      // Fetch all related data in parallel
      const [
        insightsResult,
        requirementsResult,
        targetsResult,
        profileResult
      ] = await Promise.all([
        this.db.getInstagramInsights(userId),
        this.db.getUserRequirements(userId),
        this.db.getDashboardTargets(userId),
        this.db.getProfile(userId)
      ]);

      // Process insights data
      const insights = insightsResult.data || this.getMockInsights();

      // Process requirements data
      const requirements = requirementsResult.data || this.getMockRequirements();

      // Process targets data
      const targets = targetsResult.data || this.getMockTargets();

      // Process profile data
      const profile = profileResult.data || this.getMockProfile();

      // Generate chart data based on insights
      const chartData = this.generateChartData(insights);

      // Combine all data
      const dashboardData = {
        insights: {
          ...insights,
          chartData
        },
        requirements,
        targets,
        profile,
        hashtags: this.getMockHashtags(),
        accounts: this.getMockAccounts(),
        strategy: this.getMockStrategy(requirements)
      };

      console.log('✅ Dashboard data fetched successfully:', dashboardData);
      return { data: dashboardData, error: null };

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      return { data: null, error };
    }
  }

  // Generate mock insights data
  getMockInsights() {
    return {
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
  }

  // Generate mock requirements data
  getMockRequirements() {
    return {
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
  }

  // Generate mock targets data
  getMockTargets() {
    return {
      target_followers: 5000,
      target_engagement_rate: 6.0,
      target_posts_per_day: 2,
      target_reach: 3000,
      target_website_clicks: 50,
      target_email_contacts: 20
    };
  }

  // Generate mock profile data
  getMockProfile() {
    return {
      display_name: 'Wellness Traveler',
      email: 'user@example.com',
      instagram_connected: true,
      subscription_status: 'active',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days ago
    };
  }

  // Generate chart data based on insights
  generateChartData(insights) {
    const currentFollowers = insights.followers_count || 1381;
    const currentFollowing = insights.following_count || 676;

    // Generate historical data for the last 6 months
    const months = ['March', 'April', 'May', 'June', 'July', 'August'];
    const chartData = [];

    // Calculate starting values (assume growth over 6 months)
    const followersGrowth = currentFollowers * 0.7; // 70% of current
    const followingGrowth = currentFollowing * 0.8; // 80% of current

    months.forEach((month, index) => {
      const progress = (index + 1) / months.length;
      const followers = Math.round(followersGrowth + (currentFollowers - followersGrowth) * progress);
      const following = Math.round(followingGrowth + (currentFollowing - followingGrowth) * progress);

      chartData.push({
        month,
        followers,
        following
      });
    });

    return chartData;
  }

  // Get mock hashtags data
  getMockHashtags() {
    return {
      predefined: [
        '#WanderAlign', '#TravelWithPurpose', '#MindfulTravel', '#AlignYourJourney',
        '#ExploreWithIntention', '#ConsciousTravel', '#WanderlustWithPurpose', '#AlignYourPath',
        '#PurposefulTravel', '#MindfulAdventures', '#TravelInspiration', '#ExploreAndAlign',
        '#JourneyWithin', '#TravelAlignment', '#TravelForGrowth', '#ConsciousExploration',
        '#HolisticTravel', '#SoulfulJourneys', '#InnerAlignment', '#WanderWithMeaning'
      ],
      selected: [
        { id: 1, hashtag: '#WanderAlign', posts: 12 },
        { id: 2, hashtag: '#TravelWithPurpose', posts: 8 },
        { id: 3, hashtag: '#MindfulTravel', posts: 15 },
        { id: 4, hashtag: '#AlignYourJourney', posts: 6 }
      ]
    };
  }

  // Get mock accounts data
  getMockAccounts() {
    return {
      bulk: '@@payalsharmanyc @Wealthywomansecrets @Female @Female.focuses @@bossbabeclubs @Facelessmarketingcollective @travelmorewithsimon',
      selected: [
        { id: 1, account: '@@payalsharmanyc' },
        { id: 2, account: '@Wealthywomansecrets' },
        { id: 3, account: '@Female' },
        { id: 4, account: '@@bossbabeclubs' }
      ]
    };
  }

  // Get mock strategy data
  getMockStrategy(requirements) {
    return {
      target_locations: requirements?.target_locations || ['USA', 'New York', 'India', 'Canada', 'Chicago'],
      target_audience: requirements?.target_audience || [
        'Minimalist', 'Travel', 'Wellness', 'fitness', 'healthyfood',
        'facelessinstagram', 'quotes', 'aesthetic vibes', 'health tips',
        'wellness resort', 'yoga and zen mode', 'Journaling and vision boards'
      ]
    };
  }

  // Save dashboard settings (hashtags, accounts, etc.)
  async saveDashboardSettings(userId, settings) {
    try {
      const settingsData = {
        user_id: userId,
        hashtags: settings.hashtags || [],
        accounts: settings.accounts || [],
        strategy: settings.strategy || {},
        updated_at: new Date().toISOString()
      };

      const result = await this.db.addDocument('dashboard_settings', settingsData);
      return result;
    } catch (error) {
      console.error('Error saving dashboard settings:', error);
      return { data: null, error };
    }
  }

  // Get dashboard settings
  async getDashboardSettings(userId) {
    try {
      const result = await this.db.getDocumentsByField('dashboard_settings', 'user_id', userId);
      if (result.error || !result.data || result.data.length === 0) {
        return { data: null, error: 'No settings found' };
      }

      // Return the most recent settings
      return { data: result.data[0], error: null };
    } catch (error) {
      console.error('Error getting dashboard settings:', error);
      return { data: null, error };
    }
  }

  // Update specific dashboard component data
  async updateHashtags(userId, hashtags) {
    try {
      const settingsResult = await this.getDashboardSettings(userId);
      if (settingsResult.error) {
        // Create new settings
        return await this.saveDashboardSettings(userId, { hashtags });
      } else {
        // Update existing settings
        const updates = { hashtags, updated_at: new Date().toISOString() };
        return await this.db.updateDocument('dashboard_settings', settingsResult.data.id, updates);
      }
    } catch (error) {
      console.error('Error updating hashtags:', error);
      return { data: null, error };
    }
  }

  async updateAccounts(userId, accounts) {
    try {
      const settingsResult = await this.getDashboardSettings(userId);
      if (settingsResult.error) {
        // Create new settings
        return await this.saveDashboardSettings(userId, { accounts });
      } else {
        // Update existing settings
        const updates = { accounts, updated_at: new Date().toISOString() };
        return await this.db.updateDocument('dashboard_settings', settingsResult.data.id, updates);
      }
    } catch (error) {
      console.error('Error updating accounts:', error);
      return { data: null, error };
    }
  }

  async updateStrategy(userId, strategy) {
    try {
      const settingsResult = await this.getDashboardSettings(userId);
      if (settingsResult.error) {
        // Create new settings
        return await this.saveDashboardSettings(userId, { strategy });
      } else {
        // Update existing settings
        const updates = { strategy, updated_at: new Date().toISOString() };
        return await this.db.updateDocument('dashboard_settings', settingsResult.data.id, updates);
      }
    } catch (error) {
      console.error('Error updating strategy:', error);
      return { data: null, error };
    }
  }

  // Update user requirements in Firestore
  async updateUserRequirements(userId, updates) {
    try {
      // Get the requirements document for the user
      const result = await this.db.getDocumentsByField('user_requirements', 'user_id', userId);
      if (result.error || !result.data || result.data.length === 0) {
        return { data: null, error: 'No requirements found for user' };
      }
      const requirementsId = result.data[0].id;
      return await this.db.updateUserRequirements(requirementsId, updates);
    } catch (error) {
      console.error('Error updating user requirements:', error);
      return { data: null, error };
    }
  }
}

export const dashboardDataService = new DashboardDataService();
