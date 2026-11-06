import type { NextConfig } from "next";

// 平时（Vercel 上）：服务器模式，正常构建
// 需要导出成纯静态文件（交给国内静态托管用）时：STATIC_EXPORT=1 npm run build
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {}),
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: !isStaticExport,
  partialPrefetching: !isStaticExport,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
