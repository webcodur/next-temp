import { AppBoard, ENUM_APP_BOARD_STATUS } from '@/types/appBoard';

// 목업 앱 게시판 데이터
export const mockAppBoardData: AppBoard[] = [
  {
    id: 1,
    title: '앱 서비스 이용안내',
    content: `앱 서비스 이용에 관한 상세 안내입니다.

1. 앱 다운로드 및 설치
   - iOS: App Store에서 검색
   - Android: Google Play에서 검색

2. 회원가입 및 로그인
   - 휴대폰 번호 인증을 통한 간편 가입
   - 기존 계정으로 로그인 가능

3. 주요 기능
   - 실시간 주차 현황 확인
   - 예약 및 결제 기능
   - 이용 내역 조회

4. 문의사항
   - 고객센터: 1588-1234
   - 이메일: support@parkinghub.com`,
    category: 'guide',
    status: ENUM_APP_BOARD_STATUS.PUBLISHED,
    viewCount: 1245,
    authorName: '관리자',
    authorId: 1,
    isFixed: true,
    createdAt: '2024-01-15T09:00:00.000Z',
    updatedAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 2,
    title: '2024년 1월 업데이트 안내',
    content: `앱 버전 2.1.0 업데이트 내용을 안내드립니다.

개선사항:
- 주차 예약 시스템 성능 향상
- UI/UX 개선
- 결제 시스템 안정성 강화

버그 수정:
- 간헐적 로그인 오류 해결
- 알림 설정 버그 수정

새로운 기능:
- 다크모드 지원
- 즐겨찾기 기능 추가`,
    category: 'update',
    status: ENUM_APP_BOARD_STATUS.PUBLISHED,
    viewCount: 856,
    authorName: '개발팀',
    authorId: 2,
    isFixed: false,
    createdAt: '2024-01-20T14:30:00.000Z',
    updatedAt: '2024-01-20T14:30:00.000Z',
  },
  {
    id: 3,
    title: '[이벤트] 신규 가입 이벤트',
    content: `신규 가입 고객을 위한 특별 이벤트를 진행합니다!

이벤트 기간: 2024.01.01 ~ 2024.01.31
참여 방법: 
1. 앱 다운로드 후 회원가입
2. 본인 인증 완료
3. 첫 주차 이용

혜택:
- 첫 주차 50% 할인
- 추가 포인트 1,000P 적립

※ 중복 혜택 불가
※ 타 이벤트와 중복 적용 불가`,
    category: 'event',
    status: ENUM_APP_BOARD_STATUS.PUBLISHED,
    viewCount: 2134,
    authorName: '마케팅팀',
    authorId: 3,
    isFixed: false,
    createdAt: '2024-01-05T10:00:00.000Z',
    updatedAt: '2024-01-05T10:00:00.000Z',
  },
  {
    id: 4,
    title: '임시 저장 게시글',
    content: '아직 작성 중인 게시글입니다.',
    category: 'general',
    status: ENUM_APP_BOARD_STATUS.DRAFT,
    viewCount: 0,
    authorName: '작성자',
    authorId: 4,
    isFixed: false,
    createdAt: '2024-01-25T16:45:00.000Z',
    updatedAt: '2024-01-25T16:45:00.000Z',
  },
];

// 목업 데이터를 반환하는 유틸 함수들
export const getAppBoardList = (filters?: {
  title?: string;
  category?: string;
  status?: ENUM_APP_BOARD_STATUS;
  authorName?: string;
}): AppBoard[] => {
  let filteredData = [...mockAppBoardData];

  if (filters) {
    if (filters.title) {
      filteredData = filteredData.filter(item => 
        item.title.toLowerCase().includes(filters.title!.toLowerCase())
      );
    }
    if (filters.category) {
      filteredData = filteredData.filter(item => item.category === filters.category);
    }
    if (filters.status) {
      filteredData = filteredData.filter(item => item.status === filters.status);
    }
    if (filters.authorName) {
      filteredData = filteredData.filter(item => 
        item.authorName.toLowerCase().includes(filters.authorName!.toLowerCase())
      );
    }
  }

  return filteredData.sort((a, b) => {
    // 고정 게시글을 먼저 보여주고, 그 다음은 최신순
    if (a.isFixed && !b.isFixed) return -1;
    if (!a.isFixed && b.isFixed) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getAppBoardById = (id: number): AppBoard | undefined => {
  return mockAppBoardData.find(item => item.id === id);
};

export const getNextAppBoardId = (): number => {
  return Math.max(...mockAppBoardData.map(item => item.id)) + 1;
};
