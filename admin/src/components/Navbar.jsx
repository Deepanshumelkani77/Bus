import React from 'react'

const Navbar = () => {
  const toggleSidebar = () => {
    window.dispatchEvent(new CustomEvent('admin:toggleSidebar'))
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
      <div className=" w-full mx-auto h-[10vh] px-3 sm:px-4 lg:px-6 flex items-center justify-between">
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
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/>
              </svg>
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight">BusTrac Admin</span>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex items-center gap-2 h-10 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"/></svg>
            <span className="text-sm font-semibold">Search</span>
          </button>
          <button className="relative inline-flex w-10 h-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
          </button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold">A</div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
