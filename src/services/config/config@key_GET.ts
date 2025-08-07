'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SystemConfig } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface SystemConfigServerResponse {
  id: number;
  config_key: string;
  config_value: string;
  description?: string | null;
  config_type: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  category?: string | null;
  group?: string | null;
}
//#endregion

//#region 변환 함수 (파일 내부 사용)
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
    group: server.group,
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}
//#endregion

/**
 * 지정된 키의 설정값을 조회한다
 * @param key 조회할 설정 키
 * @param parkinglotId 주차장 ID (선택사항)
 * @returns 설정값 정보 (SystemConfig)
 */
export async function getConfigByKey(key: string, parkinglotId?: string) {
  // 헤더 구성
  const headers: Record<string, string> = {};
  if (parkinglotId) {
    headers['x-parkinglot-id'] = parkinglotId;
  }

  const response = await fetchDefault(`/configs/${key}`, {
    method: 'GET',
    headers: Object.keys(headers).length > 0 ? headers : undefined,
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