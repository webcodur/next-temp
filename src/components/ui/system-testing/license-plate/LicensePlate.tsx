import React from 'react';
import Image from 'next/image';
import { useLocale } from '@/hooks/useI18n';

interface LicensePlateProps {
	plateNumber: string;
	region?: string;
	country?: 'KR' | 'US' | 'UAE';
	className?: string;
	width?: string;
}

const LicensePlate: React.FC<LicensePlateProps> = ({
	plateNumber,
	region = '서울',
	country = 'KR',
	className = '',
	width,
}) => {
	const { isRTL } = useLocale();

	// 국가별 스타일 설정
	const getCountryStyle = () => {
		const baseColors = {
			KR: {
				startPanel: 'hsl(var(--primary))', // 파란색 영역
				endPanel: 'hsl(var(--background))', // 흰색 영역
			},
			US: {
				startPanel: 'hsl(var(--secondary))',
				endPanel: 'hsl(var(--background))',
			},
			UAE: {
				startPanel: 'hsl(var(--accent))',
				endPanel: 'hsl(var(--background))',
			},
		};
		return baseColors[country];
	};

	const colors = getCountryStyle();
	const imageWidth = 60;

	// 텍스트 길이에 따른 동적 너비 계산
	const getPlateWidth = () => {
		const baseWidth = 180;
		const charWidth = 16;
		const textLength = plateNumber.length + region.length;
		return Math.max(baseWidth, textLength * charWidth + imageWidth + 40);
	};

	// width prop이 있으면 우선 사용, 없으면 자동 계산
	const plateWidth = width ? parseInt(width.replace('px', '')) : getPlateWidth();

	// RTL에 따른 패널 스타일
	const getStartPanelStyle = (): React.CSSProperties => ({
		background: colors.startPanel,
		width: `${imageWidth}px`,
		height: '100%',
		position: 'absolute',
		top: 0,
		[isRTL ? 'right' : 'left']: '-1px', // 미세하게 확장
		borderRadius: isRTL ? '0 12px 12px 0' : '12px 0 0 12px',
	});

	const getEndPanelStyle = (): React.CSSProperties => ({
		background: colors.endPanel,
		height: '100%',
		position: 'absolute',
		top: 0,
		[isRTL ? 'left' : 'right']: 0,
		[isRTL ? 'right' : 'left']: imageWidth, // 이미지 영역 다음부터 시작
		borderRadius: isRTL ? '12px 0 0 12px' : '0 12px 12px 0',
	});

	const getImageStyle = (): React.CSSProperties => ({
		width: `${imageWidth}px`,
		height: '100%',
		objectFit: 'cover',
		objectPosition: isRTL ? 'right center' : 'left center', // RTL에 따른 이미지 위치
	});

	const getTextContainerStyle = (): React.CSSProperties => ({
		position: 'absolute',
		top: 0,
		height: '100%',
		[isRTL ? 'right' : 'left']: `${imageWidth}px`,
		[isRTL ? 'left' : 'right']: 0,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		padding: '0 16px',
	});

	return (
		<div
			className={`overflow-hidden relative transition-all duration-200 hover:shadow-lg ${className}`}
			style={{
				width: `${plateWidth}px`,
				height: '60px',
				borderRadius: '12px',
				border: '2px solid hsl(var(--border))',
				background: 'linear-gradient(145deg, hsl(var(--background)), hsl(var(--muted)/0.3))',
				boxShadow: '4px 4px 8px hsl(var(--shadow)), -2px -2px 4px hsl(var(--highlight))',
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.filter = 'brightness(1.05)';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.filter = 'brightness(1)';
			}}
		>
			{/* 시작 패널 (이미지 영역) */}
			<div style={getStartPanelStyle()}>
				<Image
					src="/images/license-plate.png"
					alt="License Plate"
					width={imageWidth}
					height={60}
					style={getImageStyle()}
				/>
			</div>

			{/* 끝 패널 (텍스트 영역) */}
			<div style={getEndPanelStyle()}>
				<div style={getTextContainerStyle()}>
					<div
						className="text-xs font-medium text-muted-foreground font-multilang"
						style={{ textAlign: 'center' }}
					>
						{region}
					</div>
					<div
						className="text-lg font-bold text-foreground font-multilang"
						style={{ textAlign: 'center', letterSpacing: '1px' }}
					>
						{plateNumber}
					</div>
				</div>
			</div>
		</div>
	);
};

export default LicensePlate;
