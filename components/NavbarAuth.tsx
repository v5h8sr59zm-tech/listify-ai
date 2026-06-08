"use client";
import { SessionProvider, useSession, signOut } from "next-auth/react";

function NavbarAuthInner() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center gap-3">
        <a href="/login" className="text-gray-500 text-sm font-semibold">Connexion</a>
        <a href="/generate" className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold text-sm">Essayer gratuitement</a>
      </div>
    );
  }

  if (session) {
    const initials = session.user?.name
      ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
      : "?";
    return (
      <div className="flex items-center gap-3">
        <a href="/generate" className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 text-sm">Générer</a>
        <div className="relative group">
          <button className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center hover:bg-orange-600">
            {initials}
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto z-50">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-gray-900 font-semibold text-sm truncate">{session.user?.name}</p>
              <p className="text-gray-400 text-xs truncate">{session.user?.email}</p>
            </div>
            <a href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm">Mes générations</a>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 text-sm rounded-b-xl">
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <a href="/login" className="text-gray-500 text-sm hover:text-gray-900 font-semibold">Connexion</a>
      <a href="/generate" className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 text-sm">Essayer gratuitement</a>
    </div>
  );
}

export default function NavbarAuth() {
  return (
    <SessionProvider>
      <NavbarAuthInner />
    </SessionProvider>
  );
}