/* 
  파일명: /unit/parking/VehicleDetailCard.tsx
  기능: 차량 상세 정보를 표시하는 카드 컴포넌트
  책임: 선택된 차량의 번호판, 이미지, 세부 정보를 시각적으로 표시한다.
*/

import React, { useState } from 'react';
import Image from 'next/image';
import { Car, Check } from 'lucide-react';
import { SectionPanel } from '@/components/ui/ui-layout/section-panel/SectionPanel';
import { parseCarAllowTypeKey, parseDeviceNameKey } from '@/data/mockParkingData';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';
import type { VehicleEntry } from '@/types/parking';

// #region 타입
interface VehicleDetailCardProps {
	vehicle: VehicleEntry | null;
	/** 타이틀 표시 여부. 기본값은 true */
	showTitle?: boolean;
}
// #endregion

const VehicleDetailCard: React.FC<VehicleDetailCardProps> = ({ vehicle, showTitle = true }) => {
	// #region 상수
	const t = useTranslations();
	// #endregion

	// #region 상태
	const [imageError, setImageError] = useState(false);
	const [copiedPlate, setCopiedPlate] = useState<string | null>(null);
	// #endregion

	// #region 핸들러
	const handlePlateClick = async (plateNumber: string) => {
		try {
			await navigator.clipboard.writeText(plateNumber);
			setCopiedPlate(plateNumber);
			setTimeout(() => setCopiedPlate(null), 2000);
		} catch (error) {
			console.error('번호판 복사 실패:', error);
		}
	};
	// #endregion

	// #region 렌더링
	return (
		<SectionPanel 
			title={showTitle ? t('주차_카드_차량정보') : undefined}
		>
			<div className="flex flex-col gap-4 p-6">
				{/* 차량 이미지 영역 */}
				<div className="shrink-0">
					<div className="relative mx-auto w-full h-72 rounded-xl lg:h-64 bg-muted neu-inset">
						{!imageError ? (
							<Image
								src="/testImg.jpg"
								alt="차량 이미지"
								fill
								className="object-cover"
								onError={() => setImageError(true)}
							/>
						) : (
							<div className="flex justify-center items-center w-full h-full">
								{/* 차량 아이콘을 이미지 섹션 전체에 표시 */}
								<Car
									className="w-48 h-48 text-muted-foreground neu-icon-inactive"
									strokeWidth={1}
								/>
							</div>
						)}
					</div>
				</div>

				{/* 차량 정보 영역 */}
				<div className="flex-1">
					{vehicle ? (
						<div className="mt-4">
							{/* 차량번호 - 별도 섹션 */}
							<div className="mb-6 text-center">
								<div className="flex flex-col gap-3 justify-center items-center">
									<div className="relative cursor-pointer" onClick={() => handlePlateClick(vehicle.car_number)}>
										<span className="px-4 py-2 font-mono text-lg rounded border bg-muted">
											{vehicle.car_number}
										</span>
										{copiedPlate === vehicle.car_number && (
											<div className="absolute -top-8 left-1/2 px-2 py-0.5 text-xs rounded-lg shadow-lg transform -translate-x-1/2 text-success-foreground bg-success neu-raised animate-fadeIn">
												<Check size={12} className="inline me-1" /> {t('주차_카드_복사됨')}
											</div>
										)}
									</div>
									{vehicle.modify_car_number && (
										<div className="flex gap-2 justify-center items-center">
											<span className="text-sm text-warning">{t('주차_카드_변경됨')}</span>
											<div className="relative cursor-pointer" onClick={() => handlePlateClick(vehicle.modify_car_number!)}>
												<span className="font-mono text-base bg-muted px-3 py-1.5 rounded border">
													{vehicle.modify_car_number}
												</span>
												{copiedPlate === vehicle.modify_car_number && (
													<div className="absolute -top-8 left-1/2 px-2 py-0.5 text-xs rounded-lg shadow-lg transform -translate-x-1/2 text-success-foreground bg-success neu-raised animate-fadeIn">
														<Check size={12} className="inline me-1" /> {t('주차_카드_복사됨')}
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
								<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground border-border neu-elevated">{t('주차_카드_상태')}</div>
								<div className="flex justify-center items-center px-2 py-1 rounded-md neu-flat">
									<span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${vehicle.status === 1 ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>{vehicle.status === 1 ? t('주차_상태_입차') : t('주차_상태_출차')}</span>
								</div>

								{/* 차량구분 */}
								<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground border-border neu-elevated">{t('주차_카드_차량구분')}</div>
								<div className="flex justify-center items-center px-2 py-1 rounded-md neu-flat">
									{t(parseCarAllowTypeKey(vehicle.type))}
									{vehicle.modify_car_type && <span className="ms-1 text-warning">→ {t(parseCarAllowTypeKey(vehicle.modify_car_type))}</span>}
								</div>

								{/* 지역 */}
								{(vehicle.address_1depth || vehicle.address_2depth) && (
									<>
										<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground border-border neu-elevated">{t('주차_카드_지역')}</div>
										<div className="flex justify-center items-center px-2 py-1 rounded-md neu-flat">{vehicle.address_1depth} {vehicle.address_2depth}</div>
									</>
								)}

								{/* 이용시간 */}
								<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground border-border neu-elevated">{vehicle.status === 1 ? t('주차_카드_입차시간') : t('주차_카드_출차시간')}</div>
								<div className="flex justify-center items-center px-2 py-1 rounded-md neu-flat">{vehicle.use_time}</div>

								{/* 통행입구 */}
								{vehicle.device_name && (
									<>
										<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground border-border neu-elevated">{t('주차_카드_통행입구')}</div>
										<div className="flex justify-center items-center px-2 py-1 rounded-md neu-flat">{t(parseDeviceNameKey(vehicle.device_name))}</div>
									</>
								)}

								{/* 블랙리스트 */}
								{vehicle.is_black === 'Y' && (
									<>
										<div className="flex justify-center items-center px-2 py-1 font-medium text-center rounded-md border text-foreground border-border neu-elevated">{t('주차_카드_블랙리스트')}</div>
										<div className="flex justify-center items-center px-2 py-1 font-semibold rounded-md neu-flat text-destructive">{t('주차_카드_해당')}</div>
									</>
								)}
							</div>
						</div>
					) : (
						<div className="flex justify-center items-center h-full">
							<div className="text-center text-muted-foreground">
								<div className="mb-2 text-base font-medium">
									{t('주차_카드_차량선택')}
								</div>
								<div className="text-sm">
									{t('주차_카드_상세정보표시')}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</SectionPanel>
	);
	// #endregion
};

export default VehicleDetailCard;
