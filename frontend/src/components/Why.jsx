import React from 'react'
import { Clock, Shield, MapPin, Bus, Smartphone, Bell, Activity, Map } from 'lucide-react'

const Why = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Why choose BusTrac?</h2>
          <p className="mt-3 text-slate-600">Plan smarter journeys with live routes, traffic‑aware ETAs, and a clean, modern experience across devices.</p>
        </div>

        {/* Cards - larger, colorful, with effects */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Traffic-aware ETAs */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 min-h-[220px] shadow-md ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-sky-400/20 via-amber-400/20 to-teal-400/20 blur-2xl" />
            <span className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow">
              <Clock className="w-6 h-6" />
            </span>
            <h3 className="mt-5 font-bold text-xl text-slate-900">Traffic‑aware ETAs</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">Arrivals update in real time so you can reach the stop right on time.</p>
          </div>

          {/* Live tracking */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 min-h-[220px] shadow-md ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-amber-400/25 via-orange-400/20 to-sky-400/20 blur-2xl" />
            <span className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow">
              <MapPin className="w-6 h-6" />
            </span>
            <h3 className="mt-5 font-bold text-xl text-slate-900">Live bus tracking</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">Follow buses on the map, view route polylines and pickup proximity.</p>
          </div>

          {/* Secure & reliable */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 min-h-[220px] shadow-md ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-400/20 via-teal-400/20 to-sky-400/20 blur-2xl" />
            <span className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow">
              <Shield className="w-6 h-6" />
            </span>
            <h3 className="mt-5 font-bold text-xl text-slate-900">Secure & reliable</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">Protected accounts and stable real‑time connectivity powered by Socket.io.</p>
          </div>

          {/* Beautiful on any device */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 min-h-[220px] shadow-md ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/20 via-teal-400/20 to-indigo-400/20 blur-2xl" />
            <span className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-600 text-white shadow">
              <Smartphone className="w-6 h-6" />
            </span>
            <h3 className="mt-5 font-bold text-xl text-slate-900">Beautiful on any device</h3>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">Thoughtful, responsive UI that looks great on phones, tablets and laptops.</p>
          </div>
        </div>

        {/* Stats / CTA strip */}
        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md ring-1 ring-slate-900/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-extrabold text-slate-900">1s</div>
              <div className="text-xs text-slate-600">Live updates</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">100+</div>
              <div className="text-xs text-slate-600">Routes</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">1.5km</div>
              <div className="text-xs text-slate-600">Smart buffer</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900">24/7</div>
              <div className="text-xs text-slate-600">Always on</div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <button className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-orange-500 text-white font-semibold shadow hover:from-sky-500 hover:to-teal-500">
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Why
