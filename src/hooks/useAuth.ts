/* 
  파일명: /hooks/useAuth.ts
  기능: 전역 인증 상태 관리 훅 (메인 컨트롤러)
  책임: 로그인/로그아웃, 인증 상태 관리, 하위 훅들 조합
*/ // ------------------------------

'use client';

import { useAtom } from 'jotai';
import { useEffect, useTransition } from 'react';
import { signInWithCredentials } from '@/services/auth/auth_signin_POST';
import { logout as logoutAction } from '@/services/auth/auth_logout_GET';
import { isAuthenticatedAtom, userAtom, parkingLotsAtom, selectedParkingLotIdAtom } from '@/store/auth';
import { loadMenuDataAtom } from '@/store/menu';
import { useTokenManagement } from './useTokenManagement';
import { useParkingLotManagement } from './useParkingLotManagement';
import { 
  getTokenFromCookie, 
  setTokenToCookie, 
  clearAllTokens,
  ACCESS_TOKEN_NAME, 
  REFRESH_TOKEN_NAME 
} from '@/utils/tokenUtils';

// #region 메인 인증 훅
export function useAuth() {
  const [isPending, startTransition] = useTransition();
  const [isLoggedIn, setIsLoggedIn] = useAtom(isAuthenticatedAtom);
  const [user, setUser] = useAtom(userAtom);
  const [, setParkingLots] = useAtom(parkingLotsAtom);
  const [, setSelectedParkingLotId] = useAtom(selectedParkingLotIdAtom);
  const [, loadMenuData] = useAtom(loadMenuDataAtom);

  // 분리된 훅들 사용
  const { refreshToken } = useTokenManagement();
  const { parkingLots, selectedParkingLotId, selectedParkingLot, selectParkingLot } = useParkingLotManagement();

  // #region 상태 동기화
  // 초기 토큰 확인 및 자동 갱신 설정
  useEffect(() => {
    const accessToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
    const refreshTokenString = getTokenFromCookie(REFRESH_TOKEN_NAME);
    
    // 쿠키 토큰 유무와 로그인 상태 동기화
    if (accessToken && !isLoggedIn) {
      setIsLoggedIn(true);
    } else if (!accessToken && isLoggedIn) {
      // accessToken이 없으면 refresh 시도
      if (refreshTokenString) {
        refreshToken().then((success) => {
          if (!success) {
            // refresh 실패 시 로그아웃
            setIsLoggedIn(false);
            setUser(null);
            setParkingLots([]);
            setSelectedParkingLotId(null);
          }
        });
      } else {
        // refresh token도 없으면 로그아웃
        setIsLoggedIn(false);
        setUser(null);
        setParkingLots([]);
        setSelectedParkingLotId(null);
      }
    }
  }, [isLoggedIn, setIsLoggedIn, setUser, setParkingLots, setSelectedParkingLotId, refreshToken]);

  // 로그인 상태 변경 시 메뉴 로딩
  useEffect(() => {
    if (isLoggedIn && selectedParkingLotId !== null) {
      const menuParkingLotId = selectedParkingLotId > 0 ? selectedParkingLotId : undefined;
      loadMenuData(menuParkingLotId);
    }
  }, [isLoggedIn, selectedParkingLotId, loadMenuData]);
  // #endregion

  // #region 인증 액션
  // 로그인 처리
  const login = async (account: string, password: string) => {
    const result = await signInWithCredentials(account, password);

    if (!result.success) {
      return { success: false, error: result.errorMsg || '로그인 실패' };
    }

    if (!result.data?.accessToken) {
      return { success: false, error: '토큰을 받지 못했습니다' };
    }

    // 토큰들을 쿠키에 저장
    setTokenToCookie(ACCESS_TOKEN_NAME, result.data.accessToken);
    
    if (result.data.refreshToken) {
      setTokenToCookie(REFRESH_TOKEN_NAME, result.data.refreshToken);
    }
    
    // 로그인 상태 업데이트
    setIsLoggedIn(true);
    
    // 현장 정보(주차장) 설정
    if (result.data.parkinglots) {
      setParkingLots(result.data.parkinglots);
    }
    
    // parkingLotId 처리
    let finalParkingLotId: number | null = null;
    if (result.data.parkingLotId !== undefined) {
      finalParkingLotId = result.data.parkingLotId;
      setSelectedParkingLotId(result.data.parkingLotId);
    } else if (result.data.parkinglots && result.data.parkinglots.length === 1) {
      finalParkingLotId = result.data.parkinglots[0].id;
      setSelectedParkingLotId(result.data.parkinglots[0].id);
    } else if (result.data.parkinglots && result.data.parkinglots.length > 1) {
      finalParkingLotId = 0;
      setSelectedParkingLotId(0);
    }

    // 메뉴 로딩
    if (finalParkingLotId !== null) {
      const menuParkingLotId = finalParkingLotId > 0 ? finalParkingLotId : undefined;
      await loadMenuData(menuParkingLotId);
    }

    return { success: true };
  };

  // 로그아웃 처리
  const logout = async () => {
    startTransition(async () => {
      await logoutAction();
      
      // 쿠키 제거
      clearAllTokens();
      
      // 상태 초기화
      setIsLoggedIn(false);
      setUser(null);
      setParkingLots([]);
      setSelectedParkingLotId(null);
    });
  };
  // #endregion

  // #region 반환 인터페이스
  return {
    isLoggedIn,
    isLoading: false,
    login,
    logout,
    refreshToken,
    isPending,
    user,
    parkingLots,
    selectedParkingLotId,
    selectedParkingLot,
    selectParkingLot,
  };
  // #endregion
}
// #endregion 