import { Car, Building2, Bell, Settings } from 'lucide-react';
import type { MenuData } from '@/components/layout/sidebar/types';

// #region 주차장 관리 시스템 메뉴 데이터 구조
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
		icon: Bell,
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
			account: {
				label: '계정 설정',
				botItems: [
					{
						label: '계정정보',
						href: '/settings/account/profile',
						description: '개인 계정 정보 수정 및 관리',
					},
					{
						label: '활동내역',
						href: '/settings/account/activity',
						description: '계정 활동 이력 및 로그인 기록 조회',
					},
					{
						label: '로그아웃',
						href: '/settings/account/logout',
						description: '현재 세션 종료 및 안전한 로그아웃',
					},
				],
			},
		},
	},
};
// #endregion
