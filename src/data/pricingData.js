/**
 * Pricing data for all plans and features
 */

const pricingData = {
    // Basic plan information
    plans: [
        {
            id: 'basic',
            name: 'Basic',
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
            id: 'turbocharged',
            name: 'Turbocharged',
            description: 'Designed for people building their brand with tailored engagement and advanced targeting to reach a specific audience with guidance from our top performers.',
            features: [
                'Everything in Premium',
                'Turbocharged growth',
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
            basic: 69,
            premium: 99,
            turbocharged: 249
        },
        yearly: {
            basic: 579,
            premium: 829,
            turbocharged: 2089
        }
    },

    // Feature categories for comparison table
    comparisonCategories: [
        {
            name: 'Features',
            items: [
                { name: 'Follow / Unfollow', basic: true, premium: true, turbocharged: true },
                { name: 'Interest Targeting', basic: true, premium: true, turbocharged: true },
                { name: 'Competitor Targeting', basic: true, premium: true, turbocharged: true },
                { name: 'Targeting Optimization', basic: false, premium: true, turbocharged: true },
                { name: 'Geotargeting', basic: false, premium: true, turbocharged: true },
                { name: 'Gender Targeting', basic: false, premium: true, turbocharged: true },
                { name: 'Likes Sequences', basic: false, premium: false, turbocharged: true }
            ]
        },
        {
            name: 'Reporting',
            items: [
                { name: 'Monthly Growth Reports', basic: true, premium: true, turbocharged: true },
                { name: 'Advanced Targeting Optimization', basic: false, premium: false, turbocharged: true }
            ]
        },
        {
            name: 'Support',
            items: [
                { name: '24/7 Live Chat', basic: true, premium: true, turbocharged: true },
                { name: 'Welcome Call', basic: false, premium: true, turbocharged: true },
                { name: 'Account Management', basic: false, premium: true, turbocharged: true },
                { name: 'Monthly Performance Review', basic: false, premium: true, turbocharged: true }
            ]
        }
    ]
};

export default pricingData;
