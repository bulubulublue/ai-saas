/** @type {import('next').NextConfig} */
const nextConfig = {
  // 需要添加这个配置，才能使用next/image
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net"]
  }
};

module.exports = nextConfig;
