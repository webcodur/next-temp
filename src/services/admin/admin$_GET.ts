'use server';
import { fetchDefault } from '../fetchClient';
import { SearchAdminRequest } from '@/types/admin';

/**
 * 쿼리 조건에 따라 관리자 계정 목록과 페이지 정보를 검색한다 (SearchAdminDto 기준)
 * @param page 페이지 번호 (기본값: 1)
 * @param limit 페이지당 항목 수 (기본값: 10)
 * @param account 계정명으로 검색
 * @param name 이름으로 검색
 * @param email 이메일로 검색
 * @param roleId roleId로 검색
 * @returns 관리자 목록과 페이지 정보
 */
export async function searchAdmin(params: SearchAdminRequest = {}) {
  const {
    page = 1,
    limit = 10,
    account,
    name,
    email,
    roleId
  } = params;
  // 쿼리 파라미터 처리
  const queryParams = new URLSearchParams();
  
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (account) queryParams.append('account', account);
  if (name) queryParams.append('name', name);
  if (email) queryParams.append('email', email);
  if (roleId) queryParams.append('roleId', roleId.toString());

  const response = await fetchDefault(`/admins/search?${queryParams.toString()}`, {
    method: 'GET',
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 계정 검색 실패(코드): ${response.status}`
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