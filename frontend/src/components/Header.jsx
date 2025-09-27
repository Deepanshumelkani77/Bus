import React, { useState, useEffect } from "react";
import { assets } from '../assets/assets';

const Header = () => {
  const slides = [
    {
      image: assets.img1,
      title: "Real-Time Bus Tracking",
      subtitle: "Never miss your bus again with live GPS tracking",
      icon: "🚌",
      gradient: "from-blue-600/80 to-purple-600/80"
    },
    {
      image: assets.img2,
      title: "Smart Route Planning",
      subtitle: "Find the fastest route to your destination",
      icon: "🗺️",
      gradient: "from-emerald-600/80 to-teal-600/80"
    },
    {
      image: assets.img3,
      title: "Instant Notifications",
      subtitle: "Get alerts when your bus is approaching",
      icon: "🔔",
      gradient: "from-orange-600/80 to-red-600/80"
    },
    {
      image: assets.img4,
      title: "Journey Analytics",
      subtitle: "Track your travel patterns and optimize commute",
      icon: "📊",
      gradient: "from-indigo-600/80 to-pink-600/80"
    },
    {
      image: assets.img5,
      title: "Comfortable Travel",
      subtitle: "Experience premium comfort in modern buses",
      icon: "✨",
      gradient: "from-green-600/80 to-blue-600/80"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === slides.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // change every 4 seconds

      return () => clearInterval(interval);
    }
  }, [slides.length, isHovered]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div 
      className="relative w-full h-[600px] lg:h-[700px] overflow-hidden shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div key={index} className="absolute inset-0">
          <img
            src={slide.image}
            alt={slide.title}
            className={`w-full h-full object-cover transition-all duration-1000 transform ${
              index === currentIndex 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          />
          
       
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-6 lg:px-12 max-w-4xl">
          {/* Icon with Animation */}
          <div className="text-7xl lg:text-9xl mb-6 animate-bounce">
            {slides[currentIndex].icon}
          </div>
          
          {/* Title with Slide Animation */}
          <h1 className="text-4xl lg:text-7xl font-bold mb-6 leading-tight transform transition-all duration-700 drop-shadow-2xl">
            {slides[currentIndex].title}
          </h1>
          
          {/* Subtitle with Fade Animation */}
          <p className="text-xl lg:text-3xl opacity-95 leading-relaxed transform transition-all duration-700 drop-shadow-lg max-w-3xl mx-auto">
            {slides[currentIndex].subtitle}
          </p>

          {/* Call to Action Button */}
          <div className="mt-8">
            <button className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/30">
              Get Started Now
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-4 text-white transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full p-4 text-white transition-all duration-300 hover:scale-110 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-8 w-full flex justify-center space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex
                ? "w-12 h-4 bg-white shadow-lg"
                : "w-4 h-4 bg-white/50 hover:bg-white/75 hover:scale-110"
            }`}
          ></button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{ width: `${((currentIndex + 1) / slides.length) * 100}%` }}
        ></div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 right-6 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 text-white font-semibold">
        {currentIndex + 1} / {slides.length}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-16 h-16 border-2 border-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/3 right-10 w-12 h-12 border-2 border-white/20 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
    </div>
  );
};

export default Header;
