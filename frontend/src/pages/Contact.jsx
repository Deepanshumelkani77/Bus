import React from 'react'
import { Mail, Phone, MapPin, Send, ArrowRight, Clock, Shield, MessageSquare } from 'lucide-react'

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Hero (same pattern/blobs as About/Login) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-800">
        {/* Dotted pattern */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e2e8f0\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'7\' cy=\'7\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            }}
          />
        </div>
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute w-96 h-96 rounded-full bg-teal-400/10 -top-20 -left-20 animate-pulse" />
          <div className="absolute w-80 h-80 rounded-full bg-sky-400/10 top-1/3 -right-20 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute w-64 h-64 rounded-full bg-purple-400/10 bottom-20 left-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
          <div className="text-white">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight">Contact Us</h1>
            <p className="mt-4 text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl">
              We’re here to help with partnerships, support, and anything in between. Reach out and we’ll
              get back quickly.
            </p>
          </div>
        </div>
      </section>

      {/* Contact methods */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Mail, title: 'Email', value: 'support@bustrac.app', sub: 'General inquiries', href: 'mailto:support@bustrac.app' },
            { icon: Phone, title: 'Phone', value: '+1 (555) 123‑4567', sub: 'Mon–Fri, 9am–6pm', href: 'tel:+15551234567' },
            { icon: MapPin, title: 'Office', value: 'Silicon Valley, CA', sub: 'Visit by appointment', href: 'https://maps.google.com' },
          ].map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-up"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/15 via-indigo-400/15 to-orange-400/15 blur-2xl" />
              <span className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow ring-1 ring-white/20">
                {React.createElement(c.icon, { className: 'w-5 h-5' })}
              </span>
              <div className="mt-4 font-bold text-lg lg:text-2xl text-slate-900">{c.title}</div>
              <div className="text-slate-700 lg:text-lg">{c.value}</div>
              <div className="text-slate-500 text-sm lg:text-base">{c.sub}</div>
            </a>
          ))}
        </div>
      </section>

      {/* Contact form + info block */}
      <section className="max-w-8xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 ring-1 ring-slate-900/5">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">Send us a message</h2>
                <p className="text-slate-600 lg:text-lg">We usually reply within a few hours.</p>
              </div>

              <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                  <input className="w-full bg-white/70 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-600 focus:bg-white transition-all" placeholder="Jane Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Email</label>
                  <input type="email" className="w-full bg-white/70 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-600 focus:bg-white transition-all" placeholder="you@example.com" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Subject</label>
                  <input className="w-full bg-white/70 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-600 focus:bg-white transition-all" placeholder="How can we help?" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700">Message</label>
                  <textarea rows="5" className="w-full bg-white/70 border-2 border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-600 focus:bg-white transition-all" placeholder="Write your message..." />
                </div>
                <div className="sm:col-span-2">
                  <button type="button" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow hover:shadow-lg transition-all">
                    Send Message
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-md ring-1 ring-slate-900/5 p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white ring-1 ring-slate-900/10">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div className="text-slate-900 font-bold">Support response times</div>
              </div>
              <ul className="mt-4 space-y-2 text-sm lg:text-base text-slate-700">
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500"/> Mon–Fri: under 4 hours</li>
                <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500"/> Weekends: under 24 hours</li>
                <li className="flex items-center gap-2"><Shield className="w-4 h-4 text-slate-500"/> Priority SLA for partners</li>
              </ul>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 p-5">
                <div className="text-slate-900 font-extrabold">Prefer self‑service?</div>
                <div className="text-slate-600">Check our FAQs for common questions.</div>
                <a href="#faq" className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition-colors">
                  View FAQs
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-8xl mx-auto px-4 sm:px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6">Frequently asked questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: 'How do you calculate ETAs?', a: 'We use Google traffic models combined with live bus positions via Socket.io.' },
            { q: 'Are the trips real?', a: 'Yes. All trips are created by drivers in our DriverApp—no dummy data.' },
            { q: 'Can I track a bus live?', a: 'Yes, use Smart Trip Search to find a matching trip and tap Track.' },
            { q: 'Do you offer enterprise support?', a: 'We provide SLAs and dedicated channels for partners.' },
          ].map((f, i) => (
            <details key={i} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
              <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-slate-900">
                <span>{f.q}</span>
                <span className="text-slate-400 group-open:rotate-90 transition-transform">›</span>
              </summary>
              <p className="mt-3 text-slate-600">{f.a}</p>
            </details>
          ))}
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

export default Contact
