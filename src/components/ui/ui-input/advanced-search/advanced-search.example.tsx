import React, { useState } from 'react';
import { AdvancedSearch } from './AdvancedSearch';
import FieldText from '../field/text/FieldText';
import FieldEmail from '../field/text/FieldEmail';
import FieldSelect from '../field/select/FieldSelect';
import { FieldSortSelect } from '../field/select/FieldSortSelect';
import FieldDatePicker from '../field/datepicker/FieldDatePicker';
import FieldTimePicker from '../field/time/FieldTimePicker';
import { SortDirection } from '../field/core/types';

export default function AdvancedSearchExample() {
	// 기본 HTML 요소용 state들 (추가)
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [date, setDate] = useState('');
	const [status, setStatus] = useState('');
	const [role, setRole] = useState('');
	const [phone, setPhone] = useState('');

	// Field 컴포넌트용 state들
	const [username, setUsername] = useState('');
	const [userEmail, setUserEmail] = useState('');
	const [department, setDepartment] = useState('');
	const [sortBy, setSortBy] = useState('');
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
	const [joinDate, setJoinDate] = useState<Date | null>(null);
	const [workTime, setWorkTime] = useState('');

// 필드 컴포넌트 예시들 (상태 연결)
const NameField = () => (
	<div>
		<label className="block mb-1 text-sm font-medium">이름</label>
		<input 
			type="text" 
			placeholder="이름을 입력하세요"
			className="px-3 py-2 w-full rounded-md border"
			value={name}
			onChange={(e) => setName(e.target.value)}
		/>
	</div>
);

const EmailField = () => (
	<div>
		<label className="block mb-1 text-sm font-medium">이메일</label>
		<input 
			type="email" 
			placeholder="이메일을 입력하세요"
			className="px-3 py-2 w-full rounded-md border"
			value={email}
			onChange={(e) => setEmail(e.target.value)}
		/>
	</div>
);

const DateField = () => (
	<div>
		<label className="block mb-1 text-sm font-medium">등록일</label>
		<input 
			type="date"
			className="px-3 py-2 w-full rounded-md border"
			value={date}
			onChange={(e) => setDate(e.target.value)}
		/>
	</div>
);

const StatusField = () => (
	<div>
		<label className="block mb-1 text-sm font-medium">상태</label>
		<select 
			className="px-3 py-2 w-full rounded-md border"
			value={status}
			onChange={(e) => setStatus(e.target.value)}
		>
			<option value="">전체</option>
			<option value="active">활성</option>
			<option value="inactive">비활성</option>
		</select>
	</div>
);

const RoleField = () => (
	<div>
		<label className="block mb-1 text-sm font-medium">역할</label>
		<select 
			className="px-3 py-2 w-full rounded-md border"
			value={role}
			onChange={(e) => setRole(e.target.value)}
		>
			<option value="">전체</option>
			<option value="admin">관리자</option>
			<option value="user">사용자</option>
			<option value="guest">게스트</option>
		</select>
	</div>
);

const PhoneField = () => (
	<div>
		<label className="block mb-1 text-sm font-medium">연락처</label>
		<input 
			type="tel" 
			placeholder="연락처를 입력하세요"
			className="px-3 py-2 w-full rounded-md border"
			value={phone}
			onChange={(e) => setPhone(e.target.value)}
		/>
	</div>
);

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

	// Field 컴포넌트를 활용한 두 번째 검색 필드 설정
	const searchFields2 = [
		{
			key: 'username',
			label: '사용자명',
			element: (
				<FieldText
					id="username"
					placeholder="사용자명을 입력하세요"
					value={username}
					onChange={setUsername}
					showSearchIcon={true}
				/>
			),
			visible: true
		},
		{
			key: 'userEmail',
			label: '사용자 이메일',
			element: (
				<FieldEmail
					id="userEmail"
					placeholder="이메일을 입력하세요"
					value={userEmail}
					onChange={setUserEmail}
					showValidation={true}
				/>
			),
			visible: true
		},
		{
			key: 'department',
			label: '부서',
			element: (
				<FieldSelect
					id="department"
					placeholder="부서를 선택하세요"
					options={[
						{ value: 'development', label: '개발팀' },
						{ value: 'design', label: '디자인팀' },
						{ value: 'marketing', label: '마케팅팀' },
						{ value: 'hr', label: '인사팀' },
						{ value: 'finance', label: '재무팀' }
					]}
					value={department}
					onChange={setDepartment}
				/>
			),
			visible: true
		},
		{
			key: 'sortBy',
			label: '정렬 기준',
			element: (
				<FieldSortSelect
					label=""
					placeholder="정렬 기준을 선택하세요"
					options={[
						{ value: 'name', label: '이름순' },
						{ value: 'date', label: '날짜순' },
						{ value: 'department', label: '부서순' },
						{ value: 'position', label: '직급순' }
					]}
					value={sortBy}
					onChange={setSortBy}
					sortDirection={sortDirection}
					onSortDirectionChange={setSortDirection}
				/>
			),
			visible: true
		},
		{
			key: 'joinDate',
			label: '입사일',
			element: (
				<FieldDatePicker
					id="joinDate"
					datePickerType="single"
					placeholder="입사일을 선택하세요"
					value={joinDate}
					onChange={setJoinDate}
				/>
			),
			visible: true
		},
		{
			key: 'workTime',
			label: '근무 시간',
			element: (
				<FieldTimePicker
					id="workTime"
					placeholder="근무 시간을 선택하세요"
					value={workTime}
					onChange={setWorkTime}
					timeInterval={30}
				/>
			),
			visible: true
		}
	];

	const handleSearch = () => {
		console.log('검색 실행', { name, email, date, status, role, phone });
		// 검색 로직 구현
	};

	const handleReset = () => {
		console.log('리셋 실행');
		// 리셋 로직 구현
		setName('');
		setEmail('');
		setDate('');
		setStatus('');
		setRole('');
		setPhone('');
	};

	const handleSearch2 = () => {
		console.log('두 번째 검색 실행', { username, userEmail, department, sortBy, sortDirection, joinDate, workTime });
		// 두 번째 검색 로직 구현
	};

	const handleReset2 = () => {
		console.log('두 번째 리셋 실행');
		// 두 번째 리셋 로직 구현
		setUsername('');
		setUserEmail('');
		setDepartment('');
		setSortBy('');
		setSortDirection('asc');
		setJoinDate(null);
		setWorkTime('');
	};

	return (
		<div className="p-6 mx-auto max-w-4xl">
			<h1 className="mb-6 text-2xl font-bold">고급 검색 예시</h1>
			
			{/* 클라이언트 사이드 필터링 예시 */}
			<div className="mb-8">
				<AdvancedSearch
					fields={searchFields}
					onSearch={handleSearch}
					onReset={handleReset}
					statusText="총 150명의 사용자"
					searchMode="client"
				/>
			</div>

			{/* 서버 사이드 검색 예시 */}
			<div className="mb-8">
				<AdvancedSearch
					fields={searchFields2}
					onSearch={handleSearch2}
					onReset={handleReset2}
					statusText="총 85명의 직원"
					searchMode="server"
				/>
			</div>
		</div>
	);
} 