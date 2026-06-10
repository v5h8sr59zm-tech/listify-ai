import Stripe from "stripe";
import { Redis } from "@upstash/redis";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Désactive le body parsing Next.js — Stripe a besoin du raw body
export const config = { api: { bodyParser: false } };

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature invalide:", err.message);
    return Response.json({ error: "Signature invalide" }, { status: 400 });
  }

  // Paiement réussi → active le plan
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.metadata?.userEmail;
    const plan = session.metadata?.plan;

    if (email && plan) {
      await redis.hset(`user:${email}`, {
        plan,
        stripeCustomerId: session.customer,
        stripeSubscriptionId: session.subscription,
        planActivatedAt: new Date().toISOString(),
      });
      console.log(`✅ Plan ${plan} activé pour ${email}`);
    }
  }

  // Abonnement annulé → repasse en free
  if (
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.paused"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Retrouve l'email via l'ID customer Stripe
    const customer = await stripe.customers.retrieve(customerId);
    if (customer.deleted) return Response.json({ received: true });

    const email = (customer as Stripe.Customer).email;
    if (email) {
      await redis.hset(`user:${email}`, { plan: "free" });
      console.log(`⬇️ Plan annulé pour ${email}, repassé en free`);
    }
  }

  return Response.json({ received: true });
}