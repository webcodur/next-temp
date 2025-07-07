'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Menu } from 'lucide-react';
import { useAtom } from 'jotai';
import { useSidebarSearch } from './useSidebarSearch';
import { useMenuSearch } from './useMenuSearch';
import { useTranslations, useLocale } from '@/hooks/useI18n';
import { userAtom } from '@/store/auth';
import ModalContainer from '@/components/ui/ui-layout/modal/unit/ModalContainer';
// import Modal from '@/components/ui/ui-layout/modal/Modal';
import PanelForSite from './panelForSite/PanelForSite';
import PanelForMenu from './panelForMenu/PanelForMenu';
import { SearchModalProps, SiteResult, MenuResult } from './types';

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
	const [activeTab, setActiveTab] = useState<'site' | 'menu'>('site');
	const [user] = useAtom(userAtom);
	const t = useTranslations();
	const { isRTL } = useLocale();
	
	// 사용자 역할 확인 - 운영진(admin)인지 일반인인지 구분
	const isAdmin = user?.role === 'admin';
	
	// 훅에서 선택 핸들러 가져오기
	const { handleResultSelect: handleSiteSelect } = useSidebarSearch();
	const { handleResultSelect: handleMenuSelect } = useMenuSearch();

	// 모달이 열릴 때마다 초기화
	useEffect(() => {
		if (isOpen) {
			// 운영진이면 사이트 탭으로, 일반인이면 메뉴 탭으로 초기화
			setActiveTab(isAdmin ? 'site' : 'menu');
		}
	}, [isOpen, isAdmin]);

	// 검색 결과 선택 시 모달 닫기
	const handleSiteSelectAndClose = (site: SiteResult) => {
		handleSiteSelect(site);
		onClose();
	};

	const handleMenuSelectAndClose = (menu: MenuResult) => {
		handleMenuSelect(menu);
		onClose();
	};

	return (
		<ModalContainer
			isOpen={isOpen}
			onClose={onClose}
			>
			<div className="space-y-6">
				{/* 탭 버튼 - 운영진에게만 보임 */}
				{isAdmin && (
					<div className="flex gap-2 p-1 rounded-lg neu-flat">
						{/* 현장 검색 */}
						<button
							onClick={() => setActiveTab('site')}
							className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
								activeTab === 'site'
									? 'bg-background neu-inset-shadow text-foreground font-medium'
									: 'neu-raised text-muted-foreground hover:text-foreground'
							} ${isRTL ? 'flex-row-reverse' : ''}`}>
							<Building2 className="w-4 h-4" />
							<span className="font-multilang">{t('검색_현장_탭')}</span>
						</button>
						{/* 메뉴 검색 */}
						<button
							onClick={() => setActiveTab('menu')}
							className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all ${
								activeTab === 'menu'
									? 'bg-background neu-inset-shadow text-foreground font-medium'
									: 'neu-raised text-muted-foreground hover:text-foreground'
							} ${isRTL ? 'flex-row-reverse' : ''}`}>
							<Menu className="w-4 h-4" />
							<span className="font-multilang">{t('검색_메뉴_탭')}</span>
						</button>
					</div>
				)}

				{/* 탭 콘텐츠 */}
				{isAdmin ? (
					// 운영진: 탭에 따라 다른 패널 표시
					activeTab === 'site' ? (
						<PanelForSite onItemSelect={handleSiteSelectAndClose} />
					) : (
						<PanelForMenu onItemSelect={handleMenuSelectAndClose} />
					)
				) : (
					// 일반인: 메뉴 검색만 표시
					<PanelForMenu onItemSelect={handleMenuSelectAndClose} />
				)}
			</div>
		</ModalContainer>
	);
};

export default SearchModal; 