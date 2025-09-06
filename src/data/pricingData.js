/**
 * Pricing data for all plans and features
 */

const pricingData = {
    // Starter plan information
    plans: [
        {
            id: 'starter',
            name: 'Basic Plan',
            description: 'Perfect for personal accounts seeking steady, organic growth and targeted global followers.',
            features: [
                'Instagram Growth Management',
                'Basic Analytics Dashboard',
                'Email Support',
                'Up to 1 Instagram Account',
            ],
            popular: false
        },
        {
            id: 'premium',
            name: 'Pro Plan',
            description: 'Ideal for individuals and businesses looking to build a relevant local community with focused targeting.',
            features: [
                'Advanced Growth Strategies',
                'Detailed Analytics & Insights',
                'Priority Support',
                'Up to 3 Instagram Accounts',
                'Custom Hashtag Research',
                'Competitor Analysis',
            ],
            popular: true
        },
        {
            id: 'ultimate',
            name: 'Enterprise Plan',
            description: 'Designed for people building their brand with tailored engagement and advanced targeting capabilities.',
            features: [
                'White-label Growth Service',
                'Advanced Analytics & Reporting',
                'Dedicated Account Manager',
                'Unlimited Instagram Accounts',
                'Custom Strategy Development',
                '24/7 Phone Support',
            ],
            popular: false
        }
    ],

    // Pricing by billing cycle
    pricing: {
        monthly: {
            starter: 29,
            premium: 59,
            ultimate: 99
        },
        yearly: {
            starter: 290,
            premium: 590,
            ultimate: 990
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
