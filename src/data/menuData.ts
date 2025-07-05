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
//  언어팩 시스템 사용: 메뉴_{key} 형태로 텍스트 제공
export const menuData: MenuData = {
	parking: {
		icon: Car,
		key: 'parking',
		midItems: {
			facility: {
				key: 'facility',
				botItems: [
					{
						key: 'info',
						href: '/parking/facility/info',
					},
					{
						key: 'staff',
						href: '/parking/facility/staff',
					},
					{
						key: '',
						href: '/parking/facility/policy',
					},
				],
			},
			users: {
				key: 'users',
				botItems: [
					{
						key: 'entry-exit',
						href: '/parking/users/entry-exit',
					},
					{
						key: 'vehicle-registration',
						href: '/parking/users/vehicle-registration',
					},
					{
						key: 'visitors',
						href: '/parking/users/visitors',
					},
					{
						key: 'households',
						href: '/parking/users/households',
					},
					{
						key: 'blacklist',
						href: '/parking/users/blacklist',
					},
				],
			},
			stores: {
				key: 'stores',
				botItems: [
					{
						key: 'status',
						href: '/parking/stores/status',
					},
				],
			},
			security: {
				key: 'security',
				botItems: [
					{
						key: 'patrol-log',
						href: '/parking/security/patrol-log',
					},
					{
						key: 'patrol-config',
						href: '/parking/security/patrol-config',
					},
				],
			},
			payment: {
				key: 'payment',
				botItems: [
					{
						key: 'discounts',
						href: '/parking/payment/discounts',
					},
					{
						key: 'settlement',
						href: '/parking/payment/settlement',
					},
					{
						key: 'billing',
						href: '/parking/payment/billing',
					},
				],
			},
		},
	},
	community: {
		icon: Building2,
		key: 'community',
		midItems: {
			facilities: {
				key: 'facilities',
				botItems: [
					{
						key: 'registration',
						href: '/community/facilities/registration',
					},
					{
						key: 'reservations',
						href: '/community/facilities/reservations',
					},
					{
						key: 'access',
						href: '/community/facilities/access',
					},
					{
						key: 'settlement',
						href: '/community/facilities/settlement',
					},
				],
			},
			communication: {
				key: 'communication',
				botItems: [
					{
						key: 'board',
						href: '/community/communication/board',
					},
					{
						key: 'suggestions',
						href: '/community/communication/suggestions',
					},
				],
			},
			services: {
				key: 'services',
				botItems: [
					{
						key: 'maintenance-fee',
						href: '/community/services/maintenance-fee',
					},
					{
						key: 'voting',
						href: '/community/services/voting',
					},
					{
						key: 'delivery',
						href: '/community/services/delivery',
					},
				],
			},
		},
	},
	announcement: {
		icon: Megaphone,
		key: 'announcement',
		midItems: {
			notices: {
				key: 'notices',
				botItems: [
					{
						key: 'general',
						href: '/announcement/notices/general',
					},
					{
						key: 'emergency',
						href: '/announcement/notices/emergency',
					},
					{
						key: 'event',
						href: '/announcement/notices/event',
					},
				],
			},
			push: {
				key: 'push',
				botItems: [
					{
						key: 'send',
						href: '/announcement/push/send',
					},
					{
						key: 'history',
						href: '/announcement/push/history',
					},
					{
						key: 'template',
						href: '/announcement/push/template',
					},
				],
			},
		},
	},
	account: {
		icon: User,
		key: 'account',
		midItems: {
			management: {
				key: 'management',
				botItems: [
					{
						key: 'users',
						href: '/account/management/users',
					},
					{
						key: 'roles',
						href: '/account/management/roles',
					},
					{
						key: 'groups',
						href: '/account/management/groups',
					},
				],
			},
			security: {
				key: 'security',
				botItems: [
					{
						key: 'password-policy',
						href: '/account/security/password-policy',
					},
					{
						key: 'login-history',
						href: '/account/security/login-history',
					},
					{
						key: 'session',
						href: '/account/security/session',
					},
				],
			},
		},
	},
	settings: {
		icon: Settings,
		key: 'settings',
		midItems: {
			system: {
				key: 'system',
				botItems: [
					{
						key: 'general',
						href: '/settings/system/general',
					},
					{
						key: 'database',
						href: '/settings/system/database',
					},
					{
						key: 'backup',
						href: '/settings/system/backup',
					},
					{
						key: 'logs',
						href: '/settings/system/logs',
					},
				],
			},
			preferences: {
				key: 'preferences',
				botItems: [
					{
						key: 'theme',
						href: '/settings/preferences/theme',
					},
					{
						key: 'language',
						href: '/settings/preferences/language',
					},
					{
						key: 'notifications',
						href: '/settings/preferences/notifications',
					},
				],
			},
			integration: {
				key: 'integration',
				botItems: [
					{
						key: 'api',
						href: '/settings/integration/api',
					},
					{
						key: 'webhooks',
						href: '/settings/integration/webhooks',
					},
					{
						key: 'external-services',
						href: '/settings/integration/external-services',
					},
				],
			},
		},
	},
	lab: {
		icon: FlaskConical,
		key: 'lab',
		midItems: {
			'ui-layout': {
				key: 'ui-layout',
				botItems: [
					{
						key: 'container',
						href: '/lab/ui-layout/container',
					},
					{
						key: 'dialog',
						href: '/lab/ui-layout/dialog',
					},
					{
						key: 'overlay',
						href: '/lab/ui-layout/overlay',
					},
					{
						key: 'sidebar',
						href: '/lab/ui-layout/sidebar',
					},
				],
			},
			'ui-input': {
				key: 'ui-input',
				botItems: [
					{
						key: 'field',
						href: '/lab/ui-input/field',
					},
					{
						key: 'form',
						href: '/lab/ui-input/form',
					},
					{
						key: 'validation',
						href: '/lab/ui-input/validation',
					},
				],
			},
			'ui-navigation': {
				key: 'ui-navigation',
				botItems: [
					{
						key: 'breadcrumb',
						href: '/lab/ui-navigation/breadcrumb',
					},
					{
						key: 'tabs',
						href: '/lab/ui-navigation/tabs',
					},
					{
						key: 'stepper',
						href: '/lab/ui-navigation/stepper',
					},
					{
						key: 'dropdown',
						href: '/lab/ui-navigation/dropdown',
					},
				],
			},
			'ui-data': {
				key: 'ui-data',
				botItems: [
					{
						key: 'table',
						href: '/lab/ui-data/table',
					},
					{
						key: 'pagination',
						href: '/lab/ui-data/pagination',
					},
					{
						key: 'infinite-scroll',
						href: '/lab/ui-data/infinite-scroll',
					},
					{
						key: 'list-highlight-marker',
						href: '/lab/ui-data/list-highlight-marker',
					},
					{
						key: 'timeline',
						href: '/lab/ui-data/timeline',
					},
				],
			},
			'ui-effects': {
				key: 'ui-effects',
				botItems: [
					{
						key: 'flip-text',
						href: '/lab/ui-effects/flip-text',
					},
					{
						key: 'morphing-text',
						href: '/lab/ui-effects/morphing-text',
					},
					{
						key: 'drag-and-drop',
						href: '/lab/ui-effects/drag-and-drop',
					},
					{
						key: 'avatar',
						href: '/lab/ui-effects/avatar',
					},
					{
						key: 'badge',
						href: '/lab/ui-effects/badge',
					},
					{
						key: 'button',
						href: '/lab/ui-effects/button',
					},
					{
						key: 'tooltip',
						href: '/lab/ui-effects/tooltip',
					},
					{
						key: 'toast',
						href: '/lab/ui-effects/toast',
					},
				],
			},
			'ui-3d': {
				key: 'ui-3d',
				botItems: [
					{
						key: 'barrier-3d',
						href: '/lab/ui-3d/barrier-3d',
					},
					{
						key: 'threejs-basics',
						href: '/lab/ui-3d/threejs-basics',
					},
					{
						key: 'threejs-geometries',
						href: '/lab/ui-3d/threejs-geometries',
					},
					{
						key: 'threejs-materials-lights',
						href: '/lab/ui-3d/threejs-materials-lights',
					},
					{
						key: 'threejs-animations',
						href: '/lab/ui-3d/threejs-animations',
					},
					{
						key: 'threejs-interactions',
						href: '/lab/ui-3d/threejs-interactions',
					},
					{
						key: 'threejs-advanced',
						href: '/lab/ui-3d/threejs-advanced',
					},
				],
			},
			'system-testing': {
				key: 'system-testing',
				botItems: [
					{
						key: 'font-test',
						href: '/lab/system-testing/font-test',
					},
					{
						key: 'i18n-test',
						href: '/lab/system-testing/i18n-test',
					},
					{
						key: 'rtl-demo',
						href: '/lab/system-testing/rtl-demo',
					},
					{
						key: 'license-plate',
						href: '/lab/system-testing/license-plate',
					},
					{
						key: 'theme-test',
						href: '/lab/system-testing/theme-test',
					},
				],
			},
		},
	},
};
