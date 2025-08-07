/*
  파일명: DetailPanel.tsx
  기능: 선택된 노드의 상세 정보를 표시하는 패널 컴포넌트
  책임: 각 조직도 요소의 기능과 관련 페이지들을 설명한다.
*/

// #region 타입
interface DetailContent {
  title: string;
  description: string;
  functions: {
    name: string;
    description: string;
    pages: {
      type: 'list' | 'detail' | 'create';
      name: string;
      features: string[];
    }[];
  }[];
}

interface DetailPanelProps {
  selectedNodeId?: string;
}
// #endregion

// #region 상수
const DETAIL_CONTENTS: Record<string, DetailContent> = {
  building: {
    title: '건물 관리',
    description: '아파트 단지 전체의 물리적 구조와 시설을 관리하는 최상위 단위입니다.',
    functions: [
      {
        name: '건물 정보 관리',
        description: '건물의 기본 정보와 구조를 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '전체 목록 페이지',
            features: ['건물 목록 조회', '건물 검색', '건물 삭제']
          },
          {
            type: 'detail',
            name: '상세 항목 페이지',
            features: ['건물 상세 정보 조회', '건물 정보 수정', '건물 삭제']
          }
        ]
      }
    ]
  },
  
  parking: {
    title: '주차장 관리',
    description: '건물 내 주차 공간과 차량 출입을 관리하는 단위입니다.',
    functions: [
      {
        name: '주차 공간 관리',
        description: '주차 구역과 주차 공간을 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '주차구역 목록 페이지',
            features: ['주차구역 조회', '공간 할당 현황', '이용률 통계']
          },
          {
            type: 'detail',
            name: '주차구역 상세 페이지',
            features: ['구역별 상세 정보', '실시간 주차 현황', '구역 설정 변경']
          }
        ]
      },
      {
        name: '차량 출입 관리',
        description: '차량의 주차장 출입을 관리하고 모니터링합니다.',
        pages: [
          {
            type: 'list',
            name: '출입 이력 페이지',
            features: ['차량 출입 기록', '위반 차량 감지', '출입 통계']
          }
        ]
      }
    ]
  },
  
  facility: {
    title: '공용시설 관리',
    description: '커뮤니티 시설 및 공용 공간의 예약과 이용을 관리하는 단위입니다.',
    functions: [
      {
        name: '시설 정보 관리',
        description: '공용시설의 기본 정보와 이용 규칙을 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '시설 목록 페이지',
            features: ['시설 목록 조회', '시설 검색', '이용 현황']
          },
          {
            type: 'detail',
            name: '시설 상세 페이지',
            features: ['시설 상세 정보', '시설 정보 수정', '이용 규칙 설정']
          }
        ]
      },
      {
        name: '예약 관리',
        description: '공용시설의 예약과 이용 일정을 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '예약 현황 페이지',
            features: ['예약 목록 조회', '예약 승인/거부', '예약 통계']
          },
          {
            type: 'create',
            name: '예약 등록 페이지',
            features: ['새 예약 등록', '예약 정보 입력', '이용 약관 동의']
          }
        ]
      }
    ]
  },
  
  room: {
    title: '호실 관리',
    description: '각 세대별 주거 공간의 정보와 상태를 관리하는 단위입니다.',
    functions: [
      {
        name: '호실 정보 관리',
        description: '호실의 기본 정보와 상태를 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '전체 목록 페이지',
            features: ['호실 목록 조회', '호실 검색', '호실 삭제']
          },
          {
            type: 'detail',
            name: '상세 항목 페이지',
            features: ['호실 상세 정보 조회', '호실 정보 수정', '호실 삭제']
          }
        ]
      }
    ]
  },
  
  organization: {
    title: '조직 관리',
    description: '입주세대를 논리적으로 그룹화하여 관리하는 조직 단위입니다.',
    functions: [
      {
        name: '입주세대 관리',
        description: '실제 거주하는 세대들의 정보를 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '전체 목록 페이지',
            features: ['세대 목록 조회', '세대 검색', '세대 삭제']
          },
          {
            type: 'detail',
            name: '상세 항목 페이지',
            features: ['세대 상세 정보 조회', '세대 정보 수정', '세대 삭제']
          },
          {
            type: 'create',
            name: '세대 등록 페이지',
            features: ['새 세대 등록', '입주 정보 입력', '계약 정보 관리']
          }
        ]
      }
    ]
  },
  
  person: {
    title: '입주민 관리',
    description: '실제 거주하는 개별 입주민의 정보와 권한을 관리합니다.',
    functions: [
      {
        name: '입주민 정보 관리',
        description: '개별 입주민의 개인정보와 거주 상태를 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '전체 목록 페이지',
            features: ['입주민 목록 조회', '입주민 검색', '입주민 삭제']
          },
          {
            type: 'detail',
            name: '상세 항목 페이지',
            features: ['입주민 상세 정보 조회', '입주민 정보 수정', '권한 관리']
          }
        ]
      },
      {
        name: '출입 관리',
        description: '입주민의 출입 권한과 이력을 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '출입 이력 페이지',
            features: ['출입 기록 조회', '출입 권한 설정', '이상 출입 감지']
          }
        ]
      }
    ]
  },
  
  vehicle: {
    title: '차량 관리',
    description: '입주민이 소유한 차량의 정보와 주차 관련 사항을 관리합니다.',
    functions: [
      {
        name: '차량 등록 관리',
        description: '입주민 소유 차량의 등록과 정보를 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '전체 목록 페이지',
            features: ['차량 목록 조회', '차량 검색', '차량 삭제']
          },
          {
            type: 'detail',
            name: '상세 항목 페이지',
            features: ['차량 상세 정보 조회', '차량 정보 수정', '소유자 변경']
          }
        ]
      },
      {
        name: '주차 관리',
        description: '차량의 주차 공간 할당과 이용 현황을 관리합니다.',
        pages: [
          {
            type: 'list',
            name: '주차 현황 페이지',
            features: ['주차 공간 조회', '주차 이력 확인', '위반 차량 관리']
          }
        ]
      }
    ]
  }
};

const getPageTypeIcon = (type: 'list' | 'detail' | 'create') => {
  switch (type) {
    case 'list':
      return '📋';
    case 'detail':
      return '📄';
    case 'create':
      return '➕';
    default:
      return '📄';
  }
};

const getPageTypeName = (type: 'list' | 'detail' | 'create') => {
  switch (type) {
    case 'list':
      return '목록';
    case 'detail':
      return '상세';
    case 'create':
      return '생성';
    default:
      return '페이지';
  }
};
// #endregion

// #region 렌더링
export function DetailPanel({ selectedNodeId }: DetailPanelProps) {
  const content = selectedNodeId ? DETAIL_CONTENTS[selectedNodeId] : null;
  
  if (!content) {
    return (
      <div className="p-6 rounded-lg border bg-card border-border">
        <h3 className="mb-4 text-lg font-semibold">상세 정보</h3>
        <div className="py-12 text-center text-muted-foreground">
          <div className="mb-4 text-4xl">👈</div>
          <p>왼쪽 다이어그램에서 항목을 클릭하면</p>
          <p>해당 요소의 상세 정보가 표시됩니다.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 rounded-lg border bg-card border-border">
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">{content.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{content.description}</p>
        </div>
        
        {/* 기능별 그룹 */}
        <div className="space-y-6">
          {content.functions.map((func, funcIndex) => (
            <div key={funcIndex} className="space-y-4">
              {/* 기능 제목 */}
              <div className="pl-4 border-l-4 border-primary">
                <h4 className="font-semibold text-foreground">{func.name}</h4>
                <p className="text-sm text-muted-foreground">{func.description}</p>
              </div>
              
              {/* 페이지 목록 */}
              <div className="space-y-3">
                {func.pages.map((page, pageIndex) => (
                  <div key={pageIndex} className="p-4 rounded-lg border bg-muted/30">
                    {/* 페이지 헤더 */}
                    <div className="flex gap-2 items-center mb-3">
                      <span className="text-lg">{getPageTypeIcon(page.type)}</span>
                      <span className="font-medium text-foreground">
                        {page.name}
                      </span>
                      <span className="px-2 py-1 text-xs rounded bg-primary/10 text-primary">
                        {getPageTypeName(page.type)}
                      </span>
                    </div>
                    
                    {/* 기능 목록 */}
                    <div className="space-y-1">
                      {page.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex gap-2 items-center text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// #endregion