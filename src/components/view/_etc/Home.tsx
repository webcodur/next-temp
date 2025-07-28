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
			title: '차량 입출차 현황 (실시간)',
			subtitle: '현재 523대 주차 중 | 오늘 입차 1,247대, 출차 1,108대 | 평균 주차시간 2시간 43분',
		},
		{
			id: 'access-control',
			label: '출입 제어 관리(T)',
			icon: <Shield size={16} />,
			title: '차단기 제어 시스템 (6개소 운영 중)',
			subtitle: '정상 4개소, 점검 중 1개소, 오류 1개소 | 마지막 업데이트: 2분 전 | 오늘 총 2,355회 작동',
		},
    {
      id: 'statistics',
      label: '주차장 통계 정보 (...)',
      icon: <ChartBar size={16} />,
			title: '이번 달 주차장 운영 현황',
			subtitle: '월 평균 이용률 78.4% | 피크시간 14:00-18:00 (94.2%) | 수익: ₩24,750,000 (전월 대비 +12%)',
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
				subtitle="차량 입출차 및 출입제어 시스템 통합 관리"
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