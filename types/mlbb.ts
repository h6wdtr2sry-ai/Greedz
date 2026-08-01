// ────────────────────────────────────────────────────────────────────────
// MLBB Auto-Collage — Core Domain Types
// ────────────────────────────────────────────────────────────────────────

export type HeroRole =
  | "Tank"
  | "Fighter"
  | "Assassin"
  | "Mage"
  | "Marksman"
  | "Support";

export type SkinTier =
  | "Basic"
  | "Elite"
  | "Special"
  | "Epic"
  | "Legend"
  | "Collector"
  | "Zodiac"
  | "Aspirants"
  | "Exorcists"
  | "Neobeasts"
  | "KOF"
  | "Prime";

/** Visual identity for each rarity tier — drives auto-applied frame overlays. */
export interface TierTheme {
  tier: SkinTier;
  frameAssetKey: string; // key into FRAME_OVERLAYS
  gradient: [string, string, string]; // 3-stop gradient hexes
  glowColor: string;
  labelColor: string;
}

export interface Skin {
  id: string; // stable slug, e.g. "layla-nightbringer"
  heroId: string;
  heroName: string;
  skinName: string;
  role: HeroRole;
  tier: SkinTier;
  releaseYear?: number;
  /** Small square thumbnail used in the picker grid. */
  avatarUrl: string;
  /** Full splash art used inside collage cells. */
  fullArtUrl: string;
  /** Optional pre-baked frame PNG (transparent) matching this skin's tier. */
  frameBorderUrl?: string;
  tags?: string[]; // extra fuzzy-search hints: "fanny", "collab", "starlight" etc.
}

// ────────────────────────────────────────────────────────────────────────
// Layout system
// ────────────────────────────────────────────────────────────────────────

export type LayoutTemplateId =
  | "vs-1v1"
  | "grid-3x3"
  | "team-5v5"
  | "diagonal-slice"
  | "hexagon-hive"
  | "tier-list-banner"
  | "mobile-wallpaper";

export interface LayoutCellDefinition {
  id: string;
  /** Position/size as a fraction of the canvas (0–1), pre-rotation. */
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDeg?: number;
  /** Cells can be non-rectangular (hex, diagonal); clipPath uses CSS clip-path syntax. */
  clipPath?: string;
  zIndex?: number;
}

export interface LayoutTemplate {
  id: LayoutTemplateId;
  name: string;
  description: string;
  aspectRatio: number; // width / height
  cells: LayoutCellDefinition[];
  defaultExportPreset: ExportPresetId;
}

// ────────────────────────────────────────────────────────────────────────
// Per-cell editing state
// ────────────────────────────────────────────────────────────────────────

export interface CellFilters {
  brightness: number; // -100..100
  contrast: number; // -100..100
  saturation: number; // -100..100
  hueShift: number; // -180..180
  sepia: number; // 0..100
  vignette: number; // 0..100
}

export interface CellTransform {
  zoom: number; // 1 = fit, >1 = zoomed in
  offsetX: number; // px, pan
  offsetY: number; // px, pan
  rotationDeg: number;
}

export interface DropShadow {
  enabled: boolean;
  blur: number;
  offsetX: number;
  offsetY: number;
  color: string;
  opacity: number; // 0..1
}

export interface CollageCell {
  cellDefId: string; // references LayoutCellDefinition.id
  skin: Skin | null;
  transform: CellTransform;
  filters: CellFilters;
  dropShadow: DropShadow;
  showFrameOverlay: boolean;
  borderColor: string; // hex/rgba, or gradient key: "gold" | "diamond" | "mythic"
  borderWidthPx: number;
  cornerRadiusPx: number;
}

// ────────────────────────────────────────────────────────────────────────
// Text / squad personalization layer
// ────────────────────────────────────────────────────────────────────────

export type GameFont = "Orbitron" | "Rajdhani" | "Bangers" | "Cinzel";

export type RankBadge =
  | "Warrior"
  | "Elite"
  | "Master"
  | "Grandmaster"
  | "Epic"
  | "Legend"
  | "Mythic"
  | "Mythical Honor"
  | "Mythical Glory"
  | "Mythical Immortal";

export interface TextLayer {
  id: string;
  kind: "ign" | "squadName" | "winRate" | "rankBadge" | "custom";
  content: string;
  font: GameFont;
  fontSizePx: number;
  color: string;
  strokeColor: string;
  strokeWidthPx: number;
  glowColor: string;
  glowStrength: number; // 0..100
  curveDeg: number; // text arc, 0 = straight
  x: number; // fraction of canvas
  y: number;
  rotationDeg: number;
}

// ────────────────────────────────────────────────────────────────────────
// Background layer
// ────────────────────────────────────────────────────────────────────────

export type ParticleEffect = "none" | "light-leaks" | "golden-dust" | "sparkles";

export interface BackgroundConfig {
  kind: "solid" | "gradient" | "mapArt" | "image";
  solidColor?: string;
  gradient?: { from: string; to: string; angleDeg: number };
  mapArtId?: string; // e.g. "land-of-dawn-blur"
  imageUrl?: string;
  blurPx: number;
  darkenOpacity: number; // 0..1 scrim
  particleEffect: ParticleEffect;
}

// ────────────────────────────────────────────────────────────────────────
// Export
// ────────────────────────────────────────────────────────────────────────

export type ExportPresetId =
  | "tiktok-story" // 1080x1920
  | "ig-square" // 1080x1080
  | "youtube-banner"; // 1920x1080

export interface ExportPreset {
  id: ExportPresetId;
  label: string;
  width: number;
  height: number;
  /** Render multiplier applied on top of width/height for crisp mobile output. */
  pixelRatio: number;
}

export type ExportFormat = "png" | "jpeg";

export interface ExportOptions {
  preset: ExportPresetId;
  format: ExportFormat;
  quality: number; // 0..1, jpeg only
}

export interface ExportProgress {
  status: "idle" | "preparing" | "rendering" | "encoding" | "done" | "error";
  percent: number;
  message?: string;
}

// ────────────────────────────────────────────────────────────────────────
// Top-level canvas/editor state
// ────────────────────────────────────────────────────────────────────────

export interface CollageState {
  layoutId: LayoutTemplateId;
  cells: CollageCell[];
  background: BackgroundConfig;
  textLayers: TextLayer[];
  gridSpacingPx: number;
  outerPaddingPx: number;
  history: {
    past: CollageState[];
    future: CollageState[];
  } | null; // null inside snapshots to avoid recursive storage
}
