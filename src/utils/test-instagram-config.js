// test-instagram-config.js
// Test Instagram configuration to debug redirect_uri issues

export function testInstagramConfig() {
  console.log('🔧 Testing Instagram Configuration...');
  
  // Get environment variables
  const clientId = import.meta.env.VITE_IG_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_IG_REDIRECT_URI;
  
  console.log('📋 Configuration:');
  console.log('  Client ID:', clientId);
  console.log('  Redirect URI:', redirectUri);
  
  // Check if variables are loaded
  if (!clientId) {
    console.error('❌ VITE_IG_CLIENT_ID is not set');
    return false;
  }
  
  if (!redirectUri) {
    console.error('❌ VITE_IG_REDIRECT_URI is not set');
    return false;
  }
  
  // Validate redirect URI format
  try {
    const url = new URL(redirectUri);
    if (url.protocol !== 'https:') {
      console.error('❌ Redirect URI must use HTTPS');
      return false;
    }
    
    if (!redirectUri.endsWith('/instagram/callback')) {
      console.error('❌ Redirect URI must end with /instagram/callback');
      return false;
    }
    
    console.log('✅ Redirect URI format is correct');
  } catch (error) {
    console.error('❌ Invalid redirect URI format:', error.message);
    return false;
  }
  
  // Generate test URL
  const testUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_business_basic&response_type=code`;
  
  console.log('🔗 Generated Instagram OAuth URL:');
  console.log(testUrl);
  
  console.log('📝 Make sure this redirect URI is added to your Meta App Dashboard:');
  console.log('   ', redirectUri);
  
  return true;
}

// Auto-run test when imported
if (typeof window !== 'undefined') {
  testInstagramConfig();
}
