/* 
  파일명: /hooks/useTokenManagement.ts
  기능: 토큰 관리 전용 훅
  책임: 토큰 갱신, 자동 갱신 처리
*/ // ------------------------------

'use client';

import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { refreshTokenWithString } from '@/services/auth/auth_refresh_POST';
import { parkingLotsAtom, selectedParkingLotIdAtom } from '@/store/auth';
import { 
  getTokenFromCookie, 
  setTokenToCookie, 
  ACCESS_TOKEN_NAME, 
  REFRESH_TOKEN_NAME 
} from '@/utils/tokenUtils';

export function useTokenManagement() {
  const [, setParkingLots] = useAtom(parkingLotsAtom);
  const [, setSelectedParkingLotId] = useAtom(selectedParkingLotIdAtom);

  // 토큰 자동 갱신 처리
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refreshTokenString = getTokenFromCookie(REFRESH_TOKEN_NAME);
    
    if (!refreshTokenString) {
      return false;
    }

    try {
      const result = await refreshTokenWithString(refreshTokenString);
      
      if (result.success && result.data) {
        // 새로운 토큰들 저장
        setTokenToCookie(ACCESS_TOKEN_NAME, result.data.accessToken);
        setTokenToCookie(REFRESH_TOKEN_NAME, result.data.refreshToken);
        
        // 현장 정보(주차장) 업데이트
        if (result.data.parkinglots) {
          setParkingLots(result.data.parkinglots);
        }
        
        // parkingLotId 처리
        if (result.data.parkingLotId !== undefined) {
          setSelectedParkingLotId(result.data.parkingLotId);
        } else if (result.data.parkinglots && result.data.parkinglots.length === 1) {
          setSelectedParkingLotId(result.data.parkinglots[0].id);
        } else if (result.data.parkinglots && result.data.parkinglots.length > 1) {
          setSelectedParkingLotId(0);
        }
        
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }, [setParkingLots, setSelectedParkingLotId]);

  return {
    refreshToken,
  };
} 