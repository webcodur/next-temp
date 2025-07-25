'use client';

import { fetchDefault } from '@/services/fetchClient';
import { ApiMessageResponse } from '@/types/auth';

/**
 * 로그아웃 클라이언트 함수
 */
export async function logout() {
  try {
    const response = await fetchDefault('/auth/logout', {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        errorMsg: errorData.message || '로그아웃 실패',
      };
    }

    const data: ApiMessageResponse = await response.json();
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