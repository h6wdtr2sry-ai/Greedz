import { ExportPreset, SkinTier, TierTheme } from "@/types/mlbb";

export const TIER_THEMES: Record<SkinTier, TierTheme> = {
  Basic: {
    tier: "Basic",
    frameAssetKey: "frame-basic",
    gradient: ["#c7ccd6", "#8a93a6", "#5c6273"],
    glowColor: "transparent",
    labelColor: "#c7ccd6",
  },
  Elite: {
    tier: "Elite",
    frameAssetKey: "frame-elite",
    gradient: ["#dff4ff", "#6bc7ff", "#2f7fb3"],
    glowColor: "#6bc7ff",
    labelColor: "#6bc7ff",
  },
  Special: {
    tier: "Special",
    frameAssetKey: "frame-special",
    gradient: ["#e2fff0", "#6bffb0", "#1f9e63"],
    glowColor: "#6bffb0",
    labelColor: "#6bffb0",
  },
  Epic: {
    tier: "Epic",
    frameAssetKey: "frame-epic",
    gradient: ["#f3e5ff", "#c084fc", "#7c2fbf"],
    glowColor: "#c084fc",
    labelColor: "#c084fc",
  },
  Legend: {
    tier: "Legend",
    frameAssetKey: "frame-legend-gold",
    gradient: ["#fff6d5", "#ffd24d", "#b8860b"],
    glowColor: "#ffd24d",
    labelColor: "#ffd24d",
  },
  Collector: {
    tier: "Collector",
    frameAssetKey: "frame-collector-metallic",
    gradient: ["#ffe0e0", "#ff6b6b", "#a31f1f"],
    glowColor: "#ff6b6b",
    labelColor: "#ff6b6b",
  },
  Zodiac: {
    tier: "Zodiac",
    frameAssetKey: "frame-zodiac",
    gradient: ["#fff0d5", "#ffb347", "#8a4b00"],
    glowColor: "#ffb347",
    labelColor: "#ffb347",
  },
  Aspirants: {
    tier: "Aspirants",
    frameAssetKey: "frame-aspirants-anime",
    gradient: ["#e5f0ff", "#7fa9ff", "#2f4f9e"],
    glowColor: "#7fa9ff",
    labelColor: "#7fa9ff",
  },
  Exorcists: {
    tier: "Exorcists",
    frameAssetKey: "frame-exorcists",
    gradient: ["#ffe5f0", "#ff7fc0", "#9e2f6a"],
    glowColor: "#ff7fc0",
    labelColor: "#ff7fc0",
  },
  Neobeasts: {
    tier: "Neobeasts",
    frameAssetKey: "frame-neobeasts",
    gradient: ["#e5fff5", "#4dffb8", "#0a8a5c"],
    glowColor: "#4dffb8",
    labelColor: "#4dffb8",
  },
  KOF: {
    tier: "KOF",
    frameAssetKey: "frame-kof-collab",
    gradient: ["#fff0e5", "#ff8a4d", "#a33d00"],
    glowColor: "#ff8a4d",
    labelColor: "#ff8a4d",
  },
  Prime: {
    tier: "Prime",
    frameAssetKey: "frame-prime-violet",
    gradient: ["#f2e5ff", "#b06bff", "#5a1f9e"],
    glowColor: "#b06bff",
    labelColor: "#b06bff",
  },
};

/** Border gradient presets referenced by CollageCell.borderColor (e.g. "gold"). */
export const METALLIC_GRADIENTS: Record<string, [string, string, string]> = {
  gold: ["#fff6d5", "#ffd24d", "#b8860b"],
  diamond: ["#e8f9ff", "#6bc7ff", "#1a5f8a"],
  mythic: ["#f2e5ff", "#b06bff", "#5a1f9e"],
};

export const EXPORT_PRESETS: Record<string, ExportPreset> = {
  "tiktok-story": {
    id: "tiktok-story",
    label: "TikTok / IG Story",
    width: 1080,
    height: 1920,
    pixelRatio: 2,
  },
  "ig-square": {
    id: "ig-square",
    label: "Instagram Post (Square)",
    width: 1080,
    height: 1080,
    pixelRatio: 2,
  },
  "youtube-banner": {
    id: "youtube-banner",
    label: "Banner / YouTube / Desktop",
    width: 1920,
    height: 1080,
    pixelRatio: 2,
  },
};
