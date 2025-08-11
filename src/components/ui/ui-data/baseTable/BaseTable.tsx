/* 
  파일명: /components/ui/ui-data/baseTable/BaseTable.tsx
  기능: 순수 테이블 컴포넌트 (A)
  책임: 데이터 렌더링, tooltip 기능만 담당
*/ // ------------------------------

'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useLocale } from '@/hooks/ui-hooks/useI18n';
import { cn } from '@/lib/utils';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import timezone from '@/utils/timezone';

import { BaseTableProps } from './types';
import { 
	Tooltip, 
	TooltipContent, 
	TooltipTrigger,
	TooltipProvider 
} from '@/components/ui/ui-effects/tooltip/Tooltip';

const BaseTable = <T extends Record<string, unknown>>({
	data,
	columns,
	className = '',
	headerClassName = '',
	rowClassName = '',
	cellClassName = '',
	pageSize = 10,
	loadingRows = 5,
	onRowClick,
	minWidth,
}: BaseTableProps<T>) => {
	// #region 훅 및 상태
	const { isRTL } = useLocale();
	const [modalData, setModalData] = useState<{
		isOpen: boolean;
		content: string;
		title: string;
	}>({
		isOpen: false,
		content: '',
		title: ''
	});

	// 계산된 값
	const isInitialLoading = data === null;
	const displayData = data ?? [];
	// #endregion

	// #region 헤더 렌더링
	const renderHeader = () => (
		<thead className={`border-b bg-serial-4 border-primary-4/30 ${headerClassName}`}>
			<tr>
				{columns.map((column, colIndex) => {
					const columnKey = column.key ? String(column.key) : `col-${colIndex}`;

					return (
						<th
							key={columnKey}
							className={`
								relative px-2 py-3 text-xs font-medium text-primary-8 uppercase tracking-wider
								text-center
								${colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : ''}
								${column.headerClassName || ''}
								${colIndex === 0 ? 'rounded-tl-lg' : ''}
								${colIndex === columns.length - 1 ? 'rounded-tr-lg' : ''}
							`}
							style={{ width: column.width }}
						>
							{/* 헤더 타이틀 */}
							<span className="block text-base truncate font-multilang">
								{column.header}
							</span>
						</th>
					);
				})}
			</tr>
		</thead>
	);
	// #endregion

	// #region 셀 컴포넌트
	const TableCell = ({ 
		item, 
		column, 
		index, 
		colIndex 
	}: {
		item: T;
		column: typeof columns[0];
		index: number;
		colIndex: number;
	}) => {
		const contentRef = useRef<HTMLDivElement>(null);
		const [isOverflowing, setIsOverflowing] = useState(false);

		// 원시 값 계산
		const rawValue =
			column.key && item[column.key as keyof T]
				? String(item[column.key as keyof T])
				: null;

		// 렌더링된 내용 계산
		const renderedContent = (() => {
			// 타입별 자동 처리 (UTC → Local 변환 포함)
			if (column.type === 'date' && rawValue) {
				try {
					return timezone.formatDate(rawValue);
				} catch (error) {
					console.warn('날짜 변환 실패:', error);
					return '-';
				}
			}
			
			if (column.type === 'datetime' && rawValue) {
				try {
					return timezone.formatShortDateTimeDot(rawValue);
				} catch (error) {
					console.warn('날짜시간 변환 실패:', error);
					return '-';
				}
			}
			
			// 기존 로직 유지
			if (column.cell) return column.cell(item, index);
			if (column.render && column.key && column.key in item)
				return column.render(item[column.key as keyof T], item, index);
			if (rawValue !== null) return rawValue;
			return '';
		})();

		// 표시할 텍스트 값 (모달에서 사용)
		const displayText = typeof renderedContent === 'string' ? renderedContent : rawValue || '';

		// 오버플로우 검사
		useEffect(() => {
			if (contentRef.current) {
				const element = contentRef.current;
				setIsOverflowing(element.scrollWidth > element.clientWidth);
			}
		}, [renderedContent, rawValue]);

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

		// 셀 클릭 핸들러
		const handleCellClick = (e: React.MouseEvent) => {
			e.stopPropagation(); // 행 클릭 이벤트 전파 방지
			
			if (displayText && isOverflowing) {
				setModalData({
					isOpen: true,
					content: displayText,
					title: column.header || '셀 내용'
				});
			}
		};

		// 셀 내용 렌더링
		const renderCellContent = () => {
			// 오버플로우가 발생한 경우 특별한 스타일링과 클릭 기능 적용
			if (isOverflowing) {
				return (
					<Tooltip>
						<TooltipTrigger asChild>
							<div 
								ref={contentRef}
								onClick={handleCellClick}
								className="
									truncate cursor-pointer whitespace-pre-line
									hover:bg-primary-3/20 hover:scale-[1.02]
									rounded px-1 py-0.5 transition-all duration-200
									border border-transparent hover:border-primary-4/40
								"
							>
								{renderedContent}
							</div>
						</TooltipTrigger>
						<TooltipContent variant="default" className="max-w-md">
							<div className="whitespace-pre-wrap break-words">
								{displayText}
								<div className="mt-1 text-xs text-muted-foreground">
									클릭하면 전체 내용을 볼 수 있습니다
								</div>
							</div>
						</TooltipContent>
					</Tooltip>
				);
			}

			return (
				<div 
					ref={contentRef}
					className="truncate whitespace-pre-line"
				>
					{renderedContent}
				</div>
			);
		};

		return (
			<td
				className={`
					px-6 py-4 text-sm text-foreground
					${getAlignmentClass(column.align)}
					${colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : ''}
					${column.cellClassName || cellClassName}
					${index === displayData.length - 1 && colIndex === 0 ? 'rounded-bl-lg' : ''}
					${index === displayData.length - 1 && colIndex === columns.length - 1 ? 'rounded-br-lg' : ''}
				`}
			>
				{renderCellContent()}
			</td>
		);
	};
	// #endregion

	// #region 바디 렌더링
	const renderBody = () => (
		<tbody className="divide-y bg-background divide-border">
			{isInitialLoading ? (
				// 로딩 상태
				Array.from({ length: Math.min(loadingRows, pageSize) }, (_, index) => (
					<tr key={`loading-${index}`} className="animate-pulse">
						{columns.map((column, colIndex) => (
							<td
								key={`loading-${index}-${String(column.key)}`}
								className={`
									px-6 py-4 
									${colIndex < columns.length - 1 ? 'border-r border-primary-4/30' : ''}
									${cellClassName}
								`}
							>
								<div className="h-5 rounded bg-muted neu-flat"></div>
							</td>
						))}
					</tr>
				))
			) : displayData.length === 0 ? (
				// 빈 데이터 상태
				<tr>
					<td
						colSpan={columns.length}
						className={`px-6 py-12 text-center text-muted-foreground ${cellClassName}`}
					>
						표시할 데이터가 없습니다.
					</td>
				</tr>
			) : (
				// 데이터 렌더링
				displayData.map((item, index) => {
					// 행 클래스 이름 계산
					const getRowClassName = () => {
						if (typeof rowClassName === 'function') {
							return rowClassName(item, index);
						}
						return rowClassName;
					};

					const hoverClass = 'hover:bg-primary-2/[0.6]';

					return (
						<tr
							key={index}
							onClick={() => onRowClick?.(item, index)}
							className={`
								${index % 2 === 0 ? 'bg-serial-0' : 'bg-serial-1'}
								${hoverClass}
								${onRowClick ? 'cursor-pointer' : ''}
								${getRowClassName()}
							`}
						>
							{columns.map((column, colIndex) => (
								<TableCell
									key={`${index}-${column.key ? String(column.key) : colIndex}`}
									item={item}
									column={column}
									index={index}
									colIndex={colIndex}
								/>
							))}
						</tr>
					);
				})
			)}
		</tbody>
	);
	// #endregion

	// #region 렌더링
	return (
		<TooltipProvider>
			<div
				className={cn(
					'overflow-auto rounded-lg neu-flat-primary scrollbar-gutter-stable',
					className,
				)}
			>
				<table
					className="w-full rounded-lg bg-background"
					style={{ 
						tableLayout: 'fixed', 
						borderSpacing: 0, 
						borderCollapse: 'separate',
						minWidth: minWidth 
					}}
				>
					{renderHeader()}
					{renderBody()}
				</table>
			</div>

			{/* 셀 내용 전체보기 모달 */}
			<Modal
				isOpen={modalData.isOpen}
				onClose={() => setModalData({ ...modalData, isOpen: false })}
				title={modalData.title}
				size="lg"
			>
				<div className="overflow-auto max-h-96">
					<div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
						{modalData.content}
					</div>
				</div>
			</Modal>
		</TooltipProvider>
	);
	// #endregion
};

export { BaseTable };
export type { BaseTableColumn, BaseTableProps } from './types'; 