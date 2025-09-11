// Vercel serverless function to create a Stripe Checkout Session
// Requires env vars: STRIPE_SECRET_KEY, APP_BASE_URL

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log('Stripe checkout session request received:', {
    method: req.method,
    body: req.body,
    headers: req.headers
  });

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    console.log('Stripe secret key exists:', !!stripeSecretKey);
    
    if (!stripeSecretKey) {
      console.error('Stripe secret key not configured');
      res.status(500).json({ error: 'Stripe secret key not configured' });
      return;
    }

    // Ensure JSON body is parsed
    let parsedBody = req.body;
    if (typeof parsedBody === 'string') {
      try {
        parsedBody = JSON.parse(parsedBody);
      } catch (e) {
        console.error('Failed to parse JSON body:', e);
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }
    if (!parsedBody || typeof parsedBody !== 'object') {
      parsedBody = {};
    }

    const {
      plan,
      price,
      billingCycle,
      userId,
      userEmail,
    } = parsedBody;

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
    console.error('Stripe session error:', error?.message || error, error?.stack);
    const message = error?.raw?.message || error?.message || 'Failed to create checkout session';
    res.status(500).json({ error: message });
  }
}