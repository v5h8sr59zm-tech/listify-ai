export async function POST(request: Request) {
  const { productName, features, platform } = await request.json();

  const platformInstructions = platform === "amazon"
    ? `Format Amazon :
- Titre : maximum 200 caractères, mots-clés principaux en premier
- 5 bullet points : commencent par un mot en MAJUSCULE, 200 caractères max chacun
- Description : 2000 caractères maximum, persuasive et riche en mots-clés`
    : `Format Etsy :
- Titre : maximum 140 caractères, mots-clés naturels et descriptifs
- Description : 1500 caractères, ton artisanal et chaleureux
- 13 tags séparés par des virgules`;

  const prompt = `Tu es un expert en optimisation de fiches produits e-commerce.
Génère une fiche produit complète en français.

${platformInstructions}

Produit : ${productName}
Caractéristiques : ${features}

Réponds uniquement avec la fiche formatée, sans commentaires.`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const result = data.content[0].text;

  return Response.json({ result });
}