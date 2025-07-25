'use client';

import { fetchDefault } from '@/services/fetchClient';
import { TokenResponse } from '@/types/auth';

/**
 * 로그인 클라이언트 함수
 */
export async function signInWithCredentials(account: string, password: string) {
  try {
    const response = await fetchDefault('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ account, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errorMsg: errorData.message || '로그인 실패',
      };
    }

    const data: TokenResponse = await response.json();
    return {
      success: true,
      data: data, // 🔥 자동 변환됨 (snake_case → camelCase)
    };
  } catch {
    return {
      success: false,
      errorMsg: '네트워크 오류',
    };
  }
} 