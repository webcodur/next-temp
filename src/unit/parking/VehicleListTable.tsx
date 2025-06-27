import React from 'react';
import InfiniteScroll from '@/components/ui/infinite-scroll/InfiniteScroll';
import VehicleSearchFilter from './VehicleSearchFilter';
import { VehicleEntry, SearchFilters } from '@/types/parking';
import { parseCarAllowType } from '@/data/mockParkingData';
import { LicensePlate } from '@/components/ui/license-plate';

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
		<div className="p-2 bg-white rounded-xl neu-flat">
			{/* 헤더 */}
			<div className="flex justify-between items-center mb-2">
				<h2 className="text-sm font-semibold text-gray-800">
					금일 입출차 현황
				</h2>
				<div className="text-xs text-gray-600">
					총 {filteredVehicles.length}건
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
				className="bg-white rounded-lg border border-gray-200 neu-inset"
				style={{ height: '500px', maxHeight: '500px', minHeight: '500px' }}>
				<div className="flex overflow-hidden flex-col h-full">
					{/* 테이블 헤더 - 고정 */}
					<div className="bg-gray-50 border-b border-gray-200 shrink-0">
						<div className="flex text-xs font-medium text-gray-600">
							<div className="px-2 py-1 w-16 text-left">순번</div>
							<div className="px-2 py-1 w-32 text-left">차량구분</div>
							<div className="px-2 py-1 w-40 text-left">차량번호</div>
							<div className="px-2 py-1 w-20 text-left">입출차</div>
							<div className="flex-1 px-2 py-1 text-left">이용시간</div>
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
										className={`flex items-center border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors text-xs py-2 ${
											selectedVehicle?.id === vehicle.id &&
											selectedVehicle?.status === vehicle.status
												? 'bg-blue-100'
												: vehicle.is_black === 'Y'
													? 'bg-red-50'
													: ''
										}`}>
										<div className="px-2 py-1 w-16 text-gray-800">
											{(filteredVehicles.length - index)
												.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
										</div>
										<div className="px-2 py-1 w-32">
											<div>
												<div className="font-medium text-gray-800">
													{parseCarAllowType(vehicle.type)}
													{vehicle.modify_car_type && (
														<span className="ml-1 text-orange-600">
															→{parseCarAllowType(vehicle.modify_car_type)}
														</span>
													)}
												</div>
												{(vehicle.address_1depth || vehicle.address_2depth) && (
													<div className="text-xs text-gray-500">
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
														<span className="text-xs text-orange-600">→</span>
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
															? 'bg-blue-100 text-blue-700'
															: 'bg-green-100 text-green-700'
													}`}>
													{vehicle.status === 1 ? '입차' : '출차'}
												</span>
												{vehicle.device_name && (
													<div className="text-xs text-gray-500">
														{vehicle.device_name}
													</div>
												)}
											</div>
										</div>
										<div className="flex-1 px-2 py-1 text-gray-800">
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
