import React from 'react';
import { X } from 'lucide-react';
import { FIELD_STYLES } from '../core/config';

interface ClearButtonProps {
	onClick: (e: React.MouseEvent) => void;
}

export const ClearButton: React.FC<ClearButtonProps> = ({ onClick }) => (
	<button
		onClick={onClick}
		className={`${FIELD_STYLES.rightIcon} ${FIELD_STYLES.clearButton}`}
		type="button">
		<X className="w-3 h-3" />
	</button>
);
