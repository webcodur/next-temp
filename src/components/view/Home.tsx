'use client';

import React, { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { Car, Shield, GripVertical } from 'lucide-react';
import {
	DndContext,
	closestCenter,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	horizontalListSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { pageTitleAtom, pageDescriptionAtom } from '@/store/page';

// #region Draggable Components
const SortableVehicleDetail = ({
	vehicle,
	showTitle,
}: {
	vehicle: VehicleEntry | null;
	showTitle: boolean;
}) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: 'details' });
	const t = useTranslations();
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 10 : 'auto',
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			className="flex flex-col w-full h-full lg:max-w-sm xl:max-w-md shrink-0"
		>
			<div
				{...listeners}
				className="flex gap-2 justify-center items-center p-2 rounded-t-lg cursor-grab neu-flat-focus"
			>
				<GripVertical size={18} className="text-muted-foreground" />
				<h2 className="text-lg font-semibold text-foreground">
					{t('주차_카드_차량정보')}
				</h2>
			</div>
			<VehicleDetailCard vehicle={vehicle} showTitle={showTitle} />
		</div>
	);
};

const SortableVehicleList = (
	props: React.ComponentProps<typeof VehicleListTable>,
) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: 'list' });
	const t = useTranslations();
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 10 : 'auto',
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			className="flex flex-col flex-1 w-full h-full neu-flat"
		>
			<div
				{...listeners}
				className="flex gap-2 justify-center items-center p-2 rounded-t-lg cursor-grab neu-flat-focus"
			>
				<GripVertical size={18} className="text-muted-foreground" />
				<h2 className="text-lg font-semibold text-foreground">
					{t('주차_테이블_제목_금일입출차현황')}
				</h2>
			</div>
			<div className="overflow-y-auto flex-1">
				<VehicleListTable {...props} />
			</div>
		</div>
	);
};
// #endregion

export default function Home() {
	const t = useTranslations();
	const setPageTitle = useSetAtom(pageTitleAtom);
	const setPageDescription = useSetAtom(pageDescriptionAtom);

	// #region 페이지 헤더 설정
	useEffect(() => {
		setPageTitle(t('주차_시스템제목'));
		setPageDescription(t('주차_시스템설명'));

		// 컴포넌트 언마운트 시 초기화
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
	const [panelOrder, setPanelOrder] = useState<string[]>(['details', 'list']);
	const [isClient, setIsClient] = useState(false);
	const [activeTab, setActiveTab] = useState('vehicles');
	// #endregion

	// #region DND-Kit 설정
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over && active.id !== over.id) {
			setPanelOrder((items) => {
				const oldIndex = items.indexOf(active.id as string);
				const newIndex = items.indexOf(over.id as string);
				return arrayMove(items, oldIndex, newIndex);
			});
		}
	};
	// #endregion

	// #region 초기 데이터 로드 및 클라이언트 확인
	useEffect(() => {
		const initialData = generateMockVehicleEntries(50);
		setVehicles(initialData);
		// 첫 번째 차량을 기본 선택
		if (initialData.length > 0) {
			setSelectedVehicle(initialData[0]);
		}
	}, []);

	useEffect(() => {
		setIsClient(true);
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
		// 페이지 전체 컨테이너
		<div className="flex flex-col h-full gap-6">
			<Tabs
				tabs={tabs}
				activeId={activeTab}
				onTabChange={setActiveTab}
				align="start"
				size="md"
			/>

			{activeTab === 'vehicles' &&
				(isClient ? (
					// 클라이언트에서만 렌더링: 드래그 앤 드롭 기능 활성화
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={panelOrder}
							strategy={horizontalListSortingStrategy}
						>
							<div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
								{panelOrder.map(id =>
									id === 'details' ? (
										<SortableVehicleDetail
											key="details"
											vehicle={selectedVehicle}
											showTitle={false}
										/>
									) : (
										<SortableVehicleList
											key="list"
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
									),
								)}
							</div>
						</SortableContext>
					</DndContext>
				) : (
					// 서버 사이드 렌더링 및 하이드레이션 이전의 정적 UI
					<div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
						{/* 차량 상세정보 패널 */}
						<div className="flex flex-col w-full h-full lg:max-w-sm xl:max-w-md shrink-0">
							<div className="flex gap-2 justify-center items-center p-2 rounded-t-lg">
								<GripVertical size={18} className="text-muted-foreground" />
								<h2 className="text-lg font-semibold text-foreground">
									{t('주차_카드_차량정보')}
								</h2>
							</div>
							<VehicleDetailCard vehicle={selectedVehicle} showTitle={false} />
						</div>

						{/* 차량 목록 테이블 */}
						<div className="flex flex-col flex-1 w-full h-full">
							<div className="flex gap-2 justify-center items-center p-2 rounded-t-lg">
								<GripVertical size={18} className="text-muted-foreground" />
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
				))}

			{activeTab === 'barriers' && (
				<div className="space-y-4">
					<BarrierGrid
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