"use client";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import NavbarAuth from "@/components/NavbarAuth";

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-400">Chargement...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 sticky top-0 z-50">
        <a href="/" className="text-2xl font-bold text-orange-500 tracking-tight">Listify AI</a>
        <NavbarAuth />
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Mes générations</h1>
          <p className="text-gray-400 text-sm">Retrouve toutes tes fiches produits générées</p>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-10 flex items-center justify-between">
          <div>
            <p className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-1">Plan actuel</p>
            <p className="text-gray-900 font-bold text-xl">Gratuit</p>
            <p className="text-gray-400 text-sm mt-1">3 générations gratuites disponibles</p>
          </div>
          <a href="/#pricing" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 text-sm">
            Passer Pro
          </a>
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mb-4 mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
          </div>
          <p className="text-gray-500 font-semibold mb-2">Aucune génération pour l'instant</p>
          <p className="text-gray-300 text-sm mb-6">Tes fiches générées apparaîtront ici</p>
          <a href="/generate" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600 text-sm">
            Générer ma première fiche
          </a>
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  );
}