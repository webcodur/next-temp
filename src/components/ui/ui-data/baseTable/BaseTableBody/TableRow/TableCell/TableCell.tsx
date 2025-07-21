import React, { useRef, useEffect, useState } from 'react';
import { BaseTableColumn } from '../../../types';
import { 
	Tooltip, 
	TooltipContent, 
	TooltipTrigger 
} from '@/components/ui/ui-effects/tooltip/Tooltip';

interface TableCellProps<T> {
	item: T;
	column: BaseTableColumn<T>;
	index: number;
	colIndex: number;
	totalColumns: number;
	totalRows: number;
	cellClassName?: string;
	isRTL: boolean;
}

export const TableCell = <T extends Record<string, unknown>>({
	item,
	column,
	index,
	colIndex,
	totalColumns,
	totalRows,
	cellClassName = '',
	isRTL,
}: TableCellProps<T>) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	// 원시 값 계산
	const rawValue =
		column.key && item[column.key as keyof T]
			? String(item[column.key as keyof T])
			: null;

	// 오버플로우 검사
	useEffect(() => {
		if (contentRef.current && rawValue) {
			const element = contentRef.current;
			setIsOverflowing(element.scrollWidth > element.clientWidth);
		}
	}, [rawValue]);

	// RTL 지원을 위한 정렬 클래스
	const getAlignmentClass = (align?: 'start' | 'center' | 'end') => {
		if (!align || align === 'start') {
			return isRTL ? 'text-end' : 'text-start';
		}
		if (align === 'end') {
			return isRTL ? 'text-start' : 'text-end';
		}
		return 'text-center';
	};

	// 셀 내용 렌더링
	const renderCellContent = () => {
		const content = (() => {
			if (column.cell) return column.cell(item, index);
			if (column.render && column.key && column.key in item)
				return column.render(item[column.key as keyof T], item, index);
			if (rawValue !== null) return rawValue;
			return '';
		})();

		// 텍스트가 있고 오버플로우가 발생한 경우 tooltip으로 감싸기
		if (rawValue && isOverflowing) {
			return (
				<Tooltip>
					<TooltipTrigger asChild>
						<div 
							ref={contentRef}
							className="truncate cursor-help"
						>
							{content}
						</div>
					</TooltipTrigger>
					<TooltipContent variant="default" className="max-w-md">
						<div className="whitespace-pre-wrap break-words">
							{rawValue}
						</div>
					</TooltipContent>
				</Tooltip>
			);
		}

		return (
			<div 
				ref={contentRef}
				className="truncate"
			>
				{content}
			</div>
		);
	};

	return (
		<td
			className={`
				px-6 py-4 text-sm text-foreground
				${getAlignmentClass(column.align)}
				${colIndex < totalColumns - 1 ? 'border-r border-primary-4/30' : ''}
				${column.cellClassName || cellClassName}
				${index === totalRows - 1 && colIndex === 0 ? 'rounded-bl-lg' : ''}
				${index === totalRows - 1 && colIndex === totalColumns - 1 ? 'rounded-br-lg' : ''}
			`}
		>
			{renderCellContent()}
		</td>
	);
}; 