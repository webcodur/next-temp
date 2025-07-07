'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from '@/hooks/useI18n';
import { type Locale } from '@/lib/i18n';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface LanguageSwitcherProps {
	variant?: 'header' | 'sidebar' | 'inline';
	className?: string;
	hideChevron?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
	variant = 'inline',
	className = '',
	hideChevron = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);
	const { currentLocale, changeLocale, availableLocales, allLocaleMetadata } = useLocale();

	// 외부 클릭 감지
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node) &&
				menuRef.current &&
				!menuRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLanguageChange = (locale: string) => {
		changeLocale(locale as Locale);
		setIsOpen(false);
	};

	const currentMeta = allLocaleMetadata[currentLocale];

	const getVariantStyles = () => {
		switch (variant) {
			case 'header':
				return {
					trigger: 'p-2 hover:bg-muted/50 rounded-md transition-colors',
					dropdown: 'w-16',
				};
			case 'sidebar':
				return {
					trigger: 'p-2 hover:bg-muted/50 rounded-md transition-colors',
					dropdown: 'w-16',
				};
			default: // inline
				return {
					trigger: 'p-2 border border-border hover:bg-muted/50 rounded-md transition-colors',
					dropdown: 'w-16',
				};
		}
	};

	const styles = getVariantStyles();

	return (
		<div className={`relative ${className}`} ref={containerRef}>
			{/* 트리거 버튼 */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`
					flex items-center justify-center neu-flat hover:neu-raised
					${styles.trigger}
				`}
			>
				<div className="relative w-6 h-6">
					<Image
						src={currentMeta.flag}
						alt={currentMeta.name}
						width={24}
						height={24}
						className="w-full h-full rounded-full object-cover"
					/>
				</div>
				{!hideChevron && (
					<ChevronDown
						className={`w-3 h-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					/>
				)}
			</button>

			{/* 드롭다운 메뉴 */}
			{isOpen && typeof window !== 'undefined' && createPortal(
				<div
					ref={menuRef}
					className={
						`fixed z-[9999] mt-2 rounded-lg ring-1 ring-black ring-opacity-5 shadow-lg neu-flat bg-background focus:outline-hidden
						${styles.dropdown}`
					}
					style={{ top: (containerRef.current?.getBoundingClientRect().bottom ?? 0) + 4, left: (containerRef.current?.getBoundingClientRect().left ?? 0) + (containerRef.current?.offsetWidth ?? 0)/2 }}
				>
					<div className="py-1 rounded-lg bg-background">
						{availableLocales.filter(locale => locale !== currentLocale).map((locale) => {
							const meta = allLocaleMetadata[locale];
							return (
								<button
									key={locale}
									onClick={() => handleLanguageChange(locale)}
									className="w-full p-2 hover:bg-muted/50 transition-colors flex items-center justify-center"
								>
									<div className="relative w-8 h-8">
										<Image src={meta.flag} alt={meta.name} width={32} height={32} className="w-full h-full rounded-full object-cover" />
									</div>
								</button>
							);
						})}
					</div>
				</div>,
				document.body
			)}
		</div>
	);
};

export default LanguageSwitcher; 