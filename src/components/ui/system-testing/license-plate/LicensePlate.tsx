import React from 'react';
import { useLocale } from '@/hooks/useI18n';

interface LicensePlateProps {
	plateNumber: string;
	region?: string;
	className?: string;
	width?: string;
}

const LicensePlate: React.FC<LicensePlateProps> = ({
	plateNumber,
	region = '서울',
	className = '',
	width,
}) => {
	const { isRTL } = useLocale();

	return (
		<div
			className={`inline-flex items-baseline justify-center gap-2 ${className}`}
			style={{
				width: width || 'auto',
				direction: isRTL ? 'rtl' : 'ltr',
			}}
		>
			<span className="text-2xl font-black text-foreground font-headline tracking-wider">
				{region}
			</span>
			<span className="text-2xl font-black text-foreground font-headline tracking-widest">
				{plateNumber}
			</span>
		</div>
	);
};

export default LicensePlate;
