# Stripe Payment Integration Setup

This document explains how to set up and configure Stripe payment integration for the Hayaku e-commerce platform.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key (from Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key

# Stripe Webhook Secret (for production)
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret from Stripe Dashboard
```

## Getting Your Stripe Keys

1. **Sign up/Login to Stripe**: Go to [https://stripe.com](https://stripe.com)
2. **Get API Keys**:
   - Go to Dashboard → Developers → API keys
   - Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

## Webhook Setup

### For Local Development

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe` (macOS) or see [Stripe CLI docs](https://stripe.com/docs/stripe-cli)
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/payments/webhook`
4. Copy the webhook signing secret (starts with `whsec_`) and add it to your `.env` file

### For Production

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL: `https://yourdomain.com/api/payments/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.refunded`
5. Copy the webhook signing secret and add it to your production environment variables

## Features Implemented

✅ **Payment Gateway Integration**
- Stripe Payment Intents API
- Secure card payment processing

✅ **Payment Method Validation**
- Card number validation (Luhn algorithm)
- Expiry date validation
- CVV validation
- Card brand detection

✅ **Payment Processing**
- Create payment intents
- Confirm payments
- Handle payment success/failure
- Store payment transactions in database

✅ **Webhook Handling**
- Payment success webhooks
- Payment failure webhooks
- Refund handling
- Automatic order status updates

✅ **Transaction Storage**
- All payment transactions stored in `payment_transactions` table
- Order payment status automatically updated
- Full payment history tracking

## API Endpoints

### Create Payment Intent
```
POST /api/payments/create-intent
Body: { orderId: string }
Response: { clientSecret: string, paymentIntentId: string }
```

### Confirm Payment
```
POST /api/payments/confirm
Body: { paymentIntentId: string }
Response: { success: boolean, status: string, orderId: string }
```

### Webhook Handler
```
POST /api/payments/webhook
Headers: { 'stripe-signature': string }
Body: Stripe webhook event (raw)
```

## Testing

### Test Cards

Use these test card numbers in Stripe test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date (e.g., `12/34`) and any 3-digit CVV.

### Test Flow

1. Add items to cart
2. Go to checkout
3. Fill in shipping information
4. Use test card number: `4242 4242 4242 4242`
5. Complete payment
6. Verify order status is updated to "paid"
7. Check `payment_transactions` table for transaction record

## Security Notes

- Never expose your Stripe secret key in client-side code
- Always verify webhook signatures
- Use HTTPS in production
- Store sensitive keys in environment variables only
- Card data is handled securely by Stripe Elements (PCI compliant)

## Troubleshooting

### Payment Intent Creation Fails
- Check `STRIPE_SECRET_KEY` is set correctly
- Verify order exists and belongs to user
- Check Stripe dashboard for API errors

### Webhook Not Working
- Verify `STRIPE_WEBHOOK_SECRET` is set
- Check webhook endpoint URL is correct
- Ensure webhook events are selected in Stripe Dashboard
- Check server logs for webhook errors

### Payment Form Not Loading
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check browser console for errors
- Ensure Stripe Elements is properly initialized
