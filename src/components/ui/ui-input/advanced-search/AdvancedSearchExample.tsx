import React from 'react';
import { AdvancedSearch } from './AdvancedSearch';

// 필드 컴포넌트 예시들
const NameField = () => (
	<div>
		<label className="block text-sm font-medium mb-1">이름</label>
		<input 
			type="text" 
			placeholder="이름을 입력하세요"
			className="w-full px-3 py-2 border rounded-md"
		/>
	</div>
);

const EmailField = () => (
	<div>
		<label className="block text-sm font-medium mb-1">이메일</label>
		<input 
			type="email" 
			placeholder="이메일을 입력하세요"
			className="w-full px-3 py-2 border rounded-md"
		/>
	</div>
);

const DateField = () => (
	<div>
		<label className="block text-sm font-medium mb-1">등록일</label>
		<input 
			type="date"
			className="w-full px-3 py-2 border rounded-md"
		/>
	</div>
);

const StatusField = () => (
	<div>
		<label className="block text-sm font-medium mb-1">상태</label>
		<select className="w-full px-3 py-2 border rounded-md">
			<option value="">전체</option>
			<option value="active">활성</option>
			<option value="inactive">비활성</option>
		</select>
	</div>
);

const RoleField = () => (
	<div>
		<label className="block text-sm font-medium mb-1">역할</label>
		<select className="w-full px-3 py-2 border rounded-md">
			<option value="">전체</option>
			<option value="admin">관리자</option>
			<option value="user">사용자</option>
			<option value="guest">게스트</option>
		</select>
	</div>
);

const PhoneField = () => (
	<div>
		<label className="block text-sm font-medium mb-1">연락처</label>
		<input 
			type="tel" 
			placeholder="연락처를 입력하세요"
			className="w-full px-3 py-2 border rounded-md"
		/>
	</div>
);

export const AdvancedSearchExample: React.FC = () => {
	// 검색 필드 설정
	const searchFields = [
		{
			key: 'name',
			label: '이름',
			element: <NameField />,
			visible: true
		},
		{
			key: 'email',
			label: '이메일',
			element: <EmailField />,
			visible: true
		},
		{
			key: 'date',
			label: '등록일',
			element: <DateField />,
			visible: true
		},
		{
			key: 'status',
			label: '상태',
			element: <StatusField />,
			visible: true
		},
		{
			key: 'role',
			label: '역할',
			element: <RoleField />,
			visible: true
		},
		{
			key: 'phone',
			label: '연락처',
			element: <PhoneField />,
			visible: true
		}
	];

	const handleSearch = () => {
		console.log('검색 실행');
		// 검색 로직 구현
	};

	const handleReset = () => {
		console.log('리셋 실행');
		// 리셋 로직 구현
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">고급 검색 예시</h1>
			
			{/* 사용자 검색 */}
			<AdvancedSearch
				title="사용자 검색"
				fields={searchFields}
				onSearch={handleSearch}
				onReset={handleReset}
				statusText="총 150명의 사용자"
			/>
		</div>
	);
}; 