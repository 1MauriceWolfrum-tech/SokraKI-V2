import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FortschrittProvider } from "@/lib/fortschritt";
import { Fusszeile, Kopfzeile } from "@/components/Rahmen";

// Die Schrift wird beim Build lokal eingebunden – beim Aufruf entsteht keine Verbindung zu Google.
const schrift = Inter({ subsets: ["latin"], display: "swap", variable: "--schrift" });

export const metadata: Metadata = {
  title: "KI bildungsgerecht im Unterricht einsetzen · SokraKI",
  description: "Ein interaktiver Selbstlernkurs für angehende Lehrkräfte an beruflichen Schulen – Prototyp V2",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={schrift.variable}>
      <body>
        <FortschrittProvider>
          <a href="#inhalt" className="sprunglink">
            Zum Inhalt springen
          </a>
          <Kopfzeile />
          <main id="inhalt">{children}</main>
          <Fusszeile />
        </FortschrittProvider>
      </body>
    </html>
  );
}
