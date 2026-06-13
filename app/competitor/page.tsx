"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import NavbarAuth from "@/components/NavbarAuth";

export default function CompetitorPage() {
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const [productDescription, setProductDescription] = useState("");
  const [platform, setPlatform] = useState("etsy");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string>("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    // Attend que NextAuth ait fini de vérifier la session
    if (status === "loading") return;

    // Non connecté → redirect (seulement après confirmation de NextAuth)
    if (status === "unauthenticated") {
      window.location.href = "/#pricing?highlight=pro";
      return;
    }

    // Connecté → vérifie le plan
    fetch("/api/user-status")
      .then((r) => r.json())
      .then((d) => {
        const userPlan = d.plan ?? "free";
        setPlan(userPlan);
        setChecking(false);
        if (userPlan !== "pro") {
          setRedirecting(true);
          setTimeout(() => {
            window.location.href = "/?highlight=pro#pricing";
          }, 800); // petit délai pour éviter le flash au refresh
        }
      })
      .catch(() => {
        setChecking(false);
      });
  }, [session, status]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setImageBase64(base64.split(",")[1]);
      setMediaType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!productDescription && !imageBase64) return;
    setLoading(true);
    const res = await fetch("/api/competitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productDescription, imageBase64, mediaType, platform }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Chargement
  if (status === "loading" || checking || redirecting) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-orange-500 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-gray-400 text-sm">Vérification de ton abonnement...</p>
        </div>
      </div>
    );
  }

  // Bloqué (fallback si redirect lente)
  if (plan !== "pro") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Fonctionnalité Pro</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            L'analyse de boutique concurrente est réservée au plan Pro.
          </p>
          <a href="/#pricing"
            className="inline-block bg-orange-500 text-white px-7 py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
            Voir le plan Pro →
          </a>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-4 md:px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Listly AI" width="26" height="26" />
          <span className="font-bold text-orange-500 text-base">Listly AI</span>
        </a>
        <NavbarAuth />
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <div className="inline-flex items-center bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-3">Plan Pro</div>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Analyse de boutique concurrente</h1>
          <p className="text-gray-400 text-sm">Décris ton produit ou envoie une photo — l'IA analyse les meilleures boutiques de ta niche et te propose une fiche optimisée.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-5">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-2">Plateforme</label>
              <div className="grid grid-cols-2 gap-2">
                {["etsy", "amazon"].map((p) => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={`py-2.5 rounded-xl font-bold text-sm capitalize transition-all ${platform === p ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {p === "amazon" ? "Amazon" : "Etsy"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-2">Photo du produit (optionnel)</label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                {imagePreview ? (
                  <div className="flex flex-col items-center gap-1">
                    <img src={imagePreview} alt="preview" className="h-16 w-16 object-cover rounded-lg" />
                    <p className="text-gray-400 text-xs">Cliquer pour changer</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <p className="text-gray-400 text-xs">Uploader une photo</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            <div className="mb-5">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-2">Description du produit</label>
              <textarea
                placeholder="Ex: Bague en argent 925 faite main, design minimaliste, empilable..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3.5 h-28 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 transition-all resize-none text-sm"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>

            <button onClick={handleSubmit}
              disabled={loading || (!productDescription && !imageBase64)}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-base hover:bg-orange-600 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-orange-200 transition-all">
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Analyse en cours...
                </span>
              ) : "Analyser les concurrents"}
            </button>
          </div>

          <div>
            {!result && !loading && (
              <div className="h-full min-h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">L'analyse apparaîtra ici</p>
                <p className="text-gray-300 text-xs mt-1">Décris ton produit et lance l'analyse</p>
              </div>
            )}
            {loading && (
              <div className="h-full min-h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50">
                <svg className="animate-spin h-8 w-8 text-orange-500 mb-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                <p className="text-orange-500 font-semibold text-sm">Analyse des meilleures boutiques...</p>
                <p className="text-gray-400 text-xs mt-1">Environ 15 secondes</p>
              </div>
            )}
            {result && (
              <div className="space-y-3">
                <h2 className="text-gray-900 font-bold mb-2">Résultat — {result.niche}</h2>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-2">Ce qui marche dans ta niche</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{result.competitorInsights}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-3">Pratiques des top vendeurs</p>
                  <ul className="space-y-2">
                    {result.topPractices?.map((p: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700"><span className="text-orange-500 font-bold shrink-0">{i + 1}.</span>{p}</li>
                    ))}
                  </ul>
                </div>
                {result.optimizedListing?.title && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-orange-500 text-xs font-bold uppercase tracking-wider">Titre SEO optimisé</p>
                      <button onClick={() => copyText(result.optimizedListing.title, "title")} className="text-xs text-gray-400 hover:text-orange-500">{copied === "title" ? "✓" : "Copier"}</button>
                    </div>
                    <p className="text-gray-800 text-sm font-medium">{result.optimizedListing.title}</p>
                  </div>
                )}
                {result.optimizedListing?.bullets && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-orange-500 text-xs font-bold uppercase tracking-wider">Bullet Points</p>
                      <button onClick={() => copyText(result.optimizedListing.bullets.join("\n"), "bullets")} className="text-xs text-gray-400 hover:text-orange-500">{copied === "bullets" ? "✓" : "Copier"}</button>
                    </div>
                    <ul className="space-y-2">
                      {result.optimizedListing.bullets.map((b: string, i: number) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700"><span className="text-orange-500 shrink-0">•</span>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.optimizedListing?.description && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-orange-500 text-xs font-bold uppercase tracking-wider">Description</p>
                      <button onClick={() => copyText(result.optimizedListing.description, "desc")} className="text-xs text-gray-400 hover:text-orange-500">{copied === "desc" ? "✓" : "Copier"}</button>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{result.optimizedListing.description}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}