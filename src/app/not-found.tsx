'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

	return (
		<MainLayout>
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
				<div className="w-full max-w-md p-8 mx-4 bg-white rounded-lg shadow-xl">
					<div className="text-center">
						<div className="mb-4 text-6xl font-bold text-gray-400">404</div>
						<h1 className="mb-2 text-2xl font-semibold text-gray-900">
							페이지를 찾을 수 없다
						</h1>
						<p className="mb-6 text-gray-600">
							요청하신 페이지가 존재하지 않거나 이동되었다.
						</p>
						<div className="flex justify-center gap-3">
							<Button
								variant="outline"
								onClick={() => router.back()}
								className="transition-all hover:scale-105">
								이전으로
							</Button>
							<Button
								onClick={() => router.push('/')}
								className="transition-all hover:scale-105">
								홈으로
							</Button>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
}
