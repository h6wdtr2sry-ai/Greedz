"use client";

import { useEffect, useMemo, useState } from "react";
import { FixedSizeGrid, GridChildComponentProps } from "react-window";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIER_THEMES } from "@/data/tiers";
import { proxied, ROLES, TIERS } from "@/data/skins";
import { useCollageStore } from "@/store/collageStore";
import { cn } from "@/lib/utils";
import { HeroRole, Skin, SkinTier } from "@/types/mlbb";

const COLUMN_WIDTH = 132;
const ROW_HEIGHT = 158;

interface SkinPickerModalProps {
  skins: Skin[];
}

export default function SkinPickerModal({ skins }: SkinPickerModalProps) {
  const pickerOpenForCellId = useCollageStore((s) => s.pickerOpenForCellId);
  const closePicker = useCollageStore((s) => s.closePicker);
  const assignSkinToCell = useCollageStore((s) => s.assignSkinToCell);

  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<HeroRole | "all">("all");
  const [tierFilter, setTierFilter] = useState<SkinTier | "all">("all");
  const [containerWidth, setContainerWidth] = useState(760);

  const open = pickerOpenForCellId !== null;

  useEffect(() => {
    if (!open) {
      setQuery("");
      setRoleFilter("all");
      setTierFilter("all");
    }
  }, [open]);

  // Fuse index rebuilt only when the underlying catalogue changes, not on
  // every keystroke — this is what keeps the search feeling instant across
  // 1,100+ entries.
  const fuse = useMemo(
    () =>
      new Fuse(skins, {
        keys: [
          { name: "heroName", weight: 0.4 },
          { name: "skinName", weight: 0.4 },
          { name: "tags", weight: 0.15 },
          { name: "tier", weight: 0.05 },
        ],
        threshold: 0.32,
        ignoreLocation: true,
      }),
    [skins]
  );

  const filtered = useMemo(() => {
    let base = query.trim() ? fuse.search(query).map((r) => r.item) : skins;
    if (roleFilter !== "all") base = base.filter((s) => s.role === roleFilter);
    if (tierFilter !== "all") base = base.filter((s) => s.tier === tierFilter);
    return base;
  }, [query, roleFilter, tierFilter, fuse, skins]);

  const columnCount = Math.max(1, Math.floor(containerWidth / COLUMN_WIDTH));
  const rowCount = Math.ceil(filtered.length / columnCount);

  function handlePick(skin: Skin) {
    if (!pickerOpenForCellId) return;
    assignSkinToCell(pickerOpenForCellId, skin);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && closePicker()}>
      <DialogContent className="h-[80vh]">
        <DialogHeader className="space-y-3">
          <DialogTitle>Choose a skin</DialogTitle>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-void-500" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search hero, skin, or tag…"
                className="h-9 w-full rounded-md border border-void-600 bg-void-800 pl-8 pr-3 text-sm text-white placeholder:text-void-500 focus:outline-none focus:ring-2 focus:ring-ember-500"
              />
            </div>
            <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as HeroRole | "all")}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={tierFilter} onValueChange={(v) => setTierFilter(v as SkinTier | "all")}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Tier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All tiers</SelectItem>
                {TIERS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-void-500">
            {filtered.length.toLocaleString()} of {skins.length.toLocaleString()} skins
          </p>
        </DialogHeader>

        <div
          className="flex-1 min-h-0 p-3"
          ref={(el) => {
            if (el) setContainerWidth(el.clientWidth);
          }}
        >
          {filtered.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-void-500">
              No skins match those filters.
            </div>
          ) : (
            <FixedSizeGrid
              columnCount={columnCount}
              columnWidth={COLUMN_WIDTH}
              rowCount={rowCount}
              rowHeight={ROW_HEIGHT}
              width={containerWidth}
              height={Math.min(rowCount * ROW_HEIGHT, 560)}
              itemData={{ filtered, columnCount, onPick: handlePick }}
            >
              {SkinCell}
            </FixedSizeGrid>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CellData {
  filtered: Skin[];
  columnCount: number;
  onPick: (skin: Skin) => void;
}

function SkinCell({ columnIndex, rowIndex, style, data }: GridChildComponentProps<CellData>) {
  const { filtered, columnCount, onPick } = data;
  const index = rowIndex * columnCount + columnIndex;
  const skin = filtered[index];
  if (!skin) return null;

  const theme = TIER_THEMES[skin.tier];

  return (
    <div style={style} className="p-1.5">
      <button
        onClick={() => onPick(skin)}
        className="group flex h-full w-full flex-col overflow-hidden rounded-lg border border-void-700 bg-void-800 text-left transition-transform hover:-translate-y-0.5 hover:border-ember-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-500"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-void-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proxied(skin.avatarUrl)}
            alt={`${skin.heroName} — ${skin.skinName}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1"
            style={{ background: `linear-gradient(90deg, ${theme.gradient.join(", ")})` }}
          />
        </div>
        <div className="px-1.5 py-1">
          <p className="truncate text-[11px] font-heading font-semibold text-white">{skin.skinName}</p>
          <p className={cn("truncate text-[10px]")} style={{ color: theme.labelColor }}>
            {skin.heroName} · {skin.tier}
          </p>
        </div>
      </button>
    </div>
  );
}
