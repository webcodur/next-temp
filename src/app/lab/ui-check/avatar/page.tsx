'use client';

import React from 'react';
import { Avatar } from '@/components/ui/avatar';

const AvatarPage = () => {
	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">Avatar 컴포넌트</h1>
					<p className="text-gray-600">사용자 아바타 표시 컴포넌트 테스트</p>
				</div>

				<div className="space-y-8">
					{/* 기본 아바타 */}
					<section className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold mb-4">기본 아바타</h2>
						<div className="space-x-4 flex items-center">
							<Avatar>
								<img src="https://github.com/shadcn.png" alt="Avatar" />
							</Avatar>
							<Avatar>
								<div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600">
									U
								</div>
							</Avatar>
						</div>
					</section>

					{/* 사이즈 변형 */}
					<section className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold mb-4">사이즈 변형</h2>
						<div className="space-x-4 flex items-center">
							<Avatar className="w-8 h-8">
								<div className="w-full h-full bg-blue-300 flex items-center justify-center text-white text-xs">
									S
								</div>
							</Avatar>
							<Avatar className="w-12 h-12">
								<div className="w-full h-full bg-green-300 flex items-center justify-center text-white">
									M
								</div>
							</Avatar>
							<Avatar className="w-16 h-16">
								<div className="w-full h-full bg-purple-300 flex items-center justify-center text-white text-lg">
									L
								</div>
							</Avatar>
						</div>
					</section>

					{/* 사용 예시 */}
					<section className="bg-white rounded-lg p-6 shadow-sm">
						<h2 className="text-xl font-semibold mb-4">사용 예시</h2>
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								<Avatar>
									<img src="https://github.com/shadcn.png" alt="User 1" />
								</Avatar>
								<div>
									<p className="font-medium">John Doe</p>
									<p className="text-sm text-gray-500">john@example.com</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<Avatar>
									<div className="w-full h-full bg-red-400 flex items-center justify-center text-white font-bold">
										JD
									</div>
								</Avatar>
								<div>
									<p className="font-medium">Jane Doe</p>
									<p className="text-sm text-gray-500">jane@example.com</p>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
};

export default AvatarPage; 