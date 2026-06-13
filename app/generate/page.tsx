"use client";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

const CATEGORIES = [
  { val: "general", label: "General" },
  { val: "mode", label: "Fashion" },
  { val: "maison", label: "Home" },
  { val: "bijoux", label: "Jewelry" },
  { val: "electronique", label: "Electronics" },
  { val: "sport", label: "Sports" },
  { val: "beaute", label: "Beauty" },
  { val: "art", label: "Art" },
];

const FREE_LIMIT = 3;

/* ── Score SEO ───────────────────────────────────────────────────
   Calcule un score 0-100 basé sur longueur titre, mots-clés, bullets
   ─────────────────────────────────────────────────────────────── */
function calcSeoScore(title: string, bullets: string[], description: string, platform: string): number {
  let score = 0;

  // Titre
  if (title.length > 0) score += 20;
  if (platform === "etsy" && title.length >= 80 && title.length <= 140) score += 20;
  else if (platform === "amazon" && title.length >= 100 && title.length <= 200) score += 20;
  else if (title.length >= 40) score += 10;

  // Séparateurs dans le titre (·, -, ,)
  const separators = (title.match(/[·\-,]/g) || []).length;
  if (separators >= 2) score += 10;

  // Bullet points
  if (bullets.length >= 3) score += 15;
  if (bullets.length >= 5) score += 10;

  // Description
  if (description.length > 100) score += 15;
  if (description.length > 300) score += 10;

  return Math.min(score, 100);
}

function SeoScore({ score }: { score: number }) {
  const color = score >= 80 ? "text-green-600" : score >= 50 ? "text-orange-500" : "text-red-500";
  const bg = score >= 80 ? "bg-green-50 border-green-200" : score >= 50 ? "bg-orange-50 border-orange-200" : "bg-red-50 border-red-200";
  const barColor = score >= 80 ? "bg-green-500" : score >= 50 ? "bg-orange-500" : "bg-red-500";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : score >= 40 ? "Average" : "Needs work";

  return (
    <div className={`rounded-xl border p-4 ${bg}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">SEO Score</span>
        <span className={`text-2xl font-black ${color}`}>{score}<span className="text-sm font-semibold text-gray-400">/100</span></span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
        <div className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${score}%` }} />
      </div>
      <p className={`text-xs font-semibold ${color}`}>{label}</p>
    </div>
  );
}

export default function GeneratePage() {
  const { data: session, status } = useSession();
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [platform, setPlatform] = useState("etsy");
  const [language, setLanguage] = useState("en");
  const [category, setCategory] = useState("general");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [freeUsed, setFreeUsed] = useState(0);
  const [plan, setPlan] = useState<"free" | "starter" | "pro">("free");
  const [limitReached, setLimitReached] = useState(false);

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
        body: JSON.stringify({ imageBase64: base64.split(",")[1], mediaType: file.type }),
      });
      const data = await res.json();
      if (data.productName) setProductName(data.productName);
      if (data.features) setFeatures(data.features);
      setAnalyzingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!session) { signIn("google", { callbackUrl: "/generate" }); return; }
    if (!productName || !features) return;
    setLoading(true);
    setResult(null);
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productName, features, platform, language, category }),
    });
    const data = await res.json();
    if (res.status === 403 && data.error === "limit_reached") { setLimitReached(true); setLoading(false); return; }
    if (res.status === 401) { signIn("google", { callbackUrl: "/generate" }); setLoading(false); return; }
    if (!res.ok) { setLoading(false); return; }
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
  const seoScore = parsed ? calcSeoScore(parsed.title, parsed.bullets, parsed.description, platform) : 0;
  const freeRemaining = Math.max(0, FREE_LIMIT - freeUsed);
  const isPaid = plan === "starter" || plan === "pro";

  return (
    <main className="min-h-screen bg-[#FAFAFA]">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-gray-100 sticky top-0 bg-white z-50 shadow-sm">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Listly AI" width="24" height="24" />
          <span className="text-lg font-bold text-orange-500 tracking-tight">Listly AI</span>
        </a>
        <div className="flex items-center gap-3">
          {!isPaid && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${freeRemaining === 0 ? "bg-red-50 border-red-100 text-red-600" : "bg-orange-50 border-orange-100 text-orange-600"}`}>
              <div className={`h-1.5 w-1.5 rounded-full animate-pulse ${freeRemaining === 0 ? "bg-red-500" : "bg-orange-500"}`} />
              {freeRemaining} free listing{freeRemaining !== 1 ? "s" : ""} left
            </div>
          )}
          {isPaid && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full text-xs font-semibold text-green-600">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
              {plan} plan ✓
            </div>
          )}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {["en", "fr"].map((l) => (
              <button key={l} onClick={() => setLanguage(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${language === l ? "bg-white shadow text-gray-900" : "text-gray-400 hover:text-gray-600"}`}>
                {l === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">Generate a product listing</h1>
          <p className="text-gray-400 text-sm">SEO-optimized for Etsy & Amazon in 30 seconds</p>
        </div>

        {/* Paywall modal */}
        {limitReached && !isPaid && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-500">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">You've used your 3 free listings</h2>
                <p className="text-gray-500 text-sm leading-relaxed">Upgrade to Starter for unlimited listings.</p>
              </div>
              <div className="space-y-3">
                <button onClick={() => goToPricing("starter")}
                  className="w-full bg-orange-500 text-white py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200">
                  Starter — $9/month · Unlimited
                </button>
                <button onClick={() => goToPricing("pro")}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                  Pro — $19/month · All features
                </button>
                <a href="/" className="block text-center text-gray-400 text-sm mt-2 hover:text-gray-600">Back to home</a>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* ── Left column ──────────────────────────────────── */}
          <div className="space-y-5">

            {/* Platform */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-3">Platform</label>
              <div className="grid grid-cols-2 gap-2">
                {["etsy", "amazon"].map((p) => (
                  <button key={p} onClick={() => setPlatform(p)}
                    className={`py-3 rounded-xl font-bold text-sm capitalize transition-all ${platform === p ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                    {p === "amazon" ? "Amazon" : "Etsy"}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-3">Analyze a photo</label>
              <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                {analyzingImage ? (
                  <div className="flex flex-col items-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-orange-500" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <p className="text-orange-500 text-sm font-semibold">Analyzing...</p>
                  </div>
                ) : imagePreview ? (
                  <div className="flex flex-col items-center gap-2">
                    <img src={imagePreview} alt="preview" className="h-16 w-16 object-cover rounded-lg" />
                    <p className="text-gray-400 text-xs">Click to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-300">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <p className="text-gray-400 text-sm">Upload a product photo</p>
                    <p className="text-gray-300 text-xs">AI fills in the fields automatically</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>

            {/* Category + Fields */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-3">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button key={c.val} onClick={() => setCategory(c.val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${category === c.val ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-2">
                  Product name
                  <span className="normal-case text-gray-300 ml-2 font-normal">{productName.length}/80</span>
                </label>
                <input type="text" maxLength={80} placeholder="e.g. Handmade ceramic mug 12oz"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:bg-white transition-all text-sm"
                  value={productName} onChange={(e) => setProductName(e.target.value)} />
              </div>

              <div>
                <label className="text-gray-500 text-xs font-semibold uppercase tracking-widest block mb-2">
                  Details
                  <span className="normal-case text-gray-300 ml-2 font-normal">{features.length}/300</span>
                </label>
                <textarea maxLength={300} placeholder="Material, size, color, use, origin..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 h-32 text-gray-900 placeholder-gray-300 focus:outline-none focus:border-orange-400 focus:bg-white transition-all resize-none text-sm"
                  value={features} onChange={(e) => setFeatures(e.target.value)} />
              </div>
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
                  Generating...
                </span>
              ) : !session ? "Sign in to generate"
                : limitReached ? "Upgrade to continue"
                : "Generate my listing"}
            </button>
          </div>

          {/* ── Right column — Result ─────────────────────────── */}
          <div>
            {!result && !loading && (
              <div className="h-full min-h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                  </svg>
                </div>
                <p className="text-gray-400 text-sm font-medium">Your result will appear here</p>
                <p className="text-gray-300 text-xs mt-1">Fill in the form and click Generate</p>
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
                <p className="text-orange-500 font-semibold text-sm">AI is writing your listing...</p>
                <p className="text-gray-400 text-xs mt-1">About 10 seconds</p>
              </div>
            )}

            {result && parsed && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-gray-900 font-bold text-lg">Result</h2>
                  <button onClick={() => copyText(result, "all")} className="text-xs text-gray-400 hover:text-orange-500 font-semibold transition-colors">
                    {copied === "all" ? "✓ Copied!" : "Copy all"}
                  </button>
                </div>

                {/* SEO Score */}
                <SeoScore score={seoScore} />

                {parsed.title && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">SEO Title</span>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold ${parsed.title.length > 140 ? "text-red-400" : "text-gray-300"}`}>
                          {parsed.title.length} chars
                        </span>
                        <button onClick={() => copyText(parsed.title, "title")} className="text-xs text-gray-400 hover:text-orange-500 font-semibold">
                          {copied === "title" ? "✓" : "Copy"}
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
                        {copied === "bullets" ? "✓" : "Copy"}
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
                        <span className="text-gray-300 text-xs">{parsed.description.length} chars</span>
                        <button onClick={() => copyText(parsed.description, "desc")} className="text-xs text-gray-400 hover:text-orange-500 font-semibold">
                          {copied === "desc" ? "✓" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{parsed.description}</p>
                  </div>
                )}

                {platform === "etsy" && parsed.tags && (
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-orange-500 text-xs font-bold uppercase tracking-wider">
                        Etsy Tags
                        <span className="ml-2 text-gray-300 font-normal normal-case">
                          {parsed.tags.split(",").filter(t => t.trim()).length}/13
                        </span>
                      </span>
                      <button onClick={() => copyText(parsed.tags, "tags")} className="text-xs text-gray-400 hover:text-orange-500 font-semibold">
                        {copied === "tags" ? "✓" : "Copy"}
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

                {/* Save to dashboard link */}
                <div className="flex items-center justify-center pt-2">
                  <a href="/dashboard" className="text-xs text-gray-400 hover:text-orange-500 transition-colors font-semibold">
                    View all my listings →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}