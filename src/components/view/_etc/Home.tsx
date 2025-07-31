/* 
  파일명: /components/view/Home.tsx
  기능: 주차 관리 시스템의 메인 홈페이지 컴포넌트
  책임: 차량 입출차 관리와 차단기 제어 기능을 탭으로 제공한다.
  메뉴 설명: 주차 시스템을 통합 관리하는 메인 페이지
*/

'use client';

import React, { useState } from 'react';
import { Car, Shield, ChartBar } from 'lucide-react';

import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import VehicleManagementTab from '@/components/view/_screen/vehicle-management/VehicleManagementTab';
import AccessControlTab from '@/components/view/_screen/access-control/AccessControlTab';
import StatisticsTab from '@/components/view/_screen/statistics/StatisticsTab';

export default function Home() {
	// #region 상수
	const tabs = [
		{
			id: 'vehicles',
			label: '입출차 관리(T)',
			icon: <Car size={16} />,
			title: '차량 입출차 내역 탭',
			subtitle: '실시간 차량 입출차 현황을 조회하고 관리할 수 있습니다.',
		},
		{
			id: 'access-control',
			label: '주차장 출입 관리(T)',
			icon: <Shield size={16} />,
			title: '주차장 출입 관리 탭',
			subtitle: '차단기 제어 및 주차장 보안 시설을 통합 관리할 수 있습니다.',
		},
    {
      id: 'statistics',
      label: '주차장 통계 정보 (...)',
      icon: <ChartBar size={16} />,
			title: '이번 달 주차장 운영 내역 탭',
			subtitle: '주차장 이용률과 수익 현황을 분석하고 리포트를 확인할 수 있습니다.',
    },
	];
	// #endregion

	// #region 상태
	const [activeTab, setActiveTab] = useState('vehicles');
	const [accessControlActions, setAccessControlActions] = useState<React.ReactNode>(null);
	// #endregion

	// #region 핸들러
	const handleAccessControlActions = React.useCallback((actions: React.ReactNode) => {
		setAccessControlActions(actions);
	}, []);
	// #endregion

	// #region 렌더링
	return (
		<div className="flex flex-col gap-6 h-full">
			<PageHeader 
				title="통합 대시보드 홈" 
        subtitle="각종 스크린을 추가할 수 있는 메인 페이지입니다."
			/>
			
			{/* 탭과 콘텐츠를 하나의 컨테이너로 묶음 */}
			<div className="flex flex-col">
				<Tabs
					tabs={tabs}
					activeId={activeTab}
					onTabChange={setActiveTab}
					endContent={activeTab === 'access-control' ? accessControlActions : undefined}
				/>

				{/* 콘텐츠 영역 - 탭과 연결된 스타일 */}
				<div className="p-6 rounded-b-lg border-b-2 border-s-2 border-e-2 border-border bg-background">
					{activeTab === 'vehicles' && <VehicleManagementTab />}
					{activeTab === 'access-control' && <AccessControlTab onActionsRender={handleAccessControlActions} />}
					{activeTab === 'statistics' && <StatisticsTab />}
				</div>
			</div>
		</div>
	);
	// #endregion
} 