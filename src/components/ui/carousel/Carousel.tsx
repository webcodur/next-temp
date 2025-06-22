'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '@/components/ui/modal/Modal';

export interface CarouselProps {
	images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
	const [index, setIndex] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [dragStartX, setDragStartX] = useState<number>(0);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [isPointerDown, setIsPointerDown] = useState<boolean>(false);

	const handlePrev = () =>
		setIndex((prev) => (prev - 1 + images.length) % images.length);
	const handleNext = () => setIndex((prev) => (prev + 1) % images.length);

	const handleImageClick = () => {
		// 드래그 중이었다면 클릭 무시
		if (isDragging) {
			return;
		}
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsPointerDown(true);
		setDragStartX(e.clientX);
		setIsDragging(false);
	};

	// window 이벤트로 드래그 처리
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isPointerDown) return;

			const currentX = e.clientX;
			const dragDistance = currentX - dragStartX;

			// 10px 이상 움직이면 드래그로 간주
			if (Math.abs(dragDistance) > 10) {
				setIsDragging(true);
			}
		};

		const handleMouseUp = (e: MouseEvent) => {
			if (!isPointerDown) return;

			setIsPointerDown(false);

			if (isDragging) {
				const currentX = e.clientX;
				const dragDistance = currentX - dragStartX;
				const threshold = 50;

				if (Math.abs(dragDistance) > threshold) {
					if (dragDistance > 0) {
						handlePrev();
					} else {
						handleNext();
					}
				}
			}

			// 드래그 상태를 약간 지연 후 리셋 (클릭 이벤트와 충돌 방지)
			setTimeout(() => setIsDragging(false), 50);
		};

		if (isPointerDown) {
			window.addEventListener('mousemove', handleMouseMove);
			window.addEventListener('mouseup', handleMouseUp);
		}

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isPointerDown, dragStartX, isDragging, handlePrev, handleNext]);

	// 이미지가 없으면 빈 div 반환
	if (!images.length)
		return <div className="w-full h-64 bg-gray-200 rounded-md"></div>;

	return (
		<>
			<div className="overflow-hidden relative w-full rounded-lg neu-raised aspect-video">
				<AnimatePresence mode="wait">
					<motion.img
						key={index}
						src={images[index]}
						alt={`슬라이드 이미지 ${index + 1}`}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.5 }}
						className="object-cover w-full h-full cursor-pointer hover:scale-105 select-none"
						onClick={handleImageClick}
						onMouseDown={handleMouseDown}
						style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
					/>
				</AnimatePresence>

				<button
					onClick={handlePrev}
					className="absolute left-2 top-1/2 p-2 text-white bg-gray-800 bg-opacity-50 rounded-full transition-all duration-200 transform -translate-y-1/2 neu-raised hover:bg-opacity-70">
					<ChevronLeft size={24} />
				</button>

				<button
					onClick={handleNext}
					className="absolute right-2 top-1/2 p-2 text-white bg-gray-800 bg-opacity-50 rounded-full transition-all duration-200 transform -translate-y-1/2 neu-raised hover:bg-opacity-70">
					<ChevronRight size={24} />
				</button>

				<div className="flex absolute bottom-4 left-1/2 space-x-2 transform -translate-x-1/2">
					{images.map((_, idx) => (
						<button
							key={idx}
							onClick={() => setIndex(idx)}
							className={`w-3 h-3 rounded-full transition-all duration-200 hover:scale-110 ${
								idx === index ? 'bg-white' : 'bg-gray-400 neu-raised'
							}`}
							aria-label={`슬라이드 ${idx + 1}로 이동`}
						/>
					))}
				</div>
			</div>

			<Modal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				title={`이미지 ${index + 1} / ${images.length}`}
				maxWidth="max-w-5xl">
				<div className="flex justify-center items-center">
					<img
						src={images[index]}
						alt={`원본 이미지 ${index + 1}`}
						className="max-w-full max-h-[70vh] object-contain rounded-lg"
					/>
				</div>
				<div className="flex justify-center mt-4 space-x-4">
					<button
						onClick={handlePrev}
						className="px-4 py-2 bg-gray-200 rounded-lg transition-all duration-200 neu-raised hover:neu-inset"
						disabled={images.length <= 1}>
						<ChevronLeft size={20} className="inline mr-1" />
						이전
					</button>
					<button
						onClick={handleNext}
						className="px-4 py-2 bg-gray-200 rounded-lg transition-all duration-200 neu-raised hover:neu-inset"
						disabled={images.length <= 1}>
						다음
						<ChevronRight size={20} className="inline ml-1" />
					</button>
				</div>
			</Modal>
		</>
	);
};

export default Carousel;
