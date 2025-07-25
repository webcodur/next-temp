'use client';
import { fetchDefault } from '@/services/fetchClient';
import { CreateAdminRequest } from '@/types/admin';

// 관리자 계정을 생성한다 (CreateAdminDto 기준)
export async function createAdmin(
  data: CreateAdminRequest
) {
  const {
    account,
    name,
    email,
    phone,
    password,
    roleId
  } = data;

  const requestBody = {
    account,
    name,
    email,
    phone,
    password,
    roleId
  };

  const response = await fetchDefault('/admin', {
    method: 'POST',
    body: JSON.stringify(requestBody), // 🔥 자동 변환됨 (camelCase → snake_case)
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
    data: result, // 🔥 자동 변환됨 (snake_case → camelCase)
  };
} 