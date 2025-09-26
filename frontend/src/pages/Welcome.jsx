import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Start animations
    setTimeout(() => setIsVisible(true), 1000);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-teal-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-sky-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-slate-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="text-center max-w-2xl mx-auto px-6 relative z-10">
        {/* Logo */}
        <div className={`flex justify-center mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'}`}>
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-sky-400 rounded-2xl flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-white animate-bounce" fill="currentColor" viewBox="0 0 24 24" style={{animationDelay: '0.5s'}}>
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 animate-fade-in">
            Welcome to
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent animate-pulse">
              Bus Tracking
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Track your buses in real-time, get live updates, and never miss your ride again.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className={`mb-8 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 shadow-lg inline-block">
            <p className="text-slate-600 mb-2">Redirecting to login in</p>
            <div className="text-3xl font-bold text-teal-600 animate-pulse">
              {countdown}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button 
            onClick={() => navigate('/login')}
            className="group bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 animate-pulse"
          >
            Skip to Login
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button className="bg-white/80 backdrop-blur-sm hover:bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl border border-slate-200/50 transform hover:-translate-y-1 transition-all duration-300">
            Learn More
          </button>
        </div>

        {/* Quick Features */}
        <div className={`mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '1.2s'}}>
            <div className="bg-green-100 p-3 rounded-xl w-fit mx-auto mb-4 animate-pulse">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Real-time Tracking</h3>
            <p className="text-slate-600 text-sm">Live GPS tracking</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '1.4s'}}>
            <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-4 animate-pulse" style={{animationDelay: '0.5s'}}>
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Live Updates</h3>
            <p className="text-slate-600 text-sm">Instant notifications</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-fade-in" style={{animationDelay: '1.6s'}}>
            <div className="bg-teal-100 p-3 rounded-xl w-fit mx-auto mb-4 animate-pulse" style={{animationDelay: '1s'}}>
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Smart Alerts</h3>
            <p className="text-slate-600 text-sm">Never miss your bus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
