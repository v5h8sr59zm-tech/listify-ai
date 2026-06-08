"use client";
import { useState } from "react";

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

export default function GeneratePage() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [platform, setPlatform] = useState("amazon");
  const [language, setLanguage] = useState("fr");
  const [category, setCategory] = useState("general");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!productName || !features) return;
    if (freeUsed >= 3) {
      const res = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "starter" }),
      });
      const data = await res.json();
      window.location.href = data.url;
      return;
    }
    setLoading(true);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName, features, platform, language, category }),
    });
    const data = await res.json();
    setResult(data.result);
    setFreeUsed(freeUsed + 1);
    setLoading(false);
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const parseResult = (text: string) => {
    if (!text) return { title: "", bullets: [], description: "", tags: "" };
    const lines = text.split("\n").filter((l) => l.trim());
    let title = "";
    let bullets: string[] = [];
    let description = "";
    let tags = "";
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

  return (
    <main className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100 sticky top-0 bg-white z-50">
        <a href="/" className="text-xl font-bold text-orange-500 tracking-tight">Listify AI</a>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full">
            <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-orange-600 text-sm font-semibold">
              {3 - freeUsed} génération(s) gratuite(s)
            </span>
          </div>
          {/* Drapeaux langue */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setLanguage("fr")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                language === "fr" ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              🇫🇷 FR
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                language === "en" ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              🇬🇧 EN
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Générer une fiche produit</h1>
          <p className="text-gray-400 text-sm">Optimisée SEO pour Amazon et Etsy en 30 secondes</p>
        </div>

        <div className="grid grid-cols-2 gap-10">

          {/* Colonne gauche */}
          <div>

            {/* Plateforme */}
            <div className="mb-6">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-3">Plateforme</label>
              <div className="grid grid-cols-2 gap-2">
                {["amazon", "etsy"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`py-3 rounded-xl font-bold text-sm capitalize transition-all ${
                      platform === p
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {p === "amazon" ? "Amazon" : "Etsy"}
                  </button>
                ))}
              </div>
            </div>

            {/* Catégorie */}
            <div className="mb-6">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-3">Catégorie</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.val}
                    onClick={() => setCategory(c.val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      category === c.val
                        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
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
              <input
                type="text"
                maxLength={80}
                placeholder="Ex: Tasse céramique faite main 350ml"
                className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 transition-all text-sm shadow-sm"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            {/* Caractéristiques */}
            <div className="mb-6">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-2">
                Caractéristiques
                <span className="normal-case text-gray-300 ml-2 font-normal">{features.length}/300</span>
              </label>
              <textarea
                maxLength={300}
                placeholder="Matière, taille, couleur, usage, origine..."
                className="w-full bg-white border border-gray-200 rounded-xl p-3.5 h-36 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 transition-all resize-none text-sm shadow-sm"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || !productName || !features}
              className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-base hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200 transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Génération en cours...
                </span>
              ) : freeUsed >= 3 ? "Passer Pro pour continuer" : "Générer ma fiche"}
            </button>

          </div>

          {/* Colonne droite - Résultat */}
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
                  <button
                    onClick={() => copyText(result, "all")}
                    className="text-xs text-gray-400 hover:text-orange-500 font-semibold transition-colors"
                  >
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
                          <span className="text-orange-500 mt-0.5 shrink-0 font-bold">•</span>
                          {b}
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