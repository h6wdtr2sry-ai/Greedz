/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Add every CDN host you actually source skin art from.
    // Keep this list explicit — Next.js image optimization requires it,
    // and it also documents your asset supply chain.
    remotePatterns: [
      { protocol: "https", hostname: "static.wikia.nocookie.net" },
      { protocol: "https", hostname: "**.mlbb-assets.example.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  webpack: (config) => {
    // fabric.js ships a node build; keep bundling lean on the client
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
};

module.exports = nextConfig;
