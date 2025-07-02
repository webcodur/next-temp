'use client';

import React from 'react';
import { Badge } from '@/components/ui/ui-effects/badge';

const BadgePage = () => {
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Badge 컴포넌트</h1>
					<p className="text-gray-600">상태 표시 배지 컴포넌트 테스트</p>
				</div>

				<div className="space-y-8">
					{/* 기본 배지 */}
					<section className="bg-white rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">기본 배지</h2>
						<div className="space-x-4 flex items-center">
							<Badge>Default</Badge>
							<Badge variant="secondary">Secondary</Badge>
							<Badge variant="destructive">Destructive</Badge>
							<Badge variant="outline">Outline</Badge>
						</div>
					</section>

					{/* 스타일 변형 */}
					<section className="bg-white rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">스타일 변형</h2>
						<div className="space-x-4 flex items-center">
							<Badge className="text-xs">Small Text</Badge>
							<Badge className="text-sm">Medium Text</Badge>
							<Badge className="text-base px-3 py-1">Large Text</Badge>
						</div>
					</section>

					{/* 사용 예시 */}
					<section className="bg-white rounded-lg p-6 shadow-xs">
						<h2 className="text-xl font-semibold mb-4">사용 예시</h2>
						<div className="space-y-4">
							<div className="flex items-center space-x-2">
								<span>온라인 상태:</span>
								<Badge variant="default">Online</Badge>
							</div>
							<div className="flex items-center space-x-2">
								<span>새 메시지:</span>
								<Badge variant="destructive">5</Badge>
							</div>
							<div className="flex items-center space-x-2">
								<span>업데이트 필요:</span>
								<Badge variant="outline">Update</Badge>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default BadgePage; 