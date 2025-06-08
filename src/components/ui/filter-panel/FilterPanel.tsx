import React, { ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, Search } from 'lucide-react';

interface FilterPanelProps {
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

export const FilterPanel: React.FC<FilterPanelProps> = ({
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
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="neu-flat bg-gray-50 rounded-2xl">
			{/* 헤더 */}
			<div
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex items-center justify-between p-4 bg-white cursor-pointer neu-raised rounded-t-2xl">
				<h2 className="text-sm font-medium text-gray-900">{title}</h2>
				<div className="flex items-center gap-3">
					{/* 상태 텍스트 */}
					{statusText && (
						<span className="text-xs font-medium text-gray-500">
							{statusText}
						</span>
					)}
					{/* 토글 아이콘 */}
					<div className="neu-icon-inactive">
						{isOpen ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
					</div>
				</div>
			</div>

			{/* 콘텐츠 */}
			<div
				className={`transition-all duration-300 ease-in-out ${
					isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
				}`}>
				<div className="p-4">
					<div className="flex items-end gap-4">
						{/* 검색 필드들 */}
						<div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-3 auto-rows-fr">
							{children}
						</div>

						{/* 버튼 영역 */}
						{showButtons && (
							<div className="flex flex-shrink-0 gap-2">
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
				</div>
			</div>
		</div>
	);
};
