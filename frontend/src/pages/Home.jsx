import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeBuses, setActiveBuses] = useState(0);
  const [totalRoutes, setTotalRoutes] = useState(0);
  const [happyUsers, setHappyUsers] = useState(0);

  useEffect(() => {
    // Start animations
    setTimeout(() => setIsVisible(true), 300);

    // Counter animation
    const animateCounter = (target, setter, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    setTimeout(() => {
      animateCounter(24, setActiveBuses);
      animateCounter(85, setTotalRoutes);
      animateCounter(5200, setHappyUsers);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Navbar />
      <Header />
      
      {/* Background Blobs */}
      <div className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 -top-20 -right-20 animate-pulse opacity-60"></div>
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 -bottom-16 -left-16 animate-pulse opacity-50" style={{animationDelay: '1s'}}></div>
      <div className="absolute w-60 h-60 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse opacity-40" style={{animationDelay: '2s'}}></div>

      {/* Hero Section */}
      <section className="relative z-10 px-5 lg:px-20 py-20 lg:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <div className={`text-center lg:text-left transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="flex justify-center lg:justify-start mb-8">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl">
                  <svg className="w-12 h-12 lg:w-14 lg:h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
                  </svg>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Track Your Bus in{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Real-Time
                </span>
              </h1>
              
              <p className="text-lg lg:text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Experience the future of public transportation with intelligent tracking and seamless journey planning.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/track" 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  🚌 Track Bus Now
                </Link>
                <Link 
                  to="/routes" 
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 text-emerald-700 px-8 py-4 rounded-full font-semibold text-lg border border-emerald-200 hover:border-emerald-300 transition-all duration-300"
                >
                  🗺️ View Routes
                </Link>
              </div>
            </div>

            {/* Right Content - Stats & Features */}
            <div className={`transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              
              {/* Live Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-2">{activeBuses}</div>
                  <div className="text-sm text-blue-700">Active Buses</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="text-2xl lg:text-3xl font-bold text-emerald-600 mb-2">{totalRoutes}</div>
                  <div className="text-sm text-emerald-700">Total Routes</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="text-2xl lg:text-3xl font-bold text-amber-600 mb-2">{happyUsers.toLocaleString()}+</div>
                  <div className="text-sm text-amber-700">Happy Users</div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Real-time GPS Tracking</h3>
                      <p className="text-blue-600">Know exactly where your bus is, every second</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Smart Notifications</h3>
                      <p className="text-emerald-600">Get alerts before your bus arrives at your stop</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Route Analytics</h3>
                      <p className="text-amber-600">Optimize your daily commute with data insights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-5 lg:px-20 py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-12 lg:p-16 rounded-3xl border border-blue-200 shadow-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">
                🚌 Your Journey Starts Here
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Join thousands of smart commuters who never miss their bus. Start your intelligent journey today!
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span>Connecting you to your destination</span>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></span>
              </div>
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-full font-semibold text-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 inline-block"
              >
                Get Started Now 🚀
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
