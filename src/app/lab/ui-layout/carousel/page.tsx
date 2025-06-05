import React from 'react';
import Carousel from '@/components/ui/carousel/carousel';

const sampleImages = [
  '/images/sample1.jpg',
  '/images/sample2.jpg',
  '/images/sample3.jpg',
];

const CarouselPage: React.FC = () => {
  return (
    <div className="p-8">
      <Carousel images={sampleImages} autoPlayInterval={4000} />
    </div>
  );
};

export default CarouselPage; 