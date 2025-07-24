'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useLocale } from '@/hooks/useI18n';

export interface DialogProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children?: React.ReactNode;
	footer?: React.ReactNode;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
	colorVariant?: 'primary' | 'secondary';
	showCloseButton?: boolean;
	closeOnEscape?: boolean;
	closeOnOverlay?: boolean;
	className?: string;
}

const sizeClasses = {
	sm: 'max-w-md',
	md: 'max-w-lg',
	lg: 'max-w-2xl',
	xl: 'max-w-4xl',
};

const getVariantConfig = (colorVariant: 'primary' | 'secondary') => ({
	default: {
		icon: null,
		iconColor: '',
		borderColor: colorVariant === 'primary' ? 'border-primary/20' : 'border-secondary/20',
	},
	success: {
		icon: CheckCircle,
		iconColor: 'text-success',
		borderColor: 'border-success/20',
	},
	warning: {
		icon: AlertTriangle,
		iconColor: 'text-warning',
		borderColor: 'border-warning/20',
	},
	error: {
		icon: AlertCircle,
		iconColor: 'text-destructive',
		borderColor: 'border-destructive/20',
	},
	info: {
		icon: Info,
		iconColor: colorVariant === 'primary' ? 'text-primary' : 'text-secondary',
		borderColor: colorVariant === 'primary' ? 'border-primary/20' : 'border-secondary/20',
	},
});

export const Dialog: React.FC<DialogProps> = ({
	isOpen,
	onClose,
	title,
	children,
	footer,
	size = 'md',
	variant = 'default',
	colorVariant = 'primary',
	showCloseButton = true,
	closeOnEscape = true,
	closeOnOverlay = true,
	className = '',
}) => {
	const [mounted, setMounted] = useState(false);
	const variantConfig = getVariantConfig(colorVariant);
	const variantInfo = variantConfig[variant];
	const IconComponent = variantInfo.icon;

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!isOpen || !closeOnEscape) return;

		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen, closeOnEscape, onClose]);

	if (!mounted) return null;

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget && closeOnOverlay) {
			onClose();
		}
	};

	const dialogContent = (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2 }}
					className="flex fixed inset-0 justify-center items-center p-4 z-9999 bg-black/50"
					onClick={handleOverlayClick}>
					<motion.div
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className={`
							relative w-full ${sizeClasses[size]}
							bg-background rounded-2xl shadow-xl
							border-2 ${variantInfo.borderColor}
							${className}
						`}>
						{/* Header */}
						{(title || showCloseButton) && (
							<div className="relative flex justify-center items-center p-6 border-b border-border">
								<div className="flex items-center space-x-3">
									{IconComponent && (
										<IconComponent
											className={`w-6 h-6 ${variantInfo.iconColor}`}
										/>
									)}
									{title && (
										<h2 className="text-xl font-semibold text-foreground">
											{title}
										</h2>
									)}
								</div>
								{showCloseButton && (
									<button
										onClick={onClose}
										className="absolute p-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground neu-raised end-4">
										<X className="w-5 h-5" />
									</button>
								)}
							</div>
						)}

						{/* Content */}
						{children && <div className="p-6">{children}</div>}

						{/* Footer */}
						{footer && (
							<div className="px-6 py-4 border-t border-border">{footer}</div>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);

	return createPortal(dialogContent, document.body);
};

// 편의 함수들
export const DialogHeader: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({ children, className = '' }) => (
	<div className={`mb-4 ${className}`}>{children}</div>
);

export const DialogTitle: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({ children, className = '' }) => (
	<h3 className={`text-lg font-medium text-foreground ${className}`}>
		{children}
	</h3>
);

export const DialogDescription: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({ children, className = '' }) => (
	<p className={`mt-2 text-sm text-muted-foreground ${className}`}>
		{children}
	</p>
);

export const DialogFooter: React.FC<{
	children: React.ReactNode;
	className?: string;
}> = ({ children, className = '' }) => {
	const { isRTL } = useLocale();
	
	return (
		<div className={`flex space-x-3 ${isRTL ? 'justify-start' : 'justify-end'} ${className}`}>
			{children}
		</div>
	);
};
