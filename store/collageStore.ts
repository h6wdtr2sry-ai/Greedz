import { create } from "zustand";
import { getLayoutById, LAYOUT_TEMPLATES } from "@/data/layouts";
import { uid } from "@/lib/utils";
import {
  BackgroundConfig,
  CellFilters,
  CellTransform,
  CollageCell,
  DropShadow,
  ExportOptions,
  ExportProgress,
  LayoutTemplateId,
  Skin,
  TextLayer,
} from "@/types/mlbb";

const DEFAULT_FILTERS: CellFilters = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hueShift: 0,
  sepia: 0,
  vignette: 0,
};

const DEFAULT_TRANSFORM: CellTransform = {
  zoom: 1,
  offsetX: 0,
  offsetY: 0,
  rotationDeg: 0,
};

const DEFAULT_SHADOW: DropShadow = {
  enabled: false,
  blur: 12,
  offsetX: 0,
  offsetY: 6,
  color: "#000000",
  opacity: 0.5,
};

const DEFAULT_BACKGROUND: BackgroundConfig = {
  kind: "gradient",
  gradient: { from: "#0c0e16", to: "#1a1e2c", angleDeg: 135 },
  blurPx: 0,
  darkenOpacity: 0.2,
  particleEffect: "none",
};

function buildCellsForLayout(layoutId: LayoutTemplateId): CollageCell[] {
  const layout = getLayoutById(layoutId);
  return layout.cells.map((def) => ({
    cellDefId: def.id,
    skin: null,
    transform: { ...DEFAULT_TRANSFORM },
    filters: { ...DEFAULT_FILTERS },
    dropShadow: { ...DEFAULT_SHADOW },
    showFrameOverlay: true,
    borderColor: "gold",
    borderWidthPx: 3,
    cornerRadiusPx: 8,
  }));
}

interface CollageStore {
  layoutId: LayoutTemplateId;
  cells: CollageCell[];
  background: BackgroundConfig;
  textLayers: TextLayer[];
  gridSpacingPx: number;
  outerPaddingPx: number;
  activeCellId: string | null;
  pickerOpenForCellId: string | null;
  exportProgress: ExportProgress;

  setLayout: (id: LayoutTemplateId) => void;
  setActiveCell: (cellDefId: string | null) => void;
  openPickerForCell: (cellDefId: string) => void;
  closePicker: () => void;
  assignSkinToCell: (cellDefId: string, skin: Skin) => void;
  updateCellTransform: (cellDefId: string, patch: Partial<CellTransform>) => void;
  updateCellFilters: (cellDefId: string, patch: Partial<CellFilters>) => void;
  updateCellShadow: (cellDefId: string, patch: Partial<DropShadow>) => void;
  updateCellStyle: (
    cellDefId: string,
    patch: Partial<Pick<CollageCell, "borderColor" | "borderWidthPx" | "cornerRadiusPx" | "showFrameOverlay">>
  ) => void;
  setBackground: (patch: Partial<BackgroundConfig>) => void;
  setGridSpacing: (px: number) => void;
  setOuterPadding: (px: number) => void;
  addTextLayer: (layer: Omit<TextLayer, "id">) => void;
  updateTextLayer: (id: string, patch: Partial<TextLayer>) => void;
  removeTextLayer: (id: string) => void;
  setExportProgress: (progress: ExportProgress) => void;
}

export const useCollageStore = create<CollageStore>((set, get) => ({
  layoutId: LAYOUT_TEMPLATES[1].id, // default: 3x3 grid
  cells: buildCellsForLayout(LAYOUT_TEMPLATES[1].id),
  background: DEFAULT_BACKGROUND,
  textLayers: [],
  gridSpacingPx: 8,
  outerPaddingPx: 24,
  activeCellId: null,
  pickerOpenForCellId: null,
  exportProgress: { status: "idle", percent: 0 },

  setLayout: (id) => set({ layoutId: id, cells: buildCellsForLayout(id), activeCellId: null }),

  setActiveCell: (cellDefId) => set({ activeCellId: cellDefId }),

  openPickerForCell: (cellDefId) => set({ pickerOpenForCellId: cellDefId }),
  closePicker: () => set({ pickerOpenForCellId: null }),

  assignSkinToCell: (cellDefId, skin) =>
    set((state) => ({
      cells: state.cells.map((c) => (c.cellDefId === cellDefId ? { ...c, skin, transform: { ...DEFAULT_TRANSFORM } } : c)),
      pickerOpenForCellId: null,
      activeCellId: cellDefId,
    })),

  updateCellTransform: (cellDefId, patch) =>
    set((state) => ({
      cells: state.cells.map((c) => (c.cellDefId === cellDefId ? { ...c, transform: { ...c.transform, ...patch } } : c)),
    })),

  updateCellFilters: (cellDefId, patch) =>
    set((state) => ({
      cells: state.cells.map((c) => (c.cellDefId === cellDefId ? { ...c, filters: { ...c.filters, ...patch } } : c)),
    })),

  updateCellShadow: (cellDefId, patch) =>
    set((state) => ({
      cells: state.cells.map((c) => (c.cellDefId === cellDefId ? { ...c, dropShadow: { ...c.dropShadow, ...patch } } : c)),
    })),

  updateCellStyle: (cellDefId, patch) =>
    set((state) => ({
      cells: state.cells.map((c) => (c.cellDefId === cellDefId ? { ...c, ...patch } : c)),
    })),

  setBackground: (patch) => set((state) => ({ background: { ...state.background, ...patch } })),

  setGridSpacing: (px) => set({ gridSpacingPx: px }),
  setOuterPadding: (px) => set({ outerPaddingPx: px }),

  addTextLayer: (layer) => set((state) => ({ textLayers: [...state.textLayers, { ...layer, id: uid("text") }] })),

  updateTextLayer: (id, patch) =>
    set((state) => ({
      textLayers: state.textLayers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  removeTextLayer: (id) => set((state) => ({ textLayers: state.textLayers.filter((t) => t.id !== id) })),

  setExportProgress: (progress) => set({ exportProgress: progress }),
}));

export type { CollageStore };
export const defaultExportOptions: ExportOptions = {
  preset: "ig-square",
  format: "png",
  quality: 0.95,
};
