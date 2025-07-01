import React from 'react';
import ParkingBarrier3D from '@/components/ui/barrier/Barrier3d';
import { OperationMode } from '@/components/ui/barrier/constants';

interface BarrierSecurityViewProps {
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

const BarrierSecurityView: React.FC<BarrierSecurityViewProps> = ({
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
					<h3 className="text-base font-semibold text-foreground">
						보안카메라 시점
					</h3>
					<p className="text-xs text-muted-foreground">모니터링 최적화 각도</p>
				</div>
			)}

			<ParkingBarrier3D
				width={width}
				height={height}
				isOpen={isOpen}
				onToggle={onToggle}
				showControls={showControls}
				viewAngle="security"
				animationDuration={animationDuration}
				operationMode={operationMode}
				onOperationModeChange={onOperationModeChange}
			/>
		</div>
	);
};

export default BarrierSecurityView;
