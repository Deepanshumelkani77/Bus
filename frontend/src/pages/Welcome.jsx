import React from 'react';

const Welcome = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 rounded-3xl shadow-2xl">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-400 to-sky-400 rounded-2xl flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
          Welcome to
        </h1>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
            Bus Tracking
          </span>
        </h2>
        
        <p className="text-xl text-slate-600 mb-12 leading-relaxed">
          Track your buses in real-time, get live updates, and never miss your ride again.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="group bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
            Get Started
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <button className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl border border-slate-200 transform hover:-translate-y-1 transition-all duration-300">
            Learn More
          </button>
        </div>

        {/* Quick Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-lg">
            <div className="bg-green-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Real-time Tracking</h3>
            <p className="text-slate-600 text-sm">Live GPS tracking</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-lg">
            <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Live Updates</h3>
            <p className="text-slate-600 text-sm">Instant notifications</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/50 shadow-lg">
            <div className="bg-teal-100 p-3 rounded-xl w-fit mx-auto mb-4">
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
