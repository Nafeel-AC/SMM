// Script to add sample data to Firebase for testing
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';

export const addSampleData = {
  // Add sample user profiles
  async addSampleProfiles() {
    console.log('📝 Adding sample user profiles...');
    
    const sampleProfiles = [
      {
        id: 'sample_user_1',
        full_name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        instagram_connected: true,
        requirements_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'sample_user_2',
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        instagram_connected: true,
        requirements_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'sample_user_3',
        full_name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'user',
        instagram_connected: false,
        requirements_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'sample_staff_1',
        full_name: 'Sarah Wilson',
        email: 'sarah@example.com',
        role: 'staff',
        instagram_connected: true,
        requirements_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'sample_admin_1',
        full_name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        instagram_connected: true,
        requirements_completed: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const profile of sampleProfiles) {
      try {
        await setDoc(doc(db, 'profiles', profile.id), profile);
        console.log(`✅ Added profile: ${profile.full_name}`);
      } catch (error) {
        console.error(`❌ Error adding profile ${profile.full_name}:`, error);
      }
    }
  },

  // Add sample Instagram accounts
  async addSampleInstagramAccounts() {
    console.log('📱 Adding sample Instagram accounts...');
    
    const sampleAccounts = [
      {
        user_id: 'sample_user_1',
        instagram_user_id: 'instagram_user_123',
        username: 'johndoe_business',
        access_token: 'sample_access_token_1',
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString()
      },
      {
        user_id: 'sample_user_2',
        instagram_user_id: 'instagram_user_456',
        username: 'janesmith_creative',
        access_token: 'sample_access_token_2',
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString()
      },
      {
        user_id: 'sample_staff_1',
        instagram_user_id: 'instagram_user_789',
        username: 'sarahwilson_staff',
        access_token: 'sample_access_token_3',
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString()
      }
    ];

    for (const account of sampleAccounts) {
      try {
        await addDoc(collection(db, 'instagram_accounts'), account);
        console.log(`✅ Added Instagram account: ${account.username}`);
      } catch (error) {
        console.error(`❌ Error adding Instagram account ${account.username}:`, error);
      }
    }
  },

  // Add sample Instagram insights
  async addSampleInstagramInsights() {
    console.log('📊 Adding sample Instagram insights...');
    
    const sampleInsights = [
      {
        user_id: 'sample_user_1',
        followers_count: 1250,
        following_count: 320,
        media_count: 25,
        engagement_rate: 4.2,
        avg_likes: 85,
        avg_comments: 12,
        reach: 980,
        impressions: 1250,
        profile_views: 45,
        website_clicks: 12,
        email_contacts: 3,
        phone_contacts: 2,
        get_directions: 1,
        text_message: 0,
        last_updated: new Date().toISOString()
      },
      {
        user_id: 'sample_user_2',
        followers_count: 2100,
        following_count: 450,
        media_count: 42,
        engagement_rate: 5.8,
        avg_likes: 120,
        avg_comments: 18,
        reach: 1650,
        impressions: 2100,
        profile_views: 78,
        website_clicks: 25,
        email_contacts: 8,
        phone_contacts: 5,
        get_directions: 3,
        text_message: 1,
        last_updated: new Date().toISOString()
      },
      {
        user_id: 'sample_staff_1',
        followers_count: 850,
        following_count: 200,
        media_count: 15,
        engagement_rate: 3.5,
        avg_likes: 65,
        avg_comments: 8,
        reach: 720,
        impressions: 850,
        profile_views: 32,
        website_clicks: 8,
        email_contacts: 2,
        phone_contacts: 1,
        get_directions: 0,
        text_message: 0,
        last_updated: new Date().toISOString()
      }
    ];

    for (const insight of sampleInsights) {
      try {
        await addDoc(collection(db, 'instagram_insights'), insight);
        console.log(`✅ Added Instagram insights for user: ${insight.user_id}`);
      } catch (error) {
        console.error(`❌ Error adding Instagram insights for user ${insight.user_id}:`, error);
      }
    }
  },

  // Add sample user requirements
  async addSampleUserRequirements() {
    console.log('📋 Adding sample user requirements...');
    
    const sampleRequirements = [
      {
        user_id: 'sample_user_1',
        business_type: 'E-commerce',
        posting_frequency: 'Daily',
        budget_range: '$500-1000',
        target_audience: 'Young adults 18-35',
        goals: 'Increase brand awareness and drive sales',
        content_preferences: 'Product photos, lifestyle content, user-generated content',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        user_id: 'sample_user_2',
        business_type: 'Creative Services',
        posting_frequency: '3-4 times per week',
        budget_range: '$300-500',
        target_audience: 'Creative professionals and small businesses',
        goals: 'Showcase portfolio and attract new clients',
        content_preferences: 'Behind-the-scenes, finished work, client testimonials',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    for (const requirement of sampleRequirements) {
      try {
        await addDoc(collection(db, 'user_requirements'), requirement);
        console.log(`✅ Added user requirements for user: ${requirement.user_id}`);
      } catch (error) {
        console.error(`❌ Error adding user requirements for user ${requirement.user_id}:`, error);
      }
    }
  },

  // Add sample support chats
  async addSampleSupportChats() {
    console.log('💬 Adding sample support chats...');
    
    const sampleChats = [
      {
        user_id: 'sample_user_1',
        message: 'Hi, I need help with my Instagram growth strategy.',
        sent_by: 'user',
        sent_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
      },
      {
        user_id: 'sample_user_1',
        message: 'Hello! I\'d be happy to help you with your Instagram growth strategy. What specific areas would you like to focus on?',
        sent_by: 'staff',
        staff_id: 'sample_staff_1',
        sent_at: new Date(Date.now() - 86300000).toISOString() // 1 day ago + 10 minutes
      },
      {
        user_id: 'sample_user_2',
        message: 'My engagement rate has been dropping lately. Any suggestions?',
        sent_by: 'user',
        sent_at: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      },
      {
        user_id: 'sample_user_2',
        message: 'I can help you analyze your engagement patterns. Let me look at your recent posts and provide some recommendations.',
        sent_by: 'staff',
        staff_id: 'sample_staff_1',
        sent_at: new Date(Date.now() - 172700000).toISOString() // 2 days ago + 10 minutes
      }
    ];

    for (const chat of sampleChats) {
      try {
        await addDoc(collection(db, 'support_chats'), chat);
        console.log(`✅ Added support chat message`);
      } catch (error) {
        console.error(`❌ Error adding support chat message:`, error);
      }
    }
  },

  // Add all sample data
  async addAllSampleData() {
    console.log('🚀 Starting to add all sample data...');
    
    try {
      await this.addSampleProfiles();
      await this.addSampleInstagramAccounts();
      await this.addSampleInstagramInsights();
      await this.addSampleUserRequirements();
      await this.addSampleSupportChats();
      
      console.log('✅ All sample data added successfully!');
      return { success: true };
    } catch (error) {
      console.error('❌ Error adding sample data:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if sample data already exists
  async checkSampleDataExists() {
    console.log('🔍 Checking if sample data already exists...');
    
    try {
      const profilesSnapshot = await getDocs(collection(db, 'profiles'));
      const instagramAccountsSnapshot = await getDocs(collection(db, 'instagram_accounts'));
      const insightsSnapshot = await getDocs(collection(db, 'instagram_insights'));
      
      const hasProfiles = !profilesSnapshot.empty;
      const hasAccounts = !instagramAccountsSnapshot.empty;
      const hasInsights = !insightsSnapshot.empty;
      
      console.log('📊 Sample data status:', {
        profiles: hasProfiles,
        instagram_accounts: hasAccounts,
        instagram_insights: hasInsights
      });
      
      return {
        hasData: hasProfiles || hasAccounts || hasInsights,
        profiles: hasProfiles,
        instagram_accounts: hasAccounts,
        instagram_insights: hasInsights
      };
    } catch (error) {
      console.error('❌ Error checking sample data:', error);
      return { hasData: false, error: error.message };
    }
  }
};

// Make it available globally for console access
if (typeof window !== 'undefined') {
  window.addSampleData = addSampleData;
}

export default addSampleData;
