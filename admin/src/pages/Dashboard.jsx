import React from 'react'

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
      {/* Top Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow ring-1 ring-slate-900/5 p-6 sm:p-8 mb-6">
        {/* ambient bg */}
        <div className="pointer-events-none absolute inset-0">
          {/* dotted pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23e2e8f0\\' fill-opacity=\\'0.45\\'%3E%3Ccircle cx=\\'7\\' cy=\\'7\\' r=\\'1\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
          {/* blobs */}
          <div className="hidden md:block absolute -top-16 -left-16 w-56 h-56 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="hidden sm:block absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-sky-400/15 blur-3xl" />
          <div className="hidden lg:block absolute top-1/3 right-1/3 w-60 h-60 rounded-full bg-indigo-400/10 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Dashboard</h1>
            <p className="text-slate-600">Overview of trips, buses and drivers</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:shadow-lg transition-all">
              <span className="text-sm">New Trip</span>
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">
              <span className="text-sm">Manage Buses</span>
            </button>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Active Trips', value: '24', accent: 'from-blue-50 to-indigo-50', pill: 'bg-blue-600' },
          { label: 'Buses Online', value: '18', accent: 'from-teal-50 to-cyan-50', pill: 'bg-teal-600' },
          { label: 'Avg ETA Refresh', value: '1s', accent: 'from-sky-50 to-blue-50', pill: 'bg-sky-600' },
          { label: 'Incidents', value: '0', accent: 'from-amber-50 to-orange-50', pill: 'bg-orange-500' }
        ].map((k) => (
          <div key={k.label} className={`rounded-2xl border border-slate-200 bg-white p-4 ring-1 ring-slate-900/5 shadow relative overflow-hidden`}>
            <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${k.accent} blur-2xl`} />
            <div className="relative">
              <div className="text-2xl font-extrabold text-slate-900">{k.value}</div>
              <div className="text-sm text-slate-600">{k.label}</div>
              <span className={`mt-3 inline-flex px-2 py-0.5 rounded-full text-white text-[11px] font-semibold ${k.pill}`}>Live</span>
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
          <div className="h-56 sm:h-64 lg:h-72 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 relative overflow-hidden">
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
              {[
                { bus: 'DL 12 AB 3456', route: 'Connaught Pl → Airport', status: 'Ongoing', eta: '7 min' },
                { bus: 'MH 01 CD 9876', route: 'Bandra → Andheri', status: 'Ongoing', eta: '12 min' },
                { bus: 'KA 05 EF 1122', route: 'MG Rd → Whitefield', status: 'Completed', eta: '-' },
                { bus: 'TN 09 GH 7788', route: 'T Nagar → OMR', status: 'Pending', eta: '-' }
              ].map((r, i) => (
                <tr key={i} className="text-slate-800">
                  <td className="py-3 pr-4 font-semibold">{r.bus}</td>
                  <td className="py-3 pr-4">{r.route}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-full text-[11px] font-bold ${r.status === 'Ongoing' ? 'bg-green-50 text-green-700 border border-green-100' : r.status === 'Completed' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>{r.status}</span>
                  </td>
                  <td className="py-3 pr-4 font-semibold">{r.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Add New Driver', accent: 'from-blue-600 to-indigo-600', text: 'text-white' },
          { label: 'Create Route', accent: 'from-sky-500 to-teal-600', text: 'text-white' },
          { label: 'Broadcast Notice', accent: 'from-orange-500 to-amber-600', text: 'text-white' },
        ].map((a) => (
          <button key={a.label} className={`rounded-2xl px-5 py-4 font-semibold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r ${a.accent} ${a.text}`}>
            {a.label}
          </button>
        ))}
      </section>
    </div>
  )
}

export default Dashboard
