/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/pro",
        destination: "/#pro",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
