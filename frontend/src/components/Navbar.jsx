import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-gray-800 hover:text-gray-700 transition-colors">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
            <span className="font-bold text-lg lg:text-xl">BusTrac</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-navy-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/smart-search" className="text-gray-600 hover:text-navy-600 font-medium transition-colors">
              Find Bus
            </Link>
            <Link to="/track" className="text-gray-600 hover:text-navy-600 font-medium transition-colors">
              Track Bus
            </Link>
            <Link to="/routes" className="text-gray-600 hover:text-navy-600 font-medium transition-colors">
              Routes
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-navy-600 font-medium transition-colors">
              About
            </Link>
            <Link 
              to="/login" 
              className="bg-gradient-to-r from-navy-600 to-navy-700 text-white px-6 py-2.5 rounded-full font-semibold hover:from-navy-700 hover:to-navy-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 gap-1"
          >
            <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-4 bg-white">
            <Link to="/" className="block text-gray-600 hover:text-navy-600 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/smart-search" className="block text-gray-600 hover:text-navy-600 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
              Find Bus
            </Link>
            <Link to="/track" className="block text-gray-600 hover:text-navy-600 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
              Track Bus
            </Link>
            <Link to="/routes" className="block text-gray-600 hover:text-navy-600 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
              Routes
            </Link>
            <Link to="/about" className="block text-gray-600 hover:text-navy-600 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link 
              to="/login" 
              className="inline-block bg-gradient-to-r from-navy-600 to-navy-700 text-white px-6 py-2.5 rounded-full font-semibold hover:from-navy-700 hover:to-navy-800 transition-all duration-300 shadow-lg mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
