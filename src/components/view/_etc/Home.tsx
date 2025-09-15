/* 
  파일명: /components/view/Home.tsx
  기능: 주차 관리 시스템의 메인 홈페이지 컴포넌트
  책임: 차량 입출차 관리와 차단기 제어 기능을 탭으로 제공한다.
  메뉴 설명: 주차 시스템을 통합 관리하는 메인 페이지
*/

'use client';

import React, { useState } from 'react';
import { Car, Shield } from 'lucide-react';

import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import VehicleManagementTab from '@/components/view/_screen/vehicle/VehicleManagementTab';
import AccessControlManager from '@/components/view/_screen/access-control/AccessControlManager';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

export default function Home() {
	// #region 상수
	const t = useTranslations();
	
  const tabs = [
		{
			id: 'vehicles',
			label: t('주차_입출차관리'),
			icon: <Car size={16} />,
		},
		{
			id: 'access-control',
			label: t('주차_차단기제어'),
			icon: <Shield size={16} />,
		},
	];
	// #endregion

	// #region 상태
	const [activeTab, setActiveTab] = useState('vehicles');
	// #endregion

	// #region 렌더링
	const getSubtitle = () => {
		return activeTab === 'vehicles' 
			? t('페이지헤더_홈_부제_입출차관리')
			: t('페이지헤더_홈_부제_차단기제어');
	};

	return (
		<div className="flex flex-col gap-6 h-full">
			<PageHeader 
				title={t('페이지헤더_홈_제목')} 
				subtitle={getSubtitle()}
			/>
			
			{/* 탭과 콘텐츠를 하나의 컨테이너로 묶음 */}
			<div className="flex flex-col">
				<Tabs
					tabs={tabs}
					activeId={activeTab}
					onTabChange={setActiveTab}
				/>

				{/* 콘텐츠 영역 - 탭과 연결된 스타일 */}
				<div className="p-6 rounded-b-lg border-b-2 border-s-2 border-e-2 border-border bg-background">
					{activeTab === 'vehicles' && <VehicleManagementTab />}
					{activeTab === 'access-control' && <AccessControlManager showPageHeader={false} />}
				</div>
			</div>
		</div>
	);
	// #endregion
} 