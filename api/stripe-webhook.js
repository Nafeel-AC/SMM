// Vercel serverless function for Stripe webhooks
// Requires env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Read and buffer raw request body for Stripe signature verification
async function getRawBody(req) {
  try {
    if (req.rawBody && Buffer.isBuffer(req.rawBody)) {
      return req.rawBody;
    }

    // Next.js/Vercel may put a string or object on req.body already
    if (typeof req.body === 'string') {
      return Buffer.from(req.body);
    }
    if (req.body && typeof req.body === 'object') {
      return Buffer.from(JSON.stringify(req.body));
    }

    // Fallback: stream the body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  } catch (e) {
    console.error('Failed to read raw body for webhook:', e);
    return Buffer.from('');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey || !webhookSecret) {
    res.status(500).json({ error: 'Stripe webhook not configured' });
    return;
  }

  // stripe is already initialized at the top

  let event;
  try {
    const sig = req.headers['stripe-signature'];
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        // Minimal success acknowledgment; integrate Firestore updates here if needed
        break;
      }
      case 'invoice.payment_succeeded': {
        break;
      }
      case 'invoice.payment_failed': {
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.created': {
        break;
      }
      default: {
        // No-op for unhandled events
        break;
      }
    }
    res.status(200).json({ received: true });
  } catch (e) {
    console.error('Webhook handler error:', e);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

