import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Listly AI",
  description: "Générateur de fiches produits optimisées pour Amazon et Etsy",
  icons: {
    icon: "/logo.svg",
  },
}


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}