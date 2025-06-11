import {
	Car,
	Building2,
	Megaphone,
	Settings,
	User,
	FlaskConical,
} from 'lucide-react';
import type { MenuData } from '@/components/layout/sidebar/types';

//  주차장 관리 시스템 메뉴 데이터 구조
export const menuData: MenuData = {
	parking: {
		icon: Car,
		label: '주차',
		color: 'bg-blue-500',
		midItems: {
			facility: {
				label: '시설 관리',
				botItems: [
					{
						label: '주차장 정보',
						href: '/parking/facility/info',
						description: '주차장 기본 정보 및 운영 현황 관리',
					},
					{
						label: '근무자 관리',
						href: '/parking/facility/staff',
						description: '주차장 근무자 정보 및 근무 스케줄 관리',
					},
					{
						label: '주차장 정책설정',
						href: '/parking/facility/policy',
						description: '주차 정책, 차단기, 출입 및 블랙리스트 정책 설정',
					},
				],
			},
			users: {
				label: '이용자 관리',
				botItems: [
					{
						label: '입출차 관리',
						href: '/parking/users/entry-exit',
						description: '차량 입출차 현황 및 이력 관리',
					},
					{
						label: '차량등록 관리',
						href: '/parking/users/vehicle-registration',
						description: '등록된 차량 정보 조회 및 관리',
					},
					{
						label: '방문자 관리',
						href: '/parking/users/visitors',
						description: '방문자 등록, 세대방문, 시간 연장 요청 관리',
					},
					{
						label: '세대 관리',
						href: '/parking/users/households',
						description: '입주 세대 정보 및 차량 등록 현황 관리',
					},
					{
						label: '블랙리스트 관리',
						href: '/parking/users/blacklist',
						description: '출입 제한 차량 및 이용자 관리',
					},
				],
			},
			stores: {
				label: '상가 관리',
				botItems: [
					{
						label: '점포 현황',
						href: '/parking/stores/status',
						description: '상가 점포별 주차 이용 현황 및 관리',
					},
				],
			},
			security: {
				label: '보안/순찰',
				botItems: [
					{
						label: '순찰 일지 관리',
						href: '/parking/security/patrol-log',
						description: '보안 순찰 일지 작성 및 이력 관리',
					},
					{
						label: '순찰 설정 관리',
						href: '/parking/security/patrol-config',
						description: '순찰 경로 및 스케줄 설정 관리',
					},
				],
			},
			payment: {
				label: '결제/정산',
				botItems: [
					{
						label: '할인권 관리',
						href: '/parking/payment/discounts',
						description: '할인권 발행, 사용, 구매 내역 관리',
					},
					{
						label: '정산기 관리',
						href: '/parking/payment/settlement',
						description: '사전 정산 내역 및 수동 입차 등록 관리',
					},
					{
						label: '결제 관리',
						href: '/parking/payment/billing',
						description: '요금 정책 설정 및 매출 내역 조회',
					},
				],
			},
		},
	},
	community: {
		icon: Building2,
		label: '커뮤니티',
		color: 'bg-green-500',
		midItems: {
			facilities: {
				label: '시설 서비스',
				botItems: [
					{
						label: '시설 및 상품 등록',
						href: '/community/facilities/registration',
						description: '커뮤니티 시설, 상품, 지정석 등록 및 관리',
					},
					{
						label: '예약 현황 관리',
						href: '/community/facilities/reservations',
						description: '예약, 승인, 취소, 구독 요청 현황 관리',
					},
					{
						label: '출입 관리',
						href: '/community/facilities/access',
						description: '시설 출입 내역 및 접근 권한 관리',
					},
					{
						label: '정산 관리',
						href: '/community/facilities/settlement',
						description: '시설 이용료 및 상품 판매 정산 관리',
					},
				],
			},
			communication: {
				label: '소통 관리',
				botItems: [
					{
						label: '1:1 게시판 관리',
						href: '/community/communication/board',
						description: '입주민과의 1:1 문의 및 답변 관리',
					},
					{
						label: '신문고 관리',
						href: '/community/communication/suggestions',
						description: '익명 제보 및 건의사항 접수 처리',
					},
				],
			},
			services: {
				label: '생활 서비스',
				botItems: [
					{
						label: '관리비',
						href: '/community/services/maintenance-fee',
						description: '관리비 부과 내역 및 납부 현황 관리',
					},
					{
						label: '전자투표',
						href: '/community/services/voting',
						description: '입주민 대상 전자투표 생성 및 결과 관리',
					},
				],
			},
		},
	},
	notice: {
		icon: Megaphone,
		label: '공지사항',
		color: 'bg-orange-500',
		midItems: {
			site: {
				label: '현장 공지사항',
				botItems: [
					{
						label: '현장 공지사항',
						href: '/notice/site/announcements',
						description: '현장별 공지사항 작성 및 관리',
					},
					{
						label: '현장 관련 알림',
						href: '/notice/site/alerts',
						description: '긴급 상황 및 중요 알림 발송 관리',
					},
				],
			},
			software: {
				label: '허브 공지사항',
				botItems: [
					{
						label: '공급자 공지사항',
						href: '/notice/software/provider',
						description: '허브 공급자의 공지사항 및 안내',
					},
					{
						label: '업데이트 안내',
						href: '/notice/software/updates',
						description: '시스템 업데이트 및 기능 개선 안내',
					},
				],
			},
		},
	},
	account: {
		icon: User,
		label: '계정',
		color: 'bg-purple-500',
		midItems: {
			profile: {
				label: '계정 정보',
				botItems: [
					{
						label: '개인정보',
						href: '/account/profile/personal',
						description: '개인 계정 정보 수정 및 관리',
					},
					{
						label: '보안 설정',
						href: '/account/profile/security',
						description: '비밀번호 변경 및 보안 설정',
					},
				],
			},
			activity: {
				label: '활동 내역',
				botItems: [
					{
						label: '로그인 기록',
						href: '/account/activity/login-history',
						description: '계정 로그인 이력 및 접근 기록 조회',
					},
					{
						label: '작업 이력',
						href: '/account/activity/work-history',
						description: '시스템 내 작업 및 변경 이력 조회',
					},
				],
			},
			session: {
				label: '세션 관리',
				botItems: [
					{
						label: '로그아웃',
						href: '/account/session/logout',
						description: '현재 세션 종료 및 안전한 로그아웃',
					},
				],
			},
		},
	},
	settings: {
		icon: Settings,
		label: '설정',
		color: 'bg-gray-500',
		midItems: {
			system: {
				label: '시스템 설정',
				botItems: [
					{
						label: '일반 설정',
						href: '/settings/system/general',
						description: '시스템 기본 설정 및 환경 구성',
					},
					{
						label: '보안 설정',
						href: '/settings/system/security',
						description: '보안 정책 및 접근 제어 설정',
					},
					{
						label: '연동 설정',
						href: '/settings/system/integration',
						description: 'API 연동 및 외부 서비스 설정',
					},
					{
						label: '백업 설정',
						href: '/settings/system/backup',
						description: '데이터 백업 스케줄 및 복원 관리',
					},
				],
			},
		},
	},
	lab: {
		icon: FlaskConical,
		label: '연구소',
		color: 'bg-yellow-500',
		midItems: {
			basicElements: {
				label: '기본 요소',
				botItems: [
					{
						label: 'Container',
						href: '/lab/ui-check/container',
						description: '뉴모피즘 기본 컨테이너',
					},
					{
						label: 'Button',
						href: '/lab/ui-check/button',
						description: '기본 버튼 컴포넌트',
					},
					{
						label: 'Badge',
						href: '/lab/ui-check/badge',
						description: '상태 표시 배지',
					},
					{
						label: 'Avatar',
						href: '/lab/ui-check/avatar',
						description: '사용자 아바타',
					},
					{
						label: 'Tooltip',
						href: '/lab/ui-check/tooltip',
						description: '보조 정보 팝업',
					},
					{
						label: 'Card',
						href: '/lab/ui-check/card',
						description: '정보 그룹화 컨테이너',
					},
				],
			},
			inputFeedback: {
				label: '입력 & 피드백',
				botItems: [
					{
						label: 'Field',
						href: '/lab/ui-check/field',
						description: '텍스트/선택/필터 입력',
					},
					{
						label: 'Datepicker',
						href: '/lab/ui-check/datepicker',
						description: '날짜 선택',
					},
					{
						label: 'Editor',
						href: '/lab/ui-check/editor',
						description: '마크다운 에디터',
					},
					{
						label: 'Toast',
						href: '/lab/ui-check/toast',
						description: '상태 알림 메시지',
					},
					{
						label: 'Modal',
						href: '/lab/ui-check/modal',
						description: '기본 모달 (단순 확인창)',
					},
					{
						label: 'Dialog',
						href: '/lab/ui-check/dialog',
						description: '고급 다이얼로그 (복잡한 폼/인터랙션)',
					},
				],
			},
			layoutNavigation: {
				label: '레이아웃 & 네비게이션',
				botItems: [
					{
						label: 'Tabs',
						href: '/lab/ui-check/tabs',
						description: '콘텐츠 분할/전환',
					},
					{
						label: 'Stepper',
						href: '/lab/ui-check/stepper',
						description: '단계별 진행 표시',
					},
					{
						label: 'Timeline',
						href: '/lab/ui-check/timeline',
						description: '시간순 이벤트 표시',
					},
					{
						label: 'Accordion',
						href: '/lab/ui-check/accordion',
						description: '접기/펼치기 아코디언',
					},
				],
			},
			advancedData: {
				label: '고급 & 데이터',
				botItems: [
					{
						label: 'Pagination',
						href: '/lab/ui-check/pagination',
						description: '페이지 이동',
					},
					{
						label: 'Table',
						href: '/lab/ui-check/table',
						description: '구조화된 데이터 표시',
					},
					{
						label: 'Carousel',
						href: '/lab/ui-check/carousel',
						description: '슬라이더/회전 표시',
					},
					{
						label: 'DragAndDrop',
						href: '/lab/ui-check/drag-and-drop',
						description: '드래그 앤 드롭 정렬',
					},
					{
						label: 'InfiniteScroll',
						href: '/lab/ui-check/infinite-scroll',
						description: '무한 스크롤 로딩',
					},
					{
						label: 'AdvancedSearch',
						href: '/lab/ui-check/advanced-search',
						description: '고급 검색 패널',
					},
				],
			},
			etc: {
				label: '기타',
				botItems: [
					{
						label: 'Barrier3D',
						href: '/lab/ui-check/barrier-3d',
						description: '3D 차단기 시각화',
					},
				],
			},
		},
	},
};
