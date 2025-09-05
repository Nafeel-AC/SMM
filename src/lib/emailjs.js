// EmailJS configuration
export const EMAILJS_CONFIG = {
    SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
    TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
};

// Validation function to check if all required EmailJS env vars are set
export const validateEmailJSConfig = () => {
    const { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY } = EMAILJS_CONFIG;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
        console.error('EmailJS configuration missing. Please set the following environment variables:');
        console.error('VITE_EMAILJS_SERVICE_ID');
        console.error('VITE_EMAILJS_TEMPLATE_ID');
        console.error('VITE_EMAILJS_PUBLIC_KEY');
        return false;
    }

    return true;
};
