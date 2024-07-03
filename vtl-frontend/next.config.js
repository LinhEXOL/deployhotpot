const nextConfig = {
  //   output: "standalone",
  eslint: {
    ignoreDuringBuilds: true, // Tắt kiểm tra lint trong quá trình build
  },
  typescript: {
    ignoreBuildErrors: true, // Tắt kiểm tra TypeScript trong quá trình build
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qiaolinhotpot.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },

      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
};

module.exports = nextConfig;
