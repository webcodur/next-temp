'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ImagePreview, ImageData } from './ImagePreview';
import { Button } from '@/components/ui/ui-input/button/Button';

const ImagePreviewExample = () => {
	const [basicOpen, setBasicOpen] = useState(false);
	const [galleryOpen, setGalleryOpen] = useState(false);
	const [customOpen, setCustomOpen] = useState(false);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);

	// 단일 이미지 데이터
	const singleImage: ImageData[] = [
		{
			src: '/images/2.png',
			alt: '샘플 이미지',
			title: '단일 이미지 예제',
			description: '이것은 단일 이미지 미리보기 예제입니다.',
		},
	];

	// 갤러리 이미지 데이터
	const galleryImages: ImageData[] = [
		{
			src: '/images/2.png',
			alt: '이미지 1',
			title: '첫 번째 이미지',
			description: '아름다운 풍경 사진입니다.',
		},
		{
			src: '/images/3.png',
			alt: '이미지 2',
			title: '두 번째 이미지',
			description: '멋진 건축물 사진입니다.',
		},
		{
			src: '/images/4.png',
			alt: '이미지 3',
			title: '세 번째 이미지',
			description: '도시의 야경 모습입니다.',
		},
		{
			src: '/globe.svg',
			alt: '이미지 4',
			title: '네 번째 이미지',
			description: 'SVG 벡터 이미지 예제입니다.',
		},
	];

	// 커스텀 설정 이미지
	const customImages: ImageData[] = [
		{
			src: '/images/2.png',
			alt: '커스텀 이미지 1',
			title: '확대/축소 없음',
		},
		{
			src: '/images/3.png',
			alt: '커스텀 이미지 2',
			title: '회전 없음',
		},
	];

	const openGalleryAtIndex = (index: number) => {
		setSelectedImageIndex(index);
		setGalleryOpen(true);
	};

	return (
		<div className="p-8 min-h-screen bg-gray-50">
			<div className="mx-auto max-w-4xl">
				{/* 헤더 */}
				<div className="mb-8 text-center">
					<h1 className="mb-4 text-3xl font-bold text-gray-900">
						이미지 미리보기 컴포넌트
					</h1>
					<p className="text-gray-600">
						다양한 설정과 기능을 가진 이미지 미리보기 컴포넌트 예제입니다.
					</p>
				</div>

				<div className="grid gap-8">
					{/* 기본 사용법 */}
					<section className="p-6 bg-white rounded-lg shadow-sm">
						<h2 className="mb-4 text-xl font-semibold">기본 사용법</h2>
						<p className="mb-4 text-gray-600">
							단일 이미지를 미리보기로 표시하는 기본 예제입니다.
						</p>
						<Button onClick={() => setBasicOpen(true)}>
							단일 이미지 보기
						</Button>
					</section>

					{/* 갤러리 모드 */}
					<section className="p-6 bg-white rounded-lg shadow-sm">
						<h2 className="mb-4 text-xl font-semibold">갤러리 모드</h2>
						<p className="mb-4 text-gray-600">
							여러 이미지를 갤러리 형태로 탐색할 수 있습니다. 키보드 화살표로 이동 가능합니다.
						</p>
						
						{/* 썸네일 그리드 */}
						<div className="grid grid-cols-4 gap-4 mb-4">
							{galleryImages.map((image, index) => (
								<button
									key={index}
									onClick={() => openGalleryAtIndex(index)}
									className="overflow-hidden relative rounded-lg border-2 border-gray-200 transition-colors group hover:border-blue-500"
								>
									<Image
										src={image.src}
										alt={image.alt || '이미지'}
										width={200}
										height={96}
										className="object-cover w-full h-24 transition-transform group-hover:scale-105"
									/>
									<div className="flex absolute inset-0 justify-center items-center transition-colors bg-black/0 group-hover:bg-black/20">
										<span className="text-sm font-medium text-white opacity-0 group-hover:opacity-100">
											보기
										</span>
									</div>
								</button>
							))}
						</div>
						
						<Button onClick={() => setGalleryOpen(true)}>
							갤러리 열기
						</Button>
					</section>

					{/* 커스텀 설정 */}
					<section className="p-6 bg-white rounded-lg shadow-sm">
						<h2 className="mb-4 text-xl font-semibold">커스텀 설정</h2>
						<p className="mb-4 text-gray-600">
							확대/축소, 회전, 다운로드 등의 기능을 제한한 예제입니다.
						</p>
						<Button onClick={() => setCustomOpen(true)}>
							제한된 기능으로 보기
						</Button>
					</section>

					{/* 키보드 단축키 안내 */}
					<section className="p-6 bg-white rounded-lg shadow-sm">
						<h2 className="mb-4 text-xl font-semibold">키보드 단축키</h2>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<div className="mb-2 font-medium">네비게이션</div>
								<ul className="space-y-1 text-gray-600">
									<li><kbd className="px-2 py-1 bg-gray-100 rounded">ESC</kbd> - 닫기</li>
									<li><kbd className="px-2 py-1 bg-gray-100 rounded">←</kbd> - 이전 이미지</li>
									<li><kbd className="px-2 py-1 bg-gray-100 rounded">→</kbd> - 다음 이미지</li>
								</ul>
							</div>
							<div>
								<div className="mb-2 font-medium">확대/축소</div>
								<ul className="space-y-1 text-gray-600">
									<li><kbd className="px-2 py-1 bg-gray-100 rounded">+</kbd> - 확대</li>
									<li><kbd className="px-2 py-1 bg-gray-100 rounded">-</kbd> - 축소</li>
									<li><kbd className="px-2 py-1 bg-gray-100 rounded">0</kbd> - 원본 크기</li>
									<li><span className="text-gray-500">마우스 휠</span> - 확대/축소</li>
								</ul>
							</div>
						</div>
					</section>
				</div>
			</div>

			{/* 이미지 미리보기 모달들 */}
			<ImagePreview
				images={singleImage}
				isOpen={basicOpen}
				onClose={() => setBasicOpen(false)}
			/>

			<ImagePreview
				images={galleryImages}
				isOpen={galleryOpen}
				onClose={() => setGalleryOpen(false)}
				initialIndex={selectedImageIndex}
				showThumbnails={true}
			/>

			<ImagePreview
				images={customImages}
				isOpen={customOpen}
				onClose={() => setCustomOpen(false)}
				enableZoom={false}
				enableRotation={false}
				enableDownload={false}
				showThumbnails={false}
			/>
		</div>
	);
};

export default ImagePreviewExample;