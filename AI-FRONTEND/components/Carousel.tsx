"use client"
import Image from 'next/image';
import "./carousel.css"
import React, { useState, useEffect } from 'react';

interface CarouselProps {
  images: string[],
  autoSlideInterval?: number,
  className?:string;
}

const Carousel: React.FC<CarouselProps> = ({ className,images,autoSlideInterval = 3000 }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoSlideInterval);

    return () => {
      clearInterval(timer);
    };
  }, [images, autoSlideInterval]);

  return (
    <div className={`carousel ${className}`}>
      <div className='container-image'>
      <Image width={1980} height={1080} src={images[currentImageIndex]} alt={`Image ${currentImageIndex + 1}`}className="image "/>
      </div>
      <div className='container-button'>
        <button onClick={prevImage} className="button"></button>
        <button onClick={nextImage} className="button"></button>
      </div>
    </div>
  );
};

export default Carousel;
