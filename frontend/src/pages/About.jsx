  import React from 'react'
  import { Bus, MapPin, Clock, Shield, Zap, Users, Sparkles, ArrowRight } from 'lucide-react'

  const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-800">
        {/* Background Pattern (same style as Login.jsx) */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e2e8f0\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'7\' cy=\'7\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
        </div>

        {/* Animated Background Elements (match Login.jsx blobs) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute w-96 h-96 rounded-full bg-teal-400/10 -top-20 -left-20 animate-pulse" />
          <div className="absolute w-80 h-80 rounded-full bg-sky-400/10 top-1/3 -right-20 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute w-64 h-64 rounded-full bg-purple-400/10 bottom-20 left-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="flex items-start gap-6">
            <div className="hidden sm:inline-flex w-14 h-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15 text-white shadow">
              <Bus className="w-6 h-6" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">About BusTrac</h1>
              <p className="mt-4 text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl">
                We’re building a smarter way to commute. Real‑time tracking, traffic‑aware ETAs, and
                seamless UX—so riders and cities move better together.
              </p>
            </div>
          </div>

          {/* Hero stats */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Cities', value: '12+' },
              { label: 'Active Routes', value: '100+' },
              { label: 'Avg ETA Refresh', value: '1s' },
              { label: 'Uptime', value: '99.9%' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/90 ring-1 ring-white/10 p-4 ">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold">{s.value}</div>
                <div className="text-xs sm:text-sm lg:text-base text-black-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative max-w-8xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-slate-900">Our mission</h2>
            <p className="mt-3 text-slate-600 text-base sm:text-lg lg:text-2xl">
              Make public transport effortless by giving passengers live, trustworthy information.
              We connect real driver trips with intelligent routing and delightful design—so you can
              reach the stop right on time.
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 rounded-2xl p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
                <span className="inline-flex p-2 rounded-xl bg-blue-600 text-white"><Clock className="w-5 h-5"/></span>
                <div className=" ">
                  <div className="font-bold text-slate-900 lg:text-2xl lg:mb-5">Traffic‑aware ETAs</div>
                  <div className="text-sm lg:text-xl text-slate-600">Live times refined with traffic data</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl p-4 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200">
                <span className="inline-flex p-2 rounded-xl bg-orange-500 text-white"><Shield className="w-5 h-5"/></span>
                <div>
                  <div className="font-bold text-slate-900 lg:text-2xl lg:mb-5">Secure & reliable</div>
                  <div className="text-sm lg:text-xl text-slate-600">Role‑based auth, JWT, and robust infra</div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 relative">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-md ring-1 ring-slate-900/5 p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-1 ring-slate-900/10">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div className="text-slate-900 lg:text-2xl font-bold">What makes us different</div>
              </div>
              <ul className="mt-4 space-y-3 text-sm lg:text-xl text-slate-700">
                <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-600"/> Real driver‑created trips, not dummy data</li>
                <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-sky-600"/> Smart route matching with buffer zones</li>
                <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-indigo-600"/> Socket.io live updates every second</li>
                <li className="flex items-start gap-2"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-500"/> Polished, accessible UI across devices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Values grid */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: MapPin, title: 'Built for cities', desc: 'Precise locations, polylines, and pickup proximity.' },
            { icon: Users, title: 'Human‑centered', desc: 'Clear information and thoughtful interactions.' },
            { icon: Zap, title: 'Real‑time first', desc: 'Fast sockets, smooth animations, instant feedback.' },
            { icon: Shield, title: 'Trust & safety', desc: 'Secure auth, validation, and strong privacy.' },
          ].map((c) => (
            <div key={c.title} className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 min-h-[180px] shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-up">
              <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-gradient-to-br from-blue-400/15 via-indigo-400/15 to-orange-400/15 blur-2xl" />
              <span className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow ring-1 ring-white/20">
                {React.createElement(c.icon, { className: 'w-5 h-5' })}
              </span>
              <h3 className="mt-4 font-bold text-lg lg:text-2xl text-slate-900">{c.title}</h3>
              <p className="text-slate-600 text-sm lg:text-xl mt-1 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md ring-1 ring-slate-900/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="text-slate-900 font-extrabold text-2xl lg:text-3xl lg:mb-5">Ready to explore live buses?</div>
            <div className="text-slate-600 lg:text-lg">Find a matching trip and track it in real time.</div>
          </div>
          <a href="/smart-search" className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:shadow-lg transition-all">
            Start Searching
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Local animations */}
      <style>{`
        @keyframes fade-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fade-up .5s ease-out both; }
      `}</style>
    </div>
  )
}

export default About
