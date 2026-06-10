export async function POST(request: Request) {
  try {
    const { productDescription, imageBase64, mediaType, platform } = await request.json();

    const imageContent = imageBase64 ? [{
      type: "image",
      source: { type: "base64", media_type: mediaType, data: imageBase64 }
    }] : [];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{
          role: "user",
          content: [
            ...imageContent,
            {
              type: "text",
              text: `Tu es un expert en e-commerce et en analyse de marché ${platform}.

${imageBase64 ? "Voici une photo du produit." : ""}
Description du produit : ${productDescription || "voir la photo"}

Analyse ce produit et simule ce que feraient les meilleures boutiques ${platform} qui vendent ce type de produit.

Réponds en JSON valide uniquement, sans markdown :
{
  "niche": "nom de la niche de produit",
  "topPractices": [
    "pratique 1 des meilleures boutiques",
    "pratique 2",
    "pratique 3",
    "pratique 4"
  ],
  "optimizedListing": {
    "title": "titre optimisé SEO",
    "description": "description persuasive 200 mots",
    "bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"],
    "tags": "tag1, tag2, tag3, tag4, tag5, tag6, tag7"
  },
  "competitorInsights": "2-3 phrases sur ce qui fait le succès des meilleures boutiques dans cette niche"
}`
            }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return Response.json(parsed);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}