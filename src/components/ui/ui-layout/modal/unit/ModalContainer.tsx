'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalContainerProps {
	isOpen: boolean;
	onClose?: () => void;
	children: ReactNode;
	className?: string;
	closeOnBackdropClick?: boolean;
}

const ModalContainer: React.FC<ModalContainerProps> = ({
	isOpen,
	onClose,
	children,
	className = '',
	closeOnBackdropClick = true,
}) => {
	// 클라이언트 마운트 여부 확인 (Hydration mismatch 방지)
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	// ESC 키로 닫기
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && isOpen && onClose) {
				onClose();
			}
		};
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	// 열렸을 때 body 스크롤 막기
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

	// 서버 사이드 또는 마운트 전에는 아무것도 렌더링하지 않음
	if (!mounted) return null;

	if (!isOpen) return null;

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
			onClose();
		}
	};

	const modalContent = (
		<div
			className="flex fixed inset-0 z-50 justify-center items-center backdrop-blur-sm bg-background/40"
			onClick={handleBackdropClick}
		>
			<div className={cn('relative bg-background neu-raised rounded-lg shadow-lg', className)}>
				{children}
			</div>
		</div>
	);

	// 클라이언트에서만 렌더링
	if (typeof window !== 'undefined') return createPortal(modalContent, document.body);
	return null;
};

export default ModalContainer; 