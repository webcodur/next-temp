import React from 'react';
import ParkingBarrier3D from '@/components/ui/ui-3d/barrier/Barrier3d';
import { OperationMode } from '@/components/ui/ui-3d/barrier/constants';

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
	width = 280,
	height = 320,
	isOpen = false,
	onToggle,
	showControls = true,
	animationDuration = 300,
	operationMode = 'auto-operation',
	onOperationModeChange,
	showTitle = true,
}) => {
	return (
		<div className="flex flex-col gap-1 items-center">
			{showTitle && (
				<div className="mb-1 text-center">
					<h3 className="text-sm font-semibold text-foreground">
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
