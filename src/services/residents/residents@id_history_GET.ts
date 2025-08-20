'use client';
import { fetchDefault } from '@/services/fetchClient';

// #region 서버 타입 정의 (내부 사용)
interface ResidentHistoryServerResponse {
  resident: {
    id: number;
    name: string;
    phone: string;
    email: string;
    birth_date: string;
    gender: string;
    emergency_contact?: string | null;
    memo?: string | null;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
  };
  instanceHistory: Array<{
    id: number;
    resident_id: number;
    instance_id: number;
    memo?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
    instance: {
      id: number;
      parkinglot_id: number;
      name: string;
      address_1depth: string;
      address_2depth: string;
      address_3depth?: string | null;
      instance_type: string;
      password: string;
      memo?: string | null;
      created_at: string;
      updated_at: string;
      deleted_at?: string | null;
      parkinglot: {
        id: number;
        code: string;
        name: string;
        description?: string | null;
        created_at: string;
        updated_at: string;
        deleted_at?: string | null;
      };
    } | null;
  }>;
}
// #endregion

// #region 변환 함수 (내부 사용)
function serverToClient(server: ResidentHistoryServerResponse) {
  // 올바른 구조인지 확인
  if (!server || !server.resident || !Array.isArray(server.instanceHistory)) {
    console.warn('주민 이력 응답이 올바르지 않습니다:', server);
    return {
      resident: null,
      instanceHistory: []
    };
  }
  
  return {
    resident: {
      id: server.resident.id,
      name: server.resident.name,
      phone: server.resident.phone,
      email: server.resident.email,
      birthDate: server.resident.birth_date,
      gender: server.resident.gender,
      emergencyContact: server.resident.emergency_contact,
      memo: server.resident.memo,
      createdAt: server.resident.created_at,
      updatedAt: server.resident.updated_at,
      deletedAt: server.resident.deleted_at,
    },
    instanceHistory: server.instanceHistory.map(history => ({
      id: history.id,
      residentId: history.resident_id,
      instanceId: history.instance_id,
      memo: history.memo,
      status: history.status,
      createdAt: history.created_at,
      updatedAt: history.updated_at,
      deletedAt: history.deleted_at,
      instance: history.instance ? {
        id: history.instance.id,
        parkinglotId: history.instance.parkinglot_id,
        name: history.instance.name,
        address1Depth: history.instance.address_1depth,
        address2Depth: history.instance.address_2depth,
        address3Depth: history.instance.address_3depth,
        instanceType: history.instance.instance_type,
        password: history.instance.password,
        memo: history.instance.memo,
        createdAt: history.instance.created_at,
        updatedAt: history.instance.updated_at,
        deletedAt: history.instance.deleted_at,
        parkinglot: {
          id: history.instance.parkinglot.id,
          code: history.instance.parkinglot.code,
          name: history.instance.parkinglot.name,
          description: history.instance.parkinglot.description,
          createdAt: history.instance.parkinglot.created_at,
          updatedAt: history.instance.parkinglot.updated_at,
          deletedAt: history.instance.parkinglot.deleted_at,
        },
      } : null,
    }))
  };
}
// #endregion

export async function getResidentHistory(id: number) {
  const response = await fetchDefault(`/residents/${id}/history`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `주민 인스턴스 이동 이력 조회 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return { success: false, errorMsg };
  }
  
  // 응답 데이터가 없거나 null인 경우 기본 구조로 처리
  const serverResponse = result || { resident: null, instanceHistory: [] };
  return {
    success: true,
    data: serverToClient(serverResponse),
  };
}
