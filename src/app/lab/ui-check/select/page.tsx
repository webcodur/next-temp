'use client';

import React, { useState } from 'react';
import { Select, Option } from '@/components/ui/select/Select';

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

const priorities: Option[] = [
	{ value: 'low', label: '낮음' },
	{ value: 'medium', label: '보통' },
	{ value: 'high', label: '높음' },
	{ value: 'urgent', label: '긴급' },
	{ value: 'critical', label: '심각', disabled: true },
];

export default function SelectPage() {
	const [singleValue, setSingleValue] = useState<string>('');
	const [multiValue, setMultiValue] = useState<string[]>([]);
	const [searchableValue, setSearchableValue] = useState<string>('');
	const [priorityValue, setPriorityValue] = useState<string>('');

	return (
		<div className="min-h-screen p-8 bg-gray-50">
			<div className="max-w-4xl mx-auto">
				<div className="mb-12 text-center">
					<div
						className="inline-block px-8 py-6 mb-6 bg-white rounded-3xl"
						style={{
							boxShadow:
								'8px 8px 16px rgba(0,0,0,0.1), -8px -8px 16px rgba(255,255,255,0.9)',
						}}>
						<h1 className="mb-2 text-4xl font-bold text-gray-800">
							Select 컴포넌트 테스트
						</h1>
						<p className="text-lg text-gray-600">
							부드러운 뉴모피즘 스타일의 고급 Select 컴포넌트
						</p>
					</div>
				</div>

				<div className="grid gap-8 md:grid-cols-2">
					{/* 기본 단일 선택 */}
					<div
						className="p-8 bg-white rounded-3xl"
						style={{
							boxShadow:
								'6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.9)',
						}}>
						<h2 className="mb-6 text-xl font-semibold text-gray-800">
							기본 단일 선택
						</h2>
						<Select
							label="국가 선택"
							placeholder="국가를 선택하세요"
							options={countries.slice(0, 10)}
							value={singleValue}
							onChange={setSingleValue}
							className="mb-4"
						/>
						<div
							className="p-3 mt-4 text-sm text-gray-600 bg-gray-50 rounded-xl"
							style={{
								boxShadow:
									'inset 2px 2px 4px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.9)',
							}}>
							선택된 값:{' '}
							<span className="font-semibold text-gray-700">
								{singleValue || '없음'}
							</span>
						</div>
					</div>

					{/* 다중 선택 */}
					<div
						className="p-8 bg-white rounded-3xl"
						style={{
							boxShadow:
								'6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.9)',
						}}>
						<h2 className="mb-6 text-xl font-semibold text-gray-800">
							다중 선택
						</h2>
						<Select
							label="기술 스택"
							placeholder="기술을 선택하세요"
							options={skills.slice(0, 10)}
							multiple
							value={multiValue}
							onChange={setMultiValue}
							className="mb-4"
						/>
						<div
							className="p-3 mt-4 text-sm text-gray-600 bg-gray-50 rounded-xl"
							style={{
								boxShadow:
									'inset 2px 2px 4px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.9)',
							}}>
							선택된 값:{' '}
							<span className="font-semibold text-gray-700">
								{multiValue.join(', ') || '없음'}
							</span>
						</div>
					</div>

					{/* 검색 가능한 선택 */}
					<div
						className="p-8 bg-white rounded-3xl"
						style={{
							boxShadow:
								'6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.9)',
						}}>
						<h2 className="mb-6 text-xl font-semibold text-gray-800">
							검색 가능한 선택
						</h2>
						<Select
							label="국가 검색"
							placeholder="국가를 검색하세요"
							options={countries}
							searchable
							value={searchableValue}
							onChange={setSearchableValue}
							className="mb-4"
						/>
						<div
							className="p-3 mt-4 text-sm text-gray-600 bg-gray-50 rounded-xl"
							style={{
								boxShadow:
									'inset 2px 2px 4px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.9)',
							}}>
							선택된 값:{' '}
							<span className="font-semibold text-gray-700">
								{searchableValue || '없음'}
							</span>
						</div>
					</div>

					{/* 비활성화된 Select */}
					<div
						className="p-8 bg-white rounded-3xl"
						style={{
							boxShadow:
								'6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.9)',
						}}>
						<h2 className="mb-6 text-xl font-semibold text-gray-800">
							비활성화 상태
						</h2>
						<Select
							label="비활성화됨"
							placeholder="선택할 수 없음"
							options={countries.slice(0, 5)}
							disabled
							value=""
							onChange={() => {}}
							className="mb-4"
						/>
						<div
							className="p-3 mt-4 text-sm text-gray-600 bg-gray-50 rounded-xl"
							style={{
								boxShadow:
									'inset 2px 2px 4px rgba(0,0,0,0.08), inset -2px -2px 4px rgba(255,255,255,0.9)',
							}}>
							이 Select는 비활성화되어 있습니다.
						</div>
					</div>
				</div>

				{/* 실제 사용 예시 */}
				<div className="mt-12">
					<div
						className="p-8 bg-white rounded-3xl"
						style={{
							boxShadow:
								'8px 8px 16px rgba(0,0,0,0.08), -8px -8px 16px rgba(255,255,255,0.9)',
						}}>
						<h2 className="mb-6 text-2xl font-semibold text-gray-800">
							실제 사용 예시: 사용자 설정
						</h2>

						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-4">
								<Select
									label="거주 국가"
									placeholder="국가를 선택하세요"
									options={countries}
									searchable
									value={searchableValue}
									onChange={setSearchableValue}
								/>

								<Select
									label="관심 기술 (다중 선택)"
									placeholder="관심 있는 기술을 선택하세요"
									options={skills}
									searchable
									multiple
									value={multiValue}
									onChange={setMultiValue}
								/>

								<Select
									label="우선순위"
									placeholder="우선순위를 선택하세요"
									options={priorities}
									value={priorityValue}
									onChange={setPriorityValue}
								/>
							</div>

							<div
								className="p-6 bg-gray-50 rounded-2xl"
								style={{
									boxShadow:
										'inset 4px 4px 8px rgba(0,0,0,0.06), inset -4px -4px 8px rgba(255,255,255,0.9)',
								}}>
								<h4 className="mb-4 font-semibold text-gray-800">
									설정 미리보기
								</h4>
								<div className="space-y-3 text-sm">
									<div>
										<span className="text-gray-600">국가:</span>{' '}
										<span className="font-medium text-gray-800">
											{countries.find((c) => c.value === searchableValue)
												?.label || '미선택'}
										</span>
									</div>
									<div>
										<span className="text-gray-600">기술:</span>{' '}
										<span className="font-medium text-gray-800">
											{multiValue.length > 0
												? multiValue
														.map(
															(v) => skills.find((s) => s.value === v)?.label
														)
														.join(', ')
												: '미선택'}
										</span>
									</div>
									<div>
										<span className="text-gray-600">우선순위:</span>{' '}
										<span className="font-medium text-gray-800">
											{priorities.find((p) => p.value === priorityValue)
												?.label || '미선택'}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 간단한 가이드 */}
				<div
					className="p-6 mt-8 bg-white rounded-3xl"
					style={{
						boxShadow:
							'6px 6px 12px rgba(0,0,0,0.08), -6px -6px 12px rgba(255,255,255,0.9)',
					}}>
					<h3 className="mb-4 text-lg font-semibold text-gray-800">
						주요 기능 및 단축키
					</h3>
					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<h4 className="mb-2 font-medium text-gray-700">키보드 단축키</h4>
							<div className="space-y-1 text-sm text-gray-600">
								<div>
									<kbd className="px-2 py-1 bg-gray-100 rounded">↑/↓</kbd> 옵션
									간 이동
								</div>
								<div>
									<kbd className="px-2 py-1 bg-gray-100 rounded">Enter</kbd>{' '}
									선택/바로 선택
								</div>
								<div>
									<kbd className="px-2 py-1 bg-gray-100 rounded">Esc</kbd> 닫기
								</div>
							</div>
						</div>
						<div>
							<h4 className="mb-2 font-medium text-gray-700">주요 기능</h4>
							<div className="space-y-1 text-sm text-gray-600">
								<div>• 단일/다중 선택 지원</div>
								<div>• 실시간 검색 필터링</div>
								<div>• X 버튼으로 값 제거</div>
								<div>• 옵션별 비활성화 가능</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
