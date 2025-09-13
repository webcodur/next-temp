import React from 'react';
import { SearchFilters } from '@/types/parking';
import { carAllowTypes } from '@/data/mockParkingData';
import { useTranslations } from '@/hooks/ui-hooks/useI18n';
import { SimpleTextInput } from '@/components/ui/ui-input/simple-input/SimpleTextInput';
import { SimpleDropdown } from '@/components/ui/ui-input/simple-input/SimpleDropdown';
import { Button } from '@/components/ui/ui-input/button/Button';
import { Search, RefreshCw } from 'lucide-react';

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

	// 차량유형 옵션 생성 (중복 값 제거)
	const carTypeOptionsRaw = [
		{ value: '0', label: t('주차_필터_미인식') },
		...carAllowTypes.map((type) => ({
			value: type.sub_type.toString(),
			label: type.name,
		})),
		{ value: '99', label: t('주차_필터_오인식') },
		{ value: '100', label: t('주차_필터_미인식차량') },
		{ value: '101', label: t('주차_필터_개인이동수단') },
	];

	// value 기준으로 중복 옵션 제거
	const carTypeOptions = carTypeOptionsRaw.filter(
		(option, index, self) => self.findIndex((o) => o.value === option.value) === index
	);

	// 입출차 옵션
	const inOutOptions = [
		{ value: '1', label: t('주차_필터_입차') },
		{ value: '2', label: t('주차_필터_출차') },
	];

	// 통행입구 옵션
	const entranceOptions = [
		{ value: '입구A', label: t('주차_필터_입구A') },
		{ value: '입구B', label: t('주차_필터_입구B') },
		{ value: '출구A', label: t('주차_필터_출구A') },
		{ value: '출구B', label: t('주차_필터_출구B') },
	];

	// 필터 초기화 함수
	const handleResetFilters = () => {
		onFiltersChange({
			car_type: '',
			in_out_status: '',
			entrance_status: '',
			keyword: '',
		});
	};

	return (
		<div className="p-3 mb-3 rounded-lg">
				<div className="flex flex-col gap-3 md:flex-row">
					{/* 2x2 그리드 영역 */}
					<div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
						{/* 차량유형 선택 */}
						<SimpleDropdown
							options={carTypeOptions}
							value={filters.car_type || ''}
							onChange={(value) => handleFilterChange('car_type', value)}
							placeholder={t('주차_필터_차량유형선택')}
							validationRule={{ type: 'free', mode: 'edit' }}
						/>

						{/* 입출차 선택 */}
						<SimpleDropdown
							options={inOutOptions}
							value={filters.in_out_status || ''}
							onChange={(value) => handleFilterChange('in_out_status', value)}
							placeholder={t('주차_필터_입출차선택')}
							validationRule={{ type: 'free', mode: 'edit' }}
						/>

						{/* 통행입구 선택 */}
						<SimpleDropdown
							options={entranceOptions}
							value={filters.entrance_status || ''}
							onChange={(value) => handleFilterChange('entrance_status', value)}
							placeholder={t('주차_필터_통행입구선택')}
							validationRule={{ type: 'free', mode: 'edit' }}
						/>

						{/* 차량번호 검색 */}
						<SimpleTextInput
							value={filters.keyword || ''}
							onChange={(value) => handleFilterChange('keyword', value)}
							placeholder={t('주차_필터_차량번호플레이스홀더')}
							validationRule={{ type: 'free', mode: 'edit' }}
						/>
					</div>

					{/* 검색/초기화 버튼 영역 */}
					<div className="flex flex-col gap-2 justify-center items-stretch shrink-0">
						<Button
							onClick={handleResetFilters}
							variant="outline"
							size="icon"
							className="w-10 h-full text-muted-foreground hover:text-primary neu-raised"
							type="button"
						>
							<RefreshCw className="w-4 h-4" />
						</Button>
						<Button
							onClick={onSearch}
							variant="outline"
							size="icon"
              className="w-10 h-full text-muted-foreground hover:text-primary neu-raised"
						>
							<Search className="w-4 h-4 neu-icon-active" />
						</Button>
					</div>
				</div>
		</div>
	);
};

export default VehicleSearchFilter;
