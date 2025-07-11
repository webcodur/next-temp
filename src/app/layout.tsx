import type { Metadata } from 'next';
import './globals.css';
import { MainLayout } from '@/components/layout/main-layout';
import { Provider } from 'jotai';
import { LoginModal } from '@/components/layout/login/LoginModal';

export const metadata: Metadata = {
	title: 'HUB-NEW',
	description: 'Modern UI components with neumorphism design',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
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
