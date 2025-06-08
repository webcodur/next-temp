'use client';

import React, { useState, useEffect } from 'react';
import VehicleDetailCard from '@/unit/parking/VehicleDetailCard';
import VehicleSearchFilter from '@/unit/parking/VehicleSearchFilter';
import VehicleListTable from '@/unit/parking/VehicleListTable';
import BarrierGrid from '@/unit/parking/BarrierGrid';
import { VehicleEntry, SearchFilters, ParkingBarrier } from '@/types/parking';
import {
	generateMockVehicleEntries,
	mockBarriers,
} from '@/data/mockParkingData';

export default function Home() {
	// #region 상태 관리
	const [vehicles, setVehicles] = useState<VehicleEntry[]>([]);
	const [barriers, setBarriers] = useState<ParkingBarrier[]>(mockBarriers);
	const [selectedVehicle, setSelectedVehicle] = useState<VehicleEntry | null>(
		null
	);
	const [filters, setFilters] = useState<SearchFilters>({});
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	// #endregion

	// #region 초기 데이터 로드
	useEffect(() => {
		const initialData = generateMockVehicleEntries(50);
		setVehicles(initialData);
		// 첫 번째 차량을 기본 선택
		if (initialData.length > 0) {
			setSelectedVehicle(initialData[0]);
		}
	}, []);
	// #endregion

	// #region 무한스크롤 핸들러
	const handleLoadMore = () => {
		if (isLoading || vehicles.length >= 500) {
			setHasMore(false);
			return;
		}

		setIsLoading(true);

		// 실제로는 API 호출이지만 여기서는 Mock 데이터 추가
		setTimeout(() => {
			const newData = generateMockVehicleEntries(20);
			setVehicles((prev) => [...prev, ...newData]);
			setIsLoading(false);

			if (vehicles.length >= 480) {
				setHasMore(false);
			}
		}, 1000);
	};
	// #endregion

	// #region 이벤트 핸들러
	const handleFiltersChange = (newFilters: SearchFilters) => {
		setFilters(newFilters);
	};

	const handleSearch = () => {
		// 실제로는 API 호출하여 필터링된 데이터 가져오기
		console.log('검색 실행:', filters);
	};

	const handleVehicleSelect = (vehicle: VehicleEntry) => {
		setSelectedVehicle(vehicle);
	};

	const handleBarrierOpen = (barrierId: string) => {
		// 애니메이션이 완료된 후 상태 업데이트되도록 지연
		setTimeout(() => {
			setBarriers((prev) =>
				prev.map((barrier) =>
					barrier.id === barrierId ? { ...barrier, isOpen: true } : barrier
				)
			);
		}, 1000); // 애니메이션 지속시간과 맞춤
	};

	const handleBarrierClose = (barrierId: string) => {
		// 애니메이션이 완료된 후 상태 업데이트되도록 지연
		setTimeout(() => {
			setBarriers((prev) =>
				prev.map((barrier) =>
					barrier.id === barrierId ? { ...barrier, isOpen: false } : barrier
				)
			);
		}, 1000); // 애니메이션 지속시간과 맞춤
	};

	const handleBarrierAlwaysOpen = (barrierId: string) => {
		setBarriers((prev) =>
			prev.map((barrier) =>
				barrier.id === barrierId
					? { ...barrier, alwaysOpen: !barrier.alwaysOpen }
					: barrier
			)
		);
	};

	const handleBarrierAutoMode = (barrierId: string) => {
		setBarriers((prev) =>
			prev.map((barrier) =>
				barrier.id === barrierId
					? { ...barrier, autoMode: !barrier.autoMode }
					: barrier
			)
		);
	};

	const handleBarrierBypass = (barrierId: string) => {
		setBarriers((prev) =>
			prev.map((barrier) =>
				barrier.id === barrierId
					? { ...barrier, bypass: !barrier.bypass }
					: barrier
			)
		);
	};
	// #endregion

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-7xl mx-auto">
				{/* 헤더 */}
				<div className="mb-4">
					<h1 className="text-2xl font-bold text-gray-800 mb-1">
						주차관제 시스템
					</h1>
					<p className="text-sm text-gray-600">
						실시간 입출차 현황 및 차단기 제어
					</p>
				</div>

				{/* 메인 2분할 레이아웃 */}
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
					{/* 좌측: 입출차 패널 */}
					<div className="space-y-4">
						{/* 차량 상세정보 */}
						<VehicleDetailCard vehicle={selectedVehicle} />

						{/* 검색 필터 */}
						<VehicleSearchFilter
							filters={filters}
							onFiltersChange={handleFiltersChange}
							onSearch={handleSearch}
						/>

						{/* 차량 목록 테이블 */}
						<VehicleListTable
							vehicles={vehicles}
							filters={filters}
							selectedVehicle={selectedVehicle}
							onVehicleSelect={handleVehicleSelect}
							onLoadMore={handleLoadMore}
							hasMore={hasMore}
							isLoading={isLoading}
						/>
					</div>

					{/* 우측: 차단기 패널 */}
					<div>
						<BarrierGrid
							barriers={barriers}
							onBarrierOpen={handleBarrierOpen}
							onBarrierClose={handleBarrierClose}
							onBarrierAlwaysOpen={handleBarrierAlwaysOpen}
							onBarrierAutoMode={handleBarrierAutoMode}
							onBarrierBypass={handleBarrierBypass}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
