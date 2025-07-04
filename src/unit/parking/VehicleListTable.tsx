import React from 'react';
import InfiniteScroll from '@/components/ui/ui-data/infinite-scroll/InfiniteScroll';
import VehicleSearchFilter from './VehicleSearchFilter';
import { VehicleEntry, SearchFilters } from '@/types/parking';
import { parseCarAllowType } from '@/data/mockParkingData';
import { LicensePlate } from '@/components/ui/system-testing/license-plate';
import { useTranslations } from '@/hooks/useI18n';

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
}) => {
	const t = useTranslations();
	
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
						<div className="flex text-xs font-medium text-muted-foreground">
							<div className="px-2 py-1 w-16 text-start">{t('주차_테이블_헤더_순번')}</div>
							<div className="px-2 py-1 w-32 text-start">{t('주차_테이블_헤더_차량구분')}</div>
							<div className="px-2 py-1 w-40 text-start">{t('주차_테이블_헤더_차량번호')}</div>
							<div className="px-2 py-1 w-20 text-start">{t('주차_테이블_헤더_입출차')}</div>
							<div className="flex-1 px-2 py-1 text-start">{t('주차_테이블_헤더_이용시간')}</div>
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
										className={`flex items-center border-b border-border hover:bg-muted cursor-pointer transition-colors text-xs py-2 ${
											selectedVehicle?.id === vehicle.id &&
											selectedVehicle?.status === vehicle.status
												? 'bg-primary/10'
												: vehicle.is_black === 'Y'
													? 'bg-destructive/10'
													: ''
										}`}>
										<div className="px-2 py-1 w-16 text-foreground">
											{(filteredVehicles.length - index)
												.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										</div>
										<div className="px-2 py-1 w-32">
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
										<div className="px-2 py-1 w-40">
											<div className="flex flex-col gap-1">
												<LicensePlate
													plateNumber={vehicle.car_number}
													width="120px"
												/>
												{vehicle.modify_car_number && (
													<>
														<span className="text-xs text-warning">→</span>
														<LicensePlate
															plateNumber={vehicle.modify_car_number}
															width="120px"
														/>
													</>
												)}
											</div>
										</div>
										<div className="px-2 py-1 w-20">
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
										<div className="flex-1 px-2 py-1 text-foreground">
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
