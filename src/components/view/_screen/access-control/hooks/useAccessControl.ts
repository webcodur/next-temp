/* 
  파일명: useAccessControl.ts
  기능: 출입제어 시스템 통합 상태 관리 훅
  책임: 전역 정책, 개별 차단기 상태, 정책 동기화 로직을 관리한다.
*/

import { useState, useEffect } from 'react';
import { ParkingBarrier, OperationMode } from '@/types/parking';

// #region 타입 정의
export type EntryPolicyType = 'all' | 'office';

interface BarrierPolicy {
	workHour: boolean;
	blacklist: boolean;
}

interface UseAccessControlProps {
	initialBarriers: ParkingBarrier[];
	onBarrierOpen?: (barrierId: string) => void;
	onBarrierClose?: (barrierId: string) => void;
	onOperationModeChange?: (barrierId: string, mode: OperationMode) => void;
}

interface UseAccessControlReturn {
	// 상태
	barriers: ParkingBarrier[];
	barrierPolicies: Record<string, BarrierPolicy>;
	barrierOrder: string[];
	entryPolicy: EntryPolicyType;
	returnHourEnabled: boolean;
	warningCount: number;
	isLocked: boolean;

	// 핸들러
	handleBarrierToggle: (barrierId: string) => void;
	handleOperationModeChange: (barrierId: string, mode: OperationMode) => void;
	handlePolicyUpdate: (barrierId: string, policy: BarrierPolicy) => void;
	handleBarrierOrderChange: (newOrder: string[]) => void;
	handleEntryPolicyChange: (policy: EntryPolicyType) => void;
	handleReturnHourEnabledChange: (enabled: boolean) => void;
	handleWarningCountChange: (count: number) => void;
	handleLockToggle: () => void;
	handleSaveChanges: () => void;
}
// #endregion

// #region 유틸리티 함수
const createInitialBarrierPolicies = (barriers: ParkingBarrier[]) => {
	const policies: Record<string, BarrierPolicy> = {};
	barriers.forEach((barrier) => {
		policies[barrier.id] = { workHour: false, blacklist: false };
	});
	return policies;
};
// #endregion

// #region 메인 훅
export const useAccessControl = ({
	initialBarriers,
	onBarrierOpen,
	onBarrierClose,
	onOperationModeChange,
}: UseAccessControlProps): UseAccessControlReturn => {
	// #region 상태
	const [barriers, setBarriers] = useState<ParkingBarrier[]>(initialBarriers);
	const [barrierPolicies, setBarrierPolicies] = useState<
		Record<string, BarrierPolicy>
	>(() => createInitialBarrierPolicies(initialBarriers));
	const [barrierOrder, setBarrierOrder] = useState<string[]>(() =>
		initialBarriers.map((barrier) => barrier.id)
	);
	const [entryPolicy, setEntryPolicy] = useState<EntryPolicyType>('office');
	const [returnHourEnabled, setReturnHourEnabled] = useState<boolean>(false);
	const [warningCount, setWarningCount] = useState<number>(2);
	const [isLocked, setIsLocked] = useState<boolean>(true);
	// #endregion

	// #region 이펙트
	// 차단기 목록이 변경될 때 정책과 순서 업데이트
	useEffect(() => {
		const newBarrierIds = barriers.map((barrier) => barrier.id);

		// 새로운 차단기에 대한 기본 정책 추가
		setBarrierPolicies((prev) => {
			const updated = { ...prev };
			newBarrierIds.forEach((id) => {
				if (!updated[id]) {
					updated[id] = { workHour: false, blacklist: false };
				}
			});
			// 제거된 차단기 정책은 삭제
			Object.keys(updated).forEach((id) => {
				if (!newBarrierIds.includes(id)) {
					delete updated[id];
				}
			});
			return updated;
		});

		// 차단기 순서 업데이트
		setBarrierOrder((prev) => {
			const existingIds = prev.filter((id) => newBarrierIds.includes(id));
			const newIds = newBarrierIds.filter((id) => !prev.includes(id));
			return [...existingIds, ...newIds];
		});
	}, [barriers]);

	// 회차시간 전역 설정 변경 시 모든 차단기 정책 동기화
	useEffect(() => {
		if (!returnHourEnabled) {
			setBarrierPolicies((prev) => {
				const updated = { ...prev };
				Object.keys(updated).forEach((barrierId) => {
					updated[barrierId] = { ...updated[barrierId], workHour: false };
				});
				return updated;
			});
		}
	}, [returnHourEnabled]);
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

	const handlePolicyUpdate = (barrierId: string, policy: BarrierPolicy) => {
		setBarrierPolicies((prev) => ({
			...prev,
			[barrierId]: policy,
		}));
	};

	const handleBarrierOrderChange = (newOrder: string[]) => {
		setBarrierOrder(newOrder);
	};

	const handleEntryPolicyChange = (policy: EntryPolicyType) => {
		setEntryPolicy(policy);
	};

	const handleReturnHourEnabledChange = (enabled: boolean) => {
		setReturnHourEnabled(enabled);
	};

	const handleWarningCountChange = (count: number) => {
		setWarningCount(Math.max(1, count)); // 최소 1 이상
	};

	const handleLockToggle = () => {
		setIsLocked((prev) => !prev);
	};

	const handleSaveChanges = () => {
		// 변경사항 저장 로직
		console.log('변경사항 저장:', {
			barriers,
			barrierPolicies,
			barrierOrder,
			entryPolicy,
			returnHourEnabled,
			warningCount,
		});

		// 편집모드 종료 -> 잠금상태로 변경
		setIsLocked(true);
	};
	// #endregion

	// #region 반환
	return {
		// 상태
		barriers,
		barrierPolicies,
		barrierOrder,
		entryPolicy,
		returnHourEnabled,
		warningCount,
		isLocked,

		// 핸들러
		handleBarrierToggle,
		handleOperationModeChange,
		handlePolicyUpdate,
		handleBarrierOrderChange,
		handleEntryPolicyChange,
		handleReturnHourEnabledChange,
		handleWarningCountChange,
		handleLockToggle,
		handleSaveChanges,
	};
	// #endregion
};
