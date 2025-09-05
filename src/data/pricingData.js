/**
 * Pricing data for all plans and features
 */

const pricingData = {
    // Starter plan information
    plans: [
        {
            id: 'starter',
            name: 'Starter',
            description: 'Perfect for personal accounts seeking steady, organic growth and targeted global followers that align with your interests.',
            features: [
                'Real Instagram Followers',
                'Monthly growth Analytics',
                '24/7 Live Support',
                'Instagram Audit',
                'Cancel Anytime',
                'VPN Login Support',
                'Account Management',
                'Monthly Review'
            ],
            popular: false
        },
        {
            id: 'premium',
            name: 'Premium',
            description: 'Ideal for individuals and businesses looking to build a relevant local community with focused, location-based targeting and hands-on support.',
            features: [
                'Real Instagram Followers',
                'Monthly growth Analytics',
                '24/7 Live Support',
                'Instagram Audit',
                'Cancel Anytime',
                'Target by Hashtag',
                'Target by Influencer & competitor',
                'Targeting Optimization',
                'Gender',
                'VPN Login Support',
                'Account Management',
                'Monthly Review'
            ],
            popular: true
        },
        {
            id: 'ultimate',
            name: 'Ultimate',
            description: 'Designed for people building their brand with tailored engagement and advanced targeting to reach a specific audience with guidance from our top performers.',
            features: [
                'Real Instagram Followers',
                'Monthly growth Analytics',
                '24/7 Live Support',
                'Instagram Audit',
                'Cancel Anytime',
                'Target by Hashtag',
                'Target by Influencer & competitor',
                'Targeting Optimization',
                'Gender',
                'Comments',
                'Likes Posts',
                'VPN Login Support',
                'Like After Follow',
                'Tiktok Service',
                'Welcome DM',
                'Account Management',
                'Monthly Review'
            ],
            popular: false
        }
    ],

    // Pricing by billing cycle
    pricing: {
        monthly: {
            starter: 59,
            premium: 89,
            ultimate: 249
        },
        yearly: {
            starter: 579,
            premium: 829,
            ultimate: 1879
        }
    },

    // Feature categories for comparison table
    comparisonCategories: [
        {
            name: 'Core Features',
            items: [
                { name: 'Real Instagram Followers', starter: true, premium: true, ultimate: true },
                { name: 'Monthly growth Analytics', starter: true, premium: true, ultimate: true },
                { name: '24/7 Live Support', starter: true, premium: true, ultimate: true },
                { name: 'Instagram Audit', starter: true, premium: true, ultimate: true },
                { name: 'Cancel Anytime', starter: true, premium: true, ultimate: true },
                { name: 'VPN Login Support', starter: true, premium: true, ultimate: true },
                { name: 'Account Management', starter: true, premium: true, ultimate: true },
                { name: 'Monthly Review', starter: true, premium: true, ultimate: true }
            ]
        },
        {
            name: 'Advanced Targeting',
            items: [
                { name: 'Target by Hashtag', starter: false, premium: true, ultimate: true },
                { name: 'Target by Influencer & competitor', starter: false, premium: true, ultimate: true },
                { name: 'Targeting Optimization', starter: false, premium: true, ultimate: true },
                { name: 'Gender', starter: false, premium: true, ultimate: true }
            ]
        },
        {
            name: 'Premium Features',
            items: [
                { name: 'Comments', starter: false, premium: false, ultimate: true },
                { name: 'Likes Posts', starter: false, premium: false, ultimate: true },
                { name: 'Like After Follow', starter: false, premium: false, ultimate: true },
                { name: 'Tiktok Service', starter: false, premium: false, ultimate: true },
                { name: 'Welcome DM', starter: false, premium: false, ultimate: true }
            ]
        }
    ]
};

export default pricingData;
