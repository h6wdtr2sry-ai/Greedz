"use client";

import { useRef, useState } from "react";
import { Menu, Sparkles, X } from "lucide-react";
import Canvas from "@/components/collage/Canvas";
import SidebarControls from "@/components/collage/SidebarControls";
import ExportBar from "@/components/collage/ExportBar";
import SkinPickerModal from "@/components/modals/SkinPickerModal";
import { Skin } from "@/types/mlbb";
import { cn } from "@/lib/utils";

export default function CollageApp({ skins }: { skins: Skin[] }) {
  const exportRef = useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-dvh flex-col bg-void-950">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-void-700 bg-void-900/80 px-4 backdrop-blur">
        <button className="lg:hidden text-void-300" onClick={() => setDrawerOpen((v) => !v)}>
          {drawerOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-ember-500" />
          <h1 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-white">
            MLBB Auto-Collage
          </h1>
        </div>
        <span className="ml-2 hidden rounded-full bg-void-800 px-2 py-0.5 text-[10px] text-void-400 sm:inline">
          {skins.length.toLocaleString()} skins loaded
        </span>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar — fixed drawer on mobile, static column on desktop */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 z-40 transform transition-transform duration-200 lg:static lg:translate-x-0",
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarControls />
        </div>
        {drawerOpen && (
          <div className="absolute inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setDrawerOpen(false)} />
        )}

        {/* Canvas stage */}
        <main className="flex-1 overflow-auto">
          <Canvas exportRef={exportRef} />
        </main>
      </div>

      <ExportBar exportRef={exportRef} />
      <SkinPickerModal skins={skins} />
    </div>
  );
}
