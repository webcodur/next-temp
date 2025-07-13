// 이름 편집 모달 컴포넌트

import { useEffect, useRef } from 'react';
import Modal from '@/components/ui/ui-layout/modal/Modal';

interface NameEditModalProps {
	isOpen: boolean;
	currentName: string;
	onNameChange: (name: string) => void;
	onSave: () => void;
	onCancel: () => void;
}

export const NameEditModal = ({
	isOpen,
	currentName,
	onNameChange,
	onSave,
	onCancel,
}: NameEditModalProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isOpen && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isOpen]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			onSave();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			onCancel();
		}
	};

	const handleSave = () => {
		if (currentName.trim()) {
			onSave();
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onCancel}
			title="이름 편집"
			size="sm"
			closeOnBackdropClick={false}
		>
			<div className="space-y-4">
				<div>
					<label className="block mb-2 text-sm font-medium text-foreground">
						새 이름을 입력하세요
					</label>
					<input
						ref={inputRef}
						type="text"
						value={currentName}
						onChange={(e) => onNameChange(e.target.value)}
						onKeyDown={handleKeyDown}
						className="p-3 w-full rounded-lg border border-gray-300 neu-inset font-multilang focus:outline-none focus:ring-2 focus:ring-primary"
						placeholder="이름을 입력하세요"
						maxLength={50}
					/>
				</div>
				
				<div className="flex gap-2 justify-end">
					<button
						onClick={onCancel}
						className="px-4 py-2 rounded-lg neu-raised hover:scale-105 font-multilang text-secondary"
					>
						취소
					</button>
					<button
						onClick={handleSave}
						disabled={!currentName.trim()}
						className="px-4 py-2 text-white rounded-lg neu-raised hover:scale-105 bg-primary font-multilang disabled:opacity-50 disabled:cursor-not-allowed"
					>
						저장
					</button>
				</div>
			</div>
		</Modal>
	);
}; 