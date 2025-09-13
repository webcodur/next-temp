import React from 'react';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { InfiniteTable, BaseTableColumn } from '@/components/ui/ui-data/infiniteTable/InfiniteTable';
import VehicleSearchFilter from './VehicleSearchFilter';
import { VehicleEntry, SearchFilters } from '@/types/parking';
import { parseCarAllowTypeKey, parseDeviceNameKey } from '@/data/mockParkingData';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';

// #region Types & Constants
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
	showTitle?: boolean;
}

const SIZE_CLASSES = {
	sm: { headerText: 'text-xs', rowText: 'text-xs', rowPadding: 'py-1 px-2' },
	md: { headerText: 'text-sm', rowText: 'text-sm', rowPadding: 'py-2 px-3' },
	lg: { headerText: 'text-base', rowText: 'text-base', rowPadding: 'py-2 px-4' },
} as const;
// #endregion

// #region Utilities

const filterVehicles = (vehicles: VehicleEntry[], filters: SearchFilters): VehicleEntry[] => {
	return vehicles.filter((vehicle) => {
		if (filters.car_type && vehicle.type.toString() !== filters.car_type) return false;
		if (filters.in_out_status && vehicle.status.toString() !== filters.in_out_status) return false;
		if (filters.entrance_status && vehicle.device_name !== filters.entrance_status) return false;
		if (filters.keyword && !vehicle.car_number.includes(filters.keyword)) return false;
		return true;
	});
};
// #endregion

// #region Table Columns
const createColumns = (
	t: ReturnType<typeof useTranslations>, 
	filteredVehicles: VehicleEntry[]
): BaseTableColumn<VehicleEntry>[] => {
	return [
		{
			header: t('주차_테이블_헤더_순번'),
			minWidth: '60px',
			align: 'center',
			cell: (_item, index) => (
				<div className="font-mono text-base text-center">
					{(filteredVehicles.length - index)
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				</div>
			),
		},
		{
			key: 'type',
			header: t('주차_테이블_헤더_차량구분'),
			minWidth: '120px',
			align: 'start',
			cell: (vehicle) => (
				<div className="space-y-1">
					<div className="text-base font-medium leading-tight text-foreground">
						{t(parseCarAllowTypeKey(vehicle.type))}
						{vehicle.modify_car_type && (
							<span className="ml-1 text-sm text-warning">
								→{t(parseCarAllowTypeKey(vehicle.modify_car_type))}
							</span>
						)}
					</div>
					{(vehicle.address_1depth || vehicle.address_2depth) && (
						<div className="text-sm leading-tight text-muted-foreground">
							{vehicle.address_1depth} {vehicle.address_2depth}
						</div>
					)}
				</div>
			),
		},
		{
			key: 'car_number',
			header: t('주차_테이블_헤더_차량번호'),
			minWidth: '100px',
			align: 'start',
			cell: (vehicle) => (
				<div className="space-y-1">
					<div className="text-base font-bold leading-tight font-multilang">
						{vehicle.car_number}
					</div>
					{vehicle.modify_car_number && (
						<div className="flex gap-1 items-center">
							<span className="text-sm text-warning">→</span>
							<div className="text-base font-bold leading-tight font-multilang text-warning">
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
			minWidth: '80px',
			align: 'center',
			cell: (vehicle) => (
				<div className="space-y-1">
					<span
						className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${
							vehicle.status === 1
								? 'bg-primary/10 text-primary'
								: 'bg-success/10 text-success'
						}`}
					>
						{vehicle.status === 1 ? t('주차_상태_입차') : t('주차_상태_출차')}
					</span>
					{vehicle.device_name && (
						<div className="text-sm leading-tight text-muted-foreground">
							{t(parseDeviceNameKey(vehicle.device_name))}
						</div>
					)}
				</div>
			),
		},
		{
			key: 'use_time',
			header: t('주차_테이블_헤더_이용시간'),
			minWidth: '140px',
			align: 'center',
			cell: (vehicle) => (
				<div className="text-sm font-mono text-center">
					{vehicle.use_time || '-'}
				</div>
			),
		},
	];
};
// #endregion

// #region Main Component
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
}) => {
	const t = useTranslations();
	const currentSize = SIZE_CLASSES[size];
	const filteredVehicles = filterVehicles(vehicles, filters);
	const columns = createColumns(t, filteredVehicles);

	const getRowClassName = (item: VehicleEntry) => {
		const baseClasses = `${currentSize.rowText} ${currentSize.rowPadding}`;
		const isSelected = selectedVehicle?.id === item.id && selectedVehicle?.status === item.status;
		const isBlacklisted = item.is_black === 'Y';
		
		return `${baseClasses} ${
			isSelected ? 'bg-primary/10' : isBlacklisted ? 'bg-destructive/10' : ''
		}`;
	};

	const renderTable = () => {
		const tableProps = {
			columns,
			getRowClassName: getRowClassName,
			onRowClick: onVehicleSelect,
			loadMore: onLoadMore,
			hasMore: hasMore,
			isLoadingMore: isLoading,
			threshold: 0.8,
		};

		return (
			<InfiniteTable
				data={filteredVehicles}
				{...tableProps}
			/>
		);
	};

    return (
		<SectionPanel 
			title={t('주차_테이블_제목_금일입출차현황')}
		>
			{/* 검색 필터 */}
			<div className="">
				<VehicleSearchFilter
					filters={filters}
					onFiltersChange={onFiltersChange}
					onSearch={onSearch}
				/>
			</div>

			{/* 테이블 영역 - 최대 높이 제한 및 스크롤 처리 */}
			<div className="flex-shrink-0 p-4 pt-0">
				<div 
					className="overflow-hidden rounded-lg border"
					style={{ height: '60vh', maxHeight: '600px', minHeight: '400px' }}
				>
					<div className="overflow-y-auto h-full">
						{renderTable()}
					</div>
				</div>
			</div>
		</SectionPanel>
	);
};
// #endregion

export default VehicleListTable;
