'use client';

import * as React from 'react';
import ParkingBarrier3D from '@/components/ui/barrier/barrier-3d';
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

			<div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
				<h3 className="mb-2 text-lg font-semibold text-blue-800">
					핵심 시점별 특징
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-blue-700">
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

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

			{/* 비교 섹션 */}
			<div className="mt-12 p-6 border border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
				<h2 className="mb-6 text-xl font-semibold text-purple-800">
					시점 비교 - 동일한 상태
				</h2>
				<p className="mb-6 text-purple-700">
					3개의 핵심 시점을 동일한 상태로 설정하여 각 시점의 차이를
					비교해보세요. 각 시점은 서로 다른 용도와 관점을 제공합니다.
				</p>

				<div className="flex justify-center gap-4 mb-6">
					<button
						onClick={() =>
							setBarrierStates((prev) =>
								Object.keys(prev).reduce(
									(acc, key) => ({ ...acc, [key]: false }),
									{} as Record<ViewAngle, boolean>
								)
							)
						}
						className="px-6 py-3 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-2xl shadow-neumorphism-button hover:from-red-500 hover:to-red-600 transition-all duration-300">
						모든 차단기 닫기
					</button>
					<button
						onClick={() =>
							setBarrierStates((prev) =>
								Object.keys(prev).reduce(
									(acc, key) => ({ ...acc, [key]: true }),
									{} as Record<ViewAngle, boolean>
								)
							)
						}
						className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-2xl shadow-neumorphism-button hover:from-green-500 hover:to-green-600 transition-all duration-300">
						모든 차단기 열기
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{(Object.keys(VIEW_ANGLE_NAMES) as ViewAngle[]).map((viewAngle) => (
						<div key={`compare-${viewAngle}`} className="text-center">
							<ParkingBarrier3D
								width={180}
								height={216}
								isOpen={barrierStates[viewAngle]}
								showControls={false}
								animationDuration={300}
								viewAngle={viewAngle}
							/>
							<p className="mt-2 text-sm text-purple-600 font-medium">
								{VIEW_ANGLE_NAMES[viewAngle]}
							</p>
						</div>
					))}
				</div>
			</div>

			{/* 시점별 용도 안내 */}
			<div className="mt-8 p-6 border border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
				<h2 className="mb-4 text-xl font-semibold text-green-800">
					시점별 활용 용도
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="text-center p-4 bg-white rounded-lg shadow-sm">
						<h3 className="font-semibold text-green-700 mb-2">대각선 시점</h3>
						<p className="text-sm text-green-600">
							• 일반적인 UI 컴포넌트
							<br />
							• 대시보드 위젯
							<br />• 상태 표시기
						</p>
					</div>
					<div className="text-center p-4 bg-white rounded-lg shadow-sm">
						<h3 className="font-semibold text-green-700 mb-2">운전자 시점</h3>
						<p className="text-sm text-green-600">
							• 차량 내비게이션
							<br />
							• 운전자 앱 UI
							<br />• 실제 사용자 경험
						</p>
					</div>
					<div className="text-center p-4 bg-white rounded-lg shadow-sm">
						<h3 className="font-semibold text-green-700 mb-2">
							보안 카메라 시점
						</h3>
						<p className="text-sm text-green-600">
							• 관제 시스템
							<br />
							• 모니터링 대시보드
							<br />• 보안 관리 UI
						</p>
					</div>
				</div>
			</div>

			{/* 확대/축소 테스트 안내 */}
			<div className="mt-8 p-6 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
				<h2 className="mb-4 text-xl font-semibold text-blue-800">
					확대/축소 테스트
				</h2>
				<p className="text-blue-700 mb-4">
					Ctrl + 마우스 휠 또는 Ctrl + +/- 키를 사용하여 페이지를
					확대/축소해보세요. 모든 시점에서 차단기가 선명하게 렌더링되는 것을
					확인할 수 있습니다.
				</p>
			</div>
		</div>
	);
}
