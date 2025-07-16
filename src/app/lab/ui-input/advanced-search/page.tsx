'use client';

import { AdvancedSearchExample } from '@/components/ui/ui-input/advanced-search/AdvancedSearchExample';

export default function AdvancedSearchPage() {
	return (
		<div className="container p-6 mx-auto">
			<h1 className="mb-6 text-2xl font-bold">Advanced Search 컴포넌트 테스트</h1>
			<p className="mb-8 text-gray-600">
				접고 펼칠 수 있는 고급 검색 패널 컴포넌트입니다. 검색 파라미터 출력 조건 기능을 통해 
				사용자가 원하는 검색 조건만 선택적으로 표시할 수 있습니다.
			</p>
			<AdvancedSearchExample />
		</div>
	);
} 