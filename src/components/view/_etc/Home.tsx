/* 
  파일명: /components/view/Home.tsx
  기능: 주차 관리 시스템의 메인 홈페이지 컴포넌트
  책임: 차량 입출차 관리와 차단기 제어 기능을 탭으로 제공한다.
  메뉴 설명: 주차 시스템을 통합 관리하는 메인 페이지
*/

'use client';

import React, { useState, useEffect } from 'react';

import { Car, Shield } from 'lucide-react';

import PageHeader from '@/components/ui/ui-layout/page-header/PageHeader';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import AccessControlManager from '@/components/view/_screen/access-control/AccessControlManager';
import VehicleDetailCard from '@/components/view/_screen/access-control/vehicleManager/VehicleDetailCard';
import VehicleListTable from '@/components/view/_screen/access-control/vehicleManager/VehicleListTable';

import type {
	VehicleEntry,
	SearchFilters,
	ParkingBarrier,
	OperationMode,
} from '@/types/parking';
import {
	generateMockVehicleEntries,
	mockBarriers,
} from '@/data/mockParkingData';

// #region 타입
// 추가 타입이 필요한 경우 여기에 정의
// #endregion

export default function Home() {
	// #region 상수
	const tabs = [
		{
			id: 'vehicles',
			label: '차량 입출차 관리',
			icon: <Car size={16} />,
		},
		{
			id: 'access-control',
			label: '출입제어 관리',
			icon: <Shield size={16} />,
		},
	];
	// #endregion

	// #region 상태
	const [vehicles, setVehicles] = useState<VehicleEntry[]>([]);
	const [barriers, setBarriers] = useState<ParkingBarrier[]>(mockBarriers);
	const [selectedVehicle, setSelectedVehicle] = useState<VehicleEntry | null>(
		null,
	);
	const [filters, setFilters] = useState<SearchFilters>({});
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [activeTab, setActiveTab] = useState('vehicles');
	// #endregion

	// #region 훅
	// 초기 데이터 로드
	useEffect(() => {
		const initialData = generateMockVehicleEntries(50);
		setVehicles(initialData);
		
		if (initialData.length > 0) {
			setSelectedVehicle(initialData[0]);
		}
	}, []);
	// #endregion

	// #region 핸들러
	const handleLoadMore = () => {
		if (isLoading || vehicles.length >= 500) {
			setHasMore(false);
			return;
		}

		setIsLoading(true);

		setTimeout(() => {
			const newData = generateMockVehicleEntries(20);
			setVehicles((prev) => [...prev, ...newData]);
			setIsLoading(false);

			if (vehicles.length >= 480) {
				setHasMore(false);
			}
		}, 1000);
	};

	const handleFiltersChange = (newFilters: SearchFilters) => {
		setFilters(newFilters);
	};

	const handleSearch = () => {
		console.log('검색 실행:', filters);
	};

	const handleVehicleSelect = (vehicle: VehicleEntry) => {
		setSelectedVehicle(vehicle);
	};

	const handleBarrierOpen = (barrierId: string) => {
		setBarriers((prev) =>
			prev.map((barrier) =>
				barrier.id === barrierId ? { ...barrier, isOpen: true } : barrier,
			),
		);
	};

	const handleBarrierClose = (barrierId: string) => {
		setBarriers((prev) =>
			prev.map((barrier) =>
				barrier.id === barrierId ? { ...barrier, isOpen: false } : barrier,
			),
		);
	};

	const handleOperationModeChange = (
		barrierId: string,
		mode: OperationMode,
	) => {
		setBarriers((prev) =>
			prev.map((barrier) =>
				barrier.id === barrierId ? { ...barrier, operationMode: mode } : barrier,
			),
		);
	};
	// #endregion

	// #region 렌더링
	return (
		<div className="flex flex-col gap-6 h-full">
			<PageHeader title="통합 대시보드" />
			
			{/* 탭과 콘텐츠를 하나의 컨테이너로 묶음 */}
			<div className="flex flex-col">
				<Tabs
					tabs={tabs}
					activeId={activeTab}
					onTabChange={setActiveTab}
				/>

				{/* 콘텐츠 영역 - 탭과 연결된 스타일 */}
				<div className="p-6 rounded-b-lg border-b-2 border-s-2 border-e-2 border-border bg-background">
					{activeTab === 'vehicles' && (
						<div className="flex flex-col gap-4 min-h-0 lg:flex-row lg:items-start">
							{/* 차량 상세정보 패널 */}
							<div className="w-full lg:max-w-sm xl:max-w-md shrink-0">
								<VehicleDetailCard vehicle={selectedVehicle} showTitle={true} />
							</div>

							{/* 차량 목록 테이블 */}
							<div className="overflow-hidden flex-1 w-full min-w-0">
								<VehicleListTable
									vehicles={vehicles}
									filters={filters}
									selectedVehicle={selectedVehicle}
									onVehicleSelect={handleVehicleSelect}
									onLoadMore={handleLoadMore}
									hasMore={hasMore}
									isLoading={isLoading}
									onFiltersChange={handleFiltersChange}
									onSearch={handleSearch}
									size="lg"
									showTitle={true}
								/>
							</div>
						</div>
					)}

					{activeTab === 'access-control' && (
						<div className="space-y-4">
							<AccessControlManager
								barriers={barriers}
								onBarrierOpen={handleBarrierOpen}
								onBarrierClose={handleBarrierClose}
								onOperationModeChange={handleOperationModeChange}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
	// #endregion
} 