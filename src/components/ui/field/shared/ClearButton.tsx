import React from 'react';
import { X } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';

interface ClearButtonProps {
	onClick: (e: React.MouseEvent) => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onClick }) => (
	<button
		onClick={onClick}
		className={`absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-gray-100 border border-gray-300 text-gray-600 transition-all hover:bg-gray-200 hover:border-gray-400 hover:text-gray-800 ${FIELD_STYLES.button}`}
		type="button">
		<X className="h-3 w-3" />
	</button>
);
