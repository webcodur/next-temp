'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CarouselProps {
	images: string[];
	autoPlayInterval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
	images,
	autoPlayInterval = 3000,
}) => {
	const [index, setIndex] = useState<number>(0);

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
		<div className="relative w-full overflow-hidden">
			<AnimatePresence>
				<motion.img
					key={images[index]}
					src={images[index]}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.5 }}
					className="object-cover w-full h-auto"
				/>
			</AnimatePresence>
			<button
				onClick={handlePrev}
				className="absolute p-2 text-white transform -translate-y-1/2 bg-gray-800 bg-opacity-50 rounded-full top-1/2 left-2">
				Prev
			</button>
			<button
				onClick={handleNext}
				className="absolute p-2 text-white transform -translate-y-1/2 bg-gray-800 bg-opacity-50 rounded-full top-1/2 right-2">
				Next
			</button>
			<div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-2 left-1/2">
				{images.map((_, idx) => (
					<span
						key={idx}
						className={`w-2 h-2 rounded-full ${
							idx === index ? 'bg-white' : 'bg-gray-400'
						}`}></span>
				))}
			</div>
		</div>
	);
};

export default Carousel;
