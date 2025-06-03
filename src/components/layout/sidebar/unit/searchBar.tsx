'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebarSearch } from '@/components/layout/sidebar/hooks';

// #region 검색대 컴포넌트
export function SearchBar() {
	const {
		searchQuery,
		isSearchActive,
		handleSearchChange,
		handleSearchClear,
		handleSearchSubmit,
	} = useSidebarSearch();

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleSearchSubmit();
		}
	};

	return (
		<div className="flex items-center gap-4">
			{/* 검색 입력창 */}
			<div className="relative flex-1">
				<input
					type="text"
					placeholder="현장 검색"
					value={searchQuery}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						handleSearchChange(e.target.value)
					}
					onKeyDown={handleKeyDown}
					className="w-full h-10 px-4 pr-10 text-base rounded-md outline-none text-foreground placeholder:text-muted-foreground transition-all duration-200 bg-card/80 border border-border/70 shadow-sm select-text"
				/>

				{/* X 버튼 (입력창 내부) */}
				{isSearchActive && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleSearchClear}
						className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-sm transition-all duration-150"
						title="검색 지우기">
						<X className="w-4 h-4 text-muted-foreground" />
					</Button>
				)}
			</div>

			{/* 돋보기 버튼 (독립적) */}
			<Button
				variant="ghost"
				size="sm"
				onClick={handleSearchSubmit}
				className="neumorphic-button h-10 w-10 p-0 rounded-md flex-shrink-0 transition-all duration-200 hover:scale-105"
				title="현장 검색">
				<Search className="w-5 h-5 text-muted-foreground" />
			</Button>
		</div>
	);
}
// #endregion
