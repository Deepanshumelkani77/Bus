import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(10);
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Dark Navy with Blobs */}
      <div className="relative bg-slate-900 pt-20 pb-16 px-5 rounded-b-3xl overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute w-50 h-50 rounded-full bg-sky-400/20 -top-12 -right-8 animate-pulse" style={{width: '200px', height: '200px'}}></div>
        <div className="absolute w-35 h-35 rounded-full bg-teal-400/18 -bottom-8 -left-5 animate-pulse" style={{width: '140px', height: '140px', animationDelay: '1s'}}></div>
        
        {/* Hero Content */}
        <div className={`text-center relative z-10 transform transition-all duration-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-white/90 text-lg font-bold tracking-wide mb-4">BusTracker</h1>
          
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-sky-400 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
          </div>
          
          <h2 className="text-white text-3xl font-bold mb-2">Welcome to BusTracker</h2>
          <p className="text-white/80 text-base leading-relaxed max-w-md mx-auto">
            Experience the future of public transportation with intelligent tracking and seamless journey planning.
          </p>
        </div>
      </div>

      {/* Content Card */}
      <div className="px-5 -mt-8 relative z-20">
        <div className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-600 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {/* Countdown Timer */}
          <div className="text-center mb-6">
            <div className="bg-slate-50 rounded-2xl p-4 inline-block shadow-sm">
              <p className="text-slate-600 text-sm mb-1">Auto-redirect in</p>
              <div className="text-2xl font-bold text-slate-900">
                {countdown}s
              </div>
            </div>
          </div>

          {/* Creative Features Section */}
          <div className="space-y-4">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-gradient-to-r from-teal-50 to-sky-50 p-4 rounded-2xl border border-teal-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900 text-sm">Real-time GPS Tracking</h3>
                    <p className="text-slate-600 text-xs">Know exactly where your bus is</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-2xl border border-sky-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900 text-sm">Smart Notifications</h3>
                    <p className="text-slate-600 text-xs">Get alerts before your bus arrives</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-900 text-sm">Route Analytics</h3>
                    <p className="text-slate-600 text-xs">Optimize your daily commute</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Motivational Text */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="text-slate-900 font-bold text-lg mb-2">🚌 Your Journey Starts Here</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-3">
                Experience the future of public transportation with intelligent tracking, 
                predictive analytics, and seamless journey planning.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
                <span>Connecting you to your destination</span>
                <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <p className="text-slate-500 text-sm text-center mt-6">
            By proceeding, you agree to our{' '}
            <span className="text-slate-900 font-bold">Terms of Service</span> and{' '}
            <span className="text-slate-900 font-bold">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
