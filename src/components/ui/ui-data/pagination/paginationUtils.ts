// 페이지 그룹 계산
export const calculatePageGroup = (currentPage: number, groupSize: number) => {
	const currentGroup = Math.ceil(currentPage / groupSize);
	return currentGroup;
};

// 페이지 번호 범위 계산
export const calculatePageRange = (currentPage: number, groupSize: number, totalPages: number) => {
	const currentGroup = calculatePageGroup(currentPage, groupSize);
	const startPage = (currentGroup - 1) * groupSize + 1;
	const endPage = Math.min(startPage + groupSize - 1, totalPages);
	
	return { startPage, endPage, currentGroup };
};

// 페이지 번호 배열 생성
export const generatePageNumbers = (startPage: number, endPage: number): number[] => {
	const pageNumbers: number[] = [];
	for (let i = startPage; i <= endPage; i++) {
		pageNumbers.push(i);
	}
	return pageNumbers;
};

// 표시 범위 계산 (예: "1-10개 표시")
export const calculateDisplayRange = (currentPage: number, pageSize: number, totalItems: number) => {
	const start = (currentPage - 1) * pageSize + 1;
	const end = Math.min(currentPage * pageSize, totalItems);
	return { start, end };
};

// 총 페이지 수 계산
export const calculateTotalPages = (totalItems: number, pageSize: number): number => {
	return Math.ceil(totalItems / pageSize);
};

// 데이터 슬라이싱
export const sliceDataForPage = <T>(data: T[], currentPage: number, pageSize: number): T[] => {
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = startIndex + pageSize;
	return data.slice(startIndex, endIndex);
}; 