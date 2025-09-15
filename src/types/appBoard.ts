// 앱 게시판 API 관련 공통 타입 정의

/**
 * 앱 게시판 기본 타입
 */
export interface AppBoard {
  id: number;
  title: string;
  content: string;
  category: string;
  status: ENUM_APP_BOARD_STATUS;
  viewCount: number;
  authorName: string;
  authorId: number;
  isFixed: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  [key: string]: unknown; // BaseTable 호환을 위한 인덱스 시그니처
}

/**
 * 앱 게시판 생성 요청 타입
 */
export interface CreateAppBoardRequest {
  title: string;
  content: string;
  category: string;
  isFixed?: boolean;
}

/**
 * 앱 게시판 수정 요청 타입
 */
export interface UpdateAppBoardRequest {
  id: number;
  title?: string;
  content?: string;
  category?: string;
  status?: ENUM_APP_BOARD_STATUS;
  isFixed?: boolean;
}

/**
 * 앱 게시판 검색 요청 타입
 */
export interface SearchAppBoardRequest {
  page?: number;
  limit?: number;
  title?: string;
  category?: string;
  status?: ENUM_APP_BOARD_STATUS;
  authorName?: string;
}

/**
 * 앱 게시판 상태 ENUM
 */
export enum ENUM_APP_BOARD_STATUS {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  HIDDEN = 'hidden',
  DELETED = 'deleted',
}

/**
 * 앱 게시판 상태 레이블
 */
export const APP_BOARD_STATUS_LABELS: Record<ENUM_APP_BOARD_STATUS, string> = {
  [ENUM_APP_BOARD_STATUS.DRAFT]: '임시저장',
  [ENUM_APP_BOARD_STATUS.PUBLISHED]: '게시중',
  [ENUM_APP_BOARD_STATUS.HIDDEN]: '숨김',
  [ENUM_APP_BOARD_STATUS.DELETED]: '삭제',
} as const;

/**
 * 앱 게시판 카테고리
 */
export const APP_BOARD_CATEGORIES = [
  { value: 'notice', label: '공지사항' },
  { value: 'event', label: '이벤트' },
  { value: 'update', label: '업데이트' },
  { value: 'guide', label: '이용안내' },
  { value: 'general', label: '일반' },
] as const;
