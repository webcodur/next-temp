/*
  파일명: src/app/lab/ui-3d/threejs-interactions/page.tsx
  기능: Three.js에서의 사용자 상호작용(궤도 제어, 드래그, 클릭 등)을 시연하기 위한 플레이스홀더 페이지
  책임: 각 상호작용 유형에 대한 설명과 선택 UI를 제공하며, 실제 3D 구현을 위한 구조를 정의한다.
*/

'use client';

import { useState } from 'react';

import { useTranslations } from '@/hooks/useI18n';

// #region 타입
type InteractionType = 'orbit' | 'drag' | 'click' | 'hover' | 'keyboard';
// #endregion

export default function InteractionsPage() {
	// #region 훅
	const t = useTranslations();
	// #endregion

	// #region 상태
	const [selectedInteraction, setSelectedInteraction] = useState<InteractionType>('orbit');
	// #endregion
	
	// #region 상수
	const interactionDetails = {
		orbit: {
			label: t('3D_궤도제어'),
			description: t('3D_궤도제어설명'),
		},
		drag: {
			label: t('3D_드래그'),
			description: t('3D_드래그설명'),
		},
		click: {
			label: t('3D_클릭'),
			description: t('3D_클릭설명'),
		},
		hover: {
			label: t('3D_호버'),
			description: t('3D_호버설명'),
		},
		keyboard: {
			label: t('3D_키보드'),
			description: t('3D_키보드설명'),
		}
	};
	// #endregion

	// #region 렌더링
	return (
		<div className="p-8 space-y-8">
			<div className="p-6 rounded-xl neu-flat">
				<h1 className="mb-4 text-3xl font-bold">{t('3D_상호작용제목')}</h1>
				<p className="mb-6 text-gray-600">
					{t('3D_상호작용설명')}
				</p>
			</div>

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">{t('3D_상호작용갤러리')}</h2>
					<div className="border border-gray-200 rounded-lg overflow-hidden mb-4 h-64">
						<div className="flex items-center justify-center h-full text-gray-500">
							3D 뷰어 플레이스홀더
						</div>
					</div>
					
					<div className="neu-inset p-4 rounded-lg">
						<div className="space-y-1 text-sm text-gray-600">
							<p>• {t('3D_마우스드래그')}</p>
							<p>• {t('3D_휠확대')}</p>
							<p>• {t('3D_우클릭패닝')}</p>
						</div>
					</div>
				</div>

				<div className="p-6 rounded-xl neu-flat">
					<h2 className="mb-4 text-xl font-semibold">{t('3D_상호작용선택')}</h2>
					<div className="space-y-2">
						{(Object.keys(interactionDetails) as InteractionType[]).map((type) => {
							const isSelected = selectedInteraction === type;
							const detail = interactionDetails[type];
							
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
									<h3 className="font-semibold text-sm">{detail.label}</h3>
									<p className="text-xs text-gray-600 mt-1">
										{detail.description}
									</p>
								</button>
							);
						})}
					</div>
				</div>
			</div>

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
	// #endregion
} 