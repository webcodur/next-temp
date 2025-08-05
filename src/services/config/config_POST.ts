'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateSystemConfigRequest, SystemConfig } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface CreateSystemConfigServerRequest {
  config_key: string;
  config_value: string;
  description?: string;
  config_type: 'BOOLEAN' | 'INTEGER' | 'STRING' | 'JSON';
}

interface SystemConfigServerResponse {
  id: number;
  config_key: string;
  config_value: string;
  description?: string | null;
  config_type: 'BOOLEAN' | 'INTEGER' | 'STRING' | 'JSON';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  category?: string | null;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
function clientToServer(client: CreateSystemConfigRequest): CreateSystemConfigServerRequest {
  // 클라이언트 타입을 서버 타입으로 변환
  let serverType: 'BOOLEAN' | 'INTEGER' | 'STRING' | 'JSON';
  switch (client.type) {
    case 'boolean':
      serverType = 'BOOLEAN';
      break;
    case 'number':
      serverType = 'INTEGER';
      break;
    case 'json':
      serverType = 'JSON';
      break;
    case 'string':
    default:
      serverType = 'STRING';
      break;
  }

  // 클라이언트 값을 문자열로 변환하여 서버에 전송
  let stringValue: string;
  if (typeof client.value === 'object') {
    stringValue = JSON.stringify(client.value);
  } else {
    stringValue = String(client.value);
  }

  return {
    config_key: client.key,
    config_value: stringValue,
    description: client.description,
    config_type: serverType,
  };
}

function serverToClient(server: SystemConfigServerResponse): SystemConfig {
  // config_value (문자열)을 config_type에 따라 적절한 타입으로 변환
  let parsedValue: string | number | boolean | object = server.config_value;
  
  switch (server.config_type) {
    case 'BOOLEAN':
      parsedValue = server.config_value === 'true';
      break;
    case 'INTEGER':
      parsedValue = parseInt(server.config_value, 10);
      break;
    case 'JSON':
      try {
        parsedValue = JSON.parse(server.config_value);
      } catch {
        parsedValue = server.config_value; // 파싱 실패시 원본 문자열 유지
      }
      break;
    case 'STRING':
    default:
      parsedValue = server.config_value;
      break;
  }

  return {
    id: server.id,
    key: server.config_key,
    value: parsedValue,
    description: server.description,
    type: server.config_type,
    isActive: server.is_active,
    category: server.category,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
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