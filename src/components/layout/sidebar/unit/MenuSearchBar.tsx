'use client';

import { X, Search, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/ui-input/button/Button';
import { useMenuSearch } from '@/components/layout/sidebar/hooks';
import { menuData } from '@/data/menuData';

/**
 * 메뉴 검색 컴포넌트
 * - 검색 아이콘 클릭 시 모달 형태로 검색 UI 표시
 * - midMenu와 botMenu 검색 기능 제공
 * - 검색어 없을 시 최근 접속 메뉴 10개 표시
 * - 키보드 네비게이션 지원
 */

// #region 메뉴 검색 컴포넌트
export function MenuSearchBar() {
	const {
		searchQuery,
		searchResults,
		recentMenus,
		handleSearchChange,
		handleSearchClear,
		handleResultSelect,
	} = useMenuSearch();

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const modalRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	/**
	 * 모달 열기
	 */
	const openModal = () => {
		setIsModalOpen(true);
	};

	/**
	 * 모달 닫기
	 */
	const closeModal = () => {
		setIsModalOpen(false);
		handleSearchClear();
	};

	/**
	 * 모달 열릴 때 입력 필드에 포커스
	 */
	useEffect(() => {
		if (isModalOpen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isModalOpen]);

	/**
	 * 외부 클릭 시 모달 닫기
	 */
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				closeModal();
			}
		};

		if (isModalOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isModalOpen]);

	/**
	 * 키보드 이벤트 처리
	 */
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			closeModal();
		}
	};

	/**
	 * 검색 초기화 처리
	 */
	const handleClear = () => {
		handleSearchClear();
	};

	/**
	 * 검색 결과 선택 후 모달 닫기
	 */
	const handleResultSelectAndClose = (result: {
		type: 'mid' | 'bot';
		topKey: string;
		midKey: string;
		item: {
			key: string;
			'kor-name': string;
			'eng-name': string;
			href?: string;
			description?: string;
		};
	}) => {
		handleResultSelect(result);
		closeModal();
	};

	/**
	 * 검색 결과 또는 최근 접속 메뉴 렌더링
	 */
	const renderModalContent = () => {
		// 검색어가 있을 때: 검색 결과 표시
		if (searchQuery.trim()) {
			return (
				<div className="max-h-64 overflow-y-auto">
					{searchResults.length === 0 ? (
						<div className="p-3 text-muted-foreground text-sm text-center">
							검색 결과가 없습니다
						</div>
					) : (
						<div className="py-1">
							{searchResults.map((result, index) => (
								<div
									key={`${result.type}-${result.topKey}-${result.midKey}-${index}`}
									className="px-3 py-2 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 transition-colors"
									onClick={() => handleResultSelectAndClose(result)}>
									<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
										<div className="flex items-center gap-1 whitespace-nowrap">
											<span className="text-sm text-foreground font-medium">
												{menuData[result.topKey]?.['kor-name'] || result.topKey}
											</span>
											<ChevronRight className="w-3 h-3 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												{menuData[result.topKey]?.midItems[result.midKey]?.[
													'kor-name'
												] || result.midKey}
											</span>
											{result.type === 'bot' && (
												<>
													<ChevronRight className="w-3 h-3 text-muted-foreground" />
													<span className="text-sm text-foreground font-medium">
														{(result.item as import('../types').BotMenu)[
															'kor-name'
														] || result.item['kor-name']}
													</span>
												</>
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

		// 검색어가 없을 때: 최근 접속 메뉴 표시
		return (
			<div className="max-h-64 overflow-y-auto">
				{recentMenus.length === 0 ? (
					<div className="p-3 text-muted-foreground text-sm text-center">
						최근 접속한 메뉴가 없습니다
					</div>
				) : (
					<div className="py-1">
						<div className="px-3 py-1 text-xs text-muted-foreground font-medium border-b border-border">
							최근 접속 메뉴
						</div>
						{recentMenus.map((recent, index) => (
							<div
								key={`recent-${recent.item.href}-${index}`}
								className="px-3 py-2 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 transition-colors"
								onClick={() => handleResultSelectAndClose(recent)}>
								<div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
									<div className="flex items-center gap-1 whitespace-nowrap">
										<span className="text-xs text-muted-foreground font-mono min-w-[24px]">
											{index + 1}/{recentMenus.length}
										</span>
										<span className="text-sm text-foreground font-medium">
											{menuData[recent.topKey]?.['kor-name'] || recent.topKey}
										</span>
										<ChevronRight className="w-3 h-3 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">
											{menuData[recent.topKey]?.midItems[recent.midKey]?.[
												'kor-name'
											] || recent.midKey}
										</span>
										<ChevronRight className="w-3 h-3 text-muted-foreground" />
										<span className="text-sm text-foreground font-medium">
											{recent.item['kor-name']}
										</span>
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
		<>
			{/* 검색 아이콘 버튼 */}
			<Button
				variant="ghost"
				size="icon"
				onClick={openModal}
				className="neu-icon-inactive hover:neu-icon-active h-8 w-8">
				<Search className="h-4 w-4" />
			</Button>

			{/* 검색 모달 */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm">
					<div
						ref={modalRef}
						className="w-full max-w-lg mx-4 bg-background neu-flat border border-border rounded-lg shadow-xl animate-fadeIn">
						{/* 모달 헤더 */}
						<div className="flex items-center justify-between p-4 border-b border-border">
							<h3 className="text-lg font-medium">메뉴 검색</h3>
							<Button
								variant="ghost"
								size="icon"
								onClick={closeModal}
								className="h-8 w-8 hover:bg-muted">
								<X className="h-4 w-4" />
							</Button>
						</div>

						{/* 검색 입력 필드 */}
						<div className="p-4 border-b border-border">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								<input
									ref={inputRef}
									type="text"
									placeholder="메뉴 검색..."
									value={searchQuery}
									onChange={(e) => handleSearchChange(e.target.value)}
									onKeyDown={handleKeyDown}
									className="w-full pl-10 pr-10 py-2 text-sm border border-border rounded-lg neu-flat focus:outline-hidden focus:ring-2 focus:ring-brand/20 focus:border-brand"
								/>
								{searchQuery && (
									<Button
										variant="ghost"
										size="icon"
										onClick={handleClear}
										className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-muted">
										<X className="h-3 w-3" />
									</Button>
								)}
							</div>
						</div>

						{/* 검색 결과 / 최근 메뉴 */}
						{renderModalContent()}
					</div>
				</div>
			)}
		</>
	);
}
// #endregion
