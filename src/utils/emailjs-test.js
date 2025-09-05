// EmailJS Test Script - Run this in browser console to test EmailJS setup
// Make sure to run this on your localhost with the dev server running

import emailjs from '@emailjs/browser';

const testEmailJS = async () => {
    console.log('🚀 Testing EmailJS Configuration...');

    // Configuration from env
    const config = {
        SERVICE_ID: 'service_fci94vx',
        TEMPLATE_ID: 'template_j3jgv8t',
        PUBLIC_KEY: 'zzT1lLEWdks8CyaAJ'
    };

    console.log('📋 Config:', config);

    // Initialize EmailJS
    emailjs.init(config.PUBLIC_KEY);
    console.log('✅ EmailJS initialized');

    // Test data
    const testData = {
        from_name: 'Test User',
        from_email: 'test@example.com',
        subject: 'Test Email from Contact Form',
        message: 'This is a test message to verify EmailJS is working correctly.',
        reply_to: 'test@example.com',
        to_name: 'SMM Team',
        sent_at: new Date().toLocaleString(),
    };

    try {
        console.log('📧 Sending test email...');
        const result = await emailjs.send(
            config.SERVICE_ID,
            config.TEMPLATE_ID,
            testData
        );

        console.log('✅ Success!', result);
        return { success: true, result };

    } catch (error) {
        console.error('❌ Error:', error);

        // Detailed error analysis
        console.log('🔍 Error details:');
        console.log('- Name:', error.name);
        console.log('- Status:', error.status);
        console.log('- Text:', error.text);
        console.log('- Message:', error.message);

        return { success: false, error };
    }
};

// Export for use
window.testEmailJS = testEmailJS;

console.log('📞 EmailJS Test Script Loaded!');
console.log('Run testEmailJS() in console to test your setup');
