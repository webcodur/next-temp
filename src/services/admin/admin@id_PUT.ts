'use client';
import { fetchDefault } from '@/services/fetchClient';
import { UpdateAdminRequest } from '@/types/admin';

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

  // 요청 데이터에서 id는 제외하고 전송
  const requestBody = {
    name,
    email,
    phone,
    password,
    roleId
  };

  const response = await fetchDefault(`/admin/${id}`, {
    method: 'PUT',
    body: JSON.stringify(requestBody), // 🔥 자동 변환됨 (camelCase → snake_case)
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
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase)
  };
} 