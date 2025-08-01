import React, { ReactNode } from 'react';

// #region 타입 정의
interface SectionPanelProps {
	title?: string | ReactNode;
	children: ReactNode;
	headerActions?: ReactNode; // 헤더 우측에 추가 요소
	icon?: ReactNode; // 헤더 좌측 아이콘
}

interface SectionPanelContentProps {
	children: ReactNode;
}
// #endregion

// #region 메인 컴포넌트
export const SectionPanel: React.FC<SectionPanelProps> = ({
	title,
	children,
	headerActions,
	icon,
}) => {
	const hasHeader = title || headerActions || icon;

	return (
		<div className="flex overflow-hidden flex-col rounded-sm neu-elevated">
      {hasHeader && (
			<div className="flex flex-shrink-0 items-center px-4 py-1 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-serial-6 to-serial-3 text-foreground">
					{/* 3분할 레이아웃: 왼쪽(icon) | 가운데(title) | 오른쪽(headerActions) */}
					
					{/* 왼쪽 영역: 아이콘 */}
					<div className={`flex justify-start items-center h-8 ${icon ? 'shrink-0' : 'w-1'}`}>
						{icon && <span className="flex-shrink-0">{icon}</span>}
					</div>

					{/* 가운데 영역: 타이틀 */}
					<div className="flex flex-1 justify-start items-center min-w-0 h-8 px-2">
						{title && (
							<div className="w-full text-base font-bold text-left text-foreground font-multilang">
								{typeof title === 'string' ? (
									<h2 className="truncate">{title}</h2>
								) : (
									title
								)}
							</div>
						)}
					</div>

					{/* 오른쪽 영역: 헤더 액션 */}
					<div className={`flex justify-end items-center h-8 ${headerActions ? 'shrink-0' : 'w-1'}`}>
						{headerActions && (
							<div className="flex-shrink-0">
								{headerActions}
							</div>
              
						)}
					</div>
				</div>
			)}
			<SectionPanelContent>
				{children}
			</SectionPanelContent>
		</div>
	);
};

// 독립적으로 사용할 수 있는 콘텐츠 컴포넌트
export const SectionPanelContent: React.FC<SectionPanelContentProps> = ({
	children,
}) => {
	return (
		<div className="flex-1 bg-serial-2">
			{children}
		</div>
	);
};
// #endregion 