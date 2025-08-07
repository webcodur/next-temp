import {
	Crown,
	Presentation,
  FlaskConical,
  SquareParking
} from 'lucide-react';
import type { MenuData } from '@/components/layout/sidebar/types';

//  주차장 관리 시스템 메뉴 데이터 구조
//  언어팩 시스템 사용: 메뉴_{key} 형태로 텍스트 제공
export const menuData: MenuData = {
	'종합 정보': {
		icon: Presentation,
		key: '종합 정보',
		midItems: {
			'__허브 정보': {
				key: '__허브 정보',
				botItems: [
					{
						key: '__허브 이용 안내',
						href: '/global/info/guide',
					},
					{
						key: '__허브 공지사항',
						href: '/global/info/notice',
					},
					{
						key: '__허브 업데이트 내역',
						href: '/global/info/update',
					},
				],
			},
			'__통합 정보': {
				key: '__통합 정보',
				botItems: [
					{
						key: '__1. 전체',
						href: '/global/flowchart/overview',
					},
					{
						key: '__2. 건물',
						href: '/global/flowchart/building',
					},
					{
						key: '__3. 공용 시설',
						href: '/global/flowchart/facility',
					},
					{
						key: '__4. 호실',
						href: '/global/flowchart/household',
					},
					{
						key: '__5. 입주세대',
						href: '/global/flowchart/household-instance',
					},
					{
						key: '__6. 입주민',
						href: '/global/flowchart/resident',
					},
					{
						key: '__7. 차량',
						href: '/global/flowchart/vehicle',
					},
				],
			},
      '운영 정보': {
				key: '운영 정보',
				botItems: [
					{
						key: '근무자 관리',
						href: '/global/operation/admin',
					},
				],
			},
		},
	},
	"건물 및 주차관제": {
		icon: SquareParking,
		key: '주차',
		midItems: {
			"주차장 관리": {
				key: '주차장 관리',
				botItems: [
					{
						key: '주차장 정보',
						href: '/parking/lot-management/info',
					},
					{
						key: '주차장 출입관리',
						href: '/parking/lot-management/entry',
					},
          {
            key: '차단기 관리',
            href: '/parking/lot-management/device-management',
          },
				],
			},
			"규정 위반": {
				key: '규정 위반',
				botItems: [
          {
						key: '규정 위반 설정',
						href: '/parking/violation/violation-config',
					},
					{
						key: '규정 위반 내역',
						href: '/parking/violation/history',
					},
          {
						key: '블랙리스트 설정',
						href: '/parking/violation/blacklist-config',
					},
					{
						key: '블랙리스트',
						href: '/parking/violation/blacklist',
					},
				],
			},
			'입주 관리': {
				key: '입주 관리',
				botItems: [
					{
						key: '호실 관리',
						href: '/parking/occupancy/instance',
					},
					{
						key: '입주자 관리',
						href: '/parking/occupancy/resident',
					},
          {
						key: '차량 관리',
						href: '/parking/occupancy/car',
					},
				],
			}
		},
	},
	"시스템 관리": {
		icon: Crown,
		key: '시스템 관리',
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
      '시스템 설정': {
        key: '시스템 설정',
        botItems: [
          {
            key: '시스템 설정',
            href: '/system/config/settings',
          },
        ],
      },
		},
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
};
