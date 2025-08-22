/* 
  파일명: /hooks/domain/useCarResidentManager.ts
  기능: 차량-주민 연결 및 관리 로직을 담당하는 커스텀 훅
  책임: 주민 관리 모드, 차량-주민 연결/해제, 소유자/알람 설정을 관리한다.
*/ // ------------------------------

import { useState, useCallback } from 'react';
import { getCarResidents } from '@/services/cars/cars@carId_residents_GET';
import { createCarInstanceResident } from '@/services/cars/cars_residents_POST';
import { deleteCarInstanceResident } from '@/services/cars/cars_residents@id_DELETE';
import { updateCarInstanceResident } from '@/services/cars/cars_residents@id_PATCH';
import type { CarResidentWithDetails } from '@/types/car';
import type { CarInstanceWithCar } from '@/types/instance';

export function useCarResidentManager() {
	// #region 상태
	const [residentManagementMode, setResidentManagementMode] = useState(false);
	const [selectedCarInstanceId, setSelectedCarInstanceId] = useState<
		number | null
	>(null);
	const [carResidents, setCarResidents] = useState<CarResidentWithDetails[]>(
		[]
	);
	const [loadingCarResidents, setLoadingCarResidents] = useState(false);
	// #endregion

	// #region 차량-주민 데이터 로딩 (최적화: 단일 API 호출)
	const loadCarResidentsWithDetails = useCallback(
		async (
			carId: number,
			instanceId?: number
		): Promise<CarResidentWithDetails[]> => {
			try {
				// 한 번의 호출로 모든 정보 조회 (알람/소유자 설정 포함)

				console.log('점검: instanceId', instanceId);
				console.log('점검: carId', carId);

				const result = await getCarResidents(carId, instanceId || 0);

				console.log('차량-주민 목록 조회 결과:', result);

				if (!result.success || !result.data) {
					return [];
				}

				// 서버에서 이미 instanceId로 필터링된 데이터 반환
				console.log('최종 차량-주민 목록:', result.data);
				return result.data;
			} catch (error) {
				console.error('차량-주민 데이터 로딩 중 오류:', error);
				return [];
			}
		},
		[]
	);
	// #endregion

	// #region 관리 모드 제어
	const handleManageResidents = useCallback(
		async (
			carInstanceId: number,
			carInstances: CarInstanceWithCar[],
			onLoad: () => Promise<CarResidentWithDetails[]>
		) => {
			// 이미 같은 차량의 관리 모드가 활성화된 경우 종료
			if (residentManagementMode && selectedCarInstanceId === carInstanceId) {
				setResidentManagementMode(false);
				setSelectedCarInstanceId(null);
				setCarResidents([]);
				return;
			}

			setSelectedCarInstanceId(carInstanceId);
			setResidentManagementMode(true);

			// 해당 차량에 연결된 주민들을 가져오기
			setLoadingCarResidents(true);
			try {
				const detailedResidents = await onLoad();
				setCarResidents(detailedResidents);
			} catch (error) {
				console.error('차량 주민 조회 중 오류:', error);
			} finally {
				setLoadingCarResidents(false);
			}
		},
		[residentManagementMode, selectedCarInstanceId]
	);

	const closeResidentManagement = useCallback(() => {
		setResidentManagementMode(false);
		setSelectedCarInstanceId(null);
		setCarResidents([]);
	}, []);
	// #endregion

	// #region 주민 연결 관리
	const connectResident = useCallback(
		async (carInstanceId: number, residentId: number) => {
			const requestData = {
				carInstanceId,
				residentId,
				carAlarm: false, // 기본값
				isPrimary: false, // 기본값
			};

			console.log('차량-주민 연결 요청 데이터:', requestData);

			const result = await createCarInstanceResident(requestData);

			console.log('차량-주민 연결 응답 결과:', result);

			return result;
		},
		[]
	);

	const disconnectResident = useCallback(
		async (residentId: number) => {
			// 1단계: 로컬 상태에서 먼저 찾기
			const carResident = carResidents.find((cr) => cr.id === residentId);

			// 2단계: 로컬에 없으면 에러 반환 (사용자가 새로고침하도록 유도)
			if (!carResident && selectedCarInstanceId) {
				console.warn(
					'로컬 상태에서 주민 연결 정보를 찾을 수 없어 재시도 필요...'
				);
				return {
					success: false,
					errorMsg:
						'주민 연결 정보를 찾을 수 없습니다. 페이지를 새로고침 후 다시 시도해주세요.',
				};
			}

			if (!carResident) {
				throw new Error('해당 주민의 연결 정보를 찾을 수 없습니다.');
			}

			const result = await deleteCarInstanceResident(
				carResident.carInstanceResidentId
			);

			// 성공 시 로컬 상태에서 즉시 제거 (낙관적 UI)
			if (result.success) {
				setCarResidents((prevCarResidents) =>
					prevCarResidents.filter((cr) => cr.id !== residentId)
				);
			}

			return result;
		},
		[carResidents, selectedCarInstanceId]
	);
	// #endregion

	// #region 소유자/알람 설정 관리
	const performPrimaryCarToggle = useCallback(
		async (
			residentId: number,
			carResident: CarResidentWithDetails,
			newPrimaryState: boolean
		) => {
			// 차량 소유자를 활성화하려는 경우, 먼저 기존 소유자들을 비활성화
			if (newPrimaryState) {
				const currentPrimaryResidents = carResidents.filter(
					(cr) => cr.id !== residentId && Boolean(cr.isPrimary)
				);

				// 기존 소유자들을 순차적으로 비활성화
				for (const primaryResident of currentPrimaryResidents) {
					await updateCarInstanceResident(
						primaryResident.carInstanceResidentId,
						{
							carAlarm: primaryResident.carAlarm || false,
							isPrimary: false,
						}
					);
				}
			}

			// 대상 주민의 소유자 상태 변경
			const updateResult = await updateCarInstanceResident(
				carResident.carInstanceResidentId,
				{
					carAlarm: carResident.carAlarm || false,
					isPrimary: newPrimaryState,
				}
			);

			if (updateResult.success && updateResult.data) {
				// 로컬 상태 업데이트 - 모든 주민의 isPrimary를 재설정
				const updatedCarResidents = carResidents.map((cr) => ({
					...cr,
					isPrimary: cr.id === residentId ? newPrimaryState : false,
					carAlarm:
						cr.id === residentId ? updateResult.data.carAlarm : cr.carAlarm,
				}));
				setCarResidents(updatedCarResidents);
			}

			return updateResult;
		},
		[carResidents]
	);

	const confirmPrimaryCarTransfer = useCallback(
		async (
			currentPrimaryResident: CarResidentWithDetails,
			newPrimaryResidentId: number
		) => {
			const newPrimaryResident = carResidents.find(
				(cr) => cr.id === newPrimaryResidentId
			);
			if (!newPrimaryResident) {
				throw new Error('새로운 차량 소유자 사용자 정보를 찾을 수 없습니다.');
			}

			// 중복 차량 소유자 검증 - 다른 주민이 이미 차량 소유자인지 확인
			const otherPrimaryResidents = carResidents.filter(
				(cr) =>
					cr.id !== currentPrimaryResident.id &&
					cr.id !== newPrimaryResidentId &&
					Boolean(cr.isPrimary)
			);

			if (otherPrimaryResidents.length > 0) {
				console.warn('추가 차량 소유자 감지됨:', otherPrimaryResidents);
			}

			try {
				// 1단계: 모든 기존 차량 소유자들을 비활성화
				const allPrimaryResidents = carResidents.filter((cr) =>
					Boolean(cr.isPrimary)
				);

				for (const primaryResident of allPrimaryResidents) {
					const deactivateResult = await updateCarInstanceResident(
						primaryResident.carInstanceResidentId,
						{
							carAlarm: primaryResident.carAlarm || false,
							isPrimary: false,
						}
					);

					if (!deactivateResult.success) {
						throw new Error(
							`기존 차량 소유자(${primaryResident.name}) 해제에 실패했습니다: ${deactivateResult.errorMsg}`
						);
					}
				}

				// 2단계: 새로운 차량 소유자 사용자 활성화
				const activateResult = await updateCarInstanceResident(
					newPrimaryResident.carInstanceResidentId,
					{
						carAlarm: newPrimaryResident.carAlarm || false,
						isPrimary: true,
					}
				);

				if (!activateResult.success) {
					throw new Error(
						`새로운 차량 소유자 설정에 실패했습니다: ${activateResult.errorMsg}`
					);
				}

				// 로컬 상태 업데이트 - 모든 주민의 isPrimary를 false로 설정 후 새 소유자만 true
				const updatedCarResidents = carResidents.map((cr) => ({
					...cr,
					isPrimary: cr.id === newPrimaryResidentId,
				}));
				setCarResidents(updatedCarResidents);

				return {
					success: true,
					newPrimaryResidentName: newPrimaryResident.name,
				};
			} catch (error) {
				console.error('차량 소유자 전환 중 오류:', error);
				throw error;
			}
		},
		[carResidents]
	);

	const togglePrimary = useCallback(
		async (residentId: number) => {
			const carResident = carResidents.find((cr) => cr.id === residentId);

			if (!carResident) {
				throw new Error('해당 주민의 연결 정보를 찾을 수 없습니다.');
			}

			const currentPrimaryState = Boolean(carResident.isPrimary);
			const newPrimaryState = !currentPrimaryState;

			// 차량 소유자 활성화를 시도하는 경우, 기존 차량 소유자가 있는지 확인
			if (newPrimaryState) {
				const existingPrimaryResident = carResidents.find(
					(cr) => cr.id !== residentId && Boolean(cr.isPrimary)
				);

				if (existingPrimaryResident) {
					// 기존 차량 소유자가 있으면 자동으로 전환 수행
					try {
						const transferResult = await confirmPrimaryCarTransfer(
							existingPrimaryResident,
							residentId
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
				residentId,
				carResident,
				newPrimaryState
			);
			return { ...result, needsTransfer: false };
		},
		[carResidents, performPrimaryCarToggle, confirmPrimaryCarTransfer]
	);

	const toggleAlarm = useCallback(
		async (residentId: number) => {
			const carResident = carResidents.find((cr) => cr.id === residentId);

			if (!carResident) {
				throw new Error('해당 주민의 연결 정보를 찾을 수 없습니다.');
			}

			// 현재 상태와 새로운 상태 계산
			const currentAlarmState = Boolean(carResident.carAlarm);
			const newAlarmState = !currentAlarmState;

			// 알람 설정 토글
			const updateResult = await updateCarInstanceResident(
				carResident.carInstanceResidentId,
				{
					carAlarm: newAlarmState,
					isPrimary: carResident.isPrimary || false, // 기존 차량 소유자 설정 유지
				}
			);

			if (updateResult.success && updateResult.data) {
				// 즉시 로컬 상태 업데이트 (낙관적 UI)
				const updatedCarResidents = carResidents.map((cr) => {
					if (cr.id === residentId) {
						return {
							...cr,
							isPrimary: updateResult.data.isPrimary,
							carAlarm: updateResult.data.carAlarm,
						};
					}
					return cr;
				});
				setCarResidents(updatedCarResidents);
			}

			return updateResult;
		},
		[carResidents]
	);

	// 차량-주민 데이터 새로고침
	const refreshCarResidents = useCallback(
		async (onLoad: () => Promise<CarResidentWithDetails[]>) => {
			if (!residentManagementMode || !selectedCarInstanceId) return;

			try {
				const detailedResidents = await onLoad();
				setCarResidents(detailedResidents);
			} catch (error) {
				console.error('차량-주민 데이터 새로고침 중 오류:', error);
			}
		},
		[residentManagementMode, selectedCarInstanceId]
	);
	// #endregion

	return {
		// 상태
		residentManagementMode,
		selectedCarInstanceId,
		carResidents,
		loadingCarResidents,

		// 데이터 로딩
		loadCarResidentsWithDetails,
		refreshCarResidents,

		// 관리 모드
		handleManageResidents,
		closeResidentManagement,

		// 주민 연결
		connectResident,
		disconnectResident,

		// 소유자/알람 설정
		performPrimaryCarToggle,
		togglePrimary,
		confirmPrimaryCarTransfer,
		toggleAlarm,
	};
}
