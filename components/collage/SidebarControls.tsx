"use client";

import { useState } from "react";
import { Plus, Trash2, Type, Layers, Palette, SlidersHorizontal } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FieldRow, Label } from "@/components/ui/label";
import { useCollageStore } from "@/store/collageStore";
import { LAYOUT_TEMPLATES } from "@/data/layouts";
import { METALLIC_GRADIENTS } from "@/data/tiers";
import { cn } from "@/lib/utils";
import { GameFont, LayoutTemplateId, ParticleEffect } from "@/types/mlbb";

const GAME_FONTS: GameFont[] = ["Orbitron", "Rajdhani", "Bangers", "Cinzel"];
const PARTICLES: { id: ParticleEffect; label: string }[] = [
  { id: "none", label: "None" },
  { id: "light-leaks", label: "Light leaks" },
  { id: "golden-dust", label: "Golden dust" },
  { id: "sparkles", label: "Sparkles" },
];
const BORDER_PRESETS = ["gold", "diamond", "mythic", "#ffffff", "#00e5ff"];

export default function SidebarControls() {
  return (
    <aside className="flex h-full w-[340px] flex-col overflow-y-auto border-r border-void-700 bg-void-900/70 backdrop-blur">
      <div className="border-b border-void-700 px-4 py-3">
        <h2 className="font-heading text-sm font-bold uppercase tracking-widest text-ember-400">Editor</h2>
      </div>

      <Tabs defaultValue="layout" className="flex-1 px-4 py-4">
        <TabsList className="w-full justify-between">
          <TabsTrigger value="layout" className="flex-1">
            <Layers className="mr-1 h-3.5 w-3.5" /> Layout
          </TabsTrigger>
          <TabsTrigger value="cell" className="flex-1">
            <SlidersHorizontal className="mr-1 h-3.5 w-3.5" /> Cell
          </TabsTrigger>
          <TabsTrigger value="background" className="flex-1">
            <Palette className="mr-1 h-3.5 w-3.5" /> Scene
          </TabsTrigger>
          <TabsTrigger value="text" className="flex-1">
            <Type className="mr-1 h-3.5 w-3.5" /> Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="layout"><LayoutTab /></TabsContent>
        <TabsContent value="cell"><CellTab /></TabsContent>
        <TabsContent value="background"><BackgroundTab /></TabsContent>
        <TabsContent value="text"><TextTab /></TabsContent>
      </Tabs>
    </aside>
  );
}

// ── Layout ──────────────────────────────────────────────────────────────

function LayoutTab() {
  const layoutId = useCollageStore((s) => s.layoutId);
  const setLayout = useCollageStore((s) => s.setLayout);
  const gridSpacingPx = useCollageStore((s) => s.gridSpacingPx);
  const outerPaddingPx = useCollageStore((s) => s.outerPaddingPx);
  const setGridSpacing = useCollageStore((s) => s.setGridSpacing);
  const setOuterPadding = useCollageStore((s) => s.setOuterPadding);

  return (
    <div className="space-y-5">
      <div>
        <Label>Template</Label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {LAYOUT_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setLayout(t.id as LayoutTemplateId)}
              className={cn(
                "rounded-lg border p-2.5 text-left transition-colors",
                layoutId === t.id
                  ? "border-ember-500 bg-ember-500/10"
                  : "border-void-700 bg-void-800/60 hover:border-void-500"
              )}
            >
              <p className="text-xs font-heading font-semibold text-white">{t.name}</p>
              <p className="mt-0.5 line-clamp-2 text-[10px] text-void-500">{t.description}</p>
            </button>
          ))}
        </div>
      </div>

      <FieldRow label="Cell spacing" value={`${gridSpacingPx}px`}>
        <Slider min={0} max={40} step={1} value={[gridSpacingPx]} onValueChange={([v]) => setGridSpacing(v)} />
      </FieldRow>
      <FieldRow label="Outer padding" value={`${outerPaddingPx}px`}>
        <Slider min={0} max={80} step={1} value={[outerPaddingPx]} onValueChange={([v]) => setOuterPadding(v)} />
      </FieldRow>
    </div>
  );
}

// ── Per-cell edit ───────────────────────────────────────────────────────

function CellTab() {
  const activeCellId = useCollageStore((s) => s.activeCellId);
  const cells = useCollageStore((s) => s.cells);
  const updateCellTransform = useCollageStore((s) => s.updateCellTransform);
  const updateCellFilters = useCollageStore((s) => s.updateCellFilters);
  const updateCellShadow = useCollageStore((s) => s.updateCellShadow);
  const updateCellStyle = useCollageStore((s) => s.updateCellStyle);

  const cell = cells.find((c) => c.cellDefId === activeCellId);

  if (!cell || !cell.skin) {
    return (
      <p className="rounded-lg border border-dashed border-void-700 p-4 text-center text-xs text-void-500">
        Select a cell with a skin assigned to edit its position, filters, and frame.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-heading font-semibold text-white">{cell.skin.skinName}</p>
        <p className="text-[11px] text-void-500">{cell.skin.heroName} · {cell.skin.tier}</p>
      </div>

      <section className="space-y-3">
        <Label>Position</Label>
        <FieldRow label="Zoom" value={`${cell.transform.zoom.toFixed(2)}x`}>
          <Slider min={1} max={4} step={0.01} value={[cell.transform.zoom]} onValueChange={([v]) => updateCellTransform(cell.cellDefId, { zoom: v })} />
        </FieldRow>
        <FieldRow label="Rotation" value={`${cell.transform.rotationDeg}°`}>
          <Slider min={-180} max={180} step={1} value={[cell.transform.rotationDeg]} onValueChange={([v]) => updateCellTransform(cell.cellDefId, { rotationDeg: v })} />
        </FieldRow>
        <p className="text-[10px] text-void-600">Drag the image on canvas to pan · scroll to zoom.</p>
      </section>

      <section className="space-y-3">
        <Label>Filters</Label>
        <FieldRow label="Brightness" value={cell.filters.brightness}>
          <Slider min={-100} max={100} step={1} value={[cell.filters.brightness]} onValueChange={([v]) => updateCellFilters(cell.cellDefId, { brightness: v })} />
        </FieldRow>
        <FieldRow label="Contrast" value={cell.filters.contrast}>
          <Slider min={-100} max={100} step={1} value={[cell.filters.contrast]} onValueChange={([v]) => updateCellFilters(cell.cellDefId, { contrast: v })} />
        </FieldRow>
        <FieldRow label="Saturation" value={cell.filters.saturation}>
          <Slider min={-100} max={100} step={1} value={[cell.filters.saturation]} onValueChange={([v]) => updateCellFilters(cell.cellDefId, { saturation: v })} />
        </FieldRow>
        <FieldRow label="Hue shift" value={`${cell.filters.hueShift}°`}>
          <Slider min={-180} max={180} step={1} value={[cell.filters.hueShift]} onValueChange={([v]) => updateCellFilters(cell.cellDefId, { hueShift: v })} />
        </FieldRow>
        <FieldRow label="Sepia" value={cell.filters.sepia}>
          <Slider min={0} max={100} step={1} value={[cell.filters.sepia]} onValueChange={([v]) => updateCellFilters(cell.cellDefId, { sepia: v })} />
        </FieldRow>
        <FieldRow label="Vignette" value={cell.filters.vignette}>
          <Slider min={0} max={100} step={1} value={[cell.filters.vignette]} onValueChange={([v]) => updateCellFilters(cell.cellDefId, { vignette: v })} />
        </FieldRow>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Drop shadow</Label>
          <input
            type="checkbox"
            checked={cell.dropShadow.enabled}
            onChange={(e) => updateCellShadow(cell.cellDefId, { enabled: e.target.checked })}
            className="accent-ember-500"
          />
        </div>
        {cell.dropShadow.enabled && (
          <>
            <FieldRow label="Blur" value={`${cell.dropShadow.blur}px`}>
              <Slider min={0} max={60} step={1} value={[cell.dropShadow.blur]} onValueChange={([v]) => updateCellShadow(cell.cellDefId, { blur: v })} />
            </FieldRow>
            <FieldRow label="Opacity" value={cell.dropShadow.opacity.toFixed(2)}>
              <Slider min={0} max={1} step={0.01} value={[cell.dropShadow.opacity]} onValueChange={([v]) => updateCellShadow(cell.cellDefId, { opacity: v })} />
            </FieldRow>
          </>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Rarity frame overlay</Label>
          <input
            type="checkbox"
            checked={cell.showFrameOverlay}
            onChange={(e) => updateCellStyle(cell.cellDefId, { showFrameOverlay: e.target.checked })}
            className="accent-ember-500"
          />
        </div>
        <Label>Border</Label>
        <div className="flex flex-wrap gap-2">
          {BORDER_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => updateCellStyle(cell.cellDefId, { borderColor: preset })}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                cell.borderColor === preset ? "border-white" : "border-transparent"
              )}
              style={{
                background: METALLIC_GRADIENTS[preset]
                  ? `linear-gradient(135deg, ${METALLIC_GRADIENTS[preset].join(", ")})`
                  : preset,
              }}
              title={preset}
            />
          ))}
          <input
            type="color"
            className="h-7 w-7 cursor-pointer rounded-full border-2 border-transparent bg-transparent"
            onChange={(e) => updateCellStyle(cell.cellDefId, { borderColor: e.target.value })}
            title="Custom color"
          />
        </div>
        <FieldRow label="Border width" value={`${cell.borderWidthPx}px`}>
          <Slider min={0} max={16} step={1} value={[cell.borderWidthPx]} onValueChange={([v]) => updateCellStyle(cell.cellDefId, { borderWidthPx: v })} />
        </FieldRow>
        <FieldRow label="Corner radius" value={`${cell.cornerRadiusPx}px`}>
          <Slider min={0} max={48} step={1} value={[cell.cornerRadiusPx]} onValueChange={([v]) => updateCellStyle(cell.cellDefId, { cornerRadiusPx: v })} />
        </FieldRow>
      </section>
    </div>
  );
}

// ── Background / scene ──────────────────────────────────────────────────

function BackgroundTab() {
  const background = useCollageStore((s) => s.background);
  const setBackground = useCollageStore((s) => s.setBackground);

  return (
    <div className="space-y-5">
      <div>
        <Label>Type</Label>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["solid", "gradient", "mapArt"] as const).map((kind) => (
            <button
              key={kind}
              onClick={() => setBackground({ kind })}
              className={cn(
                "rounded-md border py-1.5 text-[11px] font-heading font-semibold capitalize",
                background.kind === kind ? "border-ember-500 bg-ember-500/10 text-ember-400" : "border-void-700 text-void-400"
              )}
            >
              {kind === "mapArt" ? "Map art" : kind}
            </button>
          ))}
        </div>
      </div>

      {background.kind === "solid" && (
        <FieldRow label="Color">
          <input
            type="color"
            value={background.solidColor ?? "#0c0e16"}
            onChange={(e) => setBackground({ solidColor: e.target.value })}
            className="h-9 w-full cursor-pointer rounded-md border border-void-600 bg-void-800"
          />
        </FieldRow>
      )}

      {background.kind === "gradient" && (
        <>
          <FieldRow label="From">
            <input
              type="color"
              value={background.gradient?.from ?? "#0c0e16"}
              onChange={(e) => setBackground({ gradient: { ...background.gradient!, from: e.target.value } })}
              className="h-9 w-full cursor-pointer rounded-md border border-void-600 bg-void-800"
            />
          </FieldRow>
          <FieldRow label="To">
            <input
              type="color"
              value={background.gradient?.to ?? "#1a1e2c"}
              onChange={(e) => setBackground({ gradient: { ...background.gradient!, to: e.target.value } })}
              className="h-9 w-full cursor-pointer rounded-md border border-void-600 bg-void-800"
            />
          </FieldRow>
          <FieldRow label="Angle" value={`${background.gradient?.angleDeg ?? 135}°`}>
            <Slider
              min={0}
              max={360}
              step={1}
              value={[background.gradient?.angleDeg ?? 135]}
              onValueChange={([v]) => setBackground({ gradient: { ...background.gradient!, angleDeg: v } })}
            />
          </FieldRow>
        </>
      )}

      <FieldRow label="Blur" value={`${background.blurPx}px`}>
        <Slider min={0} max={40} step={1} value={[background.blurPx]} onValueChange={([v]) => setBackground({ blurPx: v })} />
      </FieldRow>
      <FieldRow label="Darken scrim" value={background.darkenOpacity.toFixed(2)}>
        <Slider min={0} max={1} step={0.01} value={[background.darkenOpacity]} onValueChange={([v]) => setBackground({ darkenOpacity: v })} />
      </FieldRow>

      <div>
        <Label>Particle overlay</Label>
        <Select value={background.particleEffect} onValueChange={(v) => setBackground({ particleEffect: v as ParticleEffect })}>
          <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
          <SelectContent>
            {PARTICLES.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ── Text engine ─────────────────────────────────────────────────────────

function TextTab() {
  const textLayers = useCollageStore((s) => s.textLayers);
  const addTextLayer = useCollageStore((s) => s.addTextLayer);
  const updateTextLayer = useCollageStore((s) => s.updateTextLayer);
  const removeTextLayer = useCollageStore((s) => s.removeTextLayer);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = textLayers.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        {(["ign", "squadName", "winRate", "rankBadge"] as const).map((kind) => (
          <Button
            key={kind}
            variant="secondary"
            size="sm"
            onClick={() =>
              addTextLayer({
                kind,
                content: kind === "ign" ? "PlayerIGN" : kind === "squadName" ? "SQUAD NAME" : kind === "winRate" ? "72% WR" : "Mythical Glory",
                font: "Rajdhani",
                fontSizePx: 42,
                color: "#ffffff",
                strokeColor: "#000000",
                strokeWidthPx: 0,
                glowColor: "#ffd24d",
                glowStrength: 0,
                curveDeg: 0,
                x: 0.5,
                y: 0.5,
                rotationDeg: 0,
              })
            }
          >
            <Plus className="h-3.5 w-3.5" /> {kind === "ign" ? "IGN" : kind === "squadName" ? "Squad" : kind === "winRate" ? "Win rate" : "Rank badge"}
          </Button>
        ))}
      </div>

      {textLayers.length > 0 && (
        <div className="space-y-1.5">
          {textLayers.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-md border px-2.5 py-1.5 text-xs",
                selectedId === t.id ? "border-ember-500 bg-ember-500/10" : "border-void-700 bg-void-800/60"
              )}
            >
              <span className="truncate text-white">{t.content || "(empty)"}</span>
              <button onClick={(e) => { e.stopPropagation(); removeTextLayer(t.id); if (selectedId === t.id) setSelectedId(null); }}>
                <Trash2 className="h-3.5 w-3.5 text-void-500 hover:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <section className="space-y-3 border-t border-void-700 pt-4">
          <FieldRow label="Content">
            <input
              value={selected.content}
              onChange={(e) => updateTextLayer(selected.id, { content: e.target.value })}
              className="h-9 w-full rounded-md border border-void-600 bg-void-800 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-ember-500"
            />
          </FieldRow>

          <div>
            <Label>Font</Label>
            <Select value={selected.font} onValueChange={(v) => updateTextLayer(selected.id, { font: v as GameFont })}>
              <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                {GAME_FONTS.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <FieldRow label="Size" value={`${selected.fontSizePx}px`}>
            <Slider min={12} max={140} step={1} value={[selected.fontSizePx]} onValueChange={([v]) => updateTextLayer(selected.id, { fontSizePx: v })} />
          </FieldRow>

          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="Fill">
              <input type="color" value={selected.color} onChange={(e) => updateTextLayer(selected.id, { color: e.target.value })} className="h-9 w-full cursor-pointer rounded-md border border-void-600 bg-void-800" />
            </FieldRow>
            <FieldRow label="Stroke">
              <input type="color" value={selected.strokeColor} onChange={(e) => updateTextLayer(selected.id, { strokeColor: e.target.value })} className="h-9 w-full cursor-pointer rounded-md border border-void-600 bg-void-800" />
            </FieldRow>
          </div>

          <FieldRow label="Stroke width" value={`${selected.strokeWidthPx}px`}>
            <Slider min={0} max={8} step={0.5} value={[selected.strokeWidthPx]} onValueChange={([v]) => updateTextLayer(selected.id, { strokeWidthPx: v })} />
          </FieldRow>

          <FieldRow label="Glow" value={selected.glowStrength}>
            <Slider min={0} max={100} step={1} value={[selected.glowStrength]} onValueChange={([v]) => updateTextLayer(selected.id, { glowStrength: v })} />
          </FieldRow>

          <FieldRow label="Rotation" value={`${selected.rotationDeg}°`}>
            <Slider min={-45} max={45} step={1} value={[selected.rotationDeg]} onValueChange={([v]) => updateTextLayer(selected.id, { rotationDeg: v })} />
          </FieldRow>

          <div className="grid grid-cols-2 gap-3">
            <FieldRow label="X position" value={`${Math.round(selected.x * 100)}%`}>
              <Slider min={0} max={1} step={0.01} value={[selected.x]} onValueChange={([v]) => updateTextLayer(selected.id, { x: v })} />
            </FieldRow>
            <FieldRow label="Y position" value={`${Math.round(selected.y * 100)}%`}>
              <Slider min={0} max={1} step={0.01} value={[selected.y]} onValueChange={([v]) => updateTextLayer(selected.id, { y: v })} />
            </FieldRow>
          </div>
        </section>
      )}
    </div>
  );
}
