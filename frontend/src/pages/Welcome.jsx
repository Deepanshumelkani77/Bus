import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    // Start animations
    setTimeout(() => setIsVisible(true), 300);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use setTimeout to avoid setState during render
          setTimeout(() => navigate('/login'), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden">
      {/* Hero Section - Dark Navy with Blobs */}
      <div className="relative bg-slate-900 flex-1 flex items-center justify-center px-5 lg:px-20 overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute w-50 h-50 rounded-full bg-sky-400/20 -top-12 -right-8 animate-pulse lg:w-80 lg:h-80 lg:-top-20 lg:-right-20" style={{width: '200px', height: '200px'}}></div>
        <div className="absolute w-35 h-35 rounded-full bg-teal-400/18 -bottom-8 -left-5 animate-pulse lg:w-60 lg:h-60 lg:-bottom-16 lg:-left-16" style={{width: '140px', height: '140px', animationDelay: '1s'}}></div>
        
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Hero Content - Left Side on Desktop */}
            <div className={`text-center lg:text-left relative z-10 transform transition-all duration-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <h1 className="text-white/90 text-lg lg:text-xl font-bold tracking-wide mb-4 lg:mb-6">BusTrac</h1>
              
              {/* Logo - Centered on Mobile, Left on Desktop */}
              <div className="flex justify-center lg:justify-start mb-4 lg:mb-6">
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-teal-400 to-sky-400 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-14 h-14 lg:w-18 lg:h-18 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                  </svg>
                </div>
              </div>
              
              <h2 className="text-white text-3xl lg:text-5xl font-bold mb-2 lg:mb-4">Welcome to BusTracker</h2>
              <p className="text-white/80 text-base lg:text-lg leading-relaxed max-w-md lg:max-w-lg mx-auto lg:mx-0">
                Experience the future of public transportation with intelligent tracking and seamless journey planning.
              </p>
              
              {/* Countdown Timer - Desktop Only in Hero */}
              <div className="hidden lg:block mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 inline-block border border-white/20">
                  <p className="text-white/70 text-sm mb-1">Auto-redirect in</p>
                  <div className="text-2xl font-bold text-white">
                    {countdown}s
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section - Right Side on Desktop */}
            <div className={`relative z-10 transform transition-all duration-600 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {/* Mobile Countdown Timer */}
              <div className="lg:hidden text-center mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 inline-block border border-white/20">
                  <p className="text-white/70 text-sm mb-1">Auto-redirect in</p>
                  <div className="text-2xl font-bold text-white">
                    {countdown}s
                  </div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="space-y-3 lg:space-y-4">
                <div className="bg-white/10 backdrop-blur-sm p-4 lg:p-5 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-teal-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-sm lg:text-base">Real-time GPS Tracking</h3>
                      <p className="text-white/70 text-xs lg:text-sm">Know exactly where your bus is</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 lg:p-5 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-sky-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-sm lg:text-base">Smart Notifications</h3>
                      <p className="text-white/70 text-xs lg:text-sm">Get alerts before your bus arrives</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm p-4 lg:p-5 rounded-2xl border border-white/20">
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-white text-sm lg:text-base">Route Analytics</h3>
                      <p className="text-white/70 text-xs lg:text-sm">Optimize your daily commute</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivational Text */}
              <div className="bg-white/5 backdrop-blur-sm p-4 lg:p-6 rounded-2xl border border-white/10 mt-4 lg:mt-6">
                <h3 className="text-white font-bold text-base lg:text-lg mb-2">🚌 Your Journey Starts Here</h3>
                <p className="text-white/70 text-sm lg:text-base leading-relaxed mb-4">
                  Intelligent tracking, predictive analytics, and seamless journey planning.
                </p>
                
                {/* Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <button
                    onClick={() => navigate('/smart-search')}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-600 hover:to-sky-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Find Bus Now
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl border border-white/20 transition-all duration-300"
                  >
                    Login ({countdown}s)
                  </button>
                </div>
                
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs lg:text-sm text-white/60">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
                  <span>Connecting you to your destination</span>
                  <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms - Fixed at Bottom */}
      <div className="bg-slate-900 px-5 lg:px-20 py-4 border-t border-white/10">
        <p className="text-white/60 text-xs lg:text-sm text-center max-w-4xl mx-auto">
          By proceeding, you agree to our{' '}
          <span className="text-white font-bold">Terms of Service</span> and{' '}
          <span className="text-white font-bold">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
