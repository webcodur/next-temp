'use client';

import React, { ReactNode, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
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

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
					onMouseDown={handleOutsideClick}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}>
					<motion.div
						className={`bg-white rounded-lg shadow-lg w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.2 }}>
						<div className="flex items-center justify-between p-6 border-b border-gray-200">
							<h2 className="flex-grow text-xl font-semibold text-center text-gray-900">
								{title}
							</h2>
							<button
								type="button"
								onClick={onClose}
								className="ml-4 text-2xl text-gray-900 cursor-pointer hover:text-red-600">
								&times;
							</button>
						</div>
						<div className="p-6">{children}</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default Modal;
