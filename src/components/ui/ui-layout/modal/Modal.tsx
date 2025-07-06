'use client';

import React, { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
	// ESC 키로 모달 닫기
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen) {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	// 모달이 열렸을 때 body 스크롤 막기
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		full: 'max-w-full w-full h-full',
	};

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (closeOnBackdropClick && e.target === e.currentTarget) {
			onClose();
		}
	};

	const modalContent = (
		<div
			className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-md bg-black/20"
			onClick={handleBackdropClick}
		>
			<div
				className={cn(
					'relative mx-4 w-full rounded-lg shadow-xl bg-background animate-fadeIn',
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
					<div className="px-6 py-4 border-b border-border">
						<h2 className="text-xl font-semibold text-foreground font-multilang">
							{title}
						</h2>
					</div>
				)}

				{/* 내용 */}
				<div className="px-6 py-4">
					{children}
				</div>
			</div>
		</div>
	);

	// Portal을 사용하여 body에 직접 렌더링 (클라이언트에서만)
	if (typeof window !== 'undefined') {
		return createPortal(modalContent, document.body);
	}
	
	// 서버 사이드 렌더링 중에는 null 반환
	return null;
};

export default Modal;
