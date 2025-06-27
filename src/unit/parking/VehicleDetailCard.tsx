import React, { useState } from 'react';
import Image from 'next/image';
import { Car, Check } from 'lucide-react';
import { VehicleEntry } from '@/types/parking';
import { parseCarAllowType } from '@/data/mockParkingData';
import { LicensePlate } from '@/components/ui/license-plate';

interface VehicleDetailCardProps {
	vehicle: VehicleEntry | null;
}

const VehicleDetailCard: React.FC<VehicleDetailCardProps> = ({ vehicle }) => {
	const [imageError, setImageError] = useState(false);
	const [copiedPlate, setCopiedPlate] = useState<string | null>(null);

	// 번호판 복사 핸들러
	const handlePlateClick = async (plateNumber: string) => {
		try {
			await navigator.clipboard.writeText(plateNumber);
			setCopiedPlate(plateNumber);
			setTimeout(() => setCopiedPlate(null), 2000);
		} catch (error) {
			console.error('번호판 복사 실패:', error);
		}
	};

	return (
		<div className="p-4 bg-white rounded-2xl neu-flat">
			<div className="flex flex-col gap-4 lg:flex-row">
				{/* 차량 이미지 영역 */}
				<div className="shrink-0">
					<div className="overflow-hidden relative w-full h-96 bg-gray-50 rounded-xl lg:w-80 neu-inset">
						{!imageError ? (
							<Image
								src="/temp-car-img.png"
								alt="차량 이미지"
								fill
								className="object-cover"
								onError={() => setImageError(true)}
							/>
						) : (
							<div className="flex justify-center items-center w-full h-full">
								{/* 차량 아이콘을 이미지 섹션 전체에 표시 */}
								<Car className="w-48 h-48 text-gray-500" strokeWidth={1} />
							</div>
						)}
					</div>
				</div>

				{/* 차량 정보 영역 */}
				<div className="flex-1">
					{vehicle ? (
						<div className="space-y-4">
							{/* 차량번호 및 상태 */}
							<div className="flex flex-col gap-4">
								{/* 상태 태그 */}
								<div className="flex justify-center">
									<div
										className={`px-3 py-1 rounded-lg text-sm font-medium neu-raised ${
											vehicle.status === 1
												? 'bg-blue-100 text-blue-700 border border-blue-200'
												: 'bg-green-100 text-green-700 border border-green-200'
										}`}>
										{vehicle.status === 1 ? '입차' : '출차'}
									</div>
								</div>

								{/* 번호판 */}
								<div className="flex gap-4 justify-center items-center">
									<div className="relative">
										<div 
											className="cursor-pointer"
											onClick={() => handlePlateClick(vehicle.car_number)}>
											<LicensePlate
												plateNumber={vehicle.car_number}
												width="400px"
											/>
										</div>
										{copiedPlate === vehicle.car_number && (
											<div className="absolute -top-8 left-1/2 px-3 py-1 text-xs text-white bg-green-500 rounded-lg shadow-lg transform -translate-x-1/2 neu-raised animate-fadeIn">
												<Check size={12} className="inline mr-1" />
												복사됨
											</div>
										)}
									</div>
									{vehicle.modify_car_number && (
										<>
											<span className="text-2xl font-bold text-orange-600">
												→
											</span>
											<div className="relative">
												<div 
													className="cursor-pointer hover:scale-[1.02] transition-transform"
													onClick={() => handlePlateClick(vehicle.modify_car_number!)}>
													<LicensePlate
														plateNumber={vehicle.modify_car_number}
														width="320px"
													/>
												</div>
												{copiedPlate === vehicle.modify_car_number && (
													<div className="absolute -top-8 left-1/2 px-3 py-1 text-xs text-white bg-green-500 rounded-lg shadow-lg transform -translate-x-1/2 neu-raised animate-fadeIn">
														<Check size={12} className="inline mr-1" />
														복사됨
													</div>
												)}
											</div>
										</>
									)}
								</div>
							</div>

							{/* 차량 구분 */}
							<div className="flex flex-col gap-1 items-center text-center">
								<span className="text-sm font-medium text-gray-600">
									차량구분
								</span>
								<div className="text-sm font-semibold text-gray-800">
									{parseCarAllowType(vehicle.type)}
									{vehicle.modify_car_type && (
										<span className="ml-2 text-orange-600">
											→ {parseCarAllowType(vehicle.modify_car_type)}
										</span>
									)}
								</div>
								{(vehicle.address_1depth || vehicle.address_2depth) && (
									<div className="text-sm text-gray-600">
										{vehicle.address_1depth} {vehicle.address_2depth}
									</div>
								)}
							</div>

							{/* 시간 정보 */}
							<div className="grid grid-cols-1 gap-2 mt-3 md:grid-cols-2">
								<div className="p-3 text-center bg-gray-50 rounded-lg border">
									<div className="mb-1 text-xs text-gray-600">
										{vehicle.status === 1 ? '입차시간' : '출차시간'}
									</div>
									<div className="text-sm font-semibold text-gray-800">
										{vehicle.use_time}
									</div>
								</div>

								{vehicle.device_name && (
									<div className="p-3 text-center bg-gray-50 rounded-lg border">
										<div className="mb-1 text-xs text-gray-600">통행입구</div>
										<div className="text-sm font-semibold text-gray-800">
											{vehicle.device_name}
										</div>
									</div>
								)}
							</div>

							{/* 특별 표시 */}
							{vehicle.is_black === 'Y' && (
								<div className="flex gap-2 justify-center items-center mt-3">
									<div className="w-2 h-2 bg-red-500 rounded-full"></div>
									<span className="text-sm font-medium text-red-600">
										블랙리스트 차량
									</span>
								</div>
							)}
						</div>
					) : (
						<div className="flex justify-center items-center h-full">
							<div className="text-center text-gray-500">
								<div className="mb-2 text-base font-medium">
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
