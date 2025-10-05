import React from 'react'

const Navbar = () => {
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('admin:toggleSidebar'))
  }

  return (
    <header className=" bg-[#0F172A] sticky  top-0 z-40 bg-[#0F172A] border-b border-slate-200/80 shadow-sm">
      <div className="w-full mx-auto h-[10vh] px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Left: Menu (mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 shadow flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/>
              </svg>
            </div>
            <span className="font-extrabold text-white tracking-tight">BusTrac Admin</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">Profile</div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
