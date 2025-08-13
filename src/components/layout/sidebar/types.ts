import { LucideIcon } from 'lucide-react';

/**
 * 사이드바 관련 타입 정의 파일
 * - 메뉴 구조, 상태, 검색 관련 타입들을 정의
 * - 3단계 메뉴 구조: Top > Mid > Bot
 * - 언어팩 시스템 사용으로 다국어 텍스트는 key를 통해 처리
 */

// #region 사이드바 메뉴 타입 정의
/**
 * 최하위 메뉴 아이템 (Bot Menu)
 * - 실제 페이지로 이동하는 링크 메뉴
 */
export interface BotMenu {
	id?: number; // API에서 받은 메뉴 ID (DND 순서 변경용)
	key: string; // 메뉴 키 (고유 식별자, 언어팩 키로 사용)
	href: string; // 페이지 경로
	icon?: LucideIcon; // 아이콘 (선택사항)
}

/**
 * 중간 단계 메뉴 (Mid Menu)
 * - Bot 메뉴들을 그룹화하는 카테고리
 * - 메뉴 키는 객체의 키로 사용 (언어팩 키로 활용)
 */
export interface MidMenu {
	id?: number; // API에서 받은 메뉴 ID (DND 순서 변경용)
	icon?: LucideIcon; // 아이콘 (선택사항)
	botItems: BotMenu[]; // 하위 Bot 메뉴 목록
}

/**
 * 최상위 메뉴 아이템 (Top Item)
 * - 사이드바 좌측에 표시되는 메인 카테고리
 * - 메뉴 키는 객체의 키로 사용 (언어팩 키로 활용)
 */
export interface TopItem {
	icon: LucideIcon; // 메뉴 아이콘 (필수)
	midItems: Record<string, MidMenu>; // 하위 Mid 메뉴 목록 (키-값 쌍)
}

/**
 * 전체 메뉴 데이터 구조
 * - Top 메뉴들을 키-값 쌍으로 관리
 */
export interface MenuData {
	[key: string]: TopItem;
}
// #endregion

// #region 사이드바 상태 타입
/**
 * 사이드바 전체 상태 관리 타입
 * - 현재 선택된 메뉴와 UI 상태를 포함
 */
export interface SidebarState {
	topMenu: string; // 현재 선택된 Top 메뉴 키
	midMenu: string; // 현재 선택된 Mid 메뉴 키
	midExpanded: Set<string>; // 펼쳐진 Mid 메뉴들의 키 집합
	isCollapsed: boolean; // 사이드바 접힘 상태
}
// #endregion

// #region 검색 타입 정의
/**
 * 사이드바 검색 기능 상태 타입
 * - 현장 검색 입력과 활성화 상태 관리
 */
export interface SearchState {
	query: string; // 검색 쿼리 문자열
	isActive: boolean; // 검색 활성화 상태 (입력값 존재 여부)
}
// #endregion
