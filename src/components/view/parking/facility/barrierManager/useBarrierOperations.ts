import { useState, useCallback } from 'react';
import { ParkingBarrier, OperationMode } from '@/types/parking';

// #region 차단기 조작 훅
export const useBarrierOperations = (
	initialBarriers: ParkingBarrier[],
	onBarrierOpen: (barrierId: string) => void,
	onBarrierClose: (barrierId: string) => void,
	onOperationModeChange: (barrierId: string, mode: OperationMode) => void,
	onPolicyUpdate?: (
		barrierId: string,
		policies: Record<string, boolean>
	) => void
) => {
	const [localBarriers, setLocalBarriers] =
		useState<ParkingBarrier[]>(initialBarriers);

	// 차단기 열기
	const handleBarrierOpen = useCallback(
		(barrierId: string) => {
			setLocalBarriers((prev) =>
				prev.map((barrier) =>
					barrier.id === barrierId ? { ...barrier, isOpen: true } : barrier
				)
			);
			onBarrierOpen(barrierId);
		},
		[onBarrierOpen]
	);

	// 차단기 닫기
	const handleBarrierClose = useCallback(
		(barrierId: string) => {
			setLocalBarriers((prev) =>
				prev.map((barrier) =>
					barrier.id === barrierId ? { ...barrier, isOpen: false } : barrier
				)
			);
			onBarrierClose(barrierId);
		},
		[onBarrierClose]
	);

	// 차단기 토글
	const handleBarrierToggle = useCallback(
		(barrierId: string) => {
			const barrier = localBarriers.find((b) => b.id === barrierId);
			if (!barrier) return;

			if (barrier.isOpen) {
				handleBarrierClose(barrierId);
			} else {
				handleBarrierOpen(barrierId);
			}
		},
		[localBarriers, handleBarrierOpen, handleBarrierClose]
	);

	// 운영 모드 변경
	const handleOperationModeChange = useCallback(
		(barrierId: string, mode: OperationMode) => {
			setLocalBarriers((prev) =>
				prev.map((barrier) =>
					barrier.id === barrierId
						? { ...barrier, operationMode: mode }
						: barrier
				)
			);
			onOperationModeChange(barrierId, mode);
		},
		[onOperationModeChange]
	);

	// 정책 업데이트
	const handlePolicyUpdate = useCallback(
		(barrierId: string, policies: Record<string, boolean>) => {
			// 실제 구현에서는 차단기 객체에 정책 정보를 저장해야 함
			// 현재는 콜백만 호출
			if (onPolicyUpdate) {
				onPolicyUpdate(barrierId, policies);
			}
		},
		[onPolicyUpdate]
	);

	// 배치 작업 - 모든 차단기 열기
	const openAllBarriers = useCallback(() => {
		localBarriers.forEach((barrier) => {
			if (!barrier.isOpen) {
				handleBarrierOpen(barrier.id);
			}
		});
	}, [localBarriers, handleBarrierOpen]);

	// 배치 작업 - 모든 차단기 닫기
	const closeAllBarriers = useCallback(() => {
		localBarriers.forEach((barrier) => {
			if (barrier.isOpen) {
				handleBarrierClose(barrier.id);
			}
		});
	}, [localBarriers, handleBarrierClose]);

	// 배치 작업 - 운영 모드 일괄 변경
	const setAllOperationMode = useCallback(
		(mode: OperationMode) => {
			localBarriers.forEach((barrier) => {
				if (barrier.operationMode !== mode) {
					handleOperationModeChange(barrier.id, mode);
				}
			});
		},
		[localBarriers, handleOperationModeChange]
	);

	// 특정 차단기 찾기
	const findBarrier = useCallback(
		(barrierId: string) => {
			return localBarriers.find((barrier) => barrier.id === barrierId);
		},
		[localBarriers]
	);

	return {
		barriers: localBarriers,
		handleBarrierOpen,
		handleBarrierClose,
		handleBarrierToggle,
		handleOperationModeChange,
		handlePolicyUpdate,
		openAllBarriers,
		closeAllBarriers,
		setAllOperationMode,
		findBarrier,
	};
};
// #endregion
