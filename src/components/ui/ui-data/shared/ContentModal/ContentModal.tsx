import React from 'react';
import Modal from '@/components/ui/ui-layout/modal/Modal';
import { Button } from '@/components/ui/ui-input/button/Button';

interface ContentModalProps {
	isOpen: boolean;
	content: string | null;
	onClose: () => void;
}

export const ContentModal: React.FC<ContentModalProps> = ({
	isOpen,
	content,
	onClose,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="전체 내용"
		>
			<div className="space-y-4">
				<p className="whitespace-pre-wrap break-words font-multilang">
					{content}
				</p>
				
				<div className="flex justify-end pt-4">
					<Button onClick={onClose} className="font-multilang">
						확인
					</Button>
				</div>
			</div>
		</Modal>
	);
}; 