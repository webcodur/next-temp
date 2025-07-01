'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Building2, MapPin, Menu, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button/Button';
import { useSidebarSearch, useMenuSearch } from '@/components/layout/sidebar/hooks';
import { menuData } from '@/data/menuData';
import { Modal } from '@/components/ui/modal';

// 타입 정의
type SiteResult = {
	id: string;
	name: string;
	address: string;
	description?: string;
	accessedAt?: number;
};

type MenuResult = {
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
};

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
	const [activeTab, setActiveTab] = useState<'site' | 'menu'>('site');
	
	// 포커스 유지를 위한 ref들
	const siteInputRef = useRef<HTMLInputElement>(null);
	const menuInputRef = useRef<HTMLInputElement>(null);
	
	// 한글 입력 상태 관리
	const [isComposing, setIsComposing] = useState(false);
	
	// 현장검색 훅
	const {
		searchQuery: siteQuery,
		searchResults: siteResults,
		recentSites,
		handleSearchChange: handleSiteChange,
		handleSearchClear: handleSiteClear,
		handleResultSelect: handleSiteSelect,
	} = useSidebarSearch();

	// 메뉴검색 훅
	const {
		searchQuery: menuQuery,
		searchResults: menuResults,
		recentMenus,
		handleSearchChange: handleMenuChange,
		handleSearchClear: handleMenuClear,
		handleResultSelect: handleMenuSelect,
	} = useMenuSearch();

	// 모달이 열릴 때마다 사이트 탭으로 초기화
	useEffect(() => {
		if (isOpen) {
			setActiveTab('site');
		}
	}, [isOpen]);

	// 한글 입력 composition 이벤트 핸들러들
	const handleCompositionStart = () => {
		setIsComposing(true);
	};

	const handleSiteCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
		setIsComposing(false);
		// composition 완료 시 최종 값으로 업데이트
		const value = (e.target as HTMLInputElement).value;
		handleSiteChange(value);
	};

	const handleMenuCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
		setIsComposing(false);
		// composition 완료 시 최종 값으로 업데이트
		const value = (e.target as HTMLInputElement).value;
		handleMenuChange(value);
	};

	// 포커스 유지를 위한 커스텀 핸들러들
	const handleSiteChangeWithFocus = (value: string) => {
		// 한글 조합 중일 때는 상태 업데이트 하지 않음
		if (isComposing) return;
		
		const wasFocused = document.activeElement === siteInputRef.current;
		handleSiteChange(value);
		// 다음 렌더링 사이클에서 포커스 복원
		if (wasFocused) {
			setTimeout(() => {
				siteInputRef.current?.focus();
			}, 0);
		}
	};

	const handleMenuChangeWithFocus = (value: string) => {
		// 한글 조합 중일 때는 상태 업데이트 하지 않음
		if (isComposing) return;
		
		const wasFocused = document.activeElement === menuInputRef.current;
		handleMenuChange(value);
		// 다음 렌더링 사이클에서 포커스 복원
		if (wasFocused) {
			setTimeout(() => {
				menuInputRef.current?.focus();
			}, 0);
		}
	};

	// 검색 결과 선택 시 모달 닫기
	const handleSiteSelectAndClose = (site: SiteResult) => {
		handleSiteSelect(site);
		onClose();
	};

	const handleMenuSelectAndClose = (menu: MenuResult) => {
		handleMenuSelect(menu);
		onClose();
	};

	// 현장검색 콘텐츠
	const SiteSearchContent = () => (
		<div className="space-y-4 h-[520px] flex flex-col">
			{/* 검색 입력 */}
			<div className="relative shrink-0">
				<Building2 className="absolute left-3 top-1/2 w-5 h-5 transform -translate-y-1/2 text-muted-foreground" />
				<input
					ref={siteInputRef}
					type="text"
					placeholder="현장명, 주소 등으로 검색하세요..."
					value={siteQuery}
					onChange={(e) => handleSiteChangeWithFocus(e.target.value)}
					onCompositionStart={handleCompositionStart}
					onCompositionEnd={handleSiteCompositionEnd}
					className="py-3 pr-12 pl-12 w-full text-base rounded-lg border border-border neu-flat focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
				/>
				{siteQuery && (
					<Button
						variant="ghost"
						size="icon"
						onClick={handleSiteClear}
						className="absolute right-3 top-1/2 w-8 h-8 transform -translate-y-1/2 hover:bg-muted">
						<X className="w-4 h-4" />
					</Button>
				)}
			</div>

			{/* 검색 결과 */}
			<div className="overflow-y-auto flex-1">
				{siteQuery.trim() ? (
					// 검색어가 있을 때
					siteResults.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							<Building2 className="mx-auto mb-3 w-12 h-12 text-muted-foreground/50" />
							<p>검색 결과가 없습니다</p>
						</div>
					) : (
						<div className="space-y-2">
							{siteResults.map((site, index) => (
								<div
									key={`${site.id}-${index}`}
									onClick={() => handleSiteSelectAndClose(site)}
									className="p-4 rounded-lg border transition-all cursor-pointer border-border neu-flat hover:neu-inset">
									<div className="flex gap-3 items-start">
										<Building2 className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
										<div className="flex-1 min-w-0">
											<h3 className="mb-1 font-medium text-foreground">{site.name}</h3>
											<div className="flex gap-1 items-center mb-1 text-sm text-muted-foreground">
												<MapPin className="w-4 h-4" />
												<span>{site.address}</span>
											</div>
											{site.description && (
												<p className="text-sm text-muted-foreground/70">{site.description}</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)
				) : (
					// 최근 접속 현장
					recentSites.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							<Building2 className="mx-auto mb-3 w-12 h-12 text-muted-foreground/50" />
							<p>최근 접속한 현장이 없습니다</p>
						</div>
					) : (
						<div className="space-y-2">
							<h3 className="mb-3 text-sm font-medium text-muted-foreground">최근 접속 현장</h3>
							{recentSites.map((site, index) => (
								<div
									key={`recent-${site.id}-${index}`}
									onClick={() => handleSiteSelectAndClose(site)}
									className="p-4 rounded-lg border transition-all cursor-pointer border-border neu-flat hover:neu-inset">
									<div className="flex gap-3 items-start">
										<span className="px-2 py-1 font-mono text-xs rounded text-muted-foreground bg-muted">
											{index + 1}
										</span>
										<Building2 className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
										<div className="flex-1 min-w-0">
											<h3 className="mb-1 font-medium text-foreground">{site.name}</h3>
											<div className="flex gap-1 items-center mb-1 text-sm text-muted-foreground">
												<MapPin className="w-4 h-4" />
												<span>{site.address}</span>
											</div>
											{site.description && (
												<p className="text-sm text-muted-foreground/70">{site.description}</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)
				)}
			</div>
		</div>
	);

	// 메뉴검색 콘텐츠
	const MenuSearchContent = () => (
		<div className="space-y-4 h-[520px] flex flex-col">
			{/* 검색 입력 */}
			<div className="relative shrink-0">
				<Menu className="absolute left-3 top-1/2 w-5 h-5 transform -translate-y-1/2 text-muted-foreground" />
				<input
					ref={menuInputRef}
					type="text"
					placeholder="메뉴명으로 검색하세요..."
					value={menuQuery}
					onChange={(e) => handleMenuChangeWithFocus(e.target.value)}
					onCompositionStart={handleCompositionStart}
					onCompositionEnd={handleMenuCompositionEnd}
					className="py-3 pr-12 pl-12 w-full text-base rounded-lg border border-border neu-flat focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
				/>
				{menuQuery && (
					<Button
						variant="ghost"
						size="icon"
						onClick={handleMenuClear}
						className="absolute right-3 top-1/2 w-8 h-8 transform -translate-y-1/2 hover:bg-muted">
						<X className="w-4 h-4" />
					</Button>
				)}
			</div>

			{/* 검색 결과 */}
			<div className="overflow-y-auto flex-1">
				{menuQuery.trim() ? (
					// 검색어가 있을 때
					menuResults.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							<Menu className="mx-auto mb-3 w-12 h-12 text-muted-foreground/50" />
							<p>검색 결과가 없습니다</p>
						</div>
					) : (
						<div className="space-y-2">
							{menuResults.map((result, index) => (
								<div
									key={`${result.type}-${result.topKey}-${result.midKey}-${index}`}
									onClick={() => handleMenuSelectAndClose(result)}
									className="p-4 rounded-lg border transition-all cursor-pointer border-border neu-flat hover:neu-inset">
									<div className="flex gap-2 items-center">
										<Menu className="w-4 h-4 text-muted-foreground shrink-0" />
										<div className="flex flex-wrap gap-1 items-center">
											<span className="text-sm font-medium text-foreground">
												{menuData[result.topKey]?.['kor-name'] || result.topKey}
											</span>
											<ChevronRight className="w-3 h-3 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												{menuData[result.topKey]?.midItems[result.midKey]?.['kor-name'] || result.midKey}
											</span>
											{result.type === 'bot' && (
												<>
													<ChevronRight className="w-3 h-3 text-muted-foreground" />
													<span className="text-sm font-medium text-foreground">
														{result.item['kor-name']}
													</span>
												</>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					)
				) : (
					// 최근 접속 메뉴
					recentMenus.length === 0 ? (
						<div className="py-8 text-center text-muted-foreground">
							<Menu className="mx-auto mb-3 w-12 h-12 text-muted-foreground/50" />
							<p>최근 접속한 메뉴가 없습니다</p>
						</div>
					) : (
						<div className="space-y-2">
							<h3 className="mb-3 text-sm font-medium text-muted-foreground">최근 접속 메뉴</h3>
							{recentMenus.map((recent, index) => (
								<div
									key={`recent-${recent.item.href}-${index}`}
									onClick={() => handleMenuSelectAndClose(recent)}
									className="p-4 rounded-lg border transition-all cursor-pointer border-border neu-flat hover:neu-inset">
									<div className="flex gap-2 items-center">
										<span className="px-2 py-1 font-mono text-xs rounded text-muted-foreground bg-muted">
											{index + 1}
										</span>
										<Menu className="w-4 h-4 text-muted-foreground shrink-0" />
										<div className="flex flex-wrap gap-1 items-center">
											<span className="text-sm font-medium text-foreground">
												{menuData[recent.topKey]?.['kor-name'] || recent.topKey}
											</span>
											<ChevronRight className="w-3 h-3 text-muted-foreground" />
											<span className="text-sm text-muted-foreground">
												{menuData[recent.topKey]?.midItems[recent.midKey]?.['kor-name'] || recent.midKey}
											</span>
											<ChevronRight className="w-3 h-3 text-muted-foreground" />
											<span className="text-sm font-medium text-foreground">
												{recent.item['kor-name']}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					)
				)}
			</div>
		</div>
	);

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			maxWidth="max-w-3xl">
			<div className="space-y-6">
				{/* 탭 버튼 */}
				<div className="flex gap-2 p-1 rounded-lg bg-muted neu-flat">
					<button
						onClick={() => setActiveTab('site')}
						className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
							activeTab === 'site'
								? 'bg-background neu-inset-shadow text-foreground font-medium'
								: 'neu-raised text-muted-foreground hover:text-foreground'
						}`}>
						<Building2 className="w-4 h-4" />
						현장 검색
					</button>
					<button
						onClick={() => setActiveTab('menu')}
						className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
							activeTab === 'menu'
								? 'bg-background neu-inset-shadow text-foreground font-medium'
								: 'neu-raised text-muted-foreground hover:text-foreground'
						}`}>
						<Menu className="w-4 h-4" />
						메뉴 검색
					</button>
				</div>

				{/* 탭 콘텐츠 */}
				{activeTab === 'site' ? <SiteSearchContent /> : <MenuSearchContent />}
			</div>
		</Modal>
	);
};

export default SearchModal; 