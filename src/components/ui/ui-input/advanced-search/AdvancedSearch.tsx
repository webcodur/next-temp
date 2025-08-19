/* 
  파일명: /components/ui/ui-input/advanced-search/AdvancedSearch.tsx
  기능: 아코디언 형태의 고급 검색 인터페이스 컴포넌트
  책임: 필드 제어와 반응형 레이아웃을 통한 동적 검색 조건 관리
*/ // ------------------------------

import React, { ReactElement, ReactNode, useEffect, useRef } from 'react';

import { RotateCcw, Database, Globe } from 'lucide-react';

import { Accordion } from '@/components/ui/ui-layout/accordion/Accordion';
import { useLocale } from '@/hooks/ui-hooks/useI18n';

// #region 타입 및 인터페이스
interface FieldConfig {
	key: string;
	label: string;
	element: ReactElement;
	visible: boolean;
}

interface AdvancedSearchProps {
	title?: string; // 아코디언 헤더에 표시될 제목 (미설정시 searchMode에 따라 자동 생성)
	fields: FieldConfig[]; // 검색 필드 설정 배열 (key, label, element, visible 포함)
	onSearch?: () => void; // 검색 버튼 클릭 또는 Enter 키 입력시 실행될 콜백 함수
	onReset?: () => void; // 리셋 버튼 클릭시 실행될 폼 초기화 콜백 함수
	defaultOpen?: boolean; // 아코디언 초기 펼침 상태 (미설정시 searchMode에 따라 자동 설정)
	showButtons?: boolean; // 검색/리셋 버튼 표시 여부 (미설정시 searchMode에 따라 자동 설정)
	statusText?: string; // 아코디언 헤더 우측에 표시할 상태 텍스트
	fieldControlsLabel?: string; // 필드 제어 영역의 레이블 (현재 사용되지 않음)
	colorVariant?: 'primary' | 'secondary'; // 버튼 색상 테마 (미설정시 searchMode에 따라 자동 설정)
	searchMode?: 'client' | 'server'; // 검색 동작 모드 - client: 실시간 필터링, server: 버튼 기반 검색
	alwaysOpen?: boolean; // 아코디언 없이 항상 펼쳐진 상태로 고정
	footerLeft?: ReactNode; // 푸터 좌측에 표시할 커스텀 액션 영역 (server 모드에서만 표시)
	columns?: 2 | 3; // 필드 그리드 열 개수 (2: md에서 2열, 3: md에서 2열 lg에서 3열)
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
	footerLeft,
	columns = 2, // 기본값은 2열
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

	// 헤더 액션 버튼들 (서버 모드에서 애니메이션과 함께 표시)
	const headerActions = searchMode === 'server' && currentConfig.showButtons ? (isOpen: boolean) => {
		return (
			<div className={`flex gap-1.5 transition-all duration-300 ease-in-out ${
				isOpen 
					? 'opacity-100 scale-100 translate-x-0' 
					: 'opacity-0 scale-95 translate-x-2'
			} ${isRTL ? 'justify-start' : 'justify-end'}`}>
				<button
					onClick={onReset}
					className={`flex gap-1.5 items-center px-2.5 h-7 text-xs font-medium rounded-md transition-colors neu-raised select-none ${colorStyles[currentConfig.colorVariant].resetButton}`}>
					<RotateCcw className="w-3 h-3" />
					리셋
				</button>
				<button
					onClick={onSearch}
					className={`flex gap-1.5 items-center px-2.5 h-7 text-xs font-medium rounded-md transition-colors neu-raised select-none ${colorStyles[currentConfig.colorVariant].searchButton}`}>
					<Database className="w-3 h-3" />
					검색
				</button>
			</div>
		);
	} : null;
	// 내용 컴포넌트
	const content = (
		<div className="space-y-6" ref={containerRef} tabIndex={-1}>
			{/* 검색 필드들 */}
			<div className="space-y-4">
				<div className={`grid grid-cols-1 gap-4 ${
					columns === 3 
						? 'md:grid-cols-2 lg:grid-cols-3' 
						: 'md:grid-cols-2'
				}`}>
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

			{/* 서버 모드: 좌측 커스텀 액션만 표시 (버튼은 헤더로 이동) */}
			{searchMode === 'server' && footerLeft && (
				<div className="flex justify-start items-center">
					<div className="flex gap-2 items-center">
						{footerLeft}
					</div>
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
		<Accordion 
			title={currentConfig.title} 
			defaultOpen={currentConfig.defaultOpen} 
			statusText={statusText}
			headerActions={headerActions}
		>
			{content}
		</Accordion>
	);
};
