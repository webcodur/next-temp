import React from 'react';

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	pageSize: number;
	onPageSizeChange?: (size: number) => void;
	pageSizeOptions?: number[];
	groupSize?: number;
	totalItems?: number;
	itemName?: string;
	disabled?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	onPageChange,
	pageSize,
	onPageSizeChange,
	pageSizeOptions = [5, 10, 20, 50],
	groupSize = 5,
	totalItems,
	itemName = "항목",
	disabled = false,
}) => {
	// #region 페이지 계산 로직
	const currentGroup = Math.ceil(currentPage / groupSize);
	const startPage = (currentGroup - 1) * groupSize + 1;
	const endPage = Math.min(startPage + groupSize - 1, totalPages);

	const pageNumbers: number[] = [];
	for (let i = startPage; i <= endPage; i++) {
		pageNumbers.push(i);
	}
	// #endregion

	// #region 이벤트 핸들러
	const goToFirstPage = () => {
		if (currentPage !== 1 && !disabled) onPageChange(1);
	};

	const goToPreviousGroup = () => {
		if (startPage > 1 && !disabled) {
			const previousGroupLastPage = startPage - 1;
			onPageChange(previousGroupLastPage);
		}
	};

	const goToNextGroup = () => {
		if (endPage < totalPages && !disabled) {
			const nextGroupFirstPage = endPage + 1;
			onPageChange(nextGroupFirstPage);
		}
	};

	const goToLastPage = () => {
		if (currentPage !== totalPages && !disabled) onPageChange(totalPages);
	};

	const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSize = Number(e.target.value);
		if (onPageSizeChange && !disabled) onPageSizeChange(newSize);
	};
	// #endregion

	if (totalPages <= 1 && !onPageSizeChange) return null;

	return (
		<div className="mt-6 text-[#333333]">
			<div className="flex items-center justify-between">
				{typeof totalItems === 'number' && totalItems > 0 && (
					<div className="text-[#666666] text-sm mb-2">
						총 {totalItems}개의 {itemName} 중 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalItems)}개 표시
					</div>
				)}

				<nav className="flex items-center gap-1">
					{/* 첫 페이지 버튼 */}
					<button
						onClick={goToFirstPage}
						disabled={currentPage === 1 || disabled}
						className={`p-2 rounded-md cursor-pointer ${
							currentPage === 1 || disabled
								? 'text-[#cccccc] cursor-not-allowed'
								: 'text-[#333333] hover:bg-[#f0f0f0]'
						}`}
						aria-label="첫 페이지로 이동">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
							<path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
						</svg>
					</button>

					{/* 이전 그룹 버튼 */}
					<button
						onClick={goToPreviousGroup}
						disabled={startPage === 1 || disabled}
						className={`p-2 rounded-md cursor-pointer ${
							startPage === 1 || disabled
								? 'text-[#cccccc] cursor-not-allowed'
								: 'text-[#333333] hover:bg-[#f0f0f0]'
						}`}
						aria-label="이전 그룹으로 이동">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
						</svg>
					</button>

					{/* 페이지 번호 버튼 그룹 */}
					<div className="flex items-center gap-1 mx-1">
						{pageNumbers.map((pageNumber) => (
							<button
								key={pageNumber}
								onClick={() => !disabled && onPageChange(pageNumber)}
								disabled={disabled}
								className={`min-w-[36px] h-9 px-3 rounded-md cursor-pointer ${
									pageNumber === currentPage
										? 'bg-[#2563eb] text-white'
										: disabled
										? 'text-[#cccccc] cursor-not-allowed'
										: 'text-[#333333] hover:bg-[#f0f0f0]'
								}`}
								aria-current={pageNumber === currentPage ? 'page' : undefined}>
								{pageNumber}
							</button>
						))}
					</div>

					{/* 다음 그룹 버튼 */}
					<button
						onClick={goToNextGroup}
						disabled={endPage === totalPages || disabled}
						className={`p-2 rounded-md cursor-pointer ${
							endPage === totalPages || disabled
								? 'text-[#cccccc] cursor-not-allowed'
								: 'text-[#333333] hover:bg-[#f0f0f0]'
						}`}
						aria-label="다음 그룹으로 이동">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
						</svg>
					</button>

					{/* 마지막 페이지 버튼 */}
					<button
						onClick={goToLastPage}
						disabled={currentPage === totalPages || disabled}
						className={`p-2 rounded-md cursor-pointer ${
							currentPage === totalPages || disabled
								? 'text-[#cccccc] cursor-not-allowed'
								: 'text-[#333333] hover:bg-[#f0f0f0]'
						}`}
						aria-label="마지막 페이지로 이동">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
							<path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708z"/>
							<path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708z"/>
						</svg>
					</button>
				</nav>

				<div className="flex items-center w-[170px] justify-end">
					{onPageSizeChange && (
						<div className="flex items-center text-sm">
							<span className="mr-2">페이지당 항목:</span>
							<select
								value={pageSize}
								onChange={handlePageSizeChange}
								disabled={disabled}
								className={`bg-white cursor-pointer border border-[#dddddd] text-[#333333] rounded-md py-1 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] m-0 p-0 ${
									disabled ? 'opacity-50 cursor-not-allowed' : ''
								}`}>
								{pageSizeOptions.map((size) => (
									<option key={size} value={size} className="cursor-pointer">
										{size}
									</option>
								))}
							</select>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Pagination; 