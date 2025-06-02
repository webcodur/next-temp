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
		<div
			className="
			flex items-center gap-2 p-1 rounded-2xl
			bg-gradient-to-br from-white/90 to-gray-200/80
			shadow-[6px_6px_12px_rgba(0,0,0,0.18),_-6px_-6px_12px_rgba(255,255,255,0.95)]
			border border-gray-400/40
			transition-all duration-200 
			hover:shadow-[3px_3px_6px_rgba(0,0,0,0.22),_-3px_-3px_6px_rgba(255,255,255,1)]
			focus-within:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.15),_inset_-3px_-3px_6px_rgba(255,255,255,0.9)]
			focus-within:border-gray-500/50
		">
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
					className="
						w-full h-8 px-3 pr-8 text-sm rounded-xl
						bg-gradient-to-br from-white/70 to-gray-100/50
						shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),_inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
						border border-gray-400/30
						outline-none 
						text-gray-800
						placeholder:text-gray-500
						transition-all duration-200
						focus:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.15),_inset_-4px_-4px_8px_rgba(255,255,255,0.95)]
						focus:border-gray-500/40
					"
				/>

				{/* X 버튼 */}
				{isSearchActive && (
					<Button
						variant="ghost"
						size="sm"
						onClick={handleSearchClear}
						className="
							absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-lg
							bg-gradient-to-br from-white/80 to-gray-200/60
							shadow-[2px_2px_4px_rgba(0,0,0,0.15),_-2px_-2px_4px_rgba(255,255,255,0.9)]
							hover:shadow-[1px_1px_2px_rgba(0,0,0,0.18),_-1px_-1px_2px_rgba(255,255,255,1)]
							active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.18),_inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
							border border-gray-400/30
							transition-all duration-150
						"
						title="검색 지우기">
						<X className="w-3 h-3 text-gray-600 drop-shadow-sm" />
					</Button>
				)}
			</div>

			{/* 검색 버튼 */}
			<Button
				variant="ghost"
				size="sm"
				onClick={handleSearchSubmit}
				disabled={!searchQuery.trim()}
				className="
					h-8 w-8 p-0 rounded-lg
					bg-gradient-to-br from-white/80 to-gray-200/60
					shadow-[2px_2px_4px_rgba(0,0,0,0.15),_-2px_-2px_4px_rgba(255,255,255,0.9)]
					hover:shadow-[1px_1px_2px_rgba(0,0,0,0.18),_-1px_-1px_2px_rgba(255,255,255,1)]
					active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.18),_inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
					disabled:opacity-50 disabled:cursor-not-allowed 
					border border-gray-400/30
					transition-all duration-150
				"
				title="검색">
				<Search className="w-4 h-4 text-gray-600 drop-shadow-sm" />
			</Button>
		</div>
	);
}
// #endregion
