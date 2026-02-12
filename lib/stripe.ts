import Stripe from "stripe";

// Initialize Stripe with your secret key
// This will be undefined during the free beta period - that's okay
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

let stripe: Stripe | null = null;

if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-12-15.clover",
    typescript: true,
  });
}

export function getStripe(): Stripe {
  if (!stripe) {
    throw new Error(
      "Stripe is not configured. Add STRIPE_SECRET_KEY to your environment variables."
    );
  }
  return stripe;
}

export function isStripeConfigured(): boolean {
  return stripe !== null;
}

// Price IDs - set these when you create Stripe products
export const PRICE_IDS = {
  professional: process.env.STRIPE_PRO_PRICE_ID || "",
  business: process.env.STRIPE_BUSINESS_PRICE_ID || "",
};

// Map Stripe price IDs back to tier names
export function getTierFromPriceId(priceId: string): string {
  if (priceId === PRICE_IDS.professional) return "professional";
  if (priceId === PRICE_IDS.business) return "business";
  return "starter";
}

// Map tier names to display info
export function getTierInfo(tier: string) {
  switch (tier) {
    case "professional":
      return {
        name: "Professional",
        price: 29,
        customerLimit: -1, // unlimited
        features: [
          "Unlimited customers",
          "Advanced reliability scores",
          "Analytics dashboard",
          "Network search & reporting",
          "Data export",
          "Up to 5 team members",
          "Priority email support",
        ],
      };
    case "business":
      return {
        name: "Business",
        price: 79,
        customerLimit: -1,
        features: [
          "Everything in Professional",
          "Unlimited team members",
          "API access",
          "Custom integrations",
          "Dedicated account manager",
          "Phone support",
          "SLA guarantee",
        ],
      };
    default:
      return {
        name: "Starter",
        price: 0,
        customerLimit: 50,
        features: [
          "Up to 50 customers",
          "Basic reliability scores",
          "Event logging",
          "Data export",
        ],
      };
  }
}