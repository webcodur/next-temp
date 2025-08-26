import { API_ERRORS, type ApiErrorKey } from '@/constants/apiErrors';
import React from 'react';

const loadToast = async () => {
  if (typeof window !== 'undefined') {
    const { customToast } = await import('@/components/ui/ui-effects/toast/Toast');
    return customToast;
  }
  return null;
};

/**
 * 함수명을 기반으로 API 키 생성 (직접 매핑)
 */
const generateApiKeyFromFunctionName = (functionName: string): ApiErrorKey => {
  // 함수명이 API_ERRORS에 직접 존재하는지 확인
  if (API_ERRORS[functionName as ApiErrorKey]) {
    return functionName as ApiErrorKey;
  }
  
  // 없으면 기본값
  return 'unknown_error';
};

/**
 * 백엔드에서 전송된 에러 데이터에서 에러 코드 추출
 */
const extractErrorCode = (errorData: unknown): string | null => {
  if (!errorData || typeof errorData !== 'object') return null;
  
  const data = errorData as Record<string, unknown>;
  
  // 백엔드 응답 구조: { "statusCode": 404, "message": "...", "errorCode": "M430" }
  if (data.errorCode && typeof data.errorCode === 'string') {
    return data.errorCode;
  }
  
  // 다른 가능한 구조들도 지원
  if (data.error_code && typeof data.error_code === 'string') {
    return data.error_code;
  }
  
  if (data.code && typeof data.code === 'string') {
    return data.code;
  }
  
  return null;
};

/**
 * API 에러 메시지 생성 함수
 * @param errorData 서버에서 반환된 에러 데이터 
 * @param statusCode HTTP 상태 코드
 * @param functionName 호출한 함수명
 * @param showToast 토스트 표시 여부 (기본값: true)
 * @returns 완성된 에러 메시지
 */
export async function getApiErrorMessage(
  errorData: unknown,
  statusCode: number,
  functionName: string,
  showToast: boolean = true
): Promise<string> {
  // 함수명을 기반으로 API 키 생성
  const apiKey = generateApiKeyFromFunctionName(functionName);
  
  // 백엔드에서 보낸 에러 코드 추출
  const errorCode = extractErrorCode(errorData);
  
  // 개발 환경에서 함수명 및 API 키 매핑 확인
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 함수명: ${functionName} → API 키: ${apiKey}`);
    if (errorCode) {
      console.log(`📋 백엔드 에러 코드: ${errorCode}`);
    }
  }
  
  const baseMessage = API_ERRORS[apiKey];
  const errorMessage = `${baseMessage}: ${statusCode}`;

  // 토스트 표시 (옵션)
  if (showToast) {
    const toast = await loadToast();
    if (toast) {
      if (errorCode) {
        // 에러 코드가 있는 경우 커스텀 토스트 사용
        toast.custom(
          () => React.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '16px 20px',
              borderRadius: '10px',
              border: '2px solid hsl(0 72% 35%)',
              minHeight: '56px',
              minWidth: '320px',
              background: 'hsl(var(--destructive))',
              color: 'hsl(var(--destructive-foreground))',
              fontFamily: 'var(--font-multilang)',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.15)',
              flexWrap: 'nowrap',
            }
          }, [
            React.createElement('span', {
              key: 'errorcode',
              style: {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '700',
                fontFamily: 'monospace',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }
            }, errorCode),
            React.createElement('span', {
              key: 'message',
              style: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                minWidth: 0,
              }
            }, errorMessage)
          ]),
          {
            duration: 4000,
          }
        );
      } else {
        // 에러 코드가 없는 경우 기본 토스트
        toast.error(errorMessage, {
          duration: 4000,
          style: {
            fontFamily: 'var(--font-multilang)',
            fontSize: '16px',
            fontWeight: '600',
          }
        });
      }
    }
  }

  return errorMessage;
}

/**
 * 네트워크 에러용 메시지
 */
export function getNetworkErrorMessage(): string {
  return API_ERRORS['network_error'];
}
