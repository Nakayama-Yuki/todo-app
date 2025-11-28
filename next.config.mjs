/** @type {import('next').NextConfig} */
const nextConfig = {
  // docker build 用設定
  output: "standalone",
  // キャッシュの設定
  cacheComponents: true,
};

export default nextConfig;
