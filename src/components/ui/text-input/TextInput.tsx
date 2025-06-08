import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';

interface TextInputProps {
	label?: string;
	placeholder?: string;
	value: string;
	onChange: (value: string) => void;
	onEnterPress?: () => void;
	onClear?: () => void;
	type?: string;
	className?: string;
	size?: 'sm' | 'md' | 'lg';
	showSearchIcon?: boolean;
	showClearButton?: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
	label,
	placeholder,
	value,
	onChange,
	onEnterPress,
	onClear,
	type = 'text',
	className = '',
	size = 'md',
	showSearchIcon = false,
	showClearButton = true,
}) => {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && onEnterPress) {
			onEnterPress();
		}
	};

	const handleClear = () => {
		onChange('');
		onClear?.();
	};

	// 사이즈별 스타일
	const sizeStyles = {
		sm: 'px-3 py-2 text-sm h-8',
		md: 'px-4 py-2.5 text-sm h-10',
		lg: 'px-4 py-3 text-base h-11',
	};

	return (
		<div className="flex flex-col">
			{label && (
				<label className="mb-2 text-sm font-medium text-gray-700">
					{label}
				</label>
			)}
			<div className="relative">
				{/* 검색 아이콘 */}
				{showSearchIcon && (
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
				)}

				<input
					type={type}
					placeholder={placeholder}
					value={value}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					className={`
						w-full neu-flat bg-gray-50 rounded-xl
						text-gray-800 placeholder-gray-400 
						focus:outline-none focus:ring-2 focus:ring-gray-300 focus:neu-inset transition-all duration-200
						${sizeStyles[size]}
						${showSearchIcon ? 'pl-10' : ''}
						${showClearButton && value ? 'pr-10' : ''}
						${className}
					`}
				/>

				{/* 클리어 버튼 */}
				{showClearButton && value && (
					<button
						onClick={handleClear}
						className="absolute right-3 top-1/2 transform -translate-y-1/2 
						         w-5 h-5 flex items-center justify-center
						         neu-raised rounded-full
						         text-gray-500 hover:text-gray-700 transition-colors"
						type="button">
						<X className="w-3 h-3" />
					</button>
				)}
			</div>
		</div>
	);
};
