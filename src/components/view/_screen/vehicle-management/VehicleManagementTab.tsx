/* 
  파일명: VehicleManagementTab.tsx
  기능: 차량 입출차 관리 탭 컴포넌트
  책임: 차량 목록 조회, 검색, 상세 정보 표시 등 차량 관련 모든 기능을 담당한다
*/

'use client';

import React, { useState, useEffect } from 'react';
import VehicleDetailCard from '@/components/view/_screen/access-control/vehicleManager/VehicleDetailCard';
import VehicleListTable from '@/components/view/_screen/access-control/vehicleManager/VehicleListTable';
import type { VehicleEntry, SearchFilters } from '@/types/parking';
import { generateMockVehicleEntries } from '@/data/mockParkingData';

// #region 메인 컴포넌트
const VehicleManagementTab: React.FC = () => {
	// #region 상태
	const [vehicles, setVehicles] = useState<VehicleEntry[]>([]);
	const [selectedVehicle, setSelectedVehicle] = useState<VehicleEntry | null>(null);
	const [filters, setFilters] = useState<SearchFilters>({});
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
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
	// #endregion

	// #region 렌더링
	return (
		<div className="flex flex-col gap-4 min-h-0 lg:flex-row lg:items-start">
			{/* 차량 상세정보 패널 */}
			<div className="w-full lg:max-w-sm xl:max-w-md shrink-0">
				<VehicleDetailCard vehicle={selectedVehicle} showTitle={true} />
			</div>

			{/* 차량 목록 테이블 */}
			<div className="overflow-hidden flex-1 w-full min-w-0 neu-elevated">
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
	);
	// #endregion
};

export default VehicleManagementTab; 