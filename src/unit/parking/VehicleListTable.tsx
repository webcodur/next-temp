import React from 'react';
import InfiniteScroll from '@/components/ui/infinite-scroll/InfiniteScroll';
import { VehicleEntry, SearchFilters } from '@/types/parking';
import { parseCarAllowType } from '@/data/mockParkingData';

interface VehicleListTableProps {
	vehicles: VehicleEntry[];
	filters: SearchFilters;
	selectedVehicle: VehicleEntry | null;
	onVehicleSelect: (vehicle: VehicleEntry) => void;
	onLoadMore: () => void;
	hasMore: boolean;
	isLoading: boolean;
}

const VehicleListTable: React.FC<VehicleListTableProps> = ({
	vehicles,
	filters,
	selectedVehicle,
	onVehicleSelect,
	onLoadMore,
	hasMore,
	isLoading,
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
		<div className="p-2 bg-white neu-flat rounded-xl">
			{/* 헤더 */}
			<div className="flex items-center justify-between mb-2">
				<h2 className="text-sm font-semibold text-gray-800">
					금일 입출차 현황
				</h2>
				<div className="text-xs text-gray-600">
					총 {filteredVehicles.length}건
				</div>
			</div>

			{/* 테이블 - 고정 높이 500px로 제한 */}
			<div
				className="bg-white border border-gray-200 rounded-lg neu-inset"
				style={{ height: '500px', maxHeight: '500px', minHeight: '500px' }}>
				<div className="flex flex-col h-full overflow-hidden">
					{/* 테이블 헤더 - 고정 */}
					<div className="flex-shrink-0 border-b border-gray-200 bg-gray-50">
						<table className="w-full text-xs">
							<thead>
								<tr>
									<th className="px-2 py-1 text-xs font-medium text-left text-gray-600">
										순번
									</th>
									<th className="px-2 py-1 text-xs font-medium text-left text-gray-600">
										차량구분
									</th>
									<th className="px-2 py-1 text-xs font-medium text-left text-gray-600">
										차량번호
									</th>
									<th className="px-2 py-1 text-xs font-medium text-left text-gray-600">
										입출차
									</th>
									<th className="px-2 py-1 text-xs font-medium text-left text-gray-600">
										이용시간
									</th>
								</tr>
							</thead>
						</table>
					</div>

					{/* 테이블 바디 - 스크롤 영역 */}
					<div className="flex-1 overflow-y-auto">
						<InfiniteScroll
							loadMore={onLoadMore}
							hasMore={hasMore}
							isLoading={isLoading}
							threshold={0.8}>
							<table className="w-full text-xs">
								<tbody>
									{filteredVehicles.map((vehicle, index) => (
										<tr
											key={`${vehicle.id}_${vehicle.status}_${index}`}
											onClick={() => handleRowClick(vehicle)}
											className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
												selectedVehicle?.id === vehicle.id &&
												selectedVehicle?.status === vehicle.status
													? 'bg-blue-100'
													: vehicle.is_black === 'Y'
														? 'bg-red-50'
														: ''
											}`}>
											<td className="px-2 py-1 text-xs text-gray-800">
												{(filteredVehicles.length - index)
													.toString()
													.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
											</td>
											<td className="px-2 py-1 text-xs">
												<div>
													<div className="font-medium text-gray-800">
														{parseCarAllowType(vehicle.type)}
														{vehicle.modify_car_type && (
															<span className="ml-1 text-orange-600">
																→{parseCarAllowType(vehicle.modify_car_type)}
															</span>
														)}
													</div>
													{(vehicle.address_1depth ||
														vehicle.address_2depth) && (
														<div className="text-xs text-gray-500">
															{vehicle.address_1depth} {vehicle.address_2depth}
														</div>
													)}
												</div>
											</td>
											<td className="px-2 py-1 text-xs">
												<div className="font-medium text-gray-800">
													{vehicle.car_number}
													{vehicle.modify_car_number && (
														<div className="text-xs text-orange-600">
															→ {vehicle.modify_car_number}
														</div>
													)}
												</div>
											</td>
											<td className="px-2 py-1 text-xs">
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
											</td>
											<td className="px-2 py-1 text-xs text-gray-800">
												{vehicle.use_time}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</InfiniteScroll>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VehicleListTable;
