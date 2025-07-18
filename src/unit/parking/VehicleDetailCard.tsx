import React, { useState } from 'react';
import Image from 'next/image';
import { Car, Check } from 'lucide-react';
import { VehicleEntry } from '@/types/parking';
import { parseCarAllowType } from '@/data/mockParkingData';
import { LicensePlate } from '@/components/ui/system-testing/license-plate';
import { useTranslations } from '@/hooks/useI18n';

interface VehicleDetailCardProps {
	vehicle: VehicleEntry | null;
	/** 타이틀 표시 여부. 기본값은 true */
	showTitle?: boolean;
}

const VehicleDetailCard: React.FC<VehicleDetailCardProps> = ({ vehicle, showTitle = true }) => {
	const t = useTranslations();
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
		<div className="flex flex-col p-6 h-full rounded-2xl">
			{showTitle && (
				<h2 className="mb-4 w-full text-lg font-semibold text-center text-foreground">
					{t('주차_카드_차량정보')}
				</h2>
			)}
			<div className="flex flex-col gap-4">
				{/* 차량 이미지 영역 */}
				<div className="shrink-0">
					<div className="relative mx-auto w-full h-72 rounded-xl lg:h-64 bg-muted neu-inset">
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
								<Car
									className="w-48 h-48 text-muted-foreground"
									strokeWidth={1}
								/>
							</div>
						)}
					</div>
				</div>

				{/* 차량번호 */}


				{/* 차량 정보 영역 */}
				<div className="flex-1">
					{vehicle ? (
						<div className="mt-4">
							{/* 차량번호 - 별도 섹션 */}
							<div className="mb-6 text-center">
								<div className="flex flex-col gap-3 justify-center items-center">
									<div className="relative cursor-pointer" onClick={() => handlePlateClick(vehicle.car_number)}>
										<LicensePlate plateNumber={vehicle.car_number} width="320px" />
										{copiedPlate === vehicle.car_number && (
											<div className="absolute -top-8 left-1/2 px-2 py-0.5 text-xs rounded-lg shadow-lg transform -translate-x-1/2 text-success-foreground bg-success neu-raised animate-fadeIn">
												<Check size={12} className="inline me-1" /> 복사됨
											</div>
										)}
									</div>
									{vehicle.modify_car_number && (
										<div className="flex gap-2 justify-center items-center">
											<span className="text-sm text-warning">변경됨</span>
											<div className="relative cursor-pointer" onClick={() => handlePlateClick(vehicle.modify_car_number!)}>
												<LicensePlate plateNumber={vehicle.modify_car_number} width="280px" />
												{copiedPlate === vehicle.modify_car_number && (
													<div className="absolute -top-8 left-1/2 px-2 py-0.5 text-xs rounded-lg shadow-lg transform -translate-x-1/2 text-success-foreground bg-success neu-raised animate-fadeIn">
														<Check size={12} className="inline me-1" /> 복사됨
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							</div>

							{/* 나머지 정보 */}
							<div className="grid grid-cols-[80px_1fr] gap-y-2 gap-x-4 items-stretch text-sm">
								{/* 상태 */}
								<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground bg-muted border-border neu-elevated">상태</div>
								<div className="flex items-center px-2 py-1 rounded-md bg-muted/50 neu-flat">
									<span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${vehicle.status === 1 ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>{vehicle.status === 1 ? t('주차_상태_입차') : t('주차_상태_출차')}</span>
								</div>

								{/* 차량구분 */}
								<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground bg-muted border-border neu-elevated">차량구분</div>
								<div className="flex items-center px-2 py-1 rounded-md bg-muted/50 neu-flat">
									{parseCarAllowType(vehicle.type)}
									{vehicle.modify_car_type && <span className="ms-1 text-warning">→ {parseCarAllowType(vehicle.modify_car_type)}</span>}
								</div>

								{/* 지역 */}
								{(vehicle.address_1depth || vehicle.address_2depth) && (
									<>
										<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground bg-muted border-border neu-elevated">지역</div>
										<div className="px-2 py-1 rounded-md bg-muted/50 neu-flat">{vehicle.address_1depth} {vehicle.address_2depth}</div>
									</>
								)}

								{/* 이용시간 */}
								<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground bg-muted border-border neu-elevated">{vehicle.status === 1 ? '입차시간' : '출차시간'}</div>
								<div className="px-2 py-1 rounded-md bg-muted/50 neu-flat">{vehicle.use_time}</div>

								{/* 통행입구 */}
								{vehicle.device_name && (
									<>
										<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground bg-muted border-border neu-elevated">통행입구</div>
										<div className="px-2 py-1 rounded-md bg-muted/50 neu-flat">{vehicle.device_name}</div>
									</>
								)}

								{/* 블랙리스트 */}
								{vehicle.is_black === 'Y' && (
									<>
										<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground bg-muted border-border neu-elevated">블랙리스트</div>
										<div className="px-2 py-1 font-semibold rounded-md bg-muted/50 neu-flat text-destructive">해당</div>
									</>
								)}
							</div>
						</div>
					) : (
						<div className="flex justify-center items-center h-full">
							<div className="text-center text-muted-foreground">
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
