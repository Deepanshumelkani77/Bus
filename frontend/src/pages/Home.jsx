import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock, Navigation, Bus, Zap, ShieldCheck, Sparkles } from 'lucide-react'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header (do not modify) */}
      <Header />

      {/* Highlight Badges */}
      <section className="relative mt-10 sm:mt-10 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center justify-center gap-2 rounded-xl bg-green-600 text-white py-3 lg:py-5 shadow-lg">
              <Zap className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-semibold text-sm lg:text-base">Live Tracking</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-white py-3 lg:py-5 shadow-lg">
              <Clock className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-semibold text-sm lg:text-base">Accurate ETAs</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 text-white py-3 lg:py-5 shadow-lg">
              <Navigation className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-semibold text-sm lg:text-base">Smart Routes</span>
            </div>
            <div className="flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white py-3 lg:py-5 shadow-lg">
              <ShieldCheck className="h-4 w-4 lg:h-5 lg:w-5" />
              <span className="font-semibold text-sm lg:text-base">Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0b1b34] rounded-3xl p-6 sm:p-8 shadow-xl text-white">
            <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-teal-300" />
                  Plan your trip in seconds
                </h2>
                <p className="mt-2 text-white/80 max-w-2xl">
                  Find buses on your route, see live locations, and get traffic-aware arrival times.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  to="/smart-search"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#0b1b34] hover:bg-gray-100 font-bold px-5 py-3 rounded-2xl shadow-lg transition"
                >
                  <MapPin className="h-4 w-4" /> Smart Trip Search
                </Link>
                <Link
                  to="/live-trips"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg transition"
                >
                  <Bus className="h-4 w-4" /> Live Trips
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-6 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-2xl transition">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Precise Pickup</h3>
              <p className="text-slate-600">Get pickup points near you with walking guidance and live bus approach status.</p>
            </div>
            <div className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-2xl transition">
              <div className="w-12 h-12 rounded-xl bg-green-600/10 text-green-600 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Traffic‑aware ETAs</h3>
              <p className="text-slate-600">Stay informed with dynamically updated arrival times powered by real data.</p>
            </div>
            <div className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-2xl transition">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center mb-4">
                <Navigation className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Smart Matching</h3>
              <p className="text-slate-600">We match your route with active trips to get you the best possible ride options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow">
              <div className="text-3xl font-extrabold text-slate-900">200+</div>
              <div className="text-slate-500 font-medium mt-1">Live Buses</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow">
              <div className="text-3xl font-extrabold text-slate-900">120+</div>
              <div className="text-slate-500 font-medium mt-1">Active Routes</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow">
              <div className="text-3xl font-extrabold text-slate-900">30</div>
              <div className="text-slate-500 font-medium mt-1">Cities</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow">
              <div className="text-3xl font-extrabold text-slate-900">4.8★</div>
              <div className="text-slate-500 font-medium mt-1">User Rating</div>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  )
}

export default Home
