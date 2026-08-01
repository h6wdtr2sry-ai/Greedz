"use client";

import { useRef, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EXPORT_PRESETS } from "@/data/tiers";
import { runExport } from "@/lib/export";
import { useCollageStore } from "@/store/collageStore";
import { ExportFormat, ExportPresetId } from "@/types/mlbb";

export default function ExportBar({ exportRef }: { exportRef: React.RefObject<HTMLDivElement> }) {
  const exportProgress = useCollageStore((s) => s.exportProgress);
  const setExportProgress = useCollageStore((s) => s.setExportProgress);
  const [preset, setPreset] = useState<ExportPresetId>("ig-square");
  const [format, setFormat] = useState<ExportFormat>("png");

  const isBusy = exportProgress.status !== "idle" && exportProgress.status !== "done" && exportProgress.status !== "error";

  async function handleExport() {
    if (!exportRef.current) return;
    await runExport({
      node: exportRef.current,
      options: { preset, format, quality: 0.95 },
      onProgress: setExportProgress,
    });
    setTimeout(() => setExportProgress({ status: "idle", percent: 0 }), 1500);
  }

  return (
    <div className="flex items-center gap-3 border-t border-void-700 bg-void-900/90 px-4 py-3 backdrop-blur">
      <Select value={preset} onValueChange={(v) => setPreset(v as ExportPresetId)}>
        <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
        <SelectContent>
          {Object.values(EXPORT_PRESETS).map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.label} — {p.width}×{p.height}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={format} onValueChange={(v) => setFormat(v as ExportFormat)}>
        <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="jpeg">JPEG</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex-1" />

      {isBusy && (
        <span className="text-xs text-void-400">{exportProgress.message} ({exportProgress.percent}%)</span>
      )}

      <Button onClick={handleExport} disabled={isBusy}>
        {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        Export
      </Button>
    </div>
  );
}
