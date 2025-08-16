'use client';

import React from 'react';
import Modal from '@/components/ui/ui-layout/modal/Modal';

// #region GridFormRulesModal 타입 정의
export interface GridFormRulesModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	rules: React.ReactNode;
}
// #endregion

// #region GridFormRulesModal 컴포넌트
const GridFormRulesModal: React.FC<GridFormRulesModalProps> = ({
	isOpen,
	onClose,
	title,
	rules,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`${title} - 입력 규칙`}
			size="sm"
			className="max-w-md"
		>
			<div className="text-sm leading-relaxed text-muted-foreground">
				{rules}
			</div>
		</Modal>
	);
};

GridFormRulesModal.displayName = 'GridFormRulesModal';
// #endregion

export default GridFormRulesModal;
