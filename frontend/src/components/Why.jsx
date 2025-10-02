import React from 'react'
import { Clock, Shield, MapPin, Bus, Smartphone, Bell, Activity, Map } from 'lucide-react'

const Why = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Why choose BusTrac?</h2>
          <p className="mt-3 text-slate-600">Plan smarter journeys with live routes, traffic‑aware ETAs, and a clean, modern experience across devices.</p>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Real-time ETA */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow transition-shadow">
            <span className="inline-flex p-2 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow">
              <Clock className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-semibold text-lg text-slate-900">Traffic‑aware ETAs</h3>
            <p className="text-slate-600 text-sm mt-2">Arrivals update in real time so you can reach the stop right on time.</p>
          </div>

          {/* Live Tracking */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow transition-shadow">
            <span className="inline-flex p-2 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow">
              <MapPin className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-semibold text-lg text-slate-900">Live bus tracking</h3>
            <p className="text-slate-600 text-sm mt-2">Follow buses on the map, view route polylines and pickup proximity.</p>
          </div>

          {/* Reliable Data */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow transition-shadow">
            <span className="inline-flex p-2 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow">
              <Shield className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-semibold text-lg text-slate-900">Secure & reliable</h3>
            <p className="text-slate-600 text-sm mt-2">Protected accounts and stable real‑time connectivity powered by Socket.io.</p>
          </div>

          {/* Built for you */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow transition-shadow">
            <span className="inline-flex p-2 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow">
              <Smartphone className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-semibold text-lg text-slate-900">Beautiful on any device</h3>
            <p className="text-slate-600 text-sm mt-2">Thoughtful, responsive UI that looks great on phones, tablets and laptops.</p>
          </div>
        </div>

        {/* Secondary row */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow transition-shadow">
            <span className="inline-flex p-2 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow">
              <Bus className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-semibold text-lg text-slate-900">Real driver trips</h3>
            <p className="text-slate-600 text-sm mt-2">Trips come from drivers, not dummy data—see only real, active routes.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow transition-shadow">
            <span className="inline-flex p-2 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow">
              <Activity className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-semibold text-lg text-slate-900">Smart matching</h3>
            <p className="text-slate-600 text-sm mt-2">We match your C→D trip with driver routes A→B using route proximity.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow transition-shadow">
            <span className="inline-flex p-2 rounded-xl bg-gradient-to-br from-sky-600 to-teal-600 text-white shadow">
              <Map className="w-5 h-5" />
            </span>
            <h3 className="mt-4 font-semibold text-lg text-slate-900">Google Maps inside</h3>
            <p className="text-slate-600 text-sm mt-2">Seamless integration with Places, Directions and polylines for clarity.</p>
          </div>
        </div>

        {/* Stats / CTA strip */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-extrabold text-slate-900">1s</div>
              <div className="text-xs text-slate-600">Live updates</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">100+</div>
              <div className="text-xs text-slate-600">Routes</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">1.5km</div>
              <div className="text-xs text-slate-600">Smart buffer</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">24/7</div>
              <div className="text-xs text-slate-600">Always on</div>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white font-semibold shadow hover:from-sky-500 hover:to-teal-500">
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Why
