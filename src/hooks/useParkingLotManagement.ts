/* 
  파일명: /hooks/useParkingLotManagement.ts
  기능: 주차장 관리 전용 훅
  책임: 주차장 선택, 정보 조회
*/ // ------------------------------

'use client';

import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { parkingLotsAtom, selectedParkingLotIdAtom } from '@/store/auth';

export function useParkingLotManagement() {
  const [parkingLots] = useAtom(parkingLotsAtom);
  const [selectedParkingLotId, setSelectedParkingLotId] = useAtom(selectedParkingLotIdAtom);

  // 주차장 선택
  const selectParkingLot = useCallback((parkingLotId: number) => {
    setSelectedParkingLotId(parkingLotId);
  }, [setSelectedParkingLotId]);

  // 선택된 주차장 정보 가져오기
  const getSelectedParkingLot = useCallback(() => {
    if (!selectedParkingLotId) return null;
    return parkingLots.find(lot => lot.id === selectedParkingLotId) || null;
  }, [selectedParkingLotId, parkingLots]);

  return {
    parkingLots,
    selectedParkingLotId,
    selectedParkingLot: getSelectedParkingLot(),
    selectParkingLot,
  };
} 