import { API_ERRORS, type ApiErrorKey } from '@/constants/apiErrors';

const loadToast = async () => {
  if (typeof window !== 'undefined') {
    const { customToast } = await import('@/components/ui/ui-effects/toast/Toast');
    return customToast;
  }
  return null;
};

/**
 * API 에러 메시지 생성 함수
 * @param errorKey API_ERRORS의 키
 * @param errorData 서버에서 반환된 에러 데이터 
 * @param statusCode HTTP 상태 코드
 * @returns 완성된 에러 메시지
 */
export async function getApiErrorMessage(
  errorKey: ApiErrorKey,
  errorData: unknown,
  statusCode: number,
  showToast: boolean = true
): Promise<string> {
  // 커스텀 메시지 생성
  const baseMessage = API_ERRORS[errorKey] || API_ERRORS['unknown_error'];
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
