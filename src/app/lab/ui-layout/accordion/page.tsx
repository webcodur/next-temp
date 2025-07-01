'use client';

import React from 'react';
import { Accordion, AccordionGroup } from '@/components/ui/accordion';

const AccordionPage = () => {
	return (
		<div className="p-8 min-h-screen">
			<div className="mx-auto max-w-4xl">
				<div className="mb-8">
					<h1 className="mb-4 text-3xl font-bold text-gray-900">Accordion 컴포넌트</h1>
					<p className="text-gray-600">접기/펼치기 기능을 제공하는 아코디언 컴포넌트 테스트</p>
				</div>

				<div className="space-y-8">
					{/* 기본 아코디언 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">기본 아코디언</h2>
						<Accordion title="기본 아코디언" defaultOpen={true}>
							<div className="p-4 bg-gray-100 rounded-lg">
								<p className="text-gray-700">
									이것은 기본 아코디언 콘텐츠입니다. 
									뉴모피즘 디자인이 적용되어 있으며 부드러운 애니메이션으로 
									열리고 닫힙니다.
								</p>
							</div>
						</Accordion>
					</section>

					{/* 상태 텍스트가 있는 아코디언 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">상태 텍스트 아코디언</h2>
						<Accordion 
							title="설정 옵션" 
							statusText="3개 항목" 
							defaultOpen={false}
							onToggle={(isOpen) => console.log('Accordion toggled:', isOpen)}
						>
							<div className="space-y-3">
								<div className="flex gap-3 items-center">
									<input type="checkbox" id="option1" className="rounded" />
									<label htmlFor="option1" className="text-sm text-gray-700">
										옵션 1 활성화
									</label>
								</div>
								<div className="flex gap-3 items-center">
									<input type="checkbox" id="option2" className="rounded" />
									<label htmlFor="option2" className="text-sm text-gray-700">
										옵션 2 활성화
									</label>
								</div>
								<div className="flex gap-3 items-center">
									<input type="checkbox" id="option3" className="rounded" />
									<label htmlFor="option3" className="text-sm text-gray-700">
										옵션 3 활성화
									</label>
								</div>
							</div>
						</Accordion>
					</section>

					{/* 비활성화된 아코디언 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">비활성화된 아코디언</h2>
						<Accordion 
							title="비활성화된 섹션" 
							statusText="접근 불가" 
							disabled={true}
						>
							<div className="p-4 bg-gray-100 rounded-lg">
								<p className="text-gray-700">
									이 콘텐츠는 비활성화되어 있어 접근할 수 없습니다.
								</p>
							</div>
						</Accordion>
					</section>

					{/* 아코디언 그룹 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">아코디언 그룹</h2>
						<AccordionGroup>
							<Accordion title="첫 번째 섹션" defaultOpen={true}>
								<div className="p-4 bg-blue-50 rounded-lg">
									<h3 className="mb-2 font-semibold text-blue-800">첫 번째 섹션</h3>
									<p className="text-blue-700">
										첫 번째 섹션의 콘텐츠입니다. 다양한 정보를 담을 수 있습니다.
									</p>
								</div>
							</Accordion>
							
							<Accordion title="두 번째 섹션" statusText="중요">
								<div className="p-4 bg-green-50 rounded-lg">
									<h3 className="mb-2 font-semibold text-green-800">두 번째 섹션</h3>
									<p className="text-green-700">
										두 번째 섹션의 콘텐츠입니다. 독립적으로 열리고 닫힙니다.
									</p>
								</div>
							</Accordion>
							
							<Accordion title="세 번째 섹션">
								<div className="p-4 bg-purple-50 rounded-lg">
									<h3 className="mb-2 font-semibold text-purple-800">세 번째 섹션</h3>
									<ul className="space-y-1 text-purple-700">
										<li>• 목록 항목 1</li>
										<li>• 목록 항목 2</li>
										<li>• 목록 항목 3</li>
									</ul>
								</div>
							</Accordion>
						</AccordionGroup>
					</section>

					{/* 기능 설명 */}
					<section className="p-6 bg-white rounded-lg shadow-xs">
						<h2 className="mb-4 text-xl font-semibold">주요 기능</h2>
						<ul className="space-y-2 text-gray-600">
							<li>• 뉴모피즘 디자인 적용</li>
							<li>• 부드러운 애니메이션 전환</li>
							<li>• 상태 텍스트 표시 지원</li>
							<li>• 비활성화 상태 지원</li>
							<li>• 토글 이벤트 콜백</li>
							<li>• 커스텀 클래스명 지원</li>
							<li>• 아코디언 그룹 구성</li>
						</ul>
					</section>
				</div>
			</div>
		</div>
	);
};

export default AccordionPage; 