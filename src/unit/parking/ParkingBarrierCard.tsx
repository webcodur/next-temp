import React from 'react';
import ParkingBarrier3D from '@/components/ui/barrier/Barrier3d';
import { ParkingBarrier } from '@/types/parking';

interface ParkingBarrierCardProps {
	barrier: ParkingBarrier;
	onToggleOpen?: (barrierId: string) => void;
	onToggleClose?: (barrierId: string) => void;
	onToggleAlwaysOpen?: (barrierId: string) => void;
	onToggleAutoMode?: (barrierId: string) => void;
	onToggleBypass?: (barrierId: string) => void;
}

const ParkingBarrierCard: React.FC<ParkingBarrierCardProps> = ({
	barrier,
	onToggleOpen,
	onToggleClose,
	onToggleAlwaysOpen,
	onToggleAutoMode,
	onToggleBypass,
}) => {
	const handleBarrierToggle = () => {
		// 애니메이션 완료 후 상태 변경
		setTimeout(() => {
			if (barrier.isOpen) {
				onToggleClose?.(barrier.id);
			} else {
				onToggleOpen?.(barrier.id);
			}
		}, 1000); // 애니메이션 지속시간과 동일
	};

	const handleBarrierOpen = () => {
		if (barrier.isOpen) return;
		handleBarrierToggle();
	};

	const handleBarrierClose = () => {
		if (!barrier.isOpen) return;
		handleBarrierToggle();
	};

	return (
		<div className="p-3 bg-white neu-flat rounded-2xl">
			{/* 차단기 이름 */}
			<div className="mb-2">
				<h3 className="text-sm font-semibold text-center text-gray-800">
					{barrier.name}
				</h3>
			</div>

			{/* 3D 차단기 - 세로로 길게 */}
			<div className="mb-3">
				<ParkingBarrier3D
					width={180}
					height={240}
					isOpen={barrier.isOpen}
					onToggle={handleBarrierToggle}
					showControls={false}
					viewAngle="diagonal"
					animationDuration={1000}
				/>
			</div>

			{/* 제어 옵션들 */}
			<div className="space-y-2">
				{/* 옵션 체크박스들 */}
				<div className="grid grid-cols-1 gap-1.5">
					{/* 항시열림 */}
					<label className="flex items-center justify-between p-1.5 neu-inset rounded-lg cursor-pointer">
						<span className="text-xs font-medium text-gray-700">항시열림</span>
						<input
							type="checkbox"
							checked={barrier.alwaysOpen}
							onChange={() => onToggleAlwaysOpen?.(barrier.id)}
							className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						/>
					</label>

					{/* 자동운행 */}
					<label className="flex items-center justify-between p-1.5 neu-inset rounded-lg cursor-pointer">
						<span className="text-xs font-medium text-gray-700">자동운행</span>
						<input
							type="checkbox"
							checked={barrier.autoMode}
							onChange={() => onToggleAutoMode?.(barrier.id)}
							className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						/>
					</label>

					{/* 바이패스 */}
					<label className="flex items-center justify-between p-1.5 neu-inset rounded-lg cursor-pointer">
						<span className="text-xs font-medium text-gray-700">바이패스</span>
						<input
							type="checkbox"
							checked={barrier.bypass}
							onChange={() => onToggleBypass?.(barrier.id)}
							className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
						/>
					</label>
				</div>

				{/* 열기/닫기 아이콘 버튼들 */}
				<div className="grid grid-cols-2 gap-1.5">
					<button
						onClick={handleBarrierOpen}
						disabled={barrier.isOpen}
						className={`p-2 rounded-lg transition-all neu-raised flex items-center justify-center ${
							barrier.isOpen
								? 'bg-gray-300 text-gray-500 cursor-not-allowed'
								: 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white shadow-green-200'
						}`}>
						{/* 위쪽 화살표 아이콘 */}
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 11l5-5m0 0l5 5m-5-5v12"
							/>
						</svg>
					</button>
					<button
						onClick={handleBarrierClose}
						disabled={!barrier.isOpen}
						className={`p-2 rounded-lg transition-all neu-raised flex items-center justify-center ${
							!barrier.isOpen
								? 'bg-gray-300 text-gray-500 cursor-not-allowed'
								: 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white shadow-red-200'
						}`}>
						{/* 아래쪽 화살표 아이콘 */}
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17 13l-5 5m0 0l-5-5m5 5V6"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
};

export default ParkingBarrierCard;
