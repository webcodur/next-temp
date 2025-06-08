import React from 'react';
import { SearchFilters } from '@/types/parking';
import { carAllowTypes } from '@/data/mockParkingData';

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
	const handleFilterChange = (key: keyof SearchFilters, value: string) => {
		onFiltersChange({ ...filters, [key]: value });
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			onSearch();
		}
	};

	return (
		<div className="neu-flat rounded-xl p-2 bg-white mb-2">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
				{/* 차량유형 선택 */}
				<select
					value={filters.car_type || ''}
					onChange={(e) => handleFilterChange('car_type', e.target.value)}
					className="neu-inset rounded-lg px-2 py-1.5 bg-white border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs">
					<option value="">차량유형선택</option>
					<option value="0">미인식</option>
					{carAllowTypes.map((type) => (
						<option key={type.sub_type} value={type.sub_type.toString()}>
							{type.name}
						</option>
					))}
					<option value="99">오인식</option>
					<option value="100">미인식 차량</option>
					<option value="101">개인 이동수단</option>
				</select>

				{/* 입출차 선택 */}
				<select
					value={filters.in_out_status || ''}
					onChange={(e) => handleFilterChange('in_out_status', e.target.value)}
					className="neu-inset rounded-lg px-2 py-1.5 bg-white border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs">
					<option value="">입/출차 선택</option>
					<option value="1">입차</option>
					<option value="2">출차</option>
				</select>

				{/* 통행입구 선택 */}
				<select
					value={filters.entrance_status || ''}
					onChange={(e) =>
						handleFilterChange('entrance_status', e.target.value)
					}
					className="neu-inset rounded-lg px-2 py-1.5 bg-white border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs">
					<option value="">통행입구 선택</option>
					<option value="입구A">입구A</option>
					<option value="입구B">입구B</option>
					<option value="출구A">출구A</option>
					<option value="출구B">출구B</option>
				</select>

				{/* 차량번호 검색 */}
				<input
					type="text"
					placeholder="차량번호를 입력해주세요."
					value={filters.keyword || ''}
					onChange={(e) => handleFilterChange('keyword', e.target.value)}
					onKeyPress={handleKeyPress}
					className="neu-inset rounded-lg px-2 py-1.5 bg-white border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-500 text-xs"
				/>

				{/* 검색 버튼 */}
				<button
					onClick={onSearch}
					className="neu-raised rounded-lg px-3 py-1.5 bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors text-xs">
					검색
				</button>
			</div>
		</div>
	);
};

export default VehicleSearchFilter;
