import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return Response.json({ generations: [] });
    }

    const email = session.user.email;
    const ids = await redis.lrange(`generations:${email}`, 0, 49) as string[];

    if (!ids || ids.length === 0) {
      return Response.json({ generations: [] });
    }

    const generations = await Promise.all(
      ids.map(async (id) => {
        try {
          const raw = await redis.get(id);
          if (!raw) return null;
          if (typeof raw === "object") return raw;
          if (typeof raw === "string") return JSON.parse(raw);
          return null;
        } catch {
          return null;
        }
      })
    );

    return Response.json({ generations: generations.filter(Boolean) });
  } catch (e) {
    console.error("generations error:", e);
    return Response.json({ generations: [] });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Not logged in" }, { status: 401 });
    }
    const { id } = await request.json();
    const email = session.user.email;
    await redis.del(id);
    await redis.lrem(`generations:${email}`, 1, id);
    return Response.json({ success: true });
  } catch (e) {
    console.error("delete error:", e);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}