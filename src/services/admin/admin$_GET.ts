'use client';
import { fetchDefault } from '@/services/fetchClient';
import { SearchAdminRequest } from '@/types/admin';

// 관리자 목록을 검색한다 (페이지네이션 및 필터링)
export async function searchAdmin({
  account,
  name,
  email,
  roleId,
  page = 1,
  limit = 10,
}: SearchAdminRequest = {}) {
  const queryParams = new URLSearchParams();
  
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (account) queryParams.append('account', account);
  if (name) queryParams.append('name', name);
  if (email) queryParams.append('email', email);
  if (roleId) queryParams.append('roleId', roleId.toString());

  const response = await fetchDefault(`/admin/search?${queryParams.toString()}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 검색 실패(코드): ${response.status}`;
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