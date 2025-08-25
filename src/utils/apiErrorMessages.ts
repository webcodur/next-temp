import { API_ERRORS, type ApiErrorKey } from '@/constants/apiErrors';

const loadToast = async () => {
  if (typeof window !== 'undefined') {
    const { customToast } = await import('@/components/ui/ui-effects/toast/Toast');
    return customToast;
  }
  return null;
};

/**
 * 스택 트레이스에서 호출한 함수명 추출
 */
const getFunctionNameFromStack = (): string => {
  try {
    const stack = new Error().stack;
    if (!stack) return 'unknown';
    
    const stackLines = stack.split('\n');
    // 스택 구조:
    // 0: Error
    // 1: getFunctionNameFromStack
    // 2: getApiErrorMessage  
    // 3: 실제 호출한 함수 (getResidentDetail 등)
    
    const callerLine = stackLines[3]?.trim();
    if (!callerLine) return 'unknown';
    
    // "at functionName" 또는 "at Object.functionName" 패턴에서 함수명 추출
    const match = callerLine.match(/at\s+(?:Object\.)?(\w+)/);
    return match ? match[1] : 'unknown';
  } catch {
    return 'unknown';
  }
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
 * API 에러 메시지 생성 함수 (자동 함수명 추출)
 * @param errorData 서버에서 반환된 에러 데이터 
 * @param statusCode HTTP 상태 코드
 * @param showToast 토스트 표시 여부 (기본값: true)
 * @returns 완성된 에러 메시지
 */
export async function getApiErrorMessage(
  errorData: unknown,
  statusCode: number,
  showToast: boolean = true
): Promise<string> {
  // 스택 트레이스에서 자동으로 호출한 함수명 추출
  const functionName = getFunctionNameFromStack();
  
  // 함수명을 기반으로 API 키 생성
  const apiKey = generateApiKeyFromFunctionName(functionName);
  
  // 개발 환경에서 함수명 추출 및 API 키 매핑 확인
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔍 함수명: ${functionName} → API 키: ${apiKey}`);
  }
  
  const baseMessage = API_ERRORS[apiKey];
  const errorMessage = `${baseMessage}: ${statusCode}`;

  // 토스트 표시 (옵션)
  if (showToast) {
    const toast = await loadToast();
    if (toast) {
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

  return errorMessage;
}

/**
 * 네트워크 에러용 메시지
 */
export function getNetworkErrorMessage(): string {
  return API_ERRORS['network_error'];
}
