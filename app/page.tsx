"use client";
import { StarterButton, ProButton } from "@/components/PricingButtons";
import NavbarAuth from "@/components/NavbarAuth";
export default function Home() {
  return (
    <main style={{fontFamily: "'Georgia', serif"}} className="min-h-screen bg-white">

      {/* NAVBAR */}
    <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 sticky top-0 z-50">
  <div className="flex items-center gap-2">
  <img src="/logo.svg" alt="Listly AI" width="32" height="32" />
  <span className="text-2xl font-bold text-orange-500 tracking-tight">Listly AI</span>
</div>
  <div className="flex items-center gap-6">
    <a href="#how" className="text-gray-500 text-sm hover:text-gray-900">Comment ca marche</a>
    <a href="#pricing" className="text-gray-500 text-sm hover:text-gray-900">Tarifs</a>
    <NavbarAuth />
  </div>
</nav>

{/* BANNIERE CONFIANCE */}
      <section className="bg-gray-50 border-b border-gray-100 px-10 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <p className="text-gray-400 text-sm font-medium">Ils nous font confiance :</p>
          <div className="flex items-center gap-10">
            <span className="text-gray-400 font-bold text-sm tracking-wider">AMAZON</span>
            <span className="text-gray-400 font-bold text-sm tracking-wider">ETSY</span>
            <span className="text-gray-400 font-bold text-sm tracking-wider">SHOPIFY</span>
            <span className="text-gray-400 font-bold text-sm tracking-wider">EBAY</span>
            <span className="text-gray-400 font-bold text-sm tracking-wider">LEBONCOIN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-orange-400">★★★★★</span>
            <span className="text-gray-500 text-sm font-semibold">4.7/5</span>
            <span className="text-gray-400 text-sm">· 600+ avis</span>
          </div>
        </div>
      </section>
      
      {/* HERO */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 px-10 py-28 text-center">
        <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
          Propulsé par l'IA Claude
        </span>
        <h1 className="text-6xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto leading-tight">
          Tes fiches produits,<br/>
          <span className="text-orange-500">rédigées en 30 secondes.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
          Des titres SEO, descriptions persuasives et bullet points optimisés pour Amazon et Etsy — sans effort, sans expertise.
        </p>
        <a href="/generate" className="inline-block bg-orange-500 text-white px-12 py-5 rounded-2xl text-lg font-bold hover:bg-orange-600 shadow-xl shadow-orange-200">
          Générer ma première fiche — gratuit
        </a>
        <p className="text-gray-400 text-sm mt-5">3 générations gratuites · Aucune carte requise · Résultat immédiat</p>

        {/* Stats */}
        <div className="flex justify-center gap-16 mt-20">
  <div>
    <p className="text-4xl font-bold text-gray-900">1 200+</p>
    <p className="text-gray-400 text-sm mt-1">fiches générées</p>
  </div>
  <div className="border-l border-gray-200"></div>
  <div>
    <p className="text-4xl font-bold text-gray-900">30 sec</p>
    <p className="text-gray-400 text-sm mt-1">par fiche en moyenne</p>
  </div>
  <div className="border-l border-gray-200"></div>
  <div>
    <p className="text-4xl font-bold text-gray-900">4.7/5</p>
    <p className="text-gray-400 text-sm mt-1">· 600+ avis</p>
  </div>
</div>
      </section>

      {/* PROBLEME VS SOLUTION */}
      <section className="bg-gray-900 px-10 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-16">Tu perds des ventes sans le savoir</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <span className="text-3xl mb-5 block">😤</span>
              <h3 className="font-bold text-white text-lg mb-4">Sans Listly</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 text-gray-400"><span className="text-red-400 mt-0.5">✗</span>Tu passes 1h à rédiger une fiche</li>
                <li className="flex items-start gap-3 text-gray-400"><span className="text-red-400 mt-0.5">✗</span>Ton titre n'apparait pas dans les recherches</li>
                <li className="flex items-start gap-3 text-gray-400"><span className="text-red-400 mt-0.5">✗</span>Tes concurrents captent tes clients</li>
                <li className="flex items-start gap-3 text-gray-400"><span className="text-red-400 mt-0.5">✗</span>Tu ne sais pas quels mots-clés utiliser</li>
              </ul>
            </div>
            <div className="bg-orange-500 rounded-2xl p-8">
              <span className="text-3xl mb-5 block">🚀</span>
              <h3 className="font-bold text-white text-lg mb-4">Avec Listly</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3 text-orange-100"><span className="text-white mt-0.5">✓</span>Fiche complète générée en 30 secondes</li>
                <li className="flex items-start gap-3 text-orange-100"><span className="text-white mt-0.5">✓</span>Titre optimisé SEO pour Amazon et Etsy</li>
                <li className="flex items-start gap-3 text-orange-100"><span className="text-white mt-0.5">✓</span>Bullet points professionnels et persuasifs</li>
                <li className="flex items-start gap-3 text-orange-100"><span className="text-white mt-0.5">✓</span>Plus de ventes, beaucoup moins d'effort</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section id="how" className="bg-amber-50 px-10 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple comme bonjour</h2>
          <p className="text-gray-500 mb-16">Trois étapes, zéro expertise requise</p>
          <div className="grid grid-cols-3 gap-10">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">1</div>
              <h4 className="font-bold text-gray-900 mb-3">Décris ton produit</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Nom, matière, taille, couleur — juste les informations de base</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">2</div>
              <h4 className="font-bold text-gray-900 mb-3">L'IA génère ta fiche</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Titre SEO, description et bullet points en moins de 30 secondes</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
              <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">3</div>
              <h4 className="font-bold text-gray-900 mb-3">Copie et vends</h4>
              <p className="text-gray-500 text-sm leading-relaxed">Colle directement dans ta boutique et regarde tes ventes progresser</p>
            </div>
          </div>
        </div>
      </section>

      {/* AVIS CLIENTS */}
      <section className="bg-white px-10 py-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Ce qu'ils en disent</h2>
          <p className="text-gray-500 text-center mb-16">Des vendeurs Amazon et Etsy comme toi</p>
          <div className="grid grid-cols-3 gap-8">

            <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <span key={i} className="text-orange-400">★</span>)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                "J'ai multiplié mes vues par 3 sur Etsy en deux semaines. Mes anciennes fiches étaient catastrophiques sans que je le sache. Listly m'a ouvert les yeux."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold text-sm">SL</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Sophie L.</p>
                  <p className="text-gray-400 text-xs">Vendeuse Etsy · Bijoux faits main</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-2xl p-7">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <span key={i} className="text-orange-400">★</span>)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                "En tant que vendeur Amazon avec 200+ produits, rédiger des fiches me prenait des heures. Maintenant c'est 30 secondes par produit. ROI immédiat."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">KM</div>
                <div>
                  <p className="font-semibold text-white text-sm">Karim M.</p>
                  <p className="text-gray-400 text-xs">Vendeur Amazon · Électronique</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <span key={i} className="text-orange-400">★</span>)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                "Je suis nulle en rédaction et en SEO. Listly fait tout à ma place. Mes produits remontent dans les résultats Etsy depuis que je l'utilise."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 font-bold text-sm">AB</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Amelie B.</p>
                  <p className="text-gray-400 text-xs">Vendeuse Etsy · Deco maison</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <span key={i} className="text-orange-400">★</span>)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                "Le meilleur investissement de l'année pour ma boutique. 9€/mois pour économiser 10h de travail par semaine, c'est une évidence."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm">TR</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Thomas R.</p>
                  <p className="text-gray-400 text-xs">Vendeur Amazon · Mode</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <span key={i} className="text-orange-400">★</span>)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-6">
                "J'ai testé d'autres outils avant Listly. Aucun ne comprend aussi bien les spécificités d'Etsy. Les tags générés sont vraiment pertinents."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-sm">MV</div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Marie V.</p>
                  <p className="text-gray-400 text-xs">Vendeuse Etsy · Papeterie</p>
                </div>
              </div>
            </div>

            <div className="bg-orange-500 rounded-2xl p-7">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <span key={i} className="text-white">★</span>)}
              </div>
              <p className="text-orange-100 text-sm leading-relaxed mb-6">
                "Depuis que j'utilise Listly, mon taux de conversion a augmenté de 40%. Les descriptions sont tellement meilleures que ce que j'écrivais."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-orange-500 font-bold text-sm">JD</div>
                <div>
                  <p className="font-semibold text-white text-sm">Julien D.</p>
                  <p className="text-gray-200 text-xs">Vendeur Amazon · Sport</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING */}
<section id="pricing" className="bg-gray-900 px-10 py-24">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-3xl font-bold text-white mb-4">Tarif simple et transparent</h2>
    <p className="text-gray-400 mb-16">Commence gratuitement, passe Pro quand tu es convaincu</p>
    <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">

      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
        <h3 className="font-bold text-white text-lg mb-2">Gratuit</h3>
        <p className="text-5xl font-bold text-white mb-1">0€</p>
        <p className="text-gray-500 text-sm mb-8">pour toujours</p>
        <ul className="text-gray-400 text-sm space-y-3 mb-8 text-left">
          <li className="flex gap-3"><span className="text-orange-400">✓</span>3 générations gratuites</li>
          <li className="flex gap-3"><span className="text-orange-400">✓</span>Amazon et Etsy</li>
          <li className="flex gap-3"><span className="text-orange-400">✓</span>Sans carte bancaire</li>
        </ul>
        <a href="/generate" className="block w-full bg-gray-700 text-white py-3 rounded-xl font-semibold hover:bg-gray-600 text-center">
          Commencer
        </a>
      </div>

      <div className="bg-orange-500 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 bg-white text-orange-500 text-xs font-bold px-3 py-1 rounded-full">
          Populaire
        </div>
        <h3 className="font-bold text-white text-lg mb-2">Starter</h3>
        <p className="text-5xl font-bold text-white mb-1">9€</p>
        <p className="text-orange-200 text-sm mb-8">par mois</p>
        <ul className="text-orange-100 text-sm space-y-3 mb-8 text-left">
          <li className="flex gap-3"><span className="text-white">✓</span>Générations illimitées</li>
          <li className="flex gap-3"><span className="text-white">✓</span>Amazon et Etsy</li>
          <li className="flex gap-3"><span className="text-white">✓</span>Titres SEO optimisés</li>
          <li className="flex gap-3"><span className="text-white">✓</span>Bullet points pro</li>
        </ul>
        <StarterButton />
      </div>

      <div className="bg-gray-800 rounded-2xl p-8 border border-orange-500">
        <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
          Tout inclus
        </div>
        <h3 className="font-bold text-white text-lg mb-2">Pro</h3>
        <p className="text-5xl font-bold text-white mb-1">19,99€</p>
        <p className="text-gray-500 text-sm mb-8">par mois</p>
        <ul className="text-gray-400 text-sm space-y-3 mb-8 text-left">
          <li className="flex gap-3"><span className="text-orange-400">✓</span>Tout du plan Starter</li>
          <li className="flex gap-3"><span className="text-orange-400">✓</span>Analyse de boutique</li>
          <li className="flex gap-3"><span className="text-orange-400">✓</span>Analyse des images</li>
          <li className="flex gap-3"><span className="text-orange-400">✓</span>Audit publicitaire</li>
          <li className="flex gap-3"><span className="text-orange-400">✓</span>Support prioritaire</li>
        </ul>
        <ProButton />
      </div>

    </div>
  </div>
</section>

      {/* CTA FINAL */}
     {/* FAQ */}
      <section className="bg-white px-10 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Questions fréquentes</h2>
          <p className="text-gray-500 text-center mb-16">Tout ce que tu dois savoir avant de commencer</p>

          <div className="space-y-4">
            <details className="bg-gray-50 rounded-2xl p-6 group border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                Les fiches générées sont-elles vraiment optimisées pour le SEO ?
                <span className="text-orange-500 text-xl">+</span>
              </summary>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                Oui. Listly utilise l'IA Claude d'Anthropic, entraînée sur des milliers de fiches produits performantes. Elle connaît les règles SEO spécifiques d'Amazon et Etsy — longueur des titres, structure des bullet points, densité des mots-clés — et les applique automatiquement.
              </p>
            </details>

            <details className="bg-gray-50 rounded-2xl p-6 group border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                Quelle est la différence entre le plan Starter et Pro ?
                <span className="text-orange-500 text-xl">+</span>
              </summary>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                Le plan Starter te donne accès aux générations illimitées de fiches produits — titres, descriptions et bullet points optimisés. Le plan Pro ajoute l'analyse complète de ta boutique : audit de tes images, analyse de tes publicités et recommandations personnalisées pour augmenter ton taux de conversion.
              </p>
            </details>

            <details className="bg-gray-50 rounded-2xl p-6 group border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                Puis-je annuler mon abonnement à tout moment ?
                <span className="text-orange-500 text-xl">+</span>
              </summary>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                Oui, sans engagement et sans frais. Tu peux annuler en un clic depuis ton espace compte. Tu gardes l'accès jusqu'à la fin de ta période de facturation en cours.
              </p>
            </details>

            <details className="bg-gray-50 rounded-2xl p-6 group border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                Listly fonctionne-t-il pour toutes les catégories de produits ?
                <span className="text-orange-500 text-xl">+</span>
              </summary>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                Oui. Que tu vendes des bijoux faits main, de l'électronique, des vêtements ou de la décoration, Listly s'adapte à ta catégorie et génère des fiches pertinentes et optimisées.
              </p>
            </details>

            <details className="bg-gray-50 rounded-2xl p-6 group border border-gray-100">
              <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                En combien de langues puis-je générer mes fiches ?
                <span className="text-orange-500 text-xl">+</span>
              </summary>
              <p className="text-gray-500 text-sm mt-4 leading-relaxed">
                Listly génère des fiches en français et en anglais. D'autres langues seront disponibles prochainement.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-br from-orange-500 to-amber-500 px-10 py-24 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Pret a vendre plus ?</h2>
        <p className="text-orange-100 text-lg mb-10 max-w-lg mx-auto">
          Rejoins des centaines de vendeurs qui ont transforme leurs fiches produits avec Listly.
        </p>
        <a href="/generate" className="inline-block bg-white text-orange-500 px-12 py-5 rounded-2xl text-lg font-bold hover:bg-orange-50 shadow-xl">
          Commencer gratuitement
        </a>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 px-10 py-10 border-t border-gray-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-orange-500 font-bold text-xl">Listly AI</span>
          <p className="text-gray-500 text-sm">2025 Listly AI · Tous droits réservés</p>
          <div className="flex gap-6 text-gray-500 text-sm">
            <a href="#" className="hover:text-white">Confidentialité</a>
            <a href="#" className="hover:text-white">CGU</a>
          </div>
        </div>
      </footer>

    </main>
  )
}