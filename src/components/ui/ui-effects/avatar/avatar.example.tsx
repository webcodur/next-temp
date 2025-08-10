'use client';

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './Avatar';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

export default function AvatarExample() {
	const t = useTranslations();

	return (
		<div className="p-8 min-h-screen bg-gray-50">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<h1 className="mb-4 text-3xl font-bold text-gray-900">{t('아바타_제목')}</h1>
					<p className="text-gray-600">{t('아바타_설명')}</p>
				</div>

				<div className="space-y-8">
					{/* 기본 아바타 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('아바타_기본아바타')}</h2>
						<div className="flex items-center space-x-4">
							<Avatar>
								<AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
							<Avatar>
								<AvatarFallback>U</AvatarFallback>
							</Avatar>
						</div>
					</section>

					{/* 사이즈 변형 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('아바타_사이즈변형')}</h2>
						<div className="flex items-center space-x-4">
							<Avatar className="w-8 h-8">
								<AvatarFallback className="text-xs text-white bg-blue-300">
									S
								</AvatarFallback>
							</Avatar>
							<Avatar className="w-12 h-12">
								<AvatarFallback className="text-white bg-green-300">
									M
								</AvatarFallback>
							</Avatar>
							<Avatar className="w-16 h-16">
								<AvatarFallback className="text-lg text-white bg-purple-300">
									L
								</AvatarFallback>
							</Avatar>
						</div>
					</section>

					{/* 사용 예시 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">{t('아바타_사용예시')}</h2>
						<div className="space-y-4">
							<div className="flex items-center space-x-3">
								<Avatar>
									<AvatarImage src="https://github.com/shadcn.png" alt="User 1" />
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{t('아바타_존도')}</p>
									<p className="text-sm text-gray-500">{t('아바타_존이메일')}</p>
								</div>
							</div>
							<div className="flex items-center space-x-3">
								<Avatar>
									<AvatarFallback className="font-bold text-white bg-red-400">
										JD
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{t('아바타_제인도')}</p>
									<p className="text-sm text-gray-500">{t('아바타_제인이메일')}</p>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
} 