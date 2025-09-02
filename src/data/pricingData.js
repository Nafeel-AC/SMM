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
                'Real Followers Guaranteed',
                'Organic growth method',
                'Niche Targeting',
                '24/7 live chat support',
                'Cancel Anytime'
            ],
            popular: false
        },
        {
            id: 'premium',
            name: 'Premium',
            description: 'Ideal for individuals and businesses looking to build a relevant local community with focused, location-based targeting and hands-on support.',
            features: [
                'Everything in Basic',
                'Faster Follower Growth',
                'Location based targeting',
                'Gender based targeting',
                'Dedicated Campaign Manager',
                'Profile Optimization Coaching',
                'Cancel Anytime'
            ],
            popular: true
        },
        {
            id: 'ultimate',
            name: 'Ultimate',
            description: 'Designed for people building their brand with tailored engagement and advanced targeting to reach a specific audience with guidance from our top performers.',
            features: [
                'Everything in Premium',
                'Ultimate growth',
                'Monthly Content Coaching',
                'Senior Campaign Manager',
                'Cancel Anytime'
            ],
            popular: false
        }
    ],

    // Pricing by billing cycle
    pricing: {
        monthly: {
            starter: 59,
            premium: 89,
            ultimate: 189
        },
        yearly: {
            starter: 579,
            premium: 829,
            ultimate: 1789
        }
    },

    // Feature categories for comparison table
    comparisonCategories: [
        {
            name: 'Features',
            items: [
                { name: 'Real Instagram Followers', starter: true, premium: true, ultimate: true },
                { name: 'Monthly growth Analytics', starter: true, premium: true, ultimate: true },
                { name: 'Competitor Targeting', starter: true, premium: true, ultimate: true },
                { name: 'Cancel Anytime', starter: false, premium: true, ultimate: true },
                { name: 'Target by Hashtag', starter: false, premium: true, ultimate: true },
                { name: 'Target by Influencer and competitor', starter: false, premium: true, ultimate: true },
                { name: 'Gender', starter: false, premium: false, ultimate: true },
                { name: 'Comments', starter: false, premium: false, ultimate: true },
                { name: 'Like Posts', starter: false, premium: false, ultimate: true },
                { name: 'Vpn Login', starter: false, premium: false, ultimate: true },
                { name: 'Like After Flow', starter: false, premium: false, ultimate: true },
                { name: 'Tiktok Service', starter: false, premium: false, ultimate: true },
                { name: 'Welcome DM', starter: false, premium: false, ultimate: true },

            ]
        },
        {
            name: 'Reporting',
            items: [
                { name: 'Instagram Audit', starter: true, premium: true, ultimate: true },
                { name: 'Advanced Targeting Optimization', starter: false, premium: false, ultimate: true }
            ]
        },
        {
            name: 'Support',
            items: [
                { name: '24/7 Live Chat', starter: true, premium: true, ultimate: true },
                { name: 'Welcome Call', starter: false, premium: true, ultimate: true },
                { name: 'Account Management', starter: false, premium: true, ultimate: true },
                { name: 'Monthly Performance Review', starter: false, premium: true, ultimate: true }
            ]
        }
    ]
};

export default pricingData;
