import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

// #region 타입 정의
interface SectionPanelProps {
	title?: string;
	children: ReactNode;
	className?: string;
	headerClassName?: string;
	contentClassName?: string;
	headerActions?: ReactNode; // 헤더 우측에 추가 요소
	icon?: ReactNode; // 헤더 좌측 아이콘
	colorVariant?: 'primary' | 'secondary';
}

interface SectionPanelHeaderProps {
	children: ReactNode;
	className?: string;
}

interface SectionPanelContentProps {
	children: ReactNode;
	className?: string;
}
// #endregion

// #region 메인 컴포넌트
export const SectionPanel: React.FC<SectionPanelProps> = ({
	title,
	children,
	className = '',
	headerClassName = '',
	contentClassName = '',
	headerActions,
	icon,
	colorVariant = 'primary',
}) => {
	const hasHeader = title || headerActions || icon;

	// 색상 variant에 따른 듀얼 그라데이션 스타일 (Primary + Secondary 조합)
	const headerGradientClass = colorVariant === 'primary' 
		? 'bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/60 text-white'
		: 'bg-gradient-to-r from-secondary/90 via-secondary/70 to-primary/60 text-white';

	return (
		<div className={clsx(
			'flex flex-col neu-flat bg-surface-2',
			className
		)}>
			{hasHeader && (
				<div className={clsx(
					'flex flex-shrink-0 items-center px-4 py-3 rounded-t-lg',
					headerGradientClass,
					headerClassName
				)}>
					{/* 헤더: 중앙 배치 스타일 */}
					<div className="flex flex-1 justify-center items-center h-10">
						{icon && <span className="flex-shrink-0 mr-2">{icon}</span>}
						{title && (
							<h2 className="text-lg font-bold text-white font-multilang">
								{title}
							</h2>
						)}
					</div>
					{headerActions && (
						<div className="flex-shrink-0">
							{headerActions}
						</div>
					)}
				</div>
			)}
			<SectionPanelContent className={clsx(
				hasHeader ? 'rounded-b-lg' : 'rounded-lg',
				contentClassName
			)}>
				{children}
			</SectionPanelContent>
		</div>
	);
};

// 독립적으로 사용할 수 있는 헤더 컴포넌트 (고정 스타일링)
export const SectionPanelHeader: React.FC<SectionPanelHeaderProps> = ({
	children,
	className = '',
}) => {
	return (
		<div className={clsx(
			'flex flex-shrink-0 justify-between items-center px-4 py-3 rounded-t-lg border-b border-border/20',
			className
		)}>
			{children}
		</div>
	);
};

// 독립적으로 사용할 수 있는 콘텐츠 컴포넌트
export const SectionPanelContent: React.FC<SectionPanelContentProps> = ({
	children,
	className = '',
}) => {
	return (
		<div className={clsx(
			'flex-1', // 기본적으로 남은 공간을 모두 차지
			className
		)}>
			{children}
		</div>
	);
};
// #endregion 