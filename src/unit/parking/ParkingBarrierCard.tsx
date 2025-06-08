import React from 'react';
import { BarrierDiagonalView, OperationMode } from '@/unit/barrier/barrier';
import { ParkingBarrier } from '@/types/parking';

interface ParkingBarrierCardProps {
	barrier: ParkingBarrier;
	onToggleOpen?: (barrierId: string) => void;
	onToggleClose?: (barrierId: string) => void;
	onOperationModeChange?: (barrierId: string, mode: OperationMode) => void;
}

const ParkingBarrierCard: React.FC<ParkingBarrierCardProps> = ({
	barrier,
	onToggleOpen,
	onToggleClose,
	onOperationModeChange,
}) => {
	const handleBarrierToggle = () => {
		// 상태를 즉시 변경 (애니메이션은 자동으로 처리됨)
		if (barrier.isOpen) {
			onToggleClose?.(barrier.id);
		} else {
			onToggleOpen?.(barrier.id);
		}
	};

	const handleOperationModeChange = (mode: OperationMode) => {
		onOperationModeChange?.(barrier.id, mode);
	};

	return (
		<div className="p-2 bg-white neu-flat rounded-xl">
			{/* 차단기 이름 */}
			<div className="mb-1">
				<h3 className="text-xs font-medium text-center text-gray-800 truncate px-1">
					{barrier.name}
				</h3>
			</div>

			{/* 3D 차단기 - 모든 컨트롤 표시 */}
			<div>
				<BarrierDiagonalView
					width={120}
					height={160}
					isOpen={barrier.isOpen}
					onToggle={handleBarrierToggle}
					showControls={true}
					animationDuration={1000}
					operationMode={barrier.operationMode}
					onOperationModeChange={handleOperationModeChange}
					showTitle={false}
				/>
			</div>
		</div>
	);
};

export default ParkingBarrierCard;
