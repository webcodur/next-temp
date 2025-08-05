import React, { ReactNode } from 'react';

// #region 타입 정의
interface SectionPanelProps {
	title?: string | ReactNode;
	children: ReactNode;
	headerActions?: ReactNode; // 헤더 우측에 추가 요소
	icon?: ReactNode; // 헤더 좌측 아이콘
	headerHeight?: string; // 헤더 높이 (기본값: h-8)
	titleAlign?: 'left' | 'center' | 'right'; // 타이틀 정렬 (기본값: left)
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
	headerHeight = "h-8", // 기본값 설정
	titleAlign = "left", // 기본값 설정
}) => {
	const hasHeader = title || headerActions || icon;

	// 타이틀 정렬 클래스 매핑
	const justifyClasses = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end'
	};

	const textClasses = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right'
	};

	return (
		<div className="flex overflow-hidden flex-col text-center rounded-sm neu-elevated">
      {hasHeader && (
				titleAlign === 'center' ? (
					// Center 정렬 시 absolute positioning 사용
					<div className={`relative flex-shrink-0 px-4 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-serial-6 to-serial-3 text-foreground ${headerHeight}`}>
						{/* 왼쪽 영역: 아이콘 (absolute) */}
						{icon && (
							<div className={`absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center`}>
								<span className="flex-shrink-0">{icon}</span>
							</div>
						)}

						{/* 가운데 영역: 타이틀 (전체 너비 중앙) */}
						{title && (
							<div className="w-full h-full flex items-center justify-center">
								<div className="text-base font-bold text-center text-foreground font-multilang leading-none">
									{typeof title === 'string' ? (
										<h2 className="truncate m-0 leading-none">{title}</h2>
									) : (
										title
									)}
								</div>
							</div>
						)}

						{/* 오른쪽 영역: 헤더 액션 (absolute) */}
						{headerActions && (
							<div className={`absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center`}>
								<div className="flex-shrink-0">
									{headerActions}
								</div>
							</div>
						)}
					</div>
				) : (
					// Left/Right 정렬 시 기존 flex 방식 사용
					<div className={`flex flex-shrink-0 items-center px-4 ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-serial-6 to-serial-3 text-foreground ${headerHeight}`}>
						{/* 왼쪽 영역: 아이콘 */}
						<div className={`flex justify-start items-center h-full ${icon ? 'shrink-0' : 'w-1'}`}>
							{icon && <span className="flex-shrink-0">{icon}</span>}
						</div>

						{/* 가운데 영역: 타이틀 */}
						<div className={`flex flex-1 items-center px-2 min-w-0 h-full ${justifyClasses[titleAlign]}`}>
							{title && (
								<div className={`w-full text-base font-bold ${textClasses[titleAlign]} text-foreground font-multilang leading-none`}>
									{typeof title === 'string' ? (
										<h2 className="truncate m-0 leading-none">{title}</h2>
									) : (
										title
									)}
								</div>
							)}
						</div>

						{/* 오른쪽 영역: 헤더 액션 */}
						<div className={`flex justify-end items-center h-full ${headerActions ? 'shrink-0' : 'w-1'}`}>
							{headerActions && (
								<div className="flex-shrink-0">
									{headerActions}
								</div>
							)}
						</div>
					</div>
				)
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