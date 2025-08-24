/**
 * 공지사항 관련 타입 정의
 * 주차 SAAS 서버의 공지사항 데이터 타입
 */

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: ENUM_NoticeCategory;
  isImportant: boolean;
  isPinned: boolean;
  viewCount: number;
  author: string;
  attachments?: NoticeAttachment[];
  tags?: string[];
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type ENUM_NoticeCategory = 'general' | 'update' | 'maintenance' | 'event' | 'emergency';

export interface NoticeAttachment {
  id: number;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedAt: string;
}

export interface NoticeSearchParams {
  page?: number;
  limit?: number;
  title?: string;
  content?: string;
  category?: ENUM_NoticeCategory;
  isImportant?: boolean;
  isPinned?: boolean;
  author?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'viewCount' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface NoticeCreateDto {
  title: string;
  content: string;
  category: ENUM_NoticeCategory;
  isImportant?: boolean;
  isPinned?: boolean;
  tags?: string[];
  startDate?: string;
  endDate?: string;
}

export type NoticeUpdateDto = Partial<NoticeCreateDto>;