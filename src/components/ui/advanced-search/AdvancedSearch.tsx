import React, { ReactNode } from 'react';
import { RotateCcw, Search } from 'lucide-react';
import { Accordion } from '@/components/ui/accordion';

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
		<Accordion
			title={title}
			defaultOpen={defaultOpen}
			statusText={statusText}
		>
			<div className="space-y-6">
				{/* 검색 필드들 */}
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{children}
				</div>

				{/* 버튼 영역 */}
				{showButtons && (
					<div className="flex justify-end gap-2">
						{/* 리셋 버튼 */}
						<button
							onClick={onReset}
							className="flex items-center h-10 gap-2 px-4 text-sm font-medium text-gray-600 transition-colors bg-white neu-raised rounded-xl hover:text-gray-800">
							<RotateCcw className="w-4 h-4" />
							{resetLabel}
						</button>

						{/* 검색 버튼 */}
						<button
							onClick={onSearch}
							className="flex items-center h-10 gap-2 px-4 text-sm font-medium text-white transition-colors bg-gray-800 neu-raised rounded-xl hover:bg-gray-900">
							<Search className="w-4 h-4" />
							{searchLabel}
						</button>
					</div>
				)}
			</div>
		</Accordion>
	);
};
