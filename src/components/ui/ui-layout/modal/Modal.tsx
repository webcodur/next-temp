'use client';

import React, { ReactNode, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	maxWidth?: string;
	exitByClickOutside?: boolean;
}

const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	maxWidth = 'max-w-3xl',
	exitByClickOutside = true,
}) => {
	const handleEscKey = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === 'Escape') onClose();
		},
		[onClose]
	);

	const handleOutsideClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget && exitByClickOutside) onClose();
	};

	useEffect(() => {
		if (!isOpen) return;
		document.addEventListener('keydown', handleEscKey);
		return () => document.removeEventListener('keydown', handleEscKey);
	}, [isOpen, handleEscKey]);

	// SSR 환경에서는 Portal을 사용하지 않음
	if (typeof window === 'undefined') {
		return null;
	}

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="flex fixed inset-0 z-50 justify-center items-center bg-black/50 backdrop-blur-xs"
					onMouseDown={handleOutsideClick}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}>
					<motion.div
						className={`overflow-y-auto relative w-full bg-background rounded-lg shadow-lg ${maxWidth} max-h-[90vh]`}
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.2 }}>
						{/* 우상단 고정 닫기 버튼 */}
						<button
							type="button"
							onClick={onClose}
							className="absolute top-4 right-4 z-10 text-2xl text-foreground cursor-pointer hover:text-brand transition-colors">
							&times;
						</button>
						
						{/* 타이틀이 있는 경우에만 헤더 영역 렌더링 */}
						{title && (
							<div className="p-6 pb-4 border-b border-brand/40">
								<h2 className="text-xl font-semibold text-center text-foreground">
									{title}
								</h2>
							</div>
						)}
						
						<div className={title ? "p-6" : "p-6 pt-12"}>{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>,
		document.body
	);
};

export default Modal;
