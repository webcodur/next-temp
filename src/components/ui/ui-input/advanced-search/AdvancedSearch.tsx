import React, { ReactNode } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { Accordion } from '@/components/ui/ui-layout/accordion/Accordion';

interface AdvancedSearchProps {
	title?: string;
	children: ReactNode;
	onSearch?: () => void;
	onReset?: () => void;
	searchLabel?: string;
	resetLabel?: string;
	defaultOpen?: boolean;
	showButtons?: boolean;
	statusText?: string;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
	title = 'Advanced Search',
	children,
	onSearch,
	onReset,
	searchLabel = '검색',
	resetLabel = '리셋',
	defaultOpen = true,
	showButtons = true,
	statusText,
}) => {
	return (
		<Accordion title={title} defaultOpen={defaultOpen} statusText={statusText}>
			<div className="space-y-6">
				{/* 검색 필드들 */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">{children}</div>

				{/* 버튼 영역 */}
				{showButtons && (
					<div className="flex justify-end gap-2">
						{/* 리셋 버튼 */}
						<button
							onClick={onReset}
							className="flex items-center h-10 gap-2 px-4 text-sm font-medium text-muted-foreground transition-colors bg-background neu-raised rounded-xl hover:text-brand">
							<RotateCcw className="w-4 h-4" />
							{resetLabel}
						</button>

						{/* 검색 버튼 */}
						<button
							onClick={onSearch}
							className="flex items-center h-10 gap-2 px-4 text-sm font-medium text-brand-foreground transition-colors bg-brand neu-raised rounded-xl hover:bg-brand/90">
							<Search className="w-4 h-4" />
							{searchLabel}
						</button>
					</div>
				)}
			</div>
		</Accordion>
	);
};
