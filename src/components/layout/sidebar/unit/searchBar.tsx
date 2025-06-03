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
		<div className="neumorphic-search flex items-center gap-2 p-1 rounded-2xl transition-all duration-200">
			{/* 검색 영역 */}
			<div className="relative flex-1">
				<input
					type="text"
					placeholder="현장 검색"
					value={searchQuery}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						handleSearchChange(e.target.value)
					}
					onKeyDown={handleKeyDown}
					className="neumorphic-input w-full h-8 px-3 pr-8 text-sm rounded-xl outline-none text-foreground placeholder:text-muted-foreground transition-all duration-200"
				/>

				{/* X 버튼 */}
				{isSearchActive && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleSearchClear}
						className="neumorphic-button absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-lg transition-all duration-150"
						title="검색 지우기">
						<X className="w-3 h-3 text-muted-foreground drop-shadow-sm" />
					</Button>
				)}
			</div>

			{/* 검색 버튼 */}
			<Search className="w-4 h-4 text-muted-foreground drop-shadow-sm" />
		</div>
	);
}
// #endregion
