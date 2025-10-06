

import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const Dashboard = () => {
  // State
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTrips, setActiveTrips] = useState([])
  const [buses, setBuses] = useState([])
  const [cities, setCities] = useState([])
  const [lastRefresh, setLastRefresh] = useState(null)

  // Config (update if your backend runs elsewhere)
  const API_BASE = useMemo(() => 'http://localhost:2000', [])

  // Fetch live data
  const fetchData = async () => {
    try {
      setError('')
      const [tripsRes, busesRes, citiesRes] = await Promise.all([
        axios.get(`${API_BASE}/trips/active`),
        axios.get(`${API_BASE}/buses`),
        axios.get(`${API_BASE}/buses/cities`),
      ])
      setActiveTrips(tripsRes?.data?.trips || tripsRes?.data || [])
      setBuses(busesRes?.data?.buses || busesRes?.data || [])
      setCities(citiesRes?.data?.cities || citiesRes?.data || [])
      setLastRefresh(new Date())
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, 5000)
    return () => clearInterval(id)
  }, [])

  // Derived KPIs
  const kpis = useMemo(() => {
    const totalActive = activeTrips.length
    const onlineBuses = new Set(activeTrips.map(t => t?.bus?._id || t?.bus)).size
    const avgEtaRefresh = '1s' // indicative for your real-time system
    const incidents = 0
    return { totalActive, onlineBuses, avgEtaRefresh, incidents }
  }, [activeTrips])

  const orgStats = useMemo(() => {
    const totalBuses = buses?.length || 0
    const activeBuses = buses?.filter(b => b?.status === 'Active')?.length || 0
    const inactiveBuses = buses?.filter(b => b?.status === 'Inactive')?.length || 0
    const assignedDrivers = new Set((buses || []).filter(b => b?.driver).map(b => String(b.driver?._id || b.driver))).size
    const activeDrivers = new Set((activeTrips || []).map(t => String(t?.driver?._id || t?.driver))).size
    const totalCities = cities?.length || 0
    const unassignedBuses = Math.max(0, totalBuses - assignedDrivers)
    const tripsWithLive = (activeTrips || []).filter(t => t?.currentLocation && (t.currentLocation.latitude || t.currentLocation.lat)).length
    const etaValuesSec = (activeTrips || [])
      .map(t => t?.eta?.duration_in_traffic?.value || t?.eta?.duration?.value)
      .filter(Boolean)
    const avgEtaMins = etaValuesSec.length
      ? Math.round((etaValuesSec.reduce((a,b)=>a+b,0) / etaValuesSec.length) / 60)
      : null
    return { totalBuses, activeBuses, inactiveBuses, assignedDrivers, activeDrivers, totalCities, unassignedBuses, tripsWithLive, avgEtaMins }
  }, [buses, activeTrips, cities])

  const recentTrips = useMemo(() => {
    return (activeTrips || []).slice(0, 8).map(t => ({
      bus: t?.bus?.plateNumber || t?.bus?.busNumber || '—',
      route: `${t?.source || '—'} → ${t?.destination || '—'}`,
      status: t?.status || 'Ongoing',
      eta: t?.eta?.duration?.text || '—',
    }))
  }, [activeTrips])

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
      {error && (
        <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
          {error}
        </div>
      )}
      {loading && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3 text-slate-700">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
          Loading live data...
        </div>
      )}

      {/* Top Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow ring-1 ring-slate-900/5 p-6 sm:p-8 mb-6">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23e2e8f0\\' fill-opacity=\\'0.45\\'%3E%3Ccircle cx=\\'7\\' cy=\\'7\\' r=\\'1\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
          <div className="hidden md:block absolute -top-16 -left-16 w-56 h-56 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="hidden sm:block absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="hidden lg:block absolute top-1/3 right-1/3 w-60 h-60 rounded-full bg-indigo-400/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="lg:mb-5 text-2xl sm:text-3xl lg:text-5xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 lg:text-xl ">Live view of trips, buses and drivers</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:shadow-lg transition-all">
              <span className="text-sm">New Trip</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">
              <span className="text-sm">Manage Buses</span>
            </button>
            {lastRefresh && (
              <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                Updated {Math.max(1, Math.floor((new Date() - lastRefresh)/1000))}s ago
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-slate-500 text-sm lg:text-xl font-semibold mr-2">Filters:</span>
        <button className="lg:text-xl inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold">
          All Cities <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700">{orgStats.totalCities}</span>
        </button>
        <button className="lg:text-xl inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold">
          Active Buses <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/70 text-green-700">{orgStats.activeBuses}</span>
        </button>
        <button className="lg:text-xl inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold">
          Inactive Buses <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-700">{orgStats.inactiveBuses}</span>
        </button>
        {orgStats.avgEtaMins !== null && (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold">
            Avg ETA {orgStats.avgEtaMins}m
          </span>
        )}
      </div>

      {/* Organization Metrics */}
      <section className="grid [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] gap-6 mb-8">
        {[
          { label: 'Total Buses', value: String(orgStats.totalBuses), sub: `${orgStats.unassignedBuses} unassigned`, accent: 'from-slate-50 to-white', iconBg: 'bg-orange-600', iconText: 'text-white', iconBorder: 'border-orange-200', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13h18M5 6h14a2 2 0 012 2v9H3V8a2 2 0 012-2z"/></svg>
          ) },
          { label: 'Active Buses', value: String(orgStats.activeBuses), sub: `${orgStats.tripsWithLive} with live GPS`, accent: 'from-green-50 to-emerald-50', iconBg: 'bg-green-600', iconText: 'text-white', iconBorder: 'border-emerald-200', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12l5 5L20 7"/></svg>
          ) },
          { label: 'Inactive Buses', value: String(orgStats.inactiveBuses), sub: 'Needs attention', accent: 'from-rose-50 to-red-50', iconBg: 'bg-rose-600', iconText: 'text-white', iconBorder: 'border-rose-200', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          ) },
          { label: 'Assigned Drivers', value: String(orgStats.assignedDrivers), sub: `${orgStats.totalBuses - orgStats.unassignedBuses} buses`, accent: 'from-blue-50 to-indigo-50', iconBg: 'bg-blue-600', iconText: 'text-white', iconBorder: 'border-blue-200', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H2v-2a4 4 0 014-4h6m-3-4a4 4 0 100-8 4 4 0 000 8z"/></svg>
          ) },
          { label: 'Active Drivers', value: String(orgStats.activeDrivers), sub: 'Currently on trips', accent: 'from-teal-50 to-cyan-50', iconBg: 'bg-teal-600', iconText: 'text-white', iconBorder: 'border-teal-200', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12.083 12.083 0 016 8.882"/></svg>
          ) },
          { label: 'Cities', value: String(orgStats.totalCities), sub: 'Operating regions', accent: 'from-violet-50 to-indigo-50', iconBg: 'bg-violet-600', iconText: 'text-white', iconBorder: 'border-violet-200', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v20m10-10H2"/></svg>
          ) },
        ].map((k) => (
          <div key={k.label} className={`group rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 ring-1 ring-slate-900/5 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 min-h-[120px]`}>
            <div className={`absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${k.accent} blur-3xl`} />
            <div className="relative flex items-center gap-4">
              <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${k.iconBg} ${k.iconText} border ${k.iconBorder}`}>{k.icon}</span>
              <div>
                <div className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">{k.value}</div>
                <div className="text-sm lg:text-xl text-slate-600">{k.label}</div>
                {k.sub && <div className="text-xs lg:text-xl text-slate-500 mt-0.5">{k.sub}</div>}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* KPI Cards */}
      <section className="grid [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] gap-6 mb-8">
        {[
          { label: 'Active Trips', value: String(kpis.totalActive), sub: `${kpis.totalActive > 0 ? 'live now' : 'no active'}`, accent: 'from-blue-50 to-indigo-50', iconBg: 'bg-indigo-50', iconText: 'text-indigo-700', iconBorder: 'border-indigo-200', pill: 'bg-indigo-600', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2 4 4 8-8 4 4"/></svg>
          ) },
          { label: 'Buses Online', value: String(kpis.onlineBuses), sub: 'broadcasting location', accent: 'from-teal-50 to-emerald-50', iconBg: 'bg-emerald-50', iconText: 'text-emerald-700', iconBorder: 'border-emerald-200', pill: 'bg-emerald-600', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12a10 10 0 0020 0M5 12a7 7 0 0014 0M8 12a4 4 0 008 0"/></svg>
          ) },
          { label: 'Avg ETA Refresh', value: kpis.avgEtaRefresh, sub: 'traffic-aware', accent: 'from-sky-50 to-cyan-50', iconBg: 'bg-sky-50', iconText: 'text-sky-700', iconBorder: 'border-sky-200', pill: 'bg-sky-600', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3M12 22a10 10 0 110-20 10 10 0 010 20z"/></svg>
          ) },
          { label: 'Incidents', value: String(kpis.incidents), sub: 'last 24h', accent: 'from-amber-50 to-orange-50', iconBg: 'bg-amber-50', iconText: 'text-amber-700', iconBorder: 'border-amber-200', pill: 'bg-orange-500', icon: (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
          ) }
        ].map((k) => (
          <div key={k.label} className={`group rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 ring-1 ring-slate-900/5 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden hover:-translate-y-0.5 min-h-[140px]`}>
            <div className={`absolute -top-14 -right-14 w-48 h-48 rounded-full bg-gradient-to-br ${k.accent} blur-3xl`} />
            <div className="relative flex items-center gap-4">
              <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${k.iconBg} ${k.iconText} border ${k.iconBorder}`}>{k.icon}</span>
              <div>
                <div className="text-4xl font-extrabold text-slate-900 leading-tight">{k.value}</div>
                <div className="text-sm text-slate-600">{k.label}</div>
                {k.sub && <div className="text-xs text-slate-500 mt-0.5">{k.sub}</div>}
                <span className={`mt-3 inline-flex px-2 py-0.5 rounded-full text-white text-[11px] font-semibold ${k.pill}`}>Live</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Metrics / Chart placeholder */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow ring-1 ring-slate-900/5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">Live Metrics</h2>
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100">1s updates</span>
          </div>
          <div className="h-64 sm:h-72 lg:h-80 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 relative overflow-hidden">
            {/* grid pattern */}
            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(to right, rgba(226,232,240,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(226,232,240,0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            {/* simple bars */}
            <div className="relative z-10 h-full flex items-end gap-3 px-4">
              {[40, 70, 55, 85, 62, 90, 50, 76, 68, 92].map((h, i) => (
                <div key={i} className="flex-1 max-w-[24px] bg-blue-100 rounded-t-xl overflow-hidden">
                  <div className="w-full bg-blue-600" style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow ring-1 ring-slate-900/5">
          <h2 className="font-bold text-slate-900 mb-4">System Health</h2>
          <div className="space-y-3">
            {[
              { label: 'API Latency', value: '128 ms', tone: 'text-blue-700 bg-blue-50 border-blue-100' },
              { label: 'Socket Status', value: 'Connected', tone: 'text-teal-700 bg-teal-50 border-teal-100' },
              { label: 'Maps API', value: 'OK', tone: 'text-indigo-700 bg-indigo-50 border-indigo-100' },
              { label: 'DB Status', value: 'Healthy', tone: 'text-green-700 bg-green-50 border-green-100' }
            ].map((s) => (
              <div key={s.label} className={`flex items-center justify-between rounded-xl border px-3 py-2 ${s.tone}`}>
                <span className="text-sm font-semibold">{s.label}</span>
                <span className="text-sm font-bold">{s.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
            <div className="text-slate-900 font-extrabold text-sm">Tip</div>
            <div className="text-slate-600 text-xs">ETAs refresh every second during live tracking.</div>
          </div>
        </div>
      </section>

      {/* Recent Trips */}
      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow ring-1 ring-slate-900/5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-900">Recent Trips</h2>
          <button className="text-sm font-semibold text-blue-700 hover:text-blue-800">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2 pr-4">Bus</th>
                <th className="py-2 pr-4">Route</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {recentTrips.map((r, i) => (
                <tr key={i} className="text-slate-800 hover:bg-slate-50/70">
                  <td className="py-3 pr-4 font-semibold">{r.bus}</td>
                  <td className="py-3 pr-4">{r.route}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${r.status === 'Ongoing' ? 'bg-green-50 text-green-700 border border-green-100' : r.status === 'Completed' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>{r.status}</span>
                  </td>
                  <td className="py-3 pr-4 font-semibold">{r.eta}</td>
                </tr>
              ))}
              {(!recentTrips || recentTrips.length === 0) && (
                <tr>
                  <td className="py-6 text-slate-500" colSpan={4}>No active trips yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-6 grid [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))] gap-6">
        {[
          { label: 'Add New Driver', accent: 'from-blue-600 to-indigo-600', text: 'text-white' },
          { label: 'Create Route', accent: 'from-sky-500 to-teal-600', text: 'text-white' },
          { label: 'Broadcast Notice', accent: 'from-orange-500 to-amber-600', text: 'text-white' },
        ].map((a) => (
          <button key={a.label} className={`group rounded-2xl px-5 py-5 font-semibold shadow-md hover:shadow-xl transition-all bg-gradient-to-r ${a.accent} ${a.text} text-left flex items-center gap-3`}>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8m-4-4h8"/></svg>
            </span>
            {a.label}
          </button>
        ))}
      </section>
    </div>
  )
}

export default Dashboard
