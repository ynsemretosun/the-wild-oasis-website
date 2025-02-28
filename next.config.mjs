/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kqdfqsdiikktquryhmqm.supabase.co",
        pathname: "/storage/v1/object/public/cabin-images/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
