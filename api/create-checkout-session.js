// Vercel serverless function to create a Stripe Checkout Session
// Requires env vars: STRIPE_SECRET_KEY, APP_BASE_URL

const stripePkg = require('stripe');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      res.status(500).json({ error: 'Stripe secret key not configured' });
      return;
    }

    const stripe = stripePkg(stripeSecretKey);

    const {
      plan,
      price,
      billingCycle,
      userId,
      userEmail,
    } = req.body || {};

    if (!price || !userId) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const baseUrl = process.env.APP_BASE_URL || (req.headers['x-forwarded-proto'] ? `${req.headers['x-forwarded-proto']}://${req.headers.host}` : `https://${req.headers.host}`);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: userEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Plan'} Subscription`,
              metadata: { plan: plan || 'basic' },
            },
            unit_amount: Math.round(Number(price) * 100),
            recurring: {
              interval: billingCycle === 'yearly' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment-cancel`,
      metadata: {
        user_id: userId,
        plan: plan || 'basic',
        billing_cycle: billingCycle || 'monthly',
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};


