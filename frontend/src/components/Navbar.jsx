import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-teal-600 to-sky-600 p-2 rounded-xl">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-900">BusTracker</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Home
            </a>
            <a href="#track" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Track Bus
            </a>
            <a href="#routes" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Routes
            </a>
            <a href="#about" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              About
            </a>
            
            <Link to="/login" className="bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col gap-4">
              <a href="#home" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                Home
              </a>
              <a href="#track" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                Track Bus
              </a>
              <a href="#routes" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                Routes
              </a>
              <a href="#about" className="text-slate-600 hover:text-slate-900 font-medium py-2">
                About
              </a>
              
              <Link to="/login" className="bg-gradient-to-r from-slate-900 to-slate-700 text-white px-6 py-3 rounded-xl font-semibold mt-4 w-full text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
