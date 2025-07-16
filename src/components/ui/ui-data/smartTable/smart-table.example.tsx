/*
  파일명: src/components/ui/ui-data/smartTable/smart-table.example.tsx
  기능: SmartTable 컴포넌트를 다양한 상황에서 테스트하는 예시
  책임: 가로/세로 스크롤, 긴 텍스트, 많은 컬럼, 빈 데이터 등 극한 상황을 테스트한다.
*/

'use client';

import React, { useMemo, useState } from 'react';
import { SmartTable, SmartTableColumn } from './SmartTable';
import { useTranslations } from '@/hooks/useI18n';

// #region 타입 정의
interface User {
	id: number;
	name: string;
	email: string;
	role: string;
	status: 'active' | 'inactive' | 'pending';
	joinDate: Date;
}

interface WideData {
	id: number;
	col1: string;
	col2: string;
	col3: string;
	col4: string;
	col5: string;
	col6: string;
	col7: string;
	col8: string;
	col9: string;
	col10: string;
	col11: string;
	col12: string;
	longText: string;
	veryLongText: string;
	description: string;
}

type TestCase = 'basic' | 'wide' | 'long-text' | 'many-rows' | 'empty' | 'loading';
// #endregion

export default function SmartTableExample() {
	// #region 훅
	const t = useTranslations();
	// #endregion

	// #region 상태
	const [currentTest, setCurrentTest] = useState<TestCase>('basic');
	const [isLoading, setIsLoading] = useState(false);

	// 기본 사용자 데이터
	const users = useMemo(() => {
		const names = ['Kim', 'Lee', 'Park', 'Choi', 'Jung'];
		return Array.from({ length: 57 }, (_, i) => ({
			id: i + 1,
			name: `${names[i % names.length]} ${i + 1}`,
			email: `user${i + 1}@example.com`,
			role: i % 2 === 0 ? 'Admin' : 'User',
			status: (i % 3 === 0 ? 'pending' : i % 2 === 0 ? 'active' : 'inactive') as User['status'],
			joinDate: new Date(Date.now() - i * 86400000),
		}));
	}, []);

	// 가로 스크롤 테스트용 넓은 데이터
	const wideData = useMemo(() => {
		return Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			col1: `데이터1-${i + 1}`,
			col2: `Data2-${i + 1}`,
			col3: `値3-${i + 1}`,
			col4: `Column4-${i + 1}`,
			col5: `Field5-${i + 1}`,
			col6: `Item6-${i + 1}`,
			col7: `Value7-${i + 1}`,
			col8: `Entry8-${i + 1}`,
			col9: `Record9-${i + 1}`,
			col10: `Content10-${i + 1}`,
			col11: `Element11-${i + 1}`,
			col12: `Section12-${i + 1}`,
			longText: `이것은 매우 긴 텍스트입니다. 이 텍스트는 셀의 너비를 초과할 정도로 길어서 어떻게 처리되는지 확인할 수 있습니다. 행 ${i + 1}의 긴 텍스트입니다.`,
			veryLongText: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Row ${i + 1} with very long text that should test horizontal scrolling capabilities.`,
			description: `상세설명-${i + 1}: 이 항목에 대한 자세한 설명이 여기에 들어갑니다.`,
		}));
	}, []);

	// 많은 행 데이터
	const manyRowsData = useMemo(() => {
		return Array.from({ length: 500 }, (_, i) => ({
			id: i + 1,
			name: `User ${i + 1}`,
			email: `user${i + 1}@test.com`,
			role: i % 3 === 0 ? 'Admin' : i % 2 === 0 ? 'Manager' : 'User',
			status: (i % 4 === 0 ? 'pending' : i % 3 === 0 ? 'inactive' : 'active') as User['status'],
			joinDate: new Date(Date.now() - i * 3600000),
		}));
	}, []);
	// #endregion

	// #region 컬럼 정의
	const basicColumns: SmartTableColumn<User>[] = useMemo(
		() => [
			{ key: 'id', header: 'ID', width: '60px', align: 'center' },
			{ key: 'name', header: t('공통_이름') },
			{ key: 'email', header: 'E-mail', align: 'start' },
			{ key: 'role', header: t('공통_역할'), width: '120px' },
			{
				key: 'status',
				header: t('공통_상태'),
				width: '120px',
				render: (val) => {
					const value = val as User['status'];
					const colorMap: Record<User['status'], string> = {
						active: 'text-green-600',
						inactive: 'text-gray-500',
						pending: 'text-yellow-600',
					};
					return <span className={colorMap[value]}>{value}</span>;
				},
			},
			{
				key: 'joinDate',
				header: t('공통_가입일'),
				width: '140px',
				render: (val) => (val as Date).toLocaleDateString(),
			},
		],
		[t],
	);

	const wideColumns: SmartTableColumn<WideData>[] = useMemo(
		() => [
			{ key: 'id', header: 'ID', width: '50px', align: 'center' },
			{ key: 'col1', header: '컬럼1', width: '100px' },
			{ key: 'col2', header: '컬럼2', width: '100px' },
			{ key: 'col3', header: '컬럼3', width: '100px' },
			{ key: 'col4', header: '컬럼4', width: '100px' },
			{ key: 'col5', header: '컬럼5', width: '100px' },
			{ key: 'col6', header: '컬럼6', width: '100px' },
			{ key: 'col7', header: '컬럼7', width: '100px' },
			{ key: 'col8', header: '컬럼8', width: '100px' },
			{ key: 'col9', header: '컬럼9', width: '100px' },
			{ key: 'col10', header: '컬럼10', width: '100px' },
			{ key: 'col11', header: '컬럼11', width: '100px' },
			{ key: 'col12', header: '컬럼12', width: '100px' },
			{ key: 'description', header: '설명', width: '150px' },
		],
		[],
	);

	const longTextColumns: SmartTableColumn<WideData>[] = useMemo(
		() => [
			{ key: 'id', header: 'ID', width: '50px', align: 'center' },
			{ key: 'col1', header: '짧은컬럼', width: '80px' },
			{
				key: 'longText',
				header: '긴 한국어 텍스트',
				width: '200px',
				cellClassName: 'max-w-[200px] truncate',
			},
			{
				key: 'veryLongText',
				header: '매우 긴 영어 텍스트',
				width: '250px',
				cellClassName: 'max-w-[250px] break-words',
			},
			{
				key: 'description',
				header: '래핑 허용 설명',
				cellClassName: 'max-w-[300px] whitespace-normal break-words',
			},
		],
		[],
	);
	// #endregion

	// #region 핸들러
	const handleTestChange = (testCase: TestCase) => {
		if (testCase === 'loading') {
			setIsLoading(true);
			setTimeout(() => {
				setIsLoading(false);
				setCurrentTest('basic');
			}, 3000);
		} else {
			setCurrentTest(testCase);
		}
	};

	// #endregion

	// #region 렌더링
	return (
		<div className="container p-6 mx-auto space-y-6">
			<div className="space-y-4">
				<h1 className="text-3xl font-bold font-multilang">Smart Table 종합 테스트</h1>
				
				{/* 테스트 케이스 버튼들 */}
				<div className="flex flex-wrap gap-2">
					<button
						onClick={() => handleTestChange('basic')}
						className={`px-4 py-2 rounded-lg transition-all font-multilang ${
							currentTest === 'basic'
								? 'neu-inset text-primary'
								: 'neu-raised hover:scale-[1.02]'
						}`}
					>
						기본 테스트
					</button>
					<button
						onClick={() => handleTestChange('wide')}
						className={`px-4 py-2 rounded-lg transition-all font-multilang ${
							currentTest === 'wide'
								? 'neu-inset text-primary'
								: 'neu-raised hover:scale-[1.02]'
						}`}
					>
						가로 스크롤 (많은 컬럼)
					</button>
					<button
						onClick={() => handleTestChange('long-text')}
						className={`px-4 py-2 rounded-lg transition-all font-multilang ${
							currentTest === 'long-text'
								? 'neu-inset text-primary'
								: 'neu-raised hover:scale-[1.02]'
						}`}
					>
						긴 텍스트 처리
					</button>
					<button
						onClick={() => handleTestChange('many-rows')}
						className={`px-4 py-2 rounded-lg transition-all font-multilang ${
							currentTest === 'many-rows'
								? 'neu-inset text-primary'
								: 'neu-raised hover:scale-[1.02]'
						}`}
					>
						많은 행 (500개)
					</button>
					<button
						onClick={() => handleTestChange('empty')}
						className={`px-4 py-2 rounded-lg transition-all font-multilang ${
							currentTest === 'empty'
								? 'neu-inset text-primary'
								: 'neu-raised hover:scale-[1.02]'
						}`}
					>
						빈 데이터
					</button>
					<button
						onClick={() => handleTestChange('loading')}
						className={`px-4 py-2 rounded-lg transition-all font-multilang ${
							isLoading
								? 'neu-inset text-primary opacity-50 cursor-not-allowed'
								: 'neu-raised hover:scale-[1.02]'
						}`}
						disabled={isLoading}
					>
						{isLoading ? '로딩 중...' : '로딩 상태'}
					</button>
				</div>

				{/* 현재 테스트 정보 */}
				<div className="p-4 rounded-lg neu-flat">
					<h2 className="mb-2 text-lg font-semibold font-multilang">
						현재 테스트: {getTestCaseLabel(currentTest)}
					</h2>
					<p className="text-sm text-muted-foreground font-multilang">
						{getTestCaseDescription(currentTest)}
					</p>
				</div>
			</div>

			{/* 스마트 테이블 */}
			<div className="space-y-2">
				{currentTest === 'basic' && (
					<SmartTable data={users} columns={basicColumns} pageSize={10} loadingRows={8} onRowClick={(item, index) => console.log('Row clicked:', { item, index })} />
				)}
				{currentTest === 'wide' && (
					<SmartTable data={wideData} columns={wideColumns} pageSize={10} loadingRows={8} onRowClick={(item, index) => console.log('Row clicked:', { item, index })} />
				)}
				{currentTest === 'long-text' && (
					<SmartTable data={wideData} columns={longTextColumns} pageSize={10} loadingRows={8} onRowClick={(item, index) => console.log('Row clicked:', { item, index })} />
				)}
				{currentTest === 'many-rows' && (
					<SmartTable data={manyRowsData} columns={basicColumns} pageSize={50} loadingRows={8} onRowClick={(item, index) => console.log('Row clicked:', { item, index })} />
				)}
				{currentTest === 'empty' && (
					<SmartTable data={[]} columns={basicColumns} pageSize={10} loadingRows={8} onRowClick={(item, index) => console.log('Row clicked:', { item, index })} />
				)}
				{currentTest === 'loading' && (
					<SmartTable data={null} columns={basicColumns} pageSize={10} loadingRows={8} onRowClick={(item, index) => console.log('Row clicked:', { item, index })} />
				)}
			</div>
		</div>
	);
	// #endregion
}

// #region 유틸리티 함수
function getTestCaseLabel(testCase: TestCase): string {
	const labels: Record<TestCase, string> = {
		basic: '기본 기능',
		wide: '가로 스크롤',
		'long-text': '긴 텍스트',
		'many-rows': '대용량 데이터',
		empty: '빈 데이터',
		loading: '로딩 상태',
	};
	return labels[testCase];
}

function getTestCaseDescription(testCase: TestCase): string {
	const descriptions: Record<TestCase, string> = {
		basic: '기본적인 정렬, 페이징 기능을 테스트합니다.',
		wide: '많은 컬럼으로 가로 스크롤이 필요한 상황을 테스트합니다.',
		'long-text': '긴 텍스트가 포함된 셀의 처리 방식(truncate, wrap)을 테스트합니다.',
		'many-rows': '500개의 많은 행에서 성능과 스크롤을 테스트합니다.',
		empty: '데이터가 없을 때의 UI 표시를 테스트합니다.',
		loading: '초기 로딩 상태의 skeleton UI를 테스트합니다.',
	};
	return descriptions[testCase];
}
// #endregion 