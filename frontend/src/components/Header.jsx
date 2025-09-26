import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Bus-related images from assets
  const slides = [
    {
      id: 1,
      backgroundImage: assets.img1,
      title: 'Real-Time Bus Tracking',
      subtitle: 'Never miss your bus again with live GPS tracking',
      icon: '🚌'
    },
    {
      id: 2,
      backgroundImage: assets.img2,
      title: 'Smart Route Planning',
      subtitle: 'Find the fastest route to your destination',
      icon: '🗺️'
    },
    {
      id: 3,
      backgroundImage: assets.img3,
      title: 'Instant Notifications',
      subtitle: 'Get alerts when your bus is approaching',
      icon: '🔔'
    },
    {
      id: 4,
      backgroundImage: assets.img4,
      title: 'Journey Analytics',
      subtitle: 'Track your travel patterns and optimize commute',
      icon: '📊'
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-[500px] lg:h-[700px] overflow-hidden rounded-b-3xl shadow-2xl">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="min-w-full h-full relative flex items-center justify-center"
          >
            {/* Full Image */}
            <img 
              src={slide.backgroundImage} 
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
              <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-12 h-12 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full"></div>
            </div>

            {/* Content */}
            <div className="text-center text-white z-10 px-6 lg:px-12 relative">
              <div className="text-6xl lg:text-8xl mb-6 animate-bounce">
                {slide.icon}
              </div>
              <h1 className="text-3xl lg:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-lg lg:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>

            {/* Slide Number */}
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white font-semibold z-10">
              {index + 1} / {slides.length}
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 lg:left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 lg:p-4 text-white transition-all duration-300 hover:scale-110"
      >
        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 lg:right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 lg:p-4 text-white transition-all duration-300 hover:scale-110"
      >
        <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Header;
