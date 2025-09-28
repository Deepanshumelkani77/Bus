import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const [busNumber, setBusNumber] = useState('');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [showBusGroup, setShowBusGroup] = useState(true);
  const [showRouteGroup, setShowRouteGroup] = useState(true);
  const [showDivider, setShowDivider] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Counter animation states
  const [activeBuses, setActiveBuses] = useState(0);
  const [totalRoutes, setTotalRoutes] = useState(0);
  const [districts, setDistricts] = useState(0);
  const [happyUsers, setHappyUsers] = useState(0);

  // Carousel images
  const carouselImages = [
    "https://i.pinimg.com/originals/29/f8/2a/29f82a0f0b9fb2839fd96facf1403a5a.jpg",
    "https://static.theprint.in/wp-content/uploads/2022/08/Delhi-DTC-buses-696x392.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/db/DTC_AC_Bus.jpg"
  ];

  // Animation visibility effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Form field toggle logic
  useEffect(() => {
    if (busNumber.trim() !== '') {
      setShowRouteGroup(false);
      setShowDivider(false);
      setShowBusGroup(true);
    } else if (startPoint.trim() !== '' || endPoint.trim() !== '') {
      setShowBusGroup(false);
      setShowDivider(false);
      setShowRouteGroup(true);
    } else {
      setShowBusGroup(true);
      setShowRouteGroup(true);
      setShowDivider(true);
    }
  }, [busNumber, startPoint, endPoint]);

  // Counter animation effect
  useEffect(() => {
    const animateCounter = (setter, target) => {
      let current = 0;
      const increment = Math.ceil(target / 150);
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(current);
        }
      }, 15);
    };

    const timeout = setTimeout(() => {
      animateCounter(setActiveBuses, 200);
      animateCounter(setTotalRoutes, 200);
      animateCounter(setDistricts, 100);
      animateCounter(setHappyUsers, 200);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', { busNumber, startPoint, endPoint });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
    
      
      {/* Hero Section with Carousel */}
      <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-800/50 to-transparent z-10"></div>
        
        <div className="relative w-full h-full">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 z-20 flex items-center justify-start px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className={`max-w-2xl transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              Smart Bus
              <span className="block bg-gradient-to-r from-teal-400 via-sky-400 to-teal-400 bg-clip-text text-transparent">
                Tracking
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 mb-6 sm:mb-8 font-medium leading-relaxed">
              Experience the future of public transportation with real-time tracking, smart routes, and seamless journey planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/smart-search"
                className="group bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2"
              >
                <span>Find Your Bus</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <button className="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 sm:left-6 lg:left-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md border border-white/30 text-white p-3 sm:p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 sm:right-6 lg:right-8 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-md border border-white/30 text-white p-3 sm:p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 group"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Enhanced Carousel Indicators */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-white shadow-lg' 
                  : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="relative -mt-20 sm:-mt-24 md:-mt-32 z-20">
        {/* Statistics Cards */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-20 lg:mb-24 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="group bg-white/80 backdrop-blur-xl border border-white/20 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/90">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {activeBuses}
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-700">
                  Active Buses
                </div>
              </div>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-xl border border-white/20 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/90">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {totalRoutes}
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-700">
                  Total Routes
                </div>
              </div>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-xl border border-white/20 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/90">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {districts}
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-700">
                  Districts Covered
                </div>
              </div>
            </div>
            
            <div className="group bg-white/80 backdrop-blur-xl border border-white/20 p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:bg-white/90">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 110 5H9V10z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 8a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent mb-1 sm:mb-2">
                  {happyUsers}
                </div>
                <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-700">
                  Happy Users
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Bus Search Form */}
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/90 backdrop-blur-2xl border border-white/30 p-6 sm:p-8 lg:p-12 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500">
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 mb-4">
                🚌 Find Your Bus in{' '}
                <span className="bg-gradient-to-r from-slate-700 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                  Real-Time
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
                Enter your journey details and discover the smartest route with live tracking
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Bus Number Search */}
              {showBusGroup && (
                <div className="space-y-3 sm:space-y-4">
                  <label htmlFor="busNumber" className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-700">
                    <div className="w-6 h-6 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                      </svg>
                    </div>
                    Search by Bus Number
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      id="busNumber"
                      value={busNumber}
                      onChange={(e) => setBusNumber(e.target.value)}
                      placeholder="Enter Bus Number (e.g., 123A, BUS-456)"
                      className="w-full p-4 sm:p-5 pl-12 sm:pl-14 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition-all duration-300 text-base sm:text-lg font-medium bg-white/80 backdrop-blur-sm group-hover:border-slate-300"
                    />
                    <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced OR Divider */}
              {showDivider && (
                <div className="relative flex items-center justify-center py-6 sm:py-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
                  </div>
                  <div className="relative bg-gradient-to-r from-slate-100 to-white px-6 sm:px-8 py-2 sm:py-3 rounded-full border-2 border-slate-200 shadow-lg">
                    <span className="text-sm sm:text-base font-black text-slate-600 tracking-wider">OR</span>
                  </div>
                </div>
              )}

              {/* Enhanced Route Search */}
              {showRouteGroup && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-3 sm:space-y-4">
                    <label htmlFor="startPoint" className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      Starting Point
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="startPoint"
                        value={startPoint}
                        onChange={(e) => setStartPoint(e.target.value)}
                        placeholder="Enter pickup location"
                        className="w-full p-4 sm:p-5 pl-12 sm:pl-14 border-2 border-teal-200 rounded-2xl focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all duration-300 text-base sm:text-lg font-medium bg-teal-50/80 backdrop-blur-sm group-hover:border-teal-300"
                      />
                      <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-teal-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <label htmlFor="endPoint" className="flex items-center gap-2 text-base sm:text-lg font-bold text-slate-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      Destination
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        id="endPoint"
                        value={endPoint}
                        onChange={(e) => setEndPoint(e.target.value)}
                        placeholder="Enter destination"
                        className="w-full p-4 sm:p-5 pl-12 sm:pl-14 border-2 border-sky-200 rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all duration-300 text-base sm:text-lg font-medium bg-sky-50/80 backdrop-blur-sm group-hover:border-sky-300"
                      />
                      <div className="absolute left-4 sm:left-5 top-1/2 transform -translate-y-1/2">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-sky-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Submit Button */}
              <div className="text-center pt-6 sm:pt-8">
                <button
                  type="submit"
                  className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-black text-white bg-gradient-to-r from-slate-700 via-teal-600 to-sky-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-teal-700 to-sky-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-3">
                    🔍 Find My Bus
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </button>
              </div>
            </form>

            {/* Enhanced Map Preview */}
            <div className="mt-8 sm:mt-12 h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 border-2 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center text-slate-500 font-medium relative overflow-hidden group hover:border-blue-400 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <p className="text-lg sm:text-xl font-bold text-slate-600 mb-2">Interactive Map Preview</p>
                <p className="text-sm sm:text-base text-slate-500">Real-time bus locations and routes will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 sm:py-20 lg:py-24 mt-16 sm:mt-20 lg:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                BusTrac?
              </span>
            </h3>
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium">
              Experience the next generation of public transportation with cutting-edge technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group bg-slate-900 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Real-Time Tracking</h4>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Live GPS tracking with accurate arrival times and route updates every second
              </p>
            </div>
            
            <div className="group bg-slate-900 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Smart Routes</h4>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                AI-powered route optimization considering traffic, weather, and passenger demand
              </p>
            </div>
            
            <div className="group bg-slate-900 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-3xl hover:bg-white/15 transition-all duration-500 hover:scale-105">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Mobile First</h4>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Seamless experience across all devices with offline capabilities and push notifications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;