import React from 'react';
import { Dialog, DialogFooter } from '@/components/ui/ui-layout/dialog/Dialog';
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
		<Dialog
			isOpen={isOpen}
			onClose={onClose}
			title="전체 내용"
			size="md"
			variant="info"
		>
			<p className="whitespace-pre-wrap break-words font-multilang">
				{content}
			</p>
			
			<DialogFooter>
				<Button onClick={onClose} className="font-multilang">
					확인
				</Button>
			</DialogFooter>
		</Dialog>
	);
}; 