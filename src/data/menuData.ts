import { Car, Monitor, MonitorCog, Smartphone } from 'lucide-react';
// library-big SquareParking monitor
import type { MenuData } from '@/components/layout/sidebar/types';

//  주차장 관리 시스템 메뉴 데이터 구조
//  언어팩 시스템 사용: 메뉴_{key} 형태로 텍스트 제공
export const menuData: MenuData = {
	'메뉴_시스템관리': {
		icon: MonitorCog,
		midItems: {
			'메뉴_IP차단관리': {
				botItems: [
					{
						key: '메뉴_IP차단실시간내역',
						href: '/system/ip/realtime',
					},
					{
						key: '메뉴_IP차단전체히스토리',
						href: '/system/ip/history',
					},
				],
			},
			'메뉴_캐시관리': {
				botItems: [
					{
						key: '메뉴_캐시통계',
						href: '/system/cache/stats',
					},
					{
						key: '메뉴_캐시관리',
						href: '/system/cache/manage',
					},
				],
			},
			'메뉴_시스템설정': {
				botItems: [
					{
						key: '메뉴_시스템설정',
						href: '/system/config/settings',
					},
				],
			},
			'메뉴_에러테스트': {
				botItems: [
					{
						key: '메뉴_에러테스트',
						href: '/system/error-test',
					},
				],
			},
		},
	},
	'메뉴_종합정보': {
		icon: Monitor,
		midItems: {
			'메뉴_허브정보': {
				botItems: [
					{
						key: '메뉴_허브이용안내',
						href: '/global/info/guide',
					},
					{
						key: '메뉴_허브공지사항',
						href: '/global/info/notice',
					},
					{
						key: '메뉴_허브업데이트내역',
						href: '/global/info/update',
					},
				],
			},
			'메뉴_서비스안내도': {
				botItems: [
					{
						key: '메뉴_전체',
						href: '/global/flowchart/overview',
					},
				],
			},
			'메뉴_운영관리': {
				botItems: [
					{
						key: '메뉴_근무자관리',
						href: '/global/operation/admin',
					},
				],
			},
		},
	},
	'메뉴_주차관제': {
		icon: Car,
		midItems: {
			'메뉴_주차장관리': {
				botItems: [
					{
						key: '메뉴_차단기관리',
						href: '/parking/lot/device',
					},
				],
			},
			'메뉴_규정위반': {
				botItems: [
					{
						key: '메뉴_규정위반설정',
						href: '/parking/violation/violation-config',
					},
					{
						key: '메뉴_규정위반내역',
						href: '/parking/violation/history',
					},
					{
						key: '메뉴_블랙리스트설정',
						href: '/parking/violation/blacklist-config',
					},
					{
						key: '메뉴_블랙리스트',
						href: '/parking/violation/blacklist',
					},
				],
			},
			'메뉴_입주관리': {
				botItems: [
					{
						key: '메뉴_세대관리',
						href: '/parking/occupancy/instance',
					},
					{
						key: '메뉴_주민관리',
						href: '/parking/occupancy/user',
					},
					{
						key: '메뉴_차량관리',
						href: '/parking/occupancy/car',
					},
				],
			},
		},
	},
	'메뉴_라이프': {
		icon: Smartphone,
		midItems: {
			'메뉴_앱관리': {
				botItems: [
					{
						key: '메뉴_앱게시판',
						href: '/life/app/board',
					},
				],
			},
		},
	},
};
