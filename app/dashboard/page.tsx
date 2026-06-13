"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import NavbarAuth from "@/components/NavbarAuth";

type Generation = {
  id: string;
  productName: string;
  platform: string;
  category: string;
  result: string;
  createdAt: string;
};

function parseTitle(result: string): string {
  const lines = result.split("\n").filter((l) => l.trim());
  for (const line of lines) {
    if (line.toLowerCase().includes("titre") || line.toLowerCase().includes("title")) {
      const val = line.split(":").slice(1).join(":").trim();
      if (val) return val.replace(/\*\*/g, "");
    }
  }
  return lines[0]?.replace(/\*\*/g, "") ?? "Untitled listing";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("free");
  const [freeUsed, setFreeUsed] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { window.location.href = "/login"; return; }
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/user-status").then((r) => r.json()),
      fetch("/api/generations").then((r) => r.json()),
    ]).then(([userData, genData]) => {
      setPlan(userData.plan ?? "free");
      setFreeUsed(userData.freeUsed ?? 0);
      setGenerations(genData.generations ?? []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [status]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteGeneration = async (id: string) => {
    setDeleting(id);
    await fetch("/api/generations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setGenerations((prev) => prev.filter((g) => g.id !== id));
    setDeleting(null);
  };

  const isPaid = plan === "starter" || plan === "pro";
  const freeRemaining = Math.max(0, 3 - freeUsed);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-orange-500 mx-auto mb-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-4 md:px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50">
        <a href="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Listly AI" width="24" height="24" />
          <span className="text-lg font-bold text-orange-500 tracking-tight">Listly AI</span>
        </a>
        <NavbarAuth />
      </nav>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-1">My listings</h1>
          <p className="text-gray-400 text-sm">All your generated product listings in one place</p>
        </div>

        <div className={`rounded-2xl p-5 mb-8 flex items-center justify-between ${isPaid ? "bg-green-50 border border-green-100" : "bg-orange-50 border border-orange-100"}`}>
          <div>
            <p className={`font-bold text-xs uppercase tracking-wider mb-1 ${isPaid ? "text-green-600" : "text-orange-600"}`}>Current plan</p>
            <p className="text-gray-900 font-black text-xl capitalize">{plan}</p>
            <p className="text-gray-400 text-sm mt-1">
              {isPaid ? "Unlimited listings ✓" : `${freeRemaining} free listing${freeRemaining !== 1 ? "s" : ""} remaining`}
            </p>
          </div>
          {!isPaid && (
            <a href="/#pricing" className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 text-sm transition-colors shadow-lg shadow-orange-200">
              Upgrade
            </a>
          )}
        </div>

        {generations.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4 mx-auto">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
              </svg>
            </div>
            <p className="text-gray-500 font-semibold mb-2">No listings yet</p>
            <p className="text-gray-300 text-sm mb-6">Your generated listings will appear here automatically</p>
            <a href="/generate" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 text-sm transition-colors">
              Generate my first listing
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">
              {generations.length} listing{generations.length > 1 ? "s" : ""} generated
            </p>
            {generations.map((gen) => {
              const title = parseTitle(gen.result);
              const isExpanded = expanded === gen.id;
              return (
                <div key={gen.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between px-5 py-4 cursor-pointer"
                    onClick={() => setExpanded(isExpanded ? null : gen.id)}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                        <span className="text-sm">{gen.platform === "amazon" ? "📦" : "🧶"}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{gen.productName}</p>
                        <p className="text-gray-400 text-xs truncate">{title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${gen.platform === "amazon" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                        {gen.platform}
                      </span>
                      <span className="text-gray-300 text-xs hidden md:block">{formatDate(gen.createdAt)}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`text-gray-300 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-gray-400 text-xs">{formatDate(gen.createdAt)}</span>
                        <div className="flex items-center gap-3">
                          <button onClick={() => copyText(gen.result, gen.id)}
                            className="text-xs text-gray-400 hover:text-orange-500 font-semibold transition-colors">
                            {copied === gen.id ? "✓ Copied!" : "Copy all"}
                          </button>
                          <button onClick={() => deleteGeneration(gen.id)} disabled={deleting === gen.id}
                            className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">
                            {deleting === gen.id ? "..." : "Delete"}
                          </button>
                        </div>
                      </div>
                      <pre className="text-gray-700 text-xs leading-relaxed whitespace-pre-wrap font-sans bg-white rounded-xl p-4 border border-gray-200 max-h-80 overflow-y-auto">
                        {gen.result}
                      </pre>
                      <div className="flex gap-2 mt-3">
                        <a href="/generate" className="text-xs bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                          New listing
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}