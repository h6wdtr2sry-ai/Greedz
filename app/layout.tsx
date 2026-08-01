import type { Metadata } from "next";
import { Orbitron, Rajdhani, Bangers, Cinzel, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-orbitron" });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-rajdhani" });
const bangers = Bangers({ subsets: ["latin"], weight: "400", variable: "--font-bangers" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-cinzel" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "MLBB Auto-Collage — Squad Graphic Builder",
  description:
    "Build tournament-grade Mobile Legends: Bang Bang skin collages — matchup cards, team rosters, tier lists, and mobile wallpapers — with rarity frames, custom text, and one-click export.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${orbitron.variable} ${rajdhani.variable} ${bangers.variable} ${cinzel.variable} ${inter.variable} font-body bg-void-950 text-white antialiased`}
      >
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
