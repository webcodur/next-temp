'use client';

import { useState } from 'react';
import { useTranslations } from '@/hooks/useI18n';

type InteractionType = 'orbit' | 'drag' | 'click' | 'hover' | 'keyboard';

export default function InteractionsPage() {
	const t = useTranslations();


	const [selectedInteraction, setSelectedInteraction] = useState<InteractionType>('orbit');

	// 페이지의 주요 헤딩과 설명만 언어팩 적용
	return (
		<div className="p-8 space-y-8">
			<div className="p-6 rounded-xl neu-flat">
				<h1 className="mb-4 text-3xl font-bold">{t('3D_상호작용제목')}</h1>
				<p className="mb-6 text-gray-600">
					{t('3D_상호작용설명')}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				{/* 3D 뷰어 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">{t('3D_상호작용갤러리')}</h2>
					<div className="border border-gray-200 rounded-lg overflow-hidden mb-4 h-64">
						<div className="flex items-center justify-center h-full text-gray-500">
							3D 뷰어 플레이스홀더
						</div>
					</div>
					
					{/* 안내 메시지 */}
					<div className="neu-inset p-4 rounded-lg">
						<div className="space-y-1 text-sm text-gray-600">
							<p>• {t('3D_마우스드래그')}</p>
							<p>• {t('3D_휠확대')}</p>
							<p>• {t('3D_우클릭패닝')}</p>
						</div>
					</div>
				</div>

				{/* 상호작용 선택 패널 */}
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">{t('3D_상호작용선택')}</h2>
					<div className="space-y-2">
						{(['orbit', 'drag', 'click', 'hover', 'keyboard'] as InteractionType[]).map((type) => {
							const isSelected = selectedInteraction === type;
							const labels = {
								orbit: t('3D_궤도제어'),
								drag: t('3D_드래그'),
								click: t('3D_클릭'),
								hover: t('3D_호버'),
								keyboard: t('3D_키보드')
							};
							const descriptions = {
								orbit: t('3D_궤도제어설명'),
								drag: t('3D_드래그설명'),
								click: t('3D_클릭설명'),
								hover: t('3D_호버설명'),
								keyboard: t('3D_키보드설명')
							};
							
							return (
								<button
									key={type}
									onClick={() => setSelectedInteraction(type)}
									className={`w-full p-3 rounded-lg text-left transition-all ${
										isSelected 
											? 'neu-inset bg-blue-50' 
											: 'neu-raised hover:neu-inset'
									}`}
								>
									<h3 className="font-semibold text-sm">{labels[type]}</h3>
									<p className="text-xs text-gray-600 mt-1">
										{descriptions[type]}
									</p>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* 이론 설명 */}
			<div className="p-6 rounded-xl neu-flat">
				<h2 className="mb-4 text-xl font-semibold">{t('3D_상호작용이해')}</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="p-4 bg-blue-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-blue-800">🎮 {t('3D_궤도제어')}</h3>
						<p className="text-sm text-blue-600">
							{t('3D_궤도제어설명')}
						</p>
					</div>
					<div className="p-4 bg-green-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-green-800">👆 {t('3D_드래그')}</h3>
						<p className="text-sm text-green-600">
							{t('3D_드래그설명')}
						</p>
					</div>
					<div className="p-4 bg-purple-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-purple-800">🖱️ {t('3D_클릭')}</h3>
						<p className="text-sm text-purple-600">
							{t('3D_클릭설명')}
						</p>
					</div>
					<div className="p-4 bg-orange-50 rounded-lg">
						<h3 className="mb-2 font-semibold text-orange-800">⌨️ {t('3D_키보드')}</h3>
						<p className="text-sm text-orange-600">
							{t('3D_키보드설명')}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
} 