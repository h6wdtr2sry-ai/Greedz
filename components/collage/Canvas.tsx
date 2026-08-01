"use client";

import { useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { useCollageStore } from "@/store/collageStore";
import { getLayoutById } from "@/data/layouts";
import { METALLIC_GRADIENTS, TIER_THEMES } from "@/data/tiers";
import { proxied } from "@/data/skins";
import { clamp, cn } from "@/lib/utils";
import { CollageCell, LayoutCellDefinition } from "@/types/mlbb";

interface CanvasProps {
  /** Forwarded ref target used by the export engine (html-to-image). */
  exportRef: React.RefObject<HTMLDivElement>;
}

function cellFilterCss(cell: CollageCell): string {
  const { brightness, contrast, saturation, hueShift, sepia } = cell.filters;
  return [
    `brightness(${1 + brightness / 100})`,
    `contrast(${1 + contrast / 100})`,
    `saturate(${1 + saturation / 100})`,
    `hue-rotate(${hueShift}deg)`,
    `sepia(${sepia / 100})`,
  ].join(" ");
}

function borderStyle(cell: CollageCell): React.CSSProperties {
  const gradient = METALLIC_GRADIENTS[cell.borderColor];
  if (gradient) {
    return {
      borderWidth: cell.borderWidthPx,
      borderStyle: "solid",
      borderImage: `linear-gradient(135deg, ${gradient.join(", ")}) 1`,
      borderRadius: cell.cornerRadiusPx,
    };
  }
  return {
    borderWidth: cell.borderWidthPx,
    borderStyle: "solid",
    borderColor: cell.borderColor,
    borderRadius: cell.cornerRadiusPx,
  };
}

function CollageCellView({ def, cell }: { def: LayoutCellDefinition; cell: CollageCell }) {
  const openPickerForCell = useCollageStore((s) => s.openPickerForCell);
  const setActiveCell = useCollageStore((s) => s.setActiveCell);
  const activeCellId = useCollageStore((s) => s.activeCellId);
  const updateCellTransform = useCollageStore((s) => s.updateCellTransform);

  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!cell.skin) return;
      setActiveCell(def.id);
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: cell.transform.offsetX,
        originY: cell.transform.offsetY,
      };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [cell.skin, cell.transform.offsetX, cell.transform.offsetY, def.id, setActiveCell]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      updateCellTransform(def.id, {
        offsetX: dragState.current.originX + dx,
        offsetY: dragState.current.originY + dy,
      });
    },
    [def.id, updateCellTransform]
  );

  const onPointerUp = useCallback(() => {
    dragState.current = null;
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!cell.skin) return;
      e.preventDefault();
      const next = clamp(cell.transform.zoom - e.deltaY * 0.001, 1, 4);
      updateCellTransform(def.id, { zoom: next });
    },
    [cell.skin, cell.transform.zoom, def.id, updateCellTransform]
  );

  const tierTheme = cell.skin ? TIER_THEMES[cell.skin.tier] : null;

  return (
    <div
      className={cn(
        "group absolute overflow-hidden bg-void-800/60 select-none",
        activeCellId === def.id && "ring-2 ring-ember-500 ring-offset-2 ring-offset-void-950"
      )}
      style={{
        left: `${def.x * 100}%`,
        top: `${def.y * 100}%`,
        width: `${def.width * 100}%`,
        height: `${def.height * 100}%`,
        clipPath: def.clipPath,
        zIndex: def.zIndex ?? 0,
        ...borderStyle(cell),
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
    >
      {cell.skin ? (
        <>
          <div
            className="absolute inset-0"
            style={{
              filter: cellFilterCss(cell),
              boxShadow: cell.dropShadow.enabled
                ? `${cell.dropShadow.offsetX}px ${cell.dropShadow.offsetY}px ${cell.dropShadow.blur}px rgba(0,0,0,${cell.dropShadow.opacity})`
                : undefined,
            }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform"
              style={{
                backgroundImage: `url(${proxied(cell.skin.fullArtUrl)})`,
                transform: `scale(${cell.transform.zoom}) translate(${cell.transform.offsetX}px, ${cell.transform.offsetY}px) rotate(${cell.transform.rotationDeg}deg)`,
              }}
            />
          </div>

          {cell.filters.vignette > 0 && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 ${cell.filters.vignette}px ${cell.filters.vignette / 2}px rgba(0,0,0,0.8)`,
              }}
            />
          )}

          {cell.showFrameOverlay && tierTheme && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 32px 4px ${tierTheme.glowColor}55`,
              }}
            >
              <div
                className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-heading font-bold tracking-wide"
                style={{ color: tierTheme.labelColor, background: "rgba(7,8,13,0.65)" }}
              >
                {cell.skin.tier}
              </div>
            </div>
          )}
        </>
      ) : (
        <button
          onClick={() => openPickerForCell(def.id)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-void-600 hover:text-ember-500 hover:bg-void-700/40 transition-colors"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-heading">Add skin</span>
        </button>
      )}

      {cell.skin && (
        <button
          onClick={() => openPickerForCell(def.id)}
          className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 hover:opacity-100 bg-void-950/70 rounded p-1 transition-opacity"
          title="Change skin"
        >
          <Sparkles className="w-3.5 h-3.5 text-ember-400" />
        </button>
      )}
    </div>
  );
}

function BackgroundLayer() {
  const background = useCollageStore((s) => s.background);

  const style: React.CSSProperties = {};
  if (background.kind === "solid") style.background = background.solidColor;
  if (background.kind === "gradient" && background.gradient) {
    style.background = `linear-gradient(${background.gradient.angleDeg}deg, ${background.gradient.from}, ${background.gradient.to})`;
  }
  if ((background.kind === "mapArt" || background.kind === "image") && background.imageUrl) {
    style.backgroundImage = `url(${proxied(background.imageUrl)})`;
    style.backgroundSize = "cover";
    style.backgroundPosition = "center";
  }
  if (background.blurPx > 0) style.filter = `blur(${background.blurPx}px)`;

  return (
    <>
      <div className="absolute inset-0" style={style} />
      {background.darkenOpacity > 0 && (
        <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${background.darkenOpacity})` }} />
      )}
      {background.particleEffect !== "none" && (
        <div className={cn("absolute inset-0 pointer-events-none opacity-60", `particle-${background.particleEffect}`)} />
      )}
    </>
  );
}

function TextLayers() {
  const textLayers = useCollageStore((s) => s.textLayers);
  const fontFamilyMap: Record<string, string> = {
    Orbitron: "font-display",
    Rajdhani: "font-heading",
    Bangers: "font-script",
    Cinzel: "font-title",
  };

  return (
    <>
      {textLayers.map((t) => (
        <div
          key={t.id}
          className={cn("absolute whitespace-nowrap", fontFamilyMap[t.font])}
          style={{
            left: `${t.x * 100}%`,
            top: `${t.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${t.rotationDeg}deg)`,
            fontSize: t.fontSizePx,
            color: t.color,
            WebkitTextStroke: `${t.strokeWidthPx}px ${t.strokeColor}`,
            textShadow: t.glowStrength > 0 ? `0 0 ${t.glowStrength}px ${t.glowColor}` : undefined,
          }}
        >
          {t.content}
        </div>
      ))}
    </>
  );
}

export default function Canvas({ exportRef }: CanvasProps) {
  const layoutId = useCollageStore((s) => s.layoutId);
  const cells = useCollageStore((s) => s.cells);
  const gridSpacingPx = useCollageStore((s) => s.gridSpacingPx);
  const outerPaddingPx = useCollageStore((s) => s.outerPaddingPx);
  const layout = getLayoutById(layoutId);

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <motion.div
        layout
        className="relative bg-void-900 shadow-2xl shadow-black/50 rounded-xl overflow-hidden"
        style={{
          aspectRatio: layout.aspectRatio,
          width: layout.aspectRatio >= 1 ? "min(100%, 900px)" : "auto",
          height: layout.aspectRatio < 1 ? "min(100%, 900px)" : "auto",
          padding: outerPaddingPx,
        }}
      >
        <div ref={exportRef} className="relative w-full h-full rounded-lg overflow-hidden">
          <BackgroundLayer />
          <div className="absolute inset-0" style={{ padding: gridSpacingPx / 2 }}>
            <div className="relative w-full h-full">
              {layout.cells.map((def) => {
                const cell = cells.find((c) => c.cellDefId === def.id);
                if (!cell) return null;
                return <CollageCellView key={def.id} def={def} cell={cell} />;
              })}
            </div>
          </div>
          <TextLayers />
        </div>
      </motion.div>
    </div>
  );
}
