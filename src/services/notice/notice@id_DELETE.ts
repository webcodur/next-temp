/**
 * @path src/services/notice/notice@id_DELETE.ts
 * @description 공지사항 삭제 API
 */

import { fetchClient } from '@/services/fetchClient';

export async function deleteNotice(id: number) {
  return fetchClient<void>(`/notice/${id}`, {
    method: 'DELETE',
  });
}