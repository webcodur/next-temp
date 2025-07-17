'use server';

import { fetchDefault } from '../fetchClient';

/**
 * 로그아웃 Server Action
 */
export async function logout() {
  try {
    const response = await fetchDefault('/auth/logout', {
      method: 'GET',
    });

    if (!response.ok) {
      return {
        success: false,
        errorMsg: '로그아웃 실패',
      };
    }

    return {
      success: true,
    };
  } catch {
    return {
      success: false,
      errorMsg: '네트워크 오류',
    };
  }
} 