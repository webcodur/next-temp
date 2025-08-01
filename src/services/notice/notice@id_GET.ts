/**
 * @path src/services/notice/notice@id_GET.ts
 * @description 공지사항 상세 조회 API
 */

import { fetchClient } from '@/services/fetchClient';
import { Notice } from '@/types/notice';

export async function getNotice(id: number) {
  return fetchClient<Notice>(`/notice/${id}`, {
    method: 'GET',
  });
}