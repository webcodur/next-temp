/**
 * @path src/services/notice/notice@id_PUT.ts
 * @description 공지사항 수정 API
 */

import { fetchClient } from '@/services/fetchClient';
import { Notice, NoticeUpdateDto } from '@/types/notice';

export async function updateNotice(id: number, data: NoticeUpdateDto) {
  return fetchClient<Notice>(`/notice/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}