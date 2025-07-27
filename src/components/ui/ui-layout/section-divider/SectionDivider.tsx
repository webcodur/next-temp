/* 
  파일명: SectionDivider.tsx
  기능: 섹션 구분선 (중앙 제목 + 양쪽 장식)
  책임: 페이지 섹션을 시각적으로 구분하는 제목 표시
*/

import React from 'react';

// #region 타입 정의
interface SectionDividerProps {
	title: string;
	className?: string;
}
// #endregion

// #region 메인 컴포넌트
const SectionDivider: React.FC<SectionDividerProps> = ({ 
	title, 
	className = "" 
}) => {
	return (
		<div className={`flex gap-3 items-center justify-center ${className}`}>
			<div className="flex-1 border-t border-foreground/10"></div>
			<div className="w-3 h-3 bg-foreground"></div>
			<h2 className="text-xl text-foreground font-multilang">
				{title}
			</h2>
			<div className="w-3 h-3 bg-foreground"></div>
			<div className="flex-1 border-t border-foreground/10"></div>
		</div>
	);
};
// #endregion

export default SectionDivider; 