import { FlaskConical, Crown, Globe, SquareParking, House, TreePalm, DollarSign } from 'lucide-react';
import type { MenuData } from '@/components/layout/sidebar/types';

//  주차장 관리 시스템 메뉴 데이터 구조
//  언어팩 시스템 사용: 메뉴_{key} 형태로 텍스트 제공
export const menuData: MenuData = {
  "종합 정보":{
    icon: Globe,
    key: '종합 정보',
    midItems: {
      "허브 정보":{
        key: '허브 정보',
        botItems: [
          {
            key: '허브 이용 안내',
            href: '/global/info/guide',
          },
          {
            key: '허브 통계',
            href: '/global/hub/statistics',
          },
        ]
      },
      "기초 정보":{
        key: '기초 정보',
        botItems: [
          {
            key: '1 - 조직도 및 통합 다이어그램',
            href: '/global/basic/overview',
          },
          {
            key: '2 - 건물 관리',
            href: '/global/basic/building',
          },
          {
            key: '3 - 공용 시설 관리',
            href: '/global/basic/facility',
          },
          {
            key: '4 - 호실 관리',
            href: '/global/basic/household',
          },
          {
            key: '5 - 입주세대 관리',
            href: '/global/basic/household-instance',
          },
          {
            key: '6 - 입주민 관리',
            href: '/global/basic/resident',
          },
          {
            key: '7 - 차량 관리',
            href: '/global/basic/vehicle',
          },
        ],
      },
    }
  },
	주차: {
		icon: SquareParking,
		key: '주차',
		midItems: {
			주차장관리: {
				key: '주차장관리',
				botItems: [
					{
						key: '주차장정보 (T)',
						href: '/parking/lot-management/info',
					},
					{
						key: '근무자관리 (R)',
						href: '/parking/lot-management/admin',
					},
					{
						key: '주차장 출입관리 (T)',
						href: '/parking/lot-management/entry',
					},
				],
			},
			이용자관리: {
				key: '이용자관리',
				botItems: [
					{
						key: '입출차관리',
						href: '/member/entryexit',
					},
					{
						key: '차량등록',
						href: '/member/member',
					},
					{
						key: '방문자관리',
						href: '/member/visitor',
					},
					{
						key: '블랙리스트',
						href: '/member/blacklist',
					},
				],
			},
			세대관리: {
				key: '세대관리',
				botItems: [
					{
						key: '통합뷰',
						href: '/parking/household-management/overview',
					},
					{
						key: '호실관리',
						href: '/parking/household-management/household',
					},
					{
						key: '입주세대관리',
						href: '/parking/household-management/household-instance',
					},
					{
						key: '입주민관리',
						href: '/parking/household-management/resident',
					},
				],
			},
			상가관리: {
				key: '상가관리',
				botItems: [
					{
						key: '점포현황',
						href: '/parking/stores/status',
					},
				],
			},
			보안순찰: {
				key: '보안순찰',
				botItems: [
					{
						key: '순찰일지',
						href: '/parking/security/patrol-log',
					},
					{
						key: '순찰설정',
						href: '/parking/security/patrol-config',
					},
				],
			},
			결제정산: {
				key: '결제정산',
				botItems: [
					{
						key: '할인권관리',
						href: '/parking/payment/discounts',
					},
					{
						key: '정산기관리',
						href: '/parking/payment/settlement',
					},
					{
						key: '결제관리',
						href: '/parking/payment/billing',
					},
				],
			},
		},
	},
	공용시설: {
		icon: House,
		key: '공용시설',
		midItems: {
			시설서비스: {
				key: '시설서비스',
				botItems: [
					{
						key: '시설상품등록',
						href: '/community/facilities/registration',
					},
					{
						key: '예약현황',
						href: '/community/facilities/reservations',
					},
					{
						key: '출입관리',
						href: '/community/facilities/access',
					},
					{
						key: '정산관리',
						href: '/community/facilities/settlement',
					},
				],
			},
			소통관리: {
				key: '소통관리',
				botItems: [
					{
						key: '일대일게시판',
						href: '/community/communication/board',
					},
					{
						key: '신문고관리',
						href: '/community/communication/suggestions',
					},
				],
			},
			생활서비스: {
				key: '생활서비스',
				botItems: [
					{
						key: '관리비',
						href: '/community/services/maintenance-fee',
					},
					{
						key: '전자투표',
						href: '/community/services/voting',
					},
					{
						key: '택배관리',
						href: '/community/services/delivery',
					},
				],
			},
		},
	},
  라이프:{
    icon: TreePalm,
    key: '라이프',
    midItems: {
      "앱 게시판":{
        key: '앱 게시판',
        botItems: [
          {
            key: '앱 게시판',
            href: '/life/board/board',
          }
        ] 
      },
      전자투표:{
        key: '전자투표',
        botItems: [
          {
            key: '선거 투표',
            href: '/life/election/election',
          },
          {
            key: '안건 투표',
            href: '/life/election/candidate',
          },
          {
            key: '설문 조사',
            href: '/life/survey/survey',
          },
        ]
      }
    }
  },
  정산:{
    icon: DollarSign,
    key: '정산',
    midItems: {
      할인권관리:{
        key: '할인권관리',
        botItems: [
          {
            key: '할인권관리',
            href: '/payment/discount/management',
          }
        ] 
      },
    }
  },
	연구소: {
		icon: FlaskConical,
		key: '연구소',
		midItems: {
			UI레이아웃: {
				key: 'UI레이아웃',
				botItems: [
					{
						key: '컨테이너',
						href: '/lab/ui-layout/container',
					},
					{
						key: '다이얼로그',
						href: '/lab/ui-layout/dialog',
					},
					{
						key: '모달',
						href: '/lab/ui-layout/modal',
					},
					{
						key: '탭',
						href: '/lab/ui-layout/tabs',
					},
					{
						key: '스테퍼',
						href: '/lab/ui-layout/stepper',
					},
					{
						key: '아코디언',
						href: '/lab/ui-layout/accordion',
					},
					{
						key: '중첩탭',
						href: '/lab/ui-layout/nested-tabs',
					},
					{
						key: '시설예약',
						href: '/lab/ui-layout/facility-reservation',
					},
					{
						key: '그리드폼',
						href: '/lab/ui-layout/grid-form',
					},
					{
						key: '섹션패널',
						href: '/lab/ui-layout/section-panel',
					},
				],
			},
			UI효과: {
				key: 'UI효과',
				botItems: [
					{
						key: '로딩',
						href: '/lab/ui-effects/loading',
					},
					{
						key: '아바타',
						href: '/lab/ui-effects/avatar',
					},
					{
						key: '뱃지',
						href: '/lab/ui-effects/badge',
					},
					{
						key: '버튼',
						href: '/lab/ui-effects/button',
					},
					{
						key: '툴팁',
						href: '/lab/ui-effects/tooltip',
					},
					{
						key: '토스트',
						href: '/lab/ui-effects/toast',
					},
					{
						key: '플립텍스트',
						href: '/lab/ui-effects/flip-text',
					},
					{
						key: '모핑텍스트',
						href: '/lab/ui-effects/morphing-text',
					},
					{
						key: '드래그드롭',
						href: '/lab/ui-effects/drag-and-drop',
					},
					{
						key: '애니메이션',
						href: '/lab/ui-effects/animation',
					},
				],
			},
			UI입력: {
				key: 'UI입력',
				botItems: [
					{
						key: '필드',
						href: '/lab/ui-input/field',
					},
					{
						key: '고급검색',
						href: '/lab/ui-input/advanced-search',
					},
					{
						key: '날짜선택',
						href: '/lab/ui-input/datepicker',
					},
					{
						key: '에디터',
						href: '/lab/ui-input/editor',
					},
					{
						key: '간단입력',
						href: '/lab/ui-input/simple-input',
					},
				],
			},
			UI데이터: {
				key: 'UI데이터',
				botItems: [
					{
						key: '테이블',
						href: '/lab/ui-data/table',
					},
					{
						key: '타임라인',
						href: '/lab/ui-data/timeline',
					},
					{
						key: '무한스크롤',
						href: '/lab/ui-data/infinite-scroll',
					},
					{
						key: '리스트하이라이트마커',
						href: '/lab/ui-data/list-highlight-marker',
					},
				],
			},
			UI_3D: {
				key: 'UI_3D',
				botItems: [
					{
						key: '차단기3D',
						href: '/lab/ui-3d/barrier-3d',
					},
				],
			},
		},
	},
	시스템관리: {
		icon: Crown,
		key: '시스템관리',
		midItems: {
			'IP 차단 관리': {
				key: 'IP 차단 관리',
				botItems: [
					{
						key: 'IP 차단 실시간 내역',
						href: '/system/ip-block-management/realtime',
					},
					{
						key: 'IP 차단 전체 히스토리',
						href: '/system/ip-block-management/history',
					},
					{
						key: 'IP 차단인자 관리',
						href: '/system/ip-block-management/config',
					},
				],
			},
			캐시관리: {
				key: '캐시관리',
				botItems: [
					{
						key: '캐시통계',
						href: '/system/cache/stats',
					},
					{
						key: '캐시관리',
						href: '/system/cache/manage',
					},
				],
			},
		},
	},
};
