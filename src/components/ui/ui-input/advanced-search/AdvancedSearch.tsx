/* 
  파일명: /components/ui/ui-input/advanced-search/AdvancedSearch.tsx
  기능: 아코디언 형태의 고급 검색 인터페이스 컴포넌트
  책임: 필드 제어와 반응형 레이아웃을 통한 동적 검색 조건 관리
*/ // ------------------------------

import React, { ReactElement, useEffect, useRef } from 'react';

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
	defaultOpen?: boolean;
	showButtons?: boolean;
	statusText?: string;
	fieldControlsLabel?: string;
	colorVariant?: 'primary' | 'secondary';
	searchMode?: 'client' | 'server';
	alwaysOpen?: boolean; // 아코디언 없이 항상 펼쳐진 상태로 고정
}
// #endregion

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
	title,
	fields,
	onSearch,
	onReset,
	defaultOpen,
	showButtons,
	statusText,
	colorVariant,
	searchMode = 'server', // 기본값은 서버 사이드
	alwaysOpen = false, // 기본값은 false (아코디언 사용)
}) => {
	const { isRTL } = useLocale();
	const containerRef = useRef<HTMLDivElement>(null);
	
	// Enter 키 이벤트 핸들러
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Enter' && onSearch) {
				event.preventDefault();
				onSearch();
			}
		};

		const container = containerRef.current;
		if (container) {
			container.addEventListener('keydown', handleKeyDown);
		}

		return () => {
			if (container) {
				container.removeEventListener('keydown', handleKeyDown);
			}
		};
	}, [onSearch]);

	// searchMode에 따른 동적 설정
	const modeConfig = {
		client: {
			title: title || (
				<div className="flex gap-2 items-center">
					<Globe className="w-4 h-4" />
					<span>실시간 필터링</span>
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
					<span>상세 검색</span>
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
	// 내용 컴포넌트
	const content = (
		<div className="space-y-6" ref={containerRef} tabIndex={-1}>
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
						리셋
					</button>
					<button
						onClick={onSearch}
						className={`flex gap-2 items-center px-4 h-10 text-sm font-medium rounded-xl transition-colors neu-raised ${colorStyles[currentConfig.colorVariant].searchButton}`}>
						<Database className="w-4 h-4" />
						검색
					</button>
				</div>
			)}
		</div>
	);

	// alwaysOpen이 true이면 아코디언 없이 바로 내용 렌더링
	if (alwaysOpen) {
		return (
			<div className="p-4 rounded-lg border bg-background border-border">
				{content}
			</div>
		);
	}

	// 기본: 아코디언으로 렌더링
	return (
		<Accordion title={currentConfig.title} defaultOpen={currentConfig.defaultOpen} statusText={statusText}>
			{content}
		</Accordion>
	);
};
