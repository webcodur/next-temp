/* 
  파일명: /components/ui/ui-input/advanced-search/AdvancedSearch.tsx
  기능: 아코디언 형태의 고급 검색 인터페이스 컴포넌트
  책임: 필드 제어와 반응형 레이아웃을 통한 동적 검색 조건 관리
*/ // ------------------------------

import React, { ReactElement } from 'react';

import { RotateCcw, Database, Globe } from 'lucide-react';

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
	colorVariant?: 'primary' | 'secondary';
	searchMode?: 'client' | 'server'; // 새로 추가
}
// #endregion

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
	title,
	fields,
	onSearch,
	onReset,
	searchLabel = '검색',
	resetLabel = '리셋',
	defaultOpen,
	showButtons,
	statusText,
	colorVariant,
	searchMode = 'server', // 기본값은 서버 사이드
}) => {
	const { isRTL } = useLocale();
	
	// searchMode에 따른 동적 설정
	const modeConfig = {
		client: {
			title: title || (
				<div className="flex gap-2 items-center">
					<Globe className="w-4 h-4" />
					<span>페이지 내 실시간 검색</span>
				</div>
			),
			defaultOpen: defaultOpen !== undefined ? defaultOpen : true,
			showButtons: showButtons !== undefined ? showButtons : false,
			colorVariant: colorVariant || 'secondary',
			icon: [Globe],
			instructionText: '조건 변경 시 즉시 필터링됩니다',
		},
		server: {
			title: title || (
				<div className="flex gap-2 items-center">
					<Database className="w-4 h-4" />
					<span>DB 데이터 상세 검색</span>
				</div>
			),
			defaultOpen: defaultOpen !== undefined ? defaultOpen : false,
			showButtons: showButtons !== undefined ? showButtons : true,
			colorVariant: colorVariant || 'primary',
			icon: [Database],
			instructionText: null,
		},
	};

	const currentConfig = modeConfig[searchMode];
	const colorStyles = {
		primary: {
			searchButton: 'text-primary-foreground bg-primary hover:bg-primary/90',
			resetButton: 'text-muted-foreground bg-background hover:text-primary',
		},
		secondary: {
			searchButton: 'text-secondary-foreground bg-secondary hover:bg-secondary/90',
			resetButton: 'text-muted-foreground bg-background hover:text-secondary',
		},
	};
	return (
		<Accordion title={currentConfig.title} defaultOpen={currentConfig.defaultOpen} statusText={statusText}>
			<div className="space-y-6">
				{/* 검색 필드들 */}
				<div className="space-y-4">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						{fields.map(field => (
							<div key={field.key}>
								{field.element}
							</div>
						))}
					</div>
				</div>

				{/* 클라이언트 모드: 안내 문구 */}
				{searchMode === 'client' && (
					<div className="flex justify-center items-center py-2 text-sm text-center text-muted-foreground">
						<span>{currentConfig.instructionText}</span>
					</div>
				)}

				{/* 서버 모드: 검색/리셋 버튼 */}
				{searchMode === 'server' && currentConfig.showButtons && (
					<div className={`flex gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
						<button
							onClick={onReset}
							className={`flex gap-2 items-center px-4 h-10 text-sm font-medium rounded-xl transition-colors neu-raised ${colorStyles[currentConfig.colorVariant].resetButton}`}>
							<RotateCcw className="w-4 h-4" />
							{resetLabel}
						</button>
						<button
							onClick={onSearch}
							className={`flex gap-2 items-center px-4 h-10 text-sm font-medium rounded-xl transition-colors neu-raised ${colorStyles[currentConfig.colorVariant].searchButton}`}>
							<Database className="w-4 h-4" />
							{searchLabel}
						</button>
					</div>
				)}
			</div>
		</Accordion>
	);
};
