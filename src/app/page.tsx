'use client';

import React, { useState, useEffect } from 'react';
import { Car, Shield } from 'lucide-react';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import VehicleDetailCard from '@/unit/parking/VehicleDetailCard';
import VehicleListTable from '@/unit/parking/VehicleListTable';
import BarrierGrid from '@/unit/parking/BarrierGrid';
import {
	VehicleEntry,
	SearchFilters,
	ParkingBarrier,
	OperationMode,
} from '@/types/parking';
import {
	generateMockVehicleEntries,
	mockBarriers,
} from '@/data/mockParkingData';
import { useTranslations } from '@/hooks/useI18n';

export default function Home() {
	const t = useTranslations();

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
		// 상태를 즉시 업데이트 (애니메이션은 자동으로 처리됨)
		setBarriers((prev) =>
			prev.map((barrier) =>
				barrier.id === barrierId ? { ...barrier, isOpen: true } : barrier
			)
		);
	};

	const handleBarrierClose = (barrierId: string) => {
		// 상태를 즉시 업데이트 (애니메이션은 자동으로 처리됨)
		setBarriers((prev) =>
			prev.map((barrier) =>
				barrier.id === barrierId ? { ...barrier, isOpen: false } : barrier
			)
		);
	};

	const handleOperationModeChange = (
		barrierId: string,
		mode: OperationMode
	) => {
		setBarriers((prev) =>
			prev.map((barrier) =>
				barrier.id === barrierId ? { ...barrier, operationMode: mode } : barrier
			)
		);
	};
	// #endregion

	// #region 탭 데이터
	const tabs = [
		{
			id: 'vehicles',
			label: t('주차_입출차관리'),
			icon: <Car size={16} />,
		},
		{
			id: 'barriers',
			label: t('주차_차단기제어'),
			icon: <Shield size={16} />,
		},
	];
	// #endregion

	// #region 렌더링
	return (
		<div className="p-4 min-h-screen bg-background">
			<div className="mx-auto max-w-7xl">
				{/* 헤더 */}
				<div className="mb-6">
					<h1 className="mb-1 text-2xl font-bold text-foreground">
						{t('주차_시스템제목')}
					</h1>
					<p className="text-sm text-muted-foreground">{t('주차_시스템설명')}</p>
				</div>

				{/* 탭 메뉴 */}
				<Tabs
					tabs={tabs}
					variant="default"
					align="start"
					size="md"
					forceRemount={true}>
					{/* 입출차 관리 탭 */}
					<div className="space-y-4">
						{/* 차량 상세정보 */}
						<VehicleDetailCard vehicle={selectedVehicle} />

						{/* 차량 목록 테이블 */}
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
						/>
					</div>

					{/* 차단기 제어 탭 */}
					<div className="space-y-4">
						<BarrierGrid
							barriers={barriers}
							onBarrierOpen={handleBarrierOpen}
							onBarrierClose={handleBarrierClose}
							onOperationModeChange={handleOperationModeChange}
						/>
					</div>
				</Tabs>
			</div>
		</div>
	);
}
// #endregion
