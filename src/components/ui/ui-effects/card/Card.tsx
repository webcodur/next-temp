import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
	children: ReactNode;
	className?: string;
	variant?: 'flat' | 'raised' | 'inset';
	colorVariant?: 'default' | 'primary' | 'secondary';
	title?: string;
	description?: string;
	actions?: ReactNode;
	hover?: boolean;
	clickable?: boolean;
	onClick?: () => void;
}

interface CardActionsProps {
	children: ReactNode;
	className?: string;
}

const Card: React.FC<CardProps> = ({
	children,
	className = '',
	variant = 'flat',
	colorVariant = 'default',
	title,
	description,
	actions,
	hover = true,
	clickable = false,
	onClick,
}) => {
	const variantClasses = {
		flat: 'neu-flat',
		raised: 'neu-raised',
		inset: 'neu-inset',
	};

	const colorVariantClasses = {
		default: 'bg-background border-border',
		primary: 'bg-primary/5 border-primary/20',
		secondary: 'bg-secondary/5 border-secondary/20',
	};

	const baseClasses = cn(
		'relative p-6 rounded-lg transition-all duration-200 border',
		variantClasses[variant],
		colorVariantClasses[colorVariant],
		hover && 'hover:shadow-lg',
		clickable && 'cursor-pointer hover:neu-raised',
		className
	);

	return (
		<div className={baseClasses} onClick={clickable ? onClick : undefined}>
			{/* 헤더 영역 */}
			{(title || description) && (
				<div className="mb-4">
					{title && (
						<h3 className="text-lg font-semibold text-foreground font-multilang mb-1">
							{title}
						</h3>
					)}
					{description && (
						<p className="text-sm text-muted-foreground font-multilang">
							{description}
						</p>
					)}
				</div>
			)}

			{/* 메인 콘텐츠 */}
			<div>{children}</div>

			{/* 액션 버튼들 */}
			{actions && (
				<div className="absolute top-2 end-2">
					{actions}
				</div>
			)}
		</div>
	);
};

const CardActions: React.FC<CardActionsProps> = ({ children, className = '' }) => {
	return (
		<div className={cn('absolute top-2 end-2 flex space-x-1', className)}>
			{children}
		</div>
	);
};

export { Card, CardActions };
