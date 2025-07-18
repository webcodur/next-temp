import { Car, Network, Megaphone, FlaskConical } from 'lucide-react';
import type { MenuData } from '@/components/layout/sidebar/types';

//  주차장 관리 시스템 메뉴 데이터 구조
//  언어팩 시스템 사용: 메뉴_{key} 형태로 텍스트 제공
export const menuData: MenuData = {
	주차: {
		icon: Car,
		key: '주차',
		midItems: {
			시설관리: {
				key: '시설관리',
				botItems: [
					{
						key: '주차장정보',
						href: '/parking/facility/info',
					},
					{
						key: '근무자관리',
						href: '/parking/facility/staff',
					},
					{
						key: '차단기설정',
						href: '/parking/facility/barrier',
					},
					{
						key: '출입정책',
						href: '/parking/facility/entry',
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
						key: '세대관리',
						href: '/member/resident-household',
					},
					{
						key: '블랙리스트',
						href: '/member/blacklist',
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
	커뮤니티: {
		icon: Network,
		key: '커뮤니티',
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
	공지사항: {
		icon: Megaphone,
		key: '공지사항',
		midItems: {
			공지관리: {
				key: '공지관리',
				botItems: [
					{
						key: '일반공지',
						href: '/announcement/notices/general',
					},
					{
						key: '긴급공지',
						href: '/announcement/notices/emergency',
					},
					{
						key: '이벤트공지',
						href: '/announcement/notices/event',
					},
				],
			},
			푸시알림: {
				key: '푸시알림',
				botItems: [
					{
						key: '알림발송',
						href: '/announcement/push/send',
					},
					{
						key: '발송이력',
						href: '/announcement/push/history',
					},
					{
						key: '템플릿관리',
						href: '/announcement/push/template',
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
						key: '중첩탭',
						href: '/lab/ui-layout/nested-tabs',
					},
					{
						key: '아코디언',
						href: '/lab/ui-layout/accordion',
					},
					{
						key: '시설예약',
						href: '/lab/ui-layout/facility-reservation',
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
						key: '간단입력',
						href: '/lab/ui-input/simple-input',
					},
					{
						key: '에디터',
						href: '/lab/ui-input/editor',
					},
					{
						key: '날짜선택',
						href: '/lab/ui-input/datepicker',
					},
					{
						key: '고급검색',
						href: '/lab/ui-input/advanced-search',
					},
				],
			},
			UI데이터: {
				key: 'UI데이터',
				botItems: [
					{
						key: 'SmartTable',
						href: '/lab/ui-data/smrtTable',
					},
					{
						key: '무한SmartTable',
						href: '/lab/ui-data/infinite-table',
					},
					{
						key: '페이지네이션',
						href: '/lab/ui-data/pagination',
					},
					{
						key: '무한스크롤',
						href: '/lab/ui-data/infinite-scroll',
					},
					{
						key: '리스트마커',
						href: '/lab/ui-data/list-highlight-marker',
					},
					{
						key: '타임라인',
						href: '/lab/ui-data/timeline',
					},
					{
						key: '테이블',
						href: '/lab/ui-data/table',
					},
				],
			},
			UI효과: {
				key: 'UI효과',
				botItems: [
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
						key: '아바타',
						href: '/lab/ui-effects/avatar',
					},
					{
						key: '배지',
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
				],
			},
			UI3D: {
				key: 'UI3D',
				botItems: [
					{
						key: '3D차단기',
						href: '/lab/ui-3d/barrier-3d',
					},
					{
						key: '기초학습',
						href: '/lab/ui-3d/threejs-basics',
					},
					{
						key: '지오메트리',
						href: '/lab/ui-3d/threejs-geometries',
					},
					{
						key: '재질조명',
						href: '/lab/ui-3d/threejs-materials-lights',
					},
					{
						key: '애니메이션',
						href: '/lab/ui-3d/threejs-animations',
					},
					{
						key: '인터랙션',
						href: '/lab/ui-3d/threejs-interactions',
					},
					{
						key: '고급기술',
						href: '/lab/ui-3d/threejs-advanced',
					},
				],
			},
			시스템테스트: {
				key: '시스템테스트',
				botItems: [
					{
						key: '폰트테스트',
						href: '/lab/system-testing/font-test',
					},
					{
						key: '국제화테스트',
						href: '/lab/system-testing/i18n-test',
					},
					{
						key: 'RTL데모',
						href: '/lab/system-testing/rtl-demo',
					},
					{
						key: '번호판',
						href: '/lab/system-testing/license-plate',
					},
					{
						key: '테마테스트',
						href: '/lab/system-testing/theme-test',
					},
					{
						key: '자유테스트',
						href: '/lab/system-testing/playground',
					},
				],
			},
		},
	},
};
