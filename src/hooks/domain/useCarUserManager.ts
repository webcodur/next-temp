/* 
  파일명: /hooks/domain/useCarUserManager.ts
  기능: 차량-사용자 연결 및 관리 로직을 담당하는 커스텀 훅
  책임: 주민 관리 모드, 차량-사용자 연결/해제, 소유자/알람 설정을 관리한다.
*/ // ------------------------------

import { useState, useCallback } from 'react';
import { getCarUsers } from '@/services/cars/cars@carId_users_GET';
import { createCarInstanceUser } from '@/services/cars/cars_users_POST';
import { deleteCarInstanceUser } from '@/services/cars/cars_users@id_DELETE';
import { updateCarInstanceUser } from '@/services/cars/cars_users@id_PATCH';
import type { CarUserWithDetails } from '@/types/car';
import type { CarInstanceWithCar } from '@/types/instance';

export function useCarUserManager() {
	// #region 상태
	const [userManagementMode, setUserManagementMode] = useState(false);
	const [selectedCarInstanceId, setSelectedCarInstanceId] = useState<
		number | null
	>(null);
	const [carUsers, setCarUsers] = useState<CarUserWithDetails[]>(
		[]
	);
	const [loadingCarUsers, setLoadingCarUsers] = useState(false);
	// #endregion

	// #region 차량-사용자 데이터 로딩 (최적화: 단일 API 호출)
	const loadCarUsersWithDetails = useCallback(
		async (
			carId: number,
			instanceId?: number
		): Promise<CarUserWithDetails[]> => {
			try {
				// 한 번의 호출로 모든 정보 조회 (알람/소유자 설정 포함)

				const result = await getCarUsers(carId, instanceId || 0);

				if (!result.success || !result.data) {
					return [];
				}

				// 서버에서 이미 instanceId로 필터링된 데이터 반환
				return result.data;
			} catch (error) {
				console.error('차량-사용자 데이터 로딩 중 오류:', error);
				return [];
			}
		},
		[]
	);
	// #endregion

	// #region 관리 모드 제어
	const handleManageUsers = useCallback(
		async (
			carInstanceId: number,
			carInstances: CarInstanceWithCar[],
			onLoad: () => Promise<CarUserWithDetails[]>
		) => {
			// 이미 같은 차량의 관리 모드가 활성화된 경우 종료
			if (userManagementMode && selectedCarInstanceId === carInstanceId) {
				setUserManagementMode(false);
				setSelectedCarInstanceId(null);
				setCarUsers([]);
				return;
			}

			setSelectedCarInstanceId(carInstanceId);
			setUserManagementMode(true);

			// 해당 차량에 연결된 사용자들을 가져오기
			setLoadingCarUsers(true);
			try {
				const detailedUsers = await onLoad();
				setCarUsers(detailedUsers);
			} catch (error) {
				console.error('차량 사용자 조회 중 오류:', error);
			} finally {
				setLoadingCarUsers(false);
			}
		},
		[userManagementMode, selectedCarInstanceId]
	);

	const closeUserManagement = useCallback(() => {
		setUserManagementMode(false);
		setSelectedCarInstanceId(null);
		setCarUsers([]);
	}, []);
	// #endregion

	// #region 사용자 연결 관리
	const connectUser = useCallback(
		async (carInstanceId: number, userId: number) => {
			const requestData = {
				carInstanceId,
				userId,
				carAlarm: false, // 기본값
				isPrimary: false, // 기본값
			};

			const result = await createCarInstanceUser(requestData);

			return result;
		},
		[]
	);

	const disconnectUser = useCallback(
		async (userId: number) => {
			// 1단계: 로컬 상태에서 먼저 찾기
			const carUser = carUsers.find((cu) => cu.id === userId);

			// 2단계: 로컬에 없으면 에러 반환 (사용자가 새로고침하도록 유도)
			if (!carUser && selectedCarInstanceId) {
				console.warn(
					'로컬 상태에서 사용자 연결 정보를 찾을 수 없어 재시도 필요...'
				);
				return {
					success: false,
					errorMsg:
						'사용자 연결 정보를 찾을 수 없습니다. 페이지를 새로고침 후 다시 시도해주세요.',
				};
			}

			if (!carUser) {
				throw new Error('해당 사용자의 연결 정보를 찾을 수 없습니다.');
			}

			const result = await deleteCarInstanceUser(
				carUser.carInstanceUserId
			);

			// 성공 시 로컬 상태에서 즉시 제거 (낙관적 UI)
			if (result.success) {
				setCarUsers((prevCarUsers) =>
					prevCarUsers.filter((cu) => cu.id !== userId)
				);
			}

			return result;
		},
		[carUsers, selectedCarInstanceId]
	);
	// #endregion

	// #region 소유자/알람 설정 관리
	const performPrimaryCarToggle = useCallback(
		async (
			userId: number,
			carUser: CarUserWithDetails,
			newPrimaryState: boolean
		) => {
			// 차량 소유자를 활성화하려는 경우, 먼저 기존 소유자들을 비활성화
			if (newPrimaryState) {
				const currentPrimaryUsers = carUsers.filter(
					(cu) => cu.id !== userId && Boolean(cu.isPrimary)
				);

				// 기존 소유자들을 순차적으로 비활성화
				for (const primaryUser of currentPrimaryUsers) {
					await updateCarInstanceUser(
						primaryUser.carInstanceUserId,
						{
							carAlarm: primaryUser.carAlarm || false,
							isPrimary: false,
						}
					);
				}
			}

			// 대상 사용자의 소유자 상태 변경
			const updateResult = await updateCarInstanceUser(
				carUser.carInstanceUserId,
				{
					carAlarm: carUser.carAlarm || false,
					isPrimary: newPrimaryState,
				}
			);

			if (updateResult.success && updateResult.data) {
				// 로컬 상태 업데이트 - 모든 사용자의 isPrimary를 재설정
				const updatedCarUsers = carUsers.map((cu) => ({
					...cu,
					isPrimary: cu.id === userId ? newPrimaryState : false,
					carAlarm:
						cu.id === userId ? updateResult.data.carAlarm : cu.carAlarm,
				}));
				setCarUsers(updatedCarUsers);
			}

			return updateResult;
		},
		[carUsers]
	);

	const confirmPrimaryCarTransfer = useCallback(
		async (
			currentPrimaryUser: CarUserWithDetails,
			newPrimaryUserId: number
		) => {
			const newPrimaryUser = carUsers.find(
				(cu) => cu.id === newPrimaryUserId
			);
			if (!newPrimaryUser) {
				throw new Error('새로운 차량 소유자 사용자 정보를 찾을 수 없습니다.');
			}

			// 중복 차량 소유자 검증 - 다른 사용자가 이미 차량 소유자인지 확인
			const otherPrimaryUsers = carUsers.filter(
				(cu) =>
					cu.id !== currentPrimaryUser.id &&
					cu.id !== newPrimaryUserId &&
					Boolean(cu.isPrimary)
			);

			if (otherPrimaryUsers.length > 0) {
				console.warn('추가 차량 소유자 감지됨:', otherPrimaryUsers);
			}

			try {
				// 1단계: 모든 기존 차량 소유자들을 비활성화
				const allPrimaryUsers = carUsers.filter((cu) =>
					Boolean(cu.isPrimary)
				);

				for (const primaryUser of allPrimaryUsers) {
					const deactivateResult = await updateCarInstanceUser(
						primaryUser.carInstanceUserId,
						{
							carAlarm: primaryUser.carAlarm || false,
							isPrimary: false,
						}
					);

					if (!deactivateResult.success) {
						throw new Error(
							`기존 차량 소유자(${primaryUser.name}) 해제에 실패했습니다: ${deactivateResult.errorMsg}`
						);
					}
				}

				// 2단계: 새로운 차량 소유자 사용자 활성화
				const activateResult = await updateCarInstanceUser(
					newPrimaryUser.carInstanceUserId,
					{
						carAlarm: newPrimaryUser.carAlarm || false,
						isPrimary: true,
					}
				);

				if (!activateResult.success) {
					throw new Error(
						`새로운 차량 소유자 설정에 실패했습니다: ${activateResult.errorMsg}`
					);
				}

				// 로컬 상태 업데이트 - 모든 사용자의 isPrimary를 false로 설정 후 새 소유자만 true
				const updatedCarUsers = carUsers.map((cu) => ({
					...cu,
					isPrimary: cu.id === newPrimaryUserId,
				}));
				setCarUsers(updatedCarUsers);

				return {
					success: true,
					newPrimaryUserName: newPrimaryUser.name,
				};
			} catch (error) {
				console.error('차량 소유자 전환 중 오류:', error);
				throw error;
			}
		},
		[carUsers]
	);

	const togglePrimary = useCallback(
		async (userId: number) => {
			const carUser = carUsers.find((cu) => cu.id === userId);

			if (!carUser) {
				throw new Error('해당 사용자의 연결 정보를 찾을 수 없습니다.');
			}

			const currentPrimaryState = Boolean(carUser.isPrimary);
			const newPrimaryState = !currentPrimaryState;

			// 차량 소유자 활성화를 시도하는 경우, 기존 차량 소유자가 있는지 확인
			if (newPrimaryState) {
				const existingPrimaryUser = carUsers.find(
					(cu) => cu.id !== userId && Boolean(cu.isPrimary)
				);

				if (existingPrimaryUser) {
					// 기존 차량 소유자가 있으면 자동으로 전환 수행
					try {
						const transferResult = await confirmPrimaryCarTransfer(
							existingPrimaryUser,
							userId
						);
						return {
							success: transferResult.success,
							needsTransfer: false,
							errorMsg: transferResult.success
								? undefined
								: '차량 소유자 전환에 실패했습니다.',
						};
					} catch (error) {
						console.error('차량 소유자 자동 전환 중 오류:', error);
						return {
							success: false,
							needsTransfer: false,
							errorMsg: '차량 소유자 전환 중 오류가 발생했습니다.',
						};
					}
				}
			}

			// 기존 차량 소유자가 없거나 비활성화하는 경우 바로 진행
			const result = await performPrimaryCarToggle(
				userId,
				carUser,
				newPrimaryState
			);
			return { ...result, needsTransfer: false };
		},
		[carUsers, performPrimaryCarToggle, confirmPrimaryCarTransfer]
	);

	const toggleAlarm = useCallback(
		async (userId: number) => {
			const carUser = carUsers.find((cu) => cu.id === userId);

			if (!carUser) {
				throw new Error('해당 사용자의 연결 정보를 찾을 수 없습니다.');
			}

			// 현재 상태와 새로운 상태 계산
			const currentAlarmState = Boolean(carUser.carAlarm);
			const newAlarmState = !currentAlarmState;

			// 알람 설정 토글
			const updateResult = await updateCarInstanceUser(
				carUser.carInstanceUserId,
				{
					carAlarm: newAlarmState,
					isPrimary: carUser.isPrimary || false, // 기존 차량 소유자 설정 유지
				}
			);

			if (updateResult.success && updateResult.data) {
				// 즉시 로컬 상태 업데이트 (낙관적 UI)
				const updatedCarUsers = carUsers.map((cu) => {
					if (cu.id === userId) {
						return {
							...cu,
							isPrimary: updateResult.data.isPrimary,
							carAlarm: updateResult.data.carAlarm,
						};
					}
					return cu;
				});
				setCarUsers(updatedCarUsers);
			}

			return updateResult;
		},
		[carUsers]
	);

	// 차량-사용자 데이터 새로고침
	const refreshCarUsers = useCallback(
		async (onLoad: () => Promise<CarUserWithDetails[]>) => {
			if (!userManagementMode || !selectedCarInstanceId) return;

			try {
				const detailedUsers = await onLoad();
				setCarUsers(detailedUsers);
			} catch (error) {
				console.error('차량-사용자 데이터 새로고침 중 오류:', error);
			}
		},
		[userManagementMode, selectedCarInstanceId]
	);
	// #endregion

	return {
		// 상태
		userManagementMode,
		selectedCarInstanceId,
		carUsers,
		loadingCarUsers,

		// 데이터 로딩
		loadCarUsersWithDetails,
		refreshCarUsers,

		// 관리 모드
		handleManageUsers,
		closeUserManagement,

		// 사용자 연결
		connectUser,
		disconnectUser,

		// 소유자/알람 설정
		performPrimaryCarToggle,
		togglePrimary,
		confirmPrimaryCarTransfer,
		toggleAlarm,
	};
}