const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // React Strict Mode 활성화
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')], // Sass 스타일 경로 추가
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  },
  eslint: {
    ignoreDuringBuilds: false, // 빌드 중 ESLint 오류를 확인 (true로 설정하면 무시)
  },
  images: {
    domains: ['your-backend-url.com', 'localhost'], // next/image에 외부 이미지 도메인 추가
  },
  typescript: {
    ignoreBuildErrors: false, // TypeScript 빌드 오류를 무시하지 않음 (true로 설정 시 무시)
  },
  webpack: (config) => {
    // Webpack 설정 사용자 정의 (필요 시 추가 가능)
    return config;
  },
};

module.exports = nextConfig;
