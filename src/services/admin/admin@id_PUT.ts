'use client';
import { fetchDefault } from '../fetchClient';
import { UpdateAdminRequest } from '@/types/admin';
import { camelToSnake, snakeToCamel } from '@/utils/caseConverter';

// 관리자 계정 정보를 수정한다 (UpdateAdminDto 기준)
export async function updateAdmin(
  data: UpdateAdminRequest
) {
  const {
    id,
    name,
    email,
    phone,
    password,
    roleId
  } = data;

  // 요청 데이터에서 id는 제외하고 변환
  const requestBody = camelToSnake({
    name,
    email,
    phone,
    password,
    roleId
  });

  const response = await fetchDefault(`/admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(requestBody), // 🔥 camelCase → snake_case 변환
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 계정 수정 실패(코드): ${response.status}`;
    console.log(errorMsg);
    return {
      success: false,
      errorMsg: errorMsg,
    };
  }
  
  return {
    success: true,
    data: snakeToCamel(result), // 🔥 snake_case → camelCase 변환
  };
} 