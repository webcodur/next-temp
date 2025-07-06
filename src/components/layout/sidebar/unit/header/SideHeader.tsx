'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { Building2, Minus, Search } from 'lucide-react';
import {
	currentTopMenuAtom,
	currentMidMenuAtom,
	currentBotMenuAtom,
	headerCollapsedAtom,
	sidebarCollapsedAtom,
} from '@/store/sidebar';
import { userAtom } from '@/store/auth';
import SearchModal from './searchModal/SearchModal';
import {
	getHeadToggleContainerStyles,
	headToggleLeftDivider,
	getHeadToggleButtonStyles,
	toggleButtonIcon,
} from '../../sidebarStyles';
import { useTranslations, useLocale } from '@/hooks/useI18n';

/**
 * 사이드바 헤더 컴포넌트
 * - 사이드바 상단에 위치하는 헤더 영역
 * - 로고, 타이틀, 검색바, 헤드 토글 버튼을 포함
 * - 접힘/펼침 기능으로 공간 절약 가능
 */

// #region side_header: 사이드바 헤더 컴포넌트
export function SideHeader() {
	// 메뉴 상태 초기화를 위한 atom 관리
	const [, setCurrentTopMenu] = useAtom(currentTopMenuAtom);
	const [, setCurrentMidMenu] = useAtom(currentMidMenuAtom);
	const [, setCurrentBotMenu] = useAtom(currentBotMenuAtom);
	const [isHeaderCollapsed, setIsHeaderCollapsed] =
		useAtom(headerCollapsedAtom);
	const [isMainCollapsed] = useAtom(sidebarCollapsedAtom);
	const [user] = useAtom(userAtom);

	// 사용자 역할 확인
	const isAdmin = user?.role === 'admin';

	// 검색 모달 상태
	const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

	// 다국어 지원
	const t = useTranslations();
	const { isRTL } = useLocale();

	/**
	 * 로고 클릭 시 메뉴 상태 초기화
	 * - 홈으로 이동하면서 모든 메뉴 선택 해제
	 */
	const handleLogoClick = () => {
		setCurrentTopMenu('');
		setCurrentMidMenu('');
		setCurrentBotMenu('');
	};

	/**
	 * 헤드 토글 버튼 클릭 핸들러
	 */
	const handleHeadToggle = () => {
		setIsHeaderCollapsed(!isHeaderCollapsed);
	};

	/**
	 * 검색 모달 열기
	 */
	const handleSearchOpen = () => {
		setIsSearchModalOpen(true);
	};

	return (
		<div className="flex flex-col select-none">
			{/* 헤드 토글 버튼 영역 */}
			<div className={getHeadToggleContainerStyles(!isMainCollapsed)}>
				{/* 좌측 빈 공간 (메인 토글 버튼과 시각적 균형) */}
				<div className={headToggleLeftDivider}></div>

				{/* 헤드 토글 버튼 */}
				<div
					className={getHeadToggleButtonStyles()}
					onClick={handleHeadToggle}
					title={isHeaderCollapsed ? t('사이드바_헤더_펼치기') : t('사이드바_헤더_접기')}>
					<Minus className={toggleButtonIcon} />
				</div>
			</div>

			{/* 헤더 콘텐츠 - 로고 및 검색 영역 */}
			<div
				className={`neu-flat border-t border-border/30 border-b transition-all duration-300 ${
					isHeaderCollapsed
						? 'overflow-hidden p-0 max-h-0 border-t-0 border-b-0 opacity-0'
						: 'p-4 pt-3 opacity-100 max-h-[220px]'
				}`}>
				{/* 로고 영역 */}
				<div
					className={`relative flex items-center justify-center px-2 mb-3 ${isHeaderCollapsed ? 'h-0' : ''}`}>
					{/* 타이틀 영역 */}
					<div className="flex-1 flex justify-center max-w-[250px]">
						<Link
							href="/"
							onClick={handleLogoClick}
							className={`flex gap-3 justify-center items-center p-2 rounded-xl select-none neu-raised group transition-all duration-300 ${isRTL ? 'flex-row-reverse' : ''}`}>
							{/* 로고 아이콘 */}
							<div className="flex justify-center items-center shrink-0">
								<Building2 className="w-6 h-6 transition-all duration-300 text-foreground/80 group-hover:text-brand group-hover:scale-105" />
							</div>
							{/* 타이틀 텍스트 */}
							<div className="text-lg font-semibold text-foreground/90 truncate max-w-[160px] transition-colors duration-300 group-hover:text-brand/90">
								{t('사이드바_헤더_건물타이틀')}
							</div>
						</Link>
					</div>
				</div>

				{/* 검색 영역 */}
				<div className={`px-1 ${isHeaderCollapsed ? 'h-0' : ''}`}>
					{/* 검색 버튼 - 사용자 역할에 따라 텍스트 변경 */}
					<button
						onClick={handleSearchOpen}
						className={`flex gap-3 items-center p-3 w-full rounded-lg border border-border neu-flat neu-hover group ${isRTL ? 'flex-row-reverse' : ''}`}>
						<Search className={`w-4 h-4 text-muted-foreground group-hover:text-brand transition-colors duration-200 ${isRTL ? 'scale-x-[-1]' : ''}`} />
						<span className="text-sm text-muted-foreground group-hover:text-foreground font-multilang">
							{isAdmin ? t('사이드바_헤더_통합검색') : t('사이드바_헤더_메뉴검색')}
						</span>
					</button>
				</div>
			</div>

			{/* 검색 모달 */}
			<SearchModal
				isOpen={isSearchModalOpen}
				onClose={() => setIsSearchModalOpen(false)}
			/>
		</div>
	);
}
// #endregion
