'use client';

import React, { ReactNode, useEffect, useRef } from 'react';
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
	/** confirm 기능이 있는 모달에서 space키로 confirm 실행 */
	onConfirm?: () => void;
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
	onConfirm,
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	// 모달이 열릴 때 포커스 이동
	useEffect(() => {
		if (isOpen) {
			const focusModal = () => {
				if (modalRef.current) {
					// 첫 번째 focusable 요소를 찾아서 포커스
					const focusableElements = modalRef.current.querySelectorAll(
						'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
					);
					
					const firstFocusableElement = focusableElements[0] as HTMLElement;
					if (firstFocusableElement) {
						firstFocusableElement.focus();
					} else {
						// focusable 요소가 없으면 모달 자체에 포커스
						modalRef.current.focus();
					}
				}
			};

			const timeoutId = setTimeout(() => {
				requestAnimationFrame(focusModal);
			}, 100);

			return () => clearTimeout(timeoutId);
		}
	}, [isOpen]);

	// space키로 confirm 기능 처리
	useEffect(() => {
		if (!isOpen || !onConfirm) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			// space키를 누르고 input이나 textarea가 focus되어 있지 않을 때
			if (event.code === 'Space' && !['INPUT', 'TEXTAREA'].includes((event.target as HTMLElement)?.tagName)) {
				event.preventDefault();
				onConfirm();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onConfirm]);

	const sizeClasses = {
		sm: 'max-w-sm',
		md: 'max-w-4xl',
		lg: 'max-w-5xl',
		xl: 'max-w-6xl',
		full: 'max-w-full w-full h-full',
	};

	return (
		<ModalContainer
			ref={modalRef}
			isOpen={isOpen}
			onClose={onClose}
			closeOnBackdropClick={closeOnBackdropClick}
			tabIndex={0}
			className={cn(
				'mx-4 w-full rounded-lg shadow-xl bg-background focus:outline-none',
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
