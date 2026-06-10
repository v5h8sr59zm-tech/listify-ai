"use client";
import { useEffect, useRef } from "react";
import { StarterButton, ProButton } from "@/components/PricingButtons";
import NavbarAuth from "@/components/NavbarAuth";

/* ── IntersectionObserver : ajoute .visible sur chaque .reveal ── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ── Navbar shadow au scroll ── */
function useNavbarScroll() {
  useEffect(() => {
    const nav = document.getElementById("main-nav");
    const handler = () => nav?.classList.toggle("navbar-scrolled", window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}

export default function Home() {
  useScrollReveal();
  useNavbarScroll();

  return (
    <>
      {/* NAVBAR */}
      <nav id="main-nav" className="flex items-center justify-between px-4 md:px-10 py-4 bg-white border-b border-gray-100 sticky top-0 z-50 w-full transition-shadow duration-300">
        <div className="flex items-center gap-2 min-w-0">
          <img src="/logo.svg" alt="Listly AI" width="26" height="26" className="shrink-0" />
          <span className="font-bold text-orange-500 tracking-tight text-base">Listly AI</span>
        </div>
        <NavbarAuth />
      </nav>

      <main className="w-full overflow-x-hidden">

        {/* HERO */}
        <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 md:px-10 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              {/* Badge avec point pulsant */}
              <span className="badge-pulse inline-flex items-center bg-orange-100 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
                Propulsé par Claude · Anthropic
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.06] mb-5 tracking-tight">
                Tes fiches produits<br/>
                <span className="text-orange-500">en 30 secondes.</span>
              </h1>
              <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-lg mx-auto">
                Titres SEO, descriptions persuasives et bullet points optimisés pour Amazon et Etsy — sans effort.
              </p>
              <a href="/generate" className="btn-primary inline-flex items-center gap-2 bg-orange-500 text-white px-7 py-3.5 rounded-2xl text-base font-bold shadow-xl shadow-orange-200">
                Générer ma première fiche — gratuit
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <p className="text-gray-400 text-xs mt-3">3 générations gratuites · Aucune carte requise</p>
            </div>

            {/* Démo card avec apparition */}
            <div className="reveal max-w-xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-100 px-5 py-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
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
                  <ul className="space-y-1">
                    {["Argent 925 certifié, hypoallergénique", "Design épuré, empilable avec vos bijoux", "Livraison soignée dans une boîte cadeau"].map(b => (
                      <li key={b} className="text-gray-500 text-xs flex gap-2"><span className="text-orange-400 shrink-0">✦</span>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Stats avec stagger */}
            <div className="flex justify-center gap-10 md:gap-20 mt-10 text-center stagger reveal">
              {[["1 200+", "fiches générées"], ["30 sec", "par fiche"], ["4.7/5", "600+ avis"]].map(([num, label]) => (
                <div key={label}>
                  <p className="text-2xl md:text-3xl font-black text-gray-900 stat-number">{num}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BANNIERE CONFIANCE */}
        <section className="bg-gray-50 border-y border-gray-100 px-4 py-3">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-12">
            <p className="text-gray-400 text-xs font-medium shrink-0">Compatible avec :</p>
            {["Amazon", "Etsy", "Shopify", "eBay"].map(b => (
              <span key={b} className="text-gray-400 font-bold text-xs tracking-widest">{b}</span>
            ))}
            <div className="items-center gap-1.5 ml-auto hidden md:flex">
              <span className="text-orange-400 text-sm">★★★★★</span>
              <span className="text-gray-600 text-xs font-semibold">4.7/5</span>
              <span className="text-gray-400 text-xs">· 600+ avis</span>
            </div>
          </div>
        </section>

        {/* PROBLÈME VS SOLUTION */}
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
                    <li key={t} className="flex items-start gap-3 text-gray-400 text-sm">
                      <span className="text-red-400 mt-0.5 shrink-0">✕</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="reveal card-hover bg-orange-500 rounded-2xl p-6 md:p-8">
                <p className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-5">Avec Listly</p>
                <ul className="space-y-4">
                  {["Fiche complète générée en 30 secondes", "Titre optimisé SEO, visible sur Amazon et Etsy", "Bullet points professionnels et persuasifs", "Plus de ventes, beaucoup moins d'effort"].map(t => (
                    <li key={t} className="flex items-start gap-3 text-orange-50 text-sm">
                      <span className="text-white mt-0.5 shrink-0">✓</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section id="how" className="bg-amber-50 px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="reveal mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Simple comme bonjour</h2>
              <p className="text-gray-500 text-sm">Trois étapes, zéro expertise requise</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
              {[
                { n: "1", title: "Décris ton produit", desc: "Nom, matière, taille, couleur — juste les informations de base." },
                { n: "2", title: "L'IA génère ta fiche", desc: "Titre SEO, description et bullet points en moins de 30 secondes." },
                { n: "3", title: "Copie et vends", desc: "Colle directement dans ta boutique et regarde tes ventes progresser." },
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

        {/* AVIS CLIENTS */}
        <section className="bg-white px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-5xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Ce qu'ils en disent</h2>
              <p className="text-gray-500 text-sm">Des vendeurs Amazon et Etsy comme toi</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger">
              {[
                { i: "SL", name: "Sophie L.", role: "Vendeuse Etsy · Bijoux", q: "J'ai multiplié mes vues par 3 sur Etsy en deux semaines. Mes anciennes fiches étaient catastrophiques.", style: "light" },
                { i: "KM", name: "Karim M.", role: "Vendeur Amazon · Électronique", q: "200+ produits sur Amazon, rédiger des fiches me prenait des heures. Maintenant c'est 30 secondes.", style: "dark" },
                { i: "AB", name: "Amélie B.", role: "Vendeuse Etsy · Déco", q: "Je suis nulle en SEO. Listly fait tout à ma place. Mes produits remontent dans les résultats Etsy.", style: "light" },
                { i: "TR", name: "Thomas R.", role: "Vendeur Amazon · Mode", q: "9€/mois pour économiser 10h de travail par semaine. Le meilleur investissement de l'année.", style: "light" },
                { i: "MV", name: "Marie V.", role: "Vendeuse Etsy · Papeterie", q: "Aucun outil ne comprend aussi bien les spécificités d'Etsy. Les tags générés sont vraiment pertinents.", style: "light" },
                { i: "JD", name: "Julien D.", role: "Vendeur Amazon · Sport", q: "Mon taux de conversion a augmenté de 40%. Les descriptions sont tellement meilleures que ce que j'écrivais.", style: "orange" },
              ].map(({ i, name, role, q, style }) => (
                <div key={name} className={`reveal card-hover rounded-2xl p-6 ${style === "orange" ? "bg-orange-500" : style === "dark" ? "bg-gray-900" : "bg-gray-50 border border-gray-100"}`}>
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => <span key={s} className="text-orange-400">★</span>)}
                  </div>
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
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tight">Tarif simple et transparent</h2>
              <p className="text-gray-500 text-sm">Commence gratuitement, passe Pro quand tu es convaincu</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto stagger">
              <div className="reveal card-hover bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 text-left">
                <h3 className="font-bold text-white text-lg mb-2">Gratuit</h3>
                <p className="text-4xl font-black text-white mb-1">0€</p>
                <p className="text-gray-500 text-sm mb-6">pour toujours</p>
                <ul className="text-gray-400 text-sm space-y-3 mb-6">
                  {["3 générations gratuites", "Amazon et Etsy", "Sans carte bancaire"].map(f => (
                    <li key={f} className="flex gap-2.5"><span className="text-orange-400 shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <a href="/generate" className="btn-primary block w-full bg-gray-700 text-white py-3 rounded-xl font-semibold text-center text-sm">
                  Commencer
                </a>
              </div>
              <div className="reveal card-hover bg-orange-500 rounded-2xl p-6 md:p-8 relative text-left">
                <span className="absolute top-4 right-4 bg-white text-orange-500 text-xs font-bold px-2.5 py-0.5 rounded-full">Populaire</span>
                <h3 className="font-bold text-white text-lg mb-2">Starter</h3>
                <p className="text-4xl font-black text-white mb-1">9€</p>
                <p className="text-orange-200 text-sm mb-6">par mois</p>
                <ul className="text-orange-100 text-sm space-y-3 mb-6">
                  {["Générations illimitées", "Amazon et Etsy", "Titres SEO optimisés", "Bullet points pro"].map(f => (
                    <li key={f} className="flex gap-2.5"><span className="text-white shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <StarterButton />
              </div>
              <div className="reveal card-hover bg-gray-800 rounded-2xl p-6 md:p-8 border border-orange-500 text-left">
                <div className="bg-orange-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full inline-block mb-3">Tout inclus</div>
                <h3 className="font-bold text-white text-lg mb-2">Pro</h3>
                <p className="text-4xl font-black text-white mb-1">19,99€</p>
                <p className="text-gray-500 text-sm mb-6">par mois</p>
                <ul className="text-gray-400 text-sm space-y-3 mb-6">
                  {["Tout du plan Starter", "Analyse de boutique", "Analyse des images", "Audit publicitaire", "Support prioritaire"].map(f => (
                    <li key={f} className="flex gap-2.5"><span className="text-orange-400 shrink-0">✓</span>{f}</li>
                  ))}
                </ul>
                <ProButton />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white px-4 md:px-10 py-16 md:py-24">
          <div className="max-w-2xl mx-auto">
            <div className="reveal text-center mb-10 md:mb-14">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-3 tracking-tight">Questions fréquentes</h2>
              <p className="text-gray-500 text-sm">Tout ce que tu dois savoir avant de commencer</p>
            </div>
            <div className="space-y-3 reveal">
              {[
                { q: "Les fiches sont-elles vraiment optimisées pour le SEO ?", a: "Oui. Listly utilise l'IA Claude d'Anthropic, entraînée sur des milliers de fiches produits performantes." },
                { q: "Quelle différence entre Starter et Pro ?", a: "Starter génère des fiches illimitées. Pro ajoute l'analyse complète de ta boutique, l'audit images et publicités." },
                { q: "Puis-je annuler à tout moment ?", a: "Oui, sans engagement et sans frais. Tu peux annuler en un clic depuis ton espace compte." },
                { q: "Toutes les catégories de produits ?", a: "Oui. Bijoux, électronique, vêtements, décoration — Listly s'adapte à ta catégorie." },
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

        {/* CTA FINAL */}
        <section className="bg-gradient-to-br from-orange-500 to-amber-500 px-4 md:px-10 py-16 md:py-24 text-center">
          <div className="reveal">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">Prêt à vendre plus ?</h2>
            <p className="text-orange-100 text-base md:text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Des centaines de vendeurs ont déjà transformé leurs fiches avec Listly.
            </p>
            <a href="/generate" className="btn-primary inline-flex items-center gap-2 bg-white text-orange-500 px-8 py-4 rounded-2xl text-base font-bold shadow-xl">
              Commencer gratuitement
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
        </section>

        {/* FOOTER */}
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