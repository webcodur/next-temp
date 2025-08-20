/*
  파일명: navigationUtils.ts
  기능: 페이지 네비게이션 관련 유틸리티 함수들
  책임: URL 패턴 분석 및 목록 페이지 URL 생성 로직
*/

/**
 * 현재 URL이 상세/편집/생성 페이지인지 확인
 * @param pathname - 현재 경로 (예: /parking/car/123, /system/settings/edit)
 * @returns 목록으로 버튼이 필요한 페이지인지 여부
 */
export function shouldShowListButton(pathname: string): boolean {
  // [id] 패턴: 숫자로 끝나는 경로 (상세 페이지)
  const hasIdPattern = /\/\d+$/.test(pathname);
  
  // 편집 페이지 패턴
  const isEditPage = pathname.endsWith('/edit');
  
  // 생성 페이지 패턴  
  const isCreatePage = pathname.endsWith('/create');

  return hasIdPattern || isEditPage || isCreatePage;
}

/**
 * 현재 경로에서 목록 페이지 URL을 생성
 * @param pathname - 현재 경로
 * @returns 목록 페이지 URL
 */
export function getListPageUrl(pathname: string): string {
  // [id] 패턴: 마지막 숫자 세그먼트 제거
  if (/\/\d+$/.test(pathname)) {
    return pathname.replace(/\/\d+$/, '');
  }
  
  // 편집 페이지: /edit 제거
  if (pathname.endsWith('/edit')) {
    return pathname.replace('/edit', '');
  }
  
  // 생성 페이지: /create 제거
  if (pathname.endsWith('/create')) {
    return pathname.replace('/create', '');
  }

  // 패턴에 맞지 않으면 그대로 반환
  return pathname;
}

/**
 * 경로 기반으로 목록 페이지 제목을 추론
 * @param pathname - 현재 경로
 * @returns 목록 페이지 제목 (한국어)
 */
export function getListPageTitle(pathname: string): string {
  const listUrl = getListPageUrl(pathname);
  const segments = listUrl.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  // 일반적인 경로명을 한국어로 매핑
  const titleMap: Record<string, string> = {
    // 주차 관제
    'admin': '관리자',
    'device': '차단기',
    'car': '차량',
    'instance': '세대',
    'resident': '입주자', 
    'blacklist': '블랙리스트',
    'history': '내역',
    'blacklist-config': '블랙리스트 설정',
    'violation-config': '규정 위반 설정',
    
    // 종합 정보
    'notice': '공지사항',
    
    // 시스템 관리
    'settings': '설정'
  };

  return titleMap[lastSegment] || '목록';
}
