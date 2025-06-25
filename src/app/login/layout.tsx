import { Providers } from '@/providers/Providers';
import '../globals.css';

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko" suppressHydrationWarning>
			<body className="min-h-screen bg-gray-50">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
