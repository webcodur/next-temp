import React from 'react';

// #region 3중 화살표 애니메이션 아이콘
/**
 * 차단기 열기용 3중 화살표 아이콘
 * - 3개 화살표 모두 연한 색상으로 항상 표시
 * - 아래→중간→위 순서로 하나씩 밝아지는 애니메이션 (항상 실행)
 */
export const TripleChevronUp: React.FC<{
	className?: string;
	isHovering?: boolean;
}> = ({ className, isHovering = false }) => (
	<svg
		className={className}
		width="20"
		height="20"
		viewBox="0 -2 20 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		{/* 하단 화살표 - 1번째로 밝아짐 */}
		<path
			d="M5 18L10 13L15 18"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${isHovering ? 'opacity-30 animate-[tripleFlow_1.5s_ease-in-out_infinite]' : 'opacity-0 group-hover:opacity-30 group-hover:animate-[tripleFlow_1.5s_ease-in-out_infinite]'}`}
		/>
		{/* 중간 화살표 - 2번째로 밝아짐 (기본 표시) */}
		<path
			d="M5 12L10 7L15 12"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${isHovering ? 'opacity-30 animate-[tripleFlow_1.5s_ease-in-out_infinite_0.25s]' : 'opacity-100 group-hover:opacity-30 group-hover:animate-[tripleFlow_1.5s_ease-in-out_infinite_0.25s]'}`}
		/>
		{/* 상단 화살표 - 3번째로 밝아짐 */}
		<path
			d="M5 6L10 1L15 6"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${isHovering ? 'opacity-30 animate-[tripleFlow_1.5s_ease-in-out_infinite_0.5s]' : 'opacity-0 group-hover:opacity-30 group-hover:animate-[tripleFlow_1.5s_ease-in-out_infinite_0.5s]'}`}
		/>
	</svg>
);

/**
 * 차단기 닫기용 3중 화살표 아이콘
 * - 3개 화살표 모두 연한 색상으로 항상 표시
 * - 위→중간→아래 순서로 하나씩 밝아지는 애니메이션 (항상 실행)
 */
export const TripleChevronDown: React.FC<{
	className?: string;
	isHovering?: boolean;
}> = ({ className, isHovering = false }) => (
	<svg
		className={className}
		width="20"
		height="20"
		viewBox="0 -2 20 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		{/* 상단 화살표 - 1번째로 밝아짐 */}
		<path
			d="M5 2L10 7L15 2"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${isHovering ? 'opacity-30 animate-[tripleFlow_1.5s_ease-in-out_infinite]' : 'opacity-0 group-hover:opacity-30 group-hover:animate-[tripleFlow_1.5s_ease-in-out_infinite]'}`}
		/>
		{/* 중간 화살표 - 2번째로 밝아짐 (기본 표시) */}
		<path
			d="M5 8L10 13L15 8"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${isHovering ? 'opacity-30 animate-[tripleFlow_1.5s_ease-in-out_infinite_0.25s]' : 'opacity-100 group-hover:opacity-30 group-hover:animate-[tripleFlow_1.5s_ease-in-out_infinite_0.25s]'}`}
		/>
		{/* 하단 화살표 - 3번째로 밝아짐 */}
		<path
			d="M5 14L10 19L15 14"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={`${isHovering ? 'opacity-30 animate-[tripleFlow_1.5s_ease-in-out_infinite_0.5s]' : 'opacity-0 group-hover:opacity-30 group-hover:animate-[tripleFlow_1.5s_ease-in-out_infinite_0.5s]'}`}
		/>
	</svg>
);
// #endregion
