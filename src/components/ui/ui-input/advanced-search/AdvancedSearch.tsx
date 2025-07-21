/* 
  파일명: /components/ui/ui-input/advanced-search/AdvancedSearch.tsx
  기능: 아코디언 형태의 고급 검색 인터페이스 컴포넌트
  책임: 필드 제어와 반응형 레이아웃을 통한 동적 검색 조건 관리
*/ // ------------------------------

import React, { ReactElement, cloneElement } from 'react';

import { RotateCcw, Search } from 'lucide-react';

import { Accordion } from '@/components/ui/ui-layout/accordion/Accordion';
import { useLocale } from '@/hooks/useI18n';

// #region 타입 및 인터페이스
interface FieldConfig {
	key: string;
	label: string;
	element: ReactElement;
	visible: boolean;
}

interface AdvancedSearchProps {
	title?: string;
	fields: FieldConfig[];
	onSearch?: () => void;
	onReset?: () => void;
	searchLabel?: string;
	resetLabel?: string;
	defaultOpen?: boolean;
	showButtons?: boolean;
	statusText?: string;
	fieldControlsLabel?: string;
}
// #endregion

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
	title = 'Advanced Search',
	fields,
	onSearch,
	onReset,
	searchLabel = '검색',
	resetLabel = '리셋',
	defaultOpen = true,
	showButtons = true,
	statusText,
}) => {
	const { isRTL } = useLocale();

	// 필드 제어 관련 상태 및 함수 완전 제거

	return (
		<Accordion title={title} defaultOpen={defaultOpen} statusText={statusText}>
			<div className="space-y-6">
				{/* 검색 필드들 */}
				<div className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{fields.map(field => (
							<div key={field.key}>
								{cloneElement(field.element, { key: field.key })}
							</div>
						))}
					</div>
				</div>

				{/* 버튼 영역 */}
				{showButtons && (
					<div className={`flex gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
						<button
							onClick={onReset}
							className="flex gap-2 items-center px-4 h-10 text-sm font-medium rounded-xl transition-colors text-muted-foreground bg-background neu-raised hover:text-primary">
							<RotateCcw className="w-4 h-4" />
							{resetLabel}
						</button>
						<button
							onClick={onSearch}
							className="flex gap-2 items-center px-4 h-10 text-sm font-medium rounded-xl transition-colors text-primary-foreground bg-primary neu-raised hover:bg-primary/90">
							<Search className="w-4 h-4" />
							{searchLabel}
						</button>
					</div>
				)}
			</div>
		</Accordion>
	);
};
