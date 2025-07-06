import React from 'react';
import { X } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';

interface ClearButtonProps {
	onClick: () => void;
	className?: string;
}

export const ClearButton = ({ onClick, className = '' }: ClearButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`${FIELD_STYLES.endIcon} ${FIELD_STYLES.clearButton} ${className}`}
		>
			<X className="w-3 h-3" />
		</button>
	);
};
