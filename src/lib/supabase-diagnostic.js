// Supabase Diagnostic Script - Run this to find the root cause
import { supabase } from './supabase';

export class SupabaseDiagnostic {
  static async runFullDiagnostic() {
    console.log('🔍 Starting Supabase Diagnostic...');
    console.log('='.repeat(50));
    
    const results = {
      config: {},
      connection: {},
      tables: {},
      auth: {},
      rls: {},
      summary: {}
    };
    
    try {
      // 1. Check Configuration
      console.log('📋 Step 1: Checking Configuration...');
      results.config = {
        url: import.meta.env.VITE_SUPABASE_URL ? 'Present' : 'Missing',
        key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
        urlValue: import.meta.env.VITE_SUPABASE_URL,
        keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0
      };
      console.log('✅ Config check:', results.config);
      
      // 2. Test Basic Connection
      console.log('📋 Step 2: Testing Basic Connection...');
      try {
        const startTime = Date.now();
        const { data, error } = await supabase.auth.getSession();
        const endTime = Date.now();
        
        results.connection = {
          success: !error,
          error: error?.message || null,
          responseTime: endTime - startTime,
          hasSession: !!data?.session
        };
        console.log('✅ Connection test:', results.connection);
      } catch (err) {
        results.connection = {
          success: false,
          error: err.message,
          responseTime: null
        };
        console.log('❌ Connection failed:', err.message);
      }
      
      // 3. Test Table Access (with timeout)
      console.log('📋 Step 3: Testing Table Access...');
      const tables = ['profiles', 'instagram_accounts', 'instagram_insights'];
      
      for (const table of tables) {
        try {
          console.log(`  Testing table: ${table}`);
          const startTime = Date.now();
          
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .limit(1);
          
          const endTime = Date.now();
          
          results.tables[table] = {
            exists: !error,
            error: error?.message || null,
            responseTime: endTime - startTime,
            hasData: data && data.length > 0,
            errorCode: error?.code || null,
            errorDetails: error?.details || null,
            errorHint: error?.hint || null
          };
          
          console.log(`  ✅ ${table}:`, results.tables[table]);
        } catch (err) {
          results.tables[table] = {
            exists: false,
            error: err.message,
            responseTime: null
          };
          console.log(`  ❌ ${table} error:`, err.message);
        }
      }
      
      // 4. Test Authentication
      console.log('📋 Step 4: Testing Authentication...');
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        results.auth = {
          success: !authError,
          error: authError?.message || null,
          hasUser: !!authData?.user,
          userId: authData?.user?.id || null
        };
        console.log('✅ Auth test:', results.auth);
      } catch (err) {
        results.auth = {
          success: false,
          error: err.message
        };
        console.log('❌ Auth test failed:', err.message);
      }
      
      // 5. Test Simple Query (no RLS)
      console.log('📋 Step 5: Testing Simple Query...');
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        results.simpleQuery = {
          success: !error,
          error: error?.message || null,
          errorCode: error?.code || null
        };
        console.log('✅ Simple query test:', results.simpleQuery);
      } catch (err) {
        results.simpleQuery = {
          success: false,
          error: err.message
        };
        console.log('❌ Simple query failed:', err.message);
      }
      
      // 6. Generate Summary
      console.log('📋 Step 6: Generating Summary...');
      results.summary = {
        configOk: results.config.url === 'Present' && results.config.key === 'Present',
        connectionOk: results.connection.success,
        tablesOk: Object.values(results.tables).every(t => t.exists),
        authOk: results.auth.success,
        overallStatus: 'unknown'
      };
      
      // Determine overall status
      if (results.summary.configOk && results.summary.connectionOk && results.summary.tablesOk) {
        results.summary.overallStatus = 'healthy';
      } else if (!results.summary.configOk) {
        results.summary.overallStatus = 'config_error';
      } else if (!results.summary.connectionOk) {
        results.summary.overallStatus = 'connection_error';
      } else if (!results.summary.tablesOk) {
        results.summary.overallStatus = 'tables_missing';
      } else {
        results.summary.overallStatus = 'unknown_error';
      }
      
      console.log('✅ Summary:', results.summary);
      
    } catch (error) {
      console.error('❌ Diagnostic failed:', error);
      results.error = error.message;
    }
    
    // 7. Print Recommendations
    console.log('='.repeat(50));
    console.log('📋 DIAGNOSTIC RECOMMENDATIONS:');
    console.log('='.repeat(50));
    
    if (results.summary.overallStatus === 'healthy') {
      console.log('✅ Supabase is working correctly!');
    } else if (results.summary.overallStatus === 'config_error') {
      console.log('❌ Configuration Error:');
      console.log('   - Check your .env file');
      console.log('   - Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
    } else if (results.summary.overallStatus === 'connection_error') {
      console.log('❌ Connection Error:');
      console.log('   - Check your internet connection');
      console.log('   - Verify Supabase URL is correct');
      console.log('   - Check if Supabase service is down');
    } else if (results.summary.overallStatus === 'tables_missing') {
      console.log('❌ Tables Missing:');
      console.log('   - Run the SQL setup script in Supabase dashboard');
      console.log('   - File: sql/safe_database_setup.sql');
      console.log('   - This will create all required tables');
    } else {
      console.log('❌ Unknown Error:');
      console.log('   - Check the detailed logs above');
      console.log('   - Contact support with the full diagnostic results');
    }
    
    console.log('='.repeat(50));
    console.log('🔍 Full Diagnostic Results:', results);
    console.log('='.repeat(50));
    
    return results;
  }
  
  // Quick test function
  static async quickTest() {
    console.log('⚡ Running Quick Supabase Test...');
    
    try {
      // Test 1: Config
      const hasConfig = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
      console.log('Config OK:', hasConfig);
      
      if (!hasConfig) {
        console.log('❌ Missing Supabase configuration');
        return { success: false, issue: 'config' };
      }
      
      // Test 2: Connection
      const { data, error } = await supabase.auth.getSession();
      console.log('Connection OK:', !error);
      
      if (error) {
        console.log('❌ Connection failed:', error.message);
        return { success: false, issue: 'connection', error: error.message };
      }
      
      // Test 3: Table
      const { data: tableData, error: tableError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      console.log('Tables OK:', !tableError);
      
      if (tableError) {
        console.log('❌ Table access failed:', tableError.message);
        return { success: false, issue: 'tables', error: tableError.message };
      }
      
      console.log('✅ All tests passed!');
      return { success: true };
      
    } catch (err) {
      console.log('❌ Quick test failed:', err.message);
      return { success: false, issue: 'unknown', error: err.message };
    }
  }
}

export default SupabaseDiagnostic;
