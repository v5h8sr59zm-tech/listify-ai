"use client";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

function NavbarAuthInner() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (status === "loading") return <div className="w-9 h-9" />;

  if (session) {
    const initials = session.user?.name
      ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
      : "?";
    return (
      <div className="flex items-center gap-2">
        <a href="/generate" className="hidden md:block bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 text-sm transition-colors">
          Generate
        </a>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(v => !v)}
            className="w-9 h-9 rounded-full bg-orange-500 text-white font-bold text-sm flex items-center justify-center hover:bg-orange-600 transition-colors">
            {initials}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-gray-900 font-semibold text-sm truncate">{session.user?.name}</p>
                <p className="text-gray-400 text-xs truncate">{session.user?.email}</p>
              </div>
              <a href="/dashboard" onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition-colors">
                My listings
              </a>
              <a href="/competitor" onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:bg-gray-50 text-sm transition-colors">
                Competitor analysis
                <span className="ml-auto bg-orange-100 text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full">Pro</span>
              </a>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50 text-sm rounded-b-xl transition-colors">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a href="/login" className="hidden md:block text-gray-500 text-sm hover:text-gray-900 font-semibold transition-colors">
        Sign in
      </a>
      <a href="/generate" className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 text-sm transition-colors">
        Try free
      </a>
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