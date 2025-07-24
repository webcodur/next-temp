'use client';

import { useAtom } from 'jotai';
import { useEffect, useTransition, useCallback } from 'react';
import { signInWithCredentials } from '@/services/auth/auth_signin_POST';
import { logout as logoutAction } from '@/services/auth/auth_logout_GET';
import { refreshTokenWithString } from '@/services/auth/auth_refresh_POST';
import { isAuthenticatedAtom, userAtom, parkingLotsAtom, selectedParkingLotIdAtom } from '@/store/auth';
import { loadMenuDataAtom } from '@/store/menu';

/**
 * 쿠키에서 토큰 가져오기
 */
const getTokenFromCookie = (tokenName: string): string | null => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${tokenName}=`))
    ?.split('=')[1] || null;
};

/**
 * 쿠키에 토큰 설정
 */
const setTokenToCookie = (tokenName: string, token: string, maxAge: number = 86400) => {
  document.cookie = `${tokenName}=${token}; path=/; max-age=${maxAge}`;
};

/**
 * 쿠키에서 토큰 제거
 */
const removeTokenFromCookie = (tokenName: string) => {
  document.cookie = `${tokenName}=; path=/; max-age=0`;
};

/**
 * 전역 상태 기반 인증 훅
 */
export function useAuth() {
  const [isPending, startTransition] = useTransition();
  const [isLoggedIn, setIsLoggedIn] = useAtom(isAuthenticatedAtom);
  const [user, setUser] = useAtom(userAtom);
  const [parkingLots, setParkingLots] = useAtom(parkingLotsAtom);
  const [selectedParkingLotId, setSelectedParkingLotId] = useAtom(selectedParkingLotIdAtom);
  const [, loadMenuData] = useAtom(loadMenuDataAtom); // 간단한 메뉴 로딩 액션

  /**
   * 토큰 자동 갱신
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    const refreshTokenString = getTokenFromCookie('refresh-token');
    
    if (!refreshTokenString) {
      return false;
    }

    try {
      const result = await refreshTokenWithString(refreshTokenString);
      
      if (result.success && result.data) {
        // 새로운 토큰들 저장
        setTokenToCookie('access-token', result.data.accessToken);
        setTokenToCookie('refresh-token', result.data.refreshToken);
        
        // 현장 정보(주차장) 업데이트 - 로그인 시 미리 받는 정보
        if (result.data.parkinglots) {
          setParkingLots(result.data.parkinglots);
        }
        
        // parkingLotId 처리 - 슈퍼어드민(0) 또는 일반사용자의 기본 현장
        let finalParkingLotId: number | null = null;
        if (result.data.parkingLotId !== undefined) {
          finalParkingLotId = result.data.parkingLotId;
          setSelectedParkingLotId(result.data.parkingLotId);
        } else if (result.data.parkinglots && result.data.parkinglots.length === 1) {
          // API에서 parkingLotId를 명시하지 않았지만 현장이 1개뿐인 경우 자동 선택
          finalParkingLotId = result.data.parkinglots[0].id;
          setSelectedParkingLotId(result.data.parkinglots[0].id);
        } else if (result.data.parkinglots && result.data.parkinglots.length > 1) {
          // 여러 현장이 있는 경우 슈퍼어드민으로 간주하고 0 설정
          finalParkingLotId = 0;
          setSelectedParkingLotId(0);
        }
        
        // 🎯 토큰 갱신 완료 후 메뉴 초기화
        if (finalParkingLotId !== null) {
          const menuParkingLotId = finalParkingLotId > 0 ? finalParkingLotId : undefined;
          await loadMenuData(menuParkingLotId);
        }
        
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }, [setParkingLots, loadMenuData]); // initializeMenuAfterLogin 제거

  // 초기 토큰 확인 및 자동 갱신 설정
  useEffect(() => {
    const accessToken = getTokenFromCookie('access-token');
    const refreshTokenString = getTokenFromCookie('refresh-token');
    
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

  /**
   * 로그인
   */
  const login = async (account: string, password: string) => {
    const result = await signInWithCredentials(account, password);

    if (!result.success) {
      return { success: false, error: result.errorMsg || '로그인 실패' };
    }

    if (!result.data?.accessToken) {
      return { success: false, error: '토큰을 받지 못했습니다' };
    }

    // 토큰들을 쿠키에 저장
    setTokenToCookie('access-token', result.data.accessToken);
    
    if (result.data.refreshToken) {
      setTokenToCookie('refresh-token', result.data.refreshToken);
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

    // 🎯 메뉴 로딩 - 간단하고 확실한 방법
    if (finalParkingLotId !== null) {
      const menuParkingLotId = finalParkingLotId > 0 ? finalParkingLotId : undefined;
      await loadMenuData(menuParkingLotId);
    }

    return { success: true };
  };

  /**
   * 주차장 선택
   */
  const selectParkingLot = useCallback((parkingLotId: number) => {
    setSelectedParkingLotId(parkingLotId);
  }, [setSelectedParkingLotId]);

  /**
   * 선택된 주차장 정보 가져오기
   */
  const getSelectedParkingLot = useCallback(() => {
    if (!selectedParkingLotId) return null;
    return parkingLots.find(lot => lot.id === selectedParkingLotId) || null;
  }, [selectedParkingLotId, parkingLots]);

  /**
   * 로그아웃
   */
  const logout = async () => {
    startTransition(async () => {
      await logoutAction();
      
      // 쿠키 제거
      removeTokenFromCookie('access-token');
      removeTokenFromCookie('refresh-token');
      
      // 상태 초기화
      setIsLoggedIn(false);
      setUser(null);
      setParkingLots([]);
      setSelectedParkingLotId(null);
    });
  };

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
    selectedParkingLot: getSelectedParkingLot(),
    selectParkingLot,
  };
} 