'use server';

import { fetchDefault } from '../fetchClient';

/**
 * 로그인 Server Action
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

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch {
    return {
      success: false,
      errorMsg: '네트워크 오류',
    };
  }
} 