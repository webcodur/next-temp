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
				<div className="absolute top-full left-0 right-0 mt-1 bg-white neu-flat border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-9999 backdrop-blur-xs">
					{searchResults.length === 0 ? (
						<div className="p-3 text-gray-500 text-sm text-center">
							검색 결과가 없습니다
						</div>
					) : (
						<div className="py-1">
							{searchResults.map((site, index) => (
								<div
									key={`${site.id}-${index}`}
									className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
									onClick={() => handleResultSelect(site)}>
									<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
										<Building2 className="w-4 h-4 text-gray-400 shrink-0" />
										<div className="flex flex-col min-w-0 flex-1">
											<span className="text-sm text-gray-800 font-medium truncate">
												{site.name}
											</span>
											<div className="flex items-center gap-1 text-xs text-gray-500">
												<MapPin className="w-3 h-3" />
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
			<div className="absolute top-full left-0 right-0 mt-1 bg-white neu-flat border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-9999 backdrop-blur-xs">
				{recentSites.length === 0 ? (
					<div className="p-3 text-gray-500 text-sm text-center">
						최근 접속한 현장이 없습니다
					</div>
				) : (
					<div className="py-1">
						<div className="px-3 py-1 text-xs text-gray-400 font-medium border-b border-gray-100">
							최근 접속 현장
						</div>
						{recentSites.map((site, index) => (
							<div
								key={`recent-${site.id}-${index}`}
								className="px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
								onClick={() => handleResultSelect(site)}>
								<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
									<span className="text-xs text-gray-400 font-mono min-w-[24px]">
										{index + 1}/{recentSites.length}
									</span>
									<Building2 className="w-4 h-4 text-gray-400 shrink-0" />
									<div className="flex flex-col min-w-0 flex-1">
										<span className="text-sm text-gray-800 font-medium truncate">
											{site.name}
										</span>
										<div className="flex items-center gap-1 text-xs text-gray-500">
											<MapPin className="w-3 h-3" />
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
				<Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
				<input
					type="text"
					placeholder="현장 검색..."
					value={searchQuery}
					onChange={(e) => handleSearchChange(e.target.value)}
					onFocus={handleInputFocus}
					onKeyDown={handleKeyDown}
					className="w-full pl-10 pr-10 py-2 text-sm border border-gray-200 rounded-lg neu-flat focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
				/>
				{searchQuery && (
					<Button
						variant="ghost"
						size="icon"
						onClick={handleClear}
						className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-gray-100">
						<X className="h-3 w-3" />
					</Button>
				)}
			</div>

			{/* 드롭다운 콘텐츠 */}
			{renderDropdownContent()}
		</div>
	);
}
// #endregion
