import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:pl-72">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content shell */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome / Stats header */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md ring-1 ring-slate-900/5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Overview of trips, buses and drivers</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:shadow-lg transition-all">
                  New Trip
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">
                  Manage Buses
                </button>
              </div>
            </div>
            {/* Quick stats */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Active Trips', value: '24' },
                { label: 'Buses Online', value: '18' },
                { label: 'Avg ETA Refresh', value: '1s' },
                { label: 'Incidents', value: '0' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl bg-white ring-1 ring-slate-900/5 border border-slate-200 p-4">
                  <div className="text-2xl font-extrabold text-slate-900">{s.value}</div>
                  <div className="text-sm text-slate-600">{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Content placeholder cards */}
          <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow ring-1 ring-slate-900/5 min-h-[280px]">
              <h2 className="font-bold text-slate-900 mb-4">Recent Trips</h2>
              <div className="text-slate-600 text-sm">Connect to your backend to list live trips here.</div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow ring-1 ring-slate-900/5 min-h-[280px]">
              <h2 className="font-bold text-slate-900 mb-4">Notifications</h2>
              <div className="text-slate-600 text-sm">No new alerts.</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
