import React from 'react';
import InfiniteScroll from '@/components/ui/ui-data/infinite-scroll/InfiniteScroll';
import VehicleSearchFilter from './VehicleSearchFilter';
import { VehicleEntry, SearchFilters } from '@/types/parking';
import { parseCarAllowType } from '@/data/mockParkingData';
import { LicensePlate } from '@/components/ui/system-testing/license-plate';
import { useTranslations } from '@/hooks/useI18n';

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
	
	// 컬럼 너비 (% 기준) 및 최소 너비(px)
	const columnPercents = ['8', '20', '25', '12', '35'];
	const columnMinWidths = ['64', '120', '140', '96', '160'];
	const gridTemplateColumns = columnPercents
		.map((pct, idx) => `minmax(${columnMinWidths[idx]}px, ${pct}%)`)
		.join(' ');
	
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
		<div className="p-2 rounded-xl bg-background neu-flat">
			{/* 헤더 */}
			<div className="flex justify-between items-center mb-2">
				<h2 className="text-sm font-semibold text-foreground">
					{t('주차_테이블_제목_금일입출차현황')}
				</h2>
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

			{/* 테이블 - 고정 높이 500px로 제한 */}
			<div
				className="rounded-lg border bg-background border-border neu-inset"
				style={{ height: '500px', maxHeight: '500px', minHeight: '500px' }}>
				<div className="flex overflow-hidden flex-col h-full">
					{/* 테이블 헤더 - 고정 */}
					<div className="border-b bg-muted border-border shrink-0">
						<div
							className={`grid ${currentSize.headerText} font-medium text-muted-foreground`}
							style={{ gridTemplateColumns }}>
							<div className="px-2 py-1 text-start">{t('주차_테이블_헤더_순번')}</div>
							<div className="px-2 py-1 text-start">{t('주차_테이블_헤더_차량구분')}</div>
							<div className="px-2 py-1 text-start">{t('주차_테이블_헤더_차량번호')}</div>
							<div className="px-2 py-1 text-start">{t('주차_테이블_헤더_입출차')}</div>
							<div className="px-2 py-1 text-start">{t('주차_테이블_헤더_이용시간')}</div>
						</div>
					</div>

					{/* 테이블 바디 - 스크롤 영역 */}
					<div className="overflow-y-auto flex-1">
						<InfiniteScroll
							loadMore={onLoadMore}
							hasMore={hasMore}
							isLoading={isLoading}
							threshold={0.8}>
							<div>
								{filteredVehicles.map((vehicle, index) => (
									<div
										key={`${vehicle.id}_${vehicle.status}_${index}`}
										onClick={() => handleRowClick(vehicle)}
										className={`grid items-center border-b border-border hover:bg-muted cursor-pointer transition-colors ${currentSize.rowText} ${currentSize.rowPadding} ${
											selectedVehicle?.id === vehicle.id &&
											selectedVehicle?.status === vehicle.status
												? 'bg-primary/10'
												: vehicle.is_black === 'Y'
													? 'bg-destructive/10'
													: ''
										}`}
										style={{ gridTemplateColumns }}>
										<div className="px-2 py-1 text-foreground">
											{(filteredVehicles.length - index)
												.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										</div>
										<div className="px-2 py-1 text-foreground">
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
										</div>
										<div className="px-2 py-1 text-foreground">
											<div className="flex flex-col gap-1">
												<LicensePlate
													plateNumber={vehicle.car_number}
													width={currentSize.plateWidth}
												/>
												{vehicle.modify_car_number && (
													<>
														<span className="text-xs text-warning">→</span>
														<LicensePlate
															plateNumber={vehicle.modify_car_number}
															width={currentSize.plateWidth}
														/>
													</>
												)}
											</div>
										</div>
										<div className="px-2 py-1 text-foreground">
											<div>
												<span
													className={`inline-flex px-1 py-0.5 rounded text-xs font-medium ${
														vehicle.status === 1
															? 'bg-primary/10 text-primary'
															: 'bg-success/10 text-success'
													}`}>
													{vehicle.status === 1 ? t('주차_상태_입차') : t('주차_상태_출차')}
												</span>
												{vehicle.device_name && (
													<div className="text-xs text-muted-foreground">
														{vehicle.device_name}
													</div>
												)}
											</div>
										</div>
										<div className="px-2 py-1 text-foreground">
											{vehicle.use_time}
										</div>
									</div>
								))}
							</div>
						</InfiniteScroll>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VehicleListTable;
