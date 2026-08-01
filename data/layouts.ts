import { LayoutTemplate } from "@/types/mlbb";

/**
 * Cell coordinates are fractions of the canvas (0–1) so every layout
 * scales cleanly to any export preset without per-resolution math.
 */
export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    id: "vs-1v1",
    name: "1v1 Matchup",
    description: "Split-screen VS card with a diagonal divider.",
    aspectRatio: 16 / 9,
    defaultExportPreset: "youtube-banner",
    cells: [
      {
        id: "left",
        x: 0,
        y: 0,
        width: 0.52,
        height: 1,
        clipPath: "polygon(0 0, 100% 0, 88% 100%, 0 100%)",
      },
      {
        id: "right",
        x: 0.48,
        y: 0,
        width: 0.52,
        height: 1,
        clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)",
        zIndex: 1,
      },
    ],
  },
  {
    id: "grid-3x3",
    name: "3×3 Grid",
    description: "Classic nine-cell showcase grid.",
    aspectRatio: 1,
    defaultExportPreset: "ig-square",
    cells: Array.from({ length: 9 }, (_, i) => {
      const row = Math.floor(i / 3);
      const col = i % 3;
      return {
        id: `cell-${i}`,
        x: col / 3,
        y: row / 3,
        width: 1 / 3,
        height: 1 / 3,
      };
    }),
  },
  {
    id: "team-5v5",
    name: "5v5 Team Composition",
    description: "Ranked-lobby style roster strip with a hero-of-the-match spotlight.",
    aspectRatio: 16 / 9,
    defaultExportPreset: "youtube-banner",
    cells: [
      { id: "spotlight", x: 0, y: 0, width: 0.4, height: 1, zIndex: 1 },
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `roster-${i}`,
        x: 0.4 + (i % 5) * 0.12,
        y: 0,
        width: 0.12,
        height: 1,
      })),
    ],
  },
  {
    id: "diagonal-slice",
    name: "Diagonal Slice",
    description: "Four dynamic diagonal bands.",
    aspectRatio: 1,
    defaultExportPreset: "ig-square",
    cells: [0, 1, 2, 3].map((i) => ({
      id: `slice-${i}`,
      x: i * 0.25,
      y: 0,
      width: 0.28,
      height: 1,
      clipPath: "polygon(15% 0, 100% 0, 85% 100%, 0 100%)",
      zIndex: 3 - i,
    })),
  },
  {
    id: "hexagon-hive",
    name: "Hexagon Hive",
    description: "Seven-cell honeycomb cluster.",
    aspectRatio: 1,
    defaultExportPreset: "ig-square",
    cells: [
      { id: "center", x: 0.33, y: 0.33, width: 0.34, height: 0.34, clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" },
      { id: "top", x: 0.33, y: 0, width: 0.34, height: 0.34, clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" },
      { id: "top-right", x: 0.62, y: 0.165, width: 0.34, height: 0.34, clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" },
      { id: "bottom-right", x: 0.62, y: 0.5, width: 0.34, height: 0.34, clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" },
      { id: "bottom", x: 0.33, y: 0.66, width: 0.34, height: 0.34, clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" },
      { id: "bottom-left", x: 0.04, y: 0.5, width: 0.34, height: 0.34, clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" },
      { id: "top-left", x: 0.04, y: 0.165, width: 0.34, height: 0.34, clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" },
    ],
  },
  {
    id: "tier-list-banner",
    name: "Tier List Banner",
    description: "Wide horizontal strip for ranking skins S→D.",
    aspectRatio: 21 / 9,
    defaultExportPreset: "youtube-banner",
    cells: Array.from({ length: 8 }, (_, i) => ({
      id: `slot-${i}`,
      x: i / 8,
      y: 0,
      width: 1 / 8,
      height: 1,
    })),
  },
  {
    id: "mobile-wallpaper",
    name: "Mobile Wallpaper",
    description: "Vertical 9:16 hero portrait with lower text band.",
    aspectRatio: 9 / 16,
    defaultExportPreset: "tiktok-story",
    cells: [
      { id: "hero", x: 0, y: 0, width: 1, height: 0.82 },
      { id: "accent", x: 0, y: 0.82, width: 1, height: 0.18 },
    ],
  },
];

export function getLayoutById(id: string): LayoutTemplate {
  const layout = LAYOUT_TEMPLATES.find((l) => l.id === id);
  if (!layout) throw new Error(`Unknown layout template: ${id}`);
  return layout;
}
