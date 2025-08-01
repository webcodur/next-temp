/**
 * @path src/services/notice/notice$_GET.ts
 * @description 공지사항 목록 조회 API
 */

import { fetchClient } from '@/services/fetchClient';
import { Notice, NoticeSearchParams } from '@/types/notice';

interface NoticeListResponse {
  data: Notice[];
  total: number;
  page: number;
  limit: number;
}

export async function searchNotices(params?: NoticeSearchParams) {
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });
  }

  const queryString = queryParams.toString();
  const url = `/notice${queryString ? `?${queryString}` : ''}`;

  return fetchClient<NoticeListResponse>(url, {
    method: 'GET',
  });
}