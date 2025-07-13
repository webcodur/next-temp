import React from 'react';
import ParkingBarrierCard from './ParkingBarrierCard';
import { ParkingBarrier, OperationMode } from '@/types/parking';

interface BarrierGridProps {
	barriers: ParkingBarrier[];
	onBarrierOpen: (barrierId: string) => void;
	onBarrierClose: (barrierId: string) => void;
	onOperationModeChange: (barrierId: string, mode: OperationMode) => void;
}

const BarrierGrid: React.FC<BarrierGridProps> = ({
	barriers,
	onBarrierOpen,
	onBarrierClose,
	onOperationModeChange,
}) => {
	// 차단기 상태별 통계
	const stats = {
		total: barriers.length,
		open: barriers.filter((b) => b.isOpen).length,
		closed: barriers.filter((b) => !b.isOpen).length,
		autoMode: barriers.filter((b) => b.operationMode === 'auto-operation')
			.length,
		alwaysOpen: barriers.filter((b) => b.operationMode === 'always-open')
			.length,
		bypass: barriers.filter((b) => b.operationMode === 'bypass').length,
	};

	return (
		<div className="space-y-2">
			{/* 헤더 및 통계 - 인라인 형태 */}
			<div className="flex justify-between items-center p-2 rounded-lg border bg-background border-border">
				<div className="flex gap-4 items-center">
					<h2 className="text-sm font-semibold text-foreground">차단기 현황</h2>
					<div className="text-xs text-muted-foreground">
						총 {stats.total}대
					</div>
				</div>
				<div className="flex gap-3 items-center">
					{/* 현재 상태 */}
					<div className="flex gap-2 items-center px-2 py-1 rounded bg-muted">
						<span className="text-xs text-muted-foreground">상태:</span>
						<div className="flex gap-1 items-center">
							<div className="w-2 h-2 rounded-full bg-success"></div>
							<span className="text-xs font-medium text-success">
								열림 {stats.open}
							</span>
						</div>
						<div className="flex gap-1 items-center">
							<div className="w-2 h-2 rounded-full bg-destructive"></div>
							<span className="text-xs font-medium text-destructive">
								닫힘 {stats.closed}
							</span>
						</div>
					</div>

					{/* 운영 모드 */}
					<div className="flex gap-2 items-center px-2 py-1 rounded bg-muted">
						<span className="text-xs text-muted-foreground">모드:</span>
						<div className="flex gap-1 items-center">
							<div className="w-2 h-2 rounded-full bg-primary"></div>
							<span className="text-xs font-medium text-primary">
								자동 {stats.autoMode}
							</span>
						</div>
						<div className="flex gap-1 items-center">
							<div className="w-2 h-2 rounded-full bg-accent"></div>
							<span className="text-xs font-medium text-accent">
								상시 {stats.alwaysOpen}
							</span>
						</div>
						<div className="flex gap-1 items-center">
							<div className="w-2 h-2 rounded-full bg-warning"></div>
							<span className="text-xs font-medium text-warning">
								우회 {stats.bypass}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* 차단기 그리드 - 2열 고정 레이아웃 */}
			<div className="grid grid-cols-2 gap-2">
				{barriers.map((barrier) => (
					<ParkingBarrierCard
						key={barrier.id}
						barrier={barrier}
						onToggleOpen={onBarrierOpen}
						onToggleClose={onBarrierClose}
						onOperationModeChange={onOperationModeChange}
					/>
				))}
			</div>
		</div>
	);
};

export default BarrierGrid;
