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
    return Response.json({ error: "Not logged in" }, { status: 401 });
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
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const isEnglish = language === "en";

  const platformInstructions = platform === "amazon"
    ? `PLATFORM: Amazon
FORMAT RULES (follow exactly):
- Title: 150-200 characters MAX. Start with the most important keyword. Use this structure: [Main Keyword] [Product Type] - [Key Feature] | [Secondary Keyword] [Benefit]
- Bullet points: exactly 5. Each starts with a capitalized keyword in ALL CAPS followed by a dash. 150-200 chars each. Focus on benefits, not just features.
- Description: 1500-2000 characters. Use short paragraphs. Start with a hook. Include social proof language. End with a call to action.
Output format:
**Title:** [title here]
**Bullet Points:**
• [KEYWORD - benefit statement]
• [KEYWORD - benefit statement]
• [KEYWORD - benefit statement]
• [KEYWORD - benefit statement]
• [KEYWORD - benefit statement]
**Description:** [description here]`
    : `PLATFORM: Etsy
FORMAT RULES (follow exactly):
- Title: 120-140 characters MAX. Use natural language with commas to separate keyword phrases. Structure: [Primary keyword], [Style/Material], [Product type] - [Secondary keyword], [Use case/Gift occasion]
- Description: 800-1500 characters. Warm, artisan tone. Tell the story of the product. Include materials, dimensions if relevant, care instructions. End with a personal touch.
- Tags: exactly 13 tags separated by commas. Mix: broad keywords, specific phrases, style words, occasion words, material words. Each tag max 20 characters.
Output format:
**Title:** [title here]
**Description:** [description here]
**Tags:** [tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9, tag10, tag11, tag12, tag13]`;

  const systemPrompt = isEnglish
    ? `You are an expert e-commerce copywriter specializing in Etsy and Amazon SEO. You have deep knowledge of search algorithms, buyer psychology, and what makes listings convert. You write compelling, keyword-rich product listings that rank high and sell.

Key principles:
- Always prioritize the most searched keywords first
- Write for humans first, search engines second
- Use power words that trigger emotion and urgency
- Be specific with details — vague listings don't convert
- Match the platform's tone exactly (Amazon = professional/informative, Etsy = warm/artisan/personal)`
    : `Tu es un expert en copywriting e-commerce spécialisé dans le SEO Etsy et Amazon. Tu maîtrises les algorithmes de recherche, la psychologie des acheteurs et ce qui fait convertir les fiches produits. Tu écris des fiches produits percutantes, riches en mots-clés, qui se classent haut et se vendent.

Principes clés :
- Toujours prioriser les mots-clés les plus recherchés en premier
- Écrire d'abord pour les humains, ensuite pour les moteurs de recherche
- Utiliser des mots puissants qui déclenchent l'émotion et l'urgence
- Être spécifique dans les détails — les fiches vagues ne convertissent pas
- Respecter le ton de la plateforme (Amazon = professionnel/informatif, Etsy = chaleureux/artisanal/personnel)`;

  const userPrompt = `Generate a complete, high-converting product listing.

${platformInstructions}

PRODUCT INFO:
- Name: ${productName}
- Category: ${category}
- Details: ${features}

${isEnglish ? "Respond in English." : "Réponds en français."}

Important: Follow the output format exactly. Do not add any commentary, explanations, or extra text. Just the listing.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  const data = await response.json();
  const result = data.content?.[0]?.text;

  if (!result) {
    return Response.json({ error: "AI error" }, { status: 500 });
  }

  if (plan === "free") {
    await redis.hset(userKey, { freeUsed: freeUsed + 1 });
  }

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

  await redis.set(genId, JSON.stringify(generation));
  await redis.lpush(`generations:${email}`, genId);
  await redis.ltrim(`generations:${email}`, 0, 49);

  return Response.json({
    result,
    freeUsed: plan === "free" ? freeUsed + 1 : freeUsed,
    plan,
    freeRemaining: plan === "free" ? FREE_LIMIT - (freeUsed + 1) : null,
  });
}