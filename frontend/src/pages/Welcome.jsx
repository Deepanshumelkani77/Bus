import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, MapPin, Clock, Users, Navigation, ArrowRight, Search, Star, Zap, Shield, Target, Sparkles } from 'lucide-react';

const Welcome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
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
          setTimeout(() => navigate('/smart-search'), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-slate-900/5 to-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-500/8 to-teal-600/12 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/6 to-pink-500/8 rounded-full blur-3xl"></div>
      </div>

      {/* Header - 10vh */}
      <div className="h-[10vh] min-h-[60px] relative z-10 bg-white/80 backdrop-blur-xl shadow-xl border-b border-slate-200/50 px-3 sm:px-4 lg:px-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg sm:rounded-xl blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl shadow-2xl">
                <Bus className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent truncate">BusTrac</h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium hidden sm:block">Next-Gen Transportation</p>
            </div>
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
            <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full border border-emerald-200/50">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-700 font-semibold text-xs sm:text-sm">Live</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-blue-200/50">
              <Zap className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
              <span className="text-blue-700 font-semibold text-xs lg:text-sm">AI Powered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 80vh */}
      <div className="h-[80vh] flex-1 flex items-center justify-center px-3 sm:px-4 lg:px-8 py-2 sm:py-4 lg:py-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 items-center w-full">
            {/* Left Side - Hero Content */}
            <div className={`relative z-10 text-center lg:text-left transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute top-20 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
              
              {/* Main Logo with Enhanced Design */}
              <div className="flex justify-center lg:justify-start mb-3 sm:mb-4 lg:mb-6">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl border border-slate-700/20 group-hover:scale-105 transition-transform duration-500">
                    <Bus className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white drop-shadow-lg" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl sm:rounded-2xl"></div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3 sm:mb-4 lg:mb-6">
                <div className="flex items-center justify-center lg:justify-start space-x-1 sm:space-x-2 mb-2 sm:mb-3">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-amber-500" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 uppercase tracking-wide">Next Generation</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-2 sm:mb-3 lg:mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">Welcome to</span>
                  <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">BusTrac</span>
                </h1>
              </div>
              
              <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-slate-600 mb-4 sm:mb-6 lg:mb-8 leading-relaxed max-w-lg sm:max-w-xl lg:max-w-2xl mx-auto lg:mx-0 font-medium">
                Experience the future of transportation with <span className="text-slate-900 font-bold">AI-powered tracking</span>, real-time GPS precision, and intelligent journey optimization.
              </p>

              {/* Auto-redirect Timer - Enhanced */}
              <div className="relative bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-slate-200/50 mb-4 sm:mb-6 lg:mb-8 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-blue-100/50 rounded-xl sm:rounded-2xl blur-lg"></div>
                <div className="relative flex items-center justify-center lg:justify-start space-x-2 sm:space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg sm:rounded-xl blur-md opacity-30"></div>
                    <div className="relative bg-gradient-to-r from-slate-600 to-slate-700 p-1.5 sm:p-2 lg:p-3 rounded-lg sm:rounded-xl">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-center lg:text-left">
                    <p className="text-slate-700 font-bold text-xs sm:text-sm lg:text-base mb-1">🚀 Auto-launching in</p>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-slate-800 to-slate-900 bg-clip-text text-transparent">
                      {countdown}s
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Get ready for the future!</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
                <button
                  onClick={() => navigate('/smart-search')}
                  className="group relative flex-1 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white font-bold py-2.5 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-500 flex items-center justify-center space-x-2 sm:space-x-3 shadow-xl hover:shadow-slate-900/25 transform hover:scale-[1.02] hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent rounded-lg sm:rounded-xl lg:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 relative z-10" />
                  <span className="text-sm sm:text-base lg:text-lg xl:text-xl relative z-10">Find Buses Now</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="group flex-1 bg-white hover:bg-slate-50 text-slate-900 font-bold py-2.5 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8 rounded-lg sm:rounded-xl lg:rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all duration-300 flex items-center justify-center space-x-2 sm:space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-600 group-hover:text-slate-800 transition-colors" />
                  <span className="text-sm sm:text-base lg:text-lg xl:text-xl">Login Portal</span>
                </button>
              </div>

              {/* Enhanced Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full border border-amber-200/50">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 fill-current" />
                  <span className="text-amber-700 font-semibold">Premium</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-emerald-50 to-green-50 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full border border-emerald-200/50">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-700 font-semibold">Live GPS</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full border border-blue-200/50">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                  <span className="text-blue-700 font-semibold">Secure</span>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Features Grid */}
            <div className={`relative z-10 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              {/* Floating decoration */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-400/10 to-pink-500/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8">
                {/* Enhanced Feature Card 1 */}
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/50 p-4 sm:p-6 lg:p-8 hover:shadow-slate-900/10 transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-start space-x-3 sm:space-x-4 lg:space-x-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl blur-lg opacity-30"></div>
                      <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Real-time GPS Tracking</h3>
                      <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4">Experience precision tracking with live GPS updates every second. Watch buses move in real-time on interactive maps.</p>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-emerald-700 font-semibold">Live Updates</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Feature Card 2 */}
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/50 p-4 sm:p-6 lg:p-8 hover:shadow-slate-900/10 transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-start space-x-3 sm:space-x-4 lg:space-x-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl sm:rounded-2xl blur-lg opacity-30"></div>
                      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">AI-Powered ETA</h3>
                      <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4">Advanced machine learning algorithms analyze traffic patterns and provide ultra-accurate arrival predictions.</p>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                        <span className="text-blue-700 font-semibold">99% Accuracy</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Feature Card 3 */}
                <div className="group relative bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/50 p-4 sm:p-6 lg:p-8 hover:shadow-slate-900/10 transition-all duration-500 transform hover:scale-[1.03] hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-start space-x-3 sm:space-x-4 lg:space-x-6">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl blur-lg opacity-30"></div>
                      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl shadow-lg">
                        <Navigation className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">Smart Route Matching</h3>
                      <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4">Intelligent algorithms find optimal bus routes that perfectly align with your journey preferences.</p>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                        <span className="text-purple-700 font-semibold">Instant Results</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Stats Card */}
                <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-2xl border border-slate-700/20 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
                  <div className="relative">
                    <div className="text-center mb-4 sm:mb-6">
                      <h4 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2">🚀 System Performance</h4>
                      <p className="text-slate-300 text-xs sm:text-sm">Real-time metrics & capabilities</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 text-center">
                      <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm border border-white/10">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">24/7</div>
                        <div className="text-slate-300 text-xs sm:text-sm font-semibold mt-1">Live Tracking</div>
                      </div>
                      <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm border border-white/10">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">100%</div>
                        <div className="text-slate-300 text-xs sm:text-sm font-semibold mt-1">Real-time</div>
                      </div>
                      <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2 sm:p-3 lg:p-4 backdrop-blur-sm border border-white/10">
                        <div className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">AI</div>
                        <div className="text-slate-300 text-xs sm:text-sm font-semibold mt-1">Powered</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - 10vh */}
      <div className="h-[10vh] min-h-[50px] bg-white border-t border-gray-100 px-3 sm:px-4 lg:px-8 flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <p className="text-center text-xs sm:text-sm text-gray-500 leading-relaxed">
            By using BusTrac, you agree to our{' '}
            <span className="text-slate-700 font-semibold cursor-pointer hover:underline transition-colors">Terms of Service</span> and{' '}
            <span className="text-slate-700 font-semibold cursor-pointer hover:underline transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
