'use client';

import { Search, X, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useMenuSearch } from '@/components/layout/sidebar/hooks';

interface MenuSearchProps {
	onMenuSelect: (result: {
		topKey: string;
		midKey: string;
		botLabel?: string;
		href?: string;
	}) => void;
}

// #region 메뉴검색 컴포넌트
export function MenuSearch({ onMenuSelect }: MenuSearchProps) {
	const {
		menuSearchQuery,
		isMenuSearchActive,
		searchResults,
		handleMenuSearchChange,
		handleMenuSearchClear,
		handleMenuSearchSelect,
	} = useMenuSearch();

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);

	// 외부 클릭 시 드롭다운 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// 검색 결과가 있을 때 드롭다운 열기
	useEffect(() => {
		setIsDropdownOpen(searchResults.length > 0);
	}, [searchResults]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && searchResults.length > 0) {
			const firstResult = searchResults[0];
			const selected = handleMenuSearchSelect(firstResult);
			onMenuSelect(selected);
			handleMenuSearchClear();
		}
		if (e.key === 'Escape') {
			setIsDropdownOpen(false);
		}
	};

	const handleResultClick = (result: (typeof searchResults)[0]) => {
		const selected = handleMenuSearchSelect(result);
		onMenuSelect(selected);
		handleMenuSearchClear();
		setIsDropdownOpen(false);
	};

	return (
		<div ref={searchRef} className="relative">
			<div className="neumorphic-search flex items-center gap-2 p-1 rounded-2xl transition-all duration-200">
				{/* 메뉴검색 영역 */}
				<div className="relative flex-1">
					<input
						type="text"
						placeholder="메뉴 검색"
						value={menuSearchQuery}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleMenuSearchChange(e.target.value)
						}
						onKeyDown={handleKeyDown}
						className="neumorphic-input w-full h-8 px-3 pr-8 text-sm rounded-xl outline-none text-foreground placeholder:text-muted-foreground transition-all duration-200"
					/>

					{/* X 버튼 */}
					{isMenuSearchActive && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleMenuSearchClear}
							className="neumorphic-button absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 rounded-lg transition-all duration-150"
							title="검색 지우기">
							<X className="w-3 h-3 text-muted-foreground drop-shadow-sm" />
						</Button>
					)}
				</div>

				{/* 검색 버튼 */}
				<Search className="w-4 h-4 text-muted-foreground drop-shadow-sm" />
			</div>

			{/* 검색 결과 드롭다운 */}
			{isDropdownOpen && searchResults.length > 0 && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border/60 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto scrollbar-hide neumorphic">
					{searchResults.slice(0, 8).map((result, index) => (
						<button
							key={index}
							onClick={() => handleResultClick(result)}
							className="w-full text-left p-3 hover:bg-accent/50 transition-colors border-b border-border/30 last:border-b-0 group">
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
										<span>{result.topLabel}</span>
										<ChevronRight className="w-3 h-3" />
										<span>{result.midLabel}</span>
									</div>
									{result.botLabel && (
										<div className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
											{result.botLabel}
										</div>
									)}
									{!result.botLabel && (
										<div className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
											{result.midLabel}
										</div>
									)}
								</div>
								<ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
							</div>
						</button>
					))}
					{searchResults.length > 8 && (
						<div className="p-2 text-center text-xs text-muted-foreground border-t border-border/30">
							{searchResults.length - 8}개의 추가 결과가 있습니다
						</div>
					)}
				</div>
			)}
		</div>
	);
}
// #endregion
