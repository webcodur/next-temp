'use server';

import { fetchDefault } from '../fetchClient';

/**
 * 관리자 검색
 * @param account 계정명으로 검색
 * @param name 이름으로 검색  
 * @param role_id 역할 ID로 검색
 * @param email 이메일로 검색
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 아이템 수 (기본값: 10)
 * @returns 관리자 목록과 페이지 정보
 */
export async function searchAdmin({
  account,
  name,
  role_id,
  email,
  page = 1,
  limit = 10
}: {
  account?: string;
  name?: string;
  role_id?: number;
  email?: string;
  page?: number;
  limit?: number;
} = {}) {
  // 쿼리 파라미터 처리
  const params = new URLSearchParams();
  
  if (account) params.append('account', account);
  if (name) params.append('name', name);
  if (role_id) params.append('role_id', role_id.toString());
  if (email) params.append('email', email);
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const response = await fetchDefault(`/admins/search?${params.toString()}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 검색 실패(코드): ${response.status}`
    console.log(errorMsg)
    return {
      success: false,
      errorMsg: errorMsg,
    }
  }
  
  return {
    success: true,
    data: result,
  }
} 