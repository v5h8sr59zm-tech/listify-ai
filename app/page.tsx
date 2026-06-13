"use client";
import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { StarterButton, ProButton } from "@/components/PricingButtons";
import NavbarAuth from "@/components/NavbarAuth";

/* ── CountUp ───────────────────────────────────────────────────── */
function CountUp({ target, suffix = "", decimals = 0 }: { target: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) {
        setStarted(true);
        const start = Date.now();
        const duration = 1400;
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.round(eased * target * Math.pow(10, decimals)) / Math.pow(10, decimals));
          if (progress < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, started, decimals]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-black text-gray-900">
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString("en-US")}{suffix}
    </div>
  );
}

/* ── Typewriter ────────────────────────────────────────────────── */
function useTypewriter(words: string[], speed = 75) {
  const [displayed, setDisplayed] = useState(words[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(words[0].length);
  const [deleting, setDeleting] = useState(false);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    if (paused) {
      const t = setTimeout(() => setPaused(false), 1800);
      return () => clearTimeout(t);
    }
    const current = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, charIndex + 1);
        setDisplayed(next);
        if (charIndex + 1 === current.length) { setPaused(true); setDeleting(true); }
        else setCharIndex(c => c + 1);
      } else {
        const next = current.slice(0, charIndex - 1);
        setDisplayed(next);
        if (charIndex - 1 === 0) {
          setDeleting(false);
          const nextWord = (wordIndex + 1) % words.length;
          setWordIndex(nextWord);
          setCharIndex(0);
        } else setCharIndex(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, paused]);

  return displayed;
}

/* ── Scroll hooks ──────────────────────────────────────────────── */
function useScrollEffects() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    const nav = document.getElementById("main-nav");
    const bar = document.getElementById("prog-bar");
    const onScroll = () => {
      nav?.classList.toggle("navbar-scrolled", window.scrollY > 8);
      if (bar) bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { obs.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);
}

function HomeContent() {
  useScrollEffects();
  const typewriter = useTypewriter(["in 30 seconds.", "that sell more.", "for Etsy.", "for Amazon.", "SEO-optimized."]);
  const searchParams = useSearchParams();
  const highlightPro = searchParams.get("highlight") === "pro";

  useEffect(() => {
    if (highlightPro) {
      setTimeout(() => {
        document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
      const card = document.getElementById("pro-card");
      if (card) {
        card.classList.add("ring-4", "ring-orange-400", "ring-opacity-75");
        setTimeout(() => { card.classList.remove("animate-pulse"); }, 4000);
      }
    }
  }, [highlightPro]);

  return (
    <>
      <div id="prog-bar" className="fixed top-0 left-0 h-[2px] bg-orange-500 z-[100] transition-[width] duration-75 w-0" aria-hidden="true" />

      {/* NAVBAR */}
      <nav id="main-nav" className="flex items-center justify-between px-4 md:px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50 w-full transition-shadow duration-300">
        <div className="flex items-center gap-2 min-w-0">
          <img src="/logo.svg" alt="Listly AI" width="26" height="26" className="shrink-0" />
          <span className="font-bold text-orange-500 tracking-tight text-base">Listly AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          <a href="#how" className="hover:text-gray-900 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
        </div>
        <NavbarAuth />
      </nav>

      <main className="w-full overflow-x-hidden">

        {/* HERO */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 md:px-10 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="badge-pulse inline-flex items-center bg-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
                Build for Etsy sellers
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.06] mb-5 tracking-tight">
                Your Etsy listings,<br />
                <span className="text-orange-500 inline-flex items-center gap-1">
                  {typewriter}
                  <span className="inline-block w-[3px] h-[0.85em] bg-orange-400 rounded-sm ml-0.5 align-middle animate-pulse" aria-hidden="true" />
                </span>
              </h1>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                SEO titles, persuasive descriptions and optimized bullet points for Etsy & Amazon — in seconds, not hours.
              </p>
              <div className="flex flex-col items-center gap-3">
                <a href="/generate" className="btn-primary inline-flex items-center gap-2 bg-orange-500 text-white px-7 py-3.5 rounded-2xl text-base font-bold shadow-xl shadow-orange-200 w-full sm:w-auto justify-center">
                  Generate my first listing — free
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="/competitor" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-2xl text-sm font-semibold hover:border-gray-300 hover:text-gray-900 transition-colors w-full sm:w-auto justify-center shadow-sm">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-orange-400 shrink-0" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Analyze competitors
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Pro</span>
                </a>
              </div>
              <p className="text-gray-400 text-xs mt-4">3 free listings · No credit card required</p>
            </div>

            {/* Demo card */}
            <div className="reveal max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                </div>
                <span className="text-gray-400 text-xs font-medium">Generated listing · Sterling silver ring</span>
                <span className="ml-auto bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">✓ Ready</span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-1.5">SEO Title</p>
                  <p className="text-gray-900 text-sm font-semibold leading-snug">Minimalist Sterling Silver Ring · Stackable Thin Band · Handmade Jewelry Gift for Women</p>
                </div>
                <div>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-1.5">Description</p>
                  <p className="text-gray-500 text-xs leading-relaxed">Elegant 925 sterling silver ring with a clean, minimal design — perfect for stacking with your favorite jewelry. Handcrafted with care, it suits every occasion…</p>
                </div>
                <div>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-1.5">Bullet points</p>
                  <ul className="space-y-1.5">
                    {["Certified 925 sterling silver, hypoallergenic", "Minimal design, stackable with any jewelry", "Ships in a ready-to-gift box"].map(b => (
                      <li key={b} className="text-gray-500 text-xs flex gap-2 items-start"><span className="text-orange-400 shrink-0">✦</span>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="reveal flex justify-center gap-6 md:gap-16 mt-12 text-center">
              <div><CountUp target={1200} suffix="+" /><p className="text-gray-400 text-xs mt-1">listings generated</p></div>
              <div className="border-l border-gray-200" />
              <div>
                <div className="text-3xl md:text-4xl font-black text-gray-900">30 sec</div>
                <p className="text-gray-400 text-xs mt-1">per listing</p>
              </div>
              <div className="border-l border-gray-200" />
              <div><CountUp target={4.7} suffix="/5" decimals={1} /><p className="text-gray-400 text-xs mt-1">600+ reviews</p></div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <section className="bg-gray-50 border-y border-gray-100 px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-12">
            <p className="text-gray-400 text-xs font-medium shrink-0">Works with:</p>
            {["Etsy", "Amazon", "Shopify", "eBay"].map(b => (
              <span key={b} className="text-gray-400 font-bold text-xs tracking-widest">{b}</span>
            ))}
            <div className="hidden md:flex items-center gap-1.5 ml-auto">
              <span className="text-orange-400 text-sm">★★★★★</span>
              <span className="text-gray-600 text-xs font-semibold">4.7/5</span>
              <span className="text-gray-400 text-xs">· 600+ reviews</span>
            </div>
          </div>
        </section>

        {/* PROBLEM / SOLUTION */}
        <section className="bg-gray-900 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">You're losing sales without knowing it</h2>
              <p className="text-gray-500 text-sm">Every hour spent writing is an hour not selling</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
              <div className="reveal card-hover bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-5">Without Listly</p>
                <ul className="space-y-4">
                  {["1 hour per listing, on average", "Titles with no keywords — invisible in search", "Competitors are stealing your customers", "No idea which keywords actually convert"].map(t => (
                    <li key={t} className="flex items-start gap-3 text-gray-400 text-sm"><span className="text-red-400 mt-0.5 shrink-0 font-bold">✕</span>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="reveal card-hover bg-orange-500 rounded-2xl p-6 md:p-8">
                <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-5">With Listly</p>
                <ul className="space-y-4">
                  {["Full listing generated in 30 seconds", "SEO-optimized title, visible on Etsy & Amazon", "Professional, persuasive bullet points", "More sales, way less effort"].map(t => (
                    <li key={t} className="flex items-start gap-3 text-orange-50 text-sm"><span className="text-white mt-0.5 shrink-0 font-bold">✓</span>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how" className="bg-amber-50 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Simple as it gets</h2>
              <p className="text-gray-500 text-sm">Three steps, zero expertise required</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
              {[
                { n: "1", title: "Describe your product", desc: "Name, material, size, color — just the basics." },
                { n: "2", title: "AI writes your listing", desc: "SEO title, description and bullet points in under 30 seconds." },
                { n: "3", title: "Copy and sell", desc: "Paste directly into your shop and watch your sales grow." },
              ].map(({ n, title, desc }) => (
                <div key={n} className="reveal card-hover bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-amber-100">
                  <div className="w-11 h-11 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-black text-lg mb-4 mx-auto">{n}</div>
                  <h4 className="font-bold text-gray-900 mb-2 text-base">{title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BEFORE / AFTER */}
        <section className="bg-white px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">The difference is immediate</h2>
              <p className="text-gray-500 text-sm">Same product. Incomparable result.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal">
              <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-6">
                <span className="bg-red-100 text-red-500 text-xs font-bold px-3 py-1 rounded-full inline-block mb-5">✕ Without Listly</span>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Title</p>
                    <p className="text-gray-600 text-sm">Silver ring for women</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Description</p>
                    <p className="text-gray-500 text-xs leading-relaxed blur-[2px] select-none">Nice silver ring. Handmade. Available in multiple sizes.</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Bullet points</p>
                    <ul className="space-y-1.5 blur-[2px] select-none">
                      {["Silver", "Handmade", "Nice design"].map(b => (
                        <li key={b} className="text-gray-400 text-xs flex gap-2 items-start"><span className="text-red-300 shrink-0">•</span>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-100 rounded-xl p-3 mt-2">
                    <p className="text-red-500 text-xs font-semibold">👎 Invisible in search results</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-green-100 bg-green-50 p-6">
                <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full inline-block mb-5">✓ With Listly</span>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">SEO Title</p>
                    <p className="text-gray-900 text-sm font-semibold leading-snug">Minimalist Sterling Silver Ring · Stackable Thin Band · Handmade Jewelry Gift for Women</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Description</p>
                    <p className="text-gray-600 text-xs leading-relaxed">Elegant 925 sterling silver ring with a clean, minimal design — perfect for stacking with your favorite jewelry. Handcrafted with care…</p>
                  </div>
                  <div className="relative">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Bullet points</p>
                    <ul className="space-y-1.5">
                      <li className="text-gray-700 text-xs flex gap-2 items-start"><span className="text-green-500 shrink-0">✦</span>Certified 925 sterling silver, hypoallergenic</li>
                      <li className="text-gray-700 text-xs flex gap-2 items-start blur-[3px] select-none"><span className="text-green-500 shrink-0">✦</span>Minimal design, stackable with any jewelry</li>
                      <li className="text-gray-700 text-xs flex gap-2 items-start blur-[3px] select-none"><span className="text-green-500 shrink-0">✦</span>Ships in a ready-to-gift box</li>
                    </ul>
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-green-50 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                      <a href="/generate" className="text-[10px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                        See the full result →
                      </a>
                    </div>
                  </div>
                  <div className="bg-green-100 rounded-xl p-3 mt-2">
                    <p className="text-green-600 text-xs font-semibold">👍 Found, clicked, sold</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY NOT CHATGPT */}
        <section className="bg-gray-900 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Why not just use ChatGPT?</h2>
              <p className="text-gray-500 text-sm">Fair question. Here's the honest answer.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
              {[
                { icon: "🎯", title: "Built for e-commerce", desc: "Listly knows the exact SEO rules for Etsy & Amazon — title length, bullet point format, keyword density. ChatGPT doesn't." },
                { icon: "⚡", title: "30 seconds, not 10 minutes", desc: "With ChatGPT you write the prompt, iterate, reformat. With Listly you enter your product and get a listing ready to paste." },
                { icon: "📋", title: "Platform-ready format", desc: "Listly generates directly in the exact format each platform requires. No reformatting needed." },
                { icon: "🔒", title: "Specialized = better results", desc: "A tool built for one specific task always outperforms a generalist. True for knives, true for AI." },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="reveal card-hover bg-gray-800 rounded-2xl p-6 border border-gray-700">
                  <span className="text-2xl mb-3 block" aria-hidden="true">{icon}</span>
                  <h4 className="font-bold text-white text-base mb-2">{title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IS IT FOR */}
        <section className="bg-amber-50 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Who is Listly for?</h2>
              <p className="text-gray-500 text-sm">Any platform, any product, any level</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
              {[
                { platform: "Etsy", emoji: "🧶", color: "bg-orange-100 text-orange-700", desc: "Handmade sellers who want their creations to be found. Optimized tags, warm descriptions, natural-sounding titles." },
                { platform: "Amazon", emoji: "📦", color: "bg-blue-100 text-blue-700", desc: "FBA sellers managing dozens of products. Bullet points in Amazon's exact format, keyword-rich titles." },
                { platform: "Shopify", emoji: "🛍️", color: "bg-green-100 text-green-700", desc: "Independent online stores that want converting product descriptions and natural SEO." },
                { platform: "Vinted Pro", emoji: "👗", color: "bg-purple-100 text-purple-700", desc: "Pro resellers posting dozens of items per week. Fast, detailed, attractive descriptions." },
              ].map(({ platform, emoji, color, desc }) => (
                <div key={platform} className="reveal card-hover bg-white rounded-2xl p-6 shadow-sm border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl" aria-hidden="true">{emoji}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${color}`}>{platform}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-white px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">What sellers are saying</h2>
              <p className="text-gray-500 text-sm">Etsy and Amazon sellers just like you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
              {[
                { i: "SL", name: "Sophie L.", role: "Etsy seller · Jewelry", q: "My views tripled on Etsy in two weeks. My old listings were terrible — I had no idea what I was doing wrong.", style: "light" },
                { i: "KM", name: "Karim M.", role: "Amazon seller · Electronics", q: "200+ products on Amazon. Writing listings used to take hours. Now it's 30 seconds.", style: "dark" },
                { i: "AB", name: "Amélie B.", role: "Etsy seller · Home decor", q: "I'm terrible at SEO. Listly handles everything. My products actually show up in Etsy search now.", style: "light" },
                { i: "TR", name: "Thomas R.", role: "Amazon seller · Fashion", q: "$10/month to save 10 hours of work a week. Best investment I've made this year.", style: "light" },
                { i: "MV", name: "Marie V.", role: "Etsy seller · Stationery", q: "No other tool understands Etsy-specific SEO this well. The tags it generates are genuinely on point.", style: "light" },
                { i: "JD", name: "Julien D.", role: "Amazon seller · Sports", q: "My conversion rate went up 40%. The descriptions are so much better than anything I wrote myself.", style: "orange" },
              ].map(({ i, name, role, q, style }) => (
                <div key={name} className={`reveal card-hover rounded-2xl p-6 ${style === "orange" ? "bg-orange-500" : style === "dark" ? "bg-gray-900" : "bg-gray-50 border border-gray-100"}`}>
                  <div className="flex gap-1 mb-3">{[1,2,3,4,5].map(s => <span key={s} className="text-orange-400">★</span>)}</div>
                  <p className={`text-sm leading-relaxed mb-5 ${style === "orange" ? "text-orange-100" : style === "dark" ? "text-gray-300" : "text-gray-700"}`}>"{q}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${style === "orange" ? "bg-white text-orange-500" : style === "dark" ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-600"}`}>{i}</div>
                    <div className="min-w-0">
                      <p className={`font-semibold text-sm ${style === "light" ? "text-gray-900" : "text-white"}`}>{name}</p>
                      <p className={`text-xs ${style === "orange" ? "text-orange-200" : style === "dark" ? "text-gray-500" : "text-gray-400"}`}>{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="bg-gray-900 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Simple, transparent pricing</h2>
              <p className="text-gray-500 text-sm">Start for free, upgrade when you're ready</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto stagger">
              <div className="reveal card-hover bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 text-left flex flex-col">
                <h3 className="font-bold text-white text-lg mb-2">Free</h3>
                <p className="text-4xl font-black text-white mb-1">$0</p>
                <p className="text-gray-500 text-sm mb-6">forever</p>
                <ul className="text-gray-400 text-sm space-y-3 mb-6 flex-1">
                  {["3 free listings", "Etsy & Amazon", "No credit card"].map(f => (
                    <li key={f} className="flex gap-2.5"><span className="text-orange-400 shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="/generate" className="btn-primary block w-full bg-gray-700 text-white py-3 rounded-xl font-semibold text-center text-sm">Get started</a>
              </div>
              <div className="reveal card-hover bg-orange-500 rounded-2xl p-6 md:p-8 relative text-left flex flex-col">
                <span className="absolute top-4 right-4 bg-white text-orange-500 text-xs font-bold px-2.5 py-0.5 rounded-full">Popular</span>
                <h3 className="font-bold text-white text-lg mb-2">Starter</h3>
                <p className="text-4xl font-black text-white mb-1">$9</p>
                <p className="text-orange-200 text-sm mb-6">per month</p>
                <ul className="text-orange-100 text-sm space-y-3 mb-6 flex-1">
                  {["Unlimited listings", "Etsy & Amazon", "SEO-optimized titles", "Pro bullet points"].map(f => (
                    <li key={f} className="flex gap-2.5"><span className="text-white shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <StarterButton />
              </div>
              <div className={`reveal card-hover bg-gray-800 rounded-2xl p-6 md:p-8 border-2 text-left flex flex-col transition-all ${highlightPro ? "border-orange-500 ring-4 ring-orange-400 ring-opacity-50 animate-pulse" : "border-orange-500"}`} id="pro-card">
                <div className="bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-3 self-start">All-in</div>
                <h3 className="font-bold text-white text-lg mb-2">Pro</h3>
                <p className="text-4xl font-black text-white mb-1">$19</p>
                <p className="text-gray-500 text-sm mb-6">per month</p>
                <ul className="text-gray-400 text-sm space-y-3 mb-6 flex-1">
                  {["Everything in Starter", "Competitor analysis", "Image analysis", "Ad audit", "Priority support"].map(f => (
                    <li key={f} className="flex gap-2.5"><span className="text-orange-400 shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <ProButton />
                <a href="/competitor" className="block w-full text-center text-orange-400 text-xs mt-3 hover:text-orange-300 transition-colors">See competitor analysis →</a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-2xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Frequently asked questions</h2>
              <p className="text-gray-500 text-sm">Everything you need to know before getting started</p>
            </div>
            <div className="space-y-3 reveal">
              {[
                { q: "Are the listings really SEO-optimized?", a: "Yes. Listly uses Anthropic's Claude AI, trained on thousands of high-performing product listings." },
                { q: "What's the difference between Starter and Pro?", a: "Starter gives you unlimited listings. Pro adds full competitor shop analysis, image analysis and ad audits." },
                { q: "Can I cancel anytime?", a: "Yes, no commitment, no fees. Cancel in one click from your account." },
                { q: "Does it work for all product categories?", a: "Yes. Jewelry, electronics, clothing, home decor — Listly adapts to your category." },
              ].map(({ q, a }) => (
                <details key={q} className="bg-gray-50 rounded-2xl border border-gray-100 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center text-sm p-5 list-none gap-4">
                    <span>{q}</span>
                    <span className="faq-icon text-orange-500 shrink-0 text-xl font-light">+</span>
                  </summary>
                  <p className="text-gray-500 text-sm px-5 pb-5 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="bg-gradient-to-br from-orange-500 to-amber-500 px-4 md:px-10 py-16 md:py-24 text-center">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Ready to sell more?</h2>
            <p className="text-orange-100 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Join hundreds of sellers who've already transformed their listings with Listly.
            </p>
            <a href="/generate" className="btn-primary inline-flex items-center gap-2 bg-white text-orange-500 px-8 py-4 rounded-2xl text-base font-bold shadow-xl">
              Start for free
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 px-4 md:px-10 py-8 border-t border-gray-800">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <span className="text-orange-500 font-bold text-xl">Listly AI</span>
            <p className="text-gray-500 text-sm">© 2025 Listly AI · All rights reserved</p>
            <div className="flex gap-6 text-gray-500 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}