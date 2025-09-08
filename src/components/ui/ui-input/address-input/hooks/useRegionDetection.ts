import { useState, useEffect, useCallback } from 'react';
import type { ENUM_Region, RegionDetectionResult } from '../types';

/**
 * 사용자의 지역(한국/해외)을 감지하는 훅
 * 
 * 감지 방법:
 * 1. IP 기반 지역 감지 (우선순위 높음)
 * 2. 타임존 기반 감지
 * 3. 브라우저 언어 설정 기반 감지
 * 4. 기본값: 글로벌
 */
export const useRegionDetection = (
  forceRegion?: ENUM_Region,
  autoDetect: boolean = true
) => {
  const [detection, setDetection] = useState<RegionDetectionResult>({
    region: 'global',
    country: 'unknown',
    confidence: 0,
    method: 'manual'
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // IP 기반 지역 감지
  const detectByIP = async (): Promise<RegionDetectionResult> => {
    // 무료 IP 지역 감지 서비스 사용
    // 실제 프로덕션에서는 더 안정적인 서비스 권장
    const response = await fetch('https://ipapi.co/json/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('IP detection service unavailable');
    }

    const data = await response.json();
    const countryCode = data.country_code;
    
    return {
      region: countryCode === 'KR' ? 'korea' : 'global',
      country: countryCode || 'unknown',
      confidence: countryCode ? 0.9 : 0.1,
      method: 'ip'
    };
  };

  // 타임존 기반 지역 감지
  const detectByTimezone = (): RegionDetectionResult => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isKoreanTimezone = timezone === 'Asia/Seoul' || timezone === 'Asia/Pyongyang';
      
      return {
        region: isKoreanTimezone ? 'korea' : 'global',
        country: isKoreanTimezone ? 'KR' : 'unknown',
        confidence: isKoreanTimezone ? 0.7 : 0.3,
        method: 'timezone'
      };
    } catch {
      return {
        region: 'global',
        country: 'unknown',
        confidence: 0,
        method: 'timezone'
      };
    }
  };

  // 언어 설정 기반 지역 감지
  const detectByLanguage = (): RegionDetectionResult => {
    try {
      const languages = navigator.languages || [navigator.language];
      const hasKorean = languages.some(lang => 
        lang.toLowerCase().startsWith('ko') || lang.toLowerCase().includes('kr')
      );
      
      return {
        region: hasKorean ? 'korea' : 'global',
        country: hasKorean ? 'KR' : 'unknown',
        confidence: hasKorean ? 0.6 : 0.2,
        method: 'language'
      };
    } catch {
      return {
        region: 'global',
        country: 'unknown',
        confidence: 0,
        method: 'language'
      };
    }
  };

  // 자동 감지 함수 정의
  const detectRegion = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. IP 기반 지역 감지 시도
      const ipResult = await detectByIP();
      if (ipResult.confidence > 0.8) {
        setDetection(ipResult);
        setIsLoading(false);
        return;
      }

      // 2. 타임존 기반 감지
      const timezoneResult = detectByTimezone();
      if (timezoneResult.confidence > 0.6) {
        setDetection(timezoneResult);
        setIsLoading(false);
        return;
      }

      // 3. 언어 설정 기반 감지
      const languageResult = detectByLanguage();
      setDetection(languageResult);
      setIsLoading(false);

    } catch (err) {
      console.warn('Region detection failed:', err);
      setError('지역 감지에 실패했습니다.');
      
      // 폴백: 언어 설정 기반 감지
      const fallbackResult = detectByLanguage();
      setDetection(fallbackResult);
      setIsLoading(false);
    }
  }, []);

  // 강제 지역 설정이 있으면 해당 값 사용
  useEffect(() => {
    if (forceRegion) {
      setDetection({
        region: forceRegion,
        country: forceRegion === 'korea' ? 'KR' : 'unknown',
        confidence: 1,
        method: 'manual'
      });
      setIsLoading(false);
      return;
    }

    if (!autoDetect) {
      setDetection({
        region: 'global',
        country: 'unknown',
        confidence: 0,
        method: 'manual'
      });
      setIsLoading(false);
      return;
    }

    // 자동 감지 실행
    detectRegion();
  }, [forceRegion, autoDetect, detectRegion]);

  // 수동으로 지역 변경
  const setRegion = (region: ENUM_Region) => {
    setDetection({
      region,
      country: region === 'korea' ? 'KR' : 'unknown',
      confidence: 1,
      method: 'manual'
    });
  };

  // 지역 재감지
  const redetect = () => {
    if (!forceRegion && autoDetect) {
      detectRegion();
    }
  };

  return {
    detection,
    isLoading,
    error,
    setRegion,
    redetect,
    // 편의 속성
    isKorea: detection.region === 'korea',
    isGlobal: detection.region === 'global',
    country: detection.country,
    confidence: detection.confidence
  };
};
