'use client';

import React, { ReactNode, useEffect, useState, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// #region 타입
interface ModalContainerProps {
	isOpen: boolean;
	onClose?: () => void;
	children: ReactNode;
	className?: string;
	closeOnBackdropClick?: boolean;
	tabIndex?: number;
}
// #endregion

const ModalContainer = forwardRef<HTMLDivElement, ModalContainerProps>(({
	isOpen,
	onClose,
	children,
	className = '',
	closeOnBackdropClick = true,
	tabIndex,
}, ref) => {
	// #region 상태
	// 클라이언트 마운트 여부 확인 (Hydration mismatch 방지)
	const [mounted, setMounted] = useState(false);
	// #endregion

	// #region 핸들러
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

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (closeOnBackdropClick && e.target === e.currentTarget && onClose) {
			onClose();
		}
	};
	// #endregion

	// #region 렌더링
	const modalContent = (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="flex fixed inset-0 z-50 justify-center items-center"
					onClick={handleBackdropClick}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.15 }}
				>
					{/* 배경 오버레이 - 블러 처리 */}
					<motion.div 
						className="absolute inset-0 bg-background/40"
						initial={{ 
							opacity: 0,
							backdropFilter: 'blur(0px)'
						}}
						animate={{ 
							opacity: 1,
							backdropFilter: 'blur(4px)'
						}}
						exit={{ 
							opacity: 0,
							backdropFilter: 'blur(0px)'
						}}
						transition={{ duration: 0.2 }}
					/>
					
					<motion.div 
						ref={ref}
						tabIndex={tabIndex}
						className={cn('relative rounded-lg shadow-lg bg-background neu-elevated', className)}
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15 }}
					>
						{children}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);

	// 클라이언트에서만 렌더링
	if (typeof window !== 'undefined') return createPortal(modalContent, document.body);
	return null;
	// #endregion
});

ModalContainer.displayName = 'ModalContainer';

export default ModalContainer; 