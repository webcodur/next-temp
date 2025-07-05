import React from 'react';
import { SearchFilters } from '@/types/parking';
import { carAllowTypes } from '@/data/mockParkingData';
import { useTranslations } from '@/hooks/useI18n';

interface VehicleSearchFilterProps {
	filters: SearchFilters;
	onFiltersChange: (filters: SearchFilters) => void;
	onSearch: () => void;
}

const VehicleSearchFilter: React.FC<VehicleSearchFilterProps> = ({
	filters,
	onFiltersChange,
	onSearch,
}) => {
	const t = useTranslations();
	
	const handleFilterChange = (key: keyof SearchFilters, value: string) => {
		onFiltersChange({ ...filters, [key]: value });
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onSearch();
		}
	};

	return (
		<div className="bg-background border border-border rounded-lg p-1.5 mb-1.5">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1.5">
				{/* 차량유형 선택 */}
				<select
					value={filters.car_type || ''}
					onChange={(e) => handleFilterChange('car_type', e.target.value)}
					className="rounded px-2 py-1 bg-muted border border-border focus:outline-hidden focus:border-primary text-xs">
					<option value="">{t('주차_필터_차량유형선택')}</option>
					<option value="0">{t('주차_필터_미인식')}</option>
					{carAllowTypes.map((type) => (
						<option key={type.sub_type} value={type.sub_type.toString()}>
							{type.name}
						</option>
					))}
					<option value="99">{t('주차_필터_오인식')}</option>
					<option value="100">{t('주차_필터_미인식차량')}</option>
					<option value="101">{t('주차_필터_개인이동수단')}</option>
				</select>

				{/* 입출차 선택 */}
				<select
					value={filters.in_out_status || ''}
					onChange={(e) => handleFilterChange('in_out_status', e.target.value)}
					className="rounded px-2 py-1 bg-muted border border-border focus:outline-hidden focus:border-primary text-xs">
					<option value="">{t('주차_필터_입출차선택')}</option>
					<option value="1">{t('주차_필터_입차')}</option>
					<option value="2">{t('주차_필터_출차')}</option>
				</select>

				{/* 통행입구 선택 */}
				<select
					value={filters.entrance_status || ''}
					onChange={(e) =>
						handleFilterChange('entrance_status', e.target.value)
					}
					className="rounded px-2 py-1 bg-muted border border-border focus:outline-hidden focus:border-primary text-xs">
					<option value="">{t('주차_필터_통행입구선택')}</option>
					<option value="입구A">{t('주차_필터_입구A')}</option>
					<option value="입구B">{t('주차_필터_입구B')}</option>
					<option value="출구A">{t('주차_필터_출구A')}</option>
					<option value="출구B">{t('주차_필터_출구B')}</option>
				</select>

				{/* 차량번호 검색 */}
				<input
					type="text"
					placeholder={t('주차_필터_차량번호플레이스홀더')}
					value={filters.keyword || ''}
					onChange={(e) => handleFilterChange('keyword', e.target.value)}
					onKeyPress={handleKeyPress}
					className="rounded px-2 py-1 bg-background border border-border focus:outline-hidden focus:border-primary placeholder-muted-foreground text-xs"
				/>

				{/* 검색 버튼 */}
				<button
					onClick={onSearch}
					className="rounded px-3 py-1 bg-warning text-warning-foreground font-medium hover:bg-warning/80 transition-colors text-xs">
					{t('공통_검색')}
				</button>
			</div>
		</div>
	);
};

export default VehicleSearchFilter;
