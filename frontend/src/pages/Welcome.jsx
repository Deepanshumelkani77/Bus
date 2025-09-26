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
    <div className="h-screen bg-white flex items-center justify-center relative overflow-hidden">
      {/* Decorative background blobs - subtle and clean */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-sky-50 rounded-full -translate-y-20 translate-x-20"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-50 rounded-full translate-y-10 -translate-x-10"></div>
      
      <div className="text-center max-w-lg mx-auto px-6 relative z-10">
        {/* App Name */}
        <div className={`transform transition-all duration-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-slate-900 text-lg font-bold mb-6">BusTracker</h1>
        </div>

        {/* Logo */}
        <div className={`flex justify-center mb-6 transform transition-all duration-600 delay-100 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95'}`}>
          <div className="bg-slate-900 p-6 rounded-full shadow-lg">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-sky-400 rounded-full flex items-center justify-center">
              <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className={`transform transition-all duration-600 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h2 className="text-slate-900 text-2xl font-bold mb-2">Welcome to BusTracker</h2>
          <p className="text-slate-500 mb-5 text-center leading-relaxed">
            Track buses in real-time and never miss your ride. Sign in to continue or create a new account.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className={`mb-6 transform transition-all duration-600 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="bg-slate-50 rounded-2xl p-4 inline-block shadow-sm">
            <p className="text-slate-600 text-sm mb-1">Auto-redirect in</p>
            <div className="text-2xl font-bold text-slate-900">
              {countdown}s
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`space-y-3 w-full transform transition-all duration-600 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-slate-900 text-white py-4 rounded-full font-bold text-base shadow-lg hover:bg-slate-800 transition-colors duration-200"
          >
            Sign In
          </button>
          
          <button className="w-full bg-slate-100 text-slate-900 py-4 rounded-full font-bold text-base shadow-sm hover:bg-slate-200 transition-colors duration-200">
            Create Account
          </button>
        </div>

        {/* Terms */}
        <p className={`text-slate-500 text-sm text-center mt-6 px-4 transform transition-all duration-600 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          By proceeding, you agree to our{' '}
          <span className="text-slate-900 font-bold">Terms of Service</span> and{' '}
          <span className="text-slate-900 font-bold">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Welcome;
