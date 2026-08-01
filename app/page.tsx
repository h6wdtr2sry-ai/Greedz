import CollageApp from "@/components/collage/CollageApp";
import { loadFullSkinCatalogue } from "@/data/skins";

// Skin catalogue is fetched server-side (with hourly ISR revalidation) so
// the 1,120+ entry roster never inflates the client JS bundle — only the
// resolved Skin[] JSON is sent down.
export default async function Page() {
  const skins = await loadFullSkinCatalogue();
  return <CollageApp skins={skins} />;
}
