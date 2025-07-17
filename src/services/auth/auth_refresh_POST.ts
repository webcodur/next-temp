'use server';

import { fetchDefault } from '../fetchClient';

export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * 토큰 갱신 Server Action
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