import React from 'react';
import Carousel from '@/components/ui/carousel/Carousel';

const sampleImages = [
	'/images/2.png',
	'/images/3.png',
	'/images/4.png',
	'/images/5.png',
];

const CarouselPage: React.FC = () => {
	return (
		<div className="p-8">
			<h1 className="mb-6 text-2xl font-bold">Carousel 컴포넌트</h1>
			<div className="mx-auto max-w-3xl">
				<Carousel images={sampleImages} />
			</div>
		</div>
	);
};

export default CarouselPage;
