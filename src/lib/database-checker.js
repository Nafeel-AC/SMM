// Database checker utility to verify Supabase setup
import { supabase } from './supabase';

export class DatabaseChecker {
  static async checkDatabaseSetup() {
    console.log('🔍 Starting comprehensive database setup check...');
    
    const results = {
      tables: {},
      rls: {},
      policies: {},
      overall: 'unknown'
    };
    
    try {
      // Check if tables exist
      const tables = [
        'profiles',
        'user_requirements', 
        'instagram_accounts',
        'instagram_insights',
        'payments',
        'staff_assignments',
        'dashboard_targets',
        'support_chats'
      ];
      
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          results.tables[table] = {
            exists: !error,
            error: error?.message || null,
            hasData: data && data.length > 0
          };
          
          console.log(`🔍 Table ${table}:`, results.tables[table]);
        } catch (err) {
          results.tables[table] = {
            exists: false,
            error: err.message,
            hasData: false
          };
          console.log(`❌ Table ${table} error:`, err.message);
        }
      }
      
      // Check RLS status
      const rlsQuery = `
        SELECT 
          schemaname,
          tablename,
          rowsecurity as rls_enabled
        FROM pg_tables 
        WHERE schemaname = 'public' 
          AND tablename IN ('profiles', 'user_requirements', 'instagram_accounts', 'instagram_insights')
        ORDER BY tablename;
      `;
      
      try {
        const { data: rlsData, error: rlsError } = await supabase.rpc('exec_sql', { 
          sql: rlsQuery 
        });
        
        if (rlsData) {
          rlsData.forEach(row => {
            results.rls[row.tablename] = row.rls_enabled;
          });
        }
      } catch (err) {
        console.log('⚠️ Could not check RLS status (this is normal for some setups)');
      }
      
      // Determine overall status
      const tableExists = Object.values(results.tables).every(t => t.exists);
      results.overall = tableExists ? 'ready' : 'needs_setup';
      
      console.log('🔍 Database check complete:', results);
      return results;
      
    } catch (error) {
      console.error('❌ Database check failed:', error);
      results.overall = 'error';
      results.error = error.message;
      return results;
    }
  }
  
  static async createMissingTables() {
    console.log('🔧 Attempting to create missing tables...');
    
    // This would require server-side execution, so we'll just log what needs to be done
    console.log('📋 To fix database issues, run the following SQL in your Supabase SQL editor:');
    console.log('📋 Copy and paste the contents of sql/safe_database_setup.sql');
    console.log('📋 This will create all necessary tables, indexes, and RLS policies');
    
    return {
      success: false,
      message: 'Please run the SQL setup script in Supabase dashboard',
      sqlFile: 'sql/safe_database_setup.sql'
    };
  }
  
  static async testDataInsertion(userId) {
    console.log('🧪 Testing data insertion capabilities...');
    
    try {
      // Test inserting into profiles (should work if user exists)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.log('❌ Profile not found, creating test profile...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            full_name: 'Test User',
            email: 'test@example.com',
            role: 'user'
          })
          .select()
          .single();
        
        if (createError) {
          console.error('❌ Could not create test profile:', createError);
          return { success: false, error: createError.message };
        }
        
        console.log('✅ Test profile created:', newProfile);
      } else {
        console.log('✅ Profile exists:', profileData);
      }
      
      // Test inserting Instagram account
      const testInstagramData = {
        user_id: userId,
        instagram_user_id: 'test_instagram_123',
        username: 'test_instagram_user',
        access_token: 'test_access_token',
        connected_at: new Date().toISOString()
      };
      
      const { data: instagramData, error: instagramError } = await supabase
        .from('instagram_accounts')
        .insert(testInstagramData)
        .select()
        .single();
      
      if (instagramError) {
        console.error('❌ Could not insert Instagram account:', instagramError);
        return { success: false, error: instagramError.message };
      }
      
      console.log('✅ Instagram account inserted:', instagramData);
      
      // Clean up test data
      await supabase
        .from('instagram_accounts')
        .delete()
        .eq('id', instagramData.id);
      
      console.log('✅ Test data cleaned up');
      
      return { success: true, message: 'Data insertion test passed' };
      
    } catch (error) {
      console.error('❌ Data insertion test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

export default DatabaseChecker;
