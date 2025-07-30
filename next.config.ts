/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode 비활성화 (개발 시 콘솔 중복 출력 방지)
  reactStrictMode: false,
  // Vercel 배포 최적화 (output: standalone 제거)
  experimental: {
    // TypeScript 타입 검사 최적화
    typedRoutes: false,
  },
  // 빌드 최적화
  eslint: {
    // Vercel에서 ESLint 오류로 빌드 실패하는 것을 방지
    ignoreDuringBuilds: false,
  },
  typescript: {
    // TypeScript 오류로 빌드 실패하는 것을 방지 (운영에서는 false로 변경)
    ignoreBuildErrors: false,
  },
  // export 디렉토리 충돌 방지
  distDir: '.next',
};

module.exports = nextConfig;
