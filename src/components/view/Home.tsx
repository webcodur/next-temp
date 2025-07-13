'use client';

import React, { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { Car, Shield } from 'lucide-react';
import Tabs from '@/components/ui/ui-layout/tabs/Tabs';
import VehicleDetailCard from '@/unit/parking/VehicleDetailCard';
import VehicleListTable from '@/unit/parking/VehicleListTable';
import BarrierManagementView from '@/components/view/parking/facility/barrier/BarrierManagementView';
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
import { pageTitleAtom, pageDescriptionAtom } from '@/store/page';

export default function Home() {
	const t = useTranslations();
	const setPageTitle = useSetAtom(pageTitleAtom);
	const setPageDescription = useSetAtom(pageDescriptionAtom);

	// #region 페이지 헤더 설정
	useEffect(() => {
		setPageTitle(t('주차_시스템제목'));
		setPageDescription(t('주차_시스템설명'));

		return () => {
			setPageTitle(null);
			setPageDescription('');
		};
	}, [setPageTitle, setPageDescription, t]);
	// #endregion

	// #region 상태 관리
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

	// #region 초기 데이터 로드
	useEffect(() => {
		const initialData = generateMockVehicleEntries(50);
		setVehicles(initialData);
		
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
		<div className="flex flex-col gap-6 h-full">
			<Tabs
				tabs={tabs}
				activeId={activeTab}
				onTabChange={setActiveTab}
				align="start"
				size="md"
			/>

			{activeTab === 'vehicles' && (
				<div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
					{/* 차량 상세정보 패널 */}
					<div className="flex flex-col w-full h-full lg:max-w-sm xl:max-w-md shrink-0 neu-flat bg-surface-2">
						<div className="flex gap-2 justify-center items-center p-2 rounded-t-lg">
							<h2 className="text-lg font-semibold text-foreground">
								{t('주차_카드_차량정보')}
							</h2>
						</div>
						<VehicleDetailCard vehicle={selectedVehicle} showTitle={false} />
					</div>

					{/* 차량 목록 테이블 */}
					<div className="flex flex-col flex-1 w-full h-full neu-flat bg-surface-2">
						<div className="flex gap-2 justify-center items-center p-2 rounded-t-lg">
							<h2 className="text-lg font-semibold text-foreground">
								{t('주차_테이블_제목_금일입출차현황')}
							</h2>
						</div>
						<div className="overflow-y-auto flex-1">
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
								showTitle={false}
							/>
						</div>
					</div>
				</div>
			)}

			{activeTab === 'barriers' && (
				<div className="space-y-4">
					<BarrierManagementView
						barriers={barriers}
						onBarrierOpen={handleBarrierOpen}
						onBarrierClose={handleBarrierClose}
						onOperationModeChange={handleOperationModeChange}
					/>
				</div>
			)}
		</div>
	);
}
// #endregion 