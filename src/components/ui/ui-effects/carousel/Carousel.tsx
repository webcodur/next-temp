'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/hooks/useI18n';
import Image from 'next/image';

// #region 타입
interface CarouselProps {
	items: Array<{
		id: string;
		title: string;
		content: React.ReactNode;
		thumbnail?: string;
	}>;
	autoSlide?: boolean;
	slideInterval?: number;
	showThumbnails?: boolean;
	showDots?: boolean;
	showArrows?: boolean;
	className?: string;
}
// #endregion

const Carousel: React.FC<CarouselProps> = ({
	items,
	autoSlide = false,
	slideInterval = 3000,
	showThumbnails = false,
	showDots = true,
	showArrows = true,
	className = '',
}) => {
	// #region 상태
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(autoSlide);
	// #endregion

	// #region 훅
	const { isRTL } = useLocale();
	// #endregion

	// #region 핸들러
	useEffect(() => {
		if (!isPlaying) return;

		const interval = setInterval(() => {
			setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
		}, slideInterval);

		return () => clearInterval(interval);
	}, [isPlaying, slideInterval, items.length]);

	const goToPrevious = () => {
		setCurrentIndex((prevIndex) => 
			prevIndex === 0 ? items.length - 1 : prevIndex - 1
		);
	};

	const goToNext = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
	};

	const goToSlide = (index: number) => {
		setCurrentIndex(index);
	};

	const toggleAutoPlay = () => {
		setIsPlaying(!isPlaying);
	};
	// #endregion

	// #region 렌더링
	return (
		<div className={`relative w-full max-w-4xl mx-auto neu-flat rounded-lg overflow-hidden ${className}`}>
			{/* 메인 슬라이드 영역 */}
			<div className="relative h-96 overflow-hidden">
				{items.map((item, index) => (
					<div
						key={item.id}
						className={`absolute inset-0 transition-transform duration-500 ${
							index === currentIndex ? 'translate-x-0' : 
							index < currentIndex ? '-translate-x-full' : 'translate-x-full'
						}`}
					>
						{item.content}
					</div>
				))}

				{/* 네비게이션 화살표 */}
				{showArrows && items.length > 1 && (
					<>
						<button
							onClick={goToPrevious}
							className={`absolute ${isRTL ? 'end-2' : 'start-2'} top-1/2 p-2 text-primary-foreground bg-background/50 rounded-full transition-all duration-200 transform -translate-y-1/2 neu-raised hover:bg-background/70`}>
							{isRTL ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
						</button>
						<button
							onClick={goToNext}
							className={`absolute ${isRTL ? 'start-2' : 'end-2'} top-1/2 p-2 text-primary-foreground bg-background/50 rounded-full transition-all duration-200 transform -translate-y-1/2 neu-raised hover:bg-background/70`}>
							{isRTL ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
						</button>
					</>
				)}

				{/* 슬라이드 인디케이터 */}
				{showDots && (
					<div className={`flex absolute bottom-4 ${isRTL ? 'end-1/2' : 'start-1/2'} space-x-2 transform ${isRTL ? 'translate-x-1/2' : '-translate-x-1/2'}`}>
						{items.map((_, index) => (
							<button
								key={index}
								onClick={() => goToSlide(index)}
								className={`w-3 h-3 rounded-full transition-all duration-200 ${
									index === currentIndex
										? 'bg-primary neu-inset'
										: 'bg-background/50 neu-flat hover:bg-background/70'
								}`}
							/>
						))}
					</div>
				)}
			</div>

			{/* 썸네일 영역 */}
			{showThumbnails && (
				<div className="flex p-4 space-x-2 bg-muted/50 overflow-x-auto">
					{items.map((item, index) => (
						<button
							key={item.id}
							onClick={() => goToSlide(index)}
							className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all duration-200 ${
								index === currentIndex
									? 'ring-2 ring-primary neu-inset'
									: 'neu-flat hover:neu-raised'
							}`}
						>
							{item.thumbnail ? (
								<Image
									src={item.thumbnail}
									alt={item.title}
									width={80}
									height={80}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
									{index + 1}
								</div>
							)}
						</button>
					))}
				</div>
			)}

			{/* 컨트롤 바 */}
			<div className="flex items-center justify-between p-4 bg-background border-t border-border">
				<div className="flex items-center space-x-2">
					<button
						onClick={goToPrevious}
						className="flex items-center px-3 py-1 text-sm rounded-md neu-flat hover:neu-raised transition-all duration-200 text-foreground"
					>
						{isRTL ? <ChevronRight size={20} className="inline ms-1" /> : <ChevronLeft size={20} className="inline me-1" />}
						이전
					</button>
					<button
						onClick={goToNext}
						className="flex items-center px-3 py-1 text-sm rounded-md neu-flat hover:neu-raised transition-all duration-200 text-foreground"
					>
						다음
						{isRTL ? <ChevronLeft size={20} className="inline ms-1" /> : <ChevronRight size={20} className="inline ms-1" />}
					</button>
				</div>

				<div className="flex items-center space-x-2">
					<span className="text-sm text-muted-foreground">
						{currentIndex + 1} / {items.length}
					</span>
					<button
						onClick={toggleAutoPlay}
						className="px-3 py-1 text-sm rounded-md neu-flat hover:neu-raised transition-all duration-200 text-foreground"
					>
						{isPlaying ? '정지' : '재생'}
					</button>
				</div>
			</div>
		</div>
	);
	// #endregion
};

export default Carousel;
