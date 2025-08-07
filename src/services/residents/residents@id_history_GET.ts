'use client';
import { fetchDefault } from '@/services/fetchClient';

// #region 서버 타입 정의 (내부 사용)
interface ResidentHistoryServerResponse {
  id: number;
  resident_id: number;
  instance_id: number;
  memo?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  instance: {
    id: number;
    parkinglot_id: number;
    address_1depth: string;
    address_2depth: string;
    address_3depth?: string | null;
    instance_type: string;
    memo?: string | null;
    created_at: string;
    updated_at: string;
  } | null;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: ResidentHistoryServerResponse[]) {
  // 배열이 아닌 경우 빈 배열 반환
  if (!Array.isArray(server)) {
    console.warn('거주자 이력 응답이 배열이 아닙니다:', server);
    return [];
  }
  
  return server.map(history => ({
    id: history.id,
    residentId: history.resident_id,
    instanceId: history.instance_id,
    memo: history.memo,
    createdAt: history.created_at,
    updatedAt: history.updated_at,
    deletedAt: history.deleted_at,
    instance: history.instance ? {
      id: history.instance.id,
      parkinglotId: history.instance.parkinglot_id,
      address1Depth: history.instance.address_1depth,
      address2Depth: history.instance.address_2depth,
      address3Depth: history.instance.address_3depth,
      instanceType: history.instance.instance_type,
      memo: history.instance.memo,
      createdAt: history.instance.created_at,
      updatedAt: history.instance.updated_at,
    } : null,
  }));
}
// #endregion

export async function getResidentHistory(id: number) {
  const response = await fetchDefault(`/residents/${id}/history`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `거주자 인스턴스 이동 이력 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  // 응답 데이터가 없거나 null인 경우 빈 배열로 처리
  const serverResponse = result || [];
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}
