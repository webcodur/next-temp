/* 
  파일명: /hooks/useAuth.ts
  기능: 전역 인증 상태 관리 훅 (메인 컨트롤러)
  책임: 로그인/로그아웃, 인증 상태 관리, 토큰 생명주기 관리
*/ // ------------------------------

'use client';

import { useAtom } from 'jotai';
import { useEffect, useTransition, useCallback, useState, useMemo } from 'react';
import { signInWithCredentials } from '@/services/auth/auth_signin_POST';
import { logout as logoutAction } from '@/services/auth/auth_logout_GET';
import { isAuthenticatedAtom, userProfileAtom, parkingLotsAtom, selectedParkingLotIdAtom, manualParkingLotIdAtom } from '@/store/auth';
import { useTokenManagement } from './useTokenManagement';
import { useParkingLotManagement } from './useParkingLotManagement';
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

export function useAuth() {
  const [isPending, startTransition] = useTransition();
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
    const parkingLotIdFromToken = getParkinglotIdFromToken();
    setTokenSelectedParkingLotId(parkingLotIdFromToken);

    // 로깅 제거 (불필요)

    return true;
  }, [setTokenSelectedParkingLotId]);

  // #region 토큰 만료 처리
  const handleTokenExpired = useCallback(async () => {
    console.log('⏰ 토큰 만료 처리 시작');
    
    // 토큰 갱신 시도
    const refreshSuccess = await refreshToken();
    
    if (refreshSuccess) {
      console.log('🔄 토큰 갱신 성공');
      syncUserInfoFromToken();
    } else {
      console.log('💀 토큰 갱신 실패 → 완전 로그아웃');
      clearAllTokens();
      setIsLoggedIn(false);
      setUserProfile(null);
      setParkingLots([]);
      setTokenSelectedParkingLotId(null);
      setManualSelectedParkingLotId(null); // 수동 선택 주차장 ID도 초기화
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
      // 개발 모드에서만 로그 출력
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 인증 초기화 (한 번만)');
      }
      
      const accessToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
      
      if (accessToken) {
        // 토큰이 있으면 유효성 검사 및 사용자 정보 동기화
        const isValid = syncUserInfoFromToken();
        
        if (isValid) {
          setIsLoggedIn(true);
        } else {
          await handleTokenExpired();
        }
      } else {
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
  }, []); // 진짜 한 번만 실행
  // #endregion

  // #region 주기적 토큰 검증 (전역으로 한 번만)
  useEffect(() => {
    if (!isLoggedIn || !isInitialized || !globalInitialized) return;

    // 이미 토큰 검증이 시작되었다면 중복 실행 방지
    if (window.globalTokenCheckStarted) return;
    window.globalTokenCheckStarted = true;

    // 개발 모드에서만 로그 출력
    if (process.env.NODE_ENV === 'development') {
      console.log('⏲️ 토큰 검증 시작 (전역)');
    }
    
    const tokenCheckInterval = setInterval(async () => {
      const currentToken = getTokenFromCookie(ACCESS_TOKEN_NAME);
      
      if (!currentToken) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🚨 토큰 손실');
        }
        await handleTokenExpired();
      }
      // 정상 상태일 때는 로그 출력하지 않음
    }, 5 * 60 * 1000); // 5분마다 확인

    return () => {
      clearInterval(tokenCheckInterval);
      window.globalTokenCheckStarted = false;
    };
  }, [isLoggedIn, isInitialized, handleTokenExpired]);
  // #endregion

  // #region 로그인 처리
  const login = async (account: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('🔐 로그인 시도:', { account, timestamp: new Date().toISOString() });
    
    try {
      const result = await signInWithCredentials(account, password);
      
      if (!result.success || !result.data) {
        console.log('❌ 로그인 실패:', result.errorMsg);
        return { success: false, error: result.errorMsg || '로그인 실패' };
      }

      console.log('🎉 로그인 API 성공, 토큰 처리 중...');

      // 1. 토큰 저장
      setTokenToCookie(ACCESS_TOKEN_NAME, result.data.accessToken);
      setTokenToCookie(REFRESH_TOKEN_NAME, result.data.refreshToken);
      console.log('💾 토큰 저장 완료');

      // 2. 토큰에서 주차장 ID 추출 (토큰 저장 후 즉시 추출)
      const parkingLotIdFromToken = getParkinglotIdFromToken();
      console.log('🏢 토큰에서 추출된 주차장 ID:', parkingLotIdFromToken);

      // 3. 주차장 ID 상태 업데이트 (먼저 실행)
      setTokenSelectedParkingLotId(parkingLotIdFromToken);
      console.log('📍 주차장 ID 상태 업데이트:', parkingLotIdFromToken);

      // 4. 사용자 프로필 정보 설정
      setUserProfile({
        account: account,
        name: account // TokenResponse에는 사용자명이 없으므로 계정명을 사용
      });
      console.log('👤 사용자 프로필 설정 완료');

      // 5. 현장 정보(주차장) 설정
      if (result.data.parkinglots) {
        setParkingLots(result.data.parkinglots);
        console.log('🏢 주차장 목록 저장:', result.data.parkinglots.length, '개');
      }

      // 6. 인증 상태 설정 (마지막에 실행하여 리렌더링 트리거)
      setIsLoggedIn(true);
      console.log('✅ 인증 상태 설정 완료');

      // 7. 디버깅 정보 출력
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 로그인 후 토큰 정보:');
        debugTokenPayload();
        console.log('📍 최종 주차장 ID 상태:', parkingLotIdFromToken);
        
        // 상태 확인을 위한 지연된 로그
        setTimeout(() => {
          console.log('🔄 상태 확인 (1초 후):', {
            isLoggedIn: true,
            tokenSelectedParkingLotId: parkingLotIdFromToken,
            effectiveSelectedParkingLotId: parkingLotIdFromToken === 0 ? manualSelectedParkingLotId : parkingLotIdFromToken
          });
        }, 1000);
      }

      console.log('✅ 로그인 완료');
      return { success: true };
    } catch (error) {
      console.error('💥 로그인 중 오류:', error);
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  };

  // 로그아웃 처리
  const logout = async () => {
    console.log('🚪 로그아웃 처리 시작');
    
    startTransition(async () => {
      await logoutAction();
      
      // 모든 상태 초기화
      clearAllTokens();
      setIsLoggedIn(false);
      setUserProfile(null);
      setParkingLots([]);
      setTokenSelectedParkingLotId(null);
      setManualSelectedParkingLotId(null); // 최고관리자 수동 선택 주차장 ID도 초기화
      
      console.log('👋 로그아웃 완료');
    });
  };
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
    isPending,
    
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
    isPending,
    userProfile,
    parkingLots,
    effectiveSelectedParkingLotId,
    selectedParkingLot,
    login,
    logout,
    selectParkingLot,
    refreshToken,
    refreshUserInfo
  ]);
  // #endregion
} 