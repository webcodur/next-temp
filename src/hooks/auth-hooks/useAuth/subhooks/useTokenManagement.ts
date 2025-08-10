/* 
  파일명: /hooks/auth-hooks/useAuth/subhooks/useTokenManagement.ts
  기능: 토큰 관리 전용 훅
  책임: 토큰 갱신, 자동 갱신 처리, 상태 동기화
*/ // ------------------------------

'use client';

import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { refreshTokenWithString } from '@/services/auth/auth_refresh_POST';
import { parkingLotsAtom, selectedParkingLotIdAtom } from '@/store/auth';
import { 
  getTokenFromCookie, 
  setTokenToCookie, 
  getParkinglotIdFromToken,
  ACCESS_TOKEN_NAME, 
  REFRESH_TOKEN_NAME 
} from '@/utils/tokenUtils';

export function useTokenManagement() {
  const [, setParkingLots] = useAtom(parkingLotsAtom);
  const [, setTokenSelectedParkingLotId] = useAtom(selectedParkingLotIdAtom);

  // 토큰 자동 갱신 처리
  const refreshToken = useCallback(async (): Promise<boolean> => {
    console.log('🔄 토큰 갱신 시도 시작');
    
    const refreshTokenString = getTokenFromCookie(REFRESH_TOKEN_NAME);
    
    if (!refreshTokenString) {
      console.log('❌ 리프레시 토큰 없음');
      return false;
    }

    try {
      const result = await refreshTokenWithString(refreshTokenString);
      
      if (result.success && result.data) {
        console.log('✅ 토큰 갱신 API 성공');
        
        // 1. 새로운 토큰들 저장
        setTokenToCookie(ACCESS_TOKEN_NAME, result.data.accessToken);
        setTokenToCookie(REFRESH_TOKEN_NAME, result.data.refreshToken);
        
        // 2. 현장 정보(주차장) 업데이트
        if (result.data.parkinglots) {
          setParkingLots(result.data.parkinglots);
          console.log('🏢 주차장 목록 갱신:', result.data.parkinglots.length, '개');
        }
        
        // 3. 토큰에서 주차장 ID 업데이트
        const parkingLotIdFromToken = getParkinglotIdFromToken();
        setTokenSelectedParkingLotId(parkingLotIdFromToken);
        
        console.log('🎯 토큰 갱신 완료 - 주차장 ID:', parkingLotIdFromToken);
        return true;
      }
      
      console.log('❌ 토큰 갱신 API 실패:', result.errorMsg);
      return false;
    } catch (error) {
      console.error('💥 토큰 갱신 중 오류:', error);
      return false;
    }
  }, [setParkingLots, setTokenSelectedParkingLotId]);

  return {
    refreshToken,
  };
} 
