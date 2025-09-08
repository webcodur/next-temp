/* 
  파일명: /hooks/useGoogleMaps.ts
  기능: Google Maps API 로딩 및 초기화 훅
  책임: 성능 최적화된 API 로딩, 새로운 동적 라이브러리 지원
  참조: https://developers.google.com/maps/documentation/javascript/load-maps-js-api
*/ // ------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';

// #region 타입 정의
interface GoogleMapsOptions {
  apiKey: string;
  libraries?: string[];
  language?: string;
  region?: string;
  useDynamicImport?: boolean; // 새로운 동적 로딩 방식 사용 여부
}

interface UseGoogleMapsReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  importLibrary: (library: string) => Promise<any>; // 동적 라이브러리 로드
}

// Google Maps API 전역 타입 (usePlacesAutocomplete와 호환)
declare global {
  interface Window {
    initGoogleMaps?: () => void;
  }
}
// #endregion

// 전역 상태 관리 (중복 로딩 방지)
let scriptLoadPromise: Promise<void> | null = null;
let isScriptLoaded = false;

// #region 메인 훅
export const useGoogleMaps = (options: GoogleMapsOptions): UseGoogleMapsReturn => {
  const [isLoaded, setIsLoaded] = useState(isScriptLoaded);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 동적 라이브러리 import 함수
  const importLibrary = useCallback(async (library: string): Promise<any> => {
    if (!window.google?.maps) {
      throw new Error('Google Maps API가 로드되지 않았습니다.');
    }

    try {
      // 새로운 동적 라이브러리 로딩 방식
      if (window.google.maps.importLibrary) {
        return await window.google.maps.importLibrary(library);
      } else {
        // Fallback: 기존 방식 (라이브러리가 이미 로드되어 있다고 가정)
        return window.google.maps;
      }
    } catch (error) {
      console.error(`라이브러리 ${library} 로드 실패:`, error);
      throw error;
    }
  }, []);

  // Google Maps API 스크립트 로드
  const loadGoogleMapsScript = useCallback(async () => {
    // 이미 로드된 경우
    if (window.google && window.google.maps) {
      setIsLoaded(true);
      isScriptLoaded = true;
      return;
    }

    // 이미 로딩 중인 경우 기존 Promise 재사용
    if (scriptLoadPromise) {
      try {
        await scriptLoadPromise;
        setIsLoaded(true);
        return;
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    // 새로운 로딩 Promise 생성
    scriptLoadPromise = new Promise<void>((resolve, reject) => {
      // 기존 스크립트가 있다면 제거
      const existingScript = document.getElementById('google-maps-script');
      if (existingScript) {
        existingScript.remove();
      }

      // 새로운 스크립트 요소 생성
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.async = true;
      script.defer = true;

      // URL 구성 (성능 최적화)
      const params = new URLSearchParams({
        key: options.apiKey,
        loading: 'async' // 성능 최적화
      });

      // 동적 로딩을 사용하지 않는 경우만 라이브러리 미리 로드
      if (!options.useDynamicImport && options.libraries?.length) {
        params.set('libraries', options.libraries.join(','));
      }

      if (options.language) params.set('language', options.language);
      if (options.region) params.set('region', options.region);

      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;

      if (options.useDynamicImport) {
        // 동적 로딩 방식: 콜백 없이 직접 로드 확인
        script.onload = () => {
          isScriptLoaded = true;
          setIsLoaded(true);
          setIsLoading(false);
          resolve();
        };
      } else {
        // 기존 콜백 방식
        params.set('callback', 'initGoogleMaps');
        script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
        
        window.initGoogleMaps = () => {
          isScriptLoaded = true;
          setIsLoaded(true);
          setIsLoading(false);
          resolve();
          
          // 콜백 정리
          delete window.initGoogleMaps;
        };
      }

      // 에러 핸들링
      script.onerror = () => {
        const errorMsg = 'Google Maps API 로드에 실패했습니다.';
        setError(errorMsg);
        setIsLoading(false);
        scriptLoadPromise = null;
        reject(new Error(errorMsg));
      };

      // 스크립트 추가
      document.head.appendChild(script);
    });

    try {
      await scriptLoadPromise;
    } catch (err) {
      setError(err instanceof Error ? err.message : '스크립트 로드 실패');
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // 스크립트 재로드
  const reload = useCallback(() => {
    scriptLoadPromise = null;
    isScriptLoaded = false;
    setIsLoaded(false);
    setError(null);
    loadGoogleMapsScript();
  }, [loadGoogleMapsScript]);

  // 컴포넌트 마운트 시 API 로드
  useEffect(() => {
    if (!options.apiKey) {
      setError('Google Maps API 키가 필요합니다.');
      return;
    }

    loadGoogleMapsScript();
  }, [loadGoogleMapsScript, options.apiKey]);

  return {
    isLoaded,
    isLoading,
    error,
    reload,
    importLibrary // 동적 라이브러리 import 함수
  };
};
// #endregion

// #region 유틸리티 함수들
export const isGoogleMapsLoaded = (): boolean => {
  return !!(window.google && window.google.maps && window.google.maps.places);
};

// Google Maps API 수동 로드 (훅 외부에서 사용)
export const loadGoogleMapsAPI = async (apiKey: string, options?: {
  libraries?: string[];
  language?: string;
  region?: string;
}): Promise<boolean> => {
  if (isGoogleMapsLoaded()) return true;

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  
  const params = new URLSearchParams({
    key: apiKey,
    libraries: options?.libraries?.join(',') || 'places',
    loading: 'async'
  });
  
  if (options?.language) params.set('language', options.language);
  if (options?.region) params.set('region', options.region);
  
  script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
  
  return new Promise((resolve, reject) => {
    script.onload = () => resolve(true);
    script.onerror = () => reject(false);
    document.head.appendChild(script);
  });
};
// #endregion