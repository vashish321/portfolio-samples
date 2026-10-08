/** @type {import('next').NextConfig} */
const supabaseHost = (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  .replace('https://', '')
  .replace(/\/$/, '');

const nextConfig = {
  images: {
    remotePatterns: supabaseHost
      ? [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }]
      : [],
  },
};

export default nextConfig;
