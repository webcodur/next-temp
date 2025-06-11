'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarSearch } from '@/components/layout/sidebar/hooks';

/**
 * 사이드바 검색바 컴포넌트
 * - 현장 검색 기능을 제공하는 입력 필드
 * - 검색어 입력, 초기화, 실행 기능 포함
 * - 키보드 단축키(Enter) 지원
 */

// #region 검색대 컴포넌트
export function SearchBar() {
	// 검색 상태 및 핸들러 관리
	const {
		searchQuery,
		isSearchActive,
		handleSearchChange,
		handleSearchClear,
		handleSearchSubmit,
	} = useSidebarSearch();

	/**
	 * 키보드 이벤트 처리
	 * - Enter 키 입력 시 검색 실행
	 */
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearchSubmit();
		}
	};

	return (
		<div className="relative flex items-center">
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/70 pointer-events-none" />
			<input
				type="text"
				placeholder="현장 검색"
				value={searchQuery}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					handleSearchChange(e.target.value)
				}
				onKeyDown={handleKeyDown}
				className="w-full h-8 pl-9 pr-9 text-sm rounded-md outline-none select-text neu-flat text-foreground placeholder:text-muted-foreground bg-card/80 border-border/70"
			/>
			{isSearchActive && (
				<Button
					variant="ghost"
					size="sm"
					onClick={handleSearchClear}
					className="neu-raised absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-sm"
					title="검색 지우기">
					<X className="w-3.5 h-3.5 text-muted-foreground" />
				</Button>
			)}
		</div>
	);
}
// #endregion
