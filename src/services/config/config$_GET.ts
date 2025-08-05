'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SystemConfig } from '@/types/api';

//#region 서버 타입 정의 (파일 내부 사용)
interface SystemConfigServerResponse {
  id: number;
  config_key: string;
  config_value: string;
  description?: string | null;
  config_type: 'BOOLEAN' | 'INTEGER' | 'STRING' | 'JSON';
  is_active: boolean;
  category?: string | null;
  created_at?: string;
  updated_at?: string;
}

interface GetAllConfigsServerResponse {
  data: SystemConfigServerResponse[];
  meta: {
    total_items: number;
    current_page: number;
    items_per_page: number;
    total_pages: number;
  };
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
    createdAt: server.created_at,
    updatedAt: server.updated_at,
  };
}
//#endregion

/**
 * 모든 설정값을 조회한다
 * @returns 모든 설정값 목록 (SystemConfig[])
 */
export async function getAllConfigs() {
  const response = await fetchDefault('/configs', {
    method: 'GET',
  });

  console.log('response!!~~', response)

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `모든 설정값 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }

  const serverResponse = result as GetAllConfigsServerResponse;
  const clientData = serverResponse.data.map(serverToClient);
  
  return {
    success: true,
    data: clientData,
    meta: {
      totalItems: serverResponse.meta.total_items,
      currentPage: serverResponse.meta.current_page,
      itemsPerPage: serverResponse.meta.items_per_page,
      totalPages: serverResponse.meta.total_pages,
    },
  };
} 