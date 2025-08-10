/* 
  파일명: /hooks/auth-hooks/useAuth/subhooks/useParkingLotManagement.ts
  기능: 주차장 관리 전용 훅
  책임: 주차장 선택, 정보 조회, 최고관리자 현장 선택 처리
*/ // ------------------------------

'use client';

import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { parkingLotsAtom, selectedParkingLotIdAtom, manualParkingLotIdAtom } from '@/store/auth';
import { getRoleIdFromToken } from '@/utils/tokenUtils';

export function useParkingLotManagement() {
  const [parkingLots] = useAtom(parkingLotsAtom);
  const [tokenSelectedParkingLotId] = useAtom(selectedParkingLotIdAtom);
  const [manualSelectedParkingLotId, setManualSelectedParkingLotId] = useAtom(manualParkingLotIdAtom);

  // 효과적인 주차장 ID 계산
  // 최고관리자(tokenSelectedParkingLotId === 0)의 경우:
  // - manualSelectedParkingLotId가 null이면 0을 반환 (현장 선택 페이지로 이동)
  // - manualSelectedParkingLotId가 있으면 그 값을 반환 (선택된 현장으로 진입)
  const effectiveSelectedParkingLotId = tokenSelectedParkingLotId === 0 ? 
    (manualSelectedParkingLotId ?? 0) : tokenSelectedParkingLotId;

  // 주차장 선택 - 최고관리자(roleId: 1)인 경우에만 수동 선택 가능
  const selectParkingLot = useCallback((parkingLotId: number) => {
    const roleId = getRoleIdFromToken();
    
    console.log('🏢 주차장 선택 시도:', {
      parkingLotId,
      roleId,
      tokenSelectedParkingLotId,
      currentManualId: manualSelectedParkingLotId
    });
    
    if (roleId === 1 && tokenSelectedParkingLotId === 0) {
      // 최고관리자인 경우: 수동 선택 상태에 저장
      setManualSelectedParkingLotId(parkingLotId);
      console.log('👑 최고관리자 현장 선택 완료:', parkingLotId);
      
      // 선택된 주차장 정보 로깅
      const selectedLot = parkingLots.find(lot => lot.id === parkingLotId);
      if (selectedLot) {
        console.log('📍 선택된 현장 정보:', selectedLot);
      }
    } else {
      // 일반 사용자인 경우: 토큰 기반이므로 변경 불가
      console.warn('🚫 주차장 선택 제한:', {
        reason: '토큰 기반 시스템',
        userRole: roleId,
        tokenParkingLotId: tokenSelectedParkingLotId,
        message: `주차장 ID ${parkingLotId}로 변경하려면 서버에서 새로운 토큰을 발급받아야 합니다.`
      });
    }
  }, [tokenSelectedParkingLotId, manualSelectedParkingLotId, setManualSelectedParkingLotId, parkingLots]);

  // 선택된 주차장 정보 가져오기 (효과적인 주차장 ID 사용)
  const getSelectedParkingLot = useCallback(() => {
    if (!effectiveSelectedParkingLotId) return null;
    
    const selectedLot = parkingLots.find(lot => lot.id === effectiveSelectedParkingLotId) || null;
    
    // 로깅 제거 (불필요)
    
    return selectedLot;
  }, [effectiveSelectedParkingLotId, parkingLots]);

  return {
    parkingLots,
    selectedParkingLotId: effectiveSelectedParkingLotId, // 효과적인 주차장 ID 반환
    selectedParkingLot: getSelectedParkingLot(),
    selectParkingLot,
  };
} 
