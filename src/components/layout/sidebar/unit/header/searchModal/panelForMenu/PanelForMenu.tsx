'use client';

import React from 'react';
import { useMenuSearch } from '../useMenuSearch';
import MenuSearchInput from './MenuSearchInput';
import MenuSearchResults from './MenuSearchResults';
import MenuRecentList from './MenuRecentList';
import { PanelForMenuProps } from '../types';

const PanelForMenu: React.FC<PanelForMenuProps> = ({ onItemSelect }) => {
	// 메뉴검색 훅
	const {
		searchQuery: menuQuery,
		searchResults: menuResults,
		recentMenus,
		handleSearchChange: handleMenuChange,
		handleSearchClear: handleMenuClear,
	} = useMenuSearch();

	return (
		<div className="space-y-4 h-[520px] flex flex-col">
			{/* 검색 입력 */}
			<MenuSearchInput
				searchQuery={menuQuery}
				onSearchChange={handleMenuChange}
				onSearchClear={handleMenuClear}
			/>

			{/* 검색 결과 */}
			<div className="overflow-y-auto flex-1">
				{menuQuery.trim() ? (
					// 검색어가 있을 때 - 검색 결과 표시
					<MenuSearchResults
						results={menuResults}
						onItemSelect={onItemSelect}
					/>
				) : (
					// 검색어가 없을 때 - 최근 접속 메뉴 표시
					<MenuRecentList
						recentMenus={recentMenus}
						onItemSelect={onItemSelect}
					/>
				)}
			</div>
		</div>
	);
};

export default PanelForMenu; 