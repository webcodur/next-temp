/* 
  파일명: /hooks/useCountries.ts
  기능: REST Countries API 연동 훅
  책임: 전 세계 국가 목록을 동적으로 로딩하고 캐싱한다.
  
  주요 기능:
  - API 호출 및 데이터 변환
  - 로컬스토리지 24시간 캐싱
  - 주요 국가 우선순위 정렬
  - 에러 처리 및 재시도 메커니즘
*/ // ------------------------------

import { useState, useEffect } from 'react';

// #region 타입 정의
export interface Country {
  code: string;
  name: string;
  nativeName?: string;
  flag?: string;
}

interface ApiCountry {
  cca2: string;
  name: {
    common: string;
    nativeName?: Record<string, { common: string }>;
  };
  flag?: string;
}

interface CachedData {
  countries: Country[];
  timestamp: number;
}
// #endregion

// #region 상수
const PRIORITY_COUNTRIES = ['US', 'GB', 'CA', 'AU', 'DE', 'FR', 'JP', 'CN', 'SG'];
const CACHE_KEY = 'countries-cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간
// #endregion
// #region 메인 훅
export const useCountries = (enabled = true) => {
  // 상태 관리
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 국가 목록 로딩
  useEffect(() => {
    if (!enabled) {
      setCountries([]);
      return;
    }

    const loadCountries = async () => {
      try {
        // 캐시 확인
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const cachedData: CachedData = JSON.parse(cached);
          const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION;
          
          if (!isExpired) {
            setCountries(cachedData.countries);
            return;
          }
        }

        setIsLoading(true);
        setError(null);

        // REST Countries API 호출
        const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name,flag');
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const apiCountries: ApiCountry[] = await response.json();
        
        // 데이터 변환
        const transformedCountries: Country[] = apiCountries.map(country => ({
          code: country.cca2,
          name: country.name.common,
          nativeName: Object.values(country.name.nativeName || {})[0]?.common,
          flag: country.flag,
        }));

        // 우선순위 정렬 (주요 국가를 맨 위로)
        const sortedCountries = [
          // 1. 우선순위 국가들
          ...transformedCountries
            .filter(country => PRIORITY_COUNTRIES.includes(country.code))
            .sort((a, b) => {
              const aIndex = PRIORITY_COUNTRIES.indexOf(a.code);
              const bIndex = PRIORITY_COUNTRIES.indexOf(b.code);
              return aIndex - bIndex;
            }),
          
          // 2. 구분선 (기타 국가)
          { code: '---', name: '──────────' },
          
          // 3. 나머지 국가들 (알파벳 순)
          ...transformedCountries
            .filter(country => !PRIORITY_COUNTRIES.includes(country.code))
            .sort((a, b) => a.name.localeCompare(b.name))
        ];

        setCountries(sortedCountries);
        
        // 캐시 저장
        const cacheData: CachedData = {
          countries: sortedCountries,
          timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      } catch (error) {
        console.error('Failed to load countries from API:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setCountries([]); // API 실패 시 빈 배열
      } finally {
        setIsLoading(false);
      }
    };

    loadCountries();
  }, [enabled]);

  // 수동 새로고침 함수
  const refreshCountries = async () => {
    localStorage.removeItem(CACHE_KEY);
    setIsLoading(true);
    setError(null);

    try {
      // REST Countries API 호출
      const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name,flag');
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const apiCountries: ApiCountry[] = await response.json();
      
      // 데이터 변환
      const transformedCountries: Country[] = apiCountries.map(country => ({
        code: country.cca2,
        name: country.name.common,
        nativeName: Object.values(country.name.nativeName || {})[0]?.common,
        flag: country.flag,
      }));

      // 우선순위 정렬
      const sortedCountries = [
        ...transformedCountries
          .filter(country => PRIORITY_COUNTRIES.includes(country.code))
          .sort((a, b) => {
            const aIndex = PRIORITY_COUNTRIES.indexOf(a.code);
            const bIndex = PRIORITY_COUNTRIES.indexOf(b.code);
            return aIndex - bIndex;
          }),
        
        { code: '---', name: '──────────' },
        
        ...transformedCountries
          .filter(country => !PRIORITY_COUNTRIES.includes(country.code))
          .sort((a, b) => a.name.localeCompare(b.name))
      ];

      setCountries(sortedCountries);
      
      // 캐시 저장
      const cacheData: CachedData = {
        countries: sortedCountries,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

    } catch (error) {
      console.error('Failed to refresh countries from API:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hook 반환값
  return {
    countries,
    isLoading,
    error,
    refreshCountries,
    // 유틸리티 함수들
    getCountryByCode: (code: string) => countries.find(c => c.code === code),
    getMajorCountries: () => countries.filter(c => PRIORITY_COUNTRIES.includes(c.code)),
  };
};
// #endregion
