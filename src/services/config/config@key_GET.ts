'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SystemConfig } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface SystemConfigServerResponse {
  key: string;
  value: string | number | boolean | object;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  updated_by: number;  // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function serverToClient(server: SystemConfigServerResponse): SystemConfig {
  return {
    key: server.key,
    value: server.value,
    description: server.description,
    type: server.type,
    updatedBy: server.updated_by,
  };
}
//#endregion

/**
 * 지정된 키의 설정값을 조회한다
 * @param key 조회할 설정 키
 * @returns 설정값 정보 (SystemConfig)
 */
export async function getConfigByKey(key: string) {
  const response = await fetchDefault(`/configs/${key}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `특정 설정값 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as SystemConfigServerResponse;
  const clientData = serverToClient(serverResponse);
  
  return {
    success: true,
    data: clientData,
  };
} 