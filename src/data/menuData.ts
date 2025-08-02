import {
	FlaskConical,
	Crown,
	Globe,
	SquareParking,
	House,
	TreePalm,
	DollarSign,
} from 'lucide-react';
import type { MenuData } from '@/components/layout/sidebar/types';

//  주차장 관리 시스템 메뉴 데이터 구조
//  언어팩 시스템 사용: 메뉴_{key} 형태로 텍스트 제공
export const menuData: MenuData = {
	'__종합 정보': {
		icon: Globe,
		key: '__종합 정보',
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
		},
	},
	__주차: {
		icon: SquareParking,
		key: '__주차',
		midItems: {
			주차장관리: {
				key: '주차장관리',
				botItems: [
					{
						key: '주차장정보',
						href: '/parking/lot-management/info',
					},
					{
						key: '근무자관리',
						href: '/parking/lot-management/admin',
					},
					{
						key: '주차장 출입관리',
						href: '/parking/lot-management/entry',
					},
				],
			},
			// 차량관리 (차량 등록/수정) 정기차, 방문차, 입주차, 임대차, 블랙리스트
			__차량관리: {
				key: '__차량관리',
				botItems: [
					{
						key: '__차량등록',
						href: '/parking/cars/registration',
					},
					{
						key: '__정기차관리',
						href: '/parking/cars/regular',
					},
					{
						key: '__방문차관리',
						href: '/parking/cars/visitor',
					},
					{
						key: '__임대차관리',
						href: '/parking/cars/lease',
					},
					{
						key: '__블랙리스트',
						href: '/parking/cars/blacklist',
					},
					{
						key: '__위반 차량',
						href: '/parking/cars/violation',
					},
				],
			},
			__세대관리: {
				key: '__세대관리',
				botItems: [
					{
						key: '__통합뷰',
						href: '/parking/household-management/overview',
					},
					{
						key: '__호실관리',
						href: '/parking/household-management/household',
					},
					{
						key: '__입주세대관리',
						href: '/parking/household-management/household-instance',
					},
					{
						key: '__입주민관리',
						href: '/parking/household-management/resident',
					},
				],
			},
			__상가관리: {
				key: '__상가관리',
				botItems: [
					{
						key: '__점포현황',
						href: '/parking/stores/status',
					},
				],
			},
			__보안순찰: {
				key: '__보안순찰',
				botItems: [
					{
						key: '__순찰일지',
						href: '/parking/security/patrol-log',
					},
					{
						key: '__순찰설정',
						href: '/parking/security/patrol-config',
					},
				],
			},
			__결제정산: {
				key: '__결제정산',
				botItems: [
					{
						key: '__할인권관리',
						href: '/parking/payment/discounts',
					},
					{
						key: '__정산기관리',
						href: '/parking/payment/settlement',
					},
					{
						key: '__결제관리',
						href: '/parking/payment/billing',
					},
				],
			},
		},
	},
	__공용시설: {
		icon: House,
		key: '__공용시설',
		midItems: {
			__시설서비스: {
				key: '__시설서비스',
				botItems: [
					{
						key: '__시설상품등록',
						href: '/community/facilities/registration',
					},
					{
						key: '__예약현황',
						href: '/community/facilities/reservations',
					},
					{
						key: '__출입관리',
						href: '/community/facilities/access',
					},
					{
						key: '__정산관리',
						href: '/community/facilities/settlement',
					},
				],
			},
			__소통관리: {
				key: '__소통관리',
				botItems: [
					{
						key: '__일대일게시판',
						href: '/community/communication/board',
					},
					{
						key: '__신문고관리',
						href: '/community/communication/suggestions',
					},
				],
			},
			__생활서비스: {
				key: '__생활서비스',
				botItems: [
					{
						key: '__관리비',
						href: '/community/services/maintenance-fee',
					},
					{
						key: '__전자투표',
						href: '/community/services/voting',
					},
					{
						key: '__택배관리',
						href: '/community/services/delivery',
					},
				],
			},
		},
	},
	__라이프: {
		icon: TreePalm,
		key: '__라이프',
		midItems: {
			'__앱 게시판': {
				key: '__앱 게시판',
				botItems: [
					{
						key: '__앱 게시판',
						href: '/life/board/board',
					},
				],
			},
			__전자투표: {
				key: '__전자투표',
				botItems: [
					{
						key: '__선거 투표',
						href: '/life/election/election',
					},
					{
						key: '__안건 투표',
						href: '/life/election/candidate',
					},
					{
						key: '__설문 조사',
						href: '/life/survey/survey',
					},
				],
			},
		},
	},
	__정산: {
		icon: DollarSign,
		key: '__정산',
		midItems: {
			__할인권관리: {
				key: '__할인권관리',
				botItems: [
					{
						key: '__할인권관리',
						href: '/payment/discount/management',
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
