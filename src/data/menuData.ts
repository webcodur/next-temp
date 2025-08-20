import { Car, Monitor, MonitorCog } from 'lucide-react';
// library-big SquareParking monitor
import type { MenuData } from '@/components/layout/sidebar/types';

//  주차장 관리 시스템 메뉴 데이터 구조
//  언어팩 시스템 사용: 메뉴_{key} 형태로 텍스트 제공
export const menuData: MenuData = {
	'시스템 관리': {
		icon: MonitorCog,
		midItems: {
			'IP 차단 관리': {
				botItems: [
					{
						key: 'IP 차단 실시간 내역',
						href: '/system/ip/realtime',
					},
					{
						key: 'IP 차단 전체 히스토리',
						href: '/system/ip/history',
					},
				],
			},
			캐시관리: {
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
				botItems: [
					{
						key: '시스템 설정',
						href: '/system/config/settings',
					},
				],
			},
		},
	},
	'종합 정보': {
		icon: Monitor,
		midItems: {
			'허브 정보': {
				botItems: [
					{
						key: '허브 이용 안내',
						href: '/global/info/guide',
					},
					{
						key: '허브 공지사항',
						href: '/global/info/notice',
					},
					{
						key: '허브 업데이트 내역',
						href: '/global/info/update',
					},
				],
			},
			'서비스 안내도': {
				botItems: [
					{
						key: '전체',
						href: '/global/flowchart/overview',
					},
				],
			},
			'운영 관리': {
				botItems: [
					{
						key: '근무자 관리',
						href: '/global/operation/admin',
					},
				],
			},
		},
	},
	'주차 관제': {
		icon: Car,
		midItems: {
			'주차장 관리': {
				botItems: [
					{
						key: '차단기 관리',
						href: '/parking/lot/device',
					},
				],
			},
			'규정 위반': {
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
				botItems: [
					{
						key: '세대 관리',
						href: '/parking/occupancy/instance',
					},
					{
						key: '주민 관리',
						href: '/parking/occupancy/resident',
					},
					{
						key: '차량 관리',
						href: '/parking/occupancy/car',
					},
				],
			},
		},
	},
};
