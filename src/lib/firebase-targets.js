import { firebaseDb } from './firebase-db';

class FirebaseTargetsService {
  constructor() {
    // Dashboard targets service
  }

  // Create or update dashboard targets for a user
  async setDashboardTargets(userId, targetsData) {
    try {
      // Check if targets already exist
      const existingResult = await firebaseDb.getDashboardTargets(userId);
      
      if (existingResult.data) {
        // Update existing targets
        const result = await firebaseDb.updateDashboardTargets(existingResult.data.id, targetsData);
        return result;
      } else {
        // Create new targets
        const newTargetsData = {
          user_id: userId,
          ...targetsData,
          created_at: new Date().toISOString()
        };
        
        const result = await firebaseDb.saveDashboardTargets(newTargetsData);
        return result;
      }
    } catch (error) {
      console.error('Error setting dashboard targets:', error);
      throw error;
    }
  }

  // Get dashboard targets for a user
  async getDashboardTargets(userId) {
    try {
      const result = await firebaseDb.getDashboardTargets(userId);
      return result;
    } catch (error) {
      console.error('Error getting dashboard targets:', error);
      throw error;
    }
  }

  // Update specific target values
  async updateTarget(userId, targetType, value) {
    try {
      const targetsResult = await firebaseDb.getDashboardTargets(userId);
      
      if (targetsResult.error || !targetsResult.data) {
        // Create new targets if they don't exist
        const newTargets = {
          user_id: userId,
          [targetType]: value,
          created_at: new Date().toISOString()
        };
        
        return await firebaseDb.saveDashboardTargets(newTargets);
      } else {
        // Update existing targets
        const updates = {
          [targetType]: value
        };
        
        return await firebaseDb.updateDashboardTargets(targetsResult.data.id, updates);
      }
    } catch (error) {
      console.error('Error updating target:', error);
      throw error;
    }
  }

  // Get target progress for a user
  async getTargetProgress(userId) {
    try {
      // Get user's targets
      const targetsResult = await firebaseDb.getDashboardTargets(userId);
      if (targetsResult.error || !targetsResult.data) {
        return { data: null, error: 'No targets set' };
      }

      // Get user's Instagram insights
      const insightsResult = await firebaseDb.getInstagramInsights(userId);
      if (insightsResult.error || !insightsResult.data) {
        return { data: null, error: 'No Instagram data available' };
      }

      const targets = targetsResult.data;
      const insights = insightsResult.data;

      // Calculate progress
      const progress = {
        followers: {
          target: targets.target_followers || 0,
          current: insights.followers_count || 0,
          progress: targets.target_followers > 0 ? 
            Math.min((insights.followers_count / targets.target_followers) * 100, 100) : 0
        },
        engagement: {
          target: targets.target_engagement_rate || 0,
          current: insights.engagement_rate || 0,
          progress: targets.target_engagement_rate > 0 ? 
            Math.min((insights.engagement_rate / targets.target_engagement_rate) * 100, 100) : 0
        },
        posts_per_day: {
          target: targets.target_posts_per_day || 0,
          current: this.calculatePostsPerDay(insights.media_count, insights.last_updated),
          progress: targets.target_posts_per_day > 0 ? 
            Math.min((this.calculatePostsPerDay(insights.media_count, insights.last_updated) / targets.target_posts_per_day) * 100, 100) : 0
        }
      };

      return { data: progress, error: null };
    } catch (error) {
      console.error('Error getting target progress:', error);
      return { data: null, error };
    }
  }

  // Calculate posts per day based on media count and account age
  calculatePostsPerDay(mediaCount, lastUpdated) {
    if (!mediaCount || !lastUpdated) return 0;
    
    const accountAge = (new Date() - new Date(lastUpdated)) / (1000 * 60 * 60 * 24); // days
    return accountAge > 0 ? mediaCount / accountAge : 0;
  }

  // Get all users with targets (admin/staff)
  async getAllUsersWithTargets() {
    try {
      const result = await firebaseDb.getAllUsers();
      if (result.error) throw result.error;

      const usersWithTargets = [];
      
      for (const user of result.data) {
        const targetsResult = await firebaseDb.getDashboardTargets(user.id);
        if (targetsResult.data) {
          usersWithTargets.push({
            user: user,
            targets: targetsResult.data
          });
        }
      }

      return { data: usersWithTargets, error: null };
    } catch (error) {
      console.error('Error getting all users with targets:', error);
      return { data: null, error };
    }
  }

  // Get target achievement statistics
  async getTargetAchievementStats() {
    try {
      const usersWithTargetsResult = await this.getAllUsersWithTargets();
      if (usersWithTargetsResult.error) throw usersWithTargetsResult.error;

      const usersWithTargets = usersWithTargetsResult.data;
      let totalUsers = usersWithTargets.length;
      let followersGoalMet = 0;
      let engagementGoalMet = 0;
      let postsGoalMet = 0;
      let allGoalsMet = 0;

      for (const { user, targets } of usersWithTargets) {
        const progressResult = await this.getTargetProgress(user.id);
        if (progressResult.error || !progressResult.data) continue;

        const progress = progressResult.data;
        
        if (progress.followers.progress >= 100) followersGoalMet++;
        if (progress.engagement.progress >= 100) engagementGoalMet++;
        if (progress.posts_per_day.progress >= 100) postsGoalMet++;
        
        if (progress.followers.progress >= 100 && 
            progress.engagement.progress >= 100 && 
            progress.posts_per_day.progress >= 100) {
          allGoalsMet++;
        }
      }

      const stats = {
        total_users_with_targets: totalUsers,
        followers_goal_achieved: followersGoalMet,
        engagement_goal_achieved: engagementGoalMet,
        posts_goal_achieved: postsGoalMet,
        all_goals_achieved: allGoalsMet,
        followers_success_rate: totalUsers > 0 ? (followersGoalMet / totalUsers * 100).toFixed(2) : 0,
        engagement_success_rate: totalUsers > 0 ? (engagementGoalMet / totalUsers * 100).toFixed(2) : 0,
        posts_success_rate: totalUsers > 0 ? (postsGoalMet / totalUsers * 100).toFixed(2) : 0,
        overall_success_rate: totalUsers > 0 ? (allGoalsMet / totalUsers * 100).toFixed(2) : 0
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting target achievement stats:', error);
      return { data: null, error };
    }
  }

  // Get recommended targets based on user's current performance
  async getRecommendedTargets(userId) {
    try {
      const insightsResult = await firebaseDb.getInstagramInsights(userId);
      if (insightsResult.error || !insightsResult.data) {
        return { data: null, error: 'No Instagram data available' };
      }

      const insights = insightsResult.data;
      const currentFollowers = insights.followers_count || 0;
      const currentEngagement = insights.engagement_rate || 0;
      const currentPosts = insights.media_count || 0;

      // Calculate recommended targets based on current performance
      const recommendations = {
        target_followers: Math.round(currentFollowers * 1.5), // 50% growth target
        target_engagement_rate: Math.min(currentEngagement * 1.2, 10), // 20% improvement, max 10%
        target_posts_per_day: Math.max(1, Math.round(currentPosts / 30)), // Based on current posting frequency
        additional_notes: this.generateTargetNotes(currentFollowers, currentEngagement)
      };

      return { data: recommendations, error: null };
    } catch (error) {
      console.error('Error getting recommended targets:', error);
      return { data: null, error };
    }
  }

  // Generate target notes based on current performance
  generateTargetNotes(followers, engagement) {
    const notes = [];
    
    if (followers < 1000) {
      notes.push("Focus on consistent content creation to build initial audience");
    } else if (followers < 10000) {
      notes.push("Great start! Focus on engagement and community building");
    } else {
      notes.push("Excellent growth! Consider advanced strategies and collaborations");
    }

    if (engagement < 3) {
      notes.push("Work on improving content quality and audience interaction");
    } else if (engagement < 6) {
      notes.push("Good engagement rate! Keep up the quality content");
    } else {
      notes.push("Outstanding engagement! You're doing great!");
    }

    return notes.join(". ");
  }
}

export const firebaseTargetsService = new FirebaseTargetsService();
