import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
const Navbar = () => {
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('admin:toggleSidebar'))
  }

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-slate-700/60 shadow-sm">
      <div className="w-full mx-auto h-[10vh] px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Left: Menu (mobile) + Logo */}
        <div className="flex items-center gap-3">
          

 <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300 border border-slate-700/50">
              <svg className="w-6 h-6 lg:w-7 lg:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg lg:text-xl text-white group-hover:text-slate-200 transition-all duration-300">
                BusTrac Admin
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:block">Smart Transportation</span>
            </div>
          </Link>

          
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Profile"
            aria-label="Profile"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700/60 hover:bg-slate-700/70 hover:border-slate-600 transition-colors"
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 2.239-7 5v1a1 1 0 001 1h12a1 1 0 001-1v-1c0-2.761-3.134-5-7-5z" />
            </svg>
          </button>

<button
            type="button"
            onClick={toggleSidebar}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

        </div>



      </div>
    </header>
  )
}

export default Navbar
