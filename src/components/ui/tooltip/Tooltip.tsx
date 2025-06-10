import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

type TooltipContentProps = React.ComponentPropsWithoutRef<
	typeof TooltipPrimitive.Content
> & {
	variant?: 'default' | 'info' | 'warning' | 'error';
	noArrow?: boolean;
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
			children,
			...props
		},
		ref
	) => {
		const variantClasses = {
			default: 'bg-primary text-primary-foreground',
			info: 'bg-blue-500 text-black',
			warning: 'bg-amber-500 text-black',
			error: 'bg-red-500 text-black',
		};

		return (
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
						'z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs',
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
								variant === 'info' && 'fill-blue-500',
								variant === 'warning' && 'fill-amber-500',
								variant === 'error' && 'fill-red-500'
							)}
							width={10}
							height={5}
						/>
					)}
				</motion.div>
			</TooltipPrimitive.Content>
		);
	}
);
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
