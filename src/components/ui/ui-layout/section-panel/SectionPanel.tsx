import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

// #region 타입 정의
interface SectionPanelProps {
	title?: string;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
	headerActions?: ReactNode; // 헤더 우측에 추가 요소
	icon?: ReactNode; // 헤더 좌측 아이콘
	colorVariant?: 'primary' | 'secondary';
	headerContent?: ReactNode; // 완전 커스텀 헤더 (title, icon, headerActions 무시)
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
	contentClassName = '',
	headerActions,
	icon,
	colorVariant = 'primary',
	headerContent,
}) => {
	const hasHeader = title || headerActions || icon || headerContent;

	// 색상 variant에 따른 듀얼 그라데이션 스타일 (Primary + Secondary 조합)
	const headerGradientClass = colorVariant === 'primary' 
		? 'bg-gradient-to-r from-primary/90 via-primary/70 to-secondary/60 text-white'
		: 'bg-gradient-to-r from-secondary/90 via-secondary/70 to-primary/60 text-white';

	return (
		<div className={clsx(
			'flex overflow-hidden flex-col rounded-lg neu-flat',
			className
		)}>
			{hasHeader && (
				<div className={clsx(
					'flex flex-shrink-0 items-center',
					// headerContent가 있으면 패딩 제거, 없으면 패딩과 그라데이션 적용
					headerContent ? '' : 'px-4 py-2',
					!headerContent && headerGradientClass,
				)}>
					{headerContent ? (
						// 완전 커스텀 헤더
						headerContent
					) : (
						// 기본 헤더 구조
						<>
							{/* 헤더: 중앙 배치 스타일 */}
							<div className="flex flex-1 justify-center items-center h-8">
								{icon && <span className="flex-shrink-0 mr-2">{icon}</span>}
								{title && (
									<h2 className="text-base font-bold text-white font-multilang">
										{title}
									</h2>
								)}
							</div>
							{headerActions && (
								<div className="flex-shrink-0">
									{headerActions}
								</div>
							)}
						</>
					)}
				</div>
			)}
			<SectionPanelContent className={clsx(
				'bg-surface-2',
				contentClassName
			)}>
				{children}
			</SectionPanelContent>
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