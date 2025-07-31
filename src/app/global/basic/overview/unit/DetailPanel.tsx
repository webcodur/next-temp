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
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">상세 정보</h3>
        <div className="text-center text-muted-foreground py-12">
          <div className="text-4xl mb-4">👈</div>
          <p>왼쪽 다이어그램에서 항목을 클릭하면</p>
          <p>해당 요소의 상세 정보가 표시됩니다.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">{content.title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{content.description}</p>
        </div>
        
        {/* 기능별 그룹 */}
        <div className="space-y-6">
          {content.functions.map((func, funcIndex) => (
            <div key={funcIndex} className="space-y-4">
              {/* 기능 제목 */}
              <div className="border-l-4 border-primary pl-4">
                <h4 className="font-semibold text-foreground">{func.name}</h4>
                <p className="text-sm text-muted-foreground">{func.description}</p>
              </div>
              
              {/* 페이지 목록 */}
              <div className="space-y-3">
                {func.pages.map((page, pageIndex) => (
                  <div key={pageIndex} className="bg-muted/30 rounded-lg p-4 border">
                    {/* 페이지 헤더 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{getPageTypeIcon(page.type)}</span>
                      <span className="font-medium text-foreground">
                        {page.name}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {getPageTypeName(page.type)}
                      </span>
                    </div>
                    
                    {/* 기능 목록 */}
                    <div className="space-y-1">
                      {page.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
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
        
        {/* 관계 설명 */}
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
          <h5 className="font-medium text-foreground mb-2">📋 시스템 구조</h5>
          <p className="text-sm text-muted-foreground">
            이 요소는 전체 관리 시스템의 일부로, 상위 요소에서 하위 요소로 
            계층적으로 관리되며, 각 단계별로 적절한 권한과 책임을 가집니다.
          </p>
        </div>
      </div>
    </div>
  );
}
// #endregion