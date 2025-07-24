'use client';

import { fetchDefault } from '../fetchClient';
import { TokenResponse } from '@/types/auth';
import { snakeToCamel } from '@/utils/caseConverter';

/**
 * 토큰 갱신 클라이언트 함수
 */
export async function refreshTokenWithString(refreshTokenString: string) {
  try {
    const response = await fetchDefault('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: refreshTokenString }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errorMsg: errorData.message || '토큰 갱신 실패',
      };
    }

    const data: TokenResponse = await response.json();
    return {
      success: true,
      data: snakeToCamel(data), // 🔥 snake_case → camelCase 변환
    };
  } catch {
    return {
      success: false,
      errorMsg: '네트워크 오류',
    };
  }
} 