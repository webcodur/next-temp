'use client';

import { X, Building2, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button/Button';
import { useSidebarSearch } from '@/components/layout/sidebar/hooks';

/**
 * 사이드바 검색바 컴포넌트
 * - 현장 검색 기능을 제공하는 입력 필드
 * - 드롭다운 형태의 검색 결과 표시
 * - 검색어 없을 시 최근 접속 현장 10개 표시
 * - 키보드 네비게이션 지원
 */

// #region 현장 검색 컴포넌트
export function SearchBar() {
	const {
		searchQuery,
		searchResults,
		recentSites,
		handleSearchChange,
		handleSearchClear,
		handleSearchSubmit,
		handleResultSelect,
	} = useSidebarSearch();

	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	const searchRef = useRef<HTMLDivElement>(null);

	/**
	 * 외부 클릭 시 드롭다운 닫기
	 */
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

	/**
	 * 입력 포커스 시 드롭다운 열기
	 */
	const handleInputFocus = () => {
		setIsDropdownOpen(true);
	};

	/**
	 * 키보드 이벤트 처리
	 */
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleSearchSubmit();
		} else if (e.key === 'Escape') {
			setIsDropdownOpen(false);
		}
	};

	/**
	 * 검색 초기화 처리
	 */
	const handleClear = () => {
		handleSearchClear();
		setIsDropdownOpen(false);
	};

	/**
	 * 검색 결과 또는 최근 접속 현장 렌더링
	 */
	const renderDropdownContent = () => {
		if (!isDropdownOpen) return null;

		// 검색어가 있을 때: 검색 결과 표시
		if (searchQuery.trim()) {
			return (
				<div className="overflow-y-auto absolute right-0 left-0 top-full mt-1 max-h-64 bg-white rounded-lg border border-gray-200 shadow-xl neu-flat z-9999 backdrop-blur-xs">
					{searchResults.length === 0 ? (
						<div className="p-3 text-sm text-center text-gray-500">
							검색 결과가 없습니다
						</div>
					) : (
						<div className="py-1">
							{searchResults.map((site, index) => (
								<div
									key={`${site.id}-${index}`}
									className="px-3 py-2 border-b border-gray-100 transition-colors cursor-pointer hover:bg-gray-50 last:border-b-0"
									onClick={() => handleResultSelect(site)}>
									<div className="flex overflow-x-auto gap-2 items-center scrollbar-hide">
										<Building2 className="w-4 h-4 text-gray-400 cursor-pointer shrink-0" />
										<div className="flex flex-col flex-1 min-w-0">
											<span className="text-sm font-medium text-gray-800 truncate">
												{site.name}
											</span>
											<div className="flex gap-1 items-center text-xs text-gray-500">
												<MapPin className="w-3 h-3 cursor-pointer" />
												<span className="truncate">{site.address}</span>
											</div>
											{site.description && (
												<span className="text-xs text-gray-400 truncate">
													{site.description}
												</span>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			);
		}

		// 검색어가 없을 때: 최근 접속 현장 표시
		return (
			<div className="overflow-y-auto absolute right-0 left-0 top-full mt-1 max-h-64 bg-white rounded-lg border border-gray-200 shadow-xl neu-flat z-9999 backdrop-blur-xs">
				{recentSites.length === 0 ? (
					<div className="p-3 text-sm text-center text-gray-500">
						최근 접속한 현장이 없습니다
					</div>
				) : (
					<div className="py-1">
						<div className="px-3 py-1 text-xs font-medium text-gray-400 border-b border-gray-100">
							최근 접속 현장
						</div>
						{recentSites.map((site, index) => (
							<div
								key={`recent-${site.id}-${index}`}
								className="px-3 py-2 border-b border-gray-100 transition-colors cursor-pointer hover:bg-gray-50 last:border-b-0"
								onClick={() => handleResultSelect(site)}>
								<div className="flex overflow-x-auto gap-2 items-center scrollbar-hide">
									<span className="text-xs text-gray-400 font-mono min-w-[24px]">
										{index + 1}/{recentSites.length}
									</span>
									<Building2 className="w-4 h-4 text-gray-400 cursor-pointer shrink-0" />
									<div className="flex flex-col flex-1 min-w-0">
										<span className="text-sm font-medium text-gray-800 truncate">
											{site.name}
										</span>
										<div className="flex gap-1 items-center text-xs text-gray-500">
											<MapPin className="w-3 h-3 cursor-pointer" />
											<span className="truncate">{site.address}</span>
										</div>
										{site.description && (
											<span className="text-xs text-gray-400 truncate">
												{site.description}
											</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		);
	};

	return (
		<div ref={searchRef} className="relative">
			{/* 검색 입력 필드 */}
			<div className="relative">
				<Building2 className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2 cursor-text" />
				<input
					type="text"
					placeholder="현장 검색..."
					value={searchQuery}
					onChange={(e) => handleSearchChange(e.target.value)}
					onFocus={handleInputFocus}
					onKeyDown={handleKeyDown}
					className="py-2 pr-10 pl-10 w-full text-sm rounded-lg border border-gray-200 neu-flat focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
				/>
				{searchQuery && (
					<Button
						variant="ghost"
						size="icon"
						onClick={handleClear}
						className="absolute right-2 top-1/2 w-6 h-6 transform -translate-y-1/2 cursor-pointer hover:bg-gray-100">
						<X className="w-3 h-3 cursor-pointer" />
					</Button>
				)}
			</div>

			{/* 드롭다운 콘텐츠 */}
			{renderDropdownContent()}
		</div>
	);
}
// #endregion
