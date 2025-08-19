/* 
  파일명: /hooks/auth-hooks/useAuth/useAuth.ts
  기능: 전역 인증 상태 관리 훅 (메인 컨트롤러)
  책임: 로그인/로그아웃, 인증 상태 관리, 토큰 생명주기 관리
*/ // ------------------------------

'use client';

import { useAtom } from 'jotai';
import { useEffect, useCallback, useState, useMemo } from 'react';
import { signInWithCredentials } from '@/services/auth/auth_signin_POST';
import { logout as logoutAction } from '@/services/auth/auth_logout_GET';
import { isAuthenticatedAtom, userProfileAtom, parkingLotsAtom, selectedParkingLotIdAtom, manualParkingLotIdAtom } from '@/store/auth';
import { useTokenManagement } from './subhooks/useTokenManagement';
import { useParkingLotManagement } from './subhooks/useParkingLotManagement';
import { 
  getTokenFromCookie, 
  setTokenToCookie, 
  clearAllTokens,
  getUserInfoFromToken,
  getRoleIdFromToken,
  getParkinglotIdFromToken,
  debugTokenPayload,
  ACCESS_TOKEN_NAME, 
  REFRESH_TOKEN_NAME 
} from '@/utils/tokenUtils';

// #region 메인 인증 훅
// 전역 초기화 상태 (모든 인스턴스가 공유)
let globalInitialized = false;
let globalInitPromise: Promise<void> | null = null;
let globalTokenCheckStarted = false;

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isAuthenticatedAtom);
  const [userProfile, setUserProfile] = useAtom(userProfileAtom);
  const [, setParkingLots] = useAtom(parkingLotsAtom);
  const [tokenSelectedParkingLotId, setTokenSelectedParkingLotId] = useAtom(selectedParkingLotIdAtom);
  const [manualSelectedParkingLotId, setManualSelectedParkingLotId] = useAtom(manualParkingLotIdAtom);
  const [isInitialized, setIsInitialized] = useState(globalInitialized);

  // 분리된 훅들 사용
  const { refreshToken } = useTokenManagement();
  const { parkingLots, selectedParkingLot, selectParkingLot } = useParkingLotManagement();

  // 효과적인 주차장 ID 계산 (토큰이 0이면 수동선택값, 아니면 토큰값)
  // 최고관리자(tokenSelectedParkingLotId === 0)의 경우:
  // - manualSelectedParkingLotId가 null이면 0을 반환 (현장 선택 페이지로 이동)
  // - manualSelectedParkingLotId가 있으면 그 값을 반환 (선택된 현장으로 진입)
  const effectiveSelectedParkingLotId = tokenSelectedParkingLotId === 0 
    ? (manualSelectedParkingLotId ?? 0) 
    : tokenSelectedParkingLotId;

  // #region 토큰 기반 사용자 정보 동기화
  const syncUserInfoFromToken = useCallback(() => {
    const userInfo = getUserInfoFromToken();
    if (!userInfo) return false;

    // 토큰에서 주차장 ID 추출하여 동기화
    setTokenSelectedParkingLotId(getParkinglotIdFromToken());

    return true;
  }, [setTokenSelectedParkingLotId]);

  // #region 토큰 만료 처리
  const handleTokenExpired = useCallback(async () => {
    console.log('⏰ 토큰 만료 처리 시작');
    
    // 토큰 갱신 시도
    const refreshSuccess = await refreshToken();
    
    if (refreshSuccess) {
      syncUserInfoFromToken();
    } 
    else {
      clearAllTokens();
      setIsLoggedIn(false);
      setUserProfile(null);
      setParkingLots([]);
      setTokenSelectedParkingLotId(null);
      setManualSelectedParkingLotId(null); 
    }
  }, [refreshToken, syncUserInfoFromToken, setIsLoggedIn, setUserProfile, setParkingLots, setTokenSelectedParkingLotId, setManualSelectedParkingLotId]);
  // #endregion

  // #region 초기화 및 토큰 확인 (앱 시작 시)
  useEffect(() => {
    if (globalInitialized) {
      setIsInitialized(true);
      return;
    }

    if (globalInitPromise) {
      globalInitPromise.then(() => setIsInitialized(true));
      return;
    }

    const initializeAuth = async () => {
      const accessToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
      // 토큰 존재: 유효성 검사 및 사용자 정보 동기화
      if (accessToken) {
        const isValid = syncUserInfoFromToken();
        // 토큰 유효: 로그인 처리
        if (isValid) setIsLoggedIn(true);
        // 토큰 무효: 토큰 갱신 시도
        else await handleTokenExpired();
      } 
      // 토큰 없음: 로그아웃 처리
      else {
        setIsLoggedIn(false);
        setTokenSelectedParkingLotId(null);
        setManualSelectedParkingLotId(null); // 수동 선택 주차장 ID도 초기화
      }
      
      globalInitialized = true;
      setIsInitialized(true);
    };

    globalInitPromise = initializeAuth();
    globalInitPromise.finally(() => {
      globalInitPromise = null;
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 한 번만 실행
  // #endregion

  // #region 주기적 토큰 검증 (전역으로 한 번만)
  useEffect(() => {
    if (!isLoggedIn || !isInitialized || !globalInitialized) return;

    // 이미 토큰 검증이 시작되었다면 중복 실행 방지
    if (globalTokenCheckStarted) return;
    globalTokenCheckStarted = true;

    const tokenCheckInterval = setInterval(async () => {
      const currentToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
      
      if (!currentToken) {
        await handleTokenExpired();
      }
      // 정상 상태일 때는 로그 출력하지 않음
    }, 5 * 60 * 1000); // 5분마다 확인

    return () => {
      clearInterval(tokenCheckInterval);
      globalTokenCheckStarted = false;
    };
  }, [isLoggedIn, isInitialized, handleTokenExpired]);
  // #endregion

  // #region 로그인 처리
  const login = useCallback(async (account: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 로그인 시도:', { account, timestamp: new Date().toISOString() });
    
    try {
      const result = await signInWithCredentials(account, password);
      
      if (!result.success || !result.data) {
        console.log('❌ 로그인 실패:', result.errorMsg);
        return { success: false, error: result.errorMsg || '로그인 실패' };
      }

      // 1. 토큰 저장
      setTokenToCookie(ACCESS_TOKEN_NAME, result.data.accessToken);
      setTokenToCookie(REFRESH_TOKEN_NAME, result.data.refreshToken);
      console.log('💾 토큰 저장 완료');

      // 2. 토큰에서 주차장 ID 추출 (토큰 저장 후 즉시 추출)
      const parkingLotIdFromToken = getParkinglotIdFromToken();

      // 3. 주차장 ID 상태 업데이트 (먼저 실행)
      setTokenSelectedParkingLotId(parkingLotIdFromToken);

      // 4. 사용자 프로필 정보 설정
      setUserProfile({
        account: account,
        name: account // TokenResponse에는 사용자명이 없으므로 계정명을 사용
      });

      // 5. 현장 정보(주차장) 설정
      if (result.data.parkinglots) {
        setParkingLots(result.data.parkinglots);
      }

      // 6. 인증 상태 설정 (마지막에 실행하여 리렌더링 트리거)
      setIsLoggedIn(true);

      return { success: true };
    } catch (error) {
      console.error('💥 로그인 중 오류:', error);
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  }, [setTokenSelectedParkingLotId, setUserProfile, setParkingLots, setIsLoggedIn]);

  // 로그아웃 처리
  const logout = useCallback(async () => {
    await logoutAction();
    clearAllTokens();
    setIsLoggedIn(false);
    setUserProfile(null);
    setParkingLots([]);
    setTokenSelectedParkingLotId(null);
    setManualSelectedParkingLotId(null); // 최고관리자 수동 선택 주차장 ID도 초기화
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion

  // #region 추가 유틸리티 메서드
  // 현재 사용자 정보 새로고침
  const refreshUserInfo = useCallback(() => {
    if (!isLoggedIn) return false;
    return syncUserInfoFromToken();
  }, [isLoggedIn, syncUserInfoFromToken]);

  // 토큰 기반 사용자 정보 확인
  const getCurrentUserInfo = useCallback(() => {
    return getUserInfoFromToken();
  }, []);
  // #endregion

  // #region 반환 인터페이스 (메모이제이션)
  return useMemo(() => ({
    // 기본 상태
    isLoggedIn,
    isLoading: !isInitialized, // 초기화 전까지는 로딩 상태
    
    // 사용자 정보
    userProfile,
    
    // 주차장 관련
    parkingLots,
    selectedParkingLotId: effectiveSelectedParkingLotId,
    selectedParkingLot,
    
    // 액션
    login,
    logout,
    selectParkingLot,
    refreshToken,
    refreshUserInfo,
    
    // 유틸리티
    getUserRoleId: getRoleIdFromToken,
    getCurrentUserInfo,
    debugToken: debugTokenPayload,
  }), [
    isLoggedIn,
    isInitialized,
    userProfile,
    parkingLots,
    effectiveSelectedParkingLotId,
    selectedParkingLot,
    login,
    logout,
    selectParkingLot,
    refreshToken,
    refreshUserInfo,
    getCurrentUserInfo
  ]);
  // #endregion
} 
