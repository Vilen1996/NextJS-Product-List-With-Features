import { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
