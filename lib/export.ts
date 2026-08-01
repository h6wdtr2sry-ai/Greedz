import { toBlob } from "html-to-image";
import { EXPORT_PRESETS } from "@/data/tiers";
import { ExportOptions, ExportProgress } from "@/types/mlbb";

interface RunExportArgs {
  node: HTMLElement;
  options: ExportOptions;
  onProgress: (p: ExportProgress) => void;
  filenamePrefix?: string;
}

/**
 * Renders the collage DOM node to a downloadable image.
 *
 * Resolution strategy: html-to-image's `pixelRatio` scales the *serialized*
 * canvas beyond the node's native CSS size, so a 1080x1920 on-screen node
 * exported at pixelRatio 2 produces a crisp 2160x3840 bitmap — this is what
 * keeps mobile exports from looking soft/pixelated at real device sizes.
 */
export async function runExport({ node, options, onProgress, filenamePrefix = "mlbb-collage" }: RunExportArgs) {
  const preset = EXPORT_PRESETS[options.preset];
  if (!preset) throw new Error(`Unknown export preset: ${options.preset}`);

  try {
    onProgress({ status: "preparing", percent: 10, message: "Preparing layers…" });

    // Let the browser paint any pending state changes before capture.
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    onProgress({ status: "rendering", percent: 40, message: "Rendering canvas at 2x…" });

    const mimeType = options.format === "png" ? "image/png" : "image/jpeg";
    const blob = await toBlob(node, {
      pixelRatio: preset.pixelRatio,
      width: preset.width,
      height: preset.height,
      quality: options.format === "jpeg" ? options.quality : 1,
      cacheBust: true,
      type: mimeType,
      style: {
        // Force exact preset dimensions during capture regardless of
        // on-screen responsive sizing.
        width: `${preset.width}px`,
        height: `${preset.height}px`,
      },
    });

    if (!blob) throw new Error("Canvas serialization returned empty blob");

    onProgress({ status: "encoding", percent: 85, message: "Encoding image…" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const ext = options.format === "png" ? "png" : "jpg";
    a.href = url;
    a.download = `${filenamePrefix}-${preset.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);

    onProgress({ status: "done", percent: 100, message: "Export complete" });
  } catch (err) {
    console.error(err);
    onProgress({
      status: "error",
      percent: 0,
      message: err instanceof Error ? err.message : "Export failed",
    });
  }
}
