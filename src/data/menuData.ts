import { FlaskConical, Construction } from 'lucide-react';
import type { MenuData } from '@/components/layout/sidebar/types';

//  주차장 관리 시스템 메뉴 데이터 구조
//  언어팩 시스템 사용: 메뉴_{key} 형태로 텍스트 제공
export const menuData: MenuData = {
	temp: {
		icon: Construction,
		key: 'temp',
		midItems: {
			시스템관리: {
				key: '시스템관리',
				botItems: [
					{
						key: '메뉴관리',
						href: '/temp/menu-management',
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
						key: 'Three.js기초',
						href: '/lab/ui-3d/threejs-basics',
					},
					{
						key: 'Three.js도형',
						href: '/lab/ui-3d/threejs-geometries',
					},
					{
						key: 'Three.js소재조명',
						href: '/lab/ui-3d/threejs-materials-lights',
					},
					{
						key: 'Three.js인터렉션',
						href: '/lab/ui-3d/threejs-interactions',
					},
					{
						key: 'Three.js애니메이션',
						href: '/lab/ui-3d/threejs-animations',
					},
					{
						key: 'Three.js고급',
						href: '/lab/ui-3d/threejs-advanced',
					},
					{
						key: '차단기3D',
						href: '/lab/ui-3d/barrier-3d',
					},
				],
			},
			시스템테스팅: {
				key: '시스템테스팅',
				botItems: [
					{
						key: '다국어테스트',
						href: '/lab/system-testing/i18n-test',
					},
					{
						key: '폰트테스트',
						href: '/lab/system-testing/font-test',
					},
					{
						key: '테마테스트',
						href: '/lab/system-testing/theme-test',
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
						key: '필드날짜선택',
						href: '/lab/system-testing/field-datepicker',
					},
					{
						key: '플레이그라운드',
						href: '/lab/system-testing/playground',
					},
				],
			},
		},
	},
};
