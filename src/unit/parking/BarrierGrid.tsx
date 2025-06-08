import React from 'react';
import ParkingBarrierCard from './ParkingBarrierCard';
import { ParkingBarrier } from '@/types/parking';

interface BarrierGridProps {
	barriers: ParkingBarrier[];
	onBarrierOpen: (barrierId: string) => void;
	onBarrierClose: (barrierId: string) => void;
	onBarrierAlwaysOpen: (barrierId: string) => void;
	onBarrierAutoMode: (barrierId: string) => void;
	onBarrierBypass: (barrierId: string) => void;
}

const BarrierGrid: React.FC<BarrierGridProps> = ({
	barriers,
	onBarrierOpen,
	onBarrierClose,
	onBarrierAlwaysOpen,
	onBarrierAutoMode,
	onBarrierBypass,
}) => {
	// 차단기 상태별 통계
	const stats = {
		total: barriers.length,
		open: barriers.filter((b) => b.isOpen).length,
		alwaysOpen: barriers.filter((b) => b.alwaysOpen).length,
		autoMode: barriers.filter((b) => b.autoMode).length,
		bypass: barriers.filter((b) => b.bypass).length,
	};

	return (
		<div className="space-y-4">
			{/* 헤더 및 통계 */}
			<div className="neu-flat rounded-xl p-3 bg-white">
				<div className="flex items-center justify-between mb-3">
					<h2 className="text-base font-semibold text-gray-800">차단기 현황</h2>
					<div className="text-xs text-gray-600">총 {stats.total}대</div>
				</div>

				{/* 상태 통계 */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
					<div className="neu-inset rounded-lg p-2 text-center">
						<div className="text-base font-bold text-blue-600">
							{stats.open || 0}
						</div>
						<div className="text-xs text-gray-600">열림</div>
					</div>
					<div className="neu-inset rounded-lg p-2 text-center">
						<div className="text-base font-bold text-green-600">
							{stats.alwaysOpen || 0}
						</div>
						<div className="text-xs text-gray-600">항시열림</div>
					</div>
					<div className="neu-inset rounded-lg p-2 text-center">
						<div className="text-base font-bold text-purple-600">
							{stats.autoMode || 0}
						</div>
						<div className="text-xs text-gray-600">자동운행</div>
					</div>
					<div className="neu-inset rounded-lg p-2 text-center">
						<div className="text-base font-bold text-orange-600">
							{stats.bypass || 0}
						</div>
						<div className="text-xs text-gray-600">바이패스</div>
					</div>
				</div>
			</div>

			{/* 차단기 그리드 - 세로 긴 레이아웃에 맞게 조정 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
				{barriers.map((barrier) => (
					<ParkingBarrierCard
						key={barrier.id}
						barrier={barrier}
						onToggleOpen={onBarrierOpen}
						onToggleClose={onBarrierClose}
						onToggleAlwaysOpen={onBarrierAlwaysOpen}
						onToggleAutoMode={onBarrierAutoMode}
						onToggleBypass={onBarrierBypass}
					/>
				))}
			</div>
		</div>
	);
};

export default BarrierGrid;
