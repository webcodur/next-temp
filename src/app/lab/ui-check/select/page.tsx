'use client';

import React, { useState } from 'react';
import {
	FieldFilterSelect,
	FieldMultiSelect,
	Option,
} from '@/components/ui/field/Field';

// 테스트 데이터
const countries: Option[] = [
	{ value: 'kr', label: '대한민국' },
	{ value: 'us', label: '미국' },
	{ value: 'jp', label: '일본' },
	{ value: 'cn', label: '중국' },
	{ value: 'uk', label: '영국' },
	{ value: 'fr', label: '프랑스' },
	{ value: 'de', label: '독일' },
	{ value: 'it', label: '이탈리아' },
	{ value: 'es', label: '스페인' },
	{ value: 'ca', label: '캐나다' },
	{ value: 'au', label: '호주' },
	{ value: 'br', label: '브라질' },
	{ value: 'in', label: '인도' },
	{ value: 'sg', label: '싱가포르' },
	{ value: 'th', label: '태국' },
	{ value: 'vn', label: '베트남' },
	{ value: 'ph', label: '필리핀' },
	{ value: 'my', label: '말레이시아' },
	{ value: 'id', label: '인도네시아' },
	{ value: 'tw', label: '대만' },
];

const skills: Option[] = [
	{ value: 'react', label: 'React' },
	{ value: 'vue', label: 'Vue.js' },
	{ value: 'angular', label: 'Angular' },
	{ value: 'svelte', label: 'Svelte' },
	{ value: 'nodejs', label: 'Node.js' },
	{ value: 'python', label: 'Python' },
	{ value: 'java', label: 'Java' },
	{ value: 'csharp', label: 'C#' },
	{ value: 'go', label: 'Go' },
	{ value: 'rust', label: 'Rust' },
	{ value: 'typescript', label: 'TypeScript' },
	{ value: 'javascript', label: 'JavaScript' },
	{ value: 'php', label: 'PHP' },
	{ value: 'ruby', label: 'Ruby' },
	{ value: 'swift', label: 'Swift' },
	{ value: 'kotlin', label: 'Kotlin' },
	{ value: 'dart', label: 'Dart' },
	{ value: 'flutter', label: 'Flutter' },
	{ value: 'reactnative', label: 'React Native' },
	{ value: 'nextjs', label: 'Next.js' },
];

export default function SelectPage() {
	const [singleValue, setSingleValue] = useState<string>('');
	const [multiValue, setMultiValue] = useState<string[]>([]);

	return (
		<div className="min-h-screen p-8 bg-gray-50">
			<div className="max-w-4xl mx-auto">
				{/* 헤더 */}
				<div className="mb-8 text-center">
					<div className="inline-block px-8 py-6 bg-white neu-raised rounded-2xl">
						<h1 className="mb-2 text-3xl font-bold text-gray-900">
							Field Component Test
						</h1>
						<p className="text-gray-600">
							필터 선택과 다중 선택 Field 컴포넌트
						</p>
					</div>
				</div>

				{/* 기본 테스트 그리드 */}
				<div className="grid gap-8 md:grid-cols-2">
					{/* 단일 선택 */}
					<div className="p-8 bg-white neu-flat rounded-2xl">
						<h2 className="mb-6 text-xl font-semibold text-gray-900">
							필터 선택 (검색 가능한 단일 선택)
						</h2>
						<FieldFilterSelect
							label="국가 선택"
							placeholder="국가를 선택하거나 검색하세요"
							options={countries}
							value={singleValue}
							onChange={setSingleValue}
							className="mb-4"
						/>
						<div className="p-4 mt-6 neu-inset bg-gray-50 rounded-xl">
							<h4 className="mb-2 text-sm font-semibold text-gray-800">
								선택된 값
							</h4>
							<div className="text-sm text-gray-600">
								{singleValue
									? countries.find((c) => c.value === singleValue)?.label
									: '없음'}
							</div>
						</div>
					</div>

					{/* 다중 선택 */}
					<div className="p-8 bg-white neu-flat rounded-2xl">
						<h2 className="mb-6 text-xl font-semibold text-gray-900">
							다중 선택 (검색 가능한 멀티 선택)
						</h2>
						<FieldMultiSelect
							label="기술 스택"
							placeholder="기술을 선택하거나 검색하세요"
							options={skills}
							value={multiValue}
							onChange={setMultiValue}
							className="mb-4"
						/>
						<div className="p-4 mt-6 neu-inset bg-gray-50 rounded-xl">
							<h4 className="mb-2 text-sm font-semibold text-gray-800">
								선택된 값 ({multiValue.length}개)
							</h4>
							<div className="text-sm text-gray-600">
								{multiValue.length > 0
									? multiValue
											.map((v) => skills.find((s) => s.value === v)?.label)
											.join(', ')
									: '없음'}
							</div>
						</div>
					</div>
				</div>

				{/* 기능 가이드 */}
				<div className="p-8 mt-8 bg-white neu-flat rounded-2xl">
					<h3 className="mb-6 text-xl font-semibold text-gray-900">
						주요 기능 및 단축키
					</h3>
					<div className="grid gap-6 md:grid-cols-2">
						<div className="p-4 neu-inset bg-gray-50 rounded-xl">
							<h4 className="mb-3 font-semibold text-gray-800">
								키보드 단축키
							</h4>
							<div className="space-y-2 text-sm text-gray-600">
								<div>• ↑/↓ 옵션 간 이동</div>
								<div>• Enter 선택/바로 선택</div>
								<div>• Esc 닫기</div>
								<div>• 타이핑으로 실시간 검색</div>
							</div>
						</div>
						<div className="p-4 neu-inset bg-gray-50 rounded-xl">
							<h4 className="mb-3 font-semibold text-gray-800">주요 기능</h4>
							<div className="space-y-2 text-sm text-gray-600">
								<div>• 필터/다중 선택 지원</div>
								<div>• 실시간 검색 필터링</div>
								<div>• X 버튼으로 값 제거</div>
								<div>• 뉴모피즘 디자인 적용</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
