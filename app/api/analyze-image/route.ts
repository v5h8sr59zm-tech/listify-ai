export async function POST(request: Request) {
  try {
    const { imageBase64, mediaType } = await request.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64
              }
            },
            {
              type: "text",
              text: `Analyse cette photo de produit et extrais :
1. Le nom du produit (court et descriptif, max 60 caractères)
2. Les caractéristiques principales (matière, couleur, taille, usage, style - max 200 caractères)

Réponds UNIQUEMENT en JSON valide sans markdown :
{"productName": "...", "features": "..."}`
            }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.content[0].text;
    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}