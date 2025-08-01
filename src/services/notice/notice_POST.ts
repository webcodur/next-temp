/**
 * @path src/services/notice/notice_POST.ts
 * @description 공지사항 생성 API
 */

import { fetchClient } from '@/services/fetchClient';
import { Notice, NoticeCreateDto } from '@/types/notice';

export async function createNotice(data: NoticeCreateDto) {
  return fetchClient<Notice>('/notice', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}