'use client';

import React from 'react';
import { useSidebarSearch } from '../useSidebarSearch';
import SiteSearchInput from './SiteSearchInput';
import SiteSearchResults from './SiteSearchResults';
import SiteRecentList from './SiteRecentList';
import { PanelForSiteProps } from '../types';

const PanelForSite: React.FC<PanelForSiteProps> = ({ onItemSelect }) => {
	// 현장검색 훅
	const {
		searchQuery: siteQuery,
		searchResults: siteResults,
		recentSites,
		handleSearchChange: handleSiteChange,
		handleSearchClear: handleSiteClear,
	} = useSidebarSearch();

	return (
		<div className="space-y-4 h-[520px] flex flex-col">
			{/* 검색 입력 */}
			<SiteSearchInput
				searchQuery={siteQuery}
				onSearchChange={handleSiteChange}
				onSearchClear={handleSiteClear}
			/>

			{/* 검색 결과 */}
			<div className="overflow-y-auto flex-1">
				{siteQuery.trim() ? (
					// 검색어가 있을 때 - 검색 결과 표시
					<SiteSearchResults
						results={siteResults}
						onItemSelect={onItemSelect}
					/>
				) : (
					// 검색어가 없을 때 - 최근 접속 현장 표시
					<SiteRecentList
						recentSites={recentSites}
						onItemSelect={onItemSelect}
					/>
				)}
			</div>
		</div>
	);
};

export default PanelForSite; 