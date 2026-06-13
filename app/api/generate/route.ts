import { getServerSession } from "next-auth";
import { Redis } from "@upstash/redis";
import { authOptions } from "@/lib/auth";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const FREE_LIMIT = 3;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Non connecté" }, { status: 401 });
  }

  const email = session.user.email;
  const userKey = `user:${email}`;

  const userData = (await redis.hgetall(userKey)) as {
    plan?: string;
    freeUsed?: string;
  } | null;

  const plan = userData?.plan ?? "free";
  const freeUsed = parseInt(userData?.freeUsed ?? "0");

  if (plan === "free" && freeUsed >= FREE_LIMIT) {
    return Response.json({ error: "limit_reached", freeUsed, plan }, { status: 403 });
  }

  const { productName, features, platform, language, category } = await request.json();

  if (!productName || !features) {
    return Response.json({ error: "Champs manquants" }, { status: 400 });
  }

  const platformInstructions =
    platform === "amazon"
      ? `Format Amazon :
- Titre : maximum 200 caractères, mots-clés principaux en premier
- 5 bullet points : commencent par un mot en MAJUSCULE, 200 caractères max chacun
- Description : 2000 caractères maximum, persuasive et riche en mots-clés`
      : `Format Etsy :
- Titre : maximum 140 caractères, mots-clés naturels et descriptifs
- Description : 1500 caractères, ton artisanal et chaleureux
- 13 tags séparés par des virgules`;

  const langInstruction = language === "en" ? "Respond in English." : "Réponds en français.";

  const prompt = `Tu es un expert en optimisation de fiches produits e-commerce.
Génère une fiche produit complète. ${langInstruction}

${platformInstructions}

Produit : ${productName}
Catégorie : ${category}
Caractéristiques : ${features}

Réponds uniquement avec la fiche formatée, sans commentaires.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await response.json();
  const result = data.content?.[0]?.text;

  if (!result) {
    return Response.json({ error: "Erreur IA" }, { status: 500 });
  }

  // Incrémente le compteur free
  if (plan === "free") {
    await redis.hset(userKey, { freeUsed: freeUsed + 1 });
  }

  // ── Sauvegarde la génération ──────────────────────────────────
  const genId = `gen:${email}:${Date.now()}`;
  const generation = {
    id: genId,
    productName,
    platform,
    category,
    language,
    result,
    createdAt: new Date().toISOString(),
  };

  // Stocke la génération + ajoute l'id dans la liste de l'user
  await redis.set(genId, JSON.stringify(generation));
  await redis.lpush(`generations:${email}`, genId);
  // Garde max 50 générations
  await redis.ltrim(`generations:${email}`, 0, 49);

  return Response.json({
    result,
    freeUsed: plan === "free" ? freeUsed + 1 : freeUsed,
    plan,
    freeRemaining: plan === "free" ? FREE_LIMIT - (freeUsed + 1) : null,
  });
}