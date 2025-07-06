import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;

type TooltipContentProps = React.ComponentPropsWithoutRef<
	typeof TooltipPrimitive.Content
> & {
	variant?: 'default' | 'primary' | 'info' | 'warning' | 'error';
	noArrow?: boolean;
	container?: HTMLElement | null;
};

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	TooltipContentProps
>(
	(
		{
			className,
			sideOffset = 4,
			variant = 'default',
			noArrow = false,
			container,
			children,
			...props
		},
		ref
	) => {
		const variantClasses = {
			default: 'bg-primary text-primary-foreground',
			primary: 'bg-primary text-primary-foreground',
			info: 'bg-primary text-primary-foreground',
			warning: 'bg-warning text-warning-foreground',
			error: 'bg-destructive text-destructive-foreground',
		};

		return (
			<TooltipPortal container={container}>
				<TooltipPrimitive.Content
					ref={ref}
					sideOffset={sideOffset}
					asChild
					{...props}>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15 }}
						className={cn(
							'z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs max-w-xs',
							'neu-raised',
							variantClasses[variant],
							className
						)}>
						{children}
						{!noArrow && (
							<TooltipPrimitive.Arrow
								className={cn(
									'fill-current',
									variant === 'default' && 'fill-primary',
									variant === 'primary' && 'fill-primary',
									variant === 'info' && 'fill-primary',
									variant === 'warning' && 'fill-warning',
									variant === 'error' && 'fill-destructive'
								)}
								width={10}
								height={5}
							/>
						)}
					</motion.div>
				</TooltipPrimitive.Content>
			</TooltipPortal>
		);
	}
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	TooltipProvider,
	TooltipPortal,
};
