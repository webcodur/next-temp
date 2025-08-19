/* 
  파일명: /hooks/domain/useAccessControl.ts
  기능: 출입제어 시스템 통합 상태 관리 훅
  책임: 전역 정책, 개별 차단기 상태, 정책 동기화 로직을 관리한다.
*/

import { useState, useEffect } from 'react';
import { ParkingBarrier, OperationMode } from '@/types/parking';
import { mockBarriers } from '@/data/mockParkingData';

// #region 타입 정의
interface UseAccessControlProps {
	onBarrierOpen?: (barrierId: string) => void;
	onBarrierClose?: (barrierId: string) => void;
	onOperationModeChange?: (barrierId: string, mode: OperationMode) => void;
}

interface UseAccessControlReturn {
	// 상태
	barriers: ParkingBarrier[];
	barrierOrder: string[];
	isLocked: boolean;

	// 핸들러
	handleBarrierToggle: (barrierId: string) => void;
	handleOperationModeChange: (barrierId: string, mode: OperationMode) => void;
	handleBarrierOrderChange: (newOrder: string[]) => void;
	handleLockToggle: () => void;
	handleSaveChanges: () => void;
}
// #endregion



// #region 메인 훅
export const useAccessControl = ({
	onBarrierOpen,
	onBarrierClose,
	onOperationModeChange,
}: UseAccessControlProps = {}): UseAccessControlReturn => {
	// #region 상태
	const [barriers, setBarriers] = useState<ParkingBarrier[]>(mockBarriers);
	const [barrierOrder, setBarrierOrder] = useState<string[]>(() =>
		mockBarriers.map((barrier) => barrier.id)
	);
	const [isLocked, setIsLocked] = useState<boolean>(true);
	// #endregion

	// #region 이펙트
	// 차단기 목록이 변경될 때 순서 업데이트
	useEffect(() => {
		const newBarrierIds = barriers.map((barrier) => barrier.id);

		// 차단기 순서 업데이트
		setBarrierOrder((prev) => {
			const existingIds = prev.filter((id) => newBarrierIds.includes(id));
			const newIds = newBarrierIds.filter((id) => !prev.includes(id));
			return [...existingIds, ...newIds];
		});
	}, [barriers]);
	// #endregion

	// #region 핸들러
	const handleBarrierToggle = (barrierId: string) => {
		const barrier = barriers.find((b) => b.id === barrierId);
		if (!barrier) return;

		setBarriers((prev) =>
			prev.map((b) => (b.id === barrierId ? { ...b, isOpen: !b.isOpen } : b))
		);

		// 외부 콜백 호출
		if (barrier.isOpen) {
			onBarrierClose?.(barrierId);
		} else {
			onBarrierOpen?.(barrierId);
		}
	};

	const handleOperationModeChange = (
		barrierId: string,
		mode: OperationMode
	) => {
		setBarriers((prev) =>
			prev.map((b) => (b.id === barrierId ? { ...b, operationMode: mode } : b))
		);

		// 외부 콜백 호출
		onOperationModeChange?.(barrierId, mode);
	};

	const handleBarrierOrderChange = (newOrder: string[]) => {
		setBarrierOrder(newOrder);
	};

	const handleLockToggle = () => {
		setIsLocked((prev) => !prev);
	};

	const handleSaveChanges = () => {
		// 변경사항 저장 로직
		console.log('변경사항 저장:', {
			barriers,
			barrierOrder,
		});

		// 편집모드 종료 -> 잠금상태로 변경
		setIsLocked(true);
	};
	// #endregion

	// #region 반환
	return {
		// 상태
		barriers,
		barrierOrder,
		isLocked,

		// 핸들러
		handleBarrierToggle,
		handleOperationModeChange,
		handleBarrierOrderChange,
		handleLockToggle,
		handleSaveChanges,
	};
	// #endregion
};
