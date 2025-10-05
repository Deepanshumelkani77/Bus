import React from 'react'

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay - mobile only */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl border-r border-slate-200 z-50 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:shadow-none`}
        aria-label="Sidebar"
      >
        {/* Brand header */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10z"/>
            </svg>
          </div>
          <div className="font-extrabold tracking-tight">Admin</div>
          <button
            className="ml-auto lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/90 hover:text-white hover:bg-white/10"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {[
            { label: 'Dashboard', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v14m-4 0h8"/></svg>
            ) },
            { label: 'Trips', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18"/></svg>
            ) },
            { label: 'Buses', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 17v2a1 1 0 001 1h1a1 1 0 001-1v-2m8 0v2a1 1 0 001 1h1a1 1 0 001-1v-2M6 17h12M6 13h12M6 9h12"/></svg>
            ) },
            { label: 'Drivers', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14a4 4 0 10-8 0m8 0v1a4 4 0 01-4 4m0 0a4 4 0 01-4-4v-1m4 5v0"/></svg>
            ) },
            { label: 'Routes', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A2 2 0 013 15.382V5a2 2 0 012-2h4m6 0h4a2 2 0 012 2v10.382a2 2 0 01-1.553 1.894L15 20m-6 0V5m6 15V5"/></svg>
            ) },
            { label: 'Settings', icon: (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.983 6.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 12h-2M21.5 12h-2M12 4.5v-2M12 21.5v-2"/></svg>
            ) },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
            >
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 group-hover:text-blue-700">
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.label}</span>
            </a>
          ))}

          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
            <div className="text-slate-900 font-extrabold text-sm">Quick Tip</div>
            <div className="text-slate-600 text-xs">Use the mobile menu to navigate quickly on the go.</div>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
