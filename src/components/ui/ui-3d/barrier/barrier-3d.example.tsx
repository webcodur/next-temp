/*
  파일명: src/components/ui/ui-3d/barrier/barrier-3d.example.tsx
  기능: 3D 차단기(Barrier) 컴포넌트의 다양한 뷰와 상호작용을 테스트하는 예시
  책임: 대각선, 운전자, 보안 등 여러 시점의 3D 차단기를 렌더링하고, 상태(열림/닫힘) 및 운행 모드 변경을 제어한다.
*/

'use client';

import * as React from 'react';

import { useTranslations } from '@/hooks/useI18n';
import {
	BarrierDiagonalView,
	BarrierDriverView,
	BarrierSecurityView,
} from '@/unit/barrier/barrier';
import type { OperationMode, ViewAngle } from '@/unit/barrier/barrier';

export default function Barrier3DExample() {
	// #region 훅
	const t = useTranslations();
	// #endregion

	// #region 상태
	const [barrierStates, setBarrierStates] = React.useState<
		Record<ViewAngle, boolean>
	>({
		diagonal: false,
		driver: true,
		security: false,
	});

	const [operationModes, setOperationModes] = React.useState<
		Record<ViewAngle, OperationMode>
	>({
		diagonal: 'auto-operation',
		driver: 'always-open',
		security: 'bypass',
	});
	// #endregion

	// #region 핸들러
	const toggleBarrier = (viewAngle: ViewAngle) => {
		setBarrierStates((prev) => ({
			...prev,
			[viewAngle]: !prev[viewAngle],
		}));
	};

	const handleOperationModeChange = (
		viewAngle: ViewAngle,
		mode: OperationMode
	) => {
		console.log('부모에서 운행 모드 변경:', viewAngle, mode);
		setOperationModes((prev) => {
			const newModes = {
				...prev,
				[viewAngle]: mode,
			};
			console.log('새로운 운행 모드 상태:', newModes);
			return newModes;
		});
	};
	// #endregion

	// #region 렌더링
	return (
		<div className="container py-10">
			<h1 className="mb-8 text-3xl font-bold">
				{t('3D_배리어제목')}
			</h1>

			<div className="p-4 mb-8 bg-blue-50 rounded-lg border border-blue-200">
				<h3 className="mb-2 text-lg font-semibold text-blue-800">
					{t('3D_배리어특징')}
				</h3>
				<div className="grid grid-cols-1 gap-2 text-sm text-blue-700 md:grid-cols-3">
					<div>
						• <strong>{t('3D_대각선시점')}</strong>: {t('3D_대각선설명')}
					</div>
					<div>
						• <strong>{t('3D_운전자시점')}</strong>: {t('3D_운전자설명')}
					</div>
					<div>
						• <strong>{t('3D_보안시점')}</strong>: {t('3D_보안설명')}
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				<div className="p-3 from-gray-50 to-gray-100 rounded-lg border border-gray-200 bg-linear-to-br">
					<div className="flex justify-center">
						<BarrierDiagonalView
							width={300}
							height={340}
							isOpen={barrierStates.diagonal}
							onToggle={() => toggleBarrier('diagonal')}
							showControls={true}
							animationDuration={300}
							operationMode={operationModes.diagonal}
							onOperationModeChange={(mode: OperationMode) =>
								handleOperationModeChange('diagonal', mode)
							}
							showTitle={true}
						/>
					</div>
				</div>

				<div className="p-3 from-gray-50 to-gray-100 rounded-lg border border-gray-200 bg-linear-to-br">
					<div className="flex justify-center">
						<BarrierDriverView
							width={300}
							height={340}
							isOpen={barrierStates.driver}
							onToggle={() => toggleBarrier('driver')}
							showControls={true}
							animationDuration={300}
							operationMode={operationModes.driver}
							onOperationModeChange={(mode: OperationMode) =>
								handleOperationModeChange('driver', mode)
							}
							showTitle={true}
						/>
					</div>
				</div>

				<div className="p-3 from-gray-50 to-gray-100 rounded-lg border border-gray-200 bg-linear-to-br">
					<div className="flex justify-center">
						<BarrierSecurityView
							width={300}
							height={340}
							isOpen={barrierStates.security}
							onToggle={() => toggleBarrier('security')}
							showControls={true}
							animationDuration={300}
							operationMode={operationModes.security}
							onOperationModeChange={(mode: OperationMode) =>
								handleOperationModeChange('security', mode)
							}
							showTitle={true}
						/>
					</div>
				</div>
			</div>
		</div>
	);
	// #endregion
} 