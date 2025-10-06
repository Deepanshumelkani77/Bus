import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen((v) => !v)
    window.addEventListener('admin:toggleSidebar', handler)
    return () => window.removeEventListener('admin:toggleSidebar', handler)
  }, [])

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile slide-in panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#0F172A] shadow-2xl border-r border-slate-800 z-50 transform transition-transform duration-300 lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Sidebar"
      >
        {/* Brand header - dark */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-slate-800 bg-[#0F172A] text-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/>
            </svg>
          </div>
          <div className="font-extrabold tracking-tight">Admin</div>
          <button
            className="ml-auto inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {[
            { label: 'Dashboard',path:'/', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v14m-4 0h8"/></svg>
            ) },
            { label: 'Trips', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
            ) },
            { label: 'Buses',path:'/bus', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 17v2a1 1 0 001 1h1a1 1 0 001-1v-2m8 0v2a1 1 0 001 1h1a1 1 0 001-1v-2M6 17h12M6 13h12M6 9h12"/></svg>
            ) },
            { label: 'Drivers',path:'/driver', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14a4 4 0 10-8 0m8 0v1a4 4 0 01-4 4m0 0a4 4 0 01-4-4v-1m4 5v0"/></svg>
            ) },
            { label: 'Routes', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.382V5a2 2 0 012-2h4m6 0h4a2 2 0 012 2v10.382a2 2 0 01-1.553 1.894L15 20m-6 0V5m6 15V5"/></svg>
            ) },
            { label: 'Settings', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.983 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 12h-2M21.5 12h-2M12 4.5v-2M12 21.5v-2"/></svg>
            ) },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path || '#'}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-slate-800 text-slate-200 group-hover:bg-blue-600 group-hover:text-white">
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.label}</span>
            </Link>
          ))}

          <div className="mt-4 p-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-slate-200">
            <div className="font-extrabold text-sm">Quick Tip</div>
            <div className="text-slate-400 text-xs">Use the mobile menu to navigate quickly on the go.</div>
          </div>
        </nav>
      </aside>

      {/* Desktop fixed sidebar (25% width) */}
      <aside className="hidden lg:flex fixed top-[10vh] left-0 h-[90vh] w-[20%] flex-col border-r border-slate-800 bg-[#0F172A]">
        <div className="h-16 px-8 flex items-center gap-3 border-b border-slate-800 bg-[#0F172A] text-slate-100">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/>
            </svg>
          </div>
          <div className="font-extrabold tracking-tight text-xl">Admin</div>
        </div>

        <nav className="p-3 px-7 space-y-1 overflow-y-auto">
          {[
            { label: 'Dashboard', path: '/' },
            { label: 'Trips' },
            { label: 'Buses', path: '/bus' },
            { label: 'Drivers', path: '/driver' },
            { label: 'Routes' },
            { label: 'Settings' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path || '#'}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-slate-700 transition-all"
            >
              <span className="font-semibold text-xl">{item.label}</span>
            </Link>
          ))}
          <div className="mt-4 p-3 rounded-2xl bg-white/80 border border-slate-700 text-black">
            <div className="font-extrabold text-sm">Reminder</div>
            <div className="text-slate-900 text-xs">Sidebar stays fixed on laptop/desktop.</div>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
