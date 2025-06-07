'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CarouselProps {
	images: string[];
	autoPlayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
	images,
	autoPlayInterval = 3000,
}) => {
	const [index, setIndex] = useState<number>(0);

	// 이미지가 없으면 빈 div 반환
	if (!images.length)
		return <div className="w-full h-64 bg-gray-200 rounded-md"></div>;

	useEffect(() => {
		const timer = setInterval(() => {
			setIndex((prev) => (prev + 1) % images.length);
		}, autoPlayInterval);
		return () => clearInterval(timer);
	}, [images.length, autoPlayInterval]);

	const handlePrev = () =>
		setIndex((prev) => (prev - 1 + images.length) % images.length);
	const handleNext = () => setIndex((prev) => (prev + 1) % images.length);

	return (
		<div className="relative w-full overflow-hidden rounded-lg neu-raised aspect-video">
			<AnimatePresence mode="wait">
				<motion.img
					key={index}
					src={images[index]}
					alt={`슬라이드 이미지 ${index + 1}`}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
					className="object-cover w-full h-full"
				/>
			</AnimatePresence>
			<button
				onClick={handlePrev}
				className="absolute p-2 text-white transform -translate-y-1/2 bg-gray-800 bg-opacity-50 rounded-full neu-raised top-1/2 left-2">
				<ChevronLeft size={24} />
			</button>
			<button
				onClick={handleNext}
				className="absolute p-2 text-white transform -translate-y-1/2 bg-gray-800 bg-opacity-50 rounded-full neu-raised top-1/2 right-2">
				<ChevronRight size={24} />
			</button>
			<div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2">
				{images.map((_, idx) => (
					<button
						key={idx}
						onClick={() => setIndex(idx)}
						className={`w-3 h-3 rounded-full  ${
							idx === index ? 'bg-white' : 'bg-gray-400 neu-raised'
						}`}
						aria-label={`슬라이드 ${idx + 1}로 이동`}
					/>
				))}
			</div>
		</div>
	);
};

export default Carousel;
