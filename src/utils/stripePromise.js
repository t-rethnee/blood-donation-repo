import { loadStripe } from '@stripe/stripe-js';

// This is a public test key from Stripe docs. It's safe to use for UI testing.
export const stripePromise = loadStripe(import.meta.env.VITE_payment_Key);
