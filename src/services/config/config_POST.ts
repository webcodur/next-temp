'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateSystemConfigRequest, SystemConfig } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface CreateSystemConfigServerRequest {
  key: string;
  value: string | number | boolean | object;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
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
function clientToServer(client: CreateSystemConfigRequest): CreateSystemConfigServerRequest {
  return {
    key: client.key,
    value: client.value,
    description: client.description,
    type: client.type,
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
 * 새로운 시스템 설정을 생성한다
 * @param data 생성할 설정 데이터
 * @returns 생성된 설정값 정보 (SystemConfig)
 */
export async function createConfig(data: CreateSystemConfigRequest) {
  const serverRequest = clientToServer(data);

  const response = await fetchDefault('/configs', {
    method: 'POST',
    body: JSON.stringify(serverRequest),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `설정값 생성 실패(코드): ${response.status}`;
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