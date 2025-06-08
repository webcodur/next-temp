import React from 'react';
import ParkingBarrier3D from '@/components/ui/barrier/Barrier3d';
import { OperationMode } from '@/components/ui/barrier/constants';

interface BarrierDiagonalViewProps {
	width?: number;
	height?: number;
	isOpen?: boolean;
	onToggle?: () => void;
	showControls?: boolean;
	animationDuration?: number;
	operationMode?: OperationMode;
	onOperationModeChange?: (mode: OperationMode) => void;
	showTitle?: boolean;
}

const BarrierDiagonalView: React.FC<BarrierDiagonalViewProps> = ({
	width = 220,
	height = 264,
	isOpen = false,
	onToggle,
	showControls = true,
	animationDuration = 300,
	operationMode = 'auto-operation',
	onOperationModeChange,
	showTitle = true,
}) => {
	return (
		<div className="flex flex-col items-center gap-2">
			{showTitle && (
				<div className="text-center">
					<h3 className="text-base font-semibold text-gray-800">대각선 시점</h3>
					<p className="text-xs text-gray-600">입체감이 가장 좋은 기본 시점</p>
				</div>
			)}

			<ParkingBarrier3D
				width={width}
				height={height}
				isOpen={isOpen}
				onToggle={onToggle}
				showControls={showControls}
				viewAngle="diagonal"
				animationDuration={animationDuration}
				operationMode={operationMode}
				onOperationModeChange={onOperationModeChange}
			/>
		</div>
	);
};

export default BarrierDiagonalView;
