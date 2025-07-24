'use client';
import { fetchDefault } from '../fetchClient';
import { CreateAdminRequest } from '@/types/admin';
import { snakeToCamel } from '@/utils/caseConverter';

// 새로운 관리자 계정을 생성한다 (CreateAdminDto 기준)
export async function createAdmin(
  data: CreateAdminRequest
) {
  const {
    account,
    password,
    name,
    roleId,
    email,
    phone,
    parkinglotId: bodyParkinglotId
  } = data;

  const response = await fetchDefault('/admins', {
    method: 'POST',
    body: JSON.stringify({
      account,
      password,
      name,
      roleId,
      email,
      phone,
      parkinglotId: bodyParkinglotId
    }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 계정 생성 실패(코드): ${response.status}`;
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