import React from 'react';
import InfiniteScroll from '@/components/ui/ui-data/infinite-scroll/InfiniteScroll';
import VehicleSearchFilter from './VehicleSearchFilter';
import { VehicleEntry, SearchFilters } from '@/types/parking';
import { parseCarAllowType } from '@/data/mockParkingData';
import { useTranslations } from '@/hooks/useI18n';
import { SmartTable } from '@/components/ui/ui-data/smartTable/SmartTable';
import type { SmartTableColumn } from '@/components/ui/ui-data/smartTable/SmartTable';

type TableSize = 'sm' | 'md' | 'lg';

interface VehicleListTableProps {
	vehicles: VehicleEntry[];
	filters: SearchFilters;
	selectedVehicle: VehicleEntry | null;
	onVehicleSelect: (vehicle: VehicleEntry) => void;
	onLoadMore: () => void;
	hasMore: boolean;
	isLoading: boolean;
	onFiltersChange: (filters: SearchFilters) => void;
	onSearch: () => void;
	size?: TableSize;
	/** 타이틀 표시 여부. 기본값 true */
	showTitle?: boolean;
}

const VehicleListTable: React.FC<VehicleListTableProps> = ({
	vehicles,
	filters,
	selectedVehicle,
	onVehicleSelect,
	onLoadMore,
	hasMore,
	isLoading,
	onFiltersChange,
	onSearch,
	size = 'sm',
	showTitle = true,
}) => {
	const t = useTranslations();
	
	// 사이즈 기반 클래스 매핑
	const sizeClasses = {
		sm: {
			headerText: 'text-xs',
			rowText: 'text-xs',
			rowPadding: 'py-2',
			plateWidth: '120px',
		},
		md: {
			headerText: 'text-sm',
			rowText: 'text-sm',
			rowPadding: 'py-2.5',
			plateWidth: '140px',
		},
		lg: {
			headerText: 'text-base',
			rowText: 'text-base',
			rowPadding: 'py-3',
			plateWidth: '160px',
		},
	} as const;

	const currentSize = sizeClasses[size];
	
	// SmartTable 컬럼 정의
	const columns: SmartTableColumn<VehicleEntry>[] = [
		{
			header: t('주차_테이블_헤더_순번'),
			width: '64px',
			align: 'start',
			sortable: false,
			cell: (_item, index) => (
				<span>
					{(filteredVehicles.length - index)
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				</span>
			),
		},
		{
			key: 'type',
			header: t('주차_테이블_헤더_차량구분'),
			width: '120px',
			align: 'start',
			cell: (vehicle) => (
				<div>
					<div className="font-medium text-foreground">
						{parseCarAllowType(vehicle.type)}
						{vehicle.modify_car_type && (
							<span className="ms-1 text-warning">
								→{parseCarAllowType(vehicle.modify_car_type)}
							</span>
						)}
					</div>
					{(vehicle.address_1depth || vehicle.address_2depth) && (
						<div className="text-xs text-muted-foreground">
							{vehicle.address_1depth} {vehicle.address_2depth}
						</div>
					)}
				</div>
			),
		},
		{
			key: 'car_number',
			header: t('주차_테이블_헤더_차량번호'),
			width: '140px',
			align: 'start',
			cell: (vehicle) => (
				<div className="flex flex-col gap-1">
					<div className="text-sm font-bold font-multilang">
						{vehicle.car_number}
					</div>
					{vehicle.modify_car_number && (
						<div className="flex gap-1 items-center">
							<span className="text-xs text-warning">→</span>
							<div className="text-sm font-bold font-multilang text-warning">
								{vehicle.modify_car_number}
							</div>
						</div>
					)}
				</div>
			),
		},
		{
			key: 'status',
			header: t('주차_테이블_헤더_입출차'),
			width: '96px',
			align: 'start',
			cell: (vehicle) => (
				<div>
					<span
						className={`inline-flex px-1 py-0.5 rounded text-xs font-medium ${
							vehicle.status === 1
								? 'bg-primary/10 text-primary'
								: 'bg-success/10 text-success'
						}`}
					>
						{vehicle.status === 1 ? t('주차_상태_입차') : t('주차_상태_출차')}
					</span>
					{vehicle.device_name && (
						<div className="text-xs text-muted-foreground">{vehicle.device_name}</div>
					)}
				</div>
			),
		},
		{
			key: 'use_time',
			header: t('주차_테이블_헤더_이용시간'),
			width: '160px',
			align: 'start',
			cell: (vehicle) => {
				const dateObj = new Date(vehicle.use_time);
				if (isNaN(dateObj.getTime())) {
					return <span>{vehicle.use_time}</span>; // 파싱 실패 시 원본 표시
				}
				const yy = String(dateObj.getFullYear()).slice(2);
				const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
				const dd = String(dateObj.getDate()).padStart(2, '0');
				const HH = String(dateObj.getHours()).padStart(2, '0');
				const ii = String(dateObj.getMinutes()).padStart(2, '0');
				const ss = String(dateObj.getSeconds()).padStart(2, '0');
				return (
					<div className="flex flex-col">
						<span>{`${yy}-${mm}-${dd}`}</span>
						<span>{`${HH}-${ii}-${ss}`}</span>
					</div>
				);
			},
		},
	];

	// 필터링된 차량 목록
	const filteredVehicles = vehicles.filter((vehicle) => {
		// 차량유형 필터
		if (filters.car_type && vehicle.type.toString() !== filters.car_type) {
			return false;
		}
		// 입출차 필터
		if (
			filters.in_out_status &&
			vehicle.status.toString() !== filters.in_out_status
		) {
			return false;
		}
		// 통행입구 필터
		if (
			filters.entrance_status &&
			vehicle.device_name !== filters.entrance_status
		) {
			return false;
		}
		// 차량번호 검색
		if (filters.keyword && !vehicle.car_number.includes(filters.keyword)) {
			return false;
		}
		return true;
	});

	const handleRowClick = (vehicle: VehicleEntry) => {
		onVehicleSelect(vehicle);
	};

	return (
		<div className="flex flex-col p-6 h-full rounded-xl bg-background neu-elevated">
			{/* 헤더 */}
			<div className="flex flex-col items-center mb-2">
				{showTitle && (
					<h2 className="text-sm font-semibold text-center text-foreground">
						{t('주차_테이블_제목_금일입출차현황')}
					</h2>
				)}
				<div className="text-xs text-muted-foreground">
					{t('주차_테이블_총건수').replace('{count}', filteredVehicles.length.toString())}
				</div>
			</div>

			{/* 검색 필터 */}
			<div className="mb-3">
				<VehicleSearchFilter
					filters={filters}
					onFiltersChange={onFiltersChange}
					onSearch={onSearch}
				/>
			</div>

			{/* 테이블 영역 */}
			<div
				className="rounded-lg border bg-background border-border neu-inset"
				style={{ height: '500px', maxHeight: '500px', minHeight: '500px' }}>
				<div className="flex overflow-hidden flex-col h-full">
					<div className="overflow-y-auto flex-1">
						{filteredVehicles.length === 0 ? (
							<SmartTable
								data={[]}
								columns={columns}
								rowClassName={(item) => `${currentSize.rowText} ${currentSize.rowPadding} ${
									selectedVehicle?.id === item.id && selectedVehicle?.status === item.status
										? 'bg-primary/10'
										: item.is_black === 'Y'
											? 'bg-destructive/10'
											: ''
								}`}
								onRowClick={(item) => handleRowClick(item)}
							/>
						) : (
							<InfiniteScroll
								loadMore={onLoadMore}
								hasMore={hasMore}
								isLoading={isLoading}
								threshold={0.8}>
								<SmartTable
									data={filteredVehicles}
									columns={columns}
									rowClassName={(item) => `${currentSize.rowText} ${currentSize.rowPadding} ${
										selectedVehicle?.id === item.id && selectedVehicle?.status === item.status
											? 'bg-primary/10'
											: item.is_black === 'Y'
												? 'bg-destructive/10'
												: ''
									}`}
									onRowClick={(item) => handleRowClick(item)}
								/>
							</InfiniteScroll>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default VehicleListTable;
