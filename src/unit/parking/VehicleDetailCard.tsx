import React from 'react';
import { VehicleEntry } from '@/types/parking';
import { parseCarAllowType } from '@/data/mockParkingData';

interface VehicleDetailCardProps {
	vehicle: VehicleEntry | null;
}

const VehicleDetailCard: React.FC<VehicleDetailCardProps> = ({ vehicle }) => {
	return (
		<div className="neu-flat rounded-2xl p-3 bg-white">
			<div className="flex flex-col lg:flex-row gap-3">
				{/* 차량 이미지 영역 */}
				<div className="flex-shrink-0">
					<div className="w-full lg:w-48 h-28 neu-inset rounded-xl overflow-hidden bg-gray-50">
						<img
							src="/temp-car-img.png"
							alt="차량 이미지"
							className="w-full h-full object-cover"
							onError={(e) => {
								e.currentTarget.src =
									'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDMyMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNDQgOTZIMTc2VjEyOEgxNDRWOTZaIiBmaWxsPSIjOUI5QjlCIi8+CjwvZz4KPC9zdmc+';
							}}
						/>
					</div>
				</div>

				{/* 차량 정보 영역 */}
				<div className="flex-1">
					{vehicle ? (
						<div className="space-y-2">
							{/* 차량번호 및 상태 */}
							<div className="flex items-center gap-2">
								<div
									className={`px-1.5 py-0.5 rounded text-xs font-medium neu-raised ${
										vehicle.status === 1
											? 'bg-blue-100 text-blue-700'
											: 'bg-green-100 text-green-700'
									}`}>
									{vehicle.status === 1 ? '입차' : '출차'}
								</div>
								<h2 className="text-lg font-bold text-gray-800">
									{vehicle.car_number}
									{vehicle.modify_car_number && (
										<span className="text-orange-600 ml-2">
											→ {vehicle.modify_car_number}
										</span>
									)}
								</h2>
							</div>

							{/* 차량 구분 */}
							<div className="flex items-center gap-2">
								<span className="text-gray-600 font-medium text-sm">
									차량구분:
								</span>
								<span className="text-gray-800 font-semibold text-sm">
									{parseCarAllowType(vehicle.type)}
									{vehicle.modify_car_type && (
										<span className="text-orange-600 ml-2">
											→ {parseCarAllowType(vehicle.modify_car_type)}
										</span>
									)}
								</span>
								{(vehicle.address_1depth || vehicle.address_2depth) && (
									<span className="text-gray-600 ml-2 text-sm">
										| {vehicle.address_1depth} {vehicle.address_2depth}
									</span>
								)}
							</div>

							{/* 시간 정보 */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
								<div className="neu-inset rounded-lg p-2">
									<div className="text-xs text-gray-600 mb-1">
										{vehicle.status === 1 ? '입차시간' : '출차시간'}
									</div>
									<div className="text-sm font-semibold text-gray-800">
										{vehicle.use_time}
									</div>
								</div>

								{vehicle.device_name && (
									<div className="neu-inset rounded-lg p-2">
										<div className="text-xs text-gray-600 mb-1">통행입구</div>
										<div className="text-sm font-semibold text-gray-800">
											{vehicle.device_name}
										</div>
									</div>
								)}
							</div>

							{/* 특별 표시 */}
							{vehicle.is_black === 'Y' && (
								<div className="flex items-center gap-2 mt-3">
									<div className="w-2 h-2 bg-red-500 rounded-full"></div>
									<span className="text-red-600 font-medium text-sm">
										블랙리스트 차량
									</span>
								</div>
							)}
						</div>
					) : (
						<div className="flex items-center justify-center h-full">
							<div className="text-center text-gray-500">
								<div className="text-base font-medium mb-2">
									차량을 선택해주세요
								</div>
								<div className="text-sm">
									목록에서 차량을 클릭하면 상세정보가 표시됩니다
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default VehicleDetailCard;
