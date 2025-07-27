'use client';

import React, { ReactNode } from 'react';
import ModalContainer from './unit/ModalContainer';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	className?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
	showCloseButton?: boolean;
	closeOnBackdropClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	className = '',
	size = 'md',
	showCloseButton = true,
	closeOnBackdropClick = true,
}) => {
	if (!isOpen) return null;

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-full w-full h-full',
	};

	return (
		<ModalContainer
			isOpen={isOpen}
			onClose={onClose}
			closeOnBackdropClick={closeOnBackdropClick}
			className={cn(
				'mx-4 w-full rounded-lg shadow-xl bg-background',
				sizeClasses[size],
				className
			)}
		>
			{/* 닫기 버튼 */}
			{showCloseButton && (
				<button
					onClick={onClose}
					className="absolute top-4 z-10 text-2xl transition-colors cursor-pointer end-4 text-foreground hover:text-primary">
					<X size={20} />
				</button>
			)}

			{/* 제목 */}
			{title && (
				<div className="relative px-6 py-4 border-b border-border">
					<h2 className="text-xl font-semibold text-center text-foreground font-multilang">
						{title}
					</h2>
				</div>
			)}

			{/* 내용 */}
			<div className="px-6 py-4">
				{children}
			</div>
		</ModalContainer>
	);
};

export default Modal;
