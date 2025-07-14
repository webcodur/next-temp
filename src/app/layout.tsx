/* 
  파일명: /app/layout.tsx
  기능: Next.js 루트 레이아웃 컴포넌트
  책임: 전역 HTML 구조와 Provider, 메타데이터 설정
*/ // ------------------------------
import type { Metadata } from 'next';

import { Provider } from 'jotai';

import { MainLayout } from '@/components/layout/main-layout';
import { LoginModal } from '@/components/layout/login/LoginModal';

import './globals.css';

// #region 타입
interface RootLayoutProps {
	children: React.ReactNode;
}
// #endregion

// #region 상수
export const metadata: Metadata = {
	title: 'HUB-NEW',
	description: 'Modern UI components with neumorphism design',
};
// #endregion

// #region 렌더링
export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="ko" className="font-multilang" suppressHydrationWarning>
			<body>
				<Provider>
					<MainLayout>{children}</MainLayout>
					<LoginModal />
				</Provider>
			</body>
		</html>
	);
}
// #endregion
