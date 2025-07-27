/* 
  파일명: /unit/barrier/BarrierDiagonalView.tsx
  기능: 차단기의 대각선 시점 3D 뷰 컴포넌트
  책임: 대각선 시점에서 차단기를 3D로 표시하고 제어 기능을 제공한다.
*/

import React from 'react';

import ParkingBarrier3D from '@/components/ui/ui-3d/barrier/Barrier3d';

import type { OperationMode } from '@/components/ui/ui-3d/barrier/constants';

// #region 타입
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
// #endregion

// #region 렌더링
const BarrierDiagonalView: React.FC<BarrierDiagonalViewProps> = ({
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
					<h3 className="text-sm font-semibold text-foreground">대각선 시점</h3>
					<p className="text-xs text-muted-foreground">입체감이 가장 좋은 기본 시점</p>
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
// #endregion

export default BarrierDiagonalView;
