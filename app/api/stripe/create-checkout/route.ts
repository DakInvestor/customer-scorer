import { NextResponse } from "next/server";
import { createSupabaseServerClient, getCurrentUser } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured, PRICE_IDS } from "@/lib/stripe";

export async function POST(request: Request) {
  // Check if Stripe is configured
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Payments are not yet enabled. Enjoy the free beta!" },
      { status: 503 }
    );
  }

  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tier } = await request.json();

    // Validate tier
    const priceId = tier === "professional" ? PRICE_IDS.professional : tier === "business" ? PRICE_IDS.business : null;

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // Get business for this user
    const { data: profile } = await supabase
      .from("profiles")
      .select("business_id")
      .eq("id", user.id)
      .single();

    if (!profile?.business_id) {
      return NextResponse.json({ error: "No business found" }, { status: 400 });
    }

    const { data: business } = await supabase
      .from("businesses")
      .select("id, stripe_customer_id, name")
      .eq("id", profile.business_id)
      .single();

    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 400 });
    }

    const stripe = getStripe();

    // Get or create Stripe customer
    let stripeCustomerId = business.stripe_customer_id;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          business_id: business.id,
          user_id: user.id,
        },
        name: business.name,
      });

      stripeCustomerId = customer.id;

      // Save Stripe customer ID to business
      await supabase
        .from("businesses")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", business.id);
    }

    // Create checkout session
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/app/upgrade?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/app/upgrade?canceled=true`,
      metadata: {
        business_id: business.id,
        user_id: user.id,
        tier: tier,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}