"use client";
import { useEffect, useRef, useState } from "react";
import { StarterButton, ProButton } from "@/components/PricingButtons";
import NavbarAuth from "@/components/NavbarAuth";

/* ── CountUp animé ─────────────────────────────────────────────── */
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
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString("fr-FR")}{suffix}
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
    // Reveal
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));

    // Navbar shadow + progress bar
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

export default function Home() {
  useScrollEffects();
  const typewriter = useTypewriter(["en 30 secondes.", "pour Amazon.", "pour Etsy.", "qui convertissent.", "optimisées SEO."]);

  return (
    <>
      {/* Barre de progression */}
      <div id="prog-bar" className="fixed top-0 left-0 h-[2px] bg-orange-500 z-[100] transition-[width] duration-75 w-0" aria-hidden="true" />

      {/* NAVBAR */}
      <nav id="main-nav" className="flex items-center justify-between px-4 md:px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50 w-full transition-shadow duration-300">
        <div className="flex items-center gap-2 min-w-0">
          <img src="/logo.svg" alt="Listly AI" width="26" height="26" className="shrink-0" />
          <span className="font-bold text-orange-500 tracking-tight text-base">Listly AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          <a href="#how" className="hover:text-gray-900 transition-colors">Comment ça marche</a>
          <a href="#pricing" className="hover:text-gray-900 transition-colors">Tarifs</a>
        </div>
        <NavbarAuth />
      </nav>

      <main className="w-full overflow-x-hidden">

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 md:px-10 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="badge-pulse inline-flex items-center bg-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
                Propulsé par Claude · Anthropic
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.06] mb-5 tracking-tight">
                Tes fiches produits<br />
                <span className="text-orange-500 inline-flex items-center gap-1">
                  {typewriter}
                  <span className="inline-block w-[3px] h-[0.85em] bg-orange-400 rounded-sm ml-0.5 align-middle animate-pulse" aria-hidden="true" />
                </span>
              </h1>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                Titres SEO, descriptions persuasives et bullet points optimisés pour Amazon et Etsy — sans effort.
              </p>
              <div className="flex flex-col items-center gap-3">
                <a href="/generate" className="btn-primary inline-flex items-center gap-2 bg-orange-500 text-white px-7 py-3.5 rounded-2xl text-base font-bold shadow-xl shadow-orange-200 w-full sm:w-auto justify-center">
                  Générer ma première fiche — gratuit
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
                <a href="/competitor" className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-5 py-2.5 rounded-2xl text-sm font-semibold hover:border-gray-300 hover:text-gray-900 transition-colors w-full sm:w-auto justify-center shadow-sm">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-orange-400 shrink-0" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  Analyser mes concurrents
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Pro</span>
                </a>
              </div>
              <p className="text-gray-400 text-xs mt-4">3 générations gratuites · Aucune carte requise</p>
            </div>

            {/* Démo card */}
            <div className="reveal max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                </div>
                <span className="text-gray-400 text-xs font-medium">Résultat généré · Bague argent 925</span>
                <span className="ml-auto bg-green-100 text-green-600 text-xs font-bold px-2 py-0.5 rounded-full">✓ Prêt</span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-1.5">Titre SEO</p>
                  <p className="text-gray-900 text-sm font-semibold leading-snug">Bague Femme Argent 925 Minimaliste · Anneau Fin Empilable · Cadeau Bijou Fait Main</p>
                </div>
                <div>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-1.5">Description</p>
                  <p className="text-gray-500 text-xs leading-relaxed">Élégante bague en argent sterling 925 au design épuré, parfaite pour s'empiler avec vos autres bijoux. Fabriquée à la main avec soin, elle s'adapte à toutes les occasions…</p>
                </div>
                <div>
                  <p className="text-orange-500 text-xs font-bold uppercase tracking-wider mb-1.5">Bullet points</p>
                  <ul className="space-y-1.5">
                    {["Argent 925 certifié, hypoallergénique", "Design épuré, empilable avec vos bijoux", "Livraison soignée dans une boîte cadeau"].map(b => (
                      <li key={b} className="text-gray-500 text-xs flex gap-2 items-start"><span className="text-orange-400 shrink-0">✦</span>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="reveal flex justify-center gap-6 md:gap-16 mt-12 text-center">
              <div><CountUp target={1200} suffix="+" /><p className="text-gray-400 text-xs mt-1">fiches générées</p></div>
              <div className="border-l border-gray-200" />
              <div>
                <div className="text-3xl md:text-4xl font-black text-gray-900">30 sec</div>
                <p className="text-gray-400 text-xs mt-1">par fiche</p>
              </div>
              <div className="border-l border-gray-200" />
              <div><CountUp target={4.7} suffix="/5" decimals={1} /><p className="text-gray-400 text-xs mt-1">600+ avis</p></div>
            </div>
          </div>
        </section>

        {/* ── BANNIERE ──────────────────────────────────────────── */}
        <section className="bg-gray-50 border-y border-gray-100 px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-12">
            <p className="text-gray-400 text-xs font-medium shrink-0">Compatible avec :</p>
            {["Amazon", "Etsy", "Shopify", "eBay"].map(b => (
              <span key={b} className="text-gray-400 font-bold text-xs tracking-widest">{b}</span>
            ))}
            <div className="hidden md:flex items-center gap-1.5 ml-auto">
              <span className="text-orange-400 text-sm">★★★★★</span>
              <span className="text-gray-600 text-xs font-semibold">4.7/5</span>
              <span className="text-gray-400 text-xs">· 600+ avis</span>
            </div>
          </div>
        </section>

        {/* ── PROBLÈME / SOLUTION ───────────────────────────────── */}
        <section className="bg-gray-900 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Tu perds des ventes sans le savoir</h2>
              <p className="text-gray-500 text-sm">Chaque heure passée à rédiger est une heure sans vendre</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
              <div className="reveal card-hover bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700">
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-5">Avant Listly</p>
                <ul className="space-y-4">
                  {["1h par fiche produit, en moyenne", "Titres sans mots-clés, invisibles en recherche", "Tes concurrents captent tes clients", "Aucune idée des mots-clés qui convertissent"].map(t => (
                    <li key={t} className="flex items-start gap-3 text-gray-400 text-sm"><span className="text-red-400 mt-0.5 shrink-0 font-bold">✕</span>{t}</li>
                  ))}
                </ul>
              </div>
              <div className="reveal card-hover bg-orange-500 rounded-2xl p-6 md:p-8">
                <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-5">Avec Listly</p>
                <ul className="space-y-4">
                  {["Fiche complète générée en 30 secondes", "Titre optimisé SEO, visible sur Amazon et Etsy", "Bullet points professionnels et persuasifs", "Plus de ventes, beaucoup moins d'effort"].map(t => (
                    <li key={t} className="flex items-start gap-3 text-orange-50 text-sm"><span className="text-white mt-0.5 shrink-0 font-bold">✓</span>{t}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMMENT ÇA MARCHE ─────────────────────────────────── */}
        <section id="how" className="bg-amber-50 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Simple comme bonjour</h2>
              <p className="text-gray-500 text-sm">Trois étapes, zéro expertise requise</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
              {[
                { n: "1", title: "Décris ton produit",   desc: "Nom, matière, taille, couleur — juste les informations de base." },
                { n: "2", title: "L'IA génère ta fiche", desc: "Titre SEO, description et bullet points en moins de 30 secondes." },
                { n: "3", title: "Copie et vends",       desc: "Colle directement dans ta boutique et regarde tes ventes progresser." },
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

        {/* ── AVANT / APRÈS ─────────────────────────────────────── */}
        <section className="bg-white px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">La différence est immédiate</h2>
              <p className="text-gray-500 text-sm">Même produit. Résultat incomparable.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 reveal">
              <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-6">
                <span className="bg-red-100 text-red-500 text-xs font-bold px-3 py-1 rounded-full inline-block mb-5">✕ Sans Listly</span>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Titre</p>
                    <p className="text-gray-600 text-sm">Bague argent femme</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Description</p>
                    <p className="text-gray-500 text-xs leading-relaxed blur-[2px] select-none">Belle bague en argent. Faite à la main. Disponible en plusieurs tailles.</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Bullet points</p>
                    <ul className="space-y-1.5 blur-[2px] select-none">
                      {["En argent", "Fait main", "Joli design"].map(b => (
                        <li key={b} className="text-gray-400 text-xs flex gap-2 items-start"><span className="text-red-300 shrink-0">•</span>{b}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-100 rounded-xl p-3 mt-2">
                    <p className="text-red-500 text-xs font-semibold">👎 Invisible dans les recherches</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border-2 border-green-100 bg-green-50 p-6">
                <span className="bg-green-100 text-green-600 text-xs font-bold px-3 py-1 rounded-full inline-block mb-5">✓ Avec Listly</span>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Titre SEO</p>
                    <p className="text-gray-900 text-sm font-semibold leading-snug">Bague Femme Argent 925 Minimaliste · Anneau Fin Empilable · Cadeau Bijou Fait Main</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Description</p>
                    <p className="text-gray-600 text-xs leading-relaxed">Élégante bague en argent sterling 925 au design épuré, parfaite pour s'empiler avec vos autres bijoux. Fabriquée à la main avec soin…</p>
                  </div>
                  <div className="relative">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1.5">Bullet points</p>
                    <ul className="space-y-1.5">
                      <li className="text-gray-700 text-xs flex gap-2 items-start"><span className="text-green-500 shrink-0">✦</span>Argent 925 certifié, hypoallergénique</li>
                      <li className="text-gray-700 text-xs flex gap-2 items-start blur-[3px] select-none"><span className="text-green-500 shrink-0">✦</span>Design épuré, empilable avec vos bijoux</li>
                      <li className="text-gray-700 text-xs flex gap-2 items-start blur-[3px] select-none"><span className="text-green-500 shrink-0">✦</span>Livraison soignée dans une boîte cadeau</li>
                    </ul>
                    {/* Gradient + CTA sur les bullets floutés */}
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-green-50 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                      <a href="/generate" className="text-[10px] font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                        Voir le résultat complet →
                      </a>
                    </div>
                  </div>
                  <div className="bg-green-100 rounded-xl p-3 mt-2">
                    <p className="text-green-600 text-xs font-semibold">👍 Visible, cliqué, vendu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── POURQUOI PAS CHATGPT ──────────────────────────────── */}
        <section className="bg-gray-900 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Pourquoi ne pas utiliser ChatGPT ?</h2>
              <p className="text-gray-500 text-sm">Bonne question. Voilà la vraie réponse.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
              {[
                { icon: "🎯", title: "Optimisé pour l'e-commerce", desc: "Listly connaît les règles SEO exactes d'Amazon et Etsy — longueur des titres, format des bullet points, densité des mots-clés. ChatGPT ne sait pas ça." },
                { icon: "⚡", title: "30 secondes, pas 10 minutes", desc: "Avec ChatGPT tu dois rédiger ton prompt, itérer, reformater. Avec Listly tu entres ton produit et tu récupères une fiche prête à coller." },
                { icon: "📋", title: "Format prêt à l'emploi", desc: "Listly génère directement dans le format exact requis par chaque plateforme. Aucun reformatage nécessaire." },
                { icon: "🔒", title: "Spécialisé = meilleur résultat", desc: "Un outil dédié à une tâche précise fait toujours mieux qu'un outil généraliste. C'est vrai pour les couteaux, c'est vrai pour l'IA." },
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

        {/* ── CAS D'USAGE ───────────────────────────────────────── */}
        <section className="bg-amber-50 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Pour qui est Listly ?</h2>
              <p className="text-gray-500 text-sm">Toute plateforme, tout produit, tout niveau</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger">
              {[
                { platform: "Etsy",       emoji: "🧶", color: "bg-orange-100 text-orange-700", desc: "Vendeurs artisans qui veulent que leurs créations soient trouvées. Tags optimisés, descriptions chaleureuses, titres naturels." },
                { platform: "Amazon",     emoji: "📦", color: "bg-blue-100 text-blue-700",     desc: "Vendeurs FBA qui gèrent des dizaines de produits. Bullet points au format exact Amazon, titres riches en mots-clés." },
                { platform: "Shopify",    emoji: "🛍️", color: "bg-green-100 text-green-700",   desc: "Boutiques en ligne indépendantes qui veulent des descriptions qui convertissent et un SEO naturel." },
                { platform: "Vinted Pro", emoji: "👗", color: "bg-purple-100 text-purple-700", desc: "Revendeurs pro qui postent des dizaines d'articles par semaine. Descriptions rapides, détaillées et attractives." },
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

        {/* ── AVIS CLIENTS ──────────────────────────────────────── */}
        <section className="bg-white px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Ce qu'ils en disent</h2>
              <p className="text-gray-500 text-sm">Des vendeurs Amazon et Etsy comme toi</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
              {[
                { i: "SL", name: "Sophie L.",  role: "Vendeuse Etsy · Bijoux",        q: "J'ai multiplié mes vues par 3 sur Etsy en deux semaines. Mes anciennes fiches étaient catastrophiques.",           style: "light"  },
                { i: "KM", name: "Karim M.",   role: "Vendeur Amazon · Électronique", q: "200+ produits sur Amazon, rédiger des fiches me prenait des heures. Maintenant c'est 30 secondes.",                  style: "dark"   },
                { i: "AB", name: "Amélie B.",  role: "Vendeuse Etsy · Déco",          q: "Je suis nulle en SEO. Listly fait tout à ma place. Mes produits remontent dans les résultats Etsy.",                 style: "light"  },
                { i: "TR", name: "Thomas R.",  role: "Vendeur Amazon · Mode",         q: "9€/mois pour économiser 10h de travail par semaine. Le meilleur investissement de l'année.",                          style: "light"  },
                { i: "MV", name: "Marie V.",   role: "Vendeuse Etsy · Papeterie",     q: "Aucun outil ne comprend aussi bien les spécificités d'Etsy. Les tags générés sont vraiment pertinents.",             style: "light"  },
                { i: "JD", name: "Julien D.",  role: "Vendeur Amazon · Sport",        q: "Mon taux de conversion a augmenté de 40%. Les descriptions sont tellement meilleures que ce que j'écrivais.",        style: "orange" },
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

        {/* ── PRICING ───────────────────────────────────────────── */}
        <section id="pricing" className="bg-gray-900 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Tarif simple et transparent</h2>
              <p className="text-gray-500 text-sm">Commence gratuitement, passe Pro quand tu es convaincu</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto stagger">
              <div className="reveal card-hover bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 text-left flex flex-col">
                <h3 className="font-bold text-white text-lg mb-2">Gratuit</h3>
                <p className="text-4xl font-black text-white mb-1">0€</p>
                <p className="text-gray-500 text-sm mb-6">pour toujours</p>
                <ul className="text-gray-400 text-sm space-y-3 mb-6 flex-1">
                  {["3 générations gratuites", "Amazon et Etsy", "Sans carte bancaire"].map(f => (
                    <li key={f} className="flex gap-2.5"><span className="text-orange-400 shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="/generate" className="btn-primary block w-full bg-gray-700 text-white py-3 rounded-xl font-semibold text-center text-sm">Commencer</a>
              </div>
              <div className="reveal card-hover bg-orange-500 rounded-2xl p-6 md:p-8 relative text-left flex flex-col">
                <span className="absolute top-4 right-4 bg-white text-orange-500 text-xs font-bold px-2.5 py-0.5 rounded-full">Populaire</span>
                <h3 className="font-bold text-white text-lg mb-2">Starter</h3>
                <p className="text-4xl font-black text-white mb-1">9€</p>
                <p className="text-orange-200 text-sm mb-6">par mois</p>
                <ul className="text-orange-100 text-sm space-y-3 mb-6 flex-1">
                  {["Générations illimitées", "Amazon et Etsy", "Titres SEO optimisés", "Bullet points pro"].map(f => (
                    <li key={f} className="flex gap-2.5"><span className="text-white shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <StarterButton />
              </div>
              <div className="reveal card-hover bg-gray-800 rounded-2xl p-6 md:p-8 border border-orange-500 text-left flex flex-col">
                <div className="bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-3 self-start">Tout inclus</div>
                <h3 className="font-bold text-white text-lg mb-2">Pro</h3>
                <p className="text-4xl font-black text-white mb-1">19,99€</p>
                <p className="text-gray-500 text-sm mb-6">par mois</p>
                <ul className="text-gray-400 text-sm space-y-3 mb-6 flex-1">
                  {["Tout du plan Starter", "Analyse de boutique", "Analyse des images", "Audit publicitaire", "Support prioritaire"].map(f => (
                    <li key={f} className="flex gap-2.5"><span className="text-orange-400 shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <ProButton />
                <a href="/competitor" className="block w-full text-center text-orange-400 text-xs mt-3 hover:text-orange-300 transition-colors">Voir l'analyse concurrente →</a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section className="bg-white px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-2xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Questions fréquentes</h2>
              <p className="text-gray-500 text-sm">Tout ce que tu dois savoir avant de commencer</p>
            </div>
            <div className="space-y-3 reveal">
              {[
                { q: "Les fiches sont-elles vraiment optimisées pour le SEO ?", a: "Oui. Listly utilise l'IA Claude d'Anthropic, entraînée sur des milliers de fiches produits performantes." },
                { q: "Quelle différence entre Starter et Pro ?",                 a: "Starter génère des fiches illimitées. Pro ajoute l'analyse complète de ta boutique, l'audit images et publicités." },
                { q: "Puis-je annuler à tout moment ?",                          a: "Oui, sans engagement et sans frais. Tu peux annuler en un clic depuis ton espace compte." },
                { q: "Toutes les catégories de produits ?",                       a: "Oui. Bijoux, électronique, vêtements, décoration — Listly s'adapte à ta catégorie." },
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

        {/* ── CTA FINAL ─────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-orange-500 to-amber-500 px-4 md:px-10 py-16 md:py-24 text-center">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Prêt à vendre plus ?</h2>
            <p className="text-orange-100 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Des centaines de vendeurs ont déjà transformé leurs fiches avec Listly.
            </p>
            <a href="/generate" className="btn-primary inline-flex items-center gap-2 bg-white text-orange-500 px-8 py-4 rounded-2xl text-base font-bold shadow-xl">
              Commencer gratuitement
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <footer className="bg-gray-900 px-4 md:px-10 py-8 border-t border-gray-800">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <span className="text-orange-500 font-bold text-xl">Listly AI</span>
            <p className="text-gray-500 text-sm">© 2025 Listly AI · Tous droits réservés</p>
            <div className="flex gap-6 text-gray-500 text-sm">
              <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white transition-colors">CGU</a>
            </div>
          </div>
        </footer>

      </main>
    </>
  );
}