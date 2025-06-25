import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LicensePlateProps {
	plateNumber: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	interactive?: boolean;
	onClick?: () => void;
	className?: string;
	leftImage?: string; // 왼쪽 이미지 URL (선택적, 기본값: license-plate.png)
}

const LicensePlate: React.FC<LicensePlateProps> = ({
	plateNumber,
	size = 'md',
	interactive = false,
	onClick,
	className,
	leftImage,
}) => {
	// 메탈릭 번호판 스타일 (한국 표준)
	const getPlateStyle = () => {
		return 'bg-white text-black';
	};

	// 크기별 스타일 설정 (실제 한국 번호판 비율 4.7:1)
	const getSizeStyle = () => {
		switch (size) {
			case 'sm':
				return 'h-8 text-lg'; // w-auto로 비율 맞춤
			case 'md':
				return 'h-12 text-2xl';
			case 'lg':
				return 'h-16 text-3xl';
			case 'xl':
				return 'h-20 text-4xl';
			default:
				return 'h-12 text-2xl';
		}
	};

	// 번호판 번호 파싱 (123가4568 형태)
	const parseNumber = (number: string) => {
		// 한국 번호판 패턴 매칭
		const match = number.match(/^(\d{2,3})([가-힣])(\d{4})$/);
		if (match) {
			return {
				prefix: match[1],
				character: match[2],
				suffix: match[3],
			};
		}

		// 패턴이 안 맞으면 그대로 반환
		return {
			prefix: '',
			character: '',
			suffix: number,
		};
	};

	const { prefix, character, suffix } = parseNumber(plateNumber);

	return (
		<div
			className={cn(
				'flex relative justify-center items-center font-black tracking-normal',
				interactive && 'cursor-pointer hover:scale-[1.02] transition-transform',
				getPlateStyle(),
				getSizeStyle(),
				className
			)}
			onClick={interactive ? onClick : undefined}
			style={{
				background: '#ffffff',
				border: '6px solid #000000',
				aspectRatio: '4.7 / 1', // 실제 번호판 비율
				borderRadius: '2px',
			}}>
			{/* 왼쪽 이미지 영역 */}
			<div
				className="flex absolute top-0 bottom-0 left-0 items-center"
				style={{ width: '18%' }}>
				<div
					className="flex relative justify-center items-center w-full h-full"
					style={{
						background: '#003876', // 실제 번호판 파란색
						borderTopLeftRadius: '0px',
						borderBottomLeftRadius: '0px',
						borderRight: '4px solid #000000',
					}}>
					{leftImage || '/images/license-plate.png' ? (
						<Image
							src={leftImage || '/images/license-plate.png'}
							alt="번호판 로고"
							fill
							className="object-contain p-1"
						/>
					) : (
						<div className="text-center">
							<div
								className={`text-white font-bold leading-none ${
									size === 'sm'
										? 'text-[6px]'
										: size === 'md'
											? 'text-[7px]'
											: size === 'lg'
												? 'text-[8px]'
												: 'text-[9px]'
								}`}>
								KOR
							</div>
						</div>
					)}
				</div>
			</div>

			{/* 번호판 번호 - 왼쪽 이미지 영역만큼 여백 추가 */}
			<div
				className="flex flex-1 gap-0.5 justify-center items-center font-black"
				style={{
					transform: 'scaleX(0.85)', // 글자 압축
					letterSpacing: '0.02em', // 간격 줄임
					height: '80%', // 글자 크기 증가
					marginLeft: '18%',
					paddingRight: '8px',
					fontSize: 'inherit',
					lineHeight: '1',
				}}>
				{prefix && (
					<span
						className="font-black leading-none"
						style={{
							fontFamily: 'HY헤드라인M, Arial Black, Arial, sans-serif',
						}}>
						{prefix}
					</span>
				)}
				{character && (
					<span
						className="mx-1 font-black leading-none"
						style={{
							fontFamily: 'Arial Black, Arial, sans-serif',
							transform: 'translateY(2px)',
						}}>
						{character}
					</span>
				)}
				<span
					className="font-black leading-none"
					style={{
						fontFamily: 'HY헤드라인M, Arial Black, Arial, sans-serif',
					}}>
					{suffix}
				</span>
			</div>
		</div>
	);
};

export default LicensePlate;
