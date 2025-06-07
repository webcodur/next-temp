'use client';

import React, { useState } from 'react';
import Pagination from '@/components/ui/pagination/Pagination';

const PaginationDemo = () => {
	// #region 상태 관리
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [isDisabled, setIsDisabled] = useState(false);
	
	const totalItems = 237;
	const totalPages = Math.ceil(totalItems / pageSize);
	// #endregion
	
	// #region 이벤트 핸들러
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};
	
	const handlePageSizeChange = (size: number) => {
		setPageSize(size);
		setCurrentPage(1); // 페이지 크기 변경 시 첫 페이지로 이동
	};
	
	const handleToggleDisabled = () => {
		setIsDisabled(!isDisabled);
	};
	// #endregion
	
	return (
		<div className="container mx-auto py-8 px-4">
			<h1 className="text-3xl font-bold mb-6">페이지네이션 컴포넌트</h1>
			
			<div className="mb-8">
				<h2 className="text-xl font-semibold mb-4">기본 예제</h2>
				<div className="p-6 bg-white rounded-lg shadow-md">
					<div className="mb-4">
						<p className="text-gray-700 mb-2">
							현재 페이지: <span className="font-medium">{currentPage}</span>
						</p>
						<p className="text-gray-700 mb-2">
							페이지 크기: <span className="font-medium">{pageSize}</span>
						</p>
						<p className="text-gray-700">
							총 페이지: <span className="font-medium">{totalPages}</span>
						</p>
					</div>
					
					<div className="mb-6">
						<button 
							onClick={handleToggleDisabled}
							className={`px-4 py-2 rounded-md ${
								isDisabled 
									? 'bg-gray-300 text-gray-600' 
									: 'bg-blue-600 text-white hover:bg-blue-700'
							}`}
						>
							{isDisabled ? '페이지네이션 활성화' : '페이지네이션 비활성화'}
						</button>
					</div>
					
					<div className="border border-gray-200 rounded-md p-4">
						{/* 목업 테이블 */}
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{Array.from({ length: Math.min(pageSize, 10) }).map((_, index) => {
									const itemIndex = (currentPage - 1) * pageSize + index;
									if (itemIndex >= totalItems) return null;
									
									return (
										<tr key={itemIndex} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{itemIndex + 1}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">사용자 {itemIndex + 1}</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">user{itemIndex + 1}@example.com</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
													itemIndex % 3 === 0 
														? 'bg-green-100 text-green-800' 
														: itemIndex % 3 === 1 
														? 'bg-yellow-100 text-yellow-800'
														: 'bg-red-100 text-red-800'
												}`}>
													{itemIndex % 3 === 0 ? '활성' : itemIndex % 3 === 1 ? '대기중' : '비활성'}
												</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
						
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
							pageSize={pageSize}
							onPageSizeChange={handlePageSizeChange}
							pageSizeOptions={[5, 10, 20, 50]}
							totalItems={totalItems}
							itemName="사용자"
							disabled={isDisabled}
						/>
					</div>
				</div>
			</div>
			
			<div className="space-y-6">
				<div className="bg-white p-6 rounded-lg shadow-md">
					<h2 className="text-xl font-semibold mb-4">사용 방법</h2>
					<div className="bg-gray-50 p-4 rounded-md overflow-auto">
						<pre className="text-sm">
{`import Pagination from '@/components/ui/pagination/Pagination';

// 기본 사용법
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  pageSize={pageSize}
/>

// 페이지 크기 변경 기능 추가
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  pageSize={pageSize}
  onPageSizeChange={handlePageSizeChange}
  pageSizeOptions={[5, 10, 20, 50]}
/>

// 전체 아이템 정보 표시
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  pageSize={pageSize}
  totalItems={totalItems}
  itemName="사용자"
/>

// 비활성화 상태
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  pageSize={pageSize}
  disabled={true}
/>`}
						</pre>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PaginationDemo; 