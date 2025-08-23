/* 
  파일명: /hooks/domain/useInstanceData.ts
  기능: 인스턴스 데이터 로딩 및 관리를 담당하는 커스텀 훅
  책임: 인스턴스 정보 조회, 차량-주민 데이터 새로고침을 관리한다.
*/ // ------------------------------

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getInstanceDetail } from '@/services/instances/instances@id_GET';
import type { InstanceDetail } from '@/types/instance';
import type { CarResidentWithDetails } from '@/types/car';
import type { InstanceFormData } from '@/hooks/ui-hooks/useInstanceForm';

export function useInstanceData(
	instanceId: number,
	showErrorModal: (message: string) => void,
	initializeForm: (data: InstanceFormData) => void
) {
	const router = useRouter();

	// ref를 사용하여 항상 최신 함수를 참조
	const showErrorModalRef = useRef(showErrorModal);
	const initializeFormRef = useRef(initializeForm);

	// ref 업데이트
	showErrorModalRef.current = showErrorModal;
	initializeFormRef.current = initializeForm;

	// #region 상태
	const [instance, setInstance] = useState<InstanceDetail | null>(null);
	const [loading, setLoading] = useState(true);
	// #endregion

	// #region 데이터 로드
	const loadInstanceData = useCallback(async () => {
		if (!instanceId || isNaN(instanceId)) {
			return;
		}

		setLoading(true);
		try {
			const result = await getInstanceDetail(instanceId);

			if (result.success && result.data) {
				setInstance(result.data);

				const initialData: InstanceFormData = {
					name: result.data.name,
					ownerName: result.data.ownerName || '',
					address1Depth: result.data.address1Depth,
					address2Depth: result.data.address2Depth,
					address3Depth: result.data.address3Depth || '',
					instanceType: result.data.instanceType,
					password: result.data.password,
					memo: result.data.memo || '',
				};
				initializeFormRef.current(initialData);
			} else {
				console.error('인스턴스 조회 실패:', result.errorMsg);
				showErrorModalRef.current(
					`세대 정보를 불러올 수 없습니다: ${result.errorMsg}`
				);
				setTimeout(() => {
					router.push('/parking/occupancy/instance');
				}, 2000);
			}
		} catch (error) {
			console.error('인스턴스 조회 중 오류:', error);
			showErrorModalRef.current('세대 정보를 불러오는 중 오류가 발생했습니다.');
			setTimeout(() => {
				router.push('/parking/occupancy/instance');
			}, 2000);
		} finally {
			setLoading(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [instanceId]);

	// 차량-주민 데이터 새로고침을 위한 헬퍼 함수
	const createRefreshCarResidentsFunction = useCallback(
		(
			selectedCarInstanceId: number | null,
			refreshCarResidents: (
				loader: () => Promise<CarResidentWithDetails[]>
			) => Promise<void>,
			loadCarResidentsWithDetails: (
				carId: number
			) => Promise<CarResidentWithDetails[]>
		) => {
			return async () => {
				await refreshCarResidents(async () => {
					const currentInstance = await getInstanceDetail(instanceId);
					if (currentInstance.success && currentInstance.data) {
						const carInstance = currentInstance.data.carInstance?.find(
							(ci) => ci.id === selectedCarInstanceId
						);
						if (carInstance && carInstance.car) {
							return await loadCarResidentsWithDetails(carInstance.car.id);
						}
					}
					return [];
				});
			};
		},
		[instanceId]
	);
	// #endregion

	return {
		// 상태
		instance,
		loading,

		// 핸들러
		loadInstanceData,
		createRefreshCarResidentsFunction,
	};
}
