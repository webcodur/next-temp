'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
	X, 
	ChevronLeft, 
	ChevronRight, 
	ZoomIn, 
	ZoomOut, 
	RotateCw,
	Download,
	Maximize2
} from 'lucide-react';

export interface ImageData {
	src: string;
	alt?: string;
	title?: string;
	description?: string;
}

export interface ImagePreviewProps {
	images: ImageData[];
	isOpen: boolean;
	onClose: () => void;
	initialIndex?: number;
	showThumbnails?: boolean;
	enableZoom?: boolean;
	enableRotation?: boolean;
	enableDownload?: boolean;
	maxZoom?: number;
	minZoom?: number;
	className?: string;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
	images,
	isOpen,
	onClose,
	initialIndex = 0,
	showThumbnails = true,
	enableZoom = true,
	enableRotation = true,
	enableDownload = true,
	maxZoom = 5,
	minZoom = 0.1,
	className = '',
}) => {
	const [mounted, setMounted] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const [zoom, setZoom] = useState(1);
	const [rotation, setRotation] = useState(0);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const imageRef = useRef<HTMLImageElement>(null);

	//#region 확대/축소 함수
	const resetTransform = useCallback(() => {
		setZoom(1);
		setRotation(0);
		setPosition({ x: 0, y: 0 });
	}, []);

	const zoomIn = useCallback(() => {
		if (!enableZoom) return;
		setZoom((prev) => Math.min(prev * 1.5, maxZoom));
	}, [enableZoom, maxZoom]);

	const zoomOut = useCallback(() => {
		if (!enableZoom) return;
		setZoom((prev) => Math.max(prev / 1.5, minZoom));
	}, [enableZoom, minZoom]);
	//#endregion

	//#region 네비게이션 함수
	const goToPrevious = useCallback(() => {
		setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
		resetTransform();
	}, [images.length, resetTransform]);

	const goToNext = useCallback(() => {
		setCurrentIndex((prev) => (prev + 1) % images.length);
		resetTransform();
	}, [images.length, resetTransform]);

	const goToIndex = useCallback((index: number) => {
		setCurrentIndex(index);
		resetTransform();
	}, [resetTransform]);
	//#endregion

	//#region Lifecycle
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (isOpen) {
			setCurrentIndex(initialIndex);
			resetTransform();
		}
	}, [isOpen, initialIndex, resetTransform]);
	//#endregion

	//#region 키보드 이벤트
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			switch (e.key) {
				case 'Escape':
					onClose();
					break;
				case 'ArrowLeft':
					e.preventDefault();
					goToPrevious();
					break;
				case 'ArrowRight':
					e.preventDefault();
					goToNext();
					break;
				case '+':
				case '=':
					e.preventDefault();
					zoomIn();
					break;
				case '-':
					e.preventDefault();
					zoomOut();
					break;
				case '0':
					e.preventDefault();
					resetTransform();
					break;
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, currentIndex, onClose, goToPrevious, goToNext, zoomIn, zoomOut, resetTransform]);
	//#endregion

	//#region 회전 함수
	const rotateImage = useCallback(() => {
		if (!enableRotation) return;
		setRotation((prev) => (prev + 90) % 360);
	}, [enableRotation]);
	//#endregion

	//#region 드래그 함수
	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		if (zoom <= 1) return;
		e.preventDefault();
		setIsDragging(true);
		setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
	}, [zoom, position]);

	const handleMouseMove = useCallback((e: React.MouseEvent) => {
		if (!isDragging || zoom <= 1) return;
		e.preventDefault();
		setPosition({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y,
		});
	}, [isDragging, dragStart, zoom]);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);
	//#endregion

	//#region 휠 이벤트
	const handleWheel = useCallback((e: React.WheelEvent) => {
		if (!enableZoom) return;
		e.preventDefault();
		
		const delta = e.deltaY > 0 ? 0.9 : 1.1;
		setZoom((prev) => {
			const newZoom = prev * delta;
			return Math.max(minZoom, Math.min(maxZoom, newZoom));
		});
	}, [enableZoom, maxZoom, minZoom]);
	//#endregion

	//#region 다운로드 함수
	const downloadImage = useCallback(async () => {
		if (!enableDownload) return;
		
		const currentImage = images[currentIndex];
		try {
			const response = await fetch(currentImage.src);
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = currentImage.title || `image-${currentIndex + 1}.jpg`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Failed to download image:', error);
		}
	}, [enableDownload, images, currentIndex]);
	//#endregion

	if (!mounted || !isOpen || images.length === 0) return null;

	const currentImage = images[currentIndex];

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const previewContent = (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3 }}
				className="flex fixed inset-0 z-50 justify-center items-center bg-black/90"
				onClick={handleOverlayClick}
			>
				{/* 상단 툴바 */}
				<div className="flex absolute top-4 right-4 left-4 z-10 justify-between items-center">
					<div className="flex items-center space-x-2 text-white">
						<span className="text-sm">
							{currentIndex + 1} / {images.length}
						</span>
						{currentImage.title && (
							<span className="text-sm font-medium">{currentImage.title}</span>
						)}
					</div>
					
					<div className="flex items-center space-x-2">
						{enableZoom && (
							<>
								<button
									onClick={zoomOut}
									className="p-2 text-white rounded-lg transition-colors bg-black/50 hover:bg-black/70"
									title="축소 (-)"
								>
									<ZoomOut className="w-5 h-5" />
								</button>
								<span className="text-white text-sm min-w-[3rem] text-center">
									{Math.round(zoom * 100)}%
								</span>
								<button
									onClick={zoomIn}
									className="p-2 text-white rounded-lg transition-colors bg-black/50 hover:bg-black/70"
									title="확대 (+)"
								>
									<ZoomIn className="w-5 h-5" />
								</button>
							</>
						)}
						
						{enableRotation && (
							<button
								onClick={rotateImage}
								className="p-2 text-white rounded-lg transition-colors bg-black/50 hover:bg-black/70"
								title="회전"
							>
								<RotateCw className="w-5 h-5" />
							</button>
						)}
						
						{enableDownload && (
							<button
								onClick={downloadImage}
								className="p-2 text-white rounded-lg transition-colors bg-black/50 hover:bg-black/70"
								title="다운로드"
							>
								<Download className="w-5 h-5" />
							</button>
						)}
						
						<button
							onClick={resetTransform}
							className="p-2 text-white rounded-lg transition-colors bg-black/50 hover:bg-black/70"
							title="원본 크기 (0)"
						>
							<Maximize2 className="w-5 h-5" />
						</button>
						
						<button
							onClick={onClose}
							className="p-2 text-white rounded-lg transition-colors bg-black/50 hover:bg-black/70"
							title="닫기 (ESC)"
						>
							<X className="w-6 h-6" />
						</button>
					</div>
				</div>

				{/* 이미지 컨테이너 */}
				<div 
					className="flex relative flex-1 justify-center items-center p-4"
					onWheel={handleWheel}
				>
					<motion.img
						ref={imageRef}
						key={currentIndex}
						src={currentImage.src}
						alt={currentImage.alt || currentImage.title}
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
						className={`max-w-full max-h-full object-contain select-none ${
							zoom > 1 ? 'cursor-grab' : 'cursor-default'
						} ${isDragging ? 'cursor-grabbing' : ''} ${className}`}
						style={{
							transform: `
								translate(${position.x}px, ${position.y}px) 
								scale(${zoom}) 
								rotate(${rotation}deg)
							`,
							transformOrigin: 'center center',
						}}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						draggable={false}
					/>
				</div>

				{/* 네비게이션 버튼 */}
				{images.length > 1 && (
					<>
						<button
							onClick={goToPrevious}
							className="absolute left-4 top-1/2 p-3 text-white rounded-full transition-colors -translate-y-1/2 bg-black/50 hover:bg-black/70"
							title="이전 이미지 (←)"
						>
							<ChevronLeft className="w-6 h-6" />
						</button>
						
						<button
							onClick={goToNext}
							className="absolute right-4 top-1/2 p-3 text-white rounded-full transition-colors -translate-y-1/2 bg-black/50 hover:bg-black/70"
							title="다음 이미지 (→)"
						>
							<ChevronRight className="w-6 h-6" />
						</button>
					</>
				)}

				{/* 하단 설명 */}
				{currentImage.description && (
					<div className="absolute right-4 left-4 bottom-20 text-center">
						<p className="px-4 py-2 mx-auto max-w-2xl text-sm text-white rounded-lg bg-black/50">
							{currentImage.description}
						</p>
					</div>
				)}

				{/* 썸네일 네비게이션 */}
				{showThumbnails && images.length > 1 && (
					<div className="absolute bottom-4 left-1/2 -translate-x-1/2">
						<div className="flex overflow-x-auto items-center p-2 space-x-2 max-w-xs rounded-lg bg-black/50">
							{images.map((image, index) => (
								<button
									key={index}
									onClick={() => goToIndex(index)}
									className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${
										index === currentIndex
											? 'border-white scale-110'
											: 'border-transparent opacity-70 hover:opacity-100'
									}`}
								>
									<Image
										src={image.src}
										alt={image.alt || `썸네일 ${index + 1}`}
										fill
										className="object-cover"
									/>
								</button>
							))}
						</div>
					</div>
				)}
			</motion.div>
		</AnimatePresence>
	);

	return createPortal(previewContent, document.body);
};