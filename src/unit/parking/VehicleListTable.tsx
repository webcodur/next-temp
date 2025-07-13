import React from 'react';
import { InfiniteSmartTable } from '@/components/ui/ui-data/infiniteSmartTable/InfiniteSmartTable';
import VehicleSearchFilter from './VehicleSearchFilter';
import { VehicleEntry, SearchFilters } from '@/types/parking';
import { parseCarAllowType } from '@/data/mockParkingData';
import { useTranslations } from '@/hooks/useI18n';
import { SmartTable } from '@/components/ui/ui-data/smartTable/SmartTable';
import type { SmartTableColumn } from '@/components/ui/ui-data/smartTable/SmartTable';

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
	sm: { headerText: 'text-xs', rowText: 'text-xs', rowPadding: 'py-2' },
	md: { headerText: 'text-sm', rowText: 'text-sm', rowPadding: 'py-2.5' },
	lg: { headerText: 'text-base', rowText: 'text-base', rowPadding: 'py-3' },
} as const;
// #endregion

// #region Utilities
const formatDateTime = (dateStr: string) => {
	const dateObj = new Date(dateStr);
	if (isNaN(dateObj.getTime())) return dateStr;
	
	const yy = String(dateObj.getFullYear()).slice(2);
	const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
	const dd = String(dateObj.getDate()).padStart(2, '0');
	const HH = String(dateObj.getHours()).padStart(2, '0');
	const ii = String(dateObj.getMinutes()).padStart(2, '0');
	const ss = String(dateObj.getSeconds()).padStart(2, '0');
	
	return { date: `${yy}-${mm}-${dd}`, time: `${HH}-${ii}-${ss}` };
};

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
const createColumns = (t: ReturnType<typeof useTranslations>, filteredVehicles: VehicleEntry[]): SmartTableColumn<VehicleEntry>[] => [
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
			const formatted = formatDateTime(vehicle.use_time);
			return typeof formatted === 'string' ? (
				<span>{formatted}</span>
			) : (
				<div className="flex flex-col">
					<span>{formatted.date}</span>
					<span>{formatted.time}</span>
				</div>
			);
		},
	},
];
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
			rowClassName: getRowClassName,
			onRowClick: onVehicleSelect,
		};

		return filteredVehicles.length === 0 ? (
			<SmartTable data={[]} {...tableProps} />
		) : (
			<InfiniteSmartTable
				data={filteredVehicles}
				loadMore={onLoadMore}
				hasMore={hasMore}
				isFetching={isLoading}
				threshold={0.8}
				{...tableProps}
			/>
		);
	};

	return (
		<div className="flex flex-col p-6 h-full rounded-xl">
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
				className="rounded-lg border bg-background"
				style={{ height: '500px', maxHeight: '500px', minHeight: '500px' }}
			>
				<div className="flex overflow-hidden flex-col h-full">
					<div className="overflow-y-auto flex-1">
						{renderTable()}
					</div>
				</div>
			</div>
		</div>
	);
};
// #endregion

export default VehicleListTable;
