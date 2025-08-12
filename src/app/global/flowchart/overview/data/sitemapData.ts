/*
  파일명: sitemapData.ts
  기능: 조직도와 실제 메뉴를 연결하는 사이트맵 데이터
  책임: 각 노드별 실제 관리 페이지와 상세 탭 정보를 제공한다.
*/

// #region 타입 정의
interface DetailTab {
  name: string;
  description: string;
}

interface MenuPage {
  name: string;
  href: string;
  description: string;
  detailTabs?: DetailTab[];
}

interface MenuCategory {
  name: string;
  description: string;
  pages: MenuPage[];
}

interface NodeSitemapData {
  nodeId: string;
  title: string;
  description: string;
  categories: MenuCategory[];
}
// #endregion

// #region 사이트맵 데이터
export const sitemapData: NodeSitemapData[] = [
  {
    nodeId: 'parking',
    title: '주차장 관리',
    description: '주차장 시설과 차량 출입을 종합적으로 관리하는 핵심 기능들입니다.',
    categories: [
      {
        name: '주차장 관리',
        description: '주차장 시설과 출입 통제 장비를 관리합니다.',
        pages: [
          {
            name: '차단기 관리',
            href: '/parking/lot/device',
            description: '주차장 출입구 차단기의 상태와 설정을 관리합니다.',
            detailTabs: [
              { name: '기본 정보', description: '차단기 위치, 모델, 상태 등 기본 정보' },
              { name: '출입 권한', description: '차단기별 차량 출입 권한 설정' },
              { name: '명령 로그', description: '차단기 제어 명령 이력 조회' },
              { name: '변경 이력', description: '차단기 설정 변경 내역 추적' }
            ]
          }
        ]
      },
      {
        name: '규정 위반',
        description: '주차장 이용 규정 위반 사항을 감지하고 관리합니다.',
        pages: [
          {
            name: '규정 위반 설정',
            href: '/parking/violation/violation-config',
            description: '주차장 이용 규정과 위반 감지 조건을 설정합니다.'
          },
          {
            name: '규정 위반 내역',
            href: '/parking/violation/history',
            description: '발생한 규정 위반 사건들의 상세 내역을 조회합니다.'
          },
          {
            name: '블랙리스트 설정',
            href: '/parking/violation/blacklist-config',
            description: '출입 제한 대상 차량의 기준과 조건을 설정합니다.'
          },
          {
            name: '블랙리스트',
            href: '/parking/violation/blacklist',
            description: '출입이 제한된 차량 목록을 관리합니다.'
          }
        ]
      }
    ]
  },
  {
    nodeId: 'room',
    title: '호실 관리',
    description: '각 세대별 주거 공간의 정보와 서비스 설정을 관리합니다.',
    categories: [
      {
        name: '입주 관리',
        description: '호실별 입주 현황과 관련 서비스를 관리합니다.',
        pages: [
          {
            name: '호실 관리',
            href: '/parking/occupancy/instance',
            description: '호실별 기본 정보와 입주 상태를 관리합니다.',
            detailTabs: [
              { name: '기본 정보', description: '호실 위치, 면적, 타입 등 기본 정보' },
              { name: '서비스 설정', description: '호실별 제공 서비스와 권한 설정' },
              { name: '방문 설정', description: '방문자 출입 규칙과 제한 사항 설정' }
            ]
          }
        ]
      }
    ]
  },
  {
    nodeId: 'person',
    title: '입주민 관리',
    description: '실제 거주하는 입주민의 정보와 거주 이력을 관리합니다.',
    categories: [
      {
        name: '입주 관리',
        description: '입주민의 개인정보와 거주 관련 사항을 관리합니다.',
        pages: [
          {
            name: '입주자 관리',
            href: '/parking/occupancy/resident',
            description: '입주민의 기본 정보와 거주 상태를 관리합니다.',
            detailTabs: [
              { name: '기본 정보', description: '입주민 성명, 연락처, 신분 등 기본 정보' },
              { name: '거주 정보', description: '현재 거주 호실과 계약 상태 정보' },
              { name: '이동 이력', description: '호실 변경과 이사 내역 추적' }
            ]
          }
        ]
      }
    ]
  },
  {
    nodeId: 'vehicle',
    title: '차량 관리',
    description: '입주민 소유 차량의 등록 정보와 연결 관계를 관리합니다.',
    categories: [
      {
        name: '입주 관리',
        description: '입주민 차량의 등록과 연결 관계를 관리합니다.',
        pages: [
          {
            name: '차량 관리',
            href: '/parking/occupancy/car',
            description: '입주민 소유 차량의 등록 정보를 관리합니다.',
            detailTabs: [
              { name: '기본 정보', description: '차량 번호, 모델, 색상 등 기본 정보' },
              { name: '호실 연결', description: '차량과 연결된 호실 정보 관리' },
              { name: '거주자 연결', description: '차량 소유자와 사용자 연결 관리' }
            ]
          }
        ]
      }
    ]
  }
];

// #region 헬퍼 함수
export const getSitemapDataByNodeId = (nodeId: string): NodeSitemapData | undefined => {
  return sitemapData.find(data => data.nodeId === nodeId);
};

export const getAllMenuPages = (): MenuPage[] => {
  return sitemapData.flatMap(node => 
    node.categories.flatMap(category => category.pages)
  );
};

export const getPageByHref = (href: string): MenuPage | undefined => {
  return getAllMenuPages().find(page => page.href === href);
};
// #endregion
