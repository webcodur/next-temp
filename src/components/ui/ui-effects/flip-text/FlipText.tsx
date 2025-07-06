'use client';

import { AnimatePresence, motion, Variants, MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ElementType } from 'react';
import React from 'react';

export interface FlipTextProps extends MotionProps {
	/** 애니메이션 지속 시간 */
	duration?: number;
	/** 각 문자 간 지연 시간 배수 */
	delayMultiple?: number;
	/** 컴포넌트 클래스 이름 */
	className?: string;
	/** 컴포넌트 요소 타입 */
	as?: ElementType;
	/** 자식 요소 */
	children: React.ReactNode;
	/** 애니메이션 변형 */
	variants?: Variants;
}

const defaultVariants: Variants = {
	hidden: { rotateX: -90, opacity: 0 },
	visible: { rotateX: 0, opacity: 1 },
};

export function FlipText({
	children,
	duration = 0.5,
	delayMultiple = 0.08,
	className,
	as: Component = 'span',
	variants,
	...props
}: FlipTextProps) {
	const MotionComponent = motion(Component);
	const characters = React.Children.toArray(children).join('').split('');

	return (
		<div className="flex justify-center space-x-1">
			<AnimatePresence mode="wait">
				{characters.map((char, i) => (
					<MotionComponent
						key={i}
						initial="hidden"
						animate="visible"
						exit="hidden"
						variants={variants || defaultVariants}
						transition={{ duration, delay: i * delayMultiple }}
						className={cn(
							'origin-center drop-shadow-sm inline-block text-primary',
							className
						)}
						{...props}>
						{char === ' ' ? '\u00A0' : char}
					</MotionComponent>
				))}
			</AnimatePresence>
		</div>
	);
}
