import React, { ReactNode, useRef, useEffect, useId } from 'react';
import { useSectionNavigation } from '@/contexts/SectionNavigationContext';

// #region 상수 정의
const STYLES = {
	// 레이아웃 상수
	HEADER_PADDING: "px-6",
	HEADER_BACKGROUND: "ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-counter-6 to-counter-3 text-foreground",
	CONTENT_BACKGROUND: "bg-serial-2",
	PANEL_BASE: "flex overflow-hidden flex-col text-center rounded-sm neu-elevated",
	
	// 포지셔닝 상수
	ABSOLUTE_LEFT_CENTER: "flex absolute left-6 top-1/2 items-center transform -translate-y-1/2",
	ABSOLUTE_RIGHT_CENTER: "flex absolute right-6 top-1/2 items-center transform -translate-y-1/2",
	FLEX_SHRINK_0: "flex-shrink-0",
	
	// 텍스트 스타일 상수
	TITLE_STYLE: "text-base font-bold leading-none",
	SUBTITLE_STYLE: "text-sm font-normal leading-none text-muted-foreground",
	TITLE_WRAPPER: "flex gap-2 items-baseline text-foreground font-multilang",
	TITLE_ELEMENT: "m-0 leading-none truncate",
} as const;
// #endregion

// #region 타입 정의
interface SectionPanelProps {
	title?: string | ReactNode;
	subtitle?: string; // 제목 우측에 표시될 설명
	children: ReactNode;
	headerActions?: ReactNode; // 헤더 우측에 추가 요소
	icon?: ReactNode; // 헤더 좌측 아이콘
	headerHeight?: string; // 헤더 높이 (기본값: h-8)
	titleAlign?: 'left' | 'center' | 'right'; // 타이틀 정렬 (기본값: left)
	contentPadding?: string; // 콘텐츠 패딩 (기본값: p-4)
	level?: number; // 중첩 레벨 (기본값: 0)
	navigationTitle?: string; // 네비게이션용 텍스트 (title이 JSX일 때 사용)
}

interface SectionPanelContentProps {
	children: ReactNode;
	contentPadding?: string; // 콘텐츠 패딩
}
// #endregion

// #region 메인 컴포넌트
export const SectionPanel: React.FC<SectionPanelProps> = ({
	title,
	subtitle,
	children,
	headerActions,
	icon,
	headerHeight = "h-12", // 기본값 설정
	titleAlign = "left", // 기본값 설정
	contentPadding = "p-4", // 기본값 설정
	level = 0, // 기본값 설정
	navigationTitle, // 네비게이션용 제목
}) => {
	const hasHeader = title || headerActions || icon;
	const sectionId = useId();
	const sectionRef = useRef<HTMLDivElement>(null);
	
	// 섹션 네비게이션 컨텍스트 사용 (항상 안전한 값 반환)
	const sectionNav = useSectionNavigation();
	const { registerSection, unregisterSection } = sectionNav;

	// 섹션 등록/해제
	useEffect(() => {
		if (title && sectionRef.current) {
			// navigationTitle이 있으면 우선 사용, 없으면 기존 로직
			const titleText = navigationTitle || (typeof title === 'string' ? title : 'Section');
			registerSection(sectionId, titleText, sectionRef.current, level);
			
			return () => {
				unregisterSection(sectionId);
			};
		}
	}, [sectionId, title, navigationTitle, level, registerSection, unregisterSection]);

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
		<div ref={sectionRef} id={sectionId} className={STYLES.PANEL_BASE}>
			{/* Center 정렬 시 absolute positioning 사용 */}
			{hasHeader && titleAlign === 'center' && (
				<div className={`relative ${STYLES.FLEX_SHRINK_0} ${STYLES.HEADER_PADDING} ${STYLES.HEADER_BACKGROUND} ${headerHeight}`}>
					{/* 왼쪽 영역: 아이콘 (absolute) */}
					{icon && (
						<div className={STYLES.ABSOLUTE_LEFT_CENTER}>
							<span className={STYLES.FLEX_SHRINK_0}>{icon}</span>
						</div>
					)}

					{/* 가운데 영역: 타이틀과 부제목 (전체 너비 중앙) */}
					<div className="flex justify-center items-center w-full h-full">
						<div className={`${STYLES.TITLE_WRAPPER} text-center`}>
							<div className={STYLES.TITLE_STYLE}>
								<h2 className={STYLES.TITLE_ELEMENT}>{title}</h2>
							</div>
							{subtitle && (
								<span className={STYLES.SUBTITLE_STYLE}>
									{subtitle}
								</span>
							)}
						</div>
					</div>

					{/* 오른쪽 영역: 헤더 액션 (absolute) */}
					{headerActions && (
						<div className={STYLES.ABSOLUTE_RIGHT_CENTER}>
							<div className={STYLES.FLEX_SHRINK_0}>
								{headerActions}
							</div>
						</div>
					)}
				</div>
			)}

			{/* Left/Right 정렬 시 기존 flex 방식 사용 */}
			{hasHeader && titleAlign !== 'center' && (
				<div className={`flex ${STYLES.FLEX_SHRINK_0} items-center ${STYLES.HEADER_PADDING} ${STYLES.HEADER_BACKGROUND} ${headerHeight}`}>
					{/* 왼쪽 영역: 아이콘 */}
					{icon && (
						<div className="flex justify-start items-center h-full shrink-0">
							<span className={STYLES.FLEX_SHRINK_0}>{icon}</span>
						</div>
					)}
					{!icon && (
						<div className="flex justify-start items-center w-1 h-full"></div>
					)}

					{/* 가운데 영역: 타이틀과 부제목 */}
					<div className={`flex flex-1 items-center px-2 min-w-0 h-full ${justifyClasses[titleAlign]}`}>
						{title && (
							<div className={`${STYLES.TITLE_WRAPPER} ${textClasses[titleAlign]}`}>
								<div className={STYLES.TITLE_STYLE}>
									{typeof title === 'string' && (
										<h2 className={STYLES.TITLE_ELEMENT}>{title}</h2>
									)}
									{typeof title !== 'string' && title}
								</div>
								{subtitle && (
									<span className={STYLES.SUBTITLE_STYLE}>
										{subtitle}
									</span>
								)}
							</div>
						)}
					</div>

					{/* 오른쪽 영역: 헤더 액션 */}
					{headerActions && (
						<div className="flex justify-end items-center h-full shrink-0">
							<div className={STYLES.FLEX_SHRINK_0}>
								{headerActions}
							</div>
						</div>
					)}
					{!headerActions && (
						<div className="flex justify-end items-center w-1 h-full"></div>
					)}
				</div>
			)}
			<SectionPanelContent contentPadding={contentPadding}>
				{children}
			</SectionPanelContent>
		</div>
	);
};

// 독립적으로 사용할 수 있는 콘텐츠 컴포넌트
export const SectionPanelContent: React.FC<SectionPanelContentProps> = ({
	children,
	contentPadding = "p-4", // 기본값 설정
}) => {
	return (
		<div className={`flex-1 ${STYLES.CONTENT_BACKGROUND} ${contentPadding}`}>
			{children}
		</div>
	);
};
// #endregion 