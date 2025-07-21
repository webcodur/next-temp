'use server';
import { fetchDefault } from '../fetchClient';
import { UpdateAdminRequest } from '@/types/admin';

/**
 * 관리자 계정 정보를 수정한다 (UpdateAdminDto 기준)
 * @param id 계정 ID
 * @param name 이름
 * @param email 이메일
 * @param phone 연락처
 * @param password 비밀번호
 * @param roleId 역할 ID
 * @returns 수정된 관리자 정보
 */
export async function updateAdmin(data: UpdateAdminRequest) {
  const {
    id,
    name,
    email,
    phone,
    password,
    roleId
  } = data;
  const response = await fetchDefault(`/admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      name,
      email,
      phone,
      password,
      roleId
    }),
  });

  const result = await response.json();
  
  if (!response.ok) {
    const errorMsg = result.message || `관리자 계정 수정 실패(코드): ${response.status}`
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