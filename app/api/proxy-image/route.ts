import { NextRequest, NextResponse } from "next/server";

/**
 * Streams a remote image back with permissive CORS headers so the client
 * can draw it onto <canvas> and later call canvas.toDataURL()/toBlob()
 * without a "tainted canvas" SecurityError. Restrict ALLOWED_HOSTS to your
 * real asset CDNs before deploying — this route is otherwise an open
 * image fetcher.
 */

const ALLOWED_HOSTS = [
  "assets.your-cdn.example.com",
  "res.cloudinary.com",
  "static.wikia.nocookie.net",
];

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url param" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.some((host) => target.hostname === host || target.hostname.endsWith(`.${host}`))) {
    return NextResponse.json({ error: "Host not allowlisted" }, { status: 403 });
  }

  const upstream = await fetch(target.toString(), {
    // Revalidate hourly; skin art is effectively static per-patch.
    next: { revalidate: 3600 },
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "Upstream fetch failed" }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/png";

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
