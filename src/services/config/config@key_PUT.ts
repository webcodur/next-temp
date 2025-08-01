'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateSystemConfigRequest, SystemConfig } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface UpdateSystemConfigServerRequest {
  value: string | number | boolean | object;
}

interface SystemConfigServerResponse {
  key: string;
  value: string | number | boolean | object;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  updated_by: number;  // snake_case
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: UpdateSystemConfigRequest): UpdateSystemConfigServerRequest {
  return {
    value: client.value,
  };
}

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
 * 설정값을 업데이트한다
 * @param key 설정값 키
 * @param data 업데이트할 설정 데이터
 * @returns 업데이트된 설정값 정보 (SystemConfig)
 */
export async function updateConfig(key: string, data: UpdateSystemConfigRequest) {
  const serverRequest = clientToServer(data);

  const response = await fetchDefault(`/configs/${key}`, {
    method: 'PUT',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `설정값 업데이트 실패(코드): ${response.status}`;
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