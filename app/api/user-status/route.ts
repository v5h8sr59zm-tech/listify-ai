import { getServerSession } from "next-auth";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return Response.json({ freeUsed: 0, plan: "free" });
  }

  const userData = (await redis.hgetall(`user:${session.user.email}`)) as {
    plan?: string;
    freeUsed?: string;
  } | null;

  return Response.json({
    plan: userData?.plan ?? "free",
    freeUsed: parseInt(userData?.freeUsed ?? "0"),
  });
}