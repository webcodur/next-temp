'use client';

import React, { useState } from 'react';
import Tabs, { Tab } from '@/components/ui/ui-layout/tabs/Tabs';
import BaseTableExample from '@/components/ui/ui-data/baseTable/base-table.example';
import InfiniteTableExample from '@/components/ui/ui-data/infiniteTable/infinite-table.example';
import PaginatedTableExample from '@/components/ui/ui-data/paginatedTable/paginated-table.example';
import { useTranslations } from '@/hooks/useI18n';
import { Table, Infinity, ChevronRight } from 'lucide-react';

export default function UnifiedTablePage() {
	const t = useTranslations();
	const [activeTab, setActiveTab] = useState('base');

	const tabList: Tab[] = [
		{ 
			id: 'base', 
			label: t('테이블_기본테이블'),
			icon: <Table className="w-4 h-4" />
		},
		{ 
			id: 'infinite', 
			label: t('테이블_무한스크롤'),
			icon: <Infinity className="w-4 h-4" />
		},
		{ 
			id: 'paginated', 
			label: t('테이블_페이지네이션'),
			icon: <ChevronRight className="w-4 h-4" />
		},
	];

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="mx-auto max-w-7xl">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-800 mb-4 font-multilang">
						{t('테이블_통합제목')}
					</h1>
					<p className="text-gray-600 font-multilang">
						{t('테이블_통합설명')}
					</p>
				</div>

				{/* 탭 네비게이션과 콘텐츠를 하나의 컨테이너로 묶음 */}
				<div className="max-w-4xl mx-auto">
					<Tabs 
						tabs={tabList} 
						activeId={activeTab}
						onTabChange={setActiveTab}
					/>

					{/* 탭 콘텐츠 - 탭과 연결된 스타일 */}
					<div className="border-s-2 border-e-2 border-b-2 border-border bg-white rounded-b-lg shadow-sm min-h-[600px]">
						{activeTab === 'base' && (
							<div className="p-6">
								<div className="mb-6">
									<h2 className="text-xl font-semibold text-gray-800 mb-2 font-multilang">
										{t('테이블_기본테이블')} (A)
									</h2>
									<p className="text-gray-600 text-sm font-multilang">
										{t('테이블_기본설명')}
									</p>
								</div>
								<BaseTableExample />
							</div>
						)}

						{activeTab === 'infinite' && (
							<div className="p-6">
								<div className="mb-6">
									<h2 className="text-xl font-semibold text-gray-800 mb-2 font-multilang">
										{t('테이블_무한스크롤')} (A+x)
									</h2>
									<p className="text-gray-600 text-sm font-multilang">
										{t('테이블_무한설명')}
									</p>
								</div>
								<InfiniteTableExample />
							</div>
						)}

						{activeTab === 'paginated' && (
							<div className="p-6">
								<div className="mb-6">
									<h2 className="text-xl font-semibold text-gray-800 mb-2 font-multilang">
										{t('테이블_페이지네이션')} (A+y)
									</h2>
									<p className="text-gray-600 text-sm font-multilang">
										{t('테이블_페이지설명')}
									</p>
								</div>
								<PaginatedTableExample />
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
