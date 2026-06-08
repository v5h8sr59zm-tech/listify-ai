import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { plan } = await request.json();

    const priceId = plan === "pro"
      ? process.env.STRIPE_PRICE_ID_PRO!
      : process.env.STRIPE_PRICE_ID_STARTER!;

    console.log("Plan:", plan);
    console.log("PriceId:", priceId);
    console.log("StripeKey exists:", !!process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}`,
    });

    return Response.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}