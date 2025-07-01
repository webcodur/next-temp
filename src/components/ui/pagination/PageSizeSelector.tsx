import React from 'react';

interface PageSizeSelectorProps {
	pageSize: number;
	pageSizeOptions: number[];
	onPageSizeChange: (size: number) => void;
	onPageChange: (page: number) => void;
	disabled: boolean;
	showSelector: boolean;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
	pageSize,
	pageSizeOptions,
	onPageSizeChange,
	onPageChange,
	disabled,
	showSelector,
}) => {
	const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSize = Number(e.target.value);
		if (!disabled) {
			onPageSizeChange(newSize);
			// 페이지 크기 변경 시 첫 페이지로 이동
			onPageChange(1);
		}
	};

	if (!showSelector) {
		return <div className="w-[170px]" />;
	}

	return (
		<div className="flex items-center w-[170px] justify-end">
			<div className="flex items-center text-sm">
				<span className="mr-2">페이지당 항목:</span>
				<select
					value={pageSize}
					onChange={handlePageSizeChange}
					disabled={disabled}
					className={`bg-background cursor-pointer border border-border text-foreground rounded-md py-1 focus:border-primary focus:ring-1 focus:ring-primary m-0 p-0 ${
						disabled ? 'opacity-50 cursor-not-allowed' : ''
					}`}>
					{pageSizeOptions.map((size) => (
						<option key={size} value={size} className="cursor-pointer">
							{size}
						</option>
					))}
				</select>
			</div>
		</div>
	);
};
