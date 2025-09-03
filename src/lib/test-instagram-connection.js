// Test Instagram Connection Script
// This will test if the Instagram connection will work now

import { supabase } from './supabase';
import { instagramService } from './instagram';

export const testInstagramConnection = async (userId) => {
  console.log('🧪 Testing Instagram Connection...');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Check if user exists
    console.log('📋 Step 1: Checking user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.log('❌ User profile not found:', profileError.message);
      console.log('💡 This is normal for new users - profile will be created automatically');
    } else {
      console.log('✅ User profile found:', profile.email);
    }
    
    // Test 2: Check if Instagram accounts table exists
    console.log('📋 Step 2: Testing Instagram accounts table...');
    const { data: instagramData, error: instagramError } = await supabase
      .from('instagram_accounts')
      .select('id')
      .limit(1);
    
    if (instagramError) {
      console.log('❌ Instagram accounts table error:', instagramError.message);
      console.log('💡 Table needs to be created - run the SQL setup script');
      return { success: false, issue: 'tables_missing', error: instagramError.message };
    } else {
      console.log('✅ Instagram accounts table exists');
    }
    
    // Test 3: Check if Instagram insights table exists
    console.log('📋 Step 3: Testing Instagram insights table...');
    const { data: insightsData, error: insightsError } = await supabase
      .from('instagram_insights')
      .select('id')
      .limit(1);
    
    if (insightsError) {
      console.log('❌ Instagram insights table error:', insightsError.message);
      console.log('💡 Table needs to be created - run the SQL setup script');
      return { success: false, issue: 'tables_missing', error: insightsError.message };
    } else {
      console.log('✅ Instagram insights table exists');
    }
    
    // Test 4: Try to run the Instagram connection
    console.log('📋 Step 4: Testing Instagram connection flow...');
    const result = await instagramService.connectInstagramAccount(userId);
    
    if (result.success) {
      console.log('✅ Instagram connection test passed!');
      return { success: true, message: 'Instagram connection is working' };
    } else {
      console.log('❌ Instagram connection test failed');
      return { success: false, issue: 'connection_failed', error: result.error };
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return { success: false, issue: 'test_error', error: error.message };
  }
};

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  window.testInstagramConnection = testInstagramConnection;
}

export default testInstagramConnection;
