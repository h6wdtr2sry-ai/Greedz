import { HeroRole, Skin, SkinTier } from "@/types/mlbb";

// ────────────────────────────────────────────────────────────────────────
// Asset resolution strategy
// ────────────────────────────────────────────────────────────────────────
// IMPORTANT: Moonton owns the MLBB skin artwork. This project does not ship
// or embed that artwork. Instead every skin record stores a *slug*, and
// image URLs are resolved at runtime against a prioritized list of CDN
// bases you configure yourself (your own asset bucket, a licensed partner
// CDN, or a community wiki mirror you have rights to hit). Swap the values
// below for whatever you're actually authorized to serve — the rest of the
// app only depends on the resulting URL shape.
//
// All resolved URLs are also routed through /api/proxy-image when drawn to
// <canvas>, so canvas.toDataURL() doesn't throw a tainted-canvas/CORS error
// regardless of which CDN ends up serving the byte.

export const CDN_BASES = [
  process.env.NEXT_PUBLIC_MLBB_CDN_PRIMARY ?? "https://assets.your-cdn.example.com/mlbb",
  process.env.NEXT_PUBLIC_MLBB_CDN_FALLBACK ?? "https://res.cloudinary.com/your-cloud/mlbb",
] as const;

export function buildAssetUrl(
  slug: string,
  kind: "avatar" | "fullart" | "frame",
  cdnIndex: 0 | 1 = 0
): string {
  const base = CDN_BASES[cdnIndex];
  const folder = kind === "avatar" ? "avatars" : kind === "fullart" ? "fullart" : "frames";
  return `${base}/${folder}/${slug}.png`;
}

/** Wraps any external URL so <canvas> export never hits a CORS-tainted read. */
export function proxied(url: string): string {
  if (url.startsWith("/")) return url; // already local
  return `/api/proxy-image?url=${encodeURIComponent(url)}`;
}

function skin(
  heroId: string,
  heroName: string,
  skinName: string,
  role: HeroRole,
  tier: SkinTier,
  tags: string[] = []
): Skin {
  const slug = `${heroId}-${skinName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  return {
    id: slug,
    heroId,
    heroName,
    skinName,
    role,
    tier,
    avatarUrl: buildAssetUrl(slug, "avatar"),
    fullArtUrl: buildAssetUrl(slug, "fullart"),
    frameBorderUrl: buildAssetUrl(slug, "frame"),
    tags,
  };
}

// ────────────────────────────────────────────────────────────────────────
// Seed dataset
// ────────────────────────────────────────────────────────────────────────
// This is a representative slice (hero + skin *names* are public game
// facts, not copyrighted artwork) covering every role and tier so the
// grid, filters, and fuzzy search all have real data to exercise. Point
// SKINS_REMOTE_URL at a hosted JSON file with your full 1,120+ entry
// catalogue for production — loadFullSkinCatalogue() below merges it in
// the same shape, so nothing else in the app needs to change.

export const SKINS: Skin[] = [
  skin("layla", "Layla", "Nightbringer", "Marksman", "Special"),
  skin("layla", "Layla", "Malefic Gunner", "Marksman", "Legend"),
  skin("miya", "Miya", "Modena Butterfly", "Marksman", "Special"),
  skin("miya", "Miya", "Divine Archer", "Marksman", "Elite"),
  skin("gusion", "Gusion", "Cosmic Sting", "Assassin", "Legend"),
  skin("gusion", "Gusion", "Holy Blade", "Assassin", "Epic"),
  skin("fanny", "Fanny", "Blossom Lady", "Assassin", "Epic"),
  skin("fanny", "Fanny", "Dark Enchantress", "Assassin", "Legend"),
  skin("kagura", "Kagura", "Umbrella of Yandere", "Mage", "Collector"),
  skin("kagura", "Kagura", "Guardian of Sakura Forest", "Mage", "Epic"),
  skin("chou", "Chou", "Ferryman of Styx", "Fighter", "Legend"),
  skin("chou", "Chou", "Warrior of Dawn", "Fighter", "Epic"),
  skin("alucard", "Alucard", "Obsidian Blade", "Fighter", "Elite"),
  skin("alucard", "Alucard", "Child of the Fall", "Fighter", "Special"),
  skin("tigreal", "Tigreal", "Blackstone Sentinel", "Tank", "Special"),
  skin("tigreal", "Tigreal", "Dragon Knight", "Tank", "Epic"),
  skin("franco", "Franco", "Winter Circle", "Tank", "Special"),
  skin("estes", "Estes", "Elven Prince", "Support", "Special"),
  skin("angela", "Angela", "Cyber Angel", "Support", "Epic"),
  skin("rafaela", "Rafaela", "Snow Queen", "Support", "Epic"),
  skin("lancelot", "Lancelot", "Sword Dance", "Assassin", "Legend"),
  skin("lancelot", "Lancelot", "Starlight Knight", "Assassin", "Legend", ["starlight"]),
  skin("granger", "Granger", "Fallen Guard", "Marksman", "Epic"),
  skin("granger", "Granger", "Divine Revolver", "Marksman", "Legend"),
  skin("beatrix", "Beatrix", "Iron Dragon", "Marksman", "Epic"),
  skin("valentina", "Valentina", "Silver Fang", "Mage", "Epic"),
  skin("valentina", "Valentina", "Enchantress", "Mage", "Legend"),
  skin("yin", "Yin", "Monkey King", "Fighter", "Legend", ["collab", "journey to the west"]),
  skin("khufra", "Khufra", "Cursed Pharaoh", "Tank", "Epic"),
  skin("belerick", "Belerick", "Guardian of the Jungle", "Tank", "Special"),
  skin("esmeralda", "Esmeralda", "Butterfly Whisper", "Mage", "Epic"),
  skin("harith", "Harith", "Dimensional Traveler", "Mage", "Legend"),
  skin("wanwan", "Wanwan", "Dandelion Dream", "Marksman", "Epic"),
  skin("popol-and-kupa", "Popol and Kupa", "Cursed Totem", "Marksman", "Special"),
  skin("benedetta", "Benedetta", "Death Whisper", "Assassin", "Legend"),
  skin("aamon", "Aamon", "Sonic Rhapsody", "Assassin", "Legend"),
  skin("ling", "Ling", "Astro Cadet", "Assassin", "Epic"),
  skin("guinevere", "Guinevere", "Crimson Elegance", "Fighter", "Epic"),
  skin("xborg", "X.Borg", "Iron Punisher", "Fighter", "Special"),
  skin("badang", "Badang", "Storm Warrior", "Fighter", "Special"),
  skin("julian", "Julian", "Abyssal Reaper", "Fighter", "Legend"),
  skin("floryn", "Floryn", "Garden Spirit", "Support", "Special"),
  skin("mathilda", "Mathilda", "Butterfly Whisper", "Support", "Legend"),
  skin("chip", "Chip", "Circuit Breaker", "Support", "Epic"),
  skin("zhuxin", "Zhu Xin", "Voidmind", "Mage", "Legend"),
  skin("kalea", "Kalea", "Solar Prime", "Mage", "Epic"),
  skin("suyou", "Suyou", "Shadow Blossom", "Assassin", "Epic"),
];

export const SKINS_REMOTE_URL = process.env.NEXT_PUBLIC_MLBB_CATALOGUE_URL ?? "";

/**
 * Loads the seed dataset plus, if configured, a remote JSON catalogue
 * (same Skin[] shape) so the picker can scale to the full 1,120+ roster
 * without inflating the client bundle. Call from a server component or
 * route handler — not on every client render.
 */
export async function loadFullSkinCatalogue(): Promise<Skin[]> {
  if (!SKINS_REMOTE_URL) return SKINS;
  try {
    const res = await fetch(SKINS_REMOTE_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Catalogue fetch failed: ${res.status}`);
    const remote = (await res.json()) as Skin[];
    const byId = new Map(SKINS.map((s) => [s.id, s]));
    for (const s of remote) byId.set(s.id, s);
    return Array.from(byId.values());
  } catch (err) {
    console.error("Falling back to seed catalogue:", err);
    return SKINS;
  }
}

export const ROLES: HeroRole[] = ["Tank", "Fighter", "Assassin", "Mage", "Marksman", "Support"];
export const TIERS: SkinTier[] = [
  "Basic",
  "Elite",
  "Special",
  "Epic",
  "Legend",
  "Collector",
  "Zodiac",
  "Aspirants",
  "Exorcists",
  "Neobeasts",
  "KOF",
  "Prime",
];
