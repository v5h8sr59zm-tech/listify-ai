"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

const CATEGORIES = [
  { val: "general", label: "Général" },
  { val: "mode", label: "Mode" },
  { val: "maison", label: "Maison" },
  { val: "bijoux", label: "Bijoux" },
  { val: "electronique", label: "Électronique" },
  { val: "sport", label: "Sport" },
  { val: "beaute", label: "Beauté" },
  { val: "art", label: "Art" },
];

const FREE_LIMIT = 3;

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [platform, setPlatform] = useState("amazon");
  const [language, setLanguage] = useState("fr");
  const [category, setCategory] = useState("general");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);
  const [plan, setPlan] = useState<"free" | "starter" | "pro">("free");
  const [limitReached, setLimitReached] = useState(false);

  // Charge le statut réel depuis le serveur au montage
  useEffect(() => {
    if (!session?.user?.email) return;
    fetch("/api/user-status")
      .then((r) => r.json())
      .then((d) => {
        if (d.freeUsed !== undefined) setFreeUsed(d.freeUsed);
        if (d.plan) setPlan(d.plan);
        if (d.plan === "free" && d.freeUsed >= FREE_LIMIT) setLimitReached(true);
      });
  }, [session]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setAnalyzingImage(true);
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64.split(",")[1],
          mediaType: file.type,
        }),
      });
      const data = await res.json();
      if (data.productName) setProductName(data.productName);
      if (data.features) setFeatures(data.features);
      setAnalyzingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    // Non connecté → redirige vers login
    if (!session) {
      signIn("google", { callbackUrl: "/generate" });
      return;
    }

    if (!productName || !features) return;

    setLoading(true);
    setResult(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName, features, platform, language, category }),
    });

    const data = await res.json();

    if (res.status === 403 && data.error === "limit_reached") {
      setLimitReached(true);
      setLoading(false);
      return;
    }

    if (res.status === 401) {
      signIn("google", { callbackUrl: "/generate" });
      setLoading(false);
      return;
    }

    if (!res.ok) {
      setLoading(false);
      return;
    }

    setResult(data.result);
    if (data.freeUsed !== undefined) setFreeUsed(data.freeUsed);
    if (data.plan) setPlan(data.plan);
    if (data.plan === "free" && data.freeUsed >= FREE_LIMIT) setLimitReached(true);
    setLoading(false);
  };

  const goToPricing = async (targetPlan: "starter" | "pro") => {
    const res = await fetch("/api/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: targetPlan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const parseResult = (text: string) => {
    if (!text) return { title: "", bullets: [], description: "", tags: "" };
    const lines = text.split("\n").filter((l) => l.trim());
    let title = "", bullets: string[] = [], description = "", tags = "";
    let currentSection = "";
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes("titre") || lower.includes("title")) {
        currentSection = "title";
        const val = line.split(":").slice(1).join(":").trim();
        if (val) title = val;
      } else if (lower.includes("bullet") || lower.includes("point")) {
        currentSection = "bullets";
      } else if (lower.includes("description")) {
        currentSection = "description";
        const val = line.split(":").slice(1).join(":").trim();
        if (val) description += val + " ";
      } else if (lower.includes("tag")) {
        currentSection = "tags";
        const val = line.split(":").slice(1).join(":").trim();
        if (val) tags = val;
      } else if (currentSection === "title" && !title) {
        title = line;
      } else if (currentSection === "bullets" && (line.startsWith("-") || line.startsWith("•") || line.match(/^\d\./))) {
        bullets.push(line.replace(/^[-•\d.]\s*/, "").trim());
      } else if (currentSection === "description") {
        description += line + " ";
      } else if (currentSection === "tags") {
        tags += line;
      }
    }
    return { title: title.replace(/\*\*/g, ""), bullets, description: description.trim(), tags };
  };

  const parsed = result ? parseResult(result) : null;
  const freeRemaining = Math.max(0, FREE_LIMIT - freeUsed);
  const isPaid = plan === "starter" || plan === "pro";

  return (
    <main className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 bg-white z-50">
        <a href="/" className="text-xl font-bold text-orange-500 tracking-tight">Listly AI</a>
        <div className="flex items-center gap-4">
          {/* Compteur — seulement pour les free */}
          {!isPaid && (
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ${freeRemaining === 0 ? "bg-red-50 border-red-100" : "bg-orange-50 border-orange-100"}`}>
              <div className={`h-2 w-2 rounded-full animate-pulse ${freeRemaining === 0 ? "bg-red-500" : "bg-orange-500"}`} />
              <span className={`text-sm font-semibold ${freeRemaining === 0 ? "text-red-600" : "text-orange-600"}`}>
                {freeRemaining} génération{freeRemaining !== 1 ? "s" : ""} gratuite{freeRemaining !== 1 ? "s" : ""}
              </span>
            </div>
          )}
          {isPaid && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-1.5 rounded-full">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-green-600 text-sm font-semibold capitalize">Plan {plan} ✓</span>
            </div>
          )}
          {/* Langue */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {["fr", "en"].map((l) => (
              <button key={l} onClick={() => setLanguage(l)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${language === l ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
                {l === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Générer une fiche produit</h1>
          <p className="text-gray-400 text-sm">Optimisée SEO pour Amazon et Etsy en 30 secondes</p>
        </div>

        {/* Paywall modal */}
        {limitReached && !isPaid && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Tu as utilisé tes 3 générations gratuites</h2>
                <p className="text-gray-500 text-sm leading-relaxed">Passe au plan Starter pour des générations illimitées.</p>
              </div>
              <div className="space-y-3">
                <button onClick={() => goToPricing("starter")}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                  Starter — 9€/mois · Illimité
                </button>
                <button onClick={() => goToPricing("pro")}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                  Pro — 19,99€/mois · Tout inclus
                </button>
                <a href="/" className="block text-center text-gray-400 text-sm mt-2 hover:text-gray-600">Retour à l'accueil</a>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-10">

          {/* ── Colonne gauche ────────────────────────────────── */}
          <div>
            {/* Plateforme */}
            <div className="mb-6">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-3">Plateforme</label>
              <div className="grid grid-cols-2 gap-2">
                {["amazon", "etsy"].map((p) => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={`py-3 rounded-xl font-bold text-sm capitalize transition-all ${platform === p ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {p === "amazon" ? "Amazon" : "Etsy"}
                  </button>
                ))}
              </div>
            </div>

            {/* Upload photo */}
            <div className="mb-6">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-3">Analyser une photo</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                {analyzingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <p className="text-orange-500 text-sm font-semibold">Analyse en cours...</p>
                  </div>
                ) : imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={imagePreview} alt="preview" className="h-20 w-20 object-cover rounded-lg" />
                    <p className="text-gray-400 text-xs">Cliquer pour changer</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <p className="text-gray-400 text-sm">Uploader une photo de ton produit</p>
                    <p className="text-gray-300 text-xs">L'IA remplit les champs automatiquement</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Catégorie */}
            <div className="mb-6">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-3">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button key={c.val} onClick={() => setCategory(c.val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${category === c.val ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nom produit */}
            <div className="mb-4">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-2">
                Nom du produit
                <span className="normal-case text-gray-300 ml-2 font-normal">{productName.length}/80</span>
              </label>
              <input type="text" maxLength={80} placeholder="Ex: Tasse céramique faite main 350ml"
                className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 transition-all text-sm shadow-sm"
                value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>

            {/* Caractéristiques */}
            <div className="mb-6">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-2">
                Caractéristiques
                <span className="normal-case text-gray-300 ml-2 font-normal">{features.length}/300</span>
              </label>
              <textarea maxLength={300} placeholder="Matière, taille, couleur, usage, origine..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3.5 h-36 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 transition-all resize-none text-sm shadow-sm"
                value={features} onChange={(e) => setFeatures(e.target.value)} />
            </div>

            <button onClick={handleSubmit}
              disabled={loading || !productName || !features}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-base hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200 transition-all">
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Génération en cours...
                </span>
              ) : !session ? "Se connecter pour générer"
                : limitReached ? "Passer Pro pour continuer"
                : "Générer ma fiche"}
            </button>
          </div>

          {/* ── Colonne droite — Résultat ─────────────────────── */}
          <div>
            {!result && !loading && (
              <div className="h-full min-h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">Ton résultat apparaîtra ici</p>
                <p className="text-gray-300 text-xs mt-1">Remplis le formulaire et clique sur Générer</p>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-80 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                  <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                </div>
                <p className="text-orange-500 font-semibold text-sm">L'IA rédige ta fiche...</p>
                <p className="text-gray-400 text-xs mt-1">Environ 10 secondes</p>
              </div>
            )}

            {result && parsed && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900 font-bold text-lg">Résultat</h2>
                  <button onClick={() => copyText(result, "all")} className="text-xs text-gray-400 hover:text-orange-500 font-semibold transition-colors">
                    {copied === "all" ? "✓ Copié !" : "Tout copier"}
                  </button>
                </div>

                {parsed.title && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">Titre SEO</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-300 text-xs">{parsed.title.length} car.</span>
                        <button onClick={() => copyText(parsed.title, "title")} className="text-xs text-gray-400 hover:text-orange-500 font-semibold">
                          {copied === "title" ? "✓" : "Copier"}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed font-medium">{parsed.title}</p>
                  </div>
                )}

                {parsed.bullets.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">Bullet Points</span>
                      <button onClick={() => copyText(parsed.bullets.join("\n"), "bullets")} className="text-xs text-gray-400 hover:text-orange-500 font-semibold">
                        {copied === "bullets" ? "✓" : "Copier"}
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {parsed.bullets.map((b, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-700">
                          <span className="text-orange-500 mt-0.5 shrink-0 font-bold">•</span>{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {parsed.description && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">Description</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-300 text-xs">{parsed.description.length} car.</span>
                        <button onClick={() => copyText(parsed.description, "desc")} className="text-xs text-gray-400 hover:text-orange-500 font-semibold">
                          {copied === "desc" ? "✓" : "Copier"}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{parsed.description}</p>
                  </div>
                )}

                {platform === "etsy" && parsed.tags && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">Tags Etsy</span>
                      <button onClick={() => copyText(parsed.tags, "tags")} className="text-xs text-gray-400 hover:text-orange-500 font-semibold">
                        {copied === "tags" ? "✓" : "Copier"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {parsed.tags.split(",").map((tag, i) => (
                        <span key={i} className="bg-orange-50 text-orange-600 text-xs px-2.5 py-1 rounded-lg border border-orange-100 font-medium">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
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