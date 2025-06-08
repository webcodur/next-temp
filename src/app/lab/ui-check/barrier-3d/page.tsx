'use client';

import * as React from 'react';
import ParkingBarrier3D from '@/components/ui/barrier/Barrier3d';
import { ViewAngle, VIEW_ANGLE_NAMES } from '@/components/ui/barrier/constants';

export default function Barrier3DPage() {
	const [barrierStates, setBarrierStates] = React.useState<
		Record<ViewAngle, boolean>
	>({
		diagonal: false,
		driver: true,
		security: false,
	});

	const toggleBarrier = (viewAngle: ViewAngle) => {
		setBarrierStates((prev) => ({
			...prev,
			[viewAngle]: !prev[viewAngle],
		}));
	};

	return (
		<div className="container py-10">
			<h1 className="mb-8 text-3xl font-bold">
				Barrier3D 컴포넌트 - 핵심 시점
			</h1>
			<p className="mb-6 text-gray-600">
				Three.js를 활용한 3D 주차장 차단기 컴포넌트의 핵심 시점들을
				확인해보세요. 모든 차단기는 0.3초의 빠른 애니메이션 속도로 동작합니다.
			</p>

			<div className="p-4 mb-8 border border-blue-200 rounded-lg bg-blue-50">
				<h3 className="mb-2 text-lg font-semibold text-blue-800">
					핵심 시점별 특징
				</h3>
				<div className="grid grid-cols-1 gap-2 text-sm text-blue-700 md:grid-cols-3">
					<div>
						• <strong>대각선 시점</strong>: 입체감이 가장 좋은 기본 시점
					</div>
					<div>
						• <strong>운전자 시점</strong>: 실제 운전자가 보는 관점
					</div>
					<div>
						• <strong>보안 카메라 시점</strong>: 모니터링 최적화 각도
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
				{(Object.keys(VIEW_ANGLE_NAMES) as ViewAngle[]).map((viewAngle) => (
					<div
						key={viewAngle}
						className="p-6 border border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
						<h2 className="mb-4 text-lg font-semibold text-center">
							{VIEW_ANGLE_NAMES[viewAngle]}
						</h2>
						<div className="flex justify-center mb-4">
							<ParkingBarrier3D
								width={220}
								height={264}
								isOpen={barrierStates[viewAngle]}
								onToggle={() => toggleBarrier(viewAngle)}
								showControls={true}
								animationDuration={300}
								viewAngle={viewAngle}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
