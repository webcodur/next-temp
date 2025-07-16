/* 
  파일명: /components/ui/ui-input/advanced-search/AdvancedSearch.tsx
  기능: 아코디언 형태의 고급 검색 인터페이스 컴포넌트
  책임: 필드 제어와 반응형 레이아웃을 통한 동적 검색 조건 관리
*/ // ------------------------------

import React, { useState, ReactElement, cloneElement } from 'react';

import { RotateCcw, Search, Settings, CheckSquare2, Square } from 'lucide-react';

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
	searchFieldsLabel?: string;
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
	fieldControlsLabel = '검색 조건 설정',
	searchFieldsLabel = '검색 조건',
}) => {
	// #region 훅
	const { isRTL } = useLocale();
	// #endregion
	
	// #region 상태
	const [fieldStates, setFieldStates] = useState<FieldConfig[]>(() => {
		return fields.map(field => ({ ...field, visible: true }));
	});
	// #endregion

	// #region 핸들러
	// 필드 표시/숨김 토글
	const toggleFieldVisibility = (key: string) => {
		setFieldStates(prev =>
			prev.map(field =>
				field.key === key ? { ...field, visible: !field.visible } : field
			)
		);
	};

	// 전체 선택
	const selectAllFields = () => {
		setFieldStates(prev =>
			prev.map(field => ({ ...field, visible: true }))
		);
	};

	// 전체 해제
	const deselectAllFields = () => {
		setFieldStates(prev =>
			prev.map(field => ({ ...field, visible: false }))
		);
	};
	// #endregion

	// #region 렌더링
	// 표시할 필드들 필터링
	const visibleFields = fieldStates.filter(field => field.visible);

	return (
		<Accordion title={title} defaultOpen={defaultOpen} statusText={statusText}>
			<div className="space-y-6">
				{/* 필드 제어 패널 */}
				<div className="mb-4">
					{/* 헤더 영역 */}
					<div className="flex justify-between items-center mb-3">
						<div className="flex gap-2 items-center">
							<Settings className="w-4 h-4 text-primary" />
							<h3 className="text-sm font-semibold text-foreground">{fieldControlsLabel}</h3>
						</div>
						
						{/* 전체 제어 버튼들 */}
						<div className="flex gap-2 items-center">
							<button
								onClick={selectAllFields}
								className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 neu-raised cursor-pointer"
								title="전체 선택"
							>
								<CheckSquare2 className="w-3 h-3" />
								전체선택
							</button>
							<button
								onClick={deselectAllFields}
								className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-all duration-200 neu-raised cursor-pointer"
								title="전체 해제"
							>
								<Square className="w-3 h-3" />
								전체해제
							</button>
						</div>
					</div>
					
					{/* 체크박스 영역 */}
					<div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4 mb-3">
						{fieldStates.map(field => (
							<label 
								key={field.key} 
								className="group flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 hover:bg-muted/30 cursor-pointer border border-transparent hover:border-border/30"
							>
								<input
									type="checkbox"
									checked={field.visible}
									onChange={() => toggleFieldVisibility(field.key)}
									className="w-3.5 h-3.5 rounded border border-border text-primary focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all duration-200"
								/>
								<span className="text-xs font-medium transition-colors select-none text-foreground group-hover:text-primary">
									{field.label}
								</span>
							</label>
						))}
					</div>

					{/* 구분선 */}
					<hr className="border-border/30" />
				</div>

				{/* 검색 필드들 */}
				<div className="space-y-4">
					{/* 검색 필드 타이틀 */}
					<div className="flex gap-2 items-center">
						<Search className="w-4 h-4 text-primary" />
						<h3 className="text-sm font-semibold text-foreground">{searchFieldsLabel}</h3>
					</div>
					
					{/* 검색 필드 그리드 */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{visibleFields.map(field => (
							<div key={field.key}>
								{cloneElement(field.element, { key: field.key })}
							</div>
						))}
					</div>
				</div>

				{/* 버튼 영역 */}
				{showButtons && (
					<div className={`flex gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
						{/* 리셋 버튼 */}
						<button
							onClick={onReset}
							className="flex gap-2 items-center px-4 h-10 text-sm font-medium rounded-xl transition-colors text-muted-foreground bg-background neu-raised hover:text-primary">
							<RotateCcw className="w-4 h-4" />
							{resetLabel}
						</button>

						{/* 검색 버튼 */}
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
	// #endregion
};
