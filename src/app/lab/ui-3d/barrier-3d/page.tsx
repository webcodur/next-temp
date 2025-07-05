'use client';

import * as React from 'react';
import {
	BarrierDiagonalView,
	BarrierDriverView,
	BarrierSecurityView,
	OperationMode,
	ViewAngle,
} from '@/unit/barrier/barrier';
import { useTranslations } from '@/hooks/useI18n';

export default function Barrier3DPage() {
	const t = useTranslations();
	
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

	return (
		<div className="container py-10">
			<h1 className="mb-8 text-3xl font-bold">
				{t('3D_배리어제목')}
			</h1>

			<div className="p-4 mb-8 border border-blue-200 rounded-lg bg-blue-50">
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

			<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div className="p-6 border border-gray-200 rounded-lg bg-linear-to-br from-gray-50 to-gray-100">
					<div className="flex justify-center mb-4">
						<BarrierDiagonalView
							width={220}
							height={264}
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

				<div className="p-6 border border-gray-200 rounded-lg bg-linear-to-br from-gray-50 to-gray-100">
					<div className="flex justify-center mb-4">
						<BarrierDriverView
							width={220}
							height={264}
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

				<div className="p-6 border border-gray-200 rounded-lg bg-linear-to-br from-gray-50 to-gray-100">
					<div className="flex justify-center mb-4">
						<BarrierSecurityView
							width={220}
							height={264}
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
}
