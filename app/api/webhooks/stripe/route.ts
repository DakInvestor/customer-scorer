import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getTierFromPriceId } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: Request) {
  // Check environment variables at runtime, not build time
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook secret not configured" },
      { status: 503 }
    );
  }

  // Create clients inside the function to avoid build-time errors
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2025-12-15.clover",
  });

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const businessId = session.metadata?.business_id;
        const tier = session.metadata?.tier;

        if (businessId && session.subscription) {
          await supabaseAdmin
            .from("businesses")
            .update({
              stripe_subscription_id: session.subscription as string,
              subscription_tier: tier || "professional",
              subscription_status: "active",
              customer_count_limit: -1, // unlimited for paid plans
              network_write_access: true,
            })
            .eq("id", businessId);

          console.log(`Business ${businessId} upgraded to ${tier}`);
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Find business by Stripe customer ID
        const { data: business } = await supabaseAdmin
          .from("businesses")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (business) {
          const priceId = subscription.items.data[0]?.price?.id;
          const tier = priceId ? getTierFromPriceId(priceId) : "starter";

          await supabaseAdmin
            .from("businesses")
            .update({
              subscription_tier: tier,
              subscription_status: subscription.status,
              customer_count_limit: tier === "starter" ? 50 : -1,
              network_write_access: tier !== "starter",
            })
            .eq("id", business.id);

          console.log(`Business ${business.id} subscription updated: ${tier} (${subscription.status})`);
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: business } = await supabaseAdmin
          .from("businesses")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (business) {
          await supabaseAdmin
            .from("businesses")
            .update({
              subscription_tier: "starter",
              subscription_status: "canceled",
              customer_count_limit: 50,
              network_write_access: false,
            })
            .eq("id", business.id);

          console.log(`Business ${business.id} subscription canceled`);
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const { data: business } = await supabaseAdmin
          .from("businesses")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .single();

        if (business) {
          await supabaseAdmin
            .from("businesses")
            .update({
              subscription_status: "past_due",
            })
            .eq("id", business.id);

          console.log(`Business ${business.id} payment failed`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}