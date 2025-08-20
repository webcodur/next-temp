/* 
  파일명: /hooks/domain/useCarResidentManagement.ts
  기능: 차량-주민 연결 및 관리 로직을 담당하는 커스텀 훅
  책임: 주민 관리 모드, 차량-주민 연결/해제, 소유자/알람 설정을 관리한다.
*/ // ------------------------------

import { useState, useCallback } from 'react';
import { getCarResidents } from '@/services/cars/cars@carId_residents_GET';
import { getCarInstanceResidentDetail } from '@/services/cars/cars_residents@id_GET';
import { createCarInstanceResident } from '@/services/cars/cars_residents_POST';
import { deleteCarInstanceResident } from '@/services/cars/cars_residents@id_DELETE';
import { updateCarInstanceResident } from '@/services/cars/cars_residents@id_PATCH';
import type { CarResidentWithDetails } from '@/types/car';

export function useCarResidentManagement() {
  // #region 상태
  const [residentManagementMode, setResidentManagementMode] = useState(false);
  const [selectedCarInstanceId, setSelectedCarInstanceId] = useState<number | null>(null);
  const [carResidents, setCarResidents] = useState<CarResidentWithDetails[]>([]);
  const [loadingCarResidents, setLoadingCarResidents] = useState(false);
  // #endregion

  // #region 차량-주민 데이터 로딩
  const loadCarResidentsWithDetails = useCallback(async (carId: number): Promise<CarResidentWithDetails[]> => {
    try {
      // 1단계: 기본 주민 목록 조회
      const basicResult = await getCarResidents(carId);
      if (!basicResult.success || !basicResult.data) {
        return [];
      }

      // 2단계: 각 주민의 실제 설정값 조회
      const detailedResidents = await Promise.all(
        basicResult.data.map(async (resident) => {
          try {
            const detailResult = await getCarInstanceResidentDetail(resident.carInstanceResidentId);
            if (detailResult.success && detailResult.data) {
              return {
                ...resident,
                isPrimary: detailResult.data.isPrimary,
                carAlarm: detailResult.data.carAlarm
              };
            }
          } catch (error) {
            console.error(`주민 ${resident.name} 상세 정보 조회 중 오류:`, error);
          }
          return resident; // 실패시 기본값 유지
        })
      );

      return detailedResidents;
    } catch (error) {
      console.error('차량-주민 데이터 로딩 중 오류:', error);
      return [];
    }
  }, []);
  // #endregion

  // #region 관리 모드 제어
  const handleManageResidents = useCallback(async (
    carInstanceId: number,
    carInstances: any[],
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
  }, [residentManagementMode, selectedCarInstanceId]);

  const closeResidentManagement = useCallback(() => {
    setResidentManagementMode(false);
    setSelectedCarInstanceId(null);
    setCarResidents([]);
  }, []);
  // #endregion

  // #region 주민 연결 관리
  const connectResident = useCallback(async (carInstanceId: number, residentId: number) => {
    const result = await createCarInstanceResident({
      carInstanceId,
      residentId,
      carAlarm: false, // 기본값
      isPrimary: false // 기본값
    });
    
    return result;
  }, []);

  const disconnectResident = useCallback(async (residentId: number) => {
    // carResidents에서 해당 주민의 carInstanceResidentId 찾기
    const carResident = carResidents.find(cr => cr.id === residentId);
    if (!carResident) {
      throw new Error('해당 주민의 연결 정보를 찾을 수 없습니다.');
    }

    const result = await deleteCarInstanceResident(carResident.carInstanceResidentId);
    return result;
  }, [carResidents]);
  // #endregion

  // #region 소유자/알람 설정 관리
  const performPrimaryCarToggle = useCallback(async (
    residentId: number, 
    carResident: CarResidentWithDetails, 
    newPrimaryState: boolean
  ) => {
    const updateResult = await updateCarInstanceResident(carResident.carInstanceResidentId, {
      carAlarm: carResident.carAlarm || false,
      isPrimary: newPrimaryState
    });
    
    if (updateResult.success && updateResult.data) {
      // 즉시 로컬 상태 업데이트 (낙관적 UI)
      const updatedCarResidents = carResidents.map(cr => {
        if (cr.id === residentId) {
          return {
            ...cr,
            isPrimary: updateResult.data.isPrimary,
            carAlarm: updateResult.data.carAlarm
          };
        }
        return cr;
      });
      setCarResidents(updatedCarResidents);
    }
    
    return updateResult;
  }, [carResidents]);

  const togglePrimary = useCallback(async (residentId: number) => {
    const carResident = carResidents.find(cr => cr.id === residentId);
    
    if (!carResident) {
      throw new Error('해당 주민의 연결 정보를 찾을 수 없습니다.');
    }

    const currentPrimaryState = Boolean(carResident.isPrimary);
    const newPrimaryState = !currentPrimaryState;
    
    // 차량 소유자 활성화를 시도하는 경우, 기존 차량 소유자 사용자가 있는지 확인
    if (newPrimaryState) {
      const existingPrimaryResident = carResidents.find(cr => 
        cr.id !== residentId && Boolean(cr.isPrimary)
      );
      
      if (existingPrimaryResident) {
        // 기존 차량 소유자 사용자 정보 반환 (전환 확인 모달용)
        return {
          success: false,
          needsTransfer: true,
          existingPrimaryResident,
          newPrimaryResidentId: residentId,
          newPrimaryResidentName: carResident.name || '알 수 없는 주민',
          errorMsg: undefined
        };
      }
    }
    
    // 기존 차량 소유자 사용자가 없거나 비활성화하는 경우 바로 진행
    const result = await performPrimaryCarToggle(residentId, carResident, newPrimaryState);
    return { ...result, needsTransfer: false };
  }, [carResidents, performPrimaryCarToggle]);

  const confirmPrimaryCarTransfer = useCallback(async (
    currentPrimaryResident: CarResidentWithDetails,
    newPrimaryResidentId: number
  ) => {
    const newPrimaryResident = carResidents.find(cr => cr.id === newPrimaryResidentId);
    if (!newPrimaryResident) {
      throw new Error('새로운 차량 소유자 사용자 정보를 찾을 수 없습니다.');
    }

    // 1단계: 기존 차량 소유자 사용자 비활성화
    const deactivateResult = await updateCarInstanceResident(
      currentPrimaryResident.carInstanceResidentId, 
      {
        carAlarm: currentPrimaryResident.carAlarm || false,
        isPrimary: false
      }
    );

    if (!deactivateResult.success) {
      throw new Error(`기존 차량 소유자 해제에 실패했습니다: ${deactivateResult.errorMsg}`);
    }

    // 2단계: 새로운 차량 소유자 사용자 활성화
    const activateResult = await updateCarInstanceResident(
      newPrimaryResident.carInstanceResidentId, 
      {
        carAlarm: newPrimaryResident.carAlarm || false,
        isPrimary: true
      }
    );

    if (!activateResult.success) {
      throw new Error(`새로운 차량 소유자 설정에 실패했습니다: ${activateResult.errorMsg}`);
    }

    // 로컬 상태 업데이트
    const updatedCarResidents = carResidents.map(cr => {
      if (cr.id === currentPrimaryResident.id) {
        return { ...cr, isPrimary: false };
      } else if (cr.id === newPrimaryResidentId) {
        return { ...cr, isPrimary: true };
      }
      return cr;
    });
    setCarResidents(updatedCarResidents);

    return {
      success: true,
      newPrimaryResidentName: newPrimaryResident.name
    };
  }, [carResidents]);

  const toggleAlarm = useCallback(async (residentId: number) => {
    const carResident = carResidents.find(cr => cr.id === residentId);
    
    if (!carResident) {
      throw new Error('해당 주민의 연결 정보를 찾을 수 없습니다.');
    }

    // 현재 상태와 새로운 상태 계산
    const currentAlarmState = Boolean(carResident.carAlarm);
    const newAlarmState = !currentAlarmState;
    
    // 알람 설정 토글
    const updateResult = await updateCarInstanceResident(carResident.carInstanceResidentId, {
      carAlarm: newAlarmState,
      isPrimary: carResident.isPrimary || false // 기존 차량 소유자 설정 유지
    });
    
    if (updateResult.success && updateResult.data) {
      // 즉시 로컬 상태 업데이트 (낙관적 UI)
      const updatedCarResidents = carResidents.map(cr => {
        if (cr.id === residentId) {
          return {
            ...cr,
            isPrimary: updateResult.data.isPrimary,
            carAlarm: updateResult.data.carAlarm
          };
        }
        return cr;
      });
      setCarResidents(updatedCarResidents);
    }
    
    return updateResult;
  }, [carResidents]);

  // 차량-주민 데이터 새로고침
  const refreshCarResidents = useCallback(async (onLoad: () => Promise<CarResidentWithDetails[]>) => {
    if (!residentManagementMode || !selectedCarInstanceId) return;
    
    try {
      const detailedResidents = await onLoad();
      setCarResidents(detailedResidents);
    } catch (error) {
      console.error('차량-주민 데이터 새로고침 중 오류:', error);
    }
  }, [residentManagementMode, selectedCarInstanceId]);
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
    toggleAlarm
  };
}
