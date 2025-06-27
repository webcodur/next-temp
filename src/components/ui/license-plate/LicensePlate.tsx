import React from 'react';
import Image from 'next/image';

interface LicensePlateProps {
	plateNumber: string;
	width?: string; // CSS 값: '300px', '100%', '20rem' 등
	variant?: 'flat' | 'volume'; // 평면 또는 볼륨감 효과
}

// #region 상수 및 설정
const PLATE_STYLES = {
	ASPECT_RATIO: '3 / 1', // 세로폭을 더 넉넉하게 조정
	COLORS: {
		background: '#ffffff',
		border: '#000000',
		leftPanel: '#003876', // 파란색 영역
		borderLight: '#e5e5e5',
		borderDark: '#999999',
	},
	FONTS: {
		korean: 'HY헤드라인M, Arial Black, Arial, sans-serif',
		english: 'Arial Black, Arial, sans-serif',
	},
	EFFECTS: {
		'flat': {
			boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
		},
		'volume': {
			boxShadow: `
				0 4px 12px rgba(0, 0, 0, 0.2),
				inset 0 1px 2px rgba(255, 255, 255, 0.9),
				inset 0 -1px 2px rgba(0, 0, 0, 0.08),
				inset 1px 0 2px rgba(255, 255, 255, 0.7),
				inset -1px 0 2px rgba(0, 0, 0, 0.05)
			`,
		},
	}
};
// #endregion

const LicensePlate: React.FC<LicensePlateProps> = ({
	plateNumber,
	width = '12rem', // 기본값: 192px 상당
	variant = 'volume', // 기본값: 볼륨감 효과
}) => {
	// #region 번호판 번호 파싱 (123가4568 -> 분리)
	const parseNumber = (number: string) => {
		const match = number.match(/^(\d{2,3})([가-힣])(\d{4})$/);
		return match 
			? { prefix: match[1], character: match[2], suffix: match[3] }
			: { prefix: '', character: '', suffix: number };
	};
	
	const { prefix, character, suffix } = parseNumber(plateNumber);
	// #endregion

	// #region 동적 스타일 계산 (width 기준)
	// 🎯 성공 보장 로직: 번호판 3:1 비율을 활용한 완벽한 영역 분할
	
	const containerWrapperStyle: React.CSSProperties = {
		width, // 외부에서 지정한 width 직접 적용 (기존 전제 유지)
		perspective: '1200px', // 3D 원근감을 위한 컨테이너
		display: 'inline-block',
	};

	const containerStyle = {
		width: '100%',
		// 볼륨감 있는 배경 그라데이션
		background: `
			linear-gradient(145deg, 
				#ffffff 0%, 
				#f8f8f8 25%, 
				#ffffff 50%, 
				#f5f5f5 75%, 
				#f0f0f0 100%
			)
		`,
		// 다중 테두리로 두께감 연출
		border: '0.1em solid #2b2929',
		outline: '0.05em solid #666666',
		outlineOffset: '0.05em',
		aspectRatio: PLATE_STYLES.ASPECT_RATIO,
		borderRadius: '0.3em',
		fontSize: 'calc(var(--plate-width, 12rem) * 0.15)',
		fontFamily: PLATE_STYLES.FONTS.korean,
		fontWeight: 900,
		color: PLATE_STYLES.COLORS.border,
		display: 'flex',
		position: 'relative',
		justifyContent: 'center',
		alignItems: 'center',
		letterSpacing: '0.02em',
		// 3D 효과 적용
		...PLATE_STYLES.EFFECTS[variant],
		transition: 'all 0.3s ease-out',
		transformStyle: 'preserve-3d',
		// 추가 볼륨감을 위한 텍스처
		backgroundImage: `
			radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8) 0%, transparent 50%),
			radial-gradient(circle at 80% 80%, rgba(0,0,0,0.05) 0%, transparent 50%)
		`,
	} as React.CSSProperties;

	// 🎯 완전한 로직: 번호판 aspect-ratio 3:1을 기반으로 한 수학적 계산
	// 이미지는 번호판 높이와 동일한 정사각형 영역 = 전체 너비의 1/3
	const imageContainerWidth = `calc(100% / 3)`; // 수학적으로 완벽한 1:1 정사각형
	
	const leftPanelStyle: React.CSSProperties = {
		position: 'absolute',
		top: 0, // 테두리에 완전히 맞춤
		bottom: 0,
		left: 0,
		width: imageContainerWidth, // 높이와 동일한 정사각형 영역
		borderRadius: '0.3em 0 0 0.3em', // 부모와 동일한 라운드
		overflow: 'hidden',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center', // 이미지를 영역 내 중앙 배치
	};

	// 🎯 텍스트 영역: 수학적으로 정확한 나머지 2/3 영역의 완전한 중앙
	const numberStyle: React.CSSProperties = {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: imageContainerWidth, // 1/3 제외한 나머지 2/3 영역
		display: 'flex',
		gap: '0.08em', // 자간 증가
		justifyContent: 'center', // 2/3 영역의 수학적 중앙
		alignItems: 'center',
		fontWeight: 900,
		transform: 'scaleX(0.85)',
		letterSpacing: '0.08em', // 자간 증가
		fontSize: '1em',
		lineHeight: 1,
		padding: 0, // 완전한 중앙 배치를 위해 패딩 제거
		// 텍스트도 볼륨감 있게
		textShadow: variant === 'volume' 
			? `
				1px 1px 2px rgba(0, 0, 0, 0.3),
				0 0 1px rgba(0, 0, 0, 0.5),
				-0.5px -0.5px 1px rgba(255, 255, 255, 0.8)
			`
			: '1px 1px 2px rgba(0, 0, 0, 0.1)',
	};

	// 숫자/문자별 미세 조정
	const numberSpanStyle: React.CSSProperties = {
		fontFamily: PLATE_STYLES.FONTS.korean,
		fontWeight: 900,
		lineHeight: 1,
		filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.2))',
	};

	const characterSpanStyle: React.CSSProperties = {
		fontFamily: PLATE_STYLES.FONTS.english,
		fontWeight: 900,
		lineHeight: 1,
		margin: '0 0.05em',
		transform: 'translateY(0.05em)',
		filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.2))',
	};
	// #endregion

	return (
		<div style={containerWrapperStyle}>
			<div 
				style={{
					...containerStyle,
					'--plate-width': width,
				} as React.CSSProperties}
				onMouseEnter={(e) => {
					if (variant === 'volume') {
						e.currentTarget.style.transform = 'scale(1.02)';
						e.currentTarget.style.filter = 'brightness(1.05)';
					}
				}}
				onMouseLeave={(e) => {
					if (variant === 'volume') {
						e.currentTarget.style.transform = 'scale(1)';
						e.currentTarget.style.filter = 'brightness(1)';
					}
				}}
			>
								{/* 🎯 왼쪽 이미지 영역: 정사각형 영역에 이미지 전체가 다 보이게 배치 */}
				<div style={leftPanelStyle}>
					<Image
						src="/images/license-plate.png"
						alt="번호판 로고"
						fill
						className="object-contain" // 🔑 핵심: 이미지 전체가 다 보이게
						style={{ 
							objectFit: 'contain', // 이미지 전체 표시 (잘리지 않음)
							objectPosition: 'center', // 정사각형 영역 내 중앙 배치
							filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
						}}
					/>
				</div>

				{/* 번호판 번호 영역 (123가4568) */}
				<div style={numberStyle}>
					{/* 앞자리 숫자 (123) */}
					{prefix && (
						<span style={numberSpanStyle}>
							{prefix}
						</span>
					)}
					
					{/* 한글 (가) */}
					{character && (
						<span style={characterSpanStyle}>
							{character}
						</span>
					)}
					
					{/* 뒷자리 숫자 (4568) */}
					<span style={numberSpanStyle}>
						{suffix}
					</span>
				</div>
			</div>
		</div>
	);
};

export default LicensePlate;
